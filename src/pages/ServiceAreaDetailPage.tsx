import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Phone,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Building2,
  ShieldAlert,
  Home,
  HardHat,
  Sparkles,
  Clock,
  Mail
} from 'lucide-react';
import {
  serviceAreas,
  serviceAreasBySlug,
  getServiceAreaCoreServices,
  getServiceAreaFaqs
} from '../data/serviceAreas';
import { ServiceAreaLocalGuide } from '../components/service-areas/ServiceAreaLocalGuide';
import { ServiceAreaMap } from '../components/service-areas/ServiceAreaMap';
import { QuoteForm } from '../components/ui/QuoteForm';
import { InteriorHero, getInteriorHeroForSlug } from '../components/ui/InteriorHero';
import { BUSINESS_NAP } from '../data/siteData';

const DIVISION_ICONS: Record<string, React.ReactNode> = {
  'home-maintenance': <Sparkles className="w-6 h-6 text-[#12582e]" />,
  'short-term-rentals': <Home className="w-6 h-6 text-[#12582e]" />,
  'office-cleaning': <Building2 className="w-6 h-6 text-[#12582e]" />,
  'medical-office-cleaning': <ShieldAlert className="w-6 h-6 text-[#12582e]" />,
  'post-construction-cleaning': <HardHat className="w-6 h-6 text-[#12582e]" />
};

interface ServiceAreaDetailPageProps {
  onOpenQuoteModal?: (serviceTitle?: string) => void;
}

