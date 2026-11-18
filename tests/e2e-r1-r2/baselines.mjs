/**
 * Requirement-driven baselines, route inventories, and business/SEO invariants
 * derived strictly from ORIGINAL_REQUEST.md, PROJECT.md, and Spec Miner 1 baselines
 * on main @ ca475d0 (pre-R1/R2 edit).
 */

export const CORE_ROUTES = [
  '/',
  '/about-us',
  '/our-services',
  '/contact-us',
  '/faqs',
  '/our-publications',
];

export const SERVICE_SLUGS = [
  'office-cleaning',
  'medical-office-cleaning',
  'bars-and-restaurant-cleaning',
  'short-term-rentals',
  'post-construction-cleaning',
  'move-in-out-cleaning',
  'home-maintenance',
  'school-cleaning',
  'home-watching',
  'covid-19-disinfection',
];

export const BLOG_SLUGS = [
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
  'residential-cleaning-services-journey',
];

export const SERVICE_AREA_SLUGS = [
  'west-palm-beach',
  'boca-raton',
  'delray-beach',
  'jupiter',
  'palm-beach-gardens',
  'wellington',
  'boynton-beach',
  'lake-worth-beach',
  'royal-palm-beach',
  'north-palm-beach',
  'riviera-beach',
  'greenacres',
  'lantana',
  'palm-springs',
  'lake-park',
  'tequesta',
  'juno-beach',
  'highland-beach',
  'hypoluxo',
  'manalapan',
  'ocean-ridge',
  'south-palm-beach',
  'palm-beach',
  'atlantis',
  'haverhill',
  'mangonia-park',
  'loxahatchee',
  'the-acreage',
  'palm-beach-shores',
  'glen-ridge',
  'gulf-stream',
  'cloud-lake',
  'golf',
  'briny-breezes',
  'jupiter-inlet-colony',
  'lake-clarke-shores',
  'palm-beach-gardens-west',
  'westlake',
  'avenir',
  'arden',
  'century-village',
  'kings-point',
  'golden-lakes',
  'limestone-creek',
  'pine-jog',
  'schall-circle',
  'cabana-colony',
  'kenwood-estates',
  'san-castle',
  'gun-club-estates',
  'okeechobee-county',
  'st-lucie-county',
  'martin-county',
  'orange-county',
  'broward-county',
  'miami-dade-county',
];

export const EDGE_CASE_CITY_SLUGS = [
  'jupiter-inlet-colony',
  'palm-beach-gardens',
  'lake-clarke-shores',
  'palm-beach-gardens-west',
];

export const SERVICE_ROUTES = ['/service', ...SERVICE_SLUGS.map((s) => `/service/${s}`)];
export const BLOG_ROUTES = BLOG_SLUGS.map((s) => `/blog/${s}`);
export const SERVICE_AREA_ROUTES = [
  '/service-areas',
  ...SERVICE_AREA_SLUGS.map((s) => `/service-area/${s}`),
];

export const INDEXABLE_ROUTES = [
  ...CORE_ROUTES,
  ...SERVICE_ROUTES,
  ...BLOG_ROUTES,
  ...SERVICE_AREA_ROUTES,
]; // 85

export const ALL_CANONICAL_ROUTES = [...INDEXABLE_ROUTES, '/404']; // 86

export const LEGACY_WP_REDIRECTS = [
  {
    from: '/revitalize-your-office-space-with-south-florida-cleaning-concepts-unleashing-the-power-of-a-pristine-workspace',
    to: '/blog/revitalize-your-office-space',
  },
  {
    from: '/south-florida-cleaning-concepts-complete-guide-to-home-cleaning-tips-and-tricks',
    to: '/blog/complete-guide-to-home-cleaning',
  },
  {
    from: '/shining-a-light-on-clean-how-restaurant-and-bar-cleaning-services-enhance-your-business',
    to: '/blog/restaurant-and-bar-cleaning-services',
  },
  {
    from: '/office-cleaning-made-easy-with-south-florida-cleaning-concepts',
    to: '/blog/office-cleaning-made-easy',
  },
  {
    from: '/short-term-rental-cleaning-with-south-florida-cleaning-concepts-the-ultimate-guide',
    to: '/blog/short-term-rental-cleaning-guide',
  },
  {
    from: '/high-quality-cleaning-services-south-florida-with-south-florida-cleaning-concepts',
    to: '/blog/high-quality-cleaning-services-south-florida',
  },
  {
    from: '/medical-office-cleaning-with-south-florida-cleaning-concepts-a-comprehensive-guide',
    to: '/blog/medical-office-cleaning-guide',
  },
  {
    from: '/deep-cleaning-for-homes-and-offices-with-south-florida-cleaning-concepts',
    to: '/blog/deep-cleaning-for-homes-and-offices',
  },
  {
    from: '/post-construction-cleaning-with-south-florida-cleaning-concepts-a-comprehensive-guide',
    to: '/blog/post-construction-cleaning-guide',
  },
  {
    from: '/maximize-the-beauty-of-your-home-south-florida-home-maintenance-services-with-south-florida-cleaning-concepts',
    to: '/blog/south-florida-home-maintenance-services',
  },
  {
    from: '/revitalize-your-home-a-journey-with-south-florida-cleaning-concepts-residential-cleaning-services',
    to: '/blog/residential-cleaning-services-journey',
  },
];

