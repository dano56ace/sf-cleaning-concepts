/**
 * Milestone 6 Iteration 2 Gate: Empirical Challenger Standalone Verification Script
 * Target: South Florida Cleaning Concepts v2 Enhancement
 * Agent: sfcc_v2_m6_challenger_3
 * 
 * Objectives:
 * 1. Read all 173 physical .html files in dist/ across all 86 canonical routes (+ 404).
 * 2. Extract raw <meta name="description" content="..."> attribute from every file.
 * 3. Measure exact length of raw content attribute (including &amp; and all serialized entities).
 * 4. Assert:
 *    - Exactly 173 physical .html files audited.
 *    - 0 files exceed 160 characters in raw HTML content.
 *    - 0 files fall below 120 characters in raw HTML content.
 *    - Specifically assert dist/service-area/jupiter-inlet-colony/index.html is strictly <= 160 chars.
 *    - Specifically assert dist/service-area/palm-beach-gardens-west/index.html is strictly <= 160 chars.
 * 5. Assert 100% of routes contain primary phone CTA "Call (561) 704-5303".
 * 6. Audit public/llms.txt and dist/llms.txt against sitemap.xml for 0 broken links.
 * 7. Adversarial mutation oracle: verify detection sensitivity against over-length, under-length, and missing CTA.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');

function getAllHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const audit = {
  totalFiles: 0,
  canonicalRoutes: new Set(),
  minRawLen: Infinity,
  maxRawLen: -Infinity,
  minRawFile: '',
  maxRawFile: '',
  ampEntitiesFound: 0,
  filesWithAmp: 0,
  failures: [],
  specificChecks: {},
  mutantsTested: 0,
  mutantsCaught: 0
};

console.log('======================================================================');
console.log('  MILESTONE 6 ITERATION 2: EMPIRICAL CHALLENGER VERIFICATION HARNESS');
console.log('  Agent: sfcc_v2_m6_challenger_3');
console.log('  Target Project: ' + ROOT_DIR);
console.log('  Target Dist:    ' + DIST_DIR);
console.log('======================================================================\n');

// ── 1. SCAN AND COLLECT ALL PHYSICAL HTML FILES ──────────────────────────────
const htmlFiles = getAllHtmlFiles(DIST_DIR);
audit.totalFiles = htmlFiles.length;
console.log(`[Phase 1: File Discovery] Located ${audit.totalFiles} physical .html files in dist/...`);

if (audit.totalFiles !== 173) {
  audit.failures.push(`Expected exactly 173 physical .html files in dist/, found ${audit.totalFiles}`);
}

// ── 2. AUDIT RAW META DESCRIPTIONS AND PHONE CTA ────────────────────────────
console.log('[Phase 2: Raw Meta Description & CTA Audit]');

for (const file of htmlFiles) {
  const relPath = path.relative(DIST_DIR, file);
  const html = fs.readFileSync(file, 'utf-8');

  // Derive canonical route
  let route = '';
  if (relPath === 'index.html') {
    route = '/';
  } else if (relPath.endsWith('/index.html')) {
    route = '/' + relPath.slice(0, -'/index.html'.length);
  } else if (relPath.endsWith('.html')) {
    route = '/' + relPath.slice(0, -'.html'.length);
  }
  audit.canonicalRoutes.add(route);

  // Extract raw meta description attribute
  const descMatch = html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                    html.match(/<meta\b[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);

  if (!descMatch) {
    audit.failures.push(`Missing <meta name="description"> in ${relPath}`);
    continue;
  }

  const rawContent = descMatch[1];
  const rawLen = rawContent.length;

  if (rawLen < audit.minRawLen) {
    audit.minRawLen = rawLen;
    audit.minRawFile = relPath;
  }
  if (rawLen > audit.maxRawLen) {
    audit.maxRawLen = rawLen;
    audit.maxRawFile = relPath;
  }

  // Count &amp; entities
  const ampCount = (rawContent.match(/&amp;/g) || []).length;
  if (ampCount > 0) {
    audit.ampEntitiesFound += ampCount;
    audit.filesWithAmp++;
  }

  // Bound assertions: [120, 160]
  if (rawLen > 160) {
    audit.failures.push(`Raw description exceeds 160 chars in ${relPath} (${rawLen} chars): "${rawContent}"`);
  }
  if (rawLen < 120) {
    audit.failures.push(`Raw description falls below 120 chars in ${relPath} (${rawLen} chars): "${rawContent}"`);
  }

  // Primary Phone CTA assertion
  if (!rawContent.includes('Call (561) 704-5303')) {
    audit.failures.push(`Primary phone CTA 'Call (561) 704-5303' missing in ${relPath}: "${rawContent}"`);
  }

  // Track specific targets
  if (relPath === 'service-area/jupiter-inlet-colony/index.html' ||
      relPath === 'service-area/jupiter-inlet-colony.html' ||
      relPath === 'service-area/palm-beach-gardens-west/index.html' ||
      relPath === 'service-area/palm-beach-gardens-west.html') {
    audit.specificChecks[relPath] = {
      rawLen,
      rawContent,
      ampCount,
      hasCta: rawContent.includes('Call (561) 704-5303'),
      isCompliant: rawLen <= 160 && rawLen >= 120 && rawContent.includes('Call (561) 704-5303')
    };
  }
}

// ── 3. SPECIFIC REMEDIATION TARGET ASSERTIONS ────────────────────────────────
console.log('\n[Phase 3: Targeted Remediation Assertions]');
for (const [targetPath, data] of Object.entries(audit.specificChecks)) {
  console.log(`  -> ${targetPath}:`);
  console.log(`     Raw Length: ${data.rawLen} chars (Strictly <= 160: ${data.rawLen <= 160})`);
  console.log(`     Entities:   ${data.ampCount} &amp; occurrences`);
  console.log(`     Phone CTA:  ${data.hasCta ? 'PRESENT' : 'MISSING'}`);
  console.log(`     Content:    "${data.rawContent}"`);

  if (!data.isCompliant) {
    audit.failures.push(`Target assertion failed for ${targetPath}: raw length ${data.rawLen}`);
  }
}

// ── 4. CROSS-CHECK LLMS.TXT AND SITEMAP.XML INTEGRITY ────────────────────────
console.log('\n[Phase 4: LLMs.txt & Sitemap Link Resolution Audit]');
const llmsPath = path.join(DIST_DIR, 'llms.txt');
const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');

if (!fs.existsSync(llmsPath)) {
  audit.failures.push('Missing dist/llms.txt');
} else if (!fs.existsSync(sitemapPath)) {
  audit.failures.push('Missing dist/sitemap.xml');
} else {
  const llmsContent = fs.readFileSync(llmsPath, 'utf-8');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

  const linksInLlms = [...llmsContent.matchAll(/https:\/\/sfcleaningconcepts\.com\/[^\)\s]+/g)].map(m => m[0]);
  const saLinks = linksInLlms.filter(l => l.startsWith('https://sfcleaningconcepts.com/service-area/'));

  console.log(`  Total links extracted from llms.txt: ${linksInLlms.length}`);
  console.log(`  Service area links extracted:        ${saLinks.length}`);

  if (saLinks.length !== 56) {
    audit.failures.push(`Expected 56 service area links in llms.txt, found ${saLinks.length}`);
  }

  const deadLinks = linksInLlms.filter(l => {
    if (l.endsWith('/llms-full.txt') || l.endsWith('/sitemap.xml')) return false;
    const cleanUrl = l.split('#')[0];
    return !sitemapContent.includes(`<loc>${cleanUrl}</loc>`);
  });

  console.log(`  Dead/Unmatched 404 links:           ${deadLinks.length}`);
  if (deadLinks.length > 0) {
    audit.failures.push(`Found ${deadLinks.length} broken links in llms.txt: ${deadLinks.join(', ')}`);
  }
}

// ── 5. ADVERSARIAL MUTATION ORACLE ──────────────────────────────────────────
console.log('\n[Phase 5: Adversarial Mutation Oracle (Sensitivity Stress-Test)]');

function testValidatorSensitivity(sampleHtml) {
  const descMatch = sampleHtml.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  if (!descMatch) return false;
  const raw = descMatch[1];
  return raw.length >= 120 && raw.length <= 160 && raw.includes('Call (561) 704-5303');
}

const baselineFile = path.join(DIST_DIR, 'service-area/jupiter-inlet-colony/index.html');
const baselineHtml = fs.readFileSync(baselineFile, 'utf-8');

const mutants = [
  {
    name: 'Mutant 1: Description boundary overflow (161 raw chars)',
    modify: (html) => html.replace(/(<meta\b[^>]*name=["']description["'][^>]*content=")([^"]*)(")/i, (_, p1, content, p3) => `${p1}${content.padEnd(161, 'X')}${p3}`),
    expectedPass: false
  },
  {
    name: 'Mutant 2: Description boundary overflow via &amp; entity injection (163 raw chars)',
    modify: (html) => html.replace(/results &amp; 100% guarantee/, 'results &amp; &amp; 100% guarantee &amp; more'),
    expectedPass: false
  },
  {
    name: 'Mutant 3: Description under-length boundary violation (119 raw chars)',
    modify: (html) => html.replace(/(<meta\b[^>]*name=["']description["'][^>]*content=")([^"]*)(")/i, (_, p1, content, p3) => `${p1}${'A'.repeat(98)} Call (561) 704-5303.${p3}`),
    expectedPass: false
  },
  {
    name: 'Mutant 4: Missing primary telephony CTA',
    modify: (html) => html.replace(/Call \(561\) 704-5303/, 'Call our office today'),
    expectedPass: false
  },
  {
    name: 'Mutant 5: Completely deleted meta description tag',
    modify: (html) => html.replace(/<meta\b[^>]*name=["']description["'][^>]*>/i, ''),
    expectedPass: false
  }
];

for (const mutant of mutants) {
  audit.mutantsTested++;
  const mutantHtml = mutant.modify(baselineHtml);
  const passed = testValidatorSensitivity(mutantHtml);
  if (passed === mutant.expectedPass) {
    audit.mutantsCaught++;
    console.log(`  [CAUGHT] ${mutant.name}`);
  } else {
    audit.failures.push(`Mutation oracle escaped: ${mutant.name} was not caught!`);
    console.log(`  [ESCAPED] ${mutant.name}`);
  }
}

// ── 6. FINAL SUMMARY AND VERDICT ────────────────────────────────────────────
console.log('\n======================================================================');
console.log('  EMPIRICAL CHALLENGER AUDIT SUMMARY');
console.log(`  Physical HTML Files Audited:    ${audit.totalFiles} / 173`);
console.log(`  Canonical Routes Represented:   ${audit.canonicalRoutes.size} / 87`);
console.log(`  Min Raw Description Length:     ${audit.minRawLen} chars (${audit.minRawFile})`);
console.log(`  Max Raw Description Length:     ${audit.maxRawLen} chars (${audit.maxRawFile})`);
console.log(`  Files Containing &amp; Entities: ${audit.filesWithAmp}`);
console.log(`  Total &amp; Entities Found:     ${audit.ampEntitiesFound}`);
console.log(`  Mutants Caught / Tested:        ${audit.mutantsCaught} / ${audit.mutantsTested}`);
console.log(`  Total Violations / Deficiencies: ${audit.failures.length}`);
console.log('======================================================================\n');

if (audit.failures.length > 0) {
  console.error('❌ EMPIRICAL AUDIT FAILED WITH VIOLATIONS:');
  for (const f of audit.failures) {
    console.error(`   - ${f}`);
  }
  process.exit(1);
} else {
  console.log('🏆 [PASS] ALL EMPIRICAL CHALLENGER ASSERTIONS PASSED WITH ZERO VIOLATIONS.');
  process.exit(0);
}
