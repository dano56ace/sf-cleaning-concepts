import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { GlobalCTA, GlobalCTAProps } from '../src/components/ui/GlobalCTA';
import { BUSINESS_NAP } from '../src/data/siteData';

console.log('======================================================================');
console.log('  CHALLENGER ADVERSARIAL STRESS HARNESS: MILESTONE 3 (GLOBAL CTA)');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;
const failureList: Array<{ test: string; error: string }> = [];

function recordPass(name: string, detail = '') {
  passCount++;
  console.log(`  [PASS] ${name}${detail ? ` -> ${detail}` : ''}`);
}

function recordFail(name: string, error: string) {
  failCount++;
  failureList.push({ test: name, error });
  console.error(`  [FAIL] ${name} -> ${error}`);
}

// Helper to render GlobalCTA in test environment
function renderCTA(props: GlobalCTAProps = {}): string {
  return renderToStaticMarkup(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(GlobalCTA, props)
    )
  );
}

// ---------------------------------------------------------------------------
// SUITE 1: COMPONENT RENDERING & PROPS ORACLE
// ---------------------------------------------------------------------------
console.log('--- SUITE 1: GlobalCTA Component Rendering & Props Oracle ---');

try {
  // Test 1.1: Default props rendering
  const defaultHtml = renderCTA();
  assert(defaultHtml.includes('data-testid="global-cta"'), 'Missing data-testid="global-cta"');
  assert(defaultHtml.includes('id="global-cta-heading"'), 'Missing id="global-cta-heading"');
  assert(defaultHtml.includes('aria-labelledby="global-cta-heading"'), 'Missing aria-labelledby="global-cta-heading"');
  assert(defaultHtml.includes('Ready for an Impeccably Clean Property?'), 'Default title not found');
  assert(defaultHtml.includes('Commercial &amp; Residential Excellence · Tri-County Dispatch') || defaultHtml.includes('Commercial & Residential Excellence · Tri-County Dispatch'), 'Default kicker not found');
  assert(defaultHtml.includes('Experience 20+ years of family-owned excellence'), 'Default subtitle not found');
  recordPass('Default Props Rendering & A11y Landmark Attributes');

  // Test 1.2: Custom props override
  const customHtml = renderCTA({
    title: 'Custom Title for Testing',
    subtitle: 'Custom Subtitle for Testing',
    kicker: 'Custom Kicker for Testing',
    className: 'custom-test-class'
  });
  assert(customHtml.includes('Custom Title for Testing'), 'Custom title override failed');
  assert(customHtml.includes('Custom Subtitle for Testing'), 'Custom subtitle override failed');
  assert(customHtml.includes('Custom Kicker for Testing'), 'Custom kicker override failed');
  assert(customHtml.includes('custom-test-class'), 'Custom className override failed');
  recordPass('Custom Props Dynamic Override Oracle');

  // Test 1.3: Modal trigger callback mode (button rendered)
  const buttonHtml = renderCTA({ onOpenQuoteModal: () => {} });
  assert(buttonHtml.includes('<button'), 'Button element not rendered when onOpenQuoteModal is provided');
  assert(buttonHtml.includes('type="button"'), 'Button type="button" attribute missing');
  assert(buttonHtml.includes('aria-label="Request a Free Cleaning Quote"'), 'Button aria-label missing');
  assert(!buttonHtml.includes('<a href="/contact-us"'), 'Link should not be rendered when callback provided');
  recordPass('Interactive Callback Mode (Modal Trigger Button)');

  // Test 1.4: Link fallback mode (anchor rendered when callback omitted)
  const linkHtml = renderCTA({ onOpenQuoteModal: undefined });
  assert(linkHtml.includes('href="/contact-us"'), 'Anchor href="/contact-us" not rendered when callback omitted');
  assert(linkHtml.includes('aria-label="Request a Free Cleaning Quote"'), 'Anchor aria-label missing');
  recordPass('Accessible Link Fallback Mode (Router Link to /contact-us)');

} catch (err: any) {
  recordFail('SUITE 1: Component Rendering & Props Oracle', err.message);
}

