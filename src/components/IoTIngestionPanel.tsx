import React, { useState } from 'react';
import { 
  Send, 
  Radio
} from 'lucide-react';
import { SensorTelemetry, FieldZone } from '../types';
import { SENSOR_PRESETS } from '../data/mockData';

interface IoTIngestionPanelProps {
  telemetry: SensorTelemetry;
  selectedZone: FieldZone;
  onTelemetryChange: (updated: SensorTelemetry) => void;
  onSendIngest: (telemetry: SensorTelemetry) => Promise<void>;
  isIngesting: boolean;
  lastIngestResult: any;
}

export const IoTIngestionPanel: React.FC<IoTIngestionPanelProps> = ({
  telemetry,
  selectedZone,
  onTelemetryChange,
  onSendIngest,
  isIngesting
}) => {
  const [activePreset, setActivePreset] = useState<string>('High Spore Risk (Warm & Saturated)');

  const handleApplyPreset = (presetName: string) => {
    const preset = SENSOR_PRESETS.find((p) => p.name === presetName);
    if (!preset) return;
    setActivePreset(presetName);

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

  const isVpdDangerous = telemetry.vaporPressureDeficitKPa < 0.40;

  return (
    <section className="card-lab space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[rgba(0,0,0,0.06)]">
        <div>
          <div className="label">IoT Sensory Ingestion</div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-[#1a1a1a] mt-1">
            Real-Time Edge Telemetry & Microclimate
          </h2>
          <p className="text-xs text-[#1a1a1a]/70 mt-0.5">
            LoRaWAN Node {telemetry.deviceId} • Target Zone: {selectedZone.name}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#1a1a1a]/70 bg-[#fafafa] px-3 py-1.5 rounded-xs border border-[rgba(0,0,0,0.06)]">
          <Radio className="w-3.5 h-3.5 text-[#166534] animate-pulse" />
          <span>MQTT 5.0 QOS-1: CONNECTED</span>
        </div>
      </div>

      {/* Hero Microclimate Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Microclimate Status Card */}
        <div className="p-5 rounded-xs bg-[#fafafa] border border-[rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div>
            <div className="label">Microclimate Status</div>
            <div className="stat-value text-4xl text-[#1a1a1a] my-2">
              {telemetry.relativeHumidityPercent}% <span className="text-base text-[#1a1a1a]/50 font-normal">RH</span>
            </div>
            <p className="text-xs text-[#1a1a1a]/70 leading-relaxed font-sans">
              {telemetry.relativeHumidityPercent > 85 
                ? `System flagging elevated moisture saturation in ${selectedZone.name}. Pathogen sporulation window: Active.`
                : `Optimal transpiration humidity maintained in ${selectedZone.name}.`
              }
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[rgba(0,0,0,0.06)] text-center font-mono">
            <div>
              <span className="label block">Temp Air</span>
              <span className="text-sm font-bold text-[#1a1a1a]">{telemetry.ambientTempC}°C</span>
            </div>
            <div>
              <span className="label block">Canopy IR</span>
              <span className="text-sm font-bold text-[#c05621]">{telemetry.canopyTempC}°C</span>
            </div>
            <div>
              <span className="label block">Soil Moist</span>
              <span className="text-sm font-bold text-[#166534]">{telemetry.soilMoisturePercent}%</span>
            </div>
          </div>
        </div>

        {/* Biophysical Indices Card */}
        <div className="p-5 rounded-xs bg-[#fafafa] border border-[rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div>
            <div className="label">Biophysical Indices</div>
            <div className="stat-value text-4xl text-[#166534] my-2">
              {telemetry.vaporPressureDeficitKPa} <span className="text-base text-[#1a1a1a]/50 font-normal">kPa VPD</span>
            </div>
            <p className="text-xs text-[#1a1a1a]/70 leading-relaxed font-sans">
              {isVpdDangerous 
                ? 'Stagnant boundary layer detected. Prolonged foliar wetness accelerates fungal zoospore motility.'
                : 'Vapor pressure deficit within healthy transpirational flow window.'
              }
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[rgba(0,0,0,0.06)] text-center font-mono">
            <div>
              <span className="label block">Dew Point</span>
              <span className="text-sm font-bold text-[#1a1a1a]">{telemetry.dewPointC}°C</span>
            </div>
            <div>
              <span className="label block">Wet Hours</span>
              <span className="text-sm font-bold text-[#c05621]">{telemetry.leafWetnessDurationHours}h</span>
            </div>
            <div>
              <span className="label block">Root NPK</span>
              <span className="text-sm font-bold text-[#166534]">{telemetry.nitrogenPpm} ppm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div>
        <div className="label mb-2">
          Environmental Microclimate Simulation Presets
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SENSOR_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.name;
            return (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset.name)}
                className={`text-left p-3 rounded-xs border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#166534] bg-[#166534]/5 ring-1 ring-[#166534]'
                    : 'border-[rgba(0,0,0,0.06)] bg-white hover:border-[rgba(0,0,0,0.2)]'
                }`}
              >
                <div className="text-xs font-bold text-[#1a1a1a]">{preset.name}</div>
                <div className="text-[10px] text-[#1a1a1a]/60 mt-1 line-clamp-2 leading-relaxed font-sans">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Microclimate Sliders */}
      <div className="p-4 rounded-xs bg-[#fafafa] border border-[rgba(0,0,0,0.06)] space-y-4">
        <div className="label">
          Manual Telemetry Parameter Overrides
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Soil Moisture */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#1a1a1a]/70">Soil Moisture:</span>
              <span className="font-bold text-[#166534]">{telemetry.soilMoisturePercent}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={telemetry.soilMoisturePercent}
              onChange={(e) => updateField('soilMoisturePercent', Number(e.target.value))}
              className="w-full accent-[#166534] cursor-pointer"
            />
          </div>

          {/* Ambient Temp */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#1a1a1a]/70">Ambient Temp:</span>
              <span className="font-bold text-[#166534]">{telemetry.ambientTempC}°C</span>
            </div>
            <input
              type="range"
              min={5}
              max={45}
              value={telemetry.ambientTempC}
              onChange={(e) => updateField('ambientTempC', Number(e.target.value))}
              className="w-full accent-[#166534] cursor-pointer"
            />
          </div>

          {/* Relative Humidity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#1a1a1a]/70">Relative Humidity:</span>
              <span className="font-bold text-[#166534]">{telemetry.relativeHumidityPercent}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={telemetry.relativeHumidityPercent}
              onChange={(e) => updateField('relativeHumidityPercent', Number(e.target.value))}
              className="w-full accent-[#166534] cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onSendIngest(telemetry)}
            disabled={isIngesting}
            className="btn-lab flex items-center space-x-2"
          >
            <Send className="w-3.5 h-3.5 text-white" />
            <span>{isIngesting ? 'Transmitting Ingestion...' : 'Transmit Ingest to Broker'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
