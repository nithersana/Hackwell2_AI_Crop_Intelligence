import React, { useState } from 'react';
import { 
  Sprout, 
  Activity, 
  Layers, 
  Database, 
  CalendarCheck2, 
  Code2, 
  Terminal, 
  Wifi, 
  Sparkles,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { FieldZone } from '../types';
import { ActiveTab } from './Header';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedZone: FieldZone;
  onSelectZone: (zone: FieldZone) => void;
  zones: FieldZone[];
  isIngesting: boolean;
  systemHealth: { status: string; hasGeminiKey: boolean };
}

interface NavItem {
  id: ActiveTab;
  index: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedZone,
  onSelectZone,
  zones,
  isIngesting,
  systemHealth
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'lab', index: '01', label: 'Prototype Lab', icon: Sprout, badge: 'LIVE' },
    { id: 'predictive', index: '02', label: 'Outbreak Forecast', icon: Activity },
    { id: 'roadmap', index: '03', label: 'Roadmap & Specs', icon: CalendarCheck2 },
    { id: 'sandbox', index: '04', label: 'API Sandbox', icon: Terminal }
  ];

  const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' }) + ' UTC';

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#1A1A1D] border-b border-[#27272a] text-[#E4E4E7] sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-md bg-[#22c55e] flex items-center justify-center text-black font-bold">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white">AGROPULSE AI</div>
            <div className="label-mono text-[#22c55e] text-[9px]">[01] SYSTEM ACTIVE</div>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md bg-[#111113] border border-[#333] text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay on Mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Technical Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-[280px] bg-[#1A1A1D] border-r border-[#27272a] text-[#E4E4E7]
        p-6 flex flex-col justify-between overflow-y-auto transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          
          {/* System Status Label & Title */}
          <div>
            <div className="label-mono text-[#22c55e] flex items-center space-x-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
              <span>[01] SYSTEM STATUS</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-none mt-2 font-['Space_Grotesk']">
              AGROPULSE<br /><span className="text-[#22c55e]">AI</span>
            </h1>
            <p className="text-[11px] text-zinc-400 mt-2 font-mono">
              Adaptive Crop Intelligence v2.4
            </p>
          </div>

          {/* Core Telemetry & Plot Status */}
          <div className="space-y-4 pt-4 border-t border-[#27272a]">
            {/* Plot Selection */}
            <div>
              <div className="label-mono text-zinc-400 mb-1.5">PLOT SELECTION</div>
              <select
                value={selectedZone.id}
                onChange={(e) => {
                  const found = zones.find((z) => z.id === e.target.value);
                  if (found) onSelectZone(found);
                }}
                className="w-full bg-[#111113] text-[#E4E4E7] border border-[#333] rounded p-2 text-xs font-mono focus:border-[#22c55e] focus:outline-none"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* IoT Telemetry Status */}
            <div>
              <div className="label-mono text-zinc-400 mb-1">IOT TELEMETRY</div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300">{selectedZone.sensorNodeId}: Stable</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30">
                  {isIngesting ? 'INGESTING' : 'ONLINE'}
                </span>
              </div>
            </div>

            {/* Last Sync */}
            <div>
              <div className="label-mono text-zinc-400 mb-1">LAST SYNC</div>
              <p className="text-xs font-mono text-zinc-300">
                {nowTime}
              </p>
            </div>

            {/* Gemini AI Status */}
            {systemHealth.hasGeminiKey && (
              <div className="p-2 rounded bg-[#111113] border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Gemini 3.8 Flash Active</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 pt-4 border-t border-[#27272a]">
            <div className="label-mono text-zinc-400 mb-2">MODULES</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? 'bg-[#22c55e] text-black font-bold shadow-xs'
                      : 'text-zinc-400 hover:text-white hover:bg-[#111113]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`font-mono text-[10px] ${isActive ? 'text-black/70' : 'text-zinc-500'}`}>
                      [{item.index}]
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-zinc-400 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                      isActive ? 'bg-black text-[#22c55e]' : 'bg-[#27272a] text-zinc-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Footer info in sidebar */}
        <div className="pt-4 border-t border-[#27272a] text-[10px] font-mono text-zinc-500 space-y-1">
          <div className="flex justify-between">
            <span>MODEL:</span>
            <span className="text-zinc-400">YOLOv11-OBB</span>
          </div>
          <div className="flex justify-between">
            <span>EDGE PORT:</span>
            <span className="text-zinc-400">3000 (HTTP/2)</span>
          </div>
          <div className="text-[9px] text-zinc-600 pt-1">
            © 2026 AGROPULSE CORE SYSTEMS
          </div>
        </div>
      </aside>
    </>
  );
};
