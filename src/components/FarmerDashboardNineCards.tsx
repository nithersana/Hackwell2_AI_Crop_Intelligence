import React, { useState } from 'react';
import { 
  Camera, 
  Bug, 
  CloudRain, 
  Droplets, 
  ShieldAlert, 
  Activity, 
  Bell, 
  Volume2, 
  VolumeX,
  Languages, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Share2, 
  ChevronRight, 
  Calendar, 
  Info, 
  Sprout, 
  Mic, 
  RotateCcw,
  Check,
  Send,
  Leaf
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { speakText, stopSpeech } from '../utils/audioSpeech';
import { FarmerUser } from '../types';

interface FarmerDashboardNineCardsProps {
  language: Language;
  onNavigate: (screen: any) => void;
  onSetLanguage: (lang: Language) => void;
  currentUser?: FarmerUser | null;
}

export const FarmerDashboardNineCards: React.FC<FarmerDashboardNineCardsProps> = ({
  language,
  onNavigate,
  onSetLanguage,
  currentUser,
}) => {
  const t = TRANSLATIONS[language];

  // Active sub-tab for Card 1 (AI Disease Detection tabs: Symptoms, Causes, Prevention, Action)
  const [diseaseTab, setDiseaseTab] = useState<'symptoms' | 'causes' | 'prevention' | 'action'>('symptoms');
  
  // Audio state
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  
  // Voice assistant question state
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(0);
  const [voiceInput, setVoiceInput] = useState('');
  const [isCopiedAlert, setIsCopiedAlert] = useState(false);
  const [smartIrrigationApplied, setSmartIrrigationApplied] = useState(false);

  // Helper for voice readout
  const handleSpeak = (text: string) => {
    stopSpeech();
    setIsPlayingVoice(true);
    speakText(text, language);
    setTimeout(() => setIsPlayingVoice(false), 5000);
  };

  const handleStopAudio = () => {
    stopSpeech();
    setIsPlayingVoice(false);
  };

  // Voice Assistant questions in current language
  const voiceQuestions = [
    {
      qEn: 'How to prevent tomato leaf blight organically?',
      qTa: 'தக்காளி இலைக்கருகல் நோயை இயற்கை முறையில் தடுப்பது எப்படி?',
      qHi: 'टमाटर के अगेती झुलसा रोग की जैविक रोकथाम कैसे करें?',
      aEn: 'Spray 5% Neem Seed Kernel Extract (NSKE) or apply Trichoderma viride bio-fungicide (2.5 kg/ha). Ensure 4-hour morning leaf dryness and prune lower 15cm leaves.',
      aTa: '5% வேப்பங்கொட்டை சாறு அல்லது டிரைக்கோடெர்மா விரிடி (ஹெக்டேருக்கு 2.5 கிலோ) இயற்கை பூஞ்சாணக்கொல்லி தெளிக்கவும். செடியின் கீழ் 15 செ.மீ இலைகளை அகற்றி காற்றோட்டம் தரவும்.',
      aHi: '5% नीम के बीज का अर्क (NSKE) या ट्राइकोडर्मा विरिडी जैव कवकनाशी (2.5 किग्रा/हेक्टेयर) छिड़कें। निचली पत्तियों की छंटाई करें।'
    },
    {
      qEn: 'How much Neem Oil for a 16-liter sprayer tank?',
      qTa: '16 லிட்டர் தெளிப்பான் டேங்கிற்கு எவ்வளவு வேப்ப எண்ணெய் கலக்க வேண்டும்?',
      qHi: '16 लीटर स्प्रेयर टैंक के लिए कितना नीम तेल चाहिए?',
      aEn: 'Mix 80 ml of 10,000 PPM Neem Oil with 16 ml liquid soap emulsifier in 16 liters of clean water. Spray early morning before 9:00 AM.',
      aTa: '16 லிட்டர் நல்ல தண்ணீரில் 80 மி.லி வேப்ப எண்ணெய் மற்றும் 16 மி.லி காதி சோப் கரைசலை நன்கு கலக்கவும். காலை 9 மணிக்குள் தெளிக்கவும்.',
      aHi: '16 लीटर पानी में 80 मिलीलीटर नीम का तेल और 16 मिलीलीटर लिक्विड साबुन घोलें। सुबह 9 बजे से पहले छिड़काव करें।'
    },
    {
      qEn: 'Should I spray fungicide before expected rainfall?',
      qTa: 'மழை பெய்வதற்கு முன் பூஞ்சைக்கொல்லி தெளிக்கலாமா?',
      qHi: 'क्या बारिश से पहले कवकनाशी का छिड़काव करना चाहिए?',
      aEn: 'Yes! Preventive copper oxychloride or bio-shield should be sprayed at least 3 hours before rainfall with a sticker agent to prevent spore germination.',
      aTa: 'ஆம்! மழைக்கு குறைந்தது 3 மணி நேரத்திற்கு முன் ஒட்டும் திரவத்துடன் காப்பர் ஆக்ஸிகுளோரைடு அல்லது உயிரியல் தடுப்பு மருந்து தெளிப்பது பூஞ்சை வித்துக்களை முளையவிடாமல் தடுக்கும்.',
      aHi: 'हाँ! बारिश से कम से कम 3 घंटे पहले चिपकने वाले पदार्थ (Sticker) के साथ कॉपर ऑक्सीक्लोराइड का छिड़काव करें।'
    }
  ];

  return (
    <div id="dash-9-cards-container" className="space-y-6">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            🌿
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 font-serif tracking-tight">
              {language === 'ta' 
                ? 'விவசாயி நுண்ணறிவு அட்டைகள் (9 வழிகாட்டல்கள்)' 
                : language === 'hi'
                ? 'किसान बुद्धिमत्ता कार्ड (9 मुख्य मॉड्यूल)'
                : 'Adaptive Crop Intelligence Cards (9 Modules)'}
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              {language === 'ta' 
                ? 'Hackwell 2.0 முன் எச்சரிக்கை மற்றும் பயிர் பாதுகாப்பு வழிகாட்டல்' 
                : language === 'hi'
                ? 'शीघ्र कीट एवं रोग रोकथाम प्रणाली'
                : 'Early Pest & Disease Prevention Sentinel'}
            </p>
          </div>
        </div>

        {/* Listen Voice Summary of 9 Cards */}
        <button
          type="button"
          onClick={() => {
            if (isPlayingVoice) {
              handleStopAudio();
            } else {
              const text = language === 'ta'
                ? `வணக்கம். உங்கள் தக்காளி பயிரில் இலைக்கருகல் நோய் ஆபத்து 74 சதவீதம். மழைக்கு முன் பாதுகாப்பு தெளிப்பு எடுக்கவும். சொட்டுநீர் பாசனத்தை 24 மணி நேரம் தாமதிக்கவும்.`
                : language === 'hi'
                ? `नमस्ते। आपकी टमाटर की फसल में अगेती झुलसा का खतरा 74 प्रतिशत है। बारिश से पहले जैविक छिड़काव करें और सिंचाई 24 घंटे टालें।`
                : `Welcome. High disease risk of 74 percent detected for Tomato Early Blight. Apply preventive bio-shield before incoming rain and pause drip irrigation.`;
              handleSpeak(text);
            }
          }}
          className={`py-2 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
            isPlayingVoice
              ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          {isPlayingVoice ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isPlayingVoice ? (language === 'ta' ? 'நிறுத்து' : 'Stop Audio') : (language === 'ta' ? 'குரல் வழிகாட்டல்' : 'Listen Voice')}</span>
        </button>
      </div>

      {/* 9 CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* =========================================================================
            CARD 1: 📷 AI Disease Detection
            ========================================================================= */}
        <div 
          id="card-ai-disease-detection"
          className="bg-white rounded-3xl border-2 border-emerald-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 text-xl font-bold">
                  📷
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Card 1
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-base font-serif">
                    {t.farmerDashboard.aiDiseaseDetection}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                94% Match
              </span>
            </div>

            {/* Active Detected Disease Notice */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-950">
                  {language === 'ta' ? 'தக்காளி இலைக்கருகல் நோய்' : language === 'hi' ? 'टमाटर अगेती झुलसा' : 'Tomato Early Blight'}
                </span>
                <span className="text-[10px] text-stone-500 font-mono italic">
                  Alternaria solani
                </span>
              </div>
              <p className="text-[11px] text-stone-600 line-clamp-2">
                {language === 'ta' 
                  ? 'கீழ் இலைகளில் பழுப்பு நிற வட்ட வடிவ வளைய புள்ளிகள் காணப்படுகின்றன.'
                  : language === 'hi'
                  ? 'निचली पत्तियों पर संकेंद्रित छल्लों वाले भूरे धब्बे दिखाई देते हैं।'
                  : 'Dark brown concentric target-spot rings appearing on lower canopy foliage.'}
              </p>
            </div>

            {/* Sub-tabs: Symptoms, Causes, Prevention, Recommended Action */}
            <div>
              <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-xl mb-2 text-[10px] font-bold text-center">
                <button
                  type="button"
                  onClick={() => setDiseaseTab('symptoms')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    diseaseTab === 'symptoms' ? 'bg-white text-emerald-900 shadow-2xs font-black' : 'text-stone-600'
                  }`}
                >
                  {t.farmerDashboard.symptoms}
                </button>
                <button
                  type="button"
                  onClick={() => setDiseaseTab('causes')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    diseaseTab === 'causes' ? 'bg-white text-emerald-900 shadow-2xs font-black' : 'text-stone-600'
                  }`}
                >
                  {t.farmerDashboard.causes}
                </button>
                <button
                  type="button"
                  onClick={() => setDiseaseTab('prevention')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    diseaseTab === 'prevention' ? 'bg-white text-emerald-900 shadow-2xs font-black' : 'text-stone-600'
                  }`}
                >
                  {t.farmerDashboard.prevention}
                </button>
                <button
                  type="button"
                  onClick={() => setDiseaseTab('action')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    diseaseTab === 'action' ? 'bg-white text-emerald-900 shadow-2xs font-black' : 'text-stone-600'
                  }`}
                >
                  {t.farmerDashboard.recommendedAction}
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 min-h-[64px]">
                {diseaseTab === 'symptoms' && (
                  <p>
                    {language === 'ta'
                      ? 'கீழ் இலைகளில் சிறிய வட்ட வளைய புள்ளிகள் உருவாகி இலைகள் மஞ்சள் நிறமாகி உதிரும்.'
                      : language === 'hi'
                      ? 'पत्तियों पर संकेंद्रित छल्लों जैसे गहरे भूरे धब्बे बनते हैं और पत्तियां पीली पड़ जाती हैं।'
                      : 'Circular target-board rings with yellow chlorotic halos on bottom 15cm leaves.'}
                  </p>
                )}
                {diseaseTab === 'causes' && (
                  <p>
                    {language === 'ta'
                      ? 'அதிக ஈரப்பதம் (>85%) மற்றும் 24°-29°C வெப்பநிலையில் பூஞ்சை வித்துக்கள் வேகமாக பரவுகின்றன.'
                      : language === 'hi'
                      ? 'उच्च आर्द्रता (>85%) और 24-29°C तापमान में कवक बीजाणु तेजी से पनपते हैं।'
                      : 'Warm temperatures and prolonged canopy humidity >85% favor fungal spore sporulation.'}
                  </p>
                )}
                {diseaseTab === 'prevention' && (
                  <p>
                    {language === 'ta'
                      ? 'செடிகளுக்கிடையே போதிய இடைவெளி விட்டு, தெளிப்பான் பாசனத்தை தவிர்த்து சொட்டுநீர் பயன்படுத்தவும்.'
                      : language === 'hi'
                      ? 'उचित अंतर रखें, फव्वारा सिंचाई से बचें और ड्रिप सिंचाई का उपयोग करें।'
                      : 'Ensure 60cm row spacing, avoid overhead sprinkler wetting, and mulch soil bed.'}
                  </p>
                )}
                {diseaseTab === 'action' && (
                  <p className="font-semibold text-emerald-900">
                    {language === 'ta'
                      ? 'பாதிக்கப்பட்ட இலைகளை நீக்கிவிட்டு, 5% வேப்பங்கொட்டை கரைசல் அல்லது காப்பர் ஆக்ஸிகுளோரைடு தெளிக்கவும்.'
                      : language === 'hi'
                      ? 'संक्रमित पत्तियों को हटाएं और 5% नीम का अर्क या कॉपर ऑक्सीक्लोराइड का छिड़काव करें।'
                      : 'Prune infected lower foliage immediately and apply protective bio-copper shield.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('scan_crop')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{t.farmerDashboard.captureCropBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('detection_result')}
              className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
            >
              {language === 'ta' ? 'முழு ஆய்வு' : 'View Full'}
            </button>
          </div>
        </div>

        {/* =========================================================================
            CARD 2: 🐛 Pest Alerts
            ========================================================================= */}
        <div 
          id="card-pest-alerts"
          className="bg-white rounded-3xl border-2 border-amber-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900 text-xl font-bold">
                  🐛
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Card 2
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-base font-serif">
                    {t.farmerDashboard.pestAlerts}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                {t.farmerDashboard.highRiskBadge} (74%)
              </span>
            </div>

            {/* Affected Crops Alert List */}
            <div className="space-y-2">
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                  <span>🍅 {language === 'ta' ? 'தக்காளி காய் துளைப்பான்' : language === 'hi' ? 'फल छेदक कीट' : 'Fruit Borer (Helicoverpa)'}</span>
                  <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-mono">
                    High Risk
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  {language === 'ta' 
                    ? 'நிலம் 2 தக்காளியில் இளம் காய்களை சேதப்படுத்தும் அபாயம் உள்ளது.'
                    : language === 'hi'
                    ? 'प्लॉट 2 टमाटर में फल छेदक का खतरा अधिक है।'
                    : 'Risk of larvae boring into young developing fruit in Plot 2.'}
                </p>
              </div>

              <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span>☁️</span>
                  <div>
                    <div className="font-bold text-stone-900 text-[11px]">
                      {language === 'ta' ? 'பருத்தி வெள்ளை ஈக்கள்' : language === 'hi' ? 'कपास सफेद मक्खी' : 'Cotton Whitefly (Vector)'}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      {language === 'ta' ? 'நிலம் 3 • 48% மிதமான ஆபத்து' : 'Plot 3 • 48% Moderate'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Moderate
                </span>
              </div>
            </div>

            {/* Quick Recommendation */}
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {language === 'ta' 
                  ? 'ஏக்கருக்கு 5 இனக்கவர்ச்சி பொறிகளை உடனே பொருத்தவும்.'
                  : language === 'hi'
                  ? 'प्रति एकड़ 5 फेरोमोन ट्रैप तुरंत लगाएं।'
                  : 'Install 5 pheromone traps/acre + yellow sticky cards immediately.'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onNavigate('pest_detection')}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>{language === 'ta' ? 'அனைத்து பூச்சி எச்சரிக்கைகள்' : 'View Pest Scouting Radar'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            CARD 3: 🌦️ Weather & Crop Risk
            ========================================================================= */}
        <div 
          id="card-weather-crop-risk"
          className="bg-white rounded-3xl border-2 border-sky-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-sky-100 text-sky-900 text-xl font-bold">
                  🌦️
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    Card 3
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-base font-serif">
                    {t.farmerDashboard.weatherCropRisk}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900">
                Thanjavur Live
              </span>
            </div>

            {/* Weather Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-sky-50/70 border border-sky-200 rounded-2xl text-center">
              <div>
                <div className="text-[10px] font-bold text-stone-500 uppercase">{t.weather.temp}</div>
                <div className="text-lg font-black text-stone-900">28°C</div>
                <div className="text-[10px] text-stone-600">{language === 'ta' ? 'மிதமான' : 'Warm'}</div>
              </div>
              <div className="border-x border-sky-200">
                <div className="text-[10px] font-bold text-stone-500 uppercase">{t.weather.humidity}</div>
                <div className="text-lg font-black text-sky-900">88%</div>
                <div className="text-[10px] text-red-600 font-bold">{language === 'ta' ? 'அதிகம்' : 'High RH'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-stone-500 uppercase">{t.weather.rainfall}</div>
                <div className="text-lg font-black text-stone-900">12 mm</div>
                <div className="text-[10px] text-stone-600">{language === 'ta' ? 'மழை வரவு' : 'Incoming'}</div>
              </div>
            </div>

            {/* Impact Explanation */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs space-y-1">
              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'ta' ? 'பயிருக்கு வானிலை தாக்கம்:' : language === 'hi' ? 'फसल पर मौसम का प्रभाव:' : 'Weather Impact on Crop:'}</span>
              </div>
              <p className="text-stone-700 leading-relaxed text-[11px]">
                {language === 'ta' 
                  ? '88% அதிக ஈரப்பதமும் மேகமூட்டமும் பூஞ்சை நோய்களை 24-48 மணி நேரத்தில் விரைவுபடுத்தும். இலை ஈரத்தை குறைக்க கவனமாக இருக்கவும்.'
                  : language === 'hi'
                  ? '88% उच्च आर्द्रता और बादल छाए रहने से 24-48 घंटों में कवक रोग बढ़ सकते हैं।'
                  : 'High humidity (>85%) combined with leaf wetness creates the exact trigger for fungal spore germination within 24-48 hours.'}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onNavigate('weather')}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'முழு வானிலை ரேடார்' : 'View Weather Advisory'}</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            CARD 4: 💧 Smart Irrigation
            ========================================================================= */}
        <div 
          id="card-smart-irrigation"
          className="bg-white rounded-3xl border-2 border-teal-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-teal-100 text-teal-900 text-xl font-bold">
                  💧
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-900 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    Card 4
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-base font-serif">
                    {t.farmerDashboard.smartIrrigation}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900">
                Soil: 76% Moist
              </span>
            </div>

            {/* Recommendation Box */}
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-teal-950">
                  {language === 'ta' ? 'சொட்டுநீர் பாசனத்தை 35% குறைக்கவும்' : language === 'hi' ? 'ड्रिप सिंचाई 35% कम करें' : 'Reduce Drip Flow by 35%'}
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                  {language === 'ta' ? 'தாமதிக்கவும்' : 'Pause 24h'}
                </span>
              </div>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {language === 'ta'
                  ? 'மண் ஈரப்பதம் அதிகமாக உள்ளதாலும், நாளை மழை வரவுள்ளதாலும் பாசனத்தை 24 மணி நேரம் தாமதித்து வேரழுகல் நோயைத் தடுக்கவும்.'
                  : language === 'hi'
                  ? 'मिट्टी में पर्याप्त नमी और कल बारिश के पूर्वानुमान के कारण सिंचाई 24 घंटे टालें।'
                  : 'Soil moisture is at field capacity and rain is incoming. Delaying irrigation prevents root waterlogging and damping off.'}
              </p>
            </div>

            {/* Irrigation Schedule Details */}
            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs flex justify-between items-center">
              <div>
                <div className="text-[10px] text-stone-500 font-bold">{language === 'ta' ? 'அடுத்த பாசன நேரம்' : 'Next Cycle'}</div>
                <div className="font-bold text-stone-900">{language === 'ta' ? 'வியாழன் காலை 06:00' : 'Thu 06:00 AM'}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-stone-500 font-bold">{language === 'ta' ? 'பரிந்துரைக்கப்படும் கால அளவு' : 'Duration'}</div>
                <div className="font-bold text-teal-800">{language === 'ta' ? '45 நிமிடங்கள்' : '45 Minutes'}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setSmartIrrigationApplied(!smartIrrigationApplied)}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                smartIrrigationApplied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {smartIrrigationApplied
                  ? (language === 'ta' ? 'பாசன அட்டவணை உறுதி செய்யப்பட்டது' : 'Smart Schedule Applied')
                  : (language === 'ta' ? 'பாசனத்தை தற்காலிகமாக தாமதிக்க' : 'Apply Smart Water Saver')}
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            CARD 5: 💊 Treatment & Prevention (Distinct Sections!)
            ========================================================================= */}
        <div 
          id="card-treatment-prevention"
          className="bg-white rounded-3xl border-2 border-emerald-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 text-xl font-bold">
                  💊
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Card 5
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-base font-serif">
                    {t.farmerDashboard.treatmentPrevention}
                  </h3>
                </div>
              </div>

              <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                2-Phase Care
              </span>
            </div>

            {/* DISTINCT SECTION A: PREVENTIVE MEASURES */}
            <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950 uppercase tracking-wide">
                <span>🛡️</span>
                <span>{t.farmerDashboard.preventiveMeasures}</span>
              </div>
              <ul className="text-[11px] text-emerald-950 space-y-1 list-disc list-inside">
                <li>{language === 'ta' ? '5% வேப்பங்கொட்டை சாறு (NSKE) 10 நாட்களுக்கு ஒருமுறை தெளிக்கவும்.' : 'Spray 5% Neem Seed Kernel Extract (NSKE) every 10 days.'}</li>
                <li>{language === 'ta' ? 'மண்ணில் டிரைக்கோடெர்மா விரிடி (ஹெக். 2.5 கிலோ) இடவும்.' : 'Apply Trichoderma viride bio-fungicide (2.5 kg/ha) to soil.'}</li>
              </ul>
            </div>

            {/* DISTINCT SECTION B: TREATMENT RECOMMENDATIONS */}
            <div className="p-3 bg-rose-50/90 border border-rose-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-950 uppercase tracking-wide">
                <span>💊</span>
                <span>{t.farmerDashboard.treatmentRecommendations}</span>
              </div>
              <ul className="text-[11px] text-rose-950 space-y-1 list-disc list-inside">
                <li>{language === 'ta' ? 'காப்பர் ஆக்ஸிகுளோரைடு 50 WP (ஒரு லிட்டருக்கு 2.5 கிராம்) தெளிக்கவும்.' : 'Copper Oxychloride 50 WP (2.5g per Liter water).'}</li>
                <li>{language === 'ta' ? 'காலை 07:00 - 09:30 மணிக்குள் இலைகளின் அடிப்பகுதியில் நன்கு படும்படி தெளிக்கவும்.' : 'Direct spray to undersides of leaves during 07:00 - 09:30 AM.'}</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onNavigate('recommendations')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>{language === 'ta' ? 'முழு பரிந்துரை கையேடு' : 'View Full Advisory'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            CARD 6: 📊 Crop Health
            ========================================================================= */}
        <div 
          id="card-crop-health"
          className="bg-white rounded-3xl border-2 border-emerald-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 text-xl font-bold">
                  📊
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Card 6
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-base font-serif">
                    {t.farmerDashboard.cropHealth}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                {t.farmerDashboard.goodStanding}
              </span>
            </div>

            {/* Health Score Gauge */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-600">
                  {t.farmerDashboard.currentHealthScore}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-800 font-serif">84</span>
                  <span className="text-xs text-stone-400">/ 100</span>
                </div>
              </div>
              <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full w-[84%]"></div>
              </div>
            </div>

            {/* Previous Disease Detections Timeline */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
                {t.farmerDashboard.previousDetections}
              </span>
              <div className="space-y-1 text-xs">
                <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                  <span className="font-medium text-emerald-950">
                    {language === 'ta' ? 'இன்று: ஆரம்ப இலைக்கருகல் (கட்டுக்குள்)' : 'Today: Early Blight (Controlled)'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">Day 10 (84%)</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                  <span className="font-medium text-amber-950">
                    {language === 'ta' ? '4 நாள் முன்: லேசான இலைச்சுருள்' : '4d Ago: Mild Leaf Curl'}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700">Day 6 (72%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onNavigate('timeline')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>{language === 'ta' ? 'முழு காலவரிசை ஆய்வு' : 'View Health Timeline'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            CARD 7: 🔔 Early Warning
            ========================================================================= */}
        <div 
          id="card-early-warning"
          className="bg-white rounded-3xl border-2 border-red-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-red-100 text-red-900 text-xl font-bold">
                  🔔
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-900 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    Card 7
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-base font-serif">
                    {t.farmerDashboard.earlyWarningCard}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                Active Sentinel
              </span>
            </div>

            {/* Predictive Warning Banner */}
            <div className="p-3 bg-red-50/90 border border-red-200 rounded-2xl space-y-1">
              <div className="text-xs font-bold text-red-900">
                “{language === 'ta' 
                  ? '36 மணி நேரத்தில் பூஞ்சை வித்துக்கள் பெருக்கம் கணிப்பு' 
                  : 'Fungal Spore Outbreak Predicted in 36 Hours'}”
              </div>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {language === 'ta'
                  ? 'வெளிப்படையான அறிகுறிகள் தோன்றும் முன்னரே AI சென்சார்கள் பூஞ்சை ஆபத்தை கண்டறிந்துள்ளன. இன்றே பாதுகாப்பு தெளிப்பு எடுக்கவும்.'
                  : 'Predictive models warn of spore spread 24-48h before visible leaf lesion necrosis appears.'}
              </p>
            </div>

            {/* Action dispatch status */}
            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div className="flex justify-between">
                <span>{language === 'ta' ? 'அறிவிப்பு நிலை:' : 'Alert Status:'}</span>
                <span className="font-bold text-emerald-700">{language === 'ta' ? 'SMS அனுப்பப்பட்டது (9876543210)' : 'SMS Dispatched'}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ta' ? 'பாதிக்கப்பட்ட பயிர்:' : 'Target Crop:'}</span>
                <span className="font-bold text-stone-900">Tomato (Plot 2)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('alerts')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'எச்சரிக்கை விவரம்' : 'View Warning'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const text = language === 'ta'
                  ? '🚨 CropGuard AI எச்சரிக்கை: திருவையாறு தக்காளி பயிரில் 36 மணி நேரத்தில் இலைக்கருகல் நோய் பரவும் ஆபத்து உள்ளது. உடனடி பாதுகாப்பு பூஞ்சாண தடுப்பு தெளிக்கவும்.'
                  : '🚨 CropGuard AI Warning: Tomato early blight risk high in next 36h. Preventive spray recommended.';
                navigator.clipboard?.writeText(text);
                setIsCopiedAlert(true);
                setTimeout(() => setIsCopiedAlert(false), 2500);
              }}
              className="py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Share via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopiedAlert ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            CARD 8: 🗣️ AI Voice Assistant
            ========================================================================= */}
        <div 
          id="card-ai-voice-assistant"
          className="bg-white rounded-3xl border-2 border-emerald-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 text-xl font-bold">
                  🗣️
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Card 8
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-base font-serif">
                    {t.farmerDashboard.aiVoiceAssistant}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 flex items-center gap-1">
                <Mic className="w-3 h-3 text-emerald-700" />
                <span>Voice Ready</span>
              </span>
            </div>

            {/* Quick Voice Questions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-600">
                {language === 'ta' ? 'கேள்வி தொட்டு குரலில் கேட்கவும்:' : 'Tap sample question to hear answer:'}
              </span>
              <div className="space-y-1.5">
                {voiceQuestions.map((vq, idx) => {
                  const qText = language === 'ta' ? vq.qTa : language === 'hi' ? vq.qHi : vq.qEn;
                  const aText = language === 'ta' ? vq.aTa : language === 'hi' ? vq.aHi : vq.aEn;
                  const isSelected = selectedQuestion === idx;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedQuestion(idx);
                        handleSpeak(aText);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950 shadow-2xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="truncate">{qText}</span>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spoken Answer Preview */}
            {selectedQuestion !== null && (
              <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-[11px] text-emerald-950 leading-relaxed font-medium">
                {language === 'ta' 
                  ? voiceQuestions[selectedQuestion].aTa 
                  : language === 'hi'
                  ? voiceQuestions[selectedQuestion].aHi
                  : voiceQuestions[selectedQuestion].aEn}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onNavigate('assistant')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'முழு AI உதவியாளருடன் பேச' : 'Open Full Voice Chat'}</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            CARD 9: 🌐 Language Selection
            ========================================================================= */}
        <div 
          id="card-language-selection"
          className="bg-white rounded-3xl border-2 border-emerald-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 text-xl font-bold">
                  🌐
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Card 9
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-base font-serif">
                    {t.farmerDashboard.languageSelection}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 uppercase">
                {language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिन्दी' : 'English'}
              </span>
            </div>

            <p className="text-xs text-stone-600">
              {language === 'ta'
                ? 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும். அனைத்து தகவல்களும் உடனுக்குடன் மாறும்.'
                : language === 'hi'
                ? 'अपनी पसंदीदा भाषा चुनें। पूरी प्रणाली तुरंत अपडेट हो जाएगी।'
                : 'Select your preferred language. All dashboard terms and audio guidance update instantly.'}
            </p>

            {/* 3 Farmer Language Buttons */}
            <div className="space-y-2">
              {/* Tamil */}
              <button
                type="button"
                onClick={() => {
                  onSetLanguage('ta');
                  handleSpeak('தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது.');
                }}
                className={`w-full py-3 px-3.5 rounded-2xl border-2 font-bold text-sm flex items-center justify-between transition-all cursor-pointer ${
                  language === 'ta'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌾</span>
                  <div className="text-left">
                    <div>தமிழ் (Tamil)</div>
                    <div className="text-[10px] opacity-85 font-normal">Primary Farmer Language</div>
                  </div>
                </div>
                {language === 'ta' && <CheckCircle2 className="w-5 h-5" />}
              </button>

              {/* English */}
              <button
                type="button"
                onClick={() => {
                  onSetLanguage('en');
                  handleSpeak('English language selected.');
                }}
                className={`w-full py-3 px-3.5 rounded-2xl border-2 font-bold text-sm flex items-center justify-between transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌐</span>
                  <div className="text-left">
                    <div>English</div>
                    <div className="text-[10px] opacity-85 font-normal">Standard / Agricultural Terms</div>
                  </div>
                </div>
                {language === 'en' && <CheckCircle2 className="w-5 h-5" />}
              </button>

              {/* Hindi */}
              <button
                type="button"
                onClick={() => {
                  onSetLanguage('hi');
                  handleSpeak('हिन्दी भाषा चुनी गई है।');
                }}
                className={`w-full py-3 px-3.5 rounded-2xl border-2 font-bold text-sm flex items-center justify-between transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇮🇳</span>
                  <div className="text-left">
                    <div>हिन्दी (Hindi)</div>
                    <div className="text-[10px] opacity-85 font-normal">किसान सहायक भाषा</div>
                  </div>
                </div>
                {language === 'hi' && <CheckCircle2 className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onNavigate('language')}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-stone-600" />
              <span>{language === 'ta' ? 'அனைத்து மொழி அமைப்புகள்' : 'More Language Settings'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
