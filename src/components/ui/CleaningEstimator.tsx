import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, CheckCircle2, Users, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import {
  calculateCleaningEstimate,
  PropertyCategory,
  CleaningFrequency
} from '../../utils/estimatorLogic';

interface CleaningEstimatorProps {
  onSelectEstimate?: (serviceTitle: string) => void;
}

const PROPERTY_CATEGORIES: { id: PropertyCategory; label: string; sub: string }[] = [
  { id: 'residential', label: 'Home & Condo', sub: 'Houses, Townhomes & Condos' },
  { id: 'rental', label: 'Airbnb & Rental', sub: 'Same-Day Guest Turnovers' },
  { id: 'office', label: 'Local Office', sub: 'Workplaces & Suites' },
  { id: 'medical', label: 'Medical & Dental', sub: 'Clinics & Waiting Rooms' },
  { id: 'restaurant', label: 'Bar & Restaurant', sub: 'Kitchens & Dining Rooms' },
  { id: 'construction', label: 'Post-Renovation', sub: 'Remodel & New-Build Clean' }
];

const FREQUENCIES: { id: CleaningFrequency; label: string; badge: string }[] = [
  { id: 'nightly', label: '5x / Week', badge: 'Save 25%' },
  { id: 'weekly', label: 'Every Week', badge: 'Save 20%' },
  { id: 'biweekly', label: 'Every 2 Weeks', badge: 'Save 12%' },
  { id: 'monthly', label: 'Once a Month', badge: 'Save 5%' },
  { id: 'onetime', label: 'One-Time Clean', badge: 'Standard' }
];

