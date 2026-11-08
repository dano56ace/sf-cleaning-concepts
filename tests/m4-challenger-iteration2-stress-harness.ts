import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { serviceAreas } from '../src/data/serviceAreas';

const PROJECT_ROOT = '/Users/danielarrieta/Downloads/Projects/South Florida Cleaning Concepts';
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const SERVICE_AREA_DIST = path.join(DIST_DIR, 'service-area');

console.log('======================================================================');
console.log('  CHALLENGER 3: M4 ITERATION 2 — EMPIRICAL MAP & PRERENDER STRESS HARNESS');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;
const failures: Array<{ test: string; error: string; details?: any }> = [];

function pass(name: string, details = '') {
  passCount++;
  console.log(`  [PASS] ${name}${details ? ` -> ${details}` : ''}`);
}

function fail(name: string, error: string, details?: any) {
  failCount++;
  failures.push({ test: name, error, details });
  console.error(`  [FAIL] ${name} -> ${error}`);
}

// ----------------------------------------------------------------------
// Test 1: Service Area Directory Inventory & File Completeness
// ----------------------------------------------------------------------
console.log('--- TEST 1: Service Area Directory Inventory & File Completeness ---');

assert.strictEqual(serviceAreas.length, 56, `Expected 56 service areas in serviceAreas.ts, got ${serviceAreas.length}`);
pass('Catalog Size', `56 service areas configured in serviceAreas.ts`);

const diskDirs = fs.readdirSync(SERVICE_AREA_DIST).filter((entry) => {
  return fs.statSync(path.join(SERVICE_AREA_DIST, entry)).isDirectory();
});

if (diskDirs.length !== 56) {
  fail('Disk Directory Count', `Expected 56 directories in dist/service-area, found ${diskDirs.length}`);
} else {
  pass('Disk Directory Count', `Exactly 56 directories present in dist/service-area/`);
}

// Check every slug matches
const catalogSlugs = new Set(serviceAreas.map((a) => a.slug));
const extraDirs = diskDirs.filter((d) => !catalogSlugs.has(d));
const missingDirs = serviceAreas.filter((a) => !diskDirs.includes(a.slug));

if (extraDirs.length > 0) {
  fail('Rogue Directories', `Found unexpected directories: ${extraDirs.join(', ')}`);
} else {
  pass('Zero Rogue Directories', `No extra directories in dist/service-area/`);
}

if (missingDirs.length > 0) {
  fail('Missing Directories', `Missing directories: ${missingDirs.map((a) => a.slug).join(', ')}`);
} else {
  pass('All Slugs Mapped to Disk', `All 56 service area slugs exist as directories on disk`);
}

// ----------------------------------------------------------------------
// Test 2: Empirical Inspection of All 56 HTML Documents
// ----------------------------------------------------------------------
console.log('\n--- TEST 2: Empirical Inspection of All 56 HTML Documents ---');

const REQUIRED_CLASS = 'aspect-[4/3] sm:aspect-video md:h-[340px]';
let missingResponsiveCount = 0;
let obsoleteHeightCount = 0;
let missingIframeCount = 0;
let missingLazyCount = 0;
let missingAllowFullscreenCount = 0;
let missingReferrerPolicyCount = 0;
let missingAbsoluteInsetCount = 0;
let missingGpsBadgeCount = 0;
let missingMapsLinkCount = 0;
let tagImbalanceCount = 0;

