import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, ArrowRight, Star } from 'lucide-react';
import { BUSINESS_NAP, PROMO_VIDEOS } from '../../data/siteData';

export interface PromoVideoShowcaseProps {
  onOpenQuoteModal?: (serviceTitle?: string) => void;
}

export const PromoVideoShowcase: React.FC<PromoVideoShowcaseProps> = ({
  onOpenQuoteModal,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showNativeControls, setShowNativeControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeVideo = PROMO_VIDEOS[activeIndex] || PROMO_VIDEOS[0];

  // Respect prefers-reduced-motion on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsPlaying(false);
    }
  }, []);

  // Sync video playback whenever active reel or play/mute state updates
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;

    if (isPlaying) {
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          setIsPlaying(false);
        });
      }
    } else {
      el.pause();
    }
  }, [activeVideo.src, isPlaying, isMuted]);

  const handleSelectReel = (index: number) => {
    setActiveIndex(index);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <section
      data-testid="promo-video-showcase"
      data-active-video={activeVideo.id}
      className="section py-20 lg:py-24 bg-[#f8fafc] border-t border-slate-200/80"
      aria-labelledby="promo-video-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="editorial-kicker mb-3">
              <span>See Our Crew in Action · Real South Florida Footage</span>
            </div>
            <h2
              id="promo-video-heading"
              className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3 [text-wrap:balance]"
            >
              Watch Why Homes &amp; Offices Entrust Us With Every Clean
            </h2>
            <p className="text-slate-600 text-base sm:text-lg m-0">
              Step inside our daily cleaning routine across Palm Beach, Broward, and Miami-Dade—from recurring home care and deep sanitization to commercial suites.
            </p>
          </div>

          {/* Unboxed Quantitative Rating Proof */}
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 shrink-0">
            <span className="inline-flex items-center gap-1 font-mono font-bold text-[#071536] tabular-nums">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{BUSINESS_NAP.ratingScore} Stars</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{BUSINESS_NAP.reviewCountLabel}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-semibold text-[#12582e]">12% Online Booking Savings</span>
          </div>
        </div>

        {/* 12-Column Architectural Video + Playlist Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 7 Columns: Featured Video Stage */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl overflow-hidden bg-[#071536] text-white border border-slate-800 shadow-xl">
            <div className="relative aspect-video w-full bg-[#040d22] overflow-hidden shrink-0">
              <video
                ref={videoRef}
                key={activeVideo.src}
                data-testid="promo-video-player"
                src={activeVideo.src}
                poster={activeVideo.poster}
                muted={isMuted}
                loop
                playsInline
                controls={showNativeControls}
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover"
              >
                <source src={activeVideo.src} type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>

              {/* Measured Scrim & Custom Accessible Transport Bar (when native controls hidden) */}
              {!showNativeControls && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-12 pb-4 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      aria-label={isPlaying ? `Pause ${activeVideo.title}` : `Play ${activeVideo.title}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white text-[#071536] hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          <span>Pause Reel</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>Play Reel</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleMute}
                      aria-label={isMuted ? 'Unmute promotional video' : 'Mute promotional video'}
                      className="inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-[#071536]/80 hover:bg-[#071536] border border-white/25 text-white font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="w-4 h-4 text-[#a3e6be]" />
                          <span>Sound Off</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-[#a3e6be]" />
                          <span>Sound On</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNativeControls(true)}
                    className="px-3 py-2 min-h-[40px] text-xs font-mono text-slate-200 hover:text-white underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Timeline Scrubbing
                  </button>
                </div>
              )}
            </div>

            {/* Active Video Editorial Caption */}
            <div className="flex-grow p-6 sm:p-7 flex flex-col justify-center border-t border-white/10">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#a3e6be] mb-2 tabular-nums">
                  <span className="whitespace-nowrap">0{activeIndex + 1} / 0{PROMO_VIDEOS.length}</span>
                  <span aria-hidden="true">·</span>
                  <span className="whitespace-nowrap">{activeVideo.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="whitespace-nowrap">{activeVideo.durationLabel}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                  {activeVideo.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed m-0">
                  {activeVideo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: 4-Video Reel Selector + 12% Website Booking Offer */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Interactive 4-Reel Selector */}
            <div
              role="tablist"
              aria-label="Promotional video reels"
              className="flex flex-col gap-2"
            >
              {PROMO_VIDEOS.map((video, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={video.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectReel(idx)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center gap-3.5 min-h-[66px] ${
                      isSelected
                        ? 'bg-white border-[#12582e] shadow-sm'
                        : 'bg-white/70 border-slate-200/90 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Thumbnail with Fallback */}
                    <div className="relative w-20 h-13 rounded-xl overflow-hidden bg-[#071536] shrink-0 border border-slate-200/60">
                      <img
                        src={video.poster}
                        alt={`${video.title} preview frame`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play
                          className={`w-4 h-4 ${
                            isSelected ? 'text-[#a3e6be] fill-[#a3e6be]' : 'text-white fill-white/80'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 tabular-nums mb-0.5">
                        <span className={isSelected ? 'font-bold text-[#12582e]' : ''}>
                          0{idx + 1}.
                        </span>
                        <span className="truncate">{video.subtitle}</span>
                      </div>
                      <div className="text-sm font-extrabold text-[#071536] truncate">
                        {video.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Authentic Source Website Promo Callout: 12% Discount When Booking From Website */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between gap-3.5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#12582e] mb-1.5">
                  <span>Act Now</span>
                  <span aria-hidden="true">·</span>
                  <span>Online Website Exclusive</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#071536] mb-1.5 [text-wrap:balance]">
                  {BUSINESS_NAP.websiteDiscountHeadline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
                  {BUSINESS_NAP.websiteDiscountDetail} Backed by our 100% Love Your Clean or Don’t Pay Guarantee.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                {onOpenQuoteModal ? (
                  <button
                    type="button"
                    onClick={() => onOpenQuoteModal('12% Website Booking Discount')}
                    className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-3 px-6 min-h-[44px] rounded-xl text-sm transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Claim 12% Online Discount</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to="/contact-us#quote"
                    className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-3 px-6 min-h-[44px] rounded-xl text-sm transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    <span>Claim 12% Online Discount</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="text-xs sm:text-sm font-mono font-bold text-[#071536] hover:text-[#12582e] py-2.5 px-2 min-h-[44px] inline-flex items-center transition-colors whitespace-nowrap shrink-0 tabular-nums"
                >
                  Or Call {BUSINESS_NAP.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoVideoShowcase;
