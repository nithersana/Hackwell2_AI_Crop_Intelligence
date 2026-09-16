import React from 'react';
import { 
  CalendarCheck2, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { IMPLEMENTATION_ROADMAP } from '../data/architectureData';

export const RoadmapView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-lab flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="label">Implementation Roadmap</div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-[#1a1a1a] mt-1">
            End-to-End Engineering & Field Validation Roadmap
          </h2>
          <p className="text-xs text-[#1a1a1a]/70 max-w-3xl leading-relaxed mt-1">
            Structured 5-phase engineering blueprint prioritizing active pathology data collection, edge model quantization, 
            epidemiological time-series verification, automated actuation, and randomized field trials.
          </p>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-[#fafafa] border border-[rgba(0,0,0,0.06)] rounded-xs shrink-0">
          <div>
            <div className="label">Total Horizon</div>
            <div className="stat-value text-2xl text-[#166534]">30 Weeks</div>
          </div>
          <CalendarCheck2 className="w-6 h-6 text-[#166534]" />
        </div>
      </div>

      {/* Roadmap Phase Timeline Cards */}
      <div className="space-y-4">
        {IMPLEMENTATION_ROADMAP.map((item, idx) => (
          <div
            key={idx}
            className="card-lab space-y-4 hover:border-[rgba(0,0,0,0.15)] transition-all"
          >
            {/* Phase Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(0,0,0,0.06)] pb-3">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-xs bg-[#166534] text-white font-bold text-xs flex items-center justify-center shrink-0 font-mono">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#1a1a1a]">{item.phase}</h3>
                  <span className="tag text-[9px] mt-0.5 inline-block">
                    DURATION: {item.duration}
                  </span>
                </div>
              </div>

              <span className="tag text-[10px] self-start sm:self-center font-bold">
                MILESTONE: {item.milestoneTag}
              </span>
            </div>

            {/* Objectives & Deliverables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
              {/* Objectives */}
              <div className="lg:col-span-8 space-y-2">
                <div className="label">
                  Core Engineering Tasks & Sprint Goals:
                </div>
                <ul className="space-y-2 font-sans">
                  {item.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start space-x-2 text-[#1a1a1a]/85 leading-relaxed text-xs">
                      <ChevronRight className="w-3.5 h-3.5 text-[#166534] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tangible Deliverables */}
              <div className="lg:col-span-4 p-3.5 rounded-xs bg-[#fafafa] border border-[rgba(0,0,0,0.06)] space-y-2 self-start font-mono">
                <div className="label text-[#166534]">
                  Exit Criteria:
                </div>
                <ul className="space-y-1.5">
                  {item.deliverables.map((del, dIdx) => (
                    <li key={dIdx} className="flex items-start space-x-1.5 text-[#1a1a1a]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#166534] shrink-0 mt-0.5" />
                      <span className="text-[11px]">{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
