import { CropScanRecord, LatestAiPrediction } from '../types';

export const LOCAL_STORAGE_CROP_SCANS_KEY = 'cropguard_continuous_crop_scans_v1';

export const DEFAULT_TOMATO_SCANS: CropScanRecord[] = [
  {
    id: 'scan-tomato-d1',
    date: '06 Sep 2026',
    dayLabel: 'Day 1',
    dayNumber: 1,
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    plotName: 'Plot 2 - South Borewell (Tomato PKM-1)',
    plotNameTa: 'நிலம் 2 - தெற்கு ஆழ்துளை (தக்காளி PKM-1)',
    disease: 'Healthy (No Visible Pathogen)',
    diseaseTa: 'ஆரோக்கியமான நிலை (நோய் அறிகுறிகள் இல்லை)',
    confidence: 98,
    severity: 'Healthy',
    severityTa: 'ஆரோக்கியம்',
    healthScore: 96,
    riskScore: 14,
    healthStatus: 'Healthy',
    healthStatusTa: 'ஆரோக்கியம்',
    recommendation: 'Baseline scan verified optimal chlorophyll and healthy vigor. Maintain routine 14-day preventive Trichoderma viride root drench and monitor soil moisture.',
    recommendationTa: 'ஆரம்ப நிலை ஸ்கேனிங்கில் நல்ல பச்சையம் மற்றும் ஆரோக்கியம் உறுதி செய்யப்பட்டது. 14 நாட்களுக்கு ஒருமுறை டிரைக்கோடெர்மா விரிடி உயிர் பூஞ்சாண தடுப்பு முறையை தொடரவும்.',
    previousActionTaken: 'Baseline bio-primed transplanting completed',
    previousActionTakenTa: 'உயிர் உரம் கலந்த நாற்று நடவு செய்யப்பட்டது',
    actionStatus: 'Done',
    notes: 'Transplanting stage completed cleanly. Average canopy height 28cm. Weather dry and warm (31°C).',
    growthStage: 'Vegetative (Early)',
    affectedSurfacePercent: 0,
    thumbnailSvg: '<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M50 85 C20 70 15 30 50 15 C85 30 80 70 50 85 Z" fill="#22c55e"/><path d="M50 15 L50 85" stroke="#15803d" stroke-width="2"/></svg>'
  },
  {
    id: 'scan-tomato-d4',
    date: '09 Sep 2026',
    dayLabel: 'Day 4',
    dayNumber: 4,
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    plotName: 'Plot 2 - South Borewell (Tomato PKM-1)',
    plotNameTa: 'நிலம் 2 - தெற்கு ஆழ்துளை (தக்காளி PKM-1)',
    disease: 'Early Blight (Alternaria solani)',
    diseaseTa: 'ஆரம்ப இலைக்கருகல் (Alternaria solani)',
    confidence: 94,
    severity: 'Mild',
    severityTa: 'லேசான தொற்று',
    healthScore: 78,
    riskScore: 42,
    healthStatus: 'Mild infection',
    healthStatusTa: 'லேசான தொற்று',
    recommendation: 'Targeted pruning: Snip off the 2 lowest spotted leaves showing concentric rings. Apply 5ml/L cold-pressed neem oil formulation to prevent upward spore splash.',
    recommendationTa: 'இலக்கு கவாத்து: வளைய புள்ளிகள் உள்ள அடிமட்ட 2 இலைகளை வெட்டி அகற்றவும். வித்துக்கள் மேலே பரவாமல் தடுக்க வேப்பெண்ணெய் 5ml/L தெளிக்கவும்.',
    previousActionTaken: 'Pruned lowest senescent leaves and sanitized hand shears with ethanol.',
    previousActionTakenTa: 'கீழ் இலைகள் அகற்றப்பட்டு கவாத்து கத்தரி ஆல்கஹாலால் கிருமி நீக்கம் செய்யப்பட்டது.',
    actionStatus: 'Done',
    notes: 'Morning condensation remained on lower canopy for >4 hours. Minor 2mm brown necrotic circular lesions with faint yellow chlorotic halos on lower leaves.',
    growthStage: 'Vegetative (Branching)',
    affectedSurfacePercent: 6,
    thumbnailSvg: '<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M50 85 C20 70 15 30 50 15 C85 30 80 70 50 85 Z" fill="#84cc16"/><circle cx="42" cy="55" r="5" fill="#78350f"/><circle cx="58" cy="65" r="4" fill="#78350f"/></svg>'
  },
  {
    id: 'scan-tomato-d7',
    date: '12 Sep 2026',
    dayLabel: 'Day 7',
    dayNumber: 7,
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    plotName: 'Plot 2 - South Borewell (Tomato PKM-1)',
    plotNameTa: 'நிலம் 2 - தெற்கு ஆழ்துளை (தக்காளி PKM-1)',
    disease: 'Early Blight (Alternaria solani)',
    diseaseTa: 'ஆரம்ப இலைக்கருகல் (Alternaria solani)',
    confidence: 97,
    severity: 'Moderate',
    severityTa: 'நடுத்தர தீவிரம்',
    healthScore: 60,
    riskScore: 68,
    healthStatus: 'Moderate',
    healthStatusTa: 'நடுத்தர பாதிப்பு',
    recommendation: 'High humidity (88%) triggered lesion expansion. Spray Bacillus subtilis bio-fungicide (5g/L) or Copper Oxychloride 50% WP (2.5g/L). Deepen drainage furrows immediately to eliminate soil puddling.',
    recommendationTa: 'அதிக ஈரப்பதம் (88%) காரணமாக புள்ளிகள் விரிவடைந்துள்ளன. பேசிலஸ் சப்டிலிஸ் (5g/L) அல்லது காப்பர் ஆக்ஸிகுளோரைடு (2.5g/L) தெளிக்கவும். வயல் வடிகால் வாய்க்காலை ஆழப்படுத்தவும்.',
    previousActionTaken: 'Deepened drainage furrow; applied bio-fungicide tank-mix at 6:45 AM before direct sunlight.',
    previousActionTakenTa: 'வடிகால் ஆழப்படுத்தப்பட்டு காலை 6:45 மணிக்கு உயிர் பூஞ்சாணக்கொல்லி தெளிக்கப்பட்டது.',
    actionStatus: 'Done',
    notes: 'Concentric bullseye rings coalesced on mid-tier foliage. Immediate agronomic mitigation applied within 6 hours.',
    growthStage: 'Early Flowering',
    affectedSurfacePercent: 18,
    thumbnailSvg: '<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M50 85 C20 70 15 30 50 15 C85 30 80 70 50 85 Z" fill="#eab308"/><circle cx="40" cy="50" r="8" fill="#78350f" stroke="#ca8a04" stroke-width="2"/><circle cx="60" cy="62" r="7" fill="#78350f" stroke="#ca8a04" stroke-width="2"/></svg>'
  },
  {
    id: 'scan-tomato-d10',
    date: '16 Sep 2026',
    dayLabel: 'Day 10',
    dayNumber: 10,
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    plotName: 'Plot 2 - South Borewell (Tomato PKM-1)',
    plotNameTa: 'நிலம் 2 - தெற்கு ஆழ்துளை (தக்காளி PKM-1)',
    disease: 'Early Blight (In Remission / Healing)',
    diseaseTa: 'இலைக்கருகல் கட்டுக்குள் வந்து குணமாகி வருகிறது',
    confidence: 96,
    severity: 'Mild',
    severityTa: 'குணமடையும் நிலை (லேசானது)',
    healthScore: 84,
    riskScore: 28,
    healthStatus: 'Improving',
    healthStatusTa: 'முன்னேற்றம் / குணமாகி வருகிறது',
    recommendation: 'Remission verified! Lesion margins dried out and calloused. All new terminal leaves and flower trusses completely clean. Continue weekly monitoring and maintain biological foliar shield.',
    recommendationTa: 'குணமடைவது உறுதி செய்யப்பட்டது! கருகல் விளிம்புகள் காய்ந்து உலர்ந்துவிட்டன. புதிய தளிர்கள் மற்றும் பூங்கொத்துகள் முற்றிலும் சுத்தமாக உள்ளன. வாராந்திர கண்காணிப்பை தொடரவும்.',
    previousActionTaken: 'Field scouting verified 0 new spots; soil moisture stabilized at optimal 60%.',
    previousActionTakenTa: 'வயல் ஆய்வில் புதிய புள்ளிகள் இல்லை என்பது உறுதியானது; மண் ஈரப்பதம் சீரானது.',
    actionStatus: 'In Progress',
    notes: 'Significant recovery: Health score jumped from 60 to 84 (+24 pts). Pathogen expansion arrested. Flower clusters setting fruit normally.',
    growthStage: 'Flowering & Early Fruit Set',
    affectedSurfacePercent: 5,
    thumbnailSvg: '<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M50 85 C20 70 15 30 50 15 C85 30 80 70 50 85 Z" fill="#22c55e"/><circle cx="40" cy="50" r="4" fill="#a16207"/><circle cx="60" cy="62" r="3" fill="#a16207"/><path d="M50 15 L50 85" stroke="#15803d" stroke-width="2"/></svg>'
  }
];

