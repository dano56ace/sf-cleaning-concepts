import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { SERVICES_CATALOG } from '../data/siteData';

export const ServiceDirectoryPage: React.FC = () => {
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
      {/* Header */}
      <section className="page-hero relative bg-[#071536] text-white py-20 lg:py-24 overflow-hidden border-b border-slate-800" aria-label="Directory Header">
        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="editorial-kicker-light mb-4 justify-center">
            <span>Master Specifications Index · 10 Divisions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Commercial &amp; Residential Services Directory
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
            Browse our complete directory of 10 specialized cleaning services across Palm Beach, Broward, and Miami-Dade counties.
          </p>
          <nav className="breadcrumbs flex items-center justify-center gap-2 text-xs font-mono font-semibold text-slate-300" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span aria-current="page" className="text-[#a3e6be]">Services Directory</span>
          </nav>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="section py-20 lg:py-24 bg-white" aria-labelledby="directory-list-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="editorial-kicker mb-3">
                <span>Technical Index</span>
              </div>
              <h2 id="directory-list-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-2">
                Complete Directory of Services
              </h2>
              <p className="text-slate-600 text-base m-0">
                Select any cleaning division below to inspect full scope of work, quality checklists, and quote options.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by service or keyword..."
                aria-label="Filter cleaning services"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#12582e] bg-slate-50/70 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredServices.map((svc) => {
              const idx = SERVICES_CATALOG.findIndex((s) => s.slug === svc.slug) + 1;
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
                      <div className="absolute bottom-3 left-3 bg-[#071536]/85 backdrop-blur-xs text-[#a3e6be] font-mono text-xs font-bold px-2.5 py-1 rounded-md tabular-nums">
                        {String(idx).padStart(2, '0')}
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
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/service/${svc.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#12582e] hover:text-[#0d4222] transition-colors"
                    >
                      <span>View Specifications</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {svc.checklist.length} Checkpoints
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </article>
  );
};
