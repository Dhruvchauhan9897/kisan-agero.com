import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Loader2,
  MessageSquareText,
} from 'lucide-react';
import { CropDefinition, CropOutlook, LanguageCode } from '../types/kisan';
import { TranslationStrings } from '../i18n/translations';
import { ProvenanceTag } from './ProvenanceTag';

interface PriceOutlookSectionProps {
  language: LanguageCode;
  t: TranslationStrings;
  crop: CropDefinition;
  regionName: string;
  moisturePct: number;
  outlook: CropOutlook;
}

export const PriceOutlookSection: React.FC<PriceOutlookSectionProps> = ({
  language,
  t,
  crop,
  regionName,
  moisturePct,
  outlook,
}) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Reset cached explanation if crop, region, or language changes
  useEffect(() => {
    setAiExplanation(null);
    setAiError(null);
  }, [crop.id, outlook.regionId, language]);

  const points = outlook.points;
  const allValues = points.flatMap((p) =>
    [p.verifiedPrice, p.projectedLow, p.projectedHigh].filter(
      (v): v is number => typeof v === 'number'
    )
  );
  const minVal = Math.floor((Math.min(...allValues) * 0.985) / 50) * 50;
  const maxVal = Math.ceil((Math.max(...allValues) * 1.015) / 50) * 50;
  const range = Math.max(100, maxVal - minVal);

  const svgWidth = 640;
  const svgHeight = 220;
  const padLeft = 56;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 32;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const xForIndex = (i: number) =>
    padLeft + (i / Math.max(1, points.length - 1)) * plotW;
  const yForPrice = (price: number) =>
    padTop + ((maxVal - price) / range) * plotH;

  const historyPts = points
    .map((p, i) => (p.verifiedPrice !== undefined ? { x: xForIndex(i), y: yForPrice(p.verifiedPrice), p } : null))
    .filter((v): v is NonNullable<typeof v> => v !== null);

  const lastHist = historyPts[historyPts.length - 1];
  const futurePts = points
    .map((p, i) =>
      p.projectedMedian !== undefined &&
      p.projectedLow !== undefined &&
      p.projectedHigh !== undefined
        ? {
            x: xForIndex(i),
            yMed: yForPrice(p.projectedMedian),
            yLow: yForPrice(p.projectedLow),
            yHigh: yForPrice(p.projectedHigh),
            p,
          }
        : null
    )
    .filter((v): v is NonNullable<typeof v> => v !== null);

  const histPath = historyPts
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  const medianPath =
    lastHist && futurePts.length > 0
      ? `M ${lastHist.x.toFixed(1)} ${lastHist.y.toFixed(1)} ` +
        futurePts
          .map((pt) => `L ${pt.x.toFixed(1)} ${pt.yMed.toFixed(1)}`)
          .join(' ')
      : '';

  const fanPolygonPoints =
    lastHist && futurePts.length > 0
      ? [
          `${lastHist.x.toFixed(1)},${lastHist.y.toFixed(1)}`,
          ...futurePts.map((pt) => `${pt.x.toFixed(1)},${pt.yHigh.toFixed(1)}`),
          ...futurePts
            .slice()
            .reverse()
            .map((pt) => `${pt.x.toFixed(1)},${pt.yLow.toFixed(1)}`),
        ].join(' ')
      : '';

  const finalPoint = futurePts[futurePts.length - 1]?.p;

  const requestPlainExplanation = async () => {
    setLoadingAi(true);
    setAiError(null);
    try {
      const resp = await fetch('/api/outlook-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: crop.names[language],
          regionName,
          moisturePct,
          faqMoistureMax: crop.faqMoistureMaxPct,
          currentModal: crop.baseModalPricePerQuintal,
          priceRangeLow: finalPoint?.projectedLow ?? crop.baseModalPricePerQuintal,
          priceRangeHigh: finalPoint?.projectedHigh ?? crop.baseModalPricePerQuintal,
          uiLanguage: language,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setAiError(data.error || 'Could not generate outlook explanation.');
      } else {
        setAiExplanation(data.explanation);
      }
    } catch {
      setAiError('Network error while contacting market explanation service.');
    } finally {
      setLoadingAi(false);
    }
  };

  const yTicks = [maxVal, Math.round((maxVal + minVal) / 2), minVal];

  return (
    <section
      id="outlook-section"
      className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-[#142019]">
            {t.outlookTitle}
          </h2>
          <p className="text-xs text-[#4A5951] mt-0.5">{t.outlookSubtitle}</p>
        </div>
        {finalPoint && (
          <div className="sm:text-right shrink-0">
            <div className="text-xs text-[#4A5951]">
              +7d Uncertain Range ({outlook.confidenceLabel})
            </div>
            <div className="font-mono tabular-nums text-base font-bold text-[#B45309]">
              ₹{finalPoint.projectedLow?.toLocaleString('en-IN')} – ₹
              {finalPoint.projectedHigh?.toLocaleString('en-IN')} / {t.quintalsUnit}
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Non-Guarantee Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
        <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />
        <span>{t.outlookDisclaimer}</span>
      </div>

      {/* Uncertainty Fan SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[320px] h-auto"
          role="img"
          aria-label="7 day verified price history and uncertain 7 day forecast band"
        >
          {/* Horizontal gridlines */}
          {yTicks.map((tick) => {
            const y = yForPrice(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="#E7E5E4"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[#4A5951] text-[10px] font-mono"
                >
                  ₹{tick.toLocaleString('en-IN')}
                </text>
              </g>
            );
          })}

          {/* Today vertical divider */}
          {lastHist && (
            <line
              x1={lastHist.x}
              y1={padTop}
              x2={lastHist.x}
              y2={svgHeight - padBottom}
              stroke="#A8A29E"
              strokeDasharray="4 4"
            />
          )}

          {/* Forecast Uncertainty Cone */}
          {fanPolygonPoints && (
            <polygon points={fanPolygonPoints} fill="#D97706" fillOpacity={0.18} />
          )}

          {/* Historical Verified Line */}
          <path
            d={histPath}
            fill="none"
            stroke="#0F766E"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Projected Median Dashed Line */}
          {medianPath && (
            <path
              d={medianPath}
              fill="none"
              stroke="#B45309"
              strokeWidth={2}
              strokeDasharray="5 4"
            />
          )}

          {/* Data dots on verified history */}
          {historyPts.map((pt) => (
            <circle
              key={pt.p.dayLabel}
              cx={pt.x}
              cy={pt.y}
              r={3.5}
              fill="#0F766E"
              stroke="#FFFFFF"
              strokeWidth={1.5}
            />
          ))}

          {/* X-axis day labels */}
          {points.map((pt, i) => {
            if (i % 2 !== 0 && pt.dayLabel !== 'Today' && i !== points.length - 1) {
              return null;
            }
            return (
              <text
                key={pt.dayLabel}
                x={xForIndex(i)}
                y={svgHeight - 10}
                textAnchor="middle"
                className={`text-[10px] font-mono ${
                  pt.dayLabel === 'Today'
                    ? 'fill-[#142019] font-semibold'
                    : 'fill-[#4A5951]'
                }`}
              >
                {pt.dayLabel}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs text-[#4A5951]">
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-0.5 bg-[#0F766E] inline-block" />
          <span>{t.verifiedHistoryLegend}</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-2.5 bg-[#D97706]/25 border-b border-dashed border-[#B45309] inline-block" />
          <span>{t.projectedRangeLegend}</span>
        </span>
      </div>

      {/* Causal Drivers Behind Uncertainty */}
      <div className="pt-4 border-t border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-display text-sm font-semibold text-[#142019]">
            {t.driversHeading}
          </h3>
          <button
            type="button"
            disabled={loadingAi}
            onClick={requestPlainExplanation}
            className="min-h-[38px] px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 disabled:opacity-60 text-xs font-semibold text-[#142019] inline-flex items-center gap-1.5 self-start sm:self-center whitespace-nowrap"
          >
            {loadingAi ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <MessageSquareText className="w-3.5 h-3.5 text-[#166534]" />
            )}
            <span>{loadingAi ? t.explainingOutlook : t.askOutlookExplain}</span>
          </button>
        </div>

        {aiError && (
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900">
            {aiError}
          </div>
        )}

        {aiExplanation && (
          <div className="p-4 rounded-xl border border-stone-200 bg-[#F7F8F5] text-xs sm:text-sm text-[#142019] whitespace-pre-line leading-relaxed">
            {aiExplanation}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {outlook.factors.map((factor) => (
            <div
              key={factor.id}
              className="p-3.5 rounded-xl border border-stone-200 bg-[#F7F8F5] space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <ProvenanceTag provenance={factor.provenance} t={t} />
                {factor.direction === 'upward' && (
                  <ArrowUpRight className="w-4 h-4 text-[#166534]" aria-hidden="true" />
                )}
                {factor.direction === 'downward' && (
                  <ArrowDownRight className="w-4 h-4 text-[#B45309]" aria-hidden="true" />
                )}
                {factor.direction === 'neutral' && (
                  <Minus className="w-4 h-4 text-[#4A5951]" aria-hidden="true" />
                )}
              </div>
              <div className="text-xs font-semibold text-[#142019]">
                {factor.title[language]}
              </div>
              <p className="text-xs text-[#4A5951] leading-relaxed">
                {factor.detail[language]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
