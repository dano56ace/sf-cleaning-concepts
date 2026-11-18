import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_ROUTES_MAP, RouteSeoMeta } from '../../data/seoRegistry';
import {
  BUSINESS_NAP,
  SERVICES_CATALOG,
  BLOG_POSTS,
  FAQS_LIST,
  PROMO_VIDEOS
} from '../../data/siteData';
import {
  serviceAreas,
  serviceAreasBySlug,
  getServiceAreaCoreServices,
  getServiceAreaFaqs
} from '../../data/serviceAreas';
import { extractTelNumber, trackClickToCall, trackSpaPageView } from '../../utils/analytics';

const SITE_URL = 'https://sfcleaningconcepts.com';

const EXPLICIT_HTML_ROUTES = new Set([
  '/about-us.html',
  '/our-services.html',
  '/service.html',
  '/service-areas.html',
  '/our-publications.html',
  '/contact-us.html',
  '/contact.html',
  '/faqs.html',
  '/404.html',
]);

export function normalizeRoutePath(pathname: string): string {
  const raw = pathname.toLowerCase();
  const trimmed = raw.length > 1 ? raw.replace(/\/+$/, '') : raw;

  if (trimmed === '/index.html') {
    return '/';
  }
  if (trimmed === '/service/index.html') {
    return '/service';
  }
  if (
    EXPLICIT_HTML_ROUTES.has(trimmed) ||
    /^\/(?:service|service-area|blog)\/[^/]+\.html$/.test(trimmed)
  ) {
    return trimmed.slice(0, -'.html'.length);
  }
  return trimmed;
}

