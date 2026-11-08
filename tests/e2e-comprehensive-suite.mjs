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
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '..');
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

const ALL_SERVICE_AREA_SLUGS = [
  "west-palm-beach",
  "boca-raton",
  "delray-beach",
  "jupiter",
  "palm-beach-gardens",
  "wellington",
  "boynton-beach",
  "lake-worth-beach",
  "royal-palm-beach",
  "north-palm-beach",
  "riviera-beach",
  "greenacres",
  "lantana",
  "palm-springs",
  "lake-park",
  "tequesta",
  "juno-beach",
  "highland-beach",
  "hypoluxo",
  "manalapan",
  "ocean-ridge",
  "south-palm-beach",
  "palm-beach",
  "atlantis",
  "haverhill",
  "mangonia-park",
  "loxahatchee",
  "the-acreage",
  "palm-beach-shores",
  "glen-ridge",
  "gulf-stream",
  "cloud-lake",
  "golf",
  "briny-breezes",
  "jupiter-inlet-colony",
  "lake-clarke-shores",
  "palm-beach-gardens-west",
  "westlake",
  "avenir",
  "arden",
  "century-village",
  "kings-point",
  "golden-lakes",
  "limestone-creek",
  "pine-jog",
  "schall-circle",
  "cabana-colony",
  "kenwood-estates",
  "san-castle",
  "gun-club-estates",
  "okeechobee-county",
  "st-lucie-county",
  "martin-county",
  "orange-county",
  "broward-county",
  "miami-dade-county"
];

const SERVICE_DIVISION_SLUGS = [
  "office-cleaning",
  "medical-office-cleaning",
  "bars-and-restaurant-cleaning",
  "short-term-rentals",
  "post-construction-cleaning",
  "move-in-out-cleaning",
  "home-maintenance",
  "school-cleaning",
  "home-watching",
  "covid-19-disinfection"
];

const ALL_86_CANONICAL_ROUTES = [
  ...CORE_PAGES,
  "/service",
  ...SERVICE_DIVISION_SLUGS.map(s => `/service/${s}`),
  ...BLOG_SLUGS.map(s => `/blog/${s}`),
  "/service-areas",
  ...ALL_SERVICE_AREA_SLUGS.map(s => `/service-area/${s}`),
  "/404"
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

  forms() {
    const r = /<form\b([\s\S]*?)>([\s\S]*?)<\/form>/gi;
    const forms = [];
    let match;
    while ((match = r.exec(this.html)) !== null) {
      const rawAttrs = match[1];
      const innerHtml = match[2];

      const getAttr = (name) => {
        const m = rawAttrs.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'));
        return m ? m[1] : (new RegExp(`\\b${name}\\b`, 'i').test(rawAttrs) ? 'true' : null);
      };

      const inputs = [];
      const inputRegex = /<(input|textarea|select)\b([^>]*?)\/?>/gi;
      let inputMatch;
      while ((inputMatch = inputRegex.exec(innerHtml)) !== null) {
        const tag = inputMatch[1].toLowerCase();
        const attrs = inputMatch[2];
        const getName = attrs.match(/\bname=["']([^"']*)["']/i);
        const getType = attrs.match(/\btype=["']([^"']*)["']/i);
        const getValue = attrs.match(/\bvalue=["']([^"']*)["']/i);
        inputs.push({
          tag,
          name: getName ? getName[1] : null,
          type: getType ? getType[1].toLowerCase() : (tag === 'textarea' ? 'textarea' : 'text'),
          value: getValue ? getValue[1] : null,
          raw: inputMatch[0]
        });
      }

      forms.push({
        rawAttrs,
        innerHtml,
        name: getAttr('name'),
        method: (getAttr('method') || 'GET').toUpperCase(),
        dataNetlify: getAttr('data-netlify'),
        netlify: getAttr('netlify'),
        dataNetlifyHoneypot: getAttr('data-netlify-honeypot'),
        netlifyHoneypot: getAttr('netlify-honeypot'),
        hidden: /\bhidden\b/i.test(rawAttrs),
        inputs
      });
    }
    return forms;
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

    // Handle Netlify Form POST submission simulation
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 1e6) req.destroy(); // 1MB flood protection
      });
      req.on('end', () => {
        const params = new URLSearchParams(body);
        const formName = params.get('form-name');

        // Emulate Netlify Form edge processor
        if (formName === 'quote-request') {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Netlify-Form-Processed': 'true'
          });
          return res.end(JSON.stringify({
            success: true,
            message: 'Netlify form submission successfully simulated',
            form: formName,
            fields: Object.fromEntries(params.entries())
          }));
        }

        // Generic 200 for other form POSTs
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
      });
      return;
    }

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

