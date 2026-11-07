// @ts-check
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PROJECT_ROOT = '/Users/danielarrieta/Downloads/Projects/South Florida Cleaning Concepts';
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const HTTP_PORT = 4173;
const CHROME_PORT = 9444;

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

const PAGES = [
  '/',
  '/about-us.html',
  '/our-services.html',
  '/contact-us.html',
  '/faqs.html',
  '/our-publications.html',
  '/service/index.html',
  '/service/office-cleaning.html',
  '/service/medical-office-cleaning.html',
  '/service/bars-and-restaurant-cleaning.html',
  '/service/short-term-rentals.html',
  '/service/post-construction-cleaning.html',
  '/service/move-in-out-cleaning.html',
  '/service/home-maintenance.html',
  '/service/school-cleaning.html',
  '/service/home-watching.html',
  '/service/covid-19-disinfection.html',
  '/blog/revitalize-your-office-space.html',
  '/blog/complete-guide-to-home-cleaning.html',
  '/blog/restaurant-and-bar-cleaning-services.html',
  '/blog/office-cleaning-made-easy.html',
  '/blog/short-term-rental-cleaning-guide.html',
  '/blog/high-quality-cleaning-services-south-florida.html',
  '/blog/medical-office-cleaning-guide.html',
  '/blog/deep-cleaning-for-homes-and-offices.html',
  '/blog/post-construction-cleaning-guide.html',
  '/blog/south-florida-home-maintenance-services.html',
  '/blog/residential-cleaning-services-journey.html'
];

const VIEWPORTS = [
  { name: 'Desktop', width: 1440, height: 900, isMobile: false },
  { name: 'Tablet', width: 768, height: 1024, isMobile: true },
  { name: 'Mobile_375', width: 375, height: 812, isMobile: true },
  { name: 'SmallMobile_320', width: 320, height: 568, isMobile: true }
];

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
  const profileDir = `/tmp/chrome-responsive-profile-${Date.now()}`;
  const proc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars'
  ], { stdio: 'ignore' });

  // Wait for Chrome to listen
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

