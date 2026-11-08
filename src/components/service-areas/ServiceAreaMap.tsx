import React from 'react';
import { MapPin, Compass, ExternalLink } from 'lucide-react';
import type { ServiceAreaItem } from '../../data/serviceAreas';

export interface ServiceAreaMapProps {
  area: ServiceAreaItem;
  className?: string;
  zoom?: number;
  height?: number | string;
  showDetails?: boolean;
}

export const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({
  area,
  className = '',
  zoom = 12,
  height,
  showDetails = true,
}) => {
  // Construct zero-API-key Google Maps embed URL
  const encodedLocation = encodeURIComponent(`${area.name}, FL`);
  const embedUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  const externalMapUrl = `https://maps.google.com/?q=${encodedLocation}`;

  // Format GPS coordinates if available
  const formattedCoords = area.geo
    ? `${Number(area.geo.latitude).toFixed(4)}° N, ${Math.abs(Number(area.geo.longitude)).toFixed(4)}° W`
    : null;

  return (
    <div
      className={`rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg flex flex-col ${className}`}
      data-testid="service-area-map"
      aria-label={`Interactive map of ${area.name}, Florida service area`}
    >
      {/* Top Header Bar */}
      {showDetails && (
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#12582e]/10 flex items-center justify-center text-[#12582e] shrink-0">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold text-[#07111a] block sm:inline">
                {area.name}, Florida
              </span>
              <span className="hidden sm:inline text-slate-400 mx-1.5">·</span>
              <span className="text-[11px] text-slate-500">Service Area Coverage</span>
            </div>
          </div>

          {formattedCoords && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200/90 text-[11px] font-mono text-slate-600 shadow-2xs"
              title={`GPS Coordinates for ${area.name}, FL`}
              aria-label={`GPS Coordinates: ${formattedCoords}`}
            >
              <Compass className="w-3.5 h-3.5 text-[#12582e]" />
              <span>{formattedCoords}</span>
            </span>
          )}
        </div>
      )}

      {/* Map Iframe Container */}
      <div
        className="relative w-full overflow-hidden bg-slate-100"
        style={height ? { height: typeof height === 'number' ? `${height}px` : height } : undefined}
      >
        <div className={height ? 'w-full h-full' : 'relative w-full aspect-[4/3] sm:aspect-video md:h-[340px]'}>
          <iframe
            title={`Interactive Google Map showing service area for ${area.name}, Florida`}
            aria-label={`Google Maps view of ${area.name}, FL`}
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Bottom Action & Dispatch Bar */}
      {showDetails && (
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 text-[11px] sm:text-xs">
            <span>Fast commercial &amp; residential cleaning dispatch across </span>
            <strong className="text-[#07111a]">{area.name}</strong>
          </div>

          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#12582e] hover:text-[#0b1926] border border-emerald-200 text-xs font-semibold transition-colors shadow-2xs"
            aria-label={`Open ${area.name}, FL in Google Maps (opens in new tab)`}
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>
      )}
    </div>
  );
};
