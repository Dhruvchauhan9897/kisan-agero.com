import React, { useState, useMemo, useEffect } from 'react';
import {
  Home,
  BarChart3,
  Map as MapIcon,
  Bell,
  Smartphone,
  SlidersHorizontal,
  WifiOff,
} from 'lucide-react';
import {
  CropDefinition,
  CustomBuyerInput,
  LanguageCode,
  LocationPermissionState,
  RecentSearchItem,
  TransactionInputs,
  UserPriceAlert,
  VehicleType,
  VoiceParseResult,
} from './types/kisan';
import { TRANSLATIONS } from './i18n/translations';
import {
  CROPS,
  MARKET_BUYERS,
  REGIONAL_ADVISORIES,
  REGIONS,
  VEHICLE_PRESETS,
  buildCropOutlook,
} from './data/cropsAndMarkets';
import { evaluateSellingOptions, findNearestRegion } from './utils/calculations';
import { TopNav, ActiveSection } from './components/TopNav';
import { HomeScreen } from './components/HomeScreen';
import { StepFlowBuilder } from './components/StepFlowBuilder';
import { NetProceedsComparison } from './components/NetProceedsComparison';
import { CostBreakdownLedger } from './components/CostBreakdownLedger';
import { PriceOutlookSection } from './components/PriceOutlookSection';
import { MarketAlertsPanel } from './components/MarketAlertsPanel';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { BuyerDetailsModal } from './components/BuyerDetailsModal';
import { MandiMapView } from './components/MandiMapView';
import { ScreenMockupsGallery } from './components/ScreenMockupsGallery';

const ALERTS_STORAGE_KEY = 'kisanmargin_price_alerts_v1';
const RECENT_SEARCHES_KEY = 'kisanmargin_recent_searches_v1';

const DEFAULT_INPUTS: TransactionInputs = {
  cropId: 'wheat',
  regionId: 'sehore_mp',
  customVillageLabel: '',
  quantityQuintals: 35,
  displayUnit: 'qtl',
  grade: 'FAQ',
  moisturePct: 13.5,
  foreignMatterPct: 1.5,
  vehicleType: 'tractor_trolley',
  transportRatePerKmPerTrip: 32,
  transportBaseHandling: 450,
  transportMode: 'auto_distance',
  manualTransportTotal: 1100,
  customOverrides: {},
};

const DEFAULT_CUSTOM_BUYER: CustomBuyerInput = {
  enabled: false,
  name: 'Neighbor Mandi Trader',
  listedPricePerQuintal: 2420,
  distanceKm: 4,
  commissionPct: 1.0,
  hammaliPerQuintal: 15,
  qualityDeductionPct: 1.5,
  paymentTerms: 'Same-day cash',
  contactPhone: '',
};

