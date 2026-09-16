import React from 'react';
import { User, MapPin, Phone, ShieldCheck, Sprout, FileText, PhoneCall, Award, Volume2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/audioSpeech';
import { FarmerUser } from '../../types';

interface FarmerProfileScreenProps {
  language: Language;
  onNavigate: (screen: any) => void;
  currentUser?: FarmerUser | null;
}

export const FarmerProfileScreen: React.FC<FarmerProfileScreenProps> = ({
  language,
  onNavigate,
  currentUser,
}) => {
  const t = TRANSLATIONS[language];

  const displayName = currentUser?.fullName || t.farmer.name;
  const displayVillage = currentUser ? `${currentUser.village}, ${currentUser.district}` : t.farmer.village;
  const displayState = currentUser?.state || t.farmer.state;
  const displayLandSize = currentUser ? `${currentUser.farmSize} ${currentUser.farmSizeUnit}` : t.farmer.landSize;
  const displayCrop = currentUser?.mainCrop || t.farmer.primaryCrops;
  const displayMobile = currentUser?.mobile || currentUser?.mobileNumber || '+91 98765 43210';

  const handleVoiceReadout = () => {
    if (language === 'ta') {
      speakText(`விவசாயி சுயவிவரம்: ${displayName}. கிராமம்: ${displayVillage}. நிலப்பரப்பு: ${displayLandSize}. பயிர்கள்: ${displayCrop}. கார அமில நிலை 6.8.`, 'ta');
    } else if (language === 'hi') {
      speakText(`किसान प्रोफाइल: ${displayName}. गांव: ${displayVillage}. भूमि: ${displayLandSize}. मुख्य फसल: ${displayCrop}.`, 'hi');
    } else {
      speakText(`Farmer Profile for ${displayName}. Village: ${displayVillage}, ${displayState}. Land holding: ${displayLandSize}. Primary crop: ${displayCrop}.`, 'en');
    }
  };

  return (
    <div id="screen-profile" className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-[#1b5e20] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sprout className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-4xl shadow-inner">
              👨‍🌾
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold mb-1 border border-emerald-500/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'சரிபார்க்கப்பட்ட முற்போக்கு உழவர்' : 'Verified Progressive Farmer'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif">{displayName}</h2>
              <div className="flex items-center gap-2 text-emerald-100 text-xs sm:text-sm mt-1">
                <MapPin className="w-4 h-4 shrink-0 text-emerald-300" />
                <span>{displayVillage}, {displayState}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-200 text-xs mt-1">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>{displayMobile}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={handleVoiceReadout}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/20"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t.common.listenAudio}</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="py-2.5 px-4 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              {language === 'ta' ? 'அமைப்புகள்' : 'Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Farmer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Farm & Land Holdings */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <span>{language === 'ta' ? 'பண்ணை மற்றும் நில விவரங்கள்' : 'Farm & Acreage Information'}</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {displayLandSize}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">{language === 'ta' ? 'அரசு உழவர் அடையாள எண்' : 'Kisan Farmer ID'}</span>
              <span className="font-mono font-bold text-stone-900">{t.farmer.kissanId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">{language === 'ta' ? 'முதன்மை பயிர்கள்' : 'Primary Crops'}</span>
              <span className="font-semibold text-stone-900">{displayCrop}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">{language === 'ta' ? 'மண் வகை' : 'Soil Profile'}</span>
              <span className="font-semibold text-stone-900">{t.farmer.soilType}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">{language === 'ta' ? 'பாசன முறை' : 'Irrigation Source'}</span>
              <span className="font-semibold text-stone-900">
                {language === 'ta' ? 'வாய்க்கால் பாசனம் + சொட்டுநீர்' : 'Canal + Solar Drip Lines'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('my_farm')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{language === 'ta' ? 'நிலப்பிரிவுகளைப் பார்க்க' : 'Manage Farm Plots'}</span>
          </button>
        </div>

        {/* Soil Health Card & Nutrition */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span>{language === 'ta' ? 'மண் பரிசோதனை அட்டை (Soil Card)' : 'Soil Health Card'}</span>
            </h3>
            <span className="text-xs font-semibold text-stone-500">
              {language === 'ta' ? 'செப்டம்பர் 2026' : 'Tested Sep 2026'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <p className="text-[11px] text-stone-500 font-medium">{language === 'ta' ? 'கார அமில நிலை (pH)' : 'Soil pH'}</p>
              <p className="text-xl font-bold text-emerald-900 mt-0.5">6.8</p>
              <span className="text-[10px] text-emerald-700 font-semibold">{language === 'ta' ? 'சரியான நிலை' : 'Ideal Neutral'}</span>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100">
              <p className="text-[11px] text-stone-500 font-medium">{language === 'ta' ? 'தழைச்சத்து (Nitrogen)' : 'Nitrogen (N)'}</p>
              <p className="text-xl font-bold text-amber-900 mt-0.5">185 ppm</p>
              <span className="text-[10px] text-amber-700 font-semibold">{language === 'ta' ? 'நடுத்தர செறிவு' : 'Medium-High'}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <p className="text-[11px] text-stone-500 font-medium">{language === 'ta' ? 'சாம்பல் சத்து (K)' : 'Potassium (K)'}</p>
              <p className="text-xl font-bold text-stone-800 mt-0.5">240 ppm</p>
              <span className="text-[10px] text-emerald-700 font-semibold">{language === 'ta' ? 'போதுமானது' : 'Sufficient'}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <p className="text-[11px] text-stone-500 font-medium">{language === 'ta' ? 'கரிம கார்பன்' : 'Organic Carbon'}</p>
              <p className="text-xl font-bold text-stone-800 mt-0.5">0.74%</p>
              <span className="text-[10px] text-emerald-700 font-semibold">{language === 'ta' ? 'நல்ல வளம்' : 'Healthy'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
            <p className="font-semibold text-stone-800 mb-0.5">
              {language === 'ta' ? 'மண்வள குறிப்பு:' : 'Soil Agronomist Note:'}
            </p>
            <p>
              {language === 'ta'
                ? 'தக்காளிக்கு தழைச்சத்து அதிகமாக உள்ளதால் இலைக்கருகல் பூஞ்சை தாக்குதல் வாய்ப்பு அதிகம். யூரியாவை குறைக்கவும்.'
                : 'High nitrogen stimulates lush succulent growth in Plot 2. Reduce nitrogen top-dressing to restrict fungal spore colonization.'}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Agronomist / KVK Extension Officer Contact */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
              {language === 'ta' ? 'அவசர பயிர் பாதுகாப்பு உதவி' : 'Emergency Agronomy Hotline'}
            </span>
            <h4 className="text-base font-bold text-stone-900 mt-0.5">
              {t.farmer.emergencyContact}
            </h4>
            <p className="text-xs text-stone-600">
              {language === 'ta'
                ? 'தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழகம் / KVK தஞ்சாவூர் முதன்மை பயிர் விஞ்ஞானி'
                : 'Senior Scientist, Krishi Vigyan Kendra (KVK), Tamil Nadu Agricultural University'}
            </p>
          </div>
        </div>

        <a
          href="tel:18001801551"
          id="profile-call-officer-btn"
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Phone className="w-4 h-4" />
          <span>{language === 'ta' ? 'அதிகாரிக்கு அழை (1800 180 1551)' : 'Call KVK Helpline (Toll-Free)'}</span>
        </a>
      </div>
    </div>
  );
};