// ---------------------------------------------------------------------------
// SUITE 2: TRUST BADGES & NAP INTEGRITY
// ---------------------------------------------------------------------------
console.log('\n--- SUITE 2: Trust Badges, Regional Dispatch & NAP Integrity ---');

try {
  const html = renderCTA();

  // Test 2.1: 4 Trust Badges verification
  const expectedBadges = [
    { title: 'Licensed & Insured', desc: '$2M+ commercial liability & bonding across South Florida' },
    { title: '100% Satisfaction Guarantee', desc: 'If you are not thrilled, we re-clean free or you do not pay' },
    { title: 'Same-Day Commercial Dispatch', desc: 'Rapid mobile crews for commercial facilities & emergencies' },
    { title: 'Green Seal Certified Products', desc: 'Hospital-grade EPA List N bio-safe, eco-friendly chemistry' }
  ];

  for (const badge of expectedBadges) {
    const escapedTitle = badge.title.replace('&', '&amp;');
    const hasTitle = html.includes(badge.title) || html.includes(escapedTitle);
    assert(hasTitle, `Trust badge title missing: ${badge.title}`);

    const escapedDesc = badge.desc.replace('&', '&amp;');
    const hasDesc = html.includes(badge.desc) || html.includes(escapedDesc);
    assert(hasDesc, `Trust badge description missing: ${badge.desc}`);
  }
  recordPass('4 Trust Badges Full Copy & Subtext Verification');

  // Test 2.2: Active Regional Dispatch Banner
  assert(html.includes('Active Regional Dispatch:'), 'Active Regional Dispatch label missing');
  assert(html.includes('Palm Beach · Broward · Miami-Dade (Jupiter to Miami)'), 'Regional coverage string missing');
  assert(html.includes(`Central Operations: ${BUSINESS_NAP.addressLocality}, FL`), 'Central operations locality missing or out of sync');
  recordPass('Regional Dispatch Status Beacon & Central Operations Locality');

  // Test 2.3: Telephony CTA Sync
  assert(html.includes(`href="tel:${BUSINESS_NAP.phoneRaw}"`), `Telephony href mismatch: expected tel:${BUSINESS_NAP.phoneRaw}`);
  assert(html.includes(`Call ${BUSINESS_NAP.phone}`), `Telephony text mismatch: expected Call ${BUSINESS_NAP.phone}`);
  assert(html.includes(`aria-label="Call South Florida Cleaning Concepts at ${BUSINESS_NAP.phone}"`), 'Telephony accessible aria-label mismatch');
  recordPass('Telephony Link & Direct Call NAP Synchronization');

  // Test 2.4: Secondary Navigation Discovery Links
  assert(html.includes('href="/our-services"'), 'Missing link to /our-services');
  assert(html.includes('Explore 10 Divisions'), 'Missing label "Explore 10 Divisions"');
  assert(html.includes('href="/service-areas"'), 'Missing link to /service-areas');
  assert(html.includes('All 56 Service Areas'), 'Missing label "All 56 Service Areas"');
  recordPass('Secondary Navigation Links (Divisions & Service Areas)');

} catch (err: any) {
  recordFail('SUITE 2: Trust Badges & NAP Integrity', err.message);
}

// ---------------------------------------------------------------------------
// SUITE 3: APP.TSX LAYOUT ARCHITECTURE & ROUTE CONTRACTS
// ---------------------------------------------------------------------------
console.log('\n--- SUITE 3: App.tsx Layout Architecture & Route Contracts ---');

