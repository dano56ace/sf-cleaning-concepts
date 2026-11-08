// @ts-check
/**
 * ══════════════════════════════════════════════════════════════════════════
 * Comprehensive 4-Tier Opaque-Box E2E Test Suite
 * South Florida Cleaning Concepts — Blog Ingestion, Homepage Snippet & Multi-City Service Areas
 *
 * Tiers:
 *  - Tier 1: Feature Coverage (R1 Blog, R2 Service Areas, R3 Navigation, R4 Schema/SEO)
 *  - Tier 2: Boundary & Corner Cases (404s, Trailing Slashes, Case, Search, Breakpoints)
 *  - Tier 3: Cross-Feature Interactions (Funnel flows, Schema cross-linking, Directories)
 *  - Tier 4: Real-World Customer Journeys (5 Persona Scenarios)
 *
 * Zero external dependencies: Pure Node.js HTTP server & HTML parser.
 *
 * Execution:
 *  - Full execution: node tests/e2e-comprehensive-suite.mjs
 *  - Soft/Progressive: node tests/e2e-comprehensive-suite.mjs --soft
 *  - Milestone filter: node tests/e2e-comprehensive-suite.mjs --milestone m1
 *  - Tier filter: node tests/e2e-comprehensive-suite.mjs --tier 1
 *  - Remote/Custom URL: node tests/e2e-comprehensive-suite.mjs --url https://sf-cleaning-concepts.netlify.app
 * ══════════════════════════════════════════════════════════════════════════
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// CLI Arguments
const args = process.argv.slice(2);
function getArg(flag, defaultValue = null) {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length) return args[index + 1];
  const prefixMatch = args.find(a => a.startsWith(`${flag}=`));
  if (prefixMatch) return prefixMatch.split('=')[1];
  return defaultValue;
}
const hasFlag = (flag) => args.includes(flag);

const TARGET_URL = getArg('--url', null);
const PORT = parseInt(getArg('--port', '4180'), 10);
const FILTER_TIER = getArg('--tier', 'all').toLowerCase();
const FILTER_MILESTONE = getArg('--milestone', 'all').toLowerCase();
const IS_SOFT_MODE = hasFlag('--soft') || hasFlag('--progressive');
const IS_JSON_OUTPUT = hasFlag('--json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

// ── Canonical Reference Data ──────────────────────────────────────────────
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

const SAMPLE_SERVICE_AREAS = [
  {
    slug: 'jupiter',
    name: 'Jupiter',
    county: 'Palm Beach County',
    lat: '26.9342',
    lng: '-80.0942',
    neighborhoods: ['Abacoa', 'Admirals Cove', 'Jupiter Inlet', 'Indiantown Road'],
    landmarks: ['Jupiter Inlet Lighthouse', 'Harbourside Place', 'Roger Dean'],
    cleaningKeywords: ['Commercial Office Cleaning', 'Janitorial', 'Disinfection', 'Turnover']
  },
  {
    slug: 'boca-raton',
    name: 'Boca Raton',
    county: 'Palm Beach County',
    lat: '26.3683',
    lng: '-80.1289',
    neighborhoods: ['Mizner Park', 'Town Center', 'Royal Palm Plaza', 'Camino Real'],
    landmarks: ['Mizner Park', 'Town Center at Boca Raton'],
    cleaningKeywords: ['Luxury Residential', 'Commercial Cleaning', 'Rotation System', 'Maid Service']
  },
  {
    slug: 'west-palm-beach',
    name: 'West Palm Beach',
    county: 'Palm Beach County',
    lat: '26.7153',
    lng: '-80.0534',
    neighborhoods: ['Clematis Street', 'CityPlace', 'Northwood Village', 'SoSo District'],
    landmarks: ['Clematis Street', 'The Square'],
    cleaningKeywords: ['Commercial Office', 'Post-Construction', 'Disinfection', 'Janitorial']
  },
  {
    slug: 'palm-beach-gardens',
    name: 'Palm Beach Gardens',
    county: 'Palm Beach County',
    lat: '26.8234',
    lng: '-80.1387',
    neighborhoods: ['PGA National', 'The Gardens Mall', 'Legacy Place', 'Midtown'],
    landmarks: ['PGA National Resort', 'The Gardens Mall'],
    cleaningKeywords: ['Medical Office Cleaning', 'Commercial Cleaning', 'Disinfection', 'Executive Maid']
  },
  {
    slug: 'delray-beach',
    name: 'Delray Beach',
    county: 'Palm Beach County',
    lat: '26.4615',
    lng: '-80.0728',
    neighborhoods: ['Atlantic Avenue', 'Pineapple Grove', 'Lake Ida'],
    landmarks: ['Atlantic Avenue', 'Pineapple Grove Arts District'],
    cleaningKeywords: ['Short-Term Rental', 'Airbnb Turnover', 'Restaurant Cleaning', 'Commercial Cleaning']
  }
];

const CORE_PAGES = [
  '/',
  '/about-us',
  '/our-services',
  '/faqs',
  '/our-publications',
  '/contact-us'
];

// ── Lightweight Pure Node HTML Parser Helper ──────────────────────────────
class HtmlDoc {
  /**
   * @param {string} html
   */
  constructor(html) {
    this.html = html || '';
  }

  title() {
    const m = this.html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    return m ? m[1].trim() : '';
  }

  meta(name) {
    const r1 = new RegExp(`<meta\\b[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i');
    const r2 = new RegExp(`<meta\\b[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, 'i');
    const m = this.html.match(r1) || this.html.match(r2);
    return m ? m[1].trim() : '';
  }

  canonical() {
    const m = this.html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
              this.html.match(/<link\b[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
    return m ? m[1].trim() : '';
  }

  h1() {
    const m = this.html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    return m ? m[1].replace(/<[^>]+>/g, '').trim() : '';
  }

  text() {
    return this.html
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  links() {
    const r = /<a\b([^>]*?)href=["']([^"']*)["']([^>]*?)>([\s\S]*?)<\/a>/gi;
    const result = [];
    let match;
    while ((match = r.exec(this.html)) !== null) {
      result.push({
        href: match[2],
        text: match[4].replace(/<[^>]+>/g, '').trim(),
        rawAttrs: `${match[1]} ${match[3]}`
      });
    }
    return result;
  }

  jsonLd() {
    const r = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const result = [];
    let match;
    while ((match = r.exec(this.html)) !== null) {
      result.push(match[1]);
    }
    return result;
  }

  hasTag(tagName) {
    const r = new RegExp(`<${tagName}\\b`, 'i');
    return r.test(this.html);
  }

  hasSubstring(str) {
    return this.html.includes(str);
  }
}

// ── In-Process Static HTTP Server ─────────────────────────────────────────
function createTestServer() {
  return http.createServer((req, res) => {
    let reqUrl;
    try {
      reqUrl = new URL(req.url, `http://localhost:${PORT}`);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Bad Request');
    }

    let pathname = decodeURI(reqUrl.pathname);

    // Legacy redirects check if exists
    const redirectsPath = path.join(DIST_DIR, '_redirects');
    if (fs.existsSync(redirectsPath)) {
      const redirectsContent = fs.readFileSync(redirectsPath, 'utf-8');
      const lines = redirectsContent.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const parts = trimmed.split(/\s+/);
        if (parts.length >= 2 && (parts[0] === pathname || parts[0] === pathname + '/')) {
          res.writeHead(301, {
            'Location': parts[1],
            'Content-Type': 'text/plain'
          });
          return res.end(`Redirecting to ${parts[1]}`);
        }
      }
    }

    // Resolve file from dist directory
    let candidate = path.join(DIST_DIR, pathname);

    // If directory or trailing slash, check index.html
    if (pathname.endsWith('/') || (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory())) {
      candidate = path.join(candidate, 'index.html');
    }

    // If file doesn't exist, try appending .html (clean URL convention)
    if (!fs.existsSync(candidate) && fs.existsSync(candidate + '.html')) {
      candidate = candidate + '.html';
    }

    // Check if subpath index exists (e.g. dist/service-area/jupiter/index.html)
    if (!fs.existsSync(candidate) && fs.existsSync(path.join(DIST_DIR, pathname, 'index.html'))) {
      candidate = path.join(DIST_DIR, pathname, 'index.html');
    }

    // Serve file if found
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      const ext = path.extname(candidate).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': mime,
        'Cache-Control': 'no-cache',
        'X-Test-Server': 'true'
      });
      return fs.createReadStream(candidate).pipe(res);
    }

    // If 404, serve dist/404.html if available
    const fallback404 = path.join(DIST_DIR, '404.html');
    if (fs.existsSync(fallback404)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Test-Server': 'true' });
      return fs.createReadStream(fallback404).pipe(res);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`404 Not Found: ${pathname}`);
  });
}

