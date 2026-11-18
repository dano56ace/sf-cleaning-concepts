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
    zone: 'Top-to-Bottom Deep Refresh',
    cadence: 'First Visit',
    summary: 'Our initial visit deep-cleans every room from ceiling fans to baseboards so ongoing upkeep stays effortless.',
    tasks: [
      'Hand-wipe baseboards, sills & switches',
      'Scrub shower glass, tubs & tile grout',
      'Degrease stove hoods & cabinet fronts',
      'Deep-vacuum rugs, corners & cushions'
    ]
  },
  {
    phase: 'Step 02',
    zone: 'Kitchen & Dining Sparkle',
    cadence: 'Rotating Focus',
    summary: 'Every visit cleans your full home while Step 02 focuses extra deep-scrubbing on your kitchen and dining areas.',
    tasks: [
      'Clean inside microwave, oven glass & fridge seals',
      'Scrub backsplash grout & under-cabinet trim',
      'Wipe pantry shelves & sanitize sink drains',
      'Polish stainless appliances & cabinet handles'
    ]
  },
  {
    phase: 'Step 03',
    zone: 'Spa-Fresh Bathrooms & Tile',
    cadence: 'Rotating Focus',
    summary: 'We tackle South Florida humidity with extra deep scrubbing across your primary bath and powder rooms.',
    tasks: [
      'Deep-scrub shower tile, grout & bath floors',
      'Dust bathroom exhaust fans for airflow',
      'Polish mirrors & descale chrome faucets',
      'Sanitize toilets, vanities & towel bars'
    ]
  },
  {
    phase: 'Step 04',
    zone: 'Bedrooms & Living Spaces',
    cadence: 'Rotating Focus',
    summary: 'While maintaining every room, Step 04 clears hidden dust, pet hair, and allergens from living areas.',
    tasks: [
      'Vacuum under beds, sofas & cushions',
      'Hand-wipe blinds & sliding glass tracks',
      'Clean AC return vents & ceiling fan blades',
      'Dust frames, crown molding & shelving'
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
                  <div className="mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#071536] text-[#a3e6be] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
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
            <span>Included at No Extra Charge</span>
          </div>
          <h2 id="rotation-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-4">
            How Our 4-Step Rotation Clean Works
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed m-0">
            Every visit cleans your whole home while rotating deep detail work room by room.
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
                  <div className="mb-4">
                    <span
                      className={`font-mono text-xs font-bold uppercase tracking-widest ${
                        isSelected ? 'text-[#a3e6be]' : 'text-[#12582e]'
                      }`}
                    >
                      Step 0{step.step}
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
                    <span>Included</span>
                  </span>
                  <span className="font-mono text-[11px] uppercase">
                    {isSelected ? 'Active' : 'Details →'}
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
                Included in This Step:
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
