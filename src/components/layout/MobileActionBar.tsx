import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, FileText } from 'lucide-react';
import { BUSINESS_NAP } from '../../data/siteData';

interface MobileActionBarProps {
  onOpenQuoteModal?: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({ onOpenQuoteModal }) => {
  return (
    <nav
      className="mobile-bottom-bar fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(7,21,54,0.08)] md:hidden"
      aria-label="Quick Actions"
    >
      <div className="bottom-bar-grid grid grid-cols-2 gap-3 w-full max-w-md mx-auto">
        {/* Call Now Button */}
        <a
          href={`tel:${BUSINESS_NAP.phoneRaw}`}
          className="bottom-bar-btn bottom-bar-call flex items-center justify-center gap-2 min-h-[48px] py-3 px-4 rounded-xl bg-[#071536] text-white font-bold text-sm shadow-xs hover:bg-[#162a56] transition-colors whitespace-nowrap"
          aria-label="Call South Florida Cleaning Concepts"
        >
          <Phone className="w-4 h-4 text-[#a3e6be] shrink-0" />
          <span>Call Now</span>
        </a>

        {/* Free Quote Button */}
        {onOpenQuoteModal ? (
          <button
            type="button"
            onClick={onOpenQuoteModal}
            className="bottom-bar-btn bottom-bar-quote flex items-center justify-center gap-2 min-h-[48px] py-3 px-4 rounded-xl bg-[#12582e] text-white font-bold text-sm shadow-xs hover:bg-[#0d4222] transition-colors cursor-pointer whitespace-nowrap"
            aria-label="Request a Free Cleaning Quote"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Free Quote</span>
          </button>
        ) : (
          <Link
            to="/contact-us"
            className="bottom-bar-btn bottom-bar-quote flex items-center justify-center gap-2 min-h-[48px] py-3 px-4 rounded-xl bg-[#12582e] text-white font-bold text-sm shadow-xs hover:bg-[#0d4222] transition-colors whitespace-nowrap"
            aria-label="Request a Free Cleaning Quote"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Free Quote</span>
          </Link>
        )}
      </div>
    </nav>
  );
};