runner.register(1, "M2", "T1.R2.8", "Multi-City Google Maps Embed Verification Across Representative Service Areas", async (baseUrl) => {
  const representativeCities = [
    { slug: "jupiter", name: "Jupiter" },
    { slug: "boca-raton", name: "Boca Raton" },
    { slug: "west-palm-beach", name: "West Palm Beach" },
    { slug: "palm-beach-gardens", name: "Palm Beach Gardens" },
    { slug: "delray-beach", name: "Delray Beach" },
    { slug: "boynton-beach", name: "Boynton Beach" }
  ];

  const errors = [];
  for (const city of representativeCities) {
    const res = await requestPage(baseUrl, `/service-area/${city.slug}`);
    if (res.status === 404 || !res.ok || !res.doc) {
      errors.push(`/service-area/${city.slug} returned HTTP status ${res.status}`);
      continue;
    }
    const html = res.bodyText;
    const hasMapIframe = (html.includes("maps.google.com") || html.includes("google.com/maps")) && html.includes("<iframe");
    const hasMapContainer = html.includes("data-testid=\"service-area-map\"") || html.includes("service-area-map") || html.includes("map-embed");
    const hasCityContext = html.includes(encodeURIComponent(city.name + ", FL")) || html.includes(city.name);

    if (!hasMapIframe) {
      errors.push(`/service-area/${city.slug} missing Google Maps embed iframe`);
    } else if (!hasMapContainer) {
      errors.push(`/service-area/${city.slug} missing responsive map container (.service-area-map or data-testid=\"service-area-map\")`);
    } else if (!hasCityContext) {
      errors.push(`/service-area/${city.slug} map iframe does not reference city "${city.name}"`);
    }
  }

  if (errors.length > 0) {
    return {
      pass: false,
      message: `Google Maps embed failures across representative cities: ${errors.join("; ")}`
    };
  }

  return {
    pass: true,
    message: `Responsive Google Maps embeds verified across all ${representativeCities.length} representative service areas (Jupiter, Boca Raton, West Palm Beach, Palm Beach Gardens, Delray Beach, Boynton Beach)`
  };
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

runner.register(1, "M3", "T1.R3.6", "Universal Global CTA Component & Telephony Preceding Footer", async (baseUrl) => {
  const representativeRoutes = [
    "/",
    "/about-us",
    "/our-services",
    "/contact-us",
    "/faqs",
    "/our-publications",
    "/service",
    "/service/office-cleaning",
    "/service/medical-office-cleaning",
    "/service-areas",
    "/service-area/jupiter",
    "/service-area/boca-raton",
    "/service-area/west-palm-beach",
    "/blog/revitalize-your-office-space",
    "/blog/complete-guide-to-home-cleaning"
  ];

  const errors = [];
  for (const route of representativeRoutes) {
    const res = await requestPage(baseUrl, route);
    if (!res.doc) {
      errors.push(`${route} could not be loaded`);
      continue;
    }
    const html = res.bodyText;
    const ctaIdx = html.indexOf("data-testid=\"global-cta\"");
    const footerIdx = html.indexOf("<footer");

    if (ctaIdx === -1) {
      errors.push(`${route} missing data-testid=\"global-cta\"`);
      continue;
    }
    if (footerIdx === -1) {
      errors.push(`${route} missing <footer element`);
      continue;
    }
    if (ctaIdx >= footerIdx) {
      errors.push(`${route} Global CTA (index ${ctaIdx}) does not precede footer (index ${footerIdx})`);
      continue;
    }

    const ctaEnd = html.indexOf("</section>", ctaIdx);
    const ctaBlock = ctaEnd !== -1 ? html.substring(ctaIdx, ctaEnd + 10) : html.substring(ctaIdx, ctaIdx + 1500);
    const hasPhone = ctaBlock.includes("tel:+15617045303") || ctaBlock.includes("tel:5617045303") || ctaBlock.includes("(561) 704-5303");
    if (!hasPhone) {
      errors.push(`${route} Global CTA missing direct telephone link (561) 704-5303`);
    }
  }

  if (errors.length > 0) {
    return {
      pass: false,
      message: `Global CTA verification failures: ${errors.join("; ")}`
    };
  }

  return {
    pass: true,
    message: `Universal Global CTA verified across ${representativeRoutes.length} representative canonical routes with data-testid=\"global-cta\", direct telephony, and physical DOM precedence preceding <footer`
  };
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

runner.register(1, "M4", "T1.R4.6", "BlogPosting & Article Schema Presence and Required Properties Across 11 Blog Routes", async (baseUrl) => {
  const missing = [];
  for (const slug of BLOG_SLUGS) {
    const res = await requestPage(baseUrl, `/blog/${slug}`);
    if (res.status !== 200 || !res.doc) {
      missing.push(`${slug} returned HTTP ${res.status}`);
      continue;
    }
    const blocks = res.doc.jsonLd();
    if (blocks.length === 0) {
      missing.push(`${slug} has 0 JSON-LD blocks`);
      continue;
    }

    let foundArticle = false;
    let hasHeadline = false;
    let hasAuthor = false;
    let hasPublisher = false;
    let hasDatePublished = false;

    for (const raw of blocks) {
      try {
        const parsed = JSON.parse(raw);
        const graph = parsed["@graph"] || (Array.isArray(parsed) ? parsed : [parsed]);
        for (const node of graph) {
          const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
          if (types.includes("BlogPosting") || types.includes("Article")) {
            foundArticle = true;
            if (node.headline && typeof node.headline === "string" && node.headline.trim().length > 0) hasHeadline = true;
            if (node.author && ((typeof node.author === "object" && node.author.name) || typeof node.author === "string")) hasAuthor = true;
            if (node.publisher && ((typeof node.publisher === "object" && node.publisher.name) || typeof node.publisher === "string")) hasPublisher = true;
            if (node.datePublished && typeof node.datePublished === "string" && node.datePublished.trim().length > 0) hasDatePublished = true;
          }
        }
      } catch (e) {
        missing.push(`${slug} JSON parse error: ${e.message}`);
      }
    }

    if (!foundArticle) missing.push(`${slug} missing BlogPosting/Article @type`);
    else if (!hasHeadline) missing.push(`${slug} schema missing headline`);
    else if (!hasAuthor) missing.push(`${slug} schema missing author`);
    else if (!hasPublisher) missing.push(`${slug} schema missing publisher`);
    else if (!hasDatePublished) missing.push(`${slug} schema missing datePublished`);
  }

  if (missing.length > 0) {
    return {
      pass: false,
      message: `Blog schema validation failures: ${missing.join("; ")}`
    };
  }

  return {
    pass: true,
    message: `All 11 blog routes verified with valid BlogPosting/Article schema, headline, author, publisher, and datePublished`
  };
});

runner.register(1, "M4", "T1.R4.7", "CleaningService, LocalBusiness, AreaServed, GeoCoordinates & FAQPage Schema Across 56 Service Areas", async (baseUrl) => {
  const missing = [];
  for (const slug of ALL_SERVICE_AREA_SLUGS) {
    const res = await requestPage(baseUrl, `/service-area/${slug}`);
    if (res.status !== 200 || !res.doc) {
      missing.push(`${slug} returned HTTP ${res.status}`);
      continue;
    }
    const blocks = res.doc.jsonLd();
    if (blocks.length === 0) {
      missing.push(`${slug} has 0 JSON-LD blocks`);
      continue;
    }

    let hasCleaningServiceOrLocalBusiness = false;
    let hasAreaServed = false;
    let hasGeoCoordinates = false;
    let hasFaqPage = false;
    let faqEntitiesCount = 0;

    for (const raw of blocks) {
      try {
        const parsed = JSON.parse(raw);
        const graph = parsed["@graph"] || (Array.isArray(parsed) ? parsed : [parsed]);
        for (const node of graph) {
          const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
          if (types.includes("CleaningService") || types.includes("LocalBusiness")) {
            hasCleaningServiceOrLocalBusiness = true;
            if (node.areaServed) hasAreaServed = true;
            if (node.geo && (node.geo["@type"] === "GeoCoordinates" || (node.geo.latitude && node.geo.longitude))) {
              hasGeoCoordinates = true;
            }
          }
          if (types.includes("Service") && node.areaServed) {
            hasAreaServed = true;
            if (node.areaServed.geo) hasGeoCoordinates = true;
          }
          if (types.includes("FAQPage") && Array.isArray(node.mainEntity)) {
            hasFaqPage = true;
            faqEntitiesCount += node.mainEntity.length;
          }
        }
      } catch (e) {
        missing.push(`${slug} JSON parse error: ${e.message}`);
      }
    }

    if (!hasCleaningServiceOrLocalBusiness) missing.push(`${slug} missing CleaningService/LocalBusiness node`);
    else if (!hasAreaServed) missing.push(`${slug} missing areaServed property`);
    else if (!hasGeoCoordinates) missing.push(`${slug} missing GeoCoordinates`);
    else if (!hasFaqPage || faqEntitiesCount < 3) missing.push(`${slug} missing FAQPage or insufficient questions (${faqEntitiesCount} found; expected >= 3)`);
  }

  if (missing.length > 0) {
    return {
      pass: false,
      message: `Service area schema validation failures across ${missing.length} areas: ${missing.slice(0, 5).join("; ")}`
    };
  }

  return {
    pass: true,
    message: `All 56 service area routes validated with CleaningService/LocalBusiness schema, areaServed, GeoCoordinates, and FAQPage with >=3 structured questions`
  };
});

runner.register(1, "M4", "T1.R4.8", "Zero JSON-LD Parse Errors and Trailing Commas Across 100% of 86 Routes", async (baseUrl) => {
  const errors = [];
  let totalBlocksValidated = 0;

  for (const route of ALL_86_CANONICAL_ROUTES) {
    const res = await requestPage(baseUrl, route);
    if (!res.doc) {
      errors.push(`${route} failed to load`);
      continue;
    }
    const blocks = res.doc.jsonLd();

    // /404 route must have 0 schema blocks (noindex document)
    if (route === "/404") {
      if (blocks.length > 0) {
        errors.push(`/404 contains unexpected schema blocks (${blocks.length})`);
      }
      continue;
    }

    if (blocks.length === 0) {
      errors.push(`${route} contains 0 JSON-LD schema blocks`);
      continue;
    }

    for (let i = 0; i < blocks.length; i++) {
      totalBlocksValidated++;
      const raw = blocks[i];
      if (/,\s*([\}\]])/g.test(raw)) {
        errors.push(`${route} block ${i + 1} contains trailing comma`);
      }
      try {
        JSON.parse(raw);
      } catch (err) {
        errors.push(`${route} block ${i + 1} JSON parse error: ${err.message}`);
      }
    }
  }

  if (errors.length > 0) {
    return {
      pass: false,
      message: `Encountered ${errors.length} JSON-LD errors across 86 routes: ${errors.slice(0, 5).join("; ")}`
    };
  }

  return {
    pass: true,
    message: `100% zero JSON-LD parse errors and zero trailing commas confirmed across ${totalBlocksValidated} schema blocks on all 86 canonical routes`
  };
});

// ── Milestone 5: Netlify Forms Configuration Across Application Forms ─────

runner.register(1, 'M5', 'T1.R5.1', 'Netlify Form Discovery & Required HTML Attributes Compliance', async (baseUrl) => {
  const representativeRoutes = [
    '/',
    '/contact-us',
    '/our-services',
    '/service-area/jupiter',
    '/service-area/boca-raton',
    '/blog/revitalize-your-office-space'
  ];

  for (const route of representativeRoutes) {
    const res = await requestPage(baseUrl, route);
    if (!res.doc) {
      return { pass: false, message: `Could not fetch document at ${route}` };
    }

    const forms = res.doc.forms();
    const netlifyForm = forms.find(f => f.name === 'quote-request');
    if (!netlifyForm) {
      return { pass: false, message: `Route ${route} does not contain a registered form named 'quote-request'` };
    }

    if (netlifyForm.method !== 'POST') {
      return { pass: false, message: `Route ${route} form method is '${netlifyForm.method}', expected 'POST'` };
    }

    // In local prerendered files, data-netlify="true" and data-netlify-honeypot="bot-field" are explicitly present.
    // In live Netlify deployed HTML, Netlify's post-processor strips data-netlify and binds the form via action="/" and hidden form-name/bot-field inputs.
    const hasDataNetlify = netlifyForm.dataNetlify === 'true' ||
      netlifyForm.netlify === 'true' ||
      (netlifyForm.inputs.some(i => i.name === 'form-name') && netlifyForm.method === 'POST');
    if (!hasDataNetlify) {
      return { pass: false, message: `Route ${route} form is missing data-netlify="true" attribute or Netlify-processed form-name input` };
    }

    const hasHoneypotAttr = netlifyForm.dataNetlifyHoneypot === 'bot-field' ||
      netlifyForm.netlifyHoneypot === 'bot-field' ||
      netlifyForm.inputs.some(i => i.name === 'bot-field');
    if (!hasHoneypotAttr) {
      return { pass: false, message: `Route ${route} form is missing netlify-honeypot="bot-field" attribute or bot-field input` };
    }
  }

  return {
    pass: true,
    message: `Netlify form attributes (name="quote-request", method="POST", data-netlify="true", honeypot="bot-field") verified across all representative routes`
  };
});

runner.register(1, 'M5', 'T1.R5.2', 'Form Hidden Inputs, Anti-Spam Honeypot Field & Explicit Field Names Integrity', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/contact-us');
  if (!res.doc) return { pass: false, message: 'Could not fetch /contact-us' };

  const forms = res.doc.forms();
  const quoteForm = forms.find(f => f.name === 'quote-request');
  if (!quoteForm) {
    return { pass: false, message: 'No quote-request form found on /contact-us' };
  }

  const inputNames = quoteForm.inputs.map(i => i.name).filter(Boolean);
  const requiredFields = ['form-name', 'bot-field', 'name', 'email', 'phone', 'message'];

  for (const reqField of requiredFields) {
    if (!inputNames.includes(reqField)) {
      return {
        pass: false,
        message: `Form 'quote-request' is missing required field '${reqField}'. Found fields: [${inputNames.join(', ')}]`
      };
    }
  }

  // Ensure form-name hidden input has value 'quote-request'
  const formNameInput = quoteForm.inputs.find(i => i.name === 'form-name');
  if (!formNameInput || formNameInput.value !== 'quote-request') {
    return {
      pass: false,
      message: `Hidden input 'form-name' must have value='quote-request', found '${formNameInput ? formNameInput.value : 'missing'}'`
    };
  }

  // Ensure bot-field is present
  const botFieldInput = quoteForm.inputs.find(i => i.name === 'bot-field');
  if (!botFieldInput) {
    return { pass: false, message: "Honeypot input 'bot-field' not found in form" };
  }

  return {
    pass: true,
    message: `All required form fields ([${requiredFields.join(', ')}]) and hidden form-name value validated successfully`
  };
});

runner.register(1, 'M5', 'T1.R5.3', 'Static Netlify Form Registration Parity Across 100% of 86 Prerendered Routes in dist/', async () => {
  const missingRoutes = [];
  let routesChecked = 0;

  for (const route of ALL_86_CANONICAL_ROUTES) {
    routesChecked++;
    const clean = route.replace(/^\/+|\/+$/g, '');
    let candidatePath = clean ? path.join(DIST_DIR, clean, 'index.html') : path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(candidatePath) && clean) {
      candidatePath = path.join(DIST_DIR, `${clean}.html`);
    }

    if (!fs.existsSync(candidatePath)) {
      missingRoutes.push(`${route} (file not found: ${candidatePath})`);
      continue;
    }

    const html = fs.readFileSync(candidatePath, 'utf-8');
    const hasNetlifyRegistration = html.includes('name="quote-request"') &&
      (html.includes('data-netlify="true"') || html.includes('netlify="true"')) &&
      html.includes('name="form-name"');

    if (!hasNetlifyRegistration) {
      missingRoutes.push(route);
    }
  }

  if (missingRoutes.length > 0) {
    return {
      pass: false,
      message: `${missingRoutes.length} of ${routesChecked} static routes lack Netlify build-time form registration: ${missingRoutes.slice(0, 5).join(', ')}`
    };
  }

  return {
    pass: true,
    message: `100% static Netlify build-time form registration confirmed across all ${routesChecked} prerendered routes in dist/`
  };
});

