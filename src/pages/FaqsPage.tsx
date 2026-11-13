import React from 'react';
import { Link } from 'react-router-dom';
import { FaqAccordion } from '../components/ui/FaqAccordion';
import { InteriorHero, INTERIOR_HERO_IMAGES } from '../components/ui/InteriorHero';
import { FAQS_LIST, BUSINESS_NAP } from '../data/siteData';

export const FaqsPage: React.FC = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <InteriorHero
        ariaLabel="Frequently Asked Questions Header"
        kicker="Simple, Honest Answers"
        title="Have Questions?"
        description="Here’s everything you need to know about how we clean, our kid- and pet-safe supplies, flexible scheduling, and our famous Love Your Clean or Don’t Pay guarantee."
        imageSrc={INTERIOR_HERO_IMAGES.coastalLiving}
        imageAlt="Spotless airy South Florida coastal living room interior"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'FAQs' }
        ]}
      />

      {/* Accordion Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqAccordion items={FAQS_LIST} showCategoryFilters={true} />
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#07111a] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="editorial-kicker-light mb-3">
                We’re Here to Help
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
                Still Have a Question? Just Ask!
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Give us a quick call or send us a note—our friendly local team is happy to answer any questions and put together a custom quote for your space.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <Link
                to="/contact-us"
                className="bg-[#2a8655] hover:bg-[#1f6840] text-white font-bold px-6 py-4 rounded-xl transition-all shadow-md text-center whitespace-nowrap"
              >
                Book My Free Quote
              </Link>
              <a
                href={`tel:${BUSINESS_NAP.phoneRaw}`}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-mono font-bold px-6 py-4 rounded-xl transition-all text-center whitespace-nowrap tabular-nums"
              >
                {BUSINESS_NAP.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
