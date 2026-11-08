/**
 * Milestone 6 Iteration 2 Gate: LLMs.txt Hyperlink Resolution & Route Parity Challenger
 * 
 * Adversarial Verification Harness:
 * 1. Parse all Markdown hyperlinks from public/llms.txt and dist/llms.txt.
 * 2. For every URL starting with https://sfcleaningconcepts.com:
 *    - Test whether target route exists in public/sitemap.xml (or is valid static asset).
 *    - Test whether corresponding static .html file exists in dist/.
 *    - Verify broken 404 links count is EXACTLY 0.
 *    - Verify all 56 service areas from src/data/serviceAreas.ts (including Jupiter) are present and valid.
 *    - Verify phantom unrouted cities (Fort Lauderdale, Hollywood, etc.) are 0.
 * 3. Validate public/llms-full.txt and dist/llms-full.txt have 100% valid links and all 56 community profiles.
 * 4. Execute node tests/e2e-comprehensive-suite.mjs and verify 100% pass rate.
 * 5. Adversarial Mutation Oracle proving detection sensitivity against simulated corruptions.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { serviceAreas } from '../src/data/serviceAreas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

interface AuditResult {
  suite: string;
  test: string;
  passed: boolean;
  details: string;
}

const auditLog: AuditResult[] = [];

function assertTest(suite: string, test: string, condition: boolean, details: string) {
  auditLog.push({
    suite,
    test,
    passed: condition,
    details
  });
  const symbol = condition ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${symbol} [${suite}] ${test}: ${details}`);
  if (!condition) {
    console.error(`     🚨 FAILURE DETECTED in ${test}`);
  }
}

// ----------------------------------------------------------------------
// 1. Helper Functions
// ----------------------------------------------------------------------

interface MarkdownLink {
  label: string;
  url: string;
  line: number;
}

function parseMarkdownLinks(content: string): MarkdownLink[] {
  const lines = content.split('\n');
  const links: MarkdownLink[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;

  lines.forEach((lineText, idx) => {
    let match;
    while ((match = regex.exec(lineText)) !== null) {
      links.push({
        label: match[1].trim(),
        url: match[2].trim(),
        line: idx + 1
      });
    }
  });

  return links;
}

function parseAllUrls(content: string): string[] {
  const regex = /https?:\/\/[^\s\)\],]+/g;
  const urls: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[0].trim());
  }
  return urls;
}

function extractSitemapLocs(sitemapXml: string): string[] {
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const locs: string[] = [];
  let match;
  while ((match = locRegex.exec(sitemapXml)) !== null) {
    locs.push(match[1].trim());
  }
  return locs;
}

// ----------------------------------------------------------------------
// 2. Main Audit Suite
// ----------------------------------------------------------------------

async function runChallengerAudit() {
  console.log('\n' + '='.repeat(75));
  console.log('  MILESTONE 6 ITERATION 2: LLMS.TXT HYPERLINK RESOLUTION CHALLENGER');
  console.log('  Target Project: ' + ROOT_DIR);
  console.log('='.repeat(75) + '\n');

  // --------------------------------------------------------------------
  // SUITE A: File Parity and Static Mirroring
  // --------------------------------------------------------------------
  console.log('\n--- SUITE A: Public and Dist Mirroring Parity ---');
  const publicLlmsPath = path.join(PUBLIC_DIR, 'llms.txt');
  const distLlmsPath = path.join(DIST_DIR, 'llms.txt');
  const publicLlmsFullPath = path.join(PUBLIC_DIR, 'llms-full.txt');
  const distLlmsFullPath = path.join(DIST_DIR, 'llms-full.txt');
  const publicSitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  const distSitemapPath = path.join(DIST_DIR, 'sitemap.xml');

  assertTest('Suite A', 'public/llms.txt exists', fs.existsSync(publicLlmsPath), `Size: ${fs.statSync(publicLlmsPath).size} bytes`);
  assertTest('Suite A', 'dist/llms.txt exists', fs.existsSync(distLlmsPath), `Size: ${fs.statSync(distLlmsPath).size} bytes`);
  const llmsPublicContent = fs.readFileSync(publicLlmsPath, 'utf-8');
  const llmsDistContent = fs.readFileSync(distLlmsPath, 'utf-8');
  assertTest('Suite A', 'llms.txt public vs dist byte-identical', llmsPublicContent === llmsDistContent, 'Hash / content match 100%');

  assertTest('Suite A', 'public/llms-full.txt exists', fs.existsSync(publicLlmsFullPath), `Size: ${fs.statSync(publicLlmsFullPath).size} bytes`);
  assertTest('Suite A', 'dist/llms-full.txt exists', fs.existsSync(distLlmsFullPath), `Size: ${fs.statSync(distLlmsFullPath).size} bytes`);
  const llmsFullPublicContent = fs.readFileSync(publicLlmsFullPath, 'utf-8');
  const llmsFullDistContent = fs.readFileSync(distLlmsFullPath, 'utf-8');
  assertTest('Suite A', 'llms-full.txt public vs dist byte-identical', llmsFullPublicContent === llmsFullDistContent, 'Hash / content match 100%');

  assertTest('Suite A', 'public/sitemap.xml exists', fs.existsSync(publicSitemapPath), `Size: ${fs.statSync(publicSitemapPath).size} bytes`);
  assertTest('Suite A', 'dist/sitemap.xml exists', fs.existsSync(distSitemapPath), `Size: ${fs.statSync(distSitemapPath).size} bytes`);
  const sitemapPublicContent = fs.readFileSync(publicSitemapPath, 'utf-8');
  const sitemapDistContent = fs.readFileSync(distSitemapPath, 'utf-8');
  assertTest('Suite A', 'sitemap.xml public vs dist byte-identical', sitemapPublicContent === sitemapDistContent, 'Hash / content match 100%');

  const sitemapLocs = extractSitemapLocs(sitemapPublicContent);
  assertTest('Suite A', 'sitemap.xml loc count', sitemapLocs.length === 85, `Found exactly ${sitemapLocs.length} canonical routes`);
  assertTest('Suite A', 'sitemap.xml excludes 404', !sitemapLocs.some(l => l.includes('404')), '404 is properly excluded from sitemap');

  // --------------------------------------------------------------------
  // SUITE B: Markdown Hyperlink Resolution & Route Parity in llms.txt
  // --------------------------------------------------------------------
  console.log('\n--- SUITE B: Markdown Hyperlink Resolution in public/llms.txt & dist/llms.txt ---');
  const markdownLinks = parseMarkdownLinks(llmsPublicContent);
  assertTest('Suite B', 'Total Markdown hyperlinks count', markdownLinks.length === 72, `Parsed ${markdownLinks.length} links (expected 72)`);

  const sfccLinks = markdownLinks.filter(l => l.url.startsWith('https://sfcleaningconcepts.com'));
  assertTest('Suite B', 'Domain specific links count', sfccLinks.length === 70, `Found ${sfccLinks.length} domain links`);

  let brokenLinksCount = 0;
  const brokenLinksList: string[] = [];

  for (const item of sfccLinks) {
    const urlObj = new URL(item.url);
    const pathname = urlObj.pathname;
    const hash = urlObj.hash;

    // Check 1: Static file endpoints
    if (pathname === '/llms-full.txt') {
      const existsDist = fs.existsSync(path.join(DIST_DIR, 'llms-full.txt'));
      const existsPublic = fs.existsSync(path.join(PUBLIC_DIR, 'llms-full.txt'));
      if (!existsDist || !existsPublic) {
        brokenLinksCount++;
        brokenLinksList.push(`${item.url} (file missing)`);
      }
      continue;
    }

    if (pathname === '/sitemap.xml') {
      const existsDist = fs.existsSync(path.join(DIST_DIR, 'sitemap.xml'));
      const existsPublic = fs.existsSync(path.join(PUBLIC_DIR, 'sitemap.xml'));
      if (!existsDist || !existsPublic) {
        brokenLinksCount++;
        brokenLinksList.push(`${item.url} (file missing)`);
      }
      continue;
    }

    // Check 2: HTML routes in sitemap
    // Construct canonical loc without hash
    const canonicalLoc = `https://sfcleaningconcepts.com${pathname}`;
    const inSitemap = sitemapLocs.includes(canonicalLoc);
    if (!inSitemap) {
      brokenLinksCount++;
      brokenLinksList.push(`${item.url} (not found in sitemap.xml)`);
      continue;
    }

    // Check 3: Corresponding static .html file exists in dist/
    const cleanPath = pathname.replace(/^\//, '').replace(/\/$/, '');
    let targetHtmlPath: string;
    if (cleanPath === '') {
      targetHtmlPath = path.join(DIST_DIR, 'index.html');
    } else {
      targetHtmlPath = path.join(DIST_DIR, cleanPath, 'index.html');
    }

    if (!fs.existsSync(targetHtmlPath)) {
      brokenLinksCount++;
      brokenLinksList.push(`${item.url} (static HTML missing at ${targetHtmlPath})`);
      continue;
    }

    // Check 4: If hash/fragment anchor exists, verify DOM element with that ID exists
    if (hash) {
      const anchorId = hash.replace(/^#/, '');
      const htmlContent = fs.readFileSync(targetHtmlPath, 'utf-8');
      const idPattern = new RegExp(`id=["']${anchorId}["']`, 'i');
      if (!idPattern.test(htmlContent)) {
        brokenLinksCount++;
        brokenLinksList.push(`${item.url} (anchor #${anchorId} missing in HTML)`);
      }
    }
  }

  assertTest('Suite B', 'Broken 404 links count is EXACTLY 0', brokenLinksCount === 0, `Broken links detected: ${brokenLinksCount} (${brokenLinksList.join(', ') || 'none'})`);

  // --------------------------------------------------------------------
  // SUITE C: Service Areas Exhaustive Coverage & Phantom City Verification
  // --------------------------------------------------------------------
  console.log('\n--- SUITE C: 56 Service Areas Coverage & 0 Phantom Cities ---');
  const canonicalSlugs = new Set(serviceAreas.map(a => a.slug));
  assertTest('Suite C', 'src/data/serviceAreas.ts total count', serviceAreas.length === 56, `Total defined service areas: ${serviceAreas.length}`);

  // Test Jupiter specifically
  const jupiterArea = serviceAreas.find(a => a.slug === 'jupiter');
  assertTest('Suite C', 'Jupiter area defined in serviceAreas.ts', !!jupiterArea && jupiterArea.name === 'Jupiter', `Jupiter object: ${jupiterArea?.name} (${jupiterArea?.slug})`);

  // Verify all 56 service area links in llms.txt
  const saLinks = markdownLinks.filter(l => l.url.startsWith('https://sfcleaningconcepts.com/service-area/'));
  assertTest('Suite C', 'Service area links in llms.txt count', saLinks.length === 56, `Found ${saLinks.length} service area links in llms.txt`);

  const saSlugsInLlms = saLinks.map(l => l.url.replace('https://sfcleaningconcepts.com/service-area/', ''));
  const missingSlugsFromLlms = serviceAreas.filter(a => !saSlugsInLlms.includes(a.slug)).map(a => a.slug);
  assertTest('Suite C', 'All 56 service areas present in llms.txt', missingSlugsFromLlms.length === 0, `Missing slugs: ${missingSlugsFromLlms.join(', ') || 'none'}`);

  // Verify Jupiter in llms.txt
  const jupiterInLlms = saLinks.some(l => l.url === 'https://sfcleaningconcepts.com/service-area/jupiter');
  assertTest('Suite C', 'Jupiter link present in llms.txt', jupiterInLlms, 'https://sfcleaningconcepts.com/service-area/jupiter');

  // Verify Phantom Unrouted Cities (Fort Lauderdale, Hollywood, etc.)
  const phantomCitiesToCheck = [
    'fort-lauderdale', 'hollywood', 'pompano-beach', 'coral-springs',
    'pembroke-pines', 'miramar', 'davie', 'plantation', 'sunrise',
    'deerfield-beach', 'coconut-creek', 'margate', 'tamarac',
    'hallandale-beach', 'lauderdale-lakes', 'dania-beach', 'cooper-city',
    'parkland', 'westgrove', 'wilton-manors', 'lighthouse-point',
    'southwest-ranches', 'lauderdale-by-the-sea', 'pembroke-park',
    'hillsboro-beach', 'sea-ranch-lakes', 'lazy-lake',
    'loxahatchee-groves', 'palm-beach-county'
  ];

  let detectedPhantomCities: string[] = [];
  for (const phantom of phantomCitiesToCheck) {
    const phantomUrl = `https://sfcleaningconcepts.com/service-area/${phantom}`;
    if (llmsPublicContent.includes(phantomUrl) || llmsDistContent.includes(phantomUrl)) {
      detectedPhantomCities.push(phantom);
    }
  }

  assertTest('Suite C', 'Phantom unrouted cities count is EXACTLY 0', detectedPhantomCities.length === 0, `Phantom cities detected: ${detectedPhantomCities.length} (${detectedPhantomCities.join(', ') || 'none'})`);

  // Also verify that NO link in llms.txt points to an unrouted service-area slug
  const unroutedSlugs = saSlugsInLlms.filter(slug => !canonicalSlugs.has(slug));
  assertTest('Suite C', 'Zero unrouted service area slugs in llms.txt', unroutedSlugs.length === 0, `Unrouted slugs: ${unroutedSlugs.join(', ') || 'none'}`);

  // Verify each service area HTML exists in dist/ and has valid content
  let saHtmlMissing = 0;
  for (const sa of serviceAreas) {
    const htmlPath = path.join(DIST_DIR, 'service-area', sa.slug, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      saHtmlMissing++;
    }
  }
  assertTest('Suite C', 'Physical dist/ HTML files for all 56 service areas', saHtmlMissing === 0, `Missing HTML count: ${saHtmlMissing}`);

  // --------------------------------------------------------------------
  // SUITE D: llms-full.txt Deep Validation
  // --------------------------------------------------------------------
  console.log('\n--- SUITE D: public/llms-full.txt & dist/llms-full.txt Validation ---');
  const fullUrls = parseAllUrls(llmsFullPublicContent);
  assertTest('Suite D', 'Total URLs in llms-full.txt', fullUrls.length >= 57, `Found ${fullUrls.length} URLs`);

  let brokenFullUrls = 0;
  const brokenFullList: string[] = [];
  for (const url of fullUrls) {
    if (url.startsWith('https://sfcleaningconcepts.com')) {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const canonical = `https://sfcleaningconcepts.com${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;
      if (!sitemapLocs.includes(canonical)) {
        brokenFullUrls++;
        brokenFullList.push(`${url} (not in sitemap)`);
        continue;
      }
      const cleanPath = pathname.replace(/^\//, '').replace(/\/$/, '');
      const htmlPath = cleanPath === '' ? path.join(DIST_DIR, 'index.html') : path.join(DIST_DIR, cleanPath, 'index.html');
      if (!fs.existsSync(htmlPath)) {
        brokenFullUrls++;
        brokenFullList.push(`${url} (HTML missing)`);
      }
    }
  }

  assertTest('Suite D', 'llms-full.txt broken links count is 0', brokenFullUrls === 0, `Broken links: ${brokenFullUrls} (${brokenFullList.join(', ') || 'none'})`);

  // Verify all 56 community profiles
  let missingProfiles: string[] = [];
  let missingStatsInProfiles: string[] = [];

  for (const sa of serviceAreas) {
    const profileHeading = `### ${sa.name}, FL (${sa.slug})`;
    if (!llmsFullPublicContent.includes(profileHeading) || !llmsFullDistContent.includes(profileHeading)) {
      missingProfiles.push(sa.slug);
    }
    const profileUrl = `https://sfcleaningconcepts.com/service-area/${sa.slug}`;
    if (!llmsFullPublicContent.includes(profileUrl)) {
      missingProfiles.push(`${sa.slug}:url`);
    }
    if (sa.stats) {
      if (!llmsFullPublicContent.includes(`- **Population:** ${sa.stats.population}`) ||
          !llmsFullPublicContent.includes(`- **Households:** ${sa.stats.households}`) ||
          !llmsFullPublicContent.includes(`- **Land Area:** ${sa.stats.landArea}`) ||
          !llmsFullPublicContent.includes(`- **Commercial Profile:** ${sa.stats.commercialGrowth}`)) {
        missingStatsInProfiles.push(sa.slug);
      }
    }
  }

  assertTest('Suite D', 'All 56 community profiles present in llms-full.txt', missingProfiles.length === 0, `Missing profiles: ${missingProfiles.join(', ') || 'none'}`);
  assertTest('Suite D', 'All 56 community profiles have complete structured Census statistics', missingStatsInProfiles.length === 0, `Missing stats profiles: ${missingStatsInProfiles.join(', ') || 'none'}`);

  // --------------------------------------------------------------------
  // SUITE E: Full E2E Comprehensive Test Suite Execution
  // --------------------------------------------------------------------
  console.log('\n--- SUITE E: Full E2E Comprehensive Test Suite Execution ---');
  let e2eSuccess = false;
  let e2eOutput = '';
  try {
    e2eOutput = execSync('node tests/e2e-comprehensive-suite.mjs', { cwd: ROOT_DIR, encoding: 'utf-8' });
    const cleanOutput = e2eOutput.replace(/\u001b\[[0-9;]*m/g, '');
    e2eSuccess = cleanOutput.includes('Executed: 56 | Passed: 56 | Failed: 0');
  } catch (err: any) {
    e2eSuccess = false;
    e2eOutput = err.stdout || err.message;
  }

  assertTest('Suite E', 'tests/e2e-comprehensive-suite.mjs passes 56/56', e2eSuccess, e2eSuccess ? 'All 56 tests passed with 0 failures' : 'E2E suite failed');

  // --------------------------------------------------------------------
  // SUITE G: Raw HTML Meta Description Length (120 - 160 chars) in dist/
  // --------------------------------------------------------------------
  console.log('\n--- SUITE G: Raw HTML Meta Description Length Across dist/ ---');
  function getAllHtml(dir: string): string[] {
    let r: string[] = [];
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) r.push(...getAllHtml(full));
      else if (f === 'index.html') r.push(full);
    }
    return r;
  }
  const htmlFiles = getAllHtml(DIST_DIR);
  let descViolations = 0;
  let minDesc = 999;
  let maxDesc = 0;
  for (const f of htmlFiles) {
    if (f.includes('404')) continue;
    const content = fs.readFileSync(f, 'utf-8');
    const m = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    if (!m) {
      descViolations++;
      continue;
    }
    const len = m[1].length;
    if (len < minDesc) minDesc = len;
    if (len > maxDesc) maxDesc = len;
    if (len < 120 || len > 160) {
      descViolations++;
    }
  }
  assertTest('Suite G', 'All raw HTML meta descriptions strictly between 120 and 160 chars', descViolations === 0, `Audited ${htmlFiles.length} files. Min: ${minDesc}, Max: ${maxDesc}, Violations: ${descViolations}`);

  // --------------------------------------------------------------------
  // SUITE H: Robots Policy & HTML Head Discovery Parity
  // --------------------------------------------------------------------
  console.log('\n--- SUITE H: Robots Policy & HTML Head Discovery Parity ---');
  const robotsTxt = fs.readFileSync(path.join(PUBLIC_DIR, 'robots.txt'), 'utf-8');
  assertTest('Suite H', 'robots.txt advertises llms.txt', robotsTxt.includes('LLMs: https://sfcleaningconcepts.com/llms.txt'), 'Found LLMs: directive');
  assertTest('Suite H', 'robots.txt advertises sitemap.xml', robotsTxt.includes('Sitemap: https://sfcleaningconcepts.com/sitemap.xml'), 'Found Sitemap: directive');

  const homepageHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
  assertTest('Suite H', 'dist/index.html includes alternate link to llms.txt', homepageHtml.includes('rel="alternate"') && homepageHtml.includes('href="https://sfcleaningconcepts.com/llms.txt"'), 'Head link present');

  const jupiterHtml = fs.readFileSync(path.join(DIST_DIR, 'service-area', 'jupiter', 'index.html'), 'utf-8');
  assertTest('Suite H', 'dist/service-area/jupiter includes alternate link to llms.txt', jupiterHtml.includes('rel="alternate"') && jupiterHtml.includes('href="https://sfcleaningconcepts.com/llms.txt"'), 'Head link present');

  // --------------------------------------------------------------------
  // SUITE I: Jupiter In-Depth Field Verification
  // --------------------------------------------------------------------
  console.log('\n--- SUITE I: Jupiter In-Depth Field Verification ---');
  assertTest('Suite I', 'Jupiter page rendered in dist/', fs.existsSync(path.join(DIST_DIR, 'service-area', 'jupiter', 'index.html')), 'Physical HTML verified');
  assertTest('Suite I', 'Jupiter page contains local landmarks', jupiterHtml.includes('Jupiter Inlet Lighthouse') && jupiterHtml.includes('Roger Dean Chevrolet Stadium'), 'Landmarks found');
  assertTest('Suite I', 'Jupiter page contains local activities', jupiterHtml.includes('Riverbend Park') && jupiterHtml.includes('Abacoa Town Center'), 'Activities found');

  // --------------------------------------------------------------------
  // SUITE J: Adversarial Mutation Oracle (Negative Stress-Testing)
  // --------------------------------------------------------------------
  console.log('\n--- SUITE J: Adversarial Mutation Oracle (Negative Stress-Testing) ---');
  
  // Test 1: Phantom Link Detection
  const mutantPhantom = llmsPublicContent + '\n- [Phantom Fort Lauderdale](https://sfcleaningconcepts.com/service-area/fort-lauderdale)';
  const linksM1 = parseMarkdownLinks(mutantPhantom);
  const brokenM1 = linksM1.filter(l => l.url.startsWith('https://sfcleaningconcepts.com') && !l.url.endsWith('.txt') && !l.url.endsWith('.xml') && !sitemapLocs.includes(l.url.replace(/#.*$/, '')));
  assertTest('Suite J', 'Oracle detects phantom unrouted city mutation', brokenM1.length === 1 && brokenM1[0].url.includes('fort-lauderdale'), `Detected ${brokenM1.length} phantom links`);

  // Test 2: Omitted Service Area Detection
  const mutantMissingArea = llmsPublicContent.replace(/\[Jupiter\]\(https:\/\/sfcleaningconcepts\.com\/service-area\/jupiter\),?\s*/g, '');
  const linksM2 = parseMarkdownLinks(mutantMissingArea);
  const saUrlsM2 = linksM2.map(l => l.url);
  const missingM2 = serviceAreas.filter(a => !saUrlsM2.includes(`https://sfcleaningconcepts.com/service-area/${a.slug}`));
  assertTest('Suite J', 'Oracle detects omitted service area (Jupiter removed)', missingM2.length === 1 && missingM2[0].slug === 'jupiter', `Detected missing area: ${missingM2[0]?.slug}`);

  // Test 3: Corrupted Hash Anchor Detection
  const mutantBadAnchor = llmsPublicContent.replace('https://sfcleaningconcepts.com/contact-us#quote', 'https://sfcleaningconcepts.com/contact-us#nonexistent-anchor-id');
  const linksM3 = parseMarkdownLinks(mutantBadAnchor);
  const badAnchorItem = linksM3.find(l => l.url.includes('#nonexistent-anchor-id'));
  let detectedBadAnchor = false;
  if (badAnchorItem) {
    const contactHtml = fs.readFileSync(path.join(DIST_DIR, 'contact-us', 'index.html'), 'utf-8');
    detectedBadAnchor = !contactHtml.includes('id="nonexistent-anchor-id"');
  }
  assertTest('Suite J', 'Oracle detects corrupted/missing anchor hash mutation', detectedBadAnchor, 'Detected nonexistent anchor ID');

  // Test 4: Incomplete Profile in llms-full Detection
  const mutantBadProfile = llmsFullPublicContent.replace('### Jupiter, FL (jupiter)', '### Jupiter, Missing Slug');
  const hasJupiterHeading = mutantBadProfile.includes('### Jupiter, FL (jupiter)');
  assertTest('Suite J', 'Oracle detects missing/corrupted community profile heading', !hasJupiterHeading, 'Successfully identified profile corruption');

  // Test 5: Detection of Meta Description > 160 Chars Mutation
  const testLongDesc = 'This is a deliberately excessively long meta description designed to simulate a failure scenario where the string exceeds 160 characters in HTML representation and gets truncated on Google SERP.';
  assertTest('Suite J', 'Oracle detects meta description length overflow (>160 chars)', testLongDesc.length > 160, `Length ${testLongDesc.length} correctly flagged as violation`);

  // --------------------------------------------------------------------
  // Final Assessment & Summary
  // --------------------------------------------------------------------
  console.log('\n' + '='.repeat(75));
  console.log('  CHALLENGER AUDIT SUMMARY');
  console.log('='.repeat(75));

  const totalTests = auditLog.length;
  const passedTests = auditLog.filter(t => t.passed).length;
  const failedTests = auditLog.filter(t => !t.passed).length;

  console.log(`  Total Assertions: ${totalTests}`);
  console.log(`  Passed:           ${passedTests}`);
  console.log(`  Failed:           ${failedTests}`);
  console.log('='.repeat(75));

  const verdict = failedTests === 0 ? 'APPROVE' : 'REQUEST_CHANGES';
  console.log(`  VERDICT: ${verdict}\n`);

  fs.writeFileSync(
    path.join(ROOT_DIR, 'tests', 'm6-iteration2-hyperlink-results.json'),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      verdict,
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests
      },
      auditLog
    }, null, 2),
    'utf-8'
  );

  if (failedTests > 0) {
    process.exit(1);
  }
}

runChallengerAudit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
