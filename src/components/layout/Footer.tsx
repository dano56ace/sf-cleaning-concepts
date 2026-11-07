import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BUSINESS_NAP, SERVICES_CATALOG, BLOG_POSTS } from '../../data/siteData';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer bg-[#071536] text-white pt-16 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & NAP */}
          <div className="footer-col">
            <Link to="/" className="inline-block mb-6" aria-label="South Florida Cleaning Concepts Home">
              <img
                src="/assets/images/logo/logo.svg"
                alt="South Florida Cleaning Concepts Logo"
                width="180"
                height="45"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              South Florida’s premier commercial and residential cleaning specialists. Trusted by leading businesses and luxury estates across Palm Beach, Broward, and Miami-Dade for over 20 years.
            </p>
            <ul className="footer-contact-list flex flex-col gap-3 text-sm text-slate-300 p-0 m-0 list-none">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#61997a] shrink-0" />
                <a href={`tel:${BUSINESS_NAP.phoneRaw}`} className="hover:text-white transition-colors">
                  {BUSINESS_NAP.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#61997a] shrink-0" />
                <a href={`mailto:${BUSINESS_NAP.email}`} className="hover:text-white transition-colors">
                  {BUSINESS_NAP.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#61997a] shrink-0 mt-0.5" />
                <span>Serving Palm Beach & Broward Counties, FL</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#61997a] shrink-0" />
                <span>Mon–Sun: 7:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links & Core Pages */}
          <div className="footer-col">
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="footer-links flex flex-col gap-2.5 text-sm text-slate-300 p-0 m-0 list-none">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/our-services" className="hover:text-white transition-colors">Our Services Overview</Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/our-publications" className="hover:text-white transition-colors">Cleaning Publications & Guides</Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-white transition-colors font-semibold text-[#61997a]">Contact & Free Quote</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Commercial & Residential Services */}
          <div className="footer-col">
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-5">
              Our Cleaning Services
            </h3>
            <ul className="footer-links flex flex-col gap-2 text-sm text-slate-300 p-0 m-0 list-none">
              {SERVICES_CATALOG.slice(0, 7).map((svc) => (
                <li key={svc.slug}>
                  <Link to={`/service/${svc.slug}`} className="hover:text-white transition-colors">
                    {svc.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/our-services" className="text-[#61997a] font-semibold hover:text-white transition-colors mt-1 inline-block">
                  All 10 Specialized Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: 100% Satisfaction Guarantee */}
          <div className="footer-col">
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-5">
              100% Satisfaction
            </h3>
            <div className="footer-guarantee-box bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-[#61997a]" />
                <span className="font-bold text-white text-sm">Guaranteed Results</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                If we fail to make you happy, we do not expect you to pay. It’s that simple. We believe in our work and back every clean with our 100% Satisfaction Guarantee.
              </p>
              <ul className="space-y-1 text-xs text-[#a3e6be] list-none p-0 m-0">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Vetted & Background-Checked</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Fully Insured & Bonded</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Hospital-Grade Disinfection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Row: Educational Articles Links */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Cleaning Insights & Educational Articles:
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="hover:text-slate-200 transition-colors"
              >
                {post.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="footer-bottom pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="m-0 text-center sm:text-left">
            &copy; 2026 South Florida Cleaning Concepts. All Rights Reserved. Licensed & Insured Commercial & Residential Cleaning Services.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/contact-us" className="hover:text-slate-200 transition-colors">Privacy & Terms</Link>
            <span>•</span>
            <a href="/sitemap.xml" className="hover:text-slate-200 transition-colors">Sitemap</a>
            <span>•</span>
            <a href="/robots.txt" className="hover:text-slate-200 transition-colors">Robots.txt</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
