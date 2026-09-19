import React, { useState } from 'react';
import { 
  Sprout, 
  User, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  Globe, 
  Maximize2, 
  Check, 
  ArrowRight, 
  Volume2, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { registerFarmer } from '../../utils/authService';
import { speakText } from '../../utils/audioSpeech';
import { FarmerUser } from '../../types';

interface RegisterScreenProps {
  language: Language;
  onNavigate: (screen: any) => void;
  onRegisterSuccess: (user: FarmerUser) => void;
  onSetLanguage: (lang: Language) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  language,
  onNavigate,
  onRegisterSuccess,
  onSetLanguage,
}) => {
  const t = TRANSLATIONS[language];

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [village, setVillage] = useState('Thiruvaiyaru');
  const [district, setDistrict] = useState('Thanjavur');
  const [state, setState] = useState('Tamil Nadu');
  const [preferredLang, setPreferredLang] = useState<Language>(language);
  const [farmSize, setFarmSize] = useState('3.5');
  const [farmSizeUnit, setFarmSizeUnit] = useState<'Acres' | 'Hectares'>('Acres');
  const [mainCrop, setMainCrop] = useState<'Rice' | 'Tomato' | 'Cotton' | 'Banana' | 'Groundnut' | 'Sugarcane' | 'Other'>('Tomato');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setPreferredLang(lang);
    onSetLanguage(lang);
  };

  const handleVoiceHelp = () => {
    if (language === 'ta') {
      speakText('உங்கள் பெயர், 10 இலக்க மொபைல் எண், கடவுச்சொல் மற்றும் பண்ணை விவரங்களை பூர்த்தி செய்து கணக்கு உருவாக்கவும் பொத்தானை அழுத்தவும்.', 'ta');
    } else if (language === 'hi') {
      speakText('अपना नाम, 10 अंकों का मोबाइल नंबर, पासवर्ड और खेत का विवरण भरकर खाता बनाएं बटन दबाएं।', 'hi');
    } else {
      speakText('Enter your full name, 10 digit mobile number, password and farm details, then click the create account button.', 'en');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form Validations
    if (!fullName.trim()) {
      setErrorMsg(language === 'ta' ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்' : language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMsg(language === 'ta' ? '10 இலக்க சரியான மொபைல் எண்ணை உள்ளிடவும்' : language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(language === 'ta' ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்' : language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए' : 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(language === 'ta' ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : language === 'hi' ? 'पासवर्ड मेल नहीं खाते हैं' : 'Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg(language === 'ta' ? 'விதிமுறைகளை ஏற்கவும்' : language === 'hi' ? 'कृपया नियमों और शर्तों को स्वीकार करें' : 'Please agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);

    const result = registerFarmer({
      fullName,
      mobile: cleanMobile,
      password,
      village,
      district,
      state,
      preferredLanguage: preferredLang,
      farmSize: parseFloat(farmSize) || 2.0,
      farmSizeUnit,
      mainCrop,
    });

    if (result.success && result.user) {
      onRegisterSuccess(result.user);
      onNavigate('dashboard');
    } else {
      setErrorMsg(result.error || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const cropOptions = [
    { value: 'Rice', labelEn: 'Rice (Paddy)', labelTa: 'நெல் (Paddy)', labelHi: 'धान (चावल)', icon: '🌾' },
    { value: 'Tomato', labelEn: 'Tomato', labelTa: 'தக்காளி (Tomato)', labelHi: 'टमाटर', icon: '🍅' },
    { value: 'Cotton', labelEn: 'Cotton', labelTa: 'பருத்தி (Cotton)', labelHi: 'कपास', icon: '☁️' },
    { value: 'Banana', labelEn: 'Banana', labelTa: 'வாழை (Banana)', labelHi: 'केला', icon: '🍌' },
    { value: 'Groundnut', labelEn: 'Groundnut', labelTa: 'நிலக்கடலை (Groundnut)', labelHi: 'मूंगफली', icon: '🥜' },
    { value: 'Sugarcane', labelEn: 'Sugarcane', labelTa: 'கரும்பு (Sugarcane)', labelHi: 'गन्ना', icon: '🎋' },
    { value: 'Other', labelEn: 'Other Crop', labelTa: 'இதர பயிர்கள்', labelHi: 'अन्य फसल', icon: '🌱' },
  ];

  return (
    <div id="screen-register" className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto">
      {/* Container Card */}
      <div className="w-full bg-white rounded-3xl border-2 border-emerald-200/80 shadow-xl p-5 sm:p-8 relative">
        {/* Top Header Banner */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md text-2xl shrink-0">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
                  {t.screens.register}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-serif tracking-tight mt-0.5">
                {t.auth.registerTitle}
              </h1>
              <p className="text-xs text-stone-600">
                {t.auth.registerSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleVoiceHelp}
            className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors border border-emerald-200 shrink-0 cursor-pointer"
            title="Listen Voice Instructions"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert Box if any */}
        {errorMsg && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-semibold animate-pulse">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECTION 1: Farmer Personal Details */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>1. {language === 'ta' ? 'உழவர் அடிப்படை விவரங்கள்' : language === 'hi' ? 'किसान व्यक्तिगत विवरण' : 'Farmer Personal Details'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.auth.fullName} <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.auth.fullNamePlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-2xl text-stone-900 font-medium text-sm focus:border-emerald-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.auth.mobileNumber} <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder={t.auth.mobilePlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-2xl text-stone-900 font-medium text-sm focus:border-emerald-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.auth.password} <span className="text-rose-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? t.auth.hidePassword : t.auth.showPassword}</span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-2xl text-stone-900 font-medium text-sm focus:border-emerald-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.auth.confirmPassword} <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-2xl text-stone-900 font-medium text-sm focus:border-emerald-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Location & Preferred Language */}
          <div className="pt-3 border-t border-stone-200 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>2. {language === 'ta' ? 'இருப்பிடம் மற்றும் மொழி' : language === 'hi' ? 'स्थान और भाषा' : 'Location & Language'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Village */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.auth.village} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder={t.auth.villagePlaceholder}
                  className="w-full px-3 py-2.5 bg-stone-50 border-2 border-stone-200 rounded-xl text-stone-900 text-sm font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.auth.district} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={t.auth.districtPlaceholder}
                  className="w-full px-3 py-2.5 bg-stone-50 border-2 border-stone-200 rounded-xl text-stone-900 text-sm font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.auth.state} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder={t.auth.statePlaceholder}
                  className="w-full px-3 py-2.5 bg-stone-50 border-2 border-stone-200 rounded-xl text-stone-900 text-sm font-medium focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Preferred Language Buttons */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.auth.preferredLanguage}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('ta')}
                  className={`py-3 px-2 rounded-2xl border-2 font-bold text-sm text-center transition-all cursor-pointer ${
                    preferredLang === 'ta'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-base">தமிழ்</div>
                  <div className="text-[10px] opacity-80">Tamil (Primary)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`py-3 px-2 rounded-2xl border-2 font-bold text-sm text-center transition-all cursor-pointer ${
                    preferredLang === 'en'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-base">English</div>
                  <div className="text-[10px] opacity-80">International</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLanguageChange('hi')}
                  className={`py-3 px-2 rounded-2xl border-2 font-bold text-sm text-center transition-all cursor-pointer ${
                    preferredLang === 'hi'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-base">हिन्दी</div>
                  <div className="text-[10px] opacity-80">Hindi</div>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: Farm Details & Main Crop */}
          <div className="pt-3 border-t border-stone-200 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>3. {language === 'ta' ? 'பண்ணை மற்றும் பயிர் விவரங்கள்' : language === 'hi' ? 'खेत और फसल विवरण' : 'Farm & Crop Details'}</span>
            </h2>

            {/* Farm Size & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.auth.farmSize} <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    placeholder={t.auth.farmSizePlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-2xl text-stone-900 font-medium text-sm focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.auth.farmSizeUnit}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFarmSizeUnit('Acres')}
                    className={`py-3 px-3 rounded-2xl border-2 font-bold text-xs transition-all cursor-pointer ${
                      farmSizeUnit === 'Acres'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-500 shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {t.auth.acres}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFarmSizeUnit('Hectares')}
                    className={`py-3 px-3 rounded-2xl border-2 font-bold text-xs transition-all cursor-pointer ${
                      farmSizeUnit === 'Hectares'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-500 shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {t.auth.hectares}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Crop Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                {t.auth.mainCrop} <span className="text-rose-600">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {cropOptions.map((crop) => {
                  const isSelected = mainCrop === crop.value;
                  const label = language === 'ta' ? crop.labelTa : language === 'hi' ? crop.labelHi : crop.labelEn;
                  return (
                    <button
                      key={crop.value}
                      type="button"
                      onClick={() => setMainCrop(crop.value as any)}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 font-medium'
                      }`}
                    >
                      <span className="text-xl shrink-0">{crop.icon}</span>
                      <span className="text-xs truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100/70 transition-colors">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded-lg text-emerald-600 border-stone-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-stone-700 leading-relaxed">
                {t.auth.agreeTerms}
              </span>
            </label>
          </div>

          {/* Large Create Account Button */}
          <div className="pt-3">
            <button
              id="btn-create-farmer-account"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-6 h-6" />
              <span>{t.auth.createAccountBtn}</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </form>

        {/* Already have an account link */}
        <div className="mt-6 pt-4 border-t border-stone-200 text-center">
          <p className="text-xs text-stone-600">
            {t.auth.alreadyHaveAccount}{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-bold text-emerald-700 hover:text-emerald-900 underline ml-1 cursor-pointer"
            >
              {t.auth.loginBtn}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
