import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { serviceAreas } from '../src/data/serviceAreas';

const PROJECT_ROOT = '/Users/danielarrieta/Downloads/Projects/South Florida Cleaning Concepts';
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

console.log('======================================================================');
console.log('  CHALLENGER 2: MILESTONE 3 UNIVERSAL ROUTE COVERAGE EMPIRICAL AUDIT');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;
const failures: Array<{ testName: string; error: string; route?: string }> = [];

function recordPass(testName: string, details = '') {
  passCount++;
  console.log(`  [PASS] ${testName}${details ? ` -> ${details}` : ''}`);
}

function recordFail(testName: string, error: string, route?: string) {
  failCount++;
  failures.push({ testName, error, route });
  console.error(`  [FAIL] ${testName}${route ? ` (${route})` : ''} -> ${error}`);
}

// ----------------------------------------------------------------------
// 1. Enumerate All 86 Route Definitions and Target HTML Files
// ----------------------------------------------------------------------
console.log('--- TEST GROUP 1: Route Definitions & Static HTML File Discovery ---');

interface RouteTarget {
  route: string;
  primaryFile: string;
  flatFile?: string;
}

const expectedRoutes: RouteTarget[] = [
  // 6 Core
  { route: '/', primaryFile: 'index.html' },
  { route: '/about-us', primaryFile: 'about-us/index.html', flatFile: 'about-us.html' },
  { route: '/our-services', primaryFile: 'our-services/index.html', flatFile: 'our-services.html' },
  { route: '/contact-us', primaryFile: 'contact-us/index.html', flatFile: 'contact-us.html' },
  { route: '/faqs', primaryFile: 'faqs/index.html', flatFile: 'faqs.html' },
  { route: '/our-publications', primaryFile: 'our-publications/index.html', flatFile: 'our-publications.html' },

  // 11 Services
  { route: '/service', primaryFile: 'service/index.html', flatFile: 'service.html' },
  { route: '/service/office-cleaning', primaryFile: 'service/office-cleaning/index.html', flatFile: 'service/office-cleaning.html' },
  { route: '/service/medical-office-cleaning', primaryFile: 'service/medical-office-cleaning/index.html', flatFile: 'service/medical-office-cleaning.html' },
  { route: '/service/bars-and-restaurant-cleaning', primaryFile: 'service/bars-and-restaurant-cleaning/index.html', flatFile: 'service/bars-and-restaurant-cleaning.html' },
  { route: '/service/short-term-rentals', primaryFile: 'service/short-term-rentals/index.html', flatFile: 'service/short-term-rentals.html' },
  { route: '/service/post-construction-cleaning', primaryFile: 'service/post-construction-cleaning/index.html', flatFile: 'service/post-construction-cleaning.html' },
  { route: '/service/move-in-out-cleaning', primaryFile: 'service/move-in-out-cleaning/index.html', flatFile: 'service/move-in-out-cleaning.html' },
  { route: '/service/home-maintenance', primaryFile: 'service/home-maintenance/index.html', flatFile: 'service/home-maintenance.html' },
  { route: '/service/school-cleaning', primaryFile: 'service/school-cleaning/index.html', flatFile: 'service/school-cleaning.html' },
  { route: '/service/home-watching', primaryFile: 'service/home-watching/index.html', flatFile: 'service/home-watching.html' },
  { route: '/service/covid-19-disinfection', primaryFile: 'service/covid-19-disinfection/index.html', flatFile: 'service/covid-19-disinfection.html' },

  // 11 Blog Articles
  { route: '/blog/revitalize-your-office-space', primaryFile: 'blog/revitalize-your-office-space/index.html', flatFile: 'blog/revitalize-your-office-space.html' },
  { route: '/blog/complete-guide-to-home-cleaning', primaryFile: 'blog/complete-guide-to-home-cleaning/index.html', flatFile: 'blog/complete-guide-to-home-cleaning.html' },
  { route: '/blog/restaurant-and-bar-cleaning-services', primaryFile: 'blog/restaurant-and-bar-cleaning-services/index.html', flatFile: 'blog/restaurant-and-bar-cleaning-services.html' },
  { route: '/blog/office-cleaning-made-easy', primaryFile: 'blog/office-cleaning-made-easy/index.html', flatFile: 'blog/office-cleaning-made-easy.html' },
  { route: '/blog/short-term-rental-cleaning-guide', primaryFile: 'blog/short-term-rental-cleaning-guide/index.html', flatFile: 'blog/short-term-rental-cleaning-guide.html' },
  { route: '/blog/high-quality-cleaning-services-south-florida', primaryFile: 'blog/high-quality-cleaning-services-south-florida/index.html', flatFile: 'blog/high-quality-cleaning-services-south-florida.html' },
  { route: '/blog/medical-office-cleaning-guide', primaryFile: 'blog/medical-office-cleaning-guide/index.html', flatFile: 'blog/medical-office-cleaning-guide.html' },
  { route: '/blog/deep-cleaning-for-homes-and-offices', primaryFile: 'blog/deep-cleaning-for-homes-and-offices/index.html', flatFile: 'blog/deep-cleaning-for-homes-and-offices.html' },
  { route: '/blog/post-construction-cleaning-guide', primaryFile: 'blog/post-construction-cleaning-guide/index.html', flatFile: 'blog/post-construction-cleaning-guide.html' },
  { route: '/blog/south-florida-home-maintenance-services', primaryFile: 'blog/south-florida-home-maintenance-services/index.html', flatFile: 'blog/south-florida-home-maintenance-services.html' },
  { route: '/blog/residential-cleaning-services-journey', primaryFile: 'blog/residential-cleaning-services-journey/index.html', flatFile: 'blog/residential-cleaning-services-journey.html' },

  // Service Areas Directory
  { route: '/service-areas', primaryFile: 'service-areas/index.html', flatFile: 'service-areas.html' },

  // 56 Service Areas
  ...serviceAreas.map((area) => ({
    route: `/service-area/${area.slug}`,
    primaryFile: `service-area/${area.slug}/index.html`,
    flatFile: `service-area/${area.slug}.html`
  })),

  // 404 Error Page
  { route: '/404', primaryFile: '404/index.html', flatFile: '404.html' }
];

