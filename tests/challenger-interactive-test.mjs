// @ts-check
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PROJECT_ROOT = '/Users/danielarrieta/Downloads/Projects/South Florida Cleaning Concepts';
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const HTTP_PORT = 4175;
const CHROME_PORT = 9445;

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
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

function createServer() {
  return http.createServer((req, res) => {
    let reqPath = decodeURI(new URL(req.url, `http://localhost:${HTTP_PORT}`).pathname);
    if (reqPath.endsWith('/')) {
      reqPath += 'index.html';
    }
    let filePath = path.join(DIST_DIR, reqPath);
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime, 'Access-Control-Allow-Origin': '*' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Not Found: ${reqPath}`);
    }
  });
}

async function launchChrome() {
  const profileDir = `/tmp/chrome-challenger-profile-${Date.now()}`;
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

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    } catch (e) {
      console.error('CDP parse error:', e);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  return {
    send,
    close: async () => {
      ws.close();
      await fetch(`http://127.0.0.1:${CHROME_PORT}/json/close/${target.id}`, { method: 'PUT' }).catch(() => {});
    }
  };
}

async function runChallengerTests() {
  console.log('=== CHALLENGER EMPIRICAL INTERACTIVE & ASSET STRESS TEST ===\n');
  const server = createServer();
  await new Promise(r => server.listen(HTTP_PORT, r));
  console.log(`Test server running at http://127.0.0.1:${HTTP_PORT}`);

  const chrome = await launchChrome();
  console.log(`Headless Chrome launched on CDP port ${CHROME_PORT}\n`);

  const cdp = await createCdpClient();
  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');
  await cdp.send('Runtime.enable');

  const testReport = {
    drawerTests: [],
    accordionTests: [],
    stickyBarTests: [],
    heroAndQuoteTests: [],
    imageSizingTests: [],
    failures: []
  };

  // -------------------------------------------------------------
  // TEST SUITE 1: Mobile Drawer Open / Close & Scroll Lock Stress
  // -------------------------------------------------------------
  console.log('--- Test Suite 1: Mobile Drawer Open / Close & Scroll Lock ---');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 1,
    mobile: true
  });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/` });
  await new Promise(r => setTimeout(r, 500));

  // Scenario 1.1: Initial scroll state
  const initialScroll = await cdp.send('Runtime.evaluate', {
    expression: `(() => window.getComputedStyle(document.body).overflow)()`,
    returnByValue: true
  });
  const initialOverflow = initialScroll.result.value;
  console.log(`  Initial document.body.style.overflow: "${initialOverflow}"`);
  // Note: CSS sets overflow-x: hidden and overflow-y: auto, so computed style is "hidden auto"
  if (initialOverflow === 'hidden') {
    testReport.failures.push('Initial body scroll is prematurely locked as hidden');
  }

  // Scenario 1.2: Open via hamburger toggle -> check scroll locked
  await cdp.send('Runtime.evaluate', {
    expression: `document.querySelector('.mobile-nav-toggle').click();`
  });
  await new Promise(r => setTimeout(r, 200));

  const openResult = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const toggle = document.querySelector('.mobile-nav-toggle');
      const drawer = document.querySelector('.mobile-nav-drawer');
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const isOpen = drawer.classList.contains('is-active') || drawer.classList.contains('translate-x-0');
      const ariaExpanded = toggle.getAttribute('aria-expanded');
      return { bodyOverflow, isOpen, ariaExpanded };
    })()`,
    returnByValue: true
  });
  const openData = openResult.result.value;
  console.log(`  Open Drawer: isOpen=${openData.isOpen}, aria-expanded=${openData.ariaExpanded}, bodyOverflow="${openData.bodyOverflow}"`);
  if (!openData.isOpen || openData.ariaExpanded !== 'true') {
    testReport.failures.push(`Drawer failed to open properly: ${JSON.stringify(openData)}`);
  }
  if (openData.bodyOverflow !== 'hidden') {
    testReport.failures.push(`Body scroll lock failed upon drawer open (overflow: ${openData.bodyOverflow})`);
  }

  // Scenario 1.3: Close via drawer-close-btn -> check scroll released
  await cdp.send('Runtime.evaluate', {
    expression: `document.querySelector('.drawer-close-btn').click();`
  });
  await new Promise(r => setTimeout(r, 200));

  const closeBtnResult = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const drawer = document.querySelector('.mobile-nav-drawer');
      const toggle = document.querySelector('.mobile-nav-toggle');
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const isOpen = drawer.classList.contains('is-active');
      const ariaExpanded = toggle.getAttribute('aria-expanded');
      return { bodyOverflow, isOpen, ariaExpanded };
    })()`,
    returnByValue: true
  });
  const closeData = closeBtnResult.result.value;
  console.log(`  Close Drawer via Close Button: isOpen=${closeData.isOpen}, aria-expanded=${closeData.ariaExpanded}, bodyOverflow="${closeData.bodyOverflow}"`);
  if (closeData.isOpen || closeData.ariaExpanded !== 'false') {
    testReport.failures.push(`Drawer failed to close via close button: ${JSON.stringify(closeData)}`);
  }
  if (closeData.bodyOverflow === 'hidden') {
    testReport.failures.push('Body scroll lock NOT released after closing drawer via close button');
  }

  // Scenario 1.4: Open again -> Close via backdrop overlay click -> check scroll released
  await cdp.send('Runtime.evaluate', {
    expression: `document.querySelector('.mobile-nav-toggle').click();`
  });
  await new Promise(r => setTimeout(r, 200));
  await cdp.send('Runtime.evaluate', {
    expression: `document.querySelector('.mobile-nav-overlay').click();`
  });
  await new Promise(r => setTimeout(r, 200));

  const overlayCloseResult = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const drawer = document.querySelector('.mobile-nav-drawer');
      const toggle = document.querySelector('.mobile-nav-toggle');
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const isOpen = drawer.classList.contains('is-active');
      const ariaExpanded = toggle.getAttribute('aria-expanded');
      return { bodyOverflow, isOpen, ariaExpanded };
    })()`,
    returnByValue: true
  });
  const overlayData = overlayCloseResult.result.value;
  console.log(`  Close Drawer via Overlay Click: isOpen=${overlayData.isOpen}, aria-expanded=${overlayData.ariaExpanded}, bodyOverflow="${overlayData.bodyOverflow}"`);
  if (overlayData.isOpen || overlayData.ariaExpanded !== 'false') {
    testReport.failures.push(`Drawer failed to close via backdrop overlay click: ${JSON.stringify(overlayData)}`);
  }
  if (overlayData.bodyOverflow === 'hidden') {
    testReport.failures.push('Body scroll lock NOT released after closing drawer via overlay');
  }

  // Scenario 1.5: Open again -> Close via Escape key -> check scroll released
  await cdp.send('Runtime.evaluate', {
    expression: `document.querySelector('.mobile-nav-toggle').click();`
  });
  await new Promise(r => setTimeout(r, 200));
  await cdp.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await new Promise(r => setTimeout(r, 200));

  const escCloseResult = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const drawer = document.querySelector('.mobile-nav-drawer');
      const toggle = document.querySelector('.mobile-nav-toggle');
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const isOpen = drawer.classList.contains('is-active');
      const ariaExpanded = toggle.getAttribute('aria-expanded');
      return { bodyOverflow, isOpen, ariaExpanded };
    })()`,
    returnByValue: true
  });
  const escData = escCloseResult.result.value;
  console.log(`  Close Drawer via Escape Key: isOpen=${escData.isOpen}, aria-expanded=${escData.ariaExpanded}, bodyOverflow="${escData.bodyOverflow}"`);
  if (escData.isOpen || escData.ariaExpanded !== 'false') {
    testReport.failures.push(`Drawer failed to close via Escape key: ${JSON.stringify(escData)}`);
  }
  if (escData.bodyOverflow === 'hidden') {
    testReport.failures.push('Body scroll lock NOT released after closing drawer via Escape key');
  }
  console.log('✓ Suite 1 Mobile Drawer test completed.\n');

  // -------------------------------------------------------------
  // TEST SUITE 2: Services Accordion Expand / Collapse
  // -------------------------------------------------------------
  console.log('--- Test Suite 2: Services Accordion in Mobile Drawer ---');
  // Open drawer first
  await cdp.send('Runtime.evaluate', { expression: `document.querySelector('.mobile-nav-toggle').click();` });
  await new Promise(r => setTimeout(r, 200));

  const initialAcc = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const toggle = document.querySelector('.mobile-accordion-toggle');
      const content = document.querySelector('.mobile-accordion-content');
      return {
        isOpen: content.classList.contains('is-open'),
        ariaExpanded: toggle.getAttribute('aria-expanded')
      };
    })()`,
    returnByValue: true
  });
  console.log(`  Accordion Initial: isOpen=${initialAcc.result.value.isOpen}, aria-expanded=${initialAcc.result.value.ariaExpanded}`);

  // Click to open
  await cdp.send('Runtime.evaluate', { expression: `document.querySelector('.mobile-accordion-toggle').click();` });
  await new Promise(r => setTimeout(r, 200));

  const expandedAcc = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const toggle = document.querySelector('.mobile-accordion-toggle');
      const content = document.querySelector('.mobile-accordion-content');
      return {
        isOpen: content.classList.contains('is-open'),
        ariaExpanded: toggle.getAttribute('aria-expanded'),
        subLinksCount: content.querySelectorAll('li a').length
      };
    })()`,
    returnByValue: true
  });
  console.log(`  Accordion Expanded: isOpen=${expandedAcc.result.value.isOpen}, aria-expanded=${expandedAcc.result.value.ariaExpanded}, subLinks=${expandedAcc.result.value.subLinksCount}`);
  if (expandedAcc.result.value.isOpen !== true || expandedAcc.result.value.ariaExpanded !== 'true') {
    testReport.failures.push('Accordion failed to expand on click');
  }
  if (expandedAcc.result.value.subLinksCount !== 11) {
    testReport.failures.push(`Expected 11 service links inside accordion, found ${expandedAcc.result.value.subLinksCount}`);
  }

  // Click to collapse
  await cdp.send('Runtime.evaluate', { expression: `document.querySelector('.mobile-accordion-toggle').click();` });
  await new Promise(r => setTimeout(r, 200));

  const collapsedAcc = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const toggle = document.querySelector('.mobile-accordion-toggle');
      const content = document.querySelector('.mobile-accordion-content');
      return {
        isOpen: content.classList.contains('is-open'),
        ariaExpanded: toggle.getAttribute('aria-expanded')
      };
    })()`,
    returnByValue: true
  });
  console.log(`  Accordion Collapsed: isOpen=${collapsedAcc.result.value.isOpen}, aria-expanded=${collapsedAcc.result.value.ariaExpanded}`);
  if (collapsedAcc.result.value.isOpen !== false || collapsedAcc.result.value.ariaExpanded !== 'false') {
    testReport.failures.push('Accordion failed to collapse on second click');
  }

  // Close drawer
  await cdp.send('Runtime.evaluate', { expression: `document.querySelector('.drawer-close-btn').click();` });
  await new Promise(r => setTimeout(r, 200));
  console.log('✓ Suite 2 Services Accordion test completed.\n');

  // -------------------------------------------------------------
  // TEST SUITE 3: Sticky Bottom Action Bar Across Breakpoints
  // -------------------------------------------------------------
  console.log('--- Test Suite 3: Sticky Bottom Action Bar Visibility Across Breakpoints ---');
  // Breakpoint contract:
  // Mobile (< 768px): visible (320px, 375px, 767px)
  // Tablet & Desktop (>= 768px): hidden per design system @media (max-width: 767px)
  const breakpointsToTest = [
    { width: 320, name: '320px Small Mobile', expectedVisible: true },
    { width: 375, name: '375px Standard Mobile', expectedVisible: true },
    { width: 767, name: '767px Max Mobile', expectedVisible: true },
    { width: 768, name: '768px Tablet', expectedVisible: false },
    { width: 1024, name: '1024px Desktop Breakpoint', expectedVisible: false },
    { width: 1440, name: '1440px Large Desktop', expectedVisible: false }
  ];

  for (const bp of breakpointsToTest) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: bp.width,
      height: 800,
      deviceScaleFactor: 1,
      mobile: bp.expectedVisible
    });
    await new Promise(r => setTimeout(r, 100));

    const barCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const bar = document.querySelector('.mobile-bottom-bar');
        if (!bar) return { exists: false };
        const style = window.getComputedStyle(bar);
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
        const callBtn = bar.querySelector('.bottom-bar-call');
        const quoteBtn = bar.querySelector('.bottom-bar-quote');
        return {
          exists: true,
          display: style.display,
          isVisible,
          hasCallBtn: !!callBtn && (callBtn.getAttribute('href') || '').includes('5617045303'),
          hasQuoteBtn: !!quoteBtn
        };
      })()`,
      returnByValue: true
    });
    const bc = barCheck.result.value;
    console.log(`  [${bp.name}] isVisible=${bc.isVisible} (display: ${bc.display}), expected=${bp.expectedVisible}`);

    if (bc.isVisible !== bp.expectedVisible) {
      testReport.failures.push(`Sticky bottom bar visibility mismatch at ${bp.name}: expected ${bp.expectedVisible}, got ${bc.isVisible}`);
    }
    if (bc.isVisible && (!bc.hasCallBtn || !bc.hasQuoteBtn)) {
      testReport.failures.push(`Sticky bottom bar missing call or quote button at ${bp.name}`);
    }
  }
  console.log('✓ Suite 3 Sticky Bottom Action Bar test completed.\n');

  // -------------------------------------------------------------
  // TEST SUITE 4: Hero Video Controls & Quote Form Auto-Formatting
  // -------------------------------------------------------------
  console.log('--- Test Suite 4: Hero Video Modal/Controls & Quote Form Auto-Formatting ---');
  // Set to Desktop 1440px
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/` });
  await new Promise(r => setTimeout(r, 500));

  // 4.1 Hero Video verification
  const videoEval = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const video = document.querySelector('video');
      if (!video) return { exists: false };
      return {
        exists: true,
        autoplay: video.autoplay,
        muted: video.muted,
        loop: video.loop,
        playsinline: video.playsInline,
        poster: video.poster,
        paused: video.paused
      };
    })()`,
    returnByValue: true
  });
  console.log(`  Hero Video Attributes:`, videoEval.result.value);
  if (!videoEval.result.value.exists) {
    testReport.failures.push('Hero video element not found on desktop viewport');
  }

  // 4.2 Hero Play/Pause Toggle
  const togglePlayEval = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const video = document.querySelector('video');
      const toggleBtn = document.querySelector('.hero-banner button[title*="video"]');
      if (!video || !toggleBtn) return { error: 'video or toggleBtn missing' };
      const before = video.paused;
      toggleBtn.click();
      const after = video.paused;
      toggleBtn.click(); // restore
      const restored = video.paused;
      return { before, after, restored };
    })()`,
    returnByValue: true
  });
  console.log(`  Hero Video Play/Pause Toggle:`, togglePlayEval.result.value);

  // 4.3 Quote Modal Open, Phone Auto-Formatting & Scroll Lock
  // Click the Free Quote button in the header
  await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const headerQuoteBtn = document.querySelector('header .btn-primary');
      if (headerQuoteBtn) headerQuoteBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 300));

  const quoteModalEval = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.querySelector('.quote-modal-portal');
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const phoneInput = modal ? modal.querySelector('input[type="tel"]') : null;
      return {
        modalExists: !!modal,
        bodyOverflow,
        hasPhoneInput: !!phoneInput
      };
    })()`,
    returnByValue: true
  });
  console.log(`  Quote Modal Open & Scroll Lock:`, quoteModalEval.result.value);
  if (!quoteModalEval.result.value.modalExists) {
    testReport.failures.push('Quote modal did not open upon clicking Free Quote');
  }
  if (quoteModalEval.result.value.bodyOverflow !== 'hidden') {
    testReport.failures.push('Body scroll lock NOT active when Quote Modal is open');
  }

  // 4.4 Phone Auto-Formatting Stress Test
  // Type characters into phone input inside the open modal
  const phoneFormattingEval = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.querySelector('.quote-modal-portal');
      const phoneInput = modal ? modal.querySelector('input[type="tel"]') : document.querySelector('#quote-phone');
      if (!phoneInput) return { error: 'Phone input missing' };

      const simulateInput = (val) => {
        const protoSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        protoSetter.call(phoneInput, val);
        phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
      };

      simulateInput('561');
      const val3 = phoneInput.value;

      simulateInput('561704');
      const val6 = phoneInput.value;

      simulateInput('5617045303');
      const val10 = phoneInput.value;

      simulateInput('(561) abc 704-xyz 5303');
      const valClean = phoneInput.value;

      return { val3, val6, val10, valClean };
    })()`,
    returnByValue: true
  });
  console.log(`  Phone Auto-Formatting Results:`, phoneFormattingEval.result.value);

  // 4.5 Empty Form Validation Check
  await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.querySelector('.quote-modal-portal');
      const form = modal ? modal.querySelector('form') : document.querySelector('#lead-quote-form');
      if (!form) return;
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 200));

  const validationEval = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.querySelector('.quote-modal-portal');
      const form = modal ? modal.querySelector('form') : document.querySelector('#lead-quote-form');
      if (!form) return { error: 'Form not found' };

      const errorAlerts = Array.from(form.querySelectorAll('.form-error-text, [role="alert"]'));
      return {
        errorCount: errorAlerts.length,
        errors: errorAlerts.map(e => e.textContent.trim()).filter(Boolean)
      };
    })()`,
    returnByValue: true
  });
  console.log(`  Empty Form Validation Errors Triggered:`, validationEval.result.value);
  if (!validationEval.result.value || validationEval.result.value.errorCount === 0) {
    testReport.failures.push('Empty quote form submitted without triggering validation errors');
  }

  // 4.6 Close Quote Modal via Escape key & verify scroll lock released
  await cdp.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await new Promise(r => setTimeout(r, 200));

  const modalCloseEval = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.querySelector('.quote-modal-portal');
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      return {
        modalExists: !!modal,
        bodyOverflow
      };
    })()`,
    returnByValue: true
  });
  console.log(`  Quote Modal Close via Escape: modalExists=${modalCloseEval.result.value.modalExists}, bodyOverflow="${modalCloseEval.result.value.bodyOverflow}"`);
  if (modalCloseEval.result.value.modalExists) {
    testReport.failures.push('Quote modal did not close on Escape key');
  }
  if (modalCloseEval.result.value.bodyOverflow === 'hidden') {
    testReport.failures.push('Body scroll lock NOT released after closing Quote Modal');
  }
  console.log('✓ Suite 4 Hero Video & Quote Modal test completed.\n');

  // -------------------------------------------------------------
  // TEST SUITE 5: Asset & Image Sizing, Aspect Ratios & Container Bounds
  // -------------------------------------------------------------
  console.log('--- Test Suite 5: Asset & Image Sizing & Container Bounds Verification ---');
  const samplePages = [
    '/',
    '/about-us.html',
    '/our-services.html',
    '/service/office-cleaning.html',
    '/service/medical-office-cleaning.html',
    '/blog/revitalize-your-office-space.html'
  ];

  for (const pagePath of samplePages) {
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}${pagePath}` });
    await new Promise(r => setTimeout(r, 300));

    const imgEval = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const issues = [];
        let checkedCount = 0;

        for (const img of imgs) {
          // If drawer is closed, ignore hidden drawer images
          if (img.closest('.mobile-nav-drawer') && !document.querySelector('.mobile-nav-drawer.is-active')) {
            continue;
          }
          const style = window.getComputedStyle(img);
          if (style.display === 'none') continue;
          checkedCount++;

          const rect = img.getBoundingClientRect();
          const parent = img.parentElement;
          const parentRect = parent ? parent.getBoundingClientRect() : null;

          // Check if image is loaded with natural dimensions
          const isComplete = img.complete;
          const naturalW = img.naturalWidth;
          const naturalH = img.naturalHeight;

          if (isComplete && naturalW === 0) {
            issues.push({
              src: img.getAttribute('src'),
              issue: 'Broken image (naturalWidth = 0)'
            });
          }

          // Check container overflow
          if (parentRect && rect.width > parentRect.width + 2) {
            issues.push({
              src: img.getAttribute('src'),
              issue: 'Image overflows parent container',
              imgWidth: Math.round(rect.width),
              parentWidth: Math.round(parentRect.width)
            });
          }

          // Check viewport overflow
          if (rect.right > window.innerWidth + 1.5) {
            issues.push({
              src: img.getAttribute('src'),
              issue: 'Image overflows viewport right edge',
              imgRight: Math.round(rect.right),
              winWidth: window.innerWidth
            });
          }
        }

        return { checkedCount, issues };
      })()`,
      returnByValue: true
    });

    const res = imgEval.result.value;
    console.log(`  Page ${pagePath}: ${res.checkedCount} images checked, ${res.issues.length} issues detected`);
    if (res.issues.length > 0) {
      for (const iss of res.issues) {
        console.error(`    ❌ ${iss.issue}: ${iss.src}`);
        testReport.failures.push(`${pagePath}: ${iss.issue} on ${iss.src}`);
      }
    }
  }
  console.log('✓ Suite 5 Asset & Image Sizing test completed.\n');

  // Summary
  console.log('====================================================');
  console.log('       CHALLENGER STRESS TEST VERDICT REPORT        ');
  console.log('====================================================');
  console.log(`Total Failures Recorded: ${testReport.failures.length}`);
  if (testReport.failures.length > 0) {
    console.error('FAILURES:');
    testReport.failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  } else {
    console.log('ALL ADVERSARIAL STRESS TESTS PASSED WITH ZERO FAILURES!');
  }
  console.log('====================================================\n');

  // Teardown
  await cdp.close();
  chrome.proc.kill();
  server.close();

  // Save report
  fs.writeFileSync(
    path.join(PROJECT_ROOT, 'tests', 'challenger-test-results.json'),
    JSON.stringify(testReport, null, 2)
  );

  process.exit(testReport.failures.length > 0 ? 1 : 0);
}

runChallengerTests().catch(err => {
  console.error('Fatal challenger test error:', err);
  process.exit(2);
});
