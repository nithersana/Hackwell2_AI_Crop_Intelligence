export interface FarmPlot {
  id: string;
  name: string;
  nameTa: string;
  crop: string;
  cropTa: string;
  variety: string;
  acres: number;
  sowingDate: string;
  stage: string;
  stageTa: string;
  healthScore: number;
  status: 'Healthy' | 'Moderate' | 'High Risk';
  statusTa: string;
  soilMoisture: number;
  soilPh: number;
  lastIrrigated: string;
  sensorNodeId: string;
  imageThumbnail: string;
}

export interface PestRecord {
  id: string;
  pestName: string;
  pestNameTa: string;
  scientificName: string;
  targetCrop: string;
  targetCropTa: string;
  density: number; // insects per m²
  threshold: number; // ETL threshold
  severity: 'Low' | 'Moderate' | 'Critical';
  severityTa: string;
  detectedAt: string;
  trapCount: number;
  biologicalPredators: string[];
  biologicalPredatorsTa: string[];
  organicRemedy: string;
  organicRemedyTa: string;
  chemicalRemedy: string;
  chemicalRemedyTa: string;
}

export interface DiseaseDbEntry {
  id: string;
  crop: string;
  cropTa: string;
  diseaseName: string;
  diseaseNameTa: string;
  pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Physiological';
  pathogenTypeTa: string;
  scientificName: string;
  symptoms: string[];
  symptomsTa: string[];
  triggers: string;
  triggersTa: string;
  organicManagement: string;
  organicManagementTa: string;
  chemicalManagement: string;
  chemicalManagementTa: string;
  preventiveMeasures: string[];
  preventiveMeasuresTa: string[];
  color: string;
  riskMonth: string;
  riskMonthTa: string;
}

export interface EarlyAlert {
  id: string;
  type: 'disease' | 'weather' | 'pest';
  level: 'Urgent' | 'Warning' | 'Advisory';
  levelTa: string;
  title: string;
  titleTa: string;
  description: string;
  descriptionTa: string;
  affectedPlot: string;
  affectedPlotTa: string;
  actionRequired: string;
  actionRequiredTa: string;
  time: string;
  timeTa: string;
  radiusKm?: number;
  // Specific Early Warning System attributes
  crop?: string;
  cropTa?: string;
  riskPercent?: number; // e.g. 81%
  pathogenTarget?: string;
  pathogenTargetTa?: string;
  reason?: string; // "High humidity + rainfall forecast + previous disease symptoms"
  reasonTa?: string;
  riskExplanation?: string;
  riskExplanationTa?: string;
  recommendedAction?: string;
  recommendedActionTa?: string;
  factors?: {
    humidity?: number;
    rainProb?: number;
    temperature?: number;
    cropHealthScore?: number;
    previousObservation?: string;
    previousObservationTa?: string;
    pestRisk?: number;
  };
  status?: 'Active' | 'Inspected' | 'Resolved' | 'Mitigated';
  statusTa?: string;
  resolvedDate?: string;
  actionTaken?: string;
  actionTakenTa?: string;
  cropSavedPct?: number;
}

export interface TimelineMilestone {
  week: number;
  date: string;
  stage: string;
  stageTa: string;
  healthScore: number;
  status: 'Normal' | 'Dip' | 'Recovery' | 'Optimal';
  eventTitle: string;
  eventTitleTa: string;
  actionDone?: string;
  actionDoneTa?: string;
}

export interface HistoryRecord {
  id: string;
  date: string;
  plotName: string;
  plotNameTa: string;
  crop: string;
  cropTa: string;
  pathogen: string;
  pathogenTa: string;
  initialSeverity: string;
  treatmentUsed: string;
  treatmentUsedTa: string;
  outcome: 'Resolved' | 'Controlled' | 'Active';
  outcomeTa: string;
  recoveryDays: number;
}

export const INITIAL_PLOTS: FarmPlot[] = [
  {
    id: 'plot-1',
    name: 'Plot 1 - North Canal Field',
    nameTa: 'நிலம் 1 - வடக்கு வாய்க்கால் தோட்டம்',
    crop: 'Paddy (Rice)',
    cropTa: 'நெல் (பயிர்)',
    variety: 'CR-1009 Sub-1 (Savithri)',
    acres: 2.5,
    sowingDate: '2026-08-10',
    stage: 'Tillering Stage (Day 36)',
    stageTa: 'தூர்கட்டும் பருவம் (நாள் 36)',
    healthScore: 88,
    status: 'Healthy',
    statusTa: 'ஆரோக்கியமானது',
    soilMoisture: 82,
    soilPh: 6.8,
    lastIrrigated: 'Today 06:00 AM',
    sensorNodeId: 'NODE-TN-101',
    imageThumbnail: 'rice'
  },
  {
    id: 'plot-2',
    name: 'Plot 2 - South Borewell Garden',
    nameTa: 'நிலம் 2 - தெற்கு ஆழ்துளைத் தோட்டம்',
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    variety: 'Hybrid PKM-1',
    acres: 1.2,
    sowingDate: '2026-08-22',
    stage: 'Early Flowering (Day 24)',
    stageTa: 'ஆரம்ப பூக்கும் பருவம் (நாள் 24)',
    healthScore: 74,
    status: 'Moderate',
    statusTa: 'நடுத்தர ஆபத்து',
    soilMoisture: 72,
    soilPh: 6.4,
    lastIrrigated: 'Yesterday 05:30 PM',
    sensorNodeId: 'NODE-TN-102',
    imageThumbnail: 'tomato'
  },
  {
    id: 'plot-3',
    name: 'Plot 3 - East Ridge Field',
    nameTa: 'நிலம் 3 - கிழக்கு மேட்டு நிலம்',
    crop: 'Cotton',
    cropTa: 'பருத்தி',
    variety: 'MCU-5 Super Boll',
    acres: 0.8,
    sowingDate: '2026-07-28',
    stage: 'Square Formation',
    stageTa: 'சப்ப பூக்கும் பருவம்',
    healthScore: 92,
    status: 'Healthy',
    statusTa: 'ஆரோக்கியமானது',
    soilMoisture: 58,
    soilPh: 7.1,
    lastIrrigated: '3 days ago',
    sensorNodeId: 'NODE-TN-103',
    imageThumbnail: 'cotton'
  }
];

export const INITIAL_FARM_PLOTS = INITIAL_PLOTS;