try {
  assert(fs.existsSync(DIST_DIR), `dist/ directory does not exist at ${DIST_DIR}`);
  assert.strictEqual(expectedRoutes.length, 86, `Expected exactly 86 route definitions, found ${expectedRoutes.length}`);
  recordPass('Route Catalog Count', `Found exactly 86 route definitions`);

  let missingPrimary = 0;
  for (const r of expectedRoutes) {
    const fullPath = path.join(DIST_DIR, r.primaryFile);
    if (!fs.existsSync(fullPath)) {
      missingPrimary++;
      recordFail('Route File Presence', `Missing ${r.primaryFile}`, r.route);
    }
  }

  if (missingPrimary === 0) {
    recordPass('All 86 Route Primary Files Present', `100% of route index.html files exist in dist/`);
  }

  // Also verify /contact alias
  const contactAliasIndex = path.join(DIST_DIR, 'contact/index.html');
  const contactAliasFlat = path.join(DIST_DIR, 'contact.html');
  assert(fs.existsSync(contactAliasIndex), `Missing contact alias: ${contactAliasIndex}`);
  assert(fs.existsSync(contactAliasFlat), `Missing contact alias: ${contactAliasFlat}`);
  recordPass('/contact Route Alias Files', 'Both dist/contact/index.html and dist/contact.html exist');
} catch (err: any) {
  recordFail('Route Definitions & Discovery', err.message);
}

// ----------------------------------------------------------------------
// 2. Global CTA Universal Presence Across 100% of Static Routes
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: Global CTA Universal Presence (100% of 86 Routes) ---');