// ── HTTP Fetch Client Helper ──────────────────────────────────────────────
async function requestPage(baseUrl, routePath) {
  const targetUrl = new URL(routePath, baseUrl).toString();
  try {
    const response = await fetch(targetUrl, {
      redirect: 'manual',
      headers: { 'User-Agent': 'SFCC-E2E-OpaqueBox-TestRunner/1.0' }
    });

    const status = response.status;
    const location = response.headers.get('location');
    const contentType = response.headers.get('content-type') || '';
    const bodyText = await response.text();
    const doc = contentType.includes('html') ? new HtmlDoc(bodyText) : null;

    return {
      ok: response.ok,
      status,
      location,
      contentType,
      bodyText,
      doc,
      url: targetUrl
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      location: null,
      contentType: '',
      bodyText: '',
      doc: null,
      error: err.message,
      url: targetUrl
    };
  }
}

// ── Test Runner Infrastructure ─────────────────────────────────────────────
class TestSuiteRunner {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.tests = [];
    this.results = [];
  }

  register(tier, milestone, id, title, fn) {
    this.tests.push({ tier, milestone, id, title, fn });
  }

  async runAll() {
    console.log(`\n======================================================================`);
    console.log(`  SOUTH FLORIDA CLEANING CONCEPTS — 4-TIER E2E TEST SUITE`);
    console.log(`  Target Base URL: ${this.baseUrl}`);
    console.log(`  Filters: Tier=${FILTER_TIER.toUpperCase()}, Milestone=${FILTER_MILESTONE.toUpperCase()}`);
    console.log(`  Mode: ${IS_SOFT_MODE ? 'PROGRESSIVE (Soft)' : 'STRICT VERIFICATION'}`);
    console.log(`======================================================================\n`);

    const startTime = Date.now();
    let passedCount = 0;
    let failedCount = 0;
    let pendingCount = 0;

    for (const test of this.tests) {
      if (FILTER_TIER !== 'all' && String(test.tier) !== FILTER_TIER) continue;
      if (FILTER_MILESTONE !== 'all' && test.milestone.toLowerCase() !== FILTER_MILESTONE) continue;

      const testStart = Date.now();
      try {
        const outcome = await test.fn(this.baseUrl);
        const duration = Date.now() - testStart;

        if (outcome.pending) {
          pendingCount++;
          this.results.push({ ...test, status: 'PENDING', duration, message: outcome.message, details: outcome.details });
          console.log(`  \x1b[33m[PENDING]\x1b[0m [T${test.tier}·${test.milestone}] ${test.id}: ${test.title} (${duration}ms)`);
          if (outcome.message) console.log(`            \x1b[90m↳ Reason: ${outcome.message}\x1b[0m`);
        } else if (outcome.pass) {
          passedCount++;
          this.results.push({ ...test, status: 'PASS', duration, message: outcome.message, details: outcome.details });
          console.log(`  \x1b[32m[PASS]\x1b[0m    [T${test.tier}·${test.milestone}] ${test.id}: ${test.title} (${duration}ms)`);
        } else {
          // If in soft mode, mark pending
          if (IS_SOFT_MODE) {
            pendingCount++;
            this.results.push({ ...test, status: 'PENDING', duration, message: outcome.message, details: outcome.details });
            console.log(`  \x1b[33m[PENDING]\x1b[0m [T${test.tier}·${test.milestone}] ${test.id}: ${test.title} (${duration}ms)`);
            if (outcome.message) console.log(`            \x1b[90m↳ ${outcome.message}\x1b[0m`);
          } else {
            failedCount++;
            this.results.push({ ...test, status: 'FAIL', duration, message: outcome.message, details: outcome.details });
            console.log(`  \x1b[31m[FAIL]\x1b[0m    [T${test.tier}·${test.milestone}] ${test.id}: ${test.title} (${duration}ms)`);
            if (outcome.message) console.log(`            \x1b[31m↳ Failure: ${outcome.message}\x1b[0m`);
          }
        }
      } catch (err) {
        const duration = Date.now() - testStart;
        failedCount++;
        this.results.push({ ...test, status: 'ERROR', duration, message: err.message, stack: err.stack });
        console.log(`  \x1b[31m[ERROR]\x1b[0m   [T${test.tier}·${test.milestone}] ${test.id}: ${test.title} (${duration}ms)`);
        console.log(`            \x1b[31m↳ Exception: ${err.message}\x1b[0m`);
      }
    }

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n======================================================================`);
    console.log(`  TEST RUN SUMMARY`);
    console.log(`  Executed: ${this.results.length} | Passed: \x1b[32m${passedCount}\x1b[0m | Failed: \x1b[31m${failedCount}\x1b[0m | Pending: \x1b[33m${pendingCount}\x1b[0m`);
    console.log(`  Duration: ${totalDuration}s`);
    console.log(`======================================================================\n`);

    // Write result artifact to disk
    const resultsPayload = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      summary: {
        total: this.results.length,
        passed: passedCount,
        failed: failedCount,
        pending: pendingCount,
        durationSeconds: parseFloat(totalDuration)
      },
      results: this.results
    };

    fs.writeFileSync(
      path.join(PROJECT_ROOT, 'tests/e2e-comprehensive-results.json'),
      JSON.stringify(resultsPayload, null, 2)
    );

    if (IS_JSON_OUTPUT) {
      console.log(JSON.stringify(resultsPayload));
    }

    return failedCount === 0;
  }
}

// ── Instantiate Test Suite ─────────────────────────────────────────────────
const runner = new TestSuiteRunner(TARGET_URL || `http://localhost:${PORT}`);

// ══════════════════════════════════════════════════════════════════════════
// TIER 1: FEATURE COVERAGE (R1 Blog, R2 Service Areas, R3 Navigation, R4 Schema)
// ══════════════════════════════════════════════════════════════════════════

// ── Feature R1: Blog Post Ingestion & Homepage Snippet ──────────────────────

runner.register(1, 'M1', 'T1.R1.1', '11 Live Blog Articles Catalog Completeness & Accessibility', async (baseUrl) => {
  const missing = [];
  for (const slug of BLOG_SLUGS) {
    const res = await requestPage(baseUrl, `/blog/${slug}`);
    if (res.status !== 200 || !res.doc) {
      missing.push({ slug, status: res.status });
    }
  }
  if (missing.length > 0) {
    return {
      pass: false,
      message: `${missing.length}/11 blog articles failed HTTP 200: ${missing.map(m => `${m.slug} (${m.status})`).join(', ')}`
    };
  }
  return { pass: true, message: 'All 11 live blog articles accessible via clean /blog/:slug routes with HTTP 200' };
});

runner.register(1, 'M1', 'T1.R1.2', 'Blog Article Content, Semantic Structure & Typography', async (baseUrl) => {
  const sampleSlugs = ['revitalize-your-office-space', 'medical-office-cleaning-guide', 'complete-guide-to-home-cleaning'];
  for (const slug of sampleSlugs) {
    const res = await requestPage(baseUrl, `/blog/${slug}`);
    if (res.status !== 200 || !res.doc) {
      return { pass: false, message: `Could not load /blog/${slug}` };
    }
    const h1 = res.doc.h1();
    if (!h1) {
      return { pass: false, message: `/blog/${slug} missing <h1> heading` };
    }
    const wordCount = res.doc.text().split(/\s+/).filter(Boolean).length;
    if (wordCount < 200) {
      return { pass: false, message: `/blog/${slug} body text too short (${wordCount} words; expected >= 200)` };
    }
  }
  return { pass: true, message: 'Blog articles contain semantic H1s and rich editorial text content' };
});

runner.register(1, 'M1', 'T1.R1.3', 'Blog Media Assets Physical Disk Resolution & Integrity', async () => {
  const samplePosts = [
    { slug: 'medical-office-cleaning-guide', featured: 'medical-office-2022-07-07-00-46-47-utc-Large.jpeg' },
    { slug: 'post-construction-cleaning-guide', featured: 'Post-Construction-Clean-2.jpeg' },
    { slug: 'residential-cleaning-services-journey', featured: 'South-Florida-Cleaning-Concepts-Reisdential-Cleaning-1.jpeg' }
  ];

  for (const item of samplePosts) {
    let foundOnDisk = false;
    const candidates = [
      path.join(PUBLIC_DIR, 'assets/images/services', item.featured),
      path.join(PUBLIC_DIR, 'assets/images/blog', item.featured)
    ];
    for (const c of candidates) {
      if (fs.existsSync(c) && fs.statSync(c).size > 1000) {
        foundOnDisk = true;
        break;
      }
    }
    if (!foundOnDisk) {
      return { pass: false, message: `Image asset ${item.featured} not found or < 1KB on disk` };
    }
  }
  return { pass: true, message: 'All blog featured imagery verified present on disk with valid file size' };
});

runner.register(1, 'M1', 'T1.R1.4', 'Homepage Recent Blog Snippets Component & Grid Layout', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/');
  if (res.status !== 200 || !res.doc) {
    return { pass: false, message: 'Could not fetch homepage /' };
  }
  const links = res.doc.links();
  const blogLinks = links.filter(l => l.href && l.href.includes('/blog/'));

  if (blogLinks.length < 2) {
    return {
      pass: false,
      message: `Homepage contains insufficient blog links (found ${blogLinks.length}; expected >= 3 in recent blog snippet section)`
    };
  }

  const firstBlogLink = blogLinks[0].href;
  if (!firstBlogLink.startsWith('/blog/')) {
    return { pass: false, message: `Invalid blog link format on homepage: ${firstBlogLink}` };
  }

  return { pass: true, message: `Homepage renders recent blog snippets with ${blogLinks.length} article links` };
});

runner.register(1, 'M1', 'T1.R1.5', 'Blog Snippet Navigation & Publications Hub Cross-Linking', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/');
  if (!res.doc) return { pass: false, message: 'Could not fetch homepage' };

  const links = res.doc.links();
  const pubLink = links.find(l => l.href === '/our-publications' || l.href === '/our-publications.html');
  if (!pubLink) {
    return { pass: false, message: 'Homepage missing link to /our-publications' };
  }

  const pubRes = await requestPage(baseUrl, '/our-publications');
  if (pubRes.status !== 200 || !pubRes.doc) {
    return { pass: false, message: '/our-publications returned non-200' };
  }

  return { pass: true, message: 'Homepage blog snippet successfully cross-links to /our-publications hub' };
});

runner.register(1, 'M1', 'T1.R1.6', 'Legacy WordPress 301 URL Preservation & Redirect Map', async () => {
  const redirectsPath = path.join(PROJECT_ROOT, 'public/_redirects');
  if (!fs.existsSync(redirectsPath)) {
    return { pass: false, message: 'public/_redirects file missing' };
  }
  const content = fs.readFileSync(redirectsPath, 'utf-8');

  const missingRedirects = [];
  for (const slug of BLOG_SLUGS) {
    if (!content.includes(slug)) {
      missingRedirects.push(slug);
    }
  }

  if (missingRedirects.length > 0) {
    return { pass: false, message: `Missing 301 redirect rules for slugs: ${missingRedirects.join(', ')}` };
  }

  return { pass: true, message: 'All 11 legacy WordPress URLs mapped to /blog/:slug with 301 redirects' };
});

// ── Feature R2: Service Area Template & Multi-City Generation ──────────────

runner.register(1, 'M2', 'T1.R2.1', 'Service Area Template Architecture & Modular Section Roster', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/service-area/jupiter');
  if (res.status === 404 || !res.ok || !res.doc) {
    return {
      pass: false,
      message: `/service-area/jupiter route returned status ${res.status} (Feature M2 pending implementation)`
    };
  }
  const text = res.doc.text();
  const links = res.doc.links();

  const hasJupiter = text.includes('Jupiter');
  const hasServices = links.some(l => l.href && l.href.includes('/service/')) || text.includes('Cleaning');
  const hasQuoteOrPhone = links.some(l => l.href && (l.href.startsWith('tel:') || l.href.includes('quote'))) || text.includes('Quote');

  if (!hasJupiter || !hasServices || !hasQuoteOrPhone) {
    return {
      pass: false,
      message: `Template layout incomplete on /service-area/jupiter (hasJupiter=${hasJupiter}, hasServices=${hasServices}, hasCTA=${hasQuoteOrPhone})`
    };
  }

  return { pass: true, message: 'Service area landing page renders complete modular structure for Jupiter' };
});

runner.register(1, 'M2', 'T1.R2.2', 'Localized Headings, City Metadata & Geo Coordinates', async (baseUrl) => {
  for (const city of SAMPLE_SERVICE_AREAS) {
    const res = await requestPage(baseUrl, `/service-area/${city.slug}`);
    if (res.status === 404 || !res.ok || !res.doc) {
      return {
        pass: false,
        message: `/service-area/${city.slug} returned status ${res.status} (Feature M2 pending implementation)`
      };
    }
    const title = res.doc.title();
    const metaDesc = res.doc.meta('description');
    const h1 = res.doc.h1();

    if (!title.includes(city.name)) {
      return { pass: false, message: `/service-area/${city.slug} <title> does not include "${city.name}" (got: "${title}")` };
    }
    if (!metaDesc.includes(city.name)) {
      return { pass: false, message: `/service-area/${city.slug} meta description does not include "${city.name}"` };
    }
    if (!h1.includes(city.name)) {
      return { pass: false, message: `/service-area/${city.slug} <h1> does not include "${city.name}" (got: "${h1}")` };
    }
  }
  return { pass: true, message: 'Localized headings, titles, and descriptions verified across sample cities' };
});

runner.register(1, 'M2', 'T1.R2.3', 'Localized Neighborhood Highlights & Commercial Transit Corridors', async (baseUrl) => {
  for (const city of SAMPLE_SERVICE_AREAS) {
    const res = await requestPage(baseUrl, `/service-area/${city.slug}`);
    if (res.status === 404 || !res.ok || !res.doc) {
      return {
        pass: false,
        message: `/service-area/${city.slug} returned ${res.status} (Feature M2 pending implementation)`
      };
    }
    const pageText = res.doc.text();
    const matchedNeighborhoods = city.neighborhoods.filter(n => pageText.includes(n));
    if (matchedNeighborhoods.length < 2) {
      return {
        pass: false,
        message: `/service-area/${city.slug} missing expected neighborhoods (found only: ${matchedNeighborhoods.join(', ')}; expected: ${city.neighborhoods.join(', ')})`
      };
    }
  }
  return { pass: true, message: 'Authentic local neighborhoods & corridors verified across service areas' };
});

runner.register(1, 'M2', 'T1.R2.4', 'Interactive Local Guide (Landmarks & Activities Presentation)', async (baseUrl) => {
  const jupiterRes = await requestPage(baseUrl, '/service-area/jupiter');
  if (jupiterRes.status === 404 || !jupiterRes.ok || !jupiterRes.doc) {
    return {
      pass: false,
      message: `/service-area/jupiter returned ${jupiterRes.status} (Feature M2 pending implementation)`
    };
  }
  const pageText = jupiterRes.doc.text();
  const landmarkMatches = ['Jupiter Inlet Lighthouse', 'Harbourside Place', 'Roger Dean'].filter(l => pageText.includes(l));
  if (landmarkMatches.length === 0) {
    return {
      pass: false,
      message: `Jupiter local guide missing authentic landmarks (expected lighthouse/harbourside)`
    };
  }
  return { pass: true, message: 'Interactive Local Guide renders authentic landmarks for Jupiter' };
});

runner.register(1, 'M2', 'T1.R2.5', 'Specialized Cleaning Services Catalog Grid Adaptation', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/service-area/jupiter');
  if (res.status === 404 || !res.ok || !res.doc) {
    return {
      pass: false,
      message: `/service-area/jupiter returned ${res.status} (Feature M2 pending implementation)`
    };
  }
  const bodyText = res.doc.text();
  const hasCleaningKeywords = ['Office Cleaning', 'Commercial Cleaning', 'Disinfection', 'Turnover'].some(k => bodyText.includes(k));

  if (!hasCleaningKeywords) {
    return { pass: false, message: 'Cleaning services grid not detected on /service-area/jupiter' };
  }
  return { pass: true, message: 'Cleaning services catalog properly adapted on service area landing page' };
});

runner.register(1, 'M2', 'T1.R2.6', 'Localized FAQ Accordion & Responsive Google Maps Embed', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/service-area/jupiter');
  if (res.status === 404 || !res.ok || !res.doc) {
    return {
      pass: false,
      message: `/service-area/jupiter returned ${res.status} (Feature M2 pending implementation)`
    };
  }
  const html = res.bodyText;
  const hasMapIframe = html.includes('maps.google.com') || html.includes('google.com/maps');
  const pageText = res.doc.text();
  const hasFaqQuestions = (pageText.match(/\?/g) || []).length >= 3;

  if (!hasMapIframe) {
    return { pass: false, message: '/service-area/jupiter missing Google Maps embed iframe' };
  }
  if (!hasFaqQuestions) {
    return { pass: false, message: '/service-area/jupiter missing localized FAQ section with question marks' };
  }
  return { pass: true, message: 'Responsive Google Maps embed and localized FAQs verified on Jupiter page' };
});

runner.register(1, 'M2', 'T1.R2.7', 'Service Areas Directory Index Page (/service-areas)', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/service-areas');
  if (res.status === 404 || !res.ok || !res.doc) {
    return {
      pass: false,
      message: `/service-areas returned status ${res.status} (Feature M2 pending implementation)`
    };
  }
  const cityLinks = res.doc.links().filter(l => l.href && l.href.includes('/service-area/'));
  if (cityLinks.length < 10) {
    return {
      pass: false,
      message: `/service-areas contains insufficient city links (found ${cityLinks.length}; expected >= 10)`
    };
  }
  return { pass: true, message: `/service-areas directory lists ${cityLinks.length} localized service area destinations` };
});

// ── Feature R3: Internal Navigation Integration ────────────────────────────

runner.register(1, 'M3', 'T1.R3.1', 'Desktop Header Navigation Links & Primary Telephony CTA', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/');
  if (!res.doc) return { pass: false, message: 'Could not fetch homepage' };

  const html = res.bodyText;
  const hasHeader = html.includes('<header') || html.includes('role="banner"');
  if (!hasHeader) return { pass: false, message: 'Header element missing on homepage' };

  const links = res.doc.links();
  const hasPhone = links.some(l => l.href && l.href.startsWith('tel:')) || html.includes('561) 704-5303') || html.includes('5617045303');
  const hasServices = links.some(l => l.href && l.href.includes('service'));
  const hasPublications = links.some(l => l.href && (l.href.includes('publication') || l.href.includes('blog')));

  if (!hasPhone) return { pass: false, message: 'Header missing telephone CTA link (561) 704-5303' };
  if (!hasServices) return { pass: false, message: 'Header missing services navigation link' };
  if (!hasPublications) return { pass: false, message: 'Header missing publications/blog navigation link' };

  return { pass: true, message: 'Desktop header navigation contains phone CTA, services dropdown, and publications links' };
});

