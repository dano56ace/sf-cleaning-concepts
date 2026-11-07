import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqItem } from '../../data/siteData';

interface FaqAccordionProps {
  items: FaqItem[];
  showCategoryFilters?: boolean;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items, showCategoryFilters = true }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndices, setOpenIndices] = useState<number[]>([0]); // Open first item by default

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
      {/* Category Tabs */}
      {showCategoryFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All FAQs' },
            { id: 'rotation', label: 'Rotation System' },
            { id: 'commercial', label: 'Commercial' },
            { id: 'residential', label: 'Residential' },
            { id: 'general', label: 'Policies & Staff' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndices([0]);
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#12582e] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Accordion Items List */}
      <div className="space-y-4">
        {filteredItems.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          const headingId = `faq-heading-${idx}`;
          const contentId = `faq-content-${idx}`;

          return (
            <div
              key={idx}
              className={`faq-item rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                isOpen ? 'border-[#12582e]/40 shadow-md ring-1 ring-[#12582e]/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <h3>
                <button
                  type="button"
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-base sm:text-lg hover:text-[#12582e] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#12582e] shrink-0" />
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
                className="px-6 pb-6 pt-2 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/60"
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