export const INITIAL_PESTS: PestRecord[] = [
  {
    id: 'pest-1',
    pestName: 'Fall Armyworm',
    pestNameTa: 'படைப்புழு (Fall Armyworm)',
    scientificName: 'Spodoptera frugiperda',
    targetCrop: 'Maize & Sorghum',
    targetCropTa: 'சோளம் & கம்பு',
    density: 14,
    threshold: 10,
    severity: 'Critical',
    severityTa: 'தீவிர எச்சரிக்கை',
    detectedAt: 'Today 08:30 AM',
    trapCount: 28,
    biologicalPredators: ['Trichogramma chilonis egg parasitoid', 'Green Lacewing larvae', 'Cotesia wasps'],
    biologicalPredatorsTa: ['டிரைக்கோடெர்மா முட்டை ஒட்டுண்ணி', 'பச்சை கண்ணாடி சிறகுகள் பூச்சி', 'கோட்டேசியா குளவிகள்'],
    organicRemedy: 'Neem seed kernel extract (NSKE 5%) or Bacillus thuringiensis kurstaki (Bt) @ 2g/Litre water',
    organicRemedyTa: 'வேப்பங்கொட்டை சாறு 5% அல்லது பாசில்லஸ் துரிஞ்சியென்சிஸ் (Bt) ஒரு லிட்டர் தண்ணீருக்கு 2 கிராம்',
    chemicalRemedy: 'Emamectin benzoate 5% SG @ 0.4g/Litre water or Chlorantraniliprole 18.5% SC @ 0.3ml/Litre',
    chemicalRemedyTa: 'எமாமெக்டின் பென்சோயேட் 5% SG லிட்டருக்கு 0.4 கிராம் அல்லது குளோராண்ட்ரனிலிப்ரோல் லிட்டருக்கு 0.3 மி.லி'
  },
  {
    id: 'pest-2',
    pestName: 'Cotton Whitefly',
    pestNameTa: 'வெள்ளை ஈ (Whitefly)',
    scientificName: 'Bemisia tabaci',
    targetCrop: 'Cotton & Tomato',
    targetCropTa: 'பருத்தி & தக்காளி',
    density: 8,
    threshold: 12,
    severity: 'Moderate',
    severityTa: 'நடுத்தர ஆபத்து',
    detectedAt: 'Yesterday 04:15 PM',
    trapCount: 16,
    biologicalPredators: ['Encarsia formosa parasitic wasp', 'Coccinellid predator beetles'],
    biologicalPredatorsTa: ['என்கார்சியா ஒட்டுண்ணி குளவி', 'பொறி வண்டுகள்'],
    organicRemedy: 'Hang Yellow Sticky Traps (10 per acre) and spray 10,000 ppm Neem Oil @ 3ml/Litre with soap water',
    organicRemedyTa: 'ஏக்கருக்கு 10 மஞ்சள் ஒட்டும் பொறிகள் கட்டவும்; வேப்பெண்ணெய் 10,000 ppm 3 மி.லி சோப்பு நீரில் தெளிக்கவும்',
    chemicalRemedy: 'Diafenthiuron 50% WP @ 1g/Litre or Spiromesifen 22.9% SC @ 1ml/Litre',
    chemicalRemedyTa: 'டயாபெந்தியூரான் 50% WP லிட்டருக்கு 1 கிராம் அல்லது ஸ்பைரோமெசிபென் லிட்டருக்கு 1 மி.லி'
  },
  {
    id: 'pest-3',
    pestName: 'Tomato Leaf Miner',
    pestNameTa: 'இலைத்துளைப்பான் (Leaf Miner)',
    scientificName: 'Tuta absoluta',
    targetCrop: 'Tomato',
    targetCropTa: 'தக்காளி',
    density: 6,
    threshold: 8,
    severity: 'Low',
    severityTa: 'குறைந்த ஆபத்து',
    detectedAt: '2 days ago',
    trapCount: 7,
    biologicalPredators: ['Nesidiocoris tenuis predatory bug'],
    biologicalPredatorsTa: ['நெசிடியோகோரிஸ் வேட்டை நாவாய்ப்பூச்சி'],
    organicRemedy: 'Install Pheromone delta lures @ 8/acre; Spray Beauveria bassiana @ 5g/Litre',
    organicRemedyTa: 'ஏக்கருக்கு 8 இனக்கவர்ச்சி பொறிகள் வைக்கவும்; பவேரியா பேசியானா லிட்டருக்கு 5 கிராம் தெளிக்கவும்',
    chemicalRemedy: 'Spinosad 45% SC @ 0.3ml/Litre water during evening hours',
    chemicalRemedyTa: 'ஸ்பினோசாட் 45% SC லிட்டருக்கு 0.3 மி.லி மாலை வேளையில் தெளிக்கவும்'
  }
];