for (const area of serviceAreas) {
  const filePath = path.join(SERVICE_AREA_DIST, area.slug, 'index.html');
  if (!fs.existsSync(filePath)) {
    fail(`File Presence (${area.slug})`, `File does not exist: ${filePath}`);
    continue;
  }

  const stat = fs.statSync(filePath);
  if (stat.size < 10000) {
    fail(`File Size (${area.slug})`, `Suspiciously small HTML file: ${stat.size} bytes`);
  }

  const html = fs.readFileSync(filePath, 'utf-8');

  // Check 1: Responsive container class
  if (!html.includes(REQUIRED_CLASS)) {
    missingResponsiveCount++;
    fail(`Responsive Container (${area.slug})`, `Missing "${REQUIRED_CLASS}"`);
  }

  // Check 2: Obsolete height: 380px on map container
  if (html.includes('height: 380px') || html.includes('height:380px') || html.includes('height="380"')) {
    obsoleteHeightCount++;
    fail(`Obsolete Static Height (${area.slug})`, `Contains obsolete 380px height attribute/style`);
  }

  // Check 3: Google Maps iframe presence
  const expectedMapQuery = encodeURIComponent(area.name + ', FL');
  if (!html.includes(`https://maps.google.com/maps?q=${expectedMapQuery}`)) {
    missingIframeCount++;
    fail(`Map Iframe Target (${area.slug})`, `Iframe does not match expected query "${expectedMapQuery}"`);
  }

  // Check 4: Iframe attributes
  if (!html.includes('loading="lazy"')) {
    missingLazyCount++;
    fail(`Iframe Lazy Loading (${area.slug})`, `Missing loading="lazy"`);
  }
  if (!html.includes('allowfullscreen')) {
    missingAllowFullscreenCount++;
    fail(`Iframe Allowfullscreen (${area.slug})`, `Missing allowfullscreen`);
  }
  if (!html.includes('referrerpolicy="no-referrer-when-downgrade"')) {
    missingReferrerPolicyCount++;
    fail(`Iframe ReferrerPolicy (${area.slug})`, `Missing referrerpolicy="no-referrer-when-downgrade"`);
  }
  if (!html.includes('class="absolute inset-0 w-full h-full border-0"')) {
    missingAbsoluteInsetCount++;
    fail(`Iframe Absolute Inset (${area.slug})`, `Missing class="absolute inset-0 w-full h-full border-0"`);
  }

  // Check 5: GPS badge if area.geo exists
  if (area.geo) {
    const latStr = Number(area.geo.latitude).toFixed(4);
    const lngStr = Math.abs(Number(area.geo.longitude)).toFixed(4);
    if (!html.includes(latStr) || !html.includes(lngStr)) {
      missingGpsBadgeCount++;
      fail(`GPS Coordinates (${area.slug})`, `Missing expected coords ${latStr}° N, ${lngStr}° W`);
    }
  }

  // Check 6: External Google Maps link
  const expectedExtUrl = `https://maps.google.com/?q=${expectedMapQuery}`;
  if (!html.includes(expectedExtUrl)) {
    missingMapsLinkCount++;
    fail(`External Map Link (${area.slug})`, `Missing external link to ${expectedExtUrl}`);
  }

  // Check 7: Map embed div structure integrity
  const mapSectionStart = html.indexOf('<div class="service-area-map map-embed"');
  if (mapSectionStart === -1) {
    fail(`Map Embed Container (${area.slug})`, `Missing service-area-map container`);
  } else {
    // Count opening and closing <div> tags within the map-embed card
    const nextSectionStart = html.indexOf('Explore Other South Florida Service Areas', mapSectionStart);
    if (nextSectionStart !== -1) {
      const mapSnippet = html.substring(mapSectionStart, nextSectionStart);
      const openDivs = (mapSnippet.match(/<div\b/gi) || []).length;
      const closeDivs = (mapSnippet.match(/<\/div>/gi) || []).length;
      if (openDivs !== closeDivs) {
        tagImbalanceCount++;
        fail(`DOM Tag Balance (${area.slug})`, `Unbalanced div tags in map container: ${openDivs} open vs ${closeDivs} close`);
      }
    }
  }
}

if (missingResponsiveCount === 0) {
  pass('Universal Responsive Container', `All 56 service area pages contain "${REQUIRED_CLASS}"`);
}
if (obsoleteHeightCount === 0) {
  pass('Zero Obsolete 380px Artifacts', `Zero instances of obsolete 380px heights across all 56 pages`);
}
if (missingIframeCount === 0) {
  pass('Universal Dynamic Iframe Mapping', `All 56 service area pages contain correctly localized Google Maps URLs`);
}
if (missingLazyCount === 0 && missingAllowFullscreenCount === 0 && missingReferrerPolicyCount === 0) {
  pass('Iframe Security & Performance Attributes', `All 56 iframes have loading="lazy", allowfullscreen, and secure referrer policy`);
}
if (missingAbsoluteInsetCount === 0) {
  pass('Iframe Responsive Positioning', `All 56 iframes possess "absolute inset-0 w-full h-full border-0"`);
}
if (missingGpsBadgeCount === 0) {
  pass('GPS Coordinates Accuracy', `All service areas with geo metadata render accurate GPS coordinate badges`);
}
if (missingMapsLinkCount === 0) {
  pass('Direct External Maps Nav Link', `All 56 service areas include valid "Open in Google Maps" external navigation links`);
}
if (tagImbalanceCount === 0) {
  pass('HTML Structural Integrity', `All 56 map card containers have perfectly balanced HTML opening/closing tags`);
}

