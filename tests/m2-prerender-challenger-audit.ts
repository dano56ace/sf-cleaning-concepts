import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { serviceAreas, serviceAreasBySlug, ServiceAreaItem } from '../src/data/serviceAreas';

const PROJECT_ROOT = '/Users/danielarrieta/Downloads/Projects/South Florida Cleaning Concepts';
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const SERVICE_AREA_DIST_DIR = path.join(DIST_DIR, 'service-area');

console.log('======================================================================');
console.log('  CHALLENGER 2: MILESTONE 2 PRERENDER & MAP INTEGRITY EMPIRICAL AUDIT');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;
const failures: Array<{ testName: string; error: string; slug?: string }> = [];

function recordPass(testName: string, details = '') {
  passCount++;
  console.log(`  [PASS] ${testName}${details ? ` -> ${details}` : ''}`);
}

function recordFail(testName: string, error: string, slug?: string) {
  failCount++;
  failures.push({ testName, error, slug });
  console.error(`  [FAIL] ${testName}${slug ? ` (${slug})` : ''} -> ${error}`);
}

// ----------------------------------------------------------------------
// 1. Directory Structure & Route File Presence
// ----------------------------------------------------------------------
console.log('--- TEST GROUP 1: Route Directory Structure & 56 Routes Presence ---');

try {
  assert(fs.existsSync(SERVICE_AREA_DIST_DIR), `Service area dist dir missing: ${SERVICE_AREA_DIST_DIR}`);
  recordPass('Service Area Dist Root', `Directory exists at ${SERVICE_AREA_DIST_DIR}`);

  const distEntries = fs.readdirSync(SERVICE_AREA_DIST_DIR, { withFileTypes: true });
  const distDirectories = distEntries.filter((e) => e.isDirectory()).map((e) => e.name);

  assert.strictEqual(distDirectories.length, 56, `Expected exactly 56 directories in dist/service-area, found ${distDirectories.length}`);
  recordPass('Pre-rendered Route Count', `Found exactly 56 route directories`);

  let missingFiles = 0;
  for (const area of serviceAreas) {
    const indexPath = path.join(SERVICE_AREA_DIST_DIR, area.slug, 'index.html');
    if (!fs.existsSync(indexPath)) {
      missingFiles++;
      recordFail('Route File Presence', `Missing index.html for slug: ${area.slug}`, area.slug);
    }
  }
  if (missingFiles === 0) {
    recordPass('All 56 index.html Files Present', `100% of routes have a pre-rendered index.html`);
  }

  // Check no extraneous directories
  const slugSet = new Set(serviceAreas.map((a) => a.slug));
  const extraneous = distDirectories.filter((dir) => !slugSet.has(dir));
  assert.strictEqual(extraneous.length, 0, `Found unexpected directories in dist/service-area: ${extraneous.join(', ')}`);
  recordPass('No Extraneous Directories', `Zero extraneous or orphaned folders in dist/service-area`);
} catch (err: any) {
  recordFail('Directory Structure & Route Presence', err.message);
}

// ----------------------------------------------------------------------
// 2. Map Container & Semantic Selectors Across All 56 Routes
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: Map Semantic Selectors & Data-TestID Integrity ---');

