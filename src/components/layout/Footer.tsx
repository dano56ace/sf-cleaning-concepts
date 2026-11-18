import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { BUSINESS_NAP, SERVICES_CATALOG, BLOG_POSTS } from '../../data/siteData';

const FEATURED_SERVICE_SLUGS = [
  'office-cleaning',
  'medical-office-cleaning',
  'short-term-rentals',
  'home-maintenance',
  'post-construction-cleaning',
];

const FEATURED_BLOG_SLUGS = [
  'revitalize-your-office-space',
  'post-construction-cleaning-guide',
  'high-quality-cleaning-services-south-florida',
  'office-cleaning-made-easy',
  'complete-guide-to-home-cleaning',
];

const SERVICE_HUBS = [
  { name: 'Jupiter', slug: 'jupiter' },
  { name: 'West Palm Beach', slug: 'west-palm-beach' },
  { name: 'Boca Raton', slug: 'boca-raton' },
  { name: 'Delray Beach', slug: 'delray-beach' },
  { name: 'Boynton Beach', slug: 'boynton-beach' },
  { name: 'Broward County', slug: 'broward-county' },
  { name: 'Miami-Dade County', slug: 'miami-dade-county' },
];

export const Footer: React.FC = () => {
  const featuredServices = FEATURED_SERVICE_SLUGS.map((slug) =>
    SERVICES_CATALOG.find((svc) => svc.slug === slug)
  ).filter((svc): svc is NonNullable<typeof svc> => Boolean(svc));

  const featuredGuides = FEATURED_BLOG_SLUGS.map((slug) =>
    BLOG_POSTS.find((post) => post.slug === slug)
  ).filter((post): post is NonNullable<typeof post> => Boolean(post));

  return (
    <footer className="site-footer bg-[#071536] text-white pt-14 pb-24 md:pb-14 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Top Trust Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8 mb-10 border-b border-slate-800/80 text-sm">
          <div className="font-semibold text-white">Family-Owned Since 2004</div>
          <div className="text-slate-300">Palm Beach, Broward &amp; Miami-Dade</div>
          <div className="text-[#a3e6be] font-semibold">
            {BUSINESS_NAP.ratingScore}★ Rated Local Pros
          </div>
          <div>
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="font-mono font-bold text-white hover:text-[#a3e6be] transition-colors tabular-nums"
            >
              Call {BUSINESS_NAP.phone}
            </a>
          </div>
        </div>

        {/* Main 4-Column Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          {/* Column 1: Brand & NAP (4 cols) */}
          <div className="footer-col lg:col-span-4 min-w-0">
            <Link to="/" className="inline-block mb-4" aria-label="South Florida Cleaning Concepts Home">
              <img
                src="/assets/images/logo/logo.svg"
                alt="South Florida Cleaning Concepts Logo"
                width="180"
                height="45"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed mb-5 max-w-sm">
              Family-owned since 2004, delivering vetted residential and commercial cleaning across South Florida.
            </p>
            <ul className="footer-contact-list flex flex-col gap-2.5 text-sm text-slate-300 p-0 m-0 list-none">
              <li className="flex items-center gap-3 min-w-0">
                <Phone className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="font-mono hover:text-white transition-colors tabular-nums"
                >
                  {BUSINESS_NAP.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 min-w-0">
                <Mail className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <a
                  href={`mailto:${BUSINESS_NAP.email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {BUSINESS_NAP.email}
                </a>
              </li>
              <li className="flex items-center gap-3 min-w-0">
                <MapPin className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>Boynton Beach, FL 33435</span>
              </li>
              <li className="flex items-center gap-3 min-w-0">
                <Clock className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>{BUSINESS_NAP.hours}</span>
              </li>
              <li className="flex items-center gap-3 min-w-0">
                <ArrowUpRight className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <a
                  href={BUSINESS_NAP.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook ({BUSINESS_NAP.facebookHandle})
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Core Navigation (2 cols) */}
          <div className="footer-col lg:col-span-2 min-w-0">
            <h2 className="text-white text-xs font-mono font-bold uppercase tracking-widest mb-4">
              Quick Links
            </h2>
            <ul className="footer-links flex flex-col gap-2.5 text-sm text-slate-300 p-0 m-0 list-none">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/our-services" className="hover:text-white transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/service-areas" className="hover:text-white transition-colors">Service Areas</Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/our-publications" className="hover:text-white transition-colors">Guides</Link>
              </li>
              <li>
                <Link to="/about-us#careers" className="hover:text-white transition-colors">
                  {BUSINESS_NAP.careersHeadline}
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-[#a3e6be] font-semibold hover:text-white transition-colors">
                  Free Quote →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Services (3 cols) */}
          <div className="footer-col lg:col-span-3 min-w-0">
            <h2 className="text-white text-xs font-mono font-bold uppercase tracking-widest mb-4">
              Popular Services
            </h2>
            <ul className="footer-links flex flex-col gap-2.5 text-sm text-slate-300 p-0 m-0 list-none">
              {featuredServices.map((svc) => (
                <li key={svc.slug}>
                  <Link to={`/service/${svc.slug}`} className="hover:text-white transition-colors">
                    {svc.title}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/our-services"
                  className="text-[#a3e6be] font-semibold hover:text-white transition-colors inline-flex items-center gap-1 text-xs uppercase tracking-wider font-mono"
                >
                  All 10 Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: 100% Satisfaction Guarantee (3 cols) */}
          <div className="footer-col lg:col-span-3 min-w-0">
            <h2 className="text-white text-xs font-mono font-bold uppercase tracking-widest mb-4">
              Our Guarantee
            </h2>
            <div className="footer-guarantee-box bg-white/[0.04] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mb-2.5">
                <ShieldCheck className="w-5 h-5 text-[#a3e6be] shrink-0" />
                <span className="font-bold text-white text-sm">Love Your Clean or Don’t Pay</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed m-0">
                Not 100% thrilled? Tell us within 24 hours for a free re-clean—or don’t pay.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Row 1: Featured Guides */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-400">
              Featured Guides
            </div>
            <Link
              to="/our-publications"
              className="text-xs font-bold text-[#a3e6be] hover:underline"
            >
              All Guides →
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
            {featuredGuides.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="hover:text-white transition-colors"
              >
                {post.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Middle Row 2: Service Areas Hubs */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-400">
              Service Areas (56 Locations)
            </div>
            <Link
              to="/service-areas"
              className="text-xs font-bold text-[#a3e6be] hover:underline"
            >
              All 56 Cities →
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
            {SERVICE_HUBS.map((city) => (
              <Link
                key={city.slug}
                to={`/service-area/${city.slug}`}
                className="hover:text-white transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="footer-bottom pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="m-0 text-center sm:text-left">
            &copy; 2026 South Florida Cleaning Concepts LLC. Licensed &amp; Insured.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/contact-us" className="hover:text-white transition-colors">Privacy &amp; Terms</Link>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
            <a href="/robots.txt" className="hover:text-white transition-colors">Robots.txt</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
