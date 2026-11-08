import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { serviceAreas, serviceAreasBySlug, ServiceAreaItem } from '../src/data/serviceAreas';
import { SERVICE_AREA_STATS } from '../src/data/serviceAreaGuideData';

const PROJECT_ROOT = '/Users/danielarrieta/Downloads/Projects/South Florida Cleaning Concepts';
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const SERVICE_AREA_DIST_DIR = path.join(DIST_DIR, 'service-area');

console.log('======================================================================');
console.log('  CHALLENGER 2: MILESTONE 1 PRERENDER & HTML INTEGRITY EMPIRICAL AUDIT');
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
// 1. Data Model Completeness (Source of Truth)
// ----------------------------------------------------------------------
console.log('--- TEST GROUP 1: In-Memory Data Model & Hydration Integrity ---');

try {
  assert(Array.isArray(serviceAreas), 'serviceAreas must be an array');
  assert.strictEqual(serviceAreas.length, 56, `Expected exactly 56 service areas, found ${serviceAreas.length}`);
  recordPass('Catalog Size', `56 service areas loaded in memory`);

  let hydratedCount = 0;
  for (const area of serviceAreas) {
    assert(area.slug, `Area missing slug: ${JSON.stringify(area)}`);
    assert(area.stats, `Area ${area.slug} missing stats property`);
    
    const { population, households, landArea, commercialGrowth, geographyType } = area.stats;
    assert(typeof population === 'string' && population.trim().length > 0, `Area ${area.slug} invalid population`);
    assert(typeof households === 'string' && households.trim().length > 0, `Area ${area.slug} invalid households`);
    assert(typeof landArea === 'string' && landArea.trim().length > 0, `Area ${area.slug} invalid landArea`);
    assert(typeof commercialGrowth === 'string' && commercialGrowth.trim().length > 0, `Area ${area.slug} invalid commercialGrowth`);
    
    // Check no poison tokens in memory
    const serialized = JSON.stringify(area.stats);
    assert(!serialized.includes('undefined'), `Poison "undefined" in stats for ${area.slug}`);
    assert(!serialized.includes('NaN'), `Poison "NaN" in stats for ${area.slug}`);
    assert(!serialized.includes('null'), `Poison "null" in stats for ${area.slug}`);

    hydratedCount++;
  }
  recordPass('All 56 Hydrated Areas', `100% (56/56) contain valid, non-empty, non-poisoned ServiceAreaStats`);
} catch (err: any) {
  recordFail('In-Memory Data Model Integrity', err.message);
}

// ----------------------------------------------------------------------
// 2. Pre-rendered Service Area Files Directory Scan
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: Pre-rendered Directory Structure & File Presence ---');

try {
  assert(fs.existsSync(SERVICE_AREA_DIST_DIR), `Directory ${SERVICE_AREA_DIST_DIR} does not exist`);
  
  const distEntries = fs.readdirSync(SERVICE_AREA_DIST_DIR, { withFileTypes: true });
  const distDirs = distEntries.filter(e => e.isDirectory()).map(e => e.name);
  
  assert.strictEqual(distDirs.length, 56, `Expected exactly 56 subdirectories in dist/service-area/, found ${distDirs.length}`);
  recordPass('Pre-rendered Directory Count', `Found 56 subdirectories in dist/service-area/`);

  // Verify bi-directional slug mapping
  const expectedSlugs = new Set(serviceAreas.map(a => a.slug));
  const missingInDist: string[] = [];
  const unexpectedInDist: string[] = [];

  for (const expected of expectedSlugs) {
    if (!distDirs.includes(expected)) missingInDist.push(expected);
  }
  for (const actual of distDirs) {
    if (!expectedSlugs.has(actual)) unexpectedInDist.push(actual);
  }

  assert.strictEqual(missingInDist.length, 0, `Missing directories in dist/service-area/: ${missingInDist.join(', ')}`);
  assert.strictEqual(unexpectedInDist.length, 0, `Unexpected directories in dist/service-area/: ${unexpectedInDist.join(', ')}`);
  recordPass('Directory Slug Parity', `1:1 bi-directional match with all 56 canonical slugs`);

  // Check every index.html file exists and has healthy size (> 5KB)
  let validFiles = 0;
  for (const slug of distDirs) {
    const indexPath = path.join(SERVICE_AREA_DIST_DIR, slug, 'index.html');
    assert(fs.existsSync(indexPath), `index.html missing for ${slug}`);
    const stat = fs.statSync(indexPath);
    assert(stat.size > 5000, `index.html for ${slug} is suspiciously small: ${stat.size} bytes`);
    validFiles++;
  }
  recordPass('Index.html Presence & Sizing', `All 56 index.html files exist and are > 5KB`);
} catch (err: any) {
  recordFail('Directory Structure & File Presence', err.message);
}

