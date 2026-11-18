import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

export const DEFAULT_CHROME_PATH =
  process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class CdpClient {
  constructor({ proc, ws, profileDir }) {
    this.proc = proc;
    this.ws = ws;
    this.profileDir = profileDir;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.errors = [];
    this.allowed404Urls = new Set();
    this.closed = false;

    this.ws.addEventListener('message', (event) => {
      let msg;
      try {
        msg = JSON.parse(String(event.data));
      } catch {
        return;
      }

      if (typeof msg.id === 'number') {
        const entry = this.pending.get(msg.id);
        if (entry) {
          this.pending.delete(msg.id);
          clearTimeout(entry.timer);
          if (msg.error) {
            entry.reject(new Error(`CDP ${entry.method} failed: ${msg.error.message || JSON.stringify(msg.error)}`));
          } else {
            entry.resolve(msg.result || {});
          }
        }
        return;
      }

      if (msg.method) {
        const set = this.listeners.get(msg.method);
        if (set) {
          for (const fn of set) {
            try {
              fn(msg.params || {});
            } catch {
              // listener errors should not crash socket loop
            }
          }
        }
      }
    });

    this.ws.addEventListener('close', () => {
      for (const [id, entry] of this.pending.entries()) {
        clearTimeout(entry.timer);
        entry.reject(new Error(`CDP WebSocket closed before ${entry.method} completed`));
        this.pending.delete(id);
      }
    });
  }

  on(method, fn) {
    if (!this.listeners.has(method)) {
      this.listeners.set(method, new Set());
    }
    this.listeners.get(method).add(fn);
    return () => this.listeners.get(method)?.delete(fn);
  }

  send(method, params = {}, timeoutMs = 15000) {
    if (this.closed || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error(`Cannot send CDP ${method}: socket not open`));
    }
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP ${method} timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, method, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async init() {
    await this.send('Page.enable');
    await this.send('DOM.enable');
    await this.send('Runtime.enable');
    await this.send('Log.enable');
    await this.send('Network.enable');
    await this.send('Network.setBypassServiceWorker', { bypass: true });

    this.on('Runtime.consoleAPICalled', (params) => {
      if (params.type === 'error') {
        const text = (params.args || [])
          .map((a) => a.value ?? a.description ?? a.type ?? '')
          .join(' ')
          .trim();
        this.errors.push({ source: 'console.error', text });
      }
    });

    this.on('Runtime.exceptionThrown', (params) => {
      const details = params.exceptionDetails || {};
      const msg =
        details.exception?.description ||
        details.text ||
        'Uncaught runtime exception';
      this.errors.push({ source: 'runtime.exception', text: msg });
    });

    this.on('Log.entryAdded', (params) => {
      const entry = params.entry || {};
      if (entry.level === 'error') {
        const isAllowed404 =
          entry.source === 'network' &&
          entry.url &&
          this.allowed404Urls.has(entry.url) &&
          String(entry.text || '').includes('404');
        if (!isAllowed404) {
          this.errors.push({
            source: `log.${entry.source || 'unknown'}`,
            url: entry.url || null,
            text: entry.text || 'Log error',
          });
        }
      }
    });
  }

  clearErrors() {
    this.errors = [];
  }

  getErrors() {
    return [...this.errors];
  }

  allow404Url(url) {
    this.allowed404Urls.add(url);
  }

  async setViewport({ width, height, mobile = false }) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: mobile ? 2 : 1,
      mobile,
    });
  }

  async evalJson(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      const msg =
        res.exceptionDetails.exception?.description ||
        res.exceptionDetails.text ||
        'Evaluation failed';
      throw new Error(`Runtime.evaluate error: ${msg}`);
    }
    return res.result?.value;
  }

  async waitForHydration(settleMs = 60, timeoutMs = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const ready = await this.evalJson(`(() => {
        const root = document.getElementById('root');
        if (!root || !root.firstElementChild) return false;
        const hasReact = Object.keys(root).some((k) => k.startsWith('__reactContainer$') || k.startsWith('__reactFiber$'));
        return hasReact && document.readyState !== 'loading';
      })()`).catch(() => false);
      if (ready) break;
      await sleep(30);
    }

    await this.evalJson(`new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve(true)));
    })`);
    if (settleMs > 0) {
      await sleep(settleMs);
    }
  }

  async navigate(url, { allow404 = false, settleMs = 60, timeoutMs = 10000 } = {}) {
    if (allow404) {
      this.allow404Url(url);
    }

    let documentStatus = null;
    let docLoaded = false;

    const offResp = this.on('Network.responseReceived', (params) => {
      if (params.type === 'Document' && documentStatus === null) {
        documentStatus = params.response?.status ?? null;
      }
    });

    const domPromise = new Promise((resolve) => {
      const timer = setTimeout(() => resolve(false), timeoutMs);
      const offDom = this.on('Page.domContentEventFired', () => {
        clearTimeout(timer);
        offDom();
        docLoaded = true;
        resolve(true);
      });
    });

    try {
      await this.send('Page.navigate', { url });
      await domPromise;
      if (!docLoaded) {
        await this.evalJson(`document.readyState !== 'loading'`).catch(() => false);
      }
      await this.waitForHydration(settleMs, timeoutMs);
    } finally {
      offResp();
    }

    return { statusCode: documentStatus };
  }

  async waitForCondition(predicateExpr, { timeoutMs = 4000, intervalMs = 40 } = {}) {
    const start = Date.now();
    let lastVal = null;
    while (Date.now() - start < timeoutMs) {
      lastVal = await this.evalJson(predicateExpr);
      if (lastVal) return lastVal;
      await sleep(intervalMs);
    }
    throw new Error(`Timed out after ${timeoutMs}ms waiting for condition: ${predicateExpr} (last=${JSON.stringify(lastVal)})`);
  }

  async scrollToInstant(y) {
    await this.evalJson(`(() => {
      window.scrollTo({ top: ${Number(y)}, left: 0, behavior: 'instant' });
      return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve(window.scrollY))));
    })()`);
  }

  async domClick(selector) {
    const clicked = await this.evalJson(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      el.click();
      return true;
    })()`);
    if (!clicked) {
      throw new Error(`Selector not found for domClick: ${selector}`);
    }
  }

  async clickByText(selector, textMatch, rootSelector = 'document') {
    const clicked = await this.evalJson(`(() => {
      const root = ${rootSelector === 'document' ? 'document' : `document.querySelector(${JSON.stringify(rootSelector)})`};
      if (!root) return false;
      const needle = ${JSON.stringify(textMatch)};
      const els = Array.from(root.querySelectorAll(${JSON.stringify(selector)}));
      const target = els.find((el) => (el.textContent || '').includes(needle));
      if (!target) return false;
      target.click();
      return true;
    })()`);
    if (!clicked) {
      throw new Error(`Element not found for clickByText(${selector}, "${textMatch}", root=${rootSelector})`);
    }
  }

  async setInputValue(selector, value) {
    const ok = await this.evalJson(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (setter) {
        setter.call(el, ${JSON.stringify(String(value))});
      } else {
        el.value = ${JSON.stringify(String(value))};
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`);
    if (!ok) {
      throw new Error(`Input not found for setInputValue: ${selector}`);
    }
  }

  async pressEscape() {
    // Dispatch Escape KeyboardEvent in DOM rather than raw CDP Input.dispatchKeyEvent
    // because Chrome 157 headless stalls subsequent Page.navigate calls after raw Escape key events.
    await this.evalJson(`(() => {
      const ev = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true });
      document.dispatchEvent(ev);
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true }));
      return true;
    })()`);
  }

  async close() {
    if (this.closed) return;
    this.closed = true;

    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
    } catch {}

    await terminateChromeProcessAndProfile(this.proc, this.profileDir);
  }
}

