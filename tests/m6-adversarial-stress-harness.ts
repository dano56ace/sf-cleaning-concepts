/**
 * M6 Adversarial Empirical Stress Harness & Deep Audit
 * South Florida Cleaning Concepts v2 Enhancement
 * Milestone 6: Sitemap, Crawlability, Orphan Elimination & LLMs / AI Visibility
 *
 * Verifies:
 * 1. Sitemap XML Validation (schema, 85 indexable URLs, canonical format, priority distribution, ISO 8601 lastmod)
 * 2. Crawlability & Orphan Elimination (BFS crawl graph from /, reachability of /service, depth <= 2 clicks, 0 .html links, 0 broken internal links)
 * 3. LLMs / AI Visibility (llmstxt.org conformance, llms-full.txt 56 community profiles with 6 metrics, 5 SOPs, robots.txt directives, alternate markdown link)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');

interface TestResult {
  id: string;
  category: string;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(id: string, category: string, name: string, condition: boolean, details: string) {
  results.push({
    id,
    category,
    name,
    passed: condition,
    details: condition ? details : `FAILED: ${details}`
  });
}

console.log('======================================================================');
console.log('  MILESTONE 6: ADVERSARIAL EMPIRICAL STRESS HARNESS & DEEP AUDIT');
console.log('  South Florida Cleaning Concepts v2 Enhancement');
console.log('======================================================================\n');

// ── CANONICAL ROUTE DEFINITIONS ─────────────────────────────────────────────
const CORE_PAGES = [
  '/',
  '/about-us',
  '/our-services',
  '/faqs',
  '/our-publications',
  '/contact-us'
];

const SERVICE_DIVISION_SLUGS = [
  'office-cleaning',
  'medical-office-cleaning',
  'bars-and-restaurant-cleaning',
  'short-term-rentals',
  'post-construction-cleaning',
  'move-in-out-cleaning',
  'home-maintenance',
  'school-cleaning',
  'home-watching',
  'covid-19-disinfection'
];

const BLOG_SLUGS = [
  'revitalize-your-office-space',
  'complete-guide-to-home-cleaning',
  'restaurant-and-bar-cleaning-services',
  'office-cleaning-made-easy',
  'short-term-rental-cleaning-guide',
  'high-quality-cleaning-services-south-florida',
  'medical-office-cleaning-guide',
  'deep-cleaning-for-homes-and-offices',
  'post-construction-cleaning-guide',
  'south-florida-home-maintenance-services',
  'residential-cleaning-services-journey'
];

const ALL_SERVICE_AREA_SLUGS = [
  'west-palm-beach', 'boca-raton', 'delray-beach', 'jupiter', 'palm-beach-gardens', 'wellington',
  'boynton-beach', 'lake-worth-beach', 'royal-palm-beach', 'north-palm-beach', 'riviera-beach',
  'greenacres', 'lantana', 'palm-springs', 'lake-park', 'tequesta', 'juno-beach', 'highland-beach',
  'hypoluxo', 'manalapan', 'ocean-ridge', 'south-palm-beach', 'palm-beach', 'atlantis', 'haverhill',
  'mangonia-park', 'loxahatchee', 'the-acreage', 'palm-beach-shores', 'glen-ridge', 'gulf-stream',
  'cloud-lake', 'golf', 'briny-breezes', 'jupiter-inlet-colony', 'lake-clarke-shores',
  'palm-beach-gardens-west', 'westlake', 'avenir', 'arden', 'century-village', 'kings-point',
  'golden-lakes', 'limestone-creek', 'pine-jog', 'schall-circle', 'cabana-colony', 'kenwood-estates',
  'san-castle', 'gun-club-estates', 'okeechobee-county', 'st-lucie-county', 'martin-county',
  'orange-county', 'broward-county', 'miami-dade-county'
];

const ALL_86_CANONICAL_ROUTES = [
  ...CORE_PAGES,
  '/service',
  ...SERVICE_DIVISION_SLUGS.map(s => `/service/${s}`),
  ...BLOG_SLUGS.map(s => `/blog/${s}`),
  '/service-areas',
  ...ALL_SERVICE_AREA_SLUGS.map(s => `/service-area/${s}`),
  '/404'
];

// Helper to get HTML content for a route in dist/
function getRouteHtml(route: string): string | null {
  const clean = route.replace(/^\/+|\/+$/g, '');
  let filePath = clean ? path.join(DIST_DIR, clean, 'index.html') : path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(filePath) && clean) {
    filePath = path.join(DIST_DIR, `${clean}.html`);
  }
  if (!fs.existsSync(filePath)) {
    // Check if it's a file at the root of dist (e.g. sitemap.xml, llms.txt)
    const directFile = path.join(DIST_DIR, clean);
    if (fs.existsSync(directFile)) {
      return fs.readFileSync(directFile, 'utf-8');
    }
    return null;
  }
  return fs.readFileSync(filePath, 'utf-8');
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SITEMAP XML RIGOROUS EMPIRICAL VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- 1. SITEMAP XML VALIDATION & ADVERSARIAL BOUNDARIES ---');

const publicSitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
const distSitemapPath = path.join(DIST_DIR, 'sitemap.xml');

assert(
  'ADV-M6-XML-01',
  'Sitemap XML',
  'Sitemap files exist on disk in public/ and dist/',
  fs.existsSync(publicSitemapPath) && fs.existsSync(distSitemapPath),
  `public: ${fs.existsSync(publicSitemapPath)}, dist: ${fs.existsSync(distSitemapPath)}`
);

const publicSitemapXml = fs.readFileSync(publicSitemapPath, 'utf-8');
const distSitemapXml = fs.readFileSync(distSitemapPath, 'utf-8');

assert(
  'ADV-M6-XML-02',
  'Sitemap XML',
  'Bit-for-bit identical content between public/sitemap.xml and dist/sitemap.xml',
  publicSitemapXml === distSitemapXml,
  `public size: ${publicSitemapXml.length} B, dist size: ${distSitemapXml.length} B`
);

// XML Prolog and Schema Namespace Check
const hasProlog = publicSitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>');
const hasUrlset = publicSitemapXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
const hasClosingUrlset = publicSitemapXml.trim().endsWith('</urlset>');

assert(
  'ADV-M6-XML-03',
  'Sitemap XML',
  'Sitemaps.org 0.9 XML schema header and well-formed root <urlset> tags',
  hasProlog && hasUrlset && hasClosingUrlset,
  `Prolog: ${hasProlog}, Namespace: ${hasUrlset}, Closing: ${hasClosingUrlset}`
);

// Parse all <url> blocks
const urlBlocks = [...publicSitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]);
const locList = urlBlocks.map(b => {
  const m = b.match(/<loc>([^<]+)<\/loc>/);
  return m ? m[1].trim() : '';
});

assert(
  'ADV-M6-XML-04',
  'Sitemap XML',
  'Sitemap lists exactly 85 indexable URLs with zero duplicates',
  locList.length === 85 && new Set(locList).size === 85,
  `Total loc entries: ${locList.length}, Unique loc entries: ${new Set(locList).size}`
);

// Non-indexable /404 exclusion
const includes404 = publicSitemapXml.includes('/404') || publicSitemapXml.includes('404.html');
assert(
  'ADV-M6-XML-05',
  'Sitemap XML',
  'Non-indexable error route /404 strictly excluded from sitemap',
  !includes404,
  `Includes 404: ${includes404}`
);

// Canonical Host & Protocol Verification
const nonCanonicalUrls = locList.filter(url => !url.startsWith('https://sfcleaningconcepts.com'));
assert(
  'ADV-M6-XML-06',
  'Sitemap XML',
  '100% of URLs utilize canonical protocol and domain (https://sfcleaningconcepts.com)',
  nonCanonicalUrls.length === 0,
  `Invalid domain URLs: ${JSON.stringify(nonCanonicalUrls)}`
);

// Trailing Slash Enforcement: ONLY root homepage has trailing slash
const invalidTrailingSlashUrls = locList.filter(url => url !== 'https://sfcleaningconcepts.com/' && url.endsWith('/'));
assert(
  'ADV-M6-XML-07',
  'Sitemap XML',
  'Zero non-root URLs contain trailing slashes (strict canonical consistency)',
  invalidTrailingSlashUrls.length === 0,
  `Invalid trailing slash URLs: ${JSON.stringify(invalidTrailingSlashUrls)}`
);

// Granular Priority Distribution Verification
// 1.0 (Home: 1), 0.9 (Core Services: 12), 0.8 (Service Areas: 57), 0.7 (Blog: 12), 0.6 (Legal/Contact: 3)
const priorityBuckets: Record<string, string[]> = {};
for (const b of urlBlocks) {
  const loc = b.match(/<loc>([^<]+)<\/loc>/)![1].trim();
  const priorityMatch = b.match(/<priority>([^<]+)<\/priority>/);
  const prio = priorityMatch ? priorityMatch[1].trim() : 'missing';
  if (!priorityBuckets[prio]) priorityBuckets[prio] = [];
  priorityBuckets[prio].push(loc);
}

const p1_0 = priorityBuckets['1.0'] || [];
const p0_9 = priorityBuckets['0.9'] || [];
const p0_8 = priorityBuckets['0.8'] || [];
const p0_7 = priorityBuckets['0.7'] || [];
const p0_6 = priorityBuckets['0.6'] || [];

const priorityDistributionPass =
  p1_0.length === 1 &&
  p0_9.length === 12 &&
  p0_8.length === 57 &&
  p0_7.length === 12 &&
  p0_6.length === 3 &&
  p1_0[0] === 'https://sfcleaningconcepts.com/';

assert(
  'ADV-M6-XML-08',
  'Sitemap XML',
  'Granular priority distribution aligns with architectural tiers (1.0: 1, 0.9: 12, 0.8: 57, 0.7: 12, 0.6: 3)',
  priorityDistributionPass,
  `Buckets: 1.0=${p1_0.length}, 0.9=${p0_9.length}, 0.8=${p0_8.length}, 0.7=${p0_7.length}, 0.6=${p0_6.length}`
);

// ISO 8601 Lastmod Validation
let invalidLastmods: string[] = [];
const lastmodRegex = /^\d{4}-\d{2}-\d{2}$/;
for (const b of urlBlocks) {
  const lastmodMatch = b.match(/<lastmod>([^<]+)<\/lastmod>/);
  if (!lastmodMatch || !lastmodRegex.test(lastmodMatch[1].trim()) || isNaN(Date.parse(lastmodMatch[1].trim()))) {
    invalidLastmods.push(b);
  }
}

assert(
  'ADV-M6-XML-09',
  'Sitemap XML',
  '100% of sitemap entries have valid ISO 8601 lastmod dates (YYYY-MM-DD)',
  invalidLastmods.length === 0,
  `Invalid lastmod entries: ${invalidLastmods.length}`
);

// Completeness: Check every expected indexable route exists in sitemap
const expectedIndexableRoutes = ALL_86_CANONICAL_ROUTES.filter(r => r !== '/404');
const missingExpectedUrls = expectedIndexableRoutes.filter(r => {
  const expectedUrl = r === '/' ? 'https://sfcleaningconcepts.com/' : `https://sfcleaningconcepts.com${r}`;
  return !locList.includes(expectedUrl);
});

assert(
  'ADV-M6-XML-10',
  'Sitemap XML',
  'All 85 canonical indexable routes are explicitly present in sitemap.xml',
  missingExpectedUrls.length === 0,
  `Missing URLs: ${JSON.stringify(missingExpectedUrls)}`
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. CRAWLABILITY, GRAPH TRAVERSAL & ORPHAN ELIMINATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- 2. CRAWLABILITY & ORPHAN ELIMINATION AUDIT ---');

// Check all 86 routes have physical pre-rendered HTML in dist/
let missingHtmlRoutes: string[] = [];
for (const route of ALL_86_CANONICAL_ROUTES) {
  const html = getRouteHtml(route);
  if (!html) missingHtmlRoutes.push(route);
}

assert(
  'ADV-M6-CRW-01',
  'Crawlability',
  'All 86 routes have pre-rendered static HTML files generated in dist/',
  missingHtmlRoutes.length === 0,
  `Missing physical files: ${JSON.stringify(missingHtmlRoutes)}`
);

// Check all HTML files in dist/ for obsolete .html extension internal links
function getAllHtmlFiles(dir: string): string[] {
  let files: string[] = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getAllHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allDistHtmlFiles = getAllHtmlFiles(DIST_DIR);
let dotHtmlInternalLinks: { file: string; link: string }[] = [];

for (const file of allDistHtmlFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  // Look for anchor tags with href ending in .html
  const matches = [...content.matchAll(/<a\s+[^>]*href=["\x27]([^"\x27]+)["\x27]/gi)].map(m => m[1]);
  for (const link of matches) {
    if (
      (link.startsWith('/') || link.startsWith('https://sfcleaningconcepts.com/')) &&
      link.includes('.html') &&
      !link.includes('sitemap') &&
      !link.includes('robots') &&
      !link.includes('404.html') // 404 fallback check
    ) {
      dotHtmlInternalLinks.push({ file: path.relative(DIST_DIR, file), link });
    }
  }
}

assert(
  'ADV-M6-CRW-02',
  'Crawlability',
  'Zero pre-rendered HTML files contain anchor internal links with .html extensions',
  dotHtmlInternalLinks.length === 0,
  `Found ${dotHtmlInternalLinks.length} .html internal link occurrences (e.g. ${JSON.stringify(dotHtmlInternalLinks.slice(0, 3))})`
);

// BFS Crawl Graph Traversal Starting at Homepage /
interface CrawlNode {
  route: string;
  depth: number;
}

function extractInternalAnchorLinks(html: string): string[] {
  const links: Set<string> = new Set();
  const matches = html.matchAll(/<a\s+[^>]*href=["\x27]([^"\x27]+)["\x27]/gi);
  for (const m of matches) {
    let href = m[1].trim();
    if (href.startsWith('https://sfcleaningconcepts.com')) {
      href = href.replace('https://sfcleaningconcepts.com', '') || '/';
    }
    if (href.startsWith('/') && !href.startsWith('//')) {
      const cleanPath = href.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
      // Normalize /contact alias
      const normalized = cleanPath === '/contact' ? '/contact-us' : cleanPath;
      links.add(normalized);
    }
  }
  return [...links];
}

const crawlQueue: CrawlNode[] = [{ route: '/', depth: 0 }];
const crawlDepthMap = new Map<string, number>([['/', 0]]);
const inboundLinkCount = new Map<string, number>();

while (crawlQueue.length > 0) {
  const { route, depth } = crawlQueue.shift()!;
  const html = getRouteHtml(route);
  if (!html) continue;

  const internalLinks = extractInternalAnchorLinks(html);
  for (const target of internalLinks) {
    inboundLinkCount.set(target, (inboundLinkCount.get(target) || 0) + 1);

    if (!crawlDepthMap.has(target)) {
      crawlDepthMap.set(target, depth + 1);
      crawlQueue.push({ route: target, depth: depth + 1 });
    }
  }
}

// Check reachability of /service
const serviceReachable = crawlDepthMap.has('/service');
const serviceDepth = crawlDepthMap.get('/service');
const serviceInbound = inboundLinkCount.get('/service') || 0;

assert(
  'ADV-M6-CRW-03',
  'Crawlability',
  '/service route is reachable from homepage (orphan eliminated) with depth <= 2',
  serviceReachable && (serviceDepth ?? 99) <= 2,
  `Reachable: ${serviceReachable}, Depth: ${serviceDepth}, Inbound links: ${serviceInbound}`
);

// Verify Zero Orphan Routes among all 85 indexable routes
const unreachableRoutes = expectedIndexableRoutes.filter(r => !crawlDepthMap.has(r));

assert(
  'ADV-M6-CRW-04',
  'Crawlability',
  'Zero orphan routes: 100% of indexable routes (85/85) are reachable via internal crawl graph',
  unreachableRoutes.length === 0,
  `Unreachable routes count: ${unreachableRoutes.length} (${JSON.stringify(unreachableRoutes)})`
);

// Verify Crawl Depth <= 2 Clicks for 100% of indexable routes (exceeding <= 3 requirement)
let routesExceedingDepth2: { route: string; depth: number }[] = [];
let maxObservedDepth = 0;
const depthHistogram: Record<number, number> = {};

for (const route of expectedIndexableRoutes) {
  const depth = crawlDepthMap.get(route);
  if (depth === undefined) continue;
  depthHistogram[depth] = (depthHistogram[depth] || 0) + 1;
  if (depth > maxObservedDepth) maxObservedDepth = depth;
  if (depth > 2) {
    routesExceedingDepth2.push({ route, depth });
  }
}

assert(
  'ADV-M6-CRW-05',
  'Crawlability',
  '100% of reachable routes have a crawl depth <= 2 clicks from / (within <= 3 requirement)',
  routesExceedingDepth2.length === 0 && maxObservedDepth <= 2,
  `Max depth: ${maxObservedDepth}, Depth histogram: ${JSON.stringify(depthHistogram)}, Exceeding: ${JSON.stringify(routesExceedingDepth2)}`
);

// Verify Internal Anchor Link Target Resolution (Zero Broken Links)
let brokenInternalLinks: { source: string; target: string }[] = [];
for (const [route, depth] of crawlDepthMap.entries()) {
  if (route === '/404' || route === '/sitemap.xml' || route === '/robots.txt') continue;
  const html = getRouteHtml(route);
  if (!html) {
    brokenInternalLinks.push({ source: 'crawlGraph', target: route });
  }
}

assert(
  'ADV-M6-CRW-06',
  'Crawlability',
  'Zero broken internal anchor links: 100% of crawl targets resolve to physical static HTML documents in dist/',
  brokenInternalLinks.length === 0,
  `Broken targets: ${JSON.stringify(brokenInternalLinks)}`
);

// Verify Static Asset Integrity: Check that stylesheet, icon, script, and video assets referenced in HTML exist in dist/
const requiredCoreAssets = [
  'manifest.webmanifest',
  'assets/images/icons/favicon.png',
  'assets/images/icons/apple-touch-icon.png',
  'assets/videos/bg_video_13.jpeg',
  'assets/images/logo/logo.svg',
  'css/main.css',
  'llms.txt',
  'llms-full.txt'
];

let missingCoreAssets = requiredCoreAssets.filter(asset => !fs.existsSync(path.join(DIST_DIR, asset)));

assert(
  'ADV-M6-CRW-07',
  'Asset Integrity',
  'Core static media, manifest, stylesheet, and documentation assets exist on disk in dist/',
  missingCoreAssets.length === 0,
  `Missing assets: ${JSON.stringify(missingCoreAssets)}`
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. LLMS / AI VISIBILITY STANDARD CONFORMANCE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- 3. LLMS / AI VISIBILITY & MACHINE DISCOVERY AUDIT ---');

const publicLlmsPath = path.join(PUBLIC_DIR, 'llms.txt');
const distLlmsPath = path.join(DIST_DIR, 'llms.txt');
const publicFullCorpusPath = path.join(PUBLIC_DIR, 'llms-full.txt');
const distFullCorpusPath = path.join(DIST_DIR, 'llms-full.txt');

assert(
  'ADV-M6-LLM-01',
  'LLM Conformance',
  'llms.txt exists in public/ and dist/ with bit-for-bit parity',
  fs.existsSync(publicLlmsPath) &&
  fs.existsSync(distLlmsPath) &&
  fs.readFileSync(publicLlmsPath, 'utf-8') === fs.readFileSync(distLlmsPath, 'utf-8'),
  `public size: ${fs.readFileSync(publicLlmsPath, 'utf-8').length} B, dist size: ${fs.readFileSync(distLlmsPath, 'utf-8').length} B`
);

const llmsTxtContent = fs.readFileSync(publicLlmsPath, 'utf-8');

// Conformance to https://llmstxt.org/
const llmsStartsTitle = llmsTxtContent.startsWith('# South Florida Cleaning Concepts');
const llmsHasBlockquote = llmsTxtContent.includes('> South Florida Cleaning Concepts is a premier commercial janitorial');
const llmsHasDivisionsH2 = llmsTxtContent.includes('## Service Divisions');
const llmsHasGeographicH2 = llmsTxtContent.includes('## Geographic Service Areas (56 Municipalities)');
const llmsHasCredentialsH2 = llmsTxtContent.includes('## Company Credentials & Standards');
const llmsHasContactH2 = llmsTxtContent.includes('## Contact & Dispatch Information');
const llmsHasDocsH2 = llmsTxtContent.includes('## Full Documentation & Structured Data');
const llmsLinksFullCorpus = llmsTxtContent.includes('https://sfcleaningconcepts.com/llms-full.txt');
const llmsLinksSitemap = llmsTxtContent.includes('https://sfcleaningconcepts.com/sitemap.xml');

const llmsTxtSpecCompliant =
  llmsStartsTitle &&
  llmsHasBlockquote &&
  llmsHasDivisionsH2 &&
  llmsHasGeographicH2 &&
  llmsHasCredentialsH2 &&
  llmsHasContactH2 &&
  llmsHasDocsH2 &&
  llmsLinksFullCorpus &&
  llmsLinksSitemap;

assert(
  'ADV-M6-LLM-02',
  'LLM Conformance',
  'llms.txt strictly adheres to https://llmstxt.org/ format (H1 title, blockquote, H2 sections, markdown links)',
  llmsTxtSpecCompliant,
  `H1: ${llmsStartsTitle}, Blockquote: ${llmsHasBlockquote}, Sections: ${llmsHasDivisionsH2 && llmsHasGeographicH2 && llmsHasCredentialsH2 && llmsHasContactH2 && llmsHasDocsH2}, FullCorpusLink: ${llmsLinksFullCorpus}, SitemapLink: ${llmsLinksSitemap}`
);

// llms-full.txt presence and bit-for-bit parity
assert(
  'ADV-M6-LLM-03',
  'LLM Conformance',
  'llms-full.txt exists in public/ and dist/ with bit-for-bit parity and size > 150KB',
  fs.existsSync(publicFullCorpusPath) &&
  fs.existsSync(distFullCorpusPath) &&
  fs.readFileSync(publicFullCorpusPath, 'utf-8') === fs.readFileSync(distFullCorpusPath, 'utf-8') &&
  fs.readFileSync(publicFullCorpusPath, 'utf-8').length > 150000,
  `public size: ${fs.readFileSync(publicFullCorpusPath, 'utf-8').length} B, dist size: ${fs.readFileSync(distFullCorpusPath, 'utf-8').length} B`
);

const llmsFullContent = fs.readFileSync(publicFullCorpusPath, 'utf-8');

// Verify all 5 Service Division SOPs
const REQUIRED_SOPS = [
  { name: 'Division 1: Commercial Office Cleaning', keywords: ['Color-Coded Microfiber Protocol', 'Nightly Janitorial Scope', 'Restroom Terminal Sanitation'] },
  { name: 'Division 2: Medical Office & Healthcare Disinfection', keywords: ['OSHA 1910.1030', 'EPA List N', '10-minute wet contact time'] },
  { name: 'Division 3: Short-Term Rental & Vacation Rental Turnover', keywords: ['10:00 AM', '4:00 PM', '50-Point Hospitality Inspection', 'Linen & Towel Laundering'] },
  { name: 'Division 4: Luxury Residential Rotation Cleaning', keywords: ['4-Phase Deep Rotation System', 'Sub-Tropical Climate Defense', 'mold spore colonization'] },
  { name: 'Division 5: Post-Construction Cleanup', keywords: ['Phase 1 (Rough Clean)', 'Phase 2 (Deep Prep Clean)', 'Phase 3 (White-Glove Final Polish)'] }
];

let missingSopDetails: string[] = [];
for (const sop of REQUIRED_SOPS) {
  if (!llmsFullContent.includes(sop.name)) {
    missingSopDetails.push(`Missing division header: ${sop.name}`);
    continue;
  }
  for (const kw of sop.keywords) {
    if (!llmsFullContent.includes(kw)) {
      missingSopDetails.push(`Division "${sop.name}" missing keyword "${kw}"`);
    }
  }
}

assert(
  'ADV-M6-LLM-04',
  'LLM Conformance',
  'All 5 core service division SOPs are present in llms-full.txt with technical operational specifications',
  missingSopDetails.length === 0,
  `Missing SOP details: ${JSON.stringify(missingSopDetails)}`
);

// Verify all 56 Community Profiles (including Jupiter) with required 6 metrics
let missingProfiles: string[] = [];
let profilesMissingMetrics: { slug: string; missing: string[] }[] = [];

for (const slug of ALL_SERVICE_AREA_SLUGS) {
  if (!llmsFullContent.includes(`(${slug})`)) {
    missingProfiles.push(slug);
    continue;
  }

  const startIdx = llmsFullContent.indexOf(`(${slug})`);
  const nextIdx = llmsFullContent.indexOf('### ', startIdx + 1);
  const profileSection = llmsFullContent.slice(startIdx, nextIdx !== -1 ? nextIdx : startIdx + 4000);

  const metricChecks = {
    'Population': profileSection.includes('Population:'),
    'Households': profileSection.includes('Households:'),
    'Land Area': profileSection.includes('Land Area:'),
    'Commercial Profile': profileSection.includes('Commercial Profile:'),
    'Landmarks': profileSection.includes('Prominent Landmarks') || profileSection.includes('Landmark'),
    'Neighborhoods': profileSection.includes('Key Neighborhoods') || profileSection.includes('Neighborhoods')
  };

  const missing = Object.entries(metricChecks).filter(([_, passed]) => !passed).map(([name]) => name);
  if (missing.length > 0) {
    profilesMissingMetrics.push({ slug, missing });
  }
}

assert(
  'ADV-M6-LLM-05',
  'LLM Conformance',
  'All 56 community profiles (including Jupiter) are present in llms-full.txt',
  missingProfiles.length === 0,
  `Missing profiles count: ${missingProfiles.length} (${JSON.stringify(missingProfiles)})`
);

assert(
  'ADV-M6-LLM-06',
  'LLM Conformance',
  '100% of 56 community profiles contain all 6 required metrics (Population, Households, Land Area, Commercial Profile, Landmarks, Neighborhoods)',
  profilesMissingMetrics.length === 0,
  `Profiles with missing metrics count: ${profilesMissingMetrics.length} (${JSON.stringify(profilesMissingMetrics.slice(0, 3))})`
);

// Verify Robots.txt Directives & Bot Permissions
const publicRobotsPath = path.join(PUBLIC_DIR, 'robots.txt');
const distRobotsPath = path.join(DIST_DIR, 'robots.txt');

assert(
  'ADV-M6-LLM-07',
  'Robots & AI Discovery',
  'robots.txt exists in public/ and dist/ with bit-for-bit parity',
  fs.existsSync(publicRobotsPath) &&
  fs.existsSync(distRobotsPath) &&
  fs.readFileSync(publicRobotsPath, 'utf-8') === fs.readFileSync(distRobotsPath, 'utf-8'),
  `public size: ${fs.readFileSync(publicRobotsPath, 'utf-8').length} B, dist size: ${fs.readFileSync(distRobotsPath, 'utf-8').length} B`
);

const robotsContent = fs.readFileSync(publicRobotsPath, 'utf-8');
const robotsHasSitemap = robotsContent.includes('Sitemap: https://sfcleaningconcepts.com/sitemap.xml');
const robotsHasLlms = robotsContent.includes('LLMs: https://sfcleaningconcepts.com/llms.txt');
const robotsDisallow404 = robotsContent.includes('Disallow: /404') && robotsContent.includes('Disallow: /404.html');

const requiredAiBots = [
  'GPTBot',
  'ChatGPT-User',
  'Google-Extended',
  'AnthropicAI',
  'Claude-Web',
  'ClaudeBot',
  'PerplexityBot',
  'Applebot-Extended'
];
const missingAiBots = requiredAiBots.filter(bot => !robotsContent.includes(`User-agent: ${bot}`));

assert(
  'ADV-M6-LLM-08',
  'Robots & AI Discovery',
  'robots.txt contains Sitemap directive, LLMs discovery directive, /404 disallow, and explicit Generative AI crawler permissions',
  robotsHasSitemap && robotsHasLlms && robotsDisallow404 && missingAiBots.length === 0,
  `Sitemap: ${robotsHasSitemap}, LLMs: ${robotsHasLlms}, Disallow 404: ${robotsDisallow404}, Missing AI bots: ${JSON.stringify(missingAiBots)}`
);

// Verify <link rel="alternate" type="text/markdown" ...> in dist/index.html and across all pre-rendered HTML files
const alternateTagRegex = /<link\s+rel=["\x27]alternate["\x27]\s+type=["\x27]text\/markdown["\x27]\s+href=["\x27]https:\/\/sfcleaningconcepts\.com\/llms\.txt["\x27]\s+title=["\x27]LLMs Context["\x27]\s*\/?>/i;

const distIndexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
const indexHasAlternateLink = alternateTagRegex.test(distIndexHtml);

let htmlFilesMissingAlternateLink: string[] = [];
for (const file of allDistHtmlFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  if (!alternateTagRegex.test(content)) {
    htmlFilesMissingAlternateLink.push(path.relative(DIST_DIR, file));
  }
}

assert(
  'ADV-M6-LLM-09',
  'HTML Head Discovery',
  '<link rel="alternate" type="text/markdown" ...> is present in dist/index.html and across 100% of pre-rendered routes',
  indexHasAlternateLink && htmlFilesMissingAlternateLink.length === 0,
  `index.html has link: ${indexHasAlternateLink}, missing files count: ${htmlFilesMissingAlternateLink.length}`
);

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY & VERDICT CALCULATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n======================================================================');
console.log('  EMPIRICAL CHALLENGER TEST RESULTS SUMMARY');
console.log('======================================================================');

const passedCount = results.filter(r => r.passed).length;
const failedCount = results.filter(r => !r.passed).length;

for (const r of results) {
  const status = r.passed ? 'PASS' : 'FAIL';
  console.log(`  [${status}] [${r.category}] ${r.id}: ${r.name}`);
  if (!r.passed) {
    console.log(`         >>> ${r.details}`);
  }
}

console.log('======================================================================');
console.log(`  Total: ${results.length} | Passed: ${passedCount} | Failed: ${failedCount}`);
console.log(`  Verdict: ${failedCount === 0 ? 'APPROVE' : 'REQUEST_CHANGES'}`);
console.log('======================================================================\n');

if (failedCount > 0) {
  process.exit(1);
}
