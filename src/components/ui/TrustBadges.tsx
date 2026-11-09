import React, { useState } from 'react';
import { ShieldCheck, Award, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { TRUST_BADGES, ROTATION_SYSTEM_STEPS } from '../../data/siteData';

const ICONS_MAP: { [key: string]: React.ElementType } = {
  ShieldCheck,
  Award,
  UserCheck,
  Sparkles
};

const ROTATION_ZONE_DETAILS = [
  {
    phase: 'Step 01',
    zone: 'The First-Visit Top-to-Bottom Refresh',
    cadence: 'Your Starting Clean',
    summary: 'On our very first visit, we roll up our sleeves and give your entire place a deep, resetting scrub from ceiling fans down to the baseboards—so every room feels fresh and brand new.',
    tasks: [
      'Hand-wipe all baseboards, door frames, window ledges, and light switches',
      'Scrub away soap scum and hard-water spots on shower glass, tubs, and tile grout',
      'Degrease stove hoods, wipe cabinet fronts, and polish every kitchen appliance',
      'Deep-vacuum all carpets, area rugs, corners, and underneath sofa cushions'
    ]
  },
  {
    phase: 'Step 02',
    zone: 'Kitchen & Heart-of-the-Home Sparkle',
    cadence: 'Rotating Deep Focus',
    summary: 'Every visit includes a full-home clean, plus on Step 02 we spend extra time deep-cleaning the places where your family cooks, eats, and gathers.',
    tasks: [
      'Clean inside and outside of the microwave, oven glass door, and fridge seals',
      'Scrub kitchen backsplash grout and polish under-cabinet lighting',
      'Wipe down pantry shelves, sanitize sink drains, and shine chrome faucets',
      'Polish stainless steel appliances and sanitize all cabinet handles and pulls'
    ]
  },
  {
    phase: 'Step 03',
    zone: 'Spa-Fresh Bathrooms & Tile Care',
    cadence: 'Rotating Deep Focus',
    summary: 'South Florida humidity loves to build up mildew in bathrooms. While cleaning your whole home, Step 03 gives your master bath and powder rooms a true spa-level scrub.',
    tasks: [
      'Deep-scrub shower walls, tile grout, and bathroom floors until they gleam',
      'Dust and clear bathroom exhaust fans so moisture and steam vent properly',
      'Wipe vanity fronts, polish mirrors edge-to-edge, and descale faucets',
      'Sanitize toilets, sinks, counters, and towel bars with fresh, safe cleaners'
    ]
  },
  {
    phase: 'Step 04',
    zone: 'Bedrooms, Living Spaces & Fresh Air',
    cadence: 'Rotating Deep Focus',
    summary: 'In Step 04, we maintain your whole property while targeting hidden dust, pet hair, and allergens in bedrooms, home offices, and living rooms.',
    tasks: [
      'Vacuum underneath beds, couches, cushions, and moveable furniture',
      'Hand-wipe window blinds slat-by-slat and clean sliding glass door tracks',
      'Wash AC return air vents and hand-wipe ceiling fan blades',
      'Dust picture frames, lampshades, crown molding, and bookshelf decor'
    ]
  }
];

export const TrustBadges: React.FC = () => {
  return (
    <section
      className="trust-badges-section py-16 lg:py-20 bg-white border-b border-slate-200/80"
      aria-label="Trust and Reliability Badges"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {TRUST_BADGES.map((badge, idx) => {
            const Icon = ICONS_MAP[badge.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className="trust-card p-6 sm:p-7 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:bg-white hover:shadow-lg hover:border-[#12582e]/30 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#071536] text-[#a3e6be] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 tabular-nums">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#071536] mb-2">
                    {badge.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed m-0">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const RotationSystemSection: React.FC = () => {
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState(0);
  const activeZone = ROTATION_ZONE_DETAILS[selectedPhaseIdx];

  return (
    <section
      className="rotation-system-section py-20 lg:py-24 bg-slate-50 border-t border-slate-200/80"
      aria-labelledby="rotation-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="editorial-kicker mb-3">
            <span>Our Secret to a Forever-Spotless Home · No Extra Fees</span>
          </div>
          <h2 id="rotation-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-4">
            How Our 4-Step Rotation Clean Works
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed m-0">
            Most cleaners just wipe the surfaces you can see and rush out the door. We do things differently. Every time we visit, we clean your entire space while rotating an extra-deep scrub from room to room—so nothing ever gets skipped.
          </p>
        </div>

        {/* 4-Column Step Progression Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {ROTATION_SYSTEM_STEPS.map((step, idx) => {
            const isSelected = idx === selectedPhaseIdx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedPhaseIdx(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedPhaseIdx(idx);
                  }
                }}
                className={`rotation-step-card rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#071536] text-white border-[#071536] shadow-xl'
                    : 'bg-white text-[#071536] border-slate-200/90 hover:border-[#12582e]/40 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`font-mono text-xs font-bold uppercase tracking-widest ${
                        isSelected ? 'text-[#a3e6be]' : 'text-[#12582e]'
                      }`}
                    >
                      Step 0{step.step}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center tabular-nums ${
                        isSelected
                          ? 'bg-[#12582e] text-white'
                          : 'bg-slate-100 text-[#071536]'
                      }`}
                    >
                      0{step.step}
                    </span>
                  </div>
                  <h3
                    className={`text-lg font-extrabold mb-2.5 ${
                      isSelected ? 'text-white' : 'text-[#071536]'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed m-0 ${
                      isSelected ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
                <div
                  className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-bold ${
                    isSelected
                      ? 'border-white/15 text-[#a3e6be]'
                      : 'border-slate-100 text-[#12582e]'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Included free</span>
                  </span>
                  <span className="font-mono text-[11px] uppercase">
                    {isSelected ? 'Viewing' : 'See Checklist →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Zone Specification Readout Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#12582e] mb-2">
                {activeZone.phase} · {activeZone.cadence}
              </div>
              <h3 className="text-2xl font-extrabold text-[#071536] mb-3">
                {activeZone.zone}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed m-0">
                {activeZone.summary}
              </p>
            </div>
            <div className="lg:col-span-7 lg:border-l lg:border-slate-200 lg:pl-8">
              <div className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">
                What We Scrub in This Step:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeZone.tasks.map((task, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#12582e] shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
