import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, ShieldCheck, Sparkles, Eye, Info } from 'lucide-react';
import { CropScanRecord, LatestAiPrediction } from '../../types';
import { Language } from '../../data/translations';

interface CropHealthTrendChartProps {
  scans: CropScanRecord[];
  latestPrediction: LatestAiPrediction | null;
  language: Language;
  onSelectScan: (scan: CropScanRecord) => void;
  selectedScanId?: string;
}

type ChartTab = 'health' | 'disease' | 'risk' | 'multi';

export const CropHealthTrendChart: React.FC<CropHealthTrendChartProps> = ({
  scans,
  latestPrediction,
  language,
  onSelectScan,
  selectedScanId,
}) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('health');
  const [hoveredScan, setHoveredScan] = useState<CropScanRecord | null>(null);

  if (!scans || scans.length === 0) {
    return null;
  }

  const sortedScans = [...scans].sort((a, b) => a.dayNumber - b.dayNumber);
  const latestScan = sortedScans[sortedScans.length - 1];
  const firstScan = sortedScans[0];
  const previousScan = sortedScans.length > 1 ? sortedScans[sortedScans.length - 2] : null;

  const scoreDelta = previousScan ? latestScan.healthScore - previousScan.healthScore : 0;
  const isImproving = scoreDelta >= 5 || (latestScan.healthStatus === 'Improving' && scoreDelta >= 0);
  const isWorsening = scoreDelta <= -5;

  // Chart layout dimensions
  const svgWidth = 650;
  const svgHeight = 260;
  const paddingX = 50;
  const paddingTop = 30;
  const paddingBottom = 45;

  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  const minDay = Math.min(...sortedScans.map((s) => s.dayNumber));
  const maxDay = Math.max(
    latestPrediction ? latestPrediction.targetDayLabel.includes('Day') ? parseInt(latestPrediction.targetDayLabel.replace('Day ', ''), 10) || sortedScans[sortedScans.length - 1].dayNumber + 4 : sortedScans[sortedScans.length - 1].dayNumber + 4 : sortedScans[sortedScans.length - 1].dayNumber,
    sortedScans[sortedScans.length - 1].dayNumber + 1
  );

  const getX = (dayNum: number) => {
    if (maxDay === minDay) return paddingX + plotWidth / 2;
    return paddingX + ((dayNum - minDay) / (maxDay - minDay)) * plotWidth;
  };

  const getYHealth = (score: number) => {
    // 0 is bottom, 100 is top
    return paddingTop + (1 - score / 100) * plotHeight;
  };

  const getYRisk = (risk: number) => {
    return paddingTop + (1 - risk / 100) * plotHeight;
  };

  // Build SVG path for Health
  const healthPoints = sortedScans.map((s) => ({
    x: getX(s.dayNumber),
    y: getYHealth(s.healthScore),
    scan: s
  }));

  const healthPathD = healthPoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Fill area under health line
  const healthAreaD = healthPoints.length > 0
    ? `${healthPathD} L ${healthPoints[healthPoints.length - 1].x} ${paddingTop + plotHeight} L ${healthPoints[0].x} ${paddingTop + plotHeight} Z`
    : '';

  // Build SVG path for Risk
  const riskPoints = sortedScans.map((s) => ({
    x: getX(s.dayNumber),
    y: getYRisk(s.riskScore),
    scan: s
  }));

  const riskPathD = riskPoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Prediction point coordinates
  const predDayNum = latestPrediction
    ? parseInt(latestPrediction.targetDayLabel.replace('Day ', ''), 10) || (latestScan.dayNumber + 4)
    : latestScan.dayNumber + 4;
  const predX = getX(predDayNum);
  const predYHealth = latestPrediction ? getYHealth(latestPrediction.projectedHealthScore) : 0;
  const predYRisk = latestPrediction ? getYRisk(latestPrediction.projectedRiskScore) : 0;

  return (
    <div id="crop-health-trend-visualizer" className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Top Header & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-700" />
            <h3 className="text-lg font-bold text-stone-900 font-serif">
              {language === 'ta' ? 'தொடர் பயிர் ஆரோக்கிய & நோய் போக்கு வரைபடம்' : 'Continuous Crop Health & Disease Trajectory'}
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'ta'
              ? `${firstScan.dayLabel} முதல் ${latestScan.dayLabel} வரை (${sortedScans.length} தொடர் ஸ்கேன்கள் பதிவு செய்யப்பட்டுள்ளன)`
              : `Tracking trajectory from ${firstScan.dayLabel} to ${latestScan.dayLabel} (${sortedScans.length} continuous scans)`}
          </p>
        </div>

        {/* Dynamic Trajectory Badge */}
        <div className="flex items-center gap-2">
          {isImproving ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>
                {language === 'ta'
                  ? `ஆரோக்கியம் முன்னேறுகிறது (+${Math.abs(scoreDelta)} புள்ளிகள்)`
                  : `Improving Health (+${Math.abs(scoreDelta)} pts)`}
              </span>
            </div>
          ) : isWorsening ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
              <TrendingDown className="w-4 h-4 text-rose-700" />
              <span>
                {language === 'ta'
                  ? `பாதிப்பு அதிகரிக்கிறது (${scoreDelta} புள்ளிகள்)`
                  : `Worsening Infection (${scoreDelta} pts)`}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
              <Activity className="w-4 h-4 text-amber-700" />
              <span>{language === 'ta' ? 'சீரான நிலை (மாற்றமில்லை)' : 'Stable Condition'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs to switch trend perspective */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'health'
                ? 'bg-white text-emerald-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {language === 'ta' ? 'ஆரோக்கிய போக்கு (Health)' : 'Health Trend'}
          </button>
          <button
            onClick={() => setActiveTab('disease')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'disease'
                ? 'bg-white text-amber-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {language === 'ta' ? 'நோய் & தீவிரம் (Disease)' : 'Disease & Severity'}
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'risk'
                ? 'bg-white text-rose-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {language === 'ta' ? 'அபாய போக்கு (Risk Score)' : 'Risk Trend'}
          </button>
          <button
            onClick={() => setActiveTab('multi')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'multi'
                ? 'bg-white text-purple-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {language === 'ta' ? 'ஒப்பீட்டு வரைபடம் (Overlay)' : 'Multi-Metric'}
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-stone-600">
          {(activeTab === 'health' || activeTab === 'multi') && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="font-semibold text-stone-700">
                {language === 'ta' ? 'ஆரோக்கியம் %' : 'Health Score'}
              </span>
            </div>
          )}
          {(activeTab === 'risk' || activeTab === 'multi') && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="font-semibold text-stone-700">
                {language === 'ta' ? 'அபாய புள்ளி %' : 'Risk Score'}
              </span>
            </div>
          )}
          {latestPrediction && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-purple-500"></span>
              <span className="font-semibold text-purple-700">
                {language === 'ta' ? 'AI கணிப்பு (Projected)' : 'AI Prediction'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Responsive Chart Viewport */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-56 sm:h-64 select-none"
        >
          <defs>
            {/* Health Gradient */}
            <linearGradient id="healthFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            {/* Risk Gradient */}
            <linearGradient id="riskFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Gridlines & Benchmarks */}
          {[100, 75, 50, 25, 0].map((score) => {
            const y = getYHealth(score);
            return (
              <g key={score}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#e7e5e4"
                  strokeDasharray={score === 0 || score === 100 ? '0' : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#78716c"
                  fontFamily="monospace"
                >
                  {score}%
                </text>
              </g>
            );
          })}

          {/* Safe threshold zone (>75%) indicator */}
          <rect
            x={paddingX}
            y={getYHealth(100)}
            width={plotWidth}
            height={getYHealth(75) - getYHealth(100)}
            fill="#10b981"
            fillOpacity="0.04"
          />

          {/* Danger zone (<50%) indicator */}
          <rect
            x={paddingX}
            y={getYHealth(50)}
            width={plotWidth}
            height={getYHealth(0) - getYHealth(50)}
            fill="#ef4444"
            fillOpacity="0.03"
          />

          {/* Area Fill for Health */}
          {(activeTab === 'health' || activeTab === 'disease') && (
            <path d={healthAreaD} fill="url(#healthFillGrad)" />
          )}

          {/* Area Fill for Risk */}
          {activeTab === 'risk' && (
            <path
              d={`${riskPathD} L ${riskPoints[riskPoints.length - 1].x} ${paddingTop + plotHeight} L ${riskPoints[0].x} ${paddingTop + plotHeight} Z`}
              fill="url(#riskFillGrad)"
            />
          )}

          {/* Line for Health */}
          {(activeTab === 'health' || activeTab === 'disease' || activeTab === 'multi') && (
            <path
              d={healthPathD}
              fill="none"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Line for Risk */}
          {(activeTab === 'risk' || activeTab === 'multi') && (
            <path
              d={riskPathD}
              fill="none"
              stroke="#e11d48"
              strokeWidth="2.5"
              strokeDasharray={activeTab === 'multi' ? '4 2' : '0'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Forecast Dotted Projection to Latest AI Prediction */}
          {latestPrediction && (
            <g>
              {(activeTab === 'health' || activeTab === 'multi') && (
                <line
                  x1={healthPoints[healthPoints.length - 1].x}
                  y1={healthPoints[healthPoints.length - 1].y}
                  x2={predX}
                  y2={predYHealth}
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
              )}
              {(activeTab === 'risk' || activeTab === 'multi') && (
                <line
                  x1={riskPoints[riskPoints.length - 1].x}
                  y1={riskPoints[riskPoints.length - 1].y}
                  x2={predX}
                  y2={predYRisk}
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              )}

              {/* Projected AI Node Point */}
              <circle
                cx={predX}
                cy={activeTab === 'risk' ? predYRisk : predYHealth}
                r="7"
                fill="#7c3aed"
                stroke="#ffffff"
                strokeWidth="2.5"
                className="animate-pulse"
              />
              <text
                x={predX}
                y={(activeTab === 'risk' ? predYRisk : predYHealth) - 12}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#6d28d9"
              >
                AI {activeTab === 'risk' ? `${latestPrediction.projectedRiskScore}%` : `${latestPrediction.projectedHealthScore}%`}
              </text>
              <text
                x={predX}
                y={paddingTop + plotHeight + 16}
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="#7c3aed"
              >
                {latestPrediction.targetDayLabel}*
              </text>
            </g>
          )}

          {/* Individual Data Points */}
          {sortedScans.map((scan) => {
            const cx = getX(scan.dayNumber);
            const cyHealth = getYHealth(scan.healthScore);
            const cyRisk = getYRisk(scan.riskScore);
            const isSelected = selectedScanId === scan.id;
            const isHovered = hoveredScan?.id === scan.id;

            const markerColor =
              scan.healthStatus === 'Healthy'
                ? '#10b981'
                : scan.healthStatus === 'Mild infection' || scan.severity === 'Mild'
                ? '#84cc16'
                : scan.healthStatus === 'Improving'
                ? '#0d9488'
                : scan.severity === 'Moderate'
                ? '#f59e0b'
                : '#ef4444';

            return (
              <g
                key={scan.id}
                className="cursor-pointer transition-transform"
                onClick={() => onSelectScan(scan)}
                onMouseEnter={() => setHoveredScan(scan)}
                onMouseLeave={() => setHoveredScan(null)}
              >
                {/* Vertical scan guide line */}
                <line
                  x1={cx}
                  y1={paddingTop}
                  x2={cx}
                  y2={paddingTop + plotHeight}
                  stroke={isSelected ? '#047857' : '#e7e5e4'}
                  strokeWidth={isSelected ? '2' : '1'}
                  strokeDasharray={isSelected ? '0' : '2 2'}
                />

                {/* Main Health Node */}
                {(activeTab === 'health' || activeTab === 'disease' || activeTab === 'multi') && (
                  <circle
                    cx={cx}
                    cy={cyHealth}
                    r={isSelected || isHovered ? '9' : '6.5'}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth="3"
                    className="transition-all"
                  />
                )}

                {/* Risk Node */}
                {(activeTab === 'risk' || activeTab === 'multi') && (
                  <circle
                    cx={cx}
                    cy={cyRisk}
                    r={isSelected || isHovered ? '7' : '5'}
                    fill="#e11d48"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                )}

                {/* Score label above point */}
                <text
                  x={cx}
                  y={activeTab === 'risk' ? cyRisk - 10 : cyHealth - 11}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={activeTab === 'risk' ? '#be123c' : '#065f46'}
                >
                  {activeTab === 'risk' ? `${scan.riskScore}%` : `${scan.healthScore}%`}
                </text>

                {/* Day label below X-axis */}
                <text
                  x={cx}
                  y={paddingTop + plotHeight + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={isSelected ? '#047857' : '#44403c'}
                >
                  {scan.dayLabel}
                </text>

                {/* Status indicator tag below Day */}
                <text
                  x={cx}
                  y={paddingTop + plotHeight + 28}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#78716c"
                >
                  {scan.healthStatus === 'Improving' ? '↑ Improving' : scan.severity}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Trajectory Delta Breakdown Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <span className="text-[11px] font-semibold text-stone-500 block">
            {language === 'ta' ? 'ஆரம்ப நிலை' : 'Day 1 Baseline'}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-base font-bold text-stone-900">{firstScan.healthScore}%</span>
            <span className="text-[11px] text-stone-500">({firstScan.healthStatus})</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <span className="text-[11px] font-semibold text-stone-500 block">
            {language === 'ta' ? 'தற்போதைய நிலை' : 'Latest Scan Status'}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-base font-bold text-emerald-900">{latestScan.healthScore}%</span>
            <span className="text-[11px] font-bold text-emerald-700">({latestScan.healthStatus})</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <span className="text-[11px] font-semibold text-stone-500 block">
            {language === 'ta' ? 'ஆரோக்கிய மாற்றம் (Delta)' : 'Health Trajectory'}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-base font-bold ${
                scoreDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pts
            </span>
            <span className="text-[11px] text-stone-500">vs prev scan</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
          <span className="text-[11px] font-semibold text-purple-700 block flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-600" />
            {language === 'ta' ? 'AI கணிப்பு (அடுத்தது)' : 'Latest AI Prediction'}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-base font-bold text-purple-900">
              {latestPrediction ? `${latestPrediction.projectedHealthScore}%` : '92%'}
            </span>
            <span className="text-[11px] font-bold text-purple-700">
              {latestPrediction ? latestPrediction.targetDayLabel : 'Day 14'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