export const INITIAL_ALERTS: EarlyAlert[] = [
  {
    id: 'alt-1',
    type: 'disease',
    level: 'Urgent',
    levelTa: 'உடனடி கவனம் தேவை (High Risk)',
    title: '⚠️ EARLY DISEASE ALERT',
    titleTa: '⚠️ ஆரம்பகால நோய் எச்சரிக்கை',
    description: 'Your tomato crop has a high fungal disease risk.',
    descriptionTa: 'உங்கள் தக்காளி பயிரில் அதிக பூஞ்சை நோய் பரவும் அபாயம் உள்ளது.',
    affectedPlot: 'Plot 2 (Tomato - Hybrid PKM-1)',
    affectedPlotTa: 'நிலம் 2 (தக்காளி - PKM-1)',
    actionRequired: 'Inspect nearby plants and take preventive action.',
    actionRequiredTa: 'அருகிலுள்ள செடிகளை உடனே பரிசோதித்து தடுப்பு நடவடிக்கைகளை எடுக்கவும்.',
    time: 'Just now (Live Alert)',
    timeTa: 'சற்று முன் (நேரலை எச்சரிக்கை)',
    radiusKm: 1.2,
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    riskPercent: 81,
    pathogenTarget: 'Early Blight (Alternaria solani) & Late Blight',
    pathogenTargetTa: 'ஆரம்ப இலைக்கருகல் & பின்கருகல் பூஞ்சை',
    reason: 'High humidity + rainfall forecast + previous disease symptoms.',
    reasonTa: 'அதிக ஈரப்பதம் + மழை முன்னறிவிப்பு + முந்தைய நோய் அறிகுறிகள்.',
    riskExplanation: 'Current relative humidity has reached 84% with continuous canopy moisture, and 72% rain probability is forecasted over the next 24-48 hours. Fungal spores (Alternaria solani) from residual soil inoculum are in their active pre-symptomatic germination stage. If unaddressed, conidial germ tubes will penetrate plant stomata within 12-18 hours, resulting in irreversible concentric lesions, defoliation, and fruit drop.',
    riskExplanationTa: 'பயிர் விதானத்தில் ஈரப்பதம் 84%-க்கு அதிகமாகவும், அடுத்த 24-48 மணி நேரத்தில் 72% மழை வாய்ப்பும் உள்ளது. முந்தைய பயிர் பருவத்தில் இருந்த பூஞ்சை வித்துக்கள் தற்போது முளைத்து இலைகளில் நுழையும் தீவிர நிலையில் உள்ளன. உடனே தடுப்பு மருந்து தெளிக்கவில்லையெனில் 12-18 மணி நேரத்தில் கருகல் புள்ளிகள் தோன்றி 40% வரை விளைச்சல் இழப்பை ஏற்படுத்தும்.',
    recommendedAction: 'Inspect nearby plants and take preventive action. Walk rows in Plot 2 checking bottom leaves for dark pinhead spots. Apply prophylactic foliar bio-shield (Trichoderma viride @ 5g/L or Mancozeb 75% WP @ 2g/L) before evening rain, and prune lower leaves touching moist soil.',
    recommendedActionTa: 'அருகிலுள்ள செடிகளை பரிசோதித்து தடுப்பு நடவடிக்கை எடுக்கவும்: நிலம் 2-ல் கீழ் இலைகளின் அடிப்பகுதியில் புள்ளிகள் உள்ளதா என பார்க்கவும். மழை தொடங்குவதற்கு முன் மாங்கோசெப் (Mancozeb) லிட்டருக்கு 2 கிராம் அல்லது டிரைக்கோடெர்மா லிட்டருக்கு 5 கிராம் தெளிக்கவும். நிலத்தில் படும் அடி இலைகளை கவாத்து செய்து அகற்றவும்.',
    factors: {
      humidity: 84,
      rainProb: 72,
      temperature: 28,
      cropHealthScore: 74,
      previousObservation: 'Early Blight recorded last season in Plot 2',
      previousObservationTa: 'கடந்த பருவத்தில் நிலம் 2-ல் பதிவான ஆரம்ப இலைக்கருகல் அறிகுறிகள்',
      pestRisk: 42
    },
    status: 'Active',
    statusTa: 'செயலில் உள்ளது'
  },
  {
    id: 'alt-2',
    type: 'disease',
    level: 'Urgent',
    levelTa: 'உடனடி கவனம் தேவை',
    title: '⚠️ EARLY DISEASE ALERT: Paddy Leaf Blast Risk Surge',
    titleTa: '⚠️ ஆரம்பகால நோய் எச்சரிக்கை: நெல் குலைநோய் அபாயம்',
    description: 'Your paddy crop has an elevated fungal blast incubation risk (78%).',
    descriptionTa: 'உங்கள் நெல் பயிரில் குலைநோய் (Blast) பூஞ்சை உருவாகும் அபாயம் 78% உள்ளது.',
    affectedPlot: 'Plot 1 (Paddy - CR-1009 Savithri)',
    affectedPlotTa: 'நிலம் 1 (நெல் - CR-1009 சாவித்திரி)',
    actionRequired: 'Inspect leaf collars for spindle lesions and apply prophylactic bio-agent.',
    actionRequiredTa: 'இலை இணைப்புகளில் கண் வடிவ புள்ளிகள் உள்ளதா என பார்த்து சூடோமோனாஸ் தெளிக்கவும்.',
    time: '25 mins ago',
    timeTa: '25 நிமிடங்களுக்கு முன்',
    radiusKm: 2.5,
    crop: 'Paddy (Rice)',
    cropTa: 'நெல்',
    riskPercent: 78,
    pathogenTarget: 'Rice Blast (Magnaporthe oryzae)',
    pathogenTargetTa: 'நெல் குலைநோய் (Magnaporthe oryzae)',
    reason: 'Cool night temperature (21°C) + 94% morning dew + heavy basal urea application.',
    reasonTa: 'குளிர்ந்த இரவு வெப்பநிலை (21°C) + 94% காலைப் பனி + அதிகப்படியான தழைச்சத்து.',
    riskExplanation: 'Consecutive dew periods exceeding 9 hours paired with nighttime temperatures under 22°C creates the textbook environment for Magnaporthe blast spores to release appressoria. Nitrogen-rich tender leaves have thinner cuticles, increasing fungal penetration velocity.',
    riskExplanationTa: 'தொடர்ந்து 9 மணி நேரத்திற்கு மேல் பனிப்பொழிவும் 22°C-க்கு குறைவான வெப்பநிலையும் குலைநோய் பூஞ்சை இலை நரம்புகளில் எளிதில் ஊடுருவ வழிவகுக்கிறது.',
    recommendedAction: 'Withhold additional urea top-dressing. Spray Pseudomonas fluorescens @ 5g/Litre or Tricyclazole 75% WP @ 0.6g/Litre water during calm morning hours.',
    recommendedActionTa: 'யூரியா உரமிடுவதை உடனடியாக நிறுத்தி, லிட்டருக்கு 0.6 கிராம் டிரைசைக்ளசோல் அல்லது 5 கிராம் சூடோமோனாஸ் தெளிக்கவும்.',
    factors: {
      humidity: 94,
      rainProb: 65,
      temperature: 24,
      cropHealthScore: 82,
      previousObservation: 'Neck blast observed in adjoining field block',
      previousObservationTa: 'அக்கம்பக்கத்து வயலில் கழுத்து குலைநோய் அறிகுறி',
      pestRisk: 30
    },
    status: 'Active',
    statusTa: 'செயலில் உள்ளது'
  },
  {
    id: 'alt-3',
    type: 'pest',
    level: 'Warning',
    levelTa: 'எச்சரிக்கை',
    title: '⚠️ EARLY PEST ALERT: Cotton Whitefly Vector Flare-up',
    titleTa: '⚠️ பூச்சி தாக்குதல் எச்சரிக்கை: பருத்தி வெள்ளை ஈ பெருக்கம்',
    description: 'Whitefly sticky card counts exceeded threshold in Plot 3 (68% risk).',
    descriptionTa: 'நிலம் 3-ல் வெள்ளை ஈக்களின் எண்ணிக்கை பொருளாதார சேத நிலையை எட்டியுள்ளது (68% ஆபத்து).',
    affectedPlot: 'Plot 3 (Cotton & Border Sorghum)',
    affectedPlotTa: 'நிலம் 3 (பருத்தி & எல்லை சோளம்)',
    actionRequired: 'Deploy 10 yellow sticky cards per acre and spray 10,000 ppm Neem Oil.',
    actionRequiredTa: 'ஏக்கருக்கு 10 மஞ்சள் ஒட்டும் பொறிகள் வைத்து 10,000 ppm வேப்பெண்ணெய் தெளிக்கவும்.',
    time: '2 hours ago',
    timeTa: '2 மணி நேரத்திற்கு முன்',
    radiusKm: 3.8,
    crop: 'Cotton',
    cropTa: 'பருத்தி',
    riskPercent: 68,
    pathogenTarget: 'Cotton Whitefly (Bemisia tabaci) & CLCuV Vector',
    pathogenTargetTa: 'வெள்ளை ஈ மற்றும் இலைச்சுருள் வைரஸ்',
    reason: 'Warm dry spells (32°C) + low predator beetle density + neighboring farm migration.',
    reasonTa: 'மிதமான வெயில் (32°C) + இயற்கை எதிரி வண்டுகள் குறைவு + அருகாமை வயல் இடப்பெயர்வு.',
    riskExplanation: 'Warm canopy microclimates accelerate whitefly nymph development cycles from 21 days down to 14 days. Sucking nymphs excrete honeydew that attracts sooty mold while transmitting Leaf Curl Virus.',
    riskExplanationTa: 'வெப்பமான வானிலை வெள்ளை ஈக்களின் வளர்ச்சி சுழற்சியை துரிதப்படுத்தி, தேன்பனி கழிவு மூலம் கரும்பூஞ்சை பரவவும் இலைச்சுருள் வைரஸ் தொற்றவும் காரணமாகிறது.',
    recommendedAction: 'Install 10 yellow sticky traps per acre immediately at canopy height. Spray 10,000 ppm Neem Oil formulation (3ml/L) to deter egg oviposition before nymphs colonize upper leaves.',
    recommendedActionTa: 'பயிர் உயரத்தில் ஏக்கருக்கு 10 மஞ்சள் பொறிகளை உடனே கட்டவும். வேப்பெண்ணெய் 10,000 ppm (லிட்டருக்கு 3 மி.லி) சோப்பு நீரில் கலந்து மாலை வேளையில் தெளிக்கவும்.',
    factors: {
      humidity: 68,
      rainProb: 35,
      temperature: 32,
      cropHealthScore: 84,
      previousObservation: 'Whitefly clusters recorded along field margins 4 days ago',
      previousObservationTa: '4 நாட்களுக்கு முன் வரப்புகளில் வெள்ளை ஈக்கள் தென்பட்டன',
      pestRisk: 68
    },
    status: 'Active',
    statusTa: 'செயலில் உள்ளது'
  },
  {
    id: 'alt-4',
    type: 'weather',
    level: 'Advisory',
    levelTa: 'வானிலை ஆலோசனை',
    title: '⚠️ WEATHER ALERT: 45-60mm Heavy Rainfall Approaching',
    titleTa: '⚠️ வானிலை எச்சரிக்கை: 45-60 மி.மீ கனமழை வரவிருக்கிறது',
    description: 'Incoming monsoon band will saturate low-lying fields within 36 hours.',
    descriptionTa: 'அடுத்த 36 மணி நேரத்தில் கனமழை பெய்ய வாய்ப்புள்ளதால் வடிகால் வாய்க்கால்களை சீரமைக்கவும்.',
    affectedPlot: 'All Plots (Plot 1, Plot 2, Plot 3)',
    affectedPlotTa: 'அனைத்து நிலங்களும் (நிலம் 1, 2, 3)',
    actionRequired: 'Deepen drainage trenches, secure nursery bunds, postpone chemical sprays.',
    actionRequiredTa: 'வடிகால் வாய்க்கால்களை ஆழப்படுத்தி, ரசாயன தெளிப்பு பணிகளை ஒத்திவைக்கவும்.',
    time: 'Today 06:15 AM',
    timeTa: 'இன்று காலை 06:15',
    radiusKm: 15,
    crop: 'All Farm Crops',
    cropTa: 'அனைத்து பயிர்களும்',
    riskPercent: 55,
    reason: 'Deep depression in Bay of Bengal + high convective cloud buildup.',
    reasonTa: 'வங்கக் கடலில் காற்றழுத்த தாழ்வு மண்டலம் + அடர்ந்த மேகக்கூட்டங்கள்.',
    riskExplanation: 'Heavy rainfall without adequate field drainage promotes anaerobic root rot (Rhizoctonia/Pythium) and washes away any recently applied protective foliar coatings.',
    riskExplanationTa: 'வடிகால் இல்லாத நீர் தேக்கம் வேர் அழுகல் நோயை உண்டாக்கும் மற்றும் சமீபத்தில் தெளிக்கப்பட்ட பாதுகாப்பு மருந்துகளை அடித்துச் செல்லும்.',
    recommendedAction: 'Open all perimeter drainage outlets immediately. Do not spray contact chemicals until rain clears.',
    recommendedActionTa: 'அனைத்து வயல் வடிகால்களையும் திறந்துவிடவும். மழை நிற்கும் வரை எந்த தெளிப்பும் செய்ய வேண்டாம்.',
    factors: {
      humidity: 92,
      rainProb: 88,
      temperature: 26,
      cropHealthScore: 86,
      previousObservation: 'Flash flooding recorded in canal basin 2 years ago',
      previousObservationTa: '2 ஆண்டுகளுக்கு முன் கால்வாய் பகுதியில் நீர் தேங்கியது',
      pestRisk: 25
    },
    status: 'Active',
    statusTa: 'செயலில் உள்ளது'
  }
];

