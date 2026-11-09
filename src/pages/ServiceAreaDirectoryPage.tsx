import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  X,
  ArrowRight,
  Phone,
  Sparkles,
  Building2
} from 'lucide-react';
import { serviceAreas } from '../data/serviceAreas';
import { QuoteModal } from '../components/ui/QuoteModal';
import { BUSINESS_NAP } from '../data/siteData';

const PALM_BEACH_SLUGS = new Set([
  'west-palm-beach', 'boca-raton', 'delray-beach', 'jupiter', 'palm-beach-gardens',
  'wellington', 'boynton-beach', 'lake-worth-beach', 'royal-palm-beach', 'north-palm-beach',
  'riviera-beach', 'greenacres', 'lantana', 'palm-springs', 'lake-park',
  'tequesta', 'juno-beach', 'highland-beach', 'hypoluxo', 'manalapan',
  'ocean-ridge', 'south-palm-beach', 'palm-beach', 'atlantis', 'haverhill',
  'mangonia-park', 'loxahatchee', 'the-acreage', 'palm-beach-shores', 'glen-ridge',
  'gulf-stream', 'cloud-lake', 'golf', 'briny-breezes', 'jupiter-inlet-colony',
  'lake-clarke-shores', 'palm-beach-gardens-west', 'westlake', 'avenir', 'arden',
  'century-village', 'kings-point', 'golden-lakes', 'limestone-creek', 'pine-jog',
  'schall-circle', 'cabana-colony', 'kenwood-estates', 'san-castle', 'gun-club-estates'
]);

type RegionFilter = 'all' | 'palm-beach' | 'broward' | 'miami-dade' | 'extended';

