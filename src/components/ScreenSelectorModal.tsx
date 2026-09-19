import React from 'react';
import { X, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

export type ScreenId =
  | 'splash'
  | 'login'
  | 'register'
  | 'profile'
  | 'dashboard'
  | 'my_farm'
  | 'add_crop'
  | 'scan_crop'
  | 'detection_result'
  | 'severity_analysis'
  | 'pest_detection'
  | 'disease_risk'
  | 'weather'
  | 'alerts'
  | 'recommendations'
  | 'timeline'
  | 'history'
  | 'knowledge_base'
  | 'assistant'
  | 'language'
  | 'settings';

interface ScreenDef {
  id: ScreenId;
  num: number;
  category: 'core' | 'ai_vision' | 'intelligence' | 'tools';
  icon: string;
}

export const ALL_SCREENS: ScreenDef[] = [
  // 1-6: Core Farm
  { id: 'splash', num: 1, category: 'core', icon: '🌱' },
  { id: 'login', num: 2, category: 'core', icon: '🔑' },
  { id: 'register', num: 3, category: 'core', icon: '📝' },
  { id: 'profile', num: 4, category: 'core', icon: '👨‍🌾' },
  { id: 'dashboard', num: 5, category: 'core', icon: '📊' },
  { id: 'my_farm', num: 6, category: 'core', icon: '🌾' },
  { id: 'add_crop', num: 7, category: 'core', icon: '➕' },

  // 8-12: AI Vision & Diagnostics
  { id: 'scan_crop', num: 8, category: 'ai_vision', icon: '📷' },
  { id: 'detection_result', num: 9, category: 'ai_vision', icon: '🔬' },
  { id: 'severity_analysis', num: 10, category: 'ai_vision', icon: '📈' },
  { id: 'pest_detection', num: 11, category: 'ai_vision', icon: '🐛' },
  { id: 'disease_risk', num: 12, category: 'ai_vision', icon: '📉' },

  // 13-16: Weather & Field Actions
  { id: 'weather', num: 13, category: 'intelligence', icon: '⛅' },
  { id: 'alerts', num: 14, category: 'intelligence', icon: '⚠️' },
  { id: 'recommendations', num: 15, category: 'intelligence', icon: '💊' },
  { id: 'timeline', num: 16, category: 'intelligence', icon: '⏳' },

  // 17-21: Assistant, Knowledge & Settings
  { id: 'history', num: 17, category: 'tools', icon: '📜' },
  { id: 'knowledge_base', num: 18, category: 'tools', icon: '📚' },
  { id: 'assistant', num: 19, category: 'tools', icon: '🤖' },
  { id: 'language', num: 20, category: 'tools', icon: '🌐' },
  { id: 'settings', num: 21, category: 'tools', icon: '⚙️' },
];

interface ScreenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  language: Language;
}

export const ScreenSelectorModal: React.FC<ScreenSelectorModalProps> = ({
  isOpen,
  onClose,
  activeScreen,
  onSelectScreen,
  language,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  const categories = [
    { key: 'core', label: t.categories.core, emoji: '🌾' },
    { key: 'ai_vision', label: t.categories.ai_vision, emoji: '🔬' },
    { key: 'intelligence', label: t.categories.intelligence, emoji: '⛅' },
    { key: 'tools', label: t.categories.tools, emoji: '🛠️' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 to-[#1b5e20] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold">
              📱
            </div>
            <div>
              <p className="text-xs text-emerald-100 font-medium mb-0.5">All 20 Screens Index</p>
              <h3 className="text-lg sm:text-xl font-bold font-serif">
                {language === 'ta' ? 'அனைத்து 20 திரைகள் வழிகாட்டி' : 'CropGuard AI - Complete 20 Screens'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Grouped Screens */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-stone-50">
          {categories.map((cat) => {
            const screensInCat = ALL_SCREENS.filter((s) => s.category === cat.key);

            return (
              <div key={cat.key} className="space-y-3">
                <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {screensInCat.map((s) => {
                    const isCurrent = activeScreen === s.id;
                    const screenTitle = t.screens[s.id];

                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          onSelectScreen(s.id);
                          onClose();
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isCurrent
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-500'
                            : 'bg-white border-stone-200 hover:border-emerald-300 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                            {String(s.num).padStart(2, '0')}
                          </span>
                          <span className="text-lg shrink-0">{s.icon}</span>
                          <span className="text-xs font-bold truncate">
                            {screenTitle}
                          </span>
                        </div>

                        {isCurrent ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-stone-300 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
