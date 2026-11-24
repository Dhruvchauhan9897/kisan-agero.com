export type LanguageCode = 'en' | 'hi' | 'mr' | 'pa' | 'te';

export type DataProvenance = 'verified' | 'estimate' | 'user_input';

export type CropGrade = 'A' | 'FAQ' | 'B';

export type QuantityUnit = 'qtl' | 'kg' | 'tonnes';

export type BuyerChannelType =
  | 'apmc_mandi'
  | 'regional_mandi'
  | 'fpo_center'
  | 'direct_mill'
  | 'village_trader';

export type VehicleType =
  | 'tractor_trolley'
  | 'mini_truck'
  | 'heavy_truck'
  | 'shared_tempo'
  | 'buyer_pickup';

export type LocationPermissionState =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable';

export interface CropDefinition {
  id: string;
  names: Record<LanguageCode, string>;
  varietyHint: Record<LanguageCode, string>;
  mspPerQuintal: number | null; // null if no government MSP (e.g., Onion)
  faqMoistureMaxPct: number;
  faqForeignMatterMaxPct: number;
  defaultMoisturePct: number;
  defaultForeignMatterPct: number;
  moisturePenaltyPerPct: number; // % price cut per 1% excess moisture
  foreignMatterPenaltyPerPct: number; // % price cut per 1% excess FM
  gradeAdjustments: Record<CropGrade, number>; // e.g., A: +3.5%, FAQ: 0%, B: -5.5%
  baseModalPricePerQuintal: number;
  seasonNote: Record<LanguageCode, string>;
}

export interface RegionHub {
  id: string;
  name: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  localizedName: Record<LanguageCode, string>;
  defaultCropId: string;
}

export interface BuyerDirectoryMeta {
  mandiAddress: string;
  lat: number;
  lng: number;
  contactPhone: string;
  contactPerson: string;
  isPhoneVerified: boolean;
  businessDetails: string;
  timings: string;
  acceptedCrops: string[];
  mapDataAvailable: boolean;
  highwayHint: string;
}

export interface MarketBuyerTemplate {
  id: string;
  regionId: string;
  name: string;
  localizedNames: Record<LanguageCode, string>;
  channelType: BuyerChannelType;
  distanceKm: number;
  priceSourceLabel: string;
  priceProvenance: DataProvenance;
  updatedAtLabel: string;
  cropPriceOffsets: Record<string, number>;
  mandiFeePct: number;
  commissionPct: number;
  hammaliPerQuintal: number;
  cleaningBaggingPerQuintal: number;
  qualityStrictnessMultiplier: number;
  flatWeightLossPct: number;
  paymentTerms: Record<LanguageCode, string>;
  arrivalQuintalsToday: number | null;
  arrivalTrend: 'rising' | 'steady' | 'falling' | null;
  requiresMandiPass: boolean;
}

export interface CustomBuyerInput {
  enabled: boolean;
  name: string;
  listedPricePerQuintal: number;
  distanceKm: number;
  commissionPct: number;
  hammaliPerQuintal: number;
  qualityDeductionPct: number;
  paymentTerms: string;
  contactPhone?: string;
}

export interface TransactionInputs {
  cropId: string;
  regionId: string;
  customVillageLabel: string;
  quantityQuintals: number;
  displayUnit: QuantityUnit;
  grade: CropGrade;
  moisturePct: number;
  foreignMatterPct: number;
  vehicleType: VehicleType;
  transportRatePerKmPerTrip: number;
  transportBaseHandling: number;
  transportMode: 'auto_distance' | 'manual_total';
  manualTransportTotal: number;
  customOverrides: Record<
    string,
    {
      listedPricePerQuintal?: number;
      distanceKm?: number;
      transportCost?: number;
      mandiFeePct?: number;
      commissionPct?: number;
      hammaliPerQuintal?: number;
    }
  >;
}

export interface CostLineItem {
  id: string;
  labelKey: string;
  customLabel?: string;
  formulaText: string;
  amount: number; // negative for deductions/costs, positive for gross/net
  provenance: DataProvenance;
  category: 'gross' | 'quality' | 'transport' | 'fees';
}

export interface OptionEvaluation {
  optionId: string;
  name: string;
  localizedNames: Record<LanguageCode, string>;
  channelType: BuyerChannelType;
  distanceKm: number;
  listedPricePerQuintal: number;
  priceSourceLabel: string;
  priceProvenance: DataProvenance;
  updatedAtLabel: string;
  grossRevenue: number;
  qualityDeductionAmount: number;
  transportCostAmount: number;
  commissionAmount: number;
  otherFeesAmount: number;
  feesAndCommissionAmount: number;
  totalDeductions: number;
  netProceeds: number;
  netPerQuintal: number;
  effectiveDeductionPct: number;
  paymentTerms: Record<LanguageCode, string>;
  arrivalQuintalsToday: number | null;
  arrivalTrend: 'rising' | 'steady' | 'falling' | null;
  lineItems: CostLineItem[];
  isBestNet: boolean;
  isHighestListed: boolean;
  netAdvantageOverHighestListed: number;
  // Directory, location, contact & trust metadata
  mandiAddress: string;
  lat: number | null;
  lng: number | null;
  contactPhone: string;
  contactPerson: string;
  isPhoneVerified: boolean;
  businessDetails: string;
  timings: string;
  acceptedCrops: string[];
  mapDataAvailable: boolean;
  highwayHint: string;
  assumptionsSummary: string;
  isSampleData: boolean;
}

export interface RecentSearchItem {
  id: string;
  cropId: string;
  regionId: string;
  quantityQuintals: number;
  grade: CropGrade;
  villageLabel?: string;
  topBuyerName: string;
  topNetProceeds: number;
  searchedAtLabel: string;
  isSample?: boolean;
}

export interface PricePoint {
  dayLabel: string;
  daysOffset: number;
  verifiedPrice?: number;
  projectedMedian?: number;
  projectedLow?: number;
  projectedHigh?: number;
}

export interface OutlookFactor {
  id: string;
  direction: 'upward' | 'downward' | 'neutral';
  title: Record<LanguageCode, string>;
  detail: Record<LanguageCode, string>;
  provenance: DataProvenance;
}

export interface CropOutlook {
  cropId: string;
  regionId: string;
  uncertaintyBandPct: number;
  confidenceLabel: 'Moderate Uncertainty' | 'High Volatility' | 'Narrow Range';
  points: PricePoint[];
  factors: OutlookFactor[];
}

export interface UserPriceAlert {
  id: string;
  cropId: string;
  regionId: string;
  targetNetPerQuintal: number;
  channelNote: string;
  active: boolean;
  createdAt: string;
}

export interface RegionalAdvisory {
  id: string;
  severity: 'info' | 'warning';
  regionId: string | 'all';
  cropId: string | 'all';
  title: Record<LanguageCode, string>;
  body: Record<LanguageCode, string>;
  sourceLabel: string;
  provenance: DataProvenance;
}

export interface VoiceParseResult {
  transcript: string;
  detectedLanguage: string;
  cropId?: string;
  regionId?: string;
  quantityQuintals?: number;
  moisturePct?: number;
  foreignMatterPct?: number;
  grade?: CropGrade;
  confidenceNote: string;
}
