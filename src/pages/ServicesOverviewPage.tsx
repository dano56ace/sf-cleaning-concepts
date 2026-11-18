import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SERVICES_CATALOG } from '../data/siteData';
import { CleaningEstimator } from '../components/ui/CleaningEstimator';
import { InteriorHero, INTERIOR_HERO_IMAGES } from '../components/ui/InteriorHero';

interface ServicesOverviewPageProps {
  onOpenQuoteModal?: (serviceTitle?: string) => void;
}

const SERVICE_IMAGE_ALTS: Record<string, string> = {
  'office-cleaning': 'Cleaners sanitizing desks and glass partitions in a South Florida office',
  'medical-office-cleaning': 'Sanitized medical clinic exam suite and waiting room seating',
  'bars-and-restaurant-cleaning': 'Degreased stainless restaurant kitchen and spotless dining bar',
  'short-term-rentals': 'Crisply staged South Florida Airbnb bedroom ready for guest check-in',
  'post-construction-cleaning': 'Technician HEPA-vacuuming drywall dust inside a newly remodeled room',
  'move-in-out-cleaning': 'Freshly scrubbed empty residence kitchen and gleaming hardwood floors',
  'home-maintenance': 'Housekeeper wiping sunlit residential windows in a South Florida home',
  'school-cleaning': 'Disinfected classroom desks and sanitized daycare learning space',
  'home-watching': 'Clean South Florida coastal residence inspected during seasonal home watch',
  'covid-19-disinfection': 'Specialist applying electrostatic disinfectant mist across commercial surfaces',
};

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
        kicker="10 Specialized Plans · South Florida"
        title="Cleaning Services for Your Home, Rental & Workplace"
        description="Tailored cleaning plans for South Florida homes, vacation rentals, and workplaces—all supplies included and 100% guaranteed."
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
                <span>Home &amp; Commercial Plans</span>
              </div>
              <h2 id="catalog-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3">
                Choose the Clean That Fits Your Space
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed m-0">
                Background-checked crews, eco-safe supplies, and our Love Your Clean or Don’t Pay Guarantee.
              </p>
            </div>

            {/* Interactive Filter Tabs */}
            <div
              className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80 max-w-full lg:shrink-0 w-fit"
              role="tablist"
              aria-label="Filter service divisions"
            >
              {[
                { id: 'all', label: 'All (10)' },
                { id: 'residential', label: 'Homes & Rentals (4)' },
                { id: 'commercial', label: 'Commercial (6)' }
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
                      alt={SERVICE_IMAGE_ALTS[svc.slug] || svc.shortDesc}
                      width="800"
                      height="600"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#071536] mb-3">
                        {svc.title}
                      </h3>
                      <p className="text-slate-600 text-base leading-relaxed mb-6">
                        {svc.shortDesc}
                      </p>

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
                          Free Quote
                        </button>
                      ) : (
                        <Link
                          to="/contact-us"
                          className="btn btn-outline border border-slate-300 text-[#071536] hover:bg-slate-50 font-bold py-3 px-5 rounded-xl text-sm transition-colors"
                        >
                          Free Quote
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
    </article>
  );
};
