import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  Leaf,
  FileText,
  MapPin,
  Sparkles
} from 'lucide-react';
import { BUSINESS_NAP } from '../../data/siteData';

export interface GlobalCTAProps {
  /** Optional callback to trigger the application-wide QuoteModal */
  onOpenQuoteModal?: () => void;
  /** Optional custom title override */
  title?: string;
  /** Optional custom subtitle override */
  subtitle?: string;
  /** Optional custom eyebrow kicker override */
  kicker?: string;
  /** Optional custom CSS classes for the outer container */
  className?: string;
}

export const GlobalCTA: React.FC<GlobalCTAProps> = ({
  onOpenQuoteModal,
  title = 'Ready for an Impeccably Clean Property?',
  subtitle = 'Experience 20+ years of family-owned excellence. From clinical disinfection and corporate offices to luxury coastal estates, our bonded specialists deliver transparent rates and our ironclad 100% Satisfaction Guarantee.',
  kicker = 'Commercial & Residential Excellence · Tri-County Dispatch',
  className = ''
}) => {
  const trustBadges = [
    {
      icon: ShieldCheck,
      title: 'Licensed & Insured',
      description: '$2M+ commercial liability & bonding across South Florida'
    },
    {
      icon: Award,
      title: '100% Satisfaction Guarantee',
      description: 'If you are not thrilled, we re-clean free or you do not pay'
    },
    {
      icon: Clock,
      title: 'Same-Day Commercial Dispatch',
      description: 'Rapid mobile crews for commercial facilities & emergencies'
    },
    {
      icon: Leaf,
      title: 'Green Seal Certified Products',
      description: 'Hospital-grade EPA List N bio-safe, eco-friendly chemistry'
    }
  ];

  return (
    <section
      data-testid="global-cta"
      className={`global-cta-section relative overflow-hidden bg-[#071536] text-white border-t border-slate-800/80 py-16 sm:py-20 lg:py-24 ${className}`.trim()}
      aria-labelledby="global-cta-heading"
    >
      {/* ── AMBIENT ARCHITECTURAL LIGHTING & TEXTURE ─────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Subtle architectural dot grid texture */}
        <div className="absolute inset-0 bg-architectural-grid opacity-20" />

        {/* Emerald ambient top glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#2a8655]/20 via-[#4fd18b]/10 to-transparent blur-3xl rounded-full" />

        {/* Soft corner accents */}
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#12582e]/20 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#2680eb]/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── TOP REGIONAL DISPATCH STATUS BEACON ─────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b border-white/10">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4fd18b] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4fd18b]" />
            </span>
            <span className="text-white font-semibold">Active Regional Dispatch:</span>
            <span className="text-[#a3e6be]">Palm Beach · Broward · Miami-Dade (Jupiter to Miami)</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-[#4fd18b]" />
            <span>Central Operations: {BUSINESS_NAP.addressLocality}, FL</span>
          </div>
        </div>

        {/* ── MAIN VALUE PROPOSITION & ACTIONS ROW ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-14 lg:mb-16">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-4">
            <div className="editorial-kicker-light mb-3">
              <span>{kicker}</span>
            </div>

            <h2
              id="global-cta-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]"
            >
              {title}
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl pt-1">
              {subtitle}
            </p>
          </div>

          {/* Right Column: High-Conversion Interactive CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xs shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#a3e6be]">
                  Fast Personalized Estimates
                </span>
                <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#4fd18b]" /> Zero Obligation
                </span>
              </div>

              {/* Primary & Secondary Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                {/* Primary Action Button: Opens Quote Modal (or links to contact-us) */}
                {onOpenQuoteModal ? (
                  <button
                    type="button"
                    onClick={onOpenQuoteModal}
                    className="w-full min-h-[48px] py-4 px-6 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white font-bold text-base shadow-lg shadow-[#12582e]/25 hover:shadow-xl hover:shadow-[#12582e]/35 transition-all duration-150 inline-flex items-center justify-center gap-2.5 cursor-pointer group whitespace-nowrap"
                    aria-label="Request a Free Cleaning Quote"
                  >
                    <FileText className="w-5 h-5 text-[#a3e6be] shrink-0" />
                    <span>Request Free Quote</span>
                    <ArrowRight className="w-4 h-4 text-[#a3e6be] transition-transform duration-150 group-hover:translate-x-1" />
                  </button>
                ) : (
                  <Link
                    to="/contact-us"
                    className="w-full min-h-[48px] py-4 px-6 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white font-bold text-base shadow-lg shadow-[#12582e]/25 hover:shadow-xl hover:shadow-[#12582e]/35 transition-all duration-150 inline-flex items-center justify-center gap-2.5 group whitespace-nowrap"
                    aria-label="Request a Free Cleaning Quote"
                  >
                    <FileText className="w-5 h-5 text-[#a3e6be] shrink-0" />
                    <span>Request Free Quote</span>
                    <ArrowRight className="w-4 h-4 text-[#a3e6be] transition-transform duration-150 group-hover:translate-x-1" />
                  </Link>
                )}

                {/* Secondary Action: Direct Phone Call */}
                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono font-bold text-base transition-colors inline-flex items-center justify-center gap-2.5 whitespace-nowrap tabular-nums"
                  aria-label={`Call South Florida Cleaning Concepts at ${BUSINESS_NAP.phone}`}
                >
                  <Phone className="w-4 h-4 text-[#4fd18b] shrink-0" />
                  <span>Call {BUSINESS_NAP.phone}</span>
                </a>
              </div>

              {/* Tertiary Navigation & Confidence Strip */}
              <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <Link
                  to="/our-services"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-[#a3e6be] font-semibold"
                >
                  <span>Explore 10 Divisions</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  to="/service-areas"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>All 56 Service Areas</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4-COLUMN TRUST & CREDIBILITY GRID ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-white/10">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#12582e]/60 border border-[#4fd18b]/30 text-[#4fd18b] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 tracking-tight">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed m-0">
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

export default GlobalCTA;
