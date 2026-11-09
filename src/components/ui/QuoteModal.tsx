import React, { useEffect } from 'react';
import { X, Phone } from 'lucide-react';
import { QuoteForm } from './QuoteForm';
import { BUSINESS_NAP } from '../../data/siteData';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, serviceTitle }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="quote-modal-portal fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-quote-title"
    >
      {/* Backdrop */}
      <div
        className="modal-backdrop fixed inset-0 bg-[#071536]/75 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Body */}
      <div className="modal-dialog relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="modal-header bg-[#071536] text-white p-6 sm:p-8 flex items-start justify-between relative border-b border-white/10">
          <div>
            <div className="editorial-kicker-light mb-2">
              <span>Love Your Clean or Don’t Pay</span>
            </div>
            <h2 id="modal-quote-title" className="text-2xl font-extrabold text-white mb-1">
              Get Your Free Cleaning Quote
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm m-0">
              {serviceTitle
                ? `Quick, honest pricing for ${serviceTitle}—no obligation.`
                : 'Fast, honest pricing for homes, rentals, and workplaces across South Florida.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 -mr-1 -mt-1"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="modal-body overflow-y-auto p-6 sm:p-8">
          <QuoteForm
            idPrefix="modal-"
            source={serviceTitle || 'Modal'}
            onSuccess={() => {
              // Keep modal open so user sees confirmation banner
            }}
          />
        </div>

        {/* Modal Footer Call Helpline */}
        <div className="modal-footer bg-slate-50 px-6 py-4 border-t border-slate-200/80 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
          <span>Want to chat with our friendly local team right now?</span>
          <a
            href={`tel:${BUSINESS_NAP.phoneRaw}`}
            className="font-mono font-bold text-[#12582e] hover:underline inline-flex items-center gap-1 tabular-nums"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{BUSINESS_NAP.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
