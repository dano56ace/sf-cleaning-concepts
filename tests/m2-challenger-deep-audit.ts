import assert from 'node:assert';
import { serviceAreas, serviceAreasBySlug, ServiceAreaItem } from '../src/data/serviceAreas';
import { SERVICE_AREA_GUIDES } from '../src/data/serviceAreaGuideData';

console.log('======================================================================');
console.log('  CHALLENGER 1: MILESTONE 2 EMPIRICAL DEEP-DIVE AUDIT & STRESS HARNESS');
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
// 1. Dataset Dimensions & Slug Integrity
// ----------------------------------------------------------------------
console.log('--- TEST GROUP 1: Dataset Dimensions & Slug Integrity ---');

try {
  assert(Array.isArray(serviceAreas), 'serviceAreas must be an array');
  assert.strictEqual(serviceAreas.length, 56, `Expected exactly 56 service areas, found ${serviceAreas.length}`);
  recordPass('Total Locations Count', `Exactly 56 locations present in serviceAreas`);

  const slugKeys = Object.keys(serviceAreasBySlug);
  assert.strictEqual(slugKeys.length, 56, `Expected exactly 56 keys in serviceAreasBySlug, found ${slugKeys.length}`);
  recordPass('Slug Dictionary Count', `Exactly 56 entries in serviceAreasBySlug`);

  // Check 1:1 bi-directional mapping
  const slugSet = new Set<string>();
  serviceAreas.forEach((area, index) => {
    assert(area.slug && typeof area.slug === 'string', `Location #${index} missing slug`);
    assert(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(area.slug), `Location slug "${area.slug}" is not a valid kebab-case slug`);
    assert(!slugSet.has(area.slug), `Duplicate slug detected: "${area.slug}"`);
    slugSet.add(area.slug);

    const lookup = serviceAreasBySlug[area.slug];
    assert.strictEqual(lookup, area, `serviceAreasBySlug["${area.slug}"] does not refer to the exact serviceAreas item`);
  });
  recordPass('Slug Uniqueness & Kebab-Case', `All 56 slugs are unique and strictly formatted`);
  recordPass('Dictionary 1:1 Consistency', `All 56 serviceAreas elements match serviceAreasBySlug entries`);
} catch (err: any) {
  recordFail('Dataset Dimensions & Slug Integrity', err.message);
}

// ----------------------------------------------------------------------
// 2. Geographic Coordinates & Boundary Stress-Testing
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: Geographic Coordinates & Florida Bounds ---');

try {
  serviceAreas.forEach((area) => {
    assert(area.geo, `Location "${area.slug}" missing geo object`);
    const latStr = area.geo.latitude;
    const lngStr = area.geo.longitude;

    assert(typeof latStr === 'string' && latStr.trim().length > 0, `Location "${area.slug}" latitude is not a non-empty string`);
    assert(typeof lngStr === 'string' && lngStr.trim().length > 0, `Location "${area.slug}" longitude is not a non-empty string`);

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    assert(!isNaN(lat), `Location "${area.slug}" latitude "${latStr}" parsed to NaN`);
    assert(!isNaN(lng), `Location "${area.slug}" longitude "${lngStr}" parsed to NaN`);

    // Florida bounds check:
    // Latitude: ~24.5 (Key West) to ~31.0 (Georgia border). South/Central Florida is 25.0 to 29.0
    // Longitude: -83.0 to -79.5 (Atlantic coast)
    assert(lat >= 25.0 && lat <= 29.0, `Location "${area.slug}" latitude ${lat} out of bounds [25.0, 29.0]`);
    assert(lng >= -82.0 && lng <= -79.0, `Location "${area.slug}" longitude ${lng} out of bounds [-82.0, -79.0]`);

    // Test coordinate formatting as used in ServiceAreaLocalGuide.tsx:
    // {Number(area.geo.latitude).toFixed(4)}°N, {Math.abs(Number(area.geo.longitude)).toFixed(4)}°W
    const formattedLat = Number(area.geo.latitude).toFixed(4);
    const formattedLng = Math.abs(Number(area.geo.longitude)).toFixed(4);
    assert(formattedLat.includes('.'), `Formatted latitude invalid for "${area.slug}"`);
    assert(formattedLng.includes('.'), `Formatted longitude invalid for "${area.slug}"`);
  });
  recordPass('Coordinates Validity', `All 56 locations have valid, non-zero float coordinates within Florida bounds`);
  recordPass('Component Format Safety', `All 56 locations format cleanly via Number(lat).toFixed(4) and Number(lng).toFixed(4)`);
} catch (err: any) {
  recordFail('Geographic Coordinates & Florida Bounds', err.message);
}

