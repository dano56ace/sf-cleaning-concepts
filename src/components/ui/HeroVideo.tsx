import React from 'react';
import { Phone, CheckCircle2, Star } from 'lucide-react';
import { BUSINESS_NAP } from '../../data/siteData';
import { QuoteForm } from './QuoteForm';

interface HeroVideoProps {
  onOpenQuoteModal?: (serviceTitle?: string) => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ onOpenQuoteModal }) => {
  const focusBookingForm = () => {
    const nameInput = document.getElementById('quote-name');
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => nameInput.focus(), 300);
    } else if (onOpenQuoteModal) {
      onOpenQuoteModal();
    }
  };

  return (
    <section
      className="hero-banner relative overflow-hidden bg-[#071536] border-b border-slate-800"
      aria-label="Hero Section"
    >
      {/* Background Media Container */}
      <div className="hero-media-wrapper absolute inset-0 z-0 w-full h-full overflow-hidden">
        {/* Desktop Background Video */}
        <video
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

        {/* High-Transparency Contrast Scrim so the background video shines through */}
        <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-[#071536]/65 via-[#071536]/48 to-[#071536]/35" />
      </div>

      {/* Main Hero 12-Column Split Container */}
      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left 7 Columns: Relatable Consumer Value Proposition & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="editorial-kicker-light mb-5 drop-shadow-xs">
              <span>Family-Owned Since 2004 · Loved by South Florida Homeowners</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.08] tracking-tight mb-6 drop-shadow-md">
              Commercial &amp; Residential Cleaning <span className="text-[#a3e6be]">Pros</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-white/95 leading-relaxed font-medium mb-8 max-w-2xl drop-shadow-sm">
              Take back your weekends and come home to a house that truly sparkles. Whether it’s your family home, vacation rental, or local workplace, our friendly, background-checked team delivers a spotless clean across Palm Beach, Broward &amp; Miami-Dade—or you don’t pay a dime.
            </p>

            {/* 2x2 Consumer Benefit Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-10 pt-6 border-t border-white/25 text-sm font-semibold text-white drop-shadow-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>Love Your Clean or You Don’t Pay</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>We Bring All Supplies (Kid &amp; Pet Safe)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>No Surprise Deep-Clean Fees</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e6be] shrink-0" />
                <span>Friendly, Background-Checked Pros</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={focusBookingForm}
                className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-4 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-150 text-center cursor-pointer whitespace-nowrap"
              >
                Book My Free Quote
              </button>

              <a
                href={`tel:${BUSINESS_NAP.phoneRaw}`}
                className="btn btn-phone flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-[#071536]/60 hover:bg-[#071536]/80 backdrop-blur-xs border border-white/30 text-white font-mono font-bold text-base transition-colors whitespace-nowrap tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#a3e6be]" />
                <span>Call {BUSINESS_NAP.phone}</span>
              </a>
            </div>
          </div>

          {/* Right 5 Columns: Main Contact Booking Form Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white text-[#071536] rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200/90">
              <div className="pb-4 mb-4 border-b border-slate-200/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#12582e]">
                    Fast Online Booking &amp; Free Quote
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-mono text-[#071536] tabular-nums">5.0</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#071536] leading-tight">
                  Get Your Free Cleaning Quote
                </h2>
                <p className="text-xs text-slate-600 mt-1 m-0">
                  Fill out the quick form below and we’ll text or call you right back with an honest, no-obligation price.
                </p>
              </div>

              <QuoteForm source="Hero Main Booking Form" />
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width 4-Column Consumer Proof Bar Below Hero Split */}
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
                Love Your Clean or Don’t Pay
              </div>
            </div>
            <div className="border-l-2 border-[#a3e6be]/40 pl-4">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                10 Services
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                For Homes, Rentals &amp; Workplaces
              </div>
            </div>
            <div className="border-l-2 border-[#a3e6be]/40 pl-4">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                Same-Day
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Quotes Across Tri-County FL
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
