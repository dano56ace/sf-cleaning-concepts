import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { CLIENT_TESTIMONIALS } from '../../data/siteData';

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
    <section className="testimonials-section py-20 bg-white" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#12582e] text-xs font-bold uppercase tracking-wider mb-4">
            <span>Verified Client Reviews</span>
          </div>
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3">
            Trusted by Commercial Leaders &amp; Homeowners
          </h2>
          <p className="text-slate-600 text-base">
            See what our commercial clients and residential estate managers say about our quality and rotation system.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 relative shadow-xs">
          <Quote className="w-12 h-12 text-[#61997a]/20 absolute top-6 left-6" />

          {/* Stars */}
          <div className="flex items-center gap-1 text-amber-400 mb-6 relative z-10">
            {[...Array(t.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>

          {/* Quote Body */}
          <p className="text-lg sm:text-2xl font-medium text-slate-800 leading-relaxed italic mb-8 relative z-10">
            “{t.quote}”
          </p>

          {/* Author Details & Slider Nav Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-200 relative z-10">
            <div>
              <div className="text-base font-bold text-[#071536]">
                {t.author}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium">
                {t.role} • {t.location}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                className="w-11 h-11 rounded-full bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-semibold text-slate-400 px-2">
                {currentIdx + 1} / {CLIENT_TESTIMONIALS.length}
              </span>
              <button
                type="button"
                onClick={next}
                className="w-11 h-11 rounded-full bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Commercial Client Partner Badges */}
        <div className="mt-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
            Serving Premier Florida Enterprises &amp; Venues
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="font-extrabold text-xl tracking-tight text-slate-700">Chili’s Grill &amp; Bar</span>
            <span className="text-slate-300">•</span>
            <span className="font-extrabold text-xl tracking-tight text-slate-700">LongHorn Steakhouse</span>
            <span className="text-slate-300">•</span>
            <span className="font-extrabold text-xl tracking-tight text-slate-700">Medical Plaza Centers</span>
            <span className="text-slate-300">•</span>
            <span className="font-extrabold text-xl tracking-tight text-slate-700">Premier Palm Beach Condominiums</span>
          </div>
        </div>
      </div>
    </section>
  );
};