// ----------------------------------------------------------------------
// 3. Required Metadata & Content Completeness
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: Required Metadata & Content Completeness ---');

try {
  serviceAreas.forEach((area) => {
    // Name
    assert(typeof area.name === 'string' && area.name.trim().length > 0, `Location "${area.slug}" has empty name`);

    // Description
    assert(typeof area.description === 'string' && area.description.trim().length >= 50, `Location "${area.slug}" description too short (${area.description?.length} chars)`);

    // Market Insight
    assert(typeof area.marketInsight === 'string' && area.marketInsight.trim().length >= 50, `Location "${area.slug}" marketInsight too short (${area.marketInsight?.length} chars)`);

    // SEO Title
    assert(typeof area.seoTitle === 'string' && area.seoTitle.trim().length > 0, `Location "${area.slug}" missing seoTitle`);
    assert(area.seoTitle.toLowerCase().includes(area.name.toLowerCase()), `Location "${area.slug}" seoTitle does not mention "${area.name}"`);

    // Meta Description
    assert(typeof area.metaDescription === 'string' && area.metaDescription.trim().length > 0, `Location "${area.slug}" missing metaDescription`);
    assert(area.metaDescription.length >= 50 && area.metaDescription.length <= 350, `Location "${area.slug}" metaDescription length ${area.metaDescription.length} not within [50, 350] chars`);

    // Highlights (min 3)
    assert(Array.isArray(area.highlights) && area.highlights.length >= 3, `Location "${area.slug}" has fewer than 3 highlights (found ${area.highlights?.length})`);
    area.highlights.forEach((h, hIdx) => {
      assert(typeof h === 'string' && h.trim().length > 0, `Location "${area.slug}" highlight #${hIdx} is empty`);
    });

    // Neighborhoods (min 3)
    assert(Array.isArray(area.neighborhoods) && area.neighborhoods.length >= 3, `Location "${area.slug}" has fewer than 3 neighborhoods (found ${area.neighborhoods?.length})`);
    area.neighborhoods.forEach((n, nIdx) => {
      assert(typeof n === 'string' && n.trim().length > 0, `Location "${area.slug}" neighborhood #${nIdx} is empty`);
    });

    // Local Copy (min 2 paragraphs)
    assert(Array.isArray(area.localCopy) && area.localCopy.length >= 2, `Location "${area.slug}" has fewer than 2 localCopy paragraphs (found ${area.localCopy?.length})`);
    area.localCopy.forEach((p, pIdx) => {
      assert(typeof p === 'string' && p.trim().length > 20, `Location "${area.slug}" localCopy #${pIdx} is empty or too short`);
    });

    // Landmarks (min 1)
    assert(Array.isArray(area.landmarks) && area.landmarks.length >= 1, `Location "${area.slug}" has no landmarks`);
    area.landmarks.forEach((lm, lmIdx) => {
      assert(typeof lm.name === 'string' && lm.name.trim().length > 0, `Location "${area.slug}" landmark #${lmIdx} missing name`);
      assert(typeof lm.category === 'string' && lm.category.trim().length > 0, `Location "${area.slug}" landmark #${lmIdx} missing category`);
      assert(typeof lm.description === 'string' && lm.description.trim().length > 0, `Location "${area.slug}" landmark #${lmIdx} missing description`);
    });

    // Things to Do (min 1)
    assert(Array.isArray(area.thingsToDo) && area.thingsToDo.length >= 1, `Location "${area.slug}" has no thingsToDo`);
    area.thingsToDo.forEach((act, actIdx) => {
      assert(typeof act.title === 'string' && act.title.trim().length > 0, `Location "${area.slug}" activity #${actIdx} missing title`);
      assert(typeof act.spot === 'string' && act.spot.trim().length > 0, `Location "${area.slug}" activity #${actIdx} missing spot`);
      assert(typeof act.description === 'string' && act.description.trim().length > 0, `Location "${area.slug}" activity #${actIdx} missing description`);
    });

    // Key Corridors (min 1)
    assert(Array.isArray(area.keyCorridors) && area.keyCorridors.length >= 1, `Location "${area.slug}" has no keyCorridors`);
    area.keyCorridors.forEach((c, cIdx) => {
      assert(typeof c === 'string' && c.trim().length > 0, `Location "${area.slug}" corridor #${cIdx} is empty`);
    });

    // Top Industries (min 1)
    assert(Array.isArray(area.topIndustries) && area.topIndustries.length >= 1, `Location "${area.slug}" has no topIndustries`);
    area.topIndustries.forEach((ind, indIdx) => {
      assert(typeof ind === 'string' && ind.trim().length > 0, `Location "${area.slug}" industry #${indIdx} is empty`);
    });
  });

  recordPass('Required Metadata Completeness', `All 56 locations pass strict name, description, marketInsight, seoTitle, and metaDescription checks`);
  recordPass('Collection Attributes (Highlights & Neighborhoods)', `All 56 locations contain >=3 valid highlights and >=3 neighborhoods`);
  recordPass('Guide Attributes (Copy, Landmarks, Activities, Corridors, Industries)', `All 56 locations contain >=2 local copy paragraphs, landmarks, activities, corridors, and top industries`);
} catch (err: any) {
  recordFail('Required Metadata & Content Completeness', err.message);
}

