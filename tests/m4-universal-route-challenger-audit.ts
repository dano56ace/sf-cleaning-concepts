import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { serviceAreas, serviceAreasBySlug } from '../src/data/serviceAreas';
import { BLOG_SCHEMA_REGISTRY } from '../src/data/blogSchemaData';

const PROJECT_ROOT = '/Users/danielarrieta/Downloads/Projects/South Florida Cleaning Concepts';
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

console.log('======================================================================');
console.log('  CHALLENGER 2: MILESTONE 4 UNIVERSAL ROUTE SCHEMA & COMPONENT COVERAGE AUDIT');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;
const failures: Array<{ testGroup: string; testName: string; error: string; route?: string }> = [];

function recordPass(testGroup: string, testName: string, details = '') {
  passCount++;
  console.log(`  [PASS] [${testGroup}] ${testName}${details ? ` -> ${details}` : ''}`);
}

function recordFail(testGroup: string, testName: string, error: string, route?: string) {
  failCount++;
  failures.push({ testGroup, testName, error, route });
  console.error(`  [FAIL] [${testGroup}] ${testName}${route ? ` (${route})` : ''} -> ${error}`);
}

// ----------------------------------------------------------------------
// 1. Enumerate Canonical 86 Routes
// ----------------------------------------------------------------------
interface RouteDef {
  route: string;
  distPath: string;
  type: 'core' | 'service' | 'blog' | 'directory' | 'service-area' | 'error';
}

const ALL_86_ROUTES: RouteDef[] = [
  // 6 Core
  { route: '/', distPath: 'index.html', type: 'core' },
  { route: '/about-us', distPath: 'about-us/index.html', type: 'core' },
  { route: '/our-services', distPath: 'our-services/index.html', type: 'core' },
  { route: '/contact-us', distPath: 'contact-us/index.html', type: 'core' },
  { route: '/faqs', distPath: 'faqs/index.html', type: 'core' },
  { route: '/our-publications', distPath: 'our-publications/index.html', type: 'core' },

  // 11 Services
  { route: '/service', distPath: 'service/index.html', type: 'service' },
  { route: '/service/office-cleaning', distPath: 'service/office-cleaning/index.html', type: 'service' },
  { route: '/service/medical-office-cleaning', distPath: 'service/medical-office-cleaning/index.html', type: 'service' },
  { route: '/service/bars-and-restaurant-cleaning', distPath: 'service/bars-and-restaurant-cleaning/index.html', type: 'service' },
  { route: '/service/short-term-rentals', distPath: 'service/short-term-rentals/index.html', type: 'service' },
  { route: '/service/post-construction-cleaning', distPath: 'service/post-construction-cleaning/index.html', type: 'service' },
  { route: '/service/move-in-out-cleaning', distPath: 'service/move-in-out-cleaning/index.html', type: 'service' },
  { route: '/service/home-maintenance', distPath: 'service/home-maintenance/index.html', type: 'service' },
  { route: '/service/school-cleaning', distPath: 'service/school-cleaning/index.html', type: 'service' },
  { route: '/service/home-watching', distPath: 'service/home-watching/index.html', type: 'service' },
  { route: '/service/covid-19-disinfection', distPath: 'service/covid-19-disinfection/index.html', type: 'service' },

  // 11 Blog Articles
  { route: '/blog/revitalize-your-office-space', distPath: 'blog/revitalize-your-office-space/index.html', type: 'blog' },
  { route: '/blog/complete-guide-to-home-cleaning', distPath: 'blog/complete-guide-to-home-cleaning/index.html', type: 'blog' },
  { route: '/blog/restaurant-and-bar-cleaning-services', distPath: 'blog/restaurant-and-bar-cleaning-services/index.html', type: 'blog' },
  { route: '/blog/office-cleaning-made-easy', distPath: 'blog/office-cleaning-made-easy/index.html', type: 'blog' },
  { route: '/blog/short-term-rental-cleaning-guide', distPath: 'blog/short-term-rental-cleaning-guide/index.html', type: 'blog' },
  { route: '/blog/high-quality-cleaning-services-south-florida', distPath: 'blog/high-quality-cleaning-services-south-florida/index.html', type: 'blog' },
  { route: '/blog/medical-office-cleaning-guide', distPath: 'blog/medical-office-cleaning-guide/index.html', type: 'blog' },
  { route: '/blog/deep-cleaning-for-homes-and-offices', distPath: 'blog/deep-cleaning-for-homes-and-offices/index.html', type: 'blog' },
  { route: '/blog/post-construction-cleaning-guide', distPath: 'blog/post-construction-cleaning-guide/index.html', type: 'blog' },
  { route: '/blog/south-florida-home-maintenance-services', distPath: 'blog/south-florida-home-maintenance-services/index.html', type: 'blog' },
  { route: '/blog/residential-cleaning-services-journey', distPath: 'blog/residential-cleaning-services-journey/index.html', type: 'blog' },

  // 1 Service Areas Directory
  { route: '/service-areas', distPath: 'service-areas/index.html', type: 'directory' },

  // 56 Service Areas
  ...serviceAreas.map((area) => ({
    route: `/service-area/${area.slug}`,
    distPath: `service-area/${area.slug}/index.html`,
    type: 'service-area' as const
  })),

  // 1 404 Error Page
  { route: '/404', distPath: '404.html', type: 'error' }
];

