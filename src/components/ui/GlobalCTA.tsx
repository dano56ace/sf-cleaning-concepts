import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  Leaf,
  FileText,
} from 'lucide-react';
import { BUSINESS_NAP } from '../../data/siteData';
import {
  ServiceSlideshowBackdrop,
  SlideshowIndicators,
  useAutoRotatingSlideshow,
} from './ServiceSlideshowBackdrop';

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

function getContextualCopy(pathname: string) {
  const raw = pathname.toLowerCase();
  const trimmed = raw.length > 1 ? raw.replace(/\/+$/, '') : raw;
  const cleanPath = trimmed.replace(/\.html$/, '');
  if (cleanPath.startsWith('/about-us')) {
    return {
      kicker: 'Family-Owned Since 2004',
      title: 'Ready to Come Home to a Spotless Space?',
      subtitle:
        'Discover why hundreds of South Florida families and local workplaces welcome our vetted team back every week—backed 100% by our Love Your Clean or Don’t Pay Guarantee.',
    };
  }
  if (cleanPath === '/service-areas' || cleanPath.startsWith('/service-area/')) {
    return {
      kicker: '56 South Florida Communities',
      title: 'Spotless Local Cleaning in Your Neighborhood',
      subtitle:
        'Our nearby South Florida crews arrive on time from Jupiter to Miami with eco-safe supplies included, color-coded detailing, and transparent pricing with zero contracts.',
    };
  }
  if (cleanPath.startsWith('/our-services') || cleanPath === '/service' || cleanPath.startsWith('/service/')) {
    return {
      kicker: '10 Tailored Cleaning Services',
      title: 'Build a Custom Cleaning Plan Around Your Space',
      subtitle:
        'From recurring home care and same-day Airbnb turnovers to medical suites and overnight office cleaning, we bring all supplies and guarantee every single visit.',
    };
  }
  if (cleanPath.startsWith('/our-publications') || cleanPath.startsWith('/blog')) {
    return {
      kicker: 'Skip Weekend Scrubbing',
      title: 'Let Our Friendly Local Pros Handle the Clean',
      subtitle:
        'Put over 20 years of South Florida residential and commercial cleaning experience to work in your home, rental, or workplace—request a fast quote in minutes.',
    };
  }
  return {
    kicker: 'Family-Owned Since 2004',
    title: 'Ready for a Spotless South Florida Space?',
    subtitle:
      'For over 20 years, South Florida families and businesses have trusted our friendly, vetted crews to show up on time with eco-safe supplies and our Love Your Clean or Don’t Pay Guarantee.',
  };
}

const PROOF_ITEMS = [
  { icon: ShieldCheck, label: 'Licensed & Insured' },
  { icon: Award, label: 'Love Your Clean or Don’t Pay' },
  { icon: Clock, label: 'Flexible Scheduling' },
  { icon: Leaf, label: 'Kid & Pet Safe' },
];

