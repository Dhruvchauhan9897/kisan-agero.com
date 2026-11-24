import React, { useState, useEffect } from 'react';
import { Bell, Trash2, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import {
  CropDefinition,
  LanguageCode,
  OptionEvaluation,
  RegionalAdvisory,
  UserPriceAlert,
} from '../types/kisan';
import { TranslationStrings } from '../i18n/translations';
import { CROPS, MARKET_BUYERS, REGIONS } from '../data/cropsAndMarkets';
import { ProvenanceTag } from './ProvenanceTag';
import { formatINR } from '../utils/calculations';

interface MarketAlertsPanelProps {
  language: LanguageCode;
  t: TranslationStrings;
  crop: CropDefinition;
  regionId: string;
  bestOption: OptionEvaluation | undefined;
  advisories: RegionalAdvisory[];
  alerts: UserPriceAlert[];
  onAddAlert: (cropId: string, regionId: string, targetNetPerQuintal: number, note: string) => void;
  onRemoveAlert: (id: string) => void;
}

export const MarketAlertsPanel: React.FC<MarketAlertsPanelProps> = ({
  language,
  t,
  crop,
  regionId,
  bestOption,
  advisories,
  alerts,
  onAddAlert,
  onRemoveAlert,
}) => {
  const [alertCropId, setAlertCropId] = useState<string>(crop.id);
  const [alertRegionId, setAlertRegionId] = useState<string>(regionId);
  const [targetPrice, setTargetPrice] = useState<number>(
    bestOption ? bestOption.netPerQuintal + 50 : crop.baseModalPricePerQuintal
  );
  const [channelNote, setChannelNote] = useState<string>('');

  useEffect(() => {
    setAlertCropId(crop.id);
    setAlertRegionId(regionId);
    const selectedCrop = CROPS.find((c) => c.id === crop.id);
    if (selectedCrop) {
      setTargetPrice(selectedCrop.baseModalPricePerQuintal);
    }
  }, [crop.id, regionId]);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice <= 0) return;
    onAddAlert(alertCropId, alertRegionId, targetPrice, channelNote.trim());
    setChannelNote('');
  };

  const relevantAdvisories = advisories.filter(
    (adv) =>
      (adv.regionId === 'all' || adv.regionId === regionId) &&
      (adv.cropId === 'all' || adv.cropId === crop.id)
  );

  // Estimate current sample modal price for any saved crop + region
  const getSampleUpdateForAlert = (cId: string, rId: string) => {
    const c = CROPS.find((item) => item.id === cId);
    if (!c) return null;
    const buyers = MARKET_BUYERS.filter((b) => b.regionId === rId);
    const bestOffset = buyers.reduce(
      (max, b) => Math.max(max, b.cropPriceOffsets[cId] ?? 0),
      0
    );
    return {
      modalPrice: c.baseModalPricePerQuintal + bestOffset,
      buyerCount: buyers.length,
    };
  };

  return (
    <section
      id="alerts-section"
      className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold text-[#142019]">
            {t.alertsTitle}
          </h2>
          <p className="text-xs text-[#4A5951] mt-0.5">{t.alertsSubtitle}</p>
        </div>
        <span className="text-xs text-[#4A5951]">Sample updates · Not guaranteed</span>
      </div>

      {/* Create Crop + Location Alert Form */}
      <form
        onSubmit={handleCreateAlert}
        className="p-4 rounded-xl bg-[#F7F8F5] border border-stone-200 space-y-3"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[#142019]">
          <Bell className="w-4 h-4 text-[#166534]" aria-hidden="true" />
          <span>{t.setAlertHeading}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="alert-crop-select"
              className="block text-xs font-medium text-[#4A5951] mb-1"
            >
              {t.selectCropLabel}
            </label>
            <select
              id="alert-crop-select"
              value={alertCropId}
              onChange={(e) => {
                const nextId = e.target.value;
                setAlertCropId(nextId);
                const c = CROPS.find((x) => x.id === nextId);
                if (c) setTargetPrice(c.baseModalPricePerQuintal);
              }}
              className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-stone-300 bg-white text-sm text-[#142019]"
            >
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.names[language]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="alert-region-select"
              className="block text-xs font-medium text-[#4A5951] mb-1"
            >
              {t.regionLabel}
            </label>
            <select
              id="alert-region-select"
              value={alertRegionId}
              onChange={(e) => setAlertRegionId(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-stone-300 bg-white text-sm text-[#142019]"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.localizedName[language]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label
              htmlFor="alert-target-input"
              className="block text-xs font-medium text-[#4A5951] mb-1"
            >
              {t.targetNetPriceInput}
            </label>
            <input
              id="alert-target-input"
              type="number"
              min={100}
              value={targetPrice}
              onChange={(e) => setTargetPrice(Math.max(0, Number(e.target.value) || 0))}
              className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-stone-300 bg-white text-sm font-mono tabular-nums font-semibold text-[#142019]"
            />
          </div>

          <div>
            <label
              htmlFor="alert-note-input"
              className="block text-xs font-medium text-[#4A5951] mb-1"
            >
              Optional Note (e.g. Dry lot / FPO)
            </label>
            <input
              id="alert-note-input"
              type="text"
              value={channelNote}
              onChange={(e) => setChannelNote(e.target.value)}
              placeholder="e.g. Sehore Mandi or FPO"
              className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-stone-300 bg-white text-sm text-[#142019]"
            />
          </div>

          <button
            type="submit"
            className="min-h-[42px] px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold whitespace-nowrap transition-colors"
          >
            {t.saveAlertBtn}
          </button>
        </div>
      </form>

      {/* Saved User Target Alerts with Live Sample Price Updates */}
      <div className="space-y-2.5">
        <h3 className="font-display text-sm font-semibold text-[#142019]">
          {t.savedAlertsHeading}
        </h3>
        {alerts.length === 0 ? (
          <p className="text-xs text-[#4A5951] py-2">{t.noSavedAlerts}</p>
        ) : (
          <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl">
            {alerts.map((alert) => {
              const alertCrop = CROPS.find((c) => c.id === alert.cropId);
              const alertRegion = REGIONS.find((r) => r.id === alert.regionId);
              const sampleUpdate = getSampleUpdateForAlert(alert.cropId, alert.regionId);
              const matchesCurrent =
                (alert.cropId === crop.id &&
                  alert.regionId === regionId &&
                  bestOption !== undefined &&
                  bestOption.netPerQuintal >= alert.targetNetPerQuintal) ||
                (sampleUpdate !== null && sampleUpdate.modalPrice >= alert.targetNetPerQuintal);

              return (
                <div
                  key={alert.id}
                  className="p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#142019]">
                      <span>{alertCrop?.names[language] ?? alert.cropId}</span>
                      <span className="text-stone-300" aria-hidden="true">
                        ·
                      </span>
                      <span className="font-mono tabular-nums text-[#166534]">
                        Target ≥ {formatINR(alert.targetNetPerQuintal)}/{t.quintalsUnit}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#4A5951]">
                      <span className="truncate">
                        {alertRegion?.localizedName[language] ?? alert.regionId}
                      </span>
                      {sampleUpdate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums text-[#142019]">
                            Current Sample Top Rate: {formatINR(sampleUpdate.modalPrice)}/
                            {t.quintalsUnit}
                          </span>
                        </>
                      )}
                      {alert.channelNote && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{alert.channelNote}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      {matchesCurrent ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#166534]">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          {t.alertTriggeredLabel}
                        </span>
                      ) : (
                        <span className="text-[#4A5951]">{t.alertWatchingLabel}</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveAlert(alert.id)}
                    aria-label="Remove alert"
                    className="min-h-[40px] min-w-[40px] rounded-lg hover:bg-stone-100 flex items-center justify-center text-[#4A5951] shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Regional Advisories */}
      <div className="pt-4 border-t border-stone-200 space-y-3">
        <h3 className="font-display text-sm font-semibold text-[#142019]">
          {t.activeAdvisoriesHeading}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {relevantAdvisories.map((adv) => (
            <div
              key={adv.id}
              className="p-4 rounded-xl border border-stone-200 bg-[#F7F8F5] space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <ProvenanceTag
                  provenance={adv.provenance}
                  t={t}
                  detail={adv.sourceLabel}
                />
                {adv.severity === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0" aria-hidden="true" />
                ) : (
                  <Info className="w-4 h-4 text-[#0F766E] shrink-0" aria-hidden="true" />
                )}
              </div>
              <div className="text-sm font-semibold text-[#142019]">
                {adv.title[language]}
              </div>
              <p className="text-xs text-[#4A5951] leading-relaxed">
                {adv.body[language]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
