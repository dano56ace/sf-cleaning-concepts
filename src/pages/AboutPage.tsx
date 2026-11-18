import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, CheckCircle2 } from 'lucide-react';
import { BUSINESS_NAP } from '../data/siteData';
import { PromoVideoShowcase } from '../components/ui/PromoVideoShowcase';
import { InteriorHero, INTERIOR_HERO_IMAGES } from '../components/ui/InteriorHero';

export interface AboutPageProps {
  onOpenQuoteModal?: (serviceTitle?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenQuoteModal }) => {
  return (
    <article className="about-page">
      <InteriorHero
        ariaLabel="About Us Header"
        align="center"
        kicker="Family-Owned Since 2004 · South Florida"
        title="About Us"
        description="Family-owned since 2004, helping South Florida homes, rentals, and businesses stay spotless—backed by our Love Your Clean or Don’t Pay Guarantee."
        imageSrc={INTERIOR_HERO_IMAGES.coastalLiving}
        imageAlt="Sunlit spotless South Florida coastal living room interior"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'About Us' }
        ]}
      />

      {/* Main Story & Values Section */}
      <section className="section py-20 lg:py-24 bg-white" aria-labelledby="story-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="editorial-kicker mb-3">
                <span>Our Family Story</span>
              </div>
              <h2 id="story-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-6">
                20+ Years of Trusted South Florida Cleaning
              </h2>
              <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                <p>
                  Founded in Boynton Beach in 2004, South Florida Cleaning Concepts built its reputation on treating every home, rental, and workplace like our own. Our full-time, background-checked, insured team brings eco-safe supplies and never sends random contractors.
                </p>
                <p>
                  Every visit includes our <strong>Love Your Clean or Don’t Pay Guarantee</strong>: let us know within 24 hours if anything falls short and we’ll re-clean it free—or you don’t pay.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200/80">
                <div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#071536] tabular-nums">20+</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Years in Business</div>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#12582e] tabular-nums">100%</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Happy Home Pledge</div>
                </div>
                <div className="col-span-2 sm:col-span-1 sm:border-l sm:border-slate-200 sm:pl-4 pt-2 sm:pt-0">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#071536] tabular-nums">3 Counties</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Local Coverage</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
                <div className="sm:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
                  <img
                    src="/assets/images/about/about-us-img-5.jpg"
                    alt="Uniformed South Florida Cleaning Concepts crew members prepared for service"
                    width="800"
                    height="600"
                    className="w-full h-full min-h-[280px] object-cover"
                  />
                </div>
                <div className="sm:col-span-5 flex flex-col justify-between gap-4">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-48 sm:h-full">
                    <img
                      src="/assets/images/about/about-us-img-7.jpg"
                      alt="Color-coded microfiber cloths and eco-safe sanitization supplies"
                      width="500"
                      height="400"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-[#071536] text-white p-6 rounded-2xl border border-slate-800">
                    <div className="font-mono text-xs text-[#a3e6be] uppercase tracking-widest mb-1.5">
                      50-Point Quality Check
                    </div>
                    <p className="text-sm font-medium text-slate-200 leading-relaxed m-0">
                      Every clean passes our 50-point inspection checklist before we lock up.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scraped Source Promotional Video Showcase */}
      <PromoVideoShowcase onOpenQuoteModal={onOpenQuoteModal} />

      {/* Authentic Source Careers Section: We Are Hiring! */}
      <section
        id="careers"
        data-testid="careers-hiring-section"
        className="section py-16 lg:py-20 bg-white border-t border-slate-200/80 scroll-mt-24"
        aria-labelledby="about-careers-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-50 border border-slate-200/90 p-8 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="editorial-kicker mb-3">
                <span>Careers · Palm Beach, Broward &amp; Miami-Dade</span>
              </div>
              <h2
                id="about-careers-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#071536] mb-3"
              >
                {BUSINESS_NAP.careersHeadline} Join Our Friendly Cleaning Crew
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-6 max-w-2xl">
                {BUSINESS_NAP.careersDescription}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-semibold text-slate-700 p-0 m-0 list-none">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#12582e] shrink-0" />
                  <span>Competitive Pay &amp; Tips</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#12582e] shrink-0" />
                  <span>Flexible Local Routes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#12582e] shrink-0" />
                  <span>Family-Owned Culture</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-stretch gap-3">
              <Link
                to="/contact-us#careers"
                className="btn btn-primary bg-[#071536] hover:bg-[#12582e] text-white font-bold py-3.5 px-6 min-h-[48px] rounded-xl text-sm transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Briefcase className="w-4 h-4 text-[#a3e6be]" />
                <span>Apply for Openings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`mailto:${BUSINESS_NAP.email}?subject=Careers%20Inquiry%20-%20South%20Florida%20Cleaning%20Concepts`}
                className="py-3 px-5 min-h-[44px] rounded-xl border border-slate-200 hover:border-[#071536] text-xs sm:text-sm font-mono font-bold text-[#071536] text-center transition-colors inline-flex items-center justify-center whitespace-nowrap"
              >
                Email: {BUSINESS_NAP.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};
