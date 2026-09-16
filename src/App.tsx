/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { Language, TRANSLATIONS } from './data/translations';
import {
  INITIAL_FARM_PLOTS,
  INITIAL_PESTS,
  INITIAL_ALERTS,
  INITIAL_TIMELINE,
  INITIAL_HISTORY,
  FarmPlot,
  PestRecord,
  EarlyAlert,
  TimelineMilestone,
  HistoryRecord,
} from './data/cropGuardData';
import { SAMPLE_LEAVES } from './data/mockData';
import { SampleLeafImage, CropScanRecord, FarmerUser } from './types';
import { getStoredCropScans, saveStoredCropScans } from './data/cropScanHistoryData';
import { getCurrentUser, logout as authLogout, DEMO_FARMER } from './utils/authService';

// Header & Navigation
import { CropGuardHeader } from './components/CropGuardHeader';
import { CropGuardBottomNav } from './components/CropGuardBottomNav';
import { ScreenSelectorModal, ScreenId, ALL_SCREENS } from './components/ScreenSelectorModal';

// 20 UI Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { FarmerProfileScreen } from './components/screens/FarmerProfileScreen';
import { MainDashboardScreen } from './components/screens/MainDashboardScreen';
import { MyFarmScreen } from './components/screens/MyFarmScreen';
import { AddCropScreen } from './components/screens/AddCropScreen';
import { ScanCropScreen } from './components/screens/ScanCropScreen';
import { DetectionResultScreen } from './components/screens/DetectionResultScreen';
import { SeverityAnalysisScreen } from './components/screens/SeverityAnalysisScreen';
import { PestDetectionScreen } from './components/screens/PestDetectionScreen';
import { DiseaseRiskScreen } from './components/screens/DiseaseRiskScreen';
import { WeatherIntelScreen } from './components/screens/WeatherIntelScreen';
import { AlertsScreen } from './components/screens/AlertsScreen';
import { RecommendationsScreen } from './components/screens/RecommendationsScreen';
import { HealthTimelineScreen } from './components/screens/HealthTimelineScreen';
import { DiseaseHistoryScreen } from './components/screens/DiseaseHistoryScreen';
import { KnowledgeDbScreen } from './components/screens/KnowledgeDbScreen';
import { FarmerAssistantScreen } from './components/screens/FarmerAssistantScreen';
import { LanguageSelectScreen } from './components/screens/LanguageSelectScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

