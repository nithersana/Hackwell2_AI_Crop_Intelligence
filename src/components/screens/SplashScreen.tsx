import React from 'react';
import { Sprout, ShieldCheck, Cpu, CloudSun, ChevronRight, Volume2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/audioSpeech';

interface SplashScreenProps {
  language: Language;
  onSetLanguage: (lang: Language) => void;
  onNavigate: (screen: any) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  language,
  onSetLanguage,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];

  const handleAudioGreeting = () => {
    if (language === 'ta') {
      speakText('வணக்கம் உழவரே! ஆரம்பகால பூச்சி மற்றும் நோய் தடுப்புக்கான கிராப்கார்ட் AI செயலிக்கு நல்வரவு. தொடங்குங்கள் பொத்தானை அழுத்தவும்.', 'ta');
    } else {
      speakText('Welcome to CropGuard AI. Adaptive Crop Intelligence for Early Pest and Disease Prevention. Tap Get Started to begin.', 'en');
    }
  };

  return (
    <div id="screen-splash" className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto text-center">
      {/* Main Logo & Leaf Graphic */}
      <div className="relative mb-6">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-emerald-600 via-green-700 to-[#1b5e20] text-white flex items-center justify-center shadow-xl shadow-emerald-900/20 border-4 border-emerald-100 mx-auto">
          <Sprout className="w-16 h-16 text-emerald-200" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-2xl shadow-md border-2 border-white">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* App Titles */}
      <h1 className="text-3xl sm:text-5xl font-bold text-emerald-950 font-serif tracking-tight mb-3">
        {t.appName}
      </h1>
      <p className="text-base sm:text-xl text-emerald-800/90 font-medium max-w-2xl leading-relaxed mb-8">
        {t.tagline}
      </p>

      {/* Audio Helper Banner */}
      <div className="w-full max-w-md bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm mb-8 flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">
              {language === 'ta' ? 'குரல் வழிகாட்டுதல்' : 'Voice Assistant Readout'}
            </p>
            <p className="text-sm font-bold text-stone-800">
              {language === 'ta' ? 'விளக்கத்தைக் கேளுங்கள்' : 'Hear Audio Introduction'}
            </p>
          </div>
        </div>
        <button
          id="splash-audio-btn"
          onClick={handleAudioGreeting}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          {t.common.listenAudio}
        </button>
      </div>

      {/* Language Quick Selection */}
      <div className="w-full max-w-md mb-8">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
          {language === 'ta' ? 'மொழியைத் தேர்ந்தெடுக்கவும்' : 'Choose Your Language'}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            id="splash-lang-en"
            onClick={() => onSetLanguage('en')}
            className={`p-3.5 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
              language === 'en'
                ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm'
                : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-300'
            }`}
          >
            <span className="text-base">🇬🇧 English</span>
            <span className="text-[11px] font-normal text-stone-500">Default Mode</span>
          </button>
          <button
            id="splash-lang-ta"
            onClick={() => onSetLanguage('ta')}
            className={`p-3.5 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
              language === 'ta'
                ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm'
                : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-300'
            }`}
          >
            <span className="text-base">🇮🇳 தமிழ்</span>
            <span className="text-[11px] font-normal text-stone-500">உழவர் நடை</span>
          </button>
        </div>
      </div>

      {/* Primary Call to Action Button */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <button
          id="splash-get-started-btn"
          onClick={() => onNavigate('dashboard')}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-lg shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98"
        >
          <span>{language === 'ta' ? 'பண்ணைக்குள் நுழையுங்கள்' : 'Open CropGuard Dashboard'}</span>
          <ChevronRight className="w-6 h-6" />
        </button>

        <button
          id="splash-login-btn"
          onClick={() => onNavigate('login')}
          className="w-full py-3 px-4 rounded-xl bg-white border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors cursor-pointer"
        >
          {language === 'ta' ? 'உள்நுழைவு / புதிய பதிவு' : 'Farmer Login / Registration'}
        </button>
      </div>

      {/* Core Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mt-12 text-left">
        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-emerald-100 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
            <Cpu className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">
            {language === 'ta' ? 'AI இலை ஸ்கேன்' : 'Computer Vision AI'}
          </h4>
          <p className="text-xs text-stone-600 mt-1">
            {language === 'ta' ? 'இலைப்படத்தை எடுத்து நொடியில் நோய் கண்டறியலாம்' : 'Instant 96%+ accuracy disease & pest diagnosis from photos'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-emerald-100 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
            <CloudSun className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">
            {language === 'ta' ? 'வானிலை & பூஞ்சை கணிப்பு' : '72h Outbreak Model'}
          </h4>
          <p className="text-xs text-stone-600 mt-1">
            {language === 'ta' ? 'ஈரப்பதம் மற்றும் வெப்பநிலையைக் கொண்டு முன்கூட்டியே எச்சரிக்கை' : 'Predict spore germination before visible foliar lesions appear'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-emerald-100 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">
            {language === 'ta' ? 'இயற்கை & ரசாயன தீர்வு' : 'Vernacular IPM Advice'}
          </h4>
          <p className="text-xs text-stone-600 mt-1">
            {language === 'ta' ? 'தெளிப்பான் தொட்டிக்கான துல்லியமான மருந்து அளவு வழிகாட்டல்' : 'Step-by-step bio & chemical doses tailored for farmers'}
          </p>
        </div>
      </div>
    </div>
  );
};