export const INITIAL_ALERT_HISTORY: EarlyAlert[] = [
  {
    id: 'hist-alt-1',
    type: 'disease',
    level: 'Urgent',
    levelTa: 'உடனடி கவனம் தேவை (வெற்றிகரமாக தடுக்கப்பட்டது)',
    title: '⚠️ EARLY DISEASE ALERT: Tomato Early Blight Threat',
    titleTa: '⚠️ முந்தைய எச்சரிக்கை: தக்காளி இலைக்கருகல் அபாயம்',
    description: 'High fungal risk warning triggered by 88% humidity and spore incubation in Plot 2.',
    descriptionTa: 'நிலம் 2-ல் 88% ஈரப்பதம் காரணமாக ஆரம்ப இலைக்கருகல் பூஞ்சை வித்துக்கள் பெருக்கம் எச்சரிக்கை.',
    affectedPlot: 'Plot 2 (Tomato - Hybrid PKM-1)',
    affectedPlotTa: 'நிலம் 2 (தக்காளி - PKM-1)',
    actionRequired: 'Inspect nearby plants, spray Trichoderma viride, prune lower leaves.',
    actionRequiredTa: 'பக்கத்து செடிகளை ஆய்வு செய்து, டிரைக்கோடெர்மா தெளித்து அடி இலைகளை அகற்றவும்.',
    time: 'Aug 26, 2026',
    timeTa: 'ஆக 26, 2026',
    radiusKm: 1.0,
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    riskPercent: 84,
    pathogenTarget: 'Early Blight (Alternaria solani)',
    pathogenTargetTa: 'ஆரம்ப இலைக்கருகல் (Alternaria solani)',
    reason: 'High humidity (88%) + intermittent drizzle + residual crop residue in soil.',
    reasonTa: 'அதிக ஈரப்பதம் (88%) + இடைவிடாத தூறல் + மண்ணில் பழைய பயிர் எச்சங்கள்.',
    riskExplanation: 'Pre-symptomatic alert triggered before lesions spread to canopy. Intervened within 14 hours of spore release.',
    riskExplanationTa: 'நோய் இலைகளில் பரவுவதற்கு முன் விடுக்கப்பட்ட எச்சரிக்கை. 14 மணி நேரத்தில் தடுப்பு நடவடிக்கை எடுக்கப்பட்டது.',
    recommendedAction: 'Scouted 150 plants in 5m radius; applied Trichoderma viride 5g/L; reduced drip irrigation.',
    recommendedActionTa: '5 மீட்டர் சுற்றளவில் 150 செடிகள் ஆய்வு; டிரைக்கோடெர்மா தெளிப்பு; சொட்டுநீர் குறைப்பு.',
    actionTaken: 'Farmer scouted Plot 2, detected 4 pinpoint water-soaked spots, applied Trichoderma foliar spray and removed lower senescent leaves.',
    actionTakenTa: 'விவசாயி நிலம் 2-ஐ ஆய்வு செய்து, 4 ஆரம்ப புள்ளிகளை கண்டறிந்து, டிரைக்கோடெர்மா தெளித்து அடி இலைகளை அகற்றினார்.',
    status: 'Resolved',
    statusTa: 'முழுமையாக தீர்க்கப்பட்டது',
    resolvedDate: 'Sep 01, 2026 (6 days after trigger)',
    cropSavedPct: 96
  },
  {
    id: 'hist-alt-2',
    type: 'disease',
    level: 'Urgent',
    levelTa: 'உடனடி கவனம் தேவை',
    title: '⚠️ EARLY DISEASE ALERT: Paddy Bacterial Blight Spore Surge',
    titleTa: '⚠️ முந்தைய எச்சரிக்கை: நெல் பாக்டீரியா கருகல் அபாயம்',
    description: 'Wind-driven rain and 30°C temperature triggered bacterial ooze transmission alert.',
    descriptionTa: 'மழைக்காற்று மற்றும் 30°C வெப்பத்தால் பாக்டீரியா கருகல் பரவும் அபாய எச்சரிக்கை.',
    affectedPlot: 'Plot 1 (Paddy - CR-1009 Sub-1)',
    affectedPlotTa: 'நிலம் 1 (நெல் - CR-1009 சப்-1)',
    actionRequired: 'Drain standing water and apply Streptocycline + Copper Oxychloride.',
    actionRequiredTa: 'தேங்கிய நீரை வடித்து ஸ்ட்ரெப்டோசைக்ளின் + காப்பர் ஆக்ஸிகுளோரைடு தெளிக்கவும்.',
    time: 'Aug 14, 2026',
    timeTa: 'ஆக 14, 2026',
    crop: 'Paddy',
    cropTa: 'நெல்',
    riskPercent: 76,
    pathogenTarget: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    pathogenTargetTa: 'பாக்டீரியா இலைக்கருகல் (Xanthomonas oryzae)',
    reason: 'Heavy rain splashing + injured leaf tips from wind + excess urea in tiller stage.',
    reasonTa: 'கனமழை துளிகள் + பலத்த காற்றில் இலை நுனி சேதம் + அதிக தழைச்சத்து.',
    recommendedAction: 'Drain field water immediately; apply Streptocycline 1g/10L + Copper Oxychloride 25g/10L.',
    recommendedActionTa: 'வயல் நீரை உடனே வடிக்கவும்; ஸ்ட்ரெப்டோசைக்ளின் 1 கிராம் + காப்பர் ஆக்ஸிகுளோரைடு 25 கிராம் தெளிக்கவும்.',
    actionTaken: 'Cleared field bunds to drain 4 inches of excess water; applied recommended copper bactericide tank mix at 07:00 AM.',
    actionTakenTa: 'வயல் வரப்புகளை திறந்து 4 அங்குல உபரி நீரை வடித்தார்; காலை 7 மணிக்கு பரிந்துரைக்கப்பட்ட மருந்தை தெளித்தார்.',
    status: 'Mitigated',
    statusTa: 'கட்டுப்படுத்தப்பட்டது',
    resolvedDate: 'Aug 23, 2026 (9 days after trigger)',
    cropSavedPct: 91
  },
  {
    id: 'hist-alt-3',
    type: 'pest',
    level: 'Warning',
    levelTa: 'எச்சரிக்கை (தடுக்கப்பட்டது)',
    title: '⚠️ EARLY PEST ALERT: Cotton Leaf Curl Whitefly Vectors',
    titleTa: '⚠️ முந்தைய எச்சரிக்கை: பருத்தி வெள்ளை ஈ பரவல்',
    description: 'Sticky trap count jumped to 14/card; vector threshold exceeded.',
    descriptionTa: 'ஒட்டும் பொறியில் வெள்ளை ஈ எண்ணிக்கை 14 ஆக உயர்ந்து ஆபத்து நிலையை தாண்டியது.',
    affectedPlot: 'Plot 3 (Cotton - Hybrid RCH-2)',
    affectedPlotTa: 'நிலம் 3 (பருத்தி - RCH-2)',
    actionRequired: 'Install yellow sticky traps and spray 10,000 ppm Neem Oil.',
    actionRequiredTa: 'மஞ்சள் பொறிகளை அமைத்து வேப்பெண்ணெய் தெளிக்கவும்.',
    time: 'Jul 30, 2026',
    timeTa: 'ஜூலை 30, 2026',
    crop: 'Cotton',
    cropTa: 'பருத்தி',
    riskPercent: 71,
    pathogenTarget: 'Bemisia tabaci (Whitefly Vector)',
    pathogenTargetTa: 'வெள்ளை ஈ (இலைச்சுருள் கடத்தி)',
    reason: 'High daytime temperature (34°C) + dry winds + surrounding weed hosts.',
    reasonTa: 'அதிக பகல் வெப்பம் (34°C) + வறண்ட காற்று + வரப்பு களைகள்.',
    recommendedAction: 'Cleared border parthenium weeds; erected 12 yellow sticky sheets per acre; sprayed neem oil 3ml/L.',
    recommendedActionTa: 'வரப்பு பார்த்தீனியம் களைகளை அகற்றினார்; ஏக்கருக்கு 12 மஞ்சள் பொறிகள் கட்டினார்; வேப்பெண்ணெய் தெளித்தார்.',
    actionTaken: 'Erected 12 yellow sticky sheets; foliar sprayed cold-pressed neem formulation; nymph population dropped by 84% in 4 days.',
    actionTakenTa: '12 மஞ்சள் பொறிகளை கட்டி வேப்பெண்ணெய் தெளித்தார்; 4 நாட்களில் வெள்ளை ஈக்களின் எண்ணிக்கை 84% குறைந்தது.',
    status: 'Resolved',
    statusTa: 'முழுமையாக தீர்க்கப்பட்டது',
    resolvedDate: 'Aug 04, 2026 (5 days after trigger)',
    cropSavedPct: 98
  }
];