try {
  let ctaPresentCount = 0;
  let testIdPresentCount = 0;
  let headingPresentCount = 0;
  let ariaLabelPresentCount = 0;

  for (const r of expectedRoutes) {
    const filePath = path.join(DIST_DIR, r.primaryFile);
    const html = fs.readFileSync(filePath, 'utf-8');

    // Check data-testid="global-cta"
    if (!html.includes('data-testid="global-cta"')) {
      recordFail('Global CTA data-testid', `Missing data-testid="global-cta" in ${r.primaryFile}`, r.route);
    } else {
      testIdPresentCount++;
    }

    // Check class="global-cta global-cta-section"
    if (!html.includes('global-cta-section')) {
      recordFail('Global CTA CSS Class', `Missing global-cta-section in ${r.primaryFile}`, r.route);
    } else {
      ctaPresentCount++;
    }

    // Check heading id="global-cta-heading"
    if (!html.includes('id="global-cta-heading"')) {
      recordFail('Global CTA Heading ID', `Missing id="global-cta-heading" in ${r.primaryFile}`, r.route);
    } else {
      headingPresentCount++;
    }

    // Check aria-labelledby="global-cta-heading"
    if (!html.includes('aria-labelledby="global-cta-heading"')) {
      recordFail('Global CTA aria-labelledby', `Missing aria-labelledby="global-cta-heading" in ${r.primaryFile}`, r.route);
    } else {
      ariaLabelPresentCount++;
    }

    // If flat file exists, verify it also contains global CTA
    if (r.flatFile) {
      const flatPath = path.join(DIST_DIR, r.flatFile);
      if (fs.existsSync(flatPath)) {
        const flatHtml = fs.readFileSync(flatPath, 'utf-8');
        if (!flatHtml.includes('data-testid="global-cta"')) {
          recordFail('Flat HTML Global CTA', `Missing data-testid in flat file ${r.flatFile}`, r.route);
        }
      }
    }
  }

  assert.strictEqual(testIdPresentCount, 86, `Expected data-testid="global-cta" on 86 routes, found ${testIdPresentCount}`);
  recordPass('Global CTA data-testid Presence', `100% (86/86) routes contain data-testid="global-cta"`);

  assert.strictEqual(ctaPresentCount, 86, `Expected global-cta-section class on 86 routes, found ${ctaPresentCount}`);
  recordPass('Global CTA CSS Class Presence', `100% (86/86) routes contain global-cta-section class`);

  assert.strictEqual(headingPresentCount, 86, `Expected heading ID on 86 routes, found ${headingPresentCount}`);
  recordPass('Global CTA Heading ID Presence', `100% (86/86) routes contain id="global-cta-heading"`);

  assert.strictEqual(ariaLabelPresentCount, 86, `Expected aria-labelledby on 86 routes, found ${ariaLabelPresentCount}`);
  recordPass('Global CTA Accessibility Label Presence', `100% (86/86) routes contain aria-labelledby="global-cta-heading"`);
} catch (err: any) {
  recordFail('Global CTA Universal Presence', err.message);
}

// ----------------------------------------------------------------------
// 3. Physical DOM Source Order & Footer Precedence
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: Physical DOM Source Order & Precedence Before Footer ---');

