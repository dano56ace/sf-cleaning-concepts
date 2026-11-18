import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_ROUTES_MAP, RouteSeoMeta } from '../src/data/seoRegistry';
import {
  BUSINESS_NAP,
  SERVICES_CATALOG,
  BLOG_POSTS,
  FAQS_LIST,
  PROMO_VIDEOS,
  TRUST_BADGES,
  ROTATION_SYSTEM_STEPS,
  CLIENT_TESTIMONIALS,
  getBlogCtaServicePhrase
} from '../src/data/siteData';
import {
  serviceAreas,
  serviceAreasBySlug,
  getServiceAreaCoreServices,
  getServiceAreaFaqs,
  ServiceAreaItem
} from '../src/data/serviceAreas';
import { getBlogPostSchema } from '../src/data/blogSchemaData';
import { writeLlmsFiles } from './generate-llms-docs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const BASE_TEMPLATE = path.resolve(DIST_DIR, 'index.html');
const SITE_URL = 'https://sfcleaningconcepts.com';

interface RouteDefinition {
  path: string;
  sourceFile: string;
}

const ALL_ROUTES: RouteDefinition[] = [
  // 6 Core
  { path: '/', sourceFile: 'index.html' },
  { path: '/about-us', sourceFile: 'about-us.html' },
  { path: '/our-services', sourceFile: 'our-services.html' },
  { path: '/contact-us', sourceFile: 'contact-us.html' },
  { path: '/faqs', sourceFile: 'faqs.html' },
  { path: '/our-publications', sourceFile: 'our-publications.html' },

  // 11 Services
  { path: '/service', sourceFile: 'service/index.html' },
  { path: '/service/office-cleaning', sourceFile: 'service/office-cleaning.html' },
  { path: '/service/medical-office-cleaning', sourceFile: 'service/medical-office-cleaning.html' },
  { path: '/service/bars-and-restaurant-cleaning', sourceFile: 'service/bars-and-restaurant-cleaning.html' },
  { path: '/service/short-term-rentals', sourceFile: 'service/short-term-rentals.html' },
  { path: '/service/post-construction-cleaning', sourceFile: 'service/post-construction-cleaning.html' },
  { path: '/service/move-in-out-cleaning', sourceFile: 'service/move-in-out-cleaning.html' },
  { path: '/service/home-maintenance', sourceFile: 'service/home-maintenance.html' },
  { path: '/service/school-cleaning', sourceFile: 'service/school-cleaning.html' },
  { path: '/service/home-watching', sourceFile: 'service/home-watching.html' },
  { path: '/service/covid-19-disinfection', sourceFile: 'service/covid-19-disinfection.html' },

  // 11 Blog Articles
  { path: '/blog/revitalize-your-office-space', sourceFile: 'blog/revitalize-your-office-space.html' },
  { path: '/blog/complete-guide-to-home-cleaning', sourceFile: 'blog/complete-guide-to-home-cleaning.html' },
  { path: '/blog/restaurant-and-bar-cleaning-services', sourceFile: 'blog/restaurant-and-bar-cleaning-services.html' },
  { path: '/blog/office-cleaning-made-easy', sourceFile: 'blog/office-cleaning-made-easy.html' },
  { path: '/blog/short-term-rental-cleaning-guide', sourceFile: 'blog/short-term-rental-cleaning-guide.html' },
  { path: '/blog/high-quality-cleaning-services-south-florida', sourceFile: 'blog/high-quality-cleaning-services-south-florida.html' },
  { path: '/blog/medical-office-cleaning-guide', sourceFile: 'blog/medical-office-cleaning-guide.html' },
  { path: '/blog/deep-cleaning-for-homes-and-offices', sourceFile: 'blog/deep-cleaning-for-homes-and-offices.html' },
  { path: '/blog/post-construction-cleaning-guide', sourceFile: 'blog/post-construction-cleaning-guide.html' },
  { path: '/blog/south-florida-home-maintenance-services', sourceFile: 'blog/south-florida-home-maintenance-services.html' },
  { path: '/blog/residential-cleaning-services-journey', sourceFile: 'blog/residential-cleaning-services-journey.html' },

  // Service Areas Directory
  { path: '/service-areas', sourceFile: '' },

  // 56 Service Areas
  ...serviceAreas.map((area) => ({
    path: `/service-area/${area.slug}`,
    sourceFile: ''
  })),

  // 404 Error Page
  { path: '/404', sourceFile: '404.html' }
];

const EXACT_H1_MAP: Record<string, string> = {
  'office-cleaning': 'Office Cleaning Services',
  'medical-office-cleaning': 'Specialized Medical Office Cleaning',
  'bars-and-restaurant-cleaning': 'Commercial Cleaning for Bars and Restaurants',
  'short-term-rentals': 'Short-Term Rental Cleaning Services',
  'post-construction-cleaning': 'Post-Construction Cleaning',
  'move-in-out-cleaning': 'Move In / Out Cleaning Services',
  'home-maintenance': 'Comprehensive Home Maintenance Services',
  'school-cleaning': 'School Cleaning Services',
  'home-watching': 'Home Watching Service',
  'covid-19-disinfection': 'COVID-19 Disinfection Services'
};

const EXACT_BLOG_H1_MAP: Record<string, string> = {
  'revitalize-your-office-space': 'Revitalize Your South Florida Office Workspace',
  'post-construction-cleaning-guide': 'Post-Construction Cleaning Guide for South Florida Builds',
  'office-cleaning-made-easy': 'Commercial Office Cleaning Made Easy in South Florida',
  'medical-office-cleaning-guide': 'Medical Office Cleaning Guide for South Florida Clinics',
  'restaurant-and-bar-cleaning-services': 'How Restaurant and Bar Cleaning Protects Your Business',
  'residential-cleaning-services-journey': 'What to Expect from Recurring Residential Maid Service',
  'complete-guide-to-home-cleaning': 'Complete South Florida Home Cleaning Tips and Checklist',
  'deep-cleaning-for-homes-and-offices': 'Deep Cleaning Guide for South Florida Homes and Offices',
  'south-florida-home-maintenance-services': 'South Florida Home Maintenance for Coastal Property Protection',
  'high-quality-cleaning-services-south-florida': 'What Defines High-Quality Cleaning in South Florida',
  'short-term-rental-cleaning-guide': 'Short-Term Rental Turnover Guide for South Florida Hosts'
};

const SERVICE_IMAGE_ALTS: Record<string, string> = {
  'office-cleaning': 'Cleaners sanitizing desks and glass partitions in a South Florida office',
  'medical-office-cleaning': 'Sanitized medical clinic exam suite and waiting room seating',
  'bars-and-restaurant-cleaning': 'Degreased stainless restaurant kitchen and spotless dining bar',
  'short-term-rentals': 'Crisply staged South Florida Airbnb bedroom ready for guest check-in',
  'post-construction-cleaning': 'Technician HEPA-vacuuming drywall dust inside a newly remodeled room',
  'move-in-out-cleaning': 'Freshly scrubbed empty residence kitchen and gleaming hardwood floors',
  'home-maintenance': 'Housekeeper wiping sunlit residential windows in a South Florida home',
  'school-cleaning': 'Disinfected classroom desks and sanitized daycare learning space',
  'home-watching': 'Clean South Florida coastal residence inspected during seasonal home watch',
  'covid-19-disinfection': 'Specialist applying electrostatic disinfectant mist across commercial surfaces'
};

const POST_IMAGE_ALTS: Record<string, string> = {
  'residential-cleaning-services-journey': 'Freshly cleaned empty South Florida residence kitchen and living area',
  'south-florida-home-maintenance-services': 'Bright coastal South Florida home interior maintained for humidity protection',
  'post-construction-cleaning-guide': 'Post-renovation room undergoing HEPA dust extraction after remodeling',
  'deep-cleaning-for-homes-and-offices': 'Deep upholstery and surface cleaning inside a South Florida property',
  'medical-office-cleaning-guide': 'Sanitized South Florida medical clinic corridor and clinical examination room',
  'high-quality-cleaning-services-south-florida': 'Detail-oriented residential cleaning inside a sunlit coastal living room',
  'short-term-rental-cleaning-guide': 'Crisply made vacation rental bedroom prepared for arriving South Florida guests',
  'office-cleaning-made-easy': 'Clean modern medical and executive office workspace ready for staff',
  'complete-guide-to-home-cleaning': 'Homekeeper polishing sunlit residential windows with microfiber cloths',
  'revitalize-your-office-space': 'Office team member sanitizing keyboard and workstation surfaces',
  'restaurant-and-bar-cleaning-services': 'Hospitality staff disinfecting dining tables and commercial bar surfaces'
};

const VIDEO_POSTER_ALTS: Record<string, string> = {
  'promo-video-1': 'Cleaners wiping kitchen counters and detailing a South Florida home',
  'promo-video-2': 'Spotless modern interior featured in our deep cleaning video',
  'main-home-video-1': 'Specialist inspecting freshly cleaned room with 50-point checklist',
  'bg-video': 'Team sanitizing high-touch glass and stone surfaces'
};

const HEADER_AREA_HUBS = [
  { name: 'Jupiter', slug: 'jupiter' },
  { name: 'West Palm Beach', slug: 'west-palm-beach' },
  { name: 'Boca Raton', slug: 'boca-raton' },
  { name: 'Delray Beach', slug: 'delray-beach' },
  { name: 'Palm Beach Gardens', slug: 'palm-beach-gardens' },
  { name: 'Wellington', slug: 'wellington' },
  { name: 'Boynton Beach', slug: 'boynton-beach' }
];

const FEATURED_SERVICE_SLUGS = [
  'office-cleaning',
  'medical-office-cleaning',
  'short-term-rentals',
  'home-maintenance',
  'post-construction-cleaning'
];

const FEATURED_BLOG_SLUGS = [
  'revitalize-your-office-space',
  'post-construction-cleaning-guide',
  'high-quality-cleaning-services-south-florida',
  'office-cleaning-made-easy',
  'complete-guide-to-home-cleaning'
];

const FOOTER_SERVICE_HUBS = [
  { name: 'Jupiter', slug: 'jupiter' },
  { name: 'West Palm Beach', slug: 'west-palm-beach' },
  { name: 'Boca Raton', slug: 'boca-raton' },
  { name: 'Delray Beach', slug: 'delray-beach' },
  { name: 'Boynton Beach', slug: 'boynton-beach' },
  { name: 'Broward County', slug: 'broward-county' },
  { name: 'Miami-Dade County', slug: 'miami-dade-county' }
];