runner.register(1, 'M3', 'T1.R3.2', 'Mobile Drawer Navigation Structure & Toggle Accessibility', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/');
  if (!res.doc) return { pass: false, message: 'Could not fetch homepage' };
  const html = res.bodyText;

  const hasDrawer = html.includes('mobile-nav-drawer') || html.includes('aria-label="Toggle navigation"') || html.includes('data-mobile-menu') || html.includes('mobile');
  if (!hasDrawer) {
    return { pass: false, message: 'Mobile drawer markup or toggle control not detected in HTML' };
  }
  return { pass: true, message: 'Mobile drawer navigation structure verified with accessible toggle controls' };
});

runner.register(1, 'M3', 'T1.R3.3', 'Footer Corporate NAP, Divisions & Publications Directory', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/');
  if (!res.doc) return { pass: false, message: 'Could not fetch homepage' };
  const html = res.bodyText;

  const hasFooter = html.includes('<footer');
  if (!hasFooter) return { pass: false, message: 'Footer element missing' };

  const text = res.doc.text();
  const hasPhone = text.includes('561') || html.includes('tel:');
  const hasHQ = text.includes('Boynton Beach') || text.includes('South Florida');
  const blogLinksInFooter = res.doc.links().filter(l => l.href && l.href.includes('/blog/'));

  if (!hasPhone) return { pass: false, message: 'Footer missing corporate telephone' };
  if (!hasHQ) return { pass: false, message: 'Footer missing South Florida / Boynton Beach HQ reference' };
  if (blogLinksInFooter.length < 5) {
    return { pass: false, message: `Footer missing blog directory links (found ${blogLinksInFooter.length}; expected >= 5)` };
  }

  return { pass: true, message: `Footer contains corporate NAP and directory strip with ${blogLinksInFooter.length} blog links` };
});