console.log(`--- GROUP 1: Route Inventory Verification (${ALL_86_ROUTES.length} Routes) ---`);
assert.strictEqual(ALL_86_ROUTES.length, 86, `Expected exactly 86 routes, got ${ALL_86_ROUTES.length}`);
recordPass('G1: Inventory', 'Total Route Definitions', `Exactly 86 canonical routes cataloged`);

let missingFiles = 0;
for (const r of ALL_86_ROUTES) {
  const fullPath = path.join(DIST_DIR, r.distPath);
  if (!fs.existsSync(fullPath)) {
    missingFiles++;
    recordFail('G1: Inventory', 'File Presence', `Missing file ${r.distPath} on disk`, r.route);
  }
}
if (missingFiles === 0) {
  recordPass('G1: Inventory', 'Physical HTML Presence', 'All 86 primary HTML files exist on disk in dist/');
}

// ----------------------------------------------------------------------
// 2. REQUIREMENT 1: JSON-LD Structured Data Parsing Across All 86 Routes
// ----------------------------------------------------------------------
console.log('\n--- GROUP 2: REQUIREMENT 1 — JSON-LD Schema.org Strict Parsing Across All 86 Routes ---');

let totalJsonLdBlocks = 0;
let jsonSyntaxErrors = 0;
let trailingCommaErrors = 0;
let nanErrors = 0;
let poisonTokenErrors = 0;
let blogSchemaFailures = 0;
let serviceAreaSchemaFailures = 0;
let directorySchemaFailures = 0;
let errorPageSchemaErrors = 0;

function checkObjectForNanOrPoison(obj: any, pathStr = ''): string[] {
  const errs: string[] = [];
  if (obj === null || obj === undefined) return errs;
  if (typeof obj === 'number') {
    if (Number.isNaN(obj)) {
      errs.push(`NaN number found at path "${pathStr}"`);
    }
  } else if (typeof obj === 'string') {
    if (obj.toLowerCase() === 'nan') {
      errs.push(`Literal string "NaN" found at path "${pathStr}"`);
    }
    if (obj === 'undefined') {
      errs.push(`Literal string "undefined" found at path "${pathStr}"`);
    }
    if (obj.includes('[object Object]')) {
      errs.push(`Contamination "[object Object]" found at path "${pathStr}"`);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      errs.push(...checkObjectForNanOrPoison(item, `${pathStr}[${idx}]`));
    });
  } else if (typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      errs.push(...checkObjectForNanOrPoison(val, pathStr ? `${pathStr}.${key}` : key));
    }
  }
  return errs;
}

