import React from 'react';
import { Home, Sprout, Camera, CloudSun, Bot, Grid } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { ScreenId } from './ScreenSelectorModal';

interface CropGuardBottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenScreenModal: () => void;
  language: Language;
}

export const CropGuardBottomNav: React.FC<CropGuardBottomNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenScreenModal,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* 1. Dashboard */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            currentScreen === 'dashboard' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">
            {t.uiTerms.dashboard}
          </span>
        </button>

        {/* 2. My Farm */}
        <button
          onClick={() => onNavigate('my_farm')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            currentScreen === 'my_farm' || currentScreen === 'add_crop'
              ? 'text-emerald-700'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Sprout className="w-5 h-5" />
          <span className="text-[10px] font-bold">
            {language === 'ta' ? 'பண்ணை' : 'Farm'}
          </span>
        </button>

        {/* 3. Central Prominent Scan Crop Camera Button */}
        <div className="relative -top-5">
          <button
            id="bottom-nav-camera-btn"
            onClick={() => onNavigate('scan_crop')}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-700 to-green-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer ring-4 ring-white"
            title={t.uiTerms.scanCrop}
          >
            <Camera className="w-7 h-7" />
          </button>
        </div>

        {/* 4. Weather */}
        <button
          onClick={() => onNavigate('weather')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            currentScreen === 'weather' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <CloudSun className="w-5 h-5" />
          <span className="text-[10px] font-bold">
            {t.uiTerms.weather}
          </span>
        </button>

        {/* 5. AI Assistant */}
        <button
          onClick={() => onNavigate('assistant')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            currentScreen === 'assistant' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span className="text-[10px] font-bold">
            {t.uiTerms.aiAssistant}
          </span>
        </button>

        {/* 6. All 20 Screens */}
        <button
          onClick={onOpenScreenModal}
          className="flex flex-col items-center gap-1 cursor-pointer text-stone-500 hover:text-emerald-700 transition-colors"
          title="All 20 Screens"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold">
            20 UI
          </span>
        </button>
      </div>
    </nav>
  );
};
