export interface AdaptiveEngineInput {
  crop: string;
  disease: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  pest: string;
  humidityLevel: 'High (>80%)' | 'Moderate (55-80%)' | 'Low (<55%)';
  humidityValue: number; // e.g. 84%
  temperatureC: number; // e.g. 28°C
  rainExpected: boolean; // rain forecast
  weatherSummary?: string;
  growthStage: 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruit Formation' | 'Maturity / Harvest';
  previousTreatment: string;
  previousObservations: string;
}

export interface AdaptiveRecommendationResult {
  // Required Output Format
  problem: string;
  risk: string;
  whyThisHappened: string;
  recommendedAction: string;
  whatToMonitor: string;
  nextCheck: string;

  // Bilingual Tamil
  problemTa: string;
  riskTa: string;
  whyThisHappenedTa: string;
  recommendedActionTa: string;
  whatToMonitorTa: string;
  nextCheckTa: string;

  // Farmer guidance details
  urgencyLevel: 'Low (Preventive)' | 'Moderate (Action Needed)' | 'High (Immediate Intervention)' | 'Critical (Emergency Protocol)';
  urgencyColor: string;
  actionCategory: string;
  actionCategoryTa: string;
  ipmTier: 'Cultural / Field Hygiene' | 'Biological Control' | 'Safe Organic Barrier' | 'Locally Approved Intervention';
  sprayerDoseGuideline?: {
    productName: string;
    productNameTa: string;
    dosePerLiter: string;
    isOrganic: boolean;
    waitingPeriodDays: number;
    safetyPrecautions: string;
    safetyPrecautionsTa: string;
  };
  keyFactorsSummary: {
    factor: string;
    factorTa: string;
    value: string;
    impact: 'High' | 'Medium' | 'Low';
  }[];
}

/**
 * Generates an Adaptive AI Recommendation tailored specifically to:
 * - Crop
 * - Disease
 * - Disease Severity
 * - Pest Vector
 * - Weather (Humidity, Temp, Rain)
 * - Growth Stage
 * - Previous Treatment
 * - Previous AI Observations
 */
