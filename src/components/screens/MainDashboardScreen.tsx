import React, { useState } from 'react';
import { 
  Sprout, 
  Activity, 
  Bug, 
  CloudRain, 
  Camera, 
  AlertTriangle, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  Droplets,
  Wind,
  Thermometer,
  ShieldAlert,
  MapPin,
  Bell,
  CheckCircle2,
  Calendar,
  Share2,
  X,
  Clock,
  ArrowRight,
  Info,
  Layers,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  Languages
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { FarmPlot, EarlyAlert } from '../../data/cropGuardData';
import { speakText } from '../../utils/audioSpeech';
import { FarmerUser } from '../../types';
import { FarmerDashboardNineCards } from '../FarmerDashboardNineCards';

interface MainDashboardScreenProps {
  language: Language;
  plots: FarmPlot[];
  alerts: EarlyAlert[];
  onNavigate: (screen: any) => void;
  onSetLanguage?: (lang: Language) => void;
  currentUser?: FarmerUser | null;
  onLogout?: () => void;
}

export const MainDashboardScreen: React.FC<MainDashboardScreenProps> = ({
  language,
  plots,
  alerts,
  onNavigate,
  onSetLanguage,
  currentUser,
  onLogout,
}) => {
  const t = TRANSLATIONS[language];

  // State for hackathon demo interactions
  const [selectedPlotId, setSelectedPlotId] = useState<string>('all');
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copiedAlert, setCopiedAlert] = useState<boolean>(false);

  // Dynamic values depending on selected plot (Hackathon demo magic!)
  const plotData = {
    all: {
      healthScore: 84,
      healthStatusEn: 'Good Standing',
      healthStatusTa: 'நல்ல ஆரோக்கியம்',
      healthTrend: '+3.2%',
      diseaseRisk: 38,
      diseaseRiskLabelEn: 'Moderate Risk',
      diseaseRiskLabelTa: 'நடுத்தர ஆபத்து',
      diseaseDetailEn: 'Tomato Early Blight Spore Watch',
      diseaseDetailTa: 'தக்காளி இலைக்கருகல் அவதானிப்பு',
      pestRisk: 18,
      pestRiskLabelEn: 'Low / Safe',
      pestRiskLabelTa: 'குறைந்த ஆபத்து',
      pestDetailEn: 'Pheromone Trap Count Normal',
      pestDetailTa: 'பொறிகளில் சாதாரண எண்ணிக்கை',
      weatherRisk: 72,
      weatherRiskLabelEn: 'High Fungal Risk',
      weatherRiskLabelTa: 'அதிக பூஞ்சை ஆபத்து',
      weatherDetailEn: '88% RH • 8.5h Canopy Leaf Wetness',
      weatherDetailTa: '88% ஈரப்பதம் • 8.5 மணி பனிப்பொழிவு',
      temperature: 29,
      humidity: 88,
      rainProbability: 65,
      weatherRiskTextEn: 'High humidity (88%) and rainfall may increase fungal disease risk. Spore germination probability is 72% in current microclimate.',
      weatherRiskTextTa: 'அதிக ஈரப்பதம் (88%) மற்றும் மழையால் பூஞ்சை நோய் பரவும் ஆபத்து அதிகம் உள்ளது. தற்போதைய சூழ்நிலையில் பூஞ்சை வித்துக்கள் பரவும் வாய்ப்பு 72%.',
      recentScan: {
        cropName: 'Tomato (PKM-1)',
        cropNameTa: 'தக்காளி (PKM-1)',
        diseaseDetected: 'Early Blight (Alternaria solani)',
        diseaseDetectedTa: 'ஆரம்ப இலைக்கருகல் (Alternaria solani)',
        confidence: 94.8,
        severity: 'Moderate (24.5% Leaf Area)',
        severityTa: 'நடுத்தரம் (24.5% இலை பகுதி)',
        date: 'Today, Sep 15, 2026 • 08:30 AM',
        dateTa: 'இன்று, செப் 15, 2026 • மு.ப 08:30',
        field: 'Plot 2 • South Borewell Field',
        fieldTa: 'நிலம் 2 • தெற்கு ஆழ்துளை கிணற்று தோட்டம்'
      },
      recommendedAction: {
        titleEn: 'Apply Protective Bio-Shield Spray',
        titleTa: 'பாதுகாப்பு இயற்கை இலைத்தெளிப்பு',
        textEn: 'Spray Trichoderma viride (organic bio-shield) or Mancozeb 75% WP (2g/L) before 4:00 PM today. Reduce drip irrigation by 30% to prevent root zone moisture saturation.',
        textTa: 'இன்று மாலை 4:00 மணிக்குள் டிரைக்கோடெர்மா விரிடி (இயற்கை பூஞ்சைக்கொல்லி) அல்லது மேன்கோசெப் 75% WP (2 கிராம்/லிட்டர்) தெளிக்கவும். வேர் ஈரப்பதம் தேங்குவதை தவிர்க்க சொட்டுநீர் பாசனத்தை 30% குறைக்கவும்.'
      }
    },
    'plot-1': {
      healthScore: 92,
      healthStatusEn: 'Excellent Condition',
      healthStatusTa: 'சிறந்த நிலை',
      healthTrend: '+4.5%',
      diseaseRisk: 14,
      diseaseRiskLabelEn: 'Low Risk',
      diseaseRiskLabelTa: 'குறைந்த ஆபத்து',
      diseaseDetailEn: 'Rice Blast Spore Incubation Safe',
      diseaseDetailTa: 'நெல் குலைநோய் வித்துக்கள் இல்லை',
      pestRisk: 12,
      pestRiskLabelEn: 'Safe / Normal',
      pestRiskLabelTa: 'பாதுகாப்பானது',
      pestDetailEn: 'Stem Borer Count Below ETL',
      pestDetailTa: 'தண்டு துளைப்பான் அளவு குறைவு',
      weatherRisk: 48,
      weatherRiskLabelEn: 'Moderate Risk',
      weatherRiskLabelTa: 'நடுத்தர ஆபத்து',
      weatherDetailEn: 'Canopy well ventilated by 14 km/h breeze',
      weatherDetailTa: '14 கி.மீ காற்றில் போதுமான காற்றோட்டம்',
      temperature: 28,
      humidity: 78,
      rainProbability: 55,
      weatherRiskTextEn: 'Moderate humidity and intermittent rain showers. Standing water depth in paddy field should be maintained at 3-5 cm.',
      weatherRiskTextTa: 'மிதமான ஈரப்பதம் மற்றும் தூறல் மழை. நெல் வயலில் தேங்கி நிற்கும் நீரின் ஆழம் 3-5 செ.மீ அளவில் பராமரிக்கப்பட வேண்டும்.',
      recentScan: {
        cropName: 'Paddy (CR-1009 Sub-1)',
        cropNameTa: 'நெல் (CR-1009 சப்-1)',
        diseaseDetected: 'Healthy Leaf - No Pathogen',
        diseaseDetectedTa: 'ஆரோக்கியமான இலை - நோய்த்தொற்று இல்லை',
        confidence: 97.4,
        severity: 'None (0% Lesion)',
        severityTa: 'இல்லை (0% பாதிப்பு)',
        date: 'Yesterday, Sep 14, 2026 • 04:15 PM',
        dateTa: 'நேற்று, செப் 14, 2026 • பி.ப 04:15',
        field: 'Plot 1 • North Canal Field',
        fieldTa: 'நிலம் 1 • வடக்கு கால்வாய் பாசனம்'
      },
      recommendedAction: {
        titleEn: 'Maintain Drain Channels & Bio-Potash Boost',
        titleTa: 'வடிகால் மற்றும் இயற்கை பொட்டாஷ் தெளிப்பு',
        textEn: 'Ensure drainage channels are clear before evening showers. Top-dress with Azospirillum bio-fertilizer next morning for root strength.',
        textTa: 'மழைக்கு முன் வயல் வடிகால் வாய்க்கால்களை தடையின்றி பராமரிக்கவும். வேர் வலுவடைய அசோஸ்பைரில்லம் உயிர் உரமிடுங்கள்.'
      }
    },
    'plot-2': {
      healthScore: 74,
      healthStatusEn: 'Requires Attention',
      healthStatusTa: 'கவனம் தேவைப்படுகிறது',
      healthTrend: '-3.8%',
      diseaseRisk: 68,
      diseaseRiskLabelEn: 'High Disease Risk',
      diseaseRiskLabelTa: 'அதிக நோய் ஆபத்து',
      diseaseDetailEn: 'Early Blight Foliar Necrosis Spreading',
      diseaseDetailTa: 'ஆரம்ப இலைக்கருகல் நோய் பரவுகிறது',
      pestRisk: 22,
      pestRiskLabelEn: 'Low-Moderate',
      pestRiskLabelTa: 'குறைந்த-நடுத்தரம்',
      pestDetailEn: 'Whitefly Traps: 4 per acre (Monitor)',
      pestDetailTa: 'வெள்ளை ஈ பொறிகள்: 4/ஏக்கர்',
      weatherRisk: 84,
      weatherRiskLabelEn: 'Severe Microclimate Risk',
      weatherRiskLabelTa: 'தீவிர வானிலை ஆபத்து',
      weatherDetailEn: '92% RH • Dense Canopy Condensation',
      weatherDetailTa: '92% ஈரப்பதம் • அடர்ந்த பனிநீர்',
      temperature: 29,
      humidity: 91,
      rainProbability: 75,
      weatherRiskTextEn: 'High humidity and rainfall may increase fungal disease risk rapidly. Immediate fungicide application window closes at 3:00 PM.',
      weatherRiskTextTa: 'அதிக ஈரப்பதம் மற்றும் மழையால் பூஞ்சை நோய் பரவும் ஆபத்து மிக அதிகம். மாலை 3:00 மணிக்குள் பூஞ்சைக்கொல்லி தெளிக்க வேண்டும்.',
      recentScan: {
        cropName: 'Tomato (PKM-1)',
        cropNameTa: 'தக்காளி (PKM-1)',
        diseaseDetected: 'Early Blight (Alternaria solani)',
        diseaseDetectedTa: 'ஆரம்ப இலைக்கருகல் (Alternaria solani)',
        confidence: 94.8,
        severity: 'Moderate (24.5% Leaf Area)',
        severityTa: 'நடுத்தரம் (24.5% இலை பகுதி)',
        date: 'Today, Sep 15, 2026 • 08:30 AM',
        dateTa: 'இன்று, செப் 15, 2026 • மு.ப 08:30',
        field: 'Plot 2 • South Borewell Field',
        fieldTa: 'நிலம் 2 • தெற்கு ஆழ்துளை கிணற்று தோட்டம்'
      },
      recommendedAction: {
        titleEn: 'Immediate Mancozeb or Bio-Shield Spray',
        titleTa: 'உடனடி மேன்கோசெப் அல்லது இயற்கை தெளிப்பு',
        textEn: 'Spray Mancozeb 75% WP @ 2g/litre or Trichoderma viride @ 5g/litre. Prune lower infected leaves and burn outside field to halt spore travel.',
        textTa: 'மேன்கோசெப் 75% WP @ 2 கிராம்/லிட்டர் அல்லது டிரைக்கோடெர்மா விரிடி @ 5 கிராம்/லிட்டர் தெளிக்கவும். கீழ் இலைகளை அகற்றி எரிக்கவும்.'
      }
    },
    'plot-3': {
      healthScore: 86,
      healthStatusEn: 'Good Standing',
      healthStatusTa: 'நல்ல ஆரோக்கியம்',
      healthTrend: '+1.5%',
      diseaseRisk: 26,
      diseaseRiskLabelEn: 'Low-Moderate',
      diseaseRiskLabelTa: 'குறைந்த-நடுத்தரம்',
      diseaseDetailEn: 'Bacterial Blight Risk Low',
      diseaseDetailTa: 'பாக்டீரியா கருகல் வாய்ப்பு குறைவு',
      pestRisk: 42,
      pestRiskLabelEn: 'Moderate Alert',
      pestRiskLabelTa: 'நடுத்தர எச்சரிக்கை',
      pestDetailEn: 'Whitefly Count: 9 / Yellow Sticky Card',
      pestDetailTa: 'மஞ்சள் பொறியில் 9 வெள்ளை ஈக்கள்',
      weatherRisk: 62,
      weatherRiskLabelEn: 'Moderate Risk',
      weatherRiskLabelTa: 'நடுத்தர ஆபத்து',
      weatherDetailEn: 'High morning mist and warm soil',
      weatherDetailTa: 'காலை மூடுபனி மற்றும் மிதமான வெப்பம்',
      temperature: 30,
      humidity: 82,
      rainProbability: 45,
      weatherRiskTextEn: 'Warm and humid conditions favor sucking pest multiplication. Monitor undersides of cotton leaves.',
      weatherRiskTextTa: 'மிதமான வெப்பமும் ஈரப்பதமும் சாறு உறிஞ்சும் பூச்சிகளை பெருக்கும். பருத்தி இலைகளின் அடிப்பகுதியை கண்காணிக்கவும்.',
      recentScan: {
        cropName: 'Cotton (Bt RCH-2)',
        cropNameTa: 'பருத்தி (Bt RCH-2)',
        diseaseDetected: 'Slight Whitefly Feeding Signs',
        diseaseDetectedTa: 'வெள்ளை ஈ தாக்குதல் ஆரம்ப அறிகுறிகள்',
        confidence: 89.2,
        severity: 'Mild (8.2% Infestation)',
        severityTa: 'லேசானது (8.2% தாக்கம்)',
        date: 'Sep 13, 2026 • 10:45 AM',
        dateTa: 'செப் 13, 2026 • மு.ப 10:45',
        field: 'Plot 3 • East Red Soil Field',
        fieldTa: 'நிலம் 3 • கிழக்கு செம்மண் நிலம்'
      },
      recommendedAction: {
        titleEn: 'Install Yellow Sticky Traps & Neem Spray',
        titleTa: 'மஞ்சள் பொறிகள் மற்றும் வேப்பெண்ணெய் தெளிப்பு',
        textEn: 'Install 10 yellow sticky traps per acre immediately. Spray 3% Neem Oil formulation (30ml/10L) to naturally deter whitefly egg-laying.',
        textTa: 'ஏக்கருக்கு 10 மஞ்சள் ஒட்டும் பொறிகளை உடனடியாக பொருத்தவும். வெள்ளை ஈக்கள் முட்டையிடுவதைத் தடுக்க 3% வேப்பெண்ணெய் கரைசல் தெளிக்கவும்.'
      }
    }
  };

  const current = plotData[selectedPlotId as keyof typeof plotData] || plotData.all;

  // Farmer identity details from login/registration
  const farmerName = currentUser?.fullName || (language === 'ta' ? 'அருணாசலம் முருகன்' : language === 'hi' ? 'अरुणाचलम मुरुगन' : 'Arunachalam Murugan');
  const farmerLocation = currentUser 
    ? `${currentUser.village}, ${currentUser.district}, ${currentUser.state}`
    : (language === 'ta' ? 'திருவையாறு, தஞ்சாவூர், தமிழ்நாடு' : 'Thiruvaiyaru, Thanjavur, Tamil Nadu');
  const farmerFarmSize = currentUser ? `${currentUser.farmSize} ${currentUser.farmSizeUnit}` : '4.5 Acres';
  const farmerCrop = currentUser?.mainCrop || (language === 'ta' ? 'தக்காளி (Tomato PKM-1)' : 'Tomato (PKM-1)');
  const farmerLanguageLabel = language === 'ta' ? 'தமிழ் (Tamil)' : language === 'hi' ? 'हिन्दी (Hindi)' : 'English';

  // Voice narration of dashboard
  const handleVoiceSummary = () => {
    if (language === 'ta') {
      const speech = `வணக்கம் விவசாயி ${farmerName} அவர்களே. பண்ணை இடம் ${farmerLocation}. பயிர் ${farmerCrop}. பயிர் ஆரோக்கிய குறியீடு ${current.healthScore}. நோய் ஆபத்து ${current.diseaseRisk} சதவீதம். பூச்சி ஆபத்து ${current.pestRisk} சதவீதம். வானிலை ஆபத்து ${current.weatherRisk} சதவீதம். முக்கிய எச்சரிக்கை: அதிக ஈரப்பதம் மற்றும் மழையால் பூஞ்சை நோய் பரவும் ஆபத்து அதிகம் உள்ளது. பரிந்துரை: இன்று மாலை 4 மணிக்குள் இயற்கை பூஞ்சைக்கொல்லி தெளிக்கவும்.`;
      speakText(speech, 'ta');
    } else if (language === 'hi') {
      const speech = `नमस्ते किसान ${farmerName} जी। आपका खेत ${farmerLocation} में है। वर्तमान फसल ${farmerCrop} है। फसल स्वास्थ्य स्कोर ${current.healthScore} है। रोग जोखिम ${current.diseaseRisk} प्रतिशत है। कीट जोखिम ${current.pestRisk} प्रतिशत है। महत्वपूर्ण चेतावनी: उच्च आर्द्रता के कारण कवक रोग का खतरा है। अनुशंसित कार्रवाई: आज शाम 4 बजे से पहले सुरक्षात्मक जैविक स्प्रे का छिड़काव करें।`;
      speakText(speech, 'hi');
    } else {
      const speech = `Hello Farmer ${farmerName}. Farm location is ${farmerLocation}. Current crop is ${farmerCrop}. Crop Health Score is ${current.healthScore} out of 100. Disease Risk is ${current.diseaseRisk} percent. Pest Risk is ${current.pestRisk} percent. Weather Risk is ${current.weatherRisk} percent. Important Alert: High humidity and rainfall may increase fungal disease risk. Recommended Action: Apply protective bio-shield spray before 4:00 PM today.`;
      speakText(speech, 'en');
    }
  };

  // Simulate refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  // Copy alert text
  const handleShareAlert = () => {
    const text = language === 'ta'
      ? `🚨 பயிர் பாதுகாப்பு எச்சரிக்கை (CropGuard AI): அதிக ஈரப்பதம் மற்றும் மழையால் பூஞ்சை நோய் பரவும் ஆபத்து அதிகம் உள்ளது! உடனடி பாதுகாப்பு பூஞ்சைக்கொல்லி தெளிக்கவும்.`
      : `🚨 CropGuard AI Warning: High humidity and rainfall may increase fungal disease risk! Immediate protective bio-shield recommended.`;
    navigator.clipboard?.writeText(text);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 2500);
  };

  return (
    <div id="screen-dashboard" className="space-y-6 max-w-6xl mx-auto px-4 py-4 sm:py-6">
      {/* =========================================================================
          1. HEADER SECTION (REQUIRED: Farmer name, Farm location, Notification icon)
          ========================================================================= */}
      <section 
        id="dash-header"
        className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-xs relative overflow-hidden"
      >
        {/* Decorative background leaf watermark */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-5 pointer-events-none text-emerald-800">
          <Sprout className="w-full h-full" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Farmer & Location Info */}
          <div className="flex items-start sm:items-center gap-3.5">
            {/* Farmer Avatar */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-700 to-green-900 text-white flex items-center justify-center font-serif text-2xl font-bold shadow-xs shrink-0 border-2 border-emerald-100">
              👨‍🌾
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {/* Farmer Welcome Heading */}
                <h1 id="dash-farmer-name" className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif tracking-tight">
                  {language === 'ta' ? `வணக்கம், ${farmerName} 👨‍🌾` : language === 'hi' ? `स्वागत है, ${farmerName} 👨‍🌾` : `Welcome, ${farmerName} 👨‍🌾`}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-200">
                  {language === 'ta' ? 'முன்னோடி உழவர்' : 'Lead Farmer'}
                </span>
              </div>

              {/* 4 Farmer Info Fields Required by User: Location, Farm size, Current crop, Preferred language */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-3 gap-y-1 text-xs text-stone-600 font-medium mt-1">
                <div id="dash-farm-location" className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">{farmerLocation}</span>
                </div>

                <div id="dash-farm-size" className="flex items-center gap-1">
                  <span className="text-emerald-700 font-bold">🌾</span>
                  <span>{farmerFarmSize}</span>
                </div>

                <div id="dash-current-crop" className="flex items-center gap-1">
                  <span className="text-emerald-700 font-bold">🌱</span>
                  <span className="font-semibold text-stone-900">{farmerCrop}</span>
                </div>

                <div id="dash-preferred-lang" className="flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{farmerLanguageLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar: Language Switch Button + Voice Guidance + Refresh + Notification Icon */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap sm:flex-nowrap">
            {/* Direct Language Switcher Button */}
            <button
              id="dash-language-toggle-btn"
              onClick={() => {
                if (onSetLanguage) {
                  onSetLanguage(language === 'ta' ? 'en' : language === 'en' ? 'hi' : 'ta');
                } else {
                  onNavigate('language');
                }
              }}
              className="py-2.5 px-3 rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Toggle Language (தமிழ் / English / हिन्दी)"
            >
              <Languages className="w-4 h-4 text-emerald-700" />
              <span className="font-serif">
                {language === 'ta' ? 'English' : language === 'en' ? 'हिन्दी' : 'தமிழ்'}
              </span>
            </button>

            {/* Audio Speech Readout Button */}
            <button
              id="dash-audio-speak-btn"
              onClick={handleVoiceSummary}
              className="py-2.5 px-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              title={language === 'ta' ? 'டாஷ்போர்டு குரல் சுருக்கம்' : 'Listen Voice Summary'}
            >
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span className="hidden sm:inline">
                {language === 'ta' ? 'குரல் வழிகாட்டல்' : 'Listen Summary'}
              </span>
              <span className="sm:hidden">
                {language === 'ta' ? 'குரல்' : 'Voice'}
              </span>
            </button>

            {/* IoT Telemetry Live Refresh */}
            <button
              id="dash-sync-btn"
              onClick={handleRefresh}
              className={`p-2.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-all cursor-pointer ${
                isRefreshing ? 'animate-spin text-emerald-700' : ''
              }`}
              title="Live Telemetry Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* NOTIFICATION ICON (REQUIRED) */}
            <button
              id="dash-notification-icon"
              onClick={() => setShowNotificationModal(true)}
              className="p-2.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 hover:text-red-600 transition-colors relative cursor-pointer"
              title="Notifications & Early Warnings"
            >
              <Bell className="w-5 h-5 text-stone-700" />
              {/* Notification counter badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-bounce">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Hackathon Interactive Plot Filter Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-1.5 shrink-0 text-stone-500 font-semibold text-[11px]">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'ta' ? 'பண்ணை நிலம் தேர்வு:' : 'Field Filter:'}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedPlotId('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedPlotId === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {language === 'ta' ? 'அனைத்து நிலங்கள் (3)' : 'All Fields (4.5 Ac)'}
            </button>
            <button
              onClick={() => setSelectedPlotId('plot-2')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedPlotId === 'plot-2'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              {language === 'ta' ? 'நிலம் 2: தக்காளி (எச்சரிக்கை)' : 'Plot 2: Tomato (Alert)'}
            </button>
            <button
              onClick={() => setSelectedPlotId('plot-1')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedPlotId === 'plot-1'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {language === 'ta' ? 'நிலம் 1: நெல் (92%)' : 'Plot 1: Paddy (92%)'}
            </button>
            <button
              onClick={() => setSelectedPlotId('plot-3')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedPlotId === 'plot-3'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {language === 'ta' ? 'நிலம் 3: பருத்தி (86%)' : 'Plot 3: Cotton (86%)'}
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 9 FARMER INTELLIGENCE DASHBOARD CARDS (USER MANDATED MODULES)
          ========================================================================= */}
      <FarmerDashboardNineCards
        language={language}
        onNavigate={onNavigate}
        onSetLanguage={onSetLanguage || (() => {})}
        currentUser={currentUser}
      />

      {/* =========================================================================
          2. MAIN CARDS (REQUIRED: Crop Health Score, Disease Risk, Pest Risk, Weather Risk)
          ========================================================================= */}
      <section id="dash-main-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: Crop Health Score */}
        <div 
          id="card-crop-health-score"
          onClick={() => onNavigate('timeline')}
          className="bg-white rounded-3xl border-2 border-emerald-200/80 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {language === 'ta' ? 'பயிர் ஆரோக்கிய குறியீடு' : 'Crop Health Score'}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sprout className="w-5 h-5 text-emerald-700" />
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-stone-900 font-serif">
              {current.healthScore}
            </span>
            <span className="text-stone-400 font-bold text-sm">/ 100</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ml-auto">
              {current.healthTrend}
            </span>
          </div>

          {/* Graphical Progress Bar */}
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mt-3">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                current.healthScore >= 80 ? 'bg-emerald-600' : current.healthScore >= 60 ? 'bg-amber-500' : 'bg-red-600'
              }`}
              style={{ width: `${current.healthScore}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 mt-3 pt-2 border-t border-stone-100">
            <span>{language === 'ta' ? current.healthStatusTa : current.healthStatusEn}</span>
            <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-emerald-700">
              {language === 'ta' ? 'விவரம்' : 'Timeline'} &rarr;
            </span>
          </div>
        </div>

        {/* CARD 2: Disease Risk */}
        <div 
          id="card-disease-risk"
          onClick={() => onNavigate('disease_risk')}
          className="bg-white rounded-3xl border-2 border-amber-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              {language === 'ta' ? 'நோய் ஆபத்து குறியீடு' : 'Disease Risk'}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5 text-amber-700" />
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-stone-900 font-serif">
              {current.diseaseRisk}%
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-auto ${
              current.diseaseRisk > 50 
                ? 'bg-red-100 text-red-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {language === 'ta' ? current.diseaseRiskLabelTa : current.diseaseRiskLabelEn}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mt-3">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                current.diseaseRisk > 50 ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${current.diseaseRisk}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-amber-950 mt-3 pt-2 border-t border-stone-100 truncate">
            <span className="truncate">{language === 'ta' ? current.diseaseDetailTa : current.diseaseDetailEn}</span>
            <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-amber-800 shrink-0 ml-1">
              {language === 'ta' ? 'முன்கணிப்பு' : 'Forecast'} &rarr;
            </span>
          </div>
        </div>

        {/* CARD 3: Pest Risk */}
        <div 
          id="card-pest-risk"
          onClick={() => onNavigate('pest_detection')}
          className="bg-white rounded-3xl border-2 border-emerald-200/80 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {language === 'ta' ? 'பூச்சி ஆபத்து குறியீடு' : 'Pest Risk'}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bug className="w-5 h-5 text-emerald-700" />
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-stone-900 font-serif">
              {current.pestRisk}%
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-auto ${
              current.pestRisk > 40 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {language === 'ta' ? current.pestRiskLabelTa : current.pestRiskLabelEn}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mt-3">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                current.pestRisk > 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${current.pestRisk}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mt-3 pt-2 border-t border-stone-100 truncate">
            <span className="truncate">{language === 'ta' ? current.pestDetailTa : current.pestDetailEn}</span>
            <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-emerald-800 shrink-0 ml-1">
              {language === 'ta' ? 'பூச்சிகள்' : 'Scouting'} &rarr;
            </span>
          </div>
        </div>

        {/* CARD 4: Weather Risk */}
        <div 
          id="card-weather-risk"
          onClick={() => onNavigate('weather')}
          className="bg-white rounded-3xl border-2 border-red-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800">
              {language === 'ta' ? 'வானிலை ஆபத்து குறியீடு' : 'Weather Risk'}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CloudRain className="w-5 h-5 text-red-700" />
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-red-950 font-serif">
              {current.weatherRisk}%
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-auto bg-red-100 text-red-800">
              {language === 'ta' ? current.weatherRiskLabelTa : current.weatherRiskLabelEn}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mt-3">
            <div 
              className="h-full rounded-full bg-red-500 transition-all duration-700"
              style={{ width: `${current.weatherRisk}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-red-900 mt-3 pt-2 border-t border-stone-100 truncate">
            <span className="truncate">{language === 'ta' ? current.weatherDetailTa : current.weatherDetailEn}</span>
            <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-red-800 shrink-0 ml-1">
              {language === 'ta' ? 'வானிலை' : 'Radar'} &rarr;
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. QUICK ACTIONS (REQUIRED: Scan Crop, Check Risk, My Crops, AI Assistant)
          ========================================================================= */}
      <section id="dash-quick-actions" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <span>{language === 'ta' ? 'விரைவு செயல்பாடுகள்' : 'Quick Actions'}</span>
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {language === 'ta' ? 'ஒரு தொடுதலில் செயல்படுத்துங்கள்' : '1-Tap Farm Directives'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Action 1: Scan Crop */}
          <button
            id="action-scan-crop"
            onClick={() => onNavigate('scan_crop')}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-800 to-green-950 text-white text-left transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5 text-emerald-200" />
            </div>
            <h3 className="font-bold text-sm sm:text-base leading-tight font-serif">
              {language === 'ta' ? 'பயிர் ஸ்கேன்' : 'Scan Crop'}
            </h3>
            <p className="text-[11px] sm:text-xs text-emerald-200/90 mt-1 line-clamp-1">
              {language === 'ta' ? 'AI நோய் கண்டறிதல்' : 'Instant AI Diagnosis'}
            </p>
            <span className="absolute bottom-3 right-3 text-emerald-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              &rarr;
            </span>
          </button>

          {/* Action 2: Check Risk */}
          <button
            id="action-check-risk"
            onClick={() => onNavigate('disease_risk')}
            className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 text-left transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer group relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5 text-amber-800" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-tight font-serif">
              {language === 'ta' ? 'ஆபத்து அறிக்கை' : 'Check Risk'}
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-1 line-clamp-1">
              {language === 'ta' ? '72 மணி முன்கணிப்பு' : '72h Spore Forecaster'}
            </p>
            <span className="absolute bottom-3 right-3 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              &rarr;
            </span>
          </button>

          {/* Action 3: My Crops */}
          <button
            id="action-my-crops"
            onClick={() => onNavigate('my_farm')}
            className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 text-left transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer group relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sprout className="w-5 h-5 text-emerald-800" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-tight font-serif">
              {language === 'ta' ? 'எனது பயிர்கள்' : 'My Crops'}
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-1 line-clamp-1">
              {language === 'ta' ? '3 நிலங்கள் • நெல், தக்காளி' : '3 Plots • Active Farm'}
            </p>
            <span className="absolute bottom-3 right-3 text-emerald-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              &rarr;
            </span>
          </button>

          {/* Action 4: AI Assistant */}
          <button
            id="action-ai-assistant"
            onClick={() => onNavigate('assistant')}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 text-white text-left transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-sm sm:text-base leading-tight font-serif">
              {language === 'ta' ? 'AI உதவியாளர்' : 'AI Assistant'}
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-300 mt-1 line-clamp-1">
              {language === 'ta' ? 'குரல் வழியில் கேளுங்கள்' : 'Tamil & English Voice'}
            </p>
            <span className="absolute bottom-3 right-3 text-amber-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              &rarr;
            </span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          4. EARLY WARNING SECTION (EXPLICIT USER PROMPT EARLY WARNING CARD)
          ========================================================================= */}
      <section 
        id="dash-early-warning-section"
        className="rounded-3xl border-2 border-red-400 bg-gradient-to-br from-red-50/95 via-amber-50/50 to-white p-5 sm:p-6 shadow-sm relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5 flex-1">
            {/* Warning Priority Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>⚠️ {t.uiTerms.earlyWarning}</span>
              </span>
              <span className="text-xs font-semibold text-stone-500">
                {language === 'ta' ? 'இன்று மு.ப 07:15 • தானியங்கி AI ரேடார்' : 'Live Automated Sentinel'}
              </span>
              <span className="text-xs font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded-md font-bold border border-red-200">
                {language === 'ta' ? 'நிலம் 2 (தக்காளி PKM-1)' : 'Plot 2 • Tomato PKM-1'}
              </span>
            </div>

            {/* MANDATORY USER EXAMPLE HEADLINE */}
            <div className="space-y-1">
              <h3 className="text-lg sm:text-2xl font-extrabold text-red-950 font-serif leading-snug">
                “{t.uiTerms.highDiseaseRiskDetected}”
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 font-medium">
                {language === 'ta' 
                  ? 'உங்கள் தக்காளி பயிரில் அதிக பூஞ்சை நோய் பரவும் அபாயம் உள்ளது.'
                  : 'Your tomato crop has a high fungal disease risk.'}
              </p>
            </div>

            {/* Reason for Alert */}
            <div className="p-3 rounded-xl bg-white/90 border border-red-200 text-xs text-stone-800 space-y-1">
              <div className="font-bold text-red-900">
                {language === 'ta' ? 'காரணம்:' : 'Reason:'} <span className="text-stone-900 font-serif">High humidity + rainfall forecast + previous disease symptoms.</span>
              </div>
              <div className="text-emerald-900 font-semibold flex items-center gap-1.5 pt-0.5">
                <span className="text-emerald-700 font-bold">{language === 'ta' ? 'பரிந்துரைக்கப்பட்ட நடவடிக்கை:' : 'Recommended action:'}</span>
                <span>{language === 'ta' ? 'அருகிலுள்ள செடிகளை உடனே பரிசோதித்து தடுப்பு நடவடிக்கை எடுக்கவும்.' : 'Inspect nearby plants and take preventive action.'}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-stone-600">
              <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                💧 84% RH • 8.5h Wetness
              </span>
              <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                🌧️ 72% Rain (35mm forecast)
              </span>
              <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                🔬 Residual Early Blight Inoculum
              </span>
            </div>
          </div>

          {/* Prominent Risk Stat & Quick Actions */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0">
            <div className="bg-white rounded-2xl p-3 border-2 border-red-300 text-center min-w-[130px] shadow-2xs">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                {language === 'ta' ? 'ஆபத்து அளவு' : 'Risk Score'}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-red-600 font-serif block">
                81%
              </span>
              <span className="text-[10px] font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded-full inline-block border border-red-200">
                HIGH RISK
              </span>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('alerts')}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer text-center"
              >
                {language === 'ta' ? 'முழு எச்சரிக்கை விவரம்' : 'View Early Warning'} &rarr;
              </button>
              <button
                onClick={handleShareAlert}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-stone-600" />
                <span>{copiedAlert ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'பகிர்' : 'Share Alert')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. WEATHER SECTION & RECENT CROP SCAN (TWO COLUMN ARCHITECTURE)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* WEATHER SECTION (REQUIRED: Temperature, Humidity, Rain probability, Weather-based crop risk) */}
        <section 
          id="dash-weather-section"
          className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-stone-900 text-base sm:text-lg font-serif">
                  {language === 'ta' ? 'வானிலை நுண்ணறிவு மற்றும் பயிர் ஆபத்து' : 'Weather Intelligence'}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('weather')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer flex items-center gap-1"
              >
                <span>{language === 'ta' ? 'முழு வானிலை' : 'Full Forecast'}</span>
                <span>&rarr;</span>
              </button>
            </div>

            {/* 3 Main Weather Telemetry Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {/* Temperature */}
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 text-center">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-1.5">
                  <Thermometer className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  {language === 'ta' ? 'வெப்பநிலை' : 'Temperature'}
                </span>
                <span className="text-2xl font-extrabold text-stone-900 font-serif block mt-0.5">
                  {current.temperature}°C
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  {language === 'ta' ? 'உணரப்படுவது: 32°C' : 'Feels like 32°C'}
                </span>
              </div>

              {/* Humidity */}
              <div className="bg-blue-50/60 rounded-2xl p-3.5 border border-blue-200/70 text-center">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-1.5">
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                  {language === 'ta' ? 'ஈரப்பதம்' : 'Humidity'}
                </span>
                <span className="text-2xl font-extrabold text-blue-950 font-serif block mt-0.5">
                  {current.humidity}%
                </span>
                <span className="text-[10px] font-bold text-red-600 block mt-0.5">
                  {language === 'ta' ? 'அதிக ஈரப்பதம்' : 'Very High (Dew)'}
                </span>
              </div>

              {/* Rain Probability */}
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 text-center">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-1.5">
                  <CloudRain className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  {language === 'ta' ? 'மழை வாய்ப்பு' : 'Rain Chance'}
                </span>
                <span className="text-2xl font-extrabold text-stone-900 font-serif block mt-0.5">
                  {current.rainProbability}%
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  {language === 'ta' ? 'மாலை மழை' : 'Showers Expected'}
                </span>
              </div>
            </div>

            {/* Weather-based crop risk (REQUIRED) */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0" />
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  {language === 'ta' ? 'வானிலை சார்ந்த பயிர் ஆபத்து:' : 'Weather-Based Crop Risk:'}
                </span>
              </div>
              <p className="text-xs text-stone-800 leading-relaxed font-medium">
                {language === 'ta' ? current.weatherRiskTextTa : current.weatherRiskTextEn}
              </p>
              
              {/* Agricultural Spray Window Indicator */}
              <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-xs text-stone-600">
                <span className="flex items-center gap-1 font-semibold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  {language === 'ta' ? 'பாதுகாப்பான தெளிப்பு நேரம்: பிற்பகல் 2:00 வரை' : 'Safe Spraying Window: Until 2:00 PM'}
                </span>
                <span className="text-[11px] text-stone-500">Delta-T: 2.8</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-stone-400" />
              <span>{language === 'ta' ? 'காற்று: 8 கி.மீ/மணி • வடகிழக்கு' : 'Wind: 8 km/h • North-East'}</span>
            </span>
            <button
              onClick={() => onNavigate('weather')}
              className="font-bold text-emerald-800 hover:underline cursor-pointer"
            >
              {language === 'ta' ? 'விவசாய ரேடார் பார்க்க' : 'Agro-Radar'} &rarr;
            </button>
          </div>
        </section>

        {/* RECENT CROP SCAN (REQUIRED: Crop name, Disease detected, Confidence, Severity, Date) */}
        <section 
          id="dash-recent-scan"
          className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-base sm:text-lg font-serif">
                  {language === 'ta' ? 'சமீபத்திய பயிர் ஸ்கேன்' : 'Recent Crop Scan'}
                </h3>
              </div>
              <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                {language === 'ta' ? '2 மணி நேரத்திற்கு முன்' : '2 hours ago'}
              </span>
            </div>

            {/* Scan Card Preview Container */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-4 mb-4">
              <div className="flex items-start gap-4">
                {/* Visual Leaf Thumbnail with AI Bounding Box Overlay */}
                <div className="w-22 h-22 rounded-2xl bg-emerald-950 p-1 flex items-center justify-center shrink-0 relative overflow-hidden shadow-xs border border-emerald-800">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Leaf shape */}
                    <path 
                      d="M50 8 C 85 22 95 68 68 92 C 42 100 24 82 16 60 C 10 36 28 14 50 8 Z" 
                      fill="#22c55e" 
                      stroke="#15803d" 
                      strokeWidth="2"
                    />
                    <path d="M50 12 Q 46 50 40 88" stroke="#16a34a" strokeWidth="2.5" fill="none" />
                    {/* Lesion Brown Spots */}
                    <circle cx="68" cy="42" r="8" fill="#78350f" opacity="0.9" />
                    <circle cx="66" cy="40" r="5" fill="#451a03" />
                    <circle cx="45" cy="62" r="6" fill="#78350f" opacity="0.85" />
                    {/* Red AI Detection Bounding Box */}
                    <rect 
                      x="54" 
                      y="28" 
                      width="30" 
                      height="28" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="2.5" 
                      strokeDasharray="4,2" 
                    />
                  </svg>
                  <span className="absolute bottom-1 right-1 text-[8px] font-black bg-red-600 text-white px-1 rounded shadow-xs">
                    AI BOX
                  </span>
                </div>

                {/* Scan Diagnostic Attributes */}
                <div className="space-y-1 min-w-0 flex-1">
                  {/* CROP NAME */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      {language === 'ta' ? 'பயிர் பெயர்:' : 'Crop Name:'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {language === 'ta' ? current.recentScan.cropNameTa : current.recentScan.cropName}
                    </span>
                  </div>

                  {/* DISEASE DETECTED */}
                  <div>
                    <span className="text-[11px] text-stone-500 block">
                      {language === 'ta' ? 'கண்டறியப்பட்ட நோய்:' : 'Disease Detected:'}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm leading-snug">
                      {language === 'ta' ? current.recentScan.diseaseDetectedTa : current.recentScan.diseaseDetected}
                    </h4>
                  </div>

                  {/* CONFIDENCE & SEVERITY */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-stone-500 block">
                        {language === 'ta' ? 'உறுதித்தன்மை:' : 'Confidence:'}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        {current.recentScan.confidence}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">
                        {language === 'ta' ? 'தீவிரம்:' : 'Severity:'}
                      </span>
                      <span className="text-xs font-extrabold text-amber-700">
                        {language === 'ta' ? current.recentScan.severityTa : current.recentScan.severity}
                      </span>
                    </div>
                  </div>

                  {/* DATE */}
                  <div className="flex items-center gap-1 text-[11px] text-stone-500 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{language === 'ta' ? current.recentScan.dateTa : current.recentScan.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              id="btn-view-scan-details"
              onClick={() => onNavigate('detection_result')}
              className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer text-center"
            >
              {language === 'ta' ? 'முழு ஆய்வு முடிவுகள்' : 'View Detection Result'}
            </button>
            <button
              id="btn-scan-new-leaf"
              onClick={() => onNavigate('scan_crop')}
              className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer text-center"
            >
              {language === 'ta' ? 'புதிய ஸ்கேன் செய்' : 'Scan Another Leaf'}
            </button>
          </div>
        </section>
      </div>

      {/* =========================================================================
          6. RECOMMENDED ACTION SECTION (REQUIRED: Short farmer-friendly recommendation)
          ========================================================================= */}
      <section 
        id="dash-recommended-action"
        className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base sm:text-lg font-serif">
                {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட நடவடிக்கை' : 'Recommended Action'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'ta' 
                  ? 'பயிர் பாதுகாப்பு மற்றும் வேளாண்மை நிபுணர் வழிகாட்டல்' 
                  : 'Actionable IPM advisory customized for your field'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{language === 'ta' ? 'அனைத்து பரிந்துரைகள்' : 'All IPM Protocols'}</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* Short Farmer-Friendly Recommendation Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-700 text-white uppercase tracking-wider mb-2">
                {language === 'ta' ? 'உடனடி உழவர் வழிகாட்டல்' : 'Immediate Farmer Directive'}
              </span>
              <h4 className="font-bold text-stone-900 text-sm sm:text-base font-serif mb-1.5">
                {language === 'ta' ? current.recommendedAction.titleTa : current.recommendedAction.titleEn}
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                {language === 'ta' ? current.recommendedAction.textTa : current.recommendedAction.textEn}
              </p>
            </div>

            {/* Audio Button specifically for illiterate farmers */}
            <button
              onClick={() => {
                const text = language === 'ta' ? current.recommendedAction.textTa : current.recommendedAction.textEn;
                speakText(text, language);
              }}
              className="p-2.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs shrink-0 cursor-pointer"
              title={language === 'ta' ? 'பரிந்துரையை கேளுங்கள்' : 'Listen to this recommendation'}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* 3 Actionable Farmer Step Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-emerald-200/60 text-xs">
            <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-200/60">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
              <span className="font-semibold text-stone-800">
                {language === 'ta' ? 'இயற்கை இலைத்தெளிப்பு (4 PM முன்)' : 'Bio-Spray (Before 4:00 PM)'}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-200/60">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
              <span className="font-semibold text-stone-800">
                {language === 'ta' ? 'பாசனத்தை 30% குறைக்கவும்' : 'Cut Drip Irrigation -30%'}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-200/60">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
              <span className="font-semibold text-stone-800">
                {language === 'ta' ? 'மஞ்சள் பொறிகள் (10/ஏக்கர்)' : '10 Yellow Sticky Traps/Ac'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          NOTIFICATIONS & EARLY WARNING MODAL (TRIGGERED BY NOTIFICATION BELL)
          ========================================================================= */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-stone-900 text-lg font-serif">
                  {language === 'ta' ? 'அவசர எச்சரிக்கைகள் (3)' : 'Alerts & Notifications (3)'}
                </h3>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Alert 1 (Highlighted in prompt) */}
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white uppercase">
                    {language === 'ta' ? 'அவசரம்' : 'Urgent'}
                  </span>
                  <span className="text-[11px] text-stone-500">07:15 AM</span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm">
                  {language === 'ta'
                    ? 'அதிக ஈரப்பதம் மற்றும் மழையால் பூஞ்சை நோய் பரவும் ஆபத்து அதிகம் உள்ளது.'
                    : 'High humidity and rainfall may increase fungal disease risk.'}
                </h4>
                <p className="text-xs text-stone-600">
                  {language === 'ta'
                    ? 'தக்காளி மற்றும் நெல் பயிர்களில் பூஞ்சை வித்துக்கள் முளைக்க வாய்ப்பு. மாலைக்கு முன் பாதுகாப்பு தெளிப்பு மேற்கொள்ளவும்.'
                    : 'Weather telemetry reports 88% humidity. Spore germination probability is elevated.'}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800">
                    {language === 'ta' ? 'நிலம் 2 (தக்காளி)' : 'Plot 2 (Tomato)'}
                  </span>
                  <button
                    onClick={() => {
                      setShowNotificationModal(false);
                      onNavigate('alerts');
                    }}
                    className="font-bold text-red-700 hover:underline cursor-pointer"
                  >
                    {language === 'ta' ? 'நடவடிக்கை எடுக்க' : 'Take Action'} &rarr;
                  </button>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white uppercase">
                    {language === 'ta' ? 'எச்சரிக்கை' : 'Warning'}
                  </span>
                  <span className="text-[11px] text-stone-500">Yesterday 04:30 PM</span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm">
                  {language === 'ta'
                    ? 'படைப்புழு தாக்குதல் அறிகுறி - தஞ்சாவூர் மண்டலம்'
                    : 'Fall Armyworm scouting alert in Thanjavur block'}
                </h4>
                <p className="text-xs text-stone-600">
                  {language === 'ta'
                    ? 'பக்கத்து கிராமங்களில் மக்காச்சோளம் மற்றும் நெல்லில் படைப்புழு அவதானிக்கப்பட்டுள்ளது.'
                    : 'Scout leaf whorls for windowpane feeding holes and frass pellets.'}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800">
                    {language === 'ta' ? 'நிலம் 1 (நெல்)' : 'Plot 1 (Paddy)'}
                  </span>
                  <button
                    onClick={() => {
                      setShowNotificationModal(false);
                      onNavigate('pest_detection');
                    }}
                    className="font-bold text-amber-800 hover:underline cursor-pointer"
                  >
                    {language === 'ta' ? 'பூச்சி பொறி பார்க்க' : 'View Trap Count'} &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  onNavigate('alerts');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer text-center"
              >
                {language === 'ta' ? 'அனைத்து எச்சரிக்கைகள் பக்கத்திற்கு செல்ல' : 'Go to Alerts Center (20 Screens)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
