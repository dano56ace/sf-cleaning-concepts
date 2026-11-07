import React from 'react';
import { ShieldCheck, Award, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { TRUST_BADGES, ROTATION_SYSTEM_STEPS } from '../../data/siteData';

const ICONS_MAP: { [key: string]: React.ElementType } = {
  ShieldCheck,
  Award,
  UserCheck,
  Sparkles
};

export const TrustBadges: React.FC = () => {
  return (
    <section className="trust-badges-section py-16 bg-white border-y border-slate-100" aria-label="Trust and Reliability Badges">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_BADGES.map((badge, idx) => {
            const Icon = ICONS_MAP[badge.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className="trust-card p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md hover:border-[#12582e]/30 transition-all duration-200 flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-[#e8f5ee] text-[#12582e] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {badge.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const RotationSystemSection: React.FC = () => {
  return (
    <section className="rotation-system-section py-20 bg-slate-50" aria-labelledby="rotation-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#12582e] text-xs font-bold uppercase tracking-wider mb-4">
            <span>Exclusive Methodology</span>
          </div>
          <h2 id="rotation-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-4">
            The Rotation Cleaning System
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Unlike standard cleaners who only wipe surfaces, our systematic 4-phase rotation ensures every corner of your property receives a deep scrub on a predictable, perpetual schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ROTATION_SYSTEM_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="rotation-step-card bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#12582e] text-white font-extrabold text-base flex items-center justify-center mb-4 shadow-sm">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-[#071536] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#12582e]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero extra fees</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
