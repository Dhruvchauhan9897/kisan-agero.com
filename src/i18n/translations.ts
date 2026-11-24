import { LanguageCode } from '../types/kisan';

export const LANGUAGES: { code: LanguageCode; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
];

export interface TranslationStrings {
  navCompare: string;
  navLedger: string;
  navOutlook: string;
  navAlerts: string;
  heroTitle: string;
  heroSubtitle: string;
  voicePromptButton: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  selectCropLabel: string;
  quantityLabel: string;
  quintalsUnit: string;
  mspBenchmarkLabel: string;
  noMspLabel: string;
  regionLabel: string;
  villageLabel: string;
  villagePlaceholder: string;
  gradeLabel: string;
  gradeA: string;
  gradeFAQ: string;
  gradeB: string;
  moistureLabel: string;
  foreignMatterLabel: string;
  faqLimitText: string;
  withinFaq: string;
  aboveFaqCutApplies: string;
  vehicleLabel: string;
  transportModeAuto: string;
  transportModeManual: string;
  manualTransportLabel: string;
  ratePerKmLabel: string;
  customBuyerToggle: string;
  customBuyerName: string;
  customBuyerPrice: string;
  customBuyerDistance: string;
  customBuyerCommission: string;
  customBuyerCut: string;
  bestNetHeadline: string;
  highestListedTrapNote: string;
  highestListedMatchesBestNote: string;
  netProceedsLabel: string;
  netPerQuintalLabel: string;
  listedPriceLabel: string;
  totalDeductionsLabel: string;
  provenanceVerified: string;
  provenanceEstimate: string;
  provenanceUser: string;
  provenanceLegendTitle: string;
  provenanceLegendBody: string;
  visualComparisonTitle: string;
  netInHand: string;
  qualityCut: string;
  transportCost: string;
  feesCommission: string;
  rankedOptionsTitle: string;
  inspectLedgerBtn: string;
  selectedForLedger: string;
  ledgerTitle: string;
  ledgerSubtitle: string;
  grossValueLine: string;
  qualityMoistureLine: string;
  qualityFmLine: string;
  qualityGradeLine: string;
  qualityFlatWeightLine: string;
  transportLine: string;
  mandiFeeLine: string;
  commissionLine: string;
  hammaliLine: string;
  cleaningBaggingLine: string;
  overrideHint: string;
  resetOverrides: string;
  outlookTitle: string;
  outlookSubtitle: string;
  outlookDisclaimer: string;
  verifiedHistoryLegend: string;
  projectedRangeLegend: string;
  driversHeading: string;
  askOutlookExplain: string;
  explainingOutlook: string;
  alertsTitle: string;
  alertsSubtitle: string;
  setAlertHeading: string;
  targetNetPriceInput: string;
  saveAlertBtn: string;
  activeAdvisoriesHeading: string;
  savedAlertsHeading: string;
  noSavedAlerts: string;
  alertTriggeredLabel: string;
  alertWatchingLabel: string;
  voiceModalTitle: string;
  voiceModalSubtitle: string;
  startRecording: string;
  stopRecording: string;
  processingAudio: string;
  orTypePhrase: string;
  parseTextBtn: string;
  trySamplePhrases: string;
  detectedFieldsHeading: string;
  applyToCalculator: string;
  closeLabel: string;
  distanceUnitKm: string;
  paymentLabel: string;
  arrivalsLabel: string;
  navHome: string;
  navMap: string;
  navMockups: string;
  homeCtaCompare: string;
  recentSearchesTitle: string;
  localSnapshotTitle: string;
  sampleDataNotice: string;
  searchLocationPlaceholder: string;
  useCurrentLocation: string;
  locationRequesting: string;
  locationDeniedMsg: string;
  locationGrantedMsg: string;
  buyerDetailsBtn: string;
  buyerDetailsTitle: string;
  callBuyerBtn: string;
  messageBuyerBtn: string;
  verifiedContactLabel: string;
  unverifiedContactLabel: string;
  acceptedCropsLabel: string;
  businessDetailsLabel: string;
  timingsLabel: string;
  mandiMapTitle: string;
  getDirectionsBtn: string;
  mapUnavailableNote: string;
  routeSummaryLabel: string;
  expandCostsBtn: string;
  collapseCostsBtn: string;
  assumptionsTitle: string;
  notGuaranteedNote: string;
  loadingResultsTitle: string;
  noResultsTitle: string;
  resetFiltersBtn: string;
  offlineBannerText: string;
  reviewBeforeApply: string;
  confirmAndApplyBtn: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationStrings> = {
  en: {
    navCompare: 'Compare',
    navLedger: 'Cost Ledger',
    navOutlook: '7-Day Outlook',
    navAlerts: 'Alerts',
    heroTitle: 'Compare what you actually take home, not just the mandi rate',
    heroSubtitle:
      'Enter your crop, lot size, moisture, and location to compare net cash returns after transport, fees, and quality cuts.',
    voicePromptButton: 'Speak Crop Details',
    step1Title: '1. Crop & Quantity',
    step2Title: '2. Location & Quality',
    step3Title: '3. Transport & Fees',
    step4Title: '4. Add Local Buyer Quote',
    selectCropLabel: 'Select Crop',
    quantityLabel: 'Lot Quantity (Quintals)',
    quintalsUnit: 'qtl',
    mspBenchmarkLabel: 'Govt MSP Benchmark',
    noMspLabel: 'Market-driven crop (No MSP)',
    regionLabel: 'Nearest Market Belt',
    villageLabel: 'Village / Block (Optional)',
    villagePlaceholder: 'e.g. Bilkisganj, Block Sehore',
    gradeLabel: 'Visual Grade',
    gradeA: 'Grade A (Clean / Bold)',
    gradeFAQ: 'Standard FAQ',
    gradeB: 'Grade B (Shriveled / Stained)',
    moistureLabel: 'Estimated Moisture (%)',
    foreignMatterLabel: 'Dust / Foreign Matter (%)',
    faqLimitText: 'FAQ limit',
    withinFaq: 'Within standard FAQ limit',
    aboveFaqCutApplies: 'Above FAQ limit — quality cut estimated',
    vehicleLabel: 'Transport Vehicle',
    transportModeAuto: 'Estimate by distance',
    transportModeManual: 'Enter my freight quote',
    manualTransportLabel: 'Total Transport Quote (₹)',
    ratePerKmLabel: 'Est. Freight Rate (₹/km)',
    customBuyerToggle: 'Compare a local trader / mill offer',
    customBuyerName: 'Buyer Name',
    customBuyerPrice: 'Offered Rate (₹/qtl)',
    customBuyerDistance: 'Distance (km)',
    customBuyerCommission: 'Commission (%)',
    customBuyerCut: 'Quality / Weight Cut (%)',
    bestNetHeadline: 'Highest Estimated Net Return',
    highestListedTrapNote:
      'Highest listed rate is NOT the highest net cash. Transport and fees reduce that option below the winner.',
    highestListedMatchesBestNote:
      'This option offers both the top listed price and the highest estimated net return after costs.',
    netProceedsLabel: 'Estimated Net Proceeds',
    netPerQuintalLabel: 'Net ₹ / qtl',
    listedPriceLabel: 'Listed Rate',
    totalDeductionsLabel: 'Total Costs & Cuts',
    provenanceVerified: 'Verified Benchmark',
    provenanceEstimate: 'Estimate',
    provenanceUser: 'Your Input',
    provenanceLegendTitle: 'Data Transparency',
    provenanceLegendBody:
      'Mandi modal rates and MSP benchmarks are verified market figures. Transport freight, moisture cuts, and trader offers are estimates—tap any figure in the Cost Ledger to adjust.',
    visualComparisonTitle: 'Take-Home Cash vs. Selling Costs',
    netInHand: 'Net in Hand',
    qualityCut: 'Quality Cut',
    transportCost: 'Transport',
    feesCommission: 'Fees & Comm.',
    rankedOptionsTitle: 'All Selling Options Ranked by Net Return',
    inspectLedgerBtn: 'View Cost Breakdown',
    selectedForLedger: 'Shown in Ledger',
    ledgerTitle: 'Transparent Cost Ledger',
    ledgerSubtitle: 'Exact line-by-line calculation for the selected buyer',
    grossValueLine: 'Gross Crop Value',
    qualityMoistureLine: 'Excess Moisture Deduction',
    qualityFmLine: 'Foreign Matter / Dust Cut',
    qualityGradeLine: 'Grade Adjustment',
    qualityFlatWeightLine: 'Karda / Handling Weight Cut',
    transportLine: 'Estimated Transport Freight',
    mandiFeeLine: 'Mandi / Market Fee',
    commissionLine: 'Arthiya / Broker Commission',
    hammaliLine: 'Hammali, Unloading & Weighing',
    cleaningBaggingLine: 'Cleaning & Bagging',
    overrideHint: 'Adjust rate or distance for this buyer:',
    resetOverrides: 'Reset to defaults',
    outlookTitle: '7-Day Price Range Outlook',
    outlookSubtitle: 'Historical verified modal prices alongside an uncertain future range',
    outlookDisclaimer:
      'Forecast shows historical trends and an uncertain range—never a guaranteed selling price.',
    verifiedHistoryLegend: 'Verified Modal Price (Last 7 Days)',
    projectedRangeLegend: 'Uncertain Forecast Range (Next 7 Days)',
    driversHeading: 'Key Factors Behind This Range',
    askOutlookExplain: 'Explain Outlook in Plain Language',
    explainingOutlook: 'Analyzing market factors...',
    alertsTitle: 'Market Alerts & Advisories',
    alertsSubtitle: 'Watch target net returns and local arrival risks',
    setAlertHeading: 'Create Net Return Target Alert',
    targetNetPriceInput: 'Alert me if Net ₹/qtl reaches',
    saveAlertBtn: 'Save Target Alert',
    activeAdvisoriesHeading: 'Regional Market Advisories',
    savedAlertsHeading: 'Your Saved Target Alerts',
    noSavedAlerts: 'No target alerts saved yet. Set a target net price above to monitor options.',
    alertTriggeredLabel: 'Target Met Now',
    alertWatchingLabel: 'Watching',
    voiceModalTitle: 'Voice Crop Entry (Multilingual)',
    voiceModalSubtitle:
      'Speak naturally in Hindi, Marathi, Punjabi, Telugu, or English—or tap a sample phrase below.',
    startRecording: 'Tap to Speak',
    stopRecording: 'Stop Recording',
    processingAudio: 'Transcribing & extracting details...',
    orTypePhrase: 'Or type / edit what you want to sell',
    parseTextBtn: 'Extract Details',
    trySamplePhrases: 'Sample Phrases',
    detectedFieldsHeading: 'Detected Crop Details',
    applyToCalculator: 'Apply to Calculator',
    closeLabel: 'Close',
    distanceUnitKm: 'km',
    paymentLabel: 'Payment',
    arrivalsLabel: 'Today Arrivals',
    navHome: 'Home',
    navMap: 'Mandi Map',
    navMockups: 'Screens',
    homeCtaCompare: 'Compare selling options',
    recentSearchesTitle: 'Recent Searches',
    localSnapshotTitle: 'Local Market Snapshot',
    sampleDataNotice:
      'Sample Data: Prices, buyer contacts, and mandi coordinates shown here are realistic sample data for estimation only—never a guaranteed rate.',
    searchLocationPlaceholder: 'Search district, town, or mandi...',
    useCurrentLocation: 'Use Current Location',
    locationRequesting: 'Checking location...',
    locationDeniedMsg:
      'Location permission denied. Search your district or choose a market belt below.',
    locationGrantedMsg: 'Location matched to nearest market belt',
    buyerDetailsBtn: 'Contact Buyer',
    buyerDetailsTitle: 'Buyer & Mandi Details',
    callBuyerBtn: 'Call Buyer',
    messageBuyerBtn: 'Message',
    verifiedContactLabel: 'Verified Contact (Sample)',
    unverifiedContactLabel: 'Unverified Buyer Details — Confirm directly',
    acceptedCropsLabel: 'Accepted Crops',
    businessDetailsLabel: 'Business & Weighing Details',
    timingsLabel: 'Market Hours',
    mandiMapTitle: 'Mandi Locations & Directions',
    getDirectionsBtn: 'Get Directions',
    mapUnavailableNote: 'Farmgate pickup — no mandi travel or map directions needed.',
    routeSummaryLabel: 'Route & Distance Summary',
    expandCostsBtn: 'Show cost breakdown',
    collapseCostsBtn: 'Hide cost breakdown',
    assumptionsTitle: 'Calculation Formula & Assumptions',
    notGuaranteedNote: 'Estimate only — not a guaranteed price or earning.',
    loadingResultsTitle: 'Comparing nearby mandis and calculating net proceeds...',
    noResultsTitle: 'No buyers match your current filter',
    resetFiltersBtn: 'Reset Filters',
    offlineBannerText:
      'You are offline — showing saved sample rates. Local net proceeds calculator still works.',
    reviewBeforeApply: 'Review & correct details before submitting:',
    confirmAndApplyBtn: 'Confirm & Compare Options',
  },
  hi: {
    navCompare: 'तुलना',
    navLedger: 'खर्च हिसाब',
    navOutlook: '7-दिन अनुमान',
    navAlerts: 'अलर्ट',
    heroTitle: 'सिर्फ मंडी भाव नहीं, हाथ में आने वाली शुद्ध कमाई देखें',
    heroSubtitle:
      'अपनी फसल, मात्रा, नमी और स्थान डालें और किराया, कमीशन और क्वालिटी कटौती के बाद शुद्ध कमाई की तुलना करें।',
    voicePromptButton: 'बोलकर भरें',
    step1Title: '1. फसल और मात्रा',
    step2Title: '2. स्थान और गुणवत्ता',
    step3Title: '3. भाड़ा और मंडी खर्च',
    step4Title: '4. स्थानीय व्यापारी भाव जोड़ें',
    selectCropLabel: 'फसल चुनें',
    quantityLabel: 'कुल मात्रा (क्विंटल)',
    quintalsUnit: 'क्विंटल',
    mspBenchmarkLabel: 'सरकारी MSP दर',
    noMspLabel: 'बाज़ार आधारित फसल (MSP नहीं)',
    regionLabel: 'नज़दीकी मंडी क्षेत्र',
    villageLabel: 'गाँव / ब्लॉक (वैकल्पिक)',
    villagePlaceholder: 'जैसे: बिलकिसगंज, सीहोर',
    gradeLabel: 'फसल ग्रेड',
    gradeA: 'ग्रेड A (साफ व चमकदार)',
    gradeFAQ: 'सामान्य FAQ',
    gradeB: 'ग्रेड B (हल्का दाना / दागी)',
    moistureLabel: 'अनुमानित नमी (%)',
    foreignMatterLabel: 'कचरा / मिट्टी (%)',
    faqLimitText: 'FAQ सीमा',
    withinFaq: 'मानक FAQ सीमा के भीतर',
    aboveFaqCutApplies: 'FAQ से अधिक — अनुमानित कटौती लागू',
    vehicleLabel: 'परिवहन वाहन',
    transportModeAuto: 'दूरी से अनुमान',
    transportModeManual: 'मेरा किराया दर्ज करें',
    manualTransportLabel: 'कुल गाड़ी किराया (₹)',
    ratePerKmLabel: 'अनुमानित किराया (₹/किमी)',
    customBuyerToggle: 'स्थानीय व्यापारी / मिल का भाव जोड़ें',
    customBuyerName: 'खरीदार का नाम',
    customBuyerPrice: 'बोला गया भाव (₹/क्विंटल)',
    customBuyerDistance: 'दूरी (किमी)',
    customBuyerCommission: 'कमीशन / आढ़त (%)',
    customBuyerCut: 'क्वालिटी / वजन कटौती (%)',
    bestNetHeadline: 'सबसे ज़्यादा शुद्ध कमाई वाला विकल्प',
    highestListedTrapNote:
      'सबसे ऊँचा मंडी भाव सबसे ज़्यादा शुद्ध कमाई नहीं दे रहा। दूरी व खर्च के कारण नज़दीकी विकल्प बेहतर है।',
    highestListedMatchesBestNote:
      'यह विकल्प सबसे ऊँचा भाव और खर्च के बाद सबसे ज़्यादा शुद्ध कमाई दोनों दे रहा है।',
    netProceedsLabel: 'अनुमानित शुद्ध कमाई',
    netPerQuintalLabel: 'शुद्ध ₹ / क्विंटल',
    listedPriceLabel: 'मंडी / खरीदार भाव',
    totalDeductionsLabel: 'कुल खर्च व कटौती',
    provenanceVerified: 'सत्यापित दर',
    provenanceEstimate: 'अनुमान',
    provenanceUser: 'आपका इनपुट',
    provenanceLegendTitle: 'डेटा स्पष्टता',
    provenanceLegendBody:
      'मंडी मोडल भाव और MSP सत्यापित सरकारी डेटा हैं। किराया, नमी कटौती और स्थानीय व्यापारी भाव अनुमान हैं — नीचे हिसाब में बदल सकते हैं।',
    visualComparisonTitle: 'हाथ में नकद बनाम कुल खर्च',
    netInHand: 'शुद्ध कमाई',
    qualityCut: 'क्वालिटी कटौती',
    transportCost: 'भाड़ा',
    feesCommission: 'मंडी शुल्क व आढ़त',
    rankedOptionsTitle: 'शुद्ध कमाई के अनुसार सभी विकल्प',
    inspectLedgerBtn: 'पूरा हिसाब देखें',
    selectedForLedger: 'हिसाब में चयनित',
    ledgerTitle: 'पारदर्शी खर्च हिसाब (लेजर)',
    ledgerSubtitle: 'चयनित खरीदार के लिए एक-एक रुपये का विवरण',
    grossValueLine: 'फसल की कुल कीमत',
    qualityMoistureLine: 'अधिक नमी कटौती',
    qualityFmLine: 'कचरा / मिट्टी कटौती',
    qualityGradeLine: 'ग्रेड अंतर',
    qualityFlatWeightLine: 'करदा / तुलाई वजन कटौती',
    transportLine: 'अनुमानित वाहन भाड़ा',
    mandiFeeLine: 'मंडी शुल्क',
    commissionLine: 'आढ़त / दलाली',
    hammaliLine: 'हम्माली, तुलाई व उतराई',
    cleaningBaggingLine: 'सफाई व भराई',
    overrideHint: 'इस खरीदार का भाव या दूरी बदलें:',
    resetOverrides: 'डिफ़ॉल्ट पर रीसेट करें',
    outlookTitle: '7-दिन संभावित भाव दायरा',
    outlookSubtitle: 'पिछले 7 दिनों के सत्यापित भाव और अगले 7 दिनों की संभावित सीमा',
    outlookDisclaimer:
      'यह अनुमान पिछले रुझान और संभावित दायरा दिखाता है — यह गारंटीड भाव नहीं है।',
    verifiedHistoryLegend: 'सत्यापित मंडी भाव (पिछले 7 दिन)',
    projectedRangeLegend: 'अनुमानित दायरा (अगले 7 दिन)',
    driversHeading: 'इस दायरे के मुख्य कारण',
    askOutlookExplain: 'सरल भाषा में कारण समझें',
    explainingOutlook: 'बाज़ार के कारण समझे जा रहे हैं...',
    alertsTitle: 'बाज़ार अलर्ट व सलाह',
    alertsSubtitle: 'लक्ष्य शुद्ध भाव और आवक जोखिम पर नज़र रखें',
    setAlertHeading: 'शुद्ध कमाई लक्ष्य अलर्ट जोड़ें',
    targetNetPriceInput: 'जब शुद्ध ₹/क्विंटल पहुंचे',
    saveAlertBtn: 'अलर्ट सेव करें',
    activeAdvisoriesHeading: 'क्षेत्रीय बाज़ार सलाह',
    savedAlertsHeading: 'आपके सेव किए गए अलर्ट',
    noSavedAlerts: 'अभी कोई अलर्ट सेव नहीं है। ऊपर लक्ष्य शुद्ध भाव दर्ज करें।',
    alertTriggeredLabel: 'लक्ष्य पूरा हुआ',
    alertWatchingLabel: 'निगरानी में',
    voiceModalTitle: 'बोलकर फसल जानकारी भरें',
    voiceModalSubtitle:
      'हिन्दी, मराठी, पंजाबी, तेलुगु या अंग्रेज़ी में बोलें — या नीचे उदाहरण चुनें।',
    startRecording: 'बोलने के लिए दबाएं',
    stopRecording: 'रोकें',
    processingAudio: 'आवाज़ समझी जा रही है...',
    orTypePhrase: 'या अपनी बात यहाँ लिखें',
    parseTextBtn: 'जानकारी निकालें',
    trySamplePhrases: 'उदाहरण वाक्य',
    detectedFieldsHeading: 'पहचानी गई जानकारी',
    applyToCalculator: 'कैलकुलेटर में भरें',
    closeLabel: 'बंद करें',
    distanceUnitKm: 'किमी',
    paymentLabel: 'भुगतान',
    arrivalsLabel: 'आज की आवक',
    navHome: 'होम',
    navMap: 'मंडी नक्शा',
    navMockups: 'स्क्रीन',
    homeCtaCompare: 'बिक्री विकल्पों की तुलना करें',
    recentSearchesTitle: 'हाल की खोजें',
    localSnapshotTitle: 'स्थानीय मंडी झलक',
    sampleDataNotice:
      'नमूना डेटा: यहाँ दिखाए गए भाव, खरीदार नंबर और मंडी स्थान केवल अनुमान के लिए नमूना डेटा हैं — यह गारंटीड भाव नहीं है।',
    searchLocationPlaceholder: 'जिला, शहर या मंडी खोजें...',
    useCurrentLocation: 'मेरा वर्तमान स्थान उपयोग करें',
    locationRequesting: 'स्थान जांचा जा रहा है...',
    locationDeniedMsg:
      'स्थान अनुमति अस्वीकृत। नीचे अपना जिला खोजें या मंडी क्षेत्र चुनें।',
    locationGrantedMsg: 'नज़दीकी मंडी क्षेत्र से मिलान हुआ',
    buyerDetailsBtn: 'खरीदार से संपर्क करें',
    buyerDetailsTitle: 'खरीदार व मंडी विवरण',
    callBuyerBtn: 'कॉल करें',
    messageBuyerBtn: 'संदेश भेजें',
    verifiedContactLabel: 'सत्यापित संपर्क (नमूना)',
    unverifiedContactLabel: 'असत्यापित खरीदार विवरण — सीधे पुष्टि करें',
    acceptedCropsLabel: 'स्वीकृत फसलें',
    businessDetailsLabel: 'व्यापार व तुलाई विवरण',
    timingsLabel: 'खुलने का समय',
    mandiMapTitle: 'मंडी स्थान और रास्ता',
    getDirectionsBtn: 'रास्ता देखें (Directions)',
    mapUnavailableNote: 'खेत से पिकअप — मंडी यात्रा या नक्शे की आवश्यकता नहीं।',
    routeSummaryLabel: 'रास्ता और दूरी सारांश',
    expandCostsBtn: 'खर्च विवरण देखें',
    collapseCostsBtn: 'खर्च विवरण छुपाएं',
    assumptionsTitle: 'गणना सूत्र व मान्यताएँ',
    notGuaranteedNote: 'केवल अनुमान — यह पक्का या गारंटीड भाव नहीं है।',
    loadingResultsTitle: 'नज़दीकी मंडियों और शुद्ध कमाई की गणना हो रही है...',
    noResultsTitle: 'आपके फ़िल्टर से कोई खरीदार नहीं मिला',
    resetFiltersBtn: 'फ़िल्टर रीसेट करें',
    offlineBannerText:
      'आप ऑफ़लाइन हैं — सेव किया गया नमूना डेटा दिख रहा है। शुद्ध कमाई कैलकुलेटर काम कर रहा है।',
    reviewBeforeApply: 'जमा करने से पहले विवरण जांचें और सुधारें:',
    confirmAndApplyBtn: 'पुष्टि करें और तुलना देखें',
  },
  mr: {
    navCompare: 'तुलना',
    navLedger: 'खर्च हिशोब',
    navOutlook: '७-दिवस अंदाज',
    navAlerts: 'अलर्ट',
    heroTitle: 'फक्त बाजारभाव नाही, हातात येणारे निव्वळ उत्पन्न पहा',
    heroSubtitle:
      'पीक, प्रमाण, ओलावा आणि ठिकाण निवडा आणि वाहतूक, आडत व प्रतवारी कपातीनंतर निव्वळ नफ्याची तुलना करा.',
    voicePromptButton: 'बोलून भरा',
    step1Title: '१. पीक आणि प्रमाण',
    step2Title: '२. ठिकाण आणि प्रत',
    step3Title: '३. वाहतूक आणि खर्च',
    step4Title: '४. स्थानिक खरेदीदार दर जोडा',
    selectCropLabel: 'पीक निवडा',
    quantityLabel: 'एकूण प्रमाण (क्विंटल)',
    quintalsUnit: 'क्विंटल',
    mspBenchmarkLabel: 'सरकारी हमीभाव (MSP)',
    noMspLabel: 'बाजार आधारित पीक (MSP नाही)',
    regionLabel: 'जवळचा बाजार विभाग',
    villageLabel: 'गाव / तालुका (ऐच्छिक)',
    villagePlaceholder: 'उदा. निफाड, नाशिक',
    gradeLabel: 'पिकाची प्रत',
    gradeA: 'प्रत A (स्वच्छ व टपोरा)',
    gradeFAQ: 'मानक FAQ',
    gradeB: 'प्रत B (कमी दर्जा / डागाळलेला)',
    moistureLabel: 'अंदाजे ओलावा (%)',
    foreignMatterLabel: 'कचरा / माती (%)',
    faqLimitText: 'FAQ मर्यादा',
    withinFaq: 'मानक FAQ मर्यादेत',
    aboveFaqCutApplies: 'मर्यादेपेक्षा जास्त — अंदाजे कपात लागू',
    vehicleLabel: 'वाहतूक वाहन',
    transportModeAuto: 'अंतरानुसार अंदाज',
    transportModeManual: 'माझे भाडे भरा',
    manualTransportLabel: 'एकूण वाहन भाडे (₹)',
    ratePerKmLabel: 'अंदाजे दर (₹/किमी)',
    customBuyerToggle: 'स्थानिक व्यापारी / मिल दर जोडा',
    customBuyerName: 'खरेदीदाराचे नाव',
    customBuyerPrice: 'दिलेला दर (₹/क्विंटल)',
    customBuyerDistance: 'अंतर (किमी)',
    customBuyerCommission: 'आडत / कमिशन (%)',
    customBuyerCut: 'प्रतवारी / घट कपात (%)',
    bestNetHeadline: 'सर्वाधिक निव्वळ परतावा देणारा पर्याय',
    highestListedTrapNote:
      'सर्वाधिक बाजारभाव म्हणजे सर्वाधिक निव्वळ नफा नव्हे. वाहतूक व कपातीमुळे जवळचा पर्याय फायदेशीर ठरतो.',
    highestListedMatchesBestNote:
      'हा पर्याय सर्वाधिक दर आणि खर्च वजा जाता सर्वाधिक निव्वळ उत्पन्न दोन्ही देतो.',
    netProceedsLabel: 'अंदाजे निव्वळ रक्कम',
    netPerQuintalLabel: 'निव्वळ ₹ / क्विंटल',
    listedPriceLabel: 'बाजारभाव',
    totalDeductionsLabel: 'एकूण खर्च व कपात',
    provenanceVerified: 'प्रमाणित दर',
    provenanceEstimate: 'अंदाज',
    provenanceUser: 'तुमची नोंद',
    provenanceLegendTitle: 'माहितीची स्पष्टता',
    provenanceLegendBody:
      'बाजार समितीचे दर व MSP प्रमाणित आहेत. भाडे, ओलावा कपात व व्यापारी दर हे अंदाज आहेत — तुम्ही ते बदलू शकता.',
    visualComparisonTitle: 'हातात येणारी रक्कम विरुद्ध खर्च',
    netInHand: 'निव्वळ रक्कम',
    qualityCut: 'प्रत कपात',
    transportCost: 'वाहतूक',
    feesCommission: 'फी व आडत',
    rankedOptionsTitle: 'निव्वळ उत्पन्नानुसार सर्व पर्याय',
    inspectLedgerBtn: 'खर्च तपशील पहा',
    selectedForLedger: 'हिशोबात निवडलेले',
    ledgerTitle: 'पारदर्शक खर्च हिशोब',
    ledgerSubtitle: 'निवडलेल्या खरेदीदारासाठी प्रत्येक खर्चाचा तपशील',
    grossValueLine: 'एकूण पीक मूल्य',
    qualityMoistureLine: 'जादा ओलावा कपात',
    qualityFmLine: 'कचरा / काडीकचरा कपात',
    qualityGradeLine: 'प्रत तफावत',
    qualityFlatWeightLine: 'करदा / वजन घट कपात',
    transportLine: 'अंदाजे वाहतूक खर्च',
    mandiFeeLine: 'बाजार समिती शुल्क',
    commissionLine: 'आडत / दलाली',
    hammaliLine: 'हमाली, तोलाई व उतराई',
    cleaningBaggingLine: 'चाळणी व भरणाई',
    overrideHint: 'या खरेदीदाराचा दर किंवा अंतर बदला:',
    resetOverrides: 'मूळ आकडे आणा',
    outlookTitle: '७-दिवसांचा संभाव्य दर अंदाज',
    outlookSubtitle: 'मागील ७ दिवसांचे प्रमाणित दर आणि पुढील संभाव्य मर्यादा',
    outlookDisclaimer:
      'हा अंदाज मागील कल आणि संभाव्य श्रेणी दाखवतो — ही हमीची किंमत नाही.',
    verifiedHistoryLegend: 'प्रमाणित बाजारभाव (मागील ७ दिवस)',
    projectedRangeLegend: 'संभाव्य श्रेणी (पुढील ७ दिवस)',
    driversHeading: 'या अंदाजामागील मुख्य घटक',
    askOutlookExplain: 'सोप्या भाषेत विश्लेषण पहा',
    explainingOutlook: 'बाजार घटकांचे विश्लेषण सुरू आहे...',
    alertsTitle: 'बाजार अलर्ट आणि सूचना',
    alertsSubtitle: 'लक्ष्य निव्वळ दर आणि आवक जोखमीवर लक्ष ठेवा',
    setAlertHeading: 'निव्वळ उत्पन्न लक्ष्य अलर्ट लावा',
    targetNetPriceInput: 'निव्वळ ₹/क्विंटल पोहोचल्यास कळवा',
    saveAlertBtn: 'अलर्ट सेव्ह करा',
    activeAdvisoriesHeading: 'प्रादेशिक बाजार सूचना',
    savedAlertsHeading: 'तुमचे अलर्ट',
    noSavedAlerts: 'अद्याप कोणताही अलर्ट नाही. वर लक्ष्य दर भरा.',
    alertTriggeredLabel: 'लक्ष्य पूर्ण झाले',
    alertWatchingLabel: 'निरीक्षणात',
    voiceModalTitle: 'बोलून माहिती भरा',
    voiceModalSubtitle: 'मराठी, हिंदी, पंजाबी, तेलुगू किंवा इंग्रजीत बोला किंवा नमुना निवडा.',
    startRecording: 'बोलण्यासाठी दाबा',
    stopRecording: 'थांबवा',
    processingAudio: 'आवाज तपासत आहे...',
    orTypePhrase: 'किंवा तुमचा तपशील टाइप करा',
    parseTextBtn: 'तपशील काढा',
    trySamplePhrases: 'नमुना वाक्ये',
    detectedFieldsHeading: 'ओळखलेली माहिती',
    applyToCalculator: 'कॅल्क्युलेटरमध्ये भरा',
    closeLabel: 'बंद करा',
    distanceUnitKm: 'किमी',
    paymentLabel: 'पैसे मिळण्याची वेळ',
    arrivalsLabel: 'आजची आवक',
    navHome: 'होम',
    navMap: 'बाजार नकाशा',
    navMockups: 'स्क्रीन्स',
    homeCtaCompare: 'विक्री पर्यायांची तुलना करा',
    recentSearchesTitle: 'अलीकडील शोध',
    localSnapshotTitle: 'स्थानिक बाजार स्थिती',
    sampleDataNotice:
      'नमुना डेटा: येथील दर, संपर्क क्रमांक व बाजार ठिकाणे केवळ अंदाजासाठी नमुना डेटा आहेत — ही हमीची किंमत नाही.',
    searchLocationPlaceholder: 'जिल्हा, शहर किंवा बाजार शोधा...',
    useCurrentLocation: 'सध्याचे ठिकाण वापरा',
    locationRequesting: 'ठिकाण शोधत आहे...',
    locationDeniedMsg:
      'लोकेशन परवानगी नाकारली. खालील यादीतून तुमचा जिल्हा किंवा बाजार निवडा.',
    locationGrantedMsg: 'जवळच्या बाजार विभागाशी जुळले',
    buyerDetailsBtn: 'खरेदीदाराशी संपर्क साधा',
    buyerDetailsTitle: 'खरेदीदार व बाजार तपशील',
    callBuyerBtn: 'कॉल करा',
    messageBuyerBtn: 'संदेश पाठवा',
    verifiedContactLabel: 'प्रमाणित संपर्क (नमुना)',
    unverifiedContactLabel: 'अप्रमाणित माहिती — थेट खात्री करा',
    acceptedCropsLabel: 'स्वीकारलेली पिके',
    businessDetailsLabel: 'व्यवसाय व वजन तपशील',
    timingsLabel: 'बाजार वेळ',
    mandiMapTitle: 'बाजार ठिकाण व दिशा',
    getDirectionsBtn: 'दिशा पहा (Directions)',
    mapUnavailableNote: 'शेतातून उचल — बाजारात जाण्याची गरज नाही.',
    routeSummaryLabel: 'मार्ग व अंतर सारांश',
    expandCostsBtn: 'खर्च तपशील पहा',
    collapseCostsBtn: 'खर्च तपशील लपवा',
    assumptionsTitle: 'गणना सूत्र व गृहीतके',
    notGuaranteedNote: 'केवळ अंदाज — ही खात्रीशीर किंमत किंवा उत्पन्न नाही.',
    loadingResultsTitle: 'जवळचे बाजार आणि निव्वळ उत्पन्न मोजत आहे...',
    noResultsTitle: 'निवडलेल्या फिल्टरमध्ये खरेदीदार सापडले नाहीत',
    resetFiltersBtn: 'फिल्टर रीसेट करा',
    offlineBannerText:
      'तुम्ही ऑफलाइन आहात — जतन केलेला नमुना डेटा दिसत आहे. कॅल्क्युलेटर सुरू आहे.',
    reviewBeforeApply: 'सबमिट करण्यापूर्वी तपशील तपासा आणि दुरुस्त करा:',
    confirmAndApplyBtn: 'खात्री करा व तुलना पहा',
  },
  pa: {
    navCompare: 'ਤੁਲਨਾ',
    navLedger: 'ਖਰਚਾ ਹਿਸਾਬ',
    navOutlook: '7-ਦਿਨ ਅਨੁਮਾਨ',
    navAlerts: 'ਅਲਰਟ',
    heroTitle: 'ਸਿਰਫ਼ ਮੰਡੀ ਭਾਅ ਨਹੀਂ, ਖਰਚੇ ਕੱਢ ਕੇ ਸ਼ੁੱਧ ਕਮਾਈ ਵੇਖੋ',
    heroSubtitle:
      'ਆਪਣੀ ਫ਼ਸਲ, ਮਾਤਰਾ, ਨਮੀ ਅਤੇ ਥਾਂ ਭਰੋ ਅਤੇ ਕਿਰਾਏ, ਆੜ੍ਹਤ ਤੇ ਕਟੌਤੀ ਤੋਂ ਬਾਅਦ ਸ਼ੁੱਧ ਬੱਚਤ ਦੀ ਤੁਲਨਾ ਕਰੋ।',
    voicePromptButton: 'ਬੋਲ ਕੇ ਭਰੋ',
    step1Title: '1. ਫ਼ਸਲ ਅਤੇ ਮਾਤਰਾ',
    step2Title: '2. ਥਾਂ ਅਤੇ ਗੁਣਵੱਤਾ',
    step3Title: '3. ਢੋਆ-ਢੁਆਈ ਤੇ ਖਰਚੇ',
    step4Title: '4. ਸਥਾਨਕ ਵਪਾਰੀ ਭਾਅ ਜੋੜੋ',
    selectCropLabel: 'ਫ਼ਸਲ ਚੁਣੋ',
    quantityLabel: 'ਕੁੱਲ ਮਾਤਰਾ (ਕੁਇੰਟਲ)',
    quintalsUnit: 'ਕੁਇੰਟਲ',
    mspBenchmarkLabel: 'ਸਰਕਾਰੀ MSP ਦਰ',
    noMspLabel: 'ਮੰਡੀ ਅਧਾਰਤ ਫ਼ਸਲ (MSP ਨਹੀਂ)',
    regionLabel: 'ਨੇੜਲਾ ਮੰਡੀ ਇਲਾਕਾ',
    villageLabel: 'ਪਿੰਡ / ਬਲਾਕ (ਵਿਕਲਪਿਕ)',
    villagePlaceholder: 'ਜਿਵੇਂ: ਸਮਰਾਲਾ, ਲੁਧਿਆਣਾ',
    gradeLabel: 'ਫ਼ਸਲ ਗ੍ਰੇਡ',
    gradeA: 'ਗ੍ਰੇਡ A (ਸਾਫ਼ ਤੇ ਵਧੀਆ)',
    gradeFAQ: 'ਆਮ FAQ',
    gradeB: 'ਗ੍ਰੇਡ B (ਹਲਕਾ ਦਾਣਾ)',
    moistureLabel: 'ਅਨੁਮਾਨਿਤ ਨਮੀ (%)',
    foreignMatterLabel: 'ਮਿੱਟੀ / ਕੂੜਾ (%)',
    faqLimitText: 'FAQ ਸੀਮਾ',
    withinFaq: 'ਮਿਆਰੀ FAQ ਸੀਮਾ ਅੰਦਰ',
    aboveFaqCutApplies: 'ਸੀਮਾ ਤੋਂ ਵੱਧ — ਅੰਦਾਜ਼ਨ ਕਟੌਤੀ ਲਾਗੂ',
    vehicleLabel: 'ਵਾਹਨ ਚੁਣੋ',
    transportModeAuto: 'ਦੂਰੀ ਅਨੁਸਾਰ ਅੰਦਾਜ਼ਾ',
    transportModeManual: 'ਮੇਰਾ ਕਿਰਾਇਆ ਭਰੋ',
    manualTransportLabel: 'ਕੁੱਲ ਟਰਾਂਸਪੋਰਟ ਕਿਰਾਇਆ (₹)',
    ratePerKmLabel: 'ਅੰਦਾਜ਼ਨ ਦਰ (₹/ਕਿਮੀ)',
    customBuyerToggle: 'ਸਥਾਨਕ ਵਪਾਰੀ / ਮਿੱਲ ਦਾ ਭਾਅ ਜੋੜੋ',
    customBuyerName: 'ਖਰੀਦਦਾਰ ਦਾ ਨਾਮ',
    customBuyerPrice: 'ਪੇਸ਼ਕਸ਼ ਭਾਅ (₹/ਕੁਇੰਟਲ)',
    customBuyerDistance: 'ਦੂਰੀ (ਕਿਮੀ)',
    customBuyerCommission: 'ਆੜ੍ਹਤ / ਕਮਿਸ਼ਨ (%)',
    customBuyerCut: 'ਗੁਣਵੱਤਾ / ਵਜ਼ਨ ਕੱਟ (%)',
    bestNetHeadline: 'ਸਭ ਤੋਂ ਵੱਧ ਸ਼ੁੱਧ ਕਮਾਈ ਵਾਲਾ ਵਿਕਲਪ',
    highestListedTrapNote:
      'ਸਭ ਤੋਂ ਉੱਚਾ ਮੰਡੀ ਭਾਅ ਸਭ ਤੋਂ ਵੱਧ ਸ਼ੁੱਧ ਬੱਚਤ ਨਹੀਂ ਦਿੰਦਾ। ਕਿਰਾਏ ਤੇ ਖਰਚਿਆਂ ਕਾਰਨ ਨੇੜਲਾ ਵਿਕਲਪ ਬਿਹਤਰ ਹੈ।',
    highestListedMatchesBestNote:
      'ਇਹ ਵਿਕਲਪ ਸਭ ਤੋਂ ਉੱਚਾ ਭਾਅ ਅਤੇ ਖਰਚੇ ਕੱਢ ਕੇ ਸਭ ਤੋਂ ਵੱਧ ਸ਼ੁੱਧ ਕਮਾਈ ਦੋਵੇਂ ਦਿੰਦਾ ਹੈ।',
    netProceedsLabel: 'ਅੰਦਾਜ਼ਨ ਸ਼ੁੱਧ ਕਮਾਈ',
    netPerQuintalLabel: 'ਸ਼ੁੱਧ ₹ / ਕੁਇੰਟਲ',
    listedPriceLabel: 'ਮੰਡੀ ਭਾਅ',
    totalDeductionsLabel: 'ਕੁੱਲ ਖਰਚੇ ਤੇ ਕਟੌਤੀ',
    provenanceVerified: 'ਪ੍ਰਮਾਣਿਤ ਦਰ',
    provenanceEstimate: 'ਅੰਦਾਜ਼ਾ',
    provenanceUser: 'ਤੁਹਾਡੀ ਐਂਟਰੀ',
    provenanceLegendTitle: 'ਡੇਟਾ ਸਪਸ਼ਟਤਾ',
    provenanceLegendBody:
      'ਮੰਡੀ ਦਰਾਂ ਤੇ MSP ਪ੍ਰਮਾਣਿਤ ਹਨ। ਕਿਰਾਇਆ, ਨਮੀ ਕੱਟ ਤੇ ਵਪਾਰੀ ਭਾਅ ਅੰਦਾਜ਼ੇ ਹਨ — ਤੁਸੀਂ ਹਿਸਾਬ ਵਿੱਚ ਬਦਲ ਸਕਦੇ ਹੋ।',
    visualComparisonTitle: 'ਹੱਥ ਆਈ ਰਕਮ ਬਨਾਮ ਖਰਚੇ',
    netInHand: 'ਸ਼ੁੱਧ ਰਕਮ',
    qualityCut: 'ਗੁਣਵੱਤਾ ਕੱਟ',
    transportCost: 'ਕਿਰਾਇਆ',
    feesCommission: 'ਫ਼ੀਸ ਤੇ ਆੜ੍ਹਤ',
    rankedOptionsTitle: 'ਸ਼ੁੱਧ ਕਮਾਈ ਅਨੁਸਾਰ ਸਾਰੇ ਵਿਕਲਪ',
    inspectLedgerBtn: 'ਪੂਰਾ ਹਿਸਾਬ ਵੇਖੋ',
    selectedForLedger: 'ਹਿਸਾਬ ਵਿੱਚ ਚੁਣਿਆ',
    ledgerTitle: 'ਪਾਰਦਰਸ਼ੀ ਖਰਚਾ ਹਿਸਾਬ',
    ledgerSubtitle: 'ਚੁਣੇ ਖਰੀਦਦਾਰ ਲਈ ਹਰ ਰੁਪਏ ਦਾ ਵੇਰਵਾ',
    grossValueLine: 'ਫ਼ਸਲ ਦੀ ਕੁੱਲ ਕੀਮਤ',
    qualityMoistureLine: 'ਵਾਧੂ ਨਮੀ ਕਟੌਤੀ',
    qualityFmLine: 'ਮਿੱਟੀ / ਕੂੜਾ ਕਟੌਤੀ',
    qualityGradeLine: 'ਗ੍ਰੇਡ ਫ਼ਰਕ',
    qualityFlatWeightLine: 'ਕਰਦਾ / ਵਜ਼ਨ ਕਟੌਤੀ',
    transportLine: 'ਅੰਦਾਜ਼ਨ ਢੋਆ-ਢੁਆਈ ਕਿਰਾਇਆ',
    mandiFeeLine: 'ਮੰਡੀ ਫ਼ੀਸ',
    commissionLine: 'ਆੜ੍ਹਤ / ਦਲਾਲੀ',
    hammaliLine: 'ਤੁਲਾਈ, ਲਹਾਈ ਤੇ ਮਜ਼ਦੂਰੀ',
    cleaningBaggingLine: 'ਸਫ਼ਾਈ ਤੇ ਭਰਾਈ',
    overrideHint: 'ਇਸ ਖਰੀਦਦਾਰ ਦਾ ਭਾਅ ਜਾਂ ਦੂਰੀ ਬਦਲੋ:',
    resetOverrides: 'ਪਹਿਲਾਂ ਵਰਗਾ ਕਰੋ',
    outlookTitle: '7-ਦਿਨ ਸੰਭਾਵਿਤ ਭਾਅ ਦਾਇਰਾ',
    outlookSubtitle: 'ਪਿਛਲੇ 7 ਦਿਨਾਂ ਦੇ ਪ੍ਰਮਾਣਿਤ ਭਾਅ ਅਤੇ ਅਗਲੇ ਦਿਨਾਂ ਦੀ ਸੰਭਾਵਿਤ ਰੇਂਜ',
    outlookDisclaimer:
      'ਇਹ ਅਨੁਮਾਨ ਪਿਛਲੇ ਰੁਝਾਨ ਤੇ ਸੰਭਾਵਿਤ ਦਾਇਰਾ ਦਿਖਾਉਂਦਾ ਹੈ — ਇਹ ਪੱਕੀ ਕੀਮਤ ਨਹੀਂ ਹੈ।',
    verifiedHistoryLegend: 'ਪ੍ਰਮਾਣਿਤ ਮੰਡੀ ਭਾਅ (ਪਿਛਲੇ 7 ਦਿਨ)',
    projectedRangeLegend: 'ਸੰਭਾਵਿਤ ਰੇਂਜ (ਅਗਲੇ 7 ਦਿਨ)',
    driversHeading: 'ਇਸ ਦਾਇਰੇ ਦੇ ਮੁੱਖ ਕਾਰਨ',
    askOutlookExplain: 'ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝੋ',
    explainingOutlook: 'ਮੰਡੀ ਕਾਰਨਾਂ ਦੀ ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...',
    alertsTitle: 'ਮੰਡੀ ਅਲਰਟ ਤੇ ਸਲਾਹ',
    alertsSubtitle: 'ਟੀਚਾ ਸ਼ੁੱਧ ਭਾਅ ਤੇ ਆਮਦ ਦੇ ਜੋਖ਼ਮ ਉੱਤੇ ਨਜ਼ਰ ਰੱਖੋ',
    setAlertHeading: 'ਸ਼ੁੱਧ ਕਮਾਈ ਟੀਚਾ ਅਲਰਟ ਲਗਾਓ',
    targetNetPriceInput: 'ਜਦੋਂ ਸ਼ੁੱਧ ₹/ਕੁਇੰਟਲ ਪਹੁੰਚੇ',
    saveAlertBtn: 'ਅਲਰਟ ਸੇਵ ਕਰੋ',
    activeAdvisoriesHeading: 'ਖੇਤਰੀ ਮੰਡੀ ਸਲਾਹ',
    savedAlertsHeading: 'ਤੁਹਾਡੇ ਸੇਵ ਕੀਤੇ ਅਲਰਟ',
    noSavedAlerts: 'ਹਾਲੇ ਕੋਈ ਅਲਰਟ ਨਹੀਂ ਹੈ। ਉੱਪਰ ਟੀਚਾ ਭਾਅ ਭਰੋ।',
    alertTriggeredLabel: 'ਟੀਚਾ ਪੂਰਾ ਹੋਇਆ',
    alertWatchingLabel: 'ਨਿਗਰਾਨੀ ਹੇਠ',
    voiceModalTitle: 'ਬੋਲ ਕੇ ਫ਼ਸਲ ਜਾਣਕਾਰੀ ਭਰੋ',
    voiceModalSubtitle: 'ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਮਰਾਠੀ, ਤੇਲਗੂ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਬੋਲੋ ਜਾਂ ਨਮੂਨਾ ਚੁਣੋ।',
    startRecording: 'ਬੋਲਣ ਲਈ ਦਬਾਓ',
    stopRecording: 'ਰੋਕੋ',
    processingAudio: 'ਆਵਾਜ਼ ਸਮਝੀ ਜਾ ਰਹੀ ਹੈ...',
    orTypePhrase: 'ਜਾਂ ਆਪਣਾ ਵੇਰਵਾ ਇੱਥੇ ਲਿਖੋ',
    parseTextBtn: 'ਵੇਰਵਾ ਕੱਢੋ',
    trySamplePhrases: 'ਨਮੂਨਾ ਵਾਕ',
    detectedFieldsHeading: 'ਪਛਾਣੇ ਗਏ ਵੇਰਵੇ',
    applyToCalculator: 'ਕੈਲਕੁਲੇਟਰ ਵਿੱਚ ਭਰੋ',
    closeLabel: 'ਬੰਦ ਕਰੋ',
    distanceUnitKm: 'ਕਿਮੀ',
    paymentLabel: 'ਭੁਗਤਾਨ',
    arrivalsLabel: 'ਅੱਜ ਦੀ ਆਮਦ',
    navHome: 'ਹੋਮ',
    navMap: 'ਮੰਡੀ ਨਕਸ਼ਾ',
    navMockups: 'ਸਕ੍ਰੀਨਾਂ',
    homeCtaCompare: 'ਵੇਚਣ ਦੇ ਵਿਕਲਪਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ',
    recentSearchesTitle: 'ਹਾਲੀਆ ਖੋਜਾਂ',
    localSnapshotTitle: 'ਸਥਾਨਕ ਮੰਡੀ ਝਲਕ',
    sampleDataNotice:
      'ਨਮੂਨਾ ਡੇਟਾ: ਇੱਥੇ ਦਿਖਾਏ ਗਏ ਭਾਅ, ਫ਼ੋਨ ਨੰਬਰ ਅਤੇ ਮੰਡੀ ਟਿਕਾਣੇ ਸਿਰਫ਼ ਅੰਦਾਜ਼ੇ ਲਈ ਹਨ — ਇਹ ਪੱਕੀ ਕੀਮਤ ਨਹੀਂ ਹੈ।',
    searchLocationPlaceholder: 'ਜ਼ਿਲ੍ਹਾ, ਸ਼ਹਿਰ ਜਾਂ ਮੰਡੀ ਖੋਜੋ...',
    useCurrentLocation: 'ਮੇਰੀ ਮੌਜੂਦਾ ਥਾਂ ਵਰਤੋ',
    locationRequesting: 'ਥਾਂ ਲੱਭੀ ਜਾ ਰਹੀ ਹੈ...',
    locationDeniedMsg:
      'ਲੋਕੇਸ਼ਨ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਮਿਲੀ। ਹੇਠਾਂ ਆਪਣਾ ਜ਼ਿਲ੍ਹਾ ਜਾਂ ਮੰਡੀ ਚੁਣੋ।',
    locationGrantedMsg: 'ਨੇੜਲੇ ਮੰਡੀ ਇਲਾਕੇ ਨਾਲ ਮਿਲਾਇਆ ਗਿਆ',
    buyerDetailsBtn: 'ਖਰੀਦਦਾਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
    buyerDetailsTitle: 'ਖਰੀਦਦਾਰ ਤੇ ਮੰਡੀ ਵੇਰਵੇ',
    callBuyerBtn: 'ਕਾਲ ਕਰੋ',
    messageBuyerBtn: 'ਸੁਨੇਹਾ ਭੇਜੋ',
    verifiedContactLabel: 'ਪ੍ਰਮਾਣਿਤ ਸੰਪਰਕ (ਨਮੂਨਾ)',
    unverifiedContactLabel: 'ਗੈਰ-ਪ੍ਰਮਾਣਿਤ ਵੇਰਵੇ — ਖੁਦ ਪੁਸ਼ਟੀ ਕਰੋ',
    acceptedCropsLabel: 'ਸਵੀਕਾਰ ਕੀਤੀਆਂ ਫ਼ਸਲਾਂ',
    businessDetailsLabel: 'ਕਾਰੋਬਾਰ ਤੇ ਤੁਲਾਈ ਵੇਰਵੇ',
    timingsLabel: 'ਮੰਡੀ ਦਾ ਸਮਾਂ',
    mandiMapTitle: 'ਮੰਡੀ ਟਿਕਾਣੇ ਤੇ ਰਸਤਾ',
    getDirectionsBtn: 'ਰਸਤਾ ਵੇਖੋ',
    mapUnavailableNote: 'ਖੇਤੋਂ ਚੁੱਕਣਾ — ਮੰਡੀ ਜਾਣ ਦੀ ਲੋੜ ਨਹੀਂ।',
    routeSummaryLabel: 'ਰਸਤਾ ਤੇ ਦੂਰੀ ਦਾ ਵੇਰਵਾ',
    expandCostsBtn: 'ਖਰਚੇ ਵੇਖੋ',
    collapseCostsBtn: 'ਖਰਚੇ ਲੁਕਾਓ',
    assumptionsTitle: 'ਹਿਸਾਬ ਦਾ ਫਾਰਮੂਲਾ ਤੇ ਅੰਦਾਜ਼ੇ',
    notGuaranteedNote: 'ਸਿਰਫ਼ ਅੰਦਾਜ਼ਾ — ਇਹ ਪੱਕੀ ਕੀਮਤ ਜਾਂ ਕਮਾਈ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਹੈ।',
    loadingResultsTitle: 'ਨੇੜਲੀਆਂ ਮੰਡੀਆਂ ਤੇ ਸ਼ੁੱਧ ਕਮਾਈ ਦਾ ਹਿਸਾਬ ਲੱਗ ਰਿਹਾ ਹੈ...',
    noResultsTitle: 'ਤੁਹਾਡੇ ਫਿਲਟਰ ਅਨੁਸਾਰ ਕੋਈ ਖਰੀਦਦਾਰ ਨਹੀਂ ਮਿਲਿਆ',
    resetFiltersBtn: 'ਫਿਲਟਰ ਰੀਸੈਟ ਕਰੋ',
    offlineBannerText:
      'ਤੁਸੀਂ ਆਫ਼ਲਾਈਨ ਹੋ — ਸੇਵ ਕੀਤਾ ਨਮੂਨਾ ਡੇਟਾ ਦਿਖ ਰਿਹਾ ਹੈ। ਕੈਲਕੁਲੇਟਰ ਚੱਲ ਰਿਹਾ ਹੈ।',
    reviewBeforeApply: 'ਜਮ੍ਹਾਂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਵੇਰਵੇ ਜਾਂਚੋ ਤੇ ਠੀਕ ਕਰੋ:',
    confirmAndApplyBtn: 'ਪੁਸ਼ਟੀ ਕਰੋ ਤੇ ਤੁਲਨਾ ਵੇਖੋ',
  },
  te: {
    navCompare: 'పోలిక',
    navLedger: 'ఖర్చుల లెక్క',
    navOutlook: '7-రోజుల అంచనా',
    navAlerts: 'అలర్ట్‌లు',
    heroTitle: 'కేవలం మార్కెట్ ధర కాదు — చేతికి వచ్చే నికర ఆదాయం చూడండి',
    heroSubtitle:
      'పంట, పరిమాణం, తేమ మరియు ప్రాంతాన్ని నమోదు చేసి రవాణా, కమిషన్, నాణ్యత కోతల తర్వాత నికర రాబడిని పోల్చండి.',
    voicePromptButton: 'మాట్లాడి నమోదు చేయండి',
    step1Title: '1. పంట & పరిమాణం',
    step2Title: '2. ప్రాంతం & నాణ్యత',
    step3Title: '3. రవాణా & ఫీజులు',
    step4Title: '4. స్థానిక వ్యాపారి ధర కలపండి',
    selectCropLabel: 'పంట ఎంచుకోండి',
    quantityLabel: 'మొత్తం పరిమాణం (క్వింటాళ్లు)',
    quintalsUnit: 'క్విం',
    mspBenchmarkLabel: 'ప్రభుత్వ MSP ధర',
    noMspLabel: 'మార్కెట్ ఆధారిత పంట (MSP లేదు)',
    regionLabel: 'దగ్గరి మార్కెట్ ప్రాంతం',
    villageLabel: 'గ్రామం / మండలం (ఐచ్ఛికం)',
    villagePlaceholder: 'ఉదా. ఆర్మూర్, నిజామాబాద్',
    gradeLabel: 'పంట గ్రేడ్',
    gradeA: 'గ్రేడ్ A (శుభ్రమైనది)',
    gradeFAQ: 'సాధారణ FAQ',
    gradeB: 'గ్రేడ్ B (తక్కువ నాణ్యత)',
    moistureLabel: 'అంచనా తేమ (%)',
    foreignMatterLabel: 'మట్టి / చెత్త (%)',
    faqLimitText: 'FAQ పరిమితి',
    withinFaq: 'సాధారణ FAQ పరిమితిలో ఉంది',
    aboveFaqCutApplies: 'పరిమితి కంటే ఎక్కువ — అంచనా కోత వర్తిస్తుంది',
    vehicleLabel: 'రవాణా వాహనం',
    transportModeAuto: 'దూరం ప్రకారం అంచనా',
    transportModeManual: 'నా రవాణా ఖర్చు నమోదు చేయి',
    manualTransportLabel: 'మొత్తం రవాణా ఖర్చు (₹)',
    ratePerKmLabel: 'అంచనా రేటు (₹/కిమీ)',
    customBuyerToggle: 'స్థానిక వ్యాపారి / మిల్లు ధరను పోల్చండి',
    customBuyerName: 'కొనుగోలుదారు పేరు',
    customBuyerPrice: 'చెప్పిన ధర (₹/క్విం)',
    customBuyerDistance: 'దూరం (కిమీ)',
    customBuyerCommission: 'కమిషన్ (%)',
    customBuyerCut: 'నాణ్యత / తూకం కోత (%)',
    bestNetHeadline: 'అత్యధిక నికర ఆదాయం ఇచ్చే ఎంపిక',
    highestListedTrapNote:
      'అత్యధిక మార్కెట్ ధర ఎప్పుడూ అత్యధిక నికర ఆదాయాన్ని ఇవ్వదు. రవాణా మరియు ఫీజుల వల్ల దగ్గరి ఎంపికే లాభదాయకం.',
    highestListedMatchesBestNote:
      'ఈ ఎంపిక గరిష్ట ధర మరియు ఖర్చుల తర్వాత అత్యధిక నికర రాబడి రెండింటినీ ఇస్తుంది.',
    netProceedsLabel: 'అంచనా నికర ఆదాయం',
    netPerQuintalLabel: 'నికర ₹ / క్విం',
    listedPriceLabel: 'ప్రకటిత ధర',
    totalDeductionsLabel: 'మొత్తం ఖర్చులు & కోతలు',
    provenanceVerified: 'ధృవీకరించిన ధర',
    provenanceEstimate: 'అంచనా',
    provenanceUser: 'మీ నమోదు',
    provenanceLegendTitle: 'డేటా స్పష్టత',
    provenanceLegendBody:
      'మండీ మోడల్ ధరలు మరియు MSP ధృవీకరించబడినవి. రవాణా, తేమ కోతలు మరియు వ్యాపారి ధరలు అంచనాలు — మీరు వాటిని మార్చవచ్చు.',
    visualComparisonTitle: 'చేతికి వచ్చే నగదు vs అమ్మకపు ఖర్చులు',
    netInHand: 'నికర నగదు',
    qualityCut: 'నాణ్యత కోత',
    transportCost: 'రవాణా',
    feesCommission: 'ఫీజులు & కమిషన్',
    rankedOptionsTitle: 'నికర రాబడి ప్రకారం అన్ని ఎంపికలు',
    inspectLedgerBtn: 'ఖర్చు వివరాలు చూడండి',
    selectedForLedger: 'లెక్కలో ఎంచుకున్నది',
    ledgerTitle: 'పారదర్శక ఖర్చుల పట్టిక',
    ledgerSubtitle: 'ఎంచుకున్న కొనుగోలుదారుకు ప్రతి రూపాయి వివరణ',
    grossValueLine: 'మొత్తం పంట విలువ',
    qualityMoistureLine: 'అదనపు తేమ కోత',
    qualityFmLine: 'మట్టి / చెత్త కోత',
    qualityGradeLine: 'గ్రేడ్ వ్యత్యాసం',
    qualityFlatWeightLine: 'తూకం / కర్దా కోత',
    transportLine: 'అంచనా రవాణా ఛార్జీ',
    mandiFeeLine: 'మార్కెట్ ఫీజు',
    commissionLine: 'కమిషన్ / దళారీ',
    hammaliLine: 'హమాలీ & తూకం',
    cleaningBaggingLine: 'శుభ్రపరచడం & సంచుల ఖర్చు',
    overrideHint: 'ఈ కొనుగోలుదారు ధర లేదా దూరం మార్చండి:',
    resetOverrides: 'సాధారణ విలువలకు మార్చు',
    outlookTitle: '7-రోజుల ధర అంచనా పరిధి',
    outlookSubtitle: 'గత 7 రోజుల ధృవీకరించిన ధరలు మరియు రాబోయే అనిశ్చిత పరిధి',
    outlookDisclaimer:
      'ఈ అంచనా గత ధోరణి మరియు సంభావ్య పరిధిని చూపుతుంది — ఇది ఖచ్చితమైన హామీ ధర కాదు.',
    verifiedHistoryLegend: 'ధృవీకరించిన ధర (గత 7 రోజులు)',
    projectedRangeLegend: 'అంచనా పరిధి (వచ్చే 7 రోజులు)',
    driversHeading: 'ఈ ధర పరిధికి ప్రధాన కారణాలు',
    askOutlookExplain: 'సరళ భాషలో వివరణ చూడండి',
    explainingOutlook: 'మార్కెట్ అంశాలను విశ్లేషిస్తోంది...',
    alertsTitle: 'మార్కెట్ అలర్ట్‌లు & సూచనలు',
    alertsSubtitle: 'లక్ష్య నికర ధర మరియు రాకల ప్రమాదాలను గమనించండి',
    setAlertHeading: 'నికర ధర లక్ష్య అలర్ట్ పెట్టండి',
    targetNetPriceInput: 'నికర ₹/క్విం చేరినప్పుడు అలర్ట్ ఇవ్వు',
    saveAlertBtn: 'అలర్ట్ సేవ్ చేయి',
    activeAdvisoriesHeading: 'ప్రాంతీయ మార్కెట్ సూచనలు',
    savedAlertsHeading: 'మీరు సేవ్ చేసిన అలర్ట్‌లు',
    noSavedAlerts: 'ఇంకా అలర్ట్‌లు లేవు. పైన లక్ష్య నికర ధరను నమోదు చేయండి.',
    alertTriggeredLabel: 'లక్ష్యం చేరింది',
    alertWatchingLabel: 'పరిశీలనలో ఉంది',
    voiceModalTitle: 'వాయిస్ ద్వారా పంట వివరాలు',
    voiceModalSubtitle: 'తెలుగు, హిందీ, మరాఠీ, పంజాబీ లేదా ఇంగ్లీష్‌లో మాట్లాడండి లేదా ఉదాహరణ ఎంచుకోండి.',
    startRecording: 'మాట్లాడటానికి నొక్కండి',
    stopRecording: 'ఆపండి',
    processingAudio: 'వాయిస్‌ను విశ్లేషిస్తోంది...',
    orTypePhrase: 'లేదా మీ వివరాలు ఇక్కడ టైప్ చేయండి',
    parseTextBtn: 'వివరాలు తీసుకోండి',
    trySamplePhrases: 'ఉదాహరణ వాక్యాలు',
    detectedFieldsHeading: 'గుర్తించిన వివరాలు',
    applyToCalculator: 'కాలిక్యులేటర్‌లో వర్తింపజేయండి',
    closeLabel: 'మూసివేయండి',
    distanceUnitKm: 'కిమీ',
    paymentLabel: 'చెల్లింపు',
    arrivalsLabel: 'నేటి రాకలు',
    navHome: 'హోమ్',
    navMap: 'మండీ మ్యాప్',
    navMockups: 'స్క్రీన్లు',
    homeCtaCompare: 'అమ్మకం ఎంపికలను పోల్చండి',
    recentSearchesTitle: 'ఇటీవలి శోధనలు',
    localSnapshotTitle: 'స్థానిక మార్కెట్ సమాచారం',
    sampleDataNotice:
      'నమూనా డేటా: ఇక్కడ చూపిన ధరలు, ఫోన్ నంబర్లు మరియు మండీ స్థానాలు కేవలం అంచనా కోసం నమూనా డేటా మాత్రమే — ఇది ఖచ్చితమైన హామీ ధర కాదు.',
    searchLocationPlaceholder: 'జిల్లా, పట్టణం లేదా మండీ వెతకండి...',
    useCurrentLocation: 'ప్రస్తుత స్థానాన్ని ఉపయోగించండి',
    locationRequesting: 'స్థానాన్ని గుర్తిస్తోంది...',
    locationDeniedMsg:
      'స్థానం అనుమతి నిరాకరించబడింది. దిగువ మీ జిల్లా లేదా మార్కెట్ ప్రాంతాన్ని ఎంచుకోండి.',
    locationGrantedMsg: 'దగ్గరి మార్కెట్ ప్రాంతానికి సరిపోయింది',
    buyerDetailsBtn: 'కొనుగోలుదారుని సంప్రదించండి',
    buyerDetailsTitle: 'కొనుగోలుదారు & మండీ వివరాలు',
    callBuyerBtn: 'కాల్ చేయండి',
    messageBuyerBtn: 'మెసేజ్ చేయండి',
    verifiedContactLabel: 'ధృవీకరించిన నంబర్ (నమూనా)',
    unverifiedContactLabel: 'ధృవీకరించని వివరాలు — నేరుగా నిర్ధారించుకోండి',
    acceptedCropsLabel: 'కొనుగోలు చేసే పంటలు',
    businessDetailsLabel: 'వ్యాపార & తూకం వివరాలు',
    timingsLabel: 'మార్కెట్ వేళలు',
    mandiMapTitle: 'మండీ స్థానాలు & దిశలు',
    getDirectionsBtn: 'దిశలు పొందండి',
    mapUnavailableNote: 'పొలం వద్దే కొనుగోలు — మండీకి వెళ్లాల్సిన అవసరం లేదు.',
    routeSummaryLabel: 'మార్గం & దూరం వివరాలు',
    expandCostsBtn: 'ఖర్చుల వివరాలు చూడండి',
    collapseCostsBtn: 'ఖర్చుల వివరాలు దాచు',
    assumptionsTitle: 'లెక్క సూత్రం & అంచనాలు',
    notGuaranteedNote: 'కేవలం అంచనా మాత్రమే — ఇది ఖచ్చితమైన ధర లేదా ఆదాయం కాదు.',
    loadingResultsTitle: 'దగ్గరి మండీలు మరియు నికర రాబడిని లెక్కిస్తోంది...',
    noResultsTitle: 'మీ ఫిల్టర్‌కు సరిపోయే కొనుగోలుదారులు లేరు',
    resetFiltersBtn: 'ఫిల్టర్లు రీసెట్ చేయండి',
    offlineBannerText:
      'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు — సేవ్ చేసిన నమూనా ధరలు చూపబడుతున్నాయి. కాలిక్యులేటర్ పనిచేస్తుంది.',
    reviewBeforeApply: 'సమర్పించే ముందు వివరాలను సరిచూసి సవరించండి:',
    confirmAndApplyBtn: 'నిర్ధారించి ఎంపికలను పోల్చండి',
  },
};