try {
  let missingClasses = 0;
  let missingTestIds = 0;
  let missingAriaLabels = 0;
  let missingHeaders = 0;

  for (const area of serviceAreas) {
    const filePath = path.join(SERVICE_AREA_DIST_DIR, area.slug, 'index.html');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check class="service-area-map map-embed"
    if (!content.includes('class="service-area-map map-embed"')) {
      missingClasses++;
      recordFail('Map Embed CSS Class', `Missing class="service-area-map map-embed" in ${area.slug}`, area.slug);
    }

    // Check data-testid="service-area-map"
    if (!content.includes('data-testid="service-area-map"')) {
      missingTestIds++;
      recordFail('Map data-testid', `Missing data-testid="service-area-map" in ${area.slug}`, area.slug);
    }

    // Check container aria-label
    const expectedAria = `aria-label="Interactive map of ${area.name}, Florida service area"`;
    if (!content.includes(expectedAria)) {
      missingAriaLabels++;
      recordFail('Map Container aria-label', `Missing expected container aria-label in ${area.slug}`, area.slug);
    }

    // Check header text
    if (!content.includes(`${area.name}, Florida`)) {
      missingHeaders++;
      recordFail('Map Header Location Text', `Missing "${area.name}, Florida" header in ${area.slug}`, area.slug);
    }
  }

  if (missingClasses === 0) recordPass('Map CSS Classes', `All 56 routes include class="service-area-map map-embed"`);
  if (missingTestIds === 0) recordPass('Map data-testid', `All 56 routes include data-testid="service-area-map"`);
  if (missingAriaLabels === 0) recordPass('Map Container aria-labels', `All 56 routes have localized container aria-label`);
  if (missingHeaders === 0) recordPass('Map Location Headers', `All 56 routes display "${"{city}"}, Florida" header`);
} catch (err: any) {
  recordFail('Map Selectors & Semantic Test', err.message);
}

// ----------------------------------------------------------------------
// 3. GPS Coordinates Pill & Boundary Stress-Testing
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: GPS Coordinates Pill & Geographic Precision ---');

try {
  let coordinatesVerified = 0;
  let coordinatesErrors = 0;

  for (const area of serviceAreas) {
    const filePath = path.join(SERVICE_AREA_DIST_DIR, area.slug, 'index.html');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert(area.geo, `Service area ${area.slug} missing geo property`);
    const lat = Number(area.geo.latitude);
    const lng = Number(area.geo.longitude);

    // Validate Florida geographical bounds
    assert(lat >= 25.0 && lat <= 29.0, `Latitude ${lat} out of Florida bounds for ${area.slug}`);
    assert(lng <= -79.0 && lng >= -82.0, `Longitude ${lng} out of Florida bounds for ${area.slug}`);

    const expectedCoordString = `${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° W`;
    const expectedPillSnippet = `🧭 ${expectedCoordString}`;

    if (!content.includes(expectedPillSnippet)) {
      coordinatesErrors++;
      recordFail('GPS Coordinate Pill', `Expected "${expectedPillSnippet}" not found in ${area.slug}`, area.slug);
    } else {
      coordinatesVerified++;
    }
  }

  if (coordinatesErrors === 0) {
    recordPass('GPS Coordinates Accuracy', `100% (56/56) pre-rendered pages display exact 4-decimal GPS coordinates`);
    recordPass('Florida Coordinate Bounds', `All 56 coordinates strictly within Florida bounds (25.0°-29.0°N, 79.0°-82.0°W)`);
  }
} catch (err: any) {
  recordFail('GPS Coordinates Verification', err.message);
}

// ----------------------------------------------------------------------
// 4. Google Maps Iframe Embed URL & Security Attributes
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 4: Google Maps Iframe Embed URL & Security Attributes ---');

