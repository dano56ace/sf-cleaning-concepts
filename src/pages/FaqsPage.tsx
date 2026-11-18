import React from 'react';
import { FaqAccordion } from '../components/ui/FaqAccordion';
import { InteriorHero, INTERIOR_HERO_IMAGES } from '../components/ui/InteriorHero';
import { FAQS_LIST } from '../data/siteData';

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
          <FaqAccordion items={FAQS_LIST} showCategoryFilters={true} headingLevel="h2" />
        </div>
      </section>
    </div>
  );
};