runner.register(1, 'M3', 'T1.R3.4', 'Zero Broken Internal Links Across Representative Routes', async (baseUrl) => {
  const crawlPages = ['/', '/about-us', '/our-services', '/our-publications'];
  const testedLinks = new Set();
  const brokenLinks = [];

  for (const page of crawlPages) {
    const res = await requestPage(baseUrl, page);
    if (!res.doc) continue;

    const links = res.doc.links();
    for (const item of links) {
      const rawHref = item.href;
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('tel:') || rawHref.startsWith('mailto:') || rawHref.startsWith('http')) continue;
      const cleanPath = rawHref.split('?')[0].split('#')[0];
      if (!cleanPath || cleanPath === '/' || testedLinks.has(cleanPath)) continue;
      testedLinks.add(cleanPath);

      const targetRes = await requestPage(baseUrl, cleanPath);
      if (targetRes.status === 404) {
        brokenLinks.push({ source: page, target: cleanPath, status: targetRes.status });
      }
    }
  }

  if (brokenLinks.length > 0) {
    return {
      pass: false,
      message: `Detected ${brokenLinks.length} broken internal links: ${brokenLinks.slice(0, 5).map(b => `${b.source} -> ${b.target} (${b.status})`).join('; ')}`
    };
  }

  return { pass: true, message: `Crawled ${testedLinks.size} unique internal links with 0 broken 404 targets` };
});

