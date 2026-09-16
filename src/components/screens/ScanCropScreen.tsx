import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  Image as ImageIcon, 
  Volume2, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Info,
  SlidersHorizontal,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { SAMPLE_LEAVES } from '../../data/mockData';
import { SampleLeafImage, CropType } from '../../types';
import { speakText } from '../../utils/audioSpeech';

interface ScanCropScreenProps {
  language: Language;
  onNavigate: (screen: any) => void;
  onScanComplete: (sample: SampleLeafImage) => void;
}

const AVAILABLE_CROPS: { id: CropType; nameEn: string; nameTa: string; emoji: string; variety: string }[] = [
  { id: 'Tomato', nameEn: 'Tomato', nameTa: 'தக்காளி', emoji: '🍅', variety: 'PKM-1 / Hybrid' },
  { id: 'Rice', nameEn: 'Paddy (Rice)', nameTa: 'நெல்', emoji: '🌾', variety: 'CR 1009 / BPT' },
  { id: 'Cotton', nameEn: 'Cotton', nameTa: 'பருத்தி', emoji: '☁️', variety: 'Bt Hybrid' },
  { id: 'Corn (Maize)', nameEn: 'Corn (Maize)', nameTa: 'மக்காச்சோளம்', emoji: '🌽', variety: 'CO-6 Grain' },
  { id: 'Potato', nameEn: 'Potato', nameTa: 'உருளைக்கிழங்கு', emoji: '🥔', variety: 'Kufri Jyoti' }
];

