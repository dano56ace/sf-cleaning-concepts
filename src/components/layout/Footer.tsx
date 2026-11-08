import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { BUSINESS_NAP, SERVICES_CATALOG, BLOG_POSTS } from '../../data/siteData';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer bg-[#071536] text-white pt-20 pb-24 md:pb-14 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Regional Coverage Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-14 border-b border-slate-800/80">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#a3e6be] mb-1">
              01 · Regional Headquarters
            </div>
            <div className="text-base font-bold text-white">Boynton Beach, FL 33435</div>
            <div className="text-xs text-slate-400 mt-0.5">Central Dispatch &amp; Operations</div>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#a3e6be] mb-1">
              02 · Primary Service Corridor
            </div>
            <div className="text-base font-bold text-white">Palm Beach &amp; Broward</div>
            <div className="text-xs text-slate-400 mt-0.5">Boca Raton · West Palm · Fort Lauderdale</div>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#a3e6be] mb-1">
              03 · Direct Estimator Line
            </div>
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="text-base font-mono font-bold text-white hover:text-[#a3e6be] transition-colors tabular-nums"
            >
              {BUSINESS_NAP.phone}
            </a>
            <div className="text-xs text-slate-400 mt-0.5">Same-Day Walk-Through Quotes</div>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#a3e6be] mb-1">
              04 · Service Hours
            </div>
            <div className="text-base font-bold text-white">7:00 AM – 8:00 PM Daily</div>
            <div className="text-xs text-slate-400 mt-0.5">24/7 Commercial Night Crews Available</div>
          </div>
        </div>

        {/* Main 4-Column Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-slate-800/80">
          {/* Column 1: Brand & NAP (4 cols) */}
          <div className="footer-col lg:col-span-4">
            <Link to="/" className="inline-block mb-6" aria-label="South Florida Cleaning Concepts Home">
              <img
                src="/assets/images/logo/logo.svg"
                alt="South Florida Cleaning Concepts Logo"
                width="180"
                height="45"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-sm">
              South Florida’s premier commercial and residential cleaning specialists. Trusted by medical facilities, hospitality groups, and coastal estates across Palm Beach, Broward, and Miami-Dade for over 20 years.
            </p>
            <ul className="footer-contact-list flex flex-col gap-3 text-sm text-slate-300 p-0 m-0 list-none">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="font-mono hover:text-white transition-colors tabular-nums"
                >
                  {BUSINESS_NAP.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <a href={`mailto:${BUSINESS_NAP.email}`} className="hover:text-white transition-colors">
                  {BUSINESS_NAP.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#a3e6be] shrink-0 mt-0.5" />
                <span>Serving Palm Beach, Broward &amp; Miami-Dade Counties, FL</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>Mon–Sun: 7:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Core Navigation (2 cols) */}
          <div className="footer-col lg:col-span-2">
            <h3 className="text-white text-xs font-mono font-bold uppercase tracking-widest mb-5">
              Navigation
            </h3>
            <ul className="footer-links flex flex-col gap-3 text-sm text-slate-300 p-0 m-0 list-none">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/our-services" className="hover:text-white transition-colors">Services Overview</Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-white transition-colors">Service Directory</Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">FAQs &amp; Policies</Link>
              </li>
              <li>
                <Link to="/our-publications" className="hover:text-white transition-colors">Publications</Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-[#a3e6be] font-semibold hover:text-white transition-colors">
                  Request Quote →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: 10 Specialized Divisions (3 cols) */}
          <div className="footer-col lg:col-span-3">
            <h3 className="text-white text-xs font-mono font-bold uppercase tracking-widest mb-5">
              Cleaning Divisions
            </h3>
            <ul className="footer-links flex flex-col gap-2.5 text-sm text-slate-300 p-0 m-0 list-none">
              {SERVICES_CATALOG.slice(0, 8).map((svc) => (
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
                  <span>View All 10 Divisions</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: 100% Satisfaction Guarantee (3 cols) */}
          <div className="footer-col lg:col-span-3">
            <h3 className="text-white text-xs font-mono font-bold uppercase tracking-widest mb-5">
              Our Ironclad Pledge
            </h3>
            <div className="footer-guarantee-box bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <ShieldCheck className="w-5 h-5 text-[#a3e6be] shrink-0" />
                <span className="font-bold text-white text-sm">100% Satisfaction Guarantee</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                If we fail to make you happy, we do not expect you to pay. Notify us within 24 hours and our team returns promptly to re-clean free of charge.
              </p>
              <ul className="space-y-2 text-xs text-[#a3e6be] list-none p-0 m-0">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Background-Checked Specialists</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Fully Licensed, Insured &amp; Bonded</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>EPA List N Hospital Disinfectants</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Row: Educational Publications Directory */}
        <div className="py-8 border-b border-slate-800/80">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Published Cleaning Guides &amp; Technical Protocols
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-400">
            {BLOG_POSTS.map((post, idx) => (
              <React.Fragment key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {post.title}
                </Link>
                {idx < BLOG_POSTS.length - 1 && (
                  <span className="text-slate-700" aria-hidden="true">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="footer-bottom pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="m-0 text-center sm:text-left">
            &copy; 2026 South Florida Cleaning Concepts LLC. All Rights Reserved. Licensed &amp; Insured Commercial &amp; Residential Cleaning.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/contact-us" className="hover:text-white transition-colors">Privacy &amp; Terms</Link>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <a href="/robots.txt" className="hover:text-white transition-colors">Robots.txt</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