export const CleaningEstimator: React.FC<CleaningEstimatorProps> = ({ onSelectEstimate }) => {
  const [category, setCategory] = useState<PropertyCategory>('residential');
  const [sqft, setSqft] = useState<number>(2500);
  const [restrooms, setRestrooms] = useState<number>(3);
  const [frequency, setFrequency] = useState<CleaningFrequency>('biweekly');

  const estimate = calculateCleaningEstimate({
    category,
    sqft,
    frequency,
    restrooms
  });

  return (
    <section
      id="estimator-section"
      className="section py-20 lg:py-24 bg-[#071536] text-white border-y border-slate-800 bg-architectural-grid"
      aria-labelledby="estimator-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="editorial-kicker-light mb-3">
            <span>Instant Price &amp; Time Calculator</span>
          </div>
          <h2 id="estimator-heading" className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            See What Your Clean Will Cost in Seconds
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Pick your space type, slide to your approximate size, and choose how often you’d like us to visit. You’ll see your estimated price range and crew size right away—no guesswork, no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left 7 Cols: Interactive Controls */}
          <div className="lg:col-span-7 bg-[#0c1d47]/90 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-8">
              {/* Step 1: Property Type */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-[#a3e6be] mb-3">
                  01 · What Are We Cleaning?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {PROPERTY_CATEGORIES.map((item) => {
                    const active = category === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(item.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-[#12582e] border-[#a3e6be]/50 text-white shadow-sm'
                            : 'bg-[#071536]/60 border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <div className="text-sm font-bold">{item.label}</div>
                        <div className={`text-xs mt-0.5 ${active ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {item.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Square Footage & Restrooms Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="estimator-sqft" className="font-mono text-xs uppercase tracking-widest text-[#a3e6be]">
                      02 · Approx. Size
                    </label>
                    <span className="font-mono text-lg font-extrabold text-white tabular-nums">
                      {sqft.toLocaleString()} sq ft
                    </span>
                  </div>
                  <input
                    id="estimator-sqft"
                    type="range"
                    min={500}
                    max={25000}
                    step={500}
                    value={sqft}
                    onChange={(e) => setSqft(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#a3e6be]"
                  />
                  <div className="flex justify-between font-mono text-[11px] text-slate-400 mt-1.5 tabular-nums">
                    <span>500 sq ft</span>
                    <span>12,500 sq ft</span>
                    <span>25,000 sq ft</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <label htmlFor="estimator-restrooms" className="font-mono text-xs uppercase tracking-widest text-[#a3e6be] whitespace-nowrap">
                      03 · Bathrooms
                    </label>
                    <span className="font-mono text-lg font-extrabold text-white tabular-nums whitespace-nowrap">
                      {restrooms} {restrooms === 1 ? 'Bath' : 'Baths'}
                    </span>
                  </div>
                  <input
                    id="estimator-restrooms"
                    type="range"
                    min={1}
                    max={15}
                    step={1}
                    value={restrooms}
                    onChange={(e) => setRestrooms(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#a3e6be]"
                  />
                  <div className="flex justify-between font-mono text-[11px] text-slate-400 mt-1.5 tabular-nums">
                    <span>1 Bath</span>
                    <span>8 Baths</span>
                    <span>15+ Baths</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Cleaning Schedule Frequency */}
              <div className="pt-6 border-t border-white/10">
                <label className="block font-mono text-xs uppercase tracking-widest text-[#a3e6be] mb-3">
                  04 · How Often Should We Visit? (Save More on Regular Visits)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {FREQUENCIES.map((freq) => {
                    const active = frequency === freq.id;
                    return (
                      <button
                        key={freq.id}
                        type="button"
                        onClick={() => setFrequency(freq.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-[#12582e] border-[#a3e6be]/50 text-white'
                            : 'bg-[#071536]/60 border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold leading-snug">{freq.label}</div>
                        <div className={`font-mono text-[11px] mt-1 tabular-nums ${active ? 'text-[#a3e6be]' : 'text-slate-400'}`}>
                          {freq.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>We bring all supplies, vacuums &amp; kid/pet-safe products</span>
              <span className="font-mono text-[#a3e6be] whitespace-nowrap">100% Insured &amp; Bonded</span>
            </div>
          </div>

          {/* Right 5 Cols: Live Architectural Estimate Output */}
          <div className="lg:col-span-5 bg-white text-[#071536] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#12582e]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#12582e]">
                    Your Custom Plan
                  </span>
                </div>
                {estimate.frequencyDiscountPercent > 0 && (
                  <span className="font-mono text-xs font-bold text-[#12582e] tabular-nums whitespace-nowrap">
                    You Save {estimate.frequencyDiscountPercent}%
                  </span>
                )}
              </div>

              <div className="mb-6">
                <div className="text-xs font-medium text-slate-500 mb-1">
                  Recommended Service
                </div>
                <h3 className="text-2xl font-extrabold text-[#071536] mb-1">
                  {estimate.recommendedServiceTitle}
                </h3>
                <div className="text-xs font-medium text-[#12582e]">
                  {estimate.sanitizationTier}
                </div>
              </div>

              {/* 3-Metric Tabular Readout */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6">
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-mono uppercase text-slate-500 whitespace-nowrap">Est. Per Visit</div>
                  <div className="font-mono text-base sm:text-lg xl:text-xl font-extrabold text-[#071536] tabular-nums mt-0.5 whitespace-nowrap">
                    ${estimate.estimatedVisitRangeMin}–${estimate.estimatedVisitRangeMax}
                  </div>
                </div>
                <div className="border-l border-slate-200 pl-2.5 sm:pl-3 min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-mono uppercase text-slate-500 whitespace-nowrap">Team Size</div>
                  <div className="font-mono text-base sm:text-lg xl:text-xl font-extrabold text-[#071536] tabular-nums mt-0.5 flex items-center gap-1 whitespace-nowrap">
                    <Users className="w-3.5 h-3.5 text-[#12582e] shrink-0" />
                    <span>{estimate.estimatedCrewSize} Pros</span>
                  </div>
                </div>
                <div className="border-l border-slate-200 pl-2.5 sm:pl-3 min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-mono uppercase text-slate-500 whitespace-nowrap">Clean Time</div>
                  <div className="font-mono text-base sm:text-lg xl:text-xl font-extrabold text-[#071536] tabular-nums mt-0.5 flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 text-[#12582e] shrink-0" />
                    <span>{estimate.estimatedHoursMin}–{estimate.estimatedHoursMax}h</span>
                  </div>
                </div>
              </div>

              {/* Included Protocol Highlights */}
              <div className="mb-6">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  What’s Included Every Visit:
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-none p-0 m-0">
                  {estimate.includedHighlights.map((hl, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#12582e] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-200 space-y-3">
              {onSelectEstimate ? (
                <button
                  type="button"
                  onClick={() => onSelectEstimate(`${estimate.recommendedServiceTitle} (${sqft.toLocaleString()} sq ft)`)}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Lock In My Free Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to="/contact-us"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Lock In My Free Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#12582e]" />
                  <span>100% Love-It Guarantee</span>
                </span>
                <Link
                  to={`/service/${estimate.recommendedServiceSlug}`}
                  className="font-bold text-[#12582e] hover:underline"
                >
                  See Full Checklist →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
