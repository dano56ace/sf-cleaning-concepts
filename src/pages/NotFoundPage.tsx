import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES_CATALOG } from '../data/siteData';
import { InteriorHero, INTERIOR_HERO_IMAGES } from '../components/ui/InteriorHero';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <InteriorHero
        ariaLabel="404 Page Not Found Header"
        align="center"
        kicker="404 · Let’s Get You Back on Track"
        title="404 - Page Not Found"
        description="The page you’re looking for may have moved or been renamed. Explore our popular South Florida cleaning services below or head right back home."
        imageSrc={INTERIOR_HERO_IMAGES.sunlitFoyer}
        imageAlt="Bright welcoming South Florida home foyer interior"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: '404 Not Found' }
        ]}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto bg-[#12582e] hover:bg-[#0d4222] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md whitespace-nowrap"
          >
            Back to Homepage
          </Link>
          <Link
            to="/our-services"
            className="w-full sm:w-auto bg-[#071536]/70 hover:bg-[#071536] border border-white/25 text-white font-bold px-8 py-4 rounded-xl transition-all whitespace-nowrap"
          >
            Explore Our Services
          </Link>
        </div>
      </InteriorHero>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-slate-400 font-bold mb-5 text-center">
            Popular Cleaning Services
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SERVICES_CATALOG.slice(0, 6).map((service, idx) => (
              <Link
                key={service.slug}
                to={`/service/${service.slug}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f8fafc] hover:bg-[#e8f5ee]/60 border border-slate-200/80 text-sm font-bold text-[#0b1926] hover:text-[#2a8655] transition-colors"
              >
                <span>{service.title}</span>
                <span className="font-mono text-xs text-slate-400 tabular-nums">0{idx + 1} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
