import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { computeParallaxOffset, selectHeroIndexBySlug } from '../../utils/parallaxMath';

import coastalLivingHero from '../../assets/images/coastal_living_hero_1794540746443.jpg';
import modernOfficeHero from '../../assets/images/modern_office_hero_1794540748740.jpg';
import waterfrontCondoHero from '../../assets/images/waterfront_condo_hero_1794540748811.jpg';
import sparklingKitchenHero from '../../assets/images/sparkling_kitchen_hero_1794540750521.jpg';
import sunlitFoyerHero from '../../assets/images/sunlit_foyer_hero_1794540750069.jpg';

export const INTERIOR_HERO_IMAGES = {
  coastalLiving: coastalLivingHero,
  modernOffice: modernOfficeHero,
  waterfrontCondo: waterfrontCondoHero,
  sparklingKitchen: sparklingKitchenHero,
  sunlitFoyer: sunlitFoyerHero
} as const;

const INTERIOR_HERO_POOL = [
  waterfrontCondoHero,
  coastalLivingHero,
  sparklingKitchenHero,
  sunlitFoyerHero,
  modernOfficeHero
];

export function getInteriorHeroForSlug(slug: string): string {
  return INTERIOR_HERO_POOL[selectHeroIndexBySlug(slug, INTERIOR_HERO_POOL.length)];
}

export function getServiceInteriorHero(slug?: string): string {
  switch (slug) {
    case 'office-cleaning':
    case 'medical-office-cleaning':
    case 'school-cleaning':
    case 'covid-19-disinfection':
      return modernOfficeHero;
    case 'bars-and-restaurant-cleaning':
    case 'post-construction-cleaning':
    case 'move-in-out-cleaning':
      return sparklingKitchenHero;
    case 'short-term-rentals':
      return waterfrontCondoHero;
    case 'home-watching':
      return sunlitFoyerHero;
    case 'home-maintenance':
    default:
      return coastalLivingHero;
  }
}

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface InteriorHeroProps {
  kicker: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs?: BreadcrumbItem[];
  align?: 'left' | 'center';
  ariaLabel?: string;
  /** Optional interactive content below description (CTAs, search bar, inline metadata) */
  children?: React.ReactNode;
  /** Optional right-column card for 2-column executive layouts */
  aside?: React.ReactNode;
}

export const InteriorHero: React.FC<InteriorHeroProps> = ({
  kicker,
  title,
  description,
  imageSrc,
  imageAlt,
  breadcrumbs,
  align = 'left',
  ariaLabel,
  children,
  aside
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const parallaxLayerRef = useRef<HTMLDivElement | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  // Reset image error state if route changes imageSrc
  useEffect(() => {
    setImgFailed(false);
  }, [imageSrc]);

  // Smooth 60fps compositor-only parallax (transform: translate3d) with reduced-motion respect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reducedMotion?.matches) return;

    let rafId = 0;

    const updateParallax = () => {
      rafId = 0;
      const sectionEl = sectionRef.current;
      const layerEl = parallaxLayerRef.current;
      if (!sectionEl || !layerEl) return;

      const rect = sectionEl.getBoundingClientRect();
      // Skip transform updates if hero is completely far off-screen
      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

      const offset = computeParallaxOffset(rect.top, rect.height, window.innerHeight, 0.28, 96);
      layerEl.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
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
  }, [imageSrc]);

  const isCentered = align === 'center' && !aside;

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      data-testid="interior-parallax-hero"
      className="interior-parallax-hero relative bg-[#071536] text-white py-20 lg:py-28 overflow-hidden border-b border-white/15"
    >
      {/* Oversized Compositor Parallax Interior Image Layer */}
      <div
        ref={parallaxLayerRef}
        data-testid="interior-parallax-bg"
        className="absolute -top-24 -bottom-24 inset-x-0 z-0 scale-[1.08] will-change-transform pointer-events-none select-none bg-gradient-to-br from-[#071536] via-[#0d2847] to-[#12582e]"
      >
        {!imgFailed && (
          <img
            src={imageSrc}
            alt={imageAlt}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            width="1920"
            height="1080"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>

      {/* Rich Brand Color Overlay (Midnight Navy + Deep Eco Forest Green Wash + Contrast Scrim) */}
      <div
        data-testid="interior-hero-color-overlay"
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-br from-[#071536]/76 via-[#0a2547]/64 to-[#12582e]/62"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-[#071536]/82 via-[#071536]/25 to-[#071536]/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] pointer-events-none bg-architectural-grid opacity-15"
      />

      {/* Foreground Content Container */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          isCentered ? 'text-center' : ''
        }`}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className={`flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-slate-200 mb-6 ${
              isCentered ? 'justify-center' : ''
            }`}
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${crumb.label}-${index}`}>
                  {index > 0 && (
                    <span aria-hidden="true" className="text-white/50">
                      /
                    </span>
                  )}
                  {crumb.to && !isLast ? (
                    <Link
                      to={crumb.to}
                      className="!text-slate-200 hover:!text-white underline-offset-4 hover:underline transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={isLast ? 'page' : undefined}
                      className={isLast ? 'text-[#a3e6be] font-semibold' : 'text-slate-200'}
                    >
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        <div className={aside ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-end' : ''}>
          <div className={aside ? 'lg:col-span-8' : isCentered ? 'max-w-3xl mx-auto' : 'max-w-3xl'}>
            <div
              className={`editorial-kicker-light mb-4 ${
                isCentered ? 'justify-center' : ''
              }`}
            >
              <span>{kicker}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-[1.08] [text-wrap:balance] drop-shadow-xs">
              {title}
            </h1>

            {description && (
              <p
                className={`text-base sm:text-lg lg:text-xl text-slate-100 leading-relaxed font-normal m-0 drop-shadow-2xs ${
                  isCentered ? 'max-w-2xl mx-auto' : 'max-w-2xl'
                }`}
              >
                {description}
              </p>
            )}

            {children && <div className="mt-7">{children}</div>}
          </div>

          {aside && <div className="lg:col-span-4 flex lg:justify-end">{aside}</div>}
        </div>
      </div>
    </section>
  );
};
