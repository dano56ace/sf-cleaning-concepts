import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from 'lucide-react';
import { CLIENT_TESTIMONIALS } from '../../data/siteData';

const COMMERCIAL_PARTNERS = [
  { name: "Chili's Grill & Bar", logo: '/assets/images/clients/chillis.jpg', sector: 'Hospitality & Dining' },
  { name: 'LongHorn Steakhouse', logo: '/assets/images/clients/longhorn.jpg', sector: 'Commercial Kitchens' },
  { name: 'Romano’s Macaroni Grill', logo: '/assets/images/clients/macaroni.jpg', sector: 'Restaurant Group' },
  { name: 'Lime Fresh Mexican Grill', logo: '/assets/images/clients/limegrill.jpg', sector: 'Multi-Unit Dining' },
  { name: 'Journeys Retail Stores', logo: '/assets/images/clients/journeys.jpg', sector: 'Retail & Commercial' }
];

export const TestimonialsSlider: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prev = () => {
    setCurrentIdx((curr) => (curr === 0 ? CLIENT_TESTIMONIALS.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrentIdx((curr) => (curr === CLIENT_TESTIMONIALS.length - 1 ? 0 : curr + 1));
  };

  const t = CLIENT_TESTIMONIALS[currentIdx];

  return (
    <section
      className="testimonials-section py-20 lg:py-24 bg-white border-t border-slate-200/80"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="editorial-kicker mb-3">
              <span>Verified Client Outcomes · 5.0 Average Rating</span>
            </div>
            <h2 id="testimonials-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3">
              Trusted by Commercial Leaders &amp; Estate Managers
            </h2>
            <p className="text-slate-600 text-base sm:text-lg m-0">
              Direct feedback from medical directors, restaurant general managers, and South Florida homeowners relying on our crews.
            </p>
          </div>

          {/* Slider Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={prev}
              className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-slate-50 border border-slate-200 hover:border-[#071536] hover:bg-white flex items-center justify-center text-[#071536] transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs font-bold text-slate-500 px-2 tabular-nums">
              0{currentIdx + 1} / 0{CLIENT_TESTIMONIALS.length}
            </span>
            <button
              type="button"
              onClick={next}
              className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-slate-50 border border-slate-200 hover:border-[#071536] hover:bg-white flex items-center justify-center text-[#071536] transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Architectural Split: Featured Testimonial + Selector List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Quote Card (8 cols) */}
          <div className="lg:col-span-8 bg-[#071536] text-white rounded-2xl p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden shadow-xl">
            <Quote className="w-20 h-20 text-white/5 absolute top-6 right-6 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-1 text-amber-400" aria-label={`${t.rating} out of 5 stars`}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-mono text-xs text-[#a3e6be] uppercase tracking-wider">
                  Verified Account · {t.location}
                </span>
              </div>

              <blockquote className="text-xl sm:text-2xl lg:text-[1.65rem] font-semibold text-white leading-relaxed mb-8">
                “{t.quote}”
              </blockquote>
            </div>

            <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-base font-extrabold text-white">
                  {t.author}
                </div>
                <div className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {t.role} · {t.location}
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#a3e6be]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>100% Satisfaction Verified</span>
              </div>
            </div>
          </div>

          {/* Client Selector Stack (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3">
            {CLIENT_TESTIMONIALS.map((item, idx) => {
              const isSelected = idx === currentIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#e8f5ee]/80 border-[#12582e] text-[#071536] shadow-xs'
                      : 'bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[#071536] truncate">
                      {item.author}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      {item.role} · {item.location}
                    </div>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold shrink-0 tabular-nums ${
                      isSelected ? 'text-[#12582e]' : 'text-slate-400'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Commercial Enterprise Partner Strip */}
        <div className="mt-16 pt-12 border-t border-slate-200/80">
          <div className="text-center mb-8">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-400">
              Trusted by National Hospitality, Medical &amp; Retail Brands Across South Florida
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-center">
            {COMMERCIAL_PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center gap-3.5 hover:bg-white hover:border-slate-300 transition-colors"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  width="48"
                  height="48"
                  className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-200"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-[#071536] truncate">
                    {partner.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {partner.sector}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
