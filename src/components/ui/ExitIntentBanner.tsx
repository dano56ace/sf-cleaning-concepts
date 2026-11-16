import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Phone, CheckCircle2 } from 'lucide-react';
import { BUSINESS_NAP } from '../../data/siteData';
import {
  EXIT_INTENT_QUOTE_SUBMITTED_KEY,
  EXIT_INTENT_SESSION_KEY,
  isPreviewExitIntentRequested,
  shouldTriggerDesktopExitIntent,
  shouldTriggerMobileScrollExitIntent,
} from '../../utils/exitIntentLogic';
import { QuoteForm } from './QuoteForm';
import {
  ServiceSlideshowBackdrop,
  SlideshowIndicators,
  useAutoRotatingSlideshow,
} from './ServiceSlideshowBackdrop';

export interface ExitIntentBannerProps {
  /** Suppresses exit-intent banner whenever the main QuoteModal is already open */
  isQuoteModalOpen?: boolean;
}

function readSessionFlag(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeSessionFlag(key: string): void {
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    // Ignore private-mode storage restrictions
  }
}

export const ExitIntentBanner: React.FC<ExitIntentBannerProps> = ({
  isQuoteModalOpen = false,
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { activeIndex, setActiveIndex } = useAutoRotatingSlideshow(0);

  const mountedAtRef = useRef<number>(Date.now());
  const hasInteractedRef = useRef<boolean>(false);
  const maxScrollYRef = useRef<number>(0);
  const lastScrollYRef = useRef<number>(0);

  const triggerBanner = useCallback(() => {
    writeSessionFlag(EXIT_INTENT_SESSION_KEY);
    setIsOpen(true);
  }, []);

  const handleDismiss = useCallback(() => {
    writeSessionFlag(EXIT_INTENT_SESSION_KEY);
    setIsOpen(false);
  }, []);

  // Support deterministic QA preview via ?exit_intent=1
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isPreviewExitIntentRequested(location.search) && !isQuoteModalOpen) {
      triggerBanner();
    }
  }, [location.search, isQuoteModalOpen, triggerBanner]);

  // Real exit-intent listeners: Desktop top-edge mouseout (>=10s dwell + interaction) & Mobile upward scroll (>=15s dwell)
  useEffect(() => {
    if (typeof window === 'undefined' || isOpen) return;

    const markInteraction = () => {
      hasInteractedRef.current = true;
    };

    const handleScroll = () => {
      hasInteractedRef.current = true;
      const currentY = window.scrollY || 0;
      const prevY = lastScrollYRef.current;
      if (currentY > maxScrollYRef.current) {
        maxScrollYRef.current = currentY;
      }

      if (
        shouldTriggerMobileScrollExitIntent({
          alreadyShown: readSessionFlag(EXIT_INTENT_SESSION_KEY),
          alreadyConverted: readSessionFlag(EXIT_INTENT_QUOTE_SUBMITTED_KEY),
          isOtherModalOpen: isQuoteModalOpen,
          pathname: location.pathname,
          elapsedMs: Date.now() - mountedAtRef.current,
          maxScrollY: maxScrollYRef.current,
          previousScrollY: prevY,
          currentScrollY: currentY,
        })
      ) {
        triggerBanner();
      }

      lastScrollYRef.current = currentY;
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (
        shouldTriggerDesktopExitIntent({
          alreadyShown: readSessionFlag(EXIT_INTENT_SESSION_KEY),
          alreadyConverted: readSessionFlag(EXIT_INTENT_QUOTE_SUBMITTED_KEY),
          isOtherModalOpen: isQuoteModalOpen,
          pathname: location.pathname,
          elapsedMs: Date.now() - mountedAtRef.current,
          hasInteracted: hasInteractedRef.current,
          clientY: e.clientY,
          hasRelatedTarget: Boolean(e.relatedTarget),
        })
      ) {
        triggerBanner();
      }
    };

    window.addEventListener('pointerdown', markInteraction, { passive: true });
    window.addEventListener('mousemove', markInteraction, { passive: true, once: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('pointerdown', markInteraction);
      window.removeEventListener('mousemove', markInteraction);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isOpen, isQuoteModalOpen, location.pathname, triggerBanner]);

  // ESC key dismissal & body scroll lock while open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleDismiss]);

  if (!isOpen || isQuoteModalOpen) return null;

  return (
    <div
      data-testid="exit-intent-banner"
      data-active-slide={activeIndex}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-heading"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#040d22]/80 backdrop-blur-xs transition-opacity duration-200"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Widescreen 2-Column Exit-Intent Dialog */}
      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-y-auto lg:overflow-hidden rounded-3xl bg-white shadow-2xl border border-white/15 grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left 6 Columns: Live Hero Slideshow Visual Showcase */}
        <div className="lg:col-span-6 relative min-h-[290px] sm:min-h-[340px] lg:min-h-[560px] bg-[#071536] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden">
          <ServiceSlideshowBackdrop
            activeIndex={activeIndex}
            enableParallax={false}
            scrimVariant="exit-banner"
            layerTestId="exit-intent-slideshow-layer"
          />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="editorial-kicker-light drop-shadow-xs">
              <span>Before You Go · Neighbor Offer</span>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close exit offer"
              className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#071536]/70 hover:bg-[#071536] border border-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative z-10 mt-8 lg:mt-auto space-y-5">
            <h2
              id="exit-intent-heading"
              className="text-2xl sm:text-3xl lg:text-[2.15rem] font-extrabold text-white leading-[1.12] tracking-tight drop-shadow-md [text-wrap:balance]"
            >
              Claim <span className="text-[#a3e6be]">12% Off</span> When You Book Directly From Our Website
            </h2>

            <p className="text-sm sm:text-base text-white/95 leading-relaxed m-0 drop-shadow-xs">
              Leaving so soon? Lock in your 12% online website booking discount—and let our 4.8-star South Florida crew give you your weekends back with zero surprise fees.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm font-semibold text-white p-0 m-0 list-none pt-3 border-t border-white/20">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>100% Love Your Clean or You Don’t Pay</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>Homes, 5-Star Airbnbs, Offices &amp; Medical Suites</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>Fast Same-Day Honest Quotes Across Tri-County FL</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <a
                href={`tel:${BUSINESS_NAP.phoneRaw}`}
                className="inline-flex items-center gap-2 py-2.5 px-4 min-h-[44px] rounded-xl bg-[#071536]/75 hover:bg-[#071536]/95 border border-white/30 text-white font-mono font-bold text-sm transition-colors whitespace-nowrap tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#a3e6be]" />
                <span>Call {BUSINESS_NAP.phone}</span>
              </a>

              <SlideshowIndicators
                activeIndex={activeIndex}
                onSelectSlide={setActiveIndex}
                ariaLabel="Exit banner service photography slides"
              />
            </div>
          </div>
        </div>

        {/* Right 6 Columns: Netlify-Connected Quote Capture */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 lg:p-9 flex flex-col justify-between lg:overflow-y-auto">
          <div>
            <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-slate-200/80">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#12582e] block mb-1">
                  No Contracts · Honest Flat-Rate Pricing
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#071536] leading-tight">
                  Get Your Free Quote &amp; 12% Savings
                </h3>
                <p className="text-xs text-slate-600 mt-1 m-0">
                  Share a few quick details below and our friendly local team will text or call you right back.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Close exit offer dialog"
                className="hidden lg:flex w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#071536] items-center justify-center transition-colors cursor-pointer shrink-0 -mt-1 -mr-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <QuoteForm
              idPrefix="exit-"
              source="Exit Intent Slideshow Banner (12% Website Booking Discount)"
            />
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleDismiss}
              className="text-xs font-medium text-slate-500 hover:text-[#071536] py-2 px-3 min-h-[40px] transition-colors cursor-pointer"
            >
              No thanks, I’m still browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentBanner;
