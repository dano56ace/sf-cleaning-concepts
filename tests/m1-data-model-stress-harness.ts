/**
 * ══════════════════════════════════════════════════════════════════════════
 * Milestone 1 Empirical Stress Test Harness & Adversarial Oracle
 * South Florida Cleaning Concepts — Data Models, Service Areas & Archetypes
 *
 * Target: All 56 South Florida service areas extending north through Jupiter
 * Validates:
 *  1. 100% Data Presence & Schema Integrity across all 56 locations
 *  2. Dictionary Parity & Zero Drift (SERVICE_AREA_STATS, SERVICE_AREA_GUIDES)
 *  3. Archetype Fallback & Generator Verification (Coastal, Western, Golf, Transit)
 *  4. Boundary Cities & Special Slugs (Jupiter, Tequesta, Avenir, Westlake, Miami-Dade, etc.)
 *  5. Adversarial Slug Resolution, Path Traversal & Prototype Pollution Defenses
 *  6. Full React SSR renderToString execution on all 56 areas
 *  7. Prerendered Static HTML Files & Directory Card Parity in dist/
 * ══════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { serviceAreas, serviceAreasBySlug, type ServiceAreaItem } from '../src/data/serviceAreas';
import {
  SERVICE_AREA_STATS,
  SERVICE_AREA_GUIDES,
  getFallbackStats,
  getServiceAreaGuide
} from '../src/data/serviceAreaGuideData';
import { ServiceAreaLocalGuide } from '../src/components/service-areas/ServiceAreaLocalGuide';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

console.log('══════════════════════════════════════════════════════════════════════');
console.log('  EMPIRICAL CHALLENGER: M1 DATA MODELS & SERVICE AREAS STRESS HARNESS ');
console.log('══════════════════════════════════════════════════════════════════════\n');

let passCount = 0;
let failCount = 0;
const failures: Array<{ testName: string; error: string }> = [];

function recordPass(testName: string, details = '') {
  passCount++;
  console.log(`  [PASS] ${testName}${details ? ` -> ${details}` : ''}`);
}

function recordFail(testName: string, error: string) {
  failCount++;
  failures.push({ testName, error });
  console.error(`  [FAIL] ${testName} -> ${error}`);
}

// ----------------------------------------------------------------------
// GROUP 1: Exhaustive Data Presence & Schema Integrity (All 56 areas)
// ----------------------------------------------------------------------
console.log('--- TEST GROUP 1: Exhaustive Data Presence & Schema Integrity (56/56) ---');

try {
  assert.strictEqual(serviceAreas.length, 56, `Expected exactly 56 service areas, got ${serviceAreas.length}`);
  recordPass('Service Area Catalog Size', 'Exactly 56 service areas defined');

  const uniqueSlugs = new Set(serviceAreas.map(a => a.slug));
  assert.strictEqual(uniqueSlugs.size, 56, `Expected 56 unique slugs, found ${uniqueSlugs.size}`);
  recordPass('Slug Uniqueness', 'All 56 slugs are distinct with zero collisions');

  const uniqueNames = new Set(serviceAreas.map(a => a.name));
  assert.strictEqual(uniqueNames.size, 56, `Expected 56 unique city names, found ${uniqueNames.size}`);
  recordPass('Name Uniqueness', 'All 56 municipal names are distinct');

  serviceAreas.forEach((area, index) => {
    const prefix = `[${index + 1}/56] ${area.slug}`;

    // 1. Core identification
    assert(area.name && typeof area.name === 'string', `${prefix}: missing name`);
    assert(area.slug && typeof area.slug === 'string', `${prefix}: missing slug`);
    assert(area.seoTitle && typeof area.seoTitle === 'string', `${prefix}: missing seoTitle`);
    assert(area.metaDescription && typeof area.metaDescription === 'string', `${prefix}: missing metaDescription`);

    // 2. Geo coordinates
    assert(area.geo, `${prefix}: missing geo`);
    const lat = Number(area.geo.latitude);
    const lon = Number(area.geo.longitude);
    assert(!isNaN(lat) && lat >= 25.0 && lat <= 29.0, `${prefix}: latitude out of range: ${lat}`);
    assert(!isNaN(lon) && lon >= -82.0 && lon <= -79.0, `${prefix}: longitude out of range: ${lon}`);

    // 3. Stats Object & Fields
    assert(area.stats, `${prefix}: missing stats object`);
    const s = area.stats;
    assert(typeof s.population === 'string' && s.population.trim().length > 0, `${prefix}: invalid population`);
    assert(/\d/.test(s.population), `${prefix}: population missing digits: ${s.population}`);

    assert(typeof s.households === 'string' && s.households.trim().length > 0, `${prefix}: invalid households`);
    assert(/\d/.test(s.households), `${prefix}: households missing digits: ${s.households}`);

    assert(typeof s.landArea === 'string' && s.landArea.trim().length > 0, `${prefix}: invalid landArea`);
    assert(s.landArea.includes('sq mi'), `${prefix}: landArea missing 'sq mi': ${s.landArea}`);

    assert(typeof s.commercialGrowth === 'string' && s.commercialGrowth.trim().length >= 20, `${prefix}: commercialGrowth too brief: ${s.commercialGrowth}`);
    assert(typeof s.geographyType === 'string' && s.geographyType.trim().length >= 10, `${prefix}: geographyType too brief: ${s.geographyType}`);

    // 4. Content Arrays
    assert(Array.isArray(area.highlights) && area.highlights.length >= 3, `${prefix}: highlights < 3`);
    assert(Array.isArray(area.neighborhoods) && area.neighborhoods.length >= 3, `${prefix}: neighborhoods < 3`);
    assert(Array.isArray(area.landmarks) && area.landmarks.length >= 3, `${prefix}: landmarks < 3`);
    assert(Array.isArray(area.thingsToDo) && area.thingsToDo.length >= 3, `${prefix}: thingsToDo < 3`);
    assert(Array.isArray(area.keyCorridors) && area.keyCorridors.length >= 3, `${prefix}: keyCorridors < 3`);
    assert(Array.isArray(area.topIndustries) && area.topIndustries.length >= 3, `${prefix}: topIndustries < 3`);
    assert(typeof area.marketInsight === 'string' && area.marketInsight.trim().length >= 50, `${prefix}: marketInsight too brief`);
  });

  recordPass('Full Field Schema Integrity', 'All 56 service areas pass 100% field assertions');
} catch (err: any) {
  recordFail('Exhaustive Data Presence', err.message);
}

// ----------------------------------------------------------------------
// GROUP 2: Dictionary Parity & Zero Drift
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: Dictionary Parity & Zero Drift ---');

try {
  const statsKeys = Object.keys(SERVICE_AREA_STATS);
  assert.strictEqual(statsKeys.length, 56, `Expected 56 keys in SERVICE_AREA_STATS, got ${statsKeys.length}`);
  recordPass('SERVICE_AREA_STATS Key Count', 'Exactly 56 keys in statistics dictionary');

  const missingFromStats = serviceAreas.filter(a => !SERVICE_AREA_STATS[a.slug]);
  assert.strictEqual(missingFromStats.length, 0, `Missing stats for: ${missingFromStats.map(m => m.slug).join(', ')}`);
  recordPass('Stats Dictionary Coverage', '100% of service areas are keyed in SERVICE_AREA_STATS');

  const saSlugsSet = new Set(serviceAreas.map(a => a.slug));
  const orphanStatsKeys = statsKeys.filter(k => !saSlugsSet.has(k));
  assert.strictEqual(orphanStatsKeys.length, 0, `Orphan stats keys found: ${orphanStatsKeys.join(', ')}`);
  recordPass('Zero Orphan Stats Keys', 'No dead or unreferenced keys in SERVICE_AREA_STATS');

  const guideKeys = Object.keys(SERVICE_AREA_GUIDES);
  assert.strictEqual(guideKeys.length, 25, `Expected 25 direct guides, got ${guideKeys.length}`);
  recordPass('Direct Guide Inventory', '25 curated municipal guides in SERVICE_AREA_GUIDES');

  const fallbackCount = serviceAreas.filter(a => !SERVICE_AREA_GUIDES[a.slug]).length;
  assert.strictEqual(fallbackCount, 31, `Expected 31 fallback archetype destinations, got ${fallbackCount}`);
  recordPass('Fallback Archetype Count', '31 secondary communities routed to demographic archetypes');
} catch (err: any) {
  recordFail('Dictionary Parity', err.message);
}

// ----------------------------------------------------------------------
// GROUP 3: Fallback Archetype Generator & Routing Oracle
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: Fallback Archetype Generator & Routing Oracle ---');

try {
  const archetypes = [
    { type: 'coastal', slug: 'highland-beach', name: 'Highland Beach' },
    { type: 'western', slug: 'the-acreage', name: 'The Acreage' },
    { type: 'golfClub', slug: 'kings-point', name: 'Kings Point' },
    { type: 'transitSuburban', slug: 'schall-circle', name: 'Schall Circle' }
  ];

  for (const arch of archetypes) {
    const rawItem: ServiceAreaItem = {
      name: arch.name,
      slug: arch.slug,
      seoTitle: `${arch.name} Cleaning`,
      metaDescription: `Cleaning in ${arch.name}`,
      geo: { latitude: '26.5', longitude: '-80.1' },
      description: `Test description for ${arch.name}`,
      highlights: ['H1', 'H2', 'H3'],
      neighborhoods: ['Quarter 1', 'Quarter 2', 'Quarter 3'],
      marketInsight: 'Market insight with plenty of characters exceeding fifty characters in length.'
    };

    // 1. Test getFallbackStats directly
    const fallbackStats = getFallbackStats(rawItem);
    assert(fallbackStats.population, `${arch.type}: fallback missing population`);
    assert(fallbackStats.households, `${arch.type}: fallback missing households`);
    assert(fallbackStats.landArea, `${arch.type}: fallback missing landArea`);
    assert(fallbackStats.commercialGrowth, `${arch.type}: fallback missing commercialGrowth`);
    assert(fallbackStats.geographyType, `${arch.type}: fallback missing geographyType`);

    // 2. Test getServiceAreaGuide fallback generation
    const guide = getServiceAreaGuide(rawItem);
    assert(guide.stats, `${arch.type}: guide missing stats`);
    assert(Array.isArray(guide.landmarks) && guide.landmarks.length >= 3, `${arch.type}: guide missing landmarks`);
    assert(Array.isArray(guide.thingsToDo) && guide.thingsToDo.length >= 3, `${arch.type}: guide missing thingsToDo`);
    assert(Array.isArray(guide.keyCorridors) && guide.keyCorridors.length >= 3, `${arch.type}: guide missing keyCorridors`);
    assert(Array.isArray(guide.topIndustries) && guide.topIndustries.length >= 3, `${arch.type}: guide missing topIndustries`);

    recordPass(`Archetype Branch: ${arch.type} (${arch.slug})`, `Stats: ${fallbackStats.population} · Land: ${fallbackStats.landArea}`);
  }

  // Edge case: synthetic area with empty neighborhoods array
  const emptyNeighborhoodsArea: ServiceAreaItem = {
    name: 'Synthetic Metro',
    slug: 'synthetic-metro-unique-slug',
    seoTitle: 'Synthetic Metro Title',
    metaDescription: 'Synthetic Metro Meta Description',
    geo: { latitude: '26.7', longitude: '-80.1' },
    description: 'Synthetic Metro description text',
    highlights: ['H1', 'H2', 'H3'],
    neighborhoods: [],
    marketInsight: 'Synthetic market insight text of sufficient length.'
  };

  const syntheticGuide = getServiceAreaGuide(emptyNeighborhoodsArea);
  assert(syntheticGuide.stats, 'Synthetic guide missing stats');
  assert(syntheticGuide.keyCorridors.includes('Synthetic Metro'), 'Synthetic guide did not fallback to area.name in corridors');
  recordPass('Empty Neighborhoods Fallback', 'Gracefully used area.name as primary corridor anchor');
} catch (err: any) {
  recordFail('Fallback Archetype Generator', err.message);
}

// ----------------------------------------------------------------------
// GROUP 4: Boundary Cities & Special Slugs Deep Dive
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 4: Boundary Cities & Special Slugs Deep Dive ---');

try {
  const boundaryCases = [
    { slug: 'jupiter', expectedPop: '61,047', expectedLand: '21.60 sq mi', role: 'Northernmost Anchor City' },
    { slug: 'tequesta', expectedPop: '6,158', expectedLand: '1.80 sq mi', role: 'Northern Boundary Village' },
    { slug: 'jupiter-inlet-colony', expectedPop: '405', expectedLand: '0.20 sq mi', role: 'Coastal Inlet Barrier Enclave' },
    { slug: 'miami-dade-county', expectedPop: '2,701,767', expectedLand: '1,898.00 sq mi', role: 'Southern Regional County' },
    { slug: 'broward-county', expectedPop: '1,947,026', expectedLand: '1,210.00 sq mi', role: 'Central Regional County' },
    { slug: 'westlake', expectedPop: '6,500', expectedLand: '6.50 sq mi', role: 'Western Master-Planned Municipality' },
    { slug: 'avenir', expectedPop: '5,200', expectedLand: '7.50 sq mi', role: 'Western Agrihood & PBG Extension' },
    { slug: 'arden', expectedPop: '4,800', expectedLand: '1.90 sq mi', role: 'Western Organic Farm Agrihood' },
    { slug: 'the-acreage', expectedPop: '39,000', expectedLand: '40.50 sq mi', role: 'Western Residential Acreage' },
    { slug: 'briny-breezes', expectedPop: '502', expectedLand: '0.10 sq mi', role: 'Smallest Coastal Municipality' },
    { slug: 'golf', expectedPop: '255', expectedLand: '0.80 sq mi', role: 'Historic Country Club Village' },
    { slug: 'century-village', expectedPop: '17,250', expectedLand: '2.10 sq mi', role: '55+ Active-Adult Enclave' },
    { slug: 'kings-point', expectedPop: '15,200', expectedLand: '1.80 sq mi', role: 'Delray 55+ Active-Adult Enclave' }
  ];

  for (const bc of boundaryCases) {
    const area = serviceAreasBySlug[bc.slug];
    assert(area, `Boundary area missing from serviceAreasBySlug: ${bc.slug}`);
    assert(area.stats, `Boundary area missing stats: ${bc.slug}`);
    assert.strictEqual(area.stats.population, bc.expectedPop, `${bc.slug}: population mismatch`);
    assert.strictEqual(area.stats.landArea, bc.expectedLand, `${bc.slug}: landArea mismatch`);
    assert(area.stats.commercialGrowth.length >= 25, `${bc.slug}: commercialGrowth too short`);

    recordPass(`Boundary: ${area.name} [${bc.role}]`, `Pop: ${area.stats.population}, Land: ${area.stats.landArea}`);
  }
} catch (err: any) {
  recordFail('Boundary Cities Deep Dive', err.message);
}

// ----------------------------------------------------------------------
// GROUP 5: Adversarial Slug Resolution & Prototype Pollution Defense
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 5: Adversarial Slug Resolution & Prototype Pollution Defense ---');

try {
  function resolveArea(rawSlug: any): ServiceAreaItem | undefined {
    const slug = typeof rawSlug === 'string' ? rawSlug.replace(/\.html$/, '') : undefined;
    return slug && Object.prototype.hasOwnProperty.call(serviceAreasBySlug, slug)
      ? serviceAreasBySlug[slug]
      : undefined;
  }

  // 1. Prototype pollution attacks
  const prototypeAttacks = ['__proto__', 'constructor', 'prototype', 'valueOf', 'toString', 'hasOwnProperty', 'isPrototypeOf'];
  for (const attack of prototypeAttacks) {
    const res = resolveArea(attack);
    assert.strictEqual(res, undefined, `Prototype attack '${attack}' resolved to truthy object instead of undefined!`);
    recordPass(`Defended Prototype Property: ${attack}`, 'Safely returned undefined (404)');
  }

  // 2. Falsy & Type Mismatch Inputs
  const invalidInputs = [null, undefined, '', '   ', false, true, 0, 12345, {}, []];
  for (const inp of invalidInputs) {
    const res = resolveArea(inp);
    assert.strictEqual(res, undefined, `Invalid input ${JSON.stringify(inp)} resolved to truthy value!`);
  }
  recordPass('Falsy & Non-String Inputs', '10 invalid type inputs safely evaluated to undefined');

  // 3. Path Traversal & Injection
  const injectionInputs = [
    '../../etc/passwd',
    '..\\..\\windows\\win.ini',
    '<script>alert("xss")</script>',
    "' OR '1'='1",
    'jupiter/inlet',
    'jupiter\\inlet',
    'jupiter%20inlet',
    'A'.repeat(5000)
  ];
  for (const inj of injectionInputs) {
    const res = resolveArea(inj);
    assert.strictEqual(res, undefined, `Injection input '${inj.slice(0, 30)}...' resolved unexpectedly!`);
  }
  recordPass('Path Traversal & Injection Defenses', '8 injection patterns safely resolved to undefined');

  // 4. Valid Slugs & Extension Stripping
  assert.strictEqual(resolveArea('jupiter')?.name, 'Jupiter', 'Failed to resolve canonical "jupiter"');
  assert.strictEqual(resolveArea('jupiter.html')?.name, 'Jupiter', 'Failed to resolve "jupiter.html" with extension stripped');
  assert.strictEqual(resolveArea('tequesta.html')?.name, 'Tequesta', 'Failed to resolve "tequesta.html" with extension stripped');
  recordPass('Valid Slugs & Extension Stripping', 'Canonical and .html-suffixed slugs successfully resolved');
} catch (err: any) {
  recordFail('Adversarial Slug Resolution', err.message);
}

// ----------------------------------------------------------------------
// GROUP 6: Full React SSR renderToString Execution (All 56 Areas)
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 6: Full React SSR renderToString Execution (56/56) ---');

try {
  let renderedCount = 0;
  let totalHtmlBytes = 0;

  for (const area of serviceAreas) {
    const element = React.createElement(ServiceAreaLocalGuide, { area });
    const html = renderToString(element);

    const escapeHtml = (str: string) =>
      str.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');

    assert(html.includes('data-testid="service-area-stats"'), `${area.slug}: missing data-testid="service-area-stats"`);
    assert(html.includes('Executive Community Profile'), `${area.slug}: missing Executive Community Profile header`);
    assert(html.includes(escapeHtml(area.stats!.population)), `${area.slug}: missing population in HTML: ${area.stats!.population}`);
    assert(html.includes(escapeHtml(area.stats!.households)), `${area.slug}: missing households in HTML: ${area.stats!.households}`);
    assert(html.includes(escapeHtml(area.stats!.landArea)), `${area.slug}: missing landArea in HTML: ${area.stats!.landArea}`);
    assert(html.includes(escapeHtml(area.stats!.commercialGrowth)), `${area.slug}: missing commercialGrowth in HTML: ${area.stats!.commercialGrowth}`);

    renderedCount++;
    totalHtmlBytes += html.length;
  }

  assert.strictEqual(renderedCount, 56, `Only rendered ${renderedCount}/56 components`);
  recordPass('56/56 Component SSR Render', `All 56 areas rendered cleanly without exceptions (${(totalHtmlBytes / 1024).toFixed(1)} KB HTML generated)`);
} catch (err: any) {
  recordFail('React SSR Component Execution', err.message);
}

// ----------------------------------------------------------------------
// GROUP 7: Prerendered Static HTML & Directory Card Parity in dist/
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 7: Prerendered Static HTML & Directory Card Parity in dist/ ---');

try {
  let staticCheckCount = 0;

  for (const area of serviceAreas) {
    const filePath = path.join(DIST_DIR, 'service-area', area.slug, 'index.html');
    assert(fs.existsSync(filePath), `Static HTML file missing: ${filePath}`);

    const stat = fs.statSync(filePath);
    assert(stat.size > 3000, `Static HTML file suspiciously small: ${filePath} (${stat.size} bytes)`);

    const html = fs.readFileSync(filePath, 'utf8');
    assert(html.includes('community-stats-bar'), `${area.slug}: dist HTML missing class="community-stats-bar"`);
    assert(html.includes('Executive Community Statistics'), `${area.slug}: dist HTML missing 'Executive Community Statistics'`);
    assert(html.includes(area.stats!.population), `${area.slug}: dist HTML missing population`);
    assert(html.includes(area.stats!.landArea), `${area.slug}: dist HTML missing landArea`);

    staticCheckCount++;
  }

  assert.strictEqual(staticCheckCount, 56, `Only checked ${staticCheckCount}/56 static files`);
  recordPass('Static HTML Files in dist/service-area/*', `All 56 static routes contain verified stats HTML`);

  // Check /service-areas directory view
  const dirPath = path.join(DIST_DIR, 'service-areas', 'index.html');
  assert(fs.existsSync(dirPath), 'dist/service-areas/index.html missing');
  const dirHtml = fs.readFileSync(dirPath, 'utf8');

  // Verify each area has summary stats on directory page
  let dirStatsMatches = 0;
  for (const area of serviceAreas) {
    const snippet = `Pop: ${area.stats!.population} · Land: ${area.stats!.landArea}`;
    if (dirHtml.includes(snippet)) {
      dirStatsMatches++;
    } else {
      recordFail('Directory Snippet Check', `Missing snippet '${snippet}' for ${area.slug}`);
    }
  }

  assert.strictEqual(dirStatsMatches, 56, `Expected 56 summary snippets in directory, found ${dirStatsMatches}`);
  recordPass('Directory Page Summary Badges', 'All 56 city cards in dist/service-areas/index.html contain verified statistics summary');
} catch (err: any) {
  recordFail('Static HTML & Directory Parity', err.message);
}

// ----------------------------------------------------------------------
// SUMMARY & VERDICT
// ----------------------------------------------------------------------
console.log('\n══════════════════════════════════════════════════════════════════════');
console.log(`  AUDIT COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('══════════════════════════════════════════════════════════════════════');

if (failCount > 0) {
  console.error('\nFailures summary:');
  for (const f of failures) {
    console.error(`- ${f.testName}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('\nVERDICT: All Milestone 1 empirical challenger stress tests PASSED with 100% success!');
  process.exit(0);
}
