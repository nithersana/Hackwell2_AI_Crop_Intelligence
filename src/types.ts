export type CropType = 
  | 'Tomato'
  | 'Corn (Maize)'
  | 'Potato'
  | 'Wheat'
  | 'Rice'
  | 'Apple'
  | 'Cotton'
  | 'Soybean'
  | 'Banana'
  | 'Groundnut'
  | 'Sugarcane'
  | 'Other';

export interface FarmerUser {
  id: string;
  fullName: string;
  mobile: string;
  mobileNumber?: string;
  passwordHash?: string;
  village: string;
  district: string;
  state: string;
  preferredLanguage: 'ta' | 'en' | 'hi';
  farmSize: number;
  farmSizeUnit: 'Acres' | 'Hectares';
  mainCrop: 'Rice' | 'Tomato' | 'Cotton' | 'Banana' | 'Groundnut' | 'Sugarcane' | 'Other';
  kissanId?: string;
  registeredAt?: string;
}

export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type CropHealthLevel = 'Healthy' | 'Mild' | 'Moderate' | 'Severe';
export type AdaptiveRiskTier = 'Low' | 'Medium' | 'High';
export type CropGrowthStage = 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruit Formation' | 'Maturity / Harvest';

export interface CropScanRecord {
  id: string;
  date: string; // e.g. "16 Sep 2026" or "2026-09-16"
  dayLabel: string; // e.g. "Day 1", "Day 4", "Day 7", "Day 10"
  dayNumber: number; // 1, 4, 7, 10...
  crop: CropType | string;
  cropTa?: string;
  plotName?: string;
  plotNameTa?: string;
  disease: string;
  diseaseTa?: string;
  confidence: number; // percentage 0 - 100
  severity: 'Healthy' | 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  severityTa?: string;
  healthScore: number; // 0 - 100
  riskScore: number; // 0 - 100
  healthStatus: 'Healthy' | 'Mild infection' | 'Moderate' | 'Severe' | 'Improving' | 'Recovered';
  healthStatusTa?: string;
  recommendation: string;
  recommendationTa?: string;
  previousActionTaken?: string;
  previousActionTakenTa?: string;
  actionStatus?: 'Done' | 'In Progress' | 'Pending';
  notes?: string;
  growthStage?: string;
  affectedSurfacePercent?: number;
  imageUrl?: string;
  thumbnailSvg?: string;
}

export interface LatestAiPrediction {
  targetDayLabel: string;
  projectedDate: string;
  projectedHealthScore: number;
  projectedRiskScore: number;
  healthTrendDirection: 'Improving' | 'Worsening' | 'Stable';
  confidenceScore: number;
  forecastSummary: string;
  forecastSummaryTa: string;
  actionRequired: string;
  actionRequiredTa: string;
  keyAssumptions: string[];
}

export interface AdaptiveRiskInput {
  crop: CropType;
  currentDiseaseProb: number; // 0 - 100%
  diseaseHistory: string;
  pestHistory: string;
  temperatureC: number;
  humidityPercent: number;
  rainProbability: number;
  weatherForecast: string;
  growthStage: CropGrowthStage;
  previousObservations: string;
  location: string;
}

export interface AdaptiveRiskPrediction {
  compositeRiskScore: number; // 0 - 100%
  riskTier: AdaptiveRiskTier;
  fungalDiseaseRisk: number; // e.g. 81%
  pestVectorRisk: number; // e.g. 54%
  bacterialRisk: number; // e.g. 38%
  primaryDiseaseTarget: string;
  primaryPestTarget: string;
  earlyWarning: string;
  earlyWarningTa: string;
  preventiveRecommendations: {
    title: string;
    titleTa: string;
    action: string;
    actionTa: string;
    category: 'Bio-Fungicide' | 'Aeration' | 'Irrigation' | 'Trap';
    timing: string;
  }[];
}

export interface BoundingBox {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  label: string;
  confidence: number;
  severity: SeverityLevel;
}

