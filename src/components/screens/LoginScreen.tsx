import React, { useState } from 'react';
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  Volume2, 
  KeyRound, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/audioSpeech';
import { loginWithPassword, generateOtp, verifyOtp, DEMO_FARMER } from '../../utils/authService';
import { FarmerUser } from '../../types';

interface LoginScreenProps {
  language: Language;
  onNavigate: (screen: any) => void;
  onLoginSuccess: (user: FarmerUser) => void;
  onSetLanguage: (lang: Language) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onNavigate,
  onLoginSuccess,
  onSetLanguage,
}) => {
  const t = TRANSLATIONS[language];

  // Auth mode: 'password' or 'otp'
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');

  // Form State
  const [mobile, setMobile] = useState('9876543210');
  const [password, setPassword] = useState('farmer123');
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);

  // Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleVoiceHelp = () => {
    if (language === 'ta') {
      speakText('உங்கள் 10 இலக்க மொபைல் எண் மற்றும் கடவுச்சொல்லை உள்ளிட்டு உள்நுழையவும். அல்லது OTP உள்நுழைவு வழியை தேர்ந்தெடுக்கவும்.', 'ta');
    } else if (language === 'hi') {
      speakText('अपना 10 अंकों का मोबाइल नंबर और पासवर्ड डालकर लॉगिन करें। या ओटीपी लॉगिन विकल्प चुनें।', 'hi');
    } else {
      speakText('Enter your 10-digit mobile number and password to login, or select the OTP login tab.', 'en');
    }
  };

  // Password Login Handler
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMsg(language === 'ta' ? 'சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்' : language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (!password) {
      setErrorMsg(language === 'ta' ? 'கடவுச்சொல் தேவை' : language === 'hi' ? 'पासवर्ड आवश्यक है' : 'Password is required');
      return;
    }

    setIsLoading(true);
    const result = loginWithPassword(cleanMobile, password);
    setIsLoading(false);

    if (result.success && result.user) {
      onLoginSuccess(result.user);
      onNavigate('dashboard');
    } else {
      setErrorMsg(result.error || 'Login failed. Please check credentials.');
    }
  };

  // OTP Request Handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMsg(language === 'ta' ? '10 இலக்க மொபைல் எண் தேவை' : language === 'hi' ? '10 अंकों का मोबाइल नंबर दर्ज करें' : 'Enter a 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    const result = generateOtp(cleanMobile);
    setIsLoading(false);

    if (result.success && result.otp) {
      setOtpSent(true);
      setActiveOtpCode(result.otp);
      setEnteredOtp(result.otp); // pre-populate for frictionless testing
      setInfoMsg(`${t.auth.otpSentSuccess}`);
    } else {
      setErrorMsg(result.error || 'Failed to send OTP.');
    }
  };

  // OTP Verification Handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanMobile = mobile.replace(/\D/g, '');
    setIsLoading(true);
    const result = verifyOtp(cleanMobile, enteredOtp);
    setIsLoading(false);

    if (result.success && result.user) {
      onLoginSuccess(result.user);
      onNavigate('dashboard');
    } else {
      setErrorMsg(result.error || 'Invalid OTP code.');
    }
  };

  // Instant Demo Login
  const handleInstantDemoLogin = () => {
    setMobile(DEMO_FARMER.mobile);
    setPassword('farmer123');
    const result = loginWithPassword(DEMO_FARMER.mobile, 'farmer123');
    if (result.success && result.user) {
      onLoginSuccess(result.user);
      onNavigate('dashboard');
    }
  };

  return (
    <div id="screen-login" className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto">
      {/* Container Card */}
      <div className="w-full bg-white rounded-3xl border-2 border-emerald-200/80 shadow-xl p-6 sm:p-8 relative">
        {/* Header Branding */}
        <div className="flex items-center justify-between pb-5 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-500 font-medium">CropGuard AI</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-serif tracking-tight mt-0.5">
                {t.auth.loginTitle}
              </h1>
              <p className="text-xs text-stone-500">
                {t.auth.loginSubtitle}
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

        {/* Auth Mode Toggle Tabs (Password Login vs. OTP Login) */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setErrorMsg(null);
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'password'
                ? 'bg-white text-emerald-950 shadow-xs border border-emerald-300 font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.auth.passwordLoginTab}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('otp');
              setErrorMsg(null);
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'otp'
                ? 'bg-white text-emerald-950 shadow-xs border border-emerald-300 font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.auth.otpLoginTab}</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Info Alert Box */}
        {infoMsg && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-900 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* MODE 1: Password Login Form */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-2xl text-stone-900 font-semibold text-sm focus:border-emerald-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password with Show/Hide toggle */}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-2xl text-stone-900 font-semibold text-sm focus:border-emerald-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                {t.auth.forgotPassword}
              </button>
            </div>

            {/* Submit Button */}
            <button
              id="btn-farmer-login"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-5 h-5" />
              <span>{t.auth.loginBtn}</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </form>
        )}

        {/* MODE 2: OTP Login Flow */}
        {authMode === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                      placeholder="9876543210"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-2xl text-stone-900 font-semibold text-sm focus:border-emerald-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <KeyRound className="w-5 h-5" />
                  <span>{t.auth.sendOtp}</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {t.auth.enterOtp} <span className="text-rose-600">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-stone-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{language === 'ta' ? 'எண் மாற்று' : language === 'hi' ? 'नंबर बदलें' : 'Change number'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="4582"
                    className="w-full py-3 px-4 text-center tracking-widest text-2xl font-black bg-stone-50 border-2 border-emerald-500 rounded-2xl text-emerald-950 focus:outline-none"
                  />
                  <p className="text-[11px] text-stone-500 mt-1.5 text-center">
                    {language === 'ta' 
                      ? 'தானாக நிரப்பப்பட்ட மாதிரி OTP: 4582' 
                      : language === 'hi'
                      ? 'स्वतः भरा गया डेमो ओटीपी: 4582'
                      : 'Auto-filled Hackathon Demo OTP: 4582'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{t.auth.verifyOtp}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Secondary Action: Create New Account Button */}
        <div className="mt-6 pt-5 border-t border-stone-200">
          <button
            id="btn-goto-register"
            type="button"
            onClick={() => onNavigate('register')}
            className="w-full py-3.5 px-4 rounded-2xl bg-stone-100 hover:bg-emerald-50 hover:border-emerald-300 border-2 border-stone-200 text-emerald-900 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{t.auth.createNewAccountBtn}</span>
          </button>
        </div>

        {/* Demo Credentials Section */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                {t.auth.demoCredentialsNotice}
              </span>
            </div>
            <span className="text-[10px] bg-amber-200 text-amber-900 font-black px-1.5 py-0.5 rounded">
              Prototype
            </span>
          </div>
          <div className="text-xs text-stone-700 space-y-1 font-mono mb-3">
            <div className="flex justify-between">
              <span className="text-stone-500 font-sans">{t.auth.mobileNumber}:</span>
              <span className="font-bold text-stone-900">9876543210</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-sans">{t.auth.password}:</span>
              <span className="font-bold text-stone-900">farmer123</span>
            </div>
          </div>

          <button
            id="btn-demo-login-instant"
            type="button"
            onClick={handleInstantDemoLogin}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <span>{t.auth.demoLoginBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 font-serif">
              {t.auth.forgotPassword}
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              {language === 'ta'
                ? 'உங்கள் பதிவு செய்யப்பட்ட மொபைல் எண்ணை (9876543210) பயன்படுத்தி OTP உள்நுழைவு மூலம் கடவுச்சொல் இல்லாமலேயே எளிதாக நுழையலாம்.'
                : language === 'hi'
                ? 'आप अपने पंजीकृत मोबाइल नंबर (9876543210) का उपयोग करके ओटीपी लॉगिन के माध्यम से बिना पासवर्ड के भी लॉगिन कर सकते हैं।'
                : 'You can instantly access your account without a password by using the OTP Login tab with your registered phone number.'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setAuthMode('otp');
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs"
              >
                {t.auth.otpLoginTab}
              </button>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="py-2.5 px-4 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
