import React, { useEffect } from 'react';
import { X, ShieldCheck, Phone } from 'lucide-react';
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
        className="modal-backdrop fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Body */}
      <div className="modal-dialog relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 max-h-[90vh] flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="modal-header bg-[#071536] text-white p-6 sm:p-8 flex items-start justify-between relative">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12582e] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Guaranteed Estimate</span>
            </div>
            <h2 id="modal-quote-title" className="text-2xl font-bold text-white mb-1">
              Request Your Free Quote
            </h2>
            <p className="text-slate-300 text-sm">
              {serviceTitle ? `Personalized estimate for ${serviceTitle}` : 'Fast, transparent rates for Palm Beach & Broward properties.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 -mr-2 -mt-2"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="modal-body overflow-y-auto p-6 sm:p-8">
          <QuoteForm
            source={serviceTitle || 'Modal'}
            onSuccess={() => {
              // keep modal open so user sees success feedback
            }}
          />
        </div>

        {/* Modal Footer Call Helpline */}
        <div className="modal-footer bg-slate-50 px-6 py-4 border-t border-slate-100 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
          <span>Prefer to speak now?</span>
          <a
            href={`tel:${BUSINESS_NAP.phoneRaw}`}
            className="font-bold text-[#12582e] hover:underline flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{BUSINESS_NAP.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
