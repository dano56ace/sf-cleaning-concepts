// @ts-check
import fs from 'node:fs';
import path from 'node:path';

const PROJECT_ROOT = '/Users/danielarrieta/Downloads/Projects/South Florida Cleaning Concepts';
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// Canonical list of all 28 pages + 404.html
const CANONICAL_PAGES = [
  'index.html',
  'about-us.html',
  'our-services.html',
  'contact-us.html',
  'faqs.html',
  'our-publications.html',
  'service/index.html',
  'service/office-cleaning.html',
  'service/medical-office-cleaning.html',
  'service/bars-and-restaurant-cleaning.html',
  'service/school-cleaning.html',
  'service/post-construction-cleaning.html',
  'service/covid-19-disinfection.html',
  'service/move-in-out-cleaning.html',
  'service/short-term-rentals.html',
  'service/home-maintenance.html',
  'service/home-watching.html',
  'blog/complete-guide-to-home-cleaning.html',
  'blog/deep-cleaning-for-homes-and-offices.html',
  'blog/high-quality-cleaning-services-south-florida.html',
  'blog/medical-office-cleaning-guide.html',
  'blog/office-cleaning-made-easy.html',
  'blog/post-construction-cleaning-guide.html',
  'blog/residential-cleaning-services-journey.html',
  'blog/restaurant-and-bar-cleaning-services.html',
  'blog/revitalize-your-office-space.html',
  'blog/short-term-rental-cleaning-guide.html',
  'blog/south-florida-home-maintenance-services.html',
  '404.html'
];

// Results accumulator
const results = {
  summary: {
    totalPagesChecked: 0,
    schemaBlocksFound: 0,
    strictJsonParseErrors: 0,
    trailingCommasDetected: 0,
    htmlEntitiesInJsonDetected: 0,
    schemaSemanticErrors: 0,
    napMismatches: 0,
    breadcrumbErrors: 0,
    imageAssetMissingErrors: 0,
    idReferenceErrors: 0,
  },
  perFile: {},
  imagesChecked: {},
  napEntries: [],
  failures: []
};

function recordFailure(file, category, message, snippet = null) {
  const failure = { file, category, message, snippet };
  results.failures.push(failure);
  if (category === 'JSON_SYNTAX') results.summary.strictJsonParseErrors++;
  if (category === 'TRAILING_COMMA') results.summary.trailingCommasDetected++;
  if (category === 'HTML_ENTITY') results.summary.htmlEntitiesInJsonDetected++;
  if (category === 'SCHEMA_SEMANTIC') results.summary.schemaSemanticErrors++;
  if (category === 'NAP_CONSISTENCY') results.summary.napMismatches++;
  if (category === 'BREADCRUMB') results.summary.breadcrumbErrors++;
  if (category === 'IMAGE_ASSET') results.summary.imageAssetMissingErrors++;
  if (category === 'ID_REFERENCE') results.summary.idReferenceErrors++;
}

// 1. Image Resolver: map web URL or relative path to local disk
function resolveLocalImage(imgUrl) {
  let cleanPath = imgUrl;
  if (cleanPath.startsWith('https://sfcleaningconcepts.com/')) {
    cleanPath = cleanPath.replace('https://sfcleaningconcepts.com/', '/');
  } else if (cleanPath.startsWith('https://southfloridacleaningconcepts.com/')) {
    cleanPath = cleanPath.replace('https://southfloridacleaningconcepts.com/', '/');
  }

  // If path starts with /, look in public/ then project root
  const candidates = [];
  if (cleanPath.startsWith('/')) {
    const rel = cleanPath.substring(1);
    candidates.push(path.join(PUBLIC_DIR, rel));
    candidates.push(path.join(PROJECT_ROOT, rel));
  } else {
    candidates.push(path.join(PUBLIC_DIR, cleanPath));
    candidates.push(path.join(PROJECT_ROOT, cleanPath));
  }

  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      const stat = fs.statSync(cand);
      return { exists: true, path: cand, size: stat.size };
    }
  }

  return { exists: false, candidates };
}

// Recursively find all image URLs in an object
function extractImageUrls(obj, acc = []) {
  if (!obj || typeof obj !== 'object') return acc;
  if (Array.isArray(obj)) {
    for (const item of obj) extractImageUrls(item, acc);
    return acc;
  }
  for (const [key, value] of Object.entries(obj)) {
    if ((key === 'image' || key === 'logo' || key === 'contentUrl' || key === 'thumbnailUrl') && typeof value === 'string') {
      acc.push(value);
    } else if (key === 'logo' && typeof value === 'object' && value !== null && typeof value.url === 'string') {
      acc.push(value.url);
    } else if (typeof value === 'object') {
      extractImageUrls(value, acc);
    }
  }
  return acc;
}

