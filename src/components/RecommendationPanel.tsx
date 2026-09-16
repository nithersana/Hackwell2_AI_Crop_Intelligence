import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { AdaptiveRecommendationReport, DiseaseDetectionResult, SensorTelemetry } from '../types';

interface RecommendationPanelProps {
  report: AdaptiveRecommendationReport | null;
  detection: DiseaseDetectionResult | null;
  telemetry: SensorTelemetry;
  onGenerateReport: () => Promise<void>;
  isLoading: boolean;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  report,
  onGenerateReport,
  isLoading
}) => {
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});

  const toggleApply = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAppliedActions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="card-lab space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[rgba(0,0,0,0.06)]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="label">Prescription Protocols</span>
            <span className="text-[10px] font-mono text-[#166534] bg-[#166534]/10 px-1.5 py-0.5 rounded">
              CLICK CARD TO EXPAND
            </span>
          </div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-[#1a1a1a] mt-1">
            Dynamic Agronomic Interventions
          </h2>
        </div>

        <button
          onClick={onGenerateReport}
          disabled={isLoading}
          className="btn-lab flex items-center space-x-2 cursor-pointer"
        >
          {isLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-white" />
          )}
          <span>{isLoading ? 'Synthesizing...' : 'Generate Prescriptions'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {report ? (
          <>
            {/* Prescriptions List in Variation 3 exact style */}
            <div className="space-y-3">
              {report.actions.map((act, index) => {
                const isFaintBg = index % 2 === 1;
                const isExpanded = expandedActionId === act.id;
                const isApplied = appliedActions[act.id];

                return (
                  <div
                    key={act.id}
                    onClick={() => setExpandedActionId(isExpanded ? null : act.id)}
                    className={`p-4 border rounded-xs transition-all cursor-pointer ${
                      isApplied 
                        ? 'border-[#166534] bg-[#166534]/5 ring-1 ring-[#166534]' 
                        : isExpanded
                        ? 'border-[#166534]/50 bg-white shadow-xs'
                        : isFaintBg 
                        ? 'border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.02)] hover:border-[#166534]/30' 
                        : 'border-[rgba(0,0,0,0.06)] bg-white hover:border-[#166534]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="label">
                          {act.category} | {act.timing}
                        </span>
                        {isApplied && (
                          <span className="text-[10px] font-mono text-[#166534] bg-[#166534]/15 px-1.5 py-0.5 rounded font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>DEPLOYED</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="tag text-[9px]">
                          ECO: {act.ecoToxicityScore}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#1a1a1a]/60" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#1a1a1a]/40" />
                        )}
                      </div>
                    </div>

                    <div className="font-medium text-[#1a1a1a] text-sm md:text-base my-1 flex items-center justify-between">
                      <span>{act.actionTitle}</span>
                    </div>

                    <p className="text-[0.8rem] text-[#1a1a1a]/70 leading-relaxed font-sans">
                      {act.description}
                    </p>

                    {/* Rate & Pre-harvest intervals */}
                    <div className="mt-2.5 pt-2 border-t border-[rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#1a1a1a]/60">
                      <div className="flex items-center space-x-3">
                        {act.dosageOrSetting && (
                          <span><strong className="text-[#1a1a1a]">Rate:</strong> {act.dosageOrSetting}</span>
                        )}
                        {act.withholdingPeriodDays !== undefined && (
                          <span>PHI: <strong className="text-[#166534]">{act.withholdingPeriodDays} days</strong></span>
                        )}
                      </div>

                      <button
                        onClick={(e) => toggleApply(act.id, e)}
                        className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center space-x-1 ${
                          isApplied
                            ? 'bg-[#166534] text-white'
                            : 'bg-black/5 hover:bg-black/10 text-[#1a1a1a]'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isApplied ? 'Acknowledged' : 'Deploy Action'}</span>
                      </button>
                    </div>

                    {/* Expanded Clinical Protocol Details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.06)] bg-black/[0.015] p-3 rounded-xs space-y-2 font-mono text-xs">
                        <div className="text-[10px] font-bold text-[#166534] uppercase tracking-wider">
                          Standard Operating Procedure (SOP):
                        </div>
                        <p className="text-[11px] text-[#1a1a1a]/80 leading-relaxed font-sans">
                          Calibrate nozzle pressure between 2.0–2.5 bar for fine mist canopy penetration. Ensure foliar surface is dry prior to delivery. Re-inspect at 48 hours for sporulation cessation.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-[#1a1a1a]/70 pt-1">
                          <div>• PPE: Nitrile Gloves & Respirator</div>
                          <div>• Tank Mix: Compatible with pH 6.0-7.0</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Smart Irrigation & Biosecurity Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-[rgba(0,0,0,0.06)] bg-[#fafafa] rounded-xs space-y-1.5">
                <div className="label">Actuator Override — Irrigation</div>
                <div className="stat-value text-2xl text-[#166534]">
                  {report.irrigationGuidance.flowAdjustmentPercent}%
                </div>
                <p className="text-[0.75rem] text-[#1a1a1a]/70">
                  {report.irrigationGuidance.currentAction}
                </p>
                <div className="text-[10px] font-mono text-[#1a1a1a]/60 pt-1">
                  Schedule: {report.irrigationGuidance.recommendedSchedule}
                </div>
              </div>

              <div className="p-4 border border-[rgba(0,0,0,0.06)] bg-[#fafafa] rounded-xs space-y-1.5">
                <div className="label">Field Biosecurity — Quarantine</div>
                <div className="stat-value text-2xl text-[#c53030]">
                  {report.quarantineProtocol.bufferRadiusMeters}m
                </div>
                <p className="text-[0.75rem] text-[#1a1a1a]/70">
                  {report.quarantineProtocol.foliarSanitization}
                </p>
                <div className="text-[10px] font-mono text-[#1a1a1a]/60 pt-1">
                  Status: {report.quarantineProtocol.required ? 'Strict Zone Barrier' : 'Preventive Advisory'}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center space-y-3 bg-[#fafafa] border border-[rgba(0,0,0,0.06)] rounded-xs">
            <Sparkles className="w-8 h-8 text-[#1a1a1a]/30 mx-auto" />
            <h4 className="font-serif text-lg font-semibold text-[#1a1a1a]">
              No Prescriptions Compiled
            </h4>
            <p className="text-xs text-[#1a1a1a]/60 max-w-sm mx-auto font-mono">
              Click &apos;Generate Prescriptions&apos; to correlate leaf computer vision diagnostics with real-time IoT microclimate telemetry.
            </p>
            <button
              onClick={onGenerateReport}
              disabled={isLoading}
              className="btn-lab inline-flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Synthesize Prescriptions</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

