import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { BLOG_POSTS, BlogPostItem } from '../src/data/siteData';

const PROJECT_ROOT = '/Users/danielarrieta/Downloads/Projects/South Florida Cleaning Concepts';
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

console.log('======================================================================');
console.log('  CHALLENGER 1: MILRESTONE 1 EMPIRICAL DEEP-DIVE AUDIT & STRESS HARNESS');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;
const failures: Array<{ testName: string; error: string }> = [];

function recordPass(testName: string, details = '') {
  passCount++;
  console.log(`  [PASS] ${testName}${details ? ` -> ${details}` : ''}`);
}

function recordFail(testName: string, error: string) {
  failCount++;
  failures.push({ testName, error });
  console.error(`  [FAIL] ${testName} -> ${error}`);
}

// ----------------------------------------------------------------------
// 1. Audit BLOG_POSTS in src/data/siteData.ts
// ----------------------------------------------------------------------
console.log('--- TEST GROUP 1: BLOG_POSTS Ingestion & Schema Completeness ---');

try {
  assert(Array.isArray(BLOG_POSTS), 'BLOG_POSTS is not an array');
  assert.strictEqual(BLOG_POSTS.length, 11, `Expected 11 blog posts, found ${BLOG_POSTS.length}`);
  recordPass('Catalog Size', `Exactly 11 articles present in siteData.ts`);

  let totalSections = 0;
  let totalWords = 0;

  BLOG_POSTS.forEach((post: BlogPostItem, index: number) => {
    // 1. Title
    assert(post.title && typeof post.title === 'string' && post.title.trim().length > 0, `Post #${index} missing title`);

    // 2. Slug
    assert(post.slug && typeof post.slug === 'string' && post.slug.trim().length > 0, `Post #${index} missing slug`);

    // 3. Summary / Excerpt
    assert(post.summary && typeof post.summary === 'string' && post.summary.trim().length > 0, `Post '${post.slug}' missing summary`);

    // 4. Date
    assert(post.date && typeof post.date === 'string' && post.date.trim().length > 0, `Post '${post.slug}' missing date`);

    // 5. ReadTime
    assert(post.readTime && typeof post.readTime === 'string' && post.readTime.trim().length > 0, `Post '${post.slug}' missing readTime`);

    // 6. Category
    assert(post.category && typeof post.category === 'string' && post.category.trim().length > 0, `Post '${post.slug}' missing category`);

    // 7. Featured Image
    assert(post.image && typeof post.image === 'string' && post.image.trim().length > 0, `Post '${post.slug}' missing image`);
    const featuredDiskPath = path.join(PUBLIC_DIR, post.image.startsWith('/') ? post.image.slice(1) : post.image);
    assert(fs.existsSync(featuredDiskPath), `Featured image does not exist on disk: ${featuredDiskPath} for '${post.slug}'`);
    const featuredStat = fs.statSync(featuredDiskPath);
    assert(featuredStat.size > 0, `Featured image has 0 bytes: ${featuredDiskPath}`);

    // 8. Inline Secondary Image
    assert(post.inlineImage && typeof post.inlineImage === 'string' && post.inlineImage.trim().length > 0, `Post '${post.slug}' missing inlineImage`);
    const inlineDiskPath = path.join(PUBLIC_DIR, post.inlineImage.startsWith('/') ? post.inlineImage.slice(1) : post.inlineImage);
    assert(fs.existsSync(inlineDiskPath), `Inline image does not exist on disk: ${inlineDiskPath} for '${post.slug}'`);
    const inlineStat = fs.statSync(inlineDiskPath);
    assert(inlineStat.size > 0, `Inline image has 0 bytes: ${inlineDiskPath}`);

    // 9. Sections count (Must be >= 8)
    assert(Array.isArray(post.sections), `Post '${post.slug}' sections is not an array`);
    assert(post.sections.length >= 8, `Post '${post.slug}' has only ${post.sections.length} sections (requires >= 8)`);

    // 10. Heading & Text in each section (paragraphs or bullets)
    let postWords = post.summary.split(/\s+/).length;
    post.sections.forEach((sec, sIdx) => {
      assert(sec.heading && sec.heading.trim().length > 0, `Post '${post.slug}' section #${sIdx} missing heading`);
      const hasParagraphs = Array.isArray(sec.paragraphs) && sec.paragraphs.length > 0;
      const hasBullets = Array.isArray(sec.bullets) && sec.bullets.length > 0;
      assert(hasParagraphs || hasBullets, `Post '${post.slug}' section #${sIdx} missing both paragraphs and bullets`);
      
      if (hasParagraphs) {
        sec.paragraphs.forEach(p => {
          assert(p && p.trim().length > 0, `Empty paragraph in post '${post.slug}' section #${sIdx}`);
          postWords += p.split(/\s+/).length;
        });
      }
      if (hasBullets) {
        sec.bullets!.forEach(b => {
          assert(b && b.trim().length > 0, `Empty bullet in post '${post.slug}' section #${sIdx}`);
          postWords += b.split(/\s+/).length;
        });
      }
    });

    totalSections += post.sections.length;
    totalWords += postWords;

    recordPass(`Post [${index + 1}/11] '${post.slug}'`, `${post.sections.length} sections, ~${postWords} words, Date: ${post.date}, Featured: ${featuredStat.size}B, Inline: ${inlineStat.size}B`);
  });

  recordPass('Catalog Total Section & Word Depth', `Total sections: ${totalSections} (avg ${(totalSections / 11).toFixed(1)}/post), Total words: ~${totalWords}`);
} catch (err: any) {
  recordFail('BLOG_POSTS Ingestion & Schema Completeness', err.message);
}

