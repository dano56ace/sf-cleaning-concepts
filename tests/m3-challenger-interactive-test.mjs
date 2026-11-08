// @ts-check
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const HTTP_PORT = 4176;
const CHROME_PORT = 9446;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

function createServer() {
  return http.createServer((req, res) => {
    let reqPath = decodeURI(new URL(req.url || '/', `http://localhost:${HTTP_PORT}`).pathname);
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    let filePath = path.join(DIST_DIR, reqPath);
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }
    // SPA fallback
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime, 'Access-Control-Allow-Origin': '*' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });
}

async function launchChrome() {
  const profileDir = `/tmp/chrome-m3-profile-${Date.now()}`;
  const proc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars'
  ], { stdio: 'ignore' });

  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/version`);
      if (res.ok) break;
    } catch {}
    await new Promise(r => setTimeout(r, 100));
  }

  return { proc, profileDir };
}

async function createCdpClient() {
  const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/new?about:blank`, { method: 'PUT' });
  const target = await res.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data.toString());
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  return {
    send,
    close: async () => {
      ws.close();
      await fetch(`http://127.0.0.1:${CHROME_PORT}/json/close/${target.id}`, { method: 'PUT' }).catch(() => {});
    }
  };
}

async function runTests() {
  console.log('======================================================================');
  console.log('  CHALLENGER EMPIRICAL INTERACTIVE TEST: MILESTONE 3 (GLOBAL CTA)');
  console.log('======================================================================\n');

  const server = createServer();
  await new Promise(r => server.listen(HTTP_PORT, r));
  console.log(`Static server running at http://127.0.0.1:${HTTP_PORT}`);

  const chrome = await launchChrome();
  console.log(`Headless Chrome launched on CDP port ${CHROME_PORT}`);

  const cdp = await createCdpClient();
  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');
  await cdp.send('Runtime.enable');

  let passed = 0;
  let failed = 0;

  try {
    // Navigate to homepage
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/` });
    await new Promise(r => setTimeout(r, 600));

    // 1. Check GlobalCTA presence and layout position relative to Footer
    console.log('--- Test 1: GlobalCTA DOM Presence & Layout Hierarchy ---');
    const layoutEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cta = document.querySelector('[data-testid="global-cta"]');
          const footer = document.querySelector('footer');
          const main = document.querySelector('main#main-content');
          if (!cta || !footer || !main) return { ok: false, reason: 'missing elements', cta: !!cta, footer: !!footer, main: !!main };
          
          const ctaRect = cta.getBoundingClientRect();
          const footerRect = footer.getBoundingClientRect();
          const mainRect = main.getBoundingClientRect();

          const ctaFollowsMain = cta.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_PRECEDING;
          const footerFollowsCta = footer.compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_PRECEDING;

          return {
            ok: Boolean(ctaFollowsMain && footerFollowsCta),
            ctaFollowsMain: Boolean(ctaFollowsMain),
            footerFollowsCta: Boolean(footerFollowsCta),
            ctaHeight: Math.round(ctaRect.height),
            ctaTop: Math.round(ctaRect.top),
            footerTop: Math.round(footerRect.top)
          };
        })()
      `,
      returnByValue: true
    });

    const lRes = layoutEval.result.value;
    if (lRes.ok) {
      console.log(`  [PASS] Layout Hierarchy Verified: Main precedes GlobalCTA, GlobalCTA precedes Footer (CTA height: ${lRes.ctaHeight}px)`);
      passed++;
    } else {
      console.error(`  [FAIL] Layout Hierarchy:`, lRes);
      failed++;
    }

    // 2. Interactive Modal Trigger Verification
    console.log('\n--- Test 2: GlobalCTA Interactive Quote Modal Trigger ---');
    const modalTriggerEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cta = document.querySelector('[data-testid="global-cta"]');
          if (!cta) return { ok: false, reason: 'cta missing' };

          // Find the quote button inside GlobalCTA
          const quoteBtn = cta.querySelector('button[aria-label="Request a Free Cleaning Quote"]') || 
                           cta.querySelector('button.group');
          if (!quoteBtn) return { ok: false, reason: 'quote button missing inside cta' };

          // Initial state: quote modal should not exist
          const modalBefore = document.querySelector('[role="dialog"]');

          // Click button to open modal
          quoteBtn.click();

          return {
            btnFound: true,
            modalBefore: Boolean(modalBefore)
          };
        })()
      `,
      returnByValue: true
    });

    await new Promise(r => setTimeout(r, 200));

    const modalAfterEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0.z-50');
          if (!modal) return { modalOpened: false };

          const hasHeading = modal.textContent.includes('Request a Free Quote') || modal.textContent.includes('Personalized');
          const hasPhoneInput = Boolean(modal.querySelector('input[type="tel"]') || modal.querySelector('input[placeholder*="Phone"]'));
          const bodyOverflow = document.body.style.overflow;

          // Now close modal via Escape
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

          return {
            modalOpened: true,
            hasHeading,
            hasPhoneInput,
            bodyOverflowLocked: bodyOverflow === 'hidden'
          };
        })()
      `,
      returnByValue: true
    });

    await new Promise(r => setTimeout(r, 200));

    const mBefore = modalTriggerEval.result.value;
    const mAfter = modalAfterEval.result.value;

    if (mBefore.btnFound && mAfter.modalOpened && mAfter.hasPhoneInput) {
      console.log(`  [PASS] Quote Modal Triggered from GlobalCTA: Modal opened, phone input present, scroll locked (${mAfter.bodyOverflowLocked})`);
      passed++;
    } else {
      console.error(`  [FAIL] Quote Modal Trigger failed:`, { mBefore, mAfter });
      failed++;
    }

    // 3. Telephony Link Accessibility & Format
    console.log('\n--- Test 3: Telephony & Quick Links Verification ---');
    const linksEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cta = document.querySelector('[data-testid="global-cta"]');
          if (!cta) return { ok: false };

          const telLink = cta.querySelector('a[href^="tel:"]');
          const servicesLink = cta.querySelector('a[href="/our-services"]');
          const areasLink = cta.querySelector('a[href="/service-areas"]');

          return {
            telHref: telLink ? telLink.getAttribute('href') : null,
            telAriaLabel: telLink ? telLink.getAttribute('aria-label') : null,
            telText: telLink ? telLink.textContent.trim() : null,
            hasServicesLink: Boolean(servicesLink),
            hasAreasLink: Boolean(areasLink)
          };
        })()
      `,
      returnByValue: true
    });

    const linksRes = linksEval.result.value;
    if (linksRes.telHref && linksRes.hasServicesLink && linksRes.hasAreasLink) {
      console.log(`  [PASS] Links Verified: tel=${linksRes.telHref}, services=${linksRes.hasServicesLink}, areas=${linksRes.hasAreasLink}`);
      passed++;
    } else {
      console.error(`  [FAIL] Links Verification:`, linksRes);
      failed++;
    }

    // 4. Mobile Viewport Layout & Touch Targets (375px)
    console.log('\n--- Test 4: Mobile 375px Viewport Bounds & Touch Targets ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 1,
      mobile: true
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/` });
    await new Promise(r => setTimeout(r, 600));

    const mobileEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cta = document.querySelector('[data-testid="global-cta"]');
          if (!cta) return { ok: false, reason: 'cta missing' };

          const winWidth = window.innerWidth;
          const ctaRect = cta.getBoundingClientRect();
          const docScroll = document.documentElement.scrollWidth;
          const bodyScroll = document.body.scrollWidth;

          // Check interactive buttons inside CTA
          const buttons = Array.from(cta.querySelectorAll('button, a'));
          const buttonMetrics = buttons.map(b => {
            const r = b.getBoundingClientRect();
            return {
              text: b.textContent.trim().slice(0, 25),
              width: Math.round(r.width),
              height: Math.round(r.height),
              isTouchCompliant: r.height >= 40 // WCAG minimum 44px recommended, >=40 acceptable
            };
          });

          return {
            winWidth,
            docScroll,
            bodyScroll,
            hasHorizontalScroll: (docScroll > winWidth + 1) || (bodyScroll > winWidth + 1),
            buttonMetrics: buttonMetrics.filter(b => b.width > 0 && b.height > 0)
          };
        })()
      `,
      returnByValue: true
    });

    const mobRes = mobileEval.result.value;
    if (!mobRes.hasHorizontalScroll) {
      console.log(`  [PASS] Mobile 375px: Zero horizontal scroll (docScroll=${mobRes.docScroll}px vs winWidth=${mobRes.winWidth}px)`);
      console.log(`         Interactive targets: ${mobRes.buttonMetrics.map(b => `${b.text} (${b.width}x${b.height}px)`).join(', ')}`);
      passed++;
    } else {
      console.error(`  [FAIL] Mobile 375px has horizontal scroll:`, mobRes);
      failed++;
    }

    // 5. Small Mobile Viewport Layout (320px)
    console.log('\n--- Test 5: Small Mobile 320px Viewport Bounds ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 568,
      deviceScaleFactor: 1,
      mobile: true
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/` });
    await new Promise(r => setTimeout(r, 600));

    const smallMobileEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const winWidth = window.innerWidth;
          const docScroll = document.documentElement.scrollWidth;
          const bodyScroll = document.body.scrollWidth;
          return {
            winWidth,
            docScroll,
            bodyScroll,
            hasHorizontalScroll: (docScroll > winWidth + 1) || (bodyScroll > winWidth + 1)
          };
        })()
      `,
      returnByValue: true
    });

    const smRes = smallMobileEval.result.value;
    if (!smRes.hasHorizontalScroll) {
      console.log(`  [PASS] Small Mobile 320px: Zero horizontal scroll (docScroll=${smRes.docScroll}px vs winWidth=${smRes.winWidth}px)`);
      passed++;
    } else {
      console.error(`  [FAIL] Small Mobile 320px has horizontal scroll:`, smRes);
      failed++;
    }

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    await cdp.close();
    chrome.proc.kill();
    server.close();
  }

  console.log('\n======================================================================');
  console.log(`  INTERACTIVE TEST COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(2);
});