// ----------------------------------------------------------------------
// 3. Deep-Dive Pre-rendered HTML Stats Bar Inspection
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: Pre-rendered HTML Stats Bar Inspection ---');

const POPULATION_REGEX = /<span[^>]*>Population<\/span>\s*<strong[^>]*>([^<]+)<\/strong>/i;
const HOUSEHOLDS_REGEX = /<span[^>]*>Total Households<\/span>\s*<strong[^>]*>([^<]+)<\/strong>/i;
const LAND_AREA_REGEX = /<span[^>]*>Land Area<\/span>\s*<strong[^>]*>([^<]+)<\/strong>/i;
const ECONOMIC_REGEX = /<span[^>]*>Economic Profile<\/span>\s*<span[^>]*>([^<]+)<\/span>/i;
const GEOGRAPHY_REGEX = /<strong[^>]*>Geographic Setting:<\/strong>\s*([^<]+)<\/div>/i;

function unescapeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

let statsBarPassCount = 0;

for (const area of serviceAreas) {
  const filePath = path.join(SERVICE_AREA_DIST_DIR, area.slug, 'index.html');
  try {
    const html = fs.readFileSync(filePath, 'utf-8');

    // 1. Check for stats bar container
    assert(html.includes('class="community-stats-bar"'), `Missing .community-stats-bar container`);
    assert(html.includes('Executive Community Statistics'), `Missing "Executive Community Statistics" heading`);
    assert(html.includes('U.S. Census &amp; Municipal Data') || html.includes('U.S. Census & Municipal Data'), `Missing "U.S. Census & Municipal Data" badge`);

    // 2. Isolate community-stats-bar section (from start of container to closing tag before next section)
    const startIndex = html.indexOf('<div class="community-stats-bar"');
    assert(startIndex !== -1, `Could not find start index of .community-stats-bar`);
    
    // Find next section boundary (e.g. Key Commercial & Transit Corridors or Specialized Cleaning Services)
    let endIndex = html.indexOf('<h3 style="font-size: 1.25rem; font-weight: 600;', startIndex);
    if (endIndex === -1) {
      endIndex = html.indexOf('<h2 style="font-size: 1.75rem; font-weight: 700;', startIndex);
    }
    assert(endIndex !== -1, `Could not find end boundary of .community-stats-bar`);
    const statsHtml = html.slice(startIndex, endIndex);

    // 3. Check for poison tokens in stats bar snippet
    assert(!statsHtml.includes('undefined'), `Poison "undefined" detected inside .community-stats-bar`);
    assert(!statsHtml.includes('null'), `Poison "null" detected inside .community-stats-bar`);
    assert(!statsHtml.includes('NaN'), `Poison "NaN" detected inside .community-stats-bar`);
    assert(!statsHtml.includes('[object Object]'), `Poison "[object Object]" detected inside .community-stats-bar`);
    assert(!statsHtml.includes('${'), `Uninterpolated template variable detected inside .community-stats-bar`);

    // 4. Extract and validate Population
    const popMatch = statsHtml.match(POPULATION_REGEX);
    assert(popMatch, `Population metric markup not found`);
    const popValue = unescapeHtml(popMatch[1].trim());
    assert(popValue.length > 0, `Population value is empty`);
    assert(/^[\d,]+(\+)?$/.test(popValue), `Population value "${popValue}" is not formatted properly`);
    assert.strictEqual(popValue, area.stats!.population, `Population mismatch: HTML has "${popValue}", memory has "${area.stats!.population}"`);

    // 5. Extract and validate Total Households
    const hhMatch = statsHtml.match(HOUSEHOLDS_REGEX);
    assert(hhMatch, `Total Households metric markup not found`);
    const hhValue = unescapeHtml(hhMatch[1].trim());
    assert(hhValue.length > 0, `Total Households value is empty`);
    assert(/^[\d,]+(\+)?$/.test(hhValue), `Total Households value "${hhValue}" is not formatted properly`);
    assert.strictEqual(hhValue, area.stats!.households, `Households mismatch: HTML has "${hhValue}", memory has "${area.stats!.households}"`);

    // 6. Extract and validate Land Area
    const landMatch = statsHtml.match(LAND_AREA_REGEX);
    assert(landMatch, `Land Area metric markup not found`);
    const landValue = unescapeHtml(landMatch[1].trim());
    assert(landValue.length > 0, `Land Area value is empty`);
    assert(/^[\d\.,]+\s*(sq mi|acres)$/.test(landValue), `Land Area value "${landValue}" does not match expected format`);
    assert.strictEqual(landValue, area.stats!.landArea, `Land Area mismatch: HTML has "${landValue}", memory has "${area.stats!.landArea}"`);

    // 7. Extract and validate Economic Profile
    const econMatch = statsHtml.match(ECONOMIC_REGEX);
    assert(econMatch, `Economic Profile metric markup not found`);
    const econValue = unescapeHtml(econMatch[1].trim());
    assert(econValue.length >= 10, `Economic Profile text is too short ("${econValue}")`);
    assert.strictEqual(econValue, area.stats!.commercialGrowth, `Economic Profile mismatch: HTML has "${econValue}", memory has "${area.stats!.commercialGrowth}"`);

    // 8. If geographyType exists, validate it
    if (area.stats!.geographyType) {
      const geoMatch = statsHtml.match(GEOGRAPHY_REGEX);
      assert(geoMatch, `Geographic Setting markup missing despite geographyType being defined`);
      const geoValue = unescapeHtml(geoMatch[1].trim());
      assert.strictEqual(geoValue, area.stats!.geographyType, `Geographic Setting mismatch`);
    }

    statsBarPassCount++;
  } catch (err: any) {
    recordFail(`Stats Bar Validation`, err.message, area.slug);
  }
}

