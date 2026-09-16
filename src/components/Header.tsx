import React from 'react';
import { 
  Sprout, 
  Activity, 
  Layers, 
  Database, 
  CalendarCheck2, 
  Code2, 
  Terminal, 
  ShieldAlert, 
  Wifi,
  Sparkles
} from 'lucide-react';
import { FieldZone } from '../types';

export type ActiveTab = 
  | 'lab' 
  | 'predictive' 
  | 'roadmap' 
  | 'sandbox';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedZone: FieldZone;
  onSelectZone: (zone: FieldZone) => void;
  zones: FieldZone[];
  isIngesting: boolean;
  systemHealth: { status: string; hasGeminiKey: boolean };
}

interface TabItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedZone,
  onSelectZone,
  zones,
  isIngesting,
  systemHealth
}) => {
  const tabs: TabItem[] = [
    { id: 'lab', label: 'Prototype Lab', icon: Sprout, badge: 'Live' },
    { id: 'predictive', label: 'Outbreak Forecasting', icon: Activity },
    { id: 'roadmap', label: 'Roadmap & Specs', icon: CalendarCheck2 },
    { id: 'sandbox', label: 'API Sandbox', icon: Terminal }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                  AgroPulse AI
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Edge v2.4
                </span>
                {systemHealth.hasGeminiKey && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Gemini AI Connected</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Adaptive Crop Intelligence • Early Pest & Disease Prevention
              </p>
            </div>
          </div>

          {/* Quick Zone Selector & System Telemetry Status */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Live Sensor Stream Status */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isIngesting ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isIngesting ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              <Wifi className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-[11px]">IoT Ingestion: Active</span>
            </div>

            {/* Zone Picker */}
            <div className="flex items-center space-x-1.5">
              <label htmlFor="zone-selector" className="text-xs font-medium text-slate-500 hidden sm:inline">
                Plot:
              </label>
              <select
                id="zone-selector"
                value={selectedZone.id}
                onChange={(e) => {
                  const found = zones.find((z) => z.id === e.target.value);
                  if (found) onSelectZone(found);
                }}
                className="text-xs font-medium bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} ({zone.crop})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center space-x-2 py-2.5 px-3 border-b-2 text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-md'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                      isActive
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
