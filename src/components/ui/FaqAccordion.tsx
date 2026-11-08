import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '../../data/siteData';

interface FaqAccordionProps {
  items: FaqItem[];
  showCategoryFilters?: boolean;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items, showCategoryFilters = true }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="faq-accordion-container max-w-4xl mx-auto">
      {/* Interactive Segmented Category Filter Controls */}
      {showCategoryFilters && (
        <div
          className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80 mb-10 w-fit mx-auto"
          role="tablist"
          aria-label="Filter FAQs by category"
        >
          {[
            { id: 'all', label: 'All FAQs' },
            { id: 'rotation', label: 'Rotation System' },
            { id: 'commercial', label: 'Commercial' },
            { id: 'residential', label: 'Residential' },
            { id: 'general', label: 'Policies & Staff' }
          ].map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndices([0]);
                }}
                className={`px-4 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#071536] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#071536] hover:bg-white/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Accordion Items List */}
      <div className="space-y-3.5">
        {filteredItems.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          const headingId = `faq-heading-${idx}`;
          const contentId = `faq-content-${idx}`;

          return (
            <div
              key={idx}
              className={`faq-item rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                isOpen
                  ? 'border-[#12582e]/50 shadow-md'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <h3 className="m-0">
                <button
                  type="button"
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-[#071536] text-base sm:text-lg hover:text-[#12582e] transition-colors cursor-pointer"
                >
                  <span className="flex items-start sm:items-center gap-3.5">
                    <span className="font-mono text-xs font-bold text-[#12582e] mt-1 sm:mt-0 shrink-0 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#12582e]' : ''
                    }`}
                  />
                </button>
              </h3>
              <div
                id={contentId}
                role="region"
                aria-labelledby={headingId}
                hidden={!isOpen}
                className="px-6 pb-6 pt-2 pl-6 sm:pl-14 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100"
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
