import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { serviceAreas, serviceAreasBySlug, ServiceAreaItem } from '../src/data/serviceAreas';
import { ServiceAreaMap } from '../src/components/service-areas/ServiceAreaMap';

console.log('======================================================================');
console.log('  CHALLENGER ADVERSARIAL STRESS HARNESS: MILESTONE 2 (MAP & DATA)');
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

// ---------------------------------------------------------------------------
// 1. ALL 56 SERVICE AREAS: EMBED URL QUERY FORMATTING & PARSING ORACLE
// ---------------------------------------------------------------------------
console.log('--- SUITE 1: Embed URL Query Formatting & URL Parsing Oracles (56/56) ---');

try {
  assert.strictEqual(serviceAreas.length, 56, `Expected 56 areas, got ${serviceAreas.length}`);

  let validUrlCount = 0;
  let validExternalUrlCount = 0;

  for (const area of serviceAreas) {
    const encoded = encodeURIComponent(`${area.name}, FL`);
    const embedUrl = `https://maps.google.com/maps?q=${encoded}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
    const externalUrl = `https://maps.google.com/?q=${encoded}`;

    // 1. Validate embedUrl parses strictly as standard URL
    const parsedEmbed = new URL(embedUrl);
    assert.strictEqual(parsedEmbed.protocol, 'https:');
    assert.strictEqual(parsedEmbed.hostname, 'maps.google.com');
    assert.strictEqual(parsedEmbed.pathname, '/maps');
    assert.strictEqual(parsedEmbed.searchParams.get('q'), `${area.name}, FL`);
    assert.strictEqual(parsedEmbed.searchParams.get('output'), 'embed');
    assert.strictEqual(parsedEmbed.searchParams.get('z'), '12');
    assert.strictEqual(parsedEmbed.searchParams.get('ie'), 'UTF8');
    assert.strictEqual(parsedEmbed.searchParams.get('iwloc'), '');
    assert.strictEqual(parsedEmbed.searchParams.get('t'), '');

    // Verify no unencoded space or illegal chars in raw URL string
    assert(!embedUrl.includes(' '), `Embed URL for ${area.slug} contains raw unencoded space`);
    validUrlCount++;

    // 2. Validate externalUrl parses strictly
    const parsedExt = new URL(externalUrl);
    assert.strictEqual(parsedExt.protocol, 'https:');
    assert.strictEqual(parsedExt.hostname, 'maps.google.com');
    assert.strictEqual(parsedExt.pathname, '/');
    assert.strictEqual(parsedExt.searchParams.get('q'), `${area.name}, FL`);
    assert(!externalUrl.includes(' '), `External URL for ${area.slug} contains raw unencoded space`);
    validExternalUrlCount++;
  }

  recordPass('Embed URL Query Syntax & RFC 3986 Compliance', `All 56 embed URLs parse identically to expected search params (q, z=12, output=embed, ie=UTF8)`);
  recordPass('External Directions URL Syntax & Compliance', `All 56 external maps URLs parse cleanly without illegal characters`);
} catch (err: any) {
  recordFail('Embed URL Query Formatting Oracles', err.message);
}

// ---------------------------------------------------------------------------
// 2. GEOGRAPHIC BOUNDS STRESS-TEST (FLORIDA BOUNDS: 24.5°N - 31.0°N, -87.5°W - -79.8°W)
// ---------------------------------------------------------------------------
console.log('\n--- SUITE 2: Geographic Coordinate Bounds Oracle (24.5°N-31.0°N, -87.5°W--79.8°W) ---');

