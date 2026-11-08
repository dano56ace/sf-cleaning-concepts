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
    phase: 'Phase 01',
    zone: 'Comprehensive Initial Deep Scrub',
    cadence: 'First Visit Baseline',
    summary: 'Establishes hospital-grade cleanliness from ceiling fans to baseboards across every room prior to entering the recurring rotation cycle.',
    tasks: [
      'Hand-wipe all baseboards, door frames, window sills, and switch plates',
      'Remove scale, soap film, and mineral buildup from all shower glass and tile grout',
      'Degrease kitchen range hood, cabinet exteriors, and appliance surfaces',
      'Multi-stage HEPA vacuuming of all carpets, rugs, edges, and upholstery crevices'
    ]
  },
  {
    phase: 'Phase 02',
    zone: 'Kitchen & Culinary Core Rotation',
    cadence: 'Recurring Deep Focus',
    summary: 'While all rooms receive standard maintenance cleaning, Phase 02 dedicates intensive deep-scrub time to culinary surfaces and food-prep zones.',
    tasks: [
      'Deep interior & exterior detailing of microwave, oven door glass, and refrigerator seals',
      'Backsplash grout scrubbing and under-counter lighting fixture polishing',
      'Pantry shelf organization wipe-down and sink drain enzyme sanitization',
      'Stainless steel grain polishing and high-touch cabinet pull disinfection'
    ]
  },
  {
    phase: 'Phase 03',
    zone: 'Sanitary & Bath Deep Sterilization',
    cadence: 'Recurring Deep Focus',
    summary: 'Eliminates South Florida humidity mildew, bacteria, and hard-water deposits across master baths, guest powder rooms, and commercial restrooms.',
    tasks: [
      'Acid-free tile & grout deep scrubbing across shower walls and bathroom floors',
      'Exhaust fan grille dust extraction for optimal moisture ventilation',
      'Vanity drawer exterior detailing, mirror edge polishing, and chrome descaling',
      'Hospital-grade EPA List N disinfection of all lavatory touchpoints'
    ]
  },
  {
    phase: 'Phase 04',
    zone: 'Living, Executive & Air Quality Focus',
    cadence: 'Recurring Deep Focus',
    summary: 'Targets hidden allergens, coastal dust accumulation, and architectural woodwork across bedrooms, offices, and living areas.',
    tasks: [
      'Vacuuming beneath moveable furniture, sofa cushions, and bed frames',
      'Detailed slat-by-slat blind dusting, shutters, and sliding glass door tracks',
      'HVAC return air vent washing and ceiling fan blade hand-wiping',
      'Crown molding, picture frame, and decorative millwork detailing'
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
            <span>Proprietary Methodology · Zero Extra Fees</span>
          </div>
          <h2 id="rotation-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-4">
            The 4-Phase Rotation Cleaning System
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed m-0">
            Unlike standard cleaners who only wipe visible surfaces, our systematic 4-phase rotation ensures every corner of your property receives a restorative deep scrub on a predictable, perpetual schedule.
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
                      Phase 0{step.step}
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
                    <span>Zero extra fees</span>
                  </span>
                  <span className="font-mono text-[11px] uppercase">
                    {isSelected ? 'Inspecting' : 'Inspect →'}
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
                Included Deep-Rotation Deliverables:
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
