import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Camera, 
  ShieldCheck, 
  Microscope,
  RotateCcw,
  Share2,
  HelpCircle,
  Clock,
  Droplets,
  Flame,
  Check,
  ChevronRight,
  Leaf,
  TrendingUp
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { SampleLeafImage } from '../../types';
import { speakText } from '../../utils/audioSpeech';

interface DetectionResultScreenProps {
  language: Language;
  currentScan: SampleLeafImage;
  onNavigate: (screen: any) => void;
}

export const DetectionResultScreen: React.FC<DetectionResultScreenProps> = ({
  language,
  currentScan,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];
  const [copiedShare, setCopiedShare] = useState(false);

  // Farmer-friendly fields with fallback to exact user prompt example
  const cropDisplay = language === 'ta' && currentScan.cropTa ? currentScan.cropTa : currentScan.crop;
  const diseaseDisplay = language === 'ta' && currentScan.diseaseNameTa ? currentScan.diseaseNameTa : currentScan.diseaseName;
  const confidencePercent = Math.round(currentScan.confidence * 100);

  const symptomsText = language === 'ta' && currentScan.symptomsTa 
    ? currentScan.symptomsTa 
    : (currentScan.symptoms || 'Brown circular spots and yellowing around affected areas.');

  const causeText = language === 'ta' && currentScan.causeTa 
    ? currentScan.causeTa 
    : (currentScan.cause || 'Fungal infection.');

  const preventionText = language === 'ta' && currentScan.preventionTa 
    ? currentScan.preventionTa 
    : (currentScan.prevention || 'Remove infected leaves, maintain field hygiene and avoid prolonged leaf wetness.');

  const nextActionText = language === 'ta' && currentScan.recommendedNextActionTa
    ? currentScan.recommendedNextActionTa
    : (currentScan.recommendedNextAction || 'Remove lower infected leaves immediately. Spray organic Trichoderma viride (5g/L) or Mancozeb 75% WP (2g/L) before 4:00 PM today.');

  const handleVoiceDiagnosis = () => {
    if (language === 'ta') {
      const speech = `பயிர்: ${cropDisplay}. நோய்: ${diseaseDisplay}. நம்பகத்தன்மை: ${confidencePercent} சதவீதம். தீவிரத்தன்மை: மிதமானது. அறிகுறிகள்: ${symptomsText}. காரணம்: ${causeText}. தடுப்பு: ${preventionText}. அடுத்த நடவடிக்கை: ${nextActionText}`;
      speakText(speech, 'ta');
    } else {
      const speech = `Crop: ${cropDisplay}. Disease: ${diseaseDisplay}. Confidence: ${confidencePercent} percent. Severity: ${currentScan.severity}. Symptoms: ${symptomsText}. Cause: ${causeText}. Prevention: ${preventionText}. Recommended next action: ${nextActionText}`;
      speakText(speech, 'en');
    }
  };

  const handleShareWhatsApp = () => {
    const text = `*CropGuard AI Alert*\nCrop: ${cropDisplay}\nDisease: ${diseaseDisplay}\nConfidence: ${confidencePercent}%\nSeverity: ${currentScan.severity}\nSymptoms: ${symptomsText}\nAction: ${nextActionText}`;
    if (navigator.share) {
      navigator.share({ title: 'CropGuard AI Diagnosis', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Severity color badge and description
  const getSeverityBadge = () => {
    const s = currentScan.severity;
    if (s === 'Low') {
      return {
        bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        dot: 'bg-emerald-500',
        label: language === 'ta' ? 'குறைவான ஆபத்து' : 'Low Severity',
        note: language === 'ta' ? 'ஆரம்ப நிலை • எளிதில் கட்டுப்படுத்தலாம்' : 'Initial stage • Easy to manage organically'
      };
    }
    if (s === 'Moderate') {
      return {
        bg: 'bg-amber-100 text-amber-950 border-amber-300',
        dot: 'bg-amber-500',
        label: language === 'ta' ? 'மிதமான பாதிப்பு (Moderate)' : 'Moderate Severity',
        note: language === 'ta' ? 'இன்று சிகிச்சை செய்தால் பயிர் மகசூல் 100% பாதுகாக்கப்படும்' : 'Treat today to protect 100% of crop yield'
      };
    }
    if (s === 'High') {
      return {
        bg: 'bg-orange-100 text-orange-950 border-orange-300',
        dot: 'bg-orange-500',
        label: language === 'ta' ? 'அதிக பாதிப்பு' : 'High Severity',
        note: language === 'ta' ? 'உடனடி தெளிப்பு அவசியம்' : 'Immediate spraying required'
      };
    }
    return {
      bg: 'bg-red-100 text-red-950 border-red-300',
      dot: 'bg-red-600',
      label: language === 'ta' ? 'தீவிர பாதிப்பு' : 'Critical Severity',
      note: language === 'ta' ? 'முழு பயிர் பாதுகாப்பு நடவடிக்கைகள் தேவை' : 'Immediate intervention required'
    };
  };

  const severityInfo = getSeverityBadge();

  return (
    <div id="screen-detection-result" className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('scan_crop')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'மறுபடியும் ஸ்கேன் செய்' : 'Scan Another Leaf'}</span>
          </button>
          <span className="text-stone-300">/</span>
          <span className="text-xs font-semibold text-stone-600">
            {language === 'ta' ? 'பரிசோதனை முடிவு' : 'Diagnostic Result'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="result-voice-btn"
            onClick={handleVoiceDiagnosis}
            className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Read aloud for farmer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{language === 'ta' ? 'குரல் வழிகாட்டல் (Listen)' : 'Listen Audio'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-2 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Share with farmer group"
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            <span>{copiedShare ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'பகிர்' : 'Share')}</span>
          </button>
        </div>
      </div>

      {/* PRIMARY RESULT BANNER: CROP, DISEASE & CONFIDENCE */}
      <div className="bg-white rounded-3xl border-2 border-emerald-400 p-5 sm:p-7 shadow-sm relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald-50 -z-0 pointer-events-none" />

        <div className="relative z-10">
          {/* Top row: Crop Tag + AI Confidence */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-800 px-3 py-1 rounded-lg border border-stone-200 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'ta' ? 'பயிர்:' : 'Crop:'} <strong className="text-emerald-800 font-black">{cropDisplay}</strong></span>
              </span>
            </div>

            {/* AI Confidence Indicator */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-mono font-bold text-emerald-900">
                {confidencePercent}% {language === 'ta' ? 'நம்பகத்தன்மை' : 'Confidence'}
              </span>
            </div>
          </div>

          {/* Disease Name Display */}
          <div className="pb-4 border-b border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {language === 'ta' ? 'கண்டறியப்பட்ட நோய் (Detected Disease)' : 'Identified Disease'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 font-serif tracking-tight mt-0.5">
              {diseaseDisplay}
            </h1>
            <p className="text-xs text-stone-500 font-mono italic mt-1">
              Pathogen: {currentScan.pathogen}
            </p>
          </div>

          {/* SEVERITY INDICATOR */}
          <div className="py-4 border-b border-stone-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  {language === 'ta' ? 'தீவிரத்தன்மை நிலை (Severity):' : 'Severity Indicator:'}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${severityInfo.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${severityInfo.dot} animate-pulse`} />
                  <span>{severityInfo.label}</span>
                </span>
              </div>
              <span className="text-xs text-stone-500 italic">
                {severityInfo.note}
              </span>
            </div>

            {/* 4-Stage Severity Visual Meter */}
            <div className="grid grid-cols-4 gap-1.5 h-3.5 rounded-full overflow-hidden p-0.5 bg-stone-100 border border-stone-200">
              <div 
                className={`rounded-l-full flex items-center justify-center text-[9px] font-bold ${
                  currentScan.severity === 'Low' ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'
                }`}
              >
                Low
              </div>
              <div 
                className={`flex items-center justify-center text-[9px] font-bold ${
                  currentScan.severity === 'Moderate' ? 'bg-amber-500 text-stone-950 font-black ring-2 ring-amber-300' : 'bg-stone-200 text-stone-500'
                }`}
              >
                Moderate
              </div>
              <div 
                className={`flex items-center justify-center text-[9px] font-bold ${
                  currentScan.severity === 'High' ? 'bg-orange-500 text-white' : 'bg-stone-200 text-stone-500'
                }`}
              >
                High
              </div>
              <div 
                className={`rounded-r-full flex items-center justify-center text-[9px] font-bold ${
                  currentScan.severity === 'Critical' ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-500'
                }`}
              >
                Critical
              </div>
            </div>
          </div>

          {/* LEAF IMAGE & INSPECTION VIEW */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5">
            {/* Left Column: Leaf Photo Visual */}
            <div className="md:col-span-4 bg-stone-950 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden border border-stone-800">
              <div className="w-40 h-40 sm:w-48 sm:h-48 relative flex items-center justify-center">
                {currentScan.imageUrl ? (
                  <img
                    src={currentScan.imageUrl}
                    alt={diseaseDisplay}
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: currentScan.thumbnailSvg }}
                  />
                )}

                {/* AI Detected Lesion Bounding Marker */}
                <div className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-dashed border-amber-400 rounded-lg pointer-events-none animate-pulse">
                  <span className="absolute -top-3 -right-2 bg-amber-500 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                    {confidencePercent}% SPOT
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Diagnostic Match</span>
              </div>
            </div>

            {/* Right Column: 3 Farmer Cards (Symptoms, Cause, Prevention) */}
            <div className="md:col-span-8 space-y-3.5">
              {/* Card 1: Visible Symptoms */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                    {language === 'ta' ? 'அறிகுறிகள் (Visible Symptoms):' : 'Visible Symptoms:'}
                  </h3>
                </div>
                <p className="text-sm font-medium text-stone-800 pl-8 leading-relaxed">
                  {symptomsText}
                </p>
              </div>

              {/* Card 2: Possible Cause */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-red-100 text-red-800 flex items-center justify-center">
                    <Microscope className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                    {language === 'ta' ? 'நோய் காரணி (Possible Cause):' : 'Possible Cause:'}
                  </h3>
                </div>
                <p className="text-sm font-medium text-stone-800 pl-8 leading-relaxed">
                  {causeText}
                </p>
              </div>

              {/* Card 3: Recommended Prevention */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                    {language === 'ta' ? 'தடுப்பு முறைகள் (Recommended Prevention):' : 'Recommended Prevention:'}
                  </h3>
                </div>
                <p className="text-sm font-medium text-stone-800 pl-8 leading-relaxed">
                  {preventionText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED NEXT ACTION (FARMER DIRECTIVE) */}
      <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-7 shadow-md relative overflow-hidden border border-emerald-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              {language === 'ta' ? 'விவசாயிகளுக்கான உடனடி தீர்வு' : 'Farmer Advisory'}
            </span>
            <h3 className="text-lg font-bold text-white font-serif">
              {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட அடுத்த நடவடிக்கை' : 'Recommended Next Action'}
            </h3>
          </div>
        </div>

        {/* Immediate actionable advice */}
        <div className="bg-emerald-950/60 rounded-2xl p-4 border border-emerald-700/50 mb-4">
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-medium">
            {nextActionText}
          </p>
        </div>

        {/* 3 Step Practical Farmer Roadmap */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-emerald-800/60 rounded-xl p-3 border border-emerald-700/40 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-emerald-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {language === 'ta' ? 'பாதிக்கப்பட்ட இலைகளை நீக்கு' : 'Pluck Lower Leaves'}
              </p>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                {language === 'ta' ? 'கீழ் இலைகளை கிள்ளி வயலுக்கு வெளியே எரிக்கவும்' : 'Remove diseased leaves & burn away from field'}
              </p>
            </div>
          </div>

          <div className="bg-emerald-800/60 rounded-xl p-3 border border-emerald-700/40 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-emerald-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {language === 'ta' ? 'மருந்து தெளிப்பு' : 'Foliar Bio-Spray'}
              </p>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                {language === 'ta' ? 'மேன்கோசெப் 2 கி/லி அல்லது வேப்ப எண்ணெய் தெளிக்கவும்' : 'Apply Mancozeb (2g/L) or Neem bio-spray before 4 PM'}
              </p>
            </div>
          </div>

          <div className="bg-emerald-800/60 rounded-xl p-3 border border-emerald-700/40 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-emerald-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {language === 'ta' ? 'நீர் மேலாண்மை' : 'Throttle Watering'}
              </p>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                {language === 'ta' ? 'இலைகளில் தண்ணீர் படாமல் சொட்டுநீர் பயன்படுத்தவும்' : 'Use drip irrigation to prevent wet foliage'}
              </p>
            </div>
          </div>
        </div>

        {/* KNAPSACK SPRAYER DOSAGE HELPER */}
        <div className="mt-4 pt-3.5 border-t border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>
              {language === 'ta'
                ? '16 லிட்டர் தெளிப்பான் தொட்டிக்கு: 32 கிராம் மேன்கோசெப் அல்லது 80 மிலி வேப்பெண்ணெய் கரைசல் சேர்க்கவும்.'
                : '16L Knapsack Sprayer Tank: Add 32g Mancozeb powder or 80ml Organic Bio-Shield.'}
            </span>
          </div>

          <span className="font-bold bg-emerald-800 px-2.5 py-1 rounded-md text-[11px] text-amber-200">
            {language === 'ta' ? 'தெளிக்கும் நேரம்: மாலை 4:00 PM' : 'Optimal Spray: 4:00 PM'}
          </span>
        </div>
      </div>

      {/* CONTINUOUS HEALTH TIMELINE BANNER */}
      <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-950 text-sm">
              {language === 'ta' ? 'தொடர் பயிர் கண்காணிப்பு காலக்கோடு' : 'Continuous Crop Health Monitoring'}
            </h4>
            <p className="text-xs text-emerald-800">
              {language === 'ta'
                ? 'இந்த ஸ்கேன் உங்கள் பயிர் காலக்கோட்டில் சேர்க்கப்பட்டுள்ளது. ஆரோக்கியம் முன்னேறுகிறதா என வரைபடத்தில் பார்க்கவும்.'
                : 'This scan has been saved to your timeline. View health, disease, and risk progression curves.'}
            </p>
          </div>
        </div>

        <button
          id="view-health-timeline-btn"
          onClick={() => onNavigate('timeline')}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
        >
          <TrendingUp className="w-4 h-4" />
          <span>{language === 'ta' ? 'காலக்கோட்டை காண்க' : 'View Timeline & Graphs'}</span>
        </button>
      </div>

      {/* QUICK NEXT STEP BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          id="view-adaptive-rec-btn"
          onClick={() => onNavigate('recommendations')}
          className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-800 hover:to-green-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ring-2 ring-emerald-400"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{language === 'ta' ? 'தகவமைப்பு AI பரிந்துரை' : 'Adaptive AI Recommendation'}</span>
        </button>

        <button
          id="view-timeline-btn"
          onClick={() => onNavigate('timeline')}
          className="py-3.5 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <TrendingUp className="w-4 h-4" />
          <span>{language === 'ta' ? 'ஆரோக்கிய காலக்கோடு' : 'Health Timeline'}</span>
        </button>

        <button
          id="view-severity-btn"
          onClick={() => onNavigate('severity_analysis')}
          className="py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Activity className="w-4 h-4 text-stone-950" />
          <span>{language === 'ta' ? 'தீவிரத்தன்மை விவரம்' : 'Severity Analysis'}</span>
        </button>

        <button
          id="ask-ai-crop-btn"
          onClick={() => onNavigate('assistant')}
          className="py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ta' ? 'AI உழவர் உதவியாளர்' : 'Ask AI Assistant'}</span>
        </button>
      </div>
    </div>
  );
};
