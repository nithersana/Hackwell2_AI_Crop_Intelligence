import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Bug,
  CloudRain,
  Share2,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Activity,
  Thermometer,
  Droplets,
  Eye,
  History,
  Sparkles,
  Sliders,
  Check,
  RotateCcw,
  PhoneCall,
  Calendar,
  Leaf,
  AlertCircle,
  Filter,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { EarlyAlert, INITIAL_ALERT_HISTORY } from '../../data/cropGuardData';
import { speakText, stopSpeaking } from '../../utils/audioSpeech';

interface AlertsScreenProps {
  language: Language;
  alerts: EarlyAlert[];
  onNavigate: (screen: any) => void;
}

type ScenarioType = 'tomato_benchmark' | 'paddy_threat' | 'cotton_pest' | 'healthy_normal' | 'custom';

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  language,
  alerts,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];

  // Active scenario selection (default to benchmark from user prompt)
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('tomato_benchmark');
  
  // Custom 5-factor interactive telemetry simulator
  const [customHumidity, setCustomHumidity] = useState<number>(84);
  const [customRainProb, setCustomRainProb] = useState<number>(72);
  const [customTemp, setCustomTemp] = useState<number>(28);
  const [customCropHealth, setCustomCropHealth] = useState<number>(74);
  const [customPreviousDisease, setCustomPreviousDisease] = useState<'yes' | 'no'>('yes');
  const [customPestRisk, setCustomPestRisk] = useState<number>(42);

  // Knapsack Sprayer Dosage Calculator State
  const [sprayerVolumeLiters, setSprayerVolumeLiters] = useState<number>(16);
  const [selectedRemedy, setSelectedRemedy] = useState<'mancozeb' | 'trichoderma'>('trichoderma');

  // History & Actions state
  const [historyList, setHistoryList] = useState<EarlyAlert[]>(INITIAL_ALERT_HISTORY);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'Resolved' | 'Mitigated' | 'Active'>('all');
  const [actionLogged, setActionLogged] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'alerts' | 'surveillance' | 'history'>('alerts');

  // Compute live early alert data based on active scenario or custom sliders
  const currentAlertData = useMemo(() => {
    if (activeScenario === 'tomato_benchmark') {
      return {
        id: 'alt-benchmark-tomato',
        crop: 'Tomato',
        cropTa: 'தக்காளி',
        variety: 'Hybrid PKM-1',
        plot: 'Plot 2 - South Borewell Field',
        plotTa: 'நிலம் 2 - தெற்கு ஆழ்துளைத் தோட்டம்',
        stage: 'Flowering Stage (Day 42)',
        stageTa: 'பூக்கும் பருவம் (நாள் 42)',
        diseaseTarget: 'Early Blight (Alternaria solani)',
        diseaseTargetTa: 'ஆரம்ப இலைக்கருகல் பூஞ்சை',
        riskPercent: 81,
        riskTier: 'HIGH RISK' as const,
        alertTitle: '⚠️ EARLY DISEASE ALERT',
        alertTitleTa: '⚠️ ஆரம்பகால நோய் எச்சரிக்கை',
        alertHeadline: 'Your tomato crop has a high fungal disease risk.',
        alertHeadlineTa: 'உங்கள் தக்காளி பயிரில் அதிக பூஞ்சை நோய் பரவும் அபாயம் உள்ளது.',
        reasonString: 'High humidity + rainfall forecast + previous disease symptoms.',
        reasonStringTa: 'அதிக ஈரப்பதம் + மழை முன்னறிவிப்பு + முந்தைய நோய் அறிகுறிகள்.',
        recommendedActionHeadline: 'Inspect nearby plants and take preventive action.',
        recommendedActionHeadlineTa: 'அருகிலுள்ள செடிகளை உடனே பரிசோதித்து தடுப்பு நடவடிக்கைகளை எடுக்கவும்.',
        telemetry: {
          humidity: 84,
          rainProb: 72,
          temp: 28,
          leafWetnessHours: 8.5,
          cropHealth: 74,
          pestRisk: 42,
          previousDisease: 'Early Blight recorded last season in Plot 2',
          previousDiseaseTa: 'கடந்த பருவத்தில் நிலம் 2-ல் பதிவான ஆரம்ப இலைக்கருகல்'
        },
        riskExplanation: {
          summaryEn: 'Current microclimate sensors record 84% relative humidity and 8.5 hours of continuous leaf condensation, with 72% rainfall probability approaching within 24-48 hours. Fungal spores (Alternaria solani) from residual soil inoculum are in their active pre-symptomatic germination stage.',
          summaryTa: 'பயிர் விதானத்தில் ஈரப்பதம் 84%-ஆகவும், தொடர்ந்து 8.5 மணிநேரம் இலைகளில் பனிநீரும் உள்ளது. அடுத்த 24-48 மணி நேரத்தில் 72% மழை வாய்ப்புள்ளது. மண்ணிலுள்ள ஆரம்ப இலைக்கருகல் பூஞ்சை வித்துக்கள் தற்போது முளைத்து இலைகளில் நுழையும் தீவிர நிலையில் உள்ளன.',
          mechanismEn: 'Fungal conidial germ tubes require 6-8 hours of continuous surface moisture at 24-30°C to breach tomato leaf stomata. The pathogen is currently in cellular incubation before visible necrotic concentric target spots break out across the canopy.',
          mechanismTa: '24-30°C வெப்பத்தில் தொடர்ந்து 6-8 மணிநேரம் இலைகளில் ஈரப்பதம் இருக்கும்போது பூஞ்சை வித்துக்கள் இலைத் துளைகள் வழியாக உள்ளே நுழைகின்றன. தற்போது அறிகுறிகள் வெளியில் தெரிவதற்கு முந்தைய உட்செல்லுதல் நிலையில் உள்ளது.',
          yieldImpactEn: 'Pre-symptomatic prophylactic intervention now prevents 96% of canopy loss and protects tomato fruit clusters. Delaying until lesions appear leads to 35-50% harvest loss.',
          yieldTa: 'இப்போதே தடுப்பு நடவடிக்கை எடுப்பது 96% பயிர் இழப்பைத் தடுத்து பழங்களை பாதுகாக்கும். கருகல் புள்ளிகள் தோன்றிய பின் மருந்தடித்தால் 35-50% விளைச்சல் இழப்பு ஏற்படும்.'
        }
      };
    } else if (activeScenario === 'paddy_threat') {
      return {
        id: 'alt-paddy-blast',
        crop: 'Paddy (Rice)',
        cropTa: 'நெல்',
        variety: 'CR-1009 Sub-1 (Savithri)',
        plot: 'Plot 1 - North Canal Field',
        plotTa: 'நிலம் 1 - வடக்கு வாய்க்கால் தோட்டம்',
        stage: 'Tillering Stage (Day 36)',
        stageTa: 'தூர்கட்டும் பருவம் (நாள் 36)',
        diseaseTarget: 'Rice Blast (Magnaporthe oryzae)',
        diseaseTargetTa: 'நெல் குலைநோய் பூஞ்சை',
        riskPercent: 78,
        riskTier: 'HIGH RISK' as const,
        alertTitle: '⚠️ EARLY DISEASE ALERT',
        alertTitleTa: '⚠️ ஆரம்பகால நோய் எச்சரிக்கை',
        alertHeadline: 'Your paddy crop has a high blast fungus incubation risk.',
        alertHeadlineTa: 'உங்கள் நெல் பயிரில் குலைநோய் பூஞ்சை பரவும் அதிக அபாயம் உள்ளது.',
        reasonString: 'Dense morning dew (94% RH) + night temperature dip (21°C) + heavy basal nitrogen.',
        reasonStringTa: 'அடர்ந்த காலைப் பனி (94% ஈரப்பதம்) + இரவு குளிர் (21°C) + அதிக தழைச்சத்து உரம்.',
        recommendedActionHeadline: 'Inspect leaf collars for spindle lesions and apply prophylactic bio-agent.',
        recommendedActionHeadlineTa: 'இலை இணைப்புகளை ஆய்வு செய்து சூடோமோனாஸ் அல்லது பூஞ்சைக்கொல்லி தெளிக்கவும்.',
        telemetry: {
          humidity: 94,
          rainProb: 65,
          temp: 24,
          leafWetnessHours: 9.5,
          cropHealth: 82,
          pestRisk: 30,
          previousDisease: 'Neck blast observed in adjoining field block',
          previousDiseaseTa: 'அக்கம்பக்கத்து வயலில் கழுத்து குலைநோய் அறிகுறி'
        },
        riskExplanation: {
          summaryEn: 'Prolonged foliar dew exceeding 9 hours paired with temperatures below 24°C provides the exact physical trigger for Magnaporthe conidia to germinate and penetrate young rice leaf sheaths.',
          summaryTa: 'தொடர்ந்து 9 மணி நேரத்திற்கும் மேலாக பனிப்பொழிவு மற்றும் 24°C-க்கு குறைவான வெப்பநிலை நெல் குலைநோய் வித்துக்கள் எளிதில் பரவ வழிவகுக்கிறது.',
          mechanismEn: 'Tender nitrogen-boosted tillers possess thinner cuticular wax, expediting appressorium penetration.',
          mechanismTa: 'அதிக தழைச்சத்து இடப்பட்ட பயிரின் மெல்லிய இலைகளில் பூஞ்சை எளிதில் துளையிட்டு பரவுகிறது.',
          yieldImpactEn: 'Preventative biological foliar spray halts blast infection at the leaf stage before systemic neck blast damages panicles.',
          yieldTa: 'முன்கூட்டியே தெளிப்பதால் குலைநோய் கதிர் வரை பரவாமல் 90% மகசூல் காப்பாற்றப்படும்.'
        }
      };
    } else if (activeScenario === 'cotton_pest') {
      return {
        id: 'alt-cotton-pest',
        crop: 'Cotton',
        cropTa: 'பருத்தி',
        variety: 'Hybrid Bt RCH-2',
        plot: 'Plot 3 - East Ridge Field',
        plotTa: 'நிலம் 3 - கிழக்கு மேட்டு நிலம்',
        stage: 'Squaring Stage (Day 52)',
        stageTa: 'பூ மொட்டு பருவம் (நாள் 52)',
        diseaseTarget: 'Whitefly (Bemisia tabaci) & Leaf Curl Virus',
        diseaseTargetTa: 'வெள்ளை ஈ & இலைச்சுருள் வைரஸ்',
        riskPercent: 68,
        riskTier: 'HIGH RISK' as const,
        alertTitle: '⚠️ EARLY PEST ALERT',
        alertTitleTa: '⚠️ ஆரம்பகால பூச்சி தாக்குதல் எச்சரிக்கை',
        alertHeadline: 'Your cotton crop has an elevated whitefly vector flare-up risk.',
        alertHeadlineTa: 'உங்கள் பருத்தி பயிரில் வெள்ளை ஈ பெருக்கம் மற்றும் வைரஸ் பரவும் அபாயம் உள்ளது.',
        reasonString: 'Warm temperatures (32°C) + sticky card threshold exceeded + neighbor field migration.',
        reasonStringTa: 'அதிக வெப்பம் (32°C) + மஞ்சள் பொறியில் பூச்சிகள் அதிகரிப்பு + பக்கத்து வயல் இடப்பெயர்வு.',
        recommendedActionHeadline: 'Inspect leaf undersides and deploy 10 yellow sticky cards per acre.',
        recommendedActionHeadlineTa: 'இலைகளின் அடிப்பகுதியை ஆய்வு செய்து ஏக்கருக்கு 10 மஞ்சள் ஒட்டும் பொறிகள் கட்டவும்.',
        telemetry: {
          humidity: 68,
          rainProb: 35,
          temp: 32,
          leafWetnessHours: 4.0,
          cropHealth: 84,
          pestRisk: 68,
          previousDisease: 'Whitefly clusters recorded along field margins 4 days ago',
          previousDiseaseTa: '4 நாட்களுக்கு முன் வரப்புகளில் வெள்ளை ஈக்கள் தென்பட்டன'
        },
        riskExplanation: {
          summaryEn: 'High daytime temperatures accelerate whitefly nymph emergence cycles, while sticky traps recorded 16 adults per card (exceeding the economic threshold of 12).',
          summaryTa: 'வெப்பமான வானிலை வெள்ளை ஈக்களின் முட்டைகள் பொரிப்பதை விரைவுபடுத்துகிறது. மஞ்சள் அட்டைகளில் 16 பூச்சிகள் சிக்கியுள்ளன.',
          mechanismEn: 'Sucking nymphs transmit Cotton Leaf Curl Geminivirus and secrete honeydew causing secondary sooty mold.',
          mechanismTa: 'இலைகளில் சாறு உறிஞ்சும் பூச்சிகள் இலைச்சுருள் வைரஸை பரப்பி கரும்பூஞ்சை உருவாக காரணமாகின்றன.',
          yieldImpactEn: 'Deploying sticky cards and neem spray now stops nymph colonisation before boll setting is stunted.',
          yieldTa: 'இப்போதே வேப்பெண்ணெய் தெளித்து மஞ்சள் பொறிகள் கட்டுவது காய்கள் உருவாவதை பாதுகாக்கும்.'
        }
      };
    } else if (activeScenario === 'healthy_normal') {
      return {
        id: 'alt-healthy',
        crop: 'Tomato',
        cropTa: 'தக்காளி',
        variety: 'Hybrid PKM-1',
        plot: 'Plot 2 - South Borewell Field',
        plotTa: 'நிலம் 2 - தெற்கு ஆழ்துளைத் தோட்டம்',
        stage: 'Vegetative Stage (Day 28)',
        stageTa: 'வளர்ச்சிப் பருவம் (நாள் 28)',
        diseaseTarget: 'All Pathogens Inactive',
        diseaseTargetTa: 'நோய் கிருமிகள் செயலற்ற நிலையில் உள்ளன',
        riskPercent: 18,
        riskTier: 'LOW RISK' as const,
        alertTitle: '🟢 ALL CLEAR: OPTIMAL FIELD STANDING',
        alertTitleTa: '🟢 இயல்பான நிலை: பயிர் பாதுகாப்பாக உள்ளது',
        alertHeadline: 'Foliar disease and pest risks are within safe normal limits.',
        alertHeadlineTa: 'நோய் மற்றும் பூச்சி பரவும் அபாயம் பாதுகாப்பான வரம்பில் உள்ளது.',
        reasonString: 'Dry canopy ventilation (52% RH) + zero rainfall forecast + healthy foliage.',
        reasonStringTa: 'நல்ல காற்றோட்டம் (52% ஈரப்பதம்) + மழை இல்லை + ஆரோக்கியமான இலைகள்.',
        recommendedActionHeadline: 'Maintain regular field scouting and optimal drip irrigation.',
        recommendedActionHeadlineTa: 'வழக்கமான கள ஆய்வை மேற்கொண்டு சரியான அளவில் சொட்டுநீர் பாய்ச்சவும்.',
        telemetry: {
          humidity: 52,
          rainProb: 10,
          temp: 27,
          leafWetnessHours: 1.5,
          cropHealth: 92,
          pestRisk: 14,
          previousDisease: 'No active lesions observed',
          previousDiseaseTa: 'செயலில் உள்ள நோய்த்தாக்கம் இல்லை'
        },
        riskExplanation: {
          summaryEn: 'Canopy sensors indicate low atmospheric humidity, brisk 14 km/h wind dispersion, and dry leaves. Pathogen spore germination cannot proceed without surface moisture.',
          summaryTa: 'பயிர் விதானத்தில் ஈரப்பதம் குறைவாகவும் நல்ல காற்றோட்டமும் உள்ளது. இலைகளில் நீர் இல்லாததால் பூஞ்சை வித்துக்கள் முளைக்க முடியாது.',
          mechanismEn: 'Plant cuticles remain robust and natural physiological defenses are fully active.',
          mechanismTa: 'செடியின் இயற்கை நோய் எதிர்ப்புத் திறன் முழுமையாக செயல்படுகிறது.',
          yieldImpactEn: 'Field is in prime health with high photosynthetic efficiency.',
          yieldTa: 'பயிர் மிகச் சிறந்த வளர்ச்சி மற்றும் ஒளிச்சேர்க்கை நிலையில் உள்ளது.'
        }
      };
    } else {
      // Dynamic computation from custom interactive sliders
      let score = Math.round(
        customHumidity * 0.35 +
        customRainProb * 0.25 +
        (customTemp >= 25 && customTemp <= 30 ? 20 : 10) +
        (100 - customCropHealth) * 0.15 +
        (customPreviousDisease === 'yes' ? 15 : 0) +
        customPestRisk * 0.1
      );
      score = Math.min(99, Math.max(8, score));
      const isHigh = score >= 61;
      const isMedium = score >= 31 && score < 61;

      return {
        id: 'alt-custom-simulation',
        crop: 'Tomato (Custom Simulation)',
        cropTa: 'தக்காளி (தனிப்பயன் மாதிரி)',
        variety: 'Simulated PKM-1',
        plot: 'Plot 2 - South Borewell Field',
        plotTa: 'நிலம் 2 - தெற்கு ஆழ்துளைத் தோட்டம்',
        stage: 'Flowering Stage',
        stageTa: 'பூக்கும் பருவம்',
        diseaseTarget: 'Early Blight & Sucking Pests',
        diseaseTargetTa: 'இலைக்கருகல் மற்றும் பூச்சிகள்',
        riskPercent: score,
        riskTier: (isHigh ? 'HIGH RISK' : isMedium ? 'MEDIUM RISK' : 'LOW RISK') as 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK',
        alertTitle: isHigh ? '⚠️ EARLY DISEASE ALERT' : isMedium ? '⚡ ADVISORY WARNING' : '🟢 FIELD HEALTH OPTIMAL',
        alertTitleTa: isHigh ? '⚠️ ஆரம்பகால நோய் எச்சரிக்கை' : isMedium ? '⚡ கவன எச்சரிக்கை' : '🟢 நிலைமை சீராக உள்ளது',
        alertHeadline: isHigh
          ? 'Your tomato crop has a high fungal disease risk.'
          : isMedium
          ? 'Elevated risk conditions developing in the microclimate.'
          : 'Environmental conditions are currently safe.',
        alertHeadlineTa: isHigh
          ? 'உங்கள் தக்காளி பயிரில் அதிக பூஞ்சை நோய் பரவும் அபாயம் உள்ளது.'
          : isMedium
          ? 'வானிலை மாற்றத்தால் நோய் பரவும் சூழல் உருவாகிறது.'
          : 'பயிர் சூழல் தற்போது பாதுகாப்பாக உள்ளது.',
        reasonString: `${customHumidity}% Humidity + ${customRainProb}% Rain Forecast + ${customPreviousDisease === 'yes' ? 'Previous Disease History' : 'Clean History'}.`,
        reasonStringTa: `${customHumidity}% ஈரப்பதம் + ${customRainProb}% மழை வாய்ப்பு + ${customPreviousDisease === 'yes' ? 'முந்தைய நோய் வரலாறு' : 'சுத்தமான வரலாறு'}.`,
        recommendedActionHeadline: isHigh
          ? 'Inspect nearby plants and take preventive action.'
          : 'Monitor field conditions and inspect leaf undersides.',
        recommendedActionHeadlineTa: isHigh
          ? 'அருகிலுள்ள செடிகளை உடனே பரிசோதித்து தடுப்பு நடவடிக்கைகளை எடுக்கவும்.'
          : 'கள நிலவரத்தை கண்காணித்து இலைகளின் அடிப்பகுதியை பார்க்கவும்.',
        telemetry: {
          humidity: customHumidity,
          rainProb: customRainProb,
          temp: customTemp,
          leafWetnessHours: Number((customHumidity * 0.1).toFixed(1)),
          cropHealth: customCropHealth,
          pestRisk: customPestRisk,
          previousDisease: customPreviousDisease === 'yes' ? 'Historical inoculum present in soil' : 'No prior history',
          previousDiseaseTa: customPreviousDisease === 'yes' ? 'மண்ணில் பழைய பூஞ்சை எச்சங்கள் உள்ளன' : 'முந்தைய நோய் இல்லை'
        },
        riskExplanation: {
          summaryEn: `Computed dynamic spore germination risk is ${score}%. ${isHigh ? 'Environmental conditions exceed the pathogen threshold.' : 'Conditions are below critical spore infection limits.'}`,
          summaryTa: `கணக்கிடப்பட்ட நோய் அபாய அளவு ${score}%. ${isHigh ? 'வானிலை நோய் பரவ மிக சாதகமாக உள்ளது.' : 'நோய் பரவுவதற்கான வாய்ப்பு குறைவாக உள்ளது.'}`,
          mechanismEn: 'Adaptive engine processes leaf moisture, rain splash mechanics, and host resistance to project spore outbreaks.',
          mechanismTa: 'இலை ஈரப்பதம், மழைத்தூறல் மற்றும் பயிர் எதிர்ப்புத் திறனை ஒருங்கிணைத்து கணிக்கப்பட்டுள்ளது.',
          yieldImpactEn: isHigh ? 'Immediate preventive intervention preserves harvest volume.' : 'Maintain normal agro-practices.',
          yieldTa: isHigh ? 'உடனடி தடுப்பு நடவடிக்கை மகசூலை பாதுகாக்கும்.' : 'வழக்கமான பயிர் பராமரிப்பை தொடரவும்.'
        }
      };
    }
  }, [
    activeScenario,
    customHumidity,
    customRainProb,
    customTemp,
    customCropHealth,
    customPreviousDisease,
    customPestRisk
  ]);

  // Audio Speech Readout
  const handleVoiceReadout = () => {
    if (language === 'ta') {
      const speech = `${currentAlertData.alertTitleTa}. ${currentAlertData.alertHeadlineTa}. ஆபத்து அளவு: ${currentAlertData.riskPercent} சதவீதம். காரணம்: ${currentAlertData.reasonStringTa}. பரிந்துரைக்கப்பட்ட நடவடிக்கை: ${currentAlertData.recommendedActionHeadlineTa}`;
      speakText(speech, 'ta');
    } else {
      const speech = `${currentAlertData.alertTitle}. ${currentAlertData.alertHeadline} Risk: ${currentAlertData.riskPercent} percent. Reason: ${currentAlertData.reasonString} Recommended action: ${currentAlertData.recommendedActionHeadline}`;
      speakText(speech, 'en');
    }
    showToast(language === 'ta' ? 'குரல் வழிகாட்டல் ஒலிக்கிறது...' : 'Playing voice alert guidance...');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Share Alert Handler (WhatsApp format)
  const handleShare = () => {
    const text = language === 'ta'
      ? `🚨 *CropGuard AI அவசர எச்சரிக்கை*\n${currentAlertData.alertHeadlineTa}\n*ஆபத்து:* ${currentAlertData.riskPercent}%\n*காரணம்:* ${currentAlertData.reasonStringTa}\n*நடவடிக்கை:* ${currentAlertData.recommendedActionHeadlineTa}\nநிலம்: ${currentAlertData.plotTa}`
      : `🚨 *CropGuard AI Early Alert*\n${currentAlertData.alertHeadline}\n*Risk:* ${currentAlertData.riskPercent}%\n*Reason:* ${currentAlertData.reasonString}\n*Action:* ${currentAlertData.recommendedActionHeadline}\nField: ${currentAlertData.plot}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(language === 'ta' ? 'எச்சரிக்கை வாட்ஸ்அப் செய்தி நகலெடுக்கப்பட்டது!' : 'Alert formatted and copied to clipboard for WhatsApp!');
    } else {
      showToast(language === 'ta' ? 'எச்சரிக்கை பகிரப்பட்டது!' : 'Alert shared successfully!');
    }
  };

  // Log Action Taken
  const handleLogAction = () => {
    setActionLogged(true);
    const newRecord: EarlyAlert = {
      id: `hist-${Date.now()}`,
      type: 'disease',
      level: 'Urgent',
      levelTa: 'உடனடி கவனம் தேவை (தீர்க்கப்பட்டது)',
      title: currentAlertData.alertTitle,
      titleTa: currentAlertData.alertTitleTa,
      description: currentAlertData.alertHeadline,
      descriptionTa: currentAlertData.alertHeadlineTa,
      affectedPlot: currentAlertData.plot,
      affectedPlotTa: currentAlertData.plotTa,
      actionRequired: currentAlertData.recommendedActionHeadline,
      actionRequiredTa: currentAlertData.recommendedActionHeadlineTa,
      time: 'Just now',
      timeTa: 'சற்று முன்',
      crop: currentAlertData.crop,
      cropTa: currentAlertData.cropTa,
      riskPercent: currentAlertData.riskPercent,
      reason: currentAlertData.reasonString,
      reasonTa: currentAlertData.reasonStringTa,
      status: 'Resolved',
      statusTa: 'தீர்க்கப்பட்டது',
      resolvedDate: 'Today (Intervened in <2 hours)',
      actionTaken: 'Farmer scouted field, applied preventive foliar bio-fungicide, and pruned bottom leaves.',
      actionTakenTa: 'விவசாயி கள ஆய்வு செய்து, தடுப்பு பூஞ்சைக்கொல்லி தெளித்து அடி இலைகளை அகற்றினார்.',
      cropSavedPct: 98
    };

    setHistoryList([newRecord, ...historyList]);
    showToast(language === 'ta' ? 'தடுப்பு நடவடிக்கை வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Preventive action successfully logged in Alert History!');
  };

  // Filtered History
  const filteredHistory = historyList.filter(item => {
    if (historyFilter === 'all') return true;
    return item.status === historyFilter;
  });

  return (
    <div id="screen-alerts" className="space-y-6 max-w-5xl mx-auto px-4 py-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-stone-900 text-white rounded-2xl shadow-xl border border-stone-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* -------------------------------------------------------------
          HEADER & SENTINEL NAVIGATION
          ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider border border-red-200">
              <Activity className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>{language === 'ta' ? 'தானியங்கி முன்னெச்சரிக்கை அமைப்பு' : 'Automated Early Warning System'}</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
            {language === 'ta' ? 'பயிர் பாதுகாப்பு முன்னெச்சரிக்கை மையம்' : 'CropGuard Early Warning System'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            {language === 'ta'
              ? 'நோய் பரவுவதற்கு முன்பே தடுத்து பயிர் சேதத்தை தவிர்க்கும் 5-காரணி தொடர் கண்காணிப்பு அமைப்பு.'
              : 'Multi-factor predictive sentinel monitoring disease risk, pest risk, weather, crop health, and history to prevent crop damage before pathogens spread.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            id="alerts-voice-btn"
            onClick={handleVoiceReadout}
            className="py-2.5 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            title="Read Alert Aloud"
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>{language === 'ta' ? 'குரல் வழிகாட்டல்' : 'Listen Alert'}</span>
          </button>

          <button
            id="alerts-share-btn"
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer border border-stone-200"
            title="Share Alert via WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'alerts'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>{language === 'ta' ? '1. செயலில் உள்ள எச்சரிக்கை' : '1. Active Alert & Actions'}</span>
        </button>

        <button
          onClick={() => setActiveTab('surveillance')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'surveillance'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>{language === 'ta' ? '2. நேரலை 5-காரணி கண்காணிப்பு' : '2. 5-Vector Live Surveillance'}</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'history'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <History className="w-4 h-4 text-blue-400" />
          <span>{language === 'ta' ? '3. எச்சரிக்கை வரலாறு' : '3. Alert History'}</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-800">
            {historyList.length}
          </span>
        </button>
      </div>

      {/* Scenario Benchmark Quick Switcher */}
      <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="text-xs font-bold text-stone-800">
            {language === 'ta' ? 'மாதிரி சூழல் தேர்வு (Test Scenarios):' : 'Sentinel Simulation Benchmark:'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveScenario('tomato_benchmark')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeScenario === 'tomato_benchmark'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            🍅 {language === 'ta' ? 'தக்காளி 81% (Prompt Example)' : 'Tomato 81% High Risk'}
          </button>

          <button
            onClick={() => setActiveScenario('paddy_threat')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeScenario === 'paddy_threat'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            🌾 {language === 'ta' ? 'நெல் குலைநோய் 78%' : 'Paddy Blast 78%'}
          </button>

          <button
            onClick={() => setActiveScenario('cotton_pest')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeScenario === 'cotton_pest'
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            🌿 {language === 'ta' ? 'பருத்தி வெள்ளை ஈ 68%' : 'Cotton Whitefly 68%'}
          </button>

          <button
            onClick={() => setActiveScenario('healthy_normal')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeScenario === 'healthy_normal'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            🟢 {language === 'ta' ? 'ஆரோக்கியமானது (Normal 18%)' : 'Normal Standing (18%)'}
          </button>

          <button
            onClick={() => {
              setActiveScenario('custom');
              setActiveTab('surveillance');
            }}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeScenario === 'custom'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>{language === 'ta' ? 'தனிப்பயன் ஸ்லைடர்' : 'Custom Sliders'}</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: CORE DELIVERABLES (1. ALERT CARD, 2. RISK EXPLANATION,
                 3. REASON FOR ALERT, 4. RECOMMENDED ACTION)
          ===================================================================== */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* -------------------------------------------------------------
              1. THE ALERT CARD (EXPLICIT USER MANDATE)
              ------------------------------------------------------------- */}
          <section
            id="early-alert-card"
            className={`rounded-3xl border-2 p-6 sm:p-8 transition-all shadow-sm relative overflow-hidden ${
              currentAlertData.riskTier === 'HIGH RISK'
                ? 'bg-gradient-to-br from-red-50/95 via-amber-50/50 to-white border-red-400'
                : currentAlertData.riskTier === 'MEDIUM RISK'
                ? 'bg-gradient-to-br from-amber-50/90 to-white border-amber-400'
                : 'bg-gradient-to-br from-emerald-50/90 to-white border-emerald-300'
            }`}
          >
            {/* Top Alert Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-red-200/70">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  currentAlertData.riskTier === 'HIGH RISK'
                    ? 'bg-red-600 text-white animate-pulse'
                    : currentAlertData.riskTier === 'MEDIUM RISK'
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold tracking-wider uppercase text-red-800">
                    {language === 'ta' ? currentAlertData.alertTitleTa : currentAlertData.alertTitle}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-stone-600">
                      {language === 'ta' ? currentAlertData.plotTa : currentAlertData.plot}
                    </span>
                    <span className="text-stone-400">•</span>
                    <span className="text-xs text-stone-500 font-mono">
                      {language === 'ta' ? currentAlertData.stageTa : currentAlertData.stage}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-stone-800 text-xs font-bold border border-stone-200 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>{language === 'ta' ? 'நேரலை எச்சரிக்கை' : 'Live Trigger'}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-2xs ${
                  currentAlertData.riskTier === 'HIGH RISK' ? 'bg-red-700' : 'bg-emerald-700'
                }`}>
                  {currentAlertData.riskTier}
                </span>
              </div>
            </div>

            {/* Main Headline & Risk Meter */}
            <div className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                {/* MANDATORY USER EXAMPLE PHRASE: "Your tomato crop has a high fungal disease risk." */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif leading-snug">
                  {language === 'ta' ? currentAlertData.alertHeadlineTa : currentAlertData.alertHeadline}
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
                  {language === 'ta'
                    ? `இலக்கு நோய்த்தாக்கம்: ${currentAlertData.diseaseTargetTa}. பயிர் விதானத்தில் வித்துக்கள் முளைக்கத் துவங்கியுள்ளன. இலைகளில் கருகல் புள்ளிகள் பரவும் முன் உடனே தடுக்கலாம்.`
                    : `Pathogen Vector: ${currentAlertData.diseaseTarget}. Conidial spore germination is actively incubating. Immediate preventive foliar spray prevents foliar necrosis.`}
                </p>

                {/* Pre-Symptomatic Window Banner */}
                <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-white/90 border border-red-200 text-xs text-red-900 font-medium shadow-2xs">
                  <Info className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    {language === 'ta'
                      ? 'முன்னெச்சரிக்கை சாளரம்: அடுத்த 18 மணி நேரத்திற்குள் மருந்து தெளித்தால் 96% பயிரை காப்பாற்றலாம்.'
                      : 'Pre-Symptomatic Window: Intervening within the next 18 hours preserves 96% of fruit yield.'}
                  </span>
                </div>
              </div>

              {/* Prominent Risk Meter Widget (EXPLICIT USER EXAMPLE: "Risk: 81%") */}
              <div className="bg-white rounded-3xl p-5 border-2 border-red-300 shadow-sm flex flex-col items-center justify-center text-center shrink-0 min-w-[220px]">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  {language === 'ta' ? 'கணிக்கப்பட்ட நோய் ஆபத்து' : 'Calculated Risk'}
                </span>

                <div className="relative my-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl sm:text-6xl font-black text-red-600 font-serif tracking-tight">
                    {currentAlertData.riskPercent}%
                  </span>
                </div>

                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden my-2 border border-stone-200">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      currentAlertData.riskPercent >= 61
                        ? 'bg-red-600'
                        : currentAlertData.riskPercent >= 31
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${currentAlertData.riskPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between w-full text-[10px] font-bold text-stone-500 mt-1">
                  <span>0% Low</span>
                  <span>30%</span>
                  <span>60%</span>
                  <span className="text-red-700">100% High</span>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-red-700">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{currentAlertData.riskTier} (Threshold &gt;60%)</span>
                </div>
              </div>
            </div>

            {/* Quick Action Toolbar inside Alert Card */}
            <div className="pt-4 border-t border-red-200/70 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                <span className="bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                  {language === 'ta' ? 'பயிர்: ' : 'Crop: '} <strong>{language === 'ta' ? currentAlertData.cropTa : currentAlertData.crop}</strong>
                </span>
                <span className="bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                  {language === 'ta' ? 'ரகம்: ' : 'Variety: '} <strong>{currentAlertData.variety}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogAction}
                  disabled={actionLogged}
                  className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    actionLogged
                      ? 'bg-emerald-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{actionLogged ? (language === 'ta' ? 'நடவடிக்கை பதிவு செய்யப்பட்டது' : 'Action Logged') : (language === 'ta' ? 'நடவடிக்கை எடுத்தேன்' : 'Mark Action Taken')}</span>
                </button>

                <button
                  onClick={() => onNavigate('recommendations')}
                  className="py-2 px-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'மருந்து விவரம்' : 'Full IPM Guide'} &rarr;
                </button>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------------
              2. REASON FOR ALERT (EXPLICIT USER MANDATE)
              ------------------------------------------------------------- */}
          <section id="alert-reason-section" className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  !
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    {language === 'ta' ? 'எச்சரிக்கைக்கான காரணிகள்' : 'Alert Trigger Diagnostics'}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">
                    {language === 'ta' ? 'எச்சரிக்கைக்கான காரணம் (Reason for Alert)' : 'Reason for Alert'}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200">
                Multi-Factor Confluence
              </span>
            </div>

            {/* MANDATORY USER EXAMPLE: "Reason: High humidity + rainfall forecast + previous disease symptoms." */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block mb-1">
                {language === 'ta' ? 'முக்கிய காரணக் கூட்டு:' : 'Primary Causal Confluence:'}
              </span>
              <p className="text-base sm:text-lg font-extrabold text-stone-900 font-serif leading-snug">
                “{language === 'ta' ? currentAlertData.reasonStringTa : currentAlertData.reasonString}”
              </p>
            </div>

            {/* 3 Detailed Causal Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Factor 1: High Humidity */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-900 uppercase">
                      {language === 'ta' ? '1. அதிக ஈரப்பதம்' : '1. High Humidity'}
                    </span>
                    <Droplets className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-stone-900 font-serif">
                    {currentAlertData.telemetry.humidity}% RH
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {language === 'ta'
                      ? `இலைகளில் பனிநீர்: ${currentAlertData.telemetry.leafWetnessHours} மணிநேரம். 80%-க்கு மேல் ஈரப்பதம் இருப்பது பூஞ்சை வித்துக்கள் முளைப்பதற்கு மிக சாதகமானது.`
                      : `Canopy wetness: ${currentAlertData.telemetry.leafWetnessHours} hrs continuous condensation. Sustained RH above 80% enables germ-tube emergence.`}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-blue-200/70 text-[11px] font-semibold text-blue-800">
                  Critical Spore Moisture Threshold Exceeded
                </div>
              </div>

              {/* Factor 2: Rainfall Forecast */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-900 uppercase">
                      {language === 'ta' ? '2. மழை முன்னறிவிப்பு' : '2. Rainfall Forecast'}
                    </span>
                    <CloudRain className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-stone-900 font-serif">
                    {currentAlertData.telemetry.rainProb}% Rain
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {language === 'ta'
                      ? 'அடுத்த 24-48 மணி நேரத்தில் மழை பெய்ய வாய்ப்புள்ளது. மழைத்துளிகள் மண்ணிலுள்ள பூஞ்சைகளை அடி இலைகளுக்கு தெறிக்கச் செய்கின்றன.'
                      : 'Upcoming 24-48 hour rain showers will physically splash soil-borne conidia upward onto lower tomato leaf canopies.'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-emerald-200/70 text-[11px] font-semibold text-emerald-800">
                  Splash-Dispersal Hazard Imminent
                </div>
              </div>

              {/* Factor 3: Previous Disease Symptoms */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-700 uppercase">
                      {language === 'ta' ? '3. முந்தைய நோய் வரலாறு' : '3. Disease History'}
                    </span>
                    <History className="w-4 h-4 text-stone-600" />
                  </div>
                  <div className="text-sm font-extrabold text-stone-900 line-clamp-1">
                    {language === 'ta' ? currentAlertData.telemetry.previousDiseaseTa : currentAlertData.telemetry.previousDisease}
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {language === 'ta'
                      ? 'கடந்த பருவத்தில் நிலம் 2-ல் நோய் பதிவானதால் மண்ணிலும் பயிர் எச்சங்களிலும் பூஞ்சை வித்துக்கள் ஏற்கனவே உறக்க நிலையில் உள்ளன.'
                      : 'Residual fungal inoculum survived in crop debris and root-zone soil from previous crop cycle, creating high initial spore load.'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-200 text-[11px] font-semibold text-stone-700">
                  Dormant Inoculum Reactivated by Moisture
                </div>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------------
              3. RISK EXPLANATION (EXPLICIT USER MANDATE)
              ------------------------------------------------------------- */}
          <section id="alert-risk-explanation" className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Leaf className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    {language === 'ta' ? 'உயிரியல் மற்றும் முன்கணிப்பு விளக்கம்' : 'Biological Predictive Analysis'}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">
                    {language === 'ta' ? 'ஆபத்து விளக்கம் (Risk Explanation)' : 'Risk Explanation'}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                Pre-Symptomatic Biology
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  {language === 'ta' ? '1. அறிகுறிகள் தோன்றுவதற்கு முன் ஏன் இந்த அபாயம்?' : '1. Why 81% Risk Exists Before Visible Foliar Symptoms:'}
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {language === 'ta'
                    ? currentAlertData.riskExplanation.summaryTa
                    : currentAlertData.riskExplanation.summaryEn}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  {language === 'ta' ? '2. பூஞ்சை வித்துக்கள் பெருக்க முறை (Mills Incubation Period):' : '2. Pathogen Penetration Mechanics (Mills Incubation):'}
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {language === 'ta'
                    ? currentAlertData.riskExplanation.mechanismTa
                    : currentAlertData.riskExplanation.mechanismEn}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1">
                  {language === 'ta' ? '3. இப்போதே தடுப்பதால் கிடைக்கும் மகசூல் லாபம்:' : '3. Economic Harvest Preservation Impact:'}
                </h4>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                  {language === 'ta'
                    ? currentAlertData.riskExplanation.yieldTa
                    : currentAlertData.riskExplanation.yieldImpactEn}
                </p>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------------
              4. RECOMMENDED ACTION (EXPLICIT USER MANDATE)
              ------------------------------------------------------------- */}
          <section id="alert-recommended-action" className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    {language === 'ta' ? 'விவசாயிக்கான செயல் திட்டம்' : 'Farmer Action Protocol'}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">
                    {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட நடவடிக்கை (Recommended Action)' : 'Recommended Action'}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-lg">
                Time-Sensitive Window
              </span>
            </div>

            {/* MANDATORY USER EXAMPLE: "Recommended action: Inspect nearby plants and take preventive action." */}
            <div className="p-4 rounded-2xl bg-emerald-900 text-white mb-6 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 block mb-1">
                {language === 'ta' ? 'முக்கிய கட்டளை:' : 'Priority Directive:'}
              </span>
              <p className="text-base sm:text-xl font-extrabold font-serif leading-snug">
                “{language === 'ta' ? currentAlertData.recommendedActionHeadlineTa : currentAlertData.recommendedActionHeadline}”
              </p>
            </div>

            {/* Step by step practical action plan */}
            <div className="space-y-4">
              {/* Step 1: Scouting */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center shrink-0">
                  01
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-stone-900">
                    {language === 'ta' ? 'அருகிலுள்ள செடிகளை பரிசோதிக்கவும் (Systematic Scouting)' : 'Inspect Nearby Plants Within 5m Radius'}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {language === 'ta'
                      ? 'நிலம் 2-ல் உள்ள தக்காளி வரிசைகளில் நடந்து சென்று, கீழ் இலைகளின் அடிப்பகுதியை உன்னிப்பாக கவனிக்கவும். சிறிய நீர் தோய்ந்த புள்ளிகளோ அல்லது மஞ்சள் வளையங்களோ தென்படுகிறதா என பார்க்கவும்.'
                      : 'Walk rows in Plot 2. Inspect the undersides of bottom canopy leaves within 5 meters of previous disease spots. Look for water-soaked pinpoints or early chlorotic rings.'}
                  </p>
                </div>
              </div>

              {/* Step 2: Prophylactic Spray */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center shrink-0">
                  02
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-stone-900">
                    {language === 'ta' ? 'தடுப்பு பூஞ்சைக்கொல்லி தெளிப்பு (Prophylactic Spray)' : 'Apply Preventive Foliar Bio-Shield Spray'}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {language === 'ta'
                      ? 'மழை தொடங்குவதற்கு முன் இன்றே மாலைக்குள் தெளிக்கவும்: இயற்கை முறைக்கு டிரைக்கோடெர்மா விரிடி (Trichoderma viride) லிட்டருக்கு 5 கிராம், அல்லது ரசாயன முறைக்கு மாங்கோசெப் 75% WP (Mancozeb) லிட்டருக்கு 2 கிராம்.'
                      : 'Apply protective foliar coating before today\'s rainfall: Organic bio-agent Trichoderma viride @ 5g/L water, or contact protectant Mancozeb 75% WP @ 2g/L water.'}
                  </p>
                </div>
              </div>

              {/* Step 3: Knapsack Sprayer Dosage Calculator */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center shrink-0">
                      03
                    </div>
                    <h4 className="text-sm font-bold text-stone-900">
                      {language === 'ta' ? 'தெளிப்பான் தொட்டி அளவு கணக்கீடு (Sprayer Calculator)' : 'Knapsack Sprayer Dosage Calculator'}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-stone-300">
                    16L Knapsack Standard
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1">
                      {language === 'ta' ? 'இயற்கை முறை (Trichoderma):' : 'Bio-Agent (Trichoderma viride):'}
                    </span>
                    <p className="text-xs font-semibold text-stone-800">
                      80g {language === 'ta' ? 'பொடி / 16 லிட்டர் தண்ணீர்' : 'powder per 16L sprayer tank'}
                    </p>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      {language === 'ta' ? 'இலைகளின் அடிப்பகுதியில் படும்படி தெளிக்கவும்' : 'Foliar wash ensuring underside leaf coverage'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-blue-800 uppercase block mb-1">
                      {language === 'ta' ? 'ரசாயன முறை (Mancozeb 75% WP):' : 'Chemical Protectant (Mancozeb 75% WP):'}
                    </span>
                    <p className="text-xs font-semibold text-stone-800">
                      32g {language === 'ta' ? 'மருந்து / 16 லிட்டர் தண்ணீர்' : 'formulation per 16L sprayer tank'}
                    </p>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      {language === 'ta' ? 'மழைக்கு முன் 2 மணி நேரம் காய வேண்டும்' : 'Requires 2 hours rain-free drying window'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Cultural Field Hygiene */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center shrink-0">
                  04
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-stone-900">
                    {language === 'ta' ? 'கள சுகாதாரம் மற்றும் கவாத்து (Sanitation & Ventilation)' : 'Cultural Sanitation & Prune Lower Suckers'}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {language === 'ta'
                      ? 'ஈரமான மண்ணில் படும் கீழ் இலைகளை கவாத்து செய்து நிலத்திற்கு வெளியே அப்புறப்படுத்தவும். தெளிப்பு பாசனத்தை நிறுத்தி சொட்டுநீர் மட்டுமே பாய்ச்சவும்.'
                      : 'Prune and bag lower foliage touching damp mulch. Suspend overhead sprinkler irrigation immediately to avoid extending leaf wetness hours.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Footer Buttons */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogAction}
                  className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'ta' ? 'நடவடிக்கை எடுத்ததாக பதிவு செய்' : 'Confirm Action Taken'}</span>
                </button>

                <button
                  onClick={() => onNavigate('assistant')}
                  className="py-2.5 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer border border-stone-200 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-stone-600" />
                  <span>{language === 'ta' ? 'வேளாண் அலுவலரிடம் பேசு' : 'Consult KVK Officer'}</span>
                </button>
              </div>

              <button
                onClick={() => onNavigate('scan_crop')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'ta' ? 'புதிய இலையை ஸ்கேன் செய்ய' : 'Scan Leaf with AI Camera'}</span>
                <span>&rarr;</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          TAB 2: 5-VECTOR SURVEILLANCE DASHBOARD & INTERACTIVE SLIDERS
          ===================================================================== */}
      {activeTab === 'surveillance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif">
                  {language === 'ta' ? '5-காரணி நேரலை தொடர் கண்காணிப்பு' : 'Live 5-Vector Sentinel Surveillance'}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'ta'
                    ? 'நோய் மற்றும் பூச்சி ஆபத்தை தொடர்ந்து கண்காணிக்கும் 5 காரணிகள்'
                    : 'Real-time telemetry and heuristic weights feeding the Early Warning threshold engine'}
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                IoT Node: TN-TJ-NODE-02
              </span>
            </div>

            {/* 5 Monitored Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* 1. Disease Risk */}
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-red-900 uppercase">
                      {language === 'ta' ? '1. நோய் ஆபத்து' : '1. Disease Risk'}
                    </span>
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-stone-900 font-serif mt-1">
                    {currentAlertData.riskPercent}%
                  </div>
                  <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    Spore Incubation Active
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-2">
                  {currentAlertData.diseaseTarget}
                </p>
              </div>

              {/* 2. Pest Risk */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-900 uppercase">
                      {language === 'ta' ? '2. பூச்சி ஆபத்து' : '2. Pest Risk'}
                    </span>
                    <Bug className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-stone-900 font-serif mt-1">
                    {currentAlertData.telemetry.pestRisk}%
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    Trap Monitor: 8/card
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-2">
                  Whitefly & Leaf Miner
                </p>
              </div>

              {/* 3. Weather Conditions */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-blue-900 uppercase">
                      {language === 'ta' ? '3. வானிலை நிலை' : '3. Weather'}
                    </span>
                    <CloudRain className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-stone-900 font-serif mt-1">
                    {currentAlertData.telemetry.humidity}% RH
                  </div>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    {currentAlertData.telemetry.rainProb}% Rain • {currentAlertData.telemetry.temp}°C
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-2">
                  Dew: {currentAlertData.telemetry.leafWetnessHours} hrs continuous
                </p>
              </div>

              {/* 4. Crop Health */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase">
                      {language === 'ta' ? '4. பயிர் ஆரோக்கியம்' : '4. Crop Health'}
                    </span>
                    <Leaf className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-stone-900 font-serif mt-1">
                    {currentAlertData.telemetry.cropHealth}/100
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    Flowering Stage
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-2">
                  Tender blossom tissue
                </p>
              </div>

              {/* 5. Previous Disease Observations */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-stone-700 uppercase">
                      {language === 'ta' ? '5. முந்தைய நோய்' : '5. Disease History'}
                    </span>
                    <History className="w-4 h-4 text-stone-600" />
                  </div>
                  <div className="text-xs font-bold text-stone-900 mt-1 line-clamp-2">
                    {language === 'ta' ? currentAlertData.telemetry.previousDiseaseTa : currentAlertData.telemetry.previousDisease}
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded-full inline-block mt-1">
                    Plot 2 Carry-over
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  Dormant soil inoculum
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Sliders to test the real-time threshold alert generator */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-stone-900 font-serif">
                  {language === 'ta' ? 'நேரலை அளவுரு சோதனை (Interactive Risk Generator)' : 'Live Threshold Simulator (Adjust 5 Vectors)'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setCustomHumidity(84);
                  setCustomRainProb(72);
                  setCustomTemp(28);
                  setCustomCropHealth(74);
                  setCustomPreviousDisease('yes');
                  setCustomPestRisk(42);
                }}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Benchmark</span>
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-6">
              {language === 'ta'
                ? 'கீழேயுள்ள ஸ்லைடர்களை நகர்த்தி, 60% ஆபத்து வரம்பை தாண்டும்போது தானியங்கி எச்சரிக்கை எவ்வாறு உருவாகிறது என்பதை நேரடியாக பார்க்கலாம்.'
                : 'Adjust the sliders below to see how changes in humidity, rain, temperature, and historical disease trigger the automated Early Warning Alert when risk reaches 61-100%.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Slider 1: Relative Humidity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>Relative Humidity (%):</span>
                  <span className="font-mono text-blue-700 text-sm">{customHumidity}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={customHumidity}
                  onChange={(e) => {
                    setCustomHumidity(Number(e.target.value));
                    setActiveScenario('custom');
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>40% Dry</span>
                  <span className="text-red-600 font-bold">&gt;80% Critical Spore Risk</span>
                  <span>100% Saturated</span>
                </div>
              </div>

              {/* Slider 2: Rain Forecast */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>Rainfall Forecast Probability (%):</span>
                  <span className="font-mono text-emerald-700 text-sm">{customRainProb}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customRainProb}
                  onChange={(e) => {
                    setCustomRainProb(Number(e.target.value));
                    setActiveScenario('custom');
                  }}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>0% Clear Sky</span>
                  <span>50% Scattered Showers</span>
                  <span>100% Monsoon Downpour</span>
                </div>
              </div>

              {/* Slider 3: Temperature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>Ambient Temperature (°C):</span>
                  <span className="font-mono text-amber-700 text-sm">{customTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="40"
                  value={customTemp}
                  onChange={(e) => {
                    setCustomTemp(Number(e.target.value));
                    setActiveScenario('custom');
                  }}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>18°C Cool</span>
                  <span className="text-red-600 font-bold">26-29°C Peak Fungal Growth</span>
                  <span>40°C Heat Stress</span>
                </div>
              </div>

              {/* Slider 4: Crop Health Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>Crop Health / Canopy Vigor (0 - 100):</span>
                  <span className="font-mono text-emerald-700 text-sm">{customCropHealth}/100</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={customCropHealth}
                  onChange={(e) => {
                    setCustomCropHealth(Number(e.target.value));
                    setActiveScenario('custom');
                  }}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span className="text-red-600">30 Stressed</span>
                  <span>70 Moderate Standing</span>
                  <span>100 Robust Immunity</span>
                </div>
              </div>

              {/* Toggle: Previous Disease Symptoms */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 block">
                  Previous Disease Symptoms Recorded in Field:
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setCustomPreviousDisease('yes');
                      setActiveScenario('custom');
                    }}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      customPreviousDisease === 'yes'
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    Yes (Historical Early Blight in Plot 2)
                  </button>

                  <button
                    onClick={() => {
                      setCustomPreviousDisease('no');
                      setActiveScenario('custom');
                    }}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      customPreviousDisease === 'no'
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    No (Clean Sanitary Field)
                  </button>
                </div>
              </div>

              {/* Slider 5: Pest Risk Index */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>Pest Activity / Trap Counts (%):</span>
                  <span className="font-mono text-orange-700 text-sm">{customPestRisk}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customPestRisk}
                  onChange={(e) => {
                    setCustomPestRisk(Number(e.target.value));
                    setActiveScenario('custom');
                  }}
                  className="w-full accent-orange-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>0% Nil Traps</span>
                  <span>50% Moderate Alert</span>
                  <span>100% Outbreak</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600">
                Dynamic Prediction Result: <strong>{currentAlertData.riskPercent}% Risk ({currentAlertData.riskTier})</strong>
              </span>
              <button
                onClick={() => setActiveTab('alerts')}
                className="py-2 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                View Generated Alert Card &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: ALERT HISTORY (EXPLICIT USER MANDATE)
          ===================================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif">
                  {language === 'ta' ? 'எச்சரிக்கை வரலாறு மற்றும் தீர்வுகள்' : 'Historical Alerts & Mitigation Log'}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'ta'
                    ? 'முந்தைய முன்னெச்சரிக்கைகள், எடுக்கப்பட்ட நடவடிக்கைகள் மற்றும் காப்பாற்றப்பட்ட பயிர்கள்'
                    : 'Track record of past early warning alerts, farmer actions taken, and verified harvest preserved'}
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  onClick={() => setHistoryFilter('all')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    historyFilter === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All ({historyList.length})
                </button>
                <button
                  onClick={() => setHistoryFilter('Resolved')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    historyFilter === 'Resolved'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Resolved
                </button>
                <button
                  onClick={() => setHistoryFilter('Mitigated')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    historyFilter === 'Mitigated'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Mitigated
                </button>
              </div>
            </div>

            {/* History Cards List */}
            <div className="space-y-4">
              {filteredHistory.map((hist) => (
                <div
                  key={hist.id}
                  className="p-5 rounded-2xl border border-stone-200 hover:border-stone-300 bg-stone-50/50 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        hist.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : hist.status === 'Mitigated'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {hist.status}
                      </span>
                      <span className="text-xs text-stone-500 font-mono">
                        {language === 'ta' ? hist.timeTa : hist.time}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs font-semibold text-stone-700">
                        {language === 'ta' ? hist.affectedPlotTa : hist.affectedPlot}
                      </span>
                    </div>

                    {hist.cropSavedPct && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{hist.cropSavedPct}% {language === 'ta' ? 'பயிர் காப்பாற்றப்பட்டது' : 'Harvest Preserved'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 text-sm sm:text-base font-serif">
                      {language === 'ta' ? hist.titleTa : hist.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {language === 'ta' ? hist.descriptionTa : hist.description}
                    </p>
                  </div>

                  {/* Trigger Reason & Farmer Action Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-stone-200">
                      <span className="font-bold text-stone-500 uppercase tracking-wider block text-[10px] mb-1">
                        {language === 'ta' ? 'தூண்டிய காரணம் (Trigger Reason):' : 'Trigger Reason:'}
                      </span>
                      <p className="text-stone-800 font-medium">
                        {language === 'ta' ? hist.reasonTa : hist.reason}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-stone-200">
                      <span className="font-bold text-emerald-800 uppercase tracking-wider block text-[10px] mb-1">
                        {language === 'ta' ? 'விவசாயி எடுத்த நடவடிக்கை:' : 'Action Taken by Farmer:'}
                      </span>
                      <p className="text-stone-800 font-medium">
                        {language === 'ta' ? hist.actionTakenTa : hist.actionTaken}
                      </p>
                    </div>
                  </div>

                  {hist.resolvedDate && (
                    <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-200/60">
                      <span>Resolution verified: {hist.resolvedDate}</span>
                      <span className="text-emerald-700 font-semibold">Zero canopy lesion progression</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