export default function App() {
  // Navigation & Language
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('cropguard_lang') as Language) || 'ta';
  });
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);

  // Core Farm Data Models
  const [plots, setPlots] = useState<FarmPlot[]>(INITIAL_FARM_PLOTS);
  const [currentScan, setCurrentScan] = useState<SampleLeafImage>(SAMPLE_LEAVES[0]);
  const [pests] = useState<PestRecord[]>(INITIAL_PESTS);
  const [alerts] = useState<EarlyAlert[]>(INITIAL_ALERTS);
  const [timeline] = useState<TimelineMilestone[]>(INITIAL_TIMELINE);
  const [history] = useState<HistoryRecord[]>(INITIAL_HISTORY);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<FarmerUser | null>(() => getCurrentUser() || DEMO_FARMER);

  // Save language preference
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('cropguard_lang', lang);
  };

  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const handleAddPlot = (newPlot: FarmPlot) => {
    setPlots((prev) => [newPlot, ...prev]);
  };

  // Scroll to top upon screen navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  // Render current screen content
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            language={language}
            onSetLanguage={handleSetLanguage}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'login':
        return (
          <LoginScreen
            language={language}
            onSetLanguage={handleSetLanguage}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setCurrentScreen('dashboard');
            }}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'register':
        return (
          <RegisterScreen
            language={language}
            onSetLanguage={handleSetLanguage}
            onRegisterSuccess={(user) => {
              setCurrentUser(user);
              setCurrentScreen('dashboard');
            }}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'profile':
        return (
          <FarmerProfileScreen
            language={language}
            currentUser={currentUser}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'dashboard':
        return (
          <MainDashboardScreen
            language={language}
            plots={plots}
            alerts={alerts}
            currentUser={currentUser}
            onNavigate={(s) => setCurrentScreen(s)}
            onSetLanguage={handleSetLanguage}
            onLogout={handleLogout}
          />
        );

      case 'my_farm':
        return (
          <MyFarmScreen
            language={language}
            plots={plots}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'add_crop':
        return (
          <AddCropScreen
            language={language}
            onAddPlot={handleAddPlot}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'scan_crop':
        return (
          <ScanCropScreen
            language={language}
            onScanComplete={(leaf) => {
              setCurrentScan(leaf);
              // Automatically store scan into continuous crop health timeline
              try {
                const currentScans = getStoredCropScans();
                const nextDay = currentScans.length > 0 ? currentScans[currentScans.length - 1].dayNumber + 3 : 1;
                const isHealthy = leaf.diseaseName.toLowerCase().includes('healthy');
                const isMild = leaf.severity === 'Low';
                const isMod = leaf.severity === 'Moderate';
                const isSevere = leaf.severity === 'High' || leaf.severity === 'Critical';

                const healthScore = isHealthy ? 96 : isMild ? 78 : isMod ? 60 : isSevere ? 42 : 75;
                const riskScore = 100 - healthScore;
                const healthStatus = isHealthy ? 'Healthy' : isMild ? 'Mild infection' : isMod ? 'Moderate' : 'Severe';

                const newScanRecord: CropScanRecord = {
                  id: `scan-auto-${Date.now()}`,
                  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                  dayLabel: `Day ${nextDay}`,
                  dayNumber: nextDay,
                  crop: leaf.crop,
                  cropTa: leaf.cropTa,
                  disease: leaf.diseaseName,
                  diseaseTa: leaf.diseaseNameTa,
                  confidence: Math.round(leaf.confidence * 100),
                  severity: isHealthy ? 'Healthy' : isMild ? 'Mild' : isMod ? 'Moderate' : 'Severe',
                  healthScore,
                  riskScore,
                  healthStatus,
                  recommendation: leaf.recommendedNextAction || 'Inspect surrounding plants, apply organic bio-shield, and maintain 4-hour morning leaf dryness.',
                  recommendationTa: leaf.recommendedNextActionTa || 'அருகிலுள்ள செடிகளை ஆய்வு செய்து, இயற்கை உயிர் பூஞ்சாண தடுப்பை தெளிக்கவும்.',
                  previousActionTaken: 'Leaf photo scanned and verified via CropGuard AI vision engine',
                  actionStatus: 'In Progress',
                  growthStage: 'Vegetative / Flowering',
                  notes: `AI scan recorded for ${leaf.crop}: ${leaf.diseaseName} (${Math.round(leaf.confidence * 100)}% confidence).`
                };
                saveStoredCropScans([...currentScans, newScanRecord]);
              } catch (e) {
                console.error('Failed to append scan to timeline:', e);
              }
              setCurrentScreen('detection_result');
            }}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'detection_result':
        return (
          <DetectionResultScreen
            language={language}
            currentScan={currentScan}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'severity_analysis':
        return (
          <SeverityAnalysisScreen
            language={language}
            currentScan={currentScan}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'pest_detection':
        return (
          <PestDetectionScreen
            language={language}
            pests={pests}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'disease_risk':
        return (
          <DiseaseRiskScreen
            language={language}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'weather':
        return (
          <WeatherIntelScreen
            language={language}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'alerts':
        return (
          <AlertsScreen
            language={language}
            alerts={alerts}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'recommendations':
        return (
          <RecommendationsScreen
            language={language}
            currentScan={currentScan}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'timeline':
        return (
          <HealthTimelineScreen
            language={language}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'history':
        return (
          <DiseaseHistoryScreen
            language={language}
            history={history}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'knowledge_base':
        return (
          <KnowledgeDbScreen
            language={language}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'assistant':
        return (
          <FarmerAssistantScreen
            language={language}
            currentScan={currentScan}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'language':
        return (
          <LanguageSelectScreen
            language={language}
            onSetLanguage={handleSetLanguage}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            language={language}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );

      default:
        return (
          <MainDashboardScreen
            language={language}
            plots={plots}
            alerts={alerts}
            onNavigate={(s) => setCurrentScreen(s)}
            onSetLanguage={handleSetLanguage}
          />
        );
    }
  };

  // Full screen view for Splash, Login, and Register flows; standard app frame for other screens
  const isAuthScreen = currentScreen === 'splash' || currentScreen === 'login' || currentScreen === 'register';

  return (
    <div className="min-h-screen bg-[#f8faf8] text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Header Navigation (Except during splash / login flow) */}
      {!isAuthScreen && (
        <CropGuardHeader
          language={language}
          onSetLanguage={handleSetLanguage}
          currentScreen={currentScreen}
          onOpenScreenModal={() => setIsScreenModalOpen(true)}
          onNavigate={(s) => setCurrentScreen(s)}
          alertCount={alerts.filter((a) => a.level === 'Urgent').length}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Primary Application Workspace */}
      <main className={`flex-1 ${isAuthScreen ? '' : 'pb-24 pt-2'}`}>
        {renderScreen()}
      </main>

      {/* Floating Bottom Nav Dock (Except during splash / login flow) */}
      {!isAuthScreen && (
        <CropGuardBottomNav
          currentScreen={currentScreen}
          onNavigate={(s) => setCurrentScreen(s)}
          onOpenScreenModal={() => setIsScreenModalOpen(true)}
          language={language}
        />
      )}

      {/* Complete 20 Screens Quick Jump Modal */}
      <ScreenSelectorModal
        isOpen={isScreenModalOpen}
        onClose={() => setIsScreenModalOpen(false)}
        activeScreen={currentScreen}
        onSelectScreen={(s) => setCurrentScreen(s)}
        language={language}
      />

      {/* Floating Quick Language Switcher Button for Instant 1-Tap Toggle */}
      {!isAuthScreen && (
        <aside aria-label="Language switch" className="fixed bottom-20 right-4 z-40">
          <button
            id="floating-language-switch-btn"
            onClick={() => handleSetLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-emerald-900/90 hover:bg-emerald-950 text-white font-bold text-xs shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/40 backdrop-blur-md"
            title={language === 'en' ? 'தமிழுக்கு மாறவும் (Switch to Tamil)' : 'Switch to English'}
          >
            <Languages className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-serif">
              {language === 'en' ? 'தமிழ்' : 'English'}
            </span>
          </button>
        </aside>
      )}
    </div>
  );
}
