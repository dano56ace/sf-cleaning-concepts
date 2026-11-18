import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { normalizeRoutePath } from '../components/seo/SEOHead';
import { ServiceAreaLocalGuide } from '../components/service-areas/ServiceAreaLocalGuide';
import { SEO_ROUTES_MAP } from '../data/seoRegistry';
import { BLOG_POSTS, SERVICES_CATALOG } from '../data/siteData';
import { serviceAreas, serviceAreasBySlug } from '../data/serviceAreas';
import { SERVICE_AREA_GUIDES, getServiceAreaGuide } from '../data/serviceAreaGuideData';
import { BLOG_SCHEMA_REGISTRY, getBlogPostSchema } from '../data/blogSchemaData';
import { generateLlmsManifest, generateLlmsFullCorpus } from '../../scripts/generate-llms-docs';

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

function collectDefinedIds(node: unknown, out = new Set<string>()): Set<string> {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    for (const item of node) collectDefinedIds(item, out);
    return out;
  }
  const obj = node as Record<string, unknown>;
  if (typeof obj['@id'] === 'string' && Object.keys(obj).length > 1) {
    out.add(obj['@id']);
  }
  for (const val of Object.values(obj)) {
    if (typeof val === 'object') collectDefinedIds(val, out);
  }
  return out;
}

function collectReferencedIds(node: unknown, out = new Set<string>()): Set<string> {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    for (const item of node) collectReferencedIds(item, out);
    return out;
  }
  const obj = node as Record<string, unknown>;
  if (typeof obj['@id'] === 'string' && Object.keys(obj).length === 1) {
    out.add(obj['@id']);
  }
  for (const val of Object.values(obj)) {
    if (typeof val === 'object') collectReferencedIds(val, out);
  }
  return out;
}

test('normalizeRoutePath normalizes all explicit .html, trailing-slash, and uppercase variants including /service.html', () => {
  assert.equal(normalizeRoutePath('/'), '/');
  assert.equal(normalizeRoutePath('/index.html'), '/');
  assert.equal(normalizeRoutePath('/service/index.html'), '/service');
  assert.equal(normalizeRoutePath('/service.html'), '/service');
  assert.equal(normalizeRoutePath('/contact.html/'), '/contact');
  assert.equal(normalizeRoutePath('/SERVICE-AREA/JUPITER/'), '/service-area/jupiter');
  assert.equal(normalizeRoutePath('/blog/medical-office-cleaning-guide.html'), '/blog/medical-office-cleaning-guide');
  assert.equal(Object.prototype.hasOwnProperty.call(SEO_ROUTES_MAP, 'toString'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(serviceAreasBySlug, 'toString'), false);
});

test('SEO_ROUTES_MAP covers all 86 canonical routes with <=60 char titles, 120-160 raw descriptions, and existing local ogImage assets', () => {
  const expectedRoutes = new Set<string>([
    '/',
    '/about-us',
    '/our-services',
    '/contact-us',
    '/faqs',
    '/our-publications',
    '/service',
    '/service-areas',
    '/404',
    ...SERVICES_CATALOG.map((s) => `/service/${s.slug}`),
    ...BLOG_POSTS.map((b) => `/blog/${b.slug}`),
    ...serviceAreas.map((a) => `/service-area/${a.slug}`),
  ]);

  assert.equal(Object.keys(SEO_ROUTES_MAP).length, 86);
  for (const route of expectedRoutes) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(SEO_ROUTES_MAP, route),
      `SEO_ROUTES_MAP missing route ${route}`
    );
    const meta = SEO_ROUTES_MAP[route];
    assert.ok(meta.title.length > 0 && meta.title.length <= 60, `${route} title > 60 chars: "${meta.title}"`);
    assert.ok(
      meta.description.length >= 120 && meta.description.length <= 160,
      `${route} description length ${meta.description.length} outside [120, 160]`
    );
    assert.ok(
      meta.canonical === `https://sfcleaningconcepts.com${route}` && !meta.canonical.endsWith('.html'),
      `Invalid canonical for ${route}: ${meta.canonical}`
    );
    const imgRel = meta.ogImage.replace('https://sfcleaningconcepts.com/', '');
    assert.ok(fs.existsSync(path.join(PUBLIC_DIR, imgRel)), `Missing ogImage asset on disk: ${imgRel}`);
  }
});