export const EXPECTED_DIST_HTML_COUNT = 173;
export const EXPECTED_SITEMAP_COUNT = 85;
export const EXPECTED_TITLE_MAX_LEN = 60;
export const EXPECTED_DESC_MIN_RAW = 120;
export const EXPECTED_DESC_MAX_RAW = 160;

export const CHROME_LIMITS = {
  footerBaseline: 428,
  footerMaxWords: 240,
  globalCtaBaselineMin: 146,
  globalCtaMaxWords: 115,
};

/**
 * Pre-edit live React DOM (1440x900) baselines from PROJECT.md & Spec Miner 1.
 */
export const LIVE_ROUTE_BASELINES = {
  '/': { baselineBody: 3034, baselineMain: 2402, floorMain: 400 },
  '/about-us': { baselineBody: 1530, baselineMain: 912, floorMain: 250 },
  '/our-services': { baselineBody: 2413, baselineMain: 1797, floorMain: 350 },
  '/service': { baselineBody: 1018, baselineMain: 402, floorMain: 180, allowEqualMain: true },
  '/our-publications': { baselineBody: 1142, baselineMain: 532, floorMain: 180, allowEqualMain: true },
  '/faqs': { baselineBody: 879, baselineMain: 247, floorMain: 120, allowEqualMain: true },
  '/contact-us': { baselineBody: 932, baselineMain: 300, floorMain: 100, allowEqualMain: true },
  '/404': { baselineBody: 721, baselineMain: 89, floorMain: 40, allowEqualMain: true },
  '/service-areas': { baselineBody: 4438, baselineMain: 3822, floorMain: 600 },
};

/**
 * Service detail baselines: live min/max across 10 routes + exact per-slug static baselines.
 */
export const SERVICE_LIVE_BASELINES = {
  minBaselineBody: 1221,
  minBaselineMain: 605,
  floorMain: 220,
  staticMaxMain: 520,
  staticMaxBody: 920,
  representativeSlugs: ['office-cleaning', 'medical-office-cleaning', 'home-maintenance'],
  perSlug: {
    'office-cleaning': { body: 1235, main: 619 },
    'medical-office-cleaning': { body: 1240, main: 624 },
    'bars-and-restaurant-cleaning': { body: 1280, main: 664 },
    'short-term-rentals': { body: 1271, main: 655 },
    'post-construction-cleaning': { body: 1239, main: 623 },
    'move-in-out-cleaning': { body: 1298, main: 682 },
    'home-maintenance': { body: 1284, main: 668 },
    'school-cleaning': { body: 1221, main: 605 },
    'home-watching': { body: 1275, main: 659 },
    'covid-19-disinfection': { body: 1247, main: 631 },
  },
};

export const SERVICE_STATIC_BASELINES = {
  'office-cleaning': { body: 1029, main: 536 },
  'medical-office-cleaning': { body: 782, main: 289 },
  'bars-and-restaurant-cleaning': { body: 795, main: 302 },
  'short-term-rentals': { body: 852, main: 359 },
  'post-construction-cleaning': { body: 849, main: 356 },
  'move-in-out-cleaning': { body: 872, main: 379 },
  'home-maintenance': { body: 809, main: 316 },
  'school-cleaning': { body: 800, main: 307 },
  'home-watching': { body: 833, main: 340 },
  'covid-19-disinfection': { body: 826, main: 333 },
};

/**
 * Blog post baselines: live min/max + exact per-slug static baselines & >= 200w floor.
 */
