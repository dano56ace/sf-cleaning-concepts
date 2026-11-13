import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SERVICES_CATALOG, BUSINESS_NAP } from '../data/siteData';
import { QuoteForm } from '../components/ui/QuoteForm';
import { InteriorHero, getServiceInteriorHero } from '../components/ui/InteriorHero';
import { Phone, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const EXACT_H1_MAP: Record<string, string> = {
  'office-cleaning': 'Office Cleaning Services',
  'medical-office-cleaning': 'Specialized Medical Office Cleaning',
  'bars-and-restaurant-cleaning': 'Commercial Cleaning for Bars and Restaurants',
  'short-term-rentals': 'Short-Term Rental Cleaning Services',
  'post-construction-cleaning': 'Post-Construction Cleaning',
  'move-in-out-cleaning': 'Move In / Out Cleaning Services',
  'home-maintenance': 'Comprehensive Home Maintenance Services',
  'school-cleaning': 'School Cleaning Services',
  'home-watching': 'Home Watching Service',
  'covid-19-disinfection': 'COVID-19 Disinfection Services',
};

export const ServiceDetailPage: React.FC = () => {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug ? rawSlug.replace(/\.html$/, '') : undefined;
  const service = SERVICES_CATALOG.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to="/404" replace />;
  }

  const exactH1 = (slug && EXACT_H1_MAP[slug]) || service.title;
  const serviceIndex = SERVICES_CATALOG.findIndex((s) => s.slug === service.slug) + 1;
  const formattedIndex = String(serviceIndex > 0 ? serviceIndex : 1).padStart(2, '0');
  const relatedServices = SERVICES_CATALOG.filter((s) => s.slug !== service.slug).slice(0, 3);
  const heroInteriorImg = getServiceInteriorHero(service.slug);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <InteriorHero
        ariaLabel={`${exactH1} Header`}
        kicker={`100% Satisfaction Guaranteed · Service ${formattedIndex}`}
        title={exactH1}
        description={service.shortDesc}
        imageSrc={heroInteriorImg}
        imageAlt={`${exactH1} spotless South Florida interior`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Our Services', to: '/our-services' },
          { label: exactH1 }
        ]}
        aside={
          <div className="w-full sm:w-auto bg-[#071536]/65 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl">
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#a3e6be] font-semibold mb-2">
              Call or Text for a Free Quote
            </p>
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="inline-flex items-center gap-2.5 text-xl font-mono font-bold text-white hover:text-[#a3e6be] transition-colors tabular-nums"
            >
              <Phone className="w-5 h-5 text-[#a3e6be] shrink-0" />
              {BUSINESS_NAP.phone}
            </a>
            <p className="text-xs text-slate-200 mt-1.5 m-0">
              Palm Beach · Broward · Miami-Dade
            </p>
          </div>
        }
      />

      {/* Main Content & Sticky Sidebar */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Detailed Service Breakdown */}
            <div className="lg:col-span-7 space-y-10">
              {/* Overview Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
                <div className="editorial-kicker mb-3">
                  How We Make Your Space Shine
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1926] mb-5 tracking-tight">
                  Stress-Free {exactH1} in South Florida
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                  {service.fullDesc}
                </p>

                <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100">
                  <img
                    src={service.image}
                    alt={`${exactH1} in South Florida`}
                    className="w-full h-64 sm:h-80 object-cover"
                    loading="lazy"
                    width="800"
                    height="500"
                  />
                </div>
              </div>

              {/* Scope Checklist */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
                <div className="editorial-kicker mb-3">
                  What We Do For You
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b1926] mb-3 tracking-tight">
                  What&apos;s Included in Your {exactH1}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mb-8 leading-relaxed">
                  Every home and workplace is a little different, so we tailor our checklist around what matters most to you. Here’s what our friendly team takes care of:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80 hover:border-[#2a8655]/40 transition-colors"
                    >
                      <span className="font-mono text-xs font-bold text-[#2a8655] bg-[#e8f5ee] w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-medium text-slate-800 leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Client Benefits */}
              <div className="bg-[#07111a] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-white/10">
                <div className="editorial-kicker-light mb-3">
                  Why Neighbors Love Us
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold mb-6 tracking-tight text-white">
                  Why South Florida Loves Our {exactH1}
                </h3>
                <div className="space-y-4">
                  {service.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 bg-white/[0.04] p-4 sm:p-5 rounded-2xl border border-white/10"
                    >
                      <span className="font-mono text-xs font-bold text-[#4fd18b] border border-[#4fd18b]/40 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 tabular-nums">
                        0{idx + 1}
                      </span>
                      <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed pt-1">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standard Quality Inspection Checklist */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
                <div className="editorial-kicker mb-3">
                  Our Room-by-Room Checklist
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b1926] mb-3 tracking-tight">
                  Our Sparkle Inspection Checklist
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
                  Before our team wraps up, our team lead double-checks every item below so you walk into a spotless space every single time:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  {service.checklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2a8655] shrink-0 mt-0.5" />
                      <span className="font-medium leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Quote Form */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <div className="editorial-kicker mb-2">
                    Fast, Honest Pricing
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#071536] mb-1 tracking-tight">
                    Get Your Free Quote
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Tell us a little about your space and we’ll get right back to you with a no-obligation quote.
                  </p>
                </div>
                <QuoteForm source={exactH1} />
              </div>

              {/* Direct Call Box */}
              <div className="bg-[#0b1926] rounded-2xl p-6 border border-slate-800 flex items-center justify-between gap-4 text-white">
                <div>
                  <p className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-[#4fd18b]">
                    Need Help Right Away?
                  </p>
                  <p className="text-base font-bold text-white mt-0.5">
                    Chat directly with our friendly local team
                  </p>
                </div>
                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="bg-[#2a8655] hover:bg-[#1f6840] text-white font-mono font-bold px-4 py-3 rounded-xl text-sm shadow-sm transition-colors shrink-0 whitespace-nowrap tabular-nums"
                >
                  {BUSINESS_NAP.phone}
                </a>
              </div>

              {/* 100% Guarantee Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] text-[#2a8655] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#0b1926] uppercase tracking-wider mb-1">
                    Love Your Clean or Don’t Pay
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {BUSINESS_NAP.guarantee}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Service Area Cross-Links */}
      <section className="py-12 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-[#2a8655] block mb-1">
                Neighborhoods We Serve
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#071536]">
                {exactH1} Across Palm Beach, Broward &amp; Miami-Dade
              </h2>
            </div>
            <Link
              to="/service-areas"
              className="text-xs font-bold text-[#2a8655] hover:text-[#12582e] inline-flex items-center gap-1 whitespace-nowrap"
            >
              See All 56 Cities &rarr;
            </Link>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {[
              { name: 'Jupiter', slug: 'jupiter' },
              { name: 'Palm Beach Gardens', slug: 'palm-beach-gardens' },
              { name: 'West Palm Beach', slug: 'west-palm-beach' },
              { name: 'Wellington', slug: 'wellington' },
              { name: 'Boynton Beach', slug: 'boynton-beach' },
              { name: 'Delray Beach', slug: 'delray-beach' },
              { name: 'Boca Raton', slug: 'boca-raton' }
            ].map((city) => (
              <Link
                key={city.slug}
                to={`/service-area/${city.slug}`}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#12582e] hover:border-[#2a8655] transition-colors"
              >
                {exactH1} in {city.name}, FL
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services Cross-Links */}
      <section className="py-16 lg:py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="editorial-kicker mb-2">
                More Ways We Can Help
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1926] tracking-tight">
                Explore Other Cleaning Services
              </h2>
            </div>
            <Link
              to="/our-services"
              className="text-sm font-bold text-[#2a8655] hover:text-[#1f6840] inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              View All 10 Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((rel) => (
              <Link
                key={rel.slug}
                to={`/service/${rel.slug}`}
                className="group bg-[#f8fafc] rounded-2xl p-6 border border-slate-200/90 hover:border-[#2a8655]/50 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#2a8655] font-semibold block mb-2">
                    100% Guaranteed Clean
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0b1926] group-hover:text-[#2a8655] transition-colors mb-2">
                    {rel.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-5 leading-relaxed">
                    {rel.shortDesc}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2a8655] inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  See What’s Included
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
