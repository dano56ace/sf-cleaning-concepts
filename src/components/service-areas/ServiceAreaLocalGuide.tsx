import React, { useState } from 'react';
import { 
  ArrowRight, 
  Compass, 
  MapPin, 
  Users, 
  Home, 
  Maximize2, 
  TrendingUp, 
  BarChart3 
} from 'lucide-react';
import type { ServiceAreaItem } from '../../data/serviceAreas';

interface ServiceAreaLocalGuideProps {
  area: ServiceAreaItem;
  onRequestConsultation?: () => void;
}

export const ServiceAreaLocalGuide: React.FC<ServiceAreaLocalGuideProps> = ({
  area,
  onRequestConsultation,
}) => {
  const [guideTab, setGuideTab] = useState<'all' | 'landmarks' | 'activities'>('all');

  const localCopy = area.localCopy ?? [];
  const landmarks = area.landmarks ?? [];
  const thingsToDo = area.thingsToDo ?? [];
  const keyCorridors = area.keyCorridors ?? [];
  const topIndustries = area.topIndustries ?? [];

  const showLandmarks = guideTab === 'all' || guideTab === 'landmarks';
  const showActivities = guideTab === 'all' || guideTab === 'activities';

  return (
    <section
      aria-labelledby="local-guide-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#07111a] text-white border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header: Category, Title & Geography Badge */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#4fd18b] font-medium tracking-wide">
            <span>Local Neighborhood Guide</span>
            <span aria-hidden="true">·</span>
            <span>{area.name}, Florida</span>
            {area.stats?.geographyType && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300 font-normal">{area.stats.geographyType}</span>
              </>
            )}
            {area.geo && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-white/60">
                  {Number(area.geo.latitude).toFixed(4)}°N,{' '}
                  {Math.abs(Number(area.geo.longitude)).toFixed(4)}°W
                </span>
              </>
            )}
          </div>

          <h2
            id="local-guide-heading"
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white [text-wrap:balance]"
          >
            Living, Working &amp; Keeping Spaces Spotless in {area.name}
          </h2>
        </div>

        {/* Executive Community Stats Bar (Full-Width Responsive 2x2 to 4-Col Grid) */}
        {area.stats && (
          <div
            data-testid="service-area-stats"
            className="p-5 sm:p-7 rounded-3xl bg-white/[0.04] border border-white/10 space-y-4 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4fd18b] font-semibold">
                <BarChart3 className="w-4 h-4 text-[#4fd18b] shrink-0" />
                <span>Community Snapshot · {area.name}, FL</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Local Community Overview</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Stat 1: Population */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 hover:border-[#4fd18b]/30 transition-colors flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <Users className="w-3.5 h-3.5 text-[#4fd18b] shrink-0" />
                  <span>Population</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {area.stats.population}
                </div>
              </div>

              {/* Stat 2: Households */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 hover:border-[#4fd18b]/30 transition-colors flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <Home className="w-3.5 h-3.5 text-[#4fd18b] shrink-0" />
                  <span>Total Households</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {area.stats.households}
                </div>
              </div>

              {/* Stat 3: Land Area */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 hover:border-[#4fd18b]/30 transition-colors flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <Maximize2 className="w-3.5 h-3.5 text-[#4fd18b] shrink-0" />
                  <span>Land Area</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#4fd18b] font-mono tabular-nums">
                  {area.stats.landArea}
                </div>
              </div>

              {/* Stat 4: Economic Profile */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 hover:border-[#4fd18b]/30 transition-colors flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5 text-[#4fd18b] shrink-0" />
                  <span>Economic Profile</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                  {area.stats.commercialGrowth}
                </div>
              </div>
            </div>

            {area.stats.geographyType && (
              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#4fd18b] shrink-0" />
                  <span className="font-semibold text-slate-300">Geographic Setting:</span>
                  <span>{area.stats.geographyType}</span>
                </div>
                <span className="hidden sm:inline-block font-mono text-[11px] text-slate-400">
                  Kid &amp; Pet Safe Eco-Friendly Supplies Included Across {area.name}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Top Row: Extended Location Copy + Corridors & Top Industries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-[72ch]">
              {localCopy.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Primary Neighborhoods &amp; Enclaves</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span className="text-slate-200">
                  {area.neighborhoods.join(' · ')}
                </span>
              </div>
              {onRequestConsultation && (
                <button
                  type="button"
                  onClick={onRequestConsultation}
                  className="px-4 py-2 rounded-lg bg-[#4fd18b] hover:bg-[#3ec47c] text-[#07111a] text-xs font-bold transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Schedule {area.name} Walkthrough
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Commercial Corridors & Top Local Industries */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 space-y-8">
            <div className="space-y-3">
              <div className="text-xs text-[#4fd18b] font-medium uppercase tracking-wider">
                <span>Neighborhood Routes</span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>Local Daily Coverage</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white [text-wrap:balance]">
                Main {area.name} Roads &amp; Shopping Corridors We Serve
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Whether you live near the water, manage a busy neighborhood office, or host vacation guests, our friendly local crews travel {area.name}’s main roads every day for punctual, reliable visits:
              </p>
              <div className="pt-2 text-xs sm:text-sm text-white font-medium leading-relaxed">
                {keyCorridors.map((corridor, idx) => (
                  <React.Fragment key={corridor}>
                    <span>{corridor}</span>
                    {idx < keyCorridors.length - 1 && (
                      <span aria-hidden="true" className="mx-2 text-[#4fd18b]">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                <span>Local Spaces We Clean</span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>{area.name}, FL</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Homes &amp; Workplaces We Care For in {area.name}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {topIndustries.map((industry, idx) => (
                  <li
                    key={industry}
                    className="flex items-baseline justify-between gap-4 py-1.5 border-b border-white/5 last:border-b-0"
                  >
                    <span className="text-white font-medium">
                      <span className="font-mono tabular-nums text-[#4fd18b] mr-2">
                        0{idx + 1}.
                      </span>
                      {industry}
                    </span>
                    <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                      Spotless &amp; Cared For
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Iconic Landmarks & Things to Do */}
        <div className="space-y-8 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-[#4fd18b] font-medium uppercase tracking-wider">
                <span>Local Landmarks &amp; Lifestyle Guide</span>
                <span aria-hidden="true">·</span>
                <span>{area.name}, FL</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white [text-wrap:balance]">
                Discover {area.name}: Notable Landmarks &amp; Local Attractions
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Authentic cultural destinations, parks, and lifestyle hubs that define {area.name} and shape our daily service routes across the community.
              </p>
            </div>

            {/* Interactive Segmented Filter Control */}
            <div
              role="tablist"
              aria-label={`Filter ${area.name} landmarks and things to do`}
              className="inline-flex items-center gap-1 p-1 bg-white/[0.05] border border-white/15 rounded-xl self-start"
            >
              <button
                type="button"
                role="tab"
                aria-selected={guideTab === 'all'}
                onClick={() => setGuideTab('all')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  guideTab === 'all'
                    ? 'bg-[#4fd18b] text-[#07111a] font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                All Highlights ({landmarks.length + thingsToDo.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={guideTab === 'landmarks'}
                onClick={() => setGuideTab('landmarks')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  guideTab === 'landmarks'
                    ? 'bg-[#4fd18b] text-[#07111a] font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Iconic Landmarks ({landmarks.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={guideTab === 'activities'}
                onClick={() => setGuideTab('activities')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  guideTab === 'activities'
                    ? 'bg-[#4fd18b] text-[#07111a] font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Things to Do ({thingsToDo.length})
              </button>
            </div>
          </div>

          {/* Landmarks Grid */}
          {showLandmarks && landmarks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#4fd18b] shrink-0" />
                  <span>01. Notable Landmarks &amp; Points of Interest in {area.name}</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  {landmarks.length} Locations
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {landmarks.map((landmark) => (
                  <article
                    key={landmark.name}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#4fd18b]/50 transition-colors flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2.5">
                      <div className="text-xs text-[#4fd18b] font-medium">
                        <span>{landmark.category}</span>
                        <span aria-hidden="true" className="mx-1.5">·</span>
                        <span className="text-slate-400">{area.name}</span>
                      </div>
                      <h5 className="text-base font-bold text-white leading-snug">
                        {landmark.name}
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {landmark.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                      <span>Service Area Landmark</span>
                      {onRequestConsultation && (
                        <button
                          type="button"
                          onClick={onRequestConsultation}
                          className="text-[#4fd18b] hover:underline font-medium inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Book Service <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Things to Do Grid */}
          {showActivities && thingsToDo.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#4fd18b] shrink-0" />
                  <span>02. Things to Do, Dining &amp; Local Experiences in {area.name}</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  {thingsToDo.length} Experiences
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {thingsToDo.map((activity) => (
                  <article
                    key={activity.title}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#4fd18b]/50 transition-colors flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2.5">
                      <div className="text-xs text-slate-400 font-medium">
                        <span className="text-[#4fd18b]">Local Experience</span>
                        <span aria-hidden="true" className="mx-1.5">·</span>
                        <span>{activity.spot}</span>
                      </div>
                      <h5 className="text-base font-bold text-white leading-snug">
                        {activity.title}
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {activity.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                      <span className="truncate max-w-[140px]">{activity.spot}</span>
                      {onRequestConsultation && (
                        <button
                          type="button"
                          onClick={onRequestConsultation}
                          className="text-[#4fd18b] hover:underline font-medium inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Walkthrough <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