const SEED_RECENT_SEARCHES: RecentSearchItem[] = [
  {
    id: 'seed_1',
    cropId: 'wheat',
    regionId: 'sehore_mp',
    quantityQuintals: 35,
    grade: 'FAQ',
    villageLabel: 'Bilkisganj, Sehore',
    topBuyerName: 'Narmada Kisan FPO Center',
    topNetProceeds: 81420,
    searchedAtLabel: 'Today 09:00',
    isSample: true,
  },
  {
    id: 'seed_2',
    cropId: 'onion',
    regionId: 'nashik_mh',
    quantityQuintals: 25,
    grade: 'A',
    villageLabel: 'Niphad, Nashik',
    topBuyerName: 'Niphad Farmers FPO Hub',
    topNetProceeds: 55410,
    searchedAtLabel: 'Yesterday',
    isSample: true,
  },
  {
    id: 'seed_3',
    cropId: 'soybean',
    regionId: 'indore_mp',
    quantityQuintals: 40,
    grade: 'FAQ',
    villageLabel: 'Sanwer, Indore',
    topBuyerName: 'Indore Laxmibai Mandi',
    topNetProceeds: 179120,
    searchedAtLabel: '2 days ago',
    isSample: true,
  },
];

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [inputs, setInputs] = useState<TransactionInputs>(DEFAULT_INPUTS);
  const [customBuyer, setCustomBuyer] = useState<CustomBuyerInput>(DEFAULT_CUSTOM_BUYER);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('sehore_apmc');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [buyerModalOptionId, setBuyerModalOptionId] = useState<string | null>(null);
  const [mobileShowInputs, setMobileShowInputs] = useState(false);

  // Interface states: offline, loading, error, location permission, no-results filter
  const [browserOffline, setBrowserOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [offlineSimulated, setOfflineSimulated] = useState<boolean>(false);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] =
    useState<LocationPermissionState>('idle');
  const [locationStatusNote, setLocationStatusNote] = useState<string | null>(null);
  const [compareFilterOverride, setCompareFilterOverride] = useState<
    'all' | 'nearby' | 'verified' | 'zero_comm' | null
  >(null);

  const isOffline = browserOffline || offlineSimulated;

  useEffect(() => {
    const goOffline = () => setBrowserOffline(true);
    const goOnline = () => setBrowserOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) return JSON.parse(saved) as RecentSearchItem[];
    } catch {
      // ignore storage errors
    }
    return SEED_RECENT_SEARCHES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    } catch {
      // ignore storage errors
    }
  }, [recentSearches]);

  const [alerts, setAlerts] = useState<UserPriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as UserPriceAlert[];
      }
    } catch {
      // ignore storage errors
    }
    return [
      {
        id: 'default_wheat_alert',
        cropId: 'wheat',
        regionId: 'sehore_mp',
        targetNetPerQuintal: 2350,
        channelNote: 'Sehore APMC or FPO dry lot',
        active: true,
        createdAt: new Date().toISOString(),
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    } catch {
      // ignore storage errors
    }
  }, [alerts]);

  const t = TRANSLATIONS[language];

  const activeCrop: CropDefinition = useMemo(
    () => CROPS.find((c) => c.id === inputs.cropId) ?? CROPS[0],
    [inputs.cropId]
  );

  const activeRegion = useMemo(
    () => REGIONS.find((r) => r.id === inputs.regionId) ?? REGIONS[0],
    [inputs.regionId]
  );

  const regionalBuyers = useMemo(
    () => MARKET_BUYERS.filter((b) => b.regionId === inputs.regionId),
    [inputs.regionId]
  );

  const evaluations = useMemo(
    () => evaluateSellingOptions(activeCrop, regionalBuyers, inputs, customBuyer),
    [activeCrop, regionalBuyers, inputs, customBuyer]
  );

  // Keep selectedOptionId valid when region changes
  useEffect(() => {
    if (evaluations.length > 0 && !evaluations.some((e) => e.optionId === selectedOptionId)) {
      setSelectedOptionId(evaluations[0].optionId);
    }
  }, [evaluations, selectedOptionId]);

  const outlook = useMemo(
    () => buildCropOutlook(activeCrop, inputs.regionId),
    [activeCrop, inputs.regionId]
  );

  const handleUpdateInputs = (patch: Partial<TransactionInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  const handleSelectCrop = (cropId: string) => {
    const nextCrop = CROPS.find((c) => c.id === cropId);
    if (!nextCrop) return;
    setInputs((prev) => ({
      ...prev,
      cropId,
      moisturePct: nextCrop.defaultMoisturePct,
      foreignMatterPct: nextCrop.defaultForeignMatterPct,
      customOverrides: {},
    }));
  };

  const handleSelectVehicle = (vehicleId: VehicleType) => {
    const preset = VEHICLE_PRESETS.find((v) => v.id === vehicleId);
    setInputs((prev) => ({
      ...prev,
      vehicleType: vehicleId,
      transportRatePerKmPerTrip: preset?.defaultRatePerKm ?? prev.transportRatePerKmPerTrip,
      transportBaseHandling: preset?.baseHandlingFee ?? prev.transportBaseHandling,
    }));
  };

  const handleOverrideOption = (
    optionId: string,
    patch: {
      listedPricePerQuintal?: number;
      distanceKm?: number;
      transportCost?: number;
      mandiFeePct?: number;
      commissionPct?: number;
    }
  ) => {
    setInputs((prev) => ({
      ...prev,
      customOverrides: {
        ...prev.customOverrides,
        [optionId]: {
          ...(prev.customOverrides[optionId] ?? {}),
          ...patch,
        },
      },
    }));
  };

  const handleResetOverrides = (optionId: string) => {
    setInputs((prev) => {
      const next = { ...prev.customOverrides };
      delete next[optionId];
      return { ...prev, customOverrides: next };
    });
  };

  const recordSearchHistory = (nextInputs: TransactionInputs) => {
    const c = CROPS.find((cr) => cr.id === nextInputs.cropId) ?? CROPS[0];
    const rBuyers = MARKET_BUYERS.filter((b) => b.regionId === nextInputs.regionId);
    const evals = evaluateSellingOptions(c, rBuyers, nextInputs, customBuyer);
    const top = evals[0];
    if (!top) return;

    const entry: RecentSearchItem = {
      id: `search_${Date.now()}`,
      cropId: nextInputs.cropId,
      regionId: nextInputs.regionId,
      quantityQuintals: nextInputs.quantityQuintals,
      grade: nextInputs.grade,
      villageLabel: nextInputs.customVillageLabel || undefined,
      topBuyerName: top.name,
      topNetProceeds: top.netProceeds,
      searchedAtLabel: 'Just now',
      isSample: false,
    };

    setRecentSearches((prev) => {
      const deduped = prev.filter(
        (item) =>
          !(
            item.cropId === entry.cropId &&
            item.regionId === entry.regionId &&
            item.quantityQuintals === entry.quantityQuintals
          )
      );
      return [entry, ...deduped].slice(0, 6);
    });
  };

  const runCompareTransition = (nextInputs?: TransactionInputs) => {
    setResultsError(null);
    setCompareFilterOverride(null);
    setActiveSection('compare');
    setMobileShowInputs(false);
    setIsLoadingResults(true);
    recordSearchHistory(nextInputs ?? inputs);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsLoadingResults(false);
    }, 350);
  };

  const handleApplyVoiceParsed = (parsed: VoiceParseResult) => {
    const nextCrop = parsed.cropId
      ? CROPS.find((c) => c.id === parsed.cropId)
      : undefined;
    const nextInputs: TransactionInputs = {
      ...inputs,
      cropId: parsed.cropId ?? inputs.cropId,
      regionId: parsed.regionId ?? inputs.regionId,
      quantityQuintals: parsed.quantityQuintals ?? inputs.quantityQuintals,
      moisturePct:
        parsed.moisturePct ??
        (nextCrop ? nextCrop.defaultMoisturePct : inputs.moisturePct),
      foreignMatterPct:
        parsed.foreignMatterPct ??
        (nextCrop ? nextCrop.defaultForeignMatterPct : inputs.foreignMatterPct),
      grade: parsed.grade ?? inputs.grade,
      customOverrides: {},
    };
    setInputs(nextInputs);
    runCompareTransition(nextInputs);
  };

  const handleRequestGpsLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationPermission('unavailable');
      setLocationStatusNote('Geolocation is not supported by your browser.');
      return;
    }

    setLocationPermission('requesting');
    setLocationStatusNote(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const { region, distanceKm } = findNearestRegion(latitude, longitude, REGIONS);
        setInputs((prev) => ({ ...prev, regionId: region.id }));
        setLocationPermission('granted');
        setLocationStatusNote(
          `${t.locationGrantedMsg}: ${region.localizedName[language]} (${distanceKm} km from GPS).`
        );
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationPermission('denied');
        } else {
          setLocationPermission('unavailable');
          setLocationStatusNote(
            'Unable to read GPS signal right now. Please select your market belt manually.'
          );
        }
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  const handleAddAlert = (
    cropId: string,
    regionId: string,
    targetNetPerQuintal: number,
    channelNote: string
  ) => {
    const newAlert: UserPriceAlert = {
      id: `alert_${Date.now()}`,
      cropId,
      regionId,
      targetNetPerQuintal,
      channelNote,
      active: true,
      createdAt: new Date().toISOString(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const navigateToSection = (section: ActiveSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInspectLedger = (optionId: string) => {
    setSelectedOptionId(optionId);
    setActiveSection('compare');
    setMobileShowInputs(false);
    setTimeout(() => {
      const el = document.getElementById('ledger-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleOpenMandiMap = (optionId: string) => {
    setSelectedOptionId(optionId);
    setActiveSection('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadRecentSearch = (item: RecentSearchItem) => {
    const targetCrop = CROPS.find((c) => c.id === item.cropId) ?? CROPS[0];
    const nextInputs: TransactionInputs = {
      ...inputs,
      cropId: item.cropId,
      regionId: item.regionId,
      quantityQuintals: item.quantityQuintals,
      grade: item.grade,
      customVillageLabel: item.villageLabel ?? '',
      moisturePct: targetCrop.defaultMoisturePct,
      foreignMatterPct: targetCrop.defaultForeignMatterPct,
      customOverrides: {},
    };
    setInputs(nextInputs);
    runCompareTransition(nextInputs);
  };

  const handleTriggerStateDemo = (
    state: 'loading' | 'no_results' | 'error' | 'location_denied' | 'normal'
  ) => {
    if (state === 'loading') {
      setResultsError(null);
      setCompareFilterOverride(null);
      setActiveSection('compare');
      setMobileShowInputs(false);
      setIsLoadingResults(true);
      setTimeout(() => setIsLoadingResults(false), 2200);
    } else if (state === 'no_results') {
      setResultsError(null);
      setIsLoadingResults(false);
      setCompareFilterOverride('zero_comm');
      // If current region has 0% comm buyers, switch to custom filter that ensures 0 matches or search
      // Actually let's set customBuyer or switch to a state where filter yields 0? Wait: all regions have FPOs with 0% comm!
      // Instead, let's temporarily show error or let user see no results by filtering 'nearby' on a region? Even better, let's pass a forced filter state?
      // Let's keep it genuine: let's setResultsError(null) and trigger a custom no-results search via state or switch.
      // Let's add a tiny `demoNoResults` boolean so previewing No-Results state reliably shows the exact No-Results card with Reset CTA!
      setDemoNoResults(true);
      setActiveSection('compare');
      setMobileShowInputs(false);
    } else if (state === 'error') {
      setIsLoadingResults(false);
      setDemoNoResults(false);
      setResultsError(
        'Could not reach live mandi price feed (sample connection timeout). Tap Retry or view cached sample estimates.'
      );
      setActiveSection('compare');
      setMobileShowInputs(false);
    } else if (state === 'location_denied') {
      setLocationPermission('denied');
      setActiveSection('compare');
      setMobileShowInputs(true);
    } else {
      setResultsError(null);
      setDemoNoResults(false);
      setIsLoadingResults(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [demoNoResults, setDemoNoResults] = useState(false);

  const buyerModalTarget = useMemo(
    () => evaluations.find((e) => e.optionId === buyerModalOptionId) ?? null,
    [evaluations, buyerModalOptionId]
  );

  const bestOption = evaluations[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5] text-[#142019] pb-16 md:pb-10">
      <TopNav
        language={language}
        onChangeLanguage={setLanguage}
        t={t}
        activeSection={activeSection}
        onNavigate={navigateToSection}
      />

      {/* Offline State Banner */}
      {isOffline && (
        <div
          role="status"
          className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs sm:text-sm text-amber-950 flex items-center justify-center gap-2 text-center"
        >
          <WifiOff className="w-4 h-4 text-[#B45309] shrink-0" aria-hidden="true" />
          <span>{t.offlineBannerText}</span>
          {offlineSimulated && (
            <button
              type="button"
              onClick={() => setOfflineSimulated(false)}
              className="ml-2 underline font-semibold text-amber-950"
            >
              Go Online
            </button>
          )}
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 sm:pt-7 space-y-6">
        {activeSection === 'home' && (
          <HomeScreen
            language={language}
            t={t}
            selectedCropId={inputs.cropId}
            selectedRegion={activeRegion}
            evaluations={evaluations}
            recentSearches={recentSearches}
            onSelectCropAndCompare={(cropId) => {
              handleSelectCrop(cropId);
              const targetCrop = CROPS.find((c) => c.id === cropId) ?? activeCrop;
              runCompareTransition({
                ...inputs,
                cropId,
                moisturePct: targetCrop.defaultMoisturePct,
                foreignMatterPct: targetCrop.defaultForeignMatterPct,
                customOverrides: {},
              });
            }}
            onStartCompare={() => {
              setActiveSection('compare');
              setMobileShowInputs(true);
            }}
            onOpenVoiceModal={() => setVoiceModalOpen(true)}
            onLoadRecentSearch={handleLoadRecentSearch}
            onOpenMap={() => setActiveSection('map')}
          />
        )}

        {activeSection === 'compare' && (
          <>
            {/* Compare Header + Mobile Form/Results Toggle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="max-w-2xl space-y-1">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#142019] tracking-tight text-balance">
                  {activeCrop.names[language]} · {inputs.quantityQuintals} {t.quintalsUnit}
                </h1>
                <p className="text-sm text-[#4A5951]">
                  {activeRegion.localizedName[language]} · Grade {inputs.grade} ·{' '}
                  {inputs.moisturePct.toFixed(1)}% moisture · Sample Market Data
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileShowInputs((v) => !v)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-[#142019] inline-flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#166534]" />
                  <span>{mobileShowInputs ? 'Show Results' : 'Edit Crop & Location'}</span>
                </button>
              </div>
            </div>

            {/* 2-Column Decision Workbench */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div
                className={`lg:col-span-5 ${
                  mobileShowInputs ? 'block' : 'hidden lg:block'
                }`}
              >
                <StepFlowBuilder
                  language={language}
                  t={t}
                  inputs={inputs}
                  crop={activeCrop}
                  customBuyer={customBuyer}
                  locationPermission={locationPermission}
                  locationStatusNote={locationStatusNote}
                  onRequestGpsLocation={handleRequestGpsLocation}
                  onUpdateInputs={handleUpdateInputs}
                  onSelectCrop={handleSelectCrop}
                  onSelectVehicle={handleSelectVehicle}
                  onUpdateCustomBuyer={(patch) =>
                    setCustomBuyer((prev) => ({ ...prev, ...patch }))
                  }
                  onOpenVoiceModal={() => setVoiceModalOpen(true)}
                  onTriggerCompare={() => runCompareTransition()}
                />
              </div>

              <div
                className={`lg:col-span-7 space-y-6 ${
                  mobileShowInputs ? 'hidden lg:block' : 'block'
                }`}
              >
                {demoNoResults ? (
                  <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center space-y-3">
                    <div className="font-display text-base font-bold text-[#142019]">
                      {t.noResultsTitle}
                    </div>
                    <p className="text-sm text-[#4A5951]">
                      No buyers matched the active filter criteria in {activeRegion.district}.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDemoNoResults(false)}
                      className="min-h-[44px] px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold"
                    >
                      {t.resetFiltersBtn}
                    </button>
                  </div>
                ) : (
                  <NetProceedsComparison
                    language={language}
                    t={t}
                    evaluations={evaluations}
                    quantityQuintals={inputs.quantityQuintals}
                    selectedOptionId={selectedOptionId}
                    isLoading={isLoadingResults}
                    errorMsg={resultsError}
                    onRetry={() => {
                      setResultsError(null);
                      runCompareTransition();
                    }}
                    onSelectOption={setSelectedOptionId}
                    onInspectLedger={handleInspectLedger}
                    onOpenBuyerDetails={(id) => setBuyerModalOptionId(id)}
                    onOpenMandiMap={handleOpenMandiMap}
                    externalFilterOverride={compareFilterOverride}
                    onClearExternalFilter={() => setCompareFilterOverride(null)}
                  />
                )}

                <CostBreakdownLedger
                  language={language}
                  t={t}
                  evaluations={evaluations}
                  selectedOptionId={selectedOptionId}
                  onSelectOption={setSelectedOptionId}
                  inputs={inputs}
                  onOverrideOption={handleOverrideOption}
                  onResetOverrides={handleResetOverrides}
                />

                <PriceOutlookSection
                  language={language}
                  t={t}
                  crop={activeCrop}
                  regionName={activeRegion.localizedName[language]}
                  moisturePct={inputs.moisturePct}
                  outlook={outlook}
                />
              </div>
            </div>
          </>
        )}

        {activeSection === 'map' && (
          <MandiMapView
            language={language}
            t={t}
            region={activeRegion}
            villageLabel={inputs.customVillageLabel}
            evaluations={evaluations}
            selectedOptionId={selectedOptionId}
            onSelectOption={setSelectedOptionId}
            onOpenBuyerDetails={(id) => setBuyerModalOptionId(id)}
            isOffline={isOffline}
          />
        )}

        {activeSection === 'alerts' && (
          <MarketAlertsPanel
            language={language}
            t={t}
            crop={activeCrop}
            regionId={inputs.regionId}
            bestOption={bestOption}
            advisories={REGIONAL_ADVISORIES}
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onRemoveAlert={handleRemoveAlert}
          />
        )}

        {activeSection === 'mockups' && (
          <ScreenMockupsGallery
            language={language}
            isOfflineSimulated={offlineSimulated}
            onToggleOfflineSim={() => setOfflineSimulated((v) => !v)}
            onTriggerStateDemo={handleTriggerStateDemo}
            onJumpToLiveScreen={(screen) => {
              if (screen === 'home') navigateToSection('home');
              else if (screen === 'compare') {
                setActiveSection('compare');
                setMobileShowInputs(false);
              } else if (screen === 'map') navigateToSection('map');
              else if (screen === 'buyer') {
                if (bestOption) setBuyerModalOptionId(bestOption.optionId);
              } else if (screen === 'ledger') {
                if (bestOption) handleInspectLedger(bestOption.optionId);
              }
            }}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8 pb-4 text-xs text-[#4A5951] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-stone-200 mt-10">
        <span>
          KisanMargin · Sample data for crop-selling net proceeds estimation — not a guaranteed price.
        </span>
        <span>
          Always verify moisture, weighing slip, and buyer identity before unloading.
        </span>
      </footer>

      {/* Mobile Fixed Thumb-Zone Bottom Bar (<= 15% aggregate sticky height with TopNav) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-12 bg-white/95 backdrop-blur-sm border-t border-stone-200 grid grid-cols-5"
      >
        {(
          [
            { id: 'home', label: t.navHome, icon: Home },
            { id: 'compare', label: t.navCompare, icon: BarChart3 },
            { id: 'map', label: t.navMap, icon: MapIcon },
            { id: 'alerts', label: t.navAlerts, icon: Bell },
            { id: 'mockups', label: t.navMockups, icon: Smartphone },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateToSection(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                active ? 'text-[#166534] font-semibold' : 'text-[#4A5951]'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="truncate max-w-[68px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        language={language}
        t={t}
        isOffline={isOffline}
        onApplyParsed={handleApplyVoiceParsed}
      />

      <BuyerDetailsModal
        buyer={buyerModalTarget}
        crop={activeCrop}
        quantityQuintals={inputs.quantityQuintals}
        language={language}
        t={t}
        onClose={() => setBuyerModalOptionId(null)}
        onOpenMandiMap={handleOpenMandiMap}
      />
    </div>
  );
}
