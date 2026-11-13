import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_ROUTES_MAP, RouteSeoMeta } from '../../data/seoRegistry';
import {
  BUSINESS_NAP,
  SERVICES_CATALOG,
  BLOG_POSTS,
  FAQS_LIST
} from '../../data/siteData';
import { extractTelNumber, trackClickToCall, trackSpaPageView } from '../../utils/analytics';

const SITE_URL = 'https://sfcleaningconcepts.com';

function buildRouteJsonLd(normalizedPath: string, meta: RouteSeoMeta): Record<string, unknown> | null {
  // Routes that manage their own dedicated rich JSON-LD graphs inside page components
  if (
    normalizedPath.startsWith('/blog/') ||
    normalizedPath === '/service-areas' ||
    normalizedPath.startsWith('/service-area/')
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
        }
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
        }
      ]
    };
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
    // Clean trailing slashes and .html extensions
    let normalized = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    if (normalized === '/index.html') normalized = '/';
    else if (normalized.endsWith('/index.html')) normalized = normalized.replace(/\/index\.html$/, '') || '/';
    else if (normalized.endsWith('.html')) normalized = normalized.replace(/\.html$/, '');
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

      // Maintain hreflang="en-us" alternate link
      let hreflangEl = document.querySelector('link[rel="alternate"][hreflang="en-us"]');
      if (!hreflangEl) {
        hreflangEl = document.createElement('link');
        hreflangEl.setAttribute('rel', 'alternate');
        hreflangEl.setAttribute('hreflang', 'en-us');
        document.head.appendChild(hreflangEl);
      }
      hreflangEl.setAttribute('href', meta.canonical);

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

      const targetOgType = meta.ogType || (pathname.startsWith('/blog/') ? 'article' : 'website');
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
      const isErrorPage = meta.schemaType === 'ErrorPage' || normalized === '/404' || !SEO_ROUTES_MAP[normalized];
      robotsEl.setAttribute(
        'content',
        isErrorPage
          ? 'noindex, nofollow'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      );

      // Synchronize dynamic route-specific JSON-LD graph in <script id="dynamic-jsonld">
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

      // Notify Google Analytics (G-R1LCQWZJW0) on SPA route change
      trackSpaPageView(pathname, meta.title);
    }
  }, [pathname]);

  return null;
}

