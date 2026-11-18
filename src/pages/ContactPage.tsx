import React from 'react';
import { QuoteForm } from '../components/ui/QuoteForm';
import { InteriorHero, INTERIOR_HERO_IMAGES } from '../components/ui/InteriorHero';
import { BUSINESS_NAP } from '../data/siteData';
import { Phone, Mail, Clock, MapPin, Briefcase, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <InteriorHero
        ariaLabel="Contact Us Header"
        kicker="Fast Local Reply"
        title="Interested in Cleaning Services?"
        description="Request a free, no-obligation quote for your home, rental, or workplace across Palm Beach, Broward, and Miami-Dade counties."
        imageSrc={INTERIOR_HERO_IMAGES.sunlitFoyer}
        imageAlt="Welcoming sunlit South Florida home entryway and lounge interior"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Contact Us' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form Column */}
            <div id="quote" className="lg:col-span-7 scroll-mt-24">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-lg">
                <div className="mb-7 pb-5 border-b border-slate-100">
                  <div className="editorial-kicker mb-2">
                    Fast Online Booking · Save 12%
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071536] mb-1.5 tracking-tight">
                    Get Your Free Cleaning Quote
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Complete the 4 fields below to claim your 12% online booking discount.
                  </p>
                </div>
                <QuoteForm source="Contact Page" />
              </div>
            </div>

            {/* NAP & Service Area Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#07111a] text-white rounded-3xl p-8 shadow-xl border border-white/10">
                <div className="editorial-kicker-light mb-3">
                  Direct Contact
                </div>
                <h2 className="text-2xl font-extrabold mb-6 text-white">
                  Call, Text, or Email Us
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0 text-[#4fd18b]">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-mono text-slate-400 uppercase tracking-[0.14em] font-semibold">
                        Call or Text Us
                      </p>
                      <a
                        href={`tel:${BUSINESS_NAP.phoneRaw}`}
                        className="text-xl font-mono font-bold text-white hover:text-[#4fd18b] transition-colors block mt-1 tabular-nums"
                      >
                        {BUSINESS_NAP.phone}
                      </a>
                      <p className="text-xs text-slate-400 mt-1">
                        Fast quotes &amp; same-day scheduling
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0 text-[#4fd18b]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-mono text-slate-400 uppercase tracking-[0.14em] font-semibold">
                        Email Address
                      </p>
                      <a
                        href={`mailto:${BUSINESS_NAP.email}`}
                        className="text-base font-bold text-white hover:text-[#4fd18b] transition-colors block mt-1 break-all"
                      >
                        {BUSINESS_NAP.email}
                      </a>
                      <p className="text-xs text-slate-400 mt-1">
                        Questions or custom requests
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0 text-[#4fd18b]">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-mono text-slate-400 uppercase tracking-[0.14em] font-semibold">
                        Cleaning Hours
                      </p>
                      <p className="text-sm font-mono font-bold text-white mt-1 tabular-nums leading-snug">
                        {BUSINESS_NAP.hours}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-mono text-slate-400 uppercase tracking-[0.14em] font-semibold">
                        Follow Us on Facebook
                      </p>
                      <a
                        href={BUSINESS_NAP.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-[#a3e6be] hover:text-white transition-colors inline-flex items-center gap-1.5 mt-1"
                      >
                        <span>facebook.com/SFCLEAN</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm">
                <div className="editorial-kicker mb-2">
                  Where We Clean
                </div>
                <h3 className="text-lg font-extrabold text-[#0b1926] mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2a8655]" />
                  Based in {BUSINESS_NAP.addressLocality}, {BUSINESS_NAP.addressRegion} 33435
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  Serving homes, rentals, and workplaces across {BUSINESS_NAP.areasServed.join(', ')}.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
                  <div className="bg-[#f8fafc] rounded-xl p-2.5 border border-slate-200/70">
                    <span className="block text-[11px] font-mono font-bold text-[#2a8655]">PALM BEACH</span>
                    <span className="text-[11px] text-slate-500">Home Base</span>
                  </div>
                  <div className="bg-[#f8fafc] rounded-xl p-2.5 border border-slate-200/70">
                    <span className="block text-[11px] font-mono font-bold text-[#2a8655]">BROWARD</span>
                    <span className="text-[11px] text-slate-500">Full Coverage</span>
                  </div>
                  <div className="bg-[#f8fafc] rounded-xl p-2.5 border border-slate-200/70">
                    <span className="block text-[11px] font-mono font-bold text-[#2a8655]">MIAMI-DADE</span>
                    <span className="text-[11px] text-slate-500">Full Coverage</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#e8f5ee] text-[#2a8655] flex items-center justify-center shrink-0 font-mono font-bold text-sm tabular-nums">
                  100%
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0b1926] mb-1">
                    Love Your Clean or Don’t Pay
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {BUSINESS_NAP.guarantee}
                  </p>
                </div>
              </div>

              <div
                id="careers"
                data-testid="contact-careers-card"
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-start gap-4 scroll-mt-24"
              >
                <div className="w-11 h-11 rounded-xl bg-[#071536] text-[#a3e6be] flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0b1926] mb-1">
                    {BUSINESS_NAP.careersHeadline} Join Our Team
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {BUSINESS_NAP.careersDescription} Apply via email or our quick form.
                  </p>
                  <a
                    href={`mailto:${BUSINESS_NAP.email}?subject=Careers%20Application%20-%20South%20Florida%20Cleaning%20Concepts`}
                    className="text-xs font-mono font-bold text-[#12582e] hover:underline"
                  >
                    Apply via Email →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
