import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Building2, Phone } from 'lucide-react';
import { SERVICES_CATALOG, BUSINESS_NAP } from '../data/siteData';

export const ServiceDirectoryPage: React.FC = () => {
  return (
    <article className="service-directory-page">
      {/* Header */}
      <section className="page-hero relative bg-[#071536] text-white py-20 overflow-hidden" aria-label="Directory Header">
        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Commercial &amp; Residential Services Directory
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Browse our complete directory of 10 specialized cleaning services across Palm Beach, Broward, and Miami-Dade counties.
          </p>
          <nav className="breadcrumbs flex items-center justify-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span aria-current="page" className="text-[#a3e6be]">Services Directory</span>
          </nav>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="section py-20 bg-white" aria-labelledby="directory-list-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 id="directory-list-heading" className="text-3xl font-extrabold text-[#071536] mb-3">
              Complete Directory of Services
            </h2>
            <p className="text-slate-600 text-base">
              Click on any cleaning service below to view detailed scope of work, checklists, and quote options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_CATALOG.map((svc) => (
              <div
                key={svc.slug}
                className="p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-[#12582e]/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 rounded-xl overflow-hidden mb-5 bg-slate-100">
                    <img
                      src={svc.image}
                      alt={`${svc.title} South Florida Cleaning Concepts`}
                      width="500"
                      height="300"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#071536] mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {svc.shortDesc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={`/service/${svc.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#12582e] hover:text-[#0d4222] transition-colors"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};
