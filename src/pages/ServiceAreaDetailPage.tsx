import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  MapPin,
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
  Award,
  Clock,
  Mail,
  ChevronLeft
} from 'lucide-react';
import { serviceAreas, serviceAreasBySlug } from '../data/serviceAreas';
import { ServiceAreaLocalGuide } from '../components/service-areas/ServiceAreaLocalGuide';
import { ServiceAreaMap } from '../components/service-areas/ServiceAreaMap';
import { QuoteModal } from '../components/ui/QuoteModal';
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
      document.title = area.seoTitle || `${area.name} Commercial & Residential Cleaning Services | South Florida Cleaning Concepts`;
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl && area.metaDescription) {
        descEl.setAttribute('content', area.metaDescription);
      }
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
    <main className="bg-[#f8fafc] min-h-screen text-slate-800">
      {/* JSON-LD Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      {/* SECTION 1: ARCHITECTURAL HERO BANNER */}
      <section className="relative bg-[#07111a] text-white py-20 lg:py-28 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#07111a] via-[#07111a]/95 to-[#07111a]/80"></div>
          <div className="absolute inset-0 bg-architectural-grid opacity-15"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-slate-400"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <Link to="/service-areas" className="hover:text-white transition-colors flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5 text-[#4fd18b]" /> All 56 Service Areas
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-[#4fd18b] font-semibold">{area.name}, FL</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] border border-white/15 text-[#4fd18b] text-xs font-mono uppercase tracking-[0.18em]">
                <MapPin className="w-3.5 h-3.5" /> Serving {area.name}, FL &amp; Surrounding Areas
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] [text-wrap:balance]">
                Premier Commercial &amp; Residential Cleaning Services in{' '}
                <span className="text-[#4fd18b]">{area.name}, FL</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-3xl font-normal">
                {area.description} Backed by over 20 years of family-owned excellence, our bonded specialists deliver hospital-grade sanitization, EPA List N pathogen defense, and personalized cleaning rotations in {area.name}.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuoteOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-[#4fd18b] hover:bg-[#3ec47c] text-[#07111a] text-sm font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  Request Free {area.name} Quote <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="px-6 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 text-sm font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#4fd18b]" /> Call Dispatch: {BUSINESS_NAP.phone}
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="w-full sm:w-auto bg-white/[0.05] backdrop-blur-md border border-white/15 rounded-2xl p-6 space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#4fd18b] font-semibold">
                  100% Satisfaction Guarantee
                </div>
                <div className="text-sm text-slate-200 leading-snug">
                  If you are not completely thrilled with our clean, we return to re-clean for free or you do not pay.
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Licensed &amp; Bonded</span>
                  <span className="text-[#4fd18b] font-mono">20+ Yrs Exp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LOCAL DOMINANCE & NEIGHBORHOODS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-[#12582e] block">
              Local Market Dominance • {area.name}, Florida
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#07111a] leading-tight">
              Setting the Gold Standard for Cleanliness in {area.name}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {area.description}
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              In a sophisticated market like <strong>{area.name}</strong>, maintaining pristine cleanliness requires more than basic sweeping. South Florida&apos;s heat, humidity, and coastal salt air create unique challenges that demand certified cleaning methods. At South Florida Cleaning Concepts, our vetted specialists combine EPA List N hospital disinfectants with microfiber technology to protect your health, property value, and reputation.
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
                  Proudly Serving {area.name} Neighborhoods &amp; Enclaves:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {area.neighborhoods.map((hood) => (
                    <span
                      key={hood}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5"
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
              <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
                Why Professional Sanitization Matters in {area.name}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Over <strong>94% of employees and guests</strong> cite cleanliness as the single most critical factor in their perception of a facility. In {area.name}, our hospital-grade protocols protect indoor air quality, eliminate pathogens, and present your space with flawless polish.
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
                  <div className="text-2xl sm:text-3xl font-extrabold text-green-400">24/7</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mt-1">
                    Emergency Janitorial
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

      {/* SECTION 4: SPECIALIZED CLEANING DIVISIONS IN AREA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-[#12582e] block">
            Specialized Cleaning Divisions • {area.name}, FL
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
                className="pt-4 border-t border-slate-100 text-xs font-bold uppercase tracking-wider text-[#12582e] hover:text-[#0b1926] inline-flex items-center gap-2 transition-colors"
              >
                Explore Division Details <ArrowRight className="w-4 h-4" />
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
                Free Personalized Walkthrough in {area.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Schedule a complimentary on-site walkthrough with our senior operations director. Receive a custom rotation cleaning blueprint and flat-rate estimate within 24 hours.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="pt-4 border-t border-white/15 text-xs font-bold uppercase tracking-widest text-[#4fd18b] hover:text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              Claim Your Free Walkthrough <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: 4-STEP PROCESS & OPERATOR MINDSET */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#07111a] text-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-[#4fd18b] block">
                Proven Execution Roadmap
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Our 4-Step Cleaning System in {area.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: `${area.name} Facility Walkthrough`,
                  desc: `We inspect square footage, high-touch pathogen zones, floor finishes (marble, tile, carpet), and specific operating hours in ${area.name}.`
                },
                {
                  step: '02',
                  title: 'Customized Rotation Plan',
                  desc: 'We engineer a tailored rotation plan focusing on high-touch surfaces, restrooms, and deep cleaning to prevent dirt accumulation.'
                },
                {
                  step: '03',
                  title: 'Hospital-Grade Disinfection',
                  desc: 'Certified, background-checked crews apply EPA List N hospital disinfectants, HEPA filtration vacuums, and color-coded microfiber.'
                },
                {
                  step: '04',
                  title: 'Continuous Quality Assurance',
                  desc: 'Regular supervisor inspections and our 100% Satisfaction Guarantee ensure your property remains spotless on every recurring visit.'
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
              <span className="px-3.5 py-1.5 rounded-full bg-[#4fd18b]/15 border border-[#4fd18b]/40 text-[#4fd18b] text-[10px] font-bold uppercase tracking-widest inline-block">
                Over Two Decades of South Florida Cleaning Leadership
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Family-Owned Integrity &amp; Uncompromising Accountability
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Unlike franchise brokers who subcontract your keys to untested third parties, South Florida Cleaning Concepts operates with vetted, insured, and thoroughly background-checked staff. Every commercial building and residence in {area.name} is treated with senior supervision and personal pride.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#4fd18b] shrink-0" /> Bonded &amp; Insured
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#4fd18b] shrink-0" /> EPA List N Disinfectants
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#4fd18b] shrink-0" /> 100% Satisfaction Guarantee
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
              <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-[#12582e] block">
                Local Market Intelligence • {area.name}, FL
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#07111a]">
                Navigating the {area.name} Cleaning &amp; Facility Landscape
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {area.marketInsight}
              </p>
            </div>

            {/* Transparent Rate Packages Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-bold tracking-tight text-[#07111a]">
                Transparent {area.name} Cleaning &amp; Janitorial Programs
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#07111a] text-white">
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Service Tier</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Frequency</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Core Scope for {area.name}</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-[#07111a]">Recurring Maintenance</td>
                      <td className="py-3 px-4 font-bold text-[#12582e]">Weekly / Bi-Weekly</td>
                      <td className="py-3 px-4">4-Phase rotation scrub, high-touch sanitization, kitchen &amp; bath deep care, HEPA floor care</td>
                      <td className="py-3 px-4">Offices, executive suites &amp; busy family residences</td>
                    </tr>
                    <tr className="bg-emerald-50/40 hover:bg-emerald-50/70">
                      <td className="py-3 px-4 font-bold text-[#07111a]">Deep Rotation Scrub</td>
                      <td className="py-3 px-4 font-bold text-[#12582e]">Monthly / Seasonal</td>
                      <td className="py-3 px-4">Top-to-bottom scrub, appliance interiors, tile/grout acid wash, baseboards, AC vent dusting</td>
                      <td className="py-3 px-4">Seasonal residences, move-in/out &amp; quarterly resets</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-[#07111a]">Commercial Janitorial</td>
                      <td className="py-3 px-4 font-bold text-[#12582e]">Daily / 3x-Weekly</td>
                      <td className="py-3 px-4">OSHA healthcare sanitization, day porter care, restroom hygiene, trash &amp; recycling</td>
                      <td className="py-3 px-4">Medical clinics, corporate towers, schools &amp; eateries</td>
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

          {/* Right Column: Google Maps & Direct Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <ServiceAreaMap area={area} />

            <div className="p-8 rounded-3xl bg-[#07111a] text-white border border-white/10 space-y-5 shadow-xl">
              <div className="text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-[#4fd18b]">
                Ready for a Spotless Space in {area.name}?
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
                Schedule Your {area.name} Walkthrough
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect directly with our operations team for a customized cleaning blueprint, flat-rate proposal, and scheduling in {area.name}.
              </p>
              <div className="space-y-3 text-xs pt-1">
                <a
                  href={`tel:${BUSINESS_NAP.phoneRaw}`}
                  className="flex items-center gap-2.5 text-white font-bold hover:text-[#4fd18b] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#4fd18b]" /> Direct Dispatch: {BUSINESS_NAP.phone}
                </a>
                <a
                  href={`mailto:${BUSINESS_NAP.email}`}
                  className="flex items-center gap-2.5 text-white font-bold hover:text-[#4fd18b] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#4fd18b]" /> {BUSINESS_NAP.email}
                </a>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <Clock className="w-4 h-4 text-[#4fd18b]" /> {BUSINESS_NAP.hours}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuoteOpen(true)}
                className="w-full py-3.5 px-6 rounded-xl bg-[#4fd18b] text-[#07111a] text-xs font-bold uppercase tracking-wider hover:bg-[#3ec47c] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Request Free Estimate <ArrowRight className="w-4 h-4" />
              </button>
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
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:border-[#12582e] hover:text-[#12582e] text-slate-700 transition-all shadow-2xs"
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
    </main>
  );
};