// Recursively find all NAP occurrences in an object
function extractNap(obj, file, acc = []) {
  if (!obj || typeof obj !== 'object') return acc;
  if (Array.isArray(obj)) {
    for (const item of obj) extractNap(item, file, acc);
    return acc;
  }

  // Check if this object represents the business entity itself (either standalone or as provider/publisher/author)
  const isDirectBusiness = 
    (obj['@id'] && obj['@id'].includes('#localbusiness')) ||
    (obj.telephone || obj.email) ||
    (obj['@type'] === 'LocalBusiness' || obj['@type'] === 'CleaningService' ||
     (Array.isArray(obj['@type']) && (obj['@type'].includes('LocalBusiness') || obj['@type'].includes('CleaningService'))));

  // If this object is a Service that has a provider, the provider is the business entity
  if (obj.provider && typeof obj.provider === 'object') {
    extractNap(obj.provider, file, acc);
  }

  // If this object has a publisher, inspect publisher
  if (obj.publisher && typeof obj.publisher === 'object') {
    extractNap(obj.publisher, file, acc);
  }

  // If this is a direct business node (and not the outer Service wrapper)
  const isServiceWrapper = Array.isArray(obj['@type']) && obj['@type'].includes('Service') && obj['@type'].includes('CleaningService') && obj.serviceType;

  if (isDirectBusiness && !isServiceWrapper) {
    acc.push({
      file,
      type: obj['@type'],
      id: obj['@id'],
      name: obj.name,
      telephone: obj.telephone,
      email: obj.email,
      address: obj.address
    });
  }

  return acc;
}

// Find all entities by type in schema graph
function findEntitiesByType(root, typeName) {
  const matches = [];
  function search(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      for (const item of node) search(item);
      return;
    }
    const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    if (types.includes(typeName)) {
      matches.push(node);
    }
    for (const val of Object.values(node)) {
      if (typeof val === 'object') search(val);
    }
  }
  search(root);
  return matches;
}

// Extract all scripts matching type="application/ld+json"
function extractJsonLdBlocks(htmlContent) {
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    blocks.push({
      fullMatch: match[0],
      rawJson: match[1],
      startIndex: match.index
    });
  }
  return blocks;
}

console.log('=== ADVERSARIAL SCHEMA & SYNTAX VALIDATION HARNESS ===\n');