const COMMERCIAL_PARTNERS = [
  { name: "Chili's Grill & Bar", logo: '/assets/images/clients/chillis.jpg' },
  { name: 'LongHorn Steakhouse', logo: '/assets/images/clients/longhorn.jpg' },
  { name: 'Romano’s Macaroni Grill', logo: '/assets/images/clients/macaroni.jpg' },
  { name: 'Lime Fresh Mexican Grill', logo: '/assets/images/clients/limegrill.jpg' },
  { name: 'Journeys Retail Stores', logo: '/assets/images/clients/journeys.jpg' }
];

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildStaticRouteJsonLd(routePath: string, meta: RouteSeoMeta): string | null {
  if (meta.schemaType === 'ErrorPage' || routePath === '/404' || !SEO_ROUTES_MAP[routePath]) {
    return null;
  }

  if (routePath.startsWith('/blog/')) {
    const slug = routePath.replace('/blog/', '');
    const blogSchema = getBlogPostSchema(slug);
    return blogSchema
      ? JSON.stringify(blogSchema, null, 2).replace(/<\/script/gi, '<\\/script')
      : null;
  }

  const baseBusiness = {
    '@type': 'CleaningService',
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS_NAP.name,
    legalName: BUSINESS_NAP.legalName,
    url: `${SITE_URL}/`,
    telephone: '+1-561-704-5303',
    email: BUSINESS_NAP.email,
    priceRange: BUSINESS_NAP.priceRange,
    image: `${SITE_URL}/assets/images/hero/video-poster-2.jpeg`,
    sameAs: [BUSINESS_NAP.facebookUrl],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: BUSINESS_NAP.ratingScore,
      reviewCount: '104',
      bestRating: '5'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS_NAP.addressLocality,
      addressRegion: BUSINESS_NAP.addressRegion,
      addressCountry: BUSINESS_NAP.addressCountry
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '07:00',
        closes: '20:00'
      }
    ],
    areaServed: BUSINESS_NAP.areasServed.map((name) => ({
      '@type': 'Place',
      name
    }))
  };

  const promoVideoNodes = PROMO_VIDEOS.slice(0, 2).map((video) => ({
    '@type': 'VideoObject',
    '@id': `${SITE_URL}/#${video.id}`,
    name: `${BUSINESS_NAP.name} — ${video.title}`,
    description: video.description,
    thumbnailUrl: `${SITE_URL}${video.poster}`,
    contentUrl: `${SITE_URL}${video.src}`,
    uploadDate: '2023-05-15T12:00:00Z',
    publisher: { '@id': `${SITE_URL}/#organization` }
  }));

  let graphObj: Record<string, unknown>;

  if (routePath === '/') {
    graphObj = {
      '@context': 'https://schema.org',
      '@graph': [
        baseBusiness,
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: `${SITE_URL}/`,
          name: BUSINESS_NAP.name,
          publisher: { '@id': `${SITE_URL}/#organization` }
        },
        ...promoVideoNodes
      ]
    };
  } else if (routePath === '/faqs') {
    graphObj = {
      '@context': 'https://schema.org',
      '@graph': [
        baseBusiness,
        {
          '@type': 'FAQPage',
          '@id': `${meta.canonical}#faqpage`,
          url: meta.canonical,
          name: meta.title,
          description: meta.description,
          mainEntity: FAQS_LIST.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        }
      ]
    };
  } else if (routePath.startsWith('/service/')) {
    const slug = routePath.replace('/service/', '');
    const service = SERVICES_CATALOG.find((s) => s.slug === slug);
    if (service) {
      graphObj = {
        '@context': 'https://schema.org',
        '@graph': [
          baseBusiness,
          {
            '@type': 'Service',
            '@id': `${meta.canonical}#service`,
            name: service.title,
            description: service.fullDesc,
            url: meta.canonical,
            image: `${SITE_URL}${service.image}`,
            serviceType: service.title,
            provider: { '@id': `${SITE_URL}/#organization` },
            areaServed: baseBusiness.areaServed
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'All Services', item: `${SITE_URL}/service` },
              { '@type': 'ListItem', position: 3, name: service.title, item: meta.canonical }
            ]
          }
        ]
      };
    } else {
      graphObj = { '@context': 'https://schema.org', '@graph': [baseBusiness] };
    }
  } else if (routePath === '/our-services' || routePath === '/service') {
    graphObj = {
      '@context': 'https://schema.org',
      '@graph': [
        baseBusiness,
        {
          '@type': 'CollectionPage',
          '@id': `${meta.canonical}#collection`,
          url: meta.canonical,
          name: meta.title,
          description: meta.description,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: SERVICES_CATALOG.map((svc, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: svc.title,
              url: `${SITE_URL}/service/${svc.slug}`
            }))
          }
        }
      ]
    };
  } else if (routePath === '/our-publications') {
    graphObj = {
      '@context': 'https://schema.org',
      '@graph': [
        baseBusiness,
        {
          '@type': 'CollectionPage',
          '@id': `${meta.canonical}#publications`,
          url: meta.canonical,
          name: meta.title,
          description: meta.description,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: BLOG_POSTS.map((post, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: post.title,
              url: `${SITE_URL}/blog/${post.slug}`
            }))
          }
        }
      ]
    };
  } else if (routePath === '/about-us' || routePath === '/contact-us') {
    const pageType = routePath === '/about-us' ? 'AboutPage' : 'ContactPage';
    graphObj = {
      '@context': 'https://schema.org',
      '@graph': [
        baseBusiness,
        {
          '@type': pageType,
          '@id': `${meta.canonical}#webpage`,
          url: meta.canonical,
          name: meta.title,
          description: meta.description,
          about: { '@id': `${SITE_URL}/#organization` }
        },
        ...(routePath === '/about-us' ? promoVideoNodes : [])
      ]
    };
  } else if (routePath === '/service-areas') {
    graphObj = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['CleaningService', 'LocalBusiness'],
          '@id': `${SITE_URL}/#localbusiness`,
          name: BUSINESS_NAP.name,
          image: `${SITE_URL}/assets/images/hero/video-poster-2.jpeg`,
          telephone: BUSINESS_NAP.phone,
          email: BUSINESS_NAP.email,
          priceRange: BUSINESS_NAP.priceRange,
          url: `${SITE_URL}/service-areas`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: BUSINESS_NAP.addressLocality,
            addressRegion: BUSINESS_NAP.addressRegion,
            postalCode: '33435',
            addressCountry: BUSINESS_NAP.addressCountry
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 26.5256,
            longitude: -80.0664
          },
          areaServed: [
            { '@type': 'AdministrativeArea', name: 'Palm Beach County' },
            { '@type': 'AdministrativeArea', name: 'Broward County' },
            { '@type': 'AdministrativeArea', name: 'Miami-Dade County' }
          ]
        },
        {
          '@type': 'CollectionPage',
          '@id': `${SITE_URL}/service-areas#webpage`,
          name: 'South Florida Cleaning Concepts Service Areas Directory',
          description: meta.description,
          url: `${SITE_URL}/service-areas`,
          mainEntity: {
            '@type': 'ItemList',
            name: 'South Florida Cleaning Concepts Service Locations',
            numberOfItems: serviceAreas.length,
            itemListElement: serviceAreas.map((area, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: `${area.name}, FL`,
              url: `${SITE_URL}/service-area/${area.slug}`
            }))
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${SITE_URL}/service-areas#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Service Areas', item: `${SITE_URL}/service-areas` }
          ]
        }
      ]
    };
  } else if (routePath.startsWith('/service-area/')) {
    const slug = routePath.replace('/service-area/', '');
    const area = Object.prototype.hasOwnProperty.call(serviceAreasBySlug, slug)
      ? serviceAreasBySlug[slug]
      : undefined;
    if (area) {
      const parsedLat = area.geo ? Number(area.geo.latitude) : NaN;
      const parsedLng = area.geo ? Number(area.geo.longitude) : NaN;
      const latitude = Number.isFinite(parsedLat) ? parsedLat : 26.7153;
      const longitude = Number.isFinite(parsedLng) ? parsedLng : -80.0534;
      const coreServices = getServiceAreaCoreServices(area.name);
      const areaFaqs = getServiceAreaFaqs(area.name);
      const canonicalAreaUrl = `${SITE_URL}/service-area/${area.slug}`;

      graphObj = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            '@id': `${canonicalAreaUrl}#service`,
            name: `Professional Commercial & Residential Cleaning in ${area.name}, FL`,
            serviceType: 'CleaningService',
            description: area.description,
            provider: {
              '@type': 'LocalBusiness',
              '@id': `${SITE_URL}/#localbusiness`,
              name: BUSINESS_NAP.name,
              telephone: BUSINESS_NAP.phone,
              email: BUSINESS_NAP.email,
              url: `${SITE_URL}/`,
              address: {
                '@type': 'PostalAddress',
                addressLocality: BUSINESS_NAP.addressLocality,
                addressRegion: BUSINESS_NAP.addressRegion,
                postalCode: '33435',
                addressCountry: BUSINESS_NAP.addressCountry
              }
            },
            areaServed: {
              '@type': 'City',
              name: area.name,
              containedInPlace: { '@type': 'State', name: 'Florida' },
              geo: { '@type': 'GeoCoordinates', latitude, longitude }
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: `Commercial & Residential Cleaning Services in ${area.name}`,
              itemListElement: coreServices.map((division) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: division.title,
                  description: division.shortDesc
                }
              }))
            }
          },
          {
            '@type': ['CleaningService', 'LocalBusiness'],
            '@id': `${canonicalAreaUrl}#local-service`,
            name: `${BUSINESS_NAP.name} - ${area.name}`,
            image: `${SITE_URL}/assets/images/hero/video-poster-2.jpeg`,
            telephone: BUSINESS_NAP.phone,
            email: BUSINESS_NAP.email,
            priceRange: BUSINESS_NAP.priceRange,
            url: canonicalAreaUrl,
            address: {
              '@type': 'PostalAddress',
              addressLocality: area.name,
              addressRegion: 'FL',
              addressCountry: 'US'
            },
            geo: { '@type': 'GeoCoordinates', latitude, longitude },
            areaServed: {
              '@type': 'City',
              name: area.name,
              containedInPlace: { '@type': 'State', name: 'Florida' },
              geo: { '@type': 'GeoCoordinates', latitude, longitude }
            },
            description: area.description
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${canonicalAreaUrl}#breadcrumb`,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Service Areas', item: `${SITE_URL}/service-areas` },
              { '@type': 'ListItem', position: 3, name: `${area.name}, FL`, item: canonicalAreaUrl }
            ]
          },
          {
            '@type': 'FAQPage',
            '@id': `${canonicalAreaUrl}#faq`,
            mainEntity: areaFaqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a }
            }))
          }
        ]
      };
    } else {
      graphObj = { '@context': 'https://schema.org', '@graph': [baseBusiness] };
    }
  } else {
    graphObj = { '@context': 'https://schema.org', '@graph': [baseBusiness] };
  }

  return JSON.stringify(graphObj, null, 2).replace(/<\/script/gi, '<\\/script');
}

