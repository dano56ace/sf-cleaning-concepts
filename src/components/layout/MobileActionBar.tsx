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
      className="mobile-bottom-bar fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-around shadow-lg lg:hidden"
      aria-label="Quick Actions"
      style={{ minHeight: '60px' }}
    >
      <div className="bottom-bar-grid grid grid-cols-2 gap-3 w-full max-w-md mx-auto">
        {/* Call Now Button */}
        <a
          href={`tel:${BUSINESS_NAP.phoneRaw}`}
          className="bottom-bar-btn bottom-bar-call flex items-center justify-center gap-2 min-h-[48px] py-3 px-4 rounded-xl bg-[#e8f5ee] text-[#12582e] font-bold text-sm shadow-xs hover:bg-[#12582e] hover:text-white transition-all duration-200"
          aria-label="Call South Florida Cleaning Concepts"
        >
          <Phone className="w-5 h-5 shrink-0" />
          <span>Call Now</span>
        </a>

        {/* Free Quote Button */}
        {onOpenQuoteModal ? (
          <button
            type="button"
            onClick={onOpenQuoteModal}
            className="bottom-bar-btn bottom-bar-quote flex items-center justify-center gap-2 min-h-[48px] py-3 px-4 rounded-xl bg-[#12582e] text-white font-bold text-sm shadow-sm hover:bg-[#0d4222] transition-all duration-200 cursor-pointer"
            aria-label="Request a Free Cleaning Quote"
          >
            <FileText className="w-5 h-5 shrink-0" />
            <span>Free Quote</span>
          </button>
        ) : (
          <Link
            to="/contact-us"
            className="bottom-bar-btn bottom-bar-quote flex items-center justify-center gap-2 min-h-[48px] py-3 px-4 rounded-xl bg-[#12582e] text-white font-bold text-sm shadow-sm hover:bg-[#0d4222] transition-all duration-200"
            aria-label="Request a Free Cleaning Quote"
          >
            <FileText className="w-5 h-5 shrink-0" />
            <span>Free Quote</span>
          </Link>
        )}
      </div>
    </nav>
  );
};