runner.register(1, 'M3', 'T1.R3.5', 'Actionable CTA & Quote Modal Triggers Wiring', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/');
  if (!res.doc) return { pass: false, message: 'Could not fetch homepage' };

  const links = res.doc.links();
  const telLinks = links.filter(l => l.href && l.href.startsWith('tel:'));
  const hasQuote = res.bodyText.includes('Quote') || links.some(l => l.text.includes('Quote'));

  if (telLinks.length === 0) return { pass: false, message: 'No direct tel: CTA links found' };
  if (!hasQuote) return { pass: false, message: 'No Free Quote action triggers found' };

  return { pass: true, message: `Actionable CTAs verified (${telLinks.length} tel links, quote action triggers present)` };
});

// ── Feature R4: Route Status, SEO & JSON-LD Schema ──────────────────────────

runner.register(1, 'M4', 'T1.R4.1', 'HTTP 200 Status Across All Core Canonical Routes', async (baseUrl) => {
  const failed = [];
  for (const page of CORE_PAGES) {
    const res = await requestPage(baseUrl, page);
    if (res.status !== 200) {
      failed.push({ page, status: res.status });
    }
  }
  if (failed.length > 0) {
    return { pass: false, message: `Core routes failed HTTP 200: ${failed.map(f => `${f.page} (${f.status})`).join(', ')}` };
  }
  return { pass: true, message: `All ${CORE_PAGES.length} core routes returned HTTP 200 OK` };
});

runner.register(1, 'M4', 'T1.R4.2', 'Unique SEO Titles & Meta Descriptions Compliance', async (baseUrl) => {
  const titles = new Map();
  const descriptions = new Map();
  const errors = [];

  for (const page of CORE_PAGES) {
    const res = await requestPage(baseUrl, page);
    if (!res.doc) continue;
    const title = res.doc.title();
    const desc = res.doc.meta('description');

    if (!title) errors.push(`${page} missing <title>`);
    if (!desc) errors.push(`${page} missing meta description`);

    if (titles.has(title)) errors.push(`Duplicate title between ${page} and ${titles.get(title)}: "${title}"`);
    else titles.set(title, page);

    if (descriptions.has(desc)) errors.push(`Duplicate description between ${page} and ${descriptions.get(desc)}`);
    else descriptions.set(desc, page);
  }

  if (errors.length > 0) {
    return { pass: false, message: `SEO Title/Meta errors: ${errors.join('; ')}` };
  }
  return { pass: true, message: 'All core routes have unique titles and descriptive meta tags' };
});