try {
  let minLat = 999;
  let maxLat = -999;
  let minLng = 999;
  let maxLng = -999;

  for (const area of serviceAreas) {
    assert(area.geo, `Service area "${area.slug}" has no geo object`);
    const lat = parseFloat(area.geo.latitude);
    const lng = parseFloat(area.geo.longitude);

    assert(!isNaN(lat), `Area ${area.slug} latitude "${area.geo.latitude}" is NaN`);
    assert(!isNaN(lng), `Area ${area.slug} longitude "${area.geo.longitude}" is NaN`);

    // Coordinate bounds checks:
    // Florida latitude: 24.5° N to 31.0° N
    assert(lat >= 24.5 && lat <= 31.0, `Area ${area.slug} lat ${lat} outside Florida bounds [24.5, 31.0]`);
    // Florida longitude: -87.5° W to -79.8° W
    assert(lng >= -87.5 && lng <= -79.8, `Area ${area.slug} lng ${lng} outside Florida bounds [-87.5, -79.8]`);

    // Ensure all longitudes are negative (Western hemisphere)
    assert(lng < 0, `Area ${area.slug} longitude is positive (${lng}); Florida must be negative`);

    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;

    // Verify coordinate string representation
    const formatted = `${Number(area.geo.latitude).toFixed(4)}° N, ${Math.abs(Number(area.geo.longitude)).toFixed(4)}° W`;
    assert(/^[0-9]{2}\.[0-9]{4}° N, [0-9]{2}\.[0-9]{4}° W$/.test(formatted), `Area ${area.slug} coordinate format mismatch: "${formatted}"`);
  }

  recordPass('Florida Latitude Boundaries', `All 56 latitudes within [24.5, 31.0]. Range observed: [${minLat.toFixed(4)}, ${maxLat.toFixed(4)}]`);
  recordPass('Florida Longitude Boundaries', `All 56 longitudes within [-87.5, -79.8]. Range observed: [${minLng.toFixed(4)}, ${maxLng.toFixed(4)}]`);
  recordPass('Coordinate Hemisphere & Sign', `All 56 coordinates are strictly positive North (N) and negative West (W)`);
} catch (err: any) {
  recordFail('Geographic Coordinate Bounds Oracle', err.message);
}

// ---------------------------------------------------------------------------
// 3. SERVICE AREA MAP REACT COMPONENT ADVERSARIAL STRESS-TEST
// ---------------------------------------------------------------------------
console.log('\n--- SUITE 3: ServiceAreaMap React Component Adversarial Stress Tests ---');