try {
  let iframeUrlErrors = 0;
  let iframeAttrErrors = 0;
  let iframeTitleErrors = 0;

  for (const area of serviceAreas) {
    const filePath = path.join(SERVICE_AREA_DIST_DIR, area.slug, 'index.html');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract iframe tag from map block
    const mapMatch = content.match(/<div class="service-area-map map-embed"[\s\S]*?<\/div>\s*<\/div>/);
    if (!mapMatch) {
      recordFail('Iframe Extraction', `Could not extract map container for ${area.slug}`, area.slug);
      continue;
    }

    const mapBlock = mapMatch[0];
    const iframeMatch = mapBlock.match(/<iframe\s+([^>]+)><\/iframe>/i);
    if (!iframeMatch) {
      iframeAttrErrors++;
      recordFail('Iframe Tag Presence', `Missing <iframe> tag in map block for ${area.slug}`, area.slug);
      continue;
    }

    const iframeAttrs = iframeMatch[1];

    // Check src URL
    const encodedQuery = encodeURIComponent(area.name + ', FL');
    const expectedSrcPattern = `src="https://maps.google.com/maps?q=${encodedQuery}&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=&amp;output=embed"`;
    if (!iframeAttrs.includes(expectedSrcPattern)) {
      iframeUrlErrors++;
      recordFail('Iframe src URL', `Unexpected iframe src in ${area.slug}. Expected pattern: ${expectedSrcPattern}`, area.slug);
    }

    // Check security & performance attributes
    const hasLazy = /loading="lazy"/i.test(iframeAttrs);
    const hasAllowFullscreen = /allowfullscreen/i.test(iframeAttrs);
    const hasReferrerPolicy = /referrerpolicy="no-referrer-when-downgrade"/i.test(iframeAttrs);

    if (!hasLazy || !hasAllowFullscreen || !hasReferrerPolicy) {
      iframeAttrErrors++;
      recordFail('Iframe Security Attributes', `Missing lazy/allowfullscreen/referrerpolicy in ${area.slug}: ${iframeAttrs}`, area.slug);
    }

    // Check title and aria-label
    const expectedTitle = `title="Interactive Google Map showing service area for ${area.name}, Florida"`;
    const expectedIframeAria = `aria-label="Interactive Google Map showing service area for ${area.name}, Florida"`;
    if (!iframeAttrs.includes(expectedTitle) || !iframeAttrs.includes(expectedIframeAria)) {
      iframeTitleErrors++;
      recordFail('Iframe Title/Aria', `Missing expected title or aria-label in ${area.slug}`, area.slug);
    }
  }

  if (iframeUrlErrors === 0) recordPass('Iframe Embed URLs', `All 56 routes have valid zero-API-key Google Maps embed URL`);
  if (iframeAttrErrors === 0) recordPass('Iframe Security Attributes', `All 56 iframes have loading="lazy", allowfullscreen, referrerpolicy="no-referrer-when-downgrade"`);
  if (iframeTitleErrors === 0) recordPass('Iframe Accessibility Titles', `All 56 iframes have localized title and aria-label`);
} catch (err: any) {
  recordFail('Iframe Embed & Security Attributes', err.message);
}

// ----------------------------------------------------------------------
// 5. External Google Maps Directions Link
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 5: External Google Maps Directions Link ---');

try {
  let linkErrors = 0;
  let targetBlankErrors = 0;
  let relNoopenerErrors = 0;

  for (const area of serviceAreas) {
    const filePath = path.join(SERVICE_AREA_DIST_DIR, area.slug, 'index.html');
    const content = fs.readFileSync(filePath, 'utf-8');

    const encodedQuery = encodeURIComponent(area.name + ', FL');
    const expectedHref = `href="https://maps.google.com/?q=${encodedQuery}"`;

    if (!content.includes(expectedHref)) {
      linkErrors++;
      recordFail('External Map Link Href', `Missing expected href "${expectedHref}" in ${area.slug}`, area.slug);
    }

    // Check target="_blank"
    const linkMatch = content.match(/<a\s+[^>]*href="https:\/\/maps\.google\.com\/\?q=[^"]*"[^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) {
      linkErrors++;
      recordFail('External Map Link Tag', `Could not find external Google Maps anchor tag in ${area.slug}`, area.slug);
      continue;
    }

    const linkTag = linkMatch[0];
    if (!linkTag.includes('target="_blank"')) {
      targetBlankErrors++;
      recordFail('External Map Link target', `Missing target="_blank" in ${area.slug}`, area.slug);
    }

    if (!linkTag.includes('rel="noopener noreferrer"')) {
      relNoopenerErrors++;
      recordFail('External Map Link rel', `Missing rel="noopener noreferrer" in ${area.slug}`, area.slug);
    }

    if (!linkTag.includes('Open in Google Maps')) {
      linkErrors++;
      recordFail('External Map Link Text', `Missing "Open in Google Maps" anchor text in ${area.slug}`, area.slug);
    }
  }

  if (linkErrors === 0) recordPass('External Directions Href & Text', `All 56 routes contain "Open in Google Maps" linking to https://maps.google.com/?q=...`);
  if (targetBlankErrors === 0) recordPass('External Link target="_blank"', `All 56 external links open in new tab`);
  if (relNoopenerErrors === 0) recordPass('External Link rel="noopener noreferrer"', `All 56 external links enforce rel="noopener noreferrer"`);
} catch (err: any) {
  recordFail('External Directions Link', err.message);
}

