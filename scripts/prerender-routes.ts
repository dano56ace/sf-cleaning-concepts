import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_ROUTES_MAP } from '../src/data/seoRegistry';
import { serviceAreas, serviceAreasBySlug } from '../src/data/serviceAreas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const BASE_TEMPLATE = path.resolve(DIST_DIR, 'index.html');

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

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function prerenderAllRoutes() {
  if (!fs.existsSync(BASE_TEMPLATE)) {
    throw new Error(`Compiled template ${BASE_TEMPLATE} not found. Run 'vite build' first.`);
  }

  const templateHtml = fs.readFileSync(BASE_TEMPLATE, 'utf-8');
  let generatedCount = 0;

  const standardHeader = `
    <header class="site-header">
      <nav class="desktop-nav" aria-label="Main Navigation">
        <a href="/" class="brand-logo" aria-label="South Florida Cleaning Concepts Home">
          <img src="/assets/images/logo/logo.svg" alt="South Florida Cleaning Concepts Logo" width="160" height="40" />
        </a>
        <ul class="nav-list">
          <li><a href="/" class="nav-link">Home</a></li>
          <li><a href="/about-us" class="nav-link">About Us</a></li>
          <li><a href="/our-services" class="nav-link">Our Services</a></li>
          <li><a href="/service-areas" class="nav-link">Service Areas</a></li>
          <li><a href="/faqs" class="nav-link">FAQs</a></li>
          <li><a href="/our-publications" class="nav-link">Publications</a></li>
          <li><a href="/contact-us" class="nav-link">Contact</a></li>
        </ul>
        <a href="tel:5617045303" class="btn btn-phone">(561) 704-5303</a>
      </nav>
      <div class="mobile-controls">
        <a href="tel:5617045303" class="mobile-call-btn" aria-label="Call South Florida Cleaning Concepts">Call</a>
        <button type="button" class="mobile-nav-toggle" aria-label="Toggle navigation menu">Menu</button>
      </div>
    </header>`;

  const standardFooter = `
    <footer class="site-footer">
      <div class="container">
        <p>&copy; 2026 South Florida Cleaning Concepts. All Rights Reserved. Licensed &amp; Insured Commercial &amp; Residential Cleaning Services in Palm Beach and Broward counties.</p>
        <p>Telephone: <a href="tel:5617045303">(561) 704-5303</a> | Email: <a href="mailto:Sflcleaningco@gmail.com">Sflcleaningco@gmail.com</a> | Headquarters: Boynton Beach, FL 33435</p>
        <p><a href="/service-areas">Service Areas Directory</a> | <a href="/service-area/jupiter">Jupiter</a> | <a href="/service-area/boca-raton">Boca Raton</a> | <a href="/service-area/west-palm-beach">West Palm Beach</a> | <a href="/service-area/delray-beach">Delray Beach</a></p>
        <p><a href="/blog/complete-guide-to-home-cleaning">Home Cleaning</a> | <a href="/blog/deep-cleaning-for-homes-and-offices">Deep Cleaning</a> | <a href="/blog/medical-office-cleaning-guide">Medical Cleaning</a> | <a href="/blog/office-cleaning-made-easy">Office Cleaning</a> | <a href="/blog/post-construction-cleaning-guide">Post-Construction</a> | <a href="/blog/residential-cleaning-services-journey">Residential Journey</a> | <a href="/blog/restaurant-and-bar-cleaning-services">Restaurant Cleaning</a> | <a href="/blog/revitalize-your-office-space">Office Refresh</a> | <a href="/blog/short-term-rental-cleaning-guide">Airbnb Guide</a> | <a href="/blog/south-florida-home-maintenance-services">Home Maintenance</a> | <a href="/blog/high-quality-cleaning-services-south-florida">Quality Cleaning</a></p>
        <p><a href="/contact-us">Privacy &amp; Terms</a> | <a href="/sitemap.xml">Sitemap</a> | <a href="/robots.txt">Robots.txt</a></p>
      </div>
    </footer>`;

  for (const route of ALL_ROUTES) {
    const meta = SEO_ROUTES_MAP[route.path] || SEO_ROUTES_MAP['/404'];
    const sourceFilePath = route.sourceFile ? path.join(ROOT_DIR, route.sourceFile) : '';
    let sourceHtml = '';
    let extractedSchema = '';
    let extractedMain = '';
    let extractedHeader = '';
    let extractedFooter = '';
    let extractedDrawer = '';
    let extractedOverlay = '';

    if (sourceFilePath && fs.existsSync(sourceFilePath)) {
      sourceHtml = fs.readFileSync(sourceFilePath, 'utf-8');

      // Extract JSON-LD schema
      const schemaMatch = sourceHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      if (schemaMatch) {
        extractedSchema = schemaMatch[1].trim();
      }

      // Extract header, drawer, overlay, main, footer for semantic crawler shell
      const headerMatch = sourceHtml.match(/<header[\s\S]*?<\/header>/i);
      if (headerMatch) extractedHeader = headerMatch[0];

      const drawerMatch = sourceHtml.match(/<aside[\s\S]*?id="mobile-nav-drawer"[\s\S]*?<\/aside>/i);
      if (drawerMatch) extractedDrawer = drawerMatch[0];

      const overlayMatch = sourceHtml.match(/<div[\s\S]*?class="mobile-nav-overlay"[\s\S]*?<\/div>/i);
      if (overlayMatch) extractedOverlay = overlayMatch[0];

      const mainMatch = sourceHtml.match(/<main[\s\S]*?<\/main>/i);
      if (mainMatch) extractedMain = mainMatch[0];

      const footerMatch = sourceHtml.match(/<footer[\s\S]*?<\/footer>/i);
      if (footerMatch) extractedFooter = footerMatch[0];
    }

    if (route.path === '/') {
      extractedHeader = standardHeader;

      extractedMain = `
    <main id="main-content">
      <section class="hero-banner" style="overflow: hidden; position: relative;">
        <video autoplay muted playsinline loop poster="/assets/videos/bg_video_13.jpeg" width="1280" height="720" style="max-width: 100%; height: auto; object-fit: cover;">
          <source src="/assets/videos/main-home-video-1.mp4" type="video/mp4" />
        </video>
        <div class="container">
          <h1>Commercial Cleaning - Pros | South Florida Cleaning Concepts</h1>
          <p>Premier commercial and residential cleaning across South Florida. From medical office terminal sterilization to luxury residential rotation cleaning in Palm Beach &amp; Broward counties. Call (561) 704-5303 for a free quote.</p>
          <a href="/contact-us" class="btn btn-primary">Request Free Quote</a>
          <a href="tel:5617045303" class="btn btn-phone">Call (561) 704-5303</a>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2>Specialized Commercial &amp; Residential Cleaning Solutions</h2>
          <p>South Florida Cleaning Concepts provides 10 specialized cleaning services backed by our 100% Satisfaction Guarantee and our exclusive Rotation Cleaning System.</p>
          <ul>
            <li><a href="/service/office-cleaning">Commercial Office Cleaning Services</a></li>
            <li><a href="/service/medical-office-cleaning">Specialized Medical Office Cleaning</a></li>
            <li><a href="/service/bars-and-restaurant-cleaning">Commercial Cleaning for Bars and Restaurants</a></li>
            <li><a href="/service/short-term-rentals">Short-Term Rental &amp; Airbnb Turnover</a></li>
            <li><a href="/service/post-construction-cleaning">Post-Construction Cleaning</a></li>
            <li><a href="/service/move-in-out-cleaning">Move In / Move Out Cleaning</a></li>
            <li><a href="/service/home-maintenance">Comprehensive Home Maintenance Services</a></li>
            <li><a href="/service/school-cleaning">School &amp; Daycare Cleaning Services</a></li>
            <li><a href="/service/home-watching">Professional Home Watching Service</a></li>
            <li><a href="/service/covid-19-disinfection">COVID-19 Disinfection &amp; Electrostatic Spraying</a></li>
          </ul>
        </div>
      </section>

      <section class="section" aria-labelledby="home-blog-heading">
        <div class="container">
          <div class="section-header">
            <span class="badge badge-primary">From Our Cleaning Journal</span>
            <h2 id="home-blog-heading">Expert Cleaning Insights &amp; Guides</h2>
            <p>Practical sanitation protocols, commercial facility maintenance strategies, and residential cleaning advice from South Florida's leading specialists.</p>
          </div>
          <div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
            <article class="card" style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border); background: var(--color-surface); padding: 1.5rem;">
              <span class="badge badge-accent" style="margin-bottom: 0.5rem; display: inline-block;">Residential Cleaning</span>
              <h3 style="font-size: 1.25rem; margin-top: 0.5rem; margin-bottom: 0.5rem;"><a href="/blog/residential-cleaning-services-journey" style="color: var(--color-text-heading); text-decoration: none;">A Journey with South Florida Cleaning Concepts Residential Maid Service</a></h3>
              <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.5;">What to expect when booking recurring maid service: customized walkthroughs, vetted teams, eco-friendly supplies, and the luxury of reclaimed time.</p>
              <div style="margin-top: 1rem;"><a href="/blog/residential-cleaning-services-journey" style="color: var(--color-primary); font-weight: 700; text-decoration: none;">Read Full Article &rarr;</a></div>
            </article>
            <article class="card" style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border); background: var(--color-surface); padding: 1.5rem;">
              <span class="badge badge-accent" style="margin-bottom: 0.5rem; display: inline-block;">Estate Maintenance</span>
              <h3 style="font-size: 1.25rem; margin-top: 0.5rem; margin-bottom: 0.5rem;"><a href="/blog/south-florida-home-maintenance-services" style="color: var(--color-text-heading); text-decoration: none;">South Florida Home Maintenance: Protecting Your Coastal Investment</a></h3>
              <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.5;">Essential strategies for shielding Florida homes from tropical humidity, salt spray, mold intrusion, and seasonal weather changes.</p>
              <div style="margin-top: 1rem;"><a href="/blog/south-florida-home-maintenance-services" style="color: var(--color-primary); font-weight: 700; text-decoration: none;">Read Full Article &rarr;</a></div>
            </article>
            <article class="card" style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border); background: var(--color-surface); padding: 1.5rem;">
              <span class="badge badge-accent" style="margin-bottom: 0.5rem; display: inline-block;">Construction Services</span>
              <h3 style="font-size: 1.25rem; margin-top: 0.5rem; margin-bottom: 0.5rem;"><a href="/blog/post-construction-cleaning-guide" style="color: var(--color-text-heading); text-decoration: none;">Post-Construction Cleaning: The 3-Phase Builder Guide</a></h3>
              <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.5;">How architects, builders, and remodelers transition active job sites into immaculate, move-in-ready luxury properties through 3-phase cleanup.</p>
              <div style="margin-top: 1rem;"><a href="/blog/post-construction-cleaning-guide" style="color: var(--color-primary); font-weight: 700; text-decoration: none;">Read Full Article &rarr;</a></div>
            </article>
          </div>
          <div style="text-align: center; margin-top: 2rem;">
            <a href="/our-publications" class="btn btn-primary">View All Articles &rarr;</a>
          </div>
        </div>
      </section>
    </main>`;

      extractedFooter = standardFooter;
    } else if (route.path === '/service-areas') {
      extractedHeader = standardHeader;
      extractedFooter = standardFooter;

      extractedSchema = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            '@id': 'https://sfcleaningconcepts.com/service-areas#webpage',
            name: 'South Florida Cleaning Concepts Service Areas Directory',
            description: 'Directory of 56 South Florida communities and counties served by South Florida Cleaning Concepts.',
            url: 'https://sfcleaningconcepts.com/service-areas',
            mainEntity: {
              '@type': 'ItemList',
              name: 'South Florida Cleaning Concepts Service Locations',
              numberOfItems: 56,
              itemListElement: serviceAreas.map((area, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: `${area.name}, FL`,
                url: `https://sfcleaningconcepts.com/service-area/${area.slug}`
              }))
            }
          },
          {
            '@type': 'BreadcrumbList',
            '@id': 'https://sfcleaningconcepts.com/service-areas#breadcrumb',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://sfcleaningconcepts.com/'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Service Areas',
                item: 'https://sfcleaningconcepts.com/service-areas'
              }
            ]
          }
        ]
      }, null, 2);

      extractedMain = `
    <main id="main-content">
      <section class="hero-section" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 1rem; color: #94a3b8;">
            <a href="/" style="color: #cbd5e1; text-decoration: none;">Home</a> / <span style="color: #4fd18b;">Service Areas Directory</span>
          </nav>
          <span class="badge" style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; background: rgba(79, 209, 139, 0.15); color: #4fd18b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1rem;">Regional Coverage · 56 Florida Locations</span>
          <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; color: #fff;">South Florida Service Areas Directory</h1>
          <p style="font-size: 1.15rem; color: #cbd5e1; max-width: 800px; line-height: 1.6;">Explore all 56 cities, towns, and master-planned communities across Palm Beach County, Broward County, and Miami-Dade County served by South Florida Cleaning Concepts. Hospital-grade disinfection, commercial janitorial, and luxury residential maid services.</p>
          <div style="margin-top: 1.5rem;">
            <input type="search" placeholder="Search 56 Florida service areas by city, neighborhood, or roadway..." aria-label="Search service areas" style="width: 100%; max-width: 600px; padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid #334155; background: #0f172a; color: #fff; font-size: 1rem;" />
          </div>
        </div>
      </section>

      <section class="section" style="padding: 4rem 1rem;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div class="filter-pills" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
            <span style="padding: 0.5rem 1rem; border-radius: 0.5rem; background: #12582e; color: #fff; font-weight: 700; font-size: 0.875rem;">All (56)</span>
            <span style="padding: 0.5rem 1rem; border-radius: 0.5rem; background: #f1f5f9; color: #334155; font-size: 0.875rem;">Palm Beach (50)</span>
            <span style="padding: 0.5rem 1rem; border-radius: 0.5rem; background: #f1f5f9; color: #334155; font-size: 0.875rem;">Broward</span>
            <span style="padding: 0.5rem 1rem; border-radius: 0.5rem; background: #f1f5f9; color: #334155; font-size: 0.875rem;">Miami-Dade</span>
            <span style="padding: 0.5rem 1rem; border-radius: 0.5rem; background: #f1f5f9; color: #334155; font-size: 0.875rem;">Adjacent Counties</span>
          </div>
          <div class="city-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
            ${serviceAreas.map((area) => `
            <article class="city-card" style="border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.5rem; background: #fff;">
              <h2 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem;"><a href="/service-area/${area.slug}" style="color: #071536; text-decoration: none;">${area.name}, FL</a></h2>
              <div style="font-family: monospace; font-size: 0.75rem; color: #64748b; margin-bottom: 0.75rem;">${area.geo ? `${Number(area.geo.latitude).toFixed(4)}°N, ${Math.abs(Number(area.geo.longitude)).toFixed(4)}°W` : ''}</div>
              <p style="font-size: 0.9rem; color: #475569; line-height: 1.5; margin-bottom: 1rem;">${escapeHtml(area.description.slice(0, 160))}...</p>
              <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 1rem;">
                <strong>Neighborhoods:</strong> ${area.neighborhoods.slice(0, 3).join(', ')}
              </div>
              <a href="/service-area/${area.slug}" style="display: inline-block; color: #12582e; font-weight: 700; font-size: 0.875rem; text-decoration: none;">Explore ${area.name} Services &rarr;</a>
            </article>`).join('')}
          </div>
        </div>
      </section>
    </main>`;
    } else if (route.path.startsWith('/service-area/')) {
      const slug = route.path.replace('/service-area/', '');
      const area = serviceAreasBySlug[slug];
      if (area) {
        extractedHeader = standardHeader;
        extractedFooter = standardFooter;

        extractedSchema = JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              '@id': `https://sfcleaningconcepts.com/service-area/${area.slug}#service`,
              name: `Professional Commercial & Residential Cleaning in ${area.name}, FL`,
              serviceType: 'CleaningService',
              description: area.description,
              provider: {
                '@type': 'LocalBusiness',
                name: 'South Florida Cleaning Concepts',
                telephone: '(561) 704-5303',
                email: 'Sflcleaningco@gmail.com',
                url: 'https://sfcleaningconcepts.com/',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Boynton Beach',
                  addressRegion: 'FL',
                  postalCode: '33435',
                  addressCountry: 'US'
                }
              },
              areaServed: {
                '@type': 'City',
                name: `${area.name}, FL`,
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: area.geo ? Number(area.geo.latitude) : 26.7153,
                  longitude: area.geo ? Number(area.geo.longitude) : -80.0534
                }
              }
            },
            {
              '@type': ['CleaningService', 'LocalBusiness'],
              '@id': `https://sfcleaningconcepts.com/service-area/${area.slug}#local-service`,
              name: `South Florida Cleaning Concepts - ${area.name}`,
              image: 'https://sfcleaningconcepts.com/assets/images/hero/video-poster-2.jpeg',
              telephone: '(561) 704-5303',
              email: 'Sflcleaningco@gmail.com',
              priceRange: '$$',
              url: `https://sfcleaningconcepts.com/service-area/${area.slug}`,
              address: {
                '@type': 'PostalAddress',
                addressLocality: area.name,
                addressRegion: 'FL',
                addressCountry: 'US'
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: area.geo ? Number(area.geo.latitude) : 26.7153,
                longitude: area.geo ? Number(area.geo.longitude) : -80.0534
              },
              areaServed: {
                '@type': 'City',
                name: `${area.name}, FL`
              },
              description: area.description
            },
            {
              '@type': 'BreadcrumbList',
              '@id': `https://sfcleaningconcepts.com/service-area/${area.slug}#breadcrumb`,
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://sfcleaningconcepts.com/'
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Service Areas',
                  item: 'https://sfcleaningconcepts.com/service-areas'
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: `${area.name}, FL`,
                  item: `https://sfcleaningconcepts.com/service-area/${area.slug}`
                }
              ]
            },
            {
              '@type': 'FAQPage',
              '@id': `https://sfcleaningconcepts.com/service-area/${area.slug}#faq`,
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `How often should my ${area.name} facility or office be professionally cleaned?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Most commercial offices and healthcare clinics in ${area.name} benefit from daily or 3x-weekly evening janitorial maintenance. High-traffic retail spaces and dental practices typically schedule nightly disinfection, while corporate suites may choose custom 2x or 3x weekly rotations.`
                  }
                },
                {
                  '@type': 'Question',
                  name: `Do you provide same-day Airbnb and vacation rental turnover cleaning in ${area.name}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Yes! We specialize in rapid 10:00 AM to 4:00 PM turnaround windows across ${area.name}. Our service includes professional linen laundering, restocking guest consumables, complete bathroom and kitchen sanitization, and photo inspection verification.`
                  }
                },
                {
                  '@type': 'Question',
                  name: `Are your cleaning solutions safe for children, pets, and sensitive environments in ${area.name}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Absolutely. We utilize EPA-registered hospital-grade disinfectants and eco-friendly, non-toxic cleaning agents that eliminate 99.9% of bacteria and viruses without harsh chemical fumes, making them safe for kids, pets, and healthcare environments.`
                  }
                },
                {
                  '@type': 'Question',
                  name: `What is your 100% Satisfaction Guarantee policy for ${area.name} properties?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `We stand 100% behind every clean. If any aspect of our service does not meet your high expectations, notify us within 24 hours and our team will promptly return to re-clean the area for free. If you are still not completely thrilled, you do not pay.`
                  }
                },
                {
                  '@type': 'Question',
                  name: `How quickly can you start cleaning services at our ${area.name} property?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `We can often accommodate emergency or next-day cleaning across ${area.name}. For recurring commercial janitorial or residential maintenance, we provide a prompt on-site walkthrough within 24 hours and can begin service immediately upon scope approval.`
                  }
                }
              ]
            }
          ]
        }, null, 2);

        extractedMain = `
    <main id="main-content">
      <section class="hero-section" style="padding: 4rem 1rem; background: #07111a; color: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 1rem; color: #94a3b8;">
            <a href="/" style="color: #cbd5e1; text-decoration: none;">Home</a> / <a href="/service-areas" style="color: #cbd5e1; text-decoration: none;">All 56 Service Areas</a> / <span style="color: #4fd18b;">${area.name}, FL</span>
          </nav>
          <span class="badge" style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; background: rgba(79, 209, 139, 0.15); color: #4fd18b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1rem;">Serving ${area.name}, FL &amp; Surrounding Areas</span>
          <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; color: #fff;">Premier Commercial &amp; Residential Cleaning Services in <span style="color: #4fd18b;">${area.name}, FL</span></h1>
          <p style="font-size: 1.15rem; color: #cbd5e1; max-width: 800px; line-height: 1.6;">${escapeHtml(area.description)} Backed by over 20 years of family-owned excellence, our bonded specialists deliver hospital-grade sanitization, EPA List N pathogen defense, and personalized cleaning rotations in ${area.name}.</p>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
            <a href="/contact-us" class="btn btn-primary" style="padding: 0.75rem 1.5rem; border-radius: 0.75rem; background: #4fd18b; color: #07111a; font-weight: 700; text-decoration: none;">Request Free ${area.name} Quote &rarr;</a>
            <a href="tel:5617045303" class="btn btn-phone" style="padding: 0.75rem 1.5rem; border-radius: 0.75rem; background: rgba(255,255,255,0.1); color: #fff; font-weight: 700; text-decoration: none; border: 1px solid rgba(255,255,255,0.2);">Call Dispatch: (561) 704-5303</a>
          </div>
        </div>
      </section>

      <section class="section" style="padding: 3rem 1rem; background: #fff;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #071536;">Local Cleaning Excellence &amp; Trust in ${area.name}</h2>
          <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; list-style: none; padding: 0; margin-bottom: 2rem;">
            ${area.highlights.map((h) => `<li style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #f8fafc; font-weight: 600; color: #1e293b;">✓ ${escapeHtml(h)}</li>`).join('')}
            <li style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #f8fafc; font-weight: 600; color: #1e293b;">✓ 100% Satisfaction Guarantee: If not thrilled, you do not pay</li>
            <li style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #f8fafc; font-weight: 600; color: #1e293b;">✓ Bonded, Insured &amp; Background-Checked Specialists</li>
            <li style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #f8fafc; font-weight: 600; color: #1e293b;">✓ Hospital-Grade Disinfection &amp; EPA List N Sanitization in ${area.name}</li>
            <li style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #f8fafc; font-weight: 600; color: #1e293b;">✓ Tailored Commercial Janitorial &amp; Recurring 4-Phase Residential Rotation</li>
          </ul>

          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #071536;">Neighborhoods &amp; Communities Served in ${area.name}</h2>
          <p style="color: #475569; margin-bottom: 1rem;">Providing specialized commercial office cleaning, medical sterilization, and luxury residential maid service across ${area.neighborhoods.join(', ')}.</p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
            ${area.neighborhoods.map((n) => `<span style="padding: 0.35rem 0.85rem; border-radius: 9999px; background: #e8f5ee; color: #12582e; font-size: 0.85rem; font-weight: 600;">${escapeHtml(n)}</span>`).join('')}
          </div>

          ${area.keyCorridors && area.keyCorridors.length > 0 ? `
          <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #071536;">Key Commercial &amp; Transit Corridors</h3>
          <p style="color: #475569; margin-bottom: 2rem;">${area.keyCorridors.join(' · ')}</p>` : ''}

          ${area.topIndustries && area.topIndustries.length > 0 ? `
          <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #071536;">Top Industries &amp; Commercial Sectors Served</h3>
          <p style="color: #475569; margin-bottom: 2rem;">${area.topIndustries.join(' · ')}</p>` : ''}

          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #071536;">Specialized Cleaning Services in ${area.name}</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
            <div style="padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 1rem;">
              <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;"><a href="/service/office-cleaning" style="color: #12582e; text-decoration: none;">Commercial Office Cleaning in ${area.name}</a></h3>
              <p style="font-size: 0.9rem; color: #475569;">Nightly janitorial care, day porter service, sanitized workstations, and HEPA floor care for ${area.name} corporate suites.</p>
            </div>
            <div style="padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 1rem;">
              <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;"><a href="/service/medical-office-cleaning" style="color: #12582e; text-decoration: none;">Medical Facility Disinfection in ${area.name}</a></h3>
              <p style="font-size: 0.9rem; color: #475569;">OSHA and CDC-compliant terminal sanitization and EPA List N pathogen defense for clinics and dental practices in ${area.name}.</p>
            </div>
            <div style="padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 1rem;">
              <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;"><a href="/service/short-term-rentals" style="color: #12582e; text-decoration: none;">Airbnb &amp; Vacation Rental Turnover in ${area.name}</a></h3>
              <p style="font-size: 0.9rem; color: #475569;">Guaranteed same-day turnover windows (10 AM - 4 PM), hotel-grade staging, linen laundering, and restock reporting in ${area.name}.</p>
            </div>
            <div style="padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 1rem;">
              <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;"><a href="/service/home-maintenance" style="color: #12582e; text-decoration: none;">Luxury Residential Maid Service in ${area.name}</a></h3>
              <p style="font-size: 0.9rem; color: #475569;">Our exclusive 4-Phase Rotation Cleaning System defending ${area.name} estates against humidity, dust, and coastal salt air.</p>
            </div>
            <div style="padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 1rem;">
              <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;"><a href="/service/post-construction-cleaning" style="color: #12582e; text-decoration: none;">Post-Construction Cleanup in ${area.name}</a></h3>
              <p style="font-size: 0.9rem; color: #475569;">3-phase rough, deep, and final polish cleaning for builders, architects, and luxury renovations throughout ${area.name}.</p>
            </div>
          </div>

          ${area.landmarks && area.landmarks.length > 0 ? `
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #071536;">Local Landmarks &amp; Attractions in ${area.name}</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            ${area.landmarks.map((l) => `
            <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #f8fafc;">
              <span style="font-size: 0.75rem; font-family: monospace; color: #12582e; text-transform: uppercase;">${escapeHtml(l.category)}</span>
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #071536; margin: 0.25rem 0;">${escapeHtml(l.name)}</h3>
              <p style="font-size: 0.85rem; color: #475569; line-height: 1.4;">${escapeHtml(l.description)}</p>
            </div>`).join('')}
          </div>` : ''}

          ${area.thingsToDo && area.thingsToDo.length > 0 ? `
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #071536;">Things to Do &amp; Community Highlights in ${area.name}</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            ${area.thingsToDo.map((t) => `
            <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; background: #f8fafc;">
              <span style="font-size: 0.75rem; font-family: monospace; color: #12582e; text-transform: uppercase;">${escapeHtml(t.spot)}</span>
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #071536; margin: 0.25rem 0;">${escapeHtml(t.title)}</h3>
              <p style="font-size: 0.85rem; color: #475569; line-height: 1.4;">${escapeHtml(t.description)}</p>
            </div>`).join('')}
          </div>` : ''}

          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #071536;">Local Market Insight &amp; Sanitation Protocols</h2>
          <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">${escapeHtml(area.marketInsight)}</p>
          ${area.localCopy ? area.localCopy.map((p) => `<p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">${escapeHtml(p)}</p>`).join('') : ''}

          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #071536;">Frequently Asked Questions in ${area.name}</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem;">
            <div style="border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #071536; margin-bottom: 0.5rem;">How often should my ${area.name} facility or office be professionally cleaned?</h3>
              <p style="color: #475569; font-size: 0.95rem; line-height: 1.5;">Most commercial offices and healthcare clinics in ${area.name} benefit from daily or 3x-weekly evening janitorial maintenance. High-traffic retail spaces and dental practices typically schedule nightly disinfection, while corporate suites may choose custom 2x or 3x weekly rotations.</p>
            </div>
            <div style="border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #071536; margin-bottom: 0.5rem;">Do you provide same-day Airbnb and vacation rental turnover cleaning in ${area.name}?</h3>
              <p style="color: #475569; font-size: 0.95rem; line-height: 1.5;">Yes! We specialize in rapid 10:00 AM to 4:00 PM turnaround windows across ${area.name}. Our service includes professional linen laundering, restocking guest consumables, complete bathroom and kitchen sanitization, and photo inspection verification.</p>
            </div>
            <div style="border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #071536; margin-bottom: 0.5rem;">Are your cleaning solutions safe for children, pets, and sensitive environments in ${area.name}?</h3>
              <p style="color: #475569; font-size: 0.95rem; line-height: 1.5;">Absolutely. We utilize EPA-registered hospital-grade disinfectants and eco-friendly, non-toxic cleaning agents that eliminate 99.9% of bacteria and viruses without harsh chemical fumes, making them safe for kids, pets, and healthcare environments.</p>
            </div>
            <div style="border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #071536; margin-bottom: 0.5rem;">What is your 100% Satisfaction Guarantee policy for ${area.name} properties?</h3>
              <p style="color: #475569; font-size: 0.95rem; line-height: 1.5;">We stand 100% behind every clean. If any aspect of our service does not meet your high expectations, notify us within 24 hours and our team will promptly return to re-clean the area for free. If you are still not completely thrilled, you do not pay.</p>
            </div>
            <div style="border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #071536; margin-bottom: 0.5rem;">How quickly can you start cleaning services at our ${area.name} property?</h3>
              <p style="color: #475569; font-size: 0.95rem; line-height: 1.5;">We can often accommodate emergency or next-day cleaning across ${area.name}. For recurring commercial janitorial or residential maintenance, we provide a prompt on-site walkthrough within 24 hours and can begin service immediately upon scope approval.</p>
            </div>
          </div>

          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #071536;">Our Location &amp; Service Radius in ${area.name}, FL</h2>
          <div class="map-embed" style="margin-bottom: 3rem; border-radius: 1rem; overflow: hidden; border: 1px solid #e2e8f0;">
            <iframe src="https://maps.google.com/maps?q=${encodeURIComponent(area.name + ', FL')}&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=&amp;output=embed" title="Google Map of ${area.name}, FL" width="100%" height="400" style="border:0;" loading="lazy"></iframe>
          </div>

          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #071536;">Explore Other South Florida Service Areas</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
            <a href="/service-areas" style="padding: 0.5rem 1rem; border-radius: 0.5rem; background: #12582e; color: #fff; font-weight: 700; font-size: 0.85rem; text-decoration: none;">View All 56 Florida Service Areas &rarr;</a>
            ${serviceAreas.filter((a) => a.slug !== area.slug).slice(0, 16).map((a) => `<a href="/service-area/${a.slug}" style="padding: 0.5rem 1rem; border-radius: 0.5rem; background: #f1f5f9; color: #071536; font-size: 0.85rem; text-decoration: none;">${a.name}, FL</a>`).join('')}
          </div>
        </div>
      </section>
    </main>`;
      }
    }

    let routeHtml = templateHtml;

    // 1. Replace Title
    routeHtml = routeHtml.replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${escapeHtml(meta.title)}</title>`
    );

    // 2. Replace Meta Description
    routeHtml = routeHtml.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`
    );

    // 3. Replace Canonical Link
    routeHtml = routeHtml.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${meta.canonical}" />`
    );

    // 4. Replace Open Graph Title, Description, URL, Image
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(meta.title)}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtml(meta.description)}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${meta.canonical}" />`
    );
    if (meta.ogImage) {
      routeHtml = routeHtml.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:image" content="${meta.ogImage}" />`
      );
    }

    // 5. Replace Twitter Title, Description, Image
    routeHtml = routeHtml.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
    );
    if (meta.ogImage) {
      routeHtml = routeHtml.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="twitter:image" content="${meta.ogImage}" />`
      );
    }

    // 6. Inject Schema.org JSON-LD Structured Data & Robots Policy
    if (route.path === '/404') {
      // 404 should have no schema block and must have noindex robots policy
      routeHtml = routeHtml.replace(
        /<script\s+id="dynamic-jsonld"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
        ''
      );
      routeHtml = routeHtml.replace(
        /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
        '<meta name="robots" content="noindex, nofollow" />'
      );
    } else if (extractedSchema) {
      routeHtml = routeHtml.replace(
        /<script\s+id="dynamic-jsonld"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
        `<script id="dynamic-jsonld" type="application/ld+json">\n${extractedSchema}\n  </script>`
      );
    }

    // 7. Inject Semantic Crawler Fallback inside <div id="root">
    const defaultDrawer = `
    <div class="mobile-nav-overlay" aria-hidden="true"></div>
    <aside id="mobile-nav-drawer" class="mobile-nav-drawer" aria-label="Mobile Navigation Drawer">
      <div class="drawer-header">
        <a href="/" class="brand-logo" aria-label="South Florida Cleaning Concepts Home">
          <img src="/assets/images/logo/logo.svg" alt="South Florida Cleaning Concepts Logo" width="160" height="40" />
        </a>
        <button type="button" class="drawer-close-btn" aria-label="Close navigation menu">✕</button>
      </div>
      <nav class="drawer-nav">
        <ul class="drawer-nav-list">
          <li><a href="/" class="nav-link">Home</a></li>
          <li><a href="/about-us.html" class="nav-link">About Us</a></li>
          <li>
            <button type="button" class="mobile-accordion-toggle" aria-expanded="false">
              <span>Our Services</span>
              <svg class="dropdown-indicator" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
            <ul class="mobile-accordion-content">
              <li><a href="/service/office-cleaning.html" class="drawer_sub_link">Office Cleaning</a></li>
              <li><a href="/service/medical-office-cleaning.html" class="drawer_sub_link">Medical Facilities</a></li>
              <li><a href="/service/bars-and-restaurant-cleaning.html" class="drawer_sub_link">Bars &amp; Restaurants</a></li>
              <li><a href="/service/short-term-rentals.html" class="drawer_sub_link">Short-Term Rentals</a></li>
              <li><a href="/service/post-construction-cleaning.html" class="drawer_sub_link">Post-Construction</a></li>
              <li><a href="/service/move-in-out-cleaning.html" class="drawer_sub_link">Move In / Move Out</a></li>
              <li><a href="/service/home-maintenance.html" class="drawer_sub_link">Home Maintenance</a></li>
              <li><a href="/service/school-cleaning.html" class="drawer_sub_link">School Cleaning</a></li>
              <li><a href="/service/home-watching.html" class="drawer_sub_link">Home Watching</a></li>
              <li><a href="/service/covid-19-disinfection.html" class="drawer_sub_link">COVID-19 Disinfection</a></li>
              <li><a href="/our-services.html" class="drawer_sub_link" style="font-weight: 700;">All Services Overview →</a></li>
            </ul>
          </li>
          <li><a href="/service-areas" class="nav-link">Service Areas (56)</a></li>
          <li><a href="/faqs.html" class="nav-link">FAQs</a></li>
          <li><a href="/our-publications.html" class="nav-link">Publications</a></li>
          <li><a href="/contact-us.html" class="nav-link">Contact Us</a></li>
        </ul>
      </nav>
      <div class="drawer-footer">
        <a href="tel:5617045303" class="btn btn-phone" style="width: 100%;">📞 Call (561) 704-5303</a>
        <a href="/contact-us.html" class="btn btn-primary" style="width: 100%;">⚡ Get Free Quote</a>
      </div>
    </aside>`;

    if (extractedMain) {
      const crawlerFallback = `
    ${extractedHeader || standardHeader}
    ${extractedOverlay || '<div class="mobile-nav-overlay" aria-hidden="true"></div>'}
    ${extractedDrawer || defaultDrawer}
    ${extractedMain}
    <nav class="mobile-bottom-bar" aria-label="Quick Actions">
      <div class="bottom-bar-grid">
        <a href="tel:5617045303" class="bottom-bar-btn bottom-bar-call">Call Now</a>
        <a href="/contact-us" class="bottom-bar-btn bottom-bar-quote">Free Quote</a>
      </div>
    </nav>
    ${extractedFooter || standardFooter}
`;
      if (routeHtml.includes('<!-- ROOT_START -->')) {
        routeHtml = routeHtml.replace(
          /<!-- ROOT_START -->[\s\S]*?<!-- ROOT_END -->/i,
          `<!-- ROOT_START -->\n  <div id="root">\n${crawlerFallback}\n  </div>\n  <!-- ROOT_END -->`
        );
      } else {
        routeHtml = routeHtml.replace(
          /<div id="root">[\s\S]*?<\/div>/i,
          `<div id="root">\n${crawlerFallback}\n  </div>`
        );
        if (!routeHtml.includes('<div id="root">\n')) {
          routeHtml = routeHtml.replace(
            '<div id="root"></div>',
            `<div id="root">\n${crawlerFallback}\n  </div>`
          );
        }
      }
    }

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

    generatedCount++;
  }

  console.log(`[prerender-routes] Generated ${generatedCount} static pre-rendered routes in dist/.`);
}

prerenderAllRoutes().catch((err) => {
  console.error('[prerender-routes] Error:', err);
  process.exit(1);
});
