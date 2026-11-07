import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Phone } from 'lucide-react';
import { SERVICES_CATALOG, BUSINESS_NAP } from '../data/siteData';

export const ServicesOverviewPage: React.FC = () => {
  return (
    <article className="services-overview-page">
      {/* Subpage Hero Header */}
      <section className="page-hero relative bg-[#071536] text-white py-20 overflow-hidden" aria-label="Services Overview Header">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="/assets/images/services/service-img-12.jpg"
            alt="South Florida Cleaning Concepts Commercial and Residential Overview"
            width="1920"
            height="600"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Services we provide with top quality Cleaning
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Explore specialized commercial, medical, restaurant, and luxury residential cleaning services across Palm Beach &amp; South Florida.
          </p>
          <nav className="breadcrumbs flex items-center justify-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span aria-current="page" className="text-[#a3e6be]">Our Services</span>
          </nav>
        </div>
      </section>

      {/* Services Grid Catalog */}
      <section className="section py-20 bg-white" aria-labelledby="catalog-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#12582e] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Service Spectrum</span>
            </div>
            <h2 id="catalog-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-4">
              10 Specialized Cleaning Services
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Every service is delivered by vetted specialists using hospital-grade disinfectants, color-coded tools, and backed by our 100% Satisfaction Guarantee.
            </p>
          </div>

          <div className="space-y-12">
            {SERVICES_CATALOG.map((svc, idx) => (
              <div
                key={svc.slug}
                className={`service-detail-card rounded-3xl border border-slate-200/80 bg-white p-8 lg:p-12 shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden h-72 lg:h-96 shadow-md bg-slate-100">
                  <img
                    src={svc.image}
                    alt={`${svc.title} - South Florida Cleaning Concepts`}
                    width="800"
                    height="600"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-[#12582e] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    100% Guaranteed
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#071536] mb-3">
                      {svc.title}
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed mb-6">
                      {svc.fullDesc}
                    </p>

                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Key Capabilities:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 mb-8 p-0 m-0 list-none">
                      {svc.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#12582e] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                    <Link
                      to={`/service/${svc.slug}`}
                      className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-3 px-6 rounded-xl text-sm shadow-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <span>Explore {svc.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/contact-us"
                      className="btn btn-outline border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold py-3 px-5 rounded-xl text-sm transition-colors"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Bottom Bar */}
      <section className="section py-16 bg-[#071536] text-white text-center" aria-label="Services Guarantee">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShieldCheck className="w-12 h-12 text-[#a3e6be] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Every Service Backed by Our 100% Satisfaction Guarantee
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            If we fail to make you happy, we do not expect you to pay. Call (561) 704-5303 today to schedule your personalized estimate.
          </p>
          <a
            href={`tel:${BUSINESS_NAP.phoneRaw}`}
            className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-3.5 px-8 rounded-xl text-base shadow-lg transition-colors inline-flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            <span>Call (561) 704-5303 Now</span>
          </a>
        </div>
      </section>
    </article>
  );
};
