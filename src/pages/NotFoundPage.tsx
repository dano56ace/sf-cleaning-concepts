import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES_CATALOG } from '../data/siteData';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-[#f8fafc] min-h-[75vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl text-center">
        <div className="inline-flex items-center justify-center font-mono text-sm font-bold text-[#2a8655] bg-[#e8f5ee] px-4 py-2 rounded-xl mb-6 tabular-nums">
          HTTP ERROR 404
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0b1926] mb-4 tracking-tight">
          404 - Page Not Found
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed max-w-xl mx-auto">
          The page you are looking for may have been moved, renamed, or no longer exists. Explore our core South Florida cleaning divisions below or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            to="/"
            className="w-full sm:w-auto bg-[#2a8655] hover:bg-[#1f6840] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md whitespace-nowrap"
          >
            Back to Homepage
          </Link>
          <Link
            to="/our-services"
            className="w-full sm:w-auto bg-[#0b1926] hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all whitespace-nowrap"
          >
            Explore Our Services
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-200 text-left">
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-slate-400 font-bold mb-4 text-center">
            Direct Service Protocols
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SERVICES_CATALOG.slice(0, 6).map((service, idx) => (
              <Link
                key={service.slug}
                to={`/service/${service.slug}`}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#f8fafc] hover:bg-[#e8f5ee]/60 border border-slate-200/80 text-sm font-bold text-[#0b1926] hover:text-[#2a8655] transition-colors"
              >
                <span>{service.title}</span>
                <span className="font-mono text-xs text-slate-400 tabular-nums">0{idx + 1} →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
