import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { FaqAccordion } from '../components/ui/FaqAccordion';
import { FAQS_LIST, BUSINESS_NAP } from '../data/siteData';

export const FaqsPage: React.FC = () => {
  return (
    <article className="faqs-page">
      {/* Subpage Hero Header */}
      <section className="page-hero relative bg-[#071536] text-white py-20 overflow-hidden" aria-label="FAQs Header">
        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Have Questions?
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Get answers to common cleaning questions in South Florida. Learn about our rotation cleaning system, green products, and bonding.
          </p>
          <nav className="breadcrumbs flex items-center justify-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span aria-current="page" className="text-[#a3e6be]">FAQs</span>
          </nav>
        </div>
      </section>

      {/* Main FAQs Accordion Section */}
      <section className="section py-20 bg-white" aria-labelledby="faqs-list-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#12582e] text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Everything You Need to Know</span>
            </div>
            <h2 id="faqs-list-heading" className="text-2xl sm:text-3xl font-extrabold text-[#071536]">
              Frequently Asked Questions &amp; Answers
            </h2>
          </div>

          <FaqAccordion items={FAQS_LIST} showCategoryFilters={true} />

          {/* Have More Questions Callout */}
          <div className="mt-16 bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center max-w-2xl mx-auto">
            <ShieldCheck className="w-10 h-10 text-[#12582e] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#071536] mb-2">
              Have a Question Not Listed Here?
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Our customer care team is available 7 days a week to discuss your property specifications, special requests, or customized janitorial schedules.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${BUSINESS_NAP.phoneRaw}`}
                className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call (561) 704-5303</span>
              </a>
              <Link
                to="/contact-us"
                className="btn btn-outline border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold py-3 px-6 rounded-xl text-sm transition-colors"
              >
                Send Online Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};