function buildRouteJsonLd(normalizedPath: string, meta: RouteSeoMeta): Record<string, unknown> | null {
  // Error routes emit no JSON-LD, and blog routes manage their own rich JSON-LD
  if (
    meta.schemaType === 'ErrorPage' ||
    normalizedPath === '/404' ||
    !SEO_ROUTES_MAP[normalizedPath] ||
    normalizedPath.startsWith('/blog/')
  ) {
    return null;
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

  if (normalizedPath === '/') {
    return {
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
  }

  if (normalizedPath === '/faqs') {
    return {
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
  }

  if (normalizedPath.startsWith('/service/')) {
    const slug = normalizedPath.replace('/service/', '');
    const service = SERVICES_CATALOG.find((s) => s.slug === slug);
    if (service) {
      return {
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
    }
  }

  if (normalizedPath === '/our-services' || normalizedPath === '/service') {
    return {
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
  }

  if (normalizedPath === '/our-publications') {
    return {
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
  }

  if (normalizedPath === '/about-us' || normalizedPath === '/contact-us') {
    const pageType = normalizedPath === '/about-us' ? 'AboutPage' : 'ContactPage';
    return {
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
        ...(normalizedPath === '/about-us' ? promoVideoNodes : [])
      ]
    };
  }

  if (normalizedPath === '/service-areas') {
    return {
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
  }

  if (normalizedPath.startsWith('/service-area/')) {
    const slug = normalizedPath.replace('/service-area/', '');
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

      return {
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
              containedInPlace: {
                '@type': 'State',
                name: 'Florida'
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude,
                longitude
              }
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
            geo: {
              '@type': 'GeoCoordinates',
              latitude,
              longitude
            },
            areaServed: {
              '@type': 'City',
              name: area.name,
              containedInPlace: {
                '@type': 'State',
                name: 'Florida'
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude,
                longitude
              }
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
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a
              }
            }))
          }
        ]
      };
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [baseBusiness]
  };
}

export function SEOHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const phoneNumber = extractTelNumber(anchor.getAttribute('href'));
      if (!phoneNumber) return;

      const region =
        anchor.closest('header')?.tagName.toLowerCase() ||
        (anchor.closest('.hero-banner') ? 'hero' : '') ||
        (anchor.closest('.mobile-bottom-bar') ? 'mobile-action-bar' : '') ||
        (anchor.closest('[data-testid="global-cta"]') ? 'global-cta' : '') ||
        anchor.closest('footer')?.tagName.toLowerCase() ||
        'page';

      trackClickToCall({
        phoneNumber,
        linkLocation: region,
        pagePath: window.location.pathname
      });
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  useEffect(() => {
    let normalized = normalizeRoutePath(pathname);
    if (normalized === '/contact') normalized = '/contact-us';
    const meta = SEO_ROUTES_MAP[normalized] || SEO_ROUTES_MAP['/404'] || SEO_ROUTES_MAP['/'];

    if (meta) {
      document.title = meta.title;

      // Update meta description
      let descEl = document.querySelector('meta[name="description"]');
      if (!descEl) {
        descEl = document.createElement('meta');
        descEl.setAttribute('name', 'description');
        document.head.appendChild(descEl);
      }
      descEl.setAttribute('content', meta.description);

      // Update canonical link
      let canonEl = document.querySelector('link[rel="canonical"]');
      if (!canonEl) {
        canonEl = document.createElement('link');
        canonEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonEl);
      }
      canonEl.setAttribute('href', meta.canonical);

      const isErrorPage = meta.schemaType === 'ErrorPage' || normalized === '/404' || !SEO_ROUTES_MAP[normalized];

      // Maintain hreflang="en-us" alternate link on indexable pages only (matching prerender-routes.ts)
      const existingHreflangEl = document.querySelector('link[rel="alternate"][hreflang="en-us"]');
      if (isErrorPage) {
        existingHreflangEl?.remove();
      } else {
        let hreflangEl = existingHreflangEl;
        if (!hreflangEl) {
          hreflangEl = document.createElement('link');
          hreflangEl.setAttribute('rel', 'alternate');
          hreflangEl.setAttribute('hreflang', 'en-us');
          document.head.appendChild(hreflangEl);
        }
        hreflangEl.setAttribute('href', meta.canonical);
      }

      // Update Open Graph tags
      const updateOg = (property: string, content: string) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('property', property);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      const targetOgType = meta.ogType || (normalized.startsWith('/blog/') ? 'article' : 'website');
      updateOg('og:title', meta.title);
      updateOg('og:description', meta.description);
      updateOg('og:url', meta.canonical);
      updateOg('og:image', meta.ogImage);
      updateOg('og:type', targetOgType);

      // Update Twitter tags
      const updateTwitter = (name: string, content: string) => {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('name', name);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      updateTwitter('twitter:card', 'summary_large_image');
      updateTwitter('twitter:title', meta.title);
      updateTwitter('twitter:description', meta.description);
      updateTwitter('twitter:image', meta.ogImage);

      // Update meta robots tag
      let robotsEl = document.querySelector('meta[name="robots"]');
      if (!robotsEl) {
        robotsEl = document.createElement('meta');
        robotsEl.setAttribute('name', 'robots');
        document.head.appendChild(robotsEl);
      }
      robotsEl.setAttribute(
        'content',
        isErrorPage
          ? 'noindex, nofollow'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      );

      // Synchronize dynamic route-specific JSON-LD graph in <script id="dynamic-jsonld">
      const shouldRemoveDynamicJsonLd = isErrorPage;

      if (shouldRemoveDynamicJsonLd) {
        document.getElementById('dynamic-jsonld')?.remove();
      } else {
        const jsonLdGraph = buildRouteJsonLd(normalized, meta);
        if (jsonLdGraph) {
          let scriptEl = document.getElementById('dynamic-jsonld') as HTMLScriptElement | null;
          if (!scriptEl) {
            scriptEl = document.createElement('script');
            scriptEl.id = 'dynamic-jsonld';
            scriptEl.type = 'application/ld+json';
            document.head.appendChild(scriptEl);
          }
          scriptEl.textContent = JSON.stringify(jsonLdGraph);
        }
      }

      // Notify Google Analytics (G-R1LCQWZJW0) on SPA route change
      trackSpaPageView(pathname, meta.title);
    }
  }, [pathname]);

  return null;
}

