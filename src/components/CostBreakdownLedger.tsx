import React from 'react';
import { RotateCcw, Info } from 'lucide-react';
import { LanguageCode, OptionEvaluation, TransactionInputs } from '../types/kisan';
import { TranslationStrings } from '../i18n/translations';
import { MARKET_BUYERS } from '../data/cropsAndMarkets';
import { formatINR } from '../utils/calculations';
import { ProvenanceTag } from './ProvenanceTag';

interface CostBreakdownLedgerProps {
  language: LanguageCode;
  t: TranslationStrings;
  evaluations: OptionEvaluation[];
  selectedOptionId: string;
  onSelectOption: (id: string) => void;
  inputs: TransactionInputs;
  onOverrideOption: (
    optionId: string,
    patch: {
      listedPricePerQuintal?: number;
      distanceKm?: number;
      transportCost?: number;
      mandiFeePct?: number;
      commissionPct?: number;
    }
  ) => void;
  onResetOverrides: (optionId: string) => void;
}

export const CostBreakdownLedger: React.FC<CostBreakdownLedgerProps> = ({
  language,
  t,
  evaluations,
  selectedOptionId,
  onSelectOption,
  inputs,
  onOverrideOption,
  onResetOverrides,
}) => {
  const activeOption =
    evaluations.find((o) => o.optionId === selectedOptionId) ?? evaluations[0];

  if (!activeOption) return null;

  const buyerTemplate = MARKET_BUYERS.find((b) => b.id === activeOption.optionId);
  const isCustomBuyer = activeOption.optionId === 'custom_buyer';
  const currentOverride = inputs.customOverrides[activeOption.optionId] ?? {};
  const hasOverrides = Object.keys(currentOverride).length > 0;

  return (
    <section
      id="ledger-section"
      className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-[#142019]">
            {t.ledgerTitle}
          </h2>
          <p className="text-xs text-[#4A5951] mt-0.5">{t.ledgerSubtitle}</p>
        </div>

        {hasOverrides && (
          <button
            type="button"
            onClick={() => onResetOverrides(activeOption.optionId)}
            className="min-h-[38px] px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-xs font-medium text-[#142019] inline-flex items-center gap-1.5 self-start sm:self-center whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.resetOverrides}</span>
          </button>
        )}
      </div>

      {/* Buyer Switcher Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-[#F7F8F5] border border-stone-200 rounded-xl">
        {evaluations.map((opt) => {
          const active = opt.optionId === activeOption.optionId;
          return (
            <button
              key={opt.optionId}
              type="button"
              onClick={() => onSelectOption(opt.optionId)}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors truncate max-w-[220px] ${
                active
                  ? 'bg-white text-[#142019] shadow-xs font-semibold'
                  : 'text-[#4A5951] hover:text-[#142019]'
              }`}
            >
              {opt.localizedNames[language]}
            </button>
          );
        })}
      </div>

      {/* Explicit Formula Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3.5 rounded-xl bg-[#F7F8F5] border border-stone-200 text-xs">
        <div>
          <div className="text-[#4A5951]">Listed × Qty</div>
          <div className="font-mono tabular-nums font-semibold text-[#142019]">
            {formatINR(activeOption.grossRevenue)}
          </div>
        </div>
        <div>
          <div className="text-[#4A5951]">− Transport</div>
          <div className="font-mono tabular-nums font-semibold text-[#142019]">
            -{formatINR(activeOption.transportCostAmount)}
          </div>
        </div>
        <div>
          <div className="text-[#4A5951]">− Commission</div>
          <div className="font-mono tabular-nums font-semibold text-[#142019]">
            -{formatINR(activeOption.commissionAmount)}
          </div>
        </div>
        <div>
          <div className="text-[#4A5951]">− Quality Cuts</div>
          <div className="font-mono tabular-nums font-semibold text-[#B45309]">
            -{formatINR(activeOption.qualityDeductionAmount)}
          </div>
        </div>
        <div>
          <div className="text-[#4A5951]">− Other Costs</div>
          <div className="font-mono tabular-nums font-semibold text-[#142019]">
            -{formatINR(activeOption.otherFeesAmount)}
          </div>
        </div>
      </div>

      {/* Quick Inline Override Controls */}
      {!isCustomBuyer && (
        <div className="p-4 rounded-xl bg-[#F7F8F5] border border-stone-200 space-y-3">
          <div className="text-xs font-medium text-[#4A5951]">{t.overrideHint}</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#4A5951] mb-1">
                {t.listedPriceLabel} (₹/qtl)
              </label>
              <input
                type="number"
                min={100}
                value={
                  currentOverride.listedPricePerQuintal ??
                  activeOption.listedPricePerQuintal
                }
                onChange={(e) =>
                  onOverrideOption(activeOption.optionId, {
                    listedPricePerQuintal: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full min-h-[38px] px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-sm font-mono tabular-nums text-[#142019]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#4A5951] mb-1">
                {t.transportCost} (₹ total)
              </label>
              <input
                type="number"
                min={0}
                value={
                  currentOverride.transportCost ?? activeOption.transportCostAmount
                }
                onChange={(e) =>
                  onOverrideOption(activeOption.optionId, {
                    transportCost: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full min-h-[38px] px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-sm font-mono tabular-nums text-[#142019]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#4A5951] mb-1">
                {t.mandiFeeLine} (%)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.25}
                value={currentOverride.mandiFeePct ?? buyerTemplate?.mandiFeePct ?? 0}
                onChange={(e) =>
                  onOverrideOption(activeOption.optionId, {
                    mandiFeePct: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full min-h-[38px] px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-sm font-mono tabular-nums text-[#142019]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#4A5951] mb-1">
                {t.commissionLine} (%)
              </label>
              <input
                type="number"
                min={0}
                max={12}
                step={0.25}
                value={currentOverride.commissionPct ?? buyerTemplate?.commissionPct ?? 0}
                onChange={(e) =>
                  onOverrideOption(activeOption.optionId, {
                    commissionPct: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full min-h-[38px] px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-sm font-mono tabular-nums text-[#142019]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Line-by-line Transparent Rupee Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-xs text-[#4A5951]">
              <th className="py-2.5 pr-3 font-medium">Item & Formula</th>
              <th className="py-2.5 px-3 font-medium">Source</th>
              <th className="py-2.5 pl-3 font-medium text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm">
            {activeOption.lineItems.map((item) => {
              const translatedLabel =
                item.customLabel ?? (t[item.labelKey as keyof TranslationStrings] as string);
              const isPositive = item.amount >= 0;
              return (
                <tr key={item.id} className="hover:bg-stone-50/70">
                  <td className="py-3 pr-3">
                    <div className="font-medium text-[#142019]">
                      {translatedLabel}
                    </div>
                    <div className="text-xs text-[#4A5951] font-mono tabular-nums">
                      {item.formulaText}
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <ProvenanceTag provenance={item.provenance} t={t} />
                  </td>
                  <td
                    className={`py-3 pl-3 text-right font-mono tabular-nums font-semibold whitespace-nowrap ${
                      item.category === 'gross'
                        ? 'text-[#142019]'
                        : isPositive
                        ? 'text-[#166534]'
                        : 'text-[#B45309]'
                    }`}
                  >
                    {isPositive && item.category !== 'gross' ? '+' : ''}
                    {formatINR(item.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-stone-300">
              <td className="py-3.5 pr-3 font-display font-bold text-[#142019]">
                {t.netProceedsLabel}
                <div className="text-xs font-normal text-[#4A5951] font-mono tabular-nums">
                  {formatINR(activeOption.netPerQuintal)} / {t.quintalsUnit}
                </div>
              </td>
              <td className="py-3.5 px-3 text-xs text-[#4A5951]">
                -{activeOption.effectiveDeductionPct}% total costs
              </td>
              <td className="py-3.5 pl-3 text-right font-mono tabular-nums text-lg font-bold text-[#166534]">
                {formatINR(activeOption.netProceeds)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Transparency, Source, Timestamp & Assumptions */}
      <div className="p-3.5 rounded-xl bg-[#F7F8F5] border border-stone-200 text-xs text-[#4A5951] space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-[#142019]">
          <Info className="w-4 h-4 text-[#0F766E] shrink-0" aria-hidden="true" />
          <span>{t.assumptionsTitle}</span>
        </div>
        <p className="leading-relaxed">
          <span className="font-medium text-[#142019]">Source & Updated:</span>{' '}
          {activeOption.priceSourceLabel} · {activeOption.updatedAtLabel}
        </p>
        <p className="leading-relaxed">{activeOption.assumptionsSummary}</p>
        <p className="font-medium text-[#B45309]">{t.notGuaranteedNote}</p>
      </div>
    </section>
  );
};