function getGlobalCtaCopy(routePath: string) {
  const cleanPath = routePath.toLowerCase();
  if (cleanPath.startsWith('/about-us')) {
    return {
      kicker: 'Family-Owned Since 2004',
      title: 'Ready to Come Home to a Spotless Space?',
      subtitle:
        'Discover why hundreds of South Florida families and local workplaces welcome our vetted team back every week—backed 100% by our Love Your Clean or Don’t Pay Guarantee.'
    };
  }
  if (cleanPath === '/service-areas' || cleanPath.startsWith('/service-area/')) {
    return {
      kicker: '56 South Florida Communities',
      title: 'Spotless Local Cleaning in Your Neighborhood',
      subtitle:
        'Our nearby South Florida crews arrive on time from Jupiter to Miami with eco-safe supplies included, color-coded detailing, and transparent pricing with zero contracts.'
    };
  }
  if (cleanPath.startsWith('/our-services') || cleanPath === '/service' || cleanPath.startsWith('/service/')) {
    return {
      kicker: '10 Tailored Cleaning Services',
      title: 'Build a Custom Cleaning Plan Around Your Space',
      subtitle:
        'From recurring home care and same-day Airbnb turnovers to medical suites and overnight office cleaning, we bring all supplies and guarantee every single visit.'
    };
  }
  if (cleanPath.startsWith('/our-publications') || cleanPath.startsWith('/blog')) {
    return {
      kicker: 'Skip Weekend Scrubbing',
      title: 'Let Our Friendly Local Pros Handle the Clean',
      subtitle:
        'Put over 20 years of South Florida residential and commercial cleaning experience to work in your home, rental, or workplace—request a fast quote in minutes.'
    };
  }
  return {
    kicker: 'Family-Owned Since 2004',
    title: 'Ready for a Spotless South Florida Space?',
    subtitle:
      'For over 20 years, South Florida families and businesses have trusted our friendly, vetted crews to show up on time with eco-safe supplies and our Love Your Clean or Don’t Pay Guarantee.'
  };
}

function renderStandardHeader(): string {
  return `
    <header class="site-header">
      <nav class="desktop-nav" aria-label="Main Navigation">
        <a href="/" class="brand-logo" aria-label="South Florida Cleaning Concepts Home">
          <img src="/assets/images/logo/logo.svg" alt="South Florida Cleaning Concepts Logo" width="112" height="56" />
        </a>
        <ul class="nav-list">
          <li><a href="/" class="nav-link">Home</a></li>
          <li><a href="/about-us" class="nav-link">About Us</a></li>
          <li>
            <a href="/our-services" class="nav-link">Services</a>
            <div class="nav-dropdown">
              <ul>
                ${SERVICES_CATALOG.map((svc) => `<li><a href="/service/${svc.slug}">${escapeHtml(svc.title)}</a></li>`).join('')}
                <li><a href="/service">Compare All Services &rarr;</a></li>
              </ul>
            </div>
          </li>
          <li>
            <a href="/service-areas" class="nav-link">Service Areas</a>
            <div class="nav-dropdown">
              <ul>
                ${HEADER_AREA_HUBS.map((city) => `<li><a href="/service-area/${city.slug}">${escapeHtml(city.name)}, FL</a></li>`).join('')}
                <li><a href="/service-areas">All 56 Areas</a></li>
              </ul>
            </div>
          </li>
          <li><a href="/faqs" class="nav-link">FAQs</a></li>
          <li><a href="/our-publications" class="nav-link">Publications</a></li>
          <li><a href="/contact-us" class="nav-link">Contact</a></li>
        </ul>
        <div class="header-cta">
          <a href="tel:${BUSINESS_NAP.phoneRaw}" class="btn btn-phone">${BUSINESS_NAP.phone}</a>
          <a href="/contact-us" class="btn btn-primary">Free Quote</a>
        </div>
      </nav>
      <div class="mobile-controls">
        <a href="tel:${BUSINESS_NAP.phoneRaw}" class="mobile-call-btn" aria-label="Call South Florida Cleaning Concepts">Call</a>
        <button type="button" data-react-managed="true" class="mobile-nav-toggle" aria-expanded="false" aria-controls="mobile-nav-drawer" aria-label="Toggle navigation menu">Menu</button>
      </div>
    </header>`;
}

function renderDefaultDrawer(): string {
  return `
    <div class="mobile-nav-overlay" aria-hidden="true"></div>
    <aside id="mobile-nav-drawer" class="mobile-nav-drawer" aria-label="Mobile Navigation Drawer">
      <div class="drawer-header">
        <a href="/" class="brand-logo" aria-label="South Florida Cleaning Concepts Home">
          <img src="/assets/images/logo/logo.svg" alt="South Florida Cleaning Concepts Logo" width="160" height="80" />
        </a>
        <button type="button" class="drawer-close-btn" aria-label="Close navigation menu">Close</button>
      </div>
      <nav class="drawer-nav" aria-label="Mobile Navigation">
        <ul class="drawer-nav-list">
          <li><a href="/" class="nav-link">Home</a></li>
          <li><a href="/about-us" class="nav-link">About Us</a></li>
          <li>
            <button type="button" class="mobile-accordion-toggle" aria-expanded="false">Our Services</button>
            <ul class="mobile-accordion-content">
              <li><a href="/our-services" class="drawer_sub_link">All Services Overview &rarr;</a></li>
              ${SERVICES_CATALOG.map((svc) => `<li><a href="/service/${svc.slug}" class="drawer_sub_link">${escapeHtml(svc.title)}</a></li>`).join('')}
              <li><a href="/service" class="drawer_sub_link">Compare All Services &rarr;</a></li>
            </ul>
          </li>
          <li>
            <button type="button" class="mobile-accordion-toggle" aria-expanded="false">Service Areas</button>
            <ul class="mobile-accordion-content">
              <li><a href="/service-areas" class="drawer_sub_link">All 56 Service Areas Overview &rarr;</a></li>
              ${HEADER_AREA_HUBS.map((city) => `<li><a href="/service-area/${city.slug}" class="drawer_sub_link">${escapeHtml(city.name)}, FL</a></li>`).join('')}
            </ul>
          </li>
          <li><a href="/faqs" class="nav-link">FAQs</a></li>
          <li><a href="/our-publications" class="nav-link">Publications</a></li>
          <li><a href="/contact-us" class="nav-link">Contact Us</a></li>
        </ul>
      </nav>
      <div class="drawer-footer">
        <a href="tel:${BUSINESS_NAP.phoneRaw}" class="btn btn-phone">Call ${BUSINESS_NAP.phone}</a>
        <a href="/contact-us" class="btn btn-primary">Get Free Quote</a>
      </div>
    </aside>`;
}

function renderStaticGlobalCta(routePath: string): string {
  if (routePath === '/404' || routePath === '/contact-us' || routePath === '/contact') {
    return '';
  }
  const copy = getGlobalCtaCopy(routePath);
  return `
    <section class="global-cta global-cta-section" data-testid="global-cta" aria-labelledby="global-cta-heading" style="background: #071536; color: #ffffff; padding: 3.5rem 1rem; border-top: 1px solid rgba(51, 65, 85, 0.8);">
      <div class="container" style="max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.15); font-size: 0.75rem;">
          <strong style="color: #ffffff;">South Florida Coverage</strong>
          <span style="color: #a3e6be;">Palm Beach, Broward &amp; Miami-Dade</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; align-items: center; margin-bottom: 2rem;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #4fd18b; margin-bottom: 0.5rem;">${escapeHtml(copy.kicker)}</div>
            <h2 id="global-cta-heading" style="font-size: 2rem; font-weight: 800; line-height: 1.15; color: #ffffff; margin-bottom: 0.75rem;">${escapeHtml(copy.title)}</h2>
            <p style="font-size: 1rem; line-height: 1.6; color: #cbd5e1; margin: 0;">${escapeHtml(copy.subtitle)}</p>
          </div>
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 1rem; padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.15); font-size: 0.75rem;">
              <span style="color: #a3e6be; font-weight: 700; text-transform: uppercase;">Free, Honest Quotes</span>
              <span style="color: #cbd5e1;">No Contracts</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <a href="/contact-us" class="btn btn-primary" style="display: block; padding: 0.9rem 1.25rem; border-radius: 0.75rem; background: #12582e; color: #ffffff; font-weight: 700; text-align: center; text-decoration: none;">Get My Free Quote &rarr;</a>
              <a href="tel:${BUSINESS_NAP.phoneRaw}" class="btn btn-phone" style="display: block; padding: 0.85rem 1.25rem; border-radius: 0.75rem; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.25); color: #ffffff; font-weight: 700; text-align: center; text-decoration: none;">Call ${BUSINESS_NAP.phone}</a>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.85rem; font-size: 0.75rem;">
              <a href="/our-services" style="color: #a3e6be; font-weight: 600; text-decoration: none;">Browse All 10 Services &rarr;</a>
              <a href="/service-areas" style="color: #cbd5e1; text-decoration: none;">See All 56 Cities &rarr;</a>
            </div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; padding-top: 1.25rem; border-top: 1px solid rgba(255, 255, 255, 0.15); font-size: 0.85rem; font-weight: 600; color: #ffffff;">
          <span>Licensed &amp; Insured</span>
          <span>Love Your Clean or Don’t Pay</span>
          <span>Flexible Scheduling</span>
          <span>Kid &amp; Pet Safe</span>
        </div>
      </div>
    </section>`;
}

