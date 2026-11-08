import { serviceAreas } from './serviceAreas';

export interface RouteSeoMeta {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  schemaType: string;
}

export const SEO_ROUTES_MAP: { [path: string]: RouteSeoMeta } = {
  '/': {
    path: '/',
    title: 'Commercial Cleaning - Pros | South Florida Cleaning Concepts',
    description: 'Premier commercial & residential cleaning across South Florida. From medical offices to luxury homes in Palm Beach & Broward. Call (561) 704-5303 for a quote.',
    canonical: 'https://sfcleaningconcepts.com/',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/hero/video-poster-2.jpeg',
    schemaType: 'CleaningService'
  },
  '/about-us': {
    path: '/about-us',
    title: 'About Us - Cleaning Team | South Florida Cleaning Concepts',
    description: 'Discover South Florida Cleaning Concepts. Over 20 years of family-owned excellence, vetted staff, and 100% guarantee in Palm Beach. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/about-us',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/about/about-us-img-4.jpg',
    schemaType: 'AboutPage'
  },
  '/our-services': {
    path: '/our-services',
    title: 'Our Services - Overview | South Florida Cleaning Concepts',
    description: 'Explore specialized commercial, medical, restaurant, and luxury residential cleaning services across Palm Beach & South Florida. Call (561) 704-5303 for quotes.',
    canonical: 'https://sfcleaningconcepts.com/our-services',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/service-img-12.jpg',
    schemaType: 'CollectionPage'
  },
  '/contact-us': {
    path: '/contact-us',
    title: 'Contact Us - Free Quotes | South Florida Cleaning Concepts',
    description: 'Request a free cleaning quote from South Florida Cleaning Concepts. Fast, reliable estimates for Palm Beach & Broward properties. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/contact-us',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/about/about-us-img-4.jpg',
    schemaType: 'ContactPage'
  },
  '/faqs': {
    path: '/faqs',
    title: 'Cleaning FAQs - Top Q&As | South Florida Cleaning Concepts',
    description: 'Get answers to common cleaning questions in South Florida. Learn about our rotation cleaning system, green products, and bonding. Call (561) 704-5303 for info.',
    canonical: 'https://sfcleaningconcepts.com/faqs',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/about/about-us-img-5.jpg',
    schemaType: 'FAQPage'
  },
  '/our-publications': {
    path: '/our-publications',
    title: 'Cleaning Blog - Top Guides | South Florida Cleaning Concepts',
    description: 'Read professional cleaning guides and sanitation insights from South Florida Cleaning Concepts. Expert advice for homes & offices. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/our-publications',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/blog-img-1.jpg',
    schemaType: 'CollectionPage'
  },
  '/service': {
    path: '/service',
    title: 'All Services - Directory | South Florida Cleaning Concepts',
    description: 'Browse our complete directory of 10 specialized cleaning services across Palm Beach, Broward, and Miami-Dade. Fully licensed team. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/service/',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/service-img-12.jpg',
    schemaType: 'CollectionPage'
  },
  '/service/office-cleaning': {
    path: '/service/office-cleaning',
    title: 'Office Cleaning - Business | South Florida Cleaning Concepts',
    description: 'Tailored commercial office cleaning across Palm Beach and Broward. Nightly janitorial, floor care, and sanitized workspaces. Call (561) 704-5303 for a quote.',
    canonical: 'https://sfcleaningconcepts.com/service/office-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/service-img-12.jpg',
    schemaType: 'Service'
  },
  '/service/medical-office-cleaning': {
    path: '/service/medical-office-cleaning',
    title: 'Medical Cleaning - Clinics | South Florida Cleaning Concepts',
    description: 'Hospital-grade medical office cleaning in South Florida. Terminal sterilization, biohazard compliance, and pathogen defense. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/service/medical-office-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/services-img-1.jpg',
    schemaType: 'Service'
  },
  '/service/bars-and-restaurant-cleaning': {
    path: '/service/bars-and-restaurant-cleaning',
    title: 'Restaurant Cleaning - Bars | South Florida Cleaning Concepts',
    description: '24/7 commercial bar and restaurant cleaning in South Florida. Kitchen degreasing, dining sanitization, and health inspection prep. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/service/bars-and-restaurant-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/services-img-4.jpg',
    schemaType: 'Service'
  },
  '/service/short-term-rentals': {
    path: '/service/short-term-rentals',
    title: 'Airbnb Cleaning - Turnover | South Florida Cleaning Concepts',
    description: 'Rapid short-term rental & Airbnb turnover cleaning in Palm Beach & Broward. Hotel-grade staging, linen laundering, and restock. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/service/short-term-rentals',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/Short-Term-Rental-Cleaning-1.jpeg',
    schemaType: 'Service'
  },
  '/service/post-construction-cleaning': {
    path: '/service/post-construction-cleaning',
    title: 'Post-Construction - Clean | South Florida Cleaning Concepts',
    description: 'Comprehensive post-construction cleanup for South Florida builders. Debris removal, drywall dust extraction, and final polish. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/service/post-construction-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/a-man-is-cleaning-the-room-during-repairs-using-a-2022-11-15-10-06-14-utc-Large.jpg',
    schemaType: 'Service'
  },
  '/service/move-in-out-cleaning': {
    path: '/service/move-in-out-cleaning',
    title: 'Move In Out - Deep Clean | South Florida Cleaning Concepts',
    description: 'Top-to-bottom move-in and move-out cleaning in Palm Beach County. Deep sanitization of kitchens, baseboards, and living spaces. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/service/move-in-out-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/South-Florida-Cleaning-Concepts-Reisdential-Cleaning-1.jpeg',
    schemaType: 'Service'
  },
  '/service/home-maintenance': {
    path: '/service/home-maintenance',
    title: 'Home Maintenance - Upkeep | South Florida Cleaning Concepts',
    description: 'Comprehensive residential home maintenance and deep cleaning services across Palm Beach & Broward. Protect your estate. Call (561) 704-5303 for an estimate.',
    canonical: 'https://sfcleaningconcepts.com/service/home-maintenance',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/young-woman-standing-indoors-at-home-cleaning-win-2022-02-02-04-49-03-utc-Large.jpg',
    schemaType: 'Service'
  },
  '/service/school-cleaning': {
    path: '/service/school-cleaning',
    title: 'School Cleaning - Campuses | South Florida Cleaning Concepts',
    description: 'Certified educational facility and daycare cleaning in South Florida. Child-safe green disinfectants, germ control, and classrooms. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/service/school-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/services-img-6.jpg',
    schemaType: 'Service'
  },
  '/service/home-watching': {
    path: '/service/home-watching',
    title: 'Home Watching - Property | South Florida Cleaning Concepts',
    description: 'Professional home watching & absentee estate oversight in Palm Beach County. Storm prep, leak checks, and AC monitoring. Call (561) 704-5303 for security.',
    canonical: 'https://sfcleaningconcepts.com/service/home-watching',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/a-hotel-room-service-cleaning-the-floor-2022-11-08-10-55-57-utc-Large.jpeg',
    schemaType: 'Service'
  },
  '/service/covid-19-disinfection': {
    path: '/service/covid-19-disinfection',
    title: 'COVID-19 - Disinfection | South Florida Cleaning Concepts',
    description: 'EPA-registered COVID-19 electrostatic spraying and surface disinfection across South Florida businesses and residences. Stay safe. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/service/covid-19-disinfection',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/disinfecting-to-prevent-covid-19-waiter-cleaning-2023-01-21-03-38-39-utc-Large.jpeg',
    schemaType: 'Service'
  },
  '/blog/revitalize-your-office-space': {
    path: '/blog/revitalize-your-office-space',
    title: 'Office Refresh - Workspace | South Florida Cleaning Concepts',
    description: 'Boost employee productivity and cut sick days with professional office cleaning strategies in South Florida. Workspace wellness guide. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/revitalize-your-office-space',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/blog-img-1.jpg',
    schemaType: 'BlogPosting'
  },
  '/blog/complete-guide-to-home-cleaning': {
    path: '/blog/complete-guide-to-home-cleaning',
    title: 'Home Cleaning - Best Tips | South Florida Cleaning Concepts',
    description: 'Master residential cleaning with our comprehensive South Florida home cleaning checklist. Expert kitchen, bath, and tile advice. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/blog/complete-guide-to-home-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/blog-img-2.jpg',
    schemaType: 'BlogPosting'
  },
  '/blog/restaurant-and-bar-cleaning-services': {
    path: '/blog/restaurant-and-bar-cleaning-services',
    title: 'Bar Hygiene - Dining Care | South Florida Cleaning Concepts',
    description: 'Learn how pristine restaurant and bar cleanliness passes health inspections and drives guest loyalty in South Florida. Expert tips. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/blog/restaurant-and-bar-cleaning-services',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/blog-img-3.jpg',
    schemaType: 'BlogPosting'
  },
  '/blog/office-cleaning-made-easy': {
    path: '/blog/office-cleaning-made-easy',
    title: 'Office Clean - Made Easy | South Florida Cleaning Concepts',
    description: 'Discover simple strategies to streamline office cleaning, improve air quality, and maintain professional commercial facilities. Call (561) 704-5303 for help.',
    canonical: 'https://sfcleaningconcepts.com/blog/office-cleaning-made-easy',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/blog-img-4.jpg',
    schemaType: 'BlogPosting'
  },
  '/blog/short-term-rental-cleaning-guide': {
    path: '/blog/short-term-rental-cleaning-guide',
    title: 'Airbnb Clean - Host Guide | South Florida Cleaning Concepts',
    description: 'Essential turnover checklist for South Florida Airbnb & VRBO hosts. Earn 5-star cleanliness ratings and automate guest turnovers. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/short-term-rental-cleaning-guide',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/Short-Term-Rental-Cleaning-1.jpeg',
    schemaType: 'BlogPosting'
  },
  '/blog/high-quality-cleaning-services-south-florida': {
    path: '/blog/high-quality-cleaning-services-south-florida',
    title: 'Quality Cleaning - Florida | South Florida Cleaning Concepts',
    description: 'Discover what defines premium cleaning standards in South Florida. Rotation systems, eco-friendly products, and vetted specialists. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/high-quality-cleaning-services-south-florida',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/blog-img-6.jpg',
    schemaType: 'BlogPosting'
  },
  '/blog/medical-office-cleaning-guide': {
    path: '/blog/medical-office-cleaning-guide',
    title: 'Medical Clean - OSHA Guide | South Florida Cleaning Concepts',
    description: 'Best practices for healthcare clinic sanitation and infection control. OSHA standards and terminal disinfection in South Florida. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/medical-office-cleaning-guide',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/blog-img-7.jpg',
    schemaType: 'BlogPosting'
  },
  '/blog/deep-cleaning-for-homes-and-offices': {
    path: '/blog/deep-cleaning-for-homes-and-offices',
    title: 'Deep Clean - Home & Office | South Florida Cleaning Concepts',
    description: 'Standard cleaning vs deep cleaning explained. Why seasonal deep scrubbing is essential for South Florida homes and corporate offices. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/deep-cleaning-for-homes-and-offices',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/blog-img-8.jpg',
    schemaType: 'BlogPosting'
  },
  '/blog/post-construction-cleaning-guide': {
    path: '/blog/post-construction-cleaning-guide',
    title: 'Remodel Clean - Full Guide | South Florida Cleaning Concepts',
    description: 'The 3 crucial phases of post-construction cleaning: rough, deep, and final detailing. Prepare South Florida remodels for move-in. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/post-construction-cleaning-guide',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/Post-Construction-Clean-1.jpeg',
    schemaType: 'BlogPosting'
  },
  '/blog/south-florida-home-maintenance-services': {
    path: '/blog/south-florida-home-maintenance-services',
    title: 'Home Care - Florida Upkeep | South Florida Cleaning Concepts',
    description: 'Protect your Florida property from tropical humidity, algae, and salt air damage. Complete exterior and interior upkeep guide. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/blog/south-florida-home-maintenance-services',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/South-Florida-Cleaning-Concepts-Reisdential-Cleaning-2.jpeg',
    schemaType: 'BlogPosting'
  },
  '/blog/residential-cleaning-services-journey': {
    path: '/blog/residential-cleaning-services-journey',
    title: 'Home Clean - Maid Journey | South Florida Cleaning Concepts',
    description: 'Experience the difference of a professional residential cleaning routine in South Florida. Tailored cleaning plans and vetted maids. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/residential-cleaning-services-journey',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/blog-img-11.jpg',
    schemaType: 'BlogPosting'
  },
  '/404': {
    path: '/404',
    title: '404 - Page Not Found | South Florida Cleaning Concepts',
    description: 'The page you requested could not be found. Return to South Florida Cleaning Concepts homepage or explore our commercial and residential cleaning services in Palm Beach County.',
    canonical: 'https://sfcleaningconcepts.com/404',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/hero/video-poster-2.jpeg',
    schemaType: 'ErrorPage'
  },
  '/service-areas': {
    path: '/service-areas',
    title: 'Service Areas - Florida Directory | South Florida Cleaning Concepts',
    description: 'Explore all 56 South Florida service areas covered by South Florida Cleaning Concepts. Commercial and residential cleaning from Jupiter to Miami. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/service-areas',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/service-img-12.jpg',
    schemaType: 'CollectionPage'
  }
};

// Dynamically populate all 56 service area routes
for (const area of serviceAreas) {
  SEO_ROUTES_MAP[`/service-area/${area.slug}`] = {
    path: `/service-area/${area.slug}`,
    title: area.seoTitle || `${area.name} Commercial & Residential Cleaning Services | South Florida Cleaning Concepts`,
    description: area.metaDescription || `Premier commercial office cleaning, medical facility sanitization, and luxury maid services in ${area.name}, FL. Bonded, insured, and 100% guaranteed. Call (561) 704-5303.`,
    canonical: `https://sfcleaningconcepts.com/service-area/${area.slug}`,
    ogImage: 'https://sfcleaningconcepts.com/assets/images/hero/video-poster-2.jpeg',
    schemaType: 'Service'
  };
}

