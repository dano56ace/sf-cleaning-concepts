import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroVideo } from '../components/ui/HeroVideo';
import { TrustBadges, RotationSystemSection } from '../components/ui/TrustBadges';
import { CleaningEstimator } from '../components/ui/CleaningEstimator';
import { TestimonialsSlider } from '../components/ui/TestimonialsSlider';
import { FaqAccordion } from '../components/ui/FaqAccordion';
import { RecentBlogPosts } from '../components/ui/RecentBlogPosts';
import { PromoVideoShowcase } from '../components/ui/PromoVideoShowcase';
import { SERVICES_CATALOG, FAQS_LIST } from '../data/siteData';
import { ArrowRight } from 'lucide-react';

interface HomePageProps {
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

      {/* 3. Core Capabilities & 10 Specialized Services */}
      <section className="section py-20 lg:py-24 bg-white" aria-labelledby="services-overview-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <div className="editorial-kicker mb-3">
                <span>Homes, Rentals &amp; Workplaces</span>
              </div>
              <h2 id="services-overview-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3">
                10 Specialized South Florida Cleaning Services
              </h2>
              <p className="text-slate-600 text-base sm:text-lg m-0">
                Tailored residential, hospitality, and commercial plans with supplies included.
              </p>
            </div>

            {/* Interactive Segmented Category Filter */}
            <div
              className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0"
              role="tablist"
              aria-label="Filter cleaning services"
            >
              {[
                { id: 'all', label: 'All (10)' },
                { id: 'residential', label: 'Homes & Condos' },
                { id: 'hospitality', label: 'Airbnb & Dining' },
                { id: 'commercial', label: 'Offices & Clinics' }
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
                      alt={SERVICE_IMAGE_ALTS[svc.slug] || svc.shortDesc}
                      width="600"
                      height="400"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className={isDesktopFullWidthBanner ? 'lg:col-span-7 flex flex-col justify-between' : 'flex-grow flex flex-col justify-between'}>
                    <div className="p-6">
                      <h3 className="text-xl font-extrabold text-[#071536] mb-2.5 group-hover:text-[#12582e] transition-colors">
                        <Link to={`/service/${svc.slug}`}>
                          {svc.title}
                        </Link>
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed m-0">
                        {svc.shortDesc}
                      </p>
                    </div>

                    <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        to={`/service/${svc.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#12582e] hover:text-[#0d4222] transition-colors"
                      >
                        <span>Service Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {onOpenQuoteModal && (
                        <button
                          type="button"
                          onClick={() => onOpenQuoteModal(svc.title)}
                          className="text-xs font-mono font-bold text-[#071536] hover:text-[#12582e] transition-colors cursor-pointer"
                        >
                          Quote →
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
              Need a custom checklist?
            </p>
            <Link
              to="/our-services"
              className="btn btn-outline border-2 border-[#071536] text-[#071536] hover:bg-[#071536] hover:text-white font-bold py-3 px-7 rounded-xl text-sm transition-all duration-150 inline-flex items-center gap-2 whitespace-nowrap"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3B. Scraped Source Promotional Video Showcase & 12% Website Booking Offer */}
      <PromoVideoShowcase onOpenQuoteModal={onOpenQuoteModal} />

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
              <span>Quick Answers</span>
            </div>
            <h2 id="home-faq-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-base m-0">
              Details on our 4-Step Rotation System, eco-safe supplies, and guarantee.
            </p>
          </div>
          <FaqAccordion items={FAQS_LIST} showCategoryFilters={true} />
        </div>
      </section>

      {/* 8. Recent Blog Posts & Expert Cleaning Guides */}
      <RecentBlogPosts />
    </>
  );
};