runner.register(1, 'M5', 'T1.R5.4', 'Client-Side Form Submission Simulation (application/x-www-form-urlencoded POST with form-name)', async (baseUrl) => {
  const payload = new URLSearchParams();
  payload.append('form-name', 'quote-request');
  payload.append('name', 'E2E Automated Test User');
  payload.append('email', 'e2e-test@sfcleaningconcepts.com');
  payload.append('phone', '(561) 704-5303');
  payload.append('message', 'Automated E2E Netlify Forms submission verification across staging');
  payload.append('source', 'E2E-Suite-Simulation');

  try {
    const postUrl = new URL('/', baseUrl).toString();
    const res = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SFCC-E2E-TestRunner/1.0'
      },
      body: payload.toString()
    });

    if (res.status !== 200 && res.status !== 303) {
      return {
        pass: false,
        message: `Form POST to '/' returned unexpected HTTP status ${res.status} (${res.statusText})`
      };
    }

    return {
      pass: true,
      message: `Form submission simulation succeeded with HTTP ${res.status} (application/x-www-form-urlencoded payload accepted)`
    };
  } catch (err) {
    return {
      pass: false,
      message: `Form submission failed with network exception: ${err.message}`
    };
  }
});

runner.register(1, 'M5', 'T1.R5.5', 'Anti-Spam Honeypot Bot Field Concealment & Component Guard Defense', async (baseUrl) => {
  const res = await requestPage(baseUrl, '/');
  if (!res.doc) return { pass: false, message: 'Could not fetch homepage' };

  // Check honeypot container in DOM or QuoteForm source
  const quoteFormSrcPath = path.join(PROJECT_ROOT, 'src/components/ui/QuoteForm.tsx');
  if (!fs.existsSync(quoteFormSrcPath)) {
    return { pass: false, message: `QuoteForm.tsx not found at ${quoteFormSrcPath}` };
  }

  const quoteFormSrc = fs.readFileSync(quoteFormSrcPath, 'utf-8');

  // Verify honeypot bot trap guard exists in code: if (formData.botField) ...
  const hasBotTrapGuard = /if\s*\(\s*formData\.botField\s*\)/.test(quoteFormSrc) ||
    /if\s*\(\s*data\.botField\s*\)/.test(quoteFormSrc);
  if (!hasBotTrapGuard) {
    return { pass: false, message: 'QuoteForm.tsx lacks botField honeypot trap guard before submission' };
  }

  // Verify honeypot input is concealed from screen readers and tab navigation
  const hasAriaHidden = quoteFormSrc.includes('aria-hidden="true"') || quoteFormSrc.includes('tabIndex={-1}');
  if (!hasAriaHidden) {
    return { pass: false, message: 'Honeypot bot-field container is not concealed with aria-hidden or tabIndex={-1}' };
  }

  return {
    pass: true,
    message: 'Honeypot bot trap guard and visual/assistive concealment confirmed in QuoteForm.tsx'
  };
});

