import React from 'react';
import { Sprout, Bell, Languages, Menu, Grid, ShieldCheck, ChevronDown, LogOut, UserPlus, LogIn } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { ScreenId, ALL_SCREENS } from './ScreenSelectorModal';
import { FarmerUser } from '../types';

interface CropGuardHeaderProps {
  language: Language;
  onSetLanguage: (lang: Language) => void;
  currentScreen: ScreenId;
  onOpenScreenModal: () => void;
  onNavigate: (screen: ScreenId) => void;
  alertCount: number;
  currentUser?: FarmerUser | null;
  onLogout?: () => void;
}

export const CropGuardHeader: React.FC<CropGuardHeaderProps> = ({
  language,
  onSetLanguage,
  currentScreen,
  onOpenScreenModal,
  onNavigate,
  alertCount,
  currentUser,
  onLogout,
}) => {
  const t = TRANSLATIONS[language];
  const screenDef = ALL_SCREENS.find((s) => s.id === currentScreen) || ALL_SCREENS[4];
  const currentTitle = t.screens[currentScreen];

  const getInitials = (name?: string) => {
    if (!name) return 'AM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isAuthScreen = currentScreen === 'login' || currentScreen === 'register';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Applet Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => onNavigate(currentUser ? 'dashboard' : 'login')}
            className="flex items-center gap-2 cursor-pointer text-left group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-700 to-green-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-stone-900 tracking-tight text-base font-serif">
                  CropGuard AI
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  2.0
                </span>
              </div>
              <p className="text-[10px] text-stone-500 truncate max-w-[200px]">
                {t.tagline}
              </p>
            </div>
          </button>

          {/* Quick Screen Selector Trigger Pill */}
          <button
            id="btn-open-screen-modal"
            onClick={onOpenScreenModal}
            className="flex items-center gap-1.5 py-1 px-2 sm:px-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Switch Screens"
          >
            <span className="text-sm">{screenDef.icon}</span>
            <span className="font-bold text-stone-900 truncate max-w-[100px] sm:max-w-[150px]">
              {currentTitle}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>

        {/* Right Controls: Trilingual Selector + Alerts + Profile / Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Trilingual Toggle Pill (Tamil, English, Hindi) */}
          <div className="flex items-center p-0.5 bg-stone-100 rounded-xl border border-stone-200 text-xs font-bold">
            <button
              onClick={() => onSetLanguage('ta')}
              className={`py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                language === 'ta'
                  ? 'bg-white text-emerald-900 shadow-xs font-black'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="தமிழ் (Tamil)"
            >
              தமிழ்
            </button>
            <button
              onClick={() => onSetLanguage('en')}
              className={`py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-emerald-900 shadow-xs font-black'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onSetLanguage('hi')}
              className={`py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                language === 'hi'
                  ? 'bg-white text-emerald-900 shadow-xs font-black'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="हिन्दी (Hindi)"
            >
              हिन्दी
            </button>
          </div>

          {!isAuthScreen && (
            <>
              {/* Alerts Bell */}
              <button
                onClick={() => onNavigate('alerts')}
                className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors relative cursor-pointer"
                title="Early Warning Alerts"
              >
                <Bell className="w-5 h-5" />
                {alertCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {alertCount}
                  </span>
                )}
              </button>

              {/* Profile Quick Link */}
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 p-1 sm:pl-2 sm:pr-3 rounded-xl hover:bg-stone-100 text-left transition-colors cursor-pointer border border-transparent hover:border-stone-200"
                title="Farmer Profile"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center border border-amber-300 shrink-0">
                  {getInitials(currentUser?.fullName)}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-stone-900 leading-none truncate max-w-[110px]">
                    {currentUser?.fullName || t.farmer.name}
                  </p>
                  <p className="text-[10px] text-stone-500 leading-none mt-1">
                    {currentUser ? `${currentUser.farmSize} ${currentUser.farmSizeUnit}` : t.farmer.landSize}
                  </p>
                </div>
              </button>

              {/* Logout Button */}
              {onLogout && (
                <button
                  id="btn-header-logout"
                  onClick={onLogout}
                  className="p-2 rounded-xl text-stone-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                  title={t.auth.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {isAuthScreen && (
            <div className="flex items-center gap-1.5">
              {currentScreen === 'login' ? (
                <button
                  onClick={() => onNavigate('register')}
                  className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.auth.registerTitle}</span>
                  <span className="sm:hidden">{t.uiTerms.register}</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.auth.loginTitle}</span>
                  <span className="sm:hidden">{t.uiTerms.login}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
