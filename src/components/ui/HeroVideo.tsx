import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, ShieldCheck, Phone, CheckCircle2, ArrowRight, Building2, Stethoscope, Utensils, Home } from 'lucide-react';
import { BUSINESS_NAP } from '../../data/siteData';

interface HeroVideoProps {
  onOpenQuoteModal?: (serviceTitle?: string) => void;
}

const DIVISION_PREVIEWS = [
  {
    id: 'commercial',
    label: 'Corporate Offices',
    serviceTitle: 'Office Cleaning Services',
    slug: 'office-cleaning',
    icon: Building2,
    protocol: 'HEPA Particulate Filtration & High-Touch Microfiber Sanitization',
    schedule: 'Nightly / Day Porter / Weekend Schedules',
    metric: '99.97% Allergen & Dust Capture',
    highlights: [
      'Workstation, conference room & executive lobby detailing',
      'Sanitized restrooms with commercial odor neutralization',
      'Dedicated account supervisor & inspection log'
    ]
  },
  {
    id: 'medical',
    label: 'Medical & Dental',
    serviceTitle: 'Specialized Medical Office Cleaning',
    slug: 'medical-office-cleaning',
    icon: Stethoscope,
    protocol: 'OSHA & CDC Terminal Sterilization · EPA List N Disinfectants',
    schedule: 'After-Hours Clinical Terminal Passes',
    metric: '100% DOH & OSHA Compliant',
    highlights: [
      'Exam table, surgical suite & waiting room sterilization',
      'Color-coded microfiber cross-contamination prevention',
      'Electrostatic antimicrobial misting available'
    ]
  },
  {
    id: 'hospitality',
    label: 'Bars & Restaurants',
    serviceTitle: 'Commercial Bar & Restaurant Cleaning',
    slug: 'bars-and-restaurant-cleaning',
    icon: Utensils,
    protocol: 'Bio-Enzyme Quarry Tile Degreasing & Front-of-House Polish',
    schedule: '24/7 Post-Close Nightly Crews',
    metric: '5-Star Health Inspection Readiness',
    highlights: [
      'Commercial cookline, fryer & hood exterior degreasing',
      'Bar well, speed rail, draft tap & drain sanitation',
      'Dining room booth, window & restroom detailing'
    ]
  },
  {
    id: 'residential',
    label: 'Luxury Estates & Rentals',
    serviceTitle: 'Comprehensive Home Maintenance',
    slug: 'home-maintenance',
    icon: Home,
    protocol: 'Exclusive 4-Phase Rotation Cleaning System · Eco-Safe',
    schedule: 'Weekly / Bi-Weekly / Same-Day Turnovers',
    metric: 'Zero Extra Deep-Clean Fees',
    highlights: [
      'Perpetual deep rotation across kitchen, baths & living spaces',
      'Non-toxic child & pet-safe botanical formulas',
      'Airbnb Superhost 10 AM – 4 PM turnover windows'
    ]
  }
];

