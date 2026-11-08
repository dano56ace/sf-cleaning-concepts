import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_ROUTES_MAP } from '../../data/seoRegistry';

export function SEOHead() {
  const { pathname } = useLocation();

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
    }
  }, [pathname]);

  return null;
}
