import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, Phone, AlertTriangle } from 'lucide-react';
import { SERVICES_CATALOG, BUSINESS_NAP } from '../data/siteData';

export const NotFoundPage: React.FC = () => {
  return (
    <article className="not-found-page py-24 sm:py-32 bg-white text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#071536] mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          The page you requested could not be found. It may have moved or been renamed. Return to the South Florida Cleaning Concepts homepage or explore our services below.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/"
            className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-3.5 px-8 rounded-xl text-sm transition-colors inline-flex items-center gap-2 shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <a
            href={`tel:${BUSINESS_NAP.phoneRaw}`}
            className="btn btn-phone py-3.5 px-6 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm transition-colors inline-flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#12582e]" />
            <span>Call (561) 704-5303</span>
          </a>
        </div>

        {/* Popular Services Quick Grid */}
        <div className="text-left bg-slate-50 border border-slate-200/80 rounded-3xl p-8">
          <h2 className="text-lg font-bold text-[#071536] mb-4">
            Popular Cleaning Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICES_CATALOG.slice(0, 6).map((svc) => (
              <Link
                key={svc.slug}
                to={`/service/${svc.slug}`}
                className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#12582e]/40 hover:text-[#12582e] text-sm font-semibold text-slate-800 transition-colors flex items-center justify-between"
              >
                <span>{svc.title}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