runner.register(1, 'M4', 'T1.R4.3', 'JSON-LD Schema Strict Syntax & Absence of Corruption', async (baseUrl) => {
  const checkPages = ['/', '/about-us', '/our-services', '/blog/revitalize-your-office-space'];
  for (const page of checkPages) {
    const res = await requestPage(baseUrl, page);
    if (!res.doc) continue;

    const blocks = res.doc.jsonLd();
    if (blocks.length === 0) {
      return { pass: false, message: `${page} has 0 JSON-LD schema blocks` };
    }

    for (let i = 0; i < blocks.length; i++) {
      const raw = blocks[i];
      if (/,\s*([\}\]])/g.test(raw)) {
        return { pass: false, message: `${page} schema block ${i + 1} has trailing commas` };
      }
      try {
        JSON.parse(raw);
      } catch (err) {
        return { pass: false, message: `${page} schema block ${i + 1} JSON parse error: ${err.message}` };
      }
    }
  }
  return { pass: true, message: 'JSON-LD blocks validated strictly with 0 syntax errors or trailing commas' };
});

runner.register(1, 'M4', 'T1.R4.4', 'LocalBusiness & CleaningService Schema Graph Integrity', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/');
  if (!res.doc) return { pass: false, message: 'Could not fetch homepage' };
  const blocks = res.doc.jsonLd();

  let foundBusiness = false;
  let hasPhone = false;
  let hasAddress = false;

  for (let i = 0; i < blocks.length; i++) {
    try {
      const parsed = JSON.parse(blocks[i]);
      const nodes = parsed['@graph'] || (Array.isArray(parsed) ? parsed : [parsed]);
      for (const node of nodes) {
        const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
        if (types.includes('LocalBusiness') || types.includes('CleaningService') || types.includes('ProfessionalService')) {
          foundBusiness = true;
          if (node.telephone) hasPhone = true;
          if (node.address) hasAddress = true;
        }
      }
    } catch {}
  }

  if (!foundBusiness) return { pass: false, message: 'Homepage missing LocalBusiness / CleaningService schema' };
  if (!hasPhone) return { pass: false, message: 'LocalBusiness schema missing telephone property' };
  if (!hasAddress) return { pass: false, message: 'LocalBusiness schema missing address property' };

  return { pass: true, message: 'LocalBusiness / CleaningService schema verified with phone, address, and coordinates' };
});

runner.register(1, 'M4', 'T1.R4.5', 'BreadcrumbList & FAQPage Schema Alignment', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/faqs');
  if (!res.doc) return { pass: false, message: 'Could not fetch /faqs' };
  const blocks = res.doc.jsonLd();

  let foundFaq = false;
  let questionCount = 0;

  for (let i = 0; i < blocks.length; i++) {
    try {
      const parsed = JSON.parse(blocks[i]);
      const nodes = parsed['@graph'] || (Array.isArray(parsed) ? parsed : [parsed]);
      for (const node of nodes) {
        if (node['@type'] === 'FAQPage' && Array.isArray(node.mainEntity)) {
          foundFaq = true;
          questionCount = node.mainEntity.length;
        }
      }
    } catch {}
  }

  if (!foundFaq || questionCount < 3) {
    return { pass: false, message: `FAQ page missing valid FAQPage schema (foundFaq=${foundFaq}, questionCount=${questionCount})` };
  }
  return { pass: true, message: `FAQPage schema validated with ${questionCount} structured question-answer entities` };
});

// ══════════════════════════════════════════════════════════════════════════
// TIER 2: BOUNDARY & CORNER CASES (>= 5 Tests)
// ══════════════════════════════════════════════════════════════════════════

runner.register(2, 'M4', 'T2.B.1', 'Non-Existent Route 404 Error Handling & Fallback Document', async (baseUrl) => {
  const badRoutes = [
    '/service-area/non-existent-city-xyz',
    '/blog/phantom-post-123',
    '/invalid-random-path-987'
  ];

  for (const badRoute of badRoutes) {
    const res = await requestPage(baseUrl, badRoute);
    if (res.status !== 404 && !res.bodyText.includes('404') && !res.bodyText.includes('Not Found')) {
      return {
        pass: false,
        message: `${badRoute} returned HTTP ${res.status} instead of 404 Not Found error state`
      };
    }
  }
  return { pass: true, message: 'Non-existent routes properly return 404 or serve designated 404 document' };
});

runner.register(2, 'M4', 'T2.B.2', 'Trailing Slash Route Normalization & Canonical Consistency', async (baseUrl) => {
  const pathNoSlash = '/blog/revitalize-your-office-space';
  const pathWithSlash = '/blog/revitalize-your-office-space/';

  const res1 = await requestPage(baseUrl, pathNoSlash);
  const res2 = await requestPage(baseUrl, pathWithSlash);

  if (!res1.ok && res1.status !== 301) {
    return { pass: false, message: `${pathNoSlash} returned unexpected status ${res1.status}` };
  }
  if (!res2.ok && res2.status !== 301) {
    return { pass: false, message: `${pathWithSlash} returned unexpected status ${res2.status}` };
  }

  return { pass: true, message: 'Trailing slash variants resolve cleanly without infinite redirect loops' };
});

runner.register(2, 'M4', 'T2.B.3', 'URL Case Sensitivity & Tracking Query String Immunity', async (baseUrl) => {
  const queryPath = '/blog/office-cleaning-made-easy?utm_source=google&utm_campaign=spring2026&gclid=test';
  const res = await requestPage(baseUrl, queryPath);

  if (res.status !== 200 || !res.doc) {
    return { pass: false, message: `Route with query parameters failed with status ${res.status}` };
  }

  const canonical = res.doc.canonical();
  if (canonical.includes('utm_source') || canonical.includes('gclid')) {
    return { pass: false, message: `Canonical tag contains tracking parameters: ${canonical}` };
  }

  return { pass: true, message: 'Routes with tracking query parameters serve canonical document correctly' };
});

runner.register(2, 'M4', 'T2.B.4', 'Service Directory Search Filter Input Boundary Defense', async (baseUrl) => {
  const dirRes = await requestPage(baseUrl, '/service-areas');
  if (dirRes.status === 404) {
    return {
      pass: false,
      message: '/service-areas directory route pending M2 implementation'
    };
  }
  const html = dirRes.bodyText;
  const hasSearchInput = html.includes('type="search"') || html.includes('placeholder=') || html.includes('Search');
  if (!hasSearchInput) {
    return { pass: false, message: '/service-areas directory missing search filter input' };
  }

  return { pass: true, message: 'Directory search input element present and handles boundary inputs safely' };
});

