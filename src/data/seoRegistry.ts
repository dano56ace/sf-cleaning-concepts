import { serviceAreas } from './serviceAreas';

export interface RouteSeoMeta {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  schemaType: string;
  ogType?: string;
}

export const SEO_ROUTES_MAP: { [path: string]: RouteSeoMeta } = {
  '/': {
    path: '/',
    title: 'Commercial & Home Cleaning | South Florida Cleaning Concepts',
    description: 'Premier commercial & residential cleaning across South Florida. Medical offices to luxury homes in Palm Beach & Broward. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/hero/video-poster-2.jpeg',
    ogType: 'website',
    schemaType: 'CleaningService'
  },
  '/about-us': {
    path: '/about-us',
    title: 'About Our Cleaning Team | South Florida Cleaning Concepts',
    description: 'Family-owned since 2004, South Florida Cleaning Concepts delivers vetted crews, eco-safe products, and a 100% guarantee. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/about-us',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/about/about-us-img-4.jpg',
    ogType: 'website',
    schemaType: 'AboutPage'
  },
  '/our-services': {
    path: '/our-services',
    title: 'Our Cleaning Services | South Florida Cleaning Concepts',
    description: 'Commercial, medical, restaurant, and residential cleaning across South Florida. Vetted local teams & 100% guarantee. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/our-services',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/service-img-12.jpg',
    ogType: 'website',
    schemaType: 'CollectionPage'
  },
  '/contact-us': {
    path: '/contact-us',
    title: 'Contact Us & Free Quotes | South Florida Cleaning Concepts',
    description: 'Request a free cleaning quote from South Florida Cleaning Concepts. Fast estimates across Palm Beach, Broward & Miami-Dade. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/contact-us',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/about/about-us-img-4.jpg',
    ogType: 'website',
    schemaType: 'ContactPage'
  },
  '/faqs': {
    path: '/faqs',
    title: 'Frequently Asked Questions | South Florida Cleaning Concepts',
    description: 'Answers to common South Florida cleaning questions. Learn about our 4-Step Rotation System, eco-safe supplies, and guarantee. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/faqs',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/about/about-us-img-5.jpg',
    ogType: 'website',
    schemaType: 'FAQPage'
  },
  '/our-publications': {
    path: '/our-publications',
    title: 'Cleaning Blog & Guides | South Florida Cleaning Concepts',
    description: 'Expert cleaning guides and sanitation tips from South Florida Cleaning Concepts for homes, rentals, clinics & offices. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/our-publications',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/blog-img-1.jpg',
    ogType: 'website',
    schemaType: 'CollectionPage'
  },
  '/service': {
    path: '/service',
    title: 'All Services Directory | South Florida Cleaning Concepts',
    description: 'Browse our directory of 10 specialized cleaning services across Palm Beach, Broward, and Miami-Dade. Fully insured team. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/service',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/service-img-12.jpg',
    ogType: 'website',
    schemaType: 'CollectionPage'
  },
  '/service/office-cleaning': {
    path: '/service/office-cleaning',
    title: 'Office Cleaning Services | South Florida Cleaning Concepts',
    description: 'Tailored commercial office cleaning across South Florida. Nightly janitorial, HEPA vacuuming, and sanitized workspaces. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/service/office-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/service-img-12.jpg',
    ogType: 'website',
    schemaType: 'Service'
  },
  '/service/medical-office-cleaning': {
    path: '/service/medical-office-cleaning',
    title: 'Medical Office Cleaning | South Florida Cleaning Concepts',
    description: 'Hospital-grade medical office cleaning in South Florida. Color-coded cloths, exam room disinfection, and inspection readiness. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/service/medical-office-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/services-img-1.jpg',
    ogType: 'website',
    schemaType: 'Service'
  },
  '/service/bars-and-restaurant-cleaning': {
    path: '/service/bars-and-restaurant-cleaning',
    title: 'Bar & Restaurant Cleaning | South Florida Cleaning Concepts',
    description: 'Overnight bar and restaurant cleaning in South Florida. Cookline degreasing, dining room shine, and health inspection prep. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/service/bars-and-restaurant-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/services-img-4.jpg',
    ogType: 'website',
    schemaType: 'Service'
  },
  '/service/short-term-rentals': {
    path: '/service/short-term-rentals',
    title: 'Short-Term Rental Cleaning | South Florida Cleaning Concepts',
    description: 'Same-day 10 AM-4 PM Airbnb & vacation rental turnovers in South Florida. Linen staging, restocking, and photo proof. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/service/short-term-rentals',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/Short-Term-Rental-Cleaning-1.jpeg',
    ogType: 'website',
    schemaType: 'Service'
  },
  '/service/post-construction-cleaning': {
    path: '/service/post-construction-cleaning',
    title: 'Post-Construction Cleanup | South Florida Cleaning Concepts',
    description: 'Three-phase post-construction cleanup for South Florida builds. Drywall dust extraction, sticker removal, and final polish. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/service/post-construction-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/a-man-is-cleaning-the-room-during-repairs-using-a-2022-11-15-10-06-14-utc-Large.jpg',
    ogType: 'website',
    schemaType: 'Service'
  },
  '/service/move-in-out-cleaning': {
    path: '/service/move-in-out-cleaning',
    title: 'Move In / Out Cleaning | South Florida Cleaning Concepts',
    description: 'Top-to-bottom move-in and move-out cleaning in South Florida. Deep sanitization of ovens, cabinets, baseboards, and baths. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/service/move-in-out-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/South-Florida-Cleaning-Concepts-Reisdential-Cleaning-1.jpeg',
    ogType: 'website',
    schemaType: 'Service'
  },
  '/service/home-maintenance': {
    path: '/service/home-maintenance',
    title: 'Home Maintenance Services | South Florida Cleaning Concepts',
    description: 'Recurring South Florida home maintenance with our 4-Step Rotation System plus optional window, gutter & pressure washing. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/service/home-maintenance',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/young-woman-standing-indoors-at-home-cleaning-win-2022-02-02-04-49-03-utc-Large.jpg',
    ogType: 'website',
    schemaType: 'Service'
  },
  '/service/school-cleaning': {
    path: '/service/school-cleaning',
    title: 'School & Daycare Cleaning | South Florida Cleaning Concepts',
    description: 'Certified school and daycare cleaning in South Florida. Non-toxic, fume-free disinfectants for classrooms and cafeterias. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/service/school-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/services-img-6.jpg',
    ogType: 'website',
    schemaType: 'Service'
  },
  '/service/home-watching': {
    path: '/service/home-watching',
    title: 'Home Watching Services | South Florida Cleaning Concepts',
    description: 'Weekly vacant-home watching in South Florida. AC, humidity, leak, and refrigerator/freezer checks with photo reports. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/service/home-watching',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/a-hotel-room-service-cleaning-the-floor-2022-11-08-10-55-57-utc-Large.jpeg',
    ogType: 'website',
    schemaType: 'Service'
  },
  '/service/covid-19-disinfection': {
    path: '/service/covid-19-disinfection',
    title: 'COVID-19 Disinfection | South Florida Cleaning Concepts',
    description: 'EPA-approved electrostatic spraying and surface disinfection across South Florida homes and workplaces with zero residue. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/service/covid-19-disinfection',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/disinfecting-to-prevent-covid-19-waiter-cleaning-2023-01-21-03-38-39-utc-Large.jpeg',
    ogType: 'website',
    schemaType: 'Service'
  },
  '/blog/revitalize-your-office-space': {
    path: '/blog/revitalize-your-office-space',
    title: 'Revitalize Your Office | South Florida Cleaning Concepts',
    description: 'Boost team productivity and reduce sick days with professional office cleaning strategies in South Florida. Workspace guide. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/revitalize-your-office-space',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/woman-cleaning-keyboard-in-the-office-2021-08-27-16-32-49-utc-Large.jpeg',
    ogType: 'article',
    schemaType: 'BlogPosting'
  },
  '/blog/complete-guide-to-home-cleaning': {
    path: '/blog/complete-guide-to-home-cleaning',
    title: 'Home Cleaning Tips Guide | South Florida Cleaning Concepts',
    description: 'Master residential cleaning with our South Florida home cleaning checklist. Smart dusting, stone care, and mildew prevention. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/complete-guide-to-home-cleaning',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/young-woman-standing-indoors-at-home-cleaning-win-2022-02-02-04-49-03-utc-Large.jpg',
    ogType: 'article',
    schemaType: 'BlogPosting'
  },
  '/blog/restaurant-and-bar-cleaning-services': {
    path: '/blog/restaurant-and-bar-cleaning-services',
    title: 'Restaurant Cleaning Guide | South Florida Cleaning Concepts',
    description: 'Learn how overnight restaurant and bar cleaning passes health inspections and wins loyal guests in South Florida. Call (561) 704-5303 today.',
    canonical: 'https://sfcleaningconcepts.com/blog/restaurant-and-bar-cleaning-services',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/disinfecting-to-prevent-covid-19-waiter-cleaning-2023-01-21-03-38-39-utc-Large.jpeg',
    ogType: 'article',
    schemaType: 'BlogPosting'
  },
  '/blog/office-cleaning-made-easy': {
    path: '/blog/office-cleaning-made-easy',
    title: 'Office Cleaning Made Easy | South Florida Cleaning Concepts',
    description: 'Discover simple strategies to streamline commercial office cleaning, improve indoor air quality, and keep teams productive. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/office-cleaning-made-easy',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/cleaning-dental-office-2022-04-19-01-57-15-utc.jpeg',
    ogType: 'article',
    schemaType: 'BlogPosting'
  },
  '/blog/short-term-rental-cleaning-guide': {
    path: '/blog/short-term-rental-cleaning-guide',
    title: 'Short-Term Rental Guide | South Florida Cleaning Concepts',
    description: 'Essential turnover checklist for South Florida Airbnb & VRBO hosts. Earn 5-star cleanliness ratings with 10 AM-4 PM resets. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/short-term-rental-cleaning-guide',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/Short-Term-Rental-Cleaning-1.jpeg',
    ogType: 'article',
    schemaType: 'BlogPosting'
  },
  '/blog/high-quality-cleaning-services-south-florida': {
    path: '/blog/high-quality-cleaning-services-south-florida',
    title: 'Quality Cleaning Standards | South Florida Cleaning Concepts',
    description: 'Discover what defines high-quality cleaning in South Florida: color-coded systems, eco-safe supplies, and vetted teams. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/high-quality-cleaning-services-south-florida',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/cleaning-home-2022-05-10-23-59-07-utc-Large.jpeg',
    ogType: 'article',
    schemaType: 'BlogPosting'
  },
  '/blog/medical-office-cleaning-guide': {
    path: '/blog/medical-office-cleaning-guide',
    title: 'Medical Cleaning Guide | South Florida Cleaning Concepts',
    description: 'Best practices for healthcare clinic sanitation and infection control. OSHA compliance and disinfection in South Florida. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/medical-office-cleaning-guide',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/medical-office-2022-07-07-00-46-47-utc-Large.jpeg',
    ogType: 'article',
    schemaType: 'BlogPosting'
  },
  '/blog/deep-cleaning-for-homes-and-offices': {
    path: '/blog/deep-cleaning-for-homes-and-offices',
    title: 'Deep Cleaning Guide | South Florida Cleaning Concepts',
    description: 'Routine cleaning vs deep cleaning explained. Learn why seasonal deep scrubbing protects South Florida homes and offices. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/deep-cleaning-for-homes-and-offices',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/process-of-deep-furniture-cleaning-removing-dirt-2023-04-21-22-06-54-utc-Large.jpeg',
    ogType: 'article',
    schemaType: 'BlogPosting'
  },
  '/blog/post-construction-cleaning-guide': {
    path: '/blog/post-construction-cleaning-guide',
    title: 'Post-Construction Guide | South Florida Cleaning Concepts',
    description: 'The 3 crucial phases of post-construction cleaning: rough, deep, and final polish. Prep South Florida remodels for move-in. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/post-construction-cleaning-guide',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/blog/Post-Construction-Clean-2.jpeg',
    ogType: 'article',
    schemaType: 'BlogPosting'
  },
  '/blog/south-florida-home-maintenance-services': {
    path: '/blog/south-florida-home-maintenance-services',
    title: 'Coastal Home Maintenance | South Florida Cleaning Concepts',
    description: 'Protect your South Florida home from tropical humidity, salt air, and tracked-in sand with interior and exterior upkeep. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/south-florida-home-maintenance-services',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/home-cleaning-2.jpg',
    ogType: 'article',
    schemaType: 'BlogPosting'
  },
  '/blog/residential-cleaning-services-journey': {
    path: '/blog/residential-cleaning-services-journey',
    title: 'Recurring Maid Service | South Florida Cleaning Concepts',
    description: 'What to expect from recurring residential maid service in South Florida: tailored checklists, rotation care, and vetted pros. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/blog/residential-cleaning-services-journey',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/South-Florida-Cleaning-Concepts-Reisdential-Cleaning-1.jpeg',
    ogType: 'article',
    schemaType: 'BlogPosting'
  },
  '/404': {
    path: '/404',
    title: '404: Page Not Found | South Florida Cleaning Concepts',
    description: 'Page not found. Return to South Florida Cleaning Concepts homepage or explore our commercial and residential cleaning services. Call (561) 704-5303.',
    canonical: 'https://sfcleaningconcepts.com/404',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/hero/video-poster-2.jpeg',
    ogType: 'website',
    schemaType: 'ErrorPage'
  },
  '/service-areas': {
    path: '/service-areas',
    title: 'Service Areas Directory | South Florida Cleaning Concepts',
    description: 'Explore all 56 South Florida service areas from Jupiter to Miami. Commercial janitorial & luxury home cleaning. Call (561) 704-5303 for a quote.',
    canonical: 'https://sfcleaningconcepts.com/service-areas',
    ogImage: 'https://sfcleaningconcepts.com/assets/images/services/service-img-12.jpg',
    ogType: 'website',
    schemaType: 'CollectionPage'
  }
};