export const INITIAL_TIMELINE: TimelineMilestone[] = [
  {
    week: 1,
    date: '10 Aug 2026',
    stage: 'Seed Sowing & Germination',
    stageTa: 'விதை விதைத்தல் & முளைப்பு',
    healthScore: 95,
    status: 'Optimal',
    eventTitle: 'Bio-Primed Seeds Sown',
    eventTitleTa: 'உயிர் உரம் கலந்த விதைகள் விதைக்கப்பட்டது',
    actionDone: 'Pseudomonas fluorescens seed treatment (10g/kg)',
    actionDoneTa: 'சூடோமோனாஸ் விதை நேர்த்தி செய்யப்பட்டது (10g/kg)'
  },
  {
    week: 2,
    date: '17 Aug 2026',
    stage: 'Early Seedling Emergence',
    stageTa: 'நாற்று வெளிப்பாடு பருவம்',
    healthScore: 92,
    status: 'Normal',
    eventTitle: 'Uniform Emergence Observed',
    eventTitleTa: 'சீரான நாற்று வளர்ச்சி',
    actionDone: 'First light irrigation applied via canal',
    actionDoneTa: 'வாய்க்கால் மூலம் முதல் மித நீர் பாய்ச்சப்பட்டது'
  },
  {
    week: 3,
    date: '24 Aug 2026',
    stage: 'Active Tillering Initial',
    stageTa: 'முதல் தூர்வெடிப்பு பருவம்',
    healthScore: 78,
    status: 'Dip',
    eventTitle: 'Leaf Folder & Thrips Infestation',
    eventTitleTa: 'இலைச்சுருட்டுப் புழு & இலைப்பேன் தாக்குதல்',
    actionDone: 'Neem oil spray (3%) + Light trap set up',
    actionDoneTa: 'வேப்பெண்ணெய் 3% தெளித்து விளக்குப்பொறி வைக்கப்பட்டது'
  },
  {
    week: 4,
    date: '31 Aug 2026',
    stage: 'Tillering Recovery',
    stageTa: 'தூர் மீட்புப் பருவம்',
    healthScore: 86,
    status: 'Recovery',
    eventTitle: 'Chlorophyll Restored & Vigorous Growth',
    eventTitleTa: 'பயிரில் பசுமை மீண்டு புதிய தூர்கள் உருவானது',
    actionDone: 'Vermicompost + Zinc sulphate foliar nourishment',
    actionDoneTa: 'மண்புழு உரம் + துத்தநாக சல்பேட் தெளிக்கப்பட்டது'
  },
  {
    week: 5,
    date: '08 Sep 2026',
    stage: 'Max Tillering Stage (Current)',
    stageTa: 'முழு தூர்வெடிப்பு பருவம் (தற்போதைய நிலை)',
    healthScore: 88,
    status: 'Optimal',
    eventTitle: 'Optimal Canopy Architecture',
    eventTitleTa: 'சிறந்த பயிர் பசுமை மற்றும் தூர் எண்ணிக்கை',
    actionDone: 'IoT microclimate sensors deployed in Plot 1',
    actionDoneTa: 'நிலம் 1-ல் IoT சென்சார்கள் நிறுவப்பட்டன'
  }
];

