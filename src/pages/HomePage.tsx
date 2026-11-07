import React from 'react';
import { Link } from 'react-router-dom';
import { HeroVideo } from '../components/ui/HeroVideo';
import { TrustBadges, RotationSystemSection } from '../components/ui/TrustBadges';
import { TestimonialsSlider } from '../components/ui/TestimonialsSlider';
import { FaqAccordion } from '../components/ui/FaqAccordion';
import { QuoteForm } from '../components/ui/QuoteForm';
import { SERVICES_CATALOG, FAQS_LIST, BUSINESS_NAP } from '../data/siteData';
import { ArrowRight, Sparkles, Phone, CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  onOpenQuoteModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuoteModal }) => {
  return (
    <>
      {/* 1. Hero Banner with Background Video */}
      <HeroVideo onOpenQuoteModal={onOpenQuoteModal} />

      {/* 2. Trust Badges Strip */}
      <TrustBadges />

      {/* 3. Core Services Grid */}
      <section className="section py-20 bg-white" aria-labelledby="services-overview-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#12582e] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Solutions</span>
            </div>
            <h2 id="services-overview-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-4">
              Commercial &amp; Residential Cleaning Services
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Explore our comprehensive catalog of 10 specialized cleaning solutions tailored for South Florida enterprises, clinical facilities, and luxury coastal residences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_CATALOG.map((svc) => (
              <div
                key={svc.slug}
                className="service-card group rounded-2xl overflow-hidden border border-slate-200/80 bg-white hover:shadow-xl hover:border-[#12582e]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={svc.image}
                      alt={`${svc.title} South Florida Cleaning Concepts`}
                      width="600"
                      height="400"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#071536] mb-2.5 group-hover:text-[#12582e] transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {svc.shortDesc}
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-500 mb-6 p-0 m-0 list-none">
                      {svc.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#12582e] shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Link
                    to={`/service/${svc.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#12582e] group-hover:text-[#0d4222] transition-colors"
                  >
                    <span>View Service Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/our-services"
              className="btn btn-outline border-2 border-[#12582e] text-[#12582e] hover:bg-[#12582e] hover:text-white font-bold py-3 px-8 rounded-xl text-sm transition-all duration-200 inline-flex items-center gap-2"
            >
              <span>Explore All 10 Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Exclusive Rotation Cleaning System */}
      <RotationSystemSection />

      {/* 5. Verified Client Testimonials */}
      <TestimonialsSlider />

      {/* 6. FAQ Section */}
      <section className="section py-20 bg-slate-50 border-t border-slate-200/60" aria-labelledby="home-faq-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#12582e] text-xs font-bold uppercase tracking-wider mb-4">
              <span>Have Questions?</span>
            </div>
            <h2 id="home-faq-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-base">
              Answers to the most common questions about our rotation cleaning system, bonding, and green products.
            </p>
          </div>
          <FaqAccordion items={FAQS_LIST} showCategoryFilters={true} />
        </div>
      </section>

      {/* 7. Bottom Lead Capture Section */}
      <section className="section py-20 bg-white" aria-labelledby="cta-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#071536] rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12582e] text-emerald-100 text-xs font-bold uppercase tracking-wider mb-4">
                <span>Free Personalized Estimate</span>
              </div>
              <h2 id="cta-heading" className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Ready for a Spotless Space in South Florida?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Tell us about your property. We will provide a transparent, personalized quote backed by our 100% Satisfaction Guarantee.
              </p>
              <div className="space-y-3 text-sm text-slate-300 mb-8">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#a3e6be]" />
                  <span>Serving Palm Beach &amp; Broward County</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#a3e6be]" />
                  <span>Licensed, Insured &amp; Bonded</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#a3e6be]" />
                  <span>Same-Day Quotes Available</span>
                </div>
              </div>
              <a
                href={`tel:${BUSINESS_NAP.phoneRaw}`}
                className="inline-flex items-center gap-2 text-base font-bold text-emerald-300 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Call Us Directly: {BUSINESS_NAP.phone}</span>
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 text-slate-800 shadow-lg">
              <h3 className="text-xl font-bold text-[#071536] mb-2">
                Get a Fast Quote
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill out the 4 quick fields below and our team will get in touch.
              </p>
              <QuoteForm source="HomePage-Bottom" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
