import React, { useState, useMemo } from 'react';
import {
  Mic,
  Plus,
  Minus,
  Truck,
  MapPin,
  Sprout,
  ChevronDown,
  ChevronUp,
  Search,
  LocateFixed,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  CropDefinition,
  CropGrade,
  CustomBuyerInput,
  LanguageCode,
  LocationPermissionState,
  QuantityUnit,
  TransactionInputs,
  VehicleType,
} from '../types/kisan';
import { CROPS, MARKET_BUYERS, REGIONS, VEHICLE_PRESETS } from '../data/cropsAndMarkets';
import { TranslationStrings } from '../i18n/translations';
import { ProvenanceTag } from './ProvenanceTag';

interface StepFlowBuilderProps {
  language: LanguageCode;
  t: TranslationStrings;
  inputs: TransactionInputs;
  crop: CropDefinition;
  customBuyer: CustomBuyerInput;
  locationPermission: LocationPermissionState;
  locationStatusNote: string | null;
  onRequestGpsLocation: () => void;
  onUpdateInputs: (patch: Partial<TransactionInputs>) => void;
  onSelectCrop: (cropId: string) => void;
  onSelectVehicle: (vehicleId: VehicleType) => void;
  onUpdateCustomBuyer: (patch: Partial<CustomBuyerInput>) => void;
  onOpenVoiceModal: () => void;
  onTriggerCompare: () => void;
}

