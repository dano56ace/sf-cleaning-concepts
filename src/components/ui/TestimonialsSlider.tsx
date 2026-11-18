import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Pause, Play } from 'lucide-react';
import { BUSINESS_NAP, CLIENT_TESTIMONIALS } from '../../data/siteData';
import {
  TESTIMONIAL_AUTOPLAY_MS,
  computeCountdownScale,
  stepTestimonialTimer,
  resolveSwipeDirection,
  resolveSlideNavigation,
  getAuthorInitials,
} from '../../utils/testimonialSliderLogic';

const COMMERCIAL_PARTNERS = [
  { name: "Chili's Grill & Bar", logo: '/assets/images/clients/chillis.jpg' },
  { name: 'LongHorn Steakhouse', logo: '/assets/images/clients/longhorn.jpg' },
  { name: 'Romano’s Macaroni Grill', logo: '/assets/images/clients/macaroni.jpg' },
  { name: 'Lime Fresh Mexican Grill', logo: '/assets/images/clients/limegrill.jpg' },
  { name: 'Journeys Retail Stores', logo: '/assets/images/clients/journeys.jpg' },
];

export const TestimonialsSlider: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    }
    return false;
  });

  const currentIdxRef = useRef(0);
  const remainingMsRef = useRef(TESTIMONIAL_AUTOPLAY_MS);
  const isPausedRef = useRef(isPaused);
  const countdownBarRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    currentIdxRef.current = currentIdx;
  }, [currentIdx]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const applyCountdownBarTransform = useCallback((remainingMs: number) => {
    if (!countdownBarRef.current) return;
    const scale = computeCountdownScale(remainingMs, TESTIMONIAL_AUTOPLAY_MS);
    countdownBarRef.current.style.transform = `scaleX(${scale})`;
  }, []);

  const jumpToSlide = useCallback(
    (action: { type: 'next' } | { type: 'prev' } | { type: 'goto'; index: number }) => {
      const nextIdx = resolveSlideNavigation(
        currentIdxRef.current,
        CLIENT_TESTIMONIALS.length,
        action
      );
      currentIdxRef.current = nextIdx;
      remainingMsRef.current = TESTIMONIAL_AUTOPLAY_MS;
      applyCountdownBarTransform(TESTIMONIAL_AUTOPLAY_MS);
      setCurrentIdx(nextIdx);
    },
    [applyCountdownBarTransform]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId = 0;
    let lastTimestamp: number | null = null;

    applyCountdownBarTransform(remainingMsRef.current);

    const tick = (now: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = now;
      }
      const deltaMs = now - lastTimestamp;
      lastTimestamp = now;

      const step = stepTestimonialTimer({
        currentIndex: currentIdxRef.current,
        totalSlides: CLIENT_TESTIMONIALS.length,
        remainingMs: remainingMsRef.current,
        deltaMs,
        durationMs: TESTIMONIAL_AUTOPLAY_MS,
        isPaused: isPausedRef.current,
      });

      remainingMsRef.current = step.nextRemainingMs;
      applyCountdownBarTransform(step.nextRemainingMs);

      if (step.didAdvance) {
        currentIdxRef.current = step.nextIndex;
        setCurrentIdx(step.nextIndex);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [applyCountdownBarTransform]);

  const handleDotsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      jumpToSlide({ type: 'next' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      jumpToSlide({ type: 'prev' });
    }
  };

  return (
    <section
      data-testid="testimonials-slider-section"
      className="testimonials-section py-20 lg:py-24 bg-white border-t border-slate-200/80"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="editorial-kicker mb-3">
              <span>
                {BUSINESS_NAP.ratingScore} Stars · {BUSINESS_NAP.reviewCountLabel}
              </span>
            </div>
            <h2
              id="testimonials-heading"
              className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3"
            >
              What South Florida Clients Say
            </h2>
            <p className="text-slate-600 text-base sm:text-lg m-0">
              Feedback from local homeowners, Airbnb hosts, and business owners.
            </p>
          </div>

          {/* Slider Navigation & Autoplay Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-pressed={isPaused}
              aria-label={
                isPaused ? 'Resume testimonial autoplay' : 'Pause testimonial autoplay'
              }
              className="h-12 min-h-[48px] px-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#071536] hover:bg-white flex items-center gap-2 text-xs font-bold text-[#071536] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 text-[#12582e] fill-current" />
                  <span>Play</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 text-[#071536]" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => jumpToSlide({ type: 'prev' })}
              className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-slate-50 border border-slate-200 hover:border-[#071536] hover:bg-white flex items-center justify-center text-[#071536] transition-colors cursor-pointer shrink-0"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span
              data-testid="testimonial-slide-counter"
              className="font-mono text-xs font-bold text-slate-500 px-1.5 tabular-nums whitespace-nowrap shrink-0"
            >
              {String(currentIdx + 1).padStart(2, '0')} /{' '}
              {String(CLIENT_TESTIMONIALS.length).padStart(2, '0')}
            </span>

            <button
              type="button"
              onClick={() => jumpToSlide({ type: 'next' })}
              className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-slate-50 border border-slate-200 hover:border-[#071536] hover:bg-white flex items-center justify-center text-[#071536] transition-colors cursor-pointer shrink-0"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auto-Playing Horizontal Testimonial Slider + Countdown Bar + Dots */}
        <div className="bg-[#071536] text-white rounded-2xl shadow-xl overflow-hidden relative">
          {/* Sliding Viewport */}
          <div
            className="overflow-hidden"
            onTouchStart={(e) => {
              touchStartXRef.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              const startX = touchStartXRef.current;
              const endX = e.changedTouches[0]?.clientX ?? null;
              touchStartXRef.current = null;
              if (startX === null || endX === null) return;
              const direction = resolveSwipeDirection(startX, endX);
              if (direction === 'next') jumpToSlide({ type: 'next' });
              if (direction === 'prev') jumpToSlide({ type: 'prev' });
            }}
          >
            <div
              data-testid="testimonial-slider-track"
              className="flex items-stretch transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none will-change-transform"
              style={{ transform: `translate3d(-${currentIdx * 100}%, 0, 0)` }}
            >
              {CLIENT_TESTIMONIALS.map((item, idx) => {
                const isActiveSlide = idx === currentIdx;
                return (
                  <article
                    key={item.author}
                    aria-hidden={!isActiveSlide}
                    className="w-full shrink-0 p-7 sm:p-10 lg:p-12 flex flex-col justify-center relative"
                  >
                    <Quote
                      className="w-20 h-20 text-white/5 absolute top-6 right-6 pointer-events-none"
                      aria-hidden="true"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
                      {/* Left 8 Cols: Rating & Verified Quote */}
                      <div className="lg:col-span-8">
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-1.5 sm:gap-x-3 mb-5">
                          <div
                            className="flex items-center gap-1 text-amber-400"
                            aria-label={`${item.rating} out of 5 stars`}
                          >
                            {[...Array(item.rating)].map((_, starIdx) => (
                              <Star key={starIdx} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <span className="hidden sm:inline text-white/30" aria-hidden="true">
                            ·
                          </span>
                          <span className="font-mono text-xs text-[#a3e6be] tracking-wide">
                            Verified Client Review · {item.location}
                          </span>
                        </div>

                        <blockquote className="text-xl sm:text-2xl lg:text-[1.6rem] font-semibold text-white leading-relaxed m-0">
                          “{item.quote}”
                        </blockquote>
                      </div>

                      {/* Right 4 Cols: Client Attribution */}
                      <div className="lg:col-span-4 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/15 lg:pl-8 flex items-center gap-4">
                        <div
                          className="w-13 h-13 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-extrabold text-base text-[#a3e6be] shrink-0 select-none"
                          aria-hidden="true"
                        >
                          {getAuthorInitials(item.author)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-base sm:text-lg font-extrabold text-white">
                            {item.author}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-300 mt-0.5">
                            {item.role}
                          </div>
                          <div className="text-xs font-mono text-[#a3e6be] mt-1 tabular-nums">
                            Review {String(idx + 1).padStart(2, '0')} of{' '}
                            {String(CLIENT_TESTIMONIALS.length).padStart(2, '0')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Smooth Auto-Play Countdown Bar */}
          <div
            data-testid="testimonial-countdown-track"
            className="h-1.5 w-full bg-white/15 overflow-hidden"
            aria-hidden="true"
          >
            <div
              ref={countdownBarRef}
              data-testid="testimonial-countdown-bar"
              className="h-full w-full bg-gradient-to-r from-[#61997a] to-[#a3e6be] origin-left will-change-transform"
              style={{ transform: 'scaleX(1)' }}
            />
          </div>

          {/* Pagination Dots Bar */}
          <div className="px-3 sm:px-10 lg:px-12 py-3 bg-[#040d22]/45 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div
              role="tablist"
              aria-label="Client testimonial slides"
              data-testid="testimonial-dots"
              onKeyDown={handleDotsKeyDown}
              className="flex items-center justify-center gap-0.5 sm:gap-1.5"
            >
              {CLIENT_TESTIMONIALS.map((item, idx) => {
                const isSelected = idx === currentIdx;
                return (
                  <button
                    key={item.author}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={`Go to review ${idx + 1} by ${item.author}`}
                    onClick={() => jumpToSlide({ type: 'goto', index: idx })}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer group rounded-full focus-visible:outline-2 focus-visible:outline-[#a3e6be]"
                  >
                    <span
                      className={`block rounded-full transition-all duration-200 ${
                        isSelected
                          ? 'w-3 h-3 bg-[#a3e6be] ring-4 ring-[#a3e6be]/25 scale-110'
                          : 'w-2.5 h-2.5 bg-white/35 group-hover:bg-white/75'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 font-mono tabular-nums">
              <span>{CLIENT_TESTIMONIALS[currentIdx].author}</span>
              <span className="text-white/30" aria-hidden="true">
                ·
              </span>
              <span className="text-[#a3e6be]">
                {isPaused ? 'Paused' : 'Auto-playing'}
              </span>
            </div>
          </div>
        </div>

        {/* Commercial Enterprise Partner Strip */}
        <div className="mt-16 pt-12 border-t border-slate-200/80">
          <div className="text-center mb-8">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-400">
              Trusted by South Florida Businesses
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-center">
            {COMMERCIAL_PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center gap-3.5 hover:bg-white hover:border-slate-300 transition-colors"
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  referrerPolicy="no-referrer"
                  width="48"
                  height="48"
                  className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-200"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-[#071536] truncate">
                    {partner.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
