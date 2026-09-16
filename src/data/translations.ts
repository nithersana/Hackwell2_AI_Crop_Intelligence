export type Language = 'ta' | 'en' | 'hi';

export interface TranslationDict {
  // App branding
  appName: string;
  tagline: string;
  hackwellBadge: string;
  
  // Navigation & screens
  screens: {
    splash: string;
    login: string;
    register: string;
    profile: string;
    dashboard: string;
    my_farm: string;
    add_crop: string;
    scan_crop: string;
    detection_result: string;
    severity_analysis: string;
    pest_detection: string;
    disease_risk: string;
    weather: string;
    alerts: string;
    recommendations: string;
    timeline: string;
    history: string;
    knowledge_base: string;
    assistant: string;
    language: string;
    settings: string;
  };

  // Screen categories
  categories: {
    core: string;
    ai_vision: string;
    intelligence: string;
    tools: string;
  };

  // Authentication
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    mobileNumber: string;
    mobilePlaceholder: string;
    password: string;
    confirmPassword: string;
    showPassword: string;
    hidePassword: string;
    village: string;
    villagePlaceholder: string;
    district: string;
    districtPlaceholder: string;
    state: string;
    statePlaceholder: string;
    preferredLanguage: string;
    farmSize: string;
    farmSizePlaceholder: string;
    farmSizeUnit: string;
    acres: string;
    hectares: string;
    mainCrop: string;
    agreeTerms: string;
    createAccountBtn: string;
    loginBtn: string;
    createNewAccountBtn: string;
    alreadyHaveAccount: string;
    forgotPassword: string;
    otpLoginTab: string;
    passwordLoginTab: string;
    sendOtp: string;
    enterOtp: string;
    verifyOtp: string;
    otpSentSuccess: string;
    demoCredentialsNotice: string;
    demoLoginBtn: string;
    logout: string;
    welcomeBack: string;
  };

  // Dashboard keys
  dashboard: {
    welcome: string;
    healthScore: string;
    diseaseRisk: string;
    pestRisk: string;
    weatherRisk: string;
    recentScan: string;
    alertsTitle: string;
    recommendedActions: string;
    quickActions: string;
    scanNowBtn: string;
    askAiBtn: string;
    viewFarmBtn: string;
    forecastBtn: string;
    statusGood: string;
    statusModerate: string;
    statusHigh: string;
    statusCritical: string;
    scannedAgo: string;
    highRiskHumidity: string;
  };

  // Common UI actions
  common: {
    save: string;
    cancel: string;
    submit: string;
    next: string;
    back: string;
    done: string;
    viewDetails: string;
    listenAudio: string;
    stopAudio: string;
    close: string;
    edit: string;
    delete: string;
    downloadReport: string;
    shareAlert: string;
    callOfficer: string;
    analyzing: string;
    healthy: string;
    warning: string;
    danger: string;
    organic: string;
    chemical: string;
    dosage: string;
    acre: string;
    tank16L: string;
    confidence: string;
    switchLang: string;
  };

  // Essential bilingual UI elements requested by farmer interface
  uiTerms: {
    dashboard: string;
    scanCrop: string;
    disease: string;
    pest: string;
    risk: string;
    severity: string;
    weather: string;
    recommendation: string;
    earlyWarning: string;
    cropHistory: string;
    aiAssistant: string;
    highDiseaseRiskDetected: string;
    switchLanguage: string;
    languageName: string;
    currentLanguageLabel: string;
    // Newly requested farmer-friendly labels
    login: string;
    register: string;
    mobileNumber: string;
    password: string;
    crop: string;
    diseaseDetection: string;
    pestAlert: string;
    irrigation: string;
    smartIrrigation: string;
    treatmentPrevention: string;
    cropHealth: string;
    preventiveMeasures: string;
    treatmentRecommendations: string;
  };

  // Screen-specific translations
  farmer: {
    name: string;
    village: string;
    state: string;
    landSize: string;
    kissanId: string;
    phone: string;
    soilType: string;
    soilHealth: string;
    primaryCrops: string;
    emergencyContact: string;
  };

  // Farmer Intelligence 9-Cards Dashboard
  farmerDashboard: {
    aiDiseaseDetection: string;
    symptoms: string;
    causes: string;
    prevention: string;
    recommendedAction: string;
    captureCropBtn: string;
    pestAlerts: string;
    highRiskBadge: string;
    weatherCropRisk: string;
    smartIrrigation: string;
    treatmentPrevention: string;
    preventiveMeasures: string;
    treatmentRecommendations: string;
    cropHealth: string;
    goodStanding: string;
    currentHealthScore: string;
    previousDetections: string;
    earlyWarningCard: string;
    aiVoiceAssistant: string;
    languageSelection: string;
  };

  // Weather metrics
  weather: {
    temp: string;
    humidity: string;
    rainfall: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  ta: {
    appName: "CropGuard AI (பயிர் பாதுகாப்பு)",
    tagline: "ஆரம்பகால பூச்சி மற்றும் நோய் தடுப்புக்கான தகவமைப்பு AI பயிர் நுண்ணறிவு",
    hackwellBadge: "Hackwell 2.0 திட்டம் • உழவர் நுண்ணறிவு தளம்",
    screens: {
      splash: "தொடக்க திரை (Splash)",
      login: "உழவர் உள்நுழைவு",
      register: "உழவர் கணக்கு உருவாக்குக",
      profile: "உழவர் சுயவிவரம்",
      dashboard: "முதன்மை பலகை (Dashboard)",
      my_farm: "எனது பண்ணை நிலங்கள்",
      add_crop: "புதிய பயிர் பதிவு",
      scan_crop: "பயிர் இலை ஸ்கேன் (AI)",
      detection_result: "நோய் கண்டறிதல் முடிவு",
      severity_analysis: "பாதிப்பு தீவிர ஆய்வு",
      pest_detection: "பூச்சி கண்டறிதல்",
      disease_risk: "நோய் அபாய முன்கணிப்பு",
      weather: "நுண்ணிய வானிலை",
      alerts: "முன்னெச்சரிக்கை அறிவிப்புகள்",
      recommendations: "பரிந்துரைக்கப்பட்ட தீர்வுகள்",
      timeline: "பயிர் ஆரோக்கிய காலக்கோடு",
      history: "நோய் வரலாறு",
      knowledge_base: "பயிர் நோய் களஞ்சியம்",
      assistant: "AI உழவர் உதவியாளர்",
      language: "மொழி தேர்வு (Language)",
      settings: "அமைப்புகள் (Settings)"
    },
    categories: {
      core: "முக்கிய பண்ணை விவரங்கள்",
      ai_vision: "AI பார்வை & நோயறிதல்",
      intelligence: "முன்கணிப்பு நுண்ணறிவு",
      tools: "உழவர் கருவிகள் & அமைப்புகள்"
    },
    auth: {
      loginTitle: "உழவர் உள்நுழைவு",
      loginSubtitle: "உங்கள் மொபைல் எண் அல்லது OTP மூலம் எளிதாக இணையுங்கள்",
      registerTitle: "புதிய உழவர் கணக்கு உருவாக்குக",
      registerSubtitle: "CropGuard AI-ல் இணைந்து உங்கள் பயிர்களை முன்கூட்டியே பாதுகாக்கவும்",
      fullName: "முழு பெயர்",
      fullNamePlaceholder: "எ.கா. அருணாச்சலம் முருகன்",
      mobileNumber: "மொபைல் எண்",
      mobilePlaceholder: "10 இலக்க மொபைல் எண் (எ.கா. 9876543210)",
      password: "கடவுச்சொல்",
      confirmPassword: "கடவுச்சொல்லை உறுதிசெய்",
      showPassword: "காட்டு",
      hidePassword: "மறை",
      village: "கிராமம்",
      villagePlaceholder: "எ.கா. திருவையாறு",
      district: "மாவட்டம்",
      districtPlaceholder: "எ.கா. தஞ்சாவூர்",
      state: "மாநிலம்",
      statePlaceholder: "எ.கா. தமிழ்நாடு",
      preferredLanguage: "விருப்ப மொழி",
      farmSize: "பண்ணை நில அளவு",
      farmSizePlaceholder: "எ.கா. 4.5",
      farmSizeUnit: "அலகு",
      acres: "ஏக்கர் (Acres)",
      hectares: "ஹெக்டேர் (Hectares)",
      mainCrop: "முக்கிய பயிர்",
      agreeTerms: "நான் சேவை விதிமுறைகள் மற்றும் நிபந்தனைகளை முழுமையாக ஏற்றுக்கொள்கிறேன்.",
      createAccountBtn: "கணக்கு உருவாக்கவும் 🌾",
      loginBtn: "உள்நுழைய 🚀",
      createNewAccountBtn: "புதிய கணக்கு தொடங்கவும் (+)",
      alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்",
      forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
      otpLoginTab: "OTP உள்நுழைவு",
      passwordLoginTab: "கடவுச்சொல் வழி",
      sendOtp: "OTP அனுப்புக",
      enterOtp: "4-இலக்க OTP உள்ளிடவும்",
      verifyOtp: "OTP சரிபார்த்து உள்நுழைக",
      otpSentSuccess: "OTP வெற்றிகரமாக அனுப்பப்பட்டது (சோதனை குறியீடு: 4582)",
      demoCredentialsNotice: "Hackwell 2.0 சோதனை உள்நுழைவு:",
      demoLoginBtn: "1-கிளிக் மாதிரி உழவர் உள்நுழைவு (9876543210)",
      logout: "வெளியேறு (Logout)",
      welcomeBack: "மீண்டும் வருக"
    },
    dashboard: {
      welcome: "வணக்கம் முருகன் அய்யா!",
      healthScore: "பயிர் நலம்",
      diseaseRisk: "நோய் அபாயம்",
      pestRisk: "பூச்சி அபாயம்",
      weatherRisk: "வானிலை அபாயம்",
      recentScan: "சமீபத்திய இலை ஸ்கேன்",
      alertsTitle: "செயலில் உள்ள முன்னெச்சரிக்கைகள்",
      recommendedActions: "பரிந்துரைக்கப்பட்ட விவசாய பணிகள்",
      quickActions: "விரைவு பணிகள்",
      scanNowBtn: "இலையை ஸ்கேன் செய்",
      askAiBtn: "AI உதவியாளரிடம் கேள்",
      viewFarmBtn: "நிலங்களை பார்",
      forecastBtn: "வானிலை அறிக்கை",
      statusGood: "நலம்",
      statusModerate: "மிதமானது",
      statusHigh: "அதிகம்",
      statusCritical: "ஆபத்தானது",
      scannedAgo: "2 மணி நேரத்திற்கு முன் ஸ்கேன் செய்யப்பட்டது",
      highRiskHumidity: "அதிக காற்றில் ஈரப்பதம் (88%) - பூஞ்சான அபாயம் அதிகம்"
    },
    common: {
      save: "சேமி",
      cancel: "ரத்து செய்",
      submit: "சமர்ப்பி",
      next: "அடுத்து",
      back: "பின்னால்",
      done: "முடிந்தது",
      viewDetails: "விவரங்களை பார்",
      listenAudio: "குரல் வடிவில் கேள் 🔊",
      stopAudio: "நிறுத்து ⏹️",
      close: "மூடு",
      edit: "திருத்து",
      delete: "நீக்கு",
      downloadReport: "PDF அறிக்கை பதிவிறக்கு",
      shareAlert: "அக்கம்பக்க உழவர்களுடன் பகிர்",
      callOfficer: "வேளாண் அதிகாரிக்கு அழை",
      analyzing: "AI நரம்பியல் வலைப்பின்னல் ஆய்வு செய்கிறது...",
      healthy: "ஆரோக்கியமானது",
      warning: "எச்சரிக்கை",
      danger: "ஆபத்து",
      organic: "இயற்கை / உயிரியல் தீர்வு",
      chemical: "இலக்கு ரசாயன தீர்வு",
      dosage: "அளவு",
      acre: "ஒரு ஏக்கருக்கு",
      tank16L: "16 லிட்டர் தெளிப்பான் தொட்டிக்கு",
      confidence: "நம்பகத்தன்மை",
      switchLang: "Switch to English"
    },
    uiTerms: {
      dashboard: "முதன்மை பலகை",
      scanCrop: "பயிர் ஸ்கேன்",
      disease: "நோய்",
      pest: "பூச்சி",
      risk: "அபாயம்",
      severity: "தீவிரத்தன்மை",
      weather: "வானிலை",
      recommendation: "பரிந்துரை",
      earlyWarning: "முன்னெச்சரிக்கை",
      cropHistory: "பயிர் வரலாறு",
      aiAssistant: "AI உதவியாளர்",
      highDiseaseRiskDetected: "அதிக நோய் அபாயம் கண்டறியப்பட்டுள்ளது.",
      switchLanguage: "மொழியை மாற்றவும்",
      languageName: "தமிழ்",
      currentLanguageLabel: "தமிழ் (Tamil)",
      login: "உள்நுழைய",
      register: "பதிவு செய்ய",
      mobileNumber: "மொபைல் எண்",
      password: "கடவுச்சொல்",
      crop: "பயிர்",
      diseaseDetection: "AI நோய் கண்டறிதல்",
      pestAlert: "பூச்சி எச்சரிக்கை",
      irrigation: "நீர்ப்பாசனம்",
      smartIrrigation: "நுண்ணிய நீர்ப்பாசனம்",
      treatmentPrevention: "சிகிச்சை & தடுப்பு முறைகள்",
      cropHealth: "பயிர் நலம்",
      preventiveMeasures: "முன்னெச்சரிக்கை தடுப்பு முறைகள்",
      treatmentRecommendations: "சிகிச்சை பரிந்துரைகள்"
    },
    farmer: {
      name: "அருணாச்சலம் முருகன்",
      village: "திருவையாறு, தஞ்சாவூர்",
      state: "தமிழ்நாடு, இந்தியா",
      landSize: "4.5 ஏக்கர் (2 நிலங்கள்)",
      kissanId: "TN-TJ-882190",
      phone: "+91 98765 43210",
      soilType: "வண்டல் கலந்த களிமண் (ஆற்றுப்படுகை)",
      soilHealth: "சரியான கார அமில நிலை (pH 6.8) • தழைச்சத்து நடுத்தரம்",
      primaryCrops: "தக்காளி (வீரிய ஒட்டு PKM-1), நெல் (CR-1009)",
      emergencyContact: "முனைவர் கே. செந்தில்குமார் (KVK தஞ்சாவூர்)"
    },
    farmerDashboard: {
      aiDiseaseDetection: "AI நோய் கண்டறிதல்",
      symptoms: "அறிகுறிகள்",
      causes: "காரணங்கள்",
      prevention: "தடுப்பு",
      recommendedAction: "பரிந்துரை",
      captureCropBtn: "பயிர் இலையை படம் பிடிக்கவும்",
      pestAlerts: "பூச்சி தாக்குதல் எச்சரிக்கைகள்",
      highRiskBadge: "அதிக அபாயம்",
      weatherCropRisk: "நுண்ணிய வானிலை & பயிர் அபாயம்",
      smartIrrigation: "நுண்ணிய நீர்ப்பாசனம்",
      treatmentPrevention: "சிகிச்சை & தடுப்பு முறைகள்",
      preventiveMeasures: "முன்னெச்சரிக்கை முறைகள்",
      treatmentRecommendations: "சிகிச்சை பரிந்துரைகள்",
      cropHealth: "பயிர் நலம் & கண்காணிப்பு",
      goodStanding: "ஆரோக்கிய நிலை சீராக உள்ளது",
      currentHealthScore: "தற்போதைய பயிர் நலன் குறியீடு",
      previousDetections: "முந்தைய AI ஆய்வுகள்",
      earlyWarningCard: "சமூக முன்னெச்சரிக்கை வலையமைப்பு",
      aiVoiceAssistant: "AI குரல் வழி வேளாண் உதவியாளர்",
      languageSelection: "பயன்பாட்டு மொழி தேர்வு"
    },
    weather: {
      temp: "வெப்பநிலை",
      humidity: "ஈரப்பதம்",
      rainfall: "மழைப்பொழிவு"
    }
  },

  en: {
    appName: "CropGuard AI",
    tagline: "Adaptive AI Crop Intelligence for Early Pest and Disease Prevention",
    hackwellBadge: "Hackwell 2.0 Project • Farmer Intelligence Platform",
    screens: {
      splash: "Splash Screen",
      login: "Farmer Login",
      register: "Create Farmer Account",
      profile: "Farmer Profile",
      dashboard: "Farmer Dashboard",
      my_farm: "My Farmlands",
      add_crop: "Add Crop Plot",
      scan_crop: "Scan Crop Leaf (AI)",
      detection_result: "Detection Results",
      severity_analysis: "Severity Analysis",
      pest_detection: "Pest Detection",
      disease_risk: "Disease Risk Prediction",
      weather: "Microclimate & Weather",
      alerts: "Early Warning Alerts",
      recommendations: "Integrated Pest Management",
      timeline: "Crop Health Timeline",
      history: "Disease History",
      knowledge_base: "Disease Knowledge Base",
      assistant: "AI Farmer Assistant",
      language: "Language Selection",
      settings: "Settings"
    },
    categories: {
      core: "Core Farm",
      ai_vision: "AI Vision & Diagnostics",
      intelligence: "Predictive Intelligence",
      tools: "Farmer Tools & Settings"
    },
    auth: {
      loginTitle: "Farmer Login",
      loginSubtitle: "Sign in with your 10-digit mobile number or OTP",
      registerTitle: "Create Farmer Account",
      registerSubtitle: "Join CropGuard AI to protect your crops before symptoms spread",
      fullName: "Full Name",
      fullNamePlaceholder: "e.g. Arunachalam Murugan",
      mobileNumber: "Mobile Number",
      mobilePlaceholder: "10-digit mobile number (e.g. 9876543210)",
      password: "Password",
      confirmPassword: "Confirm Password",
      showPassword: "Show",
      hidePassword: "Hide",
      village: "Village",
      villagePlaceholder: "e.g. Thiruvaiyaru",
      district: "District",
      districtPlaceholder: "e.g. Thanjavur",
      state: "State",
      statePlaceholder: "e.g. Tamil Nadu",
      preferredLanguage: "Preferred Language",
      farmSize: "Farm Size",
      farmSizePlaceholder: "e.g. 4.5",
      farmSizeUnit: "Unit",
      acres: "Acres",
      hectares: "Hectares",
      mainCrop: "Main Crop",
      agreeTerms: "I agree to the terms and conditions.",
      createAccountBtn: "Create Account 🌾",
      loginBtn: "Login 🚀",
      createNewAccountBtn: "Create New Account (+)",
      alreadyHaveAccount: "Already have an account? Sign In",
      forgotPassword: "Forgot Password?",
      otpLoginTab: "OTP Login",
      passwordLoginTab: "Password Login",
      sendOtp: "Send OTP",
      enterOtp: "Enter 4-Digit OTP",
      verifyOtp: "Verify OTP & Enter",
      otpSentSuccess: "OTP sent successfully (Demo test code: 4582)",
      demoCredentialsNotice: "Hackwell 2.0 Demo Credentials:",
      demoLoginBtn: "1-Click Demo Login (9876543210)",
      logout: "Logout",
      welcomeBack: "Welcome back"
    },
    dashboard: {
      welcome: "Welcome, Murugan 👨🌾",
      healthScore: "Crop Health",
      diseaseRisk: "Disease Risk",
      pestRisk: "Pest Risk",
      weatherRisk: "Weather Risk",
      recentScan: "Latest Leaf Scan",
      alertsTitle: "Active Early Warnings",
      recommendedActions: "Recommended Farming Actions",
      quickActions: "Quick Actions",
      scanNowBtn: "Scan Crop Leaf",
      askAiBtn: "Ask AI Assistant",
      viewFarmBtn: "View Farmlands",
      forecastBtn: "Weather Advisory",
      statusGood: "Good",
      statusModerate: "Moderate",
      statusHigh: "High Risk",
      statusCritical: "Critical",
      scannedAgo: "Scanned 2 hours ago",
      highRiskHumidity: "High Canopy Humidity (88%) - High Fungal Spore Risk"
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      next: "Next",
      back: "Back",
      done: "Done",
      viewDetails: "View Details",
      listenAudio: "Listen Voice 🔊",
      stopAudio: "Stop ⏹️",
      close: "Close",
      edit: "Edit",
      delete: "Delete",
      downloadReport: "Download PDF Report",
      shareAlert: "Share with Neighbors",
      callOfficer: "Call Agronomist",
      analyzing: "AI Neural Network analyzing crop leaf...",
      healthy: "Healthy",
      warning: "Warning",
      danger: "Danger",
      organic: "Organic / Biological Shield",
      chemical: "Targeted Chemical Protocol",
      dosage: "Dosage",
      acre: "Per Acre",
      tank16L: "Per 16L Knapsack Sprayer",
      confidence: "Confidence",
      switchLang: "தமிழ் மொழிக்கு மாற்றவும்"
    },
    uiTerms: {
      dashboard: "Dashboard",
      scanCrop: "Scan Crop",
      disease: "Disease",
      pest: "Pest",
      risk: "Risk",
      severity: "Severity",
      weather: "Weather",
      recommendation: "Recommendation",
      earlyWarning: "Early Warning",
      cropHistory: "Crop History",
      aiAssistant: "AI Assistant",
      highDiseaseRiskDetected: "High disease risk detected.",
      switchLanguage: "Switch Language",
      languageName: "English",
      currentLanguageLabel: "English",
      login: "Login",
      register: "Register",
      mobileNumber: "Mobile Number",
      password: "Password",
      crop: "Crop",
      diseaseDetection: "AI Disease Detection",
      pestAlert: "Pest Alerts",
      irrigation: "Irrigation",
      smartIrrigation: "Smart Irrigation",
      treatmentPrevention: "Treatment & Prevention",
      cropHealth: "Crop Health",
      preventiveMeasures: "Preventive Measures",
      treatmentRecommendations: "Treatment Recommendations"
    },
    farmer: {
      name: "Arunachalam Murugan",
      village: "Thiruvaiyaru, Thanjavur",
      state: "Tamil Nadu, India",
      landSize: "4.5 Acres (2 Plots)",
      kissanId: "TN-TJ-882190",
      phone: "+91 98765 43210",
      soilType: "Clay Loam (Alluvial Riverbed)",
      soilHealth: "Optimal pH 6.8 • Moderate Organic Carbon",
      primaryCrops: "Tomato (PKM-1 Hybrid), Rice (CR-1009)",
      emergencyContact: "Dr. K. Senthilkumar (KVK Thanjavur)"
    },
    farmerDashboard: {
      aiDiseaseDetection: "AI Disease Detection",
      symptoms: "Symptoms",
      causes: "Causes",
      prevention: "Prevention",
      recommendedAction: "Action",
      captureCropBtn: "Capture Crop Leaf",
      pestAlerts: "Pest Risk Alerts",
      highRiskBadge: "High Risk",
      weatherCropRisk: "Microclimate & Crop Risk",
      smartIrrigation: "Smart Irrigation",
      treatmentPrevention: "Treatment & Prevention",
      preventiveMeasures: "Preventive Measures",
      treatmentRecommendations: "Treatment Recommendations",
      cropHealth: "Crop Health Tracker",
      goodStanding: "Good Standing",
      currentHealthScore: "Current Health Score",
      previousDetections: "Previous AI Scans",
      earlyWarningCard: "Early Warning Network",
      aiVoiceAssistant: "AI Voice Assistant",
      languageSelection: "Language Selection"
    },
    weather: {
      temp: "Temperature",
      humidity: "Humidity",
      rainfall: "Rainfall"
    }
  },

  hi: {
    appName: "CropGuard AI (फसल सुरक्षा)",
    tagline: "शुरुआती कीट और रोग रोकथाम के लिए अनुकूली एआई फसल बुद्धिमत्ता",
    hackwellBadge: "Hackwell 2.0 परियोजना • किसान इंटेलिजेंस प्लेटफॉर्म",
    screens: {
      splash: "प्रारंभिक स्क्रीन (Splash)",
      login: "किसान लॉगिन",
      register: "किसान खाता बनाएं",
      profile: "किसान प्रोफ़ाइल",
      dashboard: "किसान डैशबोर्ड",
      my_farm: "मेरे खेत",
      add_crop: "नई फसल जोड़ें",
      scan_crop: "फसल पत्ती स्कैन (AI)",
      detection_result: "रोग पहचान परिणाम",
      severity_analysis: "गंभीरता विश्लेषण",
      pest_detection: "कीट पहचान",
      disease_risk: "रोग जोखिम भविष्यवाणी",
      weather: "मौसम और जलवायु",
      alerts: "प्रारंभिक चेतावनी अलर्ट",
      recommendations: "उपचार और रोकथाम सलाह",
      timeline: "फसल स्वास्थ्य समयरेखा",
      history: "रोग इतिहास",
      knowledge_base: "फसल रोग ज्ञानकोष",
      assistant: "एआई किसान सहायक",
      language: "भाषा चयन (Language)",
      settings: "सेटिंग्स (Settings)"
    },
    categories: {
      core: "मुख्य खेत विवरण",
      ai_vision: "एआई दृष्टि और निदान",
      intelligence: "पूर्वानुमान बुद्धिमत्ता",
      tools: "किसान उपकरण और सेटिंग्स"
    },
    auth: {
      loginTitle: "किसान लॉगिन",
      loginSubtitle: "अपने 10-अंकीय मोबाइल नंबर या ओटीपी से लॉगिन करें",
      registerTitle: "नया किसान खाता बनाएं",
      registerSubtitle: "CropGuard AI से जुड़ें और समय रहते फसल को रोगों से बचाएं",
      fullName: "पूरा नाम",
      fullNamePlaceholder: "जैसे: अरुणाचलम मुरुगन",
      mobileNumber: "मोबाइल नंबर",
      mobilePlaceholder: "10 अंकों का मोबाइल नंबर (जैसे: 9876543210)",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      showPassword: "दिखाएं",
      hidePassword: "छिपाएं",
      village: "गाँव",
      villagePlaceholder: "जैसे: तिरुवैयारु",
      district: "ज़िला",
      districtPlaceholder: "जैसे: तंजावुर",
      state: "राज्य",
      statePlaceholder: "जैसे: तमिलनाडु",
      preferredLanguage: "पसंदीदा भाषा",
      farmSize: "खेत का आकार",
      farmSizePlaceholder: "जैसे: 4.5",
      farmSizeUnit: "इकाई",
      acres: "एकड़ (Acres)",
      hectares: "हेक्टेयर (Hectares)",
      mainCrop: "मुख्य फसल",
      agreeTerms: "मैं नियमों और शर्तों से पूरी तरह सहमत हूँ।",
      createAccountBtn: "खाता बनाएं 🌾",
      loginBtn: "लॉगिन करें 🚀",
      createNewAccountBtn: "नया खाता बनाएं (+)",
      alreadyHaveAccount: "क्या पहले से खाता है? लॉगिन करें",
      forgotPassword: "पासवर्ड भूल गए?",
      otpLoginTab: "ओटीपी लॉगिन",
      passwordLoginTab: "पासवर्ड लॉगिन",
      sendOtp: "ओटीपी भेजें",
      enterOtp: "4-अंकीय ओटीपी दर्ज करें",
      verifyOtp: "ओटीपी सत्यापित कर प्रवेश करें",
      otpSentSuccess: "ओटीपी सफलतापूर्वक भेजा गया (परीक्षण कोड: 4582)",
      demoCredentialsNotice: "Hackwell 2.0 डेमो लॉगिन विवरण:",
      demoLoginBtn: "1-क्लिक डेमो किसान लॉगिन (9876543210)",
      logout: "लॉगआउट (Logout)",
      welcomeBack: "स्वागत है"
    },
    dashboard: {
      welcome: "स्वागत है, मुरुगन जी 👨🌾",
      healthScore: "फसल स्वास्थ्य",
      diseaseRisk: "रोग जोखिम",
      pestRisk: "कीट जोखिम",
      weatherRisk: "मौसम जोखिम",
      recentScan: "हालिया पत्ती स्कैन",
      alertsTitle: "सक्रिय प्रारंभिक चेतावनियां",
      recommendedActions: "अनुशंसित कृषि कार्य",
      quickActions: "त्वरित कार्य",
      scanNowBtn: "पत्ती स्कैन करें",
      askAiBtn: "एआई से पूछें",
      viewFarmBtn: "खेत देखें",
      forecastBtn: "मौसम सलाह",
      statusGood: "अच्छा",
      statusModerate: "मध्यम",
      statusHigh: "उच्च जोखिम",
      statusCritical: "गंभीर",
      scannedAgo: "2 घंटे पहले स्कैन किया गया",
      highRiskHumidity: "उच्च आर्द्रता (88%) - फफूंद संक्रमण का उच्च जोखिम"
    },
    common: {
      save: "सहेजें",
      cancel: "रद्द करें",
      submit: "जमा करें",
      next: "अगला",
      back: "पीछे",
      done: "पूर्ण",
      viewDetails: "विवरण देखें",
      listenAudio: "आवाज में सुनें 🔊",
      stopAudio: "रोकें ⏹️",
      close: "बंद करें",
      edit: "संपादित करें",
      delete: "हटाएं",
      downloadReport: "पीडीएफ रिपोर्ट डाउनलोड करें",
      shareAlert: "पड़ोसी किसानों के साथ साझा करें",
      callOfficer: "कृषि अधिकारी को कॉल करें",
      analyzing: "एआई पत्ती का विश्लेषण कर रहा है...",
      healthy: "स्वस्थ",
      warning: "चेतावनी",
      danger: "खतरा",
      organic: "जैविक / प्राकृतिक उपाय",
      chemical: "रासायनिक समाधान",
      dosage: "मात्रा",
      acre: "प्रति एकड़",
      tank16L: "16 लीटर स्प्रेयर टैंक प्रति",
      confidence: "सटीकता",
      switchLang: "தமிழில் மாற்றவும்"
    },
    uiTerms: {
      dashboard: "डैशबोर्ड",
      scanCrop: "फसल स्कैन",
      disease: "रोग",
      pest: "कीट",
      risk: "जोखिम",
      severity: "गंभीरता",
      weather: "मौसम",
      recommendation: "सलाह",
      earlyWarning: "प्रारंभिक चेतावनी",
      cropHistory: "फसल इतिहास",
      aiAssistant: "एआई सहायक",
      highDiseaseRiskDetected: "उच्च रोग जोखिम का पता चला है।",
      switchLanguage: "भाषा बदलें",
      languageName: "हिन्दी",
      currentLanguageLabel: "हिन्दी (Hindi)",
      login: "लॉगिन",
      register: "पंजीकरण",
      mobileNumber: "मोबाइल नंबर",
      password: "पासवर्ड",
      crop: "फसल",
      diseaseDetection: "एआई रोग पहचान",
      pestAlert: "कीट चेतावनी",
      irrigation: "सिंचाई",
      smartIrrigation: "स्मार्ट सिंचाई",
      treatmentPrevention: "उपचार और रोकथाम",
      cropHealth: "फसल स्वास्थ्य",
      preventiveMeasures: "निवारक उपाय",
      treatmentRecommendations: "उपचार सिफारिशें"
    },
    farmer: {
      name: "अरुणाचलम मुरुगन",
      village: "तिरुवैयारु, तंजावुर",
      state: "तमिलनाडु, भारत",
      landSize: "4.5 एकड़ (2 खेत)",
      kissanId: "TN-TJ-882190",
      phone: "+91 98765 43210",
      soilType: "जलोढ़ दोमट मिट्टी",
      soilHealth: "इष्टतम पीएच 6.8 • मध्यम जैविक कार्बन",
      primaryCrops: "टमाटर (PKM-1 संकर), धान (CR-1009)",
      emergencyContact: "डॉ. के. सेंथिलकुमार (केवीके तंजावुर)"
    },
    farmerDashboard: {
      aiDiseaseDetection: "एआई रोग पहचान",
      symptoms: "लक्षण",
      causes: "कारण",
      prevention: "रोकथाम",
      recommendedAction: "अनुशंसित कार्रवाई",
      captureCropBtn: "फसल की पत्ती स्कैन करें",
      pestAlerts: "कीट प्रकोप अलर्ट",
      highRiskBadge: "उच्च जोखिम",
      weatherCropRisk: "मौसम और फसल जोखिम",
      smartIrrigation: "स्मार्ट सिंचाई मार्गदर्शन",
      treatmentPrevention: "उपचार और निवारक उपाय",
      preventiveMeasures: "निवारक उपाय",
      treatmentRecommendations: "उपचार सिफारिशें",
      cropHealth: "फसल स्वास्थ्य ट्रैकर",
      goodStanding: "अच्छी स्थिति",
      currentHealthScore: "वर्तमान स्वास्थ्य स्कोर",
      previousDetections: "पिछले स्कैन और इतिहास",
      earlyWarningCard: "सामुदायिक पूर्व चेतावनी नेटवर्क",
      aiVoiceAssistant: "एआई वॉयस सहायक",
      languageSelection: "ऐप भाषा चयन"
    },
    weather: {
      temp: "तापमान",
      humidity: "आर्द्रता",
      rainfall: "वर्षा"
    }
  }
};