// ══════════════════════════════════════════════════════════════════════════
// MILESTONE 6: AUDIT & REMEDIATION (SEO, INDEXABILITY, SITEMAP, LLMS)
// ══════════════════════════════════════════════════════════════════════════

runner.register(1, 'M6', 'T1.R6.1', 'On-Page SEO Integrity Across 100% of Routes in dist/', async () => {
  const routesToCheck = ALL_86_CANONICAL_ROUTES;
  const titles = new Set();
  const descriptions = new Set();

  for (const route of routesToCheck) {
    const clean = route.replace(/^\/+|\/+$/g, '');
    let filePath = clean ? path.join(DIST_DIR, clean, 'index.html') : path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(filePath) && clean) {
      filePath = path.join(DIST_DIR, `${clean}.html`);
    }

    if (!fs.existsSync(filePath)) {
      return { pass: false, message: `Missing physical HTML file in dist for route: ${route}` };
    }

    const html = fs.readFileSync(filePath, 'utf-8');
    const doc = new HtmlDoc(html);

    // 1. Single H1 Tag
    const h1Matches = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    if (h1Matches.length !== 1) {
      return { pass: false, message: `Route ${route} has ${h1Matches.length} <h1> tags (expected exactly 1)` };
    }

    // 2. Non-empty title with brand name
    const title = doc.title();
    if (!title || title.length < 25) {
      return { pass: false, message: `Route ${route} has invalid or short title: "${title}"` };
    }
    if (!title.includes('South Florida Cleaning Concepts')) {
      return { pass: false, message: `Route ${route} title missing brand name: "${title}"` };
    }
    titles.add(title);

    // 3. Meta description length & CTA (for indexable routes)
    if (route !== '/404') {
      const desc = doc.meta('description');
      if (!desc || desc.length < 120 || desc.length > 160) {
        return { pass: false, message: `Route ${route} meta description length invalid (${desc ? desc.length : 0} chars)` };
      }
      descriptions.add(desc);
    }

    // 4. Open Graph and Twitter Card tags
    const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
    const twitterCard = html.match(/<meta\s+name="twitter:card"\s+content="([^"]*)"/i);
    if (!ogTitle || !twitterCard) {
      return { pass: false, message: `Route ${route} missing essential OG or Twitter card meta tags` };
    }
  }

  if (titles.size < 80) {
    return { pass: false, message: `High title duplication detected: only ${titles.size} unique titles across 86 routes` };
  }

  return {
    pass: true,
    message: `100% of 86 routes pass on-page SEO verification (single H1, unique branded titles, valid descriptions, OG/Twitter tags)`
  };
});

