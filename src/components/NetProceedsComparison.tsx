import React, { useState, useMemo } from 'react';
import {
  Award,
  ArrowRight,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Search,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { LanguageCode, OptionEvaluation } from '../types/kisan';
import { TranslationStrings } from '../i18n/translations';
import { formatINR } from '../utils/calculations';
import { ProvenanceTag } from './ProvenanceTag';

type BuyerFilter = 'all' | 'nearby' | 'verified' | 'zero_comm';

interface NetProceedsComparisonProps {
  language: LanguageCode;
  t: TranslationStrings;
  evaluations: OptionEvaluation[];
  quantityQuintals: number;
  selectedOptionId: string;
  isLoading: boolean;
  errorMsg: string | null;
  onRetry: () => void;
  onSelectOption: (optionId: string) => void;
  onInspectLedger: (optionId: string) => void;
  onOpenBuyerDetails: (optionId: string) => void;
  onOpenMandiMap: (optionId: string) => void;
  externalFilterOverride?: BuyerFilter | null;
  onClearExternalFilter?: () => void;
}

export const NetProceedsComparison: React.FC<NetProceedsComparisonProps> = ({
  language,
  t,
  evaluations,
  quantityQuintals,
  selectedOptionId,
  isLoading,
  errorMsg,
  onRetry,
  onSelectOption,
  onInspectLedger,
  onOpenBuyerDetails,
  onOpenMandiMap,
  externalFilterOverride,
  onClearExternalFilter,
}) => {
  const [filterMode, setFilterMode] = useState<BuyerFilter>('all');
  const [searchBuyer, setSearchBuyer] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const activeFilter = externalFilterOverride ?? filterMode;

  const filteredEvaluations = useMemo(() => {
    const q = searchBuyer.trim().toLowerCase();
    return evaluations.filter((opt) => {
      if (q) {
        const nameHit =
          opt.name.toLowerCase().includes(q) ||
          opt.localizedNames[language].toLowerCase().includes(q) ||
          opt.mandiAddress.toLowerCase().includes(q);
        if (!nameHit) return false;
      }
      if (activeFilter === 'nearby') return opt.distanceKm <= 25;
      if (activeFilter === 'verified') return opt.isPhoneVerified;
      if (activeFilter === 'zero_comm') return opt.commissionAmount === 0;
      return true;
    });
  }, [evaluations, searchBuyer, activeFilter, language]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetFilters = () => {
    setFilterMode('all');
    setSearchBuyer('');
    onClearExternalFilter?.();
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4" aria-live="polite">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-[#166534] animate-spin shrink-0" />
          <div>
            <div className="font-display text-base font-bold text-[#142019]">
              {t.loadingResultsTitle}
            </div>
            <div className="text-xs text-[#4A5951] mt-0.5">
              Calculating transport, mandi fees, commission, and quality deductions...
            </div>
          </div>
        </div>
        {[1, 2, 3].map((k) => (
          <div
            key={k}
            className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 animate-pulse"
          >
            <div className="h-4 w-1/3 bg-stone-200 rounded" />
            <div className="h-6 w-2/3 bg-stone-200 rounded" />
            <div className="h-10 w-full bg-stone-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (errorMsg) {
    return (
      <div className="bg-white border border-amber-300 rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-[#142019]">
              Unable to load latest market rates
            </h3>
            <p className="text-sm text-[#4A5951]">{errorMsg}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (evaluations.length === 0) return null;

  const bestOption = evaluations[0];
  const highestListedOption =
    evaluations.find((o) => o.isHighestListed) ?? evaluations[0];
  const highestListedLostToBest = bestOption.optionId !== highestListedOption.optionId;
  const maxGross = Math.max(...evaluations.map((e) => e.grossRevenue), 1);

  return (
    <div className="space-y-6">
      {/* Winner Spotlight — Single Dominant Anchor */}
      <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#166534]">
            <Award className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.bestNetHeadline}</span>
            <span className="text-stone-300" aria-hidden="true">
              ·
            </span>
            <span className="text-[#4A5951] font-normal">Sample Data</span>
          </div>
          <ProvenanceTag
            provenance={bestOption.priceProvenance}
            t={t}
            detail={bestOption.updatedAtLabel}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-stone-200">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142019] tracking-tight text-balance">
              {bestOption.localizedNames[language]}
            </h2>
            <p className="text-sm text-[#4A5951] mt-1">
              {bestOption.distanceKm} {t.distanceUnitKm}
              <span className="mx-2 text-stone-300" aria-hidden="true">
                ·
              </span>
              {t.paymentLabel}: {bestOption.paymentTerms[language]}
            </p>
          </div>

          <div className="md:text-right">
            <div className="text-xs font-medium text-[#4A5951]">
              {t.netProceedsLabel} ({quantityQuintals} {t.quintalsUnit})
            </div>
            <div className="font-mono tabular-nums text-3xl sm:text-4xl font-bold text-[#166534] mt-0.5">
              {formatINR(bestOption.netProceeds)}
            </div>
            <div className="text-xs font-mono tabular-nums text-[#4A5951] mt-1">
              {t.netPerQuintalLabel}:{' '}
              <span className="font-semibold text-[#142019]">
                {formatINR(bestOption.netPerQuintal)}
              </span>
              <span className="mx-2 text-stone-300" aria-hidden="true">
                ·
              </span>
              {t.listedPriceLabel}: {formatINR(bestOption.listedPricePerQuintal)}
            </div>
          </div>
        </div>

        {/* Formula & Non-Guarantee Trust Notice */}
        <div className="pt-4 space-y-3">
          {highestListedLostToBest ? (
            <div className="flex items-start gap-2.5 text-sm text-[#142019]">
              <Info className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium">
                  +{formatINR(bestOption.netAdvantageOverHighestListed)} higher net cash than{' '}
                  {highestListedOption.localizedNames[language]} (which lists{' '}
                  <span className="font-mono tabular-nums">
                    {formatINR(highestListedOption.listedPricePerQuintal)}/{t.quintalsUnit}
                  </span>
                  )
                </p>
                <p className="text-xs text-[#4A5951] mt-0.5">{t.highestListedTrapNote}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 text-sm text-[#142019]">
              <Info className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs sm:text-sm text-[#4A5951]">
                {t.highestListedMatchesBestNote}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
            <span className="text-xs text-[#4A5951]">{t.notGuaranteedNote}</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenBuyerDetails(bestOption.optionId)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.buyerDetailsBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => onInspectLedger(bestOption.optionId)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-[#142019] inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>{t.inspectLedgerBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Stacked Bar Comparison */}
      <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="font-display text-base font-semibold text-[#142019]">
            {t.visualComparisonTitle}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#4A5951]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#166534]" />
              {t.netInHand}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#D97706]" />
              {t.qualityCut}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#64748B]" />
              {t.transportCost}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#CBD5E1]" />
              {t.feesCommission}
            </span>
          </div>
        </div>

        <div className="space-y-3.5">
          {evaluations.map((opt, idx) => {
            const netPct = Math.max(0, (opt.netProceeds / maxGross) * 100);
            const qualPct = Math.max(0, (opt.qualityDeductionAmount / maxGross) * 100);
            const transPct = Math.max(0, (opt.transportCostAmount / maxGross) * 100);
            const feePct = Math.max(0, (opt.feesAndCommissionAmount / maxGross) * 100);

            return (
              <div key={opt.optionId} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="font-medium text-[#142019] truncate">
                    {idx + 1}. {opt.localizedNames[language]}
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-[#142019] shrink-0">
                    {formatINR(opt.netProceeds)}{' '}
                    <span className="font-normal text-[#4A5951]">
                      ({formatINR(opt.netPerQuintal)}/{t.quintalsUnit})
                    </span>
                  </span>
                </div>
                <div
                  className="w-full h-5 rounded-md bg-stone-100 overflow-hidden flex"
                  role="img"
                  aria-label={`${opt.localizedNames[language]} net ${formatINR(opt.netProceeds)}`}
                >
                  <div
                    style={{ width: `${netPct}%` }}
                    className={opt.isBestNet ? 'bg-[#166534] h-full' : 'bg-[#2E7D4F] h-full'}
                    title={`${t.netInHand}: ${formatINR(opt.netProceeds)}`}
                  />
                  {qualPct > 0 && (
                    <div
                      style={{ width: `${qualPct}%` }}
                      className="bg-[#D97706] h-full"
                      title={`${t.qualityCut}: ${formatINR(opt.qualityDeductionAmount)}`}
                    />
                  )}
                  {transPct > 0 && (
                    <div
                      style={{ width: `${transPct}%` }}
                      className="bg-[#64748B] h-full"
                      title={`${t.transportCost}: ${formatINR(opt.transportCostAmount)}`}
                    />
                  )}
                  {feePct > 0 && (
                    <div
                      style={{ width: `${feePct}%` }}
                      className="bg-[#CBD5E1] h-full"
                      title={`${t.feesCommission}: ${formatINR(opt.feesAndCommissionAmount)}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filter Bar + Ranked Selling Options */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-display text-base font-bold text-[#142019]">
            {t.rankedOptionsTitle}
          </h3>

          <div className="relative sm:w-56">
            <Search className="w-4 h-4 text-[#4A5951] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchBuyer}
              onChange={(e) => {
                onClearExternalFilter?.();
                setSearchBuyer(e.target.value);
              }}
              placeholder="Filter buyer or mandi..."
              aria-label="Filter buyers"
              className="w-full min-h-[40px] pl-9 pr-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-[#142019]"
            />
          </div>
        </div>

        {/* Interactive Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-stone-200 rounded-xl">
          {(
            [
              { id: 'all', label: `All (${evaluations.length})` },
              { id: 'nearby', label: 'Within 25 km' },
              { id: 'verified', label: 'Verified Contact' },
              { id: 'zero_comm', label: '0% Commission' },
            ] as { id: BuyerFilter; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onClearExternalFilter?.();
                setFilterMode(tab.id);
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-[#142019] text-white font-semibold'
                  : 'text-[#4A5951] hover:text-[#142019]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* No-Results State */}
        {filteredEvaluations.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center space-y-3">
            <div className="font-display text-base font-bold text-[#142019]">
              {t.noResultsTitle}
            </div>
            <p className="text-sm text-[#4A5951]">
              Try clearing your search or expanding the distance filter to see all regional mandis
              and buyers.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold"
            >
              {t.resetFiltersBtn}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvaluations.map((opt, index) => {
              const isSelected = opt.optionId === selectedOptionId;
              const isExpanded = !!expandedIds[opt.optionId];
              return (
                <div
                  key={opt.optionId}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 transition-colors ${
                    opt.isBestNet
                      ? 'border-[#166534]'
                      : isSelected
                      ? 'border-[#142019]'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#4A5951]">
                        <span className="font-mono font-semibold text-[#142019]">
                          #{index + 1}
                        </span>
                        <span aria-hidden="true">·</span>
                        <ProvenanceTag provenance={opt.priceProvenance} t={t} />
                        <span aria-hidden="true">·</span>
                        {opt.isPhoneVerified ? (
                          <span className="inline-flex items-center gap-1 text-[#0F766E] font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#B45309] font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                            Unverified
                          </span>
                        )}
                        {opt.isSampleData && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Sample</span>
                          </>
                        )}
                      </div>

                      <h4 className="font-display text-base sm:text-lg font-bold text-[#142019]">
                        {opt.localizedNames[language]}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#4A5951]">
                        <span className="tabular-nums font-medium text-[#142019]">
                          {opt.distanceKm} {t.distanceUnitKm}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{opt.paymentTerms[language]}</span>
                        {opt.arrivalQuintalsToday !== null && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 tabular-nums">
                              {t.arrivalsLabel}:{' '}
                              {opt.arrivalQuintalsToday.toLocaleString('en-IN')} {t.quintalsUnit}
                              {opt.arrivalTrend === 'rising' && (
                                <TrendingUp className="w-3 h-3 text-[#B45309]" />
                              )}
                              {opt.arrivalTrend === 'falling' && (
                                <TrendingDown className="w-3 h-3 text-[#0F766E]" />
                              )}
                              {opt.arrivalTrend === 'steady' && (
                                <Minus className="w-3 h-3 text-stone-400" />
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-xs text-[#4A5951]">{t.netProceedsLabel}</div>
                      <div
                        className={`font-mono tabular-nums text-2xl font-bold ${
                          opt.isBestNet ? 'text-[#166534]' : 'text-[#142019]'
                        }`}
                      >
                        {formatINR(opt.netProceeds)}
                      </div>
                      <div className="text-xs font-mono tabular-nums text-[#4A5951]">
                        {formatINR(opt.netPerQuintal)}/{t.quintalsUnit} net
                      </div>
                    </div>
                  </div>

                  {/* Compact Cost Strip */}
                  <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <div className="text-[#4A5951]">{t.listedPriceLabel}</div>
                      <div className="font-mono tabular-nums font-semibold text-[#142019] mt-0.5">
                        {formatINR(opt.listedPricePerQuintal)}/{t.quintalsUnit}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#4A5951]">{t.qualityCut}</div>
                      <div className="font-mono tabular-nums font-medium text-[#B45309] mt-0.5">
                        {opt.qualityDeductionAmount > 0
                          ? `-${formatINR(opt.qualityDeductionAmount)}`
                          : '₹0'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#4A5951]">{t.transportCost}</div>
                      <div className="font-mono tabular-nums font-medium text-[#142019] mt-0.5">
                        {opt.transportCostAmount > 0
                          ? `-${formatINR(opt.transportCostAmount)}`
                          : '₹0'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#4A5951]">{t.feesCommission}</div>
                      <div className="font-mono tabular-nums font-medium text-[#142019] mt-0.5">
                        {opt.feesAndCommissionAmount > 0
                          ? `-${formatINR(opt.feesAndCommissionAmount)}`
                          : '₹0'}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Cost Breakdown */}
                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleExpand(opt.optionId)}
                        className="min-h-[38px] text-xs font-semibold text-[#166534] hover:underline inline-flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        <span>
                          {isExpanded ? t.collapseCostsBtn : t.expandCostsBtn} (-
                          {formatINR(opt.totalDeductions)})
                        </span>
                      </button>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenBuyerDetails(opt.optionId)}
                          className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{t.buyerDetailsBtn}</span>
                        </button>

                        {opt.mapDataAvailable && (
                          <button
                            type="button"
                            onClick={() => onOpenMandiMap(opt.optionId)}
                            className="min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-[#142019] inline-flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#166534]" aria-hidden="true" />
                            <span>{t.navMap}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-3.5 rounded-xl bg-[#F7F8F5] border border-stone-200 space-y-2.5 text-xs">
                        <div className="font-semibold text-[#142019]">
                          Estimated net proceeds = Listed price × Qty − Transport − Commission −
                          Quality cuts − Other fees
                        </div>
                        <div className="divide-y divide-stone-200">
                          {opt.lineItems.map((item) => {
                            const lbl =
                              item.customLabel ??
                              (t[item.labelKey as keyof TranslationStrings] as string);
                            return (
                              <div
                                key={item.id}
                                className="py-1.5 flex items-center justify-between gap-2"
                              >
                                <div>
                                  <span className="font-medium text-[#142019]">{lbl}</span>
                                  <span className="text-[#4A5951] ml-2 font-mono">
                                    ({item.formulaText})
                                  </span>
                                </div>
                                <span
                                  className={`font-mono tabular-nums font-semibold shrink-0 ${
                                    item.category === 'gross'
                                      ? 'text-[#142019]'
                                      : item.amount >= 0
                                      ? 'text-[#166534]'
                                      : 'text-[#B45309]'
                                  }`}
                                >
                                  {item.amount > 0 && item.category !== 'gross' ? '+' : ''}
                                  {formatINR(item.amount)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="pt-2 border-t border-stone-300 flex items-center justify-between font-bold text-[#142019]">
                          <span>{t.netProceedsLabel}</span>
                          <span className="font-mono tabular-nums text-sm text-[#166534]">
                            {formatINR(opt.netProceeds)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#4A5951] leading-relaxed">
                          <span className="font-semibold text-[#142019]">Source & Time: </span>
                          {opt.priceSourceLabel} · {opt.updatedAtLabel}. {opt.assumptionsSummary}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectOption(opt.optionId);
                            onInspectLedger(opt.optionId);
                          }}
                          className="text-xs font-semibold text-[#166534] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Adjust rates or freight in Cost Ledger</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