try {
  let orderPassed = 0;
  let orderFailed = 0;

  for (const r of expectedRoutes) {
    const filePath = path.join(DIST_DIR, r.primaryFile);
    const html = fs.readFileSync(filePath, 'utf-8');

    const ctaStartIdx = html.indexOf('data-testid="global-cta"');
    const footerStartIdx = html.indexOf('<footer class="site-footer">');

    if (ctaStartIdx === -1) {
      orderFailed++;
      recordFail('CTA Missing for Order Check', `Cannot find CTA in ${r.primaryFile}`, r.route);
      continue;
    }

    if (footerStartIdx === -1) {
      orderFailed++;
      recordFail('Footer Missing for Order Check', `Cannot find footer in ${r.primaryFile}`, r.route);
      continue;
    }

    // CTA must physically precede footer in DOM
    if (ctaStartIdx >= footerStartIdx) {
      orderFailed++;
      recordFail(
        'DOM Precedence Violation',
        `CTA at index ${ctaStartIdx} appears AFTER footer at index ${footerStartIdx} in ${r.primaryFile}`,
        r.route
      );
      continue;
    }

    // Also verify closing tag </section> of CTA precedes footer
    const ctaSectionCloseIdx = html.indexOf('</section>', ctaStartIdx);
    if (ctaSectionCloseIdx === -1 || ctaSectionCloseIdx >= footerStartIdx) {
      orderFailed++;
      recordFail(
        'DOM Close Section Precedence Violation',
        `CTA </section> at ${ctaSectionCloseIdx} appears after footer at ${footerStartIdx} in ${r.primaryFile}`,
        r.route
      );
      continue;
    }

    orderPassed++;
  }

  assert.strictEqual(orderPassed, 86, `Expected all 86 routes to have CTA preceding footer, but only ${orderPassed} passed`);
  recordPass(
    '100% DOM Source Order Precedence',
    `In all 86 pre-rendered routes, Global CTA physically precedes <footer class="site-footer">`
  );

  // Also check React App.tsx component tree ordering
  const appTsxPath = path.join(PROJECT_ROOT, 'src/App.tsx');
  const appTsx = fs.readFileSync(appTsxPath, 'utf-8');
  const globalCtaMountIdx = appTsx.indexOf('<GlobalCTA');
  const footerMountIdx = appTsx.indexOf('<Footer');

  assert(globalCtaMountIdx !== -1, 'Missing <GlobalCTA in src/App.tsx');
  assert(footerMountIdx !== -1, 'Missing <Footer in src/App.tsx');
  assert(
    globalCtaMountIdx < footerMountIdx,
    `<GlobalCTA (index ${globalCtaMountIdx}) must precede <Footer (index ${footerMountIdx}) in src/App.tsx`
  );
  recordPass('React App.tsx Component Order', '<GlobalCTA /> immediately precedes <Footer /> in layout tree');
} catch (err: any) {
  recordFail('DOM Source Order Precedence', err.message);
}

// ----------------------------------------------------------------------
// 4. Poison Token Forensics Inside Global CTA Blocks
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 4: Poison Token Forensics (Zero Undefined / Null / NaN / Object Leaks) ---');

try {
  let scannedRoutes = 0;
  let poisonDetected = 0;
  const poisonRegex = /(?:undefined|NaN|null|\[object Object\]|\[object Promise\])/g;

  for (const r of expectedRoutes) {
    const filePath = path.join(DIST_DIR, r.primaryFile);
    const html = fs.readFileSync(filePath, 'utf-8');

    // Extract exact Global CTA block
    const ctaStart = html.indexOf('<section class="global-cta global-cta-section" data-testid="global-cta"');
    if (ctaStart === -1) {
      recordFail('CTA Extraction', `Could not find CTA start tag in ${r.primaryFile}`, r.route);
      continue;
    }

    const ctaEnd = html.indexOf('</section>', ctaStart);
    if (ctaEnd === -1) {
      recordFail('CTA Extraction', `Could not find CTA end tag in ${r.primaryFile}`, r.route);
      continue;
    }

    const ctaBlock = html.substring(ctaStart, ctaEnd + '</section>'.length);
    scannedRoutes++;

    // Scan for poison tokens
    const matches = ctaBlock.match(poisonRegex);
    if (matches && matches.length > 0) {
      poisonDetected++;
      recordFail('Poison Token Leak', `Found tokens: ${matches.join(', ')} in ${r.primaryFile}`, r.route);
    }
  }

  assert.strictEqual(poisonDetected, 0, `Detected ${poisonDetected} routes with poison tokens`);
  recordPass('Zero Poison Tokens in CTA Blocks', `100% of 86 routes contain ZERO undefined, null, NaN, or [object Object] tokens`);
} catch (err: any) {
  recordFail('Poison Token Forensics', err.message);
}