try {
  const appPath = path.resolve(__dirname, '../src/App.tsx');
  const appCode = fs.readFileSync(appPath, 'utf8');

  // Test 3.1: GlobalCTA Import
  assert(appCode.includes("import { GlobalCTA } from './components/ui/GlobalCTA';"), 'Missing GlobalCTA import in App.tsx');
  recordPass('GlobalCTA Import Statement in App.tsx');

  // Test 3.2: Positioning Immediately Preceding Footer
  const globalCtaIndex = appCode.indexOf('<GlobalCTA');
  const footerIndex = appCode.indexOf('<Footer />');
  const mainEndIndex = appCode.indexOf('</main>');

  assert(globalCtaIndex !== -1, '<GlobalCTA> not found in App.tsx');
  assert(footerIndex !== -1, '<Footer /> not found in App.tsx');
  assert(mainEndIndex !== -1, '</main> not found in App.tsx');

  assert(mainEndIndex < globalCtaIndex, '<GlobalCTA> must be placed AFTER </main>');
  assert(globalCtaIndex < footerIndex, '<GlobalCTA> must be placed IMMEDIATELY BEFORE <Footer />');

  // Ensure no intervening non-structural components between GlobalCTA and Footer
  const betweenCtaAndFooter = appCode.substring(globalCtaIndex, footerIndex);
  assert(!betweenCtaAndFooter.includes('<Routes'), '<Routes> cannot sit between GlobalCTA and Footer');
  recordPass('Layout Hierarchy: </main> -> <GlobalCTA /> -> <Footer /> Validated');

  // Test 3.3: GlobalCTA Wired to QuoteModal
  assert(appCode.includes("onOpenQuoteModal={() => handleOpenQuoteModal('')}"), 'GlobalCTA onOpenQuoteModal not wired to handleOpenQuoteModal');
  recordPass('GlobalCTA Modal Trigger Event Handler Wiring in App.tsx');

  // Test 3.4: Route Aliases for /contact and /contact.html
  assert(appCode.includes('path="/contact"'), 'Missing Route path="/contact" in App.tsx');
  assert(appCode.includes('path="/contact.html"'), 'Missing Route path="/contact.html" in App.tsx');
  recordPass('Canonical Route Aliases /contact & /contact.html in App.tsx');

} catch (err: any) {
  recordFail('SUITE 3: App.tsx Layout Architecture', err.message);
}

// ---------------------------------------------------------------------------
// SUITE 4: STATIC PRERENDERED HTML INTEGRITY ACROSS ALL 86 ROUTES
// ---------------------------------------------------------------------------
console.log('\n--- SUITE 4: Static Pre-rendered HTML Integrity & Crawlers ---');

try {
  const distDir = path.resolve(__dirname, '../dist');
  assert(fs.existsSync(distDir), 'dist directory does not exist. Run pnpm build first.');

  // Collect all HTML files in dist
  const htmlFiles: string[] = [];
  function collectHtml(dir: string) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        collectHtml(full);
      } else if (ent.name.endsWith('.html')) {
        htmlFiles.push(full);
      }
    }
  }
  collectHtml(distDir);

  assert(htmlFiles.length >= 86, `Expected at least 86 HTML files, found ${htmlFiles.length}`);

  let ctaFoundCount = 0;
  let layoutOrderPassedCount = 0;
  let quoteTargetFound = false;

  for (const filePath of htmlFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const rel = path.relative(distDir, filePath);

    // Skip pure error 404 document if designed without CTA, or verify it
    if (rel === '404.html') continue;

    // Check data-testid="global-cta"
    if (content.includes('data-testid="global-cta"')) {
      ctaFoundCount++;
    } else {
      assert.fail(`File ${rel} missing data-testid="global-cta"`);
    }

    // Check layout order in static HTML: main -> global-cta -> footer
    const ctaPos = content.indexOf('data-testid="global-cta"');
    const footerPos = content.indexOf('site-footer') !== -1 
      ? content.indexOf('site-footer') 
      : content.indexOf('<footer');

    if (ctaPos !== -1 && footerPos !== -1) {
      assert(ctaPos < footerPos, `Layout violation in ${rel}: GlobalCTA (pos ${ctaPos}) is not before Footer (pos ${footerPos})`);
      layoutOrderPassedCount++;
    }

    // Check contact quote anchor target
    if (rel === 'contact-us/index.html' || rel === 'contact/index.html' || rel === 'contact-us.html') {
      if (content.includes('id="quote"')) {
        quoteTargetFound = true;
      }
    }
  }

  recordPass(`All ${ctaFoundCount} static HTML routes contain data-testid="global-cta"`);
  recordPass(`All ${layoutOrderPassedCount} static HTML routes place GlobalCTA strictly preceding Footer`);
  assert(quoteTargetFound, 'Anchor id="quote" not found in contact-us static HTML');
  recordPass('Anchor id="quote" confirmed on contact-us static documents');

  // Test 4.2: /contact and /contact.html physical existence in dist
  assert(fs.existsSync(path.join(distDir, 'contact', 'index.html')), 'dist/contact/index.html does not exist');
  assert(fs.existsSync(path.join(distDir, 'contact.html')), 'dist/contact.html does not exist');
  recordPass('Physical dist/contact/index.html and dist/contact.html files exist');

  // Test 4.3: _redirects canonical rule
  const redirectsPath = path.resolve(__dirname, '../public/_redirects');
  const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
  assert(redirectsContent.includes('/contact') && redirectsContent.includes('/contact-us 301!'), 'Missing /contact -> /contact-us 301! redirect in public/_redirects');
  recordPass('Canonical 301 Redirect for /contact -> /contact-us in public/_redirects');

} catch (err: any) {
  recordFail('SUITE 4: Static Pre-rendered HTML Integrity', err.message);
}

