import React, { useEffect, useRef, useState } from 'react';
import {
  computeParallaxOffset,
  getNextSlideIndex,
  getPrevSlideIndex,
} from '../../utils/parallaxMath';

import splashLuxuryHome from '../../assets/images/splash_luxury_home_1794851112668.jpg';
import splashOfficeCleaning from '../../assets/images/splash_office_cleaning_1794851111322.jpg';
import splashMedicalClinic from '../../assets/images/splash_medical_clinic_1794851112974.jpg';
import splashAirbnbTurnover from '../../assets/images/splash_airbnb_turnover_1794851114328.jpg';
import splashRestaurantBar from '../../assets/images/splash_restaurant_bar_1794851116694.jpg';
import splashNewBuild from '../../assets/images/splash_new_build_1794851116058.jpg';

export interface SplashSlide {
  title: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
}

/**
 * Maximum native 16:9 widescreen (1376x768, 300 DPI) generated photography assets
 * showcasing South Florida Cleaning Concepts' 6 flagship residential & commercial services.
 */
export const SPLASH_SLIDES: SplashSlide[] = [
  {
    title: 'Luxury Home & Condo Care',
    slug: 'home-maintenance',
    imageSrc: splashLuxuryHome,
    imageAlt:
      'Spotless South Florida coastal home open-concept living room and gleaming marble kitchen',
  },
  {
    title: 'Executive Office Cleaning',
    slug: 'office-cleaning',
    imageSrc: splashOfficeCleaning,
    imageAlt:
      'Immaculate South Florida executive office and glass-walled boardroom overlooking palms and water',
  },
  {
    title: 'Medical & Dental Clinic Cleaning',
    slug: 'medical-office-cleaning',
    imageSrc: splashMedicalClinic,
    imageAlt:
      'Pristine South Florida medical and dental clinic reception with sanitized white quartz desk',
  },
  {
    title: '5-Star Airbnb & Rental Turnovers',
    slug: 'short-term-rentals',
    imageSrc: splashAirbnbTurnover,
    imageAlt:
      'Five-star South Florida oceanfront vacation rental bedroom with hotel-staged white linens',
  },
  {
    title: 'Restaurant & Bar Cleaning',
    slug: 'bars-and-restaurant-cleaning',
    imageSrc: splashRestaurantBar,
    imageAlt:
      'Upscale South Florida coastal restaurant and polished marble cocktail bar before opening',
  },
  {
    title: 'Post-Construction Cleanup',
    slug: 'post-construction-cleaning',
    imageSrc: splashNewBuild,
    imageAlt:
      'Newly built contemporary South Florida custom home interior after final showroom cleanup',
  },
];

export const SLIDESHOW_AUTO_ROTATE_MS = 5000;

let hasPrewarmedSlides = false;

/**
 * Pre-decodes secondary high-resolution slideshow frames during browser idle time
 * after LCP so every crossfade across Hero, Exit-Intent, and Bottom CTAs is instant and crisp.
 */
export function useWarmupSlideshowImages(): void {
  useEffect(() => {
    if (typeof window === 'undefined' || hasPrewarmedSlides) return;
    hasPrewarmedSlides = true;

    const timer = window.setTimeout(() => {
      SPLASH_SLIDES.slice(1).forEach((slide) => {
        const img = new window.Image();
        img.decoding = 'async';
        img.src = slide.imageSrc;
      });
    }, 800);

    return () => window.clearTimeout(timer);
  }, []);
}

/**
 * Reusable auto-rotation hook shared by Hero, Exit-Intent Banner, and Bottom CTAs.
 */
export function useAutoRotatingSlideshow(initialIndex = 0) {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  useWarmupSlideshowImages();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
      if (reducedMotion?.matches) return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => getNextSlideIndex(prev, SPLASH_SLIDES.length));
    }, SLIDESHOW_AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex]);

  return { activeIndex, setActiveIndex };
}

export type ScrimVariant = 'hero' | 'cta-split' | 'cta-card' | 'exit-banner';

export interface ServiceSlideshowBackdropProps {
  activeIndex: number;
  /** Optional container ref for scroll-driven GPU parallax */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Enable compositor-only scroll parallax (default false for 1:1 native sharpness inside cards/modals) */
  enableParallax?: boolean;
  /** Prioritize LCP fetch on top-of-page hero */
  prioritizeFirstSlide?: boolean;
  /** Contrast scrim profile tailored to foreground layout */
  scrimVariant?: ScrimVariant;
  /** Optional data-testid for the media layer */
  layerTestId?: string;
}

