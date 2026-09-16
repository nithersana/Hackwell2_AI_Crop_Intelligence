import React from 'react';
import { Languages, Check, Volume2, ArrowRight } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/audioSpeech';

interface LanguageSelectScreenProps {
  language: Language;
  onSetLanguage: (lang: Language) => void;
  onNavigate: (screen: any) => void;
}

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  language,
  onSetLanguage,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];

  const handleTestAudio = (targetLang: Language) => {
    if (targetLang === 'ta') {
      speakText('வணக்கம் உழவரே! தமிழ் மொழி வெற்றிகரமாக தேர்ந்தெடுக்கப்பட்டது. அனைத்து பயிர் ஆலோசனைகளும் எளிய தமிழில் வழங்கப்படும்.', 'ta');
    } else {
      speakText('Welcome! English language is selected. All crop pathology advice and sensor warnings are now in English.', 'en');
    }
  };

  return (
    <div id="screen-language" className="space-y-6 max-w-2xl mx-auto px-4 py-8">
      {/* Header bar */}
      <div className="text-center pb-4 border-b border-stone-200">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
          <Languages className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
          {t.screens.language}
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          {language === 'ta'
            ? 'உங்கள் விருப்பத்திற்கேற்ப மொழியை மாற்றிக் கொள்ளலாம்'
            : 'Select your preferred language for interfaces, alerts, and voice readouts'}
        </p>
      </div>

      {/* Language Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tamil Card */}
        <div
          onClick={() => {
            onSetLanguage('ta');
            handleTestAudio('ta');
          }}
          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            language === 'ta'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-200'
              : 'border-stone-200 bg-white hover:border-emerald-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🇮🇳</span>
              {language === 'ta' && (
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-serif">தமிழ் (Tamil)</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              முழுமையான தமிழ் இடைமுகம், குரல் வழிகாட்டல் மற்றும் உள்ளூர் உழவர் சொற்கள்.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTestAudio('ta');
              }}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>குரல் மாதிரி கேள்</span>
            </button>
            <span className="text-xs font-bold text-stone-700">தமிழ் நடை</span>
          </div>
        </div>

        {/* English Card */}
        <div
          onClick={() => {
            onSetLanguage('en');
            handleTestAudio('en');
          }}
          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            language === 'en'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-200'
              : 'border-stone-200 bg-white hover:border-emerald-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🇬🇧</span>
              {language === 'en' && (
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-serif">English</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Standard agricultural and scientific terminology, dosage charts, and telemetry.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTestAudio('en');
              }}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Sample Audio</span>
            </button>
            <span className="text-xs font-bold text-stone-700">English Mode</span>
          </div>
        </div>
      </div>

      {/* Return to Dashboard */}
      <div className="pt-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span>{language === 'ta' ? 'முதன்மை பலகைக்குச் செல்' : 'Proceed to Main Dashboard'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