// ---------------------------------------------------------------------------
// SUITE 5: ADVERSARIAL STRESS-TESTING & INTEGRITY VIOLATION DETECTION
// ---------------------------------------------------------------------------
console.log('\n--- SUITE 5: Adversarial Stress-Testing & Integrity Audit ---');

try {
  // Test 5.1: Integrity Audit - Source code check for mocked/hardcoded test responses
  const ctaSource = fs.readFileSync(path.resolve(__dirname, '../src/components/ui/GlobalCTA.tsx'), 'utf8');
  assert(!ctaSource.includes('test-result'), 'Suspicious test artifact in GlobalCTA.tsx');
  assert(!ctaSource.includes('mock'), 'Suspicious mock in GlobalCTA.tsx');
  assert(!ctaSource.includes('facade'), 'Suspicious facade in GlobalCTA.tsx');
  recordPass('Zero Embedded Test Harness Artifacts or Facades in GlobalCTA.tsx');

  // Test 5.2: CSS Touch Target & Mobile Accessibility
  assert(ctaSource.includes('min-h-[48px]'), 'Missing min-h-[48px] touch target class on action button');
  recordPass('WCAG 2.1 AA Compliant 48px Minimum Touch Target Sizing');

  // Test 5.3: Responsive Grid Breakpoints & Mobile Stack
  assert(ctaSource.includes('grid-cols-1 lg:grid-cols-12'), 'Missing responsive 12-column grid layout for CTA value prop');
  assert(ctaSource.includes('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'), 'Missing responsive 4-column grid layout for Trust Badges');
  recordPass('Responsive Stacking Breakpoints (Mobile 1-col -> Tablet 2-col -> Desktop 4-col)');

  // Test 5.4: Overflow Boundary Defense
  assert(ctaSource.includes('overflow-hidden'), 'Missing overflow-hidden class on GlobalCTA container');
  recordPass('Horizontal Scroll Defenses (overflow-hidden container boundary)');

} catch (err: any) {
  recordFail('SUITE 5: Adversarial Stress-Testing & Integrity Audit', err.message);
}

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`  HARNESS COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================');

if (failCount > 0) {
  console.error('\nFAILURES RECORDED:');
  for (const f of failureList) {
    console.error(`- ${f.test}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('\nVERDICT: ALL ADVERSARIAL TESTS PASSED CLEANLY.');
  process.exit(0);
}