export const INITIAL_HISTORY: HistoryRecord[] = [
  {
    id: 'hist-1',
    date: '2026-08-25',
    plotName: 'Plot 2 - South Borewell',
    plotNameTa: 'நிலம் 2 - தெற்கு ஆழ்துளை',
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    pathogen: 'Early Blight (Alternaria solani)',
    pathogenTa: 'ஆரம்பகால இலைக்கருகல் நோய்',
    initialSeverity: 'Moderate (22% leaf surface)',
    treatmentUsed: 'Trichoderma viride + Reduced drip volume by 30%',
    treatmentUsedTa: 'டிரைக்கோடெர்மா விரிடி + சொட்டுநீர் அளவு 30% குறைப்பு',
    outcome: 'Resolved',
    outcomeTa: 'முழுமையாக குணமானது',
    recoveryDays: 6
  },
  {
    id: 'hist-2',
    date: '2026-08-14',
    plotName: 'Plot 1 - North Canal',
    plotNameTa: 'நிலம் 1 - வடக்கு வாய்க்கால்',
    crop: 'Paddy',
    cropTa: 'நெல்',
    pathogen: 'Bacterial Leaf Blight (Xanthomonas)',
    pathogenTa: 'பாக்டீரியா இலைக்கருகல் நோய்',
    initialSeverity: 'High (34% leaf surface)',
    treatmentUsed: 'Streptocycline (1g) + Copper Oxychloride (30g) per 10L',
    treatmentUsedTa: 'ஸ்ட்ரெப்டோசைக்ளின் (1g) + காப்பர் ஆக்ஸிகுளோரைடு (30g)',
    outcome: 'Controlled',
    outcomeTa: 'கட்டுப்படுத்தப்பட்டது',
    recoveryDays: 9
  },
  {
    id: 'hist-3',
    date: '2026-07-30',
    plotName: 'Plot 3 - East Ridge',
    plotNameTa: 'நிலம் 3 - கிழக்கு மேட்டு நிலம்',
    crop: 'Cotton',
    cropTa: 'பருத்தி',
    pathogen: 'Cotton Leaf Curl Virus (CLCuV)',
    pathogenTa: 'பருத்தி இலைச்சுருள் வைரஸ்',
    initialSeverity: 'Low (Whitefly vector control)',
    treatmentUsed: 'Yellow sticky traps + Neem oil spray 10,000 ppm',
    treatmentUsedTa: 'மஞ்சள் பொறிகள் + வேப்பெண்ணெய் 10,000 ppm',
    outcome: 'Resolved',
    outcomeTa: 'முழுமையாக குணமானது',
    recoveryDays: 4
  }
];