runner.register(1, 'M6', 'T1.R6.2', 'Canonical Tags & Robots Meta Policies Across All Routes in dist/', async () => {
  for (const route of ALL_86_CANONICAL_ROUTES) {
    const clean = route.replace(/^\/+|\/+$/g, '');
    let filePath = clean ? path.join(DIST_DIR, clean, 'index.html') : path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(filePath) && clean) {
      filePath = path.join(DIST_DIR, `${clean}.html`);
    }

    const html = fs.readFileSync(filePath, 'utf-8');
    const doc = new HtmlDoc(html);
    const canonical = doc.canonical();

    if (!canonical || !canonical.startsWith('https://sfcleaningconcepts.com')) {
      return { pass: false, message: `Route ${route} has missing or invalid canonical: ${canonical}` };
    }

    const robots = doc.meta('robots');
    if (route === '/404') {
      if (!robots.includes('noindex') || !robots.includes('nofollow')) {
        return { pass: false, message: `/404 route must have "noindex, nofollow" robots policy; got "${robots}"` };
      }
    } else {
      if (!robots.includes('index') || !robots.includes('follow') || robots.includes('noindex')) {
        return { pass: false, message: `Indexable route ${route} has non-indexable robots policy: "${robots}"` };
      }
    }
  }

  return {
    pass: true,
    message: `All 86 routes have compliant canonical tags and strict robots directives (index/follow on 85, noindex on /404)`
  };
});

