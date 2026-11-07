import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { BUSINESS_NAP } from '../../data/siteData';

interface HeroVideoProps {
  onOpenQuoteModal?: () => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ onOpenQuoteModal }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

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

  return (
    <section className="hero-banner relative min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#071536]" aria-label="Hero Section">
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
          <source src="/assets/videos/bg_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Mobile Poster Fallback (saves ~12.6 MB data on cellular viewports) */}
        <img
          src="/assets/videos/bg_video_13.jpeg"
          alt="South Florida Cleaning Concepts Professional Crew"
          width="1280"
          height="720"
          className="block md:hidden w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />

        {/* High-Contrast Gradient Dark Overlay */}
        <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-[#071536]/95 via-[#071536]/80 to-[#071536]/60 backdrop-blur-xs" />
      </div>

      {/* Hero Content Container */}
      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-white">
        <div className="max-w-3xl">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12582e]/90 border border-[#61997a]/40 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-100 mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#a3e6be]" />
            <span>South Florida’s Premier Cleaning Team — 100% Guaranteed</span>
          </div>

          {/* Master Landmark Single H1 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight sm:leading-tight mb-6">
            Commercial &amp; Residential Cleaning <span className="text-[#a3e6be]">Pros</span>
          </h1>

          {/* Subtitle / Lead Paragraph */}
          <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-normal mb-8 max-w-2xl">
            From medical sterilization and corporate office janitorial to luxury estate turnovers, we deliver hospital-grade cleanliness across Palm Beach &amp; Broward counties.
          </p>

          {/* Key Value Proposition Checkmarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-sm font-medium text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
              <span>Rotation Cleaning System included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
              <span>Family Owned &amp; Operated (20+ Years)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
              <span>100% Satisfaction or You Don’t Pay</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
              <span>Fully Licensed, Insured &amp; Bonded</span>
            </div>
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {onOpenQuoteModal ? (
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-extrabold py-4 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-200 text-center cursor-pointer"
              >
                Request Free Quote
              </button>
            ) : (
              <Link
                to="/contact-us"
                className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-extrabold py-4 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-200 text-center"
              >
                Request Free Quote
              </Link>
            )}

            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="btn btn-phone flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base transition-colors"
            >
              <Phone className="w-5 h-5 text-[#a3e6be]" />
              <span>Call (561) 704-5303</span>
            </a>

            {/* Video Play/Pause Control (Desktop) */}
            <button
              type="button"
              onClick={togglePlay}
              className="hidden md:inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-white transition-colors cursor-pointer ml-auto"
              aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
              title={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
