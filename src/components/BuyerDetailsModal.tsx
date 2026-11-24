import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  X,
  Clock,
  Building2,
  Navigation,
  Copy,
  Check,
  Sprout,
} from 'lucide-react';
import { CropDefinition, LanguageCode, OptionEvaluation } from '../types/kisan';
import { TranslationStrings } from '../i18n/translations';
import { CROPS } from '../data/cropsAndMarkets';
import { formatINR } from '../utils/calculations';

interface BuyerDetailsModalProps {
  buyer: OptionEvaluation | null;
  crop: CropDefinition;
  quantityQuintals: number;
  language: LanguageCode;
  t: TranslationStrings;
  onClose: () => void;
  onOpenMandiMap: (buyerId: string) => void;
}

export const BuyerDetailsModal: React.FC<BuyerDetailsModalProps> = ({
  buyer,
  crop,
  quantityQuintals,
  language,
  t,
  onClose,
  onOpenMandiMap,
}) => {
  const [copied, setCopied] = useState(false);

  if (!buyer) return null;

  const cleanTel = buyer.contactPhone.replace(/[^+\d]/g, '');
  const smsBody = encodeURIComponent(
    `Namaste, I have ${quantityQuintals} qtl ${crop.names.en} (Grade ${crop.id}). What is today's buying rate and moisture deduction?`
  );
  const hasPhone = cleanTel.length >= 6;

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(buyer.contactPhone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard restriction
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="buyer-details-title"
    >
      <div className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl border border-stone-200 max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-stone-200">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {buyer.isPhoneVerified ? (
                <span className="inline-flex items-center gap-1 font-semibold text-[#0F766E]">
                  <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.verifiedContactLabel}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-[#B45309]">
                  <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.unverifiedContactLabel}</span>
                </span>
              )}
              {buyer.isSampleData && (
                <>
                  <span className="text-stone-300" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-[#4A5951]">Sample Data</span>
                </>
              )}
            </div>

            <h2
              id="buyer-details-title"
              className="font-display text-xl sm:text-2xl font-bold text-[#142019]"
            >
              {buyer.localizedNames[language]}
            </h2>
            <p className="text-sm text-[#4A5951]">{buyer.contactPerson}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeLabel}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-[#142019] shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listed Price vs Estimated Net Proceeds */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#F7F8F5] border border-stone-200">
          <div>
            <div className="text-xs text-[#4A5951]">{t.listedPriceLabel}</div>
            <div className="font-mono tabular-nums text-lg font-bold text-[#142019] mt-0.5">
              {formatINR(buyer.listedPricePerQuintal)}/{t.quintalsUnit}
            </div>
            <div className="text-xs text-[#4A5951] mt-0.5">{buyer.priceSourceLabel}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-[#4A5951]">
              {t.netProceedsLabel} ({quantityQuintals} {t.quintalsUnit})
            </div>
            <div className="font-mono tabular-nums text-xl sm:text-2xl font-bold text-[#166534] mt-0.5">
              {formatINR(buyer.netProceeds)}
            </div>
            <div className="text-xs font-mono tabular-nums text-[#4A5951] mt-0.5">
              {formatINR(buyer.netPerQuintal)}/{t.quintalsUnit} net
            </div>
          </div>
        </div>

        {/* Contact Number + Call & Message Mobile Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 p-3.5 rounded-xl border border-stone-200 bg-white">
            <div>
              <div className="text-xs text-[#4A5951]">Contact Number</div>
              <div className="font-mono tabular-nums text-lg font-bold text-[#142019]">
                {buyer.contactPhone}
              </div>
            </div>
            {hasPhone && (
              <button
                type="button"
                onClick={handleCopyPhone}
                className="min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-[#142019] inline-flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#166534]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          {!buyer.isPhoneVerified && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
              <span>
                This contact and offer are unverified sample details. Always verify buyer identity,
                weighing scale accuracy, and payment timeline before unloading your crop.
              </span>
            </div>
          )}

          {hasPhone && (
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${cleanTel}`}
                className="min-h-[48px] px-4 py-3 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>{t.callBuyerBtn}</span>
              </a>

              <a
                href={`sms:${cleanTel}?body=${smsBody}`}
                className="min-h-[48px] px-4 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-[#142019] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#166534]" aria-hidden="true" />
                <span>{t.messageBuyerBtn}</span>
              </a>
            </div>
          )}
        </div>

        {/* Location & Business Details */}
        <div className="space-y-3 pt-2 border-t border-stone-200 text-sm">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#166534] shrink-0 mt-1" aria-hidden="true" />
            <div className="space-y-1 flex-1">
              <div className="font-semibold text-[#142019]">
                Location · {buyer.distanceKm} {t.distanceUnitKm}
              </div>
              <p className="text-xs text-[#4A5951] leading-relaxed">{buyer.mandiAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#4A5951] shrink-0 mt-1" aria-hidden="true" />
            <div>
              <div className="font-semibold text-[#142019]">{t.timingsLabel}</div>
              <p className="text-xs text-[#4A5951]">
                {buyer.timings} · {t.paymentLabel}: {buyer.paymentTerms[language]}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-[#4A5951] shrink-0 mt-1" aria-hidden="true" />
            <div>
              <div className="font-semibold text-[#142019]">{t.businessDetailsLabel}</div>
              <p className="text-xs text-[#4A5951] leading-relaxed">{buyer.businessDetails}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Sprout className="w-4 h-4 text-[#166534] shrink-0 mt-1" aria-hidden="true" />
            <div>
              <div className="font-semibold text-[#142019]">{t.acceptedCropsLabel}</div>
              <p className="text-xs text-[#4A5951]">
                {buyer.acceptedCrops
                  .map((cid) => CROPS.find((c) => c.id === cid)?.names[language] ?? cid)
                  .join(' · ')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Map Action */}
        <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span className="text-xs text-[#4A5951]">{t.notGuaranteedNote}</span>

          {buyer.mapDataAvailable ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenMandiMap(buyer.optionId);
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#142019] hover:bg-stone-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <Navigation className="w-4 h-4" aria-hidden="true" />
              <span>{t.mandiMapTitle}</span>
            </button>
          ) : (
            <span className="text-xs text-[#4A5951]">{t.mapUnavailableNote}</span>
          )}
        </div>
      </div>
    </div>
  );
};
