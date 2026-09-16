import React, { useState } from 'react';
import { Settings, Bell, Wifi, Volume2, Shield, MapPin, CheckCircle2, Save } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';

interface SettingsScreenProps {
  language: Language;
  onNavigate: (screen: any) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  language,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState('normal');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div id="screen-settings" className="space-y-6 max-w-3xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-700" />
            <span>{t.screens.settings}</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'ta'
              ? 'பண்ணை அறிவிப்புகள், குரல் வேகம் மற்றும் ஆஃப்லைன் அமைப்புகள்'
              : 'SMS notification channels, speech cadence, and offline field sync'}
          </p>
        </div>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-700 text-white rounded-xl shadow-md text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{language === 'ta' ? 'அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!' : 'Farmer configuration saved successfully!'}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Voice Assistance Cadence */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-stone-900 text-sm">
              {language === 'ta' ? 'குரல் வழிகாட்டுதல் வேகம் (Voice Speed)' : 'Speech Output Cadence'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setVoiceSpeed('slow')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                voiceSpeed === 'slow'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                  : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              {language === 'ta' ? 'மெதுவாக (முதிய உழவர்களுக்காக)' : 'Slower (Farmer Clarity)'}
            </button>
            <button
              type="button"
              onClick={() => setVoiceSpeed('normal')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                voiceSpeed === 'normal'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                  : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              {language === 'ta' ? 'இயல்பான வேகம்' : 'Standard Rate'}
            </button>
          </div>
        </div>

        {/* SMS / WhatsApp Early Warning Alerts */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-stone-900 text-sm">
              {language === 'ta' ? 'முன்னெச்சரிக்கை அறிவிப்பு வழிகள்' : 'Early Warning Alert Dispatch'}
            </h3>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
            <div>
              <p className="font-bold text-xs text-stone-900">
                {language === 'ta' ? 'தமிழில் உடனடி SMS எச்சரிக்கை' : 'Instant SMS Alerts in Tamil'}
              </p>
              <p className="text-[11px] text-stone-500">
                {language === 'ta' ? '+91 98421 00342 எண்ணிற்கு பூஞ்சை எச்சரிக்கை வரும்' : 'Direct SMS alerts to registered mobile'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
            <div>
              <p className="font-bold text-xs text-stone-900">
                {language === 'ta' ? 'ஆஃப்லைன் பார்வை (இணையம் இல்லாவிட்டாலும்)' : 'Offline Edge Model Cache'}
              </p>
              <p className="text-[11px] text-stone-500">
                {language === 'ta' ? 'சிக்னல் இல்லாத காட்டுப் பகுதிகளிலும் ஸ்கேன் செய்யலாம்' : 'Run CV inference in low-connectivity fields'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={offlineMode}
              onChange={(e) => setOfflineMode(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        {/* GPS & Sensor Node Config */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-stone-900 text-sm">
              {language === 'ta' ? 'பண்ணை அமைவிடம் (GPS Coordinates)' : 'Farm Geo-Location'}
            </h3>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 text-xs font-mono text-stone-700 flex justify-between">
            <span>Latitude: 10.7870° N, Longitude: 79.1378° E</span>
            <span className="text-emerald-700 font-bold">Thanjavur Basin</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Save className="w-4 h-4" />
          <span>{t.common.save}</span>
        </button>
      </form>
    </div>
  );
};