for (const relFile of CANONICAL_PAGES) {
  results.summary.totalPagesChecked++;
  const filePath = path.join(PROJECT_ROOT, relFile);
  const fileReport = {
    file: relFile,
    exists: fs.existsSync(filePath),
    blockCount: 0,
    blocks: []
  };
  results.perFile[relFile] = fileReport;

  if (!fileReport.exists) {
    recordFailure(relFile, 'FILE_MISSING', `File does not exist on disk: ${filePath}`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  const blocks = extractJsonLdBlocks(html);
  fileReport.blockCount = blocks.length;
  results.summary.schemaBlocksFound += blocks.length;

  if (relFile === '404.html') {
    if (blocks.length > 0) {
      console.log(`[INFO] 404.html has ${blocks.length} schema blocks (inspecting)`);
    } else {
      console.log(`[OK] 404.html correctly contains 0 Schema.org blocks (noindex error document)`);
    }
  } else {
    if (blocks.length === 0) {
      recordFailure(relFile, 'SCHEMA_SEMANTIC', 'Expected at least 1 <script type="application/ld+json"> block, found 0');
      continue;
    }
  }

  for (let idx = 0; idx < blocks.length; idx++) {
    const { rawJson } = blocks[idx];
    const blockRef = `${relFile}#block${idx + 1}`;

    // 1. Raw syntax checks: Trailing commas
    // Matches comma followed immediately by } or ] (ignoring whitespace)
    const trailingCommaRegex = /,\s*([\}\]])/g;
    let tcMatch;
    while ((tcMatch = trailingCommaRegex.exec(rawJson)) !== null) {
      const snippet = rawJson.substring(Math.max(0, tcMatch.index - 20), Math.min(rawJson.length, tcMatch.index + 20));
      recordFailure(relFile, 'TRAILING_COMMA', `Trailing comma detected before '${tcMatch[1]}' at index ${tcMatch.index}`, snippet);
    }

    // 2. HTML entities in JSON string values
    const htmlEntityRegex = /&(#?\w+);/g;
    let heMatch;
    while ((heMatch = htmlEntityRegex.exec(rawJson)) !== null) {
      const snippet = rawJson.substring(Math.max(0, heMatch.index - 20), Math.min(rawJson.length, heMatch.index + 20));
      recordFailure(relFile, 'HTML_ENTITY', `Unescaped HTML entity '${heMatch[0]}' found in JSON-LD. JSON strings should use UTF-8 characters or JSON escape sequences, not HTML entities.`, snippet);
    }

    // 3. Strict JSON.parse
    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (err) {
      recordFailure(relFile, 'JSON_SYNTAX', `Strict JSON.parse failed: ${err.message}`, rawJson.substring(0, 100));
      continue;
    }

    fileReport.blocks.push(parsed);

    // 4. Schema.org @context verification
    if (parsed['@context'] !== 'https://schema.org' && parsed['@context'] !== 'http://schema.org') {
      recordFailure(relFile, 'SCHEMA_SEMANTIC', `@context must be "https://schema.org", received: "${parsed['@context']}"`);
    }
    if (parsed['@context'] === 'http://schema.org') {
      recordFailure(relFile, 'SCHEMA_SEMANTIC', `@context should use secure HTTPS "https://schema.org", found HTTP`);
    }

    // 5. Structure verification (@graph or top-level)
    const graph = parsed['@graph'] ? parsed['@graph'] : [parsed];

    // 6. NAP Extraction and Consistency
    const napEntries = extractNap(parsed, relFile);
    results.napEntries.push(...napEntries);

    for (const nap of napEntries) {
      // Name check
      if (nap.name && !nap.name.includes('South Florida Cleaning Concepts') && !nap.name.includes('SF Cleaning Concepts')) {
        // If it's a provider or business name, it must match
        if (nap.type === 'LocalBusiness' || nap.type === 'CleaningService' || (Array.isArray(nap.type) && nap.type.includes('CleaningService'))) {
          recordFailure(relFile, 'NAP_CONSISTENCY', `Business name mismatch: expected "South Florida Cleaning Concepts", got "${nap.name}"`);
        }
      }

      // Telephone check
      if (nap.telephone) {
        // Normalized phone digits
        const digits = nap.telephone.replace(/\D/g, '');
        if (digits !== '15617045303' && digits !== '5617045303') {
          recordFailure(relFile, 'NAP_CONSISTENCY', `Invalid telephone digits in schema: "${nap.telephone}" (digits: ${digits}), expected (561) 704-5303`);
        }
      }

      // Email check
      if (nap.email) {
        if (nap.email.toLowerCase() !== 'sflcleaningco@gmail.com') {
          recordFailure(relFile, 'NAP_CONSISTENCY', `Invalid email in schema: "${nap.email}", expected Sflcleaningco@gmail.com`);
        }
      }
    }

    // 7. Image Asset Verification
    const imageUrls = extractImageUrls(parsed);
    for (const imgUrl of imageUrls) {
      if (!results.imagesChecked[imgUrl]) {
        const res = resolveLocalImage(imgUrl);
        results.imagesChecked[imgUrl] = res;
        if (!res.exists) {
          recordFailure(relFile, 'IMAGE_ASSET', `Image URL referenced in schema does not exist on disk: "${imgUrl}"`, res.candidates);
        } else if (res.size === 0) {
          recordFailure(relFile, 'IMAGE_ASSET', `Image file exists on disk but is 0 bytes (corrupted): "${imgUrl}"`);
        }
      }
    }

    // 8. BreadcrumbList Hierarchy Validation
    const breadcrumbLists = findEntitiesByType(parsed, 'BreadcrumbList');
    if (breadcrumbLists.length > 0) {
      for (const bList of breadcrumbLists) {
        if (!Array.isArray(bList.itemListElement) || bList.itemListElement.length === 0) {
          recordFailure(relFile, 'BREADCRUMB', 'BreadcrumbList contains empty or non-array itemListElement');
          continue;
        }

        const items = bList.itemListElement;
        // Verify 1-based sequential position
        for (let p = 0; p < items.length; p++) {
          const expectedPos = p + 1;
          const item = items[p];
          if (item.position !== expectedPos) {
            recordFailure(relFile, 'BREADCRUMB', `Breadcrumb position out of sequence: item[${p}] has position ${item.position}, expected ${expectedPos}`);
          }
          if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
            recordFailure(relFile, 'BREADCRUMB', `Breadcrumb item at position ${item.position} has empty or missing name`);
          }
          if (!item.item || typeof item.item !== 'string') {
            recordFailure(relFile, 'BREADCRUMB', `Breadcrumb item at position ${item.position} has missing or invalid 'item' URL`);
          }
        }

        // Pos 1 must always be Home
        if (items[0] && items[0].item !== 'https://sfcleaningconcepts.com/') {
          recordFailure(relFile, 'BREADCRUMB', `Breadcrumb position 1 item URL must be "https://sfcleaningconcepts.com/", found "${items[0].item}"`);
        }

        // Service page breadcrumbs: Home -> Services -> [Service]
        if (relFile.startsWith('service/') && relFile !== 'service/index.html') {
          if (items.length !== 3) {
            recordFailure(relFile, 'BREADCRUMB', `Service page should have exactly 3 breadcrumb items (Home > Services > Current), found ${items.length}`);
          } else {
            if (items[1].name !== 'Services') {
              recordFailure(relFile, 'BREADCRUMB', `Service page crumb 2 name expected "Services", found "${items[1].name}"`);
            }
            if (items[1].item !== 'https://sfcleaningconcepts.com/our-services.html' && items[1].item !== 'https://sfcleaningconcepts.com/service/') {
              recordFailure(relFile, 'BREADCRUMB', `Service page crumb 2 URL expected our-services.html, found "${items[1].item}"`);
            }
            const expectedCanonical = `https://sfcleaningconcepts.com/${relFile}`;
            if (items[2].item !== expectedCanonical) {
              recordFailure(relFile, 'BREADCRUMB', `Service page crumb 3 URL expected "${expectedCanonical}", found "${items[2].item}"`);
            }
          }
        }

        // Blog page breadcrumbs: Home -> Publications -> [Article]
        if (relFile.startsWith('blog/')) {
          if (items.length !== 3) {
            recordFailure(relFile, 'BREADCRUMB', `Blog article should have exactly 3 breadcrumb items (Home > Publications > Article), found ${items.length}`);
          } else {
            if (items[1].name !== 'Publications') {
              recordFailure(relFile, 'BREADCRUMB', `Blog crumb 2 name expected "Publications", found "${items[1].name}"`);
            }
            if (items[1].item !== 'https://sfcleaningconcepts.com/our-publications.html') {
              recordFailure(relFile, 'BREADCRUMB', `Blog crumb 2 URL expected our-publications.html, found "${items[1].item}"`);
            }
            const expectedCanonical = `https://sfcleaningconcepts.com/${relFile}`;
            if (items[2].item !== expectedCanonical) {
              recordFailure(relFile, 'BREADCRUMB', `Blog crumb 3 URL expected "${expectedCanonical}", found "${items[2].item}"`);
            }
          }
        }
      }
    } else {
      // Subpages require breadcrumbs
      if (relFile !== 'index.html' && relFile !== '404.html') {
        recordFailure(relFile, 'BREADCRUMB', `Missing BreadcrumbList schema on subpage: ${relFile}`);
      }
    }

    // 9. Semantic Type Specific Requirements
    // index.html: must have LocalBusiness/CleaningService + WebSite
    if (relFile === 'index.html') {
      const biz = findEntitiesByType(parsed, 'CleaningService').concat(findEntitiesByType(parsed, 'LocalBusiness'));
      if (biz.length === 0) {
        recordFailure(relFile, 'SCHEMA_SEMANTIC', 'index.html missing CleaningService / LocalBusiness entity');
      } else {
        const b = biz[0];
        if (!b.telephone) recordFailure(relFile, 'SCHEMA_SEMANTIC', 'LocalBusiness missing telephone');
        if (!b.address) recordFailure(relFile, 'SCHEMA_SEMANTIC', 'LocalBusiness missing address');
        if (!b.geo) recordFailure(relFile, 'SCHEMA_SEMANTIC', 'LocalBusiness missing geo coordinates');
        if (!b.image) recordFailure(relFile, 'SCHEMA_SEMANTIC', 'LocalBusiness missing image');
        if (!b.url) recordFailure(relFile, 'SCHEMA_SEMANTIC', 'LocalBusiness missing url');
      }
      const websites = findEntitiesByType(parsed, 'WebSite');
      if (websites.length === 0) {
        recordFailure(relFile, 'SCHEMA_SEMANTIC', 'index.html missing WebSite entity');
      }
    }

    // faqs.html: must have FAQPage with Question entities
    if (relFile === 'faqs.html') {
      const faqPages = findEntitiesByType(parsed, 'FAQPage');
      if (faqPages.length === 0) {
        recordFailure(relFile, 'SCHEMA_SEMANTIC', 'faqs.html missing FAQPage schema');
      } else {
        const faq = faqPages[0];
        if (!Array.isArray(faq.mainEntity) || faq.mainEntity.length === 0) {
          recordFailure(relFile, 'SCHEMA_SEMANTIC', 'FAQPage mainEntity missing or empty');
        } else {
          for (let qIdx = 0; qIdx < faq.mainEntity.length; qIdx++) {
            const q = faq.mainEntity[qIdx];
            if (q['@type'] !== 'Question') {
              recordFailure(relFile, 'SCHEMA_SEMANTIC', `FAQ item ${qIdx} @type is not Question`);
            }
            if (!q.name) {
              recordFailure(relFile, 'SCHEMA_SEMANTIC', `FAQ Question ${qIdx} missing question name`);
            }
            if (!q.acceptedAnswer || q.acceptedAnswer['@type'] !== 'Answer' || !q.acceptedAnswer.text) {
              recordFailure(relFile, 'SCHEMA_SEMANTIC', `FAQ Question ${qIdx} missing valid acceptedAnswer`);
            }
          }
        }
      }
    }

    // service/*.html: must have Service schema
    if (relFile.startsWith('service/') && relFile !== 'service/index.html') {
      const services = findEntitiesByType(parsed, 'Service');
      if (services.length === 0) {
        recordFailure(relFile, 'SCHEMA_SEMANTIC', `Service page missing Service schema: ${relFile}`);
      } else {
        const s = services[0];
        if (!s.name) recordFailure(relFile, 'SCHEMA_SEMANTIC', `Service schema missing name in ${relFile}`);
        if (!s.description) recordFailure(relFile, 'SCHEMA_SEMANTIC', `Service schema missing description in ${relFile}`);
        if (!s.provider) recordFailure(relFile, 'SCHEMA_SEMANTIC', `Service schema missing provider in ${relFile}`);
      }
    }

    // blog/*.html: must have BlogPosting / Article schema
    if (relFile.startsWith('blog/')) {
      const posts = findEntitiesByType(parsed, 'BlogPosting').concat(findEntitiesByType(parsed, 'Article'));
      if (posts.length === 0) {
        recordFailure(relFile, 'SCHEMA_SEMANTIC', `Blog article missing BlogPosting / Article schema: ${relFile}`);
      } else {
        const p = posts[0];
        if (!p.headline) recordFailure(relFile, 'SCHEMA_SEMANTIC', `BlogPosting missing headline in ${relFile}`);
        if (!p.datePublished) recordFailure(relFile, 'SCHEMA_SEMANTIC', `BlogPosting missing datePublished in ${relFile}`);
        if (!p.author) recordFailure(relFile, 'SCHEMA_SEMANTIC', `BlogPosting missing author in ${relFile}`);
        if (!p.publisher) recordFailure(relFile, 'SCHEMA_SEMANTIC', `BlogPosting missing publisher in ${relFile}`);
        if (!p.image) recordFailure(relFile, 'SCHEMA_SEMANTIC', `BlogPosting missing image in ${relFile}`);
        if (!p.mainEntityOfPage) recordFailure(relFile, 'SCHEMA_SEMANTIC', `BlogPosting missing mainEntityOfPage in ${relFile}`);
      }
    }
  }
}