for (const r of ALL_86_ROUTES) {
  const fullPath = path.join(DIST_DIR, r.distPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf-8');

  // Extract all <script type="application/ld+json"> blocks
  const scriptRegex = /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  const blocks: string[] = [];

  while ((match = scriptRegex.exec(content)) !== null) {
    blocks.push(match[1].trim());
  }

  // 404 Route handling: must have 0 schema blocks
  if (r.type === 'error') {
    if (blocks.length > 0) {
      errorPageSchemaErrors++;
      recordFail('G2: Schema', '404 Schema Policy', `404 page contains ${blocks.length} unexpected JSON-LD blocks (should be 0)`, r.route);
    } else {
      recordPass('G2: Schema', '404 Cleanliness', '404 error document has 0 JSON-LD schema blocks');
    }
    continue;
  }

  // For all non-404 routes, must have at least 1 schema block
  if (blocks.length === 0) {
    recordFail('G2: Schema', 'Schema Presence', `Route missing <script type="application/ld+json"> block`, r.route);
    continue;
  }

  for (let idx = 0; idx < blocks.length; idx++) {
    totalJsonLdBlocks++;
    const rawBlock = blocks[idx];

    // Check trailing commas
    if (/,\s*([\}\]])/g.test(rawBlock)) {
      trailingCommaErrors++;
      recordFail('G2: Schema', 'Trailing Comma', `Schema block ${idx + 1} contains illegal trailing comma`, r.route);
    }

    // Check raw NaN tokens
    if (/:\s*NaN\b/.test(rawBlock)) {
      nanErrors++;
      recordFail('G2: Schema', 'NaN Value', `Schema block ${idx + 1} contains raw NaN token`, r.route);
    }

    // Check undefined / [object Object]
    if (/:\s*undefined\b/.test(rawBlock) || rawBlock.includes('[object Object]')) {
      poisonTokenErrors++;
      recordFail('G2: Schema', 'Poison Token', `Schema block ${idx + 1} contains undefined or [object Object]`, r.route);
    }

    // JSON.parse verification
    let parsed: any;
    try {
      parsed = JSON.parse(rawBlock);
    } catch (parseErr: any) {
      jsonSyntaxErrors++;
      recordFail('G2: Schema', 'Syntax Error', `JSON.parse failed on block ${idx + 1}: ${parseErr.message}`, r.route);
      continue;
    }

    // Deep recursive check on parsed object
    const deepErrs = checkObjectForNanOrPoison(parsed);
    if (deepErrs.length > 0) {
      nanErrors += deepErrs.length;
      recordFail('G2: Schema', 'Parsed Object Anomaly', deepErrs.join('; '), r.route);
    }

    // Semantic checks per route type
    const graph = parsed['@graph'] || (Array.isArray(parsed) ? parsed : [parsed]);

    if (r.type === 'blog') {
      const blogPosting = graph.find((node: any) => {
        const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
        return types.includes('BlogPosting') || types.includes('Article');
      });

      if (!blogPosting) {
        blogSchemaFailures++;
        recordFail('G2: Schema', 'Blog Schema Type', `Missing BlogPosting or Article entity`, r.route);
      } else {
        const missingFields: string[] = [];
        if (!blogPosting.headline) missingFields.push('headline');
        if (!blogPosting.description) missingFields.push('description');
        if (!blogPosting.image) missingFields.push('image');
        if (!blogPosting.author) missingFields.push('author');
        if (!blogPosting.publisher) missingFields.push('publisher');
        if (!blogPosting.datePublished) missingFields.push('datePublished');
        if (!blogPosting.mainEntityOfPage) missingFields.push('mainEntityOfPage');

        if (missingFields.length > 0) {
          blogSchemaFailures++;
          recordFail('G2: Schema', 'Blog Required Fields', `Missing fields: ${missingFields.join(', ')}`, r.route);
        }
      }

      // Check BreadcrumbList presence
      const breadcrumbs = graph.find((node: any) => node['@type'] === 'BreadcrumbList');
      if (!breadcrumbs || !Array.isArray(breadcrumbs.itemListElement)) {
        blogSchemaFailures++;
        recordFail('G2: Schema', 'Blog BreadcrumbList', `Missing BreadcrumbList schema`, r.route);
      }
    } else if (r.type === 'service-area') {
      const serviceNode = graph.find((node: any) => {
        const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
        return types.includes('Service') || types.includes('CleaningService') || types.includes('LocalBusiness');
      });

      if (!serviceNode) {
        serviceAreaSchemaFailures++;
        recordFail('G2: Schema', 'Service Area Schema Type', `Missing Service or CleaningService entity`, r.route);
      }

      // Check areaServed
      const areaServedNode = graph.find((node: any) => node.areaServed);
      if (!areaServedNode) {
        serviceAreaSchemaFailures++;
        recordFail('G2: Schema', 'Service Area areaServed', `Missing areaServed property`, r.route);
      }

      // Check GeoCoordinates
      const geoNode = graph.find((node: any) => node.geo || (node.areaServed && node.areaServed.geo));
      if (!geoNode) {
        serviceAreaSchemaFailures++;
        recordFail('G2: Schema', 'Service Area GeoCoordinates', `Missing GeoCoordinates in schema`, r.route);
      }

      // Check FAQPage
      const faqNode = graph.find((node: any) => node['@type'] === 'FAQPage');
      if (!faqNode || !Array.isArray(faqNode.mainEntity) || faqNode.mainEntity.length < 3) {
        serviceAreaSchemaFailures++;
        recordFail('G2: Schema', 'Service Area FAQPage', `Missing FAQPage or fewer than 3 Q&A pairs`, r.route);
      }

      // Check BreadcrumbList
      const breadcrumbNode = graph.find((node: any) => node['@type'] === 'BreadcrumbList');
      if (!breadcrumbNode || !Array.isArray(breadcrumbNode.itemListElement) || breadcrumbNode.itemListElement.length < 3) {
        serviceAreaSchemaFailures++;
        recordFail('G2: Schema', 'Service Area BreadcrumbList', `Missing 3-tier BreadcrumbList schema`, r.route);
      }
    } else if (r.type === 'directory') {
      const collectionNode = graph.find((node: any) => node['@type'] === 'CollectionPage');
      if (!collectionNode || !collectionNode.mainEntity || collectionNode.mainEntity.numberOfItems !== 56) {
        directorySchemaFailures++;
        recordFail('G2: Schema', 'Directory CollectionPage', `Missing CollectionPage with 56 items`, r.route);
      }
    }
  }
}

