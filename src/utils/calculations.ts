import {
  CostLineItem,
  CropDefinition,
  CustomBuyerInput,
  MarketBuyerTemplate,
  OptionEvaluation,
  RegionHub,
  TransactionInputs,
} from '../types/kisan';
import { BUYER_DIRECTORY } from '../data/buyerDirectory';

export function formatINR(value: number): string {
  const abs = Math.abs(Math.round(value));
  const formatted = abs.toLocaleString('en-IN');
  return value < 0 ? `-₹${formatted}` : `₹${formatted}`;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function findNearestRegion(
  lat: number,
  lng: number,
  regions: RegionHub[]
): { region: RegionHub; distanceKm: number } {
  let best = regions[0];
  let minKm = haversineKm(lat, lng, best.lat, best.lng);
  for (const r of regions.slice(1)) {
    const d = haversineKm(lat, lng, r.lat, r.lng);
    if (d < minKm) {
      minKm = d;
      best = r;
    }
  }
  return { region: best, distanceKm: minKm };
}

export function evaluateSellingOptions(
  crop: CropDefinition,
  buyers: MarketBuyerTemplate[],
  inputs: TransactionInputs,
  customBuyer: CustomBuyerInput
): OptionEvaluation[] {
  const qty = Math.max(1, inputs.quantityQuintals);

  const evaluations: OptionEvaluation[] = buyers.map((buyer) => {
    const override = inputs.customOverrides[buyer.id] ?? {};
    const dir = BUYER_DIRECTORY[buyer.id];

    const listedPricePerQuintal =
      override.listedPricePerQuintal ??
      Math.max(200, crop.baseModalPricePerQuintal + (buyer.cropPriceOffsets[crop.id] ?? 0));

    const distanceKm = override.distanceKm ?? buyer.distanceKm;
    const mandiFeePct = override.mandiFeePct ?? buyer.mandiFeePct;
    const commissionPct = override.commissionPct ?? buyer.commissionPct;
    const hammaliPerQuintal = override.hammaliPerQuintal ?? buyer.hammaliPerQuintal;

    const grossRevenue = Math.round(listedPricePerQuintal * qty);

    const lineItems: CostLineItem[] = [
      {
        id: 'gross',
        labelKey: 'grossValueLine',
        formulaText: `${qty} qtl × ₹${listedPricePerQuintal.toLocaleString('en-IN')}/qtl`,
        amount: grossRevenue,
        provenance:
          override.listedPricePerQuintal !== undefined ? 'user_input' : buyer.priceProvenance,
        category: 'gross',
      },
    ];

    // 1. Quality adjustments (Grade + Excess Moisture + Foreign Matter + Flat Weight Loss)
    const gradeAdjPct = crop.gradeAdjustments[inputs.grade] ?? 0;
    if (gradeAdjPct !== 0) {
      const gradeImpact = Math.round((grossRevenue * gradeAdjPct) / 100);
      lineItems.push({
        id: 'grade_adj',
        labelKey: 'qualityGradeLine',
        formulaText: `${inputs.grade} (${gradeAdjPct > 0 ? '+' : ''}${gradeAdjPct}%)`,
        amount: gradeImpact,
        provenance: 'estimate',
        category: 'quality',
      });
    }

    const excessMoisture = Math.max(0, inputs.moisturePct - crop.faqMoistureMaxPct);
    if (excessMoisture > 0) {
      const moistureCutPct =
        excessMoisture * crop.moisturePenaltyPerPct * buyer.qualityStrictnessMultiplier;
      const moistureCutAmt = Math.round((grossRevenue * moistureCutPct) / 100);
      lineItems.push({
        id: 'moisture_cut',
        labelKey: 'qualityMoistureLine',
        formulaText: `+${excessMoisture.toFixed(1)}% above ${crop.faqMoistureMaxPct}% FAQ (${moistureCutPct.toFixed(1)}%)`,
        amount: -moistureCutAmt,
        provenance: 'estimate',
        category: 'quality',
      });
    }

    const excessFm = Math.max(0, inputs.foreignMatterPct - crop.faqForeignMatterMaxPct);
    if (excessFm > 0) {
      const fmCutPct =
        excessFm * crop.foreignMatterPenaltyPerPct * buyer.qualityStrictnessMultiplier;
      const fmCutAmt = Math.round((grossRevenue * fmCutPct) / 100);
      lineItems.push({
        id: 'fm_cut',
        labelKey: 'qualityFmLine',
        formulaText: `+${excessFm.toFixed(1)}% above ${crop.faqForeignMatterMaxPct}% FAQ (${fmCutPct.toFixed(1)}%)`,
        amount: -fmCutAmt,
        provenance: 'estimate',
        category: 'quality',
      });
    }

    if (buyer.flatWeightLossPct > 0) {
      const flatCutAmt = Math.round((grossRevenue * buyer.flatWeightLossPct) / 100);
      lineItems.push({
        id: 'flat_weight_cut',
        labelKey: 'qualityFlatWeightLine',
        formulaText: `${buyer.flatWeightLossPct}% buyer weight/karda allowance`,
        amount: -flatCutAmt,
        provenance: 'estimate',
        category: 'quality',
      });
    }

    const netQualityImpactOnRevenue = lineItems
      .filter((l) => l.category === 'quality')
      .reduce((acc, item) => acc + item.amount, 0);

    // 2. Transport cost
    let transportCostAmount = 0;
    if (override.transportCost !== undefined) {
      transportCostAmount = Math.max(0, Math.round(override.transportCost));
    } else if (
      buyer.channelType === 'village_trader' ||
      distanceKm === 0 ||
      inputs.vehicleType === 'buyer_pickup'
    ) {
      transportCostAmount = 0;
    } else if (inputs.transportMode === 'manual_total') {
      transportCostAmount = Math.max(0, Math.round((inputs.manualTransportTotal * distanceKm) / 20));
    } else {
      const tripsNeeded =
        inputs.vehicleType === 'shared_tempo'
          ? Math.max(1, Math.ceil(qty / 15))
          : inputs.vehicleType === 'tractor_trolley'
          ? Math.max(1, Math.ceil(qty / 45))
          : inputs.vehicleType === 'mini_truck'
          ? Math.max(1, Math.ceil(qty / 90))
          : Math.max(1, Math.ceil(qty / 160));
      transportCostAmount = Math.round(
        tripsNeeded * (inputs.transportBaseHandling + distanceKm * inputs.transportRatePerKmPerTrip)
      );
    }

    if (transportCostAmount > 0) {
      lineItems.push({
        id: 'transport',
        labelKey: 'transportLine',
        formulaText:
          override.transportCost !== undefined
            ? `Manual override (${distanceKm} km)`
            : `${distanceKm} km · ${inputs.vehicleType.replace(/_/g, ' ')}`,
        amount: -transportCostAmount,
        provenance: override.transportCost !== undefined ? 'user_input' : 'estimate',
        category: 'transport',
      });
    }

    // 3. Commission & Other Costs (Mandi fee, hammali, cleaning/bagging)
    let commissionAmount = 0;
    let otherFeesAmount = 0;

    if (mandiFeePct > 0) {
      const feeAmt = Math.round((grossRevenue * mandiFeePct) / 100);
      otherFeesAmount += feeAmt;
      lineItems.push({
        id: 'mandi_fee',
        labelKey: 'mandiFeeLine',
        formulaText: `${mandiFeePct.toFixed(2)}% of gross`,
        amount: -feeAmt,
        provenance: override.mandiFeePct !== undefined ? 'user_input' : buyer.priceProvenance,
        category: 'fees',
      });
    }

    if (commissionPct > 0) {
      const commAmt = Math.round((grossRevenue * commissionPct) / 100);
      commissionAmount += commAmt;
      lineItems.push({
        id: 'commission',
        labelKey: 'commissionLine',
        formulaText: `${commissionPct.toFixed(2)}% brokerage`,
        amount: -commAmt,
        provenance: override.commissionPct !== undefined ? 'user_input' : 'estimate',
        category: 'fees',
      });
    }

    if (hammaliPerQuintal > 0) {
      const hammaliAmt = Math.round(hammaliPerQuintal * qty);
      otherFeesAmount += hammaliAmt;
      lineItems.push({
        id: 'hammali',
        labelKey: 'hammaliLine',
        formulaText: `${qty} qtl × ₹${hammaliPerQuintal}/qtl`,
        amount: -hammaliAmt,
        provenance: override.hammaliPerQuintal !== undefined ? 'user_input' : 'estimate',
        category: 'fees',
      });
    }

    if (buyer.cleaningBaggingPerQuintal > 0) {
      const cleanAmt = Math.round(buyer.cleaningBaggingPerQuintal * qty);
      otherFeesAmount += cleanAmt;
      lineItems.push({
        id: 'cleaning',
        labelKey: 'cleaningBaggingLine',
        formulaText: `${qty} qtl × ₹${buyer.cleaningBaggingPerQuintal}/qtl`,
        amount: -cleanAmt,
        provenance: 'estimate',
        category: 'fees',
      });
    }

    const feesAndCommissionAmount = commissionAmount + otherFeesAmount;
    const netProceeds =
      grossRevenue + netQualityImpactOnRevenue - transportCostAmount - feesAndCommissionAmount;
    const totalDeductions = grossRevenue - netProceeds;
    const netPerQuintal = Math.round(netProceeds / qty);
    const effectiveDeductionPct =
      grossRevenue > 0 ? Number(((totalDeductions / grossRevenue) * 100).toFixed(1)) : 0;

    const vehicleLabel = inputs.vehicleType.replace(/_/g, ' ');
    const assumptionsSummary = `Currency: INR (₹) · Unit: ${qty} qtl (${(qty * 100).toLocaleString('en-IN')} kg) · Transport: ${
      transportCostAmount === 0
        ? 'Farmgate pickup (₹0)'
        : `${vehicleLabel} at ₹${inputs.transportRatePerKmPerTrip}/km + ₹${inputs.transportBaseHandling} base handling`
    } · Quality FAQ limit: ${crop.faqMoistureMaxPct}% moisture, ${crop.faqForeignMatterMaxPct}% dust · Commission: ${commissionPct}% · Mandi fee: ${mandiFeePct}% · Sample market data (not a guaranteed offer).`;

    return {
      optionId: buyer.id,
      name: buyer.name,
      localizedNames: buyer.localizedNames,
      channelType: buyer.channelType,
      distanceKm,
      listedPricePerQuintal,
      priceSourceLabel:
        override.listedPricePerQuintal !== undefined
          ? 'User Adjusted Rate'
          : `${buyer.priceSourceLabel} (Sample)`,
      priceProvenance:
        override.listedPricePerQuintal !== undefined ? 'user_input' : buyer.priceProvenance,
      updatedAtLabel: buyer.updatedAtLabel,
      grossRevenue,
      qualityDeductionAmount: Math.max(0, -netQualityImpactOnRevenue),
      transportCostAmount,
      commissionAmount,
      otherFeesAmount,
      feesAndCommissionAmount,
      totalDeductions,
      netProceeds,
      netPerQuintal,
      effectiveDeductionPct,
      paymentTerms: buyer.paymentTerms,
      arrivalQuintalsToday: buyer.arrivalQuintalsToday,
      arrivalTrend: buyer.arrivalTrend,
      lineItems,
      isBestNet: false,
      isHighestListed: false,
      netAdvantageOverHighestListed: 0,
      mandiAddress: dir?.mandiAddress ?? `${buyer.name} Market Yard`,
      lat: dir?.lat ?? null,
      lng: dir?.lng ?? null,
      contactPhone: dir?.contactPhone ?? '+91 98000 00000',
      contactPerson: dir?.contactPerson ?? 'Market Desk (Unverified)',
      isPhoneVerified: dir?.isPhoneVerified ?? false,
      businessDetails:
        dir?.businessDetails ??
        (buyer.requiresMandiPass ? 'Mandi gate slip required' : 'Direct buyer center'),
      timings: dir?.timings ?? 'Mon–Sat, 08:00 AM – 05:00 PM',
      acceptedCrops: dir?.acceptedCrops ?? [crop.id],
      mapDataAvailable: dir?.mapDataAvailable ?? false,
      highwayHint: dir?.highwayHint ?? 'Local district road',
      assumptionsSummary,
      isSampleData: true,
    };
  });

  // Optional Custom Buyer Quote
  if (customBuyer.enabled && customBuyer.listedPricePerQuintal > 0) {
    const gross = Math.round(customBuyer.listedPricePerQuintal * qty);
    const qualCut = Math.round((gross * Math.max(0, customBuyer.qualityDeductionPct)) / 100);
    const commCut = Math.round((gross * Math.max(0, customBuyer.commissionPct)) / 100);
    const transportEst =
      customBuyer.distanceKm === 0 || inputs.vehicleType === 'buyer_pickup'
        ? 0
        : Math.round(
            inputs.transportBaseHandling +
              customBuyer.distanceKm * inputs.transportRatePerKmPerTrip
          );
    const hammaliAmt = Math.round(Math.max(0, customBuyer.hammaliPerQuintal) * qty);
    const feesTotal = commCut + hammaliAmt;
    const net = gross - qualCut - transportEst - feesTotal;

    const customLineItems: CostLineItem[] = [
      {
        id: 'gross',
        labelKey: 'grossValueLine',
        formulaText: `${qty} qtl × ₹${customBuyer.listedPricePerQuintal.toLocaleString('en-IN')}/qtl`,
        amount: gross,
        provenance: 'user_input',
        category: 'gross',
      },
    ];
    if (qualCut > 0) {
      customLineItems.push({
        id: 'custom_qual',
        labelKey: 'qualityMoistureLine',
        customLabel: 'Quoted Quality / Weight Cut',
        formulaText: `${customBuyer.qualityDeductionPct}% cut`,
        amount: -qualCut,
        provenance: 'user_input',
        category: 'quality',
      });
    }
    if (transportEst > 0) {
      customLineItems.push({
        id: 'custom_transport',
        labelKey: 'transportLine',
        formulaText: `${customBuyer.distanceKm} km estimated freight`,
        amount: -transportEst,
        provenance: 'estimate',
        category: 'transport',
      });
    }
    if (commCut > 0) {
      customLineItems.push({
        id: 'custom_comm',
        labelKey: 'commissionLine',
        formulaText: `${customBuyer.commissionPct}% brokerage`,
        amount: -commCut,
        provenance: 'user_input',
        category: 'fees',
      });
    }
    if (hammaliAmt > 0) {
      customLineItems.push({
        id: 'custom_hammali',
        labelKey: 'hammaliLine',
        formulaText: `${qty} qtl × ₹${customBuyer.hammaliPerQuintal}/qtl`,
        amount: -hammaliAmt,
        provenance: 'user_input',
        category: 'fees',
      });
    }

    const displayName = customBuyer.name.trim() || 'Your Local Quote';
    evaluations.push({
      optionId: 'custom_buyer',
      name: displayName,
      localizedNames: {
        en: displayName,
        hi: displayName,
        mr: displayName,
        pa: displayName,
        te: displayName,
      },
      channelType: 'village_trader',
      distanceKm: customBuyer.distanceKm,
      listedPricePerQuintal: customBuyer.listedPricePerQuintal,
      priceSourceLabel: 'Your Entered Quote',
      priceProvenance: 'user_input',
      updatedAtLabel: 'Just now',
      grossRevenue: gross,
      qualityDeductionAmount: qualCut,
      transportCostAmount: transportEst,
      commissionAmount: commCut,
      otherFeesAmount: hammaliAmt,
      feesAndCommissionAmount: feesTotal,
      totalDeductions: gross - net,
      netProceeds: net,
      netPerQuintal: Math.round(net / qty),
      effectiveDeductionPct: gross > 0 ? Number((((gross - net) / gross) * 100).toFixed(1)) : 0,
      paymentTerms: {
        en: customBuyer.paymentTerms || 'As agreed',
        hi: customBuyer.paymentTerms || 'तय शर्तों पर',
        mr: customBuyer.paymentTerms || 'कराराप्रमाणे',
        pa: customBuyer.paymentTerms || 'ਤੈਅ ਸ਼ਰਤਾਂ ਅਨੁਸਾਰ',
        te: customBuyer.paymentTerms || 'ఒప్పందం ప్రకారం',
      },
      arrivalQuintalsToday: null,
      arrivalTrend: null,
      lineItems: customLineItems,
      isBestNet: false,
      isHighestListed: false,
      netAdvantageOverHighestListed: 0,
      mandiAddress: 'Custom buyer location (entered by you)',
      lat: null,
      lng: null,
      contactPhone: customBuyer.contactPhone || 'Not provided',
      contactPerson: 'User-entered buyer (Unverified)',
      isPhoneVerified: false,
      businessDetails: 'Custom offer entered by user — verify weighing and terms directly',
      timings: 'As agreed with buyer',
      acceptedCrops: [crop.id],
      mapDataAvailable: false,
      highwayHint: 'User-entered quote',
      assumptionsSummary: `Currency: INR (₹) · Unit: ${qty} qtl · Based on user-entered quote of ₹${customBuyer.listedPricePerQuintal}/qtl, ${customBuyer.commissionPct}% commission, ${customBuyer.qualityDeductionPct}% quality cut.`,
      isSampleData: false,
    });
  }

  // Sort by highest Net Proceeds descending
  evaluations.sort((a, b) => b.netProceeds - a.netProceeds);

  if (evaluations.length > 0) {
    evaluations[0].isBestNet = true;

    let highestListedOpt = evaluations[0];
    for (const opt of evaluations) {
      if (opt.listedPricePerQuintal > highestListedOpt.listedPricePerQuintal) {
        highestListedOpt = opt;
      }
    }
    highestListedOpt.isHighestListed = true;

    for (const opt of evaluations) {
      opt.netAdvantageOverHighestListed = opt.netProceeds - highestListedOpt.netProceeds;
    }
  }

  return evaluations;
}