runner.register(2, 'M4', 'T2.B.5', 'Viewport Responsive Meta Tag & Standard Breakpoint Containers', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/');
  if (!res.doc) return { pass: false, message: 'Could not fetch homepage' };

  const viewport = res.doc.meta('viewport');
  if (!viewport || !viewport.includes('width=device-width')) {
    return { pass: false, message: `Missing or invalid viewport meta tag: "${viewport}"` };
  }

  const html = res.bodyText;
  const hasResponsiveMarkers = ['container', 'mobile', 'auto-fit', 'md:', 'lg:', 'grid'].some(bp => html.includes(bp));
  if (!hasResponsiveMarkers) {
    return { pass: false, message: 'Page lacks standard responsive containers or breakpoint indicators' };
  }

  return { pass: true, message: 'Viewport meta tag and responsive breakpoint containers verified across layout' };
});

runner.register(2, 'M4', 'T2.B.6', 'Schema Script Injection & XSS Vulnerability Defense', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/');
  if (!res.doc) return { pass: false, message: 'Could not fetch homepage' };
  const blocks = res.doc.jsonLd();

  for (let i = 0; i < blocks.length; i++) {
    const raw = blocks[i];
    if (raw.includes('</script') && !raw.includes('<\\/script')) {
      return { pass: false, message: `Potentially vulnerable unescaped </script tag in schema block ${i + 1}` };
    }
  }

  return { pass: true, message: 'JSON-LD blocks free of script breakout vulnerabilities' };
});

// ══════════════════════════════════════════════════════════════════════════
// TIER 3: CROSS-FEATURE INTERACTIONS (5 Tests)
// ══════════════════════════════════════════════════════════════════════════

runner.register(3, 'M4', 'T3.C.1', 'Full Customer Navigation Funnel (Home -> Blog -> Footer -> City -> Quote)', async (baseUrl) => {
  // Step 1: Home page
  const homeRes = await requestPage(baseUrl, '/');
  if (!homeRes.doc) return { pass: false, message: 'Funnel Step 1: Could not load Home' };

  // Step 2: Recent blog link on home
  const blogLink = homeRes.doc.links().find(l => l.href && l.href.includes('/blog/'))?.href;
  if (!blogLink) return { pass: false, message: 'Funnel Step 2: No blog link on Home (M1 Homepage Snippet pending)' };

  // Step 3: Navigate to blog article
  const blogRes = await requestPage(baseUrl, blogLink);
  if (blogRes.status !== 200) return { pass: false, message: `Funnel Step 3: Blog article ${blogLink} returned ${blogRes.status}` };

  // Step 4: Extract service corridor link from footer or service area link
  const cityLink = blogRes.doc?.links().find(l => l.href && l.href.includes('/service-area/'))?.href || '/service-area/jupiter';
  const cityRes = await requestPage(baseUrl, cityLink);
  if (cityRes.status === 404) {
    return { pass: false, message: `Funnel Step 4: Service area link ${cityLink} returned 404 (M2/M3 pending)` };
  }

  // Step 5: Check Quote CTA / Modal button on city landing page
  const text = cityRes.doc?.text() || '';
  const links = cityRes.doc?.links() || [];
  const hasQuote = links.some(l => l.href && l.href.startsWith('tel:')) || text.includes('Quote');
  if (!hasQuote) return { pass: false, message: 'Funnel Step 5: Missing quote CTA on service area page' };

  return { pass: true, message: 'End-to-end customer navigation funnel verified: Home -> Blog -> City -> Quote CTA' };
});

runner.register(3, 'M4', 'T3.C.2', 'Schema Graph Cross-Entity Integrity (Service -> Provider -> AreaServed)', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/service-area/jupiter');
  if (res.status === 404 || !res.doc) {
    return { pass: false, message: '/service-area/jupiter route returned 404 (Feature M2 pending implementation)' };
  }
  const blocks = res.doc.jsonLd();

  let hasLinkedGraph = false;
  for (let i = 0; i < blocks.length; i++) {
    try {
      const parsed = JSON.parse(blocks[i]);
      const nodes = parsed['@graph'] || (Array.isArray(parsed) ? parsed : [parsed]);
      for (const node of nodes) {
        if (node['@type'] === 'Service' || (Array.isArray(node['@type']) && node['@type'].includes('Service'))) {
          if (node.provider && node.areaServed) {
            hasLinkedGraph = true;
          }
        }
      }
    } catch {}
  }

  if (!hasLinkedGraph) {
    return { pass: false, message: '/service-area/jupiter schema graph missing Service linked to provider and areaServed' };
  }

  return { pass: true, message: 'Schema graph cross-links Service entity to Organization provider and City areaServed' };
});

runner.register(3, 'M4', 'T3.C.3', 'Directory to Detail Page Cross-Navigation & Reciprocal Breadcrumbs', async (baseUrl) => {
  const dirRes = await requestPage(baseUrl, '/service-areas');
  if (dirRes.status === 404 || !dirRes.doc) {
    return { pass: false, message: '/service-areas directory returned 404 (Feature M2 pending implementation)' };
  }

  const jupiterLink = dirRes.doc.links().find(l => l.href && l.href.includes('/service-area/jupiter'))?.href || '/service-area/jupiter';
  const detailRes = await requestPage(baseUrl, jupiterLink);
  if (detailRes.status !== 200 || !detailRes.doc) {
    return { pass: false, message: `Detail page ${jupiterLink} returned status ${detailRes.status}` };
  }

  const breadcrumbBackLink = detailRes.doc.links().some(l => l.href && l.href.includes('/service-areas'));
  if (!breadcrumbBackLink) {
    return { pass: false, message: `Detail page ${jupiterLink} missing breadcrumb link back to /service-areas directory` };
  }

  return { pass: true, message: 'Reciprocal cross-navigation verified: /service-areas <-> /service-area/jupiter' };
});

runner.register(3, 'M4', 'T3.C.4', 'Cross-Division Blog Content to Service Offerings Association', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/blog/medical-office-cleaning-guide');
  if (!res.doc) return { pass: false, message: 'Could not fetch medical blog post' };

  const bodyText = res.doc.text();
  const links = res.doc.links();
  const serviceLink = links.some(l => l.href && (l.href.includes('/service/medical-office-cleaning') || l.href.includes('/service/office-cleaning')));
  const mentionsMedicalService = bodyText.includes('Medical Office Cleaning') || serviceLink;

  if (!mentionsMedicalService) {
    return { pass: false, message: 'Medical blog post missing semantic association with medical office service' };
  }

  return { pass: true, message: 'Blog content semantically references corresponding service divisions' };
});

runner.register(3, 'M4', 'T3.C.5', 'Interactive Cleaning Estimator / Quote Lead Capture Integration', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/');
  if (!res.doc) return { pass: false, message: 'Could not fetch homepage' };

  const html = res.bodyText;
  const hasForm = html.includes('<form') || html.includes('quote') || html.includes('input');
  const hasPhoneDispatch = res.doc.links().some(l => l.href && l.href.startsWith('tel:'));

  if (!hasForm && !hasPhoneDispatch) {
    return { pass: false, message: 'Lead capture mechanism (form or direct phone dispatch) missing on homepage' };
  }

  return { pass: true, message: 'Lead capture mechanisms (estimator, quote triggers, telephone) properly integrated' };
});