export const ServiceSlideshowBackdrop: React.FC<ServiceSlideshowBackdropProps> = ({
  activeIndex,
  containerRef,
  enableParallax = false,
  prioritizeFirstSlide = false,
  scrimVariant = 'cta-card',
  layerTestId,
}) => {
  const [failedSlides, setFailedSlides] = useState<Record<number, boolean>>({});
  const internalAnchorRef = useRef<HTMLDivElement | null>(null);
  const parallaxLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enableParallax || typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reducedMotion?.matches) return;

    let rafId = 0;

    const updateParallax = () => {
      rafId = 0;
      const hostEl = containerRef?.current ?? internalAnchorRef.current?.parentElement;
      const layerEl = parallaxLayerRef.current;
      if (!hostEl || !layerEl) return;

      const rect = hostEl.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

      const offset = computeParallaxOffset(
        rect.top,
        rect.height,
        window.innerHeight,
        0.22,
        56
      );
      layerEl.style.transform = `translate3d(0, ${offset}px, 0) scale(1.03)`;
    };

    const scheduleUpdate = () => {
      if (rafId === 0) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    updateParallax();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [enableParallax, containerRef]);

  const primaryScrimClass =
    scrimVariant === 'hero'
      ? 'bg-gradient-to-r from-[#071536]/78 via-[#071536]/44 to-[#071536]/14'
      : scrimVariant === 'cta-split'
        ? 'bg-gradient-to-r from-[#071536]/86 via-[#071536]/62 to-[#071536]/34'
        : scrimVariant === 'exit-banner'
          ? 'bg-gradient-to-t from-[#040d22]/92 via-[#071536]/55 to-[#071536]/25'
          : 'bg-gradient-to-r from-[#071536]/88 via-[#071536]/70 to-[#071536]/45';

  const secondaryScrimClass =
    scrimVariant === 'hero'
      ? 'bg-gradient-to-t from-[#040d22]/75 via-transparent to-[#071536]/20'
      : scrimVariant === 'exit-banner'
        ? 'bg-gradient-to-r from-[#040d22]/55 via-transparent to-transparent'
        : 'bg-gradient-to-t from-[#040d22]/78 via-transparent to-[#071536]/25';

  return (
    <div ref={internalAnchorRef} className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <div
        ref={parallaxLayerRef}
        data-testid={layerTestId}
        className={`hero-media-wrapper absolute inset-x-0 z-0 bg-gradient-to-br from-[#071536] via-[#0d2847] to-[#12582e] ${
          enableParallax
            ? '-top-16 -bottom-16 scale-[1.03] will-change-transform'
            : 'inset-y-0'
        }`}
      >
        {SPLASH_SLIDES.map((slide, idx) => {
          const isCurrent = idx === activeIndex;
          const hasError = Boolean(failedSlides[idx]);
          return (
            <div
              key={slide.slug}
              aria-hidden={!isCurrent}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out backface-hidden ${
                isCurrent ? 'opacity-100 z-[2]' : 'opacity-0 z-[1]'
              }`}
            >
              {!hasError ? (
                <img
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedSlides((prev) => ({ ...prev, [idx]: true }))
                  }
                  width="1376"
                  height="768"
                  loading={prioritizeFirstSlide || idx === 0 ? 'eager' : 'lazy'}
                  fetchPriority={prioritizeFirstSlide && idx === 0 ? 'high' : 'auto'}
                  decoding={prioritizeFirstSlide && idx === 0 ? 'sync' : 'async'}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#071536] via-[#0b2a4a] to-[#12582e]" />
              )}
            </div>
          );
        })}
      </div>

      <div className={`hero-overlay absolute inset-0 z-[3] ${primaryScrimClass}`} />
      <div className={`absolute inset-0 z-[4] ${secondaryScrimClass}`} />
    </div>
  );
};

export interface SlideshowIndicatorsProps {
  activeIndex: number;
  onSelectSlide: (index: number) => void;
  ariaLabel?: string;
  align?: 'start' | 'center';
  className?: string;
}

export const SlideshowIndicators: React.FC<SlideshowIndicatorsProps> = ({
  activeIndex,
  onSelectSlide,
  ariaLabel = 'Service photography slides',
  align = 'start',
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onSelectSlide(getNextSlideIndex(activeIndex, SPLASH_SLIDES.length));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onSelectSlide(getPrevSlideIndex(activeIndex, SPLASH_SLIDES.length));
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={`flex items-center gap-2 ${
        align === 'center' ? 'justify-center' : 'justify-start'
      } ${className}`.trim()}
    >
      {SPLASH_SLIDES.map((slide, idx) => {
        const isSelected = idx === activeIndex;
        return (
          <button
            key={slide.slug}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={`Show ${slide.title} photo`}
            onClick={() => onSelectSlide(idx)}
            className="group py-5 px-1 min-h-[44px] flex items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#a3e6be] rounded-xs"
          >
            <span
              className={`block h-1 rounded-xs transition-all duration-300 ${
                isSelected
                  ? 'w-10 bg-[#a3e6be]'
                  : 'w-5 bg-white/35 group-hover:bg-white/70'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
