import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {
  BUSINESS_NAP,
  PROMO_VIDEOS,
  LEGACY_WP_POST_SLUGS,
  BLOG_POSTS,
  SERVICES_CATALOG,
  CLIENT_TESTIMONIALS,
  FAQS_LIST,
} from '../data/siteData';

const PROJECT_ROOT = process.cwd();

test('all 4 scraped source promo videos and posters exist locally as valid MP4/image assets', () => {
  assert.equal(PROMO_VIDEOS.length, 4, 'Expected all 4 source MP4 videos in PROMO_VIDEOS');

  const expectedVideoPaths = [
    '/assets/videos/promo-video-1.mp4',
    '/assets/videos/promo-video-2.mp4',
    '/assets/videos/main-home-video-1.mp4',
    '/assets/videos/bg_video.mp4',
  ];

  for (const expectedSrc of expectedVideoPaths) {
    assert.ok(
      PROMO_VIDEOS.some((v) => v.src === expectedSrc),
      `Missing ${expectedSrc} in PROMO_VIDEOS`
    );
  }

  for (const video of PROMO_VIDEOS) {
    const localVideoFile = path.join(PROJECT_ROOT, 'public', video.src.replace(/^\//, ''));
    assert.ok(fs.existsSync(localVideoFile), `Video file missing on disk: ${localVideoFile}`);

    const stats = fs.statSync(localVideoFile);
    assert.ok(
      stats.size > 2_000_000,
      `Expected ${video.src} to be > 2MB authentic MP4 video, got ${stats.size} bytes`
    );

    // Verify ISO Base Media / MP4 ftyp header signature (bytes 4..8 === 'ftyp')
    const fd = fs.openSync(localVideoFile, 'r');
    const header = Buffer.alloc(12);
    fs.readSync(fd, header, 0, 12, 0);
    fs.closeSync(fd);
    assert.equal(
      header.subarray(4, 8).toString('ascii'),
      'ftyp',
      `Invalid MP4 container header for ${video.src}`
    );

    // Verify local poster exists and is non-empty
    const localPosterFile = path.join(PROJECT_ROOT, 'public', video.poster.replace(/^\//, ''));
    assert.ok(fs.existsSync(localPosterFile), `Poster file missing on disk: ${localPosterFile}`);
    assert.ok(fs.statSync(localPosterFile).size > 10_000, `Poster file unexpectedly small: ${video.poster}`);
  }
});

test('all 11 legacy WordPress root post slugs map to valid BLOG_POSTS targets', () => {
  const legacyEntries = Object.entries(LEGACY_WP_POST_SLUGS);
  assert.equal(legacyEntries.length, 11, 'Expected all 11 legacy WordPress blog post slugs');
  assert.equal(BLOG_POSTS.length, 11, 'Expected all 11 blog posts in BLOG_POSTS');

  const validBlogSlugs = new Set(BLOG_POSTS.map((p) => p.slug));
  const mappedTargets = new Set<string>();

  for (const [legacySlug, targetSlug] of legacyEntries) {
    assert.ok(!legacySlug.startsWith('/'), `Legacy slug should not start with /: ${legacySlug}`);
    assert.ok(
      validBlogSlugs.has(targetSlug),
      `Legacy slug "${legacySlug}" maps to unknown blog post "${targetSlug}"`
    );
    mappedTargets.add(targetSlug);
  }

  assert.equal(mappedTargets.size, 11, 'Every one of the 11 blog posts must have its legacy WP slug mapped');
});

test('zero-data-loss business NAP, Facebook profile, 12% website offer, hiring, and 4 source testimonials exist', () => {
  assert.equal(BUSINESS_NAP.facebookUrl, 'https://www.facebook.com/SFCLEAN');
  assert.match(BUSINESS_NAP.websiteDiscountHeadline, /12%/);
  assert.equal(BUSINESS_NAP.ratingScore, '4.8');
  assert.match(BUSINESS_NAP.careersHeadline, /Hiring/i);

  const requiredAuthors = [
    'Lindsey J. Crowley',
    'Adrian James',
    'Una Walker',
    'Sonia Paige',
  ];
  for (const author of requiredAuthors) {
    assert.ok(
      CLIENT_TESTIMONIALS.some((t) => t.author === author),
      `Missing authentic source testimonial author: ${author}`
    );
  }

  assert.ok(
    FAQS_LIST.some((f) => /12%/.test(f.answer)),
    'Expected FAQS_LIST to document the 12% website booking discount'
  );
});

test('all 10 source services are preserved with Home Maintenance exterior add-ons & Home Watching refrigeration checks', () => {
  assert.equal(SERVICES_CATALOG.length, 10);

  const homeMaint = SERVICES_CATALOG.find((s) => s.slug === 'home-maintenance');
  assert.ok(homeMaint, 'Missing home-maintenance service');
  const homeMaintBlob = JSON.stringify(homeMaint).toLowerCase();
  assert.ok(homeMaintBlob.includes('pressure washing'), 'Missing pressure washing detail in home-maintenance');
  assert.ok(homeMaintBlob.includes('window cleaning'), 'Missing window cleaning detail in home-maintenance');
  assert.ok(homeMaintBlob.includes('gutter'), 'Missing gutter care detail in home-maintenance');

  const homeWatch = SERVICES_CATALOG.find((s) => s.slug === 'home-watching');
  assert.ok(homeWatch, 'Missing home-watching service');
  const homeWatchBlob = JSON.stringify(homeWatch).toLowerCase();
  assert.ok(homeWatchBlob.includes('refrigerat') && homeWatchBlob.includes('freezer'), 'Missing refrigerator/freezer monitoring in home-watching');
});

test('user constraint preserved: zero 24/7 or twenty-four hours commercial claims across data and llms files', () => {
  const filesToAudit = [
    'src/data/siteData.ts',
    'src/data/serviceAreas.ts',
    'src/data/serviceAreaGuideData.ts',
    'src/data/seoRegistry.ts',
    'src/data/blogSchemaData.ts',
    'public/llms.txt',
    'public/llms-full.txt',
  ];
  for (const relPath of filesToAudit) {
    const raw = fs.readFileSync(path.join(PROJECT_ROOT, relPath), 'utf8');
    assert.ok(!/24\/7/i.test(raw), `Found banned 24/7 string in ${relPath}`);
    assert.ok(!/twenty-four hours/i.test(raw), `Found banned twenty-four hours string in ${relPath}`);
    assert.ok(!/[【】\u200b]/.test(raw), `Found raw scrape citation or zero-width artifact in ${relPath}`);
  }
});

test('js/main.js and public/js/main.js stay identical and skip listener registration when [data-react-managed="true"] exists', () => {
  const jsMain = fs.readFileSync(path.join(PROJECT_ROOT, 'js/main.js'), 'utf8');
  const pubMain = fs.readFileSync(path.join(PROJECT_ROOT, 'public/js/main.js'), 'utf8');
  assert.equal(jsMain, pubMain, 'js/main.js and public/js/main.js must remain identical');

  let attached = 0;
  const noopEl = {
    getAttribute: () => 'true',
    addEventListener: () => {
      attached++;
    },
    querySelector: () => null,
    querySelectorAll: () => [],
  };

  vm.runInNewContext(pubMain, {
    document: {
      readyState: 'complete',
      body: { style: { overflow: '' } },
      querySelector: (selector: string) => (selector === '[data-react-managed="true"]' ? noopEl : null),
      querySelectorAll: () => [],
      getElementById: () => noopEl,
      addEventListener: () => {
        attached++;
      },
    },
    window: { location: { pathname: '/', search: '' } },
    FormData: class {},
    URLSearchParams,
  });

  assert.equal(attached, 0, 'Legacy main.js must not attach listeners when React manages the DOM');
});