export const DISEASE_DATABASE: DiseaseDbEntry[] = [
  {
    id: 'dis-1',
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    diseaseName: 'Tomato Late Blight',
    diseaseNameTa: 'தக்காளி பின்கருகல் நோய் (Late Blight)',
    pathogenType: 'Fungal',
    pathogenTypeTa: 'பூஞ்சை (Oomycete)',
    scientificName: 'Phytophthora infestans',
    symptoms: [
      'Large irregular water-soaked dark lesions on leaves and stems',
      'White cottony fungal growth on underside of leaves under high humidity',
      'Rapid collapse of foliage and brown rot on unripe green fruits'
    ],
    symptomsTa: [
      'இலைகள் மற்றும் தண்டுகளில் நீர் தோய்ந்த பெரிய கரும்பழுப்பு புள்ளிகள்',
      'அதிக ஈரப்பதத்தின் போது இலையின் அடிப்புறத்தில் வெள்ளை நிற பூஞ்சை படிவம்',
      'இலைகள் கருகி உதிர்தல் மற்றும் காய்களில் பழுப்பு நிற அழுகல் ஏற்படுதல்'
    ],
    triggers: 'Prolonged leaf wetness >8 hours, relative humidity >90%, temperatures between 15°C - 22°C.',
    triggersTa: 'இலைகளில் 8 மணி நேரத்திற்கும் மேல் ஈரம் இருத்தல், 90% மேல் ஈரப்பதம், 15°C - 22°C குளிர் வானிலை.',
    organicManagement: 'Spray Trichoderma harzianum or Bacillus subtilis @ 5g/Litre water with jaggery sticker. Spray 3% fermented buttermilk.',
    organicManagementTa: 'டிரைக்கோடெர்மா ஹார்சியானம் அல்லது பேசில்லஸ் சப்டிலிஸ் 5g/L தெளிக்கவும். 3% புளித்த மோர் தெளிக்கலாம்.',
    chemicalManagement: 'Mancozeb 75% WP @ 2g/Litre or Metalaxyl + Mancozeb (Ridomil MZ) @ 2.5g/Litre water.',
    chemicalManagementTa: 'மேன்கோசெப் 75% WP லிட்டருக்கு 2 கிராம் அல்லது மெட்டலாக்சில் + மேன்கோசெப் 2.5 கிராம் தெளிக்கவும்.',
    preventiveMeasures: [
      'Avoid overhead sprinkler irrigation; strictly use drip lines',
      'Maintain 60cm row spacing to allow solar ventilation',
      'Remove and burn infected plant debris immediately'
    ],
    preventiveMeasuresTa: [
      'மேலிருந்து தெளிக்கும் தெளிப்பானை தவிர்த்து சொட்டுநீர் பாசனம் பயன்படுத்தவும்',
      'காற்றோட்டத்திற்கு 60 செ.மீ இடைவெளி பராமரிக்கவும்',
      'பாதிக்கப்பட்ட இலைகளை உடனே அப்புறப்படுத்தி எரிக்கவும்'
    ],
    color: '#dc2626',
    riskMonth: 'October - January',
    riskMonthTa: 'ஐப்பசி - தை (அக்டோபர் - ஜனவரி)'
  },
  {
    id: 'dis-2',
    crop: 'Paddy (Rice)',
    cropTa: 'நெல்',
    diseaseName: 'Rice Leaf Blast',
    diseaseNameTa: 'நெல் குலைநோய் / பிளாஸ்ட் (Blast)',
    pathogenType: 'Fungal',
    pathogenTypeTa: 'பூஞ்சை',
    scientificName: 'Magnaporthe oryzae',
    symptoms: [
      'Spindle-shaped diamond lesions with gray-white center and reddish-brown margins',
      'Coalescence of lesions leading to total foliar blast burn',
      'Neck rot at heading stage causing empty chaffy grains'
    ],
    symptomsTa: [
      'சாம்பல் நிற மையமும் பழுப்பு ஓரமும் கொண்ட கண் வடிவ/வைர வடிவ புள்ளிகள்',
      'புள்ளிகள் ஒன்றிணைந்து இலை முழுவதும் கருகிப்போதல்',
      'கதிர் வெளிவரும் பருவத்தில் கழுத்துப் பகுதியில் அழுகி பதராகுதல்'
    ],
    triggers: 'Heavy nitrogen over-fertilization, night temperatures 20-24°C with heavy morning dew.',
    triggersTa: 'அதிகப்படியான யூரியா உரம் இடுதல், இரவில் பனிப்பொழிவு மற்றும் 20-24°C வெப்பநிலை.',
    organicManagement: 'Foliar spray of Pseudomonas fluorescens @ 5g/Litre or 10% Tulsi & Neem leaf extract.',
    organicManagementTa: 'சூடோமோனாஸ் ஃபுளோரசன்ஸ் லிட்டருக்கு 5 கிராம் அல்லது 10% துளசி மற்றும் வேப்பிலை சாறு தெளிக்கவும்.',
    chemicalManagement: 'Tricyclazole 75% WP @ 0.6g/Litre or Isoprothiolane 40% EC @ 1.5ml/Litre water.',
    chemicalManagementTa: 'டிரைசைக்ளசோல் 75% WP லிட்டருக்கு 0.6 கிராம் அல்லது ஐசோபுரோதியோலேன் 1.5 மி.லி தெளிக்கவும்.',
    preventiveMeasures: [
      'Split nitrogen application into 3-4 stages rather than single heavy dose',
      'Seed treatment with Carbendazim or Pseudomonas before nursery sowing',
      'Select blast-resistant cultivars (CR-1009 Sub-1, CO-51)'
    ],
    preventiveMeasuresTa: [
      'தழைச்சத்தை ஒரே நேரத்தில் இடாமல் 3-4 தவணைகளாக பிரித்து இடவும்',
      'விதைகளை சூடோமோனாஸ் கொண்டு விதைநேர்த்தி செய்யவும்',
      'நோய் எதிர்ப்புத் திறன் கொண்ட ரகங்களை பயிரிடவும் (CO-51, CR-1009)'
    ],
    color: '#ea580c',
    riskMonth: 'November - February',
    riskMonthTa: 'கார்த்திகை - மாசி'
  },
  {
    id: 'dis-3',
    crop: 'Cotton',
    cropTa: 'பருத்தி',
    diseaseName: 'Cotton Bacterial Blight',
    diseaseNameTa: 'பருத்தி கோண இலைப்புள்ளி நோய் (Bacterial Blight)',
    pathogenType: 'Bacterial',
    pathogenTypeTa: 'பாக்டீரியா',
    scientificName: 'Xanthomonas citri pv. malvacearum',
    symptoms: [
      'Angular water-soaked spots restricted by veinlets on leaves',
      'Black arm lesions on stems and petiole girdling',
      'Boll rot with sunken black circular spots'
    ],
    symptomsTa: [
      'இலை நரம்புகளுக்கு இடைப்பட்ட கோண வடிவ நீர் தோய்ந்த புள்ளிகள்',
      'தண்டுகளில் கருப்பு நிற கோடுகள் மற்றும் கிளைகள் உடைந்து விழுதல்',
      'காய்களில் பழுப்பு நிற பள்ளமான புள்ளிகள் மற்றும் அழுகல்'
    ],
    triggers: 'Warm wet storms, rain splashing, ambient temperature 28°C-34°C with humidity >80%.',
    triggersTa: 'மழைக்காற்றுடன் கூடிய வெயில், 28°C - 34°C வெப்பம் மற்றும் 80% மேல் ஈரப்பதம்.',
    organicManagement: 'Spray 5% fresh cow urine solution with 1% asafoetida (perungayam) solution.',
    organicManagementTa: '5% நாட்டு மாட்டு சிறுநீர் கரைசலுடன் 1% பெருங்காயக் கரைசல் கலந்து தெளிக்கவும்.',
    chemicalManagement: 'Streptocycline 100 ppm (1g/10L) + Copper Oxychloride 50% WP @ 25g/10L water.',
    chemicalManagementTa: 'ஸ்ட்ரெப்டோசைக்ளின் 1 கிராம் + காப்பர் ஆக்ஸிகுளோரைடு 25 கிராம் 10 லிட்டர் நீரில் கலந்து தெளிக்கவும்.',
    preventiveMeasures: [
      'Delint seeds with concentrated sulfuric acid before sowing',
      'Avoid flood irrigation during heavy disease incidence',
      'Maintain clean inter-cultivation weeding'
    ],
    preventiveMeasuresTa: [
      'விதைநேர்த்தி செய்யப்பட்ட சுத்தமான விதைகளை மட்டுமே பயன்படுத்தவும்',
      'நோய் தீவிரமாக இருக்கும் போது பாய்ச்சும் நீரைக் குறைக்கவும்',
      'நிலத்தில் களைகள் இன்றி தூய்மையாக வைக்கவும்'
    ],
    color: '#ca8a04',
    riskMonth: 'August - November',
    riskMonthTa: 'ஆவணி - கார்த்திகை'
  },
  {
    id: 'dis-4',
    crop: 'Maize',
    cropTa: 'மக்காச்சோளம்',
    diseaseName: 'Northern Corn Leaf Blight',
    diseaseNameTa: 'மக்காச்சோள இலைக்கருகல் நோய்',
    pathogenType: 'Fungal',
    pathogenTypeTa: 'பூஞ்சை',
    scientificName: 'Exserohilum turcicum',
    symptoms: [
      'Long cigar-shaped grayish-green to tan lesions (2.5 to 15 cm)',
      'Lesions parallel to leaf margin with dark sporulation zones',
      'Premature drying of canopy resembling frost burn'
    ],
    symptomsTa: [
      'சுருட்டு வடிவ நீண்ட சாம்பல் கலந்த பழுப்பு நிற கருகல் புள்ளிகள்',
      'இலை நரம்புகளுக்கு இணையாக பரவும் கருமை நிற படலங்கள்',
      'பயிர் முதிர்ச்சிக்கு முன்பே இலைகள் காய்ந்து கருகிப் போதல்'
    ],
    triggers: 'Moderate temperatures (18-27°C) accompanied by heavy dews and low sunshine hours.',
    triggersTa: 'மிதமான குளிர் (18-27°C), அதிகாலை பனி மற்றும் சூரிய ஒளி குறைவான வானிலை.',
    organicManagement: 'Trichoderma viride foliar spray @ 4g/Litre water; Soil application with enriched FYM.',
    organicManagementTa: 'டிரைக்கோடெர்மா விரிடி லிட்டருக்கு 4 கிராம் தெளிக்கவும்; மக்கிய தொழுவுரத்துடன் இடவும்.',
    chemicalManagement: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/Litre water.',
    chemicalManagementTa: 'அசோக்சிஸ்ட்ரோபின் + டைபினோகொனசோல் லிட்டருக்கு 1 மி.லி தெளிக்கவும்.',
    preventiveMeasures: [
      'Crop rotation with non-host legumes (Blackgram, Cowpea)',
      'Deep summer ploughing to bury crop residues',
      'Optimal plant population of 66,000 plants/hectare'
    ],
    preventiveMeasuresTa: [
      'பயறு வகைகளுடன் (உளுந்து, தட்டைப்பயறு) பயிர் சுழற்சி செய்யவும்',
      'கோடை உழவு செய்து பூஞ்சை எச்சங்களை அழிக்கவும்',
      'சரியான பயிர் எண்ணிக்கையை பராமரிக்கவும்'
    ],
    color: '#16a34a',
    riskMonth: 'September - December',
    riskMonthTa: 'புரட்டாசி - மார்கழி'
  }
];

