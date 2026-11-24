import React from 'react';
import {
  ArrowRight,
  Clock,
  MapPin,
  Mic,
  Sprout,
  TrendingUp,
  Info,
  Map as MapIcon,
} from 'lucide-react';
import {
  CropDefinition,
  LanguageCode,
  OptionEvaluation,
  RecentSearchItem,
  RegionHub,
} from '../types/kisan';
import { TranslationStrings } from '../i18n/translations';
import { CROPS, REGIONS } from '../data/cropsAndMarkets';
import { formatINR } from '../utils/calculations';

interface HomeScreenProps {
  language: LanguageCode;
  t: TranslationStrings;
  selectedCropId: string;
  selectedRegion: RegionHub;
  evaluations: OptionEvaluation[];
  recentSearches: RecentSearchItem[];
  onSelectCropAndCompare: (cropId: string) => void;
  onStartCompare: () => void;
  onOpenVoiceModal: () => void;
  onLoadRecentSearch: (item: RecentSearchItem) => void;
  onOpenMap: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  t,
  selectedCropId,
  selectedRegion,
  evaluations,
  recentSearches,
  onSelectCropAndCompare,
  onStartCompare,
  onOpenVoiceModal,
  onLoadRecentSearch,
  onOpenMap,
}) => {
  const activeCrop: CropDefinition =
    CROPS.find((c) => c.id === selectedCropId) ?? CROPS[0];
  const topOption = evaluations[0];

  return (
    <div className="space-y-6">
      {/* Sample Data Clarity Banner */}
      <div className="px-4 py-3 rounded-xl border border-stone-200 bg-white flex items-start gap-2.5 text-xs sm:text-sm text-[#4A5951]">
        <Info className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" aria-hidden="true" />
        <span>{t.sampleDataNotice}</span>
      </div>

      {/* Hero Primary Entry Card */}
      <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-medium text-[#0F766E]">
            {selectedRegion.localizedName[language]}
            <span className="mx-2 text-stone-300" aria-hidden="true">
              ·
            </span>
            <span>Sample Market Data</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#142019] tracking-tight text-balance">
            {t.heroTitle}
          </h1>

          <p className="text-base text-[#4A5951] leading-relaxed max-w-2xl">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onStartCompare}
              className="min-h-[52px] px-6 py-3 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-base font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
            >
              <span>{t.homeCtaCompare}</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onOpenVoiceModal}
              className="min-h-[52px] px-5 py-3 rounded-xl border border-stone-300 bg-[#F7F8F5] hover:bg-stone-100 text-[#142019] text-base font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
            >
              <Mic className="w-5 h-5 text-[#166534]" aria-hidden="true" />
              <span>{t.voicePromptButton}</span>
            </button>
          </div>
        </div>

        {/* Local Market Snapshot Card */}
        <div className="lg:col-span-5 bg-[#F7F8F5] border border-stone-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold text-[#142019]">
              {t.localSnapshotTitle}
            </h2>
            <span className="text-xs font-medium text-[#4A5951]">Sample Data</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-stone-200">
              <div>
                <div className="text-xs text-[#4A5951]">{activeCrop.names[language]}</div>
                <div className="font-display text-lg font-bold text-[#142019]">
                  {selectedRegion.district} Mandi Modal
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono tabular-nums text-xl font-bold text-[#166534]">
                  {formatINR(activeCrop.baseModalPricePerQuintal)}/{t.quintalsUnit}
                </div>
                <div className="text-xs text-[#4A5951]">
                  {activeCrop.mspPerQuintal !== null
                    ? `MSP: ${formatINR(activeCrop.mspPerQuintal)}`
                    : t.noMspLabel}
                </div>
              </div>
            </div>

            {topOption && (
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between text-xs text-[#4A5951]">
                  <span>Best Net Example (35 qtl)</span>
                  <span>{topOption.updatedAtLabel}</span>
                </div>
                <div className="flex items-center justify-between font-medium text-[#142019]">
                  <span className="truncate pr-2">{topOption.localizedNames[language]}</span>
                  <span className="font-mono tabular-nums font-bold text-[#166534] shrink-0">
                    {formatINR(topOption.netProceeds)}
                  </span>
                </div>
                <p className="text-xs text-[#4A5951]">{t.notGuaranteedNote}</p>
              </div>
            )}

            <button
              type="button"
              onClick={onOpenMap}
              className="w-full min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-sm font-semibold text-[#142019] inline-flex items-center justify-center gap-2 transition-colors"
            >
              <MapIcon className="w-4 h-4 text-[#166534]" aria-hidden="true" />
              <span>{t.mandiMapTitle}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Crop Selection Grid */}
      <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-[#142019]">
              {t.selectCropLabel}
            </h2>
            <p className="text-sm text-[#4A5951]">
              Tap any crop to check nearby mandi rates, costs, and estimated net proceeds
            </p>
          </div>
          <span className="text-xs text-[#4A5951]">Sample benchmarks · ₹/quintal</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CROPS.map((crop) => {
            const isSelected = crop.id === selectedCropId;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => onSelectCropAndCompare(crop.id)}
                className={`min-h-[76px] p-4 rounded-xl border text-left transition-colors flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-[#166534] bg-[#166534]/8 text-[#142019]'
                    : 'border-stone-200 bg-[#F7F8F5] hover:bg-stone-100 text-[#142019]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-base font-bold truncate">
                    {crop.names[language]}
                  </span>
                  <Sprout
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-[#166534]' : 'text-[#4A5951]'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[#4A5951]">
                  <span className="font-mono tabular-nums font-semibold text-[#142019]">
                    {formatINR(crop.baseModalPricePerQuintal)}/{t.quintalsUnit}
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent Searches */}
      <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-[#142019]">
            {t.recentSearchesTitle}
          </h2>
          <span className="text-xs text-[#4A5951]">Tap to open comparison</span>
        </div>

        {recentSearches.length === 0 ? (
          <p className="text-sm text-[#4A5951]">
            No recent searches yet. Select a crop above to run your first comparison.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentSearches.map((item) => {
              const c = CROPS.find((cr) => cr.id === item.cropId);
              const r = REGIONS.find((rg) => rg.id === item.regionId);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onLoadRecentSearch(item)}
                  className="min-h-[84px] p-4 rounded-xl border border-stone-200 bg-[#F7F8F5] hover:bg-stone-100 text-left transition-colors flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-base font-bold text-[#142019] truncate">
                      {c?.names[language] ?? item.cropId} · {item.quantityQuintals} {t.quintalsUnit}
                    </span>
                    <span className="font-mono tabular-nums text-sm font-bold text-[#166534] shrink-0">
                      {formatINR(item.topNetProceeds)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#4A5951]">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#166534]" aria-hidden="true" />
                      {item.villageLabel || r?.district || item.regionId}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Grade {item.grade}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {item.searchedAtLabel}
                      {item.isSample ? ' (Sample)' : ''}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