// ----------------------------------------------------------------------
// Test 3: React Component & Prerender Code Parity
// ----------------------------------------------------------------------
console.log('\n--- TEST 3: React Component & Prerender Script Parity ---');

const reactComponentFile = path.join(PROJECT_ROOT, 'src/components/service-areas/ServiceAreaMap.tsx');
const prerenderScriptFile = path.join(PROJECT_ROOT, 'scripts/prerender-routes.ts');

assert(fs.existsSync(reactComponentFile), 'ServiceAreaMap.tsx must exist');
assert(fs.existsSync(prerenderScriptFile), 'prerender-routes.ts must exist');

const reactCode = fs.readFileSync(reactComponentFile, 'utf-8');
const prerenderCode = fs.readFileSync(prerenderScriptFile, 'utf-8');

// Check class parity
assert(reactCode.includes(REQUIRED_CLASS), 'React component must include responsive class string');
assert(prerenderCode.includes(REQUIRED_CLASS), 'Prerender script must include responsive class string');
pass('React & Prerender Class Parity', `Both files contain exact string: "${REQUIRED_CLASS}"`);

// Check iframe classes
assert(reactCode.includes('absolute inset-0 w-full h-full border-0'), 'React component iframe must have responsive classes');
assert(prerenderCode.includes('absolute inset-0 w-full h-full border-0'), 'Prerender iframe must have responsive classes');
pass('React & Prerender Iframe Parity', 'Both files use "absolute inset-0 w-full h-full border-0"');

// Check URL query parity
assert(reactCode.includes('maps.google.com/maps?q='), 'React component constructs Google Maps URL');
assert(prerenderCode.includes('maps.google.com/maps?q='), 'Prerender script constructs Google Maps URL');
pass('Google Maps Embed URL Parity', 'Both use standard zero-API-key Google Maps query URL format');

// ----------------------------------------------------------------------
// Test 4: Adversarial Edge Cases
// ----------------------------------------------------------------------
console.log('\n--- TEST 4: Adversarial Edge Cases ---');

// Edge case 1: City with multi-word name and punctuation (e.g. "St. Lucie West", "Miami-Dade County")
const complexAreas = serviceAreas.filter((a) => a.name.includes(' ') || a.name.includes('-') || a.name.includes('.'));
assert(complexAreas.length > 20, 'Should have multiple complex city names');
for (const ca of complexAreas) {
  const html = fs.readFileSync(path.join(SERVICE_AREA_DIST, ca.slug, 'index.html'), 'utf-8');
  const encoded = encodeURIComponent(ca.name + ', FL');
  assert(html.includes(encoded), `Complex area ${ca.name} must have properly URI-encoded map URL`);
}
pass('URI Encoding Resilience', `Validated URL encoding across ${complexAreas.length} multi-word/punctuated city names`);

// Edge case 2: Check that no script tag or XSS injection exists in map parameters
for (const area of serviceAreas) {
  const html = fs.readFileSync(path.join(SERVICE_AREA_DIST, area.slug, 'index.html'), 'utf-8');
  assert(!html.includes('<script>'), `Area ${area.slug} must not contain unescaped script tag`);
  assert(!html.includes('javascript:'), `Area ${area.slug} must not contain javascript: pseudo-protocol`);
}
pass('XSS & Injection Immunity', `Zero script tags or pseudo-protocols detected in map embed markup`);

// ----------------------------------------------------------------------
// Summary
// ----------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`  HARNESS SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================');

if (failCount > 0) {
  console.log('\nFAILURES:');
  failures.forEach((f, idx) => console.log(`  ${idx + 1}. ${f.test}: ${f.error}`));
  process.exit(1);
} else {
  console.log('  ALL EMPIRICAL CHALLENGES PASSED WITH ZERO ERRORS.\n');
  process.exit(0);
}
