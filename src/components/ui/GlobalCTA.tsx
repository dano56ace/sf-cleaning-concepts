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
  MapPin,
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
  const cleanPath = pathname.toLowerCase().replace(/\.html$/, '');
  if (cleanPath.startsWith('/about-us')) {
    return {
      kicker: 'Get Your Weekend Back · Family-Owned Since 2004',
      title: 'Ready to Come Home to a Place That Sparkles?',
      subtitle:
        'See why hundreds of South Florida families, vacation rental hosts, and local workplaces welcome our friendly, vetted team back week after week—backed 100% by our Love Your Clean or Don’t Pay Guarantee.',
    };
  }
  if (cleanPath.startsWith('/our-services') || cleanPath.startsWith('/service')) {
    return {
      kicker: '10 Tailored Services · Palm Beach, Broward & Miami-Dade',
      title: 'Let’s Build a Custom Cleaning Plan Around Your Space',
      subtitle:
        'Whether you need recurring home care, a tight Airbnb turnover, or evening office and medical suite sanitizing, we bring all the kid- and pet-safe supplies and guarantee every visit.',
    };
  }
  if (cleanPath.startsWith('/service-area')) {
    return {
      kicker: 'Serving 56 Local Communities · Jupiter to Miami',
      title: 'Ready for a Spotless Space in Your Neighborhood?',
      subtitle:
        'Our local South Florida crews arrive on time with all supplies included, color-coded microfiber detailing, and honest flat-rate pricing—with zero contracts.',
    };
  }
  if (cleanPath.startsWith('/our-publications') || cleanPath.startsWith('/blog')) {
    return {
      kicker: 'Skip the Weekend Scrubbing · We Bring All Supplies',
      title: 'Want Our Friendly Pros to Handle the Cleaning?',
      subtitle:
        'Put our 20+ years of South Florida cleaning experience to work in your home, rental, or office. Request a fast, honest quote in minutes.',
    };
  }
  return {
    kicker: 'Family-Owned Since 2004 · Serving Palm Beach, Broward & Miami-Dade',
    title: 'Ready to Come Home to a Place That Sparkles?',
    subtitle:
      'For over 20 years, South Florida families and local businesses have trusted our friendly, family-owned team to make their spaces shine. We bring all the eco-friendly supplies, show up on time, and back every visit with our Love Your Clean or Don’t Pay Guarantee.',
  };
}

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

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: 'Licensed, Insured & Vetted',
      description:
        'Friendly, background-checked pros you can feel great welcoming into your home',
    },
    {
      icon: Award,
      title: 'Love It or Don’t Pay',
      description:
        'Not 100% thrilled with a spot? We’ll re-clean it free or you don’t pay a dime',
    },
    {
      icon: Clock,
      title: 'Easy, Flexible Scheduling',
      description:
        'Weekly, bi-weekly, one-time deep cleans, or fast same-week availability',
    },
    {
      icon: Leaf,
      title: 'Safe for Kids & Pets',
      description:
        'Fresh, non-toxic, eco-friendly products with zero harsh chemical fumes',
    },
  ];

  return (
    <section
      ref={sectionRef}
      data-testid="global-cta"
      data-active-slide={activeIndex}
      className={`global-cta-section relative overflow-hidden bg-[#071536] text-white border-t border-slate-800/80 py-16 sm:py-20 lg:py-24 ${className}`.trim()}
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
        {/* Clean Unboxed Editorial Regional Metadata Strip (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-5 border-b border-white/15 text-xs font-mono text-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-white">Now Booking Across South Florida</span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span className="text-[#a3e6be]">Palm Beach · Broward · Miami-Dade (Jupiter to Miami)</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-[#a3e6be]" />
            <span>Home Base: {BUSINESS_NAP.addressLocality}, FL</span>
          </div>
        </div>

        {/* Main Value Proposition & Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-12 lg:mb-14">
          {/* Left Column: Heading, Value Proposition & Minimal Slideshow Indicators */}
          <div className="lg:col-span-7 space-y-4">
            <div className="editorial-kicker-light mb-3 drop-shadow-xs">
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
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#071536]/80 border border-white/20 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#a3e6be]">
                  Free, Honest Quotes in Minutes
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
                    className="w-full min-h-[48px] py-4 px-6 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white font-bold text-base shadow-lg shadow-[#12582e]/25 hover:shadow-xl hover:shadow-[#12582e]/35 transition-all duration-150 inline-flex items-center justify-center gap-2.5 cursor-pointer group whitespace-nowrap"
                    aria-label="Request a Free Cleaning Quote"
                  >
                    <FileText className="w-5 h-5 text-[#a3e6be] shrink-0" />
                    <span>Get My Free Quote</span>
                    <ArrowRight className="w-4 h-4 text-[#a3e6be] transition-transform duration-150 group-hover:translate-x-1" />
                  </button>
                ) : (
                  <Link
                    to="/contact-us"
                    className="w-full min-h-[48px] py-4 px-6 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white font-bold text-base shadow-lg shadow-[#12582e]/25 hover:shadow-xl hover:shadow-[#12582e]/35 transition-all duration-150 inline-flex items-center justify-center gap-2.5 group whitespace-nowrap"
                    aria-label="Request a Free Cleaning Quote"
                  >
                    <FileText className="w-5 h-5 text-[#a3e6be] shrink-0" />
                    <span>Get My Free Quote</span>
                    <ArrowRight className="w-4 h-4 text-[#a3e6be] transition-transform duration-150 group-hover:translate-x-1" />
                  </Link>
                )}

                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-mono font-bold text-base transition-colors inline-flex items-center justify-center gap-2.5 whitespace-nowrap tabular-nums"
                  aria-label={`Call South Florida Cleaning Concepts at ${BUSINESS_NAP.phone}`}
                >
                  <Phone className="w-4 h-4 text-[#a3e6be] shrink-0" />
                  <span>Call {BUSINESS_NAP.phone}</span>
                </a>
              </div>

              {/* Tertiary Navigation Strip */}
              <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-200 gap-2">
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
                  <span>See All 56 Local Cities</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Trust & Credibility Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-white/15">
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="p-5 rounded-2xl bg-[#071536]/75 backdrop-blur-xs border border-white/15 hover:border-white/30 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#12582e]/80 border border-[#a3e6be]/30 text-[#a3e6be] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 tracking-tight">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed m-0">
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
