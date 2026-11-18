import fs from 'node:fs';
import path from 'node:path';
import {
  ALL_CANONICAL_ROUTES,
  BLOG_SLUGS,
  BLOG_STATIC_BASELINES,
  BUSINESS_INVARIANTS,
  EDGE_CASE_CITY_SLUGS,
  EXPECTED_DESC_MAX_RAW,
  EXPECTED_DESC_MIN_RAW,
  EXPECTED_DIST_HTML_COUNT,
  EXPECTED_SITEMAP_COUNT,
  EXPECTED_TITLE_MAX_LEN,
  INDEXABLE_ROUTES,
  LEGACY_WP_REDIRECTS,
  SERVICE_AREA_SLUGS,
  SERVICE_AREA_STATIC_BASELINES,
  SERVICE_LIVE_BASELINES,
  SERVICE_SLUGS,
} from './baselines.mjs';

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, '"')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number.parseInt(n, 10)));
}

function stripTagsToText(html) {
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decodeHtmlEntities(clean).replace(/\s+/g, ' ').trim();
}

function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function collectHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results.sort();
}

function getAttr(tag, attrName) {
  const re = new RegExp(`\\b${attrName}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i');
  const m = tag.match(re);
  return m ? (m[1] ?? m[2] ?? '') : null;
}

function collectUrlsFromObject(value, out = []) {
  if (typeof value === 'string') {
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
      out.push(value);
    }
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectUrlsFromObject(item, out);
    return out;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectUrlsFromObject(v, out);
  }
  return out;
}

function collectDefinedIds(node, out = new Set()) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    for (const item of node) collectDefinedIds(item, out);
    return out;
  }
  if (typeof node['@id'] === 'string' && Object.keys(node).length > 1) {
    out.add(node['@id']);
  }
  for (const v of Object.values(node)) {
    if (typeof v === 'object') collectDefinedIds(v, out);
  }
  return out;
}

function collectReferencedIds(node, out = new Set()) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    for (const item of node) collectReferencedIds(item, out);
    return out;
  }
  if (typeof node['@id'] === 'string' && Object.keys(node).length === 1) {
    out.add(node['@id']);
  }
  for (const v of Object.values(node)) {
    if (typeof v === 'object') collectReferencedIds(v, out);
  }
  return out;
}

function parseHtmlDocument(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1].trim() : '';
  const decodedTitle = decodeHtmlEntities(rawTitle).replace(/\s+/g, ' ').trim();

  let rawDesc = null;
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  let robots = null;
  let ogUrl = null;
  let ogTitle = null;
  let ogDescription = null;
  let twitterTitle = null;
  let twitterDescription = null;
  for (const tag of metaTags) {
    const name = (getAttr(tag, 'name') || '').toLowerCase();
    const prop = (getAttr(tag, 'property') || '').toLowerCase();
    if (name === 'description' && rawDesc === null) {
      rawDesc = getAttr(tag, 'content');
    } else if (name === 'robots') {
      robots = getAttr(tag, 'content');
    } else if (name === 'twitter:title') {
      twitterTitle = getAttr(tag, 'content');
    } else if (name === 'twitter:description') {
      twitterDescription = getAttr(tag, 'content');
    } else if (prop === 'og:url') {
      ogUrl = getAttr(tag, 'content');
    } else if (prop === 'og:title') {
      ogTitle = getAttr(tag, 'content');
    } else if (prop === 'og:description') {
      ogDescription = getAttr(tag, 'content');
    }
  }

  let canonical = null;
  const hreflangs = [];
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of linkTags) {
    const rel = (getAttr(tag, 'rel') || '').toLowerCase();
    const href = getAttr(tag, 'href');
    const hreflang = getAttr(tag, 'hreflang');
    if (rel === 'canonical' && href !== null) {
      canonical = href;
    }
    if (hreflang && href !== null) {
      hreflangs.push({ hreflang, href });
    }
  }

  const jsonLdScripts = [];
  const jsonLdRe = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jm;
  while ((jm = jsonLdRe.exec(html)) !== null) {
    jsonLdScripts.push(jm[1].trim());
  }

  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;
  const mainMatch = bodyHtml.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const mainHtml = mainMatch ? mainMatch[1] : '';

  const visibleBodyText = stripTagsToText(bodyHtml);
  const visibleMainText = stripTagsToText(mainHtml);

  const headings = [];
  const headingSource = mainHtml || bodyHtml;
  const headingRe = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let hm;
  while ((hm = headingRe.exec(headingSource)) !== null) {
    headings.push({
      level: Number.parseInt(hm[1], 10),
      text: stripTagsToText(hm[2]),
    });
  }

  const imgs = [];
  const imgTags = bodyHtml.match(/<img\b[^>]*>/gi) || [];
  for (const tag of imgTags) {
    imgs.push({
      src: getAttr(tag, 'src') || '',
      alt: getAttr(tag, 'alt'),
    });
  }

  const anchors = [];
  const anchorTags = bodyHtml.match(/<a\b[^>]*>/gi) || [];
  for (const tag of anchorTags) {
    const href = getAttr(tag, 'href');
    if (href !== null) anchors.push(href);
  }

  return {
    rawTitle,
    decodedTitle,
    rawDesc,
    robots,
    ogUrl,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    canonical,
    hreflangs,
    jsonLdScripts,
    visibleBodyText,
    visibleMainText,
    bodyWords: countWords(visibleBodyText),
    mainWords: countWords(visibleMainText),
    headings,
    imgs,
    anchors,
  };
}

function getCanonicalFilePath(distDir, route) {
  if (route === '/') return path.join(distDir, 'index.html');
  if (route === '/404') return path.join(distDir, '404.html');
  return path.join(distDir, route.replace(/^\/+/, ''), 'index.html');
}

function resolveInternalPathInDist(distDir, href, redirectTargets) {
  let pathname = href;
  if (pathname.startsWith('https://sfcleaningconcepts.com') || pathname.startsWith('http://sfcleaningconcepts.com')) {
    pathname = new URL(pathname).pathname;
  }
  pathname = pathname.split('#')[0].split('?')[0];
  if (!pathname || pathname === '/') {
    return fs.existsSync(path.join(distDir, 'index.html'));
  }
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (redirectTargets.has(pathname) || redirectTargets.has(normalized)) {
    return true;
  }
  const rel = normalized.replace(/^\/+/, '');
  const candidate = path.join(distDir, rel);
  if (fs.existsSync(candidate)) {
    const st = fs.statSync(candidate);
    if (st.isFile()) return true;
    if (st.isDirectory() && fs.existsSync(path.join(candidate, 'index.html'))) return true;
  }
  if (fs.existsSync(`${candidate}.html`)) return true;
  return false;
}

export function analyzeDist(distDir) {
  const htmlFiles = collectHtmlFiles(distDir);
  const fileDocs = new Map();
  for (const file of htmlFiles) {
    const rel = path.relative(distDir, file);
    const html = fs.readFileSync(file, 'utf8');
    fileDocs.set(rel, { html, parsed: parseHtmlDocument(html) });
  }

  const routeDocs = new Map();
  for (const route of ALL_CANONICAL_ROUTES) {
    const filePath = getCanonicalFilePath(distDir, route);
    const rel = path.relative(distDir, filePath);
    const entry = fileDocs.get(rel);
    routeDocs.set(route, entry ? { rel, ...entry } : null);
  }

  const redirectTargets = new Set(['/contact']);
  const redirectsPath = path.join(distDir, '_redirects');
  const redirectsRaw = fs.existsSync(redirectsPath) ? fs.readFileSync(redirectsPath, 'utf8') : '';
  for (const line of redirectsRaw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const parts = t.split(/\s+/);
    if (parts.length >= 3 && parts[0].startsWith('/') && !parts[0].includes('*')) {
      redirectTargets.add(parts[0].replace(/\/+$/, '') || '/');
    }
  }

  return {
    distDir,
    htmlFiles,
    fileDocs,
    routeDocs,
    redirectTargets,
    redirectsRaw,
  };
}

export function runStaticTier1Checks(distAnalysis) {
  const results = [];
  const { distDir, htmlFiles, fileDocs, routeDocs, redirectTargets } = distAnalysis;

  // T1-B-STATIC-SERVICES: All 10 /service/:slug static mainWords >= 220w, <= 520w & < live baseline; bodyWords <= 920w & < live baseline
  {
    const failures = [];
    for (const slug of SERVICE_SLUGS) {
      const route = `/service/${slug}`;
      const doc = routeDocs.get(route);
      if (!doc) {
        failures.push(`${route}: missing static HTML`);
        continue;
      }
      const liveBaseline = SERVICE_LIVE_BASELINES.perSlug[slug];
      const { mainWords, bodyWords } = doc.parsed;
      if (mainWords < SERVICE_LIVE_BASELINES.floorMain) {
        failures.push(`${route}: static mainWords=${mainWords} below ${SERVICE_LIVE_BASELINES.floorMain}w anti-stub floor`);
      }
      if (mainWords > SERVICE_LIVE_BASELINES.staticMaxMain || mainWords >= liveBaseline.main) {
        failures.push(
          `${route}: static mainWords=${mainWords} exceeds condensed limit (expected <= ${SERVICE_LIVE_BASELINES.staticMaxMain} and < live ${liveBaseline.main})`
        );
      }
      if (bodyWords > SERVICE_LIVE_BASELINES.staticMaxBody || bodyWords >= liveBaseline.body) {
        failures.push(
          `${route}: static bodyWords=${bodyWords} exceeds condensed limit (expected <= ${SERVICE_LIVE_BASELINES.staticMaxBody} and < live ${liveBaseline.body})`
        );
      }
    }
    results.push({
      id: 'T1-B-STATIC-SERVICES',
      tier: 1,
      area: 'R2 Copy Condensation',
      name: 'Static dist/ word-count condensation (<=520w main, <=920w body, < live baseline) & >=220w floor across 10 /service/:slug routes',
      passed: failures.length === 0,
      details:
        failures.length === 0
          ? 'All 10 service routes within condensed bounds (220-520w main, <=920w body, < live baseline)'
          : failures.slice(0, 6).join('; '),
      failureCount: failures.length,
    });
  }

  // T1-B-STATIC-BLOGS: All 11 /blog/:slug static mainWords & bodyWords < baseline and >= 200w
  {
    const failures = [];
    for (const slug of BLOG_SLUGS) {
      const route = `/blog/${slug}`;
      const doc = routeDocs.get(route);
      if (!doc) {
        failures.push(`${route}: missing static HTML`);
        continue;
      }
      const baseline = BLOG_STATIC_BASELINES[slug];
      const { mainWords, bodyWords } = doc.parsed;
      if (mainWords >= baseline.main) {
        failures.push(`${route}: static mainWords=${mainWords} not reduced (< ${baseline.main})`);
      }
      if (bodyWords >= baseline.body) {
        failures.push(`${route}: static bodyWords=${bodyWords} not reduced (< ${baseline.body})`);
      }
      if (mainWords < 200) {
        failures.push(`${route}: static mainWords=${mainWords} below 200w floor`);
      }
    }
    results.push({
      id: 'T1-B-STATIC-BLOGS',
      tier: 1,
      area: 'R2 Copy Condensation',
      name: 'Static dist/ word-count reduction & >=200w floor across all 11 /blog/:slug routes',
      passed: failures.length === 0,
      details: failures.length === 0 ? 'All 11 blog routes condensed below baseline and >= 200w' : failures.slice(0, 6).join('; '),
      failureCount: failures.length,
    });
  }

  // T1-B-STATIC-AREAS-FAQS: /service-areas, representative /service-area/:slug, and /faqs static reduction
  {
    const failures = [];
    for (const [key, base] of Object.entries(SERVICE_AREA_STATIC_BASELINES)) {
      const route = key === 'service-areas' ? '/service-areas' : `/service-area/${key}`;
      const doc = routeDocs.get(route);
      if (!doc) {
        failures.push(`${route}: missing static HTML`);
        continue;
      }
      const { mainWords, bodyWords } = doc.parsed;
      if (mainWords >= base.main) {
        failures.push(`${route}: static mainWords=${mainWords} not reduced (< ${base.main})`);
      }
      if (bodyWords >= base.body) {
        failures.push(`${route}: static bodyWords=${bodyWords} not reduced (< ${base.body})`);
      }
      if (mainWords < base.floorMain) {
        failures.push(`${route}: static mainWords=${mainWords} below ${base.floorMain}w floor`);
      }
    }
    const faqsDoc = routeDocs.get('/faqs');
    if (!faqsDoc || faqsDoc.parsed.mainWords >= 583 || faqsDoc.parsed.mainWords < 120) {
      failures.push(`/faqs: static mainWords=${faqsDoc?.parsed.mainWords ?? 'missing'} (expected < 583 and >= 120)`);
    }
    results.push({
      id: 'T1-B-STATIC-AREAS-FAQS',
      tier: 1,
      area: 'R2 Copy Condensation',
      name: 'Static dist/ reduction on /service-areas, representative /service-area/:slug, and /faqs',
      passed: failures.length === 0,
      details: failures.length === 0 ? 'All sampled area hubs & /faqs reduced below baseline above floor' : failures.join('; '),
      failureCount: failures.length,
    });
  }

  // T1-C-173-CTA: "Call (561) 704-5303" in all 173 HTML files + core NAP invariants
  {
    const failures = [];
    if (htmlFiles.length !== EXPECTED_DIST_HTML_COUNT) {
      failures.push(`Expected ${EXPECTED_DIST_HTML_COUNT} HTML files in dist/, found ${htmlFiles.length}`);
    }
    for (const [rel, { html }] of fileDocs.entries()) {
      if (!html.includes(BUSINESS_INVARIANTS.phoneCta)) {
        failures.push(`Missing "${BUSINESS_INVARIANTS.phoneCta}" in ${rel}`);
      }
    }
    for (const route of ['/', '/about-us', '/contact-us']) {
      const doc = routeDocs.get(route);
      const text = doc?.parsed.visibleBodyText || '';
      if (!text.includes(BUSINESS_INVARIANTS.companyName)) failures.push(`${route}: missing company name`);
      if (!text.includes(BUSINESS_INVARIANTS.phoneDisplay)) failures.push(`${route}: missing phone`);
      if (!text.includes(BUSINESS_INVARIANTS.city)) failures.push(`${route}: missing Boynton Beach`);
      if (!text.includes(BUSINESS_INVARIANTS.email)) failures.push(`${route}: missing email`);
      if (route === '/contact-us' && !/(Monday\s*[–-]\s*Sunday|Mon\s*[–-]\s*Sun)/i.test(text)) {
        failures.push(`${route}: missing Monday-Sunday / Mon-Sun hours`);
      }
    }
    results.push({
      id: 'T1-C-173-CTA-NAP',
      tier: 1,
      area: 'Business & Geo Invariants',
      name: '"Call (561) 704-5303" in all 173 dist/ HTML files & core NAP/hours preserved',
      passed: failures.length === 0,
      details: failures.length === 0 ? `Verified across ${fileDocs.size} files` : failures.slice(0, 6).join('; '),
      failureCount: failures.length,
    });
  }

  // T1-C-FORBIDDEN: Zero forbidden strings across all 173 HTML files
  {
    const failures = [];
    for (const [rel, { parsed }] of fileDocs.entries()) {
      const haystack = `${parsed.decodedTitle}\n${parsed.rawDesc || ''}\n${parsed.visibleBodyText}`;
      for (const bad of BUSINESS_INVARIANTS.forbiddenStrings) {
        if (haystack.toLowerCase().includes(bad.toLowerCase())) {
          failures.push(`${rel}: contains forbidden token ${JSON.stringify(bad)}`);
        }
      }
    }
    results.push({
      id: 'T1-C-FORBIDDEN',
      tier: 1,
      area: 'Business & Geo Invariants',
      name: 'Zero forbidden strings (24/7, twenty-four hours, 【, 】, ZWSP) across 173 HTML files',
      passed: failures.length === 0,
      details: failures.length === 0 ? '0 forbidden tokens across 173 HTML files' : failures.slice(0, 6).join('; '),
      failureCount: failures.length,
    });
  }

  // T1-C-DIFFERENTIATORS-GEO: Service differentiators, tri-county coverage & 56 area routes
  {
    const failures = [];
    const hmText = (routeDocs.get('/service/home-maintenance')?.parsed.visibleMainText || '').toLowerCase();
    for (const kw of ['pressure washing', 'window cleaning', 'gutter']) {
      if (!hmText.includes(kw)) failures.push(`/service/home-maintenance missing "${kw}"`);
    }
    const hwText = (routeDocs.get('/service/home-watching')?.parsed.visibleMainText || '').toLowerCase();
    for (const kw of ['refrigerat', 'freezer']) {
      if (!hwText.includes(kw)) failures.push(`/service/home-watching missing "${kw}"`);
    }
    const homeText = routeDocs.get('/')?.parsed.visibleBodyText || '';
    const areasText = routeDocs.get('/service-areas')?.parsed.visibleMainText || '';
    for (const county of BUSINESS_INVARIANTS.triCountyTokens) {
      if (!homeText.includes(county) && !areasText.includes(county)) {
        failures.push(`Missing tri-county reference "${county}"`);
      }
    }
    for (const slug of SERVICE_AREA_SLUGS) {
      if (!routeDocs.get(`/service-area/${slug}`)) {
        failures.push(`Missing static dist/ route /service-area/${slug}`);
      }
    }
    results.push({
      id: 'T1-C-DIFFERENTIATORS-GEO',
      tier: 1,
      area: 'Business & Geo Invariants',
      name: 'Service differentiators (home-maintenance/home-watching) & 56 tri-county service areas present',
      passed: failures.length === 0,
      details: failures.length === 0 ? 'All differentiators, tri-county tokens, and 56 service-area files verified' : failures.join('; '),
      failureCount: failures.length,
    });
  }

  // T1-C-VIDEO-ASSETS: All 4 PROMO_VIDEOS MP4 assets valid (>2MB, ftyp signature)
  {
    const failures = [];
    for (const fileName of BUSINESS_INVARIANTS.promoVideoAssets) {
      const fullPath = path.join(distDir, 'assets', 'videos', fileName);
      if (!fs.existsSync(fullPath)) {
        failures.push(`Missing video asset: dist/assets/videos/${fileName}`);
        continue;
      }
      const stat = fs.statSync(fullPath);
      if (stat.size < 2 * 1024 * 1024) {
        failures.push(`${fileName}: size ${stat.size} < 2MB`);
      }
      const fd = fs.openSync(fullPath, 'r');
      const buf = Buffer.alloc(12);
      fs.readSync(fd, buf, 0, 12, 0);
      fs.closeSync(fd);
      if (buf.toString('ascii', 4, 8) !== 'ftyp') {
        failures.push(`${fileName}: invalid MP4 header (missing ftyp box)`);
      }
    }
    results.push({
      id: 'T1-C-VIDEO-ASSETS',
      tier: 1,
      area: 'Business & Geo Invariants',
      name: 'All 4 promo MP4 assets in dist/assets/videos/ valid (>2MB, ftyp)',
      passed: failures.length === 0,
      details: failures.length === 0 ? 'All 4 MP4 assets verified (>2MB, valid ftyp)' : failures.join('; '),
      failureCount: failures.length,
    });
  }

  // T1-D-TITLES: Unique non-empty <= 60 decoded chars across all 86 routes
  {
    const failures = [];
    const seen = new Map();
    for (const route of ALL_CANONICAL_ROUTES) {
      const doc = routeDocs.get(route);
      if (!doc) {
        failures.push(`${route}: missing HTML`);
        continue;
      }
      const title = doc.parsed.decodedTitle;
      if (!title) {
        failures.push(`${route}: empty <title>`);
      } else {
        if (title.length > EXPECTED_TITLE_MAX_LEN) {
          failures.push(`${route}: title "${title}" is ${title.length} chars (> ${EXPECTED_TITLE_MAX_LEN})`);
        }
        if (seen.has(title)) {
          failures.push(`${route}: duplicate title also used on ${seen.get(title)}: "${title}"`);
        } else {
          seen.set(title, route);
        }
      }
    }
    results.push({
      id: 'T1-D-TITLES',
      tier: 1,
      area: 'Automated SEO',
      name: 'Unique non-empty <title> (<= 60 decoded chars) across all 86 canonical routes',
      passed: failures.length === 0,
      details: failures.length === 0 ? '86/86 unique titles <= 60 decoded chars' : failures.slice(0, 6).join('; '),
      failureCount: failures.length,
    });
  }

  // T1-D-META-DESC: Unique <meta name="description"> 120-160 raw chars across all 173 files
  {
    const failures = [];
    const canonicalDescs = new Map();
    for (const [rel, { parsed }] of fileDocs.entries()) {
      if (parsed.rawDesc === null) {
        failures.push(`${rel}: missing <meta name="description">`);
        continue;
      }
      const rawLen = parsed.rawDesc.length;
      if (rawLen < EXPECTED_DESC_MIN_RAW || rawLen > EXPECTED_DESC_MAX_RAW) {
        failures.push(`${rel}: raw meta description length ${rawLen} outside [${EXPECTED_DESC_MIN_RAW}, ${EXPECTED_DESC_MAX_RAW}]`);
      }
      if (!parsed.rawDesc.includes(BUSINESS_INVARIANTS.phoneCta)) {
        failures.push(`${rel}: meta description missing "${BUSINESS_INVARIANTS.phoneCta}"`);
      }
    }
    for (const route of ALL_CANONICAL_ROUTES) {
      const doc = routeDocs.get(route);
      const desc = doc?.parsed.rawDesc;
      if (desc) {
        if (canonicalDescs.has(desc)) {
          failures.push(`${route}: duplicate meta description shared with ${canonicalDescs.get(desc)}`);
        } else {
          canonicalDescs.set(desc, route);
        }
      }
    }
    results.push({
      id: 'T1-D-META-DESC',
      tier: 1,
      area: 'Automated SEO',
      name: 'Unique <meta name="description"> (120-160 raw chars + phone CTA) across all 173 HTML files',
      passed: failures.length === 0,
      details: failures.length === 0 ? `173/173 files compliant (120-160 raw chars, unique across 86 routes)` : failures.slice(0, 6).join('; '),
      failureCount: failures.length,
    });
  }

  // T1-D-HEADINGS: Single <h1> and no heading-level skips across all 86 canonical routes
  {
    const failures = [];
    for (const route of ALL_CANONICAL_ROUTES) {
      const doc = routeDocs.get(route);
      if (!doc) continue;
      const headings = doc.parsed.headings;
      const h1s = headings.filter((h) => h.level === 1);
      if (h1s.length !== 1) {
        failures.push(`${route}: expected 1 <h1>, found ${h1s.length}`);
      }
      for (let i = 1; i < headings.length; i++) {
        if (headings[i].level > headings[i - 1].level + 1) {
          failures.push(
            `${route}: heading skip h${headings[i - 1].level} -> h${headings[i].level} ("${headings[i].text.slice(0, 40)}")`
          );
          break;
        }
      }
    }
    results.push({
      id: 'T1-D-HEADINGS',
      tier: 1,
      area: 'Automated SEO',
      name: 'Single <h1> and valid non-skipping heading hierarchy across all 86 static routes',
      passed: failures.length === 0,
      details: failures.length === 0 ? '86/86 routes have 1 <h1> and 0 heading skips' : failures.slice(0, 6).join('; '),
      failureCount: failures.length,
    });
  }

  // T1-D-CANONICAL-SCHEMA-URLS: Extensionless canonicals, og:url, hreflang, and 0 .html inside JSON-LD
  {
    const failures = [];
    for (const route of INDEXABLE_ROUTES) {
      const doc = routeDocs.get(route);
      if (!doc) continue;
      const { canonical, ogUrl, hreflangs, jsonLdScripts } = doc.parsed;
      const expectedCanonical = `https://sfcleaningconcepts.com${route}`;
      if (!canonical || canonical !== expectedCanonical || /\.html$/i.test(canonical)) {
        failures.push(`${route}: invalid canonical "${canonical}" (expected "${expectedCanonical}")`);
      }
      if (!ogUrl || ogUrl !== expectedCanonical || /\.html$/i.test(ogUrl)) {
        failures.push(`${route}: invalid og:url "${ogUrl}"`);
      }
      for (const hl of hreflangs) {
        if (/\.html$/i.test(hl.href)) {
          failures.push(`${route}: hreflang ${hl.hreflang} ends with .html (${hl.href})`);
        }
      }
      for (const rawJson of jsonLdScripts) {
        try {
          const obj = JSON.parse(rawJson);
          const urls = collectUrlsFromObject(obj);
          const badUrls = urls.filter((u) => /\.html(?:$|[?#])/i.test(u));
          if (badUrls.length > 0) {
            failures.push(`${route}: JSON-LD contains .html URL(s): ${badUrls.slice(0, 2).join(', ')}`);
          }
        } catch {
          // JSON parse error handled in T1-D-JSONLD-STATIC
        }
      }
    }
    results.push({
      id: 'T1-D-CANONICAL-SCHEMA-URLS',
      tier: 1,
      area: 'Automated SEO',
      name: 'Extensionless canonicals, og:url, hreflang, and 0 .html URLs in JSON-LD across 85 routes',
      passed: failures.length === 0,
      details: failures.length === 0 ? '0 .html URLs in canonicals/og:url/JSON-LD across 85 indexable routes' : `${failures.length} route(s) failed: ${failures.slice(0, 4).join('; ')}`,
      failureCount: failures.length,
    });
  }

  // T1-D-JSONLD-STATIC: Single valid JSON-LD on 85 indexable routes, 0 on /404 + noindex
  {
    const failures = [];
    for (const route of INDEXABLE_ROUTES) {
      const doc = routeDocs.get(route);
      if (!doc) continue;
      const scripts = doc.parsed.jsonLdScripts;
      if (scripts.length !== 1) {
        failures.push(`${route}: expected 1 JSON-LD script, found ${scripts.length}`);
        continue;
      }
      if (/&(?:amp|quot|#39|lt|gt);/.test(scripts[0])) {
        failures.push(`${route}: JSON-LD contains raw HTML entities`);
      }
      try {
        const parsed = JSON.parse(scripts[0]);
        if (parsed['@context'] !== 'https://schema.org') {
          failures.push(`${route}: JSON-LD @context="${parsed['@context']}"`);
        }
      } catch (e) {
        failures.push(`${route}: invalid JSON-LD (${e.message})`);
      }
    }
    const notFound = routeDocs.get('/404');
    if (!notFound) {
      failures.push('/404: missing dist/404.html');
    } else {
      if (!/noindex/i.test(notFound.parsed.robots || '') || !/nofollow/i.test(notFound.parsed.robots || '')) {
        failures.push(`/404: robots="${notFound.parsed.robots}" missing noindex, nofollow`);
      }
      if (notFound.parsed.jsonLdScripts.length !== 0) {
        failures.push(`/404: static dist/404.html has ${notFound.parsed.jsonLdScripts.length} JSON-LD scripts (expected 0)`);
      }
    }
    results.push({
      id: 'T1-D-JSONLD-STATIC',
      tier: 1,
      area: 'Automated SEO',
      name: 'Single valid JSON-LD on all 85 indexable static routes & 0 JSON-LD + noindex on /404',
      passed: failures.length === 0,
      details: failures.length === 0 ? '85/85 single valid JSON-LD; /404 has noindex + 0 JSON-LD' : failures.slice(0, 6).join('; '),
      failureCount: failures.length,
    });
  }

  // T1-D-LINKS-ALT-DISCOVERY: Broken internal links, glued plain-text URLs, missing alt, sitemap/robots/llms
  {
    const failures = [];
    const gluedRegex = /[a-zA-Z](?:https?:\/\/|sfcleaningconcepts\.com)/;
    for (const route of ALL_CANONICAL_ROUTES) {
      const doc = routeDocs.get(route);
      if (!doc) continue;
      if (gluedRegex.test(doc.parsed.visibleBodyText)) {
        const m = doc.parsed.visibleBodyText.match(gluedRegex);
        failures.push(`${route}: glued plain-text URL near "${m?.[0]}"`);
      }
      for (const img of doc.parsed.imgs) {
        if (img.alt === null || img.alt.trim() === '') {
          failures.push(`${route}: <img> missing non-empty alt (src="${img.src}")`);
        }
      }
      for (const href of doc.parsed.anchors) {
        if (
          (href.startsWith('/') && !href.startsWith('//')) ||
          href === 'https://sfcleaningconcepts.com' ||
          href === 'http://sfcleaningconcepts.com' ||
          href.startsWith('https://sfcleaningconcepts.com/') ||
          href.startsWith('http://sfcleaningconcepts.com/')
        ) {
          if (!resolveInternalPathInDist(distDir, href, redirectTargets)) {
            failures.push(`${route}: broken internal link "${href}"`);
          }
        }
      }
    }

    const sitemapPath = path.join(distDir, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
      failures.push('Missing dist/sitemap.xml');
    } else {
      const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
      const locs = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
      if (locs.length !== EXPECTED_SITEMAP_COUNT) {
        failures.push(`sitemap.xml has ${locs.length} URLs (expected ${EXPECTED_SITEMAP_COUNT})`);
      }
      if (locs.some((u) => u.endsWith('/404') || /\.html$/i.test(u))) {
        failures.push('sitemap.xml contains /404 or .html URL');
      }
    }

    const robotsPath = path.join(distDir, 'robots.txt');
    if (!fs.existsSync(robotsPath)) {
      failures.push('Missing dist/robots.txt');
    } else {
      const robotsTxt = fs.readFileSync(robotsPath, 'utf8');
      if (!/Disallow:\s*\/404/i.test(robotsTxt)) failures.push('robots.txt missing Disallow: /404');
      if (!/Sitemap:\s*https:\/\/sfcleaningconcepts\.com\/sitemap\.xml/i.test(robotsTxt)) failures.push('robots.txt missing Sitemap');
      if (!/LLMs:\s*https:\/\/sfcleaningconcepts\.com\/llms\.txt/i.test(robotsTxt)) failures.push('robots.txt missing LLMs');
    }

    const llmsPath = path.join(distDir, 'llms.txt');
    if (!fs.existsSync(llmsPath)) {
      failures.push('Missing dist/llms.txt');
    } else {
      const llmsTxt = fs.readFileSync(llmsPath, 'utf8');
      const areaLinks = [...llmsTxt.matchAll(/https:\/\/sfcleaningconcepts\.com\/service-area\/([a-z0-9-]+)/g)].map((m) => m[1]);
      if (new Set(areaLinks).size !== SERVICE_AREA_SLUGS.length) {
        failures.push(`llms.txt has ${new Set(areaLinks).size} unique service-area links (expected ${SERVICE_AREA_SLUGS.length})`);
      }
      const allLlmsLinks = [...llmsTxt.matchAll(/https:\/\/sfcleaningconcepts\.com([^\s)]+)/g)].map((m) => m[1]);
      for (const linkPath of allLlmsLinks) {
        if (!resolveInternalPathInDist(distDir, linkPath, redirectTargets)) {
          failures.push(`llms.txt dead link: ${linkPath}`);
        }
      }
    }

    const llmsFullPath = path.join(distDir, 'llms-full.txt');
    if (!fs.existsSync(llmsFullPath)) {
      failures.push('Missing dist/llms-full.txt');
    } else {
      const llmsFullSize = fs.statSync(llmsFullPath).size;
      if (llmsFullSize <= 10000) {
        failures.push(`dist/llms-full.txt too small (${llmsFullSize} bytes, expected > 10000)`);
      }
    }

    results.push({
      id: 'T1-D-LINKS-ALT-DISCOVERY',
      tier: 1,
      area: 'Automated SEO',
      name: '0 broken internal links, 0 glued plain-text URLs, 0 empty alt, sitemap/robots/llms parity',
      passed: failures.length === 0,
      details: failures.length === 0 ? 'All internal links, alt attributes, and discovery files valid' : failures.slice(0, 6).join('; '),
      failureCount: failures.length,
    });
  }

  // T1-D-STATIC-PARITY-HARDENING: hreflang="en-us", OG/Twitter parity, /contact-us GlobalCTA omission, JSON-LD ban-list + @id integrity, 56-area bounds
  {
    const failures = [];
    for (const route of ALL_CANONICAL_ROUTES) {
      const doc = routeDocs.get(route);
      if (!doc) continue;
      const { html, parsed } = doc;
      const expectedCanonical = `https://sfcleaningconcepts.com${route}`;
      if (route !== '/404') {
        const hasHreflang = parsed.hreflangs.some(
          (h) => h.hreflang.toLowerCase() === 'en-us' && h.href === expectedCanonical
        );
        if (!hasHreflang) {
          failures.push(`${route}: missing <link rel="alternate" hreflang="en-us" href="${expectedCanonical}">`);
        }
      } else if (parsed.hreflangs.length > 0) {
        failures.push(`/404: unexpected hreflang link on error route`);
      }

      if (parsed.ogTitle !== parsed.rawTitle || parsed.twitterTitle !== parsed.rawTitle) {
        failures.push(`${route}: og:title/twitter:title mismatch with <title>`);
      }
      if (parsed.ogDescription !== parsed.rawDesc || parsed.twitterDescription !== parsed.rawDesc) {
        failures.push(`${route}: og:description/twitter:description mismatch with <meta name="description">`);
      }
      if ((route === '/contact-us' || route === '/404') && html.includes('data-testid="global-cta"')) {
        failures.push(`${route}: static HTML should omit data-testid="global-cta" to match App.tsx`);
      }
    }

    for (const contactRel of ['contact/index.html', 'contact.html', 'contact-us.html']) {
      const contactDoc = fileDocs.get(contactRel);
      if (contactDoc && contactDoc.html.includes('data-testid="global-cta"')) {
        failures.push(`${contactRel}: static HTML should omit data-testid="global-cta"`);
      }
    }

    for (const slug of SERVICE_AREA_SLUGS) {
      const doc = routeDocs.get(`/service-area/${slug}`);
      const w = doc?.parsed.mainWords ?? 0;
      if (w < 350 || w > 1200) {
        failures.push(`/service-area/${slug}: static mainWords=${w} outside [350, 1200]`);
      }
    }

    for (const [rel, { parsed }] of fileDocs.entries()) {
      for (const rawJson of parsed.jsonLdScripts) {
        if (/24\/7|twenty-four hours|[【】\u200b]/i.test(rawJson)) {
          failures.push(`${rel}: JSON-LD contains banned string`);
        }
        try {
          const obj = JSON.parse(rawJson);
          const def = collectDefinedIds(obj);
          const ref = collectReferencedIds(obj);
          const dangling = [...ref].filter((id) => !def.has(id));
          if (dangling.length > 0) {
            failures.push(`${rel}: JSON-LD dangling @id ref(s): ${dangling.join(', ')}`);
          }
        } catch {
          // JSON syntax errors reported by T1-D-JSONLD-STATIC
        }
      }
    }

    results.push({
      id: 'T1-D-STATIC-PARITY-HARDENING',
      tier: 1,
      area: 'Automated SEO',
      name: 'Static hreflang, OG/Twitter parity, /contact-us GlobalCTA omission, JSON-LD ban-list/@id & 56-area word bounds',
      passed: failures.length === 0,
      details: failures.length === 0 ? 'All static parity invariants passed across 86 routes / 173 files' : failures.slice(0, 6).join('; '),
      failureCount: failures.length,
    });
  }

  return results;
}

export async function runStaticTier2Checks(distAnalysis, baseUrl) {
  const results = [];
  const { routeDocs, redirectsRaw } = distAnalysis;

  // T2-EDGE-CITIES-STATIC: Long city name routes (titles <=60, raw desc 120-160, 1 h1, condensed, 0 .html schema)
  {
    const failures = [];
    for (const slug of EDGE_CASE_CITY_SLUGS) {
      const route = `/service-area/${slug}`;
      const doc = routeDocs.get(route);
      if (!doc) {
        failures.push(`${route}: missing static file`);
        continue;
      }
      const { decodedTitle, rawDesc, headings, canonical } = doc.parsed;
      if (decodedTitle.length > EXPECTED_TITLE_MAX_LEN) {
        failures.push(`${route}: title "${decodedTitle}" is ${decodedTitle.length} chars (> ${EXPECTED_TITLE_MAX_LEN})`);
      }
      if (!rawDesc || rawDesc.length < EXPECTED_DESC_MIN_RAW || rawDesc.length > EXPECTED_DESC_MAX_RAW) {
        failures.push(`${route}: raw desc len ${rawDesc?.length ?? 0} outside [120,160]`);
      }
      if (headings.filter((h) => h.level === 1).length !== 1) {
        failures.push(`${route}: expected 1 <h1>`);
      }
      if (!canonical || /\.html$/i.test(canonical)) {
        failures.push(`${route}: non-extensionless canonical ${canonical}`);
      }
    }
    results.push({
      id: 'T2-EDGE-CITIES-STATIC',
      tier: 2,
      area: 'Boundary & Corner Cases',
      name: 'Edge-case long city names (jupiter-inlet-colony, palm-beach-gardens, lake-clarke-shores, palm-beach-gardens-west) SEO bounds',
      passed: failures.length === 0,
      details: failures.length === 0 ? 'All 4 long city routes pass <=60 title & 120-160 desc bounds' : failures.join('; '),
      failureCount: failures.length,
    });
  }

  // T2-BLOG-FLOOR-AND-REDIRECTS: All 11 blog >=200w + 11 legacy WP 301s + /contact 301 via HTTP server
  {
    const failures = [];
    for (const slug of BLOG_SLUGS) {
      const doc = routeDocs.get(`/blog/${slug}`);
      const mainWords = doc?.parsed.mainWords ?? 0;
      if (mainWords < 200) {
        failures.push(`/blog/${slug}: static mainWords=${mainWords} < 200w floor`);
      }
    }
    const redirectRules = [
      ...LEGACY_WP_REDIRECTS,
      { from: '/contact', to: '/contact-us' },
    ];
    for (const rule of redirectRules) {
      if (!redirectsRaw.includes(rule.to)) {
        failures.push(`_redirects missing target ${rule.to}`);
      }
      const res = await fetch(`${baseUrl}${rule.from}`, { redirect: 'manual' });
      const loc = res.headers.get('location');
      if (res.status !== 301 || loc !== rule.to) {
        failures.push(`HTTP 301 mismatch for ${rule.from}: status=${res.status}, location=${loc} (expected 301 -> ${rule.to})`);
      }
    }
    results.push({
      id: 'T2-BLOG-FLOOR-AND-REDIRECTS',
      tier: 2,
      area: 'Boundary & Corner Cases',
      name: 'All 11 blog posts >= 200w floor & all 11 legacy WP + /contact 301 redirect rules verified via HTTP',
      passed: failures.length === 0,
      details: failures.length === 0 ? 'All 11 blogs >=200w and 12/12 HTTP 301 redirect rules pass' : failures.slice(0, 6).join('; '),
      failureCount: failures.length,
    });
  }

  return results;
}