test('BLOG_SCHEMA_REGISTRY covers all 11 posts with 120-160 char descriptions, aligned images, extensionless schema URLs, and zero dangling @id refs', () => {
  for (const post of BLOG_POSTS) {
    const entry = BLOG_SCHEMA_REGISTRY[post.slug];
    const seoMeta = SEO_ROUTES_MAP[`/blog/${post.slug}`];
    assert.ok(entry, `Missing BLOG_SCHEMA_REGISTRY entry for ${post.slug}`);
    assert.ok(
      entry.description.length >= 120 && entry.description.length <= 160,
      `BLOG_SCHEMA_REGISTRY[${post.slug}].description is ${entry.description.length} chars (expected 120-160)`
    );
    const expectedImage = `https://sfcleaningconcepts.com${post.image}`;
    assert.equal(entry.image, expectedImage, `Blog schema image mismatch for ${post.slug}`);
    assert.equal(seoMeta.ogImage, expectedImage, `Blog ogImage mismatch for ${post.slug}`);

    const imgRel = entry.image.replace('https://sfcleaningconcepts.com/', '');
    assert.ok(fs.existsSync(path.join(PUBLIC_DIR, imgRel)), `Missing blog schema image on disk: ${imgRel}`);
    const schema = getBlogPostSchema(post.slug);
    assert.ok(schema, `getBlogPostSchema returned null for ${post.slug}`);
    assert.ok(!/\.html(?:$|[?#"])/.test(JSON.stringify(schema)), `Found .html URL in blog schema for ${post.slug}`);

    const definedIds = collectDefinedIds(schema);
    const referencedIds = collectReferencedIds(schema);
    const danglingIds = [...referencedIds].filter((id) => !definedIds.has(id));
    assert.deepEqual(danglingIds, [], `Dangling @id references for ${post.slug}: ${danglingIds.join(', ')}`);
  }
});

test('all 56 serviceAreas and SERVICE_AREA_GUIDES have valid geo coordinates, unique list keys, and zero banned tokens', () => {
  assert.equal(serviceAreas.length, 56);
  const slugSet = new Set(serviceAreas.map((a) => a.slug));
  for (const guideKey of Object.keys(SERVICE_AREA_GUIDES)) {
    assert.ok(slugSet.has(guideKey), `Orphan key in SERVICE_AREA_GUIDES: ${guideKey}`);
  }

  for (const area of serviceAreas) {
    assert.ok(Object.prototype.hasOwnProperty.call(serviceAreasBySlug, area.slug));
    const lat = Number(area.geo?.latitude);
    const lng = Number(area.geo?.longitude);
    assert.ok(Number.isFinite(lat) && lat > 24 && lat < 30, `Invalid latitude for ${area.slug}: ${area.geo?.latitude}`);
    assert.ok(Number.isFinite(lng) && lng < -79 && lng > -83, `Invalid longitude for ${area.slug}: ${area.geo?.longitude}`);

    const guide = getServiceAreaGuide(area);
    assert.ok(guide.localCopy.length >= 2);
    assert.ok(guide.landmarks.length >= 4);
    assert.ok(guide.thingsToDo.length >= 4);
    assert.ok(guide.keyCorridors.length >= 4);
    assert.ok(guide.topIndustries.length >= 4);
    assert.equal(new Set(guide.landmarks.map((l) => l.name)).size, guide.landmarks.length);
    assert.equal(new Set(guide.thingsToDo.map((t) => t.title)).size, guide.thingsToDo.length);

    const serialized = JSON.stringify({ area, guide });
    assert.ok(!/24\/7|twenty-four hours|[【】\u200b]/i.test(serialized), `Banned token in serviceArea ${area.slug}`);
    assert.ok(!/\b(?:undefined|NaN)\b/.test(serialized), `Unresolved template value in ${area.slug}`);
  }

  // Fallback boundary for unknown slug with empty neighborhoods
  const fallback = getServiceAreaGuide({
    name: 'Test City',
    slug: 'test-city',
    description: 'Test',
    highlights: [],
    neighborhoods: [],
    marketInsight: 'Test',
  });
  assert.ok(fallback.localCopy.length > 0 && !/undefined|NaN/.test(JSON.stringify(fallback)));
});

test('ServiceAreaLocalGuide handles malformed geo, empty corridors/landmarks/thingsToDo, and 10+ industries without NaN, heading skips, or 010. padding', () => {
  const tenIndustries = Array.from({ length: 10 }, (_, i) => `Sector ${i + 1}`);
  const html = renderToStaticMarkup(
    React.createElement(ServiceAreaLocalGuide, {
      area: {
        name: 'Edgeville',
        slug: 'edgeville',
        description: 'Edge test city.',
        highlights: [],
        neighborhoods: [],
        marketInsight: 'Test insight.',
        geo: { latitude: 'invalid', longitude: 'bad' },
        localCopy: ['Paragraph one.'],
        keyCorridors: [],
        topIndustries: tenIndustries,
        landmarks: [],
        thingsToDo: [],
      },
    })
  );

  assert.ok(!html.includes('NaN'), 'Rendered HTML must not emit NaN for malformed geo');
  assert.ok(!html.includes('010.'), '10th industry item must render as 10., not 010.');
  assert.ok(html.includes('10.'), '10th industry item must render as 10.');
  assert.ok(html.includes('data-testid="local-guide-empty-state"'), 'Empty landmarks & thingsToDo must render fallback message');

  const headingLevels = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number.parseInt(m[1], 10));
  for (let i = 1; i < headingLevels.length; i++) {
    assert.ok(
      headingLevels[i] <= headingLevels[i - 1] + 1,
      `Heading skip detected in ServiceAreaLocalGuide: h${headingLevels[i - 1]} -> h${headingLevels[i]}`
    );
  }
});

test('public/llms.txt and public/llms-full.txt match generator output with zero banned strings or .html links', () => {
  const manifest = generateLlmsManifest();
  const corpus = generateLlmsFullCorpus();

  assert.equal(fs.readFileSync(path.join(PUBLIC_DIR, 'llms.txt'), 'utf8'), manifest);
  assert.equal(fs.readFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), 'utf8'), corpus);
  for (const [name, txt] of [
    ['llms.txt', manifest],
    ['llms-full.txt', corpus],
  ]) {
    assert.ok(!/24\/7|twenty-four hours|[【】\u200b]/i.test(txt), `Banned token in ${name}`);
    assert.ok(!/\.html\b/i.test(txt), `Unexpected .html URL in ${name}`);
  }
});