// ----------------------------------------------------------------------
// 2. Audit Static blog/*.html Files Parity
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: Static blog/*.html Parity & Inline Figures ---');

try {
  const blogDir = path.join(PROJECT_ROOT, 'blog');
  const blogHtmlFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  assert.strictEqual(blogHtmlFiles.length, 11, `Expected 11 HTML files in blog/, found ${blogHtmlFiles.length}`);

  for (const file of blogHtmlFiles) {
    const slug = file.replace('.html', '');
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check inline figure markup
    assert(content.includes('class="article-inline-media"'), `Missing class="article-inline-media" in blog/${file}`);
    assert(content.includes('loading="lazy"'), `Missing loading="lazy" in blog/${file}`);

    // Extract inline image src
    const imgMatch = content.match(/<figure[^>]*class="[^"]*article-inline-media[^"]*"[^>]*>\s*<img[^>]+src="([^"]+)"/i);
    assert(imgMatch, `Could not extract inline image from figure in blog/${file}`);
    const src = imgMatch[1];
    const diskPath = path.join(PUBLIC_DIR, src.startsWith('/') ? src.slice(1) : src);
    assert(fs.existsSync(diskPath), `Inline image referenced in blog/${file} missing on disk: ${diskPath}`);
    const stat = fs.statSync(diskPath);
    assert(stat.size > 0, `Inline image in blog/${file} has 0 bytes`);

    // Verify post exists in BLOG_POSTS matching slug
    const matchingPost = BLOG_POSTS.find(p => p.slug === slug);
    assert(matchingPost, `No matching BLOG_POSTS entry for blog/${file}`);
    assert.strictEqual(matchingPost.inlineImage, src, `Inline image src mismatch between siteData.ts and blog/${file}`);

    recordPass(`Static Parity: blog/${file}`, `Matches siteData.ts slug and on-disk image (${stat.size} bytes)`);
  }
} catch (err: any) {
  recordFail('Static blog/*.html Parity & Inline Figures', err.message);
}

// ----------------------------------------------------------------------
// 3. Audit dist/index.html Prerendered Homepage Blog Snippet
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: dist/index.html Homepage Recent Blog Snippet ---');

try {
  const distIndexPath = path.join(DIST_DIR, 'index.html');
  assert(fs.existsSync(distIndexPath), 'dist/index.html does not exist');
  const distIndexHtml = fs.readFileSync(distIndexPath, 'utf8');

  // Verify section and ARIA attributes
  assert(distIndexHtml.includes('aria-labelledby="home-blog-heading"'), 'Missing aria-labelledby="home-blog-heading"');
  assert(distIndexHtml.includes('id="home-blog-heading"'), 'Missing id="home-blog-heading"');
  assert(distIndexHtml.includes('From Our Cleaning Journal'), 'Missing eyebrow "From Our Cleaning Journal"');
  assert(distIndexHtml.includes('Expert Cleaning Insights'), 'Missing heading "Expert Cleaning Insights"');
  recordPass('Semantic Container & Headings', 'Accessible semantic section with ARIA labels and kicker');

  // Verify "View All Articles" CTA
  const hasViewAllLink = distIndexHtml.includes('href="/our-publications"') && distIndexHtml.includes('View All Articles');
  assert(hasViewAllLink, 'Missing or broken View All Articles CTA pointing to /our-publications');
  recordPass('View All Articles CTA', 'Directly targets /our-publications');

  // Extract article cards inside the blog snippet
  const snippetSectionMatch = distIndexHtml.match(/<section[^>]*aria-labelledby="home-blog-heading"[\s\S]*?<\/section>/i);
  assert(snippetSectionMatch, 'Could not isolate blog snippet section in dist/index.html');
  const snippetHtml = snippetSectionMatch[0];

  const cardMatches = [...snippetHtml.matchAll(/<article[^>]*>[\s\S]*?<\/article>/gi)];
  assert.strictEqual(cardMatches.length, 3, `Expected exactly 3 article cards in home snippet, found ${cardMatches.length}`);
  recordPass('Article Card Count in dist/index.html', `Exactly 3 recent article cards rendered`);

  // Verify cards link to valid blog routes
  const expectedRecentSlugs = BLOG_POSTS.slice(0, 3).map(p => p.slug);
  expectedRecentSlugs.forEach((slug, idx) => {
    const expectedHref = `/blog/${slug}`;
    assert(snippetHtml.includes(`href="${expectedHref}"`), `Card #${idx + 1} does not link to ${expectedHref}`);

    // Verify static prerendered file exists in dist/blog/<slug>/index.html OR dist/blog/<slug>.html
    const file1 = path.join(DIST_DIR, 'blog', slug, 'index.html');
    const file2 = path.join(DIST_DIR, 'blog', `${slug}.html`);
    assert(fs.existsSync(file1) || fs.existsSync(file2), `Target blog prerender file not found in dist for slug ${slug}`);
    recordPass(`Card [${idx + 1}/3] Link Target: ${expectedHref}`, `Target static prerender file exists in dist/`);
  });
} catch (err: any) {
  recordFail('dist/index.html Homepage Recent Blog Snippet', err.message);
}

// ----------------------------------------------------------------------
// 4. Audit React Component Source Code Quality
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 4: React Component Source Architecture ---');

try {
  // RecentBlogPosts.tsx
  const recentBlogCompPath = path.join(PROJECT_ROOT, 'src/components/ui/RecentBlogPosts.tsx');
  assert(fs.existsSync(recentBlogCompPath), 'src/components/ui/RecentBlogPosts.tsx missing');
  const recentBlogContent = fs.readFileSync(recentBlogCompPath, 'utf8');

  assert(recentBlogContent.includes('export interface RecentBlogPostsProps'), 'Missing RecentBlogPostsProps');
  assert(recentBlogContent.includes('limit?: number;'), 'Missing limit prop');
  assert(recentBlogContent.includes('BLOG_POSTS.slice(0, limit)'), 'Missing BLOG_POSTS slicing');
  assert(recentBlogContent.includes('to="/our-publications"'), 'Missing link to /our-publications');
  assert(recentBlogContent.includes('to={`/blog/${post.slug}`}'), 'Missing dynamic link to /blog/:slug');
  assert(recentBlogContent.includes('loading="lazy"'), 'Images lack lazy loading');
  recordPass('RecentBlogPosts.tsx Props & Implementation', 'Configurable limit, clean routing, lazy loading');

  // HomePage.tsx integration
  const homePagePath = path.join(PROJECT_ROOT, 'src/pages/HomePage.tsx');
  const homePageContent = fs.readFileSync(homePagePath, 'utf8');
  assert(homePageContent.includes("import { RecentBlogPosts } from '../components/ui/RecentBlogPosts';"), 'HomePage.tsx missing import');
  assert(homePageContent.includes('<RecentBlogPosts />'), 'HomePage.tsx missing <RecentBlogPosts /> component');
  recordPass('HomePage.tsx Integration', 'Component cleanly mounted in homepage layout');

  // BlogPostPage.tsx inline image insertion
  const blogPostPath = path.join(PROJECT_ROOT, 'src/pages/BlogPostPage.tsx');
  const blogPostContent = fs.readFileSync(blogPostPath, 'utf8');
  assert(blogPostContent.includes('post.inlineImage'), 'BlogPostPage.tsx does not check post.inlineImage');
  assert(blogPostContent.includes('figure'), 'BlogPostPage.tsx does not render figure for inline image');
  recordPass('BlogPostPage.tsx Inline Media', 'Conditionally embeds post.inlineImage inside body flow');
} catch (err: any) {
  recordFail('React Component Source Architecture', err.message);
}

// ----------------------------------------------------------------------
// 5. Prerender Route Completeness for Blog Pages
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 5: Static Route Prerendering Output in dist/ ---');

const EXACT_BLOG_H1_MAP: Record<string, string> = {
  'revitalize-your-office-space': 'Revitalize Your Office Space with South Florida Cleaning Concepts',
  'post-construction-cleaning-guide': 'Post-Construction Cleaning with South Florida Cleaning Concepts',
  'office-cleaning-made-easy': 'Office Cleaning Made Easy with South Florida Cleaning Concepts',
  'medical-office-cleaning-guide': 'Medical Office Cleaning with South Florida Cleaning Concepts',
  'restaurant-and-bar-cleaning-services': 'Shining a Light on Clean: How Restaurant and Bar Cleaning Services Enhance Your Business',
  'residential-cleaning-services-journey': 'A Journey with South Florida Cleaning Concepts',
  'complete-guide-to-home-cleaning': 'Complete Guide to Home Cleaning Tips and Tricks',
  'deep-cleaning-for-homes-and-offices': 'Deep Cleaning for Homes and Offices',
  'south-florida-home-maintenance-services': 'South Florida Home Maintenance Services',
  'high-quality-cleaning-services-south-florida': 'High-Quality Cleaning Services South Florida',
  'short-term-rental-cleaning-guide': 'Short Term Rental Cleaning with South Florida Cleaning Concepts',
};

try {
  for (const post of BLOG_POSTS) {
    const file1 = path.join(DIST_DIR, 'blog', post.slug, 'index.html');
    const file2 = path.join(DIST_DIR, 'blog', `${post.slug}.html`);
    const exists = fs.existsSync(file1) || fs.existsSync(file2);
    assert(exists, `Prerendered output missing for blog post: ${post.slug}`);
    
    const targetFile = fs.existsSync(file1) ? file1 : file2;
    const content = fs.readFileSync(targetFile, 'utf8');
    const keyPhrase = EXACT_BLOG_H1_MAP[post.slug] || post.title;
    assert(content.includes(keyPhrase), `Prerendered HTML for ${post.slug} missing key phrase '${keyPhrase}'`);
    assert(content.length > 5000, `Prerendered HTML for ${post.slug} suspiciously small (${content.length} bytes)`);
    recordPass(`Prerender Output: /blog/${post.slug}`, `${content.length} bytes, key phrase '${keyPhrase}' verified`);
  }
} catch (err: any) {
  recordFail('Static Route Prerendering Output', err.message);
}

// ----------------------------------------------------------------------
// SUMMARY
// ----------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`  AUDIT COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================');

if (failCount > 0) {
  console.error('\nFailures summary:');
  for (const f of failures) {
    console.error(`- ${f.testName}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('\nAll empirical challenger assertions satisfied with 100% success!');
  process.exit(0);
}