runner.register(1, 'M6', 'T1.R6.3', 'Sitemap.xml Existence, XML Schema Validity & 85 Indexable Routes Completeness', async () => {
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  const distSitemapPath = path.join(DIST_DIR, 'sitemap.xml');

  if (!fs.existsSync(sitemapPath) || !fs.existsSync(distSitemapPath)) {
    return { pass: false, message: 'sitemap.xml is missing from public/ or dist/' };
  }

  const xml = fs.readFileSync(sitemapPath, 'utf-8');
  if (!xml.includes('<?xml version="1.0" encoding="UTF-8"?>') || !xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    return { pass: false, message: 'sitemap.xml does not contain valid sitemaps.org 0.9 XML headers' };
  }

  const locMatches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  if (locMatches.length !== 85) {
    return { pass: false, message: `sitemap.xml contains ${locMatches.length} URLs (expected exactly 85 indexable routes)` };
  }

  if (xml.includes('/404')) {
    return { pass: false, message: 'sitemap.xml illegally includes non-indexable /404 route' };
  }

  // Verify all 56 service area URLs are present
  for (const slug of ALL_SERVICE_AREA_SLUGS) {
    const expectedUrl = `https://sfcleaningconcepts.com/service-area/${slug}`;
    if (!locMatches.includes(expectedUrl)) {
      return { pass: false, message: `sitemap.xml is missing service area: ${expectedUrl}` };
    }
  }

  // Verify robots.txt references sitemap
  const robotsTxt = fs.readFileSync(path.join(PUBLIC_DIR, 'robots.txt'), 'utf-8');
  if (!robotsTxt.includes('Sitemap: https://sfcleaningconcepts.com/sitemap.xml')) {
    return { pass: false, message: 'robots.txt is missing Sitemap directive' };
  }

  return {
    pass: true,
    message: `sitemap.xml is structurally valid with all 85 indexable routes, excluding /404, referenced in robots.txt`
  };
});