export const StepFlowBuilder: React.FC<StepFlowBuilderProps> = ({
  language,
  t,
  inputs,
  crop,
  customBuyer,
  locationPermission,
  locationStatusNote,
  onRequestGpsLocation,
  onUpdateInputs,
  onSelectCrop,
  onSelectVehicle,
  onUpdateCustomBuyer,
  onOpenVoiceModal,
  onTriggerCompare,
}) => {
  const [showCustomBuyer, setShowCustomBuyer] = useState(customBuyer.enabled);
  const [locationQuery, setLocationQuery] = useState('');
  const quickQuantities = [10, 25, 35, 50, 100];

  const isMoistureAboveFaq = inputs.moisturePct > crop.faqMoistureMaxPct;
  const isFmAboveFaq = inputs.foreignMatterPct > crop.faqForeignMatterMaxPct;

  // Convert internal quintals to selected displayUnit
  const unitFactor =
    inputs.displayUnit === 'kg' ? 100 : inputs.displayUnit === 'tonnes' ? 0.1 : 1;
  const displayQtyValue = Number((inputs.quantityQuintals * unitFactor).toFixed(2));

  const handleQtyChange = (rawDisplayVal: number) => {
    const clean = Math.max(0.1, rawDisplayVal);
    const inQuintals =
      inputs.displayUnit === 'kg'
        ? Math.max(1, Math.round(clean / 100))
        : inputs.displayUnit === 'tonnes'
        ? Math.max(1, Math.round(clean * 10))
        : Math.max(1, Math.round(clean));
    onUpdateInputs({ quantityQuintals: inQuintals });
  };

  // Location search across regions & mandis
  const locationMatches = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (!q) return [];
    return REGIONS.filter((reg) => {
      const regHit =
        reg.name.toLowerCase().includes(q) ||
        reg.district.toLowerCase().includes(q) ||
        reg.state.toLowerCase().includes(q) ||
        reg.localizedName[language].toLowerCase().includes(q);
      const buyerHit = MARKET_BUYERS.some(
        (b) =>
          b.regionId === reg.id &&
          (b.name.toLowerCase().includes(q) ||
            b.localizedNames[language].toLowerCase().includes(q))
      );
      return regHit || buyerHit;
    });
  }, [locationQuery, language]);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 space-y-6">
      {/* Optional Multilingual Voice Shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-display text-lg font-bold text-[#142019]">
            {t.step1Title}
          </h2>
          <p className="text-xs text-[#4A5951] mt-0.5">{crop.seasonNote[language]}</p>
        </div>
        <button
          type="button"
          onClick={onOpenVoiceModal}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors"
        >
          <Mic className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t.voicePromptButton}</span>
        </button>
      </div>

      {/* STEP 1: CROP & QUANTITY */}
      <div className="space-y-4">
        <div>
          <span className="block text-sm font-semibold text-[#142019] mb-2">
            {t.selectCropLabel}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CROPS.map((c) => {
              const active = c.id === inputs.cropId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectCrop(c.id)}
                  className={`min-h-[46px] px-3 py-2 rounded-xl border text-left transition-colors ${
                    active
                      ? 'border-[#166534] bg-[#166534]/10 text-[#142019] font-semibold'
                      : 'border-stone-200 bg-[#F7F8F5] hover:bg-stone-100 text-[#4A5951]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-sm truncate">
                    <Sprout
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-[#166534]' : 'text-stone-400'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{c.names[language]}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#4A5951]">
            <span>{crop.varietyHint[language]}</span>
            {crop.mspPerQuintal !== null ? (
              <span className="tabular-nums font-medium text-[#0F766E]">
                {t.mspBenchmarkLabel}: ₹{crop.mspPerQuintal.toLocaleString('en-IN')}/
                {t.quintalsUnit}
              </span>
            ) : (
              <span>{t.noMspLabel}</span>
            )}
          </div>
        </div>

        {/* Quantity Input + Clear Units Selector */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="quantity-input"
              className="text-sm font-semibold text-[#142019]"
            >
              {t.quantityLabel}
            </label>
            <div
              className="inline-flex items-center p-0.5 bg-[#F7F8F5] border border-stone-200 rounded-lg"
              role="group"
              aria-label="Quantity unit"
            >
              {(
                [
                  { id: 'qtl', label: 'Quintal (100 kg)' },
                  { id: 'kg', label: 'kg' },
                  { id: 'tonnes', label: 'Tonnes' },
                ] as { id: QuantityUnit; label: string }[]
              ).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => onUpdateInputs({ displayUnit: u.id })}
                  className={`min-h-[34px] px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    inputs.displayUnit === u.id
                      ? 'bg-white text-[#142019] shadow-xs font-semibold'
                      : 'text-[#4A5951] hover:text-[#142019]'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() =>
                onUpdateInputs({
                  quantityQuintals: Math.max(1, inputs.quantityQuintals - 5),
                })
              }
              className="min-h-[48px] min-w-[48px] rounded-xl border border-stone-300 bg-white hover:bg-stone-50 flex items-center justify-center text-[#142019]"
            >
              <Minus className="w-5 h-5" />
            </button>
            <input
              id="quantity-input"
              type="number"
              min={1}
              max={200000}
              step={inputs.displayUnit === 'tonnes' ? 0.5 : 1}
              value={displayQtyValue}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (!Number.isNaN(val)) {
                  handleQtyChange(val);
                }
              }}
              className="w-full min-h-[48px] px-3 py-2 rounded-xl border border-stone-300 bg-white text-lg font-mono tabular-nums font-bold text-[#142019] text-center"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() =>
                onUpdateInputs({ quantityQuintals: inputs.quantityQuintals + 5 })
              }
              className="min-h-[48px] min-w-[48px] rounded-xl border border-stone-300 bg-white hover:bg-stone-50 flex items-center justify-center text-[#142019]"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4A5951]">
            <div className="flex flex-wrap gap-1.5">
              {quickQuantities.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onUpdateInputs({ quantityQuintals: q })}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-mono tabular-nums transition-colors ${
                    inputs.quantityQuintals === q
                      ? 'bg-[#142019] text-white font-semibold'
                      : 'bg-[#F7F8F5] text-[#4A5951] hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {q} {t.quintalsUnit}
                </button>
              ))}
            </div>
            <span className="font-mono tabular-nums">
              = {inputs.quantityQuintals} qtl · {(inputs.quantityQuintals * 100).toLocaleString('en-IN')} kg
            </span>
          </div>
        </div>
      </div>

      {/* STEP 2: LOCATION & QUALITY */}
      <div className="pt-5 border-t border-stone-200 space-y-4">
        <h2 className="font-display text-lg font-bold text-[#142019]">
          {t.step2Title}
        </h2>

        {/* Location Search + GPS Current-Location Option */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-[#4A5951] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                aria-label="Search location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder={t.searchLocationPlaceholder}
                className="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-xl border border-stone-300 bg-white text-sm text-[#142019] placeholder:text-stone-400"
              />
            </div>

            <button
              type="button"
              onClick={onRequestGpsLocation}
              disabled={locationPermission === 'requesting'}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 bg-[#F7F8F5] hover:bg-stone-100 disabled:opacity-60 text-sm font-semibold text-[#142019] inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors"
            >
              {locationPermission === 'requesting' ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#166534]" />
              ) : (
                <LocateFixed className="w-4 h-4 text-[#166534]" />
              )}
              <span>
                {locationPermission === 'requesting'
                  ? t.locationRequesting
                  : t.useCurrentLocation}
              </span>
            </button>
          </div>

          {/* Search Suggestions */}
          {locationQuery.trim().length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-[#F7F8F5] divide-y divide-stone-200">
              {locationMatches.length === 0 ? (
                <div className="p-3 text-xs text-[#4A5951]">
                  No market belt matched "{locationQuery}". Choose the nearest belt below.
                </div>
              ) : (
                locationMatches.map((reg) => (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => {
                      onUpdateInputs({ regionId: reg.id });
                      setLocationQuery('');
                    }}
                    className="w-full min-h-[44px] px-3.5 py-2 text-left text-sm text-[#142019] hover:bg-stone-100 flex items-center justify-between gap-2"
                  >
                    <span className="font-medium">{reg.localizedName[language]}</span>
                    <span className="text-xs text-[#166534] font-semibold">Select</span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Location Permission Feedback States */}
          {locationPermission === 'denied' && (
            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-950 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
              <span>{t.locationDeniedMsg}</span>
            </div>
          )}
          {locationPermission === 'unavailable' && (
            <div className="p-3 rounded-xl border border-stone-200 bg-[#F7F8F5] text-xs text-[#4A5951] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
              <span>
                {locationStatusNote ||
                  'GPS location is unavailable on this device. Please select your nearest market belt below.'}
              </span>
            </div>
          )}
          {locationPermission === 'granted' && locationStatusNote && (
            <div className="p-3 rounded-xl border border-[#166534]/30 bg-[#166534]/5 text-xs text-[#142019] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
              <span>{locationStatusNote}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label
              htmlFor="region-select"
              className="block text-sm font-medium text-[#142019] mb-1.5"
            >
              {t.regionLabel}
            </label>
            <div className="relative">
              <MapPin
                className="w-4 h-4 text-[#166534] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="region-select"
                value={inputs.regionId}
                onChange={(e) => onUpdateInputs({ regionId: e.target.value })}
                className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-stone-300 bg-white text-sm font-medium text-[#142019]"
              >
                {REGIONS.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.localizedName[language]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="village-input"
              className="block text-xs font-medium text-[#4A5951] mb-1"
            >
              {t.villageLabel}
            </label>
            <input
              id="village-input"
              type="text"
              value={inputs.customVillageLabel}
              onChange={(e) =>
                onUpdateInputs({ customVillageLabel: e.target.value })
              }
              placeholder={t.villagePlaceholder}
              className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-stone-300 bg-white text-sm text-[#142019] placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Simple Crop-Grade Choices */}
        <div>
          <span className="block text-sm font-semibold text-[#142019] mb-2">
            {t.gradeLabel}
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['A', 'FAQ', 'B'] as CropGrade[]).map((grade) => {
              const active = inputs.grade === grade;
              const label =
                grade === 'A'
                  ? t.gradeA
                  : grade === 'FAQ'
                  ? t.gradeFAQ
                  : t.gradeB;
              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() => onUpdateInputs({ grade })}
                  className={`min-h-[48px] px-2.5 py-2 rounded-xl border text-xs font-medium transition-colors text-center ${
                    active
                      ? 'border-[#166534] bg-[#166534]/10 text-[#142019] font-semibold'
                      : 'border-stone-200 bg-[#F7F8F5] text-[#4A5951] hover:bg-stone-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Moisture % */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="moisture-range"
              className="text-sm font-medium text-[#142019]"
            >
              {t.moistureLabel}
            </label>
            <span className="font-mono tabular-nums text-sm font-semibold text-[#142019]">
              {inputs.moisturePct.toFixed(1)}%
            </span>
          </div>
          <input
            id="moisture-range"
            type="range"
            min={6}
            max={25}
            step={0.5}
            value={inputs.moisturePct}
            onChange={(e) =>
              onUpdateInputs({ moisturePct: Number(e.target.value) })
            }
            className="w-full accent-[#166534] h-2 cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-[#4A5951] tabular-nums">
              {t.faqLimitText}: {crop.faqMoistureMaxPct}%
            </span>
            <span
              className={`font-medium ${
                isMoistureAboveFaq ? 'text-[#B45309]' : 'text-[#0F766E]'
              }`}
            >
              {isMoistureAboveFaq ? t.aboveFaqCutApplies : t.withinFaq}
            </span>
          </div>
        </div>

        {/* Foreign Matter % */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="fm-range"
              className="text-sm font-medium text-[#142019]"
            >
              {t.foreignMatterLabel}
            </label>
            <span className="font-mono tabular-nums text-sm font-semibold text-[#142019]">
              {inputs.foreignMatterPct.toFixed(1)}%
            </span>
          </div>
          <input
            id="fm-range"
            type="range"
            min={0}
            max={6}
            step={0.5}
            value={inputs.foreignMatterPct}
            onChange={(e) =>
              onUpdateInputs({ foreignMatterPct: Number(e.target.value) })
            }
            className="w-full accent-[#166534] h-2 cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-[#4A5951] tabular-nums">
              {t.faqLimitText}: {crop.faqForeignMatterMaxPct}%
            </span>
            <span
              className={`font-medium ${
                isFmAboveFaq ? 'text-[#B45309]' : 'text-[#0F766E]'
              }`}
            >
              {isFmAboveFaq ? t.aboveFaqCutApplies : t.withinFaq}
            </span>
          </div>
        </div>
      </div>

      {/* STEP 3: TRANSPORT & FEES */}
      <div className="pt-5 border-t border-stone-200 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-[#142019]">
            {t.step3Title}
          </h2>
          <ProvenanceTag provenance="estimate" t={t} />
        </div>

        <div>
          <label
            htmlFor="vehicle-select"
            className="block text-sm font-medium text-[#142019] mb-1.5"
          >
            {t.vehicleLabel}
          </label>
          <div className="relative">
            <Truck
              className="w-4 h-4 text-[#4A5951] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <select
              id="vehicle-select"
              value={inputs.vehicleType}
              onChange={(e) => onSelectVehicle(e.target.value as VehicleType)}
              className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-stone-300 bg-white text-sm text-[#142019]"
            >
              {VEHICLE_PRESETS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.names[language]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {inputs.vehicleType !== 'buyer_pickup' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F7F8F5] border border-stone-200 rounded-xl">
              <button
                type="button"
                onClick={() => onUpdateInputs({ transportMode: 'auto_distance' })}
                className={`min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  inputs.transportMode === 'auto_distance'
                    ? 'bg-white text-[#142019] shadow-xs font-semibold'
                    : 'text-[#4A5951] hover:text-[#142019]'
                }`}
              >
                {t.transportModeAuto}
              </button>
              <button
                type="button"
                onClick={() => onUpdateInputs({ transportMode: 'manual_total' })}
                className={`min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  inputs.transportMode === 'manual_total'
                    ? 'bg-white text-[#142019] shadow-xs font-semibold'
                    : 'text-[#4A5951] hover:text-[#142019]'
                }`}
              >
                {t.transportModeManual}
              </button>
            </div>

            {inputs.transportMode === 'auto_distance' ? (
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="rate-per-km"
                  className="text-xs font-medium text-[#4A5951]"
                >
                  {t.ratePerKmLabel}
                </label>
                <input
                  id="rate-per-km"
                  type="number"
                  min={0}
                  max={300}
                  value={inputs.transportRatePerKmPerTrip}
                  onChange={(e) =>
                    onUpdateInputs({
                      transportRatePerKmPerTrip: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-28 min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-mono tabular-nums text-right text-[#142019]"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="manual-freight"
                  className="text-xs font-medium text-[#4A5951]"
                >
                  {t.manualTransportLabel} (20 km base)
                </label>
                <input
                  id="manual-freight"
                  type="number"
                  min={0}
                  max={100000}
                  value={inputs.manualTransportTotal}
                  onChange={(e) =>
                    onUpdateInputs({
                      manualTransportTotal: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-32 min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-mono tabular-nums text-right text-[#142019]"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* STEP 4: ADD CUSTOM LOCAL BUYER QUOTE */}
      <div className="pt-5 border-t border-stone-200">
        <button
          type="button"
          onClick={() => {
            const next = !showCustomBuyer;
            setShowCustomBuyer(next);
            onUpdateCustomBuyer({ enabled: next });
          }}
          className="w-full min-h-[44px] flex items-center justify-between text-left text-sm font-semibold text-[#142019]"
        >
          <span>{t.step4Title}</span>
          {showCustomBuyer ? (
            <ChevronUp className="w-4 h-4 text-[#4A5951]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4A5951]" />
          )}
        </button>

        {showCustomBuyer && (
          <div className="mt-3 space-y-3 pt-3 border-t border-stone-100">
            <div>
              <label className="block text-xs font-medium text-[#4A5951] mb-1">
                {t.customBuyerName}
              </label>
              <input
                type="text"
                value={customBuyer.name}
                onChange={(e) => onUpdateCustomBuyer({ name: e.target.value })}
                className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 text-sm text-[#142019]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4A5951] mb-1">
                  {t.customBuyerPrice}
                </label>
                <input
                  type="number"
                  min={100}
                  value={customBuyer.listedPricePerQuintal}
                  onChange={(e) =>
                    onUpdateCustomBuyer({
                      listedPricePerQuintal: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-mono tabular-nums text-[#142019]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4A5951] mb-1">
                  {t.customBuyerDistance}
                </label>
                <input
                  type="number"
                  min={0}
                  value={customBuyer.distanceKm}
                  onChange={(e) =>
                    onUpdateCustomBuyer({
                      distanceKm: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-mono tabular-nums text-[#142019]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4A5951] mb-1">
                  {t.customBuyerCommission}
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  step={0.5}
                  value={customBuyer.commissionPct}
                  onChange={(e) =>
                    onUpdateCustomBuyer({
                      commissionPct: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-mono tabular-nums text-[#142019]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4A5951] mb-1">
                  {t.customBuyerCut}
                </label>
                <input
                  type="number"
                  min={0}
                  max={25}
                  step={0.5}
                  value={customBuyer.qualityDeductionPct}
                  onChange={(e) =>
                    onUpdateCustomBuyer({
                      qualityDeductionPct: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-mono tabular-nums text-[#142019]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action CTA for Mobile & Quick Comparison */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onTriggerCompare}
          className="w-full min-h-[50px] px-5 py-3 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-base font-semibold inline-flex items-center justify-center gap-2 transition-colors"
        >
          <span>{t.homeCtaCompare}</span>
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
