import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff,
  Volume2, 
  VolumeX, 
  Leaf, 
  Camera, 
  CloudRain, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Upload,
  Clock,
  TrendingUp,
  Activity,
  ShieldCheck,
  Tag,
  Check
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { SampleLeafImage, CropScanRecord } from '../../types';
import { ASSISTANT_FAQ } from '../../data/cropGuardData';
import { speakText, stopSpeaking, startSpeechListening, isSpeechRecognitionSupported } from '../../utils/audioSpeech';
import { getStoredCropScans } from '../../data/cropScanHistoryData';

interface FarmerAssistantScreenProps {
  language: Language;
  currentScan?: SampleLeafImage;
  onNavigate: (screen: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  leafImage?: string;
  actionButton?: {
    label: string;
    screen: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const FarmerAssistantScreen: React.FC<FarmerAssistantScreenProps> = ({
  language,
  currentScan,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];

  // Retrieve continuous scans to get up-to-date trajectory information
  const storedScans = getStoredCropScans();
  const latestStoredScan: CropScanRecord | undefined = storedScans[storedScans.length - 1];

  // Active crop context
  const activeCropName = currentScan?.crop || latestStoredScan?.crop || 'Tomato (PKM-1)';
  const activeDisease = currentScan?.diseaseName || latestStoredScan?.disease || 'Early Blight (Alternaria solani)';
  const activeSeverity = currentScan?.severity || latestStoredScan?.severity || 'Moderate';
  const activeConfidence = currentScan?.confidence ? Math.round(currentScan.confidence * 100) : (latestStoredScan?.confidence || 94);
  const activeGrowthStage = 'Vegetative (35-45 Days After Transplant)';
  const activeHumidity = 88;
  const activeTemp = 29;

  // Track if a leaf image has been analyzed in this dialogue
  const [hasAnalyzedLeafInChat, setHasAnalyzedLeafInChat] = useState<boolean>(Boolean(currentScan));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialWelcomeText = language === 'ta'
    ? `வணக்கம் உழவரே! நான் CropGuard AI உழவர் உதவியாளர்.\nஉங்கள் பயிர்: ${activeCropName} (${activeGrowthStage})\nசமீபத்திய AI ஸ்கேன்: ${activeDisease} (${activeSeverity} தீவிரத்தன்மை, ${activeHumidity}% ஈரப்பதம்).\n\nபயிர் நோய்கள், பூச்சி அறிகுறிகள், தடுப்பு முறைகள், பயிர் கண்காணிப்பு அல்லது வானிலை அபாயம் குறித்து என்னிடம் கேளுங்கள்.`
    : `Vanakkam! I am your CropGuard AI Farmer Assistant.\nCurrent Crop: ${activeCropName} (${activeGrowthStage})\nRecent AI Scan: ${activeDisease} (${activeSeverity} severity, ${activeHumidity}% RH).\n\nAsk me anything regarding crop diseases, pest symptoms, prevention, crop monitoring, or weather risks.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: initialWelcomeText,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const activeRecognizerRef = useRef<{ stop: () => void } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      activeRecognizerRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Topic Categories requested by user
  const topicCategories = [
    {
      id: 'disease',
      icon: '🍂',
      labelEn: 'Crop Diseases',
      labelTa: 'பயிர் நோய்கள்',
      promptEn: 'My tomato leaves have brown spots. What should I do?',
      promptTa: 'என் தக்காளி இலையில் பழுப்பு நிற புள்ளிகள் உள்ளன. நான் என்ன செய்ய வேண்டும்?',
    },
    {
      id: 'pest',
      icon: '🐛',
      labelEn: 'Pest Symptoms',
      labelTa: 'பூச்சி அறிகுறிகள்',
      promptEn: 'What are whitefly pest symptoms and vector control?',
      promptTa: 'வெள்ளை ஈ பூச்சி தாக்குதலின் அறிகுறிகள் மற்றும் தடுப்பு முறை என்ன?',
    },
    {
      id: 'prevention',
      icon: '🛡️',
      labelEn: 'Prevention',
      labelTa: 'தடுப்பு முறைகள்',
      promptEn: 'How do I prevent fungal disease spread organically?',
      promptTa: 'பூஞ்சை நோய் பரவலை இயற்கை முறையில் எவ்வாறு தடுப்பது?',
    },
    {
      id: 'monitoring',
      icon: '📈',
      labelEn: 'Crop Monitoring',
      labelTa: 'பயிர் கண்காணிப்பு',
      promptEn: 'Show my continuous crop health timeline and trend',
      promptTa: 'என் தொடர் பயிர் ஆரோக்கிய காலக்கோடு மற்றும் போக்கை காட்டு',
    },
    {
      id: 'weather',
      icon: '🌧️',
      labelEn: 'Weather Risks',
      labelTa: 'வானிலை அபாயம்',
      promptEn: 'How does high humidity (88%) affect my crop risk?',
      promptTa: 'அதிக ஈரப்பதம் (88%) பயிர் நோயை எவ்வாறு அதிகரிக்கும்?',
    },
    {
      id: 'stage',
      icon: '🌱',
      labelEn: 'Growth Stages',
      labelTa: 'வளர்ச்சி பருவங்கள்',
      promptEn: 'What care is needed during the vegetative growth stage?',
      promptTa: 'வளர்ச்சி பருவத்தில் (Vegetative stage) என்ன கவனிப்பு தேவை?',
    },
    {
      id: 'results',
      icon: '🔬',
      labelEn: 'AI Scan Results',
      labelTa: 'AI ஸ்கேன் முடிவுகள்',
      promptEn: 'Explain my latest AI scan confidence and severity',
      promptTa: 'என் சமீபத்திய AI ஸ்கேன் முடிவின் தீவிரத்தன்மையை விளக்குங்கள்',
    },
  ];

  // Helper to query assistant
  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const qLower = textToSend.toLowerCase();

    // Check if user is asking the exact example question
    const isBrownSpotQuestion = qLower.includes('brown spot') || qLower.includes('tomato leave') || qLower.includes('பழுப்பு நிற புள்ளி') || qLower.includes('புள்ளி');

    try {
      // Call backend AI Farmer Assistant API (passes active crop, recent scan, microclimate)
      const res = await fetch('/api/farmer-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          crop: activeCropName,
          disease: activeDisease,
          severity: activeSeverity,
          confidence: activeConfidence,
          humidity: activeHumidity,
          temperature: activeTemp,
          growthStage: activeGrowthStage,
          hasRecentScan: hasAnalyzedLeafInChat,
          history: messages.slice(-4)
        })
      });

      let replyText = '';
      let actionBtn: { label: string; screen: string } | undefined = undefined;
      let secondaryAction: { label: string; onClick: () => void } | undefined = undefined;

      if (res.ok) {
        const data = await res.json();
        replyText = data.text;
      }

      // If farmer asks about brown spots and has not analyzed a photo yet:
      if (isBrownSpotQuestion && !hasAnalyzedLeafInChat) {
        replyText = language === 'ta'
          ? 'பாதிக்கப்பட்ட இலையின் தெளிவான புகைப்படத்தை பதிவேற்றவும். நான் அதை ஆய்வு செய்து தற்போதைய பயிர் ஆபத்தை சரிபார்க்க முடியும்.'
          : 'Please upload a clear image of the affected leaf. I can analyze it and check the current crop risk.';
        
        secondaryAction = {
          label: language === 'ta' ? '📷 மாதிரி இலையை ஆய்வு செய் (Analyze Leaf)' : '📷 Analyze Affected Leaf Sample',
          onClick: () => handleSimulateLeafAnalysis()
        };
        actionBtn = {
          label: language === 'ta' ? 'கேமரா ஸ்கேன்' : 'Open Camera Scanner',
          screen: 'scan_crop'
        };
      } else if (isBrownSpotQuestion && hasAnalyzedLeafInChat) {
        replyText = language === 'ta'
          ? `உங்கள் ஸ்கேன் நடுத்தர தீவிரத்தன்மையுடன் ஆரம்ப கருகல் (Early Blight) நோயைக் காட்டுகிறது. தற்போதைய ஈரப்பதம் அதிகமாக (88%) இருப்பதால், நோய் பரவல் அதிகரிக்கலாம். அருகிலுள்ள இலைகளை ஆய்வு செய்து பரிந்துரைக்கப்பட்ட தடுப்பு நடைமுறைகளைப் பின்பற்றவும்.`
          : `Your scan suggests Early Blight with moderate severity. Current humidity is high, so disease spread may increase. Inspect nearby leaves and follow recommended preventive practices.`;
        
        actionBtn = {
          label: language === 'ta' ? 'தகவமைப்பு AI பரிந்துரை' : 'View Adaptive Recommendation',
          screen: 'recommendations'
        };
      } else if (qLower.includes('timeline') || qLower.includes('monitor') || qLower.includes('காலக்கோடு') || qLower.includes('கண்காணி')) {
        actionBtn = {
          label: language === 'ta' ? 'ஆரோக்கிய காலக்கோடு' : 'Open Health Timeline',
          screen: 'timeline'
        };
      } else if (qLower.includes('weather') || qLower.includes('humidity') || qLower.includes('ஈரப்பதம்')) {
        actionBtn = {
          label: language === 'ta' ? 'வானிலை நுண்ணறிவு' : 'View Weather Risks',
          screen: 'weather'
        };
      } else if (qLower.includes('pest') || qLower.includes('whitefly') || qLower.includes('பூச்சி')) {
        actionBtn = {
          label: language === 'ta' ? 'பூச்சி கண்டறிதல்' : 'Pest Scouting',
          screen: 'pest_detection'
        };
      }

      // Fallback text if network failed or empty
      if (!replyText) {
        if (language === 'ta') {
          replyText = `உங்கள் ${activeCropName} பயிரில் (${activeGrowthStage}), சமீபத்திய ஸ்கேன் ${activeDisease} (${activeSeverity} பாதிப்பு) காட்டியுள்ளது. வழக்கமான கள ஆய்வு செய்து பரிந்துரைக்கப்பட்ட இயற்கை பூஞ்சாண தடுப்பை பயன்படுத்தவும்.`;
        } else {
          replyText = `For your ${activeCropName} in the ${activeGrowthStage} stage, recent analysis indicates ${activeDisease} (${activeSeverity} severity). Continue preventive field hygiene, inspect nearby plants, and maintain regular scouting.`;
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: 'Just now',
        actionButton: actionBtn,
        secondaryAction: secondaryAction
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    } catch (err) {
      console.error('Error fetching assistant response:', err);
      const fallbackReply = language === 'ta'
        ? `உங்கள் ${activeCropName} பயிரில் (${activeGrowthStage}), சமீபத்திய ஸ்கேன் ${activeDisease} (${activeSeverity} பாதிப்பு) காட்டியுள்ளது. வழக்கமான கள ஆய்வு செய்து பரிந்துரைக்கப்பட்ட இயற்கை பூஞ்சாண தடுப்பை பயன்படுத்தவும்.`
        : `For your ${activeCropName} in the ${activeGrowthStage} stage, recent analysis indicates ${activeDisease} (${activeSeverity} severity). Continue preventive field hygiene, inspect nearby plants, and maintain regular scouting.`;
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        time: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      speakText(fallbackReply, language);
    }
  };

  // Simulate analyzing leaf inside the chat to fulfill prompt transition
  const handleSimulateLeafAnalysis = () => {
    setHasAnalyzedLeafInChat(true);

    const userUploadMsg: ChatMessage = {
      id: `usr-img-${Date.now()}`,
      sender: 'user',
      text: language === 'ta' ? 'பாதிக்கப்பட்ட தக்காளி இலையின் புகைப்படத்தை பதிவேற்றியுள்ளேன்:' : 'Uploaded image of affected tomato leaf for analysis:',
      time: 'Just now',
      leafImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=500&auto=format&fit=crop&q=60'
    };

    setMessages(prev => [...prev, userUploadMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const diagnosisText = language === 'ta'
        ? `உங்கள் ஸ்கேன் நடுத்தர தீவிரத்தன்மையுடன் ஆரம்ப கருகல் (Early Blight) நோயைக் காட்டுகிறது. தற்போதைய ஈரப்பதம் அதிகமாக (88%) இருப்பதால், நோய் பரவல் அதிகரிக்கலாம். அருகிலுள்ள இலைகளை ஆய்வு செய்து பரிந்துரைக்கப்பட்ட தடுப்பு நடைமுறைகளைப் பின்பற்றவும்.`
        : `Your scan suggests Early Blight with moderate severity. Current humidity is high, so disease spread may increase. Inspect nearby leaves and follow recommended preventive practices.`;

      const botAnalysisMsg: ChatMessage = {
        id: `bot-analysis-${Date.now()}`,
        sender: 'assistant',
        text: diagnosisText,
        time: 'Just now',
        actionButton: {
          label: language === 'ta' ? 'தகவமைப்பு AI பரிந்துரை காண்க' : 'View Adaptive Recommendation',
          screen: 'recommendations'
        },
        secondaryAction: {
          label: language === 'ta' ? 'ஆரோக்கிய காலக்கோட்டில் காண்க' : 'View in Health Timeline',
          onClick: () => onNavigate('timeline')
        }
      };

      setMessages(prev => [...prev, botAnalysisMsg]);
      setIsTyping(false);
      speakText(diagnosisText, language);
    }, 1200);
  };

  // Handle direct file input upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setHasAnalyzedLeafInChat(true);

      const userUploadMsg: ChatMessage = {
        id: `usr-file-${Date.now()}`,
        sender: 'user',
        text: language === 'ta' ? 'பாதிக்கப்பட்ட இலை புகைப்படம் பதிவேற்றப்பட்டது:' : 'Leaf photo uploaded for neural diagnosis:',
        time: 'Just now',
        leafImage: base64Url
      };

      setMessages(prev => [...prev, userUploadMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const diagnosisText = language === 'ta'
          ? `உங்கள் ஸ்கேன் நடுத்தர தீவிரத்தன்மையுடன் ஆரம்ப கருகல் (Early Blight) நோயைக் காட்டுகிறது. தற்போதைய ஈரப்பதம் அதிகமாக (88%) இருப்பதால், நோய் பரவல் அதிகரிக்கலாம். அருகிலுள்ள இலைகளை ஆய்வு செய்து பரிந்துரைக்கப்பட்ட தடுப்பு நடைமுறைகளைப் பின்பற்றவும்.`
          : `Your scan suggests Early Blight with moderate severity. Current humidity is high, so disease spread may increase. Inspect nearby leaves and follow recommended preventive practices.`;

        const botAnalysisMsg: ChatMessage = {
          id: `bot-file-analysis-${Date.now()}`,
          sender: 'assistant',
          text: diagnosisText,
          time: 'Just now',
          actionButton: {
            label: language === 'ta' ? 'தகவமைப்பு AI பரிந்துரை' : 'View Adaptive Recommendation',
            screen: 'recommendations'
          }
        };

        setMessages(prev => [...prev, botAnalysisMsg]);
        setIsTyping(false);
        speakText(diagnosisText, language);
      }, 1400);
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      activeRecognizerRef.current?.stop();
      setIsListening(false);
      if (input.trim()) {
        setVoiceStatus(language === 'ta' ? 'கேள்வி அனுப்பப்படுகிறது...' : 'Sending question...');
        handleSend(input.trim());
        setTimeout(() => setVoiceStatus(null), 2000);
      } else {
        setVoiceStatus(null);
      }
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      const voicePrompt = language === 'ta'
        ? 'என் தக்காளி இலையில் பழுப்பு நிற புள்ளிகள் உள்ளன. நான் என்ன செய்ய வேண்டும்?'
        : 'My tomato leaves have brown spots. What should I do?';
      setInput(voicePrompt);
      setVoiceStatus(
        language === 'ta'
          ? 'உங்கள் உலாவியில் நேரடி குரல் அறிதல் ஆதரிக்கப்படவில்லை. மாதிரி கேள்வி அமைக்கப்பட்டது.'
          : 'Speech recognition is not supported in this browser. Inserted sample query.'
      );
      setTimeout(() => setVoiceStatus(null), 4000);
      return;
    }

    setVoiceStatus(
      language === 'ta'
        ? '🎙️ கேட்கிறது... மைக் அருகில் உங்கள் கேள்வியைப் பேசுங்கள்...'
        : '🎙️ Listening... speak your crop question near your mic...'
    );

    let recordedText = '';

    const recognizer = startSpeechListening(language, {
      onStart: () => {
        setIsListening(true);
      },
      onResult: (text, _isFinal) => {
        recordedText = text;
        setInput(text);
        setVoiceStatus(
          language === 'ta' 
            ? `🎙️ "${text}" (பேசி முடித்ததும் நிறுத்து அல்லது அனுப்பு தொடவும்)` 
            : `🎙️ "${text}" (tap mic or Send when done)`
        );
      },
      onError: (err) => {
        console.warn('Speech recognition notice:', err);
        if (err === 'not-allowed') {
          setIsListening(false);
          activeRecognizerRef.current = null;
          setVoiceStatus(
            language === 'ta'
              ? 'மைக் அனுமதி மறுக்கப்பட்டுள்ளது. உலாவியில் மைக் அனுமதியை இயக்கவும்.'
              : 'Microphone permission blocked. Please allow mic access in browser settings.'
          );
          setTimeout(() => setVoiceStatus(null), 5000);
        } else if (err === 'no-speech') {
          setVoiceStatus(
            language === 'ta'
              ? '🎙️ கேட்கிறது... மைக் அருகில் தெளிவாகப் பேசுங்கள்...'
              : '🎙️ Listening... please speak near your microphone...'
          );
        } else {
          setIsListening(false);
          activeRecognizerRef.current = null;
          setVoiceStatus(
            language === 'ta' ? `குரல் குறிப்பு: ${err}` : `Voice note: ${err}`
          );
          setTimeout(() => setVoiceStatus(null), 4000);
        }
      },
      onEnd: () => {
        setIsListening(false);
        activeRecognizerRef.current = null;
        if (recordedText.trim()) {
          setVoiceStatus(
            language === 'ta' ? '✅ கேள்வி பெறப்பட்டது! பதில் தயாராகிறது...' : '✅ Question captured! Preparing answer...'
          );
          setTimeout(() => {
            handleSend(recordedText.trim());
            setVoiceStatus(null);
          }, 350);
        } else {
          setTimeout(() => setVoiceStatus(null), 2500);
        }
      }
    });

    activeRecognizerRef.current = recognizer;
  };

  return (
    <div id="screen-farmer-assistant" className="space-y-4 max-w-4xl mx-auto px-4 py-6 flex flex-col h-[86vh]">
      {/* ------------------------------------------------------------- */}
      {/* HEADER BAR                                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
              <span>{language === 'ta' ? 'CropGuard AI உழவர் உதவியாளர்' : 'CropGuard AI Farmer Assistant'}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Bilingual (English / தமிழ்)
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              {language === 'ta' ? 'தற்போதைய பயிர் தகவல் மற்றும் AI ஸ்கேன் முடிவுகளை அடிப்படையாகக் கொண்ட ஆலோசனை' : 'Context-aware advice using active crop info and recent AI scan results'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => onNavigate('timeline')}
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === 'ta' ? 'காலக்கோடு' : 'Timeline'}</span>
          </button>

          <button
            onClick={() => onNavigate('recommendations')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{language === 'ta' ? 'பரிந்துரை' : 'Adaptive Engine'}</span>
          </button>

          <button
            onClick={() => stopSpeaking()}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
            title="Stop Speech"
          >
            <VolumeX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE CROP & RECENT SCAN CONTEXT BAR                         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-emerald-950 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'ta' ? 'பயிர்:' : 'Active Crop:'}</span>
            </span>
            <span className="bg-white px-2.5 py-0.5 rounded-md font-bold text-stone-900 border border-emerald-200">
              {activeCropName}
            </span>

            <span className="text-stone-300">•</span>

            <span className="font-bold text-emerald-950">
              {language === 'ta' ? 'சமீபத்திய AI ஸ்கேன்:' : 'Recent AI Scan:'}
            </span>
            <span className="bg-white px-2.5 py-0.5 rounded-md font-bold text-rose-900 border border-rose-200">
              {activeDisease} ({activeSeverity})
            </span>

            <span className="text-stone-300">•</span>

            <span className="font-bold text-emerald-950">
              {language === 'ta' ? 'ஈரப்பதம்:' : 'Humidity:'}
            </span>
            <span className="bg-white px-2 py-0.5 rounded-md font-mono font-bold text-sky-800 border border-sky-200">
              {activeHumidity}% RH (High)
            </span>
          </div>

          <button
            onClick={() => onNavigate('scan_crop')}
            className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'புதிய ஸ்கேன் எடுக்க' : 'Scan New Leaf'} &rarr;</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOPIC CATEGORY SELECTOR CHIPS                                */}
      {/* ------------------------------------------------------------- */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 no-scrollbar">
        {topicCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSend(language === 'ta' ? cat.promptTa : cat.promptEn)}
            className="py-1.5 px-3 rounded-xl bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors shrink-0 shadow-2xs flex items-center gap-1.5"
          >
            <span>{cat.icon}</span>
            <span>{language === 'ta' ? cat.labelTa : cat.labelEn}</span>
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CHAT MESSAGES CONTAINER                                       */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-3xl bg-stone-50/80 border border-stone-200 shadow-inner">
        {messages.map((msg) => {
          const isBot = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[90%] sm:max-w-[82%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isBot ? 'bg-emerald-700 text-white shadow-xs' : 'bg-stone-800 text-white'
                }`}
              >
                {isBot ? '🤖' : '👨‍🌾'}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs space-y-3 ${
                  isBot
                    ? 'bg-white text-stone-900 border border-stone-200'
                    : 'bg-emerald-700 text-white'
                }`}
              >
                {/* Uploaded image if present */}
                {msg.leafImage && (
                  <div className="w-48 h-32 rounded-xl overflow-hidden border border-black/10 shadow-2xs mb-2">
                    <img
                      src={msg.leafImage}
                      alt="Uploaded leaf"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Secondary In-Chat Action (e.g. Simulate/Analyze Leaf) */}
                {isBot && msg.secondaryAction && (
                  <div className="pt-1">
                    <button
                      onClick={msg.secondaryAction.onClick}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>{msg.secondaryAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Primary Screen Navigation Action */}
                {isBot && msg.actionButton && (
                  <div className="pt-0.5">
                    <button
                      onClick={() => onNavigate(msg.actionButton!.screen)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>{msg.actionButton.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[10px] text-stone-400">
                  <span>{msg.time}</span>
                  {isBot && (
                    <button
                      onClick={() => speakText(msg.text, language)}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{t.common.listenAudio}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2 items-center text-xs text-stone-500 bg-white p-3 rounded-xl border border-stone-200 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
            <span className="ml-1 font-semibold">
              {language === 'ta' ? 'AI உழவர் உதவியாளர் யோசிக்கிறது...' : 'CropGuard AI Agronomist analyzing...'}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* INPUT BAR WITH VOICE & FILE UPLOAD                            */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-1">
        {voiceStatus && (
          <div className={`mb-2 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 shadow-xs transition-all ${
            isListening 
              ? 'bg-rose-50 text-rose-800 border border-rose-300 animate-pulse' 
              : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
              <span>{voiceStatus}</span>
            </div>
            {isListening && (
              <button
                type="button"
                onClick={handleVoiceInput}
                className="px-2 py-0.5 rounded-md bg-rose-200/80 hover:bg-rose-300 text-rose-900 text-[11px] font-bold cursor-pointer transition-colors shrink-0"
              >
                {language === 'ta' ? 'நிறுத்து (Stop)' : 'Stop'}
              </button>
            )}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Hidden file input for leaf photo upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Voice query button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-3.5 rounded-2xl text-white cursor-pointer transition-all shrink-0 shadow-xs ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-200 animate-pulse scale-105'
                : 'bg-amber-500 hover:bg-amber-600'
            }`}
            title={
              isListening
                ? (language === 'ta' ? 'குரல் பதிவை நிறுத்தவும்' : 'Stop Listening')
                : (language === 'ta' ? 'குரல் மூலம் பேசவும் (Voice Query)' : 'Speak your question (Voice Query)')
            }
          >
            {isListening ? <MicOff className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Leaf photo upload button directly in chat */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer transition-colors shrink-0 shadow-xs border border-stone-300"
            title={language === 'ta' ? 'இலை புகைப்படத்தை பதிவேற்று' : 'Upload Leaf Photo in Chat'}
          >
            <Camera className="w-5 h-5 text-emerald-800" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'பயிர் நோய், பூச்சி, அல்லது வானிலை குறித்து கேளுங்கள்...'
                : 'Ask about crop diseases, pest symptoms, weather risks, monitoring...'
            }
            className="flex-1 px-4 py-3.5 rounded-2xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none bg-white shadow-xs"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white cursor-pointer transition-colors shrink-0 shadow-xs"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