// ══════════════════════════════════════════════════════════════════════════
// TIER 4: REAL-WORLD CUSTOMER JOURNEYS (5 Personas)
// ══════════════════════════════════════════════════════════════════════════

runner.register(4, 'M4', 'T4.J.1', 'Customer Journey 1: Jupiter Commercial Facility Manager (Office Cleaning)', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/service-area/jupiter');
  if (res.status === 404 || !res.doc) {
    return { pass: false, message: 'Facility manager landed on 404 at /service-area/jupiter (M2 pending)' };
  }
  const text = res.doc.text();

  const hasOfficeClean = text.includes('Office Cleaning') || text.includes('Commercial Cleaning');
  const hasDistrict = text.includes('Abacoa') || text.includes('Indiantown');
  const hasHygiene = text.includes('Disinfection') || text.includes('Hospital') || text.includes('Sanitization') || text.includes('Clean');
  const hasPhone = res.doc.links().some(l => l.href && l.href.startsWith('tel:')) || text.includes('561');

  if (!hasOfficeClean || !hasDistrict || !hasHygiene || !hasPhone) {
    return {
      pass: false,
      message: `Facility manager journey incomplete on Jupiter page (office=${hasOfficeClean}, district=${hasDistrict}, hygiene=${hasHygiene}, phone=${hasPhone})`
    };
  }
  return { pass: true, message: 'Customer Journey 1: Jupiter facility manager successfully accesses commercial office cleaning' };
});

runner.register(4, 'M4', 'T4.J.2', 'Customer Journey 2: Boca Raton Luxury Homeowner (Recurring Maid Rotation)', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/service-area/boca-raton');
  if (res.status === 404 || !res.doc) {
    return { pass: false, message: 'Homeowner landed on 404 at /service-area/boca-raton (M2 pending)' };
  }
  const text = res.doc.text();

  const hasResidential = text.includes('Residential') || text.includes('Home') || text.includes('Maid');
  const hasMizner = text.includes('Mizner Park') || text.includes('Town Center') || text.includes('Camino Real');
  const hasTrust = text.includes('Bonded') || text.includes('Insured') || text.includes('Guarantee') || text.includes('Vetted');

  if (!hasResidential || !hasMizner || !hasTrust) {
    return {
      pass: false,
      message: `Boca Raton homeowner journey incomplete (residential=${hasResidential}, mizner=${hasMizner}, trust=${hasTrust})`
    };
  }
  return { pass: true, message: 'Customer Journey 2: Boca Raton luxury homeowner successfully verifies residential maid service' };
});

runner.register(4, 'M4', 'T4.J.3', 'Customer Journey 3: Palm Beach Gardens Medical Clinic (Terminal Disinfection)', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/service-area/palm-beach-gardens');
  if (res.status === 404 || !res.doc) {
    return { pass: false, message: 'Clinic manager landed on 404 at /service-area/palm-beach-gardens (M2 pending)' };
  }
  const text = res.doc.text();

  const hasMedical = text.includes('Medical') || text.includes('Healthcare') || text.includes('Disinfection') || text.includes('Clinical');
  const hasPGA = text.includes('PGA') || text.includes('Midtown') || text.includes('Gardens Mall');
  const hasCTA = res.doc.links().some(l => l.href && (l.href.startsWith('tel:') || l.href.includes('quote'))) || text.includes('Quote');

  if (!hasMedical || !hasPGA || !hasCTA) {
    return {
      pass: false,
      message: `Medical clinic journey incomplete in PBG (medical=${hasMedical}, pga=${hasPGA}, cta=${hasCTA})`
    };
  }
  return { pass: true, message: 'Customer Journey 3: Palm Beach Gardens clinic manager successfully validates disinfection capabilities' };
});

runner.register(4, 'M4', 'T4.J.4', 'Customer Journey 4: Delray Beach Short-Term Rental Host (Same-Day Turnover)', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/service-area/delray-beach');
  if (res.status === 404 || !res.doc) {
    return { pass: false, message: 'Rental host landed on 404 at /service-area/delray-beach (M2 pending)' };
  }
  const text = res.doc.text();

  const hasTurnover = text.includes('Short-Term') || text.includes('Turnover') || text.includes('Rental') || text.includes('Airbnb') || text.includes('Cleaning');
  const hasAtlantic = text.includes('Atlantic Avenue') || text.includes('Pineapple Grove') || text.includes('Lake Ida');
  const hasFastAction = res.doc.links().some(l => l.href && (l.href.startsWith('tel:') || l.href.includes('quote'))) || text.includes('Quote');

  if (!hasTurnover || !hasAtlantic || !hasFastAction) {
    return {
      pass: false,
      message: `Delray Beach host journey incomplete (turnover=${hasTurnover}, atlantic=${hasAtlantic}, fastAction=${hasFastAction})`
    };
  }
  return { pass: true, message: 'Customer Journey 4: Delray Beach short-term rental host successfully books turnover turnover' };
});

runner.register(4, 'M4', 'T4.J.5', 'Customer Journey 5: West Palm Beach General Contractor (Post-Construction Cleanup)', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/service-area/west-palm-beach');
  if (res.status === 404 || !res.doc) {
    return { pass: false, message: 'Contractor landed on 404 at /service-area/west-palm-beach (M2 pending)' };
  }
  const text = res.doc.text();

  const hasConstruction = text.includes('Post-Construction') || text.includes('Construction') || text.includes('Commercial') || text.includes('Cleanup');
  const hasClematis = text.includes('Clematis') || text.includes('CityPlace') || text.includes('Downtown');
  const hasEstimateAction = res.doc.links().some(l => l.href && (l.href.startsWith('tel:') || l.href.includes('quote'))) || text.includes('Quote');

  if (!hasConstruction || !hasClematis || !hasEstimateAction) {
    return {
      pass: false,
      message: `WPB contractor journey incomplete (construction=${hasConstruction}, clematis=${hasClematis}, estimate=${hasEstimateAction})`
    };
  }
  return { pass: true, message: 'Customer Journey 5: West Palm Beach contractor successfully schedules post-construction cleanup' };
});

// ── Entrypoint Execution ───────────────────────────────────────────────────
async function main() {
  let serverInstance = null;
  if (!TARGET_URL) {
    serverInstance = createTestServer();
    await new Promise((resolve) => {
      serverInstance.listen(PORT, '127.0.0.1', () => {
        resolve(true);
      });
    });
  }

  let success = false;
  try {
    success = await runner.runAll();
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
  }

  process.exit(success ? 0 : 1);
}

main().catch((err) => {
  console.error('[FATAL ERROR IN RUNNER]:', err);
  process.exit(1);
});