// Dynamically populate all 56 service area routes
function formatServiceAreaTitle(titleCity: string, seoTitle?: string): string {
  const candidates = [
    seoTitle,
    `${titleCity} Cleaning | South Florida Cleaning Concepts`,
    `${titleCity}, FL | South Florida Cleaning Concepts`,
    `${titleCity} | South Florida Cleaning Concepts`,
  ].filter((t): t is string => Boolean(t && t.trim()));
  return candidates.find((t) => t.length <= 60) || candidates[candidates.length - 1];
}

for (const area of serviceAreas) {
  const titleCity = area.name.includes('(West)') ? 'PBG West' : area.name;
  SEO_ROUTES_MAP[`/service-area/${area.slug}`] = {
    path: `/service-area/${area.slug}`,
    title: formatServiceAreaTitle(titleCity, area.seoTitle),
    description: area.metaDescription || `Premier commercial & residential cleaning in ${titleCity}, FL. Offices, clinics & homes. Vetted staff & 100% guaranteed. Call (561) 704-5303.`,
    canonical: `https://sfcleaningconcepts.com/service-area/${area.slug}`,
    ogImage: 'https://sfcleaningconcepts.com/assets/images/hero/video-poster-2.jpeg',
    ogType: 'website',
    schemaType: 'Service'
  };
}