export const DEFAULT_PADDY_SCANS: CropScanRecord[] = [
  {
    id: 'scan-paddy-d1',
    date: '28 Aug 2026',
    dayLabel: 'Day 1',
    dayNumber: 1,
    crop: 'Rice',
    cropTa: 'நெல்',
    plotName: 'Plot 1 - North Canal (Paddy CR-1009 Sub-1)',
    plotNameTa: 'நிலம் 1 - வடக்கு வாய்க்கால் (நெல் CR-1009 சப்-1)',
    disease: 'Healthy (Uniform Tillering)',
    diseaseTa: 'ஆரோக்கியமான நிலை (சீரான தூர்வெடிப்பு)',
    confidence: 97,
    severity: 'Healthy',
    severityTa: 'ஆரோக்கியம்',
    healthScore: 94,
    riskScore: 16,
    healthStatus: 'Healthy',
    healthStatusTa: 'ஆரோக்கியம்',
    recommendation: 'Optimal vegetative density. Maintain 2cm water level and apply Pseudomonas fluorescens root wash.',
    recommendationTa: 'சிறந்த பயிர் வளர்ச்சி. 2 செ.மீ நீர்மட்டம் பராமரித்து சூடோமோனாஸ் தெளிக்கவும்.',
    actionStatus: 'Done',
    growthStage: 'Active Tillering'
  },
  {
    id: 'scan-paddy-d6',
    date: '03 Sep 2026',
    dayLabel: 'Day 6',
    dayNumber: 6,
    crop: 'Rice',
    cropTa: 'நெல்',
    plotName: 'Plot 1 - North Canal (Paddy CR-1009 Sub-1)',
    plotNameTa: 'நிலம் 1 - வடக்கு வாய்க்கால் (நெல் CR-1009 சப்-1)',
    disease: 'Rice Blast (Pyricularia oryzae)',
    diseaseTa: 'நெல் குலைநோய் (Pyricularia oryzae)',
    confidence: 93,
    severity: 'Mild',
    severityTa: 'லேசான தொற்று',
    healthScore: 80,
    riskScore: 46,
    healthStatus: 'Mild infection',
    healthStatusTa: 'லேசான தொற்று',
    recommendation: 'Spindle-shaped spots on 3 leaf blades. Avoid top-dressing urea; apply potassium silicate foliar nourishment.',
    recommendationTa: 'இலைகளில் கதிர்வடிவ புள்ளிகள். யூரியா உரமிடுவதை தவிர்த்து பொட்டாசியம் சிலிக்கேட் தெளிக்கவும்.',
    actionStatus: 'Done',
    growthStage: 'Tillering'
  },
  {
    id: 'scan-paddy-d11',
    date: '08 Sep 2026',
    dayLabel: 'Day 11',
    dayNumber: 11,
    crop: 'Rice',
    cropTa: 'நெல்',
    plotName: 'Plot 1 - North Canal (Paddy CR-1009 Sub-1)',
    plotNameTa: 'நிலம் 1 - வடக்கு வாய்க்கால் (நெல் CR-1009 சப்-1)',
    disease: 'Rice Blast (Pyricularia oryzae)',
    diseaseTa: 'நெல் குலைநோய் (Pyricularia oryzae)',
    confidence: 95,
    severity: 'Moderate',
    severityTa: 'நடுத்தர தீவிரம்',
    healthScore: 64,
    riskScore: 66,
    healthStatus: 'Moderate',
    healthStatusTa: 'நடுத்தர பாதிப்பு',
    recommendation: 'Drain standing water for 48 hours to expose soil roots. Spray Tricyclazole 75% WP (0.6g/L) or Kasugamycin bio-fungicide.',
    recommendationTa: 'வயல் நீரை 48 மணி நேரம் வடிக்கவும். ட்ரைசைக்ளசோல் 75% WP (0.6g/L) அல்லது கசுகாமைசின் தெளிக்கவும்.',
    actionStatus: 'Done',
    growthStage: 'Maximum Tillering'
  },
  {
    id: 'scan-paddy-d15',
    date: '14 Sep 2026',
    dayLabel: 'Day 15',
    dayNumber: 15,
    crop: 'Rice',
    cropTa: 'நெல்',
    plotName: 'Plot 1 - North Canal (Paddy CR-1009 Sub-1)',
    plotNameTa: 'நிலம் 1 - வடக்கு வாய்க்கால் (நெல் CR-1009 சப்-1)',
    disease: 'Rice Blast (Remission)',
    diseaseTa: 'குலைநோய் கட்டுக்குள் வந்தது',
    confidence: 96,
    severity: 'Mild',
    severityTa: 'குணமடையும் நிலை',
    healthScore: 86,
    riskScore: 26,
    healthStatus: 'Improving',
    healthStatusTa: 'முன்னேற்றம் / குணமாகி வருகிறது',
    recommendation: 'Blast lesion activity arrested. Flag leaves healthy and upright. Ready for panicle initiation stage.',
    recommendationTa: 'நோய் தாக்குதல் கட்டுக்குள் வந்தது. கொடி இலைகள் ஆரோக்கியமாக உள்ளன. கதிர் உருவாகும் பருவத்திற்கு தயாரானது.',
    actionStatus: 'In Progress',
    growthStage: 'Panicle Initiation'
  }
];

