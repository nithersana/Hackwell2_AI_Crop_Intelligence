import React from 'react';
import { SensorTelemetry, FieldZone } from '../types';
import { SENSOR_PRESETS } from '../data/mockData';
import { X, Send, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

interface TelemetrySidebarProps {
  telemetry: SensorTelemetry;
  selectedZone: FieldZone;
  onTelemetryChange: (updated: SensorTelemetry) => void;
  onSendIngest: (telemetry: SensorTelemetry) => Promise<void>;
  isIngesting: boolean;
  lastIngestResult: any;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const TelemetrySidebar: React.FC<TelemetrySidebarProps> = ({
  telemetry,
  selectedZone,
  onTelemetryChange,
  onSendIngest,
  isIngesting,
  lastIngestResult,
  mobileOpen = false,
  onCloseMobile
}) => {
  const updateField = (field: keyof SensorTelemetry, value: number) => {
    const updated = { ...telemetry, [field]: value };
    const temp = field === 'ambientTempC' ? value : telemetry.ambientTempC;
    const rh = field === 'relativeHumidityPercent' ? value : telemetry.relativeHumidityPercent;
    
    // Tetens equation for VPD
    const svp = 0.61078 * Math.exp((17.27 * temp) / (temp + 237.3));
    const avp = svp * (rh / 100);
    updated.vaporPressureDeficitKPa = Math.round(Math.max(0.01, svp - avp) * 1000) / 1000;
    
    // Dew point
    const a = 17.27;
    const b = 237.3;
    const alpha = ((a * temp) / (b + temp)) + Math.log(Math.max(1, rh) / 100);
    updated.dewPointC = Math.round(((b * alpha) / (a - alpha)) * 10) / 10;

    onTelemetryChange(updated);
  };

  const handleApplyPreset = (name: string) => {
    const preset = SENSOR_PRESETS.find((p) => p.name === name);
    if (!preset) return;
    const updated = {
      ...telemetry,
      ...preset.values,
      crop: selectedZone.crop,
      zoneId: selectedZone.id,
      zoneName: selectedZone.name
    };
    onTelemetryChange(updated);
    onSendIngest(updated);
  };

  const isVpdDangerous = telemetry.vaporPressureDeficitKPa < 0.40;

  const content = (
    <div className="p-8 h-full flex flex-col justify-between overflow-y-auto bg-white">
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(0,0,0,0.06)]">
          <div className="label">Telemetry Data</div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="xl:hidden p-1 rounded hover:bg-black/5 text-[#1a1a1a]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Humidity */}
        <div className="stat-group">
          <div className="label">Humidity</div>
          <div className="stat-value text-3xl md:text-4xl text-[#1a1a1a]">
            {telemetry.relativeHumidityPercent}%
          </div>
          <input
            type="range"
            min="20"
            max="99"
            step="1"
            value={telemetry.relativeHumidityPercent}
            onChange={(e) => updateField('relativeHumidityPercent', parseFloat(e.target.value))}
            className="w-full accent-[#166534] my-2 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-[#1a1a1a]/50">
            <span>20% (Arid)</span>
            <span>99% (Saturated)</span>
          </div>
        </div>

        {/* Ambient Temp */}
        <div className="stat-group">
          <div className="label">Ambient Temp</div>
          <div className="stat-value text-3xl md:text-4xl text-[#1a1a1a]">
            {telemetry.ambientTempC}°C
          </div>
          <input
            type="range"
            min="10"
            max="45"
            step="0.5"
            value={telemetry.ambientTempC}
            onChange={(e) => updateField('ambientTempC', parseFloat(e.target.value))}
            className="w-full accent-[#166534] my-2 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-[#1a1a1a]/50">
            <span>10°C</span>
            <span>Canopy: {telemetry.canopyTempC}°C</span>
            <span>45°C</span>
          </div>
        </div>

        {/* VPD Index */}
        <div className="stat-group">
          <div className="label">VPD Index</div>
          <div className="stat-value text-3xl md:text-4xl text-[#1a1a1a]">
            {telemetry.vaporPressureDeficitKPa} <span className="text-sm font-sans font-normal opacity-60">kPa</span>
          </div>
          <p className="text-[0.7rem] text-[#1a1a1a]/70 font-mono mt-1">
            {isVpdDangerous ? 'Stagnant Boundary Layer (Spore Risk)' : 'Optimum Transpirational Flow'}
          </p>
        </div>

        {/* Soil Moisture */}
        <div className="stat-group">
          <div className="label">Soil Moisture</div>
          <div className="stat-value text-3xl md:text-4xl text-[#1a1a1a]">
            {telemetry.soilMoisturePercent}%
          </div>
          <input
            type="range"
            min="10"
            max="95"
            step="0.5"
            value={telemetry.soilMoisturePercent}
            onChange={(e) => updateField('soilMoisturePercent', parseFloat(e.target.value))}
            className="w-full accent-[#166534] my-2 cursor-pointer"
          />
        </div>

        {/* Quick Microclimate Presets */}
        <div>
          <div className="label mb-2 flex items-center justify-between">
            <span>Simulation Presets</span>
            <SlidersHorizontal className="w-3 h-3 text-[#166534]" />
          </div>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
            {SENSOR_PRESETS.slice(0, 4).map((p) => (
              <button
                key={p.name}
                onClick={() => handleApplyPreset(p.name)}
                className="p-2 text-left border border-[rgba(0,0,0,0.08)] hover:border-[#166534] hover:bg-[#166534]/5 rounded-xs transition-colors cursor-pointer"
              >
                <div className="font-semibold truncate text-[#1a1a1a]">{p.name.split(' ')[0]}</div>
                <div className="text-[9px] text-[#1a1a1a]/50 truncate">{p.name.split('(')[1]?.replace(')', '') || 'Preset'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actuator Status Card (Variation 3 style) */}
        <div className="p-4 border border-[rgba(0,0,0,0.08)] bg-[#fafafa] rounded-xs shadow-xs">
          <div className="label">Actuator Status</div>
          <div className="mt-2.5 flex justify-between items-center">
            <span className="text-[0.8rem] font-medium text-[#1a1a1a]">Irrigation Throttle</span>
            <span className="tag-accent">-35%</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[rgba(0,0,0,0.06)] flex justify-between items-center text-[10px] font-mono text-[#1a1a1a]/70">
            <span>SOLENOID VALVE:</span>
            <span className="text-[#166534] font-bold">PULSE MODULATING</span>
          </div>
        </div>

        {/* Ingest confirmation if present */}
        {lastIngestResult && (
          <div className="p-3 bg-[#166534]/5 border border-[#166534]/20 rounded-xs text-[11px] font-mono text-[#166534] flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">INGEST VERIFIED: {lastIngestResult.deviceId}</div>
              <div className="text-[10px] text-[#1a1a1a]/70">
                Spore Index: {Math.round((lastIngestResult.metrics?.fungalSporeRiskIndex || 0) * 100)}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-6 mt-6 border-t border-[rgba(0,0,0,0.06)]">
        <button
          onClick={() => onSendIngest(telemetry)}
          disabled={isIngesting}
          className="btn-lab w-full flex items-center justify-center space-x-2 shadow-xs"
        >
          <Send className="w-3.5 h-3.5 text-white" />
          <span>{isIngesting ? 'Transmitting...' : 'Transmit Telemetry'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static Right Sidebar (320px) */}
      <aside className="hidden xl:block w-[320px] shrink-0 border-l border-[rgba(0,0,0,0.06)] bg-white h-full overflow-hidden">
        {content}
      </aside>

      {/* Mobile / Tablet Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative w-[320px] max-w-[85vw] bg-white h-full z-10 shadow-2xl border-l border-[rgba(0,0,0,0.08)]">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