// Print detailed findings
console.log('--- VALIDATION SUMMARY ---');
console.log(`Total Pages Inspected:        ${results.summary.totalPagesChecked}`);
console.log(`Total Schema Blocks Extracted: ${results.summary.schemaBlocksFound}`);
console.log(`Strict JSON Syntax Errors:    ${results.summary.strictJsonParseErrors}`);
console.log(`Trailing Commas Detected:     ${results.summary.trailingCommasDetected}`);
console.log(`HTML Entities in JSON Values: ${results.summary.htmlEntitiesInJsonDetected}`);
console.log(`Schema.org Semantic Errors:   ${results.summary.schemaSemanticErrors}`);
console.log(`NAP Inconsistencies:          ${results.summary.napMismatches}`);
console.log(`Breadcrumb Hierarchy Errors:  ${results.summary.breadcrumbErrors}`);
console.log(`Image Assets Missing on Disk: ${results.summary.imageAssetMissingErrors}`);
console.log(`Total Failures Recorded:      ${results.failures.length}\n`);

if (results.failures.length > 0) {
  console.log('--- DETAILED FAILURES ---');
  for (const f of results.failures) {
    console.log(`[${f.category}] ${f.file}: ${f.message}`);
    if (f.snippet) console.log(`   Snippet: ${JSON.stringify(f.snippet)}`);
  }
} else {
  console.log('ALL TESTS PASSED WITH ZERO ERRORS!');
}

// Write results to tests/adversarial-schema-results.json
fs.writeFileSync(path.join(PROJECT_ROOT, 'tests/adversarial-schema-results.json'), JSON.stringify(results, null, 2));
console.log('\nFull results saved to tests/adversarial-schema-results.json');