if (jsonSyntaxErrors === 0) recordPass('G2: Schema', 'Zero Syntax Errors', `Validated across ${totalJsonLdBlocks} schema blocks`);
if (trailingCommaErrors === 0) recordPass('G2: Schema', 'Zero Trailing Commas', `100% compliant JSON formatting`);
if (nanErrors === 0) recordPass('G2: Schema', 'Zero NaN Values', `No NaN tokens or string anomalies`);
if (poisonTokenErrors === 0) recordPass('G2: Schema', 'Zero Poison Tokens', `No undefined or [object Object] leaks`);
if (blogSchemaFailures === 0) recordPass('G2: Schema', '11 Blog Schema Complete', 'All 11 blogs have BlogPosting + Breadcrumbs');
if (serviceAreaSchemaFailures === 0) recordPass('G2: Schema', '56 Service Area Schema Complete', 'All 56 service areas have Service + areaServed + Geo + FAQPage + Breadcrumbs');
if (directorySchemaFailures === 0) recordPass('G2: Schema', 'Directory Schema Complete', 'Service areas directory has CollectionPage + 56 items');

// ----------------------------------------------------------------------
// 3. REQUIREMENT 2: Universal Global CTA Component with Phone Preceding Footer
// ----------------------------------------------------------------------
console.log('\n--- GROUP 3: REQUIREMENT 2 — Global CTA Component & Telephony Preceding Footer Across All 86 Routes ---');