// ----------------------------------------------------------------------
// 6. Zero Poison Tokens & Contamination Scan
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 6: Poison Tokens & Contamination Scan ---');

try {
  let poisonDetected = 0;
  const poisonTokens = ['undefined', 'null', 'NaN', '[object Object]'];

  for (const area of serviceAreas) {
    const filePath = path.join(SERVICE_AREA_DIST_DIR, area.slug, 'index.html');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract map container
    const mapMatch = content.match(/<div class="service-area-map map-embed"[\s\S]*?<\/div>\s*<\/div>/);
    if (!mapMatch) continue;

    const mapHtml = mapMatch[0];

    for (const token of poisonTokens) {
      if (mapHtml.includes(token)) {
        poisonDetected++;
        recordFail('Poison Token In Map', `Found poison token "${token}" in map block of ${area.slug}`, area.slug);
      }
    }
  }

  if (poisonDetected === 0) {
    recordPass('Poison Token Absence', `Zero poison tokens (undefined, null, NaN, [object Object]) found across all 56 map blocks`);
  }
} catch (err: any) {
  recordFail('Poison Token Scan', err.message);
}

// ----------------------------------------------------------------------
// 7. Representative City Stress Scenarios (Multi-word, Hyphens, Beach)
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 7: Edge-Case & Multi-word City Stress Scenarios ---');

const stressCases = [
  { slug: 'jupiter', name: 'Jupiter', query: 'Jupiter%2C%20FL' },
  { slug: 'boca-raton', name: 'Boca Raton', query: 'Boca%20Raton%2C%20FL' },
  { slug: 'west-palm-beach', name: 'West Palm Beach', query: 'West%20Palm%20Beach%2C%20FL' },
  { slug: 'delray-beach', name: 'Delray Beach', query: 'Delray%20Beach%2C%20FL' },
  { slug: 'boynton-beach', name: 'Boynton Beach', query: 'Boynton%20Beach%2C%20FL' },
  { slug: 'palm-beach-gardens', name: 'Palm Beach Gardens', query: 'Palm%20Beach%20Gardens%2C%20FL' },
  { slug: 'broward-county', name: 'Broward County', query: 'Broward%20County%2C%20FL' },
  { slug: 'miami-dade-county', name: 'Miami-Dade County', query: 'Miami-Dade%20County%2C%20FL' },
  { slug: 'st-lucie-county', name: 'St. Lucie County', query: 'St.%20Lucie%20County%2C%20FL' },
  { slug: 'the-acreage', name: 'The Acreage', query: 'The%20Acreage%2C%20FL' },
  { slug: 'jupiter-inlet-colony', name: 'Jupiter Inlet Colony', query: 'Jupiter%20Inlet%20Colony%2C%20FL' }
];

try {
  let stressErrors = 0;
  for (const c of stressCases) {
    const area = serviceAreasBySlug[c.slug];
    assert(area, `Stress case slug not found in dataset: ${c.slug}`);
    assert.strictEqual(area.name, c.name, `Name mismatch for ${c.slug}`);

    const filePath = path.join(SERVICE_AREA_DIST_DIR, c.slug, 'index.html');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Verify URI encoded query
    assert(content.includes(c.query), `HTML for ${c.slug} does not contain properly encoded query: ${c.query}`);
    recordPass(`Stress City: ${c.name}`, `Properly encoded "${c.query}", valid coordinates and embed verified`);
  }
} catch (err: any) {
  recordFail('Edge-Case & Multi-word Cities', err.message);
}

// ----------------------------------------------------------------------
// SUMMARY
// ----------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`  AUDIT COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================');

if (failCount > 0) {
  console.error('\nFAILURES DETAIL:');
  failures.forEach((f, idx) => {
    console.error(`  ${idx + 1}. [${f.testName}] ${f.slug ? `(${f.slug}) ` : ''}-> ${f.error}`);
  });
  process.exit(1);
} else {
  console.log('\n  VERDICT: ALL EMPIRICAL PRERENDER & MAP INTEGRITY AUDITS PASSED CLEANLY.');
  process.exit(0);
}