export const DEFAULT_COTTON_SCANS: CropScanRecord[] = [
  {
    id: 'scan-cotton-d1',
    date: '25 Aug 2026',
    dayLabel: 'Day 1',
    dayNumber: 1,
    crop: 'Cotton',
    cropTa: 'பருத்தி',
    plotName: 'Plot 3 - East Drip (Cotton Bt Hybrid)',
    plotNameTa: 'நிலம் 3 - கிழக்கு சொட்டுநீர் (பருத்தி Bt ஹைப்ரிட்)',
    disease: 'Healthy (Uniform Squaring)',
    diseaseTa: 'ஆரோக்கியமான நிலை',
    confidence: 96,
    severity: 'Healthy',
    severityTa: 'ஆரோக்கியம்',
    healthScore: 95,
    riskScore: 15,
    healthStatus: 'Healthy',
    healthStatusTa: 'ஆரோக்கியம்',
    recommendation: 'Vigorous square formation. Keep border sorghum barrier clean and inspect for whitefly adults.',
    recommendationTa: 'நல்ல பூ மொட்டுகள் வளர்ச்சி. எல்லை சோளப் பயிரை கவனித்து வெள்ளை ஈக்களை கண்காணிக்கவும்.',
    actionStatus: 'Done',
    growthStage: 'Squaring'
  },
  {
    id: 'scan-cotton-d5',
    date: '29 Aug 2026',
    dayLabel: 'Day 5',
    dayNumber: 5,
    crop: 'Cotton',
    cropTa: 'பருத்தி',
    plotName: 'Plot 3 - East Drip (Cotton Bt Hybrid)',
    plotNameTa: 'நிலம் 3 - கிழக்கு சொட்டுநீர் (பருத்தி Bt ஹைப்ரிட்)',
    disease: 'Whitefly & Leaf Curl Risk',
    diseaseTa: 'வெள்ளை ஈ & இலைச்சுருள் அறிகுறி',
    confidence: 92,
    severity: 'Mild',
    severityTa: 'லேசான தொற்று',
    healthScore: 78,
    riskScore: 48,
    healthStatus: 'Mild infection',
    healthStatusTa: 'லேசான தொற்று',
    recommendation: 'Whitefly adults counted at 4/leaf. Install 10 yellow sticky cards per acre and apply 10,000 ppm Neem Oil.',
    recommendationTa: 'இலைக்கு 4 வெள்ளை ஈக்கள். ஏக்கருக்கு 10 மஞ்சள் ஒட்டும் பொறிகள் கட்டி வேப்பெண்ணெய் தெளிக்கவும்.',
    actionStatus: 'Done',
    growthStage: 'Squaring / Flowering'
  },
  {
    id: 'scan-cotton-d9',
    date: '03 Sep 2026',
    dayLabel: 'Day 9',
    dayNumber: 9,
    crop: 'Cotton',
    cropTa: 'பருத்தி',
    plotName: 'Plot 3 - East Drip (Cotton Bt Hybrid)',
    plotNameTa: 'நிலம் 3 - கிழக்கு சொட்டுநீர் (பருத்தி Bt ஹைப்ரிட்)',
    disease: 'Cotton Leaf Curl Virus (Vector Spread)',
    diseaseTa: 'பருத்தி இலைச்சுருள் வைரஸ் தாக்கம்',
    confidence: 94,
    severity: 'Moderate',
    severityTa: 'நடுத்தர தீவிரம்',
    healthScore: 58,
    riskScore: 70,
    healthStatus: 'Moderate',
    healthStatusTa: 'நடுத்தர பாதிப்பு',
    recommendation: 'Upward leaf curling and vein thickening observed. Rouge out heavily stunted plants; spray Pyriproxyfen 10% EC or bio-insecticide to suppress vector.',
    recommendationTa: 'இலைகள் மேல்நோக்கி சுருண்டு நரம்புகள் தடித்துள்ளன. பூச்சி பரவலை தடுக்க பயிரிப்ராக்ஸிஃபென் தெளிக்கவும்.',
    actionStatus: 'Done',
    growthStage: 'Peak Flowering'
  },
  {
    id: 'scan-cotton-d14',
    date: '08 Sep 2026',
    dayLabel: 'Day 14',
    dayNumber: 14,
    crop: 'Cotton',
    cropTa: 'பருத்தி',
    plotName: 'Plot 3 - East Drip (Cotton Bt Hybrid)',
    plotNameTa: 'நிலம் 3 - கிழக்கு சொட்டுநீர் (பருத்தி Bt ஹைப்ரிட்)',
    disease: 'Vector Contained (Regrowth)',
    diseaseTa: 'பூச்சி கட்டுப்படுத்தப்பட்டு தளிர் வளர்ச்சி',
    confidence: 95,
    severity: 'Mild',
    severityTa: 'குணமடையும் நிலை',
    healthScore: 82,
    riskScore: 30,
    healthStatus: 'Improving',
    healthStatusTa: 'முன்னேற்றம் / குணமாகி வருகிறது',
    recommendation: 'Whitefly count dropped below economic threshold (<1/leaf). New boll formation proceeding vigorously. Maintain yellow cards.',
    recommendationTa: 'வெள்ளை ஈக்கள் எண்ணிக்கை கட்டுக்குள் வந்தது. புதிய காய்கள் நன்றாக உருவாகின்றன.',
    actionStatus: 'In Progress',
    growthStage: 'Boll Development'
  }
];