let ctaMissingErrors = 0;
let ctaPhoneErrors = 0;
let ctaPrecedenceErrors = 0;
let footerMissingErrors = 0;

for (const r of ALL_86_ROUTES) {
  const fullPath = path.join(DIST_DIR, r.distPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf-8');

  // Check Global CTA component presence
  const ctaIdx = content.indexOf('data-testid="global-cta"');
  if (ctaIdx === -1) {
    ctaMissingErrors++;
    recordFail('G3: CTA', 'CTA Presence', 'Missing data-testid="global-cta"', r.route);
    continue;
  }

  // Check footer presence
  const footerIdx = content.indexOf('<footer class="site-footer">');
  if (footerIdx === -1) {
    footerMissingErrors++;
    recordFail('G3: CTA', 'Footer Presence', 'Missing <footer class="site-footer">', r.route);
    continue;
  }

  // Check CTA precedes footer
  if (ctaIdx >= footerIdx) {
    ctaPrecedenceErrors++;
    recordFail('G3: CTA', 'CTA Precedence', `Global CTA (idx ${ctaIdx}) appears AFTER footer (idx ${footerIdx})`, r.route);
  }

  // Extract CTA block and verify phone number (561) 704-5303
  const ctaEnd = content.indexOf('</section>', ctaIdx);
  const ctaBlock = ctaEnd !== -1 ? content.substring(ctaIdx, ctaEnd + 10) : content.substring(ctaIdx, ctaIdx + 2000);

  const hasPhoneText = ctaBlock.includes('(561) 704-5303');
  const hasPhoneTelLink = ctaBlock.includes('href="tel:+15617045303"') || ctaBlock.includes('href="tel:5617045303"');

  if (!hasPhoneText || !hasPhoneTelLink) {
    ctaPhoneErrors++;
    recordFail('G3: CTA', 'CTA Phone Number', `CTA block missing formatted phone "(561) 704-5303" or direct tel: link`, r.route);
  }
}

if (ctaMissingErrors === 0) recordPass('G3: CTA', 'CTA Presence Across 86 Routes', 'All 86 routes render Global CTA container');
if (footerMissingErrors === 0) recordPass('G3: CTA', 'Footer Presence Across 86 Routes', 'All 86 routes render <footer class="site-footer">');
if (ctaPrecedenceErrors === 0) recordPass('G3: CTA', 'DOM Source Precedence', 'All 86 routes have Global CTA immediately preceding footer');
if (ctaPhoneErrors === 0) recordPass('G3: CTA', 'CTA Direct Telephony', 'All 86 routes contain (561) 704-5303 with direct tel: link');

// ----------------------------------------------------------------------
// 4. REQUIREMENT 3: Embedded Google Map in 56 Service Areas with Responsive Container & 0 API Key
// ----------------------------------------------------------------------
console.log('\n--- GROUP 4: REQUIREMENT 3 — Google Maps Embed in All 56 Service Areas ---');

let mapIframeMissingErrors = 0;
let apiKeyDependencyErrors = 0;
let responsiveContainerPrerenderErrors = 0;
let responsiveContainerReactErrors = 0;

const serviceAreaRoutes = ALL_86_ROUTES.filter((r) => r.type === 'service-area');
assert.strictEqual(serviceAreaRoutes.length, 56, `Expected 56 service area routes, got ${serviceAreaRoutes.length}`);

for (const r of serviceAreaRoutes) {
  const fullPath = path.join(DIST_DIR, r.distPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf-8');

  // 1. Check for iframe with maps.google.com
  const iframeMatch = content.match(/<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
  if (!iframeMatch) {
    mapIframeMissingErrors++;
    recordFail('G4: Map', 'Iframe Missing', 'No <iframe> found on service area page', r.route);
    continue;
  }

  const iframeSrc = iframeMatch[1];
  if (!iframeSrc.includes('maps.google.com') && !iframeSrc.includes('google.com/maps')) {
    mapIframeMissingErrors++;
    recordFail('G4: Map', 'Map Source', `Iframe src does not point to Google Maps: ${iframeSrc}`, r.route);
  }

  // 2. Check 0 API key dependencies
  if (iframeSrc.includes('key=') || iframeSrc.includes('apiKey=') || iframeSrc.includes('api_key=')) {
    apiKeyDependencyErrors++;
    recordFail('G4: Map', 'API Key Contamination', `Map iframe depends on an API key parameter: ${iframeSrc}`, r.route);
  }

  // 3. Check responsive container in prerendered HTML: aspect-[4/3] sm:aspect-video md:h-[340px]
  const hasResponsiveContainer = content.includes('aspect-[4/3]') && content.includes('sm:aspect-video') && content.includes('md:h-[340px]');
  if (!hasResponsiveContainer) {
    responsiveContainerPrerenderErrors++;
    recordFail(
      'G4: Map',
      'Prerender Responsive Container Missing',
      `Prerendered HTML missing container class "aspect-[4/3] sm:aspect-video md:h-[340px]" (found static inline style instead)`,
      r.route
    );
  }
}

// Also check the React source component: ServiceAreaMap.tsx
const reactMapComponentPath = path.join(PROJECT_ROOT, 'src/components/service-areas/ServiceAreaMap.tsx');
if (fs.existsSync(reactMapComponentPath)) {
  const reactCode = fs.readFileSync(reactMapComponentPath, 'utf-8');
  const hasClassInReact = reactCode.includes('aspect-[4/3]') && reactCode.includes('sm:aspect-video') && reactCode.includes('md:h-[340px]');
  if (hasClassInReact) {
    recordPass('G4: Map', 'React Component Container Classes', 'ServiceAreaMap.tsx contains "aspect-[4/3] sm:aspect-video md:h-[340px]"');
  } else {
    responsiveContainerReactErrors++;
    recordFail('G4: Map', 'React Component Classes Missing', 'ServiceAreaMap.tsx missing responsive aspect ratio classes');
  }
} else {
  recordFail('G4: Map', 'React Component Missing', 'src/components/service-areas/ServiceAreaMap.tsx does not exist');
}

if (mapIframeMissingErrors === 0) recordPass('G4: Map', 'Iframe Presence Across 56 Service Areas', 'All 56 service area pages contain Google Maps iframe');
if (apiKeyDependencyErrors === 0) recordPass('G4: Map', 'Zero API Key Dependencies', 'All 56 maps use zero-API-key public embed URL format');
if (responsiveContainerPrerenderErrors === 0) {
  recordPass('G4: Map', 'Prerender Responsive Container', 'All 56 prerendered HTML pages contain "aspect-[4/3] sm:aspect-video md:h-[340px]"');
} else {
  console.log(`  [NOTE] Prerendered HTML lacks "aspect-[4/3] sm:aspect-video md:h-[340px]" in ${responsiveContainerPrerenderErrors}/56 pages (uses inline height: 380px instead).`);
}

// ----------------------------------------------------------------------
// 5. REQUIREMENT 4: Zero Broken Internal Links Between Pages
// ----------------------------------------------------------------------
console.log('\n--- GROUP 5: REQUIREMENT 4 — Zero Broken Internal Links Between Pages ---');

const internalLinksTested = new Set<string>();
const brokenLinks: Array<{ sourceRoute: string; targetHref: string; reason: string }> = [];

// Build set of valid static file paths and canonical routes
const validRoutes = new Set<string>();
const validHtmlFiles = new Set<string>();

for (const r of ALL_86_ROUTES) {
  validRoutes.add(r.route);
  validRoutes.add(`${r.route}/`);
  validHtmlFiles.add(r.distPath);
  // Also flat files
  if (r.distPath.endsWith('/index.html')) {
    const flat = r.distPath.replace(/\/index\.html$/, '.html');
    validHtmlFiles.add(flat);
  }
}
// Add /contact alias
validRoutes.add('/contact');
validRoutes.add('/contact/');
validHtmlFiles.add('contact/index.html');
validHtmlFiles.add('contact.html');

for (const r of ALL_86_ROUTES) {
  const fullPath = path.join(DIST_DIR, r.distPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf-8');

  // Extract all <a href="...">
  const aRegex = /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;
  let aMatch: RegExpExecArray | null;

  while ((aMatch = aRegex.exec(content)) !== null) {
    const rawHref = aMatch[1].trim();

    // Skip external, anchors, telephony, mailto, javascript
    if (!rawHref) continue;
    if (rawHref.startsWith('#')) continue;
    if (rawHref.startsWith('tel:')) continue;
    if (rawHref.startsWith('mailto:')) continue;
    if (rawHref.startsWith('javascript:')) continue;
    if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) {
      if (!rawHref.startsWith('https://sfcleaningconcepts.com') && !rawHref.startsWith('http://localhost')) {
        continue; // external link
      }
    }

    // Normalize to internal path
    let internalPath = rawHref;
    if (internalPath.startsWith('https://sfcleaningconcepts.com')) {
      internalPath = internalPath.replace('https://sfcleaningconcepts.com', '');
    }
    if (internalPath.startsWith('http://localhost')) {
      internalPath = internalPath.replace(/http:\/\/localhost(:\d+)?/, '');
    }

    // Strip hash and query
    const cleanPath = internalPath.split('?')[0].split('#')[0];
    if (!cleanPath) continue;

    const linkKey = `${r.route} -> ${cleanPath}`;
    if (internalLinksTested.has(linkKey)) continue;
    internalLinksTested.add(linkKey);

    // Check if target matches valid route or physical file in dist/
    let resolved = false;

    // Check 1: Route set match
    if (validRoutes.has(cleanPath)) {
      resolved = true;
    }

    // Check 2: Physical file in dist
    if (!resolved) {
      const cleanRel = cleanPath.replace(/^\/+/, '');
      if (validHtmlFiles.has(cleanRel) || validHtmlFiles.has(`${cleanRel}/index.html`)) {
        resolved = true;
      } else {
        const targetOnDisk = path.join(DIST_DIR, cleanRel);
        if (fs.existsSync(targetOnDisk)) {
          resolved = true;
        } else if (fs.existsSync(`${targetOnDisk}.html`)) {
          resolved = true;
        } else if (fs.existsSync(path.join(targetOnDisk, 'index.html'))) {
          resolved = true;
        }
      }
    }

    // Check 3: Static public assets
    if (!resolved && (cleanPath.startsWith('/assets/') || cleanPath.startsWith('/public/'))) {
      const assetDisk = path.join(PROJECT_ROOT, cleanPath.startsWith('/public/') ? cleanPath : `public${cleanPath}`);
      const distAssetDisk = path.join(DIST_DIR, cleanPath.replace(/^\/+/, ''));
      if (fs.existsSync(assetDisk) || fs.existsSync(distAssetDisk)) {
        resolved = true;
      }
    }

    if (!resolved) {
      brokenLinks.push({ sourceRoute: r.route, targetHref: rawHref, reason: `Target "${cleanPath}" does not resolve to any static HTML route or disk asset` });
      recordFail('G5: Links', 'Broken Internal Link', `From ${r.route} to ${rawHref}`, r.route);
    }
  }
}

if (brokenLinks.length === 0) {
  recordPass('G5: Links', 'Zero Broken Internal Links', `Audited ${internalLinksTested.size} unique internal links across all 86 routes with 0 broken targets`);
}

// ----------------------------------------------------------------------
// SUMMARY & VERDICT
// ----------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`  AUDIT COMPLETE: ${passCount} CHECKS PASSED, ${failCount} CHECKS FAILED`);
console.log('======================================================================');

if (failures.length > 0) {
  console.log('\n--- DETAILED FAILURE BREAKDOWN ---');
  failures.forEach((f, idx) => {
    console.log(`  ${idx + 1}. [${f.testGroup}] ${f.testName}${f.route ? ` (${f.route})` : ''}: ${f.error}`);
  });
}

const exitCode = failCount > 0 ? 1 : 0;
process.exit(exitCode);