async function runTests() {
  console.log('--- Starting Empirical Responsive Stress Test Suite ---');
  const server = createServer();
  await new Promise(r => server.listen(HTTP_PORT, r));
  console.log(`Static server running at http://127.0.0.1:${HTTP_PORT}`);

  const chrome = await launchChrome();
  console.log(`Headless Chrome launched on CDP port ${CHROME_PORT}`);

  const cdp = await createCdpClient();
  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');
  await cdp.send('Runtime.enable');

  const allResults = {
    pagesTested: PAGES.length,
    viewportsTested: VIEWPORTS.length,
    totalEvaluations: PAGES.length * VIEWPORTS.length,
    overflowFailures: [],
    touchTargetFailures: [],
    stickyBarFailures: [],
    drawerInteractionFailures: [],
    imageScalingFailures: [],
    summary: {}
  };

  for (const pagePath of PAGES) {
    const pageUrl = `http://127.0.0.1:${HTTP_PORT}${pagePath}`;
    console.log(`\nTesting Page: ${pagePath}`);

    for (const vp of VIEWPORTS) {
      // Set viewport
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.isMobile
      });

      // Navigate
      await cdp.send('Page.navigate', { url: pageUrl });
      await new Promise(r => setTimeout(r, 200));

      // 1. Viewport Overflow Check
      const overflowResult = await cdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            const winWidth = window.innerWidth;
            const docEl = document.documentElement;
            const body = document.body;
            const docScroll = docEl.scrollWidth;
            const bodyScroll = body.scrollWidth;
            
            // Check all visible elements
            const all = Array.from(document.querySelectorAll('*'));
            const overflowingEls = [];

            for (const el of all) {
              // Ignore mobile drawer and its descendants if drawer is closed
              if (el.closest('.mobile-nav-drawer') || el.classList.contains('mobile-nav-drawer') || el.classList.contains('mobile-nav-overlay')) {
                continue;
              }
              const style = window.getComputedStyle(el);
              if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                // Element right boundary exceeding viewport
                if (rect.right > winWidth + 1.5) {
                  overflowingEls.push({
                    tag: el.tagName.toLowerCase(),
                    className: el.className || '',
                    id: el.id || '',
                    rectRight: Math.round(rect.right),
                    winWidth: winWidth,
                    overflowPx: Math.round(rect.right - winWidth)
                  });
                }
              }
            }

            return {
              winWidth,
              docScroll,
              bodyScroll,
              hasScrollOverflow: (docScroll > winWidth + 1) || (bodyScroll > winWidth + 1),
              overflowingEls: overflowingEls.slice(0, 5) // top 5
            };
          })()
        `,
        returnByValue: true
      });

      const ofData = overflowResult.result.value;
      if (ofData.hasScrollOverflow || ofData.overflowingEls.length > 0) {
        allResults.overflowFailures.push({
          page: pagePath,
          viewport: vp.name,
          width: vp.width,
          docScroll: ofData.docScroll,
          bodyScroll: ofData.bodyScroll,
          overflowingElements: ofData.overflowingEls
        });
        console.error(`  ❌ [${vp.name} (${vp.width}px)] OVERFLOW DETECTED: doc=${ofData.docScroll}px, body=${ofData.bodyScroll}px vs win=${vp.width}px`);
      } else {
        console.log(`  ✓ [${vp.name} (${vp.width}px)] Zero horizontal overflow (scrollWidth <= ${vp.width}px)`);
      }

      // 2. Responsive Image Scaling Check
      const imageResult = await cdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            const winWidth = window.innerWidth;
            const imgs = Array.from(document.querySelectorAll('img'));
            const failedImgs = [];
            for (const img of imgs) {
              const rect = img.getBoundingClientRect();
              const style = window.getComputedStyle(img);
              if (style.display === 'none') continue;
              
              const isResponsive = style.maxWidth === '100%' || parseInt(style.maxWidth) <= winWidth;
              const overflows = rect.right > winWidth + 1.5;
              if (overflows || (!isResponsive && rect.width > winWidth)) {
                failedImgs.push({
                  src: img.getAttribute('src'),
                  rectWidth: Math.round(rect.width),
                  winWidth,
                  maxWidth: style.maxWidth
                });
              }
            }
            return failedImgs;
          })()
        `,
        returnByValue: true
      });
      const imgFails = imageResult.result.value;
      if (imgFails.length > 0) {
        allResults.imageScalingFailures.push({
          page: pagePath,
          viewport: vp.name,
          width: vp.width,
          failedImages: imgFails
        });
        console.error(`  ❌ [${vp.name}] Image scaling issue on ${imgFails.length} images`);
      }

      // 3. Touch Target Sizing (on Mobile/Tablet viewports: 768, 375, 320)
      if (vp.isMobile) {
        const touchTargetResult = await cdp.send('Runtime.evaluate', {
          expression: `
            (() => {
              const targets = [];
              
              // Hamburger toggle
              const toggle = document.querySelector('.mobile-nav-toggle');
              if (toggle) {
                const rect = toggle.getBoundingClientRect();
                const style = window.getComputedStyle(toggle);
                if (style.display !== 'none') {
                  targets.push({
                    name: 'hamburger_toggle',
                    tag: 'button',
                    selector: '.mobile-nav-toggle',
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                  });
                }
              }

              // Mobile call btn in header
              const mobileCall = document.querySelector('.mobile-call-btn');
              if (mobileCall) {
                const rect = mobileCall.getBoundingClientRect();
                const style = window.getComputedStyle(mobileCall);
                if (style.display !== 'none') {
                  targets.push({
                    name: 'header_mobile_call_btn',
                    tag: 'a',
                    selector: '.mobile-call-btn',
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                  });
                }
              }

              // Bottom bar call & quote buttons
              const bottomBar = document.querySelector('.mobile-bottom-bar');
              if (bottomBar && window.getComputedStyle(bottomBar).display !== 'none') {
                const bottomBtns = bottomBar.querySelectorAll('.bottom-bar-btn');
                bottomBtns.forEach(btn => {
                  const rect = btn.getBoundingClientRect();
                  targets.push({
                    name: 'bottom_bar_btn: ' + (btn.textContent || '').trim().replace(/\\s+/g, ' '),
                    tag: 'a',
                    selector: btn.className,
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                  });
                });
              }

              // Drawer links (measure drawer elements when opened)
              const drawer = document.querySelector('.mobile-nav-drawer');
              if (drawer) {
                const closeBtn = drawer.querySelector('.drawer-close-btn');
                if (closeBtn) {
                  const r = closeBtn.getBoundingClientRect();
                  targets.push({
                    name: 'drawer_close_btn',
                    tag: 'button',
                    selector: '.drawer-close-btn',
                    width: Math.round(r.width),
                    height: Math.round(r.height)
                  });
                }

                const navLinks = drawer.querySelectorAll('.drawer-nav-list > li > a.nav-link');
                navLinks.forEach(link => {
                  const r = link.getBoundingClientRect();
                  targets.push({
                    name: 'drawer_nav_link: ' + (link.textContent || '').trim(),
                    tag: 'a',
                    selector: '.drawer-nav-list .nav-link',
                    width: Math.round(r.width),
                    height: Math.round(r.height)
                  });
                });

                const accordionToggle = drawer.querySelector('.mobile-accordion-toggle');
                if (accordionToggle) {
                  const r = accordionToggle.getBoundingClientRect();
                  targets.push({
                    name: 'mobile_accordion_toggle',
                    tag: 'button',
                    selector: '.mobile-accordion-toggle',
                    width: Math.round(r.width),
                    height: Math.round(r.height)
                  });
                }

                const subLinks = drawer.querySelectorAll('.mobile-accordion-content li a');
                subLinks.forEach(sub => {
                  const r = sub.getBoundingClientRect();
                  targets.push({
                    name: 'drawer_sub_link: ' + (sub.textContent || '').trim(),
                    tag: 'a',
                    selector: '.mobile-accordion-content li a',
                    width: Math.round(r.width),
                    height: Math.round(r.height)
                  });
                });
              }

              // Check against 48x48px (ideal) and 44x44px (WCAG AA min)
              const failures = [];
              for (const t of targets) {
                if (t.width < 44 || t.height < 44) {
                  failures.push({ ...t, reason: '< 44x44 WCAG AA' });
                } else if (t.width < 48 || t.height < 48) {
                  failures.push({ ...t, reason: '< 48x48 Ideal Mobile Touch' });
                }
              }

              return { targets, failures };
            })()
          `,
          returnByValue: true
        });

        const ttData = touchTargetResult.result.value;
        if (ttData.failures.length > 0) {
          allResults.touchTargetFailures.push({
            page: pagePath,
            viewport: vp.name,
            width: vp.width,
            failures: ttData.failures
          });
          console.warn(`  ⚠️ [${vp.name}] Touch target warning on ${ttData.failures.length} elements:`);
          for (const f of ttData.failures.slice(0, 3)) {
            console.warn(`     - ${f.name} [${f.width}x${f.height}px] (${f.reason})`);
          }
        } else {
          console.log(`  ✓ [${vp.name}] All touch targets >= 48x48px`);
        }
      }

      // 4. Sticky Bottom Action Bar & Body Padding Check
      const stickyBarResult = await cdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            const bar = document.querySelector('.mobile-bottom-bar');
            if (!bar) return { exists: false };

            const style = window.getComputedStyle(bar);
            const bodyStyle = window.getComputedStyle(document.body);
            const mainEl = document.querySelector('main');
            const mainStyle = mainEl ? window.getComputedStyle(mainEl) : null;
            
            const isVisible = style.display !== 'none';
            const rect = bar.getBoundingClientRect();
            const bodyPadBottom = parseInt(bodyStyle.paddingBottom, 10) || 0;
            const mainPadBottom = mainStyle ? (parseInt(mainStyle.paddingBottom, 10) || 0) : 0;
            const totalBottomPadding = bodyPadBottom + mainPadBottom;

            return {
              exists: true,
              isVisible,
              display: style.display,
              position: style.position,
              barHeight: Math.round(rect.height),
              bodyPaddingBottom: bodyPadBottom,
              mainPaddingBottom: mainPadBottom,
              totalBottomPadding,
              isObscuringGuarded: !isVisible || (totalBottomPadding >= Math.round(rect.height) - 10)
            };
          })()
        `,
        returnByValue: true
      });

      const sbData = stickyBarResult.result.value;
      if (sbData.exists) {
        if (vp.width >= 1024 && sbData.isVisible) {
          allResults.stickyBarFailures.push({
            page: pagePath,
            viewport: vp.name,
            issue: 'Sticky bar visible on desktop (>= 1024px)'
          });
          console.error(`  ❌ [${vp.name}] Sticky bar should be hidden on desktop!`);
        } else if (vp.width === 768) {
          // Check tablet behavior
          console.log(`  ℹ️ [Tablet 768px] Sticky action bar is: ${sbData.display} (height: ${sbData.barHeight}px, body-padding: ${sbData.bodyPaddingBottom}px)`);
        } else if (vp.width < 768) {
          // Must be visible and have body/main padding
          if (!sbData.isVisible) {
            allResults.stickyBarFailures.push({
              page: pagePath,
              viewport: vp.name,
              issue: 'Sticky action bar hidden on mobile (< 768px)'
            });
            console.error(`  ❌ [${vp.name}] Sticky action bar hidden on mobile!`);
          } else if (!sbData.isObscuringGuarded) {
            allResults.stickyBarFailures.push({
              page: pagePath,
              viewport: vp.name,
              issue: `Insufficient bottom padding: bar height ${sbData.barHeight}px vs total padding ${sbData.totalBottomPadding}px`
            });
            console.error(`  ❌ [${vp.name}] Bottom bar obscures content! barHeight=${sbData.barHeight}px vs padding=${sbData.totalBottomPadding}px`);
          } else {
            console.log(`  ✓ [${vp.name}] Sticky action bar visible (height: ${sbData.barHeight}px), body padding=${sbData.bodyPaddingBottom}px`);
          }
        }
      }

      // 5. Drawer Interactive Test (on Mobile 375px only, test toggle & close)
      if (vp.name === 'Mobile_375') {
        const drawerTestResult = await cdp.send('Runtime.evaluate', {
          expression: `
            (() => {
              const toggle = document.querySelector('.mobile-nav-toggle');
              const drawer = document.querySelector('.mobile-nav-drawer');
              const overlay = document.querySelector('.mobile-nav-overlay');
              const closeBtn = drawer ? drawer.querySelector('.drawer-close-btn') : null;
              const accordionToggle = drawer ? drawer.querySelector('.mobile-accordion-toggle') : null;
              const accordionContent = drawer ? drawer.querySelector('.mobile-accordion-content') : null;

              if (!toggle || !drawer) return { skipped: true, reason: 'toggle or drawer missing' };

              // Step 1: Open drawer
              toggle.click();
              const afterOpen = {
                drawerHasActive: drawer.classList.contains('is-active'),
                overlayHasActive: overlay ? overlay.classList.contains('is-active') : false,
                toggleAriaExpanded: toggle.getAttribute('aria-expanded')
              };

              // Step 2: Toggle accordion
              let accordionOpen = false;
              if (accordionToggle && accordionContent) {
                accordionToggle.click();
                accordionOpen = accordionContent.classList.contains('is-open');
              }

              // Step 3: Close drawer
              if (closeBtn) closeBtn.click();
              else if (overlay) overlay.click();
              
              const afterClose = {
                drawerHasActive: drawer.classList.contains('is-active'),
                toggleAriaExpanded: toggle.getAttribute('aria-expanded')
              };

              return {
                afterOpen,
                accordionOpen,
                afterClose
              };
            })()
          `,
          returnByValue: true
        });

        const dtData = drawerTestResult.result.value;
        if (!dtData.skipped) {
          const opensOk = dtData.afterOpen.drawerHasActive && dtData.afterOpen.toggleAriaExpanded === 'true';
          const closesOk = !dtData.afterClose.drawerHasActive && dtData.afterClose.toggleAriaExpanded === 'false';
          const accOk = dtData.accordionOpen;
          if (!opensOk || !closesOk || !accOk) {
            allResults.drawerInteractionFailures.push({
              page: pagePath,
              opensOk,
              closesOk,
              accOk,
              details: dtData
            });
            console.error(`  ❌ [Drawer Test] Failed on ${pagePath}: opens=${opensOk}, closes=${closesOk}, acc=${accOk}`);
          } else {
            console.log(`  ✓ [Drawer Test] Toggle open/close & accordion expand verified`);
          }
        }
      }
    }
  }

  // Summary
  allResults.summary = {
    totalPages: PAGES.length,
    totalViewports: VIEWPORTS.length,
    overflowFailuresCount: allResults.overflowFailures.length,
    imageScalingFailuresCount: allResults.imageScalingFailures.length,
    touchTargetFailuresCount: allResults.touchTargetFailures.length,
    stickyBarFailuresCount: allResults.stickyBarFailures.length,
    drawerInteractionFailuresCount: allResults.drawerInteractionFailures.length
  };

  console.log('\n==================================================');
  console.log('            STRESS TEST SUMMARY REPORT            ');
  console.log('==================================================');
  console.log(`Total Pages Tested:           ${allResults.summary.totalPages}`);
  console.log(`Total Viewports Tested:        ${allResults.summary.totalViewports}`);
  console.log(`Overflow Failures:            ${allResults.summary.overflowFailuresCount}`);
  console.log(`Image Scaling Failures:       ${allResults.summary.imageScalingFailuresCount}`);
  console.log(`Touch Target Warnings/Fails:  ${allResults.summary.touchTargetFailuresCount}`);
  console.log(`Sticky Bar Failures:          ${allResults.summary.stickyBarFailuresCount}`);
  console.log(`Drawer Interaction Failures:  ${allResults.summary.drawerInteractionFailuresCount}`);
  console.log('==================================================');

  // Save report to disk
  fs.writeFileSync(path.join(PROJECT_ROOT, 'tests', 'stress-test-results.json'), JSON.stringify(allResults, null, 2));
  console.log('Results written to tests/stress-test-results.json');

  // Teardown
  await cdp.close();
  chrome.proc.kill();
  server.close();
  process.exit(allResults.overflowFailures.length > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(2);
});
