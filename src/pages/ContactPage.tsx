import React from 'react';
import { QuoteForm } from '../components/ui/QuoteForm';
import { BUSINESS_NAP } from '../data/siteData';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Subpage Hero */}
      <section className="relative bg-[#07111a] text-white py-20 lg:py-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-architectural-grid opacity-15"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="editorial-kicker-light mb-4">
              We’d Love to Hear From You · Fast Local Reply
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 text-white">
              Interested in Cleaning Services?
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Reach out for a fast, honest, no-obligation quote for your home, vacation rental, or workplace. Our friendly local team responds quickly across Palm Beach, Broward, and Miami-Dade counties.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form Column */}
            <div id="quote" className="lg:col-span-7 scroll-mt-24">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-lg">
                <div className="mb-7 pb-5 border-b border-slate-100">
                  <div className="editorial-kicker mb-2">
                    Fast Online Booking &amp; Free Quote
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071536] mb-1.5 tracking-tight">
                    Get Your Free Cleaning Quote
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Fill out the 4 quick fields below and our friendly local team will call or text you right back with an honest price.
                  </p>
                </div>
                <QuoteForm source="Contact Page" />
              </div>
            </div>

            {/* NAP & Service Area Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#07111a] text-white rounded-3xl p-8 shadow-xl border border-white/10">
                <div className="editorial-kicker-light mb-3">
                  Reach Us Anytime
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
                        Fast quotes &amp; same-day scheduling available
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
                        Send us your questions or special cleaning requests
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
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm">
                <div className="editorial-kicker mb-2">
                  Where We Clean
                </div>
                <h3 className="text-lg font-extrabold text-[#0b1926] mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2a8655]" />
                  Based in {BUSINESS_NAP.addressLocality}, {BUSINESS_NAP.addressRegion}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  Our friendly local crews clean homes, rentals, and workplaces throughout {BUSINESS_NAP.areasServed.join(', ')}, and nearby South Florida neighborhoods.
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