export function getStoredCropScans(): CropScanRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CROP_SCANS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse stored crop scans from localStorage:', err);
  }
  return DEFAULT_TOMATO_SCANS;
}

export function saveStoredCropScans(scans: CropScanRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_CROP_SCANS_KEY, JSON.stringify(scans));
  } catch (err) {
    console.error('Failed to save crop scans to localStorage:', err);
  }
}

export function computeContinuousTrajectory(scans: CropScanRecord[]) {
  if (!scans || scans.length === 0) {
    return {
      status: 'Stable' as const,
      deltaScore: 0,
      deltaRisk: 0,
      latestScan: null,
      previousScan: null,
      averageHealth: 0,
      peakHealth: 0,
      lowestHealth: 0,
      latestPrediction: null
    };
  }

  const sorted = [...scans].sort((a, b) => a.dayNumber - b.dayNumber);
  const latestScan = sorted[sorted.length - 1];
  const previousScan = sorted.length > 1 ? sorted[sorted.length - 2] : null;

  const deltaScore = previousScan ? latestScan.healthScore - previousScan.healthScore : 0;
  const deltaRisk = previousScan ? latestScan.riskScore - previousScan.riskScore : 0;

  let status: 'Improving' | 'Worsening' | 'Stable' = 'Stable';
  if (deltaScore >= 5 || (latestScan.healthStatus === 'Improving' && deltaScore >= 0)) {
    status = 'Improving';
  } else if (deltaScore <= -5) {
    status = 'Worsening';
  }

  const scores = sorted.map((s) => s.healthScore);
  const averageHealth = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const peakHealth = Math.max(...scores);
  const lowestHealth = Math.min(...scores);

  // Compute forward-looking Latest AI Prediction (Day N + 4)
  const nextDayNumber = latestScan.dayNumber + 4;
  const targetDayLabel = `Day ${nextDayNumber}`;
  
  let projectedHealthScore = latestScan.healthScore;
  let projectedRiskScore = latestScan.riskScore;

  if (status === 'Improving') {
    projectedHealthScore = Math.min(96, latestScan.healthScore + 8);
    projectedRiskScore = Math.max(10, latestScan.riskScore - 12);
  } else if (status === 'Worsening') {
    projectedHealthScore = Math.max(35, latestScan.healthScore - 14);
    projectedRiskScore = Math.min(92, latestScan.riskScore + 18);
  } else {
    projectedHealthScore = Math.min(94, latestScan.healthScore + 3);
    projectedRiskScore = Math.max(15, latestScan.riskScore - 5);
  }

  const latestPrediction: LatestAiPrediction = {
    targetDayLabel,
    projectedDate: '20 Sep 2026',
    projectedHealthScore,
    projectedRiskScore,
    healthTrendDirection: status,
    confidenceScore: 94,
    forecastSummary: status === 'Improving'
      ? `If current fungicide barrier and morning leaf aeration are maintained, crop health is forecast to reach ${projectedHealthScore}% by ${targetDayLabel} with disease relapse probability <15%.`
      : `Risk remains elevated. Immediate intervention required before spore expansion reduces health to ${projectedHealthScore}%.`,
    forecastSummaryTa: status === 'Improving'
      ? `தற்போதைய உயிர் பூஞ்சாண தடுப்பும் காலை நேர ஈரப்பதம் குறைப்பும் தொடர்ந்தால், ${targetDayLabel}-ல் பயிர் ஆரோக்கியம் ${projectedHealthScore}% எட்டும்; மீண்டும் நோய் தாக்கும் அபாயம் 15%-க்கும் குறைவு.`
      : `நோய் அபாயம் அதிகமாக உள்ளது. கூடுதல் தடுப்பு நடவடிக்கை எடுக்காவிட்டால் பயிர் ஆரோக்கியம் ${projectedHealthScore}% ஆக குறைய வாய்ப்புள்ளது.`,
    actionRequired: status === 'Improving'
      ? 'Maintain bi-weekly biological spray & prevent soil waterlogging.'
      : 'Spray recommended curative bactericide/fungicide within 24 hours.',
    actionRequiredTa: status === 'Improving'
      ? 'இரண்டு வாரங்களுக்கு ஒருமுறை உயிர் பூஞ்சாண தெளிப்பு மற்றும் வடிகால் பராமரிப்பு தொடரவும்.'
      : '24 மணி நேரத்திற்குள் பரிந்துரைக்கப்பட்ட நிவாரண மருந்தை தெளிக்கவும்.',
    keyAssumptions: [
      'Microclimate humidity remains below 80%',
      'No secondary pest vector infestation (e.g. whitefly/aphid)',
      'Agronomic pruning of lower infected canopy completed'
    ]
  };

  return {
    status,
    deltaScore,
    deltaRisk,
    latestScan,
    previousScan,
    averageHealth,
    peakHealth,
    lowestHealth,
    latestPrediction
  };
}
