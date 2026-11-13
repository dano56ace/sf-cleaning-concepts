import React, { useState, useEffect } from 'react';
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
import { serviceAreas, serviceAreasBySlug } from '../data/serviceAreas';
import { ServiceAreaLocalGuide } from '../components/service-areas/ServiceAreaLocalGuide';
import { ServiceAreaMap } from '../components/service-areas/ServiceAreaMap';
import { QuoteModal } from '../components/ui/QuoteModal';
import { QuoteForm } from '../components/ui/QuoteForm';
import { InteriorHero, getInteriorHeroForSlug } from '../components/ui/InteriorHero';
import { BUSINESS_NAP } from '../data/siteData';

interface DivisionItem {
  slug: string;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
}

export const ServiceAreaDetailPage: React.FC = () => {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug ? rawSlug.replace(/\.html$/, '') : undefined;
  const area = slug && Object.prototype.hasOwnProperty.call(serviceAreasBySlug, slug)
    ? serviceAreasBySlug[slug]
    : undefined;

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  useEffect(() => {
    if (area) {
      window.scrollTo(0, 0);
    }
  }, [area]);

  if (!area) {
    return <Navigate to="/404" replace />;
  }

  const divisions: DivisionItem[] = [
    {
      slug: 'home-maintenance',
      title: `Recurring Home & Condo Cleaning in ${area.name}`,
      shortDesc: `Our popular 4-Step Rotation Clean keeps ${area.name} homes fresh, dust-free, and sparkling week after week—with zero surprise fees.`,
      icon: <Sparkles className="w-6 h-6 text-[#12582e]" />
    },
    {
      slug: 'short-term-rentals',
      title: `Airbnb & Vacation Rental Turnovers in ${area.name}`,
      shortDesc: `Reliable same-day check-out to check-in cleans (10 AM - 4 PM), fresh hotel-style bed making, laundry, and photo updates in ${area.name}.`,
      icon: <Home className="w-6 h-6 text-[#12582e]" />
    },
    {
      slug: 'office-cleaning',
      title: `Office & Workplace Cleaning in ${area.name}`,
      shortDesc: `Flexible evening or daytime cleaning, spotless restrooms, fresh breakrooms, and dust-free desks for ${area.name} businesses.`,
      icon: <Building2 className="w-6 h-6 text-[#12582e]" />
    },
    {
      slug: 'medical-office-cleaning',
      title: `Medical & Dental Office Cleaning in ${area.name}`,
      shortDesc: `Gentle, hospital-grade disinfection for waiting rooms and exam suites so patients and staff feel safe and cared for in ${area.name}.`,
      icon: <ShieldAlert className="w-6 h-6 text-[#12582e]" />
    },
    {
      slug: 'post-construction-cleaning',
      title: `Post-Renovation & Remodel Cleanup in ${area.name}`,
      shortDesc: `We clear away every speck of drywall dust, paint splatter, and sticker residue so your newly remodeled ${area.name} space is ready to enjoy.`,
      icon: <HardHat className="w-6 h-6 text-[#12582e]" />
    }
  ];

  const faqs = [
    {
      q: `How often do most ${area.name} homeowners and offices schedule cleaning?`,
      a: `Most families in ${area.name} love our weekly or every-other-week Rotation Clean so they never have to spend their weekends scrubbing. Local offices and clinics usually pick nightly or 2x–3x weekly evening visits after everyone heads home.`
    },
    {
      q: `Do you offer same-day Airbnb and vacation rental turnovers in ${area.name}?`,
      a: `Yes! We specialize in tight 10:00 AM to 4:00 PM guest turnover windows across ${area.name}. We wash linens, stage beds like a boutique hotel, restock essentials, and text you photos as soon as your rental is guest-ready.`
    },
    {
      q: `Are your cleaning supplies safe for my kids and pets in ${area.name}?`,
      a: `100% yes. We bring all our own eco-friendly, non-toxic cleaners and fresh color-coded microfiber cloths that wipe out germs without leaving harsh chemical fumes behind.`
    },
    {
      q: `How does your Love Your Clean or Don’t Pay guarantee work in ${area.name}?`,
      a: `It’s simple: if you aren’t smiling when you walk into your freshly cleaned space, let us know within 24 hours and we’ll come right back to re-clean it for free. Still not happy? You don’t pay a dime.`
    },
    {
      q: `How fast can I get a quote and book my first clean in ${area.name}?`,
      a: `We can usually give you a free quote the very same day you reach out, and often have next-day or same-week openings across ${area.name}!`
    }
  ];

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `https://sfcleaningconcepts.com/service-area/${area.slug}#service`,
        name: `Professional Commercial & Residential Cleaning in ${area.name}, FL`,
        serviceType: 'CleaningService',
        description: area.description,
        provider: {
          '@type': 'LocalBusiness',
          '@id': 'https://sfcleaningconcepts.com/#localbusiness',
          name: 'South Florida Cleaning Concepts',
          telephone: BUSINESS_NAP.phone,
          email: BUSINESS_NAP.email,
          url: 'https://sfcleaningconcepts.com/',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Boynton Beach',
            addressRegion: 'FL',
            postalCode: '33435',
            addressCountry: 'US'
          }
        },
        areaServed: {
          '@type': 'City',
          name: area.name,
          containedInPlace: {
            '@type': 'State',
            name: 'Florida'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: area.geo ? Number(area.geo.latitude) : 26.7153,
            longitude: area.geo ? Number(area.geo.longitude) : -80.0534
          }
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `Commercial & Residential Cleaning Services in ${area.name}`,
          itemListElement: divisions.map((division) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: division.title,
              description: division.shortDesc
            }
          }))
        }
      },
      {
        '@type': ['CleaningService', 'LocalBusiness'],
        '@id': `https://sfcleaningconcepts.com/service-area/${area.slug}#local-service`,
        name: `South Florida Cleaning Concepts - ${area.name}`,
        image: 'https://sfcleaningconcepts.com/assets/images/hero/video-poster-2.jpeg',
        telephone: BUSINESS_NAP.phone,
        email: BUSINESS_NAP.email,
        priceRange: BUSINESS_NAP.priceRange,
        url: `https://sfcleaningconcepts.com/service-area/${area.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: area.name,
          addressRegion: 'FL',
          addressCountry: 'US'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: area.geo ? Number(area.geo.latitude) : 26.7153,
          longitude: area.geo ? Number(area.geo.longitude) : -80.0534
        },
        areaServed: {
          '@type': 'City',
          name: area.name,
          containedInPlace: {
            '@type': 'State',
            name: 'Florida'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: area.geo ? Number(area.geo.latitude) : 26.7153,
            longitude: area.geo ? Number(area.geo.longitude) : -80.0534
          }
        },
        description: area.description
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://sfcleaningconcepts.com/service-area/${area.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://sfcleaningconcepts.com/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Service Areas',
            item: 'https://sfcleaningconcepts.com/service-areas'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${area.name}, FL`,
            item: `https://sfcleaningconcepts.com/service-area/${area.slug}`
          }
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': `https://sfcleaningconcepts.com/service-area/${area.slug}#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a
          }
        }))
      }
    ]
  };

  const nearbyAreas = serviceAreas.filter((a) => a.slug !== area.slug).slice(0, 16);

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800">
      {/* JSON-LD Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      {/* SECTION 1: PARALLAX INTERIOR HERO BANNER */}
      <InteriorHero
        ariaLabel={`${area.name}, FL Cleaning Services Header`}
        kicker={`Serving ${area.name}, FL & Surrounding Areas`}
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
          { label: 'All 56 Service Areas', to: '/service-areas' },
          { label: `${area.name}, FL` }
        ]}
        aside={
          <div className="w-full sm:w-auto bg-[#071536]/65 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#a3e6be] font-semibold">
              100% Satisfaction Guarantee
            </div>
            <div className="text-sm text-slate-100 leading-snug">
              If you are not completely thrilled with our clean, we return to re-clean for free or you do not pay.
            </div>
            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
              <span>Licensed &amp; Bonded</span>
              <span className="text-[#a3e6be] font-mono tabular-nums">20+ Yrs Exp</span>
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsQuoteOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white text-sm font-bold tracking-wide transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg border border-white/15"
          >
            <span>Request Free {area.name} Quote</span>
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
              Trusted Local Care • {area.name}, Florida
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#07111a] leading-tight">
              Why {area.name} Neighbors &amp; Businesses Love Coming Home to Our Clean
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {area.description}
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              Living and working in <strong>{area.name}</strong> means dealing with South Florida humidity, tracked-in sand, and salty coastal breezes that quickly dull floors and glass. Our friendly, background-checked pros bring gentle, kid- and pet-safe supplies and fresh color-coded microfiber cloths so your home, vacation rental, or workplace stays spotless and smells fresh.
            </p>

            {area.highlights && area.highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {area.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3 text-xs sm:text-sm font-semibold text-slate-800"
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
                  Neighborhoods &amp; Communities We Serve in {area.name}:
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
                A Fresh, Healthy Space Without Lifting a Finger
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Over <strong>94% of families and employees</strong> say walking into a clean, clutter-free room immediately lowers stress. In {area.name}, our vetted local crew handles all the scrubbing, dusting, and sanitizing so you get your free time back.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#4fd18b]">100%</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mt-1">
                    Satisfaction Guarantee
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-green-400">20+ Yrs</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mt-1">
                    South Florida Heritage
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#4fd18b]">0%</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mt-1">
                    Cross-Contamination
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-green-400">7 Days</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mt-1">
                    Flexible Scheduling
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
        onRequestConsultation={() => setIsQuoteOpen(true)}
      />

      {/* SECTION 4: SPECIALIZED CLEANING SERVICES IN AREA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-[#12582e] block">
            Local Cleaning Services • {area.name}, FL
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#07111a]">
            Our Core Cleaning Capabilities in {area.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From daily commercial office janitorial care to specialized terminal medical disinfection and luxury home maintenance across {area.name}.
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
                  {division.icon}
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
                See What’s Included <ArrowRight className="w-4 h-4" />
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
                Free Custom Quote in {area.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tell us about your home, rental, or office—or schedule a quick walkthrough with our friendly local team—and get a clear, flat-rate price the same day.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="pt-4 border-t border-white/15 text-xs font-bold text-[#4fd18b] hover:text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              Get My Free Quote <ArrowRight className="w-4 h-4" />
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
                Simple, Dependable Care
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                How Our 4-Step Cleaning Works in {area.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Quick Quote or Walkthrough',
                  desc: `Share a few details about your ${area.name} home, vacation rental, or office so we know your floors, pets, and priorities.`
                },
                {
                  step: '02',
                  title: 'Tailored Cleaning Checklist',
                  desc: 'We build a custom room-by-room plan—including our 4-Step Rotation System so baseboards, fans, and blinds never get skipped.'
                },
                {
                  step: '03',
                  title: 'Safe, Thorough Cleaning',
                  desc: 'Our friendly, background-checked pros arrive on time with kid- and pet-safe supplies, HEPA vacuums, and fresh microfiber cloths.'
                },
                {
                  step: '04',
                  title: 'Love It or Don’t Pay Check',
                  desc: 'Our team lead checks every room before locking up—backed 100% by our Love Your Clean or Don’t Pay Guarantee.'
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
                20+ Years Serving South Florida Families &amp; Businesses
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Family-Owned Care &amp; Dependable Local Cleaners
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Unlike franchise apps that send random, unvetted strangers to your door, South Florida Cleaning Concepts is family-owned with friendly, insured, and background-checked cleaners. Every home, vacation rental, and workplace in {area.name} is cared for with personal pride.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#4fd18b] shrink-0" /> Licensed &amp; Insured
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#4fd18b] shrink-0" /> Safe for Kids &amp; Pets
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#4fd18b] shrink-0" /> 100% Love-It Guarantee
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
                Local Cleaning Options • {area.name}, FL
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#07111a]">
                Simple, Flexible Cleaning Plans in {area.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {area.marketInsight}
              </p>
            </div>

            {/* Transparent Rate Packages Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-bold tracking-tight text-[#07111a]">
                Popular {area.name} Cleaning Schedules
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#07111a] text-white">
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Plan</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">How Often</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">What’s Included in {area.name}</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Great For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-[#07111a]">Regular Home &amp; Office Care</td>
                      <td className="py-3 px-4 font-bold text-[#12582e]">Weekly / Bi-Weekly</td>
                      <td className="py-3 px-4">Room-by-room rotation care, kitchens &amp; baths, dusting, vacuuming &amp; fresh floors</td>
                      <td className="py-3 px-4">Busy families, pet owners &amp; local offices</td>
                    </tr>
                    <tr className="bg-emerald-50/40 hover:bg-emerald-50/70">
                      <td className="py-3 px-4 font-bold text-[#07111a]">Top-to-Bottom Deep Clean</td>
                      <td className="py-3 px-4 font-bold text-[#12582e]">Monthly / One-Time</td>
                      <td className="py-3 px-4">Inside appliances, deep tile &amp; grout scrubbing, baseboards, blinds &amp; ceiling fans</td>
                      <td className="py-3 px-4">Seasonal arrivals, move-in/move-out &amp; spring resets</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-[#07111a]">Workplace &amp; Clinic Care</td>
                      <td className="py-3 px-4 font-bold text-[#12582e]">Daily / Custom</td>
                      <td className="py-3 px-4">Safe clinic &amp; office sanitizing, spotless restrooms, breakrooms, trash &amp; floors</td>
                      <td className="py-3 px-4">Medical suites, offices, schools &amp; restaurants</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Localized FAQs */}
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-bold tracking-tight text-[#07111a]">
                Frequently Asked Questions About Cleaning in {area.name}
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
                  Fast Local Pricing • {area.name}, FL
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#071536]">
                  Get Your Free {area.name} Quote
                </h3>
                <p className="text-xs text-slate-600 mt-1 m-0">
                  Tell us about your home, vacation rental, or office in {area.name} and we’ll reply right away.
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
              Explore Other South Florida Service Areas
            </h3>
            <Link
              to="/service-areas"
              className="text-xs font-bold uppercase tracking-widest text-[#12582e] hover:underline"
            >
              View All 56 Service Areas →
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

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        serviceTitle={`${area.name} Cleaning Services`}
      />
    </div>
  );
};