if (statsBarPassCount === 56) {
  recordPass('Full HTML Stats Bar Validation', `All 56 service area pages verified: 100% valid population, households, land area, economic profile`);
} else {
  recordFail('Full HTML Stats Bar Validation', `Only ${statsBarPassCount}/56 passed validation`);
}

// ----------------------------------------------------------------------
// 4. Global Poison & Template Leakage Scan across entire dist/service-area/
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 4: Adversarial Whole-Document Poison Scan ---');

try {
  let poisonCleanCount = 0;
  for (const area of serviceAreas) {
    const filePath = path.join(SERVICE_AREA_DIST_DIR, area.slug, 'index.html');
    const html = fs.readFileSync(filePath, 'utf-8');

    // Check for empty tags that indicate broken bindings
    assert(!html.includes('<strong></strong>'), `Empty <strong></strong> tag in ${area.slug}`);
    assert(!html.includes('<span></span>'), `Empty <span></span> tag in ${area.slug}`);

    // Check for "undefined" or "NaN" in visible text (ignoring script/asset hashes if any)
    const bodyContent = html.match(/<body[\s\S]*?<\/body>/i)?.[0] || html;
    
    // We search specifically for raw "undefined" or "NaN" surrounded by whitespace or tags
    const undefinedMatch = bodyContent.match(/(?:>|\s)(?:undefined|NaN|null)(?:<|\s)/);
    assert(!undefinedMatch, `Raw poison literal (${undefinedMatch?.[0]}) found in rendered body of ${area.slug}`);

    poisonCleanCount++;
  }
  recordPass('Whole-Document Poison Scan', `All 56 documents free of empty tags and leaked literals`);
} catch (err: any) {
  recordFail('Whole-Document Poison Scan', err.message);
}

