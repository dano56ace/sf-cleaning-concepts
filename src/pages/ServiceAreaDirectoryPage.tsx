import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  X,
  ArrowRight
} from 'lucide-react';
import { serviceAreas } from '../data/serviceAreas';
import { InteriorHero, INTERIOR_HERO_IMAGES } from '../components/ui/InteriorHero';

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

interface ServiceAreaDirectoryPageProps {
  onOpenQuoteModal?: (serviceTitle?: string) => void;
}

export const ServiceAreaDirectoryPage: React.FC<ServiceAreaDirectoryPageProps> = ({
  onOpenQuoteModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('all');

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

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800">
      {/* HERO SECTION WITH PARALLAX INTERIOR & SEARCH INPUT */}
      <InteriorHero
        ariaLabel="Service Areas Directory Header"
        kicker="South Florida Coverage · Jupiter to Miami"
        title={
          <>
            Our Active South Florida{' '}
            <span className="text-[#a3e6be]">Service Areas</span>
          </>
        }
        description="Trusted home, condo, vacation rental, and office cleaning across 56 South Florida communities."
        imageSrc={INTERIOR_HERO_IMAGES.waterfrontCondo}
        imageAlt="Spotless South Florida waterfront condominium living and dining room interior"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Service Areas' }
        ]}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 max-w-2xl">
          <div className="relative flex-1 flex items-center bg-[#071536]/65 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 shadow-xl focus-within:border-[#a3e6be] transition-colors">
            <Search className="w-5 h-5 text-[#a3e6be] shrink-0 mr-3" />
            <input
              type="text"
              placeholder="Search your city or neighborhood (e.g. Boca Raton, Jupiter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white placeholder:text-slate-300 text-sm sm:text-base focus:outline-none"
              aria-label="Search service areas by city or neighborhood"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-300 hover:text-white ml-2 cursor-pointer"
                aria-label="Clear city search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {onOpenQuoteModal && (
            <button
              type="button"
              onClick={() => onOpenQuoteModal('Service Area Directory')}
              className="px-5 py-3.5 rounded-2xl bg-[#12582e] hover:bg-[#0d4222] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors shadow-lg border border-white/15 cursor-pointer whitespace-nowrap shrink-0"
            >
              Request Free Quote <ArrowRight className="w-4 h-4 text-[#a3e6be]" />
            </button>
          )}
        </div>
      </InteriorHero>

      {/* DIRECTORY CONTENT & FILTERS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        {/* Header Strip & Region Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-[#12582e] block">
              Palm Beach • Broward • Miami-Dade • Treasure Coast
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#07111a] mt-1">
              {filteredAreas.length} {filteredAreas.length === 1 ? 'Community' : 'Communities'} We Serve
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
                aria-label={`View cleaning services in ${area.name}, FL`}
                className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-[#12582e] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-[#07111a] text-[#12582e] group-hover:text-[#4fd18b] flex items-center justify-center transition-colors shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <h3 className="text-xl font-bold text-[#07111a] group-hover:text-[#12582e] transition-colors">
                    {area.name}, FL
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {area.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#12582e]">
                  <span>View Services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <h3 className="text-xl font-bold text-[#07111a]">
              No locations found for &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-sm text-slate-600">
              Try another city or neighborhood, or reset to view all 56 communities.
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
      </section>
    </div>
  );
};