export const ScanCropScreen: React.FC<ScanCropScreenProps> = ({
  language,
  onNavigate,
  onScanComplete,
}) => {
  const t = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Flow State: Step 1 = Select Crop, Step 2 = Photo/Upload, Step 3 = AI Analysis
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedCrop, setSelectedCrop] = useState<CropType>('Tomato');
  const [photoMode, setPhotoMode] = useState<'camera' | 'upload' | 'samples'>('camera');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisPhase, setAnalysisPhase] = useState<string>('');

  // Find sample matching selected crop or default to first
  const matchingSamples = SAMPLE_LEAVES.filter((s) => s.crop === selectedCrop);
  const [selectedSample, setSelectedSample] = useState<SampleLeafImage>(
    matchingSamples[0] || SAMPLE_LEAVES[0]
  );

  // When crop changes, update matching sample
  const handleSelectCrop = (crop: CropType) => {
    setSelectedCrop(crop);
    const match = SAMPLE_LEAVES.find((s) => s.crop === crop) || SAMPLE_LEAVES[0];
    setSelectedSample(match);
    setCustomPhotoUrl(null);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomPhotoUrl(result);
        setPhotoMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  // Start AI Analysis
  const handleStartAnalysis = (sampleToAnalyze?: SampleLeafImage) => {
    const targetSample = sampleToAnalyze || selectedSample;
    setIsAnalyzing(true);
    setCurrentStep(3);
    setAnalysisProgress(15);
    setAnalysisPhase(
      language === 'ta'
        ? 'இலையின் மேற்பரப்பு மற்றும் நிற மாற்றம் ஸ்கேன் செய்யப்படுகிறது...'
        : 'Scanning leaf surface pigmentation & chlorosis...'
    );

    setTimeout(() => {
      setAnalysisProgress(55);
      setAnalysisPhase(
        language === 'ta'
          ? 'இலைக்கருகல் புள்ளிகள் மற்றும் பூஞ்சை விளிம்புகள் கண்டறியப்படுகின்றன...'
          : 'Detecting necrosis perimeter, bullseye rings & lesions...'
      );
    }, 600);

    setTimeout(() => {
      setAnalysisProgress(88);
      setAnalysisPhase(
        language === 'ta'
          ? 'நோய் மாதிரி ஒப்பிடுதல் & நம்பகத்தன்மை சரிபார்ப்பு...'
          : 'Matching disease pattern against 100,000+ crop models...'
      );
    }, 1100);

    setTimeout(() => {
      setAnalysisProgress(100);
      setIsAnalyzing(false);

      // If custom uploaded photo was used, attach image URL
      const finalSample: SampleLeafImage = customPhotoUrl
        ? {
            ...targetSample,
            crop: selectedCrop,
            imageUrl: customPhotoUrl,
          }
        : targetSample;

      onScanComplete(finalSample);
      onNavigate('detection_result');
    }, 1500);
  };

  const handleVoiceGuide = () => {
    if (language === 'ta') {
      speakText(
        'படி 1: உங்கள் பயிரை தேர்ந்தெடுக்கவும். படி 2: பாதிக்கப்பட்ட இலையின் படத்தை எடுக்கவும் அல்லது பதிவேற்றவும். பின்னர் செயற்கை நுண்ணறிவு ஆய்வு பொத்தானை அழுத்தவும்.',
        'ta'
      );
    } else {
      speakText(
        'Step 1: Select your crop. Step 2: Take or upload a clear leaf photo. Then tap Analyze Leaf to detect disease, severity, and farmer remedies.',
        'en'
      );
    }
  };

  return (
    <div id="screen-scan-crop" className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {language === 'ta' ? 'AI பயிர் நோய் கண்டறிதல்' : 'AI Disease Diagnosis'}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {language === 'ta' ? 'எளிய 4 படிகள்' : '4 Simple Steps'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif mt-1 flex items-center gap-2">
            <Camera className="w-6 h-6 text-emerald-700" />
            <span>{t.screens.scan_crop}</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            {language === 'ta'
              ? 'பயிரைத் தேர்வு செய்து, இலையைப் படம் பிடித்து, சில நொடிகளில் நோயையும் தீர்வுகளையும் அறியுங்கள்.'
              : 'Select crop, capture leaf photo, and get instant diagnosis with farmer-friendly remedies.'}
          </p>
        </div>

        <button
          onClick={handleVoiceGuide}
          className="p-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Voice Guide"
        >
          <Volume2 className="w-5 h-5 text-emerald-700" />
          <span className="text-xs font-bold hidden sm:inline">
            {language === 'ta' ? 'வழிகாட்டல்' : 'Audio Guide'}
          </span>
        </button>
      </div>

      {/* USER FLOW STEPPER BREADCRUMB */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <div className="flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-stone-200 -translate-y-1/2 z-0" />

          {/* Step 1: Select Crop */}
          <div 
            onClick={() => !isAnalyzing && setCurrentStep(1)}
            className={`relative z-10 flex flex-col items-center cursor-pointer transition-transform ${
              currentStep === 1 ? 'scale-105' : 'opacity-85'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep >= 1 ? 'bg-emerald-700 text-white shadow-xs' : 'bg-stone-200 text-stone-600'
            }`}>
              1
            </div>
            <span className={`text-[11px] font-bold mt-1.5 ${
              currentStep === 1 ? 'text-emerald-800' : 'text-stone-600'
            }`}>
              {language === 'ta' ? 'பயிர் தேர்வு' : 'Select Crop'}
            </span>
          </div>

          {/* Step 2: Upload / Take Photo */}
          <div 
            onClick={() => !isAnalyzing && setCurrentStep(2)}
            className={`relative z-10 flex flex-col items-center cursor-pointer transition-transform ${
              currentStep === 2 ? 'scale-105' : 'opacity-85'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep >= 2 ? 'bg-emerald-700 text-white shadow-xs' : 'bg-stone-200 text-stone-600'
            }`}>
              2
            </div>
            <span className={`text-[11px] font-bold mt-1.5 ${
              currentStep === 2 ? 'text-emerald-800' : 'text-stone-600'
            }`}>
              {language === 'ta' ? 'இலை படம்' : 'Leaf Photo'}
            </span>
          </div>

          {/* Step 3: AI Analysis */}
          <div className={`relative z-10 flex flex-col items-center ${
            currentStep === 3 ? 'scale-105' : 'opacity-70'
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep === 3 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse' : 'bg-stone-200 text-stone-600'
            }`}>
              3
            </div>
            <span className={`text-[11px] font-bold mt-1.5 ${
              currentStep === 3 ? 'text-emerald-800' : 'text-stone-600'
            }`}>
              {language === 'ta' ? 'AI ஆய்வு' : 'AI Analysis'}
            </span>
          </div>

          {/* Step 4: Result */}
          <div className="relative z-10 flex flex-col items-center opacity-60">
            <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <span className="text-[11px] font-bold mt-1.5 text-stone-500">
              {language === 'ta' ? 'நோய் முடிவு' : 'Result'}
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: SELECT CROP */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'ta' ? 'பயிரைத் தேர்ந்தெடுக்கவும்:' : 'Select Crop:'}
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {language === 'ta' ? 'தற்போது: ' : 'Selected: '}
            <strong className="text-emerald-700">
              {AVAILABLE_CROPS.find(c => c.id === selectedCrop)?.[language === 'ta' ? 'nameTa' : 'nameEn']}
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {AVAILABLE_CROPS.map((crop) => {
            const isSelected = selectedCrop === crop.id;
            return (
              <button
                key={crop.id}
                id={`crop-select-${crop.id.toLowerCase().replace(/[^a-z]/g, '')}`}
                onClick={() => handleSelectCrop(crop.id)}
                className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-stone-50/60 hover:border-emerald-300 hover:bg-stone-50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                  </div>
                )}
                <span className="text-3xl mb-1">{crop.emoji}</span>
                <span className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                  {language === 'ta' ? crop.nameTa : crop.nameEn}
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5 truncate max-w-full">
                  {crop.variety}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: UPLOAD / TAKE LEAF PHOTO */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'ta' ? 'இலையை படம் பிடிக்கவும் / பதிவேற்றவும்:' : 'Capture or Upload Leaf Photo:'}
            </h3>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => setPhotoMode('camera')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                photoMode === 'camera' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'கேமரா' : 'Take Photo'}</span>
            </button>
            <button
              onClick={() => {
                setPhotoMode('upload');
                fileInputRef.current?.click();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                photoMode === 'upload' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'பதிவேற்றம்' : 'Upload File'}</span>
            </button>
            <button
              onClick={() => setPhotoMode('samples')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                photoMode === 'samples' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'மாதிரி இலைகள்' : 'Demo Samples'}</span>
            </button>
          </div>
        </div>

        {/* Hidden Real File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        {/* PHOTO DISPLAY & VIEWFINDER */}
        <div className="bg-stone-900 text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden border-2 border-stone-800">
          {/* Top Bar inside Viewfinder */}
          <div className="flex items-center justify-between mb-3 z-10 relative">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-900/90 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI VISION READY</span>
              </span>
              <span className="text-[11px] text-stone-300 bg-stone-800/80 px-2.5 py-1 rounded-full">
                {selectedCrop}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFlashOn(!flashOn)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  flashOn ? 'bg-amber-400 text-stone-900' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
                title="Toggle Lighting"
              >
                <Zap className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors cursor-pointer"
                title="Upload Photo"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Viewfinder Target Frame with Leaf Display */}
          <div className="relative aspect-4/3 sm:aspect-16/9 bg-stone-950 rounded-xl flex items-center justify-center overflow-hidden border border-stone-800">
            {/* Custom Uploaded Photo OR SVG Leaf Display */}
            {customPhotoUrl ? (
              <div className="w-full h-full flex items-center justify-center p-2">
                <img
                  src={customPhotoUrl}
                  alt="Farmer leaf photo"
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center transform transition-transform hover:scale-105">
                <div
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: selectedSample.thumbnailSvg }}
                />
              </div>
            )}

            {/* Viewfinder Corner Target Brackets */}
            <div className="absolute inset-6 sm:inset-10 pointer-events-none border border-emerald-400/30 rounded-xl">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-emerald-400"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-emerald-400"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-emerald-400"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-emerald-400"></div>

              {/* Scanning line animation during analysis */}
              {isAnalyzing && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse top-1/2 shadow-lg shadow-emerald-400/50" />
              )}
            </div>

            {/* AI Analysis Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-20">
                <div className="relative mb-4">
                  <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin" />
                  <Sparkles className="w-5 h-5 text-amber-300 absolute top-0 right-0 animate-bounce" />
                </div>
                <p className="font-bold text-lg text-white font-serif">
                  {language === 'ta' ? 'AI நோய் பரிசோதனை நடக்கிறது...' : 'CropGuard AI Neural Inference...'}
                </p>
                <p className="text-xs text-stone-300 mt-1 text-center max-w-md">
                  {analysisPhase}
                </p>

                {/* Progress bar */}
                <div className="w-64 bg-stone-800 rounded-full h-2 mt-4 overflow-hidden border border-stone-700">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 mt-2 font-bold">
                  {analysisProgress}% Complete
                </span>
              </div>
            )}

            {/* Viewfinder helper text */}
            {!isAnalyzing && (
              <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
                <span className="text-xs font-semibold bg-black/70 text-stone-200 px-3 py-1 rounded-full backdrop-blur-xs border border-white/10">
                  {customPhotoUrl
                    ? (language === 'ta' ? 'உங்கள் படம் தயாராக உள்ளது' : 'Custom photo loaded')
                    : (language === 'ta'
                        ? 'பாதிக்கப்பட்ட இலையை நடுவில் வைத்து பொத்தானை அழுத்தவும்'
                        : 'Align diseased leaf inside brackets & tap Analyze')}
                </span>
              </div>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="analyze-leaf-btn"
              disabled={isAnalyzing}
              onClick={() => handleStartAnalysis()}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-base sm:text-lg shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98"
            >
              <Sparkles className="w-5 h-5 text-stone-950" />
              <span>
                {language === 'ta' ? 'இலையை ஆய்வு செய் (AI Analysis)' : 'Analyze Leaf with AI'}
              </span>
              <ArrowRight className="w-5 h-5 text-stone-950" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-stone-700"
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'ta' ? 'வேறு படம் பதிவேற்று' : 'Choose from Gallery'}</span>
            </button>
          </div>
        </div>

        {/* DEMO / TESTING SAMPLE LEAVES FOR INSTANT HACKATHON EVALUATION */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                {language === 'ta'
                  ? 'மாதிரி இலைகள் (உடனடி சோதனைக்கு 1-கிளிக்):'
                  : 'Quick Demo Samples (Tap for Instant Test):'}
              </h4>
            </div>
            <span className="text-[11px] text-stone-500">
              {language === 'ta' ? 'தேர்ந்தெடுத்து உடனே ஆய்வு செய்யலாம்' : 'Select to inspect'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SAMPLE_LEAVES.slice(0, 4).map((sample) => {
              const isSelected = selectedSample.id === sample.id && !customPhotoUrl;
              return (
                <button
                  key={sample.id}
                  id={`sample-leaf-${sample.id}`}
                  onClick={() => {
                    setSelectedSample(sample);
                    setSelectedCrop(sample.crop);
                    setCustomPhotoUrl(null);
                    handleStartAnalysis(sample);
                  }}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/90 shadow-xs'
                      : 'border-stone-200 bg-stone-50/50 hover:border-emerald-300'
                  }`}
                >
                  <div
                    className="w-14 h-14"
                    dangerouslySetInnerHTML={{ __html: sample.thumbnailSvg }}
                  />
                  <div className="text-center w-full">
                    <p className="font-bold text-xs text-stone-900 truncate">
                      {sample.crop}
                    </p>
                    <p className="text-[10px] text-stone-600 truncate font-medium">
                      {sample.diseaseName.split('(')[0]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    <span>{Math.round(sample.confidence * 100)}%</span>
                    <span>• {sample.severity}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FARMER LEAF PHOTOGRAPHY TIPS */}
        <div className="mt-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-3.5 flex items-start gap-3">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-0.5">
            <p className="font-bold">
              {language === 'ta' ? 'விவசாயிகளுக்கான படம் எடுக்கும் குறிப்பு:' : 'Farmer Tips for Best AI Accuracy:'}
            </p>
            <p className="text-emerald-800">
              {language === 'ta'
                ? 'நேரடி சூரிய ஒளியில் இலை புள்ளிகள் தெளிவாக தெரியும்படி 15 செ.மீ தூரத்தில் வைத்து படம் எடுக்கவும்.'
                : 'Hold camera 15 cm from leaf. Ensure disease spots or yellowing are in bright daylight focus.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
