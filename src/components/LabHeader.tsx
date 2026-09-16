import React from 'react';
import { FieldZone } from '../types';
import { SlidersHorizontal, Menu } from 'lucide-react';

interface LabHeaderProps {
  selectedZone: FieldZone;
  systemHealth: { status: string; hasGeminiKey: boolean };
  onToggleMobileNav?: () => void;
  onToggleMobileTelemetry?: () => void;
}

export const LabHeader: React.FC<LabHeaderProps> = ({
  selectedZone,
  systemHealth: _systemHealth,
  onToggleMobileNav,
  onToggleMobileTelemetry
}) => {
  return (
    <header className="px-6 md:px-10 py-4 bg-white border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between shrink-0 z-20">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-1.5 rounded hover:bg-black/5 text-[#1a1a1a]"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="brand">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-[#1a1a1a]">
            AgroPulse AI
          </h1>
        </div>
      </div>

      {/* Middle Label */}
      <div className="hidden sm:block text-center">
        <div className="label">
          {selectedZone.name} — System Active
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {onToggleMobileTelemetry && (
          <button
            onClick={onToggleMobileTelemetry}
            className="xl:hidden p-1.5 rounded hover:bg-black/5 text-[#1a1a1a] flex items-center space-x-1 font-mono text-xs"
            aria-label="Toggle Telemetry"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#166534]" />
            <span className="text-[10px] hidden xs:inline">SENSORS</span>
          </button>
        )}
      </div>
    </header>
  );
};
