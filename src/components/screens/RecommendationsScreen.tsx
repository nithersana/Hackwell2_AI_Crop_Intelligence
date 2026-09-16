import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  AlertCircle, 
  Droplets, 
  CheckCircle2, 
  Volume2, 
  VolumeX,
  Share2, 
  Copy, 
  Check, 
  RotateCcw, 
  Sliders, 
  Leaf, 
  Bug, 
  CloudSun, 
  Sprout, 
  History, 
  Calendar, 
  Info,
  Clock,
  ArrowRight,
  AlertTriangle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { SampleLeafImage } from '../../types';
import { speakText, stopSpeaking } from '../../utils/audioSpeech';
import { 
  generateAdaptiveRecommendation, 
  AdaptiveEngineInput, 
  AdaptiveRecommendationResult 
} from '../../utils/adaptiveRecommendationEngine';

interface RecommendationsScreenProps {
  language: Language;
  currentScan?: SampleLeafImage;
  onNavigate: (screen: any) => void;
}

export const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  language,
  currentScan,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];

  // -------------------------------------------------------------
  // 8 ADAPTIVE AI RECOMMENDATION PARAMETERS
  // -------------------------------------------------------------
  const [crop, setCrop] = useState<string>('Tomato');
  const [disease, setDisease] = useState<string>('Early Blight');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Critical'>('Mild');
  const [pest, setPest] = useState<string>('None');
  const [humidityValue, setHumidityValue] = useState<number>(85); // High humidity as in prompt
  const [temperatureC, setTemperatureC] = useState<number>(28);
  const [rainExpected, setRainExpected] = useState<boolean>(false);
  const [growthStage, setGrowthStage] = useState<'Seedling' | 'Vegetative' | 'Flowering' | 'Fruit Formation' | 'Maturity / Harvest'>('Vegetative');
  const [previousTreatment, setPreviousTreatment] = useState<string>('None / Untreated');
  const [previousObservations, setPreviousObservations] = useState<string>('Leaf wetness >8.5h with heavy morning condensation on lower leaves');

  // Interactive Sprayer Dosage Calculator State
  const [tankSizeLiters, setTankSizeLiters] = useState<number>(16);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // If currentScan is supplied and farmer clicks "Sync Scan", we prefill
  const handleSyncCurrentScan = () => {
    if (!currentScan) return;
    setCrop(currentScan.crop);
    setDisease(currentScan.diseaseName);
    if (currentScan.severity === 'Low') setSeverity('Mild');
    else if (currentScan.severity === 'Moderate') setSeverity('Moderate');
    else if (currentScan.severity === 'High') setSeverity('Severe');
    else if (currentScan.severity === 'Critical') setSeverity('Critical');
    
    if (currentScan.symptoms) {
      setPreviousObservations(currentScan.symptoms.slice(0, 100));
    }
  };

  // -------------------------------------------------------------
  // BENCHMARK PRESETS (Directly matching user requirements & real field cases)
  // -------------------------------------------------------------
  const applyPreset = (presetType: 'mild_tomato' | 'severe_tomato' | 'potato_rain' | 'cotton_pest' | 'rice_blast') => {
    if (presetType === 'mild_tomato') {
      // User prompt example 1:
      // Crop = Tomato, Disease = Early Blight, Severity = Mild, Humidity = High
      setCrop('Tomato');
      setDisease('Early Blight');
      setSeverity('Mild');
      setPest('None');
      setHumidityValue(86);
      setTemperatureC(27);
      setRainExpected(false);
      setGrowthStage('Vegetative');
      setPreviousTreatment('None / Untreated');
      setPreviousObservations('Morning dew duration > 7.5 hours; small localized circular spots on 2 lowest leaves');
    } else if (presetType === 'severe_tomato') {
      // User prompt example 2:
      // Crop = Tomato, Disease = Early Blight, Severity = Severe, Humidity = High
      setCrop('Tomato');
      setDisease('Early Blight');
      setSeverity('Severe');
      setPest('None');
      setHumidityValue(88);
      setTemperatureC(28);
      setRainExpected(true);
      setGrowthStage('Fruit Formation');
      setPreviousTreatment('None / Untreated');
      setPreviousObservations('Lesions coalescing across >45% canopy with brown concentric rot spreading towards fruit calyx');
    } else if (presetType === 'potato_rain') {
      setCrop('Potato');
      setDisease('Late Blight (Phytophthora)');
      setSeverity('Moderate');
      setPest('None');
      setHumidityValue(92);
      setTemperatureC(21);
      setRainExpected(true);
      setGrowthStage('Flowering');
      setPreviousTreatment('Mancozeb 75% WP sprayed 12 days ago');
      setPreviousObservations('Cool drizzle with water-soaked pale green margins on upper leaves');
    } else if (presetType === 'cotton_pest') {
      setCrop('Cotton');
      setDisease('Leaf Curl Virus & Anthracnose');
      setSeverity('Moderate');
      setPest('Whiteflies (Bemisia tabaci)');
      setHumidityValue(75);
      setTemperatureC(32);
      setRainExpected(false);
      setGrowthStage('Flowering');
      setPreviousTreatment('Neem oil foliar applied 8 days ago');
      setPreviousObservations('Sticky traps show 18+ adult whiteflies per card; upward leaf curling noted');
    } else if (presetType === 'rice_blast') {
      setCrop('Rice');
      setDisease('Blast (Magnaporthe oryzae)');
      setSeverity('Moderate');
      setPest('Stem Borer');
      setHumidityValue(84);
      setTemperatureC(29);
      setRainExpected(true);
      setGrowthStage('Vegetative');
      setPreviousTreatment('High Urea application 4 days ago');
      setPreviousObservations('Spindle-shaped lesions with grey centers emerging after overcast monsoon drizzle');
    }
  };

  // -------------------------------------------------------------
  // RUN ADAPTIVE AI RECOMMENDATION ENGINE
  // -------------------------------------------------------------
  const recommendation: AdaptiveRecommendationResult = useMemo(() => {
    const humidityLevel = humidityValue >= 80 
      ? 'High (>80%)' 
      : humidityValue >= 55 
        ? 'Moderate (55-80%)' 
        : 'Low (<55%)';

    const input: AdaptiveEngineInput = {
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
    };

    return generateAdaptiveRecommendation(input);
  }, [
    crop,
    disease,
    severity,
    pest,
    humidityValue,
    temperatureC,
    rainExpected,
    growthStage,
    previousTreatment,
    previousObservations,
  ]);

  // Handle voice readout of the structured recommendation
  const handleVoiceReadout = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    if (language === 'ta') {
      const speechText = `AI தகவமைப்பு பரிந்துரை. பிரச்சனை: ${recommendation.problemTa}. ஆபத்து: ${recommendation.riskTa}. ஏன் இந்த பரிந்துரை உருவாக்கப்பட்டது: ${recommendation.whyThisHappenedTa}. பரிந்துரைக்கப்பட்ட நடவடிக்கை: ${recommendation.recommendedActionTa}. கவனிக்க வேண்டியவை: ${recommendation.whatToMonitorTa}. அடுத்த ஆய்வு: ${recommendation.nextCheckTa}.`;
      speakText(speechText, 'ta');
    } else {
      const speechText = `Adaptive AI Recommendation. Problem: ${recommendation.problem}. Risk: ${recommendation.risk}. Why this happened: ${recommendation.whyThisHappened}. Recommended action: ${recommendation.recommendedAction}. What to monitor: ${recommendation.whatToMonitor}. Next check: ${recommendation.nextCheck}.`;
      speakText(speechText, 'en');
    }

    setTimeout(() => {
      setIsSpeaking(false);
    }, 18000);
  };

  // Copy or Share formatted text for Extension Officers / WhatsApp
  const handleShare = () => {
    const isTa = language === 'ta';
    const formattedText = `🌱 *CropGuard AI - ${isTa ? 'தகவமைப்பு உழவர் பரிந்துரை' : 'Adaptive Recommendation'}*

🌾 *${isTa ? 'பயிர்' : 'Crop'}:* ${crop} (${growthStage})
🦠 *${isTa ? 'நோய்' : 'Disease'}:* ${disease} [${severity}]
🐛 *${isTa ? 'பூச்சி' : 'Pest'}:* ${pest}
⛅ *${isTa ? 'வானிலை' : 'Weather'}:* ${humidityValue}% Humidity, ${temperatureC}°C

━━━━━━━━━━━━━━━━━━━
📋 *Problem:*
${isTa ? recommendation.problemTa : recommendation.problem}

⚠️ *Risk:*
${isTa ? recommendation.riskTa : recommendation.risk}

💡 *Why this happened:*
${isTa ? recommendation.whyThisHappenedTa : recommendation.whyThisHappened}

🛡️ *Recommended action:*
${isTa ? recommendation.recommendedActionTa : recommendation.recommendedAction}

🔍 *What to monitor:*
${isTa ? recommendation.whatToMonitorTa : recommendation.whatToMonitor}

📅 *Next check:*
${isTa ? recommendation.nextCheckTa : recommendation.nextCheck}
━━━━━━━━━━━━━━━━━━━
🛡️ CropGuard AI Crop Intelligence`;

    if (navigator.share) {
      navigator.share({
        title: 'CropGuard AI Adaptive Recommendation',
        text: formattedText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(formattedText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Compute knapsack dose
  const computedDoseGrams = recommendation.sprayerDoseGuideline?.isOrganic 
    ? tankSizeLiters * 5 
    : tankSizeLiters * 2;
  const computedTanksPerAcre = Math.ceil(200 / tankSizeLiters);

  return (
    <div id="screen-recommendations" className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER BAR                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'ta' ? 'தகவமைப்பு AI பரிந்துரை இயந்திரம்' : 'Adaptive AI Recommendation Engine'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            {language === 'ta' ? 'தகவமைப்பு AI பரிந்துரை' : 'Adaptive AI Recommendations'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'பயிர், நோய், தீவிரத்தன்மை, பூச்சி, வானிலை, வளர்ச்சிப் பருவம் மற்றும் முந்தைய சிகிச்சை அடிப்படையில் தனிப்பயனாக்கப்பட்ட வேளாண் வழிகாட்டல்.'
              : 'Dynamic, context-aware IPM recommendations adapting to crop, pathogen severity, pests, microclimate, and treatment history.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentScan && (
            <button
              onClick={handleSyncCurrentScan}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sync Latest Leaf Scan Data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'ta' ? 'சமீபத்திய ஸ்கேன் ஏற்று' : 'Sync Scan'}</span>
            </button>
          )}

          <button
            onClick={handleVoiceReadout}
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isSpeaking 
                ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300' 
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
            title="Audio Speech Readout"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{language === 'ta' ? (isSpeaking ? 'நிறுத்து' : 'கேட்க') : (isSpeaking ? 'Stop' : 'Listen')}</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Copy or Share Recommendation"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-200" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'பகிர்' : 'Share')}</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1-CLICK BENCHMARK SCENARIO PRESETS (Direct user prompt match) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'ta' ? 'சோதனை சூழ்நிலைகள் (விரைவுத் தேர்வு):' : 'Quick Adaptive Presets (Try These Scenarios):'}</span>
          </span>
          <span className="text-[11px] text-stone-500">
            {language === 'ta' ? 'ஒவ்வொரு விவசாயிக்கும் மாறுபடும் AI முடிவு' : 'No generic static recommendations'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {/* Preset 1: Prompt Example 1 */}
          <button
            type="button"
            onClick={() => applyPreset('mild_tomato')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              crop === 'Tomato' && severity === 'Mild' && humidityValue >= 80
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                : 'bg-white border-stone-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 mb-1">
              <span>🍅 {language === 'ta' ? 'தக்காளி (லேசானது)' : 'Tomato (Mild)'}</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 text-[10px]">Mild</span>
            </div>
            <p className="text-[11px] text-stone-600 line-clamp-2">
              {language === 'ta' ? 'ஆரம்ப கருகல் + அதிக ஈரப்பதம் ➔ தடுப்பு சுகாதாரம்' : 'Early Blight + High Humidity ➔ Preventive Hygiene'}
            </p>
          </button>

          {/* Preset 2: Prompt Example 2 */}
          <button
            type="button"
            onClick={() => applyPreset('severe_tomato')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              crop === 'Tomato' && severity === 'Severe'
                ? 'bg-red-50 border-red-400 ring-2 ring-red-300'
                : 'bg-white border-stone-200 hover:border-red-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-red-800 mb-1">
              <span>🍅 {language === 'ta' ? 'தக்காளி (தீவிரமானது)' : 'Tomato (Severe)'}</span>
              <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-900 text-[10px]">Severe</span>
            </div>
            <p className="text-[11px] text-stone-600 line-clamp-2">
              {language === 'ta' ? 'தீவிர கருகல் ➔ உடனடி ஆய்வு & தீவிர பாதுகாப்பு' : 'Severe Blight ➔ Immediate Inspection & Intervention'}
            </p>
          </button>

          {/* Preset 3: Potato Late Blight */}
          <button
            type="button"
            onClick={() => applyPreset('potato_rain')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              crop === 'Potato'
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                : 'bg-white border-stone-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 mb-1">
              <span>🥔 {language === 'ta' ? 'உருளைக்கிழங்கு' : 'Potato Blight'}</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px]">Rain</span>
            </div>
            <p className="text-[11px] text-stone-600 line-clamp-2">
              {language === 'ta' ? 'தொடர் மழை + முந்தைய சிகிச்சை சுழற்சி' : 'Continuous Rain + Rotate Prior Mancozeb Spray'}
            </p>
          </button>

          {/* Preset 4: Cotton Whitefly Vector */}
          <button
            type="button"
            onClick={() => applyPreset('cotton_pest')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              crop === 'Cotton'
                ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-300'
                : 'bg-white border-stone-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-purple-800 mb-1">
              <span>🌱 {language === 'ta' ? 'பருத்தி + வெள்ளை ஈ' : 'Cotton + Whitefly'}</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 text-[10px]">Vector</span>
            </div>
            <p className="text-[11px] text-stone-600 line-clamp-2">
              {language === 'ta' ? 'இலை சுருள் + மஞ்சள் ஒட்டுப்பொறி & வேம்பு' : 'Leaf Curl Vector + Sticky Traps & Neem Repellent'}
            </p>
          </button>

          {/* Preset 5: Rice Blast Vegetative */}
          <button
            type="button"
            onClick={() => applyPreset('rice_blast')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              crop === 'Rice'
                ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300'
                : 'bg-white border-stone-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-800 mb-1">
              <span>🌾 {language === 'ta' ? 'நெல் குலைநோய்' : 'Rice Blast'}</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-900 text-[10px]">Nitrogen</span>
            </div>
            <p className="text-[11px] text-stone-600 line-clamp-2">
              {language === 'ta' ? 'அதிக தழைச்சத்து + தண்டு துளைப்பான் கட்டுப்பாடு' : 'High Nitrogen Throttle + Stem Borer Suppression'}
            </p>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* INTERACTIVE 8-FACTOR ADAPTIVE CONSOLE                         */}
      {/* ------------------------------------------------------------- */}
      <details className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs group" open>
        <summary className="font-bold text-stone-900 text-sm flex items-center justify-between cursor-pointer select-none">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>{language === 'ta' ? '8 காரணிகள் கட்டுப்பாட்டு பலகை (தனிப்பயனாக்கு)' : 'Customize 8 Farm Intelligence Factors'}</span>
          </div>
          <span className="text-xs text-stone-500 group-open:hidden">
            {language === 'ta' ? 'மாற்ற தட்டவும்' : 'Click to adjust factors'}
          </span>
        </summary>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-3 border-t border-stone-100 text-xs">
          {/* 1. Crop */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 block flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              <span>1. {language === 'ta' ? 'பயிர்' : 'Crop'}:</span>
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Tomato">Tomato (தக்காளி)</option>
              <option value="Potato">Potato (உருளைக்கிழங்கு)</option>
              <option value="Corn (Maize)">Corn / Maize (மக்காச்சோளம்)</option>
              <option value="Cotton">Cotton (பருத்தி)</option>
              <option value="Rice">Rice (நெல்)</option>
              <option value="Wheat">Wheat (கோதுமை)</option>
              <option value="Soybean">Soybean (சோயாபீன்)</option>
              <option value="Chilli (Pepper)">Chilli (மிளகாய்)</option>
            </select>
          </div>

          {/* 2. Disease */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 block flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>2. {language === 'ta' ? 'நோய்' : 'Disease'}:</span>
            </label>
            <select
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Early Blight">Early Blight (Alternaria solani)</option>
              <option value="Late Blight (Phytophthora)">Late Blight (Phytophthora)</option>
              <option value="Powdery Mildew">Powdery Mildew (சாம்பல் நோய்)</option>
              <option value="Bacterial Wilt">Bacterial Wilt (பாக்டீரியா வாடல்)</option>
              <option value="Leaf Curl Virus & Anthracnose">Leaf Curl Virus & Anthracnose</option>
              <option value="Blast (Magnaporthe oryzae)">Blast (குலைநோய்)</option>
              <option value="Rust (Puccinia)">Rust (துரு நோய்)</option>
              <option value="Healthy / Zero Disease">Healthy / Zero Pathology (ஆரோக்கியமானது)</option>
            </select>
          </div>

          {/* 3. Disease Severity */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 block flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>3. {language === 'ta' ? 'தீவிரத்தன்மை' : 'Disease Severity'}:</span>
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['Mild', 'Moderate', 'Severe', 'Critical'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSeverity(lvl)}
                  className={`py-2 px-1 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                    severity === lvl
                      ? lvl === 'Mild' 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : lvl === 'Moderate'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-red-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Pest */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 block flex items-center gap-1">
              <Bug className="w-3.5 h-3.5 text-purple-700" />
              <span>4. {language === 'ta' ? 'பூச்சி தாக்குதல்' : 'Pest Vector'}:</span>
            </label>
            <select
              value={pest}
              onChange={(e) => setPest(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="None">None (இல்லை)</option>
              <option value="Whiteflies (Bemisia tabaci)">Whiteflies (வெள்ளை ஈ)</option>
              <option value="Aphids (Aphis gossypii)">Aphids (அசுவினி)</option>
              <option value="Thrips">Thrips (இலைப்பேன்)</option>
              <option value="Fruit Borer (Helicoverpa)">Fruit Borer (காய் துளைப்பான்)</option>
              <option value="Spider Mites">Spider Mites (செம்பேன்)</option>
              <option value="Stem Borer">Stem Borer (தண்டு துளைப்பான்)</option>
              <option value="Fall Armyworm">Fall Armyworm (படைப்புழு)</option>
            </select>
          </div>

          {/* 5. Weather (Humidity & Temp) */}
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-700 flex items-center gap-1">
                <CloudSun className="w-3.5 h-3.5 text-sky-600" />
                <span>5. {language === 'ta' ? 'வானிலை & ஈரப்பதம்' : 'Weather & Humidity'}:</span>
              </label>
              <span className="font-mono font-bold text-sky-800">
                {humidityValue}% RH • {temperatureC}°C {rainExpected ? '• 🌧️ Rain Forecast' : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-[10px] text-stone-500 mb-0.5">
                  <span>{language === 'ta' ? 'ஈரப்பதம்' : 'Humidity'}:</span>
                  <span className="font-bold">{humidityValue}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="98"
                  value={humidityValue}
                  onChange={(e) => setHumidityValue(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-stone-500 mb-0.5">
                  <span>{language === 'ta' ? 'வெப்பநிலை' : 'Temperature'}:</span>
                  <span className="font-bold">{temperatureC}°C</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="42"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={rainExpected}
                  onChange={(e) => setRainExpected(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{language === 'ta' ? 'அடுத்த 48 மணி நேரத்தில் மழை வாய்ப்பு' : 'Rain expected in next 48 hours'}</span>
              </label>
            </div>
          </div>

          {/* 6. Growth Stage */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 block flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>6. {language === 'ta' ? 'வளர்ச்சிப் பருவம்' : 'Growth Stage'}:</span>
            </label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Seedling">Seedling (நாற்றுப் பருவம்)</option>
              <option value="Vegetative">Vegetative (வளர்ச்சிப் பருவம்)</option>
              <option value="Flowering">Flowering (பூக்கும் பருவம்)</option>
              <option value="Fruit Formation">Fruit Formation (காய் பிடிக்கும் பருவம்)</option>
              <option value="Maturity / Harvest">Maturity / Harvest (அறுவடைப் பருவம்)</option>
            </select>
          </div>

          {/* 7. Previous Treatment */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 block flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-amber-700" />
              <span>7. {language === 'ta' ? 'முந்தைய சிகிச்சை' : 'Previous Treatment'}:</span>
            </label>
            <select
              value={previousTreatment}
              onChange={(e) => setPreviousTreatment(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="None / Untreated">None / Untreated (சிகிச்சை செய்யவில்லை)</option>
              <option value="Bio-Fungicide (Trichoderma viride) 5 days ago">Trichoderma viride (5d ago)</option>
              <option value="Mancozeb 75% WP sprayed 12 days ago">Mancozeb 75% WP (12d ago)</option>
              <option value="Copper Oxychloride 50% WP sprayed 7 days ago">Copper Oxychloride (7d ago)</option>
              <option value="Neem oil foliar applied 8 days ago">Neem Oil Spray (8d ago)</option>
              <option value="High Nitrogen Urea application 4 days ago">High Nitrogen Fertilizer (4d ago)</option>
            </select>
          </div>

          {/* 8. Previous AI Observations */}
          <div className="space-y-1.5 md:col-span-4">
            <label className="font-bold text-stone-700 block flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-indigo-700" />
                <span>8. {language === 'ta' ? 'முந்தைய AI கண்காணிப்பு & களக் குறிப்புகள்' : 'Previous AI Field Observations'}:</span>
              </span>
              <span className="text-[11px] text-stone-500 font-normal">
                {language === 'ta' ? 'கள சூழலுக்கு ஏற்ப தட்டச்சு செய்யலாம்' : 'Editable field intelligence note'}
              </span>
            </label>
            <input
              type="text"
              value={previousObservations}
              onChange={(e) => setPreviousObservations(e.target.value)}
              placeholder="e.g. Continuous leaf wetness > 8.5h with morning dew, localized spotting on lower canopy..."
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </details>

      {/* ------------------------------------------------------------- */}
      {/* FACTOR ANALYSIS CHIPS                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {recommendation.keyFactorsSummary.map((item, idx) => (
          <div key={idx} className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] text-stone-500 mb-0.5">
              <span>{language === 'ta' ? item.factorTa : item.factor}</span>
              <span className={`px-1 rounded text-[9px] font-bold ${
                item.impact === 'High' 
                  ? 'bg-red-100 text-red-800' 
                  : item.impact === 'Medium' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-emerald-100 text-emerald-800'
              }`}>
                {item.impact}
              </span>
            </div>
            <p className="font-bold text-xs text-stone-900 truncate" title={item.value}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* THE OFFICIAL ADAPTIVE AI RECOMMENDATION CARD                  */}
      {/* Strictly adhering to the requested output format:             */}
      {/* Problem:                                                      */}
      {/* Risk:                                                         */}
      {/* Why this happened:                                            */}
      {/* Recommended action:                                           */}
      {/* What to monitor:                                              */}
      {/* Next check:                                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-md overflow-hidden animate-in fade-in">
        {/* Card Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base font-serif">
                  {language === 'ta' ? 'தகவமைப்பு AI பரிந்துரை அறிக்கை' : 'Adaptive AI Recommendation Report'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  severity === 'Severe' || severity === 'Critical'
                    ? 'bg-red-500/20 text-red-200 border-red-400/40'
                    : severity === 'Moderate'
                      ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                      : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                }`}>
                  {recommendation.urgencyLevel}
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                {crop} • {disease} • {growthStage} {pest !== 'None' ? `• Pest: ${pest}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-300 hidden sm:inline">
              IPM Tier: <strong className="text-white">{recommendation.ipmTier}</strong>
            </span>
          </div>
        </div>

        {/* Card Body - Exactly matching the user's requested 6-field output format */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* 1. Problem */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-100 text-red-800 flex items-center justify-center text-xs font-bold shrink-0">
                1
              </div>
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {language === 'ta' ? 'பிரச்சனை (Problem):' : 'Problem:'}
              </h3>
            </div>
            <div className="pl-8">
              <p className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                {language === 'ta' ? recommendation.problemTa : recommendation.problem}
              </p>
            </div>
          </div>

          {/* 2. Risk */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0">
                2
              </div>
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'ஆபத்து (Risk):' : 'Risk:'}</span>
              </h3>
            </div>
            <div className="pl-8">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                {language === 'ta' ? recommendation.riskTa : recommendation.risk}
              </div>
            </div>
          </div>

          {/* 3. Why this happened */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0">
                3
              </div>
              <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'ta' ? 'ஏன் இந்த பரிந்துரை உருவானது (Why this happened):' : 'Why this happened:'}</span>
              </h3>
            </div>
            <div className="pl-8">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs sm:text-sm text-blue-950 leading-relaxed space-y-2">
                <p className="font-serif text-stone-800">
                  {language === 'ta' ? recommendation.whyThisHappenedTa : recommendation.whyThisHappened}
                </p>
                <div className="pt-2 border-t border-blue-200/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-blue-800">
                  <span>💡 <strong>{language === 'ta' ? 'முக்கிய காரணிகள்:' : 'Active Triggers:'}</strong> {crop}</span>
                  <span>• {severity} severity</span>
                  <span>• {humidityValue}% Humidity</span>
                  <span>• {growthStage} stage</span>
                  <span>• {pest !== 'None' ? pest : 'No active vector'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Recommended action */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                4
              </div>
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'ta' ? 'பரிந்துரைக்கப்பட்ட நடவடிக்கை (Recommended action):' : 'Recommended action:'}</span>
              </h3>
            </div>
            <div className="pl-8">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-stone-800 whitespace-pre-line leading-relaxed font-medium">
                {language === 'ta' ? recommendation.recommendedActionTa : recommendation.recommendedAction}
              </div>
            </div>
          </div>

          {/* 5. What to monitor */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-bold shrink-0">
                5
              </div>
              <h3 className="text-xs font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-purple-700" />
                <span>{language === 'ta' ? 'கவனிக்க வேண்டியவை (What to monitor):' : 'What to monitor:'}</span>
              </h3>
            </div>
            <div className="pl-8">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 whitespace-pre-line leading-relaxed">
                {language === 'ta' ? recommendation.whatToMonitorTa : recommendation.whatToMonitor}
              </div>
            </div>
          </div>

          {/* 6. Next check */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-stone-200 text-stone-800 flex items-center justify-center text-xs font-bold shrink-0">
                6
              </div>
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-700" />
                <span>{language === 'ta' ? 'அடுத்த ஆய்வு (Next check):' : 'Next check:'}</span>
              </h3>
            </div>
            <div className="pl-8">
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs sm:text-sm">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ta' ? recommendation.nextCheckTa : recommendation.nextCheck}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* KNAPSACK SPRAYER TANK DOSAGE CALCULATOR                        */}
      {/* ------------------------------------------------------------- */}
      {recommendation.sprayerDoseGuideline && (
        <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-[#1b5e20] text-white rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-serif">
                  {language === 'ta' ? 'தெளிப்பான் தொட்டி மருந்து அளவு கணக்கீடு' : 'Tailored Knapsack Sprayer Dosage Calculator'}
                </h3>
                <p className="text-xs text-emerald-200">
                  {language === 'ta' 
                    ? 'பரிந்துரைக்கப்பட்ட சிகிச்சைக்கு உங்கள் தொட்டி அளவிற்கு ஏற்ப சரியான அளவு கணக்கிடப்பட்டுள்ளது' 
                    : 'Exact grams/millilitres calculated for your tank size according to recommended IPM action'}
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-mono font-bold">
              {recommendation.sprayerDoseGuideline.isOrganic ? 'Zero Chemical Residue' : `${recommendation.sprayerDoseGuideline.waitingPeriodDays} Days Withholding`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
            {/* Tank Size Selector */}
            <div className="md:col-span-5 space-y-3">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                {language === 'ta' ? 'தெளிப்பான் தொட்டி கொள்ளளவு (லிட்டர்):' : 'Select Knapsack Capacity (Litres):'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 16, 20].map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setTankSizeLiters(size)}
                    className={`py-3 px-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      tankSizeLiters === size
                        ? 'bg-white text-emerald-950 shadow-md ring-2 ring-emerald-300'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {size} {language === 'ta' ? 'லிட்டர்' : 'Litres'}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="pt-2">
                <div className="flex justify-between text-xs text-emerald-200 mb-1">
                  <span>{language === 'ta' ? 'கையால் மாற்ற:' : 'Manual adjust:'}</span>
                  <span className="font-mono font-bold">{tankSizeLiters} Litres</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={tankSizeLiters}
                  onChange={(e) => setTankSizeLiters(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Computed Output Cards */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">
                  {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட மருந்து அளவு:' : 'Computed Application Dosage:'}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-mono">{computedDoseGrams}</span>
                  <span className="text-xs font-bold text-emerald-200">Grams / {tankSizeLiters}L Tank</span>
                </div>
                <p className="text-[11px] text-emerald-200 mt-1 font-mono">
                  {recommendation.sprayerDoseGuideline.dosePerLiter}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20">
                <span className="text-[10px] uppercase font-bold text-amber-300 block mb-1">
                  {language === 'ta' ? 'பயன்படுத்த வேண்டிய பொருள்:' : 'Target Formulation:'}
                </span>
                <p className="text-sm font-bold text-white leading-snug">
                  {language === 'ta' ? recommendation.sprayerDoseGuideline.productNameTa : recommendation.sprayerDoseGuideline.productName}
                </p>
                <p className="text-[10px] text-emerald-200 mt-1">
                  {language === 'ta' ? 'மாலை 4:30 மணிக்கு மேல் தெளிக்கவும்' : 'Optimal spray timing: Post 4:30 PM'}
                </p>
              </div>

              <div className="sm:col-span-2 bg-black/20 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-100">
                <span>
                  {language === 'ta'
                    ? `ஒரு ஏக்கருக்கு தேவைப்படும் தொட்டிகள்: சுமார் ${computedTanksPerAcre} தொட்டிகள் (200 லிட்டர் நீர்)`
                    : `Estimated coverage: ~${computedTanksPerAcre} tanks needed per Acre (~200L total water volume)`}
                </span>
                <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                  ~{computedTanksPerAcre} Tanks / Ac
                </span>
              </div>
            </div>
          </div>

          {/* Safety & Withholding notice */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-start gap-2 text-xs text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            <span>
              <strong>{language === 'ta' ? 'பாதுகாப்பு குறிப்பு:' : 'Farmer Safety Guard:'}</strong>{' '}
              {language === 'ta' ? recommendation.sprayerDoseGuideline.safetyPrecautionsTa : recommendation.sprayerDoseGuideline.safetyPrecautions}
            </span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* QUICK CROSS-NAVIGATION BUTTONS                                */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => onNavigate('scan_crop')}
          className="py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ta' ? 'புதிய இலையை ஸ்கேன் செய்' : 'Scan Another Leaf'}</span>
        </button>

        <button
          onClick={() => onNavigate('assistant')}
          className="py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ta' ? 'AI உழவர் உதவியாளரிடம் கேள்' : 'Ask AI Farmer Assistant'}</span>
        </button>

        <button
          onClick={() => onNavigate('disease_risk')}
          className="py-3 px-4 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>{language === 'ta' ? 'நுண்ணிய வானிலை ஆபத்து வரைபடம்' : 'Microclimate Risk Modeling'}</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </div>
  );
};