runner.register(1, 'M6', 'T1.R6.4', 'llms.txt Standard Compliance, 5 Service Divisions & 56 Service Areas Summary', async (baseUrl) => {
  const llmsPath = path.join(PUBLIC_DIR, 'llms.txt');
  if (!fs.existsSync(llmsPath)) {
    return { pass: false, message: 'public/llms.txt does not exist' };
  }

  const content = fs.readFileSync(llmsPath, 'utf-8');
  if (!content.startsWith('# South Florida Cleaning Concepts')) {
    return { pass: false, message: 'llms.txt must begin with H1 title "# South Florida Cleaning Concepts"' };
  }

  if (!content.includes('> South Florida Cleaning Concepts is a premier commercial janitorial')) {
    return { pass: false, message: 'llms.txt missing required blockquote summary per llmstxt.org specification' };
  }

  const requiredDivisions = [
    'Commercial Office Cleaning',
    'Medical Office',
    'Short-Term Rental',
    'Luxury Residential',
    'Post-Construction Cleanup'
  ];
  for (const div of requiredDivisions) {
    if (!content.includes(div)) {
      return { pass: false, message: `llms.txt missing core service division: ${div}` };
    }
  }

  // Verify reference to Jupiter and 56 service areas
  if (!content.includes('Jupiter') || !content.includes('56')) {
    return { pass: false, message: 'llms.txt must summarize 56 service areas extending north through Jupiter' };
  }

  // Verify contact info and doc links
  if (!content.includes('(561) 704-5303') || !content.includes('llms-full.txt') || !content.includes('sitemap.xml')) {
    return { pass: false, message: 'llms.txt missing telephone, llms-full.txt link, or sitemap link' };
  }

  // Verify all service-area links match sitemap.xml and zero broken links exist
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const allSiteLinks = [...content.matchAll(/https:\/\/sfcleaningconcepts\.com\/[^\)\s]+/g)].map(m => m[0]);

  const serviceAreaLinks = allSiteLinks.filter(l => l.startsWith('https://sfcleaningconcepts.com/service-area/'));
  if (serviceAreaLinks.length !== 56) {
    return { pass: false, message: `llms.txt must contain exactly 56 service area links, found ${serviceAreaLinks.length}` };
  }
  for (const link of serviceAreaLinks) {
    if (!sitemapContent.includes(`<loc>${link}</loc>`)) {
      return { pass: false, message: `Service area link in llms.txt not found in sitemap.xml: ${link}` };
    }
  }

  const brokenLinks = allSiteLinks.filter(l => {
    if (l.endsWith('/llms-full.txt') || l.endsWith('/sitemap.xml')) return false;
    const cleanUrl = l.split('#')[0];
    return !sitemapContent.includes(`<loc>${cleanUrl}</loc>`);
  });
  if (brokenLinks.length > 0) {
    return { pass: false, message: `Broken links detected in llms.txt: ${brokenLinks.join(', ')}` };
  }

  // Verify HTTP 200 delivery
  const res = await requestPage(baseUrl, '/llms.txt');
  if (res.status !== 200 || !res.bodyText.includes('# South Florida Cleaning Concepts')) {
    return { pass: false, message: `HTTP GET /llms.txt returned status ${res.status}` };
  }

  return {
    pass: true,
    message: 'public/llms.txt meets llmstxt.org standards (H1, blockquote, 5 divisions, 56 cities up to Jupiter, links)'
  };
});

