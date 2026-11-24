import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  TrendingUp,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  WifiOff,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { LanguageCode, OptionEvaluation, RegionHub } from '../types/kisan';
import { TranslationStrings } from '../i18n/translations';
import { formatINR } from '../utils/calculations';

interface MandiMapViewProps {
  language: LanguageCode;
  t: TranslationStrings;
  region: RegionHub;
  villageLabel: string;
  evaluations: OptionEvaluation[];
  selectedOptionId: string;
  onSelectOption: (optionId: string) => void;
  onOpenBuyerDetails: (optionId: string) => void;
  isOffline: boolean;
}

export const MandiMapView: React.FC<MandiMapViewProps> = ({
  language,
  t,
  region,
  villageLabel,
  evaluations,
  selectedOptionId,
  onSelectOption,
  onOpenBuyerDetails,
  isOffline,
}) => {
  const [zoom, setZoom] = useState<number>(1);

  const selectedBuyer =
    evaluations.find((e) => e.optionId === selectedOptionId) ?? evaluations[0];

  const mappableOptions = evaluations.filter(
    (e) => e.mapDataAvailable && e.lat !== null && e.lng !== null
  );

  // Project lat/lng onto a clean offline SVG canvas centered around farmer/region
  const originLat = region.lat;
  const originLng = region.lng;

  const allLats = [originLat, ...mappableOptions.map((o) => o.lat as number)];
  const allLngs = [originLng, ...mappableOptions.map((o) => o.lng as number)];

  const maxLatDiff = Math.max(0.18, ...allLats.map((lt) => Math.abs(lt - originLat) * 1.25));
  const maxLngDiff = Math.max(0.18, ...allLngs.map((ln) => Math.abs(ln - originLng) * 1.25));
  const span = Math.max(maxLatDiff, maxLngDiff) / zoom;

  const svgW = 600;
  const svgH = 380;
  const cx = svgW / 2;
  const cy = svgH / 2;

  const projectPoint = (lat: number, lng: number) => {
    const x = cx + ((lng - originLng) / span) * (svgW * 0.4);
    const y = cy - ((lat - originLat) / span) * (svgH * 0.4);
    return {
      x: Math.max(36, Math.min(svgW - 36, x)),
      y: Math.max(36, Math.min(svgH - 36, y)),
    };
  };

  const farmerPt = projectPoint(originLat, originLng);

  const estTravelMinutes = selectedBuyer
    ? Math.max(10, Math.round((selectedBuyer.distanceKm / 30) * 60))
    : 0;

  const googleMapsDirectionsUrl =
    selectedBuyer && selectedBuyer.lat !== null && selectedBuyer.lng !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${selectedBuyer.lat},${selectedBuyer.lng}`
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#142019]">
            {t.mandiMapTitle}
          </h1>
          <p className="text-sm text-[#4A5951] mt-1">
            {region.localizedName[language]}
            <span className="mx-2 text-stone-300" aria-hidden="true">
              ·
            </span>
            <span>Sample Map Coordinates</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Offline-Ready Coordinate Map */}
        <section className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-medium text-[#4A5951]">
              Tap any mandi pin to inspect address, distance & directions
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.35).toFixed(2))))}
                className="min-h-[40px] min-w-[40px] rounded-lg border border-stone-200 bg-[#F7F8F5] hover:bg-stone-100 flex items-center justify-center text-[#142019]"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.35).toFixed(2))))}
                className="min-h-[40px] min-w-[40px] rounded-lg border border-stone-200 bg-[#F7F8F5] hover:bg-stone-100 flex items-center justify-center text-[#142019]"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Reset map view"
                onClick={() => setZoom(1)}
                className="min-h-[40px] min-w-[40px] rounded-lg border border-stone-200 bg-[#F7F8F5] hover:bg-stone-100 flex items-center justify-center text-[#142019]"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-[#F4F6F1] overflow-hidden relative">
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="w-full h-auto block"
              role="img"
              aria-label={`Regional mandi map for ${region.name}`}
            >
              {/* Subtle District Grid */}
              <defs>
                <pattern
                  id="km-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#E2E6DC"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width={svgW} height={svgH} fill="url(#km-grid)" />

              {/* Concentric Distance Rings */}
              <circle
                cx={farmerPt.x}
                cy={farmerPt.y}
                r={70}
                fill="none"
                stroke="#CBD5C0"
                strokeDasharray="4 4"
              />
              <circle
                cx={farmerPt.x}
                cy={farmerPt.y}
                r={145}
                fill="none"
                stroke="#CBD5C0"
                strokeDasharray="4 4"
              />

              {/* Route Vector to Selected Mandi */}
              {selectedBuyer &&
                selectedBuyer.mapDataAvailable &&
                selectedBuyer.lat !== null &&
                selectedBuyer.lng !== null && (() => {
                  const target = projectPoint(selectedBuyer.lat, selectedBuyer.lng);
                  return (
                    <line
                      x1={farmerPt.x}
                      y1={farmerPt.y}
                      x2={target.x}
                      y2={target.y}
                      stroke="#166534"
                      strokeWidth={3}
                      strokeDasharray="7 5"
                    />
                  );
                })()}

              {/* Farmer Location Pin */}
              <g transform={`translate(${farmerPt.x}, ${farmerPt.y})`}>
                <circle r={11} fill="#142019" stroke="#FFFFFF" strokeWidth={2.5} />
                <text
                  y={24}
                  textAnchor="middle"
                  className="fill-[#142019] text-[11px] font-semibold"
                >
                  {villageLabel ? villageLabel : `Your Area (${region.district})`}
                </text>
              </g>

              {/* Mandi & Buyer Pins */}
              {mappableOptions.map((opt) => {
                const pt = projectPoint(opt.lat as number, opt.lng as number);
                const isSelected = selectedBuyer?.optionId === opt.optionId;
                return (
                  <g
                    key={opt.optionId}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    onClick={() => onSelectOption(opt.optionId)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${opt.localizedNames[language]}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectOption(opt.optionId);
                      }
                    }}
                  >
                    <circle
                      r={isSelected ? 14 : 10}
                      fill={isSelected ? '#166534' : opt.isBestNet ? '#0F766E' : '#B45309'}
                      stroke="#FFFFFF"
                      strokeWidth={2.5}
                    />
                    <text
                      y={-17}
                      textAnchor="middle"
                      className={`text-[11px] ${
                        isSelected
                          ? 'fill-[#142019] font-bold'
                          : 'fill-[#4A5951] font-medium'
                      }`}
                    >
                      {opt.localizedNames[language].split('(')[0].trim()}
                    </text>
                    <text
                      y={24}
                      textAnchor="middle"
                      className="fill-[#142019] text-[10px] font-mono"
                    >
                      {opt.distanceKm} km · {formatINR(opt.netPerQuintal)}/qtl
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4A5951]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#142019] inline-block" />
                Your Location
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#166534] inline-block" />
                Selected Mandi
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#B45309] inline-block" />
                Other Mandis
              </span>
            </div>
            <span>Works offline · Low-bandwidth SVG map</span>
          </div>
        </section>

        {/* Right Column: Selected Mandi Details + List */}
        <div className="lg:col-span-5 space-y-4">
          {selectedBuyer && (
            <section className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#0F766E]">
                    {selectedBuyer.isPhoneVerified ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.verifiedContactLabel}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" aria-hidden="true" />
                        <span className="text-[#B45309]">{t.unverifiedContactLabel}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-display text-xl font-bold text-[#142019] mt-1">
                    {selectedBuyer.localizedNames[language]}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-[#4A5951]">{t.netProceedsLabel}</div>
                  <div className="font-mono tabular-nums text-lg font-bold text-[#166534]">
                    {formatINR(selectedBuyer.netProceeds)}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-[#142019]">Mandi Address</div>
                    <p className="text-xs text-[#4A5951] leading-relaxed">
                      {selectedBuyer.mandiAddress}
                    </p>
                    {selectedBuyer.lat !== null && selectedBuyer.lng !== null && (
                      <p className="text-[11px] font-mono text-[#4A5951] mt-0.5">
                        GPS: {selectedBuyer.lat.toFixed(4)}° N, {selectedBuyer.lng.toFixed(4)}° E
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Navigation className="w-4 h-4 text-[#4A5951] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-[#142019]">{t.routeSummaryLabel}</div>
                    <p className="text-xs text-[#4A5951]">
                      {selectedBuyer.distanceKm} {t.distanceUnitKm}
                      {selectedBuyer.distanceKm > 0 ? ` (~${estTravelMinutes} min)` : ''} ·{' '}
                      {selectedBuyer.highwayHint}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#4A5951] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#4A5951]">
                    <span className="font-medium text-[#142019]">{t.timingsLabel}: </span>
                    {selectedBuyer.timings}
                  </div>
                </div>

                {selectedBuyer.arrivalQuintalsToday !== null && (
                  <div className="flex items-start gap-2.5">
                    <TrendingUp className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                    <div className="text-xs text-[#4A5951]">
                      <span className="font-medium text-[#142019]">{t.arrivalsLabel}: </span>
                      {selectedBuyer.arrivalQuintalsToday.toLocaleString('en-IN')} {t.quintalsUnit}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions: Get Directions & Contact Buyer */}
              <div className="pt-3 border-t border-stone-200 space-y-2.5">
                {!selectedBuyer.mapDataAvailable ? (
                  <div className="p-3 rounded-xl bg-[#F7F8F5] border border-stone-200 text-xs text-[#4A5951]">
                    {t.mapUnavailableNote}
                  </div>
                ) : isOffline ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                    <WifiOff className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                    <span>
                      You are offline. External turn-by-turn map links require internet, but route
                      summary ({selectedBuyer.highwayHint}) and address are saved above.
                    </span>
                  </div>
                ) : (
                  googleMapsDirectionsUrl && (
                    <a
                      href={googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <Navigation className="w-4 h-4" aria-hidden="true" />
                      <span>{t.getDirectionsBtn}</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )
                )}

                <button
                  type="button"
                  onClick={() => onOpenBuyerDetails(selectedBuyer.optionId)}
                  className="w-full min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-sm font-semibold text-[#142019] inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#166534]" aria-hidden="true" />
                  <span>{t.buyerDetailsBtn}</span>
                </button>
              </div>
            </section>
          )}

          {/* Quick Mandi Switcher */}
          <section className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2">
            <h3 className="font-display text-sm font-bold text-[#142019]">
              All Buyers & Mandis in {region.district}
            </h3>
            <div className="divide-y divide-stone-100">
              {evaluations.map((opt) => {
                const active = selectedBuyer?.optionId === opt.optionId;
                return (
                  <button
                    key={opt.optionId}
                    type="button"
                    onClick={() => onSelectOption(opt.optionId)}
                    className={`w-full min-h-[52px] py-2.5 px-3 rounded-xl text-left flex items-center justify-between gap-2 transition-colors ${
                      active ? 'bg-[#166534]/8 font-semibold' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-sm text-[#142019] truncate">
                        {opt.localizedNames[language]}
                      </div>
                      <div className="text-xs text-[#4A5951]">
                        {opt.distanceKm} {t.distanceUnitKm}
                        <span className="mx-1.5" aria-hidden="true">
                          ·
                        </span>
                        {opt.mapDataAvailable ? 'Map pin available' : 'Farmgate pickup'}
                      </div>
                    </div>
                    <div className="font-mono tabular-nums text-sm font-bold text-[#166534] shrink-0">
                      {formatINR(opt.netPerQuintal)}/{t.quintalsUnit}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