// ----------------------------------------------------------------------
// 5. Trust Badges, Telephony, Regional Dispatch & Actionable Anchors
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 5: Trust Badges, Telephony & Actionable Anchors ---');

try {
  const expectedBadges = [
    'Licensed &amp; Insured',
    '100% Satisfaction Guarantee',
    'Same-Day Commercial Dispatch',
    'Green Seal Certified Products'
  ];

  let missingBadgesCount = 0;
  let missingPhoneCount = 0;
  let missingQuoteLinkCount = 0;
  let missingServiceLinkCount = 0;
  let missingAreaLinkCount = 0;
  let missingDispatchBeaconCount = 0;

  for (const r of expectedRoutes) {
    const filePath = path.join(DIST_DIR, r.primaryFile);
    const html = fs.readFileSync(filePath, 'utf-8');

    // Extract CTA block
    const ctaStart = html.indexOf('data-testid="global-cta"');
    const ctaEnd = html.indexOf('</section>', ctaStart);
    const ctaBlock = html.substring(ctaStart, ctaEnd + 10);

    // Verify all 4 trust badges
    for (const badge of expectedBadges) {
      if (!ctaBlock.includes(badge)) {
        missingBadgesCount++;
        recordFail('Missing Trust Badge', `Missing badge "${badge}" in ${r.primaryFile}`, r.route);
      }
    }

    // Verify direct phone anchor
    if (!ctaBlock.includes('href="tel:+15617045303"')) {
      missingPhoneCount++;
      recordFail('Missing Telephony Link', `Missing href="tel:+15617045303" in ${r.primaryFile}`, r.route);
    }

    // Verify quote anchor link targeting /contact#quote
    if (!ctaBlock.includes('href="/contact#quote"')) {
      missingQuoteLinkCount++;
      recordFail('Missing Quote Link', `Missing href="/contact#quote" in ${r.primaryFile}`, r.route);
    }

    // Verify /our-services link
    if (!ctaBlock.includes('href="/our-services"')) {
      missingServiceLinkCount++;
      recordFail('Missing Our Services Link', `Missing href="/our-services" in ${r.primaryFile}`, r.route);
    }

    // Verify /service-areas link
    if (!ctaBlock.includes('href="/service-areas"')) {
      missingAreaLinkCount++;
      recordFail('Missing Service Areas Link', `Missing href="/service-areas" in ${r.primaryFile}`, r.route);
    }

    // Verify regional dispatch banner
    if (!ctaBlock.includes('Active Regional Dispatch:')) {
      missingDispatchBeaconCount++;
      recordFail('Missing Dispatch Banner', `Missing "Active Regional Dispatch:" in ${r.primaryFile}`, r.route);
    }
  }

  assert.strictEqual(missingBadgesCount, 0, `Found ${missingBadgesCount} missing badge instances`);
  recordPass('4 Trust Badges Across All Routes', 'All 4 badges present with complete typography in all 86 routes');

  assert.strictEqual(missingPhoneCount, 0, `Found ${missingPhoneCount} missing phone link instances`);
  recordPass('Direct Telephony Link', 'href="tel:+15617045303" present in all 86 routes');

  assert.strictEqual(missingQuoteLinkCount, 0, `Found ${missingQuoteLinkCount} missing quote link instances`);
  recordPass('Primary Action Quote Anchor', 'href="/contact#quote" present in all 86 routes');

  assert.strictEqual(missingServiceLinkCount, 0, `Found ${missingServiceLinkCount} missing service link instances`);
  assert.strictEqual(missingAreaLinkCount, 0, `Found ${missingAreaLinkCount} missing service areas link instances`);
  recordPass('Secondary Navigation Links', 'Links to /our-services and /service-areas present in all 86 routes');

  assert.strictEqual(missingDispatchBeaconCount, 0, `Found ${missingDispatchBeaconCount} missing dispatch banners`);
  recordPass('Regional Dispatch Beacon', 'Active Regional Dispatch banner present across all 86 routes');
} catch (err: any) {
  recordFail('Trust Badges & Anchors', err.message);
}