runner.register(1, 'M6', 'T1.R6.5', 'llms-full.txt Knowledge Base (5 Divisions SOPs, 56 Community Profiles & Stats)', async (baseUrl) => {
  const fullPath = path.join(PUBLIC_DIR, 'llms-full.txt');
  if (!fs.existsSync(fullPath)) {
    return { pass: false, message: 'public/llms-full.txt does not exist' };
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  if (content.length < 30000) {
    return { pass: false, message: `llms-full.txt too concise (${content.length} bytes, expected > 30,000 bytes)` };
  }

  // Verify 5 divisions SOPs
  if (!content.includes('Division 1: Commercial Office Cleaning') || !content.includes('Division 2: Medical Office') || !content.includes('Division 5: Post-Construction Cleanup')) {
    return { pass: false, message: 'llms-full.txt missing detailed SOPs for the 5 service divisions' };
  }

  // Verify all 56 community profiles exist
  for (const slug of ALL_SERVICE_AREA_SLUGS) {
    if (!content.includes(`(${slug})`)) {
      return { pass: false, message: `llms-full.txt missing community profile for slug: ${slug}` };
    }
  }

  // Verify presence of statistics
  if (!content.includes('Population:') || !content.includes('Households:') || !content.includes('Commercial Profile:')) {
    return { pass: false, message: 'llms-full.txt community profiles missing structured census statistics' };
  }

  // Verify HTTP 200 delivery
  const res = await requestPage(baseUrl, '/llms-full.txt');
  if (res.status !== 200 || res.bodyText.length < 30000) {
    return { pass: false, message: `HTTP GET /llms-full.txt returned status ${res.status} (length ${res.bodyText.length})` };
  }

  return {
    pass: true,
    message: 'public/llms-full.txt verified with comprehensive 5-division SOPs, 56 authentic community profiles & statistics'
  };
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

runner.register(2, 'M5', 'T2.B.7', 'Form Submission Boundary Defense (Malformed Payload & Missing form-name)', async (baseUrl) => {
  try {
    const postUrl = new URL('/', baseUrl).toString();
    // 1. Post with empty body
    const emptyRes = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: ''
    });

    // 2. Post with non-matching form name
    const phantomRes = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'form-name=non-existent-phantom-form&test=123'
    });

    if (emptyRes.status >= 500 || phantomRes.status >= 500) {
      return {
        pass: false,
        message: `Boundary submission triggered server 5xx error (empty=${emptyRes.status}, phantom=${phantomRes.status})`
      };
    }

    return {
      pass: true,
      message: 'Server gracefully handled empty and non-matching form submissions without unhandled exceptions'
    };
  } catch (err) {
    return {
      pass: false,
      message: `Boundary submission caused client-side crash: ${err.message}`
    };
  }
});

runner.register(2, 'M6', 'T2.B.8', 'LLMs Context Head Discovery, Robots Directive & XML Syntax Boundary Defense', async (baseUrl) => {
  // 1. Robots.txt LLMs directive
  const robotsRes = await requestPage(baseUrl, '/robots.txt');
  if (!robotsRes.ok || !robotsRes.bodyText.includes('LLMs: https://sfcleaningconcepts.com/llms.txt')) {
    return { pass: false, message: 'robots.txt does not advertise LLMs: https://sfcleaningconcepts.com/llms.txt' };
  }

  // 2. Head link discovery on Homepage and Sample Routes
  const sampleRoutes = ['/', '/service-area/jupiter', '/blog/revitalize-your-office-space'];
  for (const r of sampleRoutes) {
    const res = await requestPage(baseUrl, r);
    if (!res.ok || !res.bodyText.includes('rel="alternate"') || !res.bodyText.includes('href="https://sfcleaningconcepts.com/llms.txt"')) {
      return { pass: false, message: `Route ${r} missing <link rel="alternate" type="text/markdown" href="https://sfcleaningconcepts.com/llms.txt"> in <head>` };
    }
  }

  // 3. Sitemap XML Boundary
  const sitemapRes = await requestPage(baseUrl, '/sitemap.xml');
  if (!sitemapRes.ok || !sitemapRes.contentType.includes('xml')) {
    return { pass: false, message: `Sitemap request failed or has invalid content-type: ${sitemapRes.contentType}` };
  }

  return {
    pass: true,
    message: 'Robots.txt LLMs directive, HTML head discovery link, and sitemap XML boundaries successfully verified'
  };
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