export const ServiceAreaDetailPage: React.FC<ServiceAreaDetailPageProps> = ({
  onOpenQuoteModal,
}) => {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug ? rawSlug.toLowerCase().replace(/\.html$/, '') : undefined;
  const area = slug && Object.prototype.hasOwnProperty.call(serviceAreasBySlug, slug)
    ? serviceAreasBySlug[slug]
    : undefined;

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!area) {
    return <Navigate to="/404" replace />;
  }

  const divisions = getServiceAreaCoreServices(area.name);
  const faqs = getServiceAreaFaqs(area.name);
  const nearbyAreas = serviceAreas.filter((a) => a.slug !== area.slug).slice(0, 6);

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800">
      {/* SECTION 1: PARALLAX INTERIOR HERO BANNER */}
      <InteriorHero
        ariaLabel={`${area.name}, FL Cleaning Services Header`}
        kicker={`Serving ${area.name}, FL`}
        title={
          <>
            Premier Commercial &amp; Residential Cleaning Services in{' '}
            <span className="text-[#a3e6be]">{area.name}, FL</span>
          </>
        }
        description={area.description}
        imageSrc={getInteriorHeroForSlug(area.slug)}
        imageAlt={`Spotless luxury South Florida interior in ${area.name}, FL`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Service Areas', to: '/service-areas' },
          { label: `${area.name}, FL` }
        ]}
        aside={
          <div className="w-full sm:w-auto bg-[#071536]/65 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-2.5 shadow-xl">
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#a3e6be] font-semibold">
              100% Guarantee
            </div>
            <div className="text-sm text-slate-100 leading-snug">
              Free 24-hour re-clean or you don&apos;t pay.
            </div>
            <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-4 text-xs text-slate-300">
              <span>Licensed · Bonded</span>
              <span className="text-[#a3e6be] font-mono tabular-nums">20+ Yrs</span>
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenQuoteModal?.(`${area.name} Cleaning Services`)}
            className="px-6 py-3.5 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white text-sm font-bold tracking-wide transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg border border-white/15"
          >
            <span>Get Free Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={`tel:${BUSINESS_NAP.phoneRaw}`}
            className="px-6 py-3.5 rounded-xl bg-[#071536]/65 hover:bg-[#071536]/85 backdrop-blur-xs text-white border border-white/25 text-sm font-mono font-bold transition-all inline-flex items-center gap-2 tabular-nums"
          >
            <Phone className="w-4 h-4 text-[#a3e6be]" />
            <span>Call {BUSINESS_NAP.phone}</span>
          </a>
        </div>
      </InteriorHero>

      {/* SECTION 2: LOCAL DOMINANCE & NEIGHBORHOODS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#12582e] block">
              Local Care
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#07111a] leading-tight">
              Trusted Cleaning in {area.name}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Our vetted crews use kid- and pet-safe supplies and color-coded microfiber built for South Florida humidity and salt air.
            </p>

            {area.highlights && area.highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {area.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#12582e] shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            )}

            {area.neighborhoods && area.neighborhoods.length > 0 && (
              <div className="pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#07111a]">
                  Neighborhoods Served in {area.name}:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {area.neighborhoods.map((hood) => (
                    <span
                      key={hood}
                      className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#12582e]" /> {hood}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#07111a] text-white border border-white/10 space-y-6 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-[#4fd18b]/15 border border-[#4fd18b]/40 flex items-center justify-center text-[#4fd18b]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Spotless Results, Zero Effort
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Our vetted team handles scrubbing and sanitizing so you reclaim your time.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#4fd18b]">100%</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mt-1">
                    Satisfaction
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-green-400">20+ Yrs</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mt-1">
                    Experience
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#4fd18b]">0%</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mt-1">
                    Cross-Contact
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-green-400">7 Days</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mt-1">
                    Scheduling
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE SERVICE AREA LOCAL GUIDE */}
      <ServiceAreaLocalGuide
        area={area}
        onRequestConsultation={() => onOpenQuoteModal?.(`${area.name} Cleaning Services`)}
      />

      {/* SECTION 4: SPECIALIZED CLEANING SERVICES IN AREA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-[#12582e] block">
            Our Services
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#07111a]">
            Core Cleaning Services in {area.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Commercial, medical, rental, and residential care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {divisions.map((division) => (
            <div
              key={division.slug}
              className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-[#12582e] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                  {DIVISION_ICONS[division.slug] || <Sparkles className="w-6 h-6 text-[#12582e]" />}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#07111a]">
                  {division.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {division.shortDesc}
                </p>
              </div>
              <Link
                to={`/service/${division.slug}`}
                className="pt-4 border-t border-slate-100 text-xs font-bold text-[#12582e] hover:text-[#0b1926] inline-flex items-center gap-2 transition-colors"
              >
                Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}

          {/* Complimentary Walkthrough Card */}
          <div className="p-7 rounded-3xl bg-[#07111a] text-white border border-white/10 shadow-xl flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4fd18b]/15 text-[#4fd18b] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                Request a Custom Quote
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Book a quick walkthrough for same-day flat-rate pricing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenQuoteModal?.(`${area.name} Cleaning Services`)}
              className="pt-4 border-t border-white/15 text-xs font-bold text-[#4fd18b] hover:text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              Get Free Quote <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: 4-STEP PROCESS & OPERATOR MINDSET */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#07111a] text-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#4fd18b] block">
                Dependable Process
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Our 4-Step Process
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Quick Quote',
                  desc: 'Share your home, rental, or office priorities.'
                },
                {
                  step: '02',
                  title: 'Custom Checklist',
                  desc: 'Custom 4-Step Rotation plan covering baseboards, fans, and blinds.'
                },
                {
                  step: '03',
                  title: 'Eco-Safe Clean',
                  desc: 'Vetted pros arrive with HEPA vacuums and fresh microfiber.'
                },
                {
                  step: '04',
                  title: 'Final Inspection',
                  desc: 'Final walkthrough backed by our Love Your Clean guarantee.'
                }
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-6 sm:p-7 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#4fd18b]/45 transition-colors space-y-3"
                >
                  <div className="text-3xl font-extrabold text-[#4fd18b] font-mono">{item.step}</div>
                  <h3 className="text-lg font-bold tracking-tight text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Pledge Card */}
          <div className="relative rounded-3xl p-8 sm:p-12 border border-[#4fd18b]/30 bg-white/[0.03] space-y-6">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#4fd18b]">
                20+ Years in South Florida
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Family-Owned Care You Can Trust
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Your space is cleaned by our insured, background-checked local specialists—never gig-app strangers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#4fd18b] shrink-0" /> Licensed &amp; Insured
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#4fd18b] shrink-0" /> Kid &amp; Pet Safe
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#4fd18b] shrink-0" /> 100% Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: MARKET INSIGHTS, RATE PACKAGES & MAP + FAQS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Market Insight, Packages, FAQs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.22em] font-mono font-bold text-[#12582e] block">
                Cleaning Plans
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#07111a]">
                Cleaning Plans in {area.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {area.marketInsight}
              </p>
            </div>

            {/* Transparent Rate Packages Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-bold tracking-tight text-[#07111a]">
                Cleaning Schedules
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#07111a] text-white">
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Plan</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Cadence</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Scope</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-[#07111a]">Regular Care</td>
                      <td className="py-3 px-4 font-bold text-[#12582e]">Weekly / Bi-Weekly</td>
                      <td className="py-3 px-4">Kitchens, baths, dusting, vacuuming &amp; floors</td>
                      <td className="py-3 px-4">Families &amp; offices</td>
                    </tr>
                    <tr className="bg-emerald-50/40 hover:bg-emerald-50/70">
                      <td className="py-3 px-4 font-bold text-[#07111a]">Deep Clean</td>
                      <td className="py-3 px-4 font-bold text-[#12582e]">Monthly / One-Time</td>
                      <td className="py-3 px-4">Appliances, grout, baseboards, blinds &amp; fans</td>
                      <td className="py-3 px-4">Move-ins &amp; resets</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-[#07111a]">Clinic &amp; Office</td>
                      <td className="py-3 px-4 font-bold text-[#12582e]">Daily / Custom</td>
                      <td className="py-3 px-4">EPA List N disinfection, restrooms &amp; breakrooms</td>
                      <td className="py-3 px-4">Clinics &amp; suites</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Localized FAQs */}
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-bold tracking-tight text-[#07111a]">
                Cleaning FAQs
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={faq.q}
                      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#07111a] cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 transition-transform text-[#12582e] ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps & Embedded Netlify Quote Form */}
          <div className="lg:col-span-5 space-y-6">
            <ServiceAreaMap area={area} />

            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg space-y-4">
              <div className="pb-3 border-b border-slate-200/80">
                <div className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#12582e] mb-1">
                  Fast Local Pricing
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#071536]">
                  Free Estimate
                </h3>
                <p className="text-xs text-slate-600 mt-1 m-0">
                  Request a fast, no-obligation quote.
                </p>
              </div>

              <QuoteForm idPrefix="area-" source={`Service Area: ${area.name}, FL`} />

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="inline-flex items-center gap-1.5 font-mono font-bold text-[#071536] hover:text-[#12582e] transition-colors tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 text-[#12582e]" /> {BUSINESS_NAP.phone}
                </a>
                <a
                  href={`mailto:${BUSINESS_NAP.email}`}
                  className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-[#12582e] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#12582e]" /> {BUSINESS_NAP.email}
                </a>
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-[#12582e]" /> {BUSINESS_NAP.hours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7: CROSS-LINKING NAVIGATION STRIP */}
        <div className="pt-10 border-t border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Nearby Service Areas
            </h3>
            <Link
              to="/service-areas"
              className="text-xs font-bold uppercase tracking-widest text-[#12582e] hover:underline"
            >
              All 56 Areas →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {nearbyAreas.map((nearby) => (
              <Link
                key={nearby.slug}
                to={`/service-area/${nearby.slug}`}
                className="px-3.5 py-2 min-h-[38px] inline-flex items-center rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-[#12582e] hover:text-[#12582e] text-slate-700 transition-all shadow-2xs"
              >
                {nearby.name}, FL
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
