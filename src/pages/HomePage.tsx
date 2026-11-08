import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroVideo } from '../components/ui/HeroVideo';
import { TrustBadges, RotationSystemSection } from '../components/ui/TrustBadges';
import { CleaningEstimator } from '../components/ui/CleaningEstimator';
import { TestimonialsSlider } from '../components/ui/TestimonialsSlider';
import { FaqAccordion } from '../components/ui/FaqAccordion';
import { QuoteForm } from '../components/ui/QuoteForm';
import { SERVICES_CATALOG, FAQS_LIST, BUSINESS_NAP } from '../data/siteData';
import { ArrowRight, Phone, CheckCircle2, MapPin } from 'lucide-react';

interface HomePageProps {
  onOpenQuoteModal?: (serviceTitle?: string) => void;
}

const SERVICE_CATEGORY_MAP: Record<string, 'commercial' | 'hospitality' | 'residential'> = {
  'office-cleaning': 'commercial',
  'medical-office-cleaning': 'commercial',
  'school-cleaning': 'commercial',
  'covid-19-disinfection': 'commercial',
  'bars-and-restaurant-cleaning': 'hospitality',
  'short-term-rentals': 'hospitality',
  'post-construction-cleaning': 'commercial',
  'move-in-out-cleaning': 'residential',
  'home-maintenance': 'residential',
  'home-watching': 'residential'
};

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuoteModal }) => {
  const [serviceFilter, setServiceFilter] = useState<'all' | 'commercial' | 'hospitality' | 'residential'>('all');

  const filteredServices = SERVICES_CATALOG.filter((svc) => {
    if (serviceFilter === 'all') return true;
    return SERVICE_CATEGORY_MAP[svc.slug] === serviceFilter;
  });

  return (
    <>
      {/* 1. Hero Section with 12-Col Split & 4-Col Quantitative Proof Strip */}
      <HeroVideo onOpenQuoteModal={onOpenQuoteModal} />

      {/* 2. Architectural Standards & Trust Grid */}
      <TrustBadges />

      {/* 3. Core Capabilities & 10 Specialized Divisions */}
      <section className="section py-20 lg:py-24 bg-white" aria-labelledby="services-overview-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <div className="editorial-kicker mb-3">
                <span>10 Specialized Divisions · Commercial &amp; Residential</span>
              </div>
              <h2 id="services-overview-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3">
                Commercial &amp; Residential Cleaning Services
              </h2>
              <p className="text-slate-600 text-base sm:text-lg m-0">
                Explore our comprehensive catalog of 10 specialized cleaning solutions tailored for South Florida enterprises, clinical facilities, and luxury coastal residences.
              </p>
            </div>

            {/* Interactive Segmented Category Filter */}
            <div
              className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0"
              role="tablist"
              aria-label="Filter cleaning services"
            >
              {[
                { id: 'all', label: 'All 10 Services' },
                { id: 'commercial', label: 'Commercial & Clinical' },
                { id: 'hospitality', label: 'Dining & Rentals' },
                { id: 'residential', label: 'Estates & Homes' }
              ].map((tab) => {
                const isSelected = serviceFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setServiceFilter(tab.id as any)}
                    className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredServices.map((svc, idx) => {
              const catalogIndex = SERVICES_CATALOG.findIndex((s) => s.slug === svc.slug) + 1;
              const isDesktopFullWidthBanner = filteredServices.length === 10 && idx === 9;
              return (
                <div
                  key={svc.slug}
                  className={`service-card group rounded-2xl overflow-hidden border border-slate-200/90 bg-white hover:shadow-xl hover:border-[#12582e]/40 transition-all duration-200 flex flex-col justify-between ${
                    isDesktopFullWidthBanner ? 'lg:col-span-3 lg:grid lg:grid-cols-12' : ''
                  }`}
                >
                  <div className={isDesktopFullWidthBanner ? 'lg:col-span-5 relative h-56 lg:h-full overflow-hidden bg-slate-100' : 'relative h-56 overflow-hidden bg-slate-100'}>
                    <img
                      src={svc.image}
                      alt={`${svc.title} South Florida Cleaning Concepts`}
                      width="600"
                      height="400"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071536]/75 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <span className="font-mono text-xs font-bold text-[#a3e6be] tabular-nums">
                        DIVISION {String(catalogIndex).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[11px] text-slate-200 uppercase tracking-wider">
                        100% Guaranteed
                      </span>
                    </div>
                  </div>

                  <div className={isDesktopFullWidthBanner ? 'lg:col-span-7 flex flex-col justify-between' : 'flex-grow flex flex-col justify-between'}>
                    <div className="p-6">
                      <h3 className="text-xl font-extrabold text-[#071536] mb-2.5 group-hover:text-[#12582e] transition-colors">
                        <Link to={`/service/${svc.slug}`}>
                          {svc.title}
                        </Link>
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-5">
                        {svc.shortDesc}
                      </p>
                      <ul className={`text-xs text-slate-600 mb-6 p-0 m-0 list-none border-t border-slate-100 pt-4 ${
                        isDesktopFullWidthBanner ? 'grid grid-cols-1 sm:grid-cols-3 gap-3' : 'space-y-2'
                      }`}>
                        {svc.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#12582e] shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        to={`/service/${svc.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#12582e] hover:text-[#0d4222] transition-colors"
                      >
                        <span>View Service Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {onOpenQuoteModal && (
                        <button
                          type="button"
                          onClick={() => onOpenQuoteModal(svc.title)}
                          className="text-xs font-mono font-bold text-[#071536] hover:text-[#12582e] transition-colors cursor-pointer"
                        >
                          Quick Quote →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 m-0">
              Need a customized multi-site commercial contract or residential maintenance plan?
            </p>
            <Link
              to="/our-services"
              className="btn btn-outline border-2 border-[#071536] text-[#071536] hover:bg-[#071536] hover:text-white font-bold py-3 px-7 rounded-xl text-sm transition-all duration-150 inline-flex items-center gap-2 whitespace-nowrap"
            >
              <span>Explore All 10 Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Interactive Scope, Crew & Rate Estimator */}
      <CleaningEstimator onSelectEstimate={(serviceTitle) => onOpenQuoteModal?.(serviceTitle)} />

      {/* 5. Exclusive 4-Phase Rotation Cleaning System */}
      <RotationSystemSection />

      {/* 6. Verified Client Testimonials & Partner Strip */}
      <TestimonialsSlider />

      {/* 7. Categorized FAQ Section */}
      <section className="section py-20 lg:py-24 bg-slate-50 border-t border-slate-200/80" aria-labelledby="home-faq-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="editorial-kicker mb-3">
              <span>Policies, Bonding &amp; Process</span>
            </div>
            <h2 id="home-faq-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-base m-0">
              Direct answers regarding our 4-phase rotation cleaning system, commercial insurance bonding, and hospital-grade disinfectants.
            </p>
          </div>
          <FaqAccordion items={FAQS_LIST} showCategoryFilters={true} />
        </div>
      </section>

      {/* 8. Bottom Lead Capture & Tri-County Dispatch Section */}
      <section className="section py-20 lg:py-24 bg-white border-t border-slate-200/80" aria-labelledby="cta-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#071536] rounded-2xl p-6 sm:p-10 lg:p-14 text-white shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="editorial-kicker-light mb-4">
                <span>Free Personalized Estimate · Same-Day Response</span>
              </div>
              <h2 id="cta-heading" className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready for a Spotless Property in South Florida?
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-8">
                Tell us about your commercial facility or residence. We provide a transparent, itemized quote backed by our ironclad 100% Satisfaction Guarantee.
              </p>

              {/* Regional Service Area Matrix */}
              <div className="p-5 rounded-xl bg-white/[0.04] border border-white/10 mb-8">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#a3e6be] mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>Active South Florida Dispatch Corridors</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-200 font-medium">
                  {BUSINESS_NAP.areasServed.map((area) => (
                    <div key={area} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#a3e6be] shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="inline-flex items-center gap-2.5 text-base font-mono font-bold text-[#a3e6be] hover:text-white transition-colors tabular-nums"
                >
                  <Phone className="w-5 h-5" />
                  <span>Direct Dispatch: {BUSINESS_NAP.phone}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 lg:p-10 text-slate-800 shadow-xl">
              <div className="pb-4 mb-6 border-b border-slate-200/80">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#071536] mb-1">
                  Request Your Free Quote
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 m-0">
                  Complete the 4 quick fields below and an estimator will contact you promptly.
                </p>
              </div>
              <QuoteForm source="HomePage-Bottom" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