// ----------------------------------------------------------------------
// 5. Service Areas Directory Page Check (dist/service-areas/index.html)
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 5: Service Areas Directory Index Page ---');

try {
  const dirPagePath = path.join(DIST_DIR, 'service-areas', 'index.html');
  assert(fs.existsSync(dirPagePath), `dist/service-areas/index.html does not exist`);
  const dirHtml = fs.readFileSync(dirPagePath, 'utf-8');

  // Verify that directory cards contain stats snippet for each service area
  let snippetCount = 0;
  for (const area of serviceAreas) {
    const expectedSnippet = `Pop: ${area.stats!.population} · Land: ${area.stats!.landArea}`;
    assert(dirHtml.includes(expectedSnippet), `Directory page missing stats snippet for ${area.slug} ("${expectedSnippet}")`);
    snippetCount++;
  }
  recordPass('Directory Page Cards', `All 56 directory cards contain verified Pop and Land stats snippet`);

  // Check no poison tokens in directory page
  assert(!dirHtml.includes('Pop: undefined'), `Poison "Pop: undefined" in directory page`);
  assert(!dirHtml.includes('Pop: NaN'), `Poison "Pop: NaN" in directory page`);
  assert(!dirHtml.includes('Pop: null'), `Poison "Pop: null" in directory page`);
  recordPass('Directory Page Cleanliness', `No poison tokens detected in directory cards`);
} catch (err: any) {
  recordFail('Service Areas Directory Index Page', err.message);
}

// ----------------------------------------------------------------------
// 6. Geographic Spectrum & Edge Cases Stress Testing
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 6: Geographic Spectrum & Archetype Stress Testing ---');

const KEY_EDGE_SLUGS = [
  'jupiter', // northern boundary
  'tequesta', // extreme northern border
  'jupiter-inlet-colony', // northern coastal enclave
  'martin-county', // northern regional county
  'west-palm-beach', // central dense urban
  'boca-raton', // corporate HQ corridor
  'miami-dade-county', // extreme south urban county
  'broward-county', // central south urban county
  'the-acreage', // rural acreage
  'westlake', // rapid western development
  'century-village', // active-adult enclave
  'kings-point', // golf/senior enclave
  'golf', // tiny incorporated village
  'cloud-lake', // smallest enclave
  'palm-beach' // ultra-luxury barrier island
];

try {
  for (const slug of KEY_EDGE_SLUGS) {
    const area = serviceAreasBySlug[slug];
    assert(area, `Key edge slug "${slug}" not found in serviceAreasBySlug`);
    assert(area.stats, `Key edge slug "${slug}" missing stats`);
    
    // Check specific realistic data ranges
    const popNum = parseInt(area.stats.population.replace(/,/g, ''), 10);
    assert(!isNaN(popNum) && popNum > 100, `Unrealistic population for ${slug}: ${area.stats.population}`);
    
    const hhNum = parseInt(area.stats.households.replace(/,/g, ''), 10);
    assert(!isNaN(hhNum) && hhNum > 50, `Unrealistic households for ${slug}: ${area.stats.households}`);
    
    assert(area.stats.landArea.includes('sq mi') || area.stats.landArea.includes('acres'), `Land area format unexpected for ${slug}: ${area.stats.landArea}`);
    assert(area.stats.commercialGrowth.length > 20, `Commercial growth too brief for ${slug}`);
    
    recordPass(`Edge Case: ${slug}`, `Pop: ${area.stats.population}, HH: ${area.stats.households}, Land: ${area.stats.landArea}`);
  }
} catch (err: any) {
  recordFail('Geographic Spectrum Edge Cases', err.message);
}

// ----------------------------------------------------------------------
// Summary
// ----------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`  AUDIT COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================');

if (failCount > 0) {
  console.error('\nFailures summary:');
  for (const f of failures) {
    console.error(`- ${f.testName}${f.slug ? ` [${f.slug}]` : ''}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('\n>>> VERDICT: APPROVE - Static pre-rendering pipeline empirically verified with 100% precision! <<<\n');
  process.exit(0);
}