export const HeroVideo: React.FC<HeroVideoProps> = ({ onOpenQuoteModal }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeDivisionIdx, setActiveDivisionIdx] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const activeDivision = DIVISION_PREVIEWS[activeDivisionIdx];

  return (
    <section
      className="hero-banner relative overflow-hidden bg-[#071536] border-b border-slate-800"
      aria-label="Hero Section"
    >
      {/* Background Media Container */}
      <div className="hero-media-wrapper absolute inset-0 z-0 w-full h-full overflow-hidden">
        {/* Desktop Background Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/videos/bg_video_13.jpeg"
          width="1280"
          height="720"
          className="hidden md:block w-full h-full object-cover"
        >
          <source src="/assets/videos/main-home-video-1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Mobile Poster Fallback */}
        <img
          src="/assets/videos/bg_video_13.jpeg"
          alt="South Florida Cleaning Concepts Professional Crew"
          width="1280"
          height="720"
          className="block md:hidden w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />

        {/* Measured Contrast Scrim */}
        <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-[#071536]/95 via-[#071536]/88 to-[#071536]/75" />
      </div>

      {/* Main Hero 12-Column Split Container */}
      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left 7 Columns: Primary Proposition & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="editorial-kicker-light mb-5">
              <span>South Florida Est. 2004 · Licensed, Insured &amp; Bonded</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.08] tracking-tight mb-6">
              Commercial &amp; Residential Cleaning <span className="text-[#a3e6be]">Pros</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed font-normal mb-8 max-w-2xl">
              From OSHA-compliant medical sterilization and corporate janitorial to coastal estate maintenance, we deliver hospital-grade cleanliness across Palm Beach, Broward &amp; Miami-Dade counties.
            </p>

            {/* 2x2 Architectural Value Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-10 pt-6 border-t border-white/15 text-sm font-medium text-slate-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>4-Phase Rotation System Included</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>Family-Owned &amp; Operated (20+ Years)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>100% Satisfaction or You Don’t Pay</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>Vetted, Background-Checked Crews</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              {onOpenQuoteModal ? (
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal()}
                  className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-4 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-150 text-center cursor-pointer whitespace-nowrap"
                >
                  Request Free Quote
                </button>
              ) : (
                <Link
                  to="/contact-us"
                  className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-4 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-150 text-center whitespace-nowrap"
                >
                  Request Free Quote
                </Link>
              )}

              <a
                href={`tel:${BUSINESS_NAP.phoneRaw}`}
                className="btn btn-phone flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono font-bold text-base transition-colors whitespace-nowrap tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#a3e6be]" />
                <span>Call {BUSINESS_NAP.phone}</span>
              </a>

              {/* Video Play/Pause Control (Desktop) */}
              <button
                type="button"
                onClick={togglePlay}
                className="hidden md:inline-flex items-center justify-center w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer ml-auto"
                aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
                title={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Right 5 Columns: Interactive Division Protocol Inspector Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-[#0c1d47]/90 backdrop-blur-md border border-white/15 rounded-2xl p-6 sm:p-7 flex flex-col justify-between h-full shadow-2xl">
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#a3e6be] font-semibold">
                    Interactive Division Selector
                  </span>
                  <span className="font-mono text-xs text-slate-300 tabular-nums">
                    0{activeDivisionIdx + 1} / 04
                  </span>
                </div>

                {/* Segmented Division Selector Buttons */}
                <div
                  className="grid grid-cols-2 gap-1.5 p-1 bg-[#071536]/80 rounded-xl border border-white/10 mb-6"
                  role="tablist"
                  aria-label="Cleaning Divisions Preview"
                >
                  {DIVISION_PREVIEWS.map((div, idx) => {
                    const Icon = div.icon;
                    const isSelected = idx === activeDivisionIdx;
                    return (
                      <button
                        key={div.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveDivisionIdx(idx)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#12582e] text-white shadow-xs'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{div.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Division Details */}
                <div className="mb-6">
                  <div className="font-mono text-xs text-[#a3e6be] mb-1">
                    {activeDivision.metric} · {activeDivision.schedule}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {activeDivision.serviceTitle}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Standard: {activeDivision.protocol}
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-200 list-none p-0 m-0">
                    {activeDivision.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Link
                  to={`/service/${activeDivision.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#a3e6be] hover:text-white transition-colors py-2"
                >
                  <span>View Full Protocol</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {onOpenQuoteModal ? (
                  <button
                    type="button"
                    onClick={() => onOpenQuoteModal(activeDivision.serviceTitle)}
                    className="px-4 py-2.5 rounded-lg bg-white text-[#071536] hover:bg-[#a3e6be] font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Quote {activeDivision.label} →
                  </button>
                ) : (
                  <Link
                    to="/contact-us"
                    className="px-4 py-2.5 rounded-lg bg-white text-[#071536] hover:bg-[#a3e6be] font-bold text-xs transition-colors text-center whitespace-nowrap"
                  >
                    Quote {activeDivision.label} →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width 4-Column Quantitative Proof Bar Below Hero Split */}
      <div className="relative z-10 bg-[#040d22]/90 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="border-l-2 border-[#a3e6be]/40 pl-4">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                20+ Years
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Family-Owned in South Florida
              </div>
            </div>
            <div className="border-l-2 border-[#a3e6be]/40 pl-4">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                100%
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Satisfaction or You Don’t Pay
              </div>
            </div>
            <div className="border-l-2 border-[#a3e6be]/40 pl-4">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                10 Divisions
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Clinical, Commercial &amp; Estate Care
              </div>
            </div>
            <div className="border-l-2 border-[#a3e6be]/40 pl-4">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                24/7 Dispatch
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Palm Beach, Broward &amp; Miami-Dade
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
