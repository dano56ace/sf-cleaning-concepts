import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Phone } from 'lucide-react';
import { SERVICES_CATALOG, BUSINESS_NAP } from '../data/siteData';
import { CleaningEstimator } from '../components/ui/CleaningEstimator';
import { InteriorHero, INTERIOR_HERO_IMAGES } from '../components/ui/InteriorHero';

interface ServicesOverviewPageProps {
  onOpenQuoteModal?: (serviceTitle?: string) => void;
}

export const ServicesOverviewPage: React.FC<ServicesOverviewPageProps> = ({ onOpenQuoteModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'commercial' | 'residential'>('all');

  const commercialSlugs = [
    'office-cleaning',
    'medical-office-cleaning',
    'bars-and-restaurant-cleaning',
    'post-construction-cleaning',
    'school-cleaning',
    'covid-19-disinfection'
  ];

  const filteredCatalog = SERVICES_CATALOG.filter((svc) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'commercial') return commercialSlugs.includes(svc.slug);
    return !commercialSlugs.includes(svc.slug);
  });

  return (
    <article className="services-overview-page">
      <InteriorHero
        ariaLabel="Services Overview Header"
        align="center"
        kicker="10 Ways We Make Your Space Shine · South Florida"
        title="Cleaning Services for Your Home, Rental & Workplace"
        description="Whether you want a sparkling family home, a 5-star vacation rental turnover, or a fresh, welcoming workplace, our friendly local team brings all the supplies and guarantees you’ll love your clean."
        imageSrc={INTERIOR_HERO_IMAGES.modernOffice}
        imageAlt="Pristine South Florida modern executive office and glass conference interior"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Our Services' }
        ]}
      />

      {/* Services Grid Catalog */}
      <section className="section py-20 lg:py-24 bg-white" aria-labelledby="catalog-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <div className="editorial-kicker mb-3">
                <span>Tailored to Your Home or Business</span>
              </div>
              <h2 id="catalog-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3">
                Choose the Clean That Fits Your Life
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed m-0">
                Every visit is handled by our friendly, background-checked pros using kid- and pet-safe supplies—and backed by our Love Your Clean or Don’t Pay Guarantee.
              </p>
            </div>

            {/* Interactive Filter Tabs */}
            <div
              className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0 w-fit"
              role="tablist"
              aria-label="Filter service divisions"
            >
              {[
                { id: 'all', label: 'All 10 Services' },
                { id: 'residential', label: 'Homes & Vacation Rentals (4)' },
                { id: 'commercial', label: 'Offices, Clinics & Dining (6)' }
              ].map((tab) => {
                const active = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(tab.id as any)}
                    className={`px-4 py-2.5 min-h-[40px] rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#071536] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#071536] hover:bg-white/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-10">
            {filteredCatalog.map((svc) => {
              return (
                <div
                  key={svc.slug}
                  className="service-detail-card rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-xs hover:shadow-xl hover:border-[#12582e]/40 transition-all duration-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                >
                  <div className="lg:col-span-5 relative rounded-xl overflow-hidden min-h-[260px] lg:h-full bg-slate-100">
                    <img
                      src={svc.image}
                      alt={`${svc.title} - South Florida Cleaning Concepts`}
                      width="800"
                      height="600"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071536]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <span className="font-mono text-xs font-bold text-[#a3e6be]">
                        All Supplies Included
                      </span>
                      <span className="font-mono text-xs text-white/90">
                        100% Guaranteed
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <div className="font-mono text-xs font-semibold uppercase tracking-widest text-[#12582e] mb-2">
                        Custom Checklist · Kid &amp; Pet Safe
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#071536] mb-3">
                        {svc.title}
                      </h3>
                      <p className="text-slate-600 text-base leading-relaxed mb-6">
                        {svc.fullDesc}
                      </p>

                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        What We Take Off Your Plate:
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-700 mb-8 p-0 m-0 list-none">
                        {svc.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#12582e] shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center gap-3.5 pt-5 border-t border-slate-100">
                      <Link
                        to={`/service/${svc.slug}`}
                        className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-3 px-6 rounded-xl text-sm shadow-xs inline-flex items-center gap-2 transition-colors"
                      >
                        <span>See Full Checklist</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      {onOpenQuoteModal ? (
                        <button
                          type="button"
                          onClick={() => onOpenQuoteModal(svc.title)}
                          className="btn btn-outline border border-slate-300 text-[#071536] hover:bg-slate-50 font-bold py-3 px-5 rounded-xl text-sm transition-colors cursor-pointer"
                        >
                          Book Free Quote
                        </button>
                      ) : (
                        <Link
                          to="/contact-us"
                          className="btn btn-outline border border-slate-300 text-[#071536] hover:bg-slate-50 font-bold py-3 px-5 rounded-xl text-sm transition-colors"
                        >
                          Book Free Quote
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Cleaning Estimator */}
      <CleaningEstimator onSelectEstimate={(title) => onOpenQuoteModal?.(title)} />

      {/* Guarantee Bottom Bar */}
      <section className="section py-16 bg-slate-50 border-t border-slate-200/80 text-center" aria-label="Services Guarantee">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShieldCheck className="w-10 h-10 text-[#12582e] mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071536] mb-3">
            Love Your Clean or You Don’t Pay—Period
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8">
            If you aren’t completely thrilled when we finish, we’ll come right back and fix it for free—or you don’t pay. Call or text (561) 704-5303 today!
          </p>
          <a
            href={`tel:${BUSINESS_NAP.phoneRaw}`}
            className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-mono font-bold py-3.5 px-8 rounded-xl text-base shadow-md transition-colors inline-flex items-center gap-2 tabular-nums"
          >
            <Phone className="w-4 h-4" />
            <span>Call {BUSINESS_NAP.phone} Now</span>
          </a>
        </div>
      </section>
    </article>
  );
};