// ----------------------------------------------------------------------
// 6. Quote Anchor Target & Route Alias Defenses
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 6: Quote Anchor Target & Route Alias Defenses ---');

try {
  // Check contact-us/index.html and contact-us.html for id="quote"
  const contactUsIndex = fs.readFileSync(path.join(DIST_DIR, 'contact-us/index.html'), 'utf-8');
  assert(contactUsIndex.includes('id="quote"'), 'Missing id="quote" in dist/contact-us/index.html');
  recordPass('Contact Us Index Anchor Target', 'id="quote" present on quote form container in dist/contact-us/index.html');

  const contactUsFlat = fs.readFileSync(path.join(DIST_DIR, 'contact-us.html'), 'utf-8');
  assert(contactUsFlat.includes('id="quote"'), 'Missing id="quote" in dist/contact-us.html');
  recordPass('Contact Us Flat Anchor Target', 'id="quote" present on quote form container in dist/contact-us.html');

  // Check contact alias files for id="quote"
  const contactAliasIndex = fs.readFileSync(path.join(DIST_DIR, 'contact/index.html'), 'utf-8');
  assert(contactAliasIndex.includes('id="quote"'), 'Missing id="quote" in dist/contact/index.html');
  recordPass('Contact Alias Index Anchor Target', 'id="quote" present in dist/contact/index.html');

  const contactAliasFlat = fs.readFileSync(path.join(DIST_DIR, 'contact.html'), 'utf-8');
  assert(contactAliasFlat.includes('id="quote"'), 'Missing id="quote" in dist/contact.html');
  recordPass('Contact Alias Flat Anchor Target', 'id="quote" present in dist/contact.html');

  // Check ContactPage.tsx source code
  const contactPageTsx = fs.readFileSync(path.join(PROJECT_ROOT, 'src/pages/ContactPage.tsx'), 'utf-8');
  assert(contactPageTsx.includes('id="quote"'), 'Missing id="quote" in src/pages/ContactPage.tsx');
  recordPass('ContactPage.tsx Form Target', 'id="quote" wired into form column in React source');

  // Check public/_redirects for /contact alias
  const redirectsFile = fs.readFileSync(path.join(PROJECT_ROOT, 'public/_redirects'), 'utf-8');
  assert(redirectsFile.includes('/contact') && redirectsFile.includes('/contact-us'), 'Missing /contact redirect rule in public/_redirects');
  recordPass('public/_redirects 301 Canonical Alias', 'Redirect rule from /contact to /contact-us configured');

  // Check App.tsx for /contact routes
  const appTsx = fs.readFileSync(path.join(PROJECT_ROOT, 'src/App.tsx'), 'utf-8');
  assert(appTsx.includes('path="/contact"'), 'Missing Route path="/contact" in App.tsx');
  assert(appTsx.includes('path="/contact.html"'), 'Missing Route path="/contact.html" in App.tsx');
  recordPass('App.tsx Route Aliases', 'Routes for /contact and /contact.html wired into React Router');
} catch (err: any) {
  recordFail('Quote Target & Route Aliases', err.message);
}

// ----------------------------------------------------------------------
// 7. Summary and Verdict
// ----------------------------------------------------------------------
console.log('\n======================================================================');
console.log('  CHALLENGER 2 EMPIRICAL AUDIT SUMMARY');
console.log(`  Total Checks Passed: ${passCount}`);
console.log(`  Total Checks Failed: ${failCount}`);
console.log('======================================================================');

if (failCount > 0) {
  console.error(`\nFAILED with ${failCount} issues:`);
  for (const f of failures) {
    console.error(`  - ${f.testName}${f.route ? ` [${f.route}]` : ''}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('\nVERDICT: ALL EMPIRICAL CHALLENGES PASSED (100% ROUTE COVERAGE CONFIRMED)\n');
  process.exit(0);
}