export const ASSISTANT_FAQ = [
  {
    qEn: "My tomato leaves have yellow concentric rings. What is it?",
    qTa: "என் தக்காளி இலைகளில் மஞ்சள் வளைய புள்ளிகள் உள்ளன. அது என்ன?",
    aEn: "This is classic Early Blight (Alternaria solani). Apply Trichoderma viride @ 5g/Litre water today, reduce drip irrigation frequency, and remove infected bottom leaves to prevent canopy spread.",
    aTa: "இது தக்காளி ஆரம்பகால இலைக்கருகல் நோய் (Alternaria solani). இன்றே டிரைக்கோடெர்மா விரிடி லிட்டருக்கு 5 கிராம் நீரில் கலந்து தெளிக்கவும். சொட்டுநீர் பாசனத்தைக் குறைத்து, அடி இலைகளை அகற்றி எரிக்கவும்."
  },
  {
    qEn: "Is today safe for spraying pesticide on Plot 1?",
    qTa: "இன்று நிலம் 1-ல் பூச்சிக்கொல்லி தெளிக்க உகந்த வானிலையா?",
    aEn: "Optimal Spray Window! Current wind speed is 8 km/h (safe <15 km/h) and Delta-T is 4.2 (ideal range 2-8). Relative humidity is 68%. Apply between 07:00 AM and 09:30 AM before afternoon heat.",
    aTa: "இன்று தெளிப்பதற்கு மிகச் சிறந்த நேரம்! காற்றின் வேகம் 8 கி.மீ/மணி மட்டுமே உள்ளது (பாதுகாப்பானது). ஈரப்பதம் 68%. காலை 7:00 மணி முதல் 9:30 மணிக்குள் தெளித்து முடிக்கவும்."
  },
  {
    qEn: "How to prepare organic 5% Neem Seed Kernel Extract (NSKE)?",
    qTa: "5% வேப்பங்கொட்டை சாறு (NSKE) தயாரிப்பது எப்படி?",
    aEn: "Take 5 kg well-dried neem seed kernels. Crush into fine powder. Soak overnight in 10 Litres water. Filter through thin muslin cloth. Add 100g soap powder/khadi soap, dilute to 100 Litres water, and spray immediately.",
    aTa: "5 கிலோ நன்கு காய்ந்த வேப்பங்கொட்டை எடுத்து பொடிக்கவும். 10 லிட்டர் நீரில் இரவு முழுவதும் ஊறவைக்கவும். மெல்லிய துணியில் வடிகட்டி, 100 கிராம் சோப்புத் தூள் கலந்து, 100 லிட்டர் தண்ணீராக பெருக்கி உடனே தெளிக்கவும்."
  },
  {
    qEn: "What causes blast disease in paddy under Thanjavur conditions?",
    qTa: "தஞ்சாவூர் சூழலில் நெல்லில் குலைநோய் (பிளாஸ்ட்) வரக் காரணம் என்ன?",
    aEn: "Heavy basal urea without potash, high morning dew during October-December, and continuous standing water without drainage favor Magnaporthe spores. Maintain potash ratio and split urea.",
    aTa: "சாம்பல் சத்து (பொட்டாஷ்) இன்றி அதிக யூரியா இடுதல், பனிப்பொழிவு, மற்றும் வடிகால் இல்லாத நீர் தேக்கம் காரணமாக பிளாஸ்ட் பூஞ்சை உருவாகிறது. பொட்டாஷ் உரமிட்டு, யூரியாவை பிரித்து இடவும்."
  }
];