function renderStandardFooter(): string {
  const featuredServices = FEATURED_SERVICE_SLUGS.map((slug) =>
    SERVICES_CATALOG.find((svc) => svc.slug === slug)
  ).filter((svc): svc is NonNullable<typeof svc> => Boolean(svc));

  const featuredGuides = FEATURED_BLOG_SLUGS.map((slug) =>
    BLOG_POSTS.find((post) => post.slug === slug)
  ).filter((post): post is NonNullable<typeof post> => Boolean(post));

  return `
    <footer class="site-footer" style="background: #071536; color: #ffffff; padding: 3rem 1rem 4rem;">
      <div class="container" style="max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; padding-bottom: 1.5rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.12); font-size: 0.875rem;">
          <strong>Family-Owned Since 2004</strong>
          <span>Palm Beach, Broward &amp; Miami-Dade</span>
          <span>${BUSINESS_NAP.ratingScore}★ Rated Local Pros</span>
          <a href="tel:${BUSINESS_NAP.phoneRaw}" style="color: #ffffff; font-weight: 700;">Call ${BUSINESS_NAP.phone}</a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.12);">
          <div>
            <a href="/" aria-label="South Florida Cleaning Concepts Home">
              <img src="/assets/images/logo/logo.svg" alt="South Florida Cleaning Concepts Logo" width="180" height="45" />
            </a>
            <p style="font-size: 0.875rem; color: #cbd5e1;">Family-owned since 2004, delivering vetted residential and commercial cleaning across South Florida.</p>
            <ul style="list-style: none; padding: 0; font-size: 0.875rem; color: #cbd5e1;">
              <li><a href="tel:${BUSINESS_NAP.phoneRaw}" style="color: #ffffff;">${BUSINESS_NAP.phone}</a></li>
              <li><a href="mailto:${BUSINESS_NAP.email}" style="color: #cbd5e1;">${BUSINESS_NAP.email}</a></li>
              <li>${BUSINESS_NAP.addressLocality}, ${BUSINESS_NAP.addressRegion} 33435</li>
              <li>${escapeHtml(BUSINESS_NAP.hours)}</li>
              <li><a href="${BUSINESS_NAP.facebookUrl}" target="_blank" rel="noopener noreferrer" style="color: #a3e6be;">Facebook (${BUSINESS_NAP.facebookHandle})</a></li>
            </ul>
          </div>
          <div>
            <h2 style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em;">Quick Links</h2>
            <ul style="list-style: none; padding: 0; font-size: 0.875rem;">
              <li><a href="/" style="color: #cbd5e1;">Home</a></li>
              <li><a href="/about-us" style="color: #cbd5e1;">About Us</a></li>
              <li><a href="/our-services" style="color: #cbd5e1;">Services</a></li>
              <li><a href="/service-areas" style="color: #cbd5e1;">Service Areas</a></li>
              <li><a href="/faqs" style="color: #cbd5e1;">FAQs</a></li>
              <li><a href="/our-publications" style="color: #cbd5e1;">Guides</a></li>
              <li><a href="/about-us#careers" style="color: #cbd5e1;">${escapeHtml(BUSINESS_NAP.careersHeadline)}</a></li>
              <li><a href="/contact-us" style="color: #a3e6be;">Free Quote &rarr;</a></li>
            </ul>
          </div>
          <div>
            <h2 style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em;">Popular Services</h2>
            <ul style="list-style: none; padding: 0; font-size: 0.875rem;">
              ${featuredServices.map((svc) => `<li><a href="/service/${svc.slug}" style="color: #cbd5e1;">${escapeHtml(svc.title)}</a></li>`).join('')}
              <li><a href="/our-services" style="color: #a3e6be;">All 10 Services &rarr;</a></li>
            </ul>
          </div>
          <div>
            <h2 style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em;">Our Guarantee</h2>
            <p style="font-size: 0.875rem; font-weight: 700;">Love Your Clean or Don’t Pay</p>
            <p style="font-size: 0.75rem; color: #cbd5e1;">Not 100% thrilled? Tell us within 24 hours for a free re-clean—or don’t pay.</p>
          </div>
        </div>
        <div style="padding: 1.25rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.12); font-size: 0.75rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Featured Guides</span>
            <a href="/our-publications" style="color: #a3e6be;">All Guides &rarr;</a>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
            ${featuredGuides.map((post) => `<a href="/blog/${post.slug}" style="color: #cbd5e1;">${escapeHtml(post.title)}</a>`).join('')}
          </div>
        </div>
        <div style="padding: 1.25rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.12); font-size: 0.75rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Service Areas (56 Locations)</span>
            <a href="/service-areas" style="color: #a3e6be;">All 56 Cities &rarr;</a>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
            ${FOOTER_SERVICE_HUBS.map((city) => `<a href="/service-area/${city.slug}" style="color: #cbd5e1;">${escapeHtml(city.name)}</a>`).join('')}
          </div>
        </div>
        <div style="padding-top: 1.25rem; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; font-size: 0.75rem; color: #94a3b8;">
          <p style="margin: 0;">&copy; 2026 ${escapeHtml(BUSINESS_NAP.legalName)}. Licensed &amp; Insured.</p>
          <div style="display: flex; gap: 1rem;">
            <a href="/contact-us" style="color: #94a3b8;">Privacy &amp; Terms</a>
            <a href="/sitemap.xml" style="color: #94a3b8;">Sitemap</a>
            <a href="/robots.txt" style="color: #94a3b8;">Robots.txt</a>
          </div>
        </div>
      </div>
    </footer>`;
}

