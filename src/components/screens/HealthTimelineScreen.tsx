import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Volume2, 
  PlusCircle, 
  RotateCcw, 
  Share2, 
  ChevronRight, 
  Sparkles, 
  Camera, 
  Eye, 
  Layers, 
  FileText, 
  Calendar,
  Check,
  CheckCheck,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { CropScanRecord, CropType, LatestAiPrediction } from '../../types';
import { 
  DEFAULT_TOMATO_SCANS, 
  DEFAULT_PADDY_SCANS, 
  DEFAULT_COTTON_SCANS, 
  getStoredCropScans, 
  saveStoredCropScans, 
  computeContinuousTrajectory 
} from '../../data/cropScanHistoryData';
import { CropHealthTrendChart } from '../timeline/CropHealthTrendChart';
import { AddScanModal } from '../timeline/AddScanModal';
import { speakText } from '../../utils/audioSpeech';

interface HealthTimelineScreenProps {
  language: Language;
  onNavigate: (screen: any) => void;
}

type ViewMode = 'timeline' | 'recommendations' | 'comparison';

export const HealthTimelineScreen: React.FC<HealthTimelineScreenProps> = ({
  language,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];

  // Scans state initialized from localStorage
  const [allScans, setAllScans] = useState<CropScanRecord[]>(() => getStoredCropScans());
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('Tomato');
  const [selectedScan, setSelectedScan] = useState<CropScanRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Sync with localStorage
  useEffect(() => {
    saveStoredCropScans(allScans);
  }, [allScans]);

  // Filter scans by crop
  const filteredScans = allScans
    .filter((s) => selectedCropFilter === 'ALL' || s.crop.toLowerCase().includes(selectedCropFilter.toLowerCase()))
    .sort((a, b) => a.dayNumber - b.dayNumber);

  // Trajectory analytics
  const trajectory = computeContinuousTrajectory(filteredScans);
  const latestScan = trajectory.latestScan || filteredScans[filteredScans.length - 1];
  const previousScan = trajectory.previousScan;
  const firstScan = filteredScans[0];
  const latestPrediction = trajectory.latestPrediction;

  // Selected scan for detail view
  const activeDetailScan = selectedScan || latestScan;

  // Handle adding a new scan
  const handleSaveScan = (newScan: CropScanRecord) => {
    const updated = [...allScans, newScan];
    setAllScans(updated);
    setSelectedScan(newScan);
  };

  // Reset to the exact User Prompt Example sequence (Day 1 -> Day 4 -> Day 7 -> Day 10)
  const handleLoadUserPromptExample = () => {
    setAllScans(DEFAULT_TOMATO_SCANS);
    setSelectedCropFilter('Tomato');
    setSelectedScan(null);
  };

  const handleLoadPaddyExample = () => {
    setAllScans(DEFAULT_PADDY_SCANS);
    setSelectedCropFilter('Rice');
    setSelectedScan(null);
  };

  const handleLoadCottonExample = () => {
    setAllScans(DEFAULT_COTTON_SCANS);
    setSelectedCropFilter('Cotton');
    setSelectedScan(null);
  };

  // Bilingual voice readout
  const handleVoiceReadout = () => {
    if (language === 'ta') {
      const text = `தொடர் பயிர் ஆரோக்கிய காலக்கோடு: நாள் 1-ல் ஆரோக்கியம் 96 சதவீதமாக இருந்தது. நாள் 4-ல் லேசான கருகல் தொற்று ஏற்பட்டு ஆரோக்கியம் 78 ஆக சரிந்தது. நாள் 7-ல் நடுத்தர பாதிப்பு 60 சதவீதமாக அதிகரித்தது. கவாத்து மற்றும் உயிர் பூஞ்சாண தெளிப்புக்கு பின் நாள் 10-ல் ஆரோக்கியம் 84 சதவீதமாக உயர்ந்து குணமாகி வருகிறது. AI கணிப்புப்படி நாள் 14-ல் ஆரோக்கியம் 92 சதவீதத்தை எட்டும்.`;
      speakText(text, 'ta');
    } else {
      const text = `Continuous Crop Health Timeline: Tracking progression. Day 1: 96 percent healthy baseline. Day 4: Mild infection at 78 percent. Day 7: Moderate outbreak at 60 percent. Following IPM pruning and bio-fungicide, Day 10 shows clear recovery improving to 84 percent. AI projects health reaching 92 percent by Day 14.`;
      speakText(text, 'en');
    }
  };

  // WhatsApp / Report share
  const handleShareReport = () => {
    const reportText = language === 'ta'
      ? `*CropGuard AI - தொடர் பயிர் ஆரோக்கிய அறிக்கை*\nபயிர்: ${latestScan?.crop} (${latestScan?.plotName})\nநிலை: ${trajectory.status === 'Improving' ? 'குணமாகி வருகிறது (Improving)' : 'கண்காணிப்பில்'}\nநாள் 1: 96% ஆரோக்கியம்\nநாள் 4: 78% லேசான தொற்று\nநாள் 7: 60% நடுத்தர பாதிப்பு\nநாள் 10: 84% முன்னேற்றம் (+24 புள்ளிகள்)\nஅடுத்த AI கணிப்பு: 92% ஆரோக்கியம்\nநடவடிக்கை: உயிர் பூஞ்சாண தெளிப்பு தொடரவும்.`
      : `*CropGuard AI - Continuous Crop Health Timeline Report*\nCrop: ${latestScan?.crop} (${latestScan?.plotName})\nTrajectory: ${trajectory.status} (+${trajectory.deltaScore} pts)\nDay 1: 96% Healthy\nDay 4: 78% Mild Infection\nDay 7: 60% Moderate\nDay 10: 84% Improving (+24 pts)\nLatest AI Projection: 92% Health by Day 14\nRecommendation: Maintain bi-weekly biological shield.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div id="screen-continuous-health-timeline" className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase mb-1.5 border border-emerald-300">
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'தொடர் பயிர் கண்காணிப்பு & காலக்கோடு' : 'Continuous Crop Health Monitoring & Timeline'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            {language === 'ta' ? 'பயிர் ஆரோக்கிய காலக்கோடு' : 'Crop Health Timeline & Trends'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {language === 'ta'
              ? 'ஒற்றை முறை கண்டறிதலுக்கு பதிலாக, ஒவ்வொரு ஸ்கேனையும் பதிவு செய்து ஆரோக்கிய மாற்றங்களை தொடர்ந்து கண்காணிக்கவும்.'
              : 'Continuous crop monitoring tracking health, disease, and risk trends across every scan instead of one-time detection.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Audio voiceover */}
          <button
            onClick={handleVoiceReadout}
            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            title={language === 'ta' ? 'குரல் வழிகாட்டி' : 'Listen Voice Overview'}
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {/* Share report */}
          <button
            onClick={handleShareReport}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 border border-stone-200"
            title="Share Summary"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'பகிர்' : 'Share')}</span>
          </button>

          {/* Log new scan button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ta' ? 'புதிய ஸ்கேன் பதிவு' : '+ Log Scan'}</span>
          </button>

          {/* Scan fresh leaf button */}
          <button
            onClick={() => onNavigate('scan_crop')}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>{language === 'ta' ? 'கேமரா ஸ்கேன்' : 'Scan Leaf'}</span>
          </button>
        </div>
      </div>

      {/* Crop & Scenario Switcher Bar */}
      <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-500" />
          <span className="text-xs font-bold text-stone-700">
            {language === 'ta' ? 'பயிர் / நிலம் தேர்வு:' : 'Select Plot / Crop:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCropFilter('Tomato')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCropFilter === 'Tomato'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              🍅 {language === 'ta' ? 'தக்காளி (Tomato PKM-1)' : 'Tomato (Plot 2)'}
            </button>
            <button
              onClick={() => setSelectedCropFilter('Rice')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCropFilter === 'Rice'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              🌾 {language === 'ta' ? 'நெல் (Paddy CR-1009)' : 'Paddy (Plot 1)'}
            </button>
            <button
              onClick={() => setSelectedCropFilter('Cotton')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCropFilter === 'Cotton'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              ☁️ {language === 'ta' ? 'பருத்தி (Cotton Bt)' : 'Cotton (Plot 3)'}
            </button>
            <button
              onClick={() => setSelectedCropFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCropFilter === 'ALL'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {language === 'ta' ? 'அனைத்தும்' : 'All Scans'}
            </button>
          </div>
        </div>

        {/* Preset scenario shortcuts */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-stone-500 font-medium">
            {language === 'ta' ? 'மாதிரி தொடர்:' : 'Presets:'}
          </span>
          <button
            onClick={handleLoadUserPromptExample}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300"
            title="Day 1 Healthy -> Day 4 Mild -> Day 7 Moderate -> Day 10 Improving"
          >
            Day 1 → 4 → 7 → 10
          </button>
          <button
            onClick={handleLoadPaddyExample}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white hover:bg-stone-200 text-stone-700 border border-stone-300"
          >
            Rice Blast
          </button>
          <button
            onClick={handleLoadCottonExample}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white hover:bg-stone-200 text-stone-700 border border-stone-300"
          >
            Cotton Vector
          </button>
        </div>
      </div>

      {/* Trajectory Hero Banner (Showing whether health is improving or worsening) */}
      <div className={`p-5 sm:p-6 rounded-3xl border-2 transition-all shadow-xs ${
        trajectory.status === 'Improving'
          ? 'bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white border-emerald-300'
          : trajectory.status === 'Worsening'
          ? 'bg-gradient-to-br from-rose-50 via-amber-50/50 to-white border-rose-300'
          : 'bg-gradient-to-br from-stone-50 to-white border-stone-300'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-3 h-3 rounded-full animate-ping ${
                trajectory.status === 'Improving' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></span>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                {language === 'ta' ? 'ஒட்டுமொத்த பயிர் ஆரோக்கிய போக்கு' : 'Crop Health Trajectory Status'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif flex items-center gap-2">
                {trajectory.status === 'Improving' ? (
                  <>
                    <TrendingUp className="w-8 h-8 text-emerald-600 inline" />
                    <span>{language === 'ta' ? 'ஆரோக்கியம் சீராக முன்னேறி வருகிறது' : 'Health is Improving'}</span>
                  </>
                ) : trajectory.status === 'Worsening' ? (
                  <>
                    <TrendingDown className="w-8 h-8 text-rose-600 inline" />
                    <span>{language === 'ta' ? 'நோய் பாதிப்பு அதிகரித்து வருகிறது' : 'Infection is Escalating'}</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-8 h-8 text-stone-600 inline" />
                    <span>{language === 'ta' ? 'ஆரோக்கியம் சீராக உள்ளது' : 'Health is Stable'}</span>
                  </>
                )}
              </h3>

              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                trajectory.status === 'Improving'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}>
                {trajectory.deltaScore >= 0 ? `+${trajectory.deltaScore}` : trajectory.deltaScore} pts
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 mt-2 max-w-2xl">
              {language === 'ta' ? (
                <>
                  முந்தைய ஸ்கேனுடன் ஒப்பிடுகையில் (நாள் {previousScan?.dayNumber} → நாள் {latestScan?.dayNumber}), 
                  பயிர் ஆரோக்கிய மதிப்பெண் <strong>{previousScan?.healthScore || 0}%-லிருந்து {latestScan?.healthScore}%</strong> ஆக உயர்ந்துள்ளது. 
                  பூஞ்சாண தடுப்பு நடவடிக்கைகளுக்குப் பின் இலைகளில் உள்ள கருகல் புள்ளிகள் காய்ந்து புதிய தளிர்கள் ஆரோக்கியமாக வளர்கின்றன.
                </>
              ) : (
                <>
                  Compared to the prior scan ({previousScan?.dayLabel || 'Day 1'} → {latestScan?.dayLabel}), 
                  crop health climbed from <strong>{previousScan?.healthScore || 0}% to {latestScan?.healthScore}%</strong> (+{trajectory.deltaScore} pts). 
                  Pathogen spread has been arrested following agronomic pruning and bio-fungicide intervention.
                </>
              )}
            </p>
          </div>

          {/* Quick 4-Step Example Progress Flow */}
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-stone-200/80 shadow-xs lg:min-w-[320px]">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
              {language === 'ta' ? 'ஸ்கேன் முன்னேற்ற வரிசை:' : 'Scan Sequence Progression:'}
            </span>
            <div className="flex items-center justify-between gap-1 text-center">
              {filteredScans.slice(0, 4).map((scan, i) => (
                <div key={scan.id} className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-stone-500">{scan.dayLabel}</span>
                  <div className={`w-8 h-8 rounded-xl my-1 flex items-center justify-center text-xs font-extrabold text-white shadow-xs ${
                    scan.healthStatus === 'Healthy'
                      ? 'bg-emerald-600'
                      : scan.healthStatus === 'Mild infection' || scan.severity === 'Mild'
                      ? 'bg-lime-600'
                      : scan.healthStatus === 'Moderate'
                      ? 'bg-amber-500'
                      : scan.healthStatus === 'Improving'
                      ? 'bg-teal-600'
                      : 'bg-rose-600'
                  }`}>
                    {scan.healthScore}
                  </div>
                  <span className="text-[9px] font-semibold text-stone-700 leading-tight truncate max-w-[70px]">
                    {scan.healthStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Timeline and Trend Graphs */}
      <CropHealthTrendChart
        scans={filteredScans}
        latestPrediction={latestPrediction}
        language={language}
        onSelectScan={(scan) => setSelectedScan(scan)}
        selectedScanId={activeDetailScan?.id}
      />

      {/* Latest AI Prediction Section */}
      {latestPrediction && (
        <div id="latest-ai-prediction-card" className="bg-gradient-to-r from-purple-900 via-indigo-900 to-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-800/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/50 border border-purple-400/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {language === 'ta' ? 'அடுத்த AI முன்கணிப்பு & எதிர்கால போக்கு' : 'Latest AI Forward-Looking Prediction'}
                  </h3>
                  <p className="text-xs text-purple-200">
                    {language === 'ta' ? `${latestPrediction.targetDayLabel} திட்டமிடப்பட்ட ஆரோக்கிய மதிப்பீடு (${latestPrediction.confidenceScore}% AI நம்பகத்தன்மை)` : `${latestPrediction.targetDayLabel} Projected Trajectory (${latestPrediction.confidenceScore}% AI Confidence)`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full border border-purple-400/30">
                  Target: {latestPrediction.targetDayLabel} ({latestPrediction.projectedDate})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Projected Scores */}
              <div className="bg-purple-950/60 rounded-2xl p-4 border border-purple-800/40 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-purple-300 font-semibold block">
                    {language === 'ta' ? 'எதிர்பார்க்கப்படும் ஆரோக்கியம்:' : 'Projected Health Score:'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-emerald-400">
                      {latestPrediction.projectedHealthScore}%
                    </span>
                    <span className="text-xs text-emerald-300 font-bold">
                      (+{latestPrediction.projectedHealthScore - (latestScan?.healthScore || 0)} pts)
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-purple-800/40 flex items-center justify-between text-xs text-purple-200">
                  <span>{language === 'ta' ? 'அபாய புள்ளி:' : 'Projected Risk:'}</span>
                  <span className="font-bold text-rose-300">{latestPrediction.projectedRiskScore}% (Low)</span>
                </div>
              </div>

              {/* AI Forecast Summary */}
              <div className="md:col-span-2 bg-purple-950/60 rounded-2xl p-4 border border-purple-800/40 space-y-2.5">
                <div>
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    {language === 'ta' ? 'AI முன்கணிப்பு விளக்கம்:' : 'AI Forecast Summary:'}
                  </span>
                  <p className="text-xs sm:text-sm text-purple-100 mt-1 leading-relaxed">
                    {language === 'ta' ? latestPrediction.forecastSummaryTa : latestPrediction.forecastSummary}
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-800/40 flex items-start gap-2 text-xs text-purple-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">
                      {language === 'ta' ? 'தேவையான நடவடிக்கை: ' : 'Required Action: '}
                    </span>
                    <span>{language === 'ta' ? latestPrediction.actionRequiredTa : latestPrediction.actionRequired}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation View Switcher (Chronological Timeline vs Previous Recommendations vs Side-by-Side) */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'timeline'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{language === 'ta' ? 'வரிசைக்கிரம காலக்கோடு' : 'Chronological Timeline'}</span>
          </button>

          <button
            onClick={() => setViewMode('recommendations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'recommendations'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'ta' ? 'முந்தைய பரிந்துரைகள் & நடவடிக்கைகள்' : 'Previous Recommendations'}</span>
          </button>

          <button
            onClick={() => setViewMode('comparison')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'comparison'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{language === 'ta' ? 'நாட்கள் ஒப்பீடு (Side-by-Side)' : 'Side-by-Side Day View'}</span>
          </button>
        </div>

        <span className="text-xs text-stone-500 font-semibold hidden sm:inline">
          {filteredScans.length} {language === 'ta' ? 'ஸ்கேன்கள் சேமிக்கப்பட்டுள்ளன' : 'Scans Stored'}
        </span>
      </div>

      {/* VIEW 1: CHRONOLOGICAL SCAN TIMELINE */}
      {viewMode === 'timeline' && (
        <div className="space-y-4">
          {filteredScans.map((scan, index) => {
            const isSelected = activeDetailScan?.id === scan.id;
            const isFirst = index === 0;
            const isLatest = index === filteredScans.length - 1;

            return (
              <div
                key={scan.id}
                id={`scan-record-${scan.id}`}
                onClick={() => setSelectedScan(scan)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/40 border-emerald-500 shadow-md ring-2 ring-emerald-200'
                    : isLatest
                    ? 'bg-white border-emerald-300 hover:border-emerald-400 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    {/* Day Pill */}
                    <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-xs">
                      <span className="text-[9px] uppercase tracking-wider text-emerald-200 font-normal">Day</span>
                      <span className="text-sm font-extrabold leading-none">{scan.dayNumber}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-base">
                          {scan.dayLabel}: {language === 'ta' && scan.diseaseTa ? scan.diseaseTa : scan.disease}
                        </h4>
                        {isLatest && (
                          <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">
                            {language === 'ta' ? 'சமீபத்திய ஸ்கேன்' : 'Latest Scan'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {scan.date} • {scan.crop} ({scan.plotName || 'Plot 2'}) • {scan.growthStage || 'Vegetative'}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs">
                      <Activity className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Health: {scan.healthScore}%</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-900 font-bold text-xs border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Risk: {scan.riskScore}%</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Conf: {scan.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-3.5">
                  {/* Stored Recommendation Box */}
                  <div className="lg:col-span-2 bg-stone-50 rounded-2xl p-3.5 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        {language === 'ta' ? 'அப்போது வழங்கப்பட்ட AI பரிந்துரை:' : 'AI Agronomic Recommendation Issued:'}
                      </span>
                      <span className="text-[11px] font-bold text-stone-600 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                        Severity: {scan.severity}
                      </span>
                    </div>
                    <p className="text-xs text-stone-800 leading-relaxed font-medium">
                      {language === 'ta' && scan.recommendationTa ? scan.recommendationTa : scan.recommendation}
                    </p>

                    {/* Action Taken by Farmer */}
                    {scan.previousActionTaken && (
                      <div className="pt-2 border-t border-stone-200/80 flex items-start gap-2 text-xs text-stone-700">
                        <CheckCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-stone-900">
                            {language === 'ta' ? 'விவசாயி எடுத்த நடவடிக்கை: ' : 'Action Completed: '}
                          </span>
                          <span>{language === 'ta' && scan.previousActionTakenTa ? scan.previousActionTakenTa : scan.previousActionTaken}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Leaf & Diagnostic Condition */}
                  <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                        {language === 'ta' ? 'கள அவதானிப்பு குறிப்பு:' : 'Field Scouting Observation:'}
                      </span>
                      <p className="text-xs text-stone-700 mt-1 line-clamp-3">
                        {scan.notes || 'Routine health inspection recorded.'}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">Health Status:</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full ${
                        scan.healthStatus === 'Healthy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : scan.healthStatus === 'Improving'
                          ? 'bg-teal-100 text-teal-800'
                          : scan.healthStatus === 'Mild infection'
                          ? 'bg-lime-100 text-lime-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {scan.healthStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: PREVIOUS RECOMMENDATIONS AUDIT LOG */}
      {viewMode === 'recommendations' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>{language === 'ta' ? 'முந்தைய பரிந்துரைகள் மற்றும் சிகிச்சை வரலாறு' : 'Previous Recommendations & Action History'}</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'ta'
                  ? 'ஒவ்வொரு ஸ்கேனிலும் வழங்கப்பட்ட பரிந்துரைகளும், அதன் விளைவாக ஏற்பட்ட ஆரோக்கிய முன்னேற்றமும்'
                  : 'Historical IPM treatments applied on each day and the measured health impact on subsequent scans'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {filteredScans.map((scan, idx) => {
              const nextScan = filteredScans[idx + 1];
              const healthDelta = nextScan ? nextScan.healthScore - scan.healthScore : null;

              return (
                <div key={scan.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-stone-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-800 text-white font-bold text-xs">
                        {scan.dayLabel}
                      </span>
                      <span className="text-xs font-semibold text-stone-700">
                        {scan.date} • {scan.disease}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-700">
                        Severity: {scan.severity}
                      </span>
                      {healthDelta !== null && (
                        <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                          healthDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          Result: {healthDelta >= 0 ? `+${healthDelta}` : healthDelta} pts next scan
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-emerald-950 block mb-0.5">
                        {language === 'ta' ? 'AI பரிந்துரை:' : 'AI Recommendation Given:'}
                      </span>
                      <p className="text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200">
                        {language === 'ta' && scan.recommendationTa ? scan.recommendationTa : scan.recommendation}
                      </p>
                    </div>

                    {scan.previousActionTaken && (
                      <div className="flex items-center gap-2 text-stone-700 pt-1">
                        <CheckCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="font-semibold text-stone-900">
                          {language === 'ta' ? 'நடவடிக்கை முடிவு:' : 'Action Taken:'}
                        </span>
                        <span>{language === 'ta' && scan.previousActionTakenTa ? scan.previousActionTakenTa : scan.previousActionTaken}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: SIDE-BY-SIDE DAY PROGRESSION GRID */}
      {viewMode === 'comparison' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredScans.slice(0, 4).map((scan, i) => (
              <div key={scan.id} className="bg-white rounded-3xl border-2 border-stone-200 p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {scan.dayLabel}
                    </span>
                    <span className="text-xs font-bold text-stone-500">{scan.date}</span>
                  </div>

                  {/* Leaf Visual Graphic Placeholder */}
                  <div className="w-full h-32 my-3 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center p-3 relative overflow-hidden">
                    {scan.thumbnailSvg ? (
                      <div
                        className="w-20 h-20"
                        dangerouslySetInnerHTML={{ __html: scan.thumbnailSvg }}
                      />
                    ) : (
                      <div className="text-center text-xs text-stone-400">
                        <Camera className="w-8 h-8 mx-auto mb-1 text-stone-400" />
                        <span>Scan Photo</span>
                      </div>
                    )}

                    <span className={`absolute top-2 right-2 text-[10px] font-extrabold px-2 py-0.5 rounded-md text-white ${
                      scan.healthStatus === 'Healthy'
                        ? 'bg-emerald-600'
                        : scan.healthStatus === 'Improving'
                        ? 'bg-teal-600'
                        : scan.healthStatus === 'Moderate'
                        ? 'bg-amber-600'
                        : 'bg-lime-600'
                    }`}>
                      {scan.healthStatus}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm">
                    {language === 'ta' && scan.diseaseTa ? scan.diseaseTa : scan.disease}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Severity: {scan.severity} • Conf: {scan.confidence}%
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-stone-600">Health:</span>
                    <span className="font-bold text-emerald-900">{scan.healthScore}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden mb-2">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${scan.healthScore}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2 italic">
                    "{scan.recommendation}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Scan Modal */}
      <AddScanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveScan={handleSaveScan}
        language={language}
        nextSuggestedDay={latestScan ? latestScan.dayNumber + 3 : 14}
      />
    </div>
  );
};