async function terminateChromeProcessAndProfile(proc, profileDir) {
  if (proc && proc.exitCode === null) {
    try {
      proc.kill('SIGTERM');
    } catch {}
    const start = Date.now();
    while (proc.exitCode === null && Date.now() - start < 2500) {
      await sleep(50);
    }
    if (proc.exitCode === null) {
      try {
        proc.kill('SIGKILL');
      } catch {}
    }
  }

  if (profileDir) {
    try {
      fs.rmSync(profileDir, { recursive: true, force: true });
    } catch {}
  }
}

export async function launchChrome({ chromePath = DEFAULT_CHROME_PATH, timeoutMs = 15000, onSpawn = null } = {}) {
  if (!fs.existsSync(chromePath)) {
    throw new Error(`Chrome binary not found at ${chromePath}. Set CHROME_PATH env var if installed elsewhere.`);
  }

  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sfcc-e2e-cdp-'));
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-background-timer-throttling',
    '--remote-debugging-port=0',
    `--user-data-dir=${profileDir}`,
    'about:blank',
  ];

  let stderrTail = '';
  const proc = spawn(chromePath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  proc.stderr?.on('data', (chunk) => {
    stderrTail = (stderrTail + String(chunk)).slice(-2000);
  });

  let aborted = false;
  let cleanupPromise = null;
  const closeSpawned = () => {
    aborted = true;
    if (!cleanupPromise) {
      cleanupPromise = terminateChromeProcessAndProfile(proc, profileDir);
    }
    return cleanupPromise;
  };
  if (typeof onSpawn === 'function') {
    onSpawn({ proc, profileDir, close: closeSpawned });
  }

  try {
    const activePortPath = path.join(profileDir, 'DevToolsActivePort');
    const deadline = Date.now() + timeoutMs;
    let port = 0;

    while (Date.now() < deadline) {
      if (aborted) {
        throw new Error('Chrome launch aborted during startup');
      }
      if (proc.exitCode !== null) {
        throw new Error(`Chrome exited prematurely with code ${proc.exitCode}. stderr: ${stderrTail}`);
      }
      if (fs.existsSync(activePortPath)) {
        const lines = fs.readFileSync(activePortPath, 'utf8').trim().split(/\r?\n/);
        const parsed = Number.parseInt(lines[0], 10);
        if (Number.isFinite(parsed) && parsed > 0) {
          try {
            const ver = await fetch(`http://127.0.0.1:${parsed}/json/version`);
            if (ver.ok) {
              port = parsed;
              break;
            }
          } catch {
            // keep polling
          }
        }
      }
      await sleep(100);
    }

    if (aborted) {
      throw new Error('Chrome launch aborted during startup');
    }
    if (!port) {
      throw new Error(`Timed out after ${timeoutMs}ms waiting for Chrome DevToolsActivePort. stderr: ${stderrTail}`);
    }

    const targetRes = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
    if (!targetRes.ok) {
      throw new Error(`Failed to open Chrome CDP tab: HTTP ${targetRes.status}`);
    }
    const target = await targetRes.json();
    if (!target.webSocketDebuggerUrl) {
      throw new Error(`No webSocketDebuggerUrl returned by Chrome CDP`);
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timed out opening CDP WebSocket')), 5000);
      ws.addEventListener('open', () => {
        clearTimeout(timer);
        resolve();
      }, { once: true });
      ws.addEventListener('error', (err) => {
        clearTimeout(timer);
        reject(new Error(`CDP WebSocket error: ${err?.message || 'connection failed'}`));
      }, { once: true });
    });

    if (aborted) {
      try {
        ws.close();
      } catch {}
      throw new Error('Chrome launch aborted during startup');
    }

    const client = new CdpClient({ proc, ws, profileDir });
    await client.init();
    return client;
  } catch (err) {
    await closeSpawned();
    throw err;
  }
}