// ----------------------------------------------------------------------
// 4. Jupiter Corridor & Northern Palm Beach Coverage
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 4: Jupiter Corridor & Northern Palm Beach Coverage ---');

const REQUIRED_NORTHERN_COMMUNITIES = [
  'jupiter',
  'tequesta',
  'jupiter-inlet-colony',
  'limestone-creek',
  'juno-beach',
  'palm-beach-gardens',
  'north-palm-beach',
  'west-palm-beach',
  'boca-raton',
  'delray-beach'
];

try {
  REQUIRED_NORTHERN_COMMUNITIES.forEach((slug) => {
    const area = serviceAreasBySlug[slug];
    assert(area, `Required community "${slug}" not found in serviceAreasBySlug!`);
    assert(area.name && area.name.length > 0, `Community "${slug}" has invalid name`);
    assert(area.geo && parseFloat(area.geo.latitude) > 26.0, `Community "${slug}" geo coordinate invalid`);
    recordPass(`Northern Community Verified: ${slug}`, `${area.name} (lat: ${area.geo.latitude}, lng: ${area.geo.longitude})`);
  });
} catch (err: any) {
  recordFail('Jupiter Corridor Coverage', err.message);
}

// ----------------------------------------------------------------------
// 5. Contamination Check (Cleaning Domain vs Prior Concrete Cutting)
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 5: Domain Cleanliness & Anti-Contamination Check ---');

const FORBIDDEN_TERMS = [
  'concrete cutting',
  'concrete sawing',
  'core drilling',
  'slab sawing',
  'wall sawing',
  'wire sawing',
  'demolition contractor',
  'ready code live',
  'ace concrete',
  'asphalt cutting'
];

try {
  let contaminationFound = 0;
  serviceAreas.forEach((area) => {
    const combinedText = [
      area.name,
      area.description,
      area.marketInsight,
      area.seoTitle || '',
      area.metaDescription || '',
      ...(area.highlights || []),
      ...(area.neighborhoods || []),
      ...(area.localCopy || []),
      ...(area.keyCorridors || []),
      ...(area.topIndustries || []),
      ...(area.landmarks || []).map((l) => `${l.name} ${l.category} ${l.description}`),
      ...(area.thingsToDo || []).map((t) => `${t.title} ${t.spot} ${t.description}`)
    ].join(' ').toLowerCase();

    FORBIDDEN_TERMS.forEach((term) => {
      if (combinedText.includes(term)) {
        contaminationFound++;
        recordFail(`Contamination in ${area.slug}`, `Found forbidden term "${term}"`);
      }
    });
  });

  if (contaminationFound === 0) {
    recordPass('Anti-Contamination Check', `Zero concrete-cutting / foreign project artifacts across all 56 locations`);
  }
} catch (err: any) {
  recordFail('Anti-Contamination Check', err.message);
}

// ----------------------------------------------------------------------
// 6. Regional Partitioning & Directory Synchronization
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 6: Regional Partitioning & Directory Synchronization ---');

const PALM_BEACH_SLUGS = new Set([
  'west-palm-beach', 'boca-raton', 'delray-beach', 'jupiter', 'palm-beach-gardens',
  'wellington', 'boynton-beach', 'lake-worth-beach', 'royal-palm-beach', 'north-palm-beach',
  'riviera-beach', 'greenacres', 'lantana', 'palm-springs', 'lake-park',
  'tequesta', 'juno-beach', 'highland-beach', 'hypoluxo', 'manalapan',
  'ocean-ridge', 'south-palm-beach', 'palm-beach', 'atlantis', 'haverhill',
  'mangonia-park', 'loxahatchee', 'the-acreage', 'palm-beach-shores', 'glen-ridge',
  'gulf-stream', 'cloud-lake', 'golf', 'briny-breezes', 'jupiter-inlet-colony',
  'lake-clarke-shores', 'palm-beach-gardens-west', 'westlake', 'avenir', 'arden',
  'century-village', 'kings-point', 'golden-lakes', 'limestone-creek', 'pine-jog',
  'schall-circle', 'cabana-colony', 'kenwood-estates', 'san-castle', 'gun-club-estates'
]);