export function generateAdaptiveRecommendation(input: AdaptiveEngineInput): AdaptiveRecommendationResult {
  const {
    crop,
    disease,
    severity,
    pest,
    humidityLevel,
    humidityValue,
    temperatureC,
    rainExpected,
    growthStage,
    previousTreatment,
    previousObservations,
  } = input;

  const isTomato = crop.toLowerCase().includes('tomato');
  const isEarlyBlight = disease.toLowerCase().includes('early blight');
  const isLateBlight = disease.toLowerCase().includes('late blight');
  const isMild = severity === 'Mild';
  const isSevere = severity === 'Severe' || severity === 'Critical';
  const isModerate = severity === 'Moderate';
  const isHighHumidity = humidityLevel.includes('High') || humidityValue >= 80;
  const hasPest = pest && pest !== 'None' && pest !== 'இல்லை (None)';
  const isFloweringOrFruiting = growthStage === 'Flowering' || growthStage === 'Fruit Formation';
  const isSeedling = growthStage === 'Seedling';
  const hasRecentTreatment = previousTreatment && !previousTreatment.toLowerCase().includes('none') && !previousTreatment.toLowerCase().includes('untreated');

  // -------------------------------------------------------------
  // 1. PROBLEM SYNTHESIS
  // -------------------------------------------------------------
  let problem = '';
  let problemTa = '';

  if (disease.toLowerCase().includes('healthy')) {
    problem = `Healthy ${crop} crop with no active disease pathology detected.`;
    problemTa = `ஆரோக்கியமான ${crop} பயிர்; நோய் அல்லது பூஞ்சை அறிகுறிகள் ஏதும் இல்லை.`;
  } else if (isTomato && isEarlyBlight) {
    if (isMild) {
      problem = `Mild Early Blight (Alternaria solani) localized on lower canopy foliage of ${crop}.`;
      problemTa = `${crop} பயிரின் கீழ் இலைகளில் லேசான ஆரம்பகால கருகல் நோய் (Early Blight) அறிகுறிகள் தென்படுகின்றன.`;
    } else if (isSevere) {
      problem = `Severe Early Blight (Alternaria solani) outbreak with coalescing necrotic target lesions and extensive foliar blighting on ${crop}.`;
      problemTa = `${crop} பயிரில் தீவிர ஆரம்பகால கருகல் நோய் (Early Blight) பரவி, இலைகள் கருகி உதிரும் அபாயம் ஏற்பட்டுள்ளது.`;
    } else {
      problem = `Moderate Early Blight (Alternaria solani) with distinct concentric brown lesions on middle and lower ${crop} canopy.`;
      problemTa = `${crop} பயிரில் மிதமான ஆரம்பகால கருகல் நோய் (Early Blight) வளைய வடிவ பழுப்பு புள்ளிகளுடன் காணப்படுகிறது.`;
    }
  } else {
    problem = `${severity} ${disease} identified on ${crop} at ${growthStage} stage${hasPest ? ` accompanied by active ${pest} infestation` : ''}.`;
    problemTa = `${growthStage} பருவத்தில் உள்ள ${crop} பயிரில் ${severity} அளவிலான ${disease} பாதிப்பு${hasPest ? ` மற்றும் ${pest} பூச்சி தாக்குதலுடன்` : ''} பதிவாகியுள்ளது.`;
  }

  // -------------------------------------------------------------
  // 2. RISK ASSESSMENT
  // -------------------------------------------------------------
  let risk = '';
  let riskTa = '';

  if (isMild) {
    if (isHighHumidity || rainExpected) {
      risk = `Elevated microclimate risk. High atmospheric humidity (${humidityValue}%) and canopy dampness can accelerate spore release within 24-48 hours if preventive hygiene is delayed.`;
      riskTa = `அதிக காற்று ஈரப்பதம் (${humidityValue}%) மற்றும் இலை ஈரப்பதம் காரணமாக, அடுத்த 24-48 மணி நேரத்தில் நோய் மேல் இலைகளுக்கு பரவும் அபாயம் உள்ளது.`;
    } else {
      risk = `Low to moderate risk. Pathogen is currently confined to bottom leaves; environmental conditions are not acutely critical.`;
      riskTa = `குறைந்த முதல் மிதமான அபாயம். நோய் கீழ் இலைகளில் மட்டுமே உள்ளது; உடனடியாக கவனித்தால் எளிதில் தடுக்கலாம்.`;
    }
  } else if (isSevere) {
    risk = `High to Critical risk of rapid canopy defoliation, photosynthesis breakdown, and 35-65% harvest yield loss if immediate locally approved intervention is not deployed today.`;
    riskTa = `மிகத் தீவிரமான ஆபத்து! இலைகள் கருகி உதிர்வதால் ஒளிச்சேர்க்கை தடைபட்டு, பயிர் மகசூலில் 35-65% வரை இழப்பு ஏற்படக்கூடும்.`;
  } else {
    // Moderate
    risk = `Moderate risk of upward vertical disease progression into new terminal shoots and reproductive flowers, especially during evening high humidity.`;
    riskTa = `மிதமான அபாயம். மாலை நேர ஈரப்பதம் காரணமாக புதிய தளிர்களுக்கும் பூக்களுக்கும் நோய் பரவ வாய்ப்புள்ளது.`;
  }

  if (hasPest) {
    risk += ` Secondary vector risk: Active ${pest} punctures plant cuticle, facilitating opportunistic fungal entry and potential viral transmission.`;
    riskTa += ` மேலும், ${pest} பூச்சிகள் இலைகளை துளையிட்டு சாற்றை உறிஞ்சுவதால் வைரஸ் மற்றும் பூஞ்சை தொற்று வேகமாக பரவும்.`;
  }

  // -------------------------------------------------------------
  // 3. WHY THIS HAPPENED (System rationale explaining the recommendation)
  // -------------------------------------------------------------
  const reasons: string[] = [];
  const reasonsTa: string[] = [];

  // Weather & Humidity rationale
  if (isHighHumidity) {
    reasons.push(`High atmospheric humidity (${humidityValue}%) and ambient temperature (~${temperatureC}°C) create optimal microclimate physics for fungal spore germination and secondary conidia spread.`);
    reasonsTa.push(`அதிக ஈரப்பதம் (${humidityValue}%) மற்றும் ${temperatureC}°C வெப்பநிலை பூஞ்சை வித்துக்கள் எளிதாக முளைத்து இலைகளில் ஊடுருவ சாதகமாக உள்ளது.`);
  } else {
    reasons.push(`Ambient humidity (${humidityValue}%) provides moderate spore viability, reducing immediate aerial contagion speed.`);
    reasonsTa.push(`சுற்றுப்புற ஈரப்பதம் (${humidityValue}%) மிதமாக இருப்பதால் நோய்க்கிருமி பரவும் வேகம் சற்று குறைவாக உள்ளது.`);
  }

  // Severity rationale
  if (isMild) {
    reasons.push(`Because disease severity is Mild, the plant vascular architecture remains undamaged. Chemical fungicide is unwarranted and counterproductive; non-toxic field sanitation and biological antagonism preserve beneficial soil microbiomes.`);
    reasonsTa.push(`பாதிப்பு ஆரம்ப நிலையில் (Mild) உள்ளதால், பயிரின் நரம்பு மண்டலம் ஆரோக்கியமாக உள்ளது. ரசாயன மருந்துகள் தேவை இல்லை; இயற்கை சுகாதார முறைகளே முழுமையான பலன் தரும்.`);
  } else if (isSevere) {
    reasons.push(`Because severity is Severe with extensive leaf tissue necrosis, biological prophylaxis alone cannot reverse active sporulation. Immediate physical inspection and compliant agricultural curative interventions are required to rescue harvest potential.`);
    reasonsTa.push(`பாதிப்பு தீவிரமாக (Severe) உள்ளதால், வெறும் இயற்கை வழிகள் மட்டும் போதாது; உடனடியாக வேளாண்மை அலுவலர் ஆய்வு மற்றும் அங்கீகரிக்கப்பட்ட தீவிர பாதுகாப்பு சிகிச்சை தேவைப்படுகிறது.`);
  } else {
    reasons.push(`Moderate foliar symptoms require a balanced targeted approach: eliminating localized primary spore foci while bolstering plant systemic immunity.`);
    reasonsTa.push(`மிதமான பாதிப்பு உள்ளதால் பாதிக்கப்பட்ட இலைகளை அகற்றி, பயிருக்கு நோய் எதிர்ப்பு சக்தியை அதிகரிக்கும் பாதுகாப்பு தெளிப்பு அவசியமாகிறது.`);
  }

  // Growth Stage rationale
  if (isFloweringOrFruiting) {
    reasons.push(`Crop is currently in the ${growthStage} stage, where physiological stress directly induces blossom drop and fruit lesioning; application must be timed after pollinator foraging hours (post 4:30 PM).`);
    reasonsTa.push(`பயிர் தற்போது ${growthStage === 'Flowering' ? 'பூக்கும்' : 'காய் பிடிக்கும்'} நிலையில் உள்ளதால், தேனீக்கள் போன்ற நன்மை செய்யும் பூச்சிகளை பாதுகாக்க மாலை 4:30 மணிக்கு மேலேயே தெளிக்க வேண்டும்.`);
  } else if (isSeedling) {
    reasons.push(`Seedling root zones are tender; excessive chemical concentration can induce phytotoxic burning, favoring gentle bio-stimulant drenches.`);
    reasonsTa.push(`நாற்றுப் பருவத்தில் மென்மையான வேர்கள் உள்ளதால், அதிக ரசாயன மருந்து நாற்றுகளை கருகச் செய்துவிடும்; மிதமான முறையே சிறந்தது.`);
  }

  // Pest rationale
  if (hasPest) {
    reasons.push(`Co-presence of ${pest} acts as an active physical vector that weakens leaf cuticles and spreads secondary pathogens.`);
    reasonsTa.push(`பயிரில் ${pest} பூச்சிகள் இருப்பதால், அவை இலைகளை சேதப்படுத்தி நோய்க் கிருமிகள் எளிதில் பரவ வழிவகுக்கின்றன.`);
  }

  // Previous Treatment rationale
  if (hasRecentTreatment) {
    reasons.push(`Prior treatment history indicates "${previousTreatment}". To prevent pathogen resistance buildup and pesticide residue toxicity, a rotational management strategy is advised.`);
    reasonsTa.push(`முந்தைய சிகிச்சை "${previousTreatment}" அடிப்படையில், பூஞ்சை மருந்துக்கு எதிர்ப்புத் திறன் பெறுவதைத் தடுக்க மாற்று சுழற்சி முறை பரிந்துரைக்கப்படுகிறது.`);
  } else {
    reasons.push(`No recent treatments recorded; the pathogen has had uninterrupted incubation in the canopy, but lacks resistance to standard registered controls.`);
    reasonsTa.push(`முந்தைய சிகிச்சைகள் ஏதும் செய்யப்படாததால், கிருமிகள் இயற்கையான முறையில் எளிதில் கட்டுப்படக்கூடிய நிலையிலேயே உள்ளன.`);
  }

  // Observations rationale
  if (previousObservations && previousObservations.trim().length > 0) {
    reasons.push(`Previous AI field telemetry observed: "${previousObservations}", confirming continuous micro-focal risk.`);
    reasonsTa.push(`முந்தைய AI களக் குறிப்பு: "${previousObservations}" என்பதை கணக்கில் கொண்டு இந்த முடிவு எடுக்கப்பட்டது.`);
  }

  const whyThisHappened = reasons.join(' ');
  const whyThisHappenedTa = reasonsTa.join(' ');

  // -------------------------------------------------------------
  // 4. RECOMMENDED ACTION (Actionable, Farmer-Friendly, Non-Toxic Priority)
  // -------------------------------------------------------------
  let recommendedAction = '';
  let recommendedActionTa = '';
  let actionCategory = 'Preventive Hygiene';
  let actionCategoryTa = 'தடுப்பு சுகாதாரம் மற்றும் பராமரிப்பு';
  let ipmTier: 'Cultural / Field Hygiene' | 'Biological Control' | 'Safe Organic Barrier' | 'Locally Approved Intervention' = 'Cultural / Field Hygiene';
  let urgencyLevel: 'Low (Preventive)' | 'Moderate (Action Needed)' | 'High (Immediate Intervention)' | 'Critical (Emergency Protocol)' = 'Low (Preventive)';
  let urgencyColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (isMild) {
    urgencyLevel = 'Low (Preventive)';
    urgencyColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    actionCategory = 'Preventive Monitoring & Field Hygiene';
    actionCategoryTa = 'தடுப்பு கண்காணிப்பு & பண்ணை சுகாதாரம்';
    ipmTier = 'Cultural / Field Hygiene';

    recommendedAction = `1. Preventive Monitoring & Field Hygiene: Carefully prune lower infected yellowing leaves showing spots, seal them in a sack, and bury or compost away from the field to eradicate spore sources.
2. Aeration & Foliar Hygiene: Stake or tie upright stems to improve canopy air circulation and sunlight penetration.
3. Bio-Shield Application: Apply eco-friendly bio-fungicide (Trichoderma viride @ 5g/L of water or Pseudomonas fluorescens) mixed with 0.5% jaggery sticker during late afternoon (after 4:30 PM).
4. Water Management: Shift irrigation strictly to drip lines; avoid sprinkler or overhead splashing that spreads spores across adjacent rows.`;

    recommendedActionTa = `1. தடுப்பு கண்காணிப்பு & பண்ணை சுகாதாரம்: பாதிக்கப்பட்ட கீழ் இலைகளை வெட்டி எடுத்து சாக்கில் அடைத்து பண்ணைக்கு வெளியே அப்புறப்படுத்தவும்.
2. காற்றோட்டம் அதிகரிப்பு: செடிகளை குச்சிகள் நட்டு நிமிர்த்தி கட்டி நல்ல காற்றோட்டமும் சூரிய ஒளியும் கிடைக்கச் செய்யவும்.
3. உயிரியல் பாதுகாப்பு தெளிப்பு: மாலை 4:30 மணிக்கு மேல் ஒரு லிட்டர் தண்ணீருக்கு 5 கிராம் டிரைக்கோடெர்மா விரிடி அல்லது சூடோமோனாஸ் கலந்து இலை நனையும் வரை தெளிக்கவும்.
4. நீர் மேலாண்மை: சொட்டுநீர் பாசனத்தை மட்டும் பயன்படுத்தவும்; இலைகளில் தண்ணீர் தெறிக்காமல் பார்த்துக் கொள்ளவும்.`;

  } else if (isSevere) {
    urgencyLevel = 'High (Immediate Intervention)';
    urgencyColor = 'text-red-700 bg-red-50 border-red-200';
    actionCategory = 'Immediate Inspection & Approved Agricultural Intervention';
    actionCategoryTa = 'உடனடி கள ஆய்வு & தீவிர பாதுகாப்பு நடவடிக்கை';
    ipmTier = 'Locally Approved Intervention';

    recommendedAction = `1. Immediate Field Inspection: Request an on-site evaluation by your local Agricultural Extension Officer or registered agronomist to confirm pathogen strain and verify containment perimeter.
2. Source Eradication: Carefully remove severely blighted dying plant stems into sealed bags without shaking spores onto healthy plants.
3. Locally Approved Agricultural Intervention: Apply a registered protective contact spray (such as Copper Oxychloride 50% WP @ 2.5g/L or Mancozeb 75% WP @ 2g/L) approved by the local Directorate of Agriculture. Strictly adhere to package safety labels and wear protective masks.
4. Mandatory Harvest Safety: Maintain a minimum 7 to 10 day withholding period before harvesting any produce for consumption or market.`;

    recommendedActionTa = `1. உடனடி கள ஆய்வு: உங்கள் பகுதி வேளாண்மை விரிவாக்க அலுவலர் அல்லது வேளாண் நிபுணரிடம் பயிரை நேரடியாக காட்டி கள ஆய்வு செய்யவும்.
2. பாதிக்கப்பட்ட செடிகளை நீக்குதல்: அதிகம் கருகிய கிளைகளை காற்றில் வித்துக்கள் பறக்காதவாறு பையில் சேகரித்து எரிக்கவும் அல்லது குழி தோண்டி புதைக்கவும்.
3. அங்கீகரிக்கப்பட்ட பாதுகாப்பு சிகிச்சை: அரசு அங்கீகாரம் பெற்ற மேன்கோசெப் (Mancozeb 2g/L) அல்லது காப்பர் ஆக்ஸிகுளோரைடு (Copper Oxychloride 2.5g/L) மருந்தை உரிய பாதுகாப்பு முகக்கவசத்துடன் தெளிக்கவும்.
4. அறுவடை பாதுகாப்பு இடைவெளி: மருந்து தெளித்த பிறகு குறைந்தது 7 முதல் 10 நாட்களுக்கு காய்கறிகளை அறுவடை செய்யக்கூடாது.`;

  } else {
    // Moderate
    urgencyLevel = 'Moderate (Action Needed)';
    urgencyColor = 'text-amber-700 bg-amber-50 border-amber-200';
    actionCategory = 'Integrated Biological & Canopy Management';
    actionCategoryTa = 'ஒருங்கிணைந்த பயிர் பாதுகாப்பு';
    ipmTier = 'Biological Control';

    recommendedAction = `1. Canopy Sanitation: Clip off moderately infected leaves from lower 30cm of the plant; sanitize pruning shears with 70% alcohol or boiling water between rows.
2. Protective Foliar Spray: Spray fermented buttermilk (5% dilution) or Bacillus subtilis / Trichoderma (5g/L) to suppress spore germination.
3. Microclimate Moderation: Temporarily halt nitrogenous top-dressing; apply foliar potassium silicate to strengthen plant cell walls.
4. Canopy Spacing: Clear weeds around root collars to reduce ground-level relative humidity.`;

    recommendedActionTa = `1. இலைகளை கவாத்து செய்தல்: செடியின் கீழ் பகுதியில் உள்ள பாதிக்கப்பட்ட இலைகளை வெட்டி அப்புறப்படுத்தவும்; கத்தரிகளை சுத்தமாக வைத்திருக்கவும்.
2. இயற்கை பாதுகாப்பு கரைசல்: 5% புளித்த மோர் கரைசல் அல்லது பேசிலஸ் சப்டிலிஸ் / டிரைக்கோடெர்மா (லிட்டருக்கு 5 கிராம்) தெளிக்கவும்.
3. உர மேலாண்மை: தழைச்சத்து (யூரியா) இடுவதை தற்காலிகமாக நிறுத்தி, பொட்டாஷ் சத்து கொடுக்கவும்.
4. களை நீக்கம்: செடியின் வேர்ப்பகுதியை சுற்றி உள்ள களைகளை அகற்றி ஈரப்பதம் தேங்காமல் காற்றோட்டம் ஏற்படுத்தவும்.`;
  }

  // Add pest vector mitigation if pest is present
  if (hasPest) {
    recommendedAction += `\n5. Pest Vector Suppression: Install yellow sticky traps (15-20 traps per acre) at canopy level to trap adult ${pest}. Spray 5% Neem seed kernel extract (NSKE) or neem oil (3ml/L) to repel sap-suckers without harming honeybees.`;
    recommendedActionTa += `\n5. பூச்சி கட்டுப்பாடு: ஏக்கருக்கு 15-20 மஞ்சள் ஒட்டுப்பொறிகளை பயிர் மட்டத்தில் கட்டி ${pest} பூச்சிகளை கவர்ந்து அழிக்கவும். 5% வேப்பங்கொட்டை கரைசல் அல்லது வேப்பெண்ணெய் (லிட்டருக்கு 3 மி.லி) மாலை வேளையில் தெளிக்கவும்.`;
  }

  // -------------------------------------------------------------
  // 5. WHAT TO MONITOR
  // -------------------------------------------------------------
  let whatToMonitor = '';
  let whatToMonitorTa = '';

  if (isEarlyBlight || isLateBlight) {
    whatToMonitor = `1. Inspect lower and middle leaves for expansion of concentric dark rings ("target boards") and yellow chlorotic halos.
2. Check new vegetative crowns and terminal shoots for lesion-free green growth.
3. Monitor morning leaf wetness duration; ensure leaves dry within 2 hours after sunrise.
4. Examine fruit calyx and stem attachments for dark, sunken, leathery rot patches.`;

    whatToMonitorTa = `1. கீழ் மற்றும் நடு இலைகளில் பழுப்பு நிற வளையங்கள் மற்றும் மஞ்சள் வளையங்கள் பெரிதாகிறதா என்று பார்க்கவும்.
2. புதிய தலைப்புகள் மற்றும் தளிர்கள் நோயின்றி ஆரோக்கியமாக துளிர்க்கிறதா என்பதை கவனிக்கவும்.
3. காலை நேர பனி ஈரம் சூரிய உதயமாகி 2 மணி நேரத்திற்குள் காய்கிறதா என்பதை கண்காணிக்கவும்.
4. காய்களின் காம்பு மற்றும் அடிப்பகுதியில் கறுமை நிற அழுகல் ஏதும் ஏற்படுகிறதா என்று சோதிக்கவும்.`;
  } else {
    whatToMonitor = `1. Check daily whether active lesions are drying out with distinct brown borders (healing) or expanding with translucent edges.
2. Monitor pest population on leaf undersides at early morning (07:00 AM).
3. Observe overall plant vigor and flower retention after morning watering.`;

    whatToMonitorTa = `1. இலைகளில் உள்ள புள்ளிகள் காய்ந்து குணமாகிறதா அல்லது ஈரத்தன்மையுடன் விரிவடைகிறதா என்று தினமும் கவனிக்கவும்.
2. காலை 7:00 மணிக்கு இலைகளின் அடிப்பகுதியில் பூச்சிகள் உள்ளதா என்று பார்க்கவும்.
3. பயிர் வாடாமல் பூக்கள் உதிராமல் நன்றாக உள்ளதா என்பதை உறுதி செய்யவும்.`;
  }

  // -------------------------------------------------------------
  // 6. NEXT CHECK TIMELINE
  // -------------------------------------------------------------
  let nextCheck = '';
  let nextCheckTa = '';

  if (isSevere) {
    nextCheck = `Within 24 hours. Re-inspect canopy immediately after applying authorized protective measures to verify lesion arrest.`;
    nextCheckTa = `24 மணி நேரத்திற்குள். பாதுகாப்பு நடவடிக்கை எடுத்த உடனேயே இலைகளின் நிலையை மீண்டும் ஆய்வு செய்யவும்.`;
  } else if (isMild) {
    if (isHighHumidity || rainExpected) {
      nextCheck = `Within 48 hours. Check foliage after morning dew to ensure no new sporulation rings have formed.`;
      nextCheckTa = `48 மணி நேரத்திற்குள் (2 நாட்கள்). காலை பனி ஈரத்திற்குப் பிறகு புதிய புள்ளிகள் தோன்றி உள்ளதா என்று பார்க்கவும்.`;
    } else {
      nextCheck = `In 4 to 5 days. Conduct routine canopy walk and confirm that pruned areas remain clean.`;
      nextCheckTa = `4 முதல் 5 நாட்களில். வழக்கமான கள ஆய்வு செய்து செடிகள் நன்றாக உள்ளதை உறுதி செய்யவும்.`;
    }
  } else {
    // Moderate
    nextCheck = `In 2 to 3 days (within 72 hours). Re-evaluate leaf surface recovery and sticky trap insect density.`;
    nextCheckTa = `2 முதல் 3 நாட்களுக்குள் (72 மணி நேரத்தில்). இலைகளின் முன்னேற்றம் மற்றும் ஒட்டுப்பொறி பூச்சி எண்ணிக்கையை கண்காணிக்கவும்.`;
  }

  // -------------------------------------------------------------
  // Sprayer Tank Dosage Helper
  // -------------------------------------------------------------
  let sprayerDoseGuideline;
  if (isSevere) {
    sprayerDoseGuideline = {
      productName: 'Approved Contact Protective Shield (e.g. Mancozeb 75% WP / Copper Hydroxide)',
      productNameTa: 'அங்கீகரிக்கப்பட்ட பாதுகாப்பு மருந்து (மேன்கோசெப் அல்லது காப்பர் ஆக்ஸிகுளோரைடு)',
      dosePerLiter: '2.0g to 2.5g per Litre of clean water',
      isOrganic: false,
      waitingPeriodDays: 7,
      safetyPrecautions: 'Wear protective cloth mask and rubber gloves. Never spray against wind. Maintain 7-day waiting period before harvest.',
      safetyPrecautionsTa: 'முகக்கவசம் மற்றும் கையுறைகள் அணியவும். காற்று வீசும் திசையில் மட்டுமே தெளிக்கவும். 7 நாட்கள் அறுவடை இடைவெளி தேவை.'
    };
  } else {
    sprayerDoseGuideline = {
      productName: 'Eco-Friendly Bio-Shield (Trichoderma viride 1% WP or Pseudomonas fluorescens)',
      productNameTa: 'இயற்கை உயிரியல் பாதுகாப்பு (டிரைக்கோடெர்மா விரிடி அல்லது சூடோமோனாஸ்)',
      dosePerLiter: '5.0g per Litre of water + 50g jaggery/tank',
      isOrganic: true,
      waitingPeriodDays: 0,
      safetyPrecautions: 'Zero harvest waiting period. 100% bio-friendly and non-toxic to earthworms and pollinators. Spray after 4:30 PM.',
      safetyPrecautionsTa: 'அறுவடை இடைவெளி தேவையில்லை. மண்புழுக்கள் மற்றும் தேனீக்களுக்கு 100% பாதுகாப்பானது. மாலை 4:30 மணிக்கு மேல் தெளிக்கவும்.'
    };
  }

  // Key factors summary breakdown
  const keyFactorsSummary: {
    factor: string;
    factorTa: string;
    value: string;
    impact: 'Low' | 'Medium' | 'High';
  }[] = [
    { factor: 'Crop & Stage', factorTa: 'பயிர் & பருவம்', value: `${crop} (${growthStage})`, impact: isFloweringOrFruiting ? 'High' : 'Medium' },
    { factor: 'Disease & Severity', factorTa: 'நோய் & தீவிரம்', value: `${disease} (${severity})`, impact: isSevere ? 'High' : isMild ? 'Low' : 'Medium' },
    { factor: 'Microclimate', factorTa: 'வானிலை & ஈரப்பதம்', value: `${humidityValue}% Humidity, ${temperatureC}°C${rainExpected ? ' + Rain' : ''}`, impact: isHighHumidity ? 'High' : 'Medium' },
    { factor: 'Pest Vector', factorTa: 'பூச்சி அழுத்தம்', value: pest, impact: hasPest ? 'High' : 'Low' },
    { factor: 'Treatment History', factorTa: 'முந்தைய சிகிச்சை', value: previousTreatment || 'Untreated', impact: hasRecentTreatment ? 'Medium' : 'Low' },
    { factor: 'AI Observation', factorTa: 'முந்தைய AI குறிப்பு', value: previousObservations ? `${previousObservations.slice(0, 35)}...` : 'First Scan', impact: 'Medium' }
  ];

  return {
    problem,
    risk,
    whyThisHappened,
    recommendedAction,
    whatToMonitor,
    nextCheck,
    problemTa,
    riskTa,
    whyThisHappenedTa,
    recommendedActionTa,
    whatToMonitorTa,
    nextCheckTa,
    urgencyLevel,
    urgencyColor,
    actionCategory,
    actionCategoryTa,
    ipmTier,
    sprayerDoseGuideline,
    keyFactorsSummary
  };
}