export const BLOG_LIVE_BASELINES = {
  minBaselineBody: 1492,
  minBaselineMain: 882,
  floorMain: 200,
  representativeSlugs: [
    'medical-office-cleaning-guide',
    'deep-cleaning-for-homes-and-offices',
    'office-cleaning-made-easy',
  ],
  perSlug: {
    'revitalize-your-office-space': { body: 1548, main: 938 },
    'complete-guide-to-home-cleaning': { body: 1520, main: 910 },
    'restaurant-and-bar-cleaning-services': { body: 2157, main: 1547 },
    'office-cleaning-made-easy': { body: 1562, main: 952 },
    'short-term-rental-cleaning-guide': { body: 1498, main: 888 },
    'high-quality-cleaning-services-south-florida': { body: 1826, main: 1216 },
    'medical-office-cleaning-guide': { body: 2360, main: 1750 },
    'deep-cleaning-for-homes-and-offices': { body: 1663, main: 1053 },
    'post-construction-cleaning-guide': { body: 1622, main: 1012 },
    'south-florida-home-maintenance-services': { body: 1492, main: 882 },
    'residential-cleaning-services-journey': { body: 1758, main: 1148 },
  },
};

export const BLOG_STATIC_BASELINES = {
  'revitalize-your-office-space': { body: 1332, main: 841 },
  'complete-guide-to-home-cleaning': { body: 1329, main: 838 },
  'restaurant-and-bar-cleaning-services': { body: 1883, main: 1392 },
  'office-cleaning-made-easy': { body: 1342, main: 851 },
  'short-term-rental-cleaning-guide': { body: 1284, main: 793 },
  'high-quality-cleaning-services-south-florida': { body: 1562, main: 1071 },
  'medical-office-cleaning-guide': { body: 2088, main: 1597 },
  'deep-cleaning-for-homes-and-offices': { body: 1383, main: 892 },
  'post-construction-cleaning-guide': { body: 1335, main: 844 },
  'south-florida-home-maintenance-services': { body: 1190, main: 699 },
  'residential-cleaning-services-journey': { body: 1469, main: 978 },
};

export const SERVICE_AREA_LIVE_BASELINES = {
  minBaselineBody: 2255,
  minBaselineMain: 1639,
  floorMain: 350,
  representativeSlugs: [
    'west-palm-beach',
    'jupiter',
    'boca-raton',
    'jupiter-inlet-colony',
  ],
  perSlug: {
    'west-palm-beach': { body: 2446, main: 1830 },
    jupiter: { body: 2255, main: 1639 },
    'boca-raton': { body: 2379, main: 1763 },
    'jupiter-inlet-colony': { body: 2441, main: 1825 },
  },
};

export const SERVICE_AREA_STATIC_BASELINES = {
  'service-areas': { body: 2901, main: 2559, floorMain: 600 },
  'west-palm-beach': { body: 1591, main: 1249, floorMain: 350 },
  jupiter: { body: 1456, main: 1114, floorMain: 350 },
  'boca-raton': { body: 1551, main: 1209, floorMain: 350 },
  'jupiter-inlet-colony': { body: 1585, main: 1243, floorMain: 350 },
};

export const BUSINESS_INVARIANTS = {
  companyName: 'South Florida Cleaning Concepts',
  phoneDisplay: '(561) 704-5303',
  phoneCta: 'Call (561) 704-5303',
  email: 'Sflcleaningco@gmail.com',
  city: 'Boynton Beach',
  facebookUrl: 'facebook.com/SFCLEAN',
  discountToken: '12%',
  ratingToken: '4.8',
  hiringToken: 'We Are Hiring!',
  guaranteePrefix: 'Love Your Clean or Don',
  forbiddenStrings: ['24/7', 'twenty-four hours', '【', '】', '\u200b'],
  triCountyTokens: ['Palm Beach', 'Broward', 'Miami-Dade'],
  testimonialAuthors: [
    'Lindsey J. Crowley',
    'Adrian James',
    'Una Walker',
    'Sonia Paige',
  ],
  promoVideoAssets: [
    'promo-video-1.mp4',
    'promo-video-2.mp4',
    'main-home-video-1.mp4',
    'bg_video.mp4',
  ],
};

export const VIEWPORTS = {
  desktop: { name: 'desktop', width: 1440, height: 900, mobile: false, headerMaxHeight: 90 },
  mobile: { name: 'mobile', width: 375, height: 812, mobile: true, headerMaxHeight: 75 },
};
