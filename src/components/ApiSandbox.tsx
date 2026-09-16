import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Check, 
  Copy, 
  RefreshCw
} from 'lucide-react';
import { DiseaseDetectionResult, SensorTelemetry } from '../types';

interface ApiSandboxProps {
  currentDetection: DiseaseDetectionResult | null;
  currentTelemetry: SensorTelemetry;
}

export const ApiSandbox: React.FC<ApiSandboxProps> = ({
  currentDetection,
  currentTelemetry
}) => {
  const [activeEndpoint, setActiveEndpoint] = useState<'cv' | 'iot' | 'rec'>('cv');
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responsePayload, setResponsePayload] = useState<any>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const endpoints = [
    {
      id: 'cv',
      method: 'POST',
      path: '/api/cv/inference',
      title: 'Computer Vision Disease Inference',
      description: 'Accepts crop hints or image payloads, runs YOLOv11/ResNet classification & lesion bounding box localization.',
      defaultBody: JSON.stringify({
        cropHint: currentDetection?.crop || 'Tomato',
        sampleId: 'sample-tomato-late-blight'
      }, null, 2)
    },
    {
      id: 'iot',
      method: 'POST',
      path: '/api/iot/ingest',
      title: 'IoT Telemetry Ingestion',
      description: 'Ingests real-time environmental sensors (moisture, temp, RH), computes VPD and spore danger.',
      defaultBody: JSON.stringify({
        deviceId: currentTelemetry.deviceId,
        zoneId: currentTelemetry.zoneId,
        crop: currentTelemetry.crop,
        soilMoisturePercent: currentTelemetry.soilMoisturePercent,
        ambientTempC: currentTelemetry.ambientTempC,
        canopyTempC: currentTelemetry.canopyTempC,
        relativeHumidityPercent: currentTelemetry.relativeHumidityPercent,
        solarRadiationLux: currentTelemetry.solarRadiationLux,
        soilEc: currentTelemetry.soilEc,
        soilPh: currentTelemetry.soilPh,
        nitrogenPpm: currentTelemetry.nitrogenPpm
      }, null, 2)
    },
    {
      id: 'rec',
      method: 'POST',
      path: '/api/recommendations',
      title: 'Adaptive Multi-Modal Recommendation',
      description: 'Combines vision pathology findings + IoT microclimate parameters to prescribe actionable interventions.',
      defaultBody: JSON.stringify({
        detection: currentDetection || {
          crop: 'Tomato',
          diseaseName: 'Tomato Late Blight',
          overallSeverity: 'High',
          affectedSurfacePercent: 28.4,
          confidence: 0.94
        },
        telemetry: {
          zoneId: currentTelemetry.zoneId,
          crop: currentTelemetry.crop,
          ambientTempC: currentTelemetry.ambientTempC,
          relativeHumidityPercent: currentTelemetry.relativeHumidityPercent,
          soilMoisturePercent: currentTelemetry.soilMoisturePercent,
          vaporPressureDeficitKPa: currentTelemetry.vaporPressureDeficitKPa,
          nitrogenPpm: currentTelemetry.nitrogenPpm
        },
        cropStage: 'Flowering'
      }, null, 2)
    }
  ] as const;

  const currentConfig = endpoints.find((e) => e.id === activeEndpoint) || endpoints[0];
  const [requestBody, setRequestBody] = useState(currentConfig.defaultBody);

  const handleSwitchEndpoint = (id: 'cv' | 'iot' | 'rec') => {
    setActiveEndpoint(id);
    const target = endpoints.find((e) => e.id === id);
    if (target) {
      setRequestBody(target.defaultBody);
      setResponsePayload(null);
      setResponseStatus(null);
    }
  };

  const handleExecute = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    try {
      const parsedBody = JSON.parse(requestBody);
      const res = await fetch(currentConfig.path, {
        method: currentConfig.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody)
      });
      setResponseStatus(res.status);
      const data = await res.json();
      setResponsePayload(data);
    } catch (err: any) {
      setResponseStatus(500);
      setResponsePayload({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const curlCommand = `curl -X ${currentConfig.method} "https://your-domain.com${currentConfig.path}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody.replace(/\n/g, '')}'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-lab flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="label">Live Runtime Sandbox</div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-[#1a1a1a] mt-1">
            Interactive API Endpoint Sandbox & cURL Generator
          </h2>
          <p className="text-xs text-[#1a1a1a]/70 max-w-3xl leading-relaxed mt-1">
            Execute real HTTP requests directly against this application&apos;s active Express server to inspect payloads, 
            schema validations, response headers, and latency.
          </p>
        </div>
      </div>

      {/* Endpoint Picker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
        {endpoints.map((ep) => {
          const isSelected = activeEndpoint === ep.id;
          return (
            <button
              key={ep.id}
              onClick={() => handleSwitchEndpoint(ep.id)}
              className={`p-3.5 rounded-xs border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#166534] bg-[#166534]/5 ring-1 ring-[#166534] shadow-xs'
                  : 'border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.2)] bg-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="tag text-[9px] font-bold">
                  {ep.method}
                </span>
                <span className="text-xs font-semibold text-[#1a1a1a] truncate">
                  {ep.path}
                </span>
              </div>
              <div className="text-xs font-bold text-[#1a1a1a] mt-2 font-sans">{ep.title}</div>
              <p className="text-[11px] text-[#1a1a1a]/60 mt-1 line-clamp-2 font-sans">
                {ep.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Live Request / Response Console */}
      <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 font-mono shadow-xs">
        
        {/* Left: Request Configuration */}
        <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-[rgba(0,0,0,0.06)] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(0,0,0,0.06)]">
              <span className="text-xs font-semibold text-[#1a1a1a] flex items-center space-x-2">
                <span className="text-[#166534] font-bold">{currentConfig.method}</span>
                <span>{currentConfig.path}</span>
              </span>
              <button
                onClick={copyCurl}
                className="text-[11px] text-[#1a1a1a]/70 hover:text-[#1a1a1a] flex items-center space-x-1 cursor-pointer"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-[#166534]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? 'COPIED' : 'COPY CURL'}</span>
              </button>
            </div>

            <div>
              <div className="label mb-1">
                JSON Request Body:
              </div>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={14}
                className="w-full bg-[#fafafa] text-[#166534] font-bold text-xs p-3 rounded-xs border border-[rgba(0,0,0,0.08)] focus:outline-none focus:border-[#166534] leading-relaxed resize-none selection:bg-[#166534]/15"
              />
            </div>
          </div>

          {/* Trigger Execute Button */}
          <button
            onClick={handleExecute}
            disabled={isLoading}
            className="btn-lab w-full flex items-center justify-center space-x-2 shadow-xs"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white text-white" />
            )}
            <span>{isLoading ? 'Executing...' : `Execute Request to ${currentConfig.path}`}</span>
          </button>
        </div>

        {/* Right: Response Output */}
        <div className="lg:col-span-6 p-5 flex flex-col space-y-3 bg-[#fafafa]">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(0,0,0,0.06)]">
            <span className="text-xs font-semibold text-[#1a1a1a]">
              HTTP Response Payload
            </span>
            {responseStatus && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                  responseStatus === 200
                    ? 'bg-[#166534]/10 text-[#166534] border border-[#166534]/30'
                    : 'bg-[#c53030]/10 text-[#c53030] border border-[#c53030]/30'
                }`}
              >
                STATUS: {responseStatus} OK
              </span>
            )}
          </div>

          <div className="flex-1 bg-white p-4 rounded-xs border border-[rgba(0,0,0,0.08)] overflow-x-auto min-h-[350px] text-xs text-[#1a1a1a]">
            {responsePayload ? (
              <pre className="text-[#166534] font-mono selection:bg-[#166534]/15">
                {JSON.stringify(responsePayload, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#1a1a1a]/40 space-y-2 py-12">
                <Terminal className="w-8 h-8 text-[#1a1a1a]/30" />
                <p className="text-xs font-mono">Click &apos;Execute Request&apos; to view live server response.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