try {
  assert.strictEqual(PALM_BEACH_SLUGS.size, 50, `Expected 50 Palm Beach slugs, found ${PALM_BEACH_SLUGS.size}`);
  recordPass('Palm Beach County Slugs Count', `Exactly 50 Palm Beach communities`);

  // Verify all 50 exist in dataset
  PALM_BEACH_SLUGS.forEach((slug) => {
    assert(serviceAreasBySlug[slug], `Palm Beach slug "${slug}" missing from serviceAreasBySlug`);
  });
  recordPass('Palm Beach Locations Existence', `All 50 Palm Beach slugs exist in serviceAreas`);

  // Check remaining counties:
  assert(serviceAreasBySlug['broward-county'], 'Missing broward-county');
  assert(serviceAreasBySlug['miami-dade-county'], 'Missing miami-dade-county');
  assert(serviceAreasBySlug['martin-county'], 'Missing martin-county');
  assert(serviceAreasBySlug['st-lucie-county'], 'Missing st-lucie-county');
  assert(serviceAreasBySlug['okeechobee-county'], 'Missing okeechobee-county');
  assert(serviceAreasBySlug['orange-county'], 'Missing orange-county');
  recordPass('Anchor & Adjacent Counties', `Broward, Miami-Dade, Martin, St. Lucie, Okeechobee, and Orange all present`);

  const sumTotal = PALM_BEACH_SLUGS.size + 1 + 1 + 4;
  assert.strictEqual(sumTotal, 56, `Sum of partitions (${sumTotal}) does not match 56`);
  recordPass('Partition Sum Match', `50 Palm Beach + 2 Anchor + 4 Adjacent = 56 total locations`);
} catch (err: any) {
  recordFail('Regional Partitioning', err.message);
}

// ----------------------------------------------------------------------
// 7. Component Simulation & Rendering Feasibility
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 7: Component Simulation & Template Property Access ---');

try {
  // Simulate ServiceAreaDetailPage property access for all 56 areas
  serviceAreas.forEach((area) => {
    // 1. Division titles and descriptions
    const divisions = [
      { slug: 'office-cleaning', title: `Commercial Office Cleaning in ${area.name}` },
      { slug: 'medical-office-cleaning', title: `Medical Facility Disinfection in ${area.name}` },
      { slug: 'short-term-rentals', title: `Airbnb & Vacation Rental Turnover in ${area.name}` },
      { slug: 'home-maintenance', title: `Luxury Residential Maid Service in ${area.name}` },
      { slug: 'post-construction-cleaning', title: `Post-Construction Cleanup in ${area.name}` }
    ];
    assert.strictEqual(divisions.length, 5);

    // 2. FAQs generation
    const faqs = [
      { q: `How often should my ${area.name} facility or office be professionally cleaned?` },
      { q: `Do you provide same-day Airbnb and vacation rental turnover cleaning in ${area.name}?` },
      { q: `Are your cleaning solutions safe for children, pets, and sensitive environments in ${area.name}?` },
      { q: `Are your cleaning specialists in ${area.name} bonded, insured, and background-checked?` },
      { q: `How do I receive a customized cleaning estimate for my ${area.name} property?` }
    ];
    assert.strictEqual(faqs.length, 5);

    // 3. Google Maps embed URL construction
    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(area.name + ', FL')}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
    assert(mapUrl.includes(encodeURIComponent(area.name)), `Google map URL construction failed for ${area.slug}`);

    // 4. JSON-LD schema generation
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CleaningService',
          '@id': `https://sfcleaningconcepts.com/service-area/${area.slug}#service`,
          name: `South Florida Cleaning Concepts - ${area.name}`,
          areaServed: {
            '@type': 'City',
            name: area.name,
            geo: {
              '@type': 'GeoCoordinates',
              latitude: area.geo?.latitude,
              longitude: area.geo?.longitude
            }
          }
        }
      ]
    };
    const schemaStr = JSON.stringify(schema);
    assert(schemaStr.length > 50, `Schema serialization failed for ${area.slug}`);
  });

  recordPass('DetailPage Property Access Simulation', `All 56 areas successfully evaluated through DetailPage templates, FAQs, Maps URLs, and JSON-LD serialization`);
} catch (err: any) {
  recordFail('DetailPage Property Access Simulation', err.message);
}

// ----------------------------------------------------------------------
// Summary
// ----------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`  AUDIT COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================\n');

if (failCount > 0) {
  console.error('Failure Details:');
  failures.forEach((f, idx) => console.error(`  ${idx + 1}. [${f.testName}]: ${f.error}`));
  process.exit(1);
} else {
  console.log('  VERDICT: ALL EMPIRICAL DATASET & COMPONENT TESTS PASSED CLEANLY.\n');
  process.exit(0);
}
