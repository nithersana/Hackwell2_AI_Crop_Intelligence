import React from 'react';
import { ActiveTab } from './Header';
import { FieldZone } from '../types';
import { X } from 'lucide-react';

interface LabNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedZone: FieldZone;
  onSelectZone: (zone: FieldZone) => void;
  zones: FieldZone[];
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const LabNav: React.FC<LabNavProps> = ({
  activeTab,
  setActiveTab,
  selectedZone,
  onSelectZone,
  zones,
  mobileOpen = false,
  onCloseMobile
}) => {
  const navItems: { id: ActiveTab; label: string; num: string }[] = [
    { id: 'lab', num: '01', label: 'Prototype Lab' },
    { id: 'predictive', num: '02', label: 'Outbreak Forecast' },
    { id: 'roadmap', num: '03', label: 'Roadmap & Specs' },
    { id: 'sandbox', num: '04', label: 'API Sandbox Runtime' }
  ];

  const content = (
    <div className="p-8 h-full flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="label">Core Modules</div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 rounded hover:bg-black/5 text-[#1a1a1a]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full text-left py-3 block text-[0.85rem] border-b border-[rgba(0,0,0,0.06)] transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#166534] font-semibold tracking-tight'
                    : 'text-[#1a1a1a]/80 hover:text-[#1a1a1a]'
                }`}
              >
                <span className="font-mono text-xs opacity-60 mr-2">{item.num}.</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* IoT Context Select */}
        <div className="mt-10">
          <div className="label mb-3">IoT Context</div>
          <select
            value={selectedZone.id}
            onChange={(e) => {
              const zone = zones.find((z) => z.id === e.target.value);
              if (zone) onSelectZone(zone);
            }}
            className="w-full p-2.5 bg-white border border-[rgba(0,0,0,0.12)] text-[#1a1a1a] font-mono text-[0.7rem] rounded-xs focus:outline-none focus:border-[#166534]"
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name} ({zone.crop})
              </option>
            ))}
          </select>

          <div className="mt-4 p-3 bg-black/[0.02] border border-[rgba(0,0,0,0.05)] rounded-xs space-y-1.5 font-mono text-[10px] text-[#1a1a1a]/70">
            <div className="flex justify-between">
              <span>NODE ID:</span>
              <span className="text-[#166534] font-bold">{selectedZone.sensorNodeId}</span>
            </div>
            <div className="flex justify-between">
              <span>SURVEILLANCE:</span>
              <span>{selectedZone.areaHectares} ha</span>
            </div>
            <div className="flex justify-between">
              <span>CANOPY STATUS:</span>
              <span className={selectedZone.status === 'Critical' ? 'text-[#c53030] font-bold' : 'text-[#166534]'}>
                {selectedZone.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Footnote */}
      <div className="pt-6 mt-6 border-t border-[rgba(0,0,0,0.06)] font-mono text-[10px] text-[#1a1a1a]/50 space-y-1">
        <div>FIRMWARE: V2.4-RTOS</div>
        <div>MQTT: BROKER QOS-1 OK</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static Nav (280px) */}
      <aside className="hidden md:block w-[280px] shrink-0 border-r border-[rgba(0,0,0,0.06)] bg-[#f9f8f6] h-full overflow-hidden">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative w-[280px] bg-[#f9f8f6] h-full z-10 shadow-xl border-r border-[rgba(0,0,0,0.08)]">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
