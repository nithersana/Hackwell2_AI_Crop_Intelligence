import React from 'react';
import { CloudSun, CloudRain, Droplets, Wind, Sun, Compass, AlertTriangle, CheckCircle2, Volume2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/audioSpeech';

interface WeatherIntelScreenProps {
  language: Language;
  onNavigate: (screen: any) => void;
}

export const WeatherIntelScreen: React.FC<WeatherIntelScreenProps> = ({
  language,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];

  const handleVoiceReadout = () => {
    if (language === 'ta') {
      speakText('வானிலை நுண்ணறிவு அறிக்கை: தற்போதைய வெப்பநிலை 29 டிகிரி செல்சியஸ். ஈரப்பதம் 68 சதவீதம். காற்றின் வேகம் மணிக்கு 8 கிலோமீட்டர். தெளிப்பு பாதுகாப்பு குறியீடு சிறந்தது. காலை 7:00 மணி முதல் 9:30 மணிக்குள் மருந்து தெளிக்க உகந்தது.', 'ta');
    } else {
      speakText('Weather Intelligence Report: Ambient temperature is 29 degrees Celsius. Relative humidity is 68 percent. Wind speed is 8 kilometers per hour. Spraying Safety Delta-T index is optimal for chemical or foliar bio-application this morning.', 'en');
    }
  };

  const fiveDayForecast = [
    { day: 'Today (இன்று)', icon: '⛅', temp: '32° / 24°', rain: '20%', rh: '68%', spray: 'Optimal' },
    { day: 'Tomorrow (நாளை)', icon: '🌧️', temp: '29° / 23°', rain: '85%', rh: '94%', spray: 'Do Not Spray' },
    { day: 'Wed (புதன்)', icon: '⛈️', temp: '28° / 22°', rain: '90%', rh: '96%', spray: 'Rain Risk' },
    { day: 'Thu (வியாழன்)', icon: '🌦️', temp: '30° / 23°', rain: '45%', rh: '80%', spray: 'Caution' },
    { day: 'Fri (வெள்ளி)', icon: '☀️', temp: '33° / 24°', rain: '10%', rh: '62%', spray: 'Optimal' },
  ];

  return (
    <div id="screen-weather" className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase mb-1">
            <CloudSun className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'கிராமிய வேளாண் வானிலை மையம்' : 'Hyperlocal Agro-Weather Station'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {t.screens.weather}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'ta'
              ? 'திருவையாறு வானிலை மையம் • தெளிப்பு பாதுகாப்பு குறியீடு (Delta-T)'
              : 'Thiruvaiyaru Basin Station #TN-302 • Microclimate & Spray Delta-T Advisory'}
          </p>
        </div>

        <button
          onClick={handleVoiceReadout}
          className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          title="Listen Weather Forecast"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Current Weather Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-[#1b5e20] text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/15">
          <div className="flex items-center gap-5">
            <span className="text-6xl">⛅</span>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold font-serif">29°C</span>
                <span className="text-sm text-emerald-200">
                  {language === 'ta' ? 'மிதமான வெயில்' : 'Partly Cloudy'}
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-1">
                {language === 'ta' ? 'உணரப்படும் வெப்பம்: 31°C • விடியல்: 06:04 AM' : 'Feels like 31°C • Sunrise 06:04 AM • Sunset 06:21 PM'}
              </p>
            </div>
          </div>

          {/* SPRAYING SAFETY INDEX (DELTA-T) BADGE */}
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 sm:max-w-xs w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-emerald-300">
                {language === 'ta' ? 'தெளிப்பு பாதுகாப்பு குறியீடு (Delta-T)' : 'Spraying Safety (Delta-T)'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono">4.2 ΔT</span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-700/60 px-2 py-0.5 rounded-full">
                {language === 'ta' ? 'மிகச் சிறந்த நேரம்' : 'Optimal Window'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-100 mt-1">
              {language === 'ta'
                ? 'மருந்து காற்றில் அடித்துச் செல்லப்படாது; ஆவியாகாமல் இலையில் நன்கு படியும்.'
                : 'Zero droplet drift & low evaporation. Safe for foliar spray until 09:30 AM.'}
            </p>
          </div>
        </div>

        {/* 4 Live Sensor Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-emerald-200 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'ஈரப்பதம்' : 'Relative Humidity'}</span>
            </span>
            <p className="text-xl font-bold mt-1">68%</p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-emerald-200 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'காற்றின் வேகம்' : 'Wind Speed'}</span>
            </span>
            <p className="text-xl font-bold mt-1">8 km/h</p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-emerald-200 flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'மழை வாய்ப்பு' : 'Precipitation'}</span>
            </span>
            <p className="text-xl font-bold mt-1">20%</p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-emerald-200 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'சூரிய கதிர்வீச்சு' : 'Solar Radiation'}</span>
            </span>
            <p className="text-xl font-bold mt-1">640 W/m²</p>
          </div>
        </div>
      </div>

      {/* 5-Day Agro-Weather Forecast Cards */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
          {language === 'ta' ? '5 நாள் வேளாண் வானிலை கணிப்பு & தெளிப்பு அறிவுரை:' : '5-Day Agro-Weather & Spray Applicability Forecast:'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {fiveDayForecast.map((item, index) => (
            <div
              key={index}
              className={`p-3.5 rounded-2xl border text-center flex flex-col justify-between ${
                item.spray === 'Optimal'
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : item.spray === 'Do Not Spray'
                  ? 'bg-red-50/50 border-red-200'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div>
                <p className="font-bold text-xs text-stone-800">{item.day}</p>
                <span className="text-3xl my-2 block">{item.icon}</span>
                <p className="font-mono font-bold text-sm text-stone-900">{item.temp}</p>
                <p className="text-[11px] text-stone-500 mt-1">Rain: {item.rain}</p>
                <p className="text-[11px] text-stone-500">RH: {item.rh}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-200">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full block ${
                    item.spray === 'Optimal'
                      ? 'bg-emerald-600 text-white'
                      : item.spray === 'Do Not Spray'
                      ? 'bg-red-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {item.spray}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
