import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { SERVICES_CATALOG } from '../data/siteData';
import { InteriorHero, INTERIOR_HERO_IMAGES } from '../components/ui/InteriorHero';

interface ServiceDirectoryPageProps {
  onOpenQuoteModal?: (serviceTitle?: string) => void;
}

export const ServiceDirectoryPage: React.FC<ServiceDirectoryPageProps> = ({ onOpenQuoteModal }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = SERVICES_CATALOG.filter((svc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      svc.title.toLowerCase().includes(q) ||
      svc.shortDesc.toLowerCase().includes(q) ||
      svc.features.some((f) => f.toLowerCase().includes(q))
    );
  });

  return (
    <article className="service-directory-page">
      <InteriorHero
        ariaLabel="Directory Header"
        align="center"
        kicker="All 10 Cleaning Services · Compare & Choose"
        title="Commercial & Residential Services Directory"
        description="Find the right clean for your home, vacation rental, or workplace across Palm Beach, Broward, and Miami-Dade counties."
        imageSrc={INTERIOR_HERO_IMAGES.sparklingKitchen}
        imageAlt="Sparkling freshly cleaned South Florida modern kitchen interior"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Services Directory' }
        ]}
      />

      {/* Directory Grid */}
      <section className="section py-20 lg:py-24 bg-white" aria-labelledby="directory-list-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="editorial-kicker mb-3">
                <span>10 Ways We Help You Shine</span>
              </div>
              <h2 id="directory-list-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-2">
                Browse All Cleaning Services
              </h2>
              <p className="text-slate-600 text-base m-0">
                Pick any service below to see our full room-by-room checklist and request your free quote.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. home, Airbnb, office)..."
                aria-label="Filter cleaning services"
                className="w-full pl-10 pr-9 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#12582e] bg-slate-50/70 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear service search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#071536] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center max-w-xl mx-auto">
              <h3 className="text-lg font-extrabold text-[#071536] mb-2">
                No matching cleaning services found
              </h3>
              <p className="text-sm text-slate-600 mb-5">
                We couldn’t find a service matching &ldquo;{searchQuery}&rdquo;. Try another keyword or browse all 10 of our residential and commercial services.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-5 py-2.5 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white text-sm font-bold transition-colors cursor-pointer"
              >
                Show All 10 Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredServices.map((svc) => {
                return (
                  <div
                    key={svc.slug}
                    className="p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-[#12582e]/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-48 rounded-xl overflow-hidden mb-5 bg-slate-100">
                        <img
                          src={svc.image}
                          alt={`${svc.title} South Florida Cleaning Concepts`}
                          width="500"
                          height="300"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071536]/75 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                          <span className="text-[#a3e6be] font-bold">100% Guaranteed</span>
                          <span className="text-slate-200 tabular-nums">{svc.checklist.length}-Point Clean</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-extrabold text-[#071536] mb-2 group-hover:text-[#12582e] transition-colors">
                        <Link to={`/service/${svc.slug}`}>
                          {svc.title}
                        </Link>
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {svc.shortDesc}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        to={`/service/${svc.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#12582e] hover:text-[#0d4222] transition-colors whitespace-nowrap"
                      >
                        <span>See What’s Included</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                      {onOpenQuoteModal && (
                        <button
                          type="button"
                          onClick={() => onOpenQuoteModal(svc.title)}
                          className="text-xs font-mono font-bold text-[#071536] hover:text-[#12582e] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Free Quote →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </article>
  );
};
