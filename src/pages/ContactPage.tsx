import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { BUSINESS_NAP } from '../data/siteData';
import { QuoteForm } from '../components/ui/QuoteForm';

export const ContactPage: React.FC = () => {
  return (
    <article className="contact-page">
      {/* Subpage Hero Header */}
      <section className="page-hero relative bg-[#071536] text-white py-20 overflow-hidden" aria-label="Contact Header">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="/assets/images/about/about-us-img-4.jpg"
            alt="Contact South Florida Cleaning Concepts"
            width="1920"
            height="600"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Interested in Cleaning Services?
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Fill out our dedicated contact form below and take the first step towards a cleaner home or workplace today!
          </p>
          <nav className="breadcrumbs flex items-center justify-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span aria-current="page" className="text-[#a3e6be]">Contact Us</span>
          </nav>
        </div>
      </section>

      {/* 2-Column Contact & Lead Form Section */}
      <section className="section py-20 bg-white" aria-labelledby="contact-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Column 1: 4-Field Lead Quote Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="quote-card-container bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
                <div className="quote-card-header mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#12582e] text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Free Estimate</span>
                  </div>
                  <h2 id="contact-heading" className="text-2xl sm:text-3xl font-extrabold text-[#071536] mb-2">
                    Contact Us Today
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base">
                    We will give you a call to finish up your personalized estimate.
                  </p>
                </div>

                <QuoteForm source="ContactPage" />
              </div>
            </div>

            {/* Column 2: Direct Contact NAP & Trust Guarantees (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Direct NAP Info Card */}
              <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-8 shadow-xs">
                <h3 className="text-xl font-bold text-[#071536] mb-6">
                  Direct Contact Information
                </h3>
                <ul className="space-y-5 text-sm text-slate-700 p-0 m-0 list-none">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] text-[#12582e] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">Telephone</div>
                      <a href={`tel:${BUSINESS_NAP.phoneRaw}`} className="text-[#12582e] hover:underline font-semibold">
                        {BUSINESS_NAP.phone}
                      </a>
                      <div className="text-xs text-slate-500 mt-0.5">Direct Dispatch &amp; Client Inquiries</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] text-[#12582e] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">Email</div>
                      <a href={`mailto:${BUSINESS_NAP.email}`} className="text-[#12582e] hover:underline font-semibold">
                        {BUSINESS_NAP.email}
                      </a>
                      <div className="text-xs text-slate-500 mt-0.5">Estimates &amp; Invoicing Support</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] text-[#12582e] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">Regional Headquarters</div>
                      <div>Boynton Beach, FL 33435</div>
                      <div className="text-xs text-slate-500 mt-0.5">Serving Palm Beach &amp; Broward Counties</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] text-[#12582e] flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">Operating Hours</div>
                      <div>{BUSINESS_NAP.hours}</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 100% Satisfaction Guarantee Card */}
              <div className="bg-[#071536] text-white rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-8 h-8 text-[#a3e6be]" />
                  <h3 className="text-xl font-bold text-white m-0">
                    100% Satisfaction Guarantee
                  </h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {BUSINESS_NAP.guarantee}
                </p>
                <div className="space-y-2 text-xs text-[#a3e6be]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Background-checked &amp; bonded professionals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Commercial general liability insured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Over 20 years serving South Florida</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};