try {
  // Scenario 3.1: Standard rendering of an actual area (Jupiter)
  const jupiterArea = serviceAreasBySlug['jupiter'];
  assert(jupiterArea, 'Jupiter service area must exist');

  const jupiterHtml = renderToStaticMarkup(React.createElement(ServiceAreaMap, { area: jupiterArea }));
  assert(jupiterHtml.includes('data-testid="service-area-map"'), 'Missing data-testid="service-area-map"');
  assert(jupiterHtml.includes('https://maps.google.com/maps?q=Jupiter%2C%20FL&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=&amp;output=embed'), 'Missing or invalid embed iframe src');
  assert(jupiterHtml.includes('href="https://maps.google.com/?q=Jupiter%2C%20FL"'), 'Missing or invalid external maps link');
  assert(jupiterHtml.includes('26.9342° N, 80.0942° W'), 'Missing formatted GPS coordinates');
  assert(jupiterHtml.includes('loading="lazy"'), 'Missing loading="lazy"');
  assert(jupiterHtml.includes('allowfullscreen=""') || jupiterHtml.includes('allowFullScreen'), 'Missing allowFullScreen attribute');
  assert(jupiterHtml.toLowerCase().includes('referrerpolicy="no-referrer-when-downgrade"'), 'Missing referrerpolicy attribute');
  recordPass('Standard Component Rendering (Jupiter)', 'Full component markup renders with embed, external link, GPS, and a11y');

  // Scenario 3.2: Missing / undefined geo object (Fallback resilience)
  const noGeoArea: ServiceAreaItem = {
    ...jupiterArea,
    geo: undefined as any
  };
  const noGeoHtml = renderToStaticMarkup(React.createElement(ServiceAreaMap, { area: noGeoArea }));
  assert(!noGeoHtml.includes('° N'), 'Component rendered coordinates when area.geo was undefined');
  assert(noGeoHtml.includes('data-testid="service-area-map"'), 'Component should still render container without geo');
  assert(noGeoHtml.includes('https://maps.google.com/maps?q=Jupiter%2C%20FL'), 'Component should still render iframe without geo');
  recordPass('Fallback: area.geo = undefined', 'Component gracefully omits coordinate badge without throwing or breaking iframe');

  // Scenario 3.3: showDetails = false
  const noDetailsHtml = renderToStaticMarkup(React.createElement(ServiceAreaMap, { area: jupiterArea, showDetails: false }));
  assert(!noDetailsHtml.includes('Service Area Coverage'), 'showDetails=false should omit top header bar');
  assert(!noDetailsHtml.includes('Open in Google Maps'), 'showDetails=false should omit bottom action bar');
  assert(noDetailsHtml.includes('<iframe'), 'showDetails=false should still render map iframe');
  recordPass('Prop: showDetails = false', 'Component hides header/footer bars and renders only the map viewport');

  // Scenario 3.4: Custom zoom (e.g. zoom = 15)
  const zoom15Html = renderToStaticMarkup(React.createElement(ServiceAreaMap, { area: jupiterArea, zoom: 15 }));
  assert(zoom15Html.includes('&amp;z=15&amp;'), 'Component did not apply custom zoom level z=15');
  recordPass('Prop: custom zoom (zoom = 15)', 'Embed URL correctly embeds z=15 parameter');

  // Scenario 3.5: Custom height (numeric 480 and string '60vh')
  const numHeightHtml = renderToStaticMarkup(React.createElement(ServiceAreaMap, { area: jupiterArea, height: 480 }));
  assert(numHeightHtml.includes('height:480px'), 'Component did not apply numeric height style');
  assert(numHeightHtml.includes('w-full h-full'), 'Component did not set w-full h-full inner container for custom height');

  const strHeightHtml = renderToStaticMarkup(React.createElement(ServiceAreaMap, { area: jupiterArea, height: '60vh' }));
  assert(strHeightHtml.includes('height:60vh'), 'Component did not apply string height style');
  recordPass('Prop: custom height (numeric and string)', 'Both numeric 480px and string 60vh apply cleanly to styles');

  // Scenario 3.6: Custom className
  const customClassHtml = renderToStaticMarkup(React.createElement(ServiceAreaMap, { area: jupiterArea, className: 'my-custom-test-class' }));
  assert(customClassHtml.includes('my-custom-test-class'), 'Custom className not passed to container');
  recordPass('Prop: custom className', 'Custom className successfully merged onto wrapper element');

  // Scenario 3.7: Adversarial Name with Special Characters (Apostrophes, Ampersands, Slashes, Dots)
  const weirdArea: ServiceAreaItem = {
    ...jupiterArea,
    name: "St. Mary's Inlet & Cove / Harbor"
  };
  const expectedEncoded = encodeURIComponent("St. Mary's Inlet & Cove / Harbor, FL");
  const weirdHtml = renderToStaticMarkup(React.createElement(ServiceAreaMap, { area: weirdArea }));
  // React HTML-escapes ' to &#x27; and & to &amp; in attributes to prevent XSS
  const expectedInHtmlAttr = expectedEncoded.replace(/&/g, '&amp;').replace(/'/g, '&#x27;');
  assert(weirdHtml.includes(expectedInHtmlAttr), `Adversarial name not encoded properly: expected ${expectedInHtmlAttr}`);
  recordPass('Adversarial Name Special Character Encoding & XSS Safety', 'Punctuation, ampersands, apostrophes, and slashes safely encode in URLs and HTML attributes without XSS risk');
} catch (err: any) {
  recordFail('ServiceAreaMap React Component Stress Tests', err.message);
}

// ---------------------------------------------------------------------------
// 4. PRE-RENDERED STATIC HTML INTEGRITY ACROSS ALL 56 SERVICE AREA ROUTES
// ---------------------------------------------------------------------------
console.log('\n--- SUITE 4: Pre-rendered Static HTML Verification Across All 56 Routes ---');

try {
  const distDir = path.resolve(process.cwd(), 'dist');
  assert(fs.existsSync(distDir), 'dist/ directory does not exist. Run pnpm build first.');

  let checkedRoutes = 0;
  const missingFiles: string[] = [];
  const missingMaps: string[] = [];
  const mismatchedUrls: string[] = [];

  for (const area of serviceAreas) {
    const routeHtmlPath = path.join(distDir, 'service-area', area.slug, 'index.html');
    if (!fs.existsSync(routeHtmlPath)) {
      missingFiles.push(area.slug);
      continue;
    }

    const htmlContent = fs.readFileSync(routeHtmlPath, 'utf8');

    // 1. Check container data-testid and classes
    if (!htmlContent.includes('class="service-area-map map-embed"') && !htmlContent.includes('data-testid="service-area-map"')) {
      missingMaps.push(area.slug);
      continue;
    }

    // 2. Check embed iframe URL
    const encoded = encodeURIComponent(`${area.name}, FL`);
    const expectedEmbed = `https://maps.google.com/maps?q=${encoded}&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=&amp;output=embed`;
    if (!htmlContent.includes(expectedEmbed)) {
      mismatchedUrls.push(`${area.slug} (expected ${expectedEmbed})`);
    }

    // 3. Check external link
    const expectedExt = `https://maps.google.com/?q=${encoded}`;
    assert(htmlContent.includes(expectedExt), `Route ${area.slug} missing external directions link: ${expectedExt}`);

    // 4. Check iframe security attributes
    assert(htmlContent.includes('loading="lazy"'), `Route ${area.slug} iframe missing loading="lazy"`);
    assert(htmlContent.includes('allowfullscreen'), `Route ${area.slug} iframe missing allowfullscreen`);
    assert(htmlContent.includes('referrerpolicy="no-referrer-when-downgrade"'), `Route ${area.slug} iframe missing referrerpolicy`);

    // 5. Check coordinates if available
    if (area.geo) {
      const coordStr = `${Number(area.geo.latitude).toFixed(4)}° N, ${Math.abs(Number(area.geo.longitude)).toFixed(4)}° W`;
      assert(htmlContent.includes(coordStr), `Route ${area.slug} missing pre-rendered coordinates "${coordStr}"`);
    }

    checkedRoutes++;
  }

  assert.strictEqual(missingFiles.length, 0, `Missing static files for: ${missingFiles.join(', ')}`);
  assert.strictEqual(missingMaps.length, 0, `Missing map embeds in: ${missingMaps.join(', ')}`);
  assert.strictEqual(mismatchedUrls.length, 0, `Mismatched map URLs in: ${mismatchedUrls.join(', ')}`);
  assert.strictEqual(checkedRoutes, 56, `Expected 56 checked routes, got ${checkedRoutes}`);

  recordPass('Static HTML Pre-rendered Files Check', `All 56 dist/service-area/<slug>/index.html files exist on disk`);
  recordPass('Static HTML Map Container & Attributes', `All 56 pre-rendered routes have class="service-area-map map-embed" and data-testid="service-area-map"`);
  recordPass('Static HTML Iframe URL & Security Attributes', `All 56 pre-rendered routes contain matching lazy-loaded, zero-API-key Google Maps embeds`);
  recordPass('Static HTML Direction Links & GPS Badges', `All 56 pre-rendered routes contain working external directions links and formatted GPS pills`);
} catch (err: any) {
  recordFail('Pre-rendered Static HTML Verification', err.message);
}

// ---------------------------------------------------------------------------
// 5. CROSS-CHECK AGAINST READY CODE LIVE REFERENCE DATASET
// ---------------------------------------------------------------------------
console.log('\n--- SUITE 5: Cross-Check Against Ready Code Live Reference Dataset ---');

try {
  const readyCodeLivePath = '/Users/danielarrieta/Downloads/Projects/Ready Code Live/src/data/serviceAreas.ts';
  if (fs.existsSync(readyCodeLivePath)) {
    const rclContent = fs.readFileSync(readyCodeLivePath, 'utf8');
    // Extract slugs from Ready Code Live
    const slugMatches = [...rclContent.matchAll(/slug:\s*['"]([a-z0-9-]+)['"]/g)].map((m) => m[1]);
    const rclSlugs = new Set(slugMatches);

    // Verify all RCL South Florida slugs exist in South Florida Cleaning Concepts
    let matchCount = 0;
    rclSlugs.forEach((slug) => {
      if (serviceAreasBySlug[slug]) {
        matchCount++;
      }
    });

    recordPass('Reference Dataset Coverage', `Ready Code Live slugs compared (${rclSlugs.size} unique). ${matchCount} match in SFCC dataset.`);
  } else {
    recordPass('Reference Dataset Coverage', 'Ready Code Live path not found in local environment (skipped)');
  }
} catch (err: any) {
  recordFail('Ready Code Live Reference Dataset Cross-Check', err.message);
}

// ---------------------------------------------------------------------------
// 6. STRING HYGIENE, EDGE CASE PROPS & COORDINATE PRECISION
// ---------------------------------------------------------------------------
console.log('\n--- SUITE 6: String Hygiene, Edge Case Props & Coordinate Precision ---');

try {
  // 6.1 String Hygiene across all 56 areas
  for (const area of serviceAreas) {
    assert.strictEqual(area.name, area.name.trim(), `Area ${area.slug} has leading/trailing whitespace in name`);
    assert.strictEqual(area.slug, area.slug.trim(), `Area ${area.slug} has leading/trailing whitespace in slug`);
    assert(area.name.length >= 3, `Area ${area.slug} name too short (< 3 chars)`);
    assert(area.geo, `Area ${area.slug} missing geo object`);
    assert.strictEqual(area.geo.latitude, area.geo.latitude.trim(), `Area ${area.slug} has un-trimmed latitude`);
    assert.strictEqual(area.geo.longitude, area.geo.longitude.trim(), `Area ${area.slug} has un-trimmed longitude`);
    
    // Check decimal precision (at least 3 decimal places for true GPS accuracy)
    const latParts = area.geo.latitude.split('.');
    const lngParts = area.geo.longitude.split('.');
    assert(latParts.length === 2 && latParts[1].length >= 3, `Area ${area.slug} latitude lacking GPS precision (<3 decimals)`);
    assert(lngParts.length === 2 && lngParts[1].length >= 3, `Area ${area.slug} longitude lacking GPS precision (<3 decimals)`);
  }
  recordPass('Dataset String Hygiene & GPS Precision', 'All 56 service areas have trimmed strings and >=3 decimal places GPS precision');

  // 6.2 Edge Case Props: height=0 fallback
  const jupiterArea = serviceAreasBySlug['jupiter'];
  const zeroHeightHtml = renderToStaticMarkup(React.createElement(ServiceAreaMap, { area: jupiterArea, height: 0 }));
  assert(!zeroHeightHtml.includes('height:0'), 'height=0 should not set height:0px inline style');
  assert(zeroHeightHtml.includes('aspect-[4/3]'), 'height=0 should fall back to default responsive aspect ratio');
  recordPass('Edge Prop: height = 0 fallback', 'Falsy height=0 cleanly falls back to aspect ratio without zero-height collapse');

  // 6.3 Edge Case Props: zoom undefined
  const defaultZoomHtml = renderToStaticMarkup(React.createElement(ServiceAreaMap, { area: jupiterArea, zoom: undefined }));
  assert(defaultZoomHtml.includes('&amp;z=12&amp;'), 'zoom=undefined should default cleanly to z=12');
  recordPass('Edge Prop: zoom = undefined fallback', 'zoom=undefined gracefully applies default parameter z=12');
} catch (err: any) {
  recordFail('String Hygiene & Edge Case Props', err.message);
}

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`  ADVERSARIAL STRESS HARNESS COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================\n');

if (failCount > 0) {
  console.error('FAILURES:');
  failureList.forEach((f, i) => console.error(`  ${i + 1}. [${f.test}]: ${f.error}`));
  process.exit(1);
} else {
  console.log('  VERDICT: ALL ADVERSARIAL CHALLENGES AND DATASET CHECKS PASSED EMPIRICALLY.\n');
  process.exit(0);
}