export const ServiceAreaDirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('all');
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  useEffect(() => {
    document.title = 'Service Areas - 56 Locations | South Florida Cleaning Concepts';
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute(
        'content',
        'Browse our complete directory of 56 South Florida service areas extending north through Jupiter. Commercial janitorial, medical sanitization, and luxury maid service. Call (561) 704-5303.'
      );
    }
    window.scrollTo(0, 0);
  }, []);

  const filteredAreas = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return serviceAreas.filter((area) => {
      // Region filter
      if (selectedRegion === 'palm-beach' && !PALM_BEACH_SLUGS.has(area.slug)) {
        return false;
      }
      if (selectedRegion === 'broward' && area.slug !== 'broward-county') {
        return false;
      }
      if (selectedRegion === 'miami-dade' && area.slug !== 'miami-dade-county') {
        return false;
      }
      if (
        selectedRegion === 'extended' &&
        !['martin-county', 'st-lucie-county', 'okeechobee-county', 'orange-county'].includes(area.slug)
      ) {
        return false;
      }

      // Search query filter
      if (!query) return true;

      const nameMatch = area.name.toLowerCase().includes(query);
      const descMatch = area.description.toLowerCase().includes(query);
      const hoodMatch = (area.neighborhoods || []).some((n) => n.toLowerCase().includes(query));
      const landmarkMatch = (area.landmarks || []).some((l) => l.name.toLowerCase().includes(query));
      const corridorMatch = (area.keyCorridors || []).some((c) => c.toLowerCase().includes(query));

      return nameMatch || descMatch || hoodMatch || landmarkMatch || corridorMatch;
    });
  }, [searchQuery, selectedRegion]);

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['CleaningService', 'LocalBusiness'],
        '@id': 'https://sfcleaningconcepts.com/#localbusiness',
        name: 'South Florida Cleaning Concepts',
        image: 'https://sfcleaningconcepts.com/assets/images/hero/video-poster-2.jpeg',
        telephone: BUSINESS_NAP.phone,
        email: BUSINESS_NAP.email,
        priceRange: BUSINESS_NAP.priceRange,
        url: 'https://sfcleaningconcepts.com/service-areas',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Boynton Beach',
          addressRegion: 'FL',
          postalCode: '33435',
          addressCountry: 'US'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 26.5256,
          longitude: -80.0664
        },
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Palm Beach County' },
          { '@type': 'AdministrativeArea', name: 'Broward County' },
          { '@type': 'AdministrativeArea', name: 'Miami-Dade County' }
        ]
      },
      {
        '@type': 'CollectionPage',
        '@id': 'https://sfcleaningconcepts.com/service-areas#webpage',
        name: 'South Florida Cleaning Concepts Service Areas Directory',
        description: 'Complete directory of 56 South Florida service areas extending north through Jupiter served by South Florida Cleaning Concepts.',
        url: 'https://sfcleaningconcepts.com/service-areas',
        mainEntity: {
          '@type': 'ItemList',
          name: 'South Florida Cleaning Concepts Service Locations',
          numberOfItems: serviceAreas.length,
          itemListElement: serviceAreas.map((area, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: `${area.name}, FL`,
            url: `https://sfcleaningconcepts.com/service-area/${area.slug}`
          }))
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sfcleaningconcepts.com/service-areas#breadcrumb',
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
          }
        ]
      }
    ]
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen text-slate-800">
      {/* JSON-LD Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      {/* HERO SECTION WITH SEARCH INPUT */}
      <section className="relative bg-[#07111a] text-white py-20 lg:py-28 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#07111a] via-[#07111a]/95 to-[#07111a]/80"></div>
          <div className="absolute inset-0 bg-architectural-grid opacity-15"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-slate-400"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-[#4fd18b] font-semibold">Service Areas Directory</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] border border-white/15 text-[#4fd18b] text-xs font-mono uppercase tracking-[0.18em]">
              <MapPin className="w-3.5 h-3.5" /> Local South Florida Cleaners · Jupiter to Miami
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] [text-wrap:balance]">
              Our Active South Florida{' '}
              <span className="text-[#4fd18b]">Service Areas</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              From family homes and waterfront condos to vacation rentals and local workplaces, our friendly, background-checked pros bring a spotless clean to 56 South Florida communities. Pick your neighborhood below to see how we can help!
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-xl">
            <div className="relative flex items-center bg-white/[0.08] backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 shadow-xl focus-within:border-[#4fd18b] transition-colors">
              <Search className="w-5 h-5 text-[#4fd18b] shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Search your city or neighborhood (e.g. Boca Raton, Jupiter)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-slate-400 text-sm sm:text-base focus:outline-none"
                aria-label="Search service areas by city or neighborhood"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-white ml-2 cursor-pointer"
                  aria-label="Clear city search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTORY CONTENT & FILTERS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        {/* Header Strip & Region Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-[#12582e] block">
              Palm Beach • Broward • Miami-Dade • Treasure Coast
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#07111a] mt-1">
              {filteredAreas.length} Neighborhoods &amp; Cities We Serve
            </h2>
          </div>

          {/* Region Tabs */}
          <div
            role="tablist"
            aria-label="Filter service locations by county"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedRegion === 'all'}
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedRegion === 'all'
                  ? 'bg-white text-[#07111a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (56)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedRegion === 'palm-beach'}
              onClick={() => setSelectedRegion('palm-beach')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedRegion === 'palm-beach'
                  ? 'bg-white text-[#07111a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Palm Beach (50)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedRegion === 'broward'}
              onClick={() => setSelectedRegion('broward')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedRegion === 'broward'
                  ? 'bg-white text-[#07111a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Broward
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedRegion === 'miami-dade'}
              onClick={() => setSelectedRegion('miami-dade')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedRegion === 'miami-dade'
                  ? 'bg-white text-[#07111a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Miami-Dade
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedRegion === 'extended'}
              onClick={() => setSelectedRegion('extended')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedRegion === 'extended'
                  ? 'bg-white text-[#07111a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nearby Counties
            </button>
          </div>
        </div>

        {/* 56 Locations Grid */}
        {filteredAreas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {filteredAreas.map((area) => (
              <Link
                key={area.slug}
                to={`/service-area/${area.slug}`}
                className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-[#12582e] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-[#07111a] text-[#12582e] group-hover:text-[#4fd18b] flex items-center justify-center transition-colors shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    {area.geo && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                        {Number(area.geo.latitude).toFixed(2)}°N,{' '}
                        {Math.abs(Number(area.geo.longitude)).toFixed(2)}°W
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-[#07111a] group-hover:text-[#12582e] transition-colors">
                    {area.name}, FL
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {area.description}
                  </p>

                  {area.landmarks && area.landmarks.length > 0 && (
                    <div className="pt-2 text-[11px] text-slate-500 leading-snug">
                      <span className="font-semibold text-slate-700">Local Favorites:</span>{' '}
                      {area.landmarks.slice(0, 2).map((l) => l.name).join(' · ')}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#12582e]">
                  <span>See {area.name} Services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <h3 className="text-xl font-bold text-[#07111a]">
              No South Florida locations found matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-sm text-slate-600">
              Try searching for a nearby city or neighborhood, or reset your search to see all 56 communities.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
              }}
              className="px-6 py-3 rounded-xl bg-[#07111a] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Show All 56 Locations
            </button>
          </div>
        )}

        {/* CTA Banner: Need Custom Dispatch? */}
        <div className="rounded-3xl p-8 sm:p-12 bg-[#07111a] text-white border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4fd18b]">
              <Building2 className="w-4 h-4" /> Homes, Condos, Rentals &amp; Workplaces
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Want a Spotless Home or Office in South Florida?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We bring all the supplies, show up on time, and back every visit with our Love Your Clean or Don’t Pay Guarantee. Get your free quote today!
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#4fd18b] hover:bg-[#3ec47c] text-[#07111a] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              Get My Free Quote <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#4fd18b]" /> {BUSINESS_NAP.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        serviceTitle="Service Area Directory"
      />
    </main>
  );
};