export const GlobalCTA: React.FC<GlobalCTAProps> = ({
  onOpenQuoteModal,
  title,
  subtitle,
  kicker,
  className = '',
}) => {
  const { pathname } = useLocation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { activeIndex, setActiveIndex } = useAutoRotatingSlideshow(1);

  const routeCopy = getContextualCopy(pathname);
  const resolvedTitle = title ?? routeCopy.title;
  const resolvedSubtitle = subtitle ?? routeCopy.subtitle;
  const resolvedKicker = kicker ?? routeCopy.kicker;

  return (
    <section
      ref={sectionRef}
      data-testid="global-cta"
      data-active-slide={activeIndex}
      className={`global-cta-section relative overflow-hidden bg-[#071536] text-white border-t border-slate-800/80 py-14 sm:py-16 lg:py-20 ${className}`.trim()}
      aria-labelledby="global-cta-heading"
    >
      {/* Full-Bleed High-Resolution 6-Slide Hero Slideshow with Parallax */}
      <ServiceSlideshowBackdrop
        activeIndex={activeIndex}
        containerRef={sectionRef}
        enableParallax={true}
        scrimVariant="cta-split"
        layerTestId="global-cta-slideshow-layer"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Regional Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-white/15 text-xs font-mono text-slate-200">
          <span className="font-bold text-white">South Florida Coverage</span>
          <span className="text-[#a3e6be]">Palm Beach, Broward &amp; Miami-Dade</span>
        </div>

        {/* Main Value Proposition & Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
          {/* Left Column: Heading, Value Proposition & Minimal Slideshow Indicators */}
          <div className="lg:col-span-7 min-w-0 space-y-3.5">
            <div className="editorial-kicker-light mb-2 drop-shadow-xs">
              <span>{resolvedKicker}</span>
            </div>

            <h2
              id="global-cta-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-md [text-wrap:balance]"
            >
              {resolvedTitle}
            </h2>

            <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl pt-1 drop-shadow-xs">
              {resolvedSubtitle}
            </p>

            <SlideshowIndicators
              activeIndex={activeIndex}
              onSelectSlide={setActiveIndex}
              ariaLabel="Pre-footer CTA service slides"
              className="pt-2"
            />
          </div>

          {/* Right Column: High-Conversion Interactive CTAs */}
          <div className="lg:col-span-5 min-w-0 flex flex-col justify-center">
            <div className="p-5 sm:p-7 rounded-2xl bg-[#071536]/80 border border-white/20 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/15">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#a3e6be]">
                  Free, Honest Quotes
                </span>
                <span className="font-mono text-xs text-slate-200">
                  No Contracts
                </span>
              </div>

              {/* Primary & Secondary Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                {onOpenQuoteModal ? (
                  <button
                    type="button"
                    onClick={onOpenQuoteModal}
                    className="w-full min-h-[48px] py-3.5 px-4 sm:px-6 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white font-bold text-base shadow-lg shadow-[#12582e]/25 hover:shadow-xl hover:shadow-[#12582e]/35 transition-all duration-150 inline-flex items-center justify-center gap-2 cursor-pointer group"
                    aria-label="Request a Free Cleaning Quote"
                  >
                    <FileText className="w-5 h-5 text-[#a3e6be] shrink-0" />
                    <span>Get My Free Quote</span>
                    <ArrowRight className="w-4 h-4 text-[#a3e6be] transition-transform duration-150 group-hover:translate-x-1 shrink-0" />
                  </button>
                ) : (
                  <Link
                    to="/contact-us"
                    className="w-full min-h-[48px] py-3.5 px-4 sm:px-6 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white font-bold text-base shadow-lg shadow-[#12582e]/25 hover:shadow-xl hover:shadow-[#12582e]/35 transition-all duration-150 inline-flex items-center justify-center gap-2 group"
                    aria-label="Request a Free Cleaning Quote"
                  >
                    <FileText className="w-5 h-5 text-[#a3e6be] shrink-0" />
                    <span>Get My Free Quote</span>
                    <ArrowRight className="w-4 h-4 text-[#a3e6be] transition-transform duration-150 group-hover:translate-x-1 shrink-0" />
                  </Link>
                )}

                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="w-full min-h-[48px] py-3.5 px-4 sm:px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-mono font-bold text-sm sm:text-base transition-colors inline-flex items-center justify-center gap-2 tabular-nums"
                  aria-label={`Call South Florida Cleaning Concepts at ${BUSINESS_NAP.phone}`}
                >
                  <Phone className="w-4 h-4 text-[#a3e6be] shrink-0" />
                  <span>Call {BUSINESS_NAP.phone}</span>
                </a>
              </div>

              {/* Tertiary Navigation Strip */}
              <div className="pt-1 flex flex-wrap items-center justify-between text-xs text-slate-200 gap-2">
                <Link
                  to="/our-services"
                  className="!text-[#a3e6be] hover:!text-white transition-colors inline-flex items-center gap-1 font-semibold"
                >
                  <span>Browse All 10 Services</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  to="/service-areas"
                  className="!text-slate-200 hover:!text-white transition-colors inline-flex items-center gap-1 font-semibold"
                >
                  <span>See All 56 Cities</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Compact 1-Line Proof Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/15">
          {PROOF_ITEMS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white min-w-0"
            >
              <Icon className="w-4 h-4 text-[#a3e6be] shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalCTA;