function renderHomeMain(): string {
  const recentPosts = BLOG_POSTS.slice(0, 3);
  return `
    <main id="main-content">
      <section class="hero-banner" style="overflow: hidden; position: relative; background: #071536; color: #ffffff; padding: 3.5rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div>Family-Owned Since 2004 · Tri-County South Florida</div>
          <h1>South Florida Commercial &amp; Residential Cleaning <span style="color: #a3e6be;">Pros</span></h1>
          <p>Spotless homes, vacation rentals, and workplaces across Palm Beach, Broward, and Miami-Dade—backed by our Love Your Clean or Don’t Pay Guarantee.</p>
          <ul>
            <li>Love-It Guarantee</li>
            <li>Eco-Safe Supplies Included</li>
            <li>Upfront, Honest Pricing</li>
            <li>Vetted, Insured Pros</li>
          </ul>
          <a href="/contact-us#quote" class="btn btn-primary">Book My Free Quote</a>
          <a href="tel:${BUSINESS_NAP.phoneRaw}" class="btn btn-phone">Call ${BUSINESS_NAP.phone}</a>
          <div>
            <h2>Get Your Free Quote</h2>
            <p>Fast local reply with transparent pricing.</p>
          </div>
          <div>
            <span>20+ Years South Florida Owned</span>
            <span>100% Satisfaction Guarantee</span>
            <span>10 Services Homes &amp; Businesses</span>
            <span>Same-Day Local Quotes</span>
          </div>
        </div>
      </section>

      <section class="trust-badges-section" aria-label="Trust and Reliability Badges">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 2.5rem 1rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem;">
            ${TRUST_BADGES.map((badge) => `
            <div>
              <h3>${escapeHtml(badge.title)}</h3>
              <p>${escapeHtml(badge.description)}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="services-overview-heading">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 2.5rem 1rem;">
          <div>Homes, Rentals &amp; Workplaces</div>
          <h2 id="services-overview-heading">10 Specialized South Florida Cleaning Services</h2>
          <p>Tailored residential, hospitality, and commercial plans with supplies included.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            ${SERVICES_CATALOG.map((svc) => `
            <article class="service-card">
              <img src="${svc.image}" alt="${escapeHtml(SERVICE_IMAGE_ALTS[svc.slug] || svc.shortDesc)}" width="600" height="400" loading="lazy" />
              <h3><a href="/service/${svc.slug}">${escapeHtml(svc.title)}</a></h3>
              <p>${escapeHtml(svc.shortDesc)}</p>
              <a href="/service/${svc.slug}">Service Details &rarr;</a>
            </article>`).join('')}
          </div>
          <p>Need a custom checklist? <a href="/our-services">View All Services &rarr;</a></p>
        </div>
      </section>

      <section class="section" data-testid="promo-video-showcase" aria-labelledby="promo-video-heading">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 2.5rem 1rem;">
          <div>Crew in Action</div>
          <h2 id="promo-video-heading">See Our South Florida Team in Action</h2>
          <p>Real residential, deep-clean, and commercial footage across Palm Beach, Broward, and Miami-Dade. ${BUSINESS_NAP.ratingScore} Stars · ${escapeHtml(BUSINESS_NAP.reviewCountLabel)} · 12% Online Savings</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
            ${PROMO_VIDEOS.map((video) => `
            <article>
              <img src="${video.poster}" alt="${escapeHtml(VIDEO_POSTER_ALTS[video.id] || video.subtitle)}" width="400" height="240" loading="lazy" />
              <h3>${escapeHtml(video.title)}</h3>
              <p>${escapeHtml(video.description)}</p>
            </article>`).join('')}
          </div>
          <div>
            <h3>${escapeHtml(BUSINESS_NAP.websiteDiscountHeadline)}</h3>
            <p>${escapeHtml(BUSINESS_NAP.websiteDiscountDetail)}</p>
            <a href="/contact-us#quote" class="btn btn-primary">Claim 12% Discount &rarr;</a>
            <a href="tel:${BUSINESS_NAP.phoneRaw}">Call ${BUSINESS_NAP.phone}</a>
          </div>
        </div>
      </section>

      <section class="rotation-system-section" aria-labelledby="rotation-heading">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 2.5rem 1rem;">
          <div>Included at No Extra Charge</div>
          <h2 id="rotation-heading">How Our 4-Step Rotation Clean Works</h2>
          <p>Every visit cleans your whole home while rotating deep detail work room by room.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            ${ROTATION_SYSTEM_STEPS.map((step) => `
            <div>
              <span>Step 0${escapeHtml(step.step)}</span>
              <h3>${escapeHtml(step.title)}</h3>
              <p>${escapeHtml(step.description)}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>

      <section class="testimonials-section" aria-labelledby="testimonials-heading">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 2.5rem 1rem;">
          <div>${BUSINESS_NAP.ratingScore} Stars · ${escapeHtml(BUSINESS_NAP.reviewCountLabel)}</div>
          <h2 id="testimonials-heading">What South Florida Clients Say</h2>
          <p>Feedback from local homeowners, Airbnb hosts, and business owners.</p>
          <div>
            ${CLIENT_TESTIMONIALS.map((t) => `
            <blockquote>
              <p>&ldquo;${escapeHtml(t.quote)}&rdquo;</p>
              <cite style="display: block; font-style: normal;">${escapeHtml(t.author)} — ${escapeHtml(t.role)} · ${escapeHtml(t.location)}</cite>
            </blockquote>`).join('')}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
            ${COMMERCIAL_PARTNERS.map((p) => `
            <div>
              <img src="${p.logo}" alt="${escapeHtml(p.name)} logo" width="48" height="48" loading="lazy" />
              <span>${escapeHtml(p.name)}</span>
            </div>`).join('')}
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="home-faq-heading">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 2.5rem 1rem;">
          <div>Quick Answers</div>
          <h2 id="home-faq-heading">Frequently Asked Questions</h2>
          <p>Details on our 4-Step Rotation System, eco-safe supplies, and guarantee.</p>
          ${FAQS_LIST.map((faq) => `
          <div>
            <h3>${escapeHtml(faq.question)}</h3>
            <p>${escapeHtml(faq.answer)}</p>
          </div>`).join('')}
        </div>
      </section>

      <section class="section" aria-labelledby="recent-blog-heading">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 2.5rem 1rem;">
          <div class="section-header">
            <span>Fresh Tips for a Happier Home</span>
            <h2 id="recent-blog-heading">Helpful Cleaning Tips &amp; Home Care Guides</h2>
            <p>Simple, practical advice to keep your home, vacation rental, or workplace fresh between visits—straight from our local South Florida team.</p>
          </div>
          <div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
            ${recentPosts.map((post) => `
            <article class="card">
              <a href="/blog/${post.slug}" aria-label="Read article: ${escapeHtml(post.title)}">
                <img src="${post.image}" alt="${escapeHtml(post.title)}" width="600" height="375" loading="lazy" />
              </a>
              <span>${escapeHtml(post.category)} · ${escapeHtml(post.date)} · ${escapeHtml(post.readTime)}</span>
              <h3><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a></h3>
              <p>${escapeHtml(post.summary)}</p>
              <a href="/blog/${post.slug}">Read Full Article &rarr;</a>
            </article>`).join('')}
          </div>
          <div style="margin-top: 1.5rem;">
            <a href="/our-publications" class="btn btn-primary">View All Articles &rarr;</a>
          </div>
        </div>
      </section>
    </main>`;
}

function renderAboutMain(): string {
  return `
    <main id="main-content">
      <section class="hero-section" aria-label="About Us Header" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>About Us</span></nav>
          <span>Family-Owned Since 2004 · South Florida</span>
          <h1>About Us</h1>
          <p>Family-owned since 2004, helping South Florida homes, rentals, and businesses stay spotless—backed by our Love Your Clean or Don’t Pay Guarantee.</p>
        </div>
      </section>

      <section class="section" aria-labelledby="story-heading" style="padding: 3rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div>Our Family Story</div>
          <h2 id="story-heading">20+ Years of Trusted South Florida Cleaning</h2>
          <p>Founded in Boynton Beach in 2004, South Florida Cleaning Concepts built its reputation on treating every home, rental, and workplace like our own. Our full-time, background-checked, insured team brings eco-safe supplies and never sends random contractors.</p>
          <p>Every visit includes our <strong>Love Your Clean or Don’t Pay Guarantee</strong>: let us know within 24 hours if anything falls short and we’ll re-clean it free—or you don’t pay.</p>
          <div>
            <span>20+ Years in Business</span>
            <span>100% Happy Home Pledge</span>
            <span>3 Counties Local Coverage</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
            <img src="/assets/images/about/about-us-img-5.jpg" alt="Uniformed South Florida Cleaning Concepts crew members prepared for service" width="800" height="600" loading="lazy" />
            <img src="/assets/images/about/about-us-img-7.jpg" alt="Color-coded microfiber cloths and eco-safe sanitization supplies" width="500" height="400" loading="lazy" />
          </div>
          <div>50-Point Quality Check: Every clean passes our 50-point inspection checklist before we lock up.</div>
        </div>
      </section>

      <section class="section" aria-labelledby="about-video-heading" style="padding: 2.5rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <h2 id="about-video-heading">See Our South Florida Team in Action</h2>
          <p>${BUSINESS_NAP.ratingScore} Stars · ${escapeHtml(BUSINESS_NAP.reviewCountLabel)} · ${escapeHtml(BUSINESS_NAP.websiteDiscountHeadline)}</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            ${PROMO_VIDEOS.map((video) => `
            <div>
              <img src="${video.poster}" alt="${escapeHtml(VIDEO_POSTER_ALTS[video.id] || video.subtitle)}" width="400" height="240" loading="lazy" />
              <h3>${escapeHtml(video.title)}</h3>
              <p>${escapeHtml(video.description)}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>

      <section id="careers" data-testid="careers-hiring-section" class="section" aria-labelledby="about-careers-heading" style="padding: 3rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div>Careers · Palm Beach, Broward &amp; Miami-Dade</div>
          <h2 id="about-careers-heading">${escapeHtml(BUSINESS_NAP.careersHeadline)} Join Our Friendly Cleaning Crew</h2>
          <p>${escapeHtml(BUSINESS_NAP.careersDescription)}</p>
          <ul>
            <li>Competitive Pay &amp; Tips</li>
            <li>Flexible Local Routes</li>
            <li>Family-Owned Culture</li>
          </ul>
          <a href="/contact-us#careers" class="btn btn-primary">Apply for Openings &rarr;</a>
          <a href="mailto:${BUSINESS_NAP.email}?subject=Careers%20Inquiry%20-%20South%20Florida%20Cleaning%20Concepts">Email: ${BUSINESS_NAP.email}</a>
        </div>
      </section>
    </main>`;
}

function renderServicesOverviewMain(): string {
  return `
    <main id="main-content">
      <section class="hero-section" aria-label="Services Overview Header" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Our Services</span></nav>
          <span>10 Specialized Plans · South Florida</span>
          <h1>Cleaning Services for Your Home, Rental &amp; Workplace</h1>
          <p>Tailored cleaning plans for South Florida homes, vacation rentals, and workplaces—all supplies included and 100% guaranteed.</p>
        </div>
      </section>

      <section class="section" aria-labelledby="catalog-heading" style="padding: 3rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div>Home &amp; Commercial Plans</div>
          <h2 id="catalog-heading">Choose the Clean That Fits Your Space</h2>
          <p>Background-checked crews, eco-safe supplies, and our Love Your Clean or Don’t Pay Guarantee.</p>
          <div style="display: grid; gap: 2rem;">
            ${SERVICES_CATALOG.map((svc) => `
            <article class="service-detail-card">
              <img src="${svc.image}" alt="${escapeHtml(SERVICE_IMAGE_ALTS[svc.slug] || svc.shortDesc)}" width="800" height="600" loading="lazy" />
              <h3><a href="/service/${svc.slug}">${escapeHtml(svc.title)}</a></h3>
              <p>${escapeHtml(svc.shortDesc)}</p>
              <ul>
                ${svc.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}
              </ul>
              <div>
                <a href="/service/${svc.slug}" class="btn btn-primary">See Full Checklist &rarr;</a>
                <a href="/contact-us" class="btn btn-outline">Free Quote</a>
              </div>
            </article>`).join('')}
          </div>
        </div>
      </section>
    </main>`;
}

function renderServiceDirectoryMain(): string {
  return `
    <main id="main-content">
      <section class="hero-section" aria-label="Directory Header" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Services Directory</span></nav>
          <span>All 10 Cleaning Services</span>
          <h1>Commercial &amp; Residential Services Directory</h1>
          <p>Compare all 10 residential and commercial cleaning plans across Palm Beach, Broward, and Miami-Dade counties.</p>
        </div>
      </section>

      <section class="section" aria-labelledby="directory-list-heading" style="padding: 3rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div>10 Specialized Plans</div>
          <h2 id="directory-list-heading">Browse All Cleaning Services</h2>
          <p>Select any service below to view its checklist and request a free quote.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            ${SERVICES_CATALOG.map((svc) => `
            <article>
              <img src="${svc.image}" alt="${escapeHtml(SERVICE_IMAGE_ALTS[svc.slug] || svc.shortDesc)}" width="500" height="300" loading="lazy" />
              <span>${svc.checklist.length}-Point Clean</span>
              <h3><a href="/service/${svc.slug}">${escapeHtml(svc.title)}</a></h3>
              <p>${escapeHtml(svc.shortDesc)}</p>
              <a href="/service/${svc.slug}">Service Details &rarr;</a>
            </article>`).join('')}
          </div>
        </div>
      </section>
    </main>`;
}

function renderServiceDetailMain(slug: string): string {
  const service = SERVICES_CATALOG.find((s) => s.slug === slug);
  if (!service) return renderNotFoundMain();

  const exactH1 = EXACT_H1_MAP[slug] || service.title;
  const serviceIndex = SERVICES_CATALOG.findIndex((s) => s.slug === service.slug) + 1;
  const formattedIndex = String(serviceIndex > 0 ? serviceIndex : 1).padStart(2, '0');
  const relatedServices = SERVICES_CATALOG.filter((s) => s.slug !== service.slug).slice(0, 3);

  return `
    <main id="main-content">
      <section class="hero-section" aria-label="${escapeHtml(exactH1)} Header" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/our-services">Our Services</a> / <span>${escapeHtml(exactH1)}</span></nav>
          <span>Service ${formattedIndex} · 100% Guaranteed</span>
          <h1>${escapeHtml(exactH1)}</h1>
          <p>${escapeHtml(service.shortDesc)}</p>
          <div>
            <span>Free Quote — Call or Text</span>
            <a href="tel:${BUSINESS_NAP.phoneRaw}">${BUSINESS_NAP.phone}</a>
            <span>Palm Beach · Broward · Miami-Dade</span>
          </div>
        </div>
      </section>

      <section class="section" style="padding: 3rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div>Service Overview</div>
          <h2>${escapeHtml(exactH1)} in South Florida</h2>
          <p>${escapeHtml(service.fullDesc)}</p>
          <img src="${service.image}" alt="${escapeHtml(exactH1)} in South Florida" width="800" height="500" loading="lazy" />

          <h3>What’s Included in Your ${escapeHtml(exactH1)}</h3>
          <ul>
            ${service.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}
          </ul>

          <h3>Why Choose Us for ${escapeHtml(exactH1)}</h3>
          <ul>
            ${service.benefits.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
          </ul>

          <h3>Inspection Checklist</h3>
          <ul>
            ${service.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>

          <div style="padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 1rem; margin-top: 2rem;">
            <h3>Get Your Free Quote</h3>
            <p>Request a fast, no-obligation quote online or call ${BUSINESS_NAP.phone}.</p>
            <a href="/contact-us#quote" class="btn btn-primary">Get My Free Quote</a>
            <p><strong>Love Your Clean or Don’t Pay</strong> — ${escapeHtml(BUSINESS_NAP.guarantee)}</p>
          </div>
        </div>
      </section>

      <section class="section" style="padding: 2rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <h2>${escapeHtml(exactH1)} Across Palm Beach, Broward &amp; Miami-Dade</h2>
          <div>
            ${HEADER_AREA_HUBS.map((city) => `<a href="/service-area/${city.slug}">${escapeHtml(city.name)}, FL</a>`).join(' · ')}
            · <a href="/service-areas">See All 56 Cities &rarr;</a>
          </div>
        </div>
      </section>

      <section class="section" style="padding: 2rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <h2>Related Cleaning Services</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
            ${relatedServices.map((rel) => `
            <div>
              <h3><a href="/service/${rel.slug}">${escapeHtml(rel.title)}</a></h3>
              <p>${escapeHtml(rel.shortDesc)}</p>
            </div>`).join('')}
          </div>
          <a href="/our-services">View All 10 Services &rarr;</a>
        </div>
      </section>
    </main>`;
}

function renderPublicationsMain(): string {
  return `
    <main id="main-content">
      <section class="hero-section" aria-label="Our Publications Header" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Our Publications</span></nav>
          <span>Tips &amp; Home Care Guides</span>
          <h1>Our Publications &amp; Cleaning Guides</h1>
          <p>Browse ${BLOG_POSTS.length} practical cleaning guides and checklists from our local South Florida team.</p>
        </div>
      </section>

      <section class="section" style="padding: 3rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            ${BLOG_POSTS.map((post, idx) => `
            <article>
              <a href="/blog/${post.slug}">
                <img src="${post.image}" alt="${escapeHtml(POST_IMAGE_ALTS[post.slug] || `${post.category} editorial cover photo`)}" width="600" height="400" loading="lazy" />
              </a>
              <span>ARTICLE ${String(idx + 1).padStart(2, '0')} · ${escapeHtml(post.category)} · ${escapeHtml(post.date)} · ${escapeHtml(post.readTime)}</span>
              <h2><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a></h2>
              <p>${escapeHtml(post.summary)}</p>
              <a href="/blog/${post.slug}">Read Guide &rarr;</a>
            </article>`).join('')}
          </div>
        </div>
      </section>
    </main>`;
}

function renderBlogPostMain(slug: string): string {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return renderNotFoundMain();

  const exactH1 = EXACT_BLOG_H1_MAP[slug] || post.title;
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const inlineImageIdx = Math.min(2, Math.max(1, Math.floor(post.sections.length / 3)));

  return `
    <main id="main-content">
      <section class="hero-section" aria-label="${escapeHtml(exactH1)} Header" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/our-publications">Our Publications</a> / <span>${escapeHtml(post.category)}</span></nav>
          <span>${escapeHtml(post.category)} · Cleaning Guide</span>
          <h1>${escapeHtml(exactH1)}</h1>
          <div>By South Florida Cleaning Concepts · ${escapeHtml(post.date)} · ${escapeHtml(post.readTime)}</div>
        </div>
      </section>

      <section class="section" style="padding: 3rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <article>
            <img src="${post.image}" alt="${escapeHtml(exactH1)}" width="900" height="500" loading="lazy" />
            <div>
              <strong>Quick Takeaway:</strong>
              <p>${escapeHtml(post.summary)}</p>
            </div>

            ${post.sections.map((section, idx) => `
            <div>
              <h2>${escapeHtml(section.heading)}</h2>
              ${section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
              ${section.bullets && section.bullets.length > 0 ? `<ul>${section.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}
            </div>
            ${post.inlineImage && idx === inlineImageIdx ? `<figure><img src="${post.inlineImage}" alt="${escapeHtml(exactH1)} - Detail" width="900" height="500" loading="lazy" /></figure>` : ''}`).join('')}

            <div style="margin-top: 2rem; padding: 1.5rem; background: #07111a; color: #fff; border-radius: 1rem;">
              <span>Ready for a Spotless Space?</span>
              <h3>Let our local pros handle your ${escapeHtml(getBlogCtaServicePhrase(post.category))}.</h3>
              <a href="/our-services" class="btn btn-primary">See Our Services &rarr;</a>
            </div>
          </article>

          <aside style="margin-top: 2rem;">
            <h2>Get Your Free Cleaning Quote</h2>
            <p>Request a fast estimate for your home or business.</p>
            <a href="/contact-us#quote" class="btn btn-primary">Get My Free Quote</a>
            <a href="tel:${BUSINESS_NAP.phoneRaw}">Call ${BUSINESS_NAP.phone}</a>
          </aside>
        </div>
      </section>

      <section class="section" style="padding: 2rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <h2>Related Cleaning Guides</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
            ${relatedPosts.map((rel) => `
            <div>
              <span>${escapeHtml(rel.category)} · ${escapeHtml(rel.readTime)}</span>
              <h3><a href="/blog/${rel.slug}">${escapeHtml(rel.title)}</a></h3>
              <p>${escapeHtml(rel.summary)}</p>
            </div>`).join('')}
          </div>
          <a href="/our-publications">View All Publications &rarr;</a>
        </div>
      </section>
    </main>`;
}

function renderContactMain(): string {
  return `
    <main id="main-content">
      <section class="hero-section" aria-label="Contact Us Header" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Contact Us</span></nav>
          <span>Fast Local Reply</span>
          <h1>Interested in Cleaning Services?</h1>
          <p>Request a free, no-obligation quote for your home, rental, or workplace across Palm Beach, Broward, and Miami-Dade counties.</p>
        </div>
      </section>

      <section class="section" style="padding: 3rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <div id="quote" class="quote-card-container">
            <div>Fast Online Booking · Save 12%</div>
            <h2>Get Your Free Cleaning Quote</h2>
            <p>Complete the 4 fields below to claim your 12% online booking discount.</p>
            <form
              id="lead-quote-form"
              name="quote-request"
              method="POST"
              action="/"
              data-netlify="true"
              netlify
              data-netlify-honeypot="bot-field"
              netlify-honeypot="bot-field"
              class="lead-form"
            >
              <input type="hidden" name="form-name" value="quote-request" />
              <input type="hidden" name="source" value="Contact Us Static" />
              <input type="hidden" name="page_url" value="/contact-us" />
              <p class="bot-field-container hidden" aria-hidden="true">
                <label>Do not fill this out: <input type="text" name="bot-field" tabindex="-1" autocomplete="off" /></label>
              </p>
              <div class="form-group">
                <label for="quote-name">Your Name *</label>
                <input type="text" id="quote-name" name="name" required placeholder="Jane Doe" autocomplete="name" />
              </div>
              <div class="form-group">
                <label for="quote-email">Email Address *</label>
                <input type="email" id="quote-email" name="email" required placeholder="you@email.com" autocomplete="email" />
              </div>
              <div class="form-group">
                <label for="quote-phone">Phone Number *</label>
                <input type="tel" id="quote-phone" name="phone" required placeholder="(561) 000-0000" autocomplete="tel" />
              </div>
              <div class="form-group">
                <label for="quote-message">How Can We Help You Shine? *</label>
                <textarea id="quote-message" name="message" rows="3" required placeholder="Tell us about your home or space..."></textarea>
              </div>
              <button type="submit" id="quote-submit-btn" class="btn btn-primary">Get My Free Quote Now</button>
            </form>
          </div>

          <div>
            <div>
              <span>Direct Contact</span>
              <h2>Call, Text, or Email Us</h2>
              <ul>
                <li>Call or Text Us: <a href="tel:${BUSINESS_NAP.phoneRaw}">${BUSINESS_NAP.phone}</a></li>
                <li>Email Address: <a href="mailto:${BUSINESS_NAP.email}">${BUSINESS_NAP.email}</a></li>
                <li>Cleaning Hours: ${escapeHtml(BUSINESS_NAP.hours)}</li>
                <li>Facebook: <a href="${BUSINESS_NAP.facebookUrl}" target="_blank" rel="noopener noreferrer">facebook.com/SFCLEAN</a></li>
              </ul>
            </div>

            <div>
              <h3>Based in ${BUSINESS_NAP.addressLocality}, ${BUSINESS_NAP.addressRegion} 33435</h3>
              <p>Serving homes, rentals, and workplaces across ${escapeHtml(BUSINESS_NAP.areasServed.join(', '))}.</p>
            </div>

            <div>
              <h3>Love Your Clean or Don’t Pay</h3>
              <p>${escapeHtml(BUSINESS_NAP.guarantee)}</p>
            </div>

            <div id="careers" data-testid="contact-careers-card">
              <h3>${escapeHtml(BUSINESS_NAP.careersHeadline)} Join Our Team</h3>
              <p>${escapeHtml(BUSINESS_NAP.careersDescription)}</p>
              <a href="mailto:${BUSINESS_NAP.email}?subject=Careers%20Application%20-%20South%20Florida%20Cleaning%20Concepts">Apply via Email &rarr;</a>
            </div>
          </div>
        </div>
      </section>
    </main>`;
}

function renderFaqsMain(): string {
  return `
    <main id="main-content">
      <section class="hero-section" aria-label="Frequently Asked Questions Header" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>FAQs</span></nav>
          <span>Simple, Honest Answers</span>
          <h1>Have Questions?</h1>
          <p>Here’s everything you need to know about how we clean, our kid- and pet-safe supplies, flexible scheduling, and our famous Love Your Clean or Don’t Pay guarantee.</p>
        </div>
      </section>

      <section class="section" style="padding: 3rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          ${FAQS_LIST.map((faq) => `
          <div style="border-bottom: 1px solid #e2e8f0; padding: 1.25rem 0;">
            <h2>${escapeHtml(faq.question)}</h2>
            <p>${escapeHtml(faq.answer)}</p>
          </div>`).join('')}
        </div>
      </section>
    </main>`;
}

function renderServiceAreasDirectoryMain(): string {
  return `
    <main id="main-content">
      <section class="hero-section" aria-label="Service Areas Directory Header" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 1rem; color: #94a3b8;">
            <a href="/" style="color: #cbd5e1; text-decoration: none;">Home</a> / <span style="color: #a3e6be;">Service Areas</span>
          </nav>
          <span class="badge" style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; background: rgba(79, 209, 139, 0.15); color: #a3e6be; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1rem;">South Florida Coverage · Jupiter to Miami</span>
          <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; color: #fff;">Our Active South Florida <span style="color: #a3e6be;">Service Areas</span></h1>
          <p style="font-size: 1.15rem; color: #cbd5e1; max-width: 800px; line-height: 1.6;">Trusted home, condo, vacation rental, and office cleaning across 56 South Florida communities.</p>
          <div style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;">
            <input type="search" placeholder="Search your city or neighborhood (e.g. Boca Raton, Jupiter)..." aria-label="Search service areas by city or neighborhood" style="width: 100%; max-width: 480px; padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid #334155; background: #0f172a; color: #fff; font-size: 1rem;" />
            <a href="/contact-us" class="btn btn-primary" style="padding: 0.8rem 1.25rem; border-radius: 0.75rem; background: #12582e; color: #fff; font-weight: 700; text-decoration: none;">Request Free Quote &rarr;</a>
          </div>
        </div>
      </section>

      <section class="section" style="padding: 3.5rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 2rem;">
            <div>
              <span>Palm Beach · Broward · Miami-Dade · Treasure Coast</span>
              <h2 style="font-size: 1.85rem; font-weight: 800; color: #07111a; margin: 0.25rem 0 0;">${serviceAreas.length} Communities We Serve</h2>
            </div>
            <div class="filter-pills" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span style="padding: 0.4rem 0.85rem; border-radius: 0.5rem; background: #12582e; color: #fff; font-weight: 700; font-size: 0.85rem;">All (56)</span>
              <span style="padding: 0.4rem 0.85rem; border-radius: 0.5rem; background: #f1f5f9; color: #334155; font-size: 0.85rem;">Palm Beach (50)</span>
              <span style="padding: 0.4rem 0.85rem; border-radius: 0.5rem; background: #f1f5f9; color: #334155; font-size: 0.85rem;">Broward</span>
              <span style="padding: 0.4rem 0.85rem; border-radius: 0.5rem; background: #f1f5f9; color: #334155; font-size: 0.85rem;">Miami-Dade</span>
              <span style="padding: 0.4rem 0.85rem; border-radius: 0.5rem; background: #f1f5f9; color: #334155; font-size: 0.85rem;">Nearby Counties</span>
            </div>
          </div>
          <div class="city-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
            ${serviceAreas.map((area) => `
            <article class="city-card" style="border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.25rem; background: #fff;">
              <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;"><a href="/service-area/${area.slug}" style="color: #071536; text-decoration: none;">${escapeHtml(area.name)}, FL</a></h3>
              <p style="font-size: 0.875rem; color: #475569; line-height: 1.5; margin-bottom: 0.75rem;">${escapeHtml(area.description)}</p>
              <a href="/service-area/${area.slug}" style="color: #12582e; font-weight: 700; font-size: 0.8rem; text-decoration: none;">View Services &rarr;</a>
            </article>`).join('')}
          </div>
        </div>
      </section>
    </main>`;
}

function renderServiceAreaDetailMain(area: ServiceAreaItem): string {
  const divisions = getServiceAreaCoreServices(area.name);
  const faqs = getServiceAreaFaqs(area.name);
  const nearbyAreas = serviceAreas.filter((a) => a.slug !== area.slug).slice(0, 6);
  const localCopy = area.localCopy ?? [];
  const landmarks = area.landmarks ?? [];
  const thingsToDo = area.thingsToDo ?? [];
  const keyCorridors = area.keyCorridors ?? [];
  const topIndustries = area.topIndustries ?? [];
  const parsedLat = area.geo ? Number(area.geo.latitude) : NaN;
  const parsedLng = area.geo ? Number(area.geo.longitude) : NaN;
  const hasValidGeo = Number.isFinite(parsedLat) && Number.isFinite(parsedLng);
  const industriesHeadingTag = keyCorridors.length > 0 ? 'h4' : 'h3';

  return `
    <main id="main-content">
      <section class="hero-section" aria-label="${escapeHtml(area.name)}, FL Cleaning Services Header" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 1rem; color: #94a3b8;">
            <a href="/" style="color: #cbd5e1; text-decoration: none;">Home</a> / <a href="/service-areas" style="color: #cbd5e1; text-decoration: none;">Service Areas</a> / <span style="color: #a3e6be;">${escapeHtml(area.name)}, FL</span>
          </nav>
          <span class="badge" style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; background: rgba(79, 209, 139, 0.15); color: #a3e6be; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1rem;">Serving ${escapeHtml(area.name)}, FL</span>
          <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; color: #fff;">Premier Commercial &amp; Residential Cleaning Services in <span style="color: #a3e6be;">${escapeHtml(area.name)}, FL</span></h1>
          <p style="font-size: 1.15rem; color: #cbd5e1; max-width: 800px; line-height: 1.6;">${escapeHtml(area.description)}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem; align-items: center;">
            <a href="/contact-us" class="btn btn-primary" style="padding: 0.75rem 1.5rem; border-radius: 0.75rem; background: #12582e; color: #fff; font-weight: 700; text-decoration: none;">Get Free Quote &rarr;</a>
            <a href="tel:${BUSINESS_NAP.phoneRaw}" class="btn btn-phone" style="padding: 0.75rem 1.5rem; border-radius: 0.75rem; background: rgba(255,255,255,0.1); color: #fff; font-weight: 700; text-decoration: none; border: 1px solid rgba(255,255,255,0.2);">Call ${BUSINESS_NAP.phone}</a>
            <span style="font-size: 0.85rem; color: #a3e6be;">100% Guarantee · Free 24-hour re-clean or you don’t pay. · Licensed · Bonded · 20+ Yrs</span>
          </div>
        </div>
      </section>

      <section class="section" style="padding: 3rem 1rem; background: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div>Local Care</div>
          <h2>Trusted Cleaning in ${escapeHtml(area.name)}</h2>
          <p>Our vetted crews use kid- and pet-safe supplies and color-coded microfiber built for South Florida humidity and salt air.</p>

          ${area.highlights && area.highlights.length > 0 ? `
          <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; list-style: none; padding: 0; margin: 1.5rem 0;">
            ${area.highlights.map((h) => `<li style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #f8fafc; font-weight: 600;">${escapeHtml(h)}</li>`).join('')}
          </ul>` : ''}

          ${area.neighborhoods && area.neighborhoods.length > 0 ? `
          <div>
            <h3>Neighborhoods Served in ${escapeHtml(area.name)}:</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
              ${area.neighborhoods.map((n) => `<span style="padding: 0.3rem 0.75rem; border-radius: 0.5rem; background: #f1f5f9; font-size: 0.85rem;">${escapeHtml(n)}</span>`).join('')}
            </div>
          </div>` : ''}

          <div style="padding: 1.5rem; border-radius: 1rem; background: #07111a; color: #fff; margin-top: 1.5rem;">
            <h3>Spotless Results, Zero Effort</h3>
            <p>Our vetted team handles scrubbing and sanitizing so you reclaim your time.</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
              <div><strong>100%</strong> Satisfaction</div>
              <div><strong>20+ Yrs</strong> Experience</div>
              <div><strong>0%</strong> Cross-Contact</div>
              <div><strong>7 Days</strong> Scheduling</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="local-guide-heading" style="padding: 3rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div>Local Guide${area.stats?.geographyType ? ` · ${escapeHtml(area.stats.geographyType)}` : ''}${hasValidGeo ? ` · ${parsedLat.toFixed(4)}°N, ${Math.abs(parsedLng).toFixed(4)}°W` : ''}</div>
          <h2 id="local-guide-heading">${escapeHtml(area.name)} Local Service Guide</h2>

          ${area.stats ? `
          <div data-testid="service-area-stats" style="margin: 1.5rem 0; padding: 1.25rem; border: 1px solid rgba(255,255,255,0.15); border-radius: 1rem;">
            <div>Community Snapshot</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 0.75rem;">
              <div><span>Population</span> <strong>${escapeHtml(area.stats.population)}</strong></div>
              <div><span>Households</span> <strong>${escapeHtml(area.stats.households)}</strong></div>
              <div><span>Land Area</span> <strong>${escapeHtml(area.stats.landArea)}</strong></div>
              <div><span>Economy</span> <span>${escapeHtml(area.stats.commercialGrowth)}</span></div>
            </div>
            ${area.stats.geographyType ? `<div style="margin-top: 0.75rem;">Setting: ${escapeHtml(area.stats.geographyType)}</div>` : ''}
          </div>` : ''}

          <div>
            ${localCopy.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
          </div>

          ${keyCorridors.length > 0 ? `
          <div>
            <h3>Key Roads &amp; Corridors</h3>
            <p>${keyCorridors.map((c) => escapeHtml(c)).join(' · ')}</p>
          </div>` : ''}

          ${topIndustries.length > 0 ? `
          <div>
            <${industriesHeadingTag}>Spaces We Clean</${industriesHeadingTag}>
            <ul>
              ${topIndustries.map((ind) => `<li>${escapeHtml(ind)}</li>`).join('')}
            </ul>
          </div>` : ''}

          <h3>Discover ${escapeHtml(area.name)}</h3>
          ${landmarks.length > 0 ? `
          <div>
            <h4>Landmarks</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
              ${landmarks.map((lm) => `
              <article style="padding: 1rem; border: 1px solid rgba(255,255,255,0.15); border-radius: 0.75rem;">
                <div>${escapeHtml(lm.category)}</div>
                <h5>${escapeHtml(lm.name)}</h5>
                <p>${escapeHtml(lm.description)}</p>
              </article>`).join('')}
            </div>
          </div>` : ''}

          ${thingsToDo.length > 0 ? `
          <div style="margin-top: 1.5rem;">
            <h4>Things to Do</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
              ${thingsToDo.map((act) => `
              <article style="padding: 1rem; border: 1px solid rgba(255,255,255,0.15); border-radius: 0.75rem;">
                <div>${escapeHtml(act.spot)}</div>
                <h5>${escapeHtml(act.title)}</h5>
                <p>${escapeHtml(act.description)}</p>
              </article>`).join('')}
            </div>
          </div>` : ''}
        </div>
      </section>

      <section class="section" style="padding: 3rem 1rem; background: #f8fafc;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div>Our Services</div>
          <h2>Core Cleaning Services in ${escapeHtml(area.name)}</h2>
          <p>Commercial, medical, rental, and residential care.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
            ${divisions.map((div) => `
            <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 1rem; background: #fff;">
              <h3><a href="/service/${div.slug}" style="color: #07111a; text-decoration: none;">${escapeHtml(div.title)}</a></h3>
              <p>${escapeHtml(div.shortDesc)}</p>
              <a href="/service/${div.slug}">Details &rarr;</a>
            </div>`).join('')}
            <div style="padding: 1.25rem; border-radius: 1rem; background: #07111a; color: #fff;">
              <h3>Request a Custom Quote</h3>
              <p>Book a quick walkthrough for same-day flat-rate pricing.</p>
              <a href="/contact-us" style="color: #4fd18b;">Get Free Quote &rarr;</a>
            </div>
          </div>

          <h2>Our 4-Step Process</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div><h3>01 Quick Quote</h3><p>Share your home, rental, or office priorities.</p></div>
            <div><h3>02 Custom Checklist</h3><p>Custom 4-Step Rotation plan covering baseboards, fans, and blinds.</p></div>
            <div><h3>03 Eco-Safe Clean</h3><p>Vetted pros arrive with HEPA vacuums and fresh microfiber.</p></div>
            <div><h3>04 Final Inspection</h3><p>Final walkthrough backed by our Love Your Clean guarantee.</p></div>
          </div>

          <div style="padding: 1.5rem; border-radius: 1rem; background: #07111a; color: #fff; margin-bottom: 2rem;">
            <div>20+ Years in South Florida</div>
            <h3>Family-Owned Care You Can Trust</h3>
            <p>Your space is cleaned by our insured, background-checked local specialists—never gig-app strangers.</p>
          </div>

          <h2>Cleaning Plans in ${escapeHtml(area.name)}</h2>
          <p>${escapeHtml(area.marketInsight)}</p>

          <h3>Cleaning Schedules</h3>
          <table>
            <thead>
              <tr><th>Plan</th><th>Cadence</th><th>Scope</th><th>Best For</th></tr>
            </thead>
            <tbody>
              <tr><td>Regular Care</td><td>Weekly / Bi-Weekly</td><td>Kitchens, baths, dusting, vacuuming &amp; floors</td><td>Families &amp; offices</td></tr>
              <tr><td>Deep Clean</td><td>Monthly / One-Time</td><td>Appliances, grout, baseboards, blinds &amp; fans</td><td>Move-ins &amp; resets</td></tr>
              <tr><td>Clinic &amp; Office</td><td>Daily / Custom</td><td>EPA List N disinfection, restrooms &amp; breakrooms</td><td>Clinics &amp; suites</td></tr>
            </tbody>
          </table>

          <h3>Cleaning FAQs</h3>
          <div>
            ${faqs.map((faq) => `
            <div style="padding: 0.75rem 0; border-bottom: 1px solid #e2e8f0;">
              <strong>${escapeHtml(faq.q)}</strong>
              <p>${escapeHtml(faq.a)}</p>
            </div>`).join('')}
          </div>

          <div class="service-area-map map-embed" data-testid="service-area-map" aria-label="Interactive map of ${escapeHtml(area.name)}, Florida service area" style="margin: 2rem 0; border-radius: 1rem; overflow: hidden; border: 1px solid #e2e8f0; background: #ffffff;">
            <div style="padding: 0.75rem 1rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <strong>${escapeHtml(area.name)}, Florida</strong> · Service Area Coverage
              ${hasValidGeo ? `<span> (${parsedLat.toFixed(4)}° N, ${Math.abs(parsedLng).toFixed(4)}° W)</span>` : ''}
            </div>
            <iframe src="https://maps.google.com/maps?q=${encodeURIComponent(area.name + ', FL')}&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=&amp;output=embed" title="Interactive Google Map showing service area for ${escapeHtml(area.name)}, Florida" aria-label="Interactive Google Map showing service area for ${escapeHtml(area.name)}, Florida" style="border:0; width: 100%; height: 320px; display: block;" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div style="padding: 0.75rem 1rem; background: #f8fafc; border-top: 1px solid #e2e8f0;">
              <a href="https://maps.google.com/?q=${encodeURIComponent(area.name + ', FL')}" target="_blank" rel="noopener noreferrer">Open in Google Maps &rarr;</a>
            </div>
          </div>

          <div style="padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 1rem; background: #fff; margin-bottom: 2rem;">
            <h3>Free Estimate</h3>
            <p>Request a fast, no-obligation quote.</p>
            <a href="/contact-us#quote" class="btn btn-primary">Get My Free Quote</a>
            <a href="tel:${BUSINESS_NAP.phoneRaw}">${BUSINESS_NAP.phone}</a> ·
            <a href="mailto:${BUSINESS_NAP.email}">${BUSINESS_NAP.email}</a> ·
            <span>${escapeHtml(BUSINESS_NAP.hours)}</span>
          </div>

          <div style="padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">
            <h3>Nearby Service Areas</h3>
            <a href="/service-areas">All 56 Areas &rarr;</a>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem;">
              ${nearbyAreas.map((a) => `<a href="/service-area/${a.slug}" style="padding: 0.4rem 0.75rem; border-radius: 0.5rem; background: #fff; border: 1px solid #e2e8f0; text-decoration: none;">${escapeHtml(a.name)}, FL</a>`).join('')}
            </div>
          </div>
        </div>
      </section>
    </main>`;
}

function renderNotFoundMain(): string {
  return `
    <main id="main-content">
      <section class="hero-section" aria-label="404 Page Not Found Header" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>404 Not Found</span></nav>
          <span>404 · Let’s Get You Back on Track</span>
          <h1>404 - Page Not Found</h1>
          <p>That page may have moved. Head back home or browse our South Florida cleaning services below.</p>
          <a href="/" class="btn btn-primary">Back to Homepage</a>
          <a href="/our-services" class="btn btn-outline">Explore Our Services</a>
        </div>
      </section>

      <section class="section" style="padding: 3rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <h2>Popular Cleaning Services</h2>
          <ul>
            ${SERVICES_CATALOG.slice(0, 6).map((svc) => `<li><a href="/service/${svc.slug}">${escapeHtml(svc.title)}</a></li>`).join('')}
          </ul>
        </div>
      </section>
    </main>`;
}

function renderStaticMainForRoute(routePath: string): string {
  if (routePath === '/') return renderHomeMain();
  if (routePath === '/about-us') return renderAboutMain();
  if (routePath === '/our-services') return renderServicesOverviewMain();
  if (routePath === '/service') return renderServiceDirectoryMain();
  if (routePath.startsWith('/service/')) return renderServiceDetailMain(routePath.replace('/service/', ''));
  if (routePath === '/our-publications') return renderPublicationsMain();
  if (routePath.startsWith('/blog/')) return renderBlogPostMain(routePath.replace('/blog/', ''));
  if (routePath === '/contact-us') return renderContactMain();
  if (routePath === '/faqs') return renderFaqsMain();
  if (routePath === '/service-areas') return renderServiceAreasDirectoryMain();
  if (routePath.startsWith('/service-area/')) {
    const slug = routePath.replace('/service-area/', '');
    const area = Object.prototype.hasOwnProperty.call(serviceAreasBySlug, slug)
      ? serviceAreasBySlug[slug]
      : undefined;
    if (area) return renderServiceAreaDetailMain(area);
  }
  return renderNotFoundMain();
}

async function prerenderAllRoutes() {
  // Generate and synchronize LLMs documentation
  writeLlmsFiles();

  if (!fs.existsSync(BASE_TEMPLATE)) {
    throw new Error(`Compiled template ${BASE_TEMPLATE} not found. Run 'vite build' first.`);
  }

  const templateHtml = fs.readFileSync(BASE_TEMPLATE, 'utf-8');

  // Build-time validation: Ensure Netlify Form registration & full field schema exist in templateHtml
  const requiredFormSignatures = [
    'name="quote-request"',
    'data-netlify="true"',
    'data-netlify-honeypot="bot-field"',
    'name="form-name"',
    'name="bot-field"',
    'name="name"',
    'name="email"',
    'name="phone"',
    'name="message"',
    'name="source"',
    'name="page_url"'
  ];
  for (const sig of requiredFormSignatures) {
    if (!templateHtml.includes(sig)) {
      throw new Error(`[prerender-routes] Missing required Netlify form attribute/field in ${BASE_TEMPLATE}: ${sig}`);
    }
  }

  const standardHeader = renderStandardHeader();
  const defaultDrawer = renderDefaultDrawer();
  const standardFooter = renderStandardFooter();

  let generatedCount = 0;

  for (const route of ALL_ROUTES) {
    const meta = SEO_ROUTES_MAP[route.path] || SEO_ROUTES_MAP['/404'];
    const extractedSchema = buildStaticRouteJsonLd(route.path, meta);
    const extractedMain = renderStaticMainForRoute(route.path);
    const staticGlobalCta = renderStaticGlobalCta(route.path);

    let routeHtml = templateHtml;

    // 1. Replace Title
    routeHtml = routeHtml.replace(
      /<title>[\s\S]*?<\/title>/i,
      () => `<title>${escapeHtml(meta.title)}</title>`
    );

    // 2. Replace Meta Description
    routeHtml = routeHtml.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      () => `<meta name="description" content="${escapeHtml(meta.description)}" />`
    );

    // 3. Replace Canonical Link & emit hreflang="en-us" for indexable routes
    const isErrorRoute = route.path === '/404' || meta.schemaType === 'ErrorPage';
    routeHtml = routeHtml.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      () =>
        isErrorRoute
          ? `<link rel="canonical" href="${meta.canonical}" />`
          : `<link rel="canonical" href="${meta.canonical}" />\n  <link rel="alternate" hreflang="en-us" href="${meta.canonical}" />`
    );

    // 4. Replace Open Graph Title, Description, URL, Image, Type
    const targetOgType = meta.ogType || (route.path.startsWith('/blog/') ? 'article' : 'website');
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
      () => `<meta property="og:type" content="${targetOgType}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      () => `<meta property="og:title" content="${escapeHtml(meta.title)}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      () => `<meta property="og:description" content="${escapeHtml(meta.description)}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      () => `<meta property="og:url" content="${meta.canonical}" />`
    );
    if (meta.ogImage) {
      const ogImage = meta.ogImage;
      routeHtml = routeHtml.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
        () => `<meta property="og:image" content="${ogImage}" />`
      );
    }

    // 5. Replace Twitter Title, Description, Image
    routeHtml = routeHtml.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      () => `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      () => `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
    );
    if (meta.ogImage) {
      const twitterImage = meta.ogImage;
      routeHtml = routeHtml.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
        () => `<meta name="twitter:image" content="${twitterImage}" />`
      );
    }

    // 6. Inject Schema.org JSON-LD Structured Data & Robots Policy
    if (route.path === '/404' || !extractedSchema) {
      // 404 should have no schema block and must have noindex robots policy
      routeHtml = routeHtml.replace(
        /<script\s+id="dynamic-jsonld"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
        ''
      );
      routeHtml = routeHtml.replace(
        /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
        '<meta name="robots" content="noindex, nofollow" />'
      );
    } else {
      routeHtml = routeHtml.replace(
        /<script\s+id="dynamic-jsonld"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
        () => `<script id="dynamic-jsonld" type="application/ld+json">\n${extractedSchema}\n  </script>`
      );
    }

    // 7. Inject Semantic Crawler Fallback inside <div id="root">
    const crawlerFallback = `
    ${standardHeader}
    ${defaultDrawer}
    ${extractedMain}
    ${staticGlobalCta}
    <nav class="mobile-bottom-bar" aria-label="Quick Actions">
      <div class="bottom-bar-grid">
        <a href="tel:${BUSINESS_NAP.phoneRaw}" class="bottom-bar-btn bottom-bar-call">Call Now</a>
        <a href="/contact-us" class="bottom-bar-btn bottom-bar-quote">Free Quote</a>
      </div>
    </nav>
    ${standardFooter}
`;
    if (routeHtml.includes('<!-- ROOT_START -->')) {
      routeHtml = routeHtml.replace(
        /<!-- ROOT_START -->[\s\S]*?<!-- ROOT_END -->/i,
        () => `<!-- ROOT_START -->\n  <div id="root">\n${crawlerFallback}\n  </div>\n  <!-- ROOT_END -->`
      );
    } else {
      routeHtml = routeHtml.replace(
        /<div id="root">[\s\S]*?<\/div>/i,
        () => `<div id="root">\n${crawlerFallback}\n  </div>`
      );
      if (!routeHtml.includes('<div id="root">\n')) {
        routeHtml = routeHtml.replace(
          '<div id="root"></div>',
          () => `<div id="root">\n${crawlerFallback}\n  </div>`
        );
      }
    }

    // Sanitize internal links to strip .html extensions for clean canonical URLs
    routeHtml = routeHtml.replace(/href="\/([^"#?]+)\.html([#?][^"]*)?"/gi, (match, p1, p2) => {
      if (p1 === 'sitemap' || p1 === 'robots') return match;
      return `href="/${p1}${p2 || ''}"`;
    });

    // 8. Write static physical HTML files
    const clean = route.path.replace(/^\/+|\/+$/g, '');

    if (!clean) {
      // Root: dist/index.html
      fs.writeFileSync(path.join(DIST_DIR, 'index.html'), routeHtml, 'utf-8');
    } else {
      // 1. Directory index: dist/<route>/index.html
      const routeDir = path.join(DIST_DIR, clean);
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf-8');

      // 2. Flat HTML file: dist/<route>.html
      const flatFile = path.join(DIST_DIR, `${clean}.html`);
      fs.mkdirSync(path.dirname(flatFile), { recursive: true });
      fs.writeFileSync(flatFile, routeHtml, 'utf-8');

      // 3. Match legacy file path if different (e.g. dist/service/office-cleaning.html)
      if (route.sourceFile) {
        const sourceDest = path.join(DIST_DIR, route.sourceFile);
        fs.mkdirSync(path.dirname(sourceDest), { recursive: true });
        fs.writeFileSync(sourceDest, routeHtml, 'utf-8');
      }
    }

    // Special handling for 404: write dist/404.html
    if (route.path === '/404') {
      fs.writeFileSync(path.join(DIST_DIR, '404.html'), routeHtml, 'utf-8');
    }

    // Generate /contact aliases to ensure zero 404s when navigating to /contact#quote
    if (route.path === '/contact-us') {
      const contactDir = path.join(DIST_DIR, 'contact');
      if (!fs.existsSync(contactDir)) {
        fs.mkdirSync(contactDir, { recursive: true });
      }
      fs.writeFileSync(path.join(contactDir, 'index.html'), routeHtml, 'utf-8');
      fs.writeFileSync(path.join(DIST_DIR, 'contact.html'), routeHtml, 'utf-8');
    }

    generatedCount++;
  }

  // Ensure public discovery and manifest files are mirrored to dist
  const publicFilesToMirror = ['sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt'];
  for (const file of publicFilesToMirror) {
    const src = path.join(ROOT_DIR, 'public', file);
    const dest = path.join(DIST_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  console.log(`[prerender-routes] Generated ${generatedCount} static pre-rendered routes in dist/.`);
}

prerenderAllRoutes().catch((err) => {
  console.error('[prerender-routes] Error:', err);
  process.exit(1);
});
