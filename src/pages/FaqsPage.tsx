import React from 'react';
import { Link } from 'react-router-dom';
import { FaqAccordion } from '../components/ui/FaqAccordion';
import { InteriorHero, INTERIOR_HERO_IMAGES } from '../components/ui/InteriorHero';
import {
  ServiceSlideshowBackdrop,
  SlideshowIndicators,
  useAutoRotatingSlideshow,
} from '../components/ui/ServiceSlideshowBackdrop';
import { FAQS_LIST, BUSINESS_NAP } from '../data/siteData';

export const FaqsPage: React.FC = () => {
  const { activeIndex, setActiveIndex } = useAutoRotatingSlideshow(5);
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

      {/* Still Have Questions CTA with Hero Slideshow */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            data-testid="faqs-bottom-cta-slideshow"
            data-active-slide={activeIndex}
            className="relative overflow-hidden bg-[#071536] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl"
          >
            <ServiceSlideshowBackdrop
              activeIndex={activeIndex}
              enableParallax={false}
              scrimVariant="cta-card"
            />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <div className="editorial-kicker-light mb-3 drop-shadow-xs">
                  We’re Here to Help
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
                  Still Have a Question? Just Ask!
                </h2>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-xl m-0 drop-shadow-xs">
                  Give us a quick call or send us a note—our friendly local team is happy to answer any questions and put together a custom quote for your space.
                </p>
                <SlideshowIndicators
                  activeIndex={activeIndex}
                  onSelectSlide={setActiveIndex}
                  ariaLabel="FAQ page CTA slides"
                  className="mt-4"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                <Link
                  to="/contact-us"
                  className="bg-[#12582e] hover:bg-[#0d4222] text-white font-bold px-6 py-4 rounded-xl transition-all shadow-lg text-center whitespace-nowrap"
                >
                  Book My Free Quote
                </Link>
                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="bg-[#071536]/75 hover:bg-[#071536]/95 text-white border border-white/25 font-mono font-bold px-6 py-4 rounded-xl transition-all text-center whitespace-nowrap tabular-nums"
                >
                  {BUSINESS_NAP.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
