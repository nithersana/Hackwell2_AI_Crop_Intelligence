import React, { useState } from 'react';
import { 
  Radio, 
  Cpu, 
  Database, 
  Sparkles, 
  Plane
} from 'lucide-react';
import { ARCHITECTURE_LAYERS } from '../data/architectureData';

export const ArchitectureView: React.FC = () => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('all');

  const filteredLayers = selectedLayerId === 'all'
    ? ARCHITECTURE_LAYERS
    : ARCHITECTURE_LAYERS.filter((l) => l.id === selectedLayerId);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="card-lab space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="label">System Architecture</div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-[#1a1a1a] mt-1">
              Adaptive AI Crop Intelligence Blueprint
            </h2>
            <p className="text-xs text-[#1a1a1a]/70 max-w-3xl leading-relaxed mt-1">
              Sub-50ms foliar disease inferencing at the edge (drone/mobile) combined with high-throughput 
              IoT telemetry ingestion, TimescaleDB temporal analytics, and automated closed-loop irrigation actuation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="tag">LATENCY: &lt;45ms EDGE</span>
            <span className="tag">THROUGHPUT: 50k MSG/S</span>
            <span className="tag">ACCURACY: 94.6% mAP</span>
          </div>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="pt-4 border-t border-[rgba(0,0,0,0.06)]">
          <div className="label mb-3">
            End-to-End Pipeline Sequence
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
            <div className="p-3 bg-[#fafafa] border border-[rgba(0,0,0,0.06)] rounded-xs">
              <div className="font-semibold text-[#166534] flex items-center justify-center space-x-1">
                <Plane className="w-3.5 h-3.5" />
                <span>1. EDGE SENSING</span>
              </div>
              <p className="text-[10px] text-[#1a1a1a]/60 mt-1">Drone RGB/NDVI + LoRaWAN Pods</p>
            </div>

            <div className="p-3 bg-[#fafafa] border border-[rgba(0,0,0,0.06)] rounded-xs">
              <div className="font-semibold text-[#166534] flex items-center justify-center space-x-1">
                <Radio className="w-3.5 h-3.5" />
                <span>2. BROKER & INGEST</span>
              </div>
              <p className="text-[10px] text-[#1a1a1a]/60 mt-1">EMQX MQTT 5.0 + FastAPI</p>
            </div>

            <div className="p-3 bg-[#fafafa] border border-[rgba(0,0,0,0.06)] rounded-xs">
              <div className="font-semibold text-[#166534] flex items-center justify-center space-x-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>3. ML INFERENCE</span>
              </div>
              <p className="text-[10px] text-[#1a1a1a]/60 mt-1">YOLOv11-OBB + TFT Outbreak</p>
            </div>

            <div className="p-3 bg-[#fafafa] border border-[rgba(0,0,0,0.06)] rounded-xs">
              <div className="font-semibold text-[#166534] flex items-center justify-center space-x-1">
                <Database className="w-3.5 h-3.5" />
                <span>4. TIMESCALEDB</span>
              </div>
              <p className="text-[10px] text-[#1a1a1a]/60 mt-1">Hypertables & Rollups</p>
            </div>

            <div className="p-3 bg-[#fafafa] border border-[rgba(0,0,0,0.06)] rounded-xs">
              <div className="font-semibold text-[#166534] flex items-center justify-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>5. ADAPTIVE ENGINE</span>
              </div>
              <p className="text-[10px] text-[#1a1a1a]/60 mt-1">Bio/Chem & Solenoid Valves</p>
            </div>
          </div>
        </div>
      </div>

      {/* Layer Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 font-mono">
        <button
          onClick={() => setSelectedLayerId('all')}
          className={`px-3 py-1.5 rounded-xs text-xs transition-colors cursor-pointer ${
            selectedLayerId === 'all'
              ? 'bg-[#166534] text-white font-semibold'
              : 'bg-white border border-[rgba(0,0,0,0.08)] text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
          }`}
        >
          ALL LAYERS
        </button>
        {ARCHITECTURE_LAYERS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setSelectedLayerId(layer.id)}
            className={`px-3 py-1.5 rounded-xs text-xs transition-colors whitespace-nowrap cursor-pointer ${
              selectedLayerId === layer.id
                ? 'bg-[#166534] text-white font-semibold'
                : 'bg-white border border-[rgba(0,0,0,0.08)] text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
            }`}
          >
            {layer.name}
          </button>
        ))}
      </div>

      {/* Layer Details */}
      <div className="space-y-4">
        {filteredLayers.map((layer) => (
          <div
            key={layer.id}
            className="card-lab space-y-4"
          >
            <div className="border-b border-[rgba(0,0,0,0.06)] pb-3">
              <div className="label">Layer Subsystem</div>
              <h3 className="font-serif text-xl font-semibold text-[#1a1a1a]">{layer.name}</h3>
              <p className="text-xs text-[#1a1a1a]/70 mt-0.5">{layer.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {layer.components.map((comp, idx) => (
                <div key={idx} className="p-4 bg-[#fafafa] border border-[rgba(0,0,0,0.06)] rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-semibold text-[#1a1a1a]">{comp.title}</h4>
                  </div>
                  <div className="tag text-[9px]">
                    {comp.tech}
                  </div>
                  <p className="text-xs text-[#1a1a1a]/70 leading-relaxed font-sans">
                    {comp.description}
                  </p>
                  <div className="pt-2 border-t border-[rgba(0,0,0,0.04)] text-[10px] font-mono text-[#166534]">
                    Protocol: {comp.protocols}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