export interface DiseaseDetectionResult {
  detectionId: string;
  timestamp: string;
  crop: CropType;
  pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Physiological' | 'Healthy';
  diseaseName: string;
  scientificName: string;
  confidence: number;
  overallSeverity: SeverityLevel;
  affectedSurfacePercent: number;
  leafStage: 'Early Vegetative' | 'Flowering' | 'Fruiting' | 'Maturity';
  boundingBoxes: BoundingBox[];
  symptoms: string[];
  inferenceLatencyMs: number;
  modelEngine: string;
  imageUrl?: string;
  isCustomImage?: boolean;
  customStatement?: string;
}

export interface SensorTelemetry {
  deviceId: string;
  zoneId: string;
  zoneName: string;
  crop: CropType;
  timestamp: string;
  soilMoisturePercent: number; // e.g. 15% - 85%
  ambientTempC: number; // e.g. 12°C - 42°C
  canopyTempC: number; // e.g. 11°C - 40°C
  relativeHumidityPercent: number; // e.g. 20% - 98%
  vaporPressureDeficitKPa: number; // calculated VPD (kPa)
  solarRadiationLux: number;
  soilEc: number; // dS/m
  soilPh: number; // 5.0 - 8.5
  nitrogenPpm: number;
  phosphorusPpm: number;
  potassiumPpm: number;
  dewPointC: number;
  leafWetnessDurationHours: number;
}

export interface OutbreakPrediction {
  zoneId: string;
  crop: CropType;
  currentRiskScore: number; // 0 - 100
  outbreakProbability72h: number; // 0 - 100%
  primaryRiskFactor: string;
  microclimateCondition: 'Favorable for Spore Germination' | 'Moderate Risk' | 'Optimal Safe Range' | 'Heat/Drought Stress';
  forecastDays: {
    day: string;
    temperature: number;
    humidity: number;
    riskScore: number;
    vpd: number;
  }[];
  riskFactors: {
    factor: string;
    weight: number;
    status: 'Normal' | 'Elevated' | 'Alarm';
    detail: string;
  }[];
}

export interface RecommendationAction {
  id: string;
  category: 'Chemical' | 'Biological' | 'Irrigation' | 'Soil' | 'Cultural';
  actionTitle: string;
  description: string;
  timing: 'Immediate (Next 4-6h)' | 'Within 24 Hours' | 'Within 48-72 Hours' | 'Ongoing Routine';
  dosageOrSetting?: string;
  ecoToxicityScore: 'Low (Bio-friendly)' | 'Moderate' | 'High (Targeted Use Only)';
  withholdingPeriodDays?: number;
  costImpact: '$' | '$$' | '$$$';
}

export interface AdaptiveRecommendationReport {
  recommendationId: string;
  timestamp: string;
  crop: CropType;
  zoneId: string;
  compositeRiskScore: number; // 0 - 100
  alertLevel: SeverityLevel;
  summaryReasoning: string;
  visualFindingsSummary: string;
  environmentalFindingsSummary: string;
  actions: RecommendationAction[];
  irrigationGuidance: {
    currentAction: string;
    flowAdjustmentPercent: number; // e.g. -35% or +15%
    recommendedSchedule: string;
  };
  quarantineProtocol: {
    required: boolean;
    bufferRadiusMeters: number;
    foliarSanitization: string;
  };
  llmEnhanced?: boolean;
}

export interface FieldZone {
  id: string;
  name: string;
  crop: CropType;
  areaHectares: number;
  sensorNodeId: string;
  status: 'Normal' | 'Warning' | 'Critical';
  soilType: string;
  irrigationType: 'Drip Line' | 'Center Pivot' | 'Micro-Sprinkler';
}

export interface SampleLeafImage {
  id: string;
  crop: CropType;
  cropTa?: string;
  diseaseName: string;
  diseaseNameTa?: string;
  severity: SeverityLevel;
  confidence: number;
  thumbnailSvg: string;
  description: string;
  symptoms?: string;
  symptomsTa?: string;
  cause?: string;
  causeTa?: string;
  prevention?: string;
  preventionTa?: string;
  recommendedNextAction?: string;
  recommendedNextActionTa?: string;
  pathogen: string;
  idealWeatherTrigger: string;
  imageUrl?: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  groundingType?: 'none' | 'search' | 'maps';
  sources?: {
    web?: GroundingSource[];
    maps?: GroundingSource[];
  };
  isError?: boolean;
}
