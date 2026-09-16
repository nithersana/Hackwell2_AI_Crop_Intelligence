import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Scan, 
  Crosshair, 
  Layers, 
  RefreshCw,
  Info,
  CheckCircle2,
  MousePointerClick,
  Pencil,
  Sparkles,
  X,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { DiseaseDetectionResult, SampleLeafImage, CropType, SeverityLevel } from '../types';
import { SAMPLE_LEAVES } from '../data/mockData';

interface VisionLabProps {
  detection: DiseaseDetectionResult | null;
  onDetectionUpdate: (detection: DiseaseDetectionResult) => void;
  cropHint: CropType;
  onCropHintChange: (crop: CropType) => void;
  isProcessing: boolean;
  onRunInference: (sample?: SampleLeafImage, customImgBase64?: string) => Promise<void>;
}

// Common crop disease presets for quick selection
const QUICK_DISEASE_PRESETS = [
  {
    name: 'Early Blight (Alternaria solani)',
    scientific: 'Alternaria solani',
    type: 'Fungal' as const,
    severity: 'Moderate' as const,
    damage: 19.4,
    statement: 'Early Blight detected with target-board necrotic lesions expanding on foliar lamina.',
    symptoms: [
      'Concentric dark-brown target-board rings surrounded by yellow chlorotic halo',
      'Collar rot lesions expanding along lateral veins',
      'Premature senescence of lower canopy leaflet tier'
    ]
  },
  {
    name: 'Powdery Mildew (Podosphaera / Leveillula)',
    scientific: 'Leveillula taurica',
    type: 'Fungal' as const,
    severity: 'Moderate' as const,
    damage: 24.0,
    statement: 'Powdery Mildew talcum-powder fungal sporulation spreading across adaxial foliage.',
    symptoms: [
      'Talcum powder-like white fungal colonies on adaxial leaf surface',
      'Bright yellow angular chlorotic patches on corresponding abaxial surface',
      'Leaflet curling and necrotic edge crisping under dry ambient airflow'
    ]
  },
  {
    name: 'Bacterial Leaf Spot (Xanthomonas)',
    scientific: 'Xanthomonas campestris pv. vesicatoria',
    type: 'Bacterial' as const,
    severity: 'High' as const,
    damage: 22.5,
    statement: 'Bacterial Leaf Spot active with water-soaked angular lesions and shot-hole perforations.',
    symptoms: [
      'Small, circular dark-brown water-soaked spots with translucent yellow halo',
      'Lesion centers dry out and drop, creating a shot-hole appearance',
      'Extensive marginal necrosis caused by bacterial ooze spread'
    ]
  },
  {
    name: 'Foliar Common Rust (Puccinia sorghi)',
    scientific: 'Puccinia sorghi',
    type: 'Fungal' as const,
    severity: 'High' as const,
    damage: 32.0,
    statement: 'Foliar Rust epidemic with elevated uredinial pustules rupturing leaf cuticles.',
    symptoms: [
      'Elevated golden-brown to cinnamon uredinial pustules rupturing leaf epidermis',
      'Pustules distributed densely on both upper and lower leaf surfaces',
      'Chlorotic stippling leading to rapid photosynthetic capacity loss'
    ]
  },
  {
    name: 'Septoria Leaf Spot (Septoria lycopersici)',
    scientific: 'Septoria lycopersici',
    type: 'Fungal' as const,
    severity: 'Moderate' as const,
    damage: 16.5,
    statement: 'Septoria Leaf Spot identified with pycnidia-bearing circular necrotic spots.',
    symptoms: [
      'Circular lesions with uniform dark margins and sunken gray-white centers',
      'Tiny black specks (pycnidia fruiting bodies) visible inside lesion centers',
      'Progressive defoliation advancing from ground upward into canopy'
    ]
  },
  {
    name: 'Nutrient Deficiency Chlorosis',
    scientific: 'Physiological Abiotic Stress',
    type: 'Physiological' as const,
    severity: 'Low' as const,
    damage: 27.5,
    statement: 'Abiotic physiological chlorosis detected: Interveinal nitrogen and iron deficiency.',
    symptoms: [
      'Interveinal chlorotic yellowing across leaf lamina while veins remain pale green',
      'Absence of fungal mycelia, bacterial ooze, or necrotic ring structures',
      'Stunted vegetative vigor due to reduced chlorophyll a/b synthesis'
    ]
  },
  {
    name: 'Healthy Vigorous Leaf',
    scientific: 'Solanum lycopersicum (Healthy)',
    type: 'Healthy' as const,
    severity: 'Low' as const,
    damage: 0.0,
    statement: 'Healthy plant specimen: Full chlorophyll saturation with zero detected foliar pathogens.',
    symptoms: [
      'Uniform rich green chlorophyll pigmentation across entire lamina',
      'Clean adaxial and abaxial stomatal surfaces with zero pathogen signs',
      'Firm turgor pressure and intact cellular cuticle layers'
    ]
  },
  {
    name: 'Tomato Late Blight (Phytophthora infestans)',
    scientific: 'Phytophthora infestans',
    type: 'Fungal' as const,
    severity: 'High' as const,
    damage: 28.4,
    statement: 'Late Blight outbreak in progress: Severe water-soaked lesions with sporulation.',
    symptoms: [
      'Large water-soaked irregular brown lesions with chlorotic yellow borders',
      'Marginal necrosis and rapid leaf tissue collapse',
      'Fine whitish sporulation visible under high ambient humidity'
    ]
  }
];

export const VisionLab: React.FC<VisionLabProps> = ({
  detection,
  onDetectionUpdate,
  cropHint,
  onCropHintChange,
  isProcessing,
  onRunInference
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleLeafImage>(SAMPLE_LEAVES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [showBoxes, setShowBoxes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [clickMessage, setClickMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Statement & Diagnosis Customization Modal State
  const [isStatementEditorOpen, setIsStatementEditorOpen] = useState(false);
  const [editedHeadline, setEditedHeadline] = useState('');
  const [editedDiseaseName, setEditedDiseaseName] = useState('');
  const [editedScientificName, setEditedScientificName] = useState('');
  const [editedPathogenType, setEditedPathogenType] = useState<'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Physiological' | 'Healthy'>('Fungal');
  const [editedSeverity, setEditedSeverity] = useState<SeverityLevel>('High');
  const [editedDamagePercent, setEditedDamagePercent] = useState<number>(25);
  const [editedSymptoms, setEditedSymptoms] = useState<string[]>([]);

  const showFeedback = (msg: string) => {
    setClickMessage(msg);
    setTimeout(() => setClickMessage(null), 3500);
  };

  const openStatementEditor = () => {
    const currentDisease = detection?.diseaseName || selectedSample.diseaseName;
    setEditedHeadline(
      detection?.customStatement ||
      `Active detection of ${currentDisease} in conjunction with microclimate saturation.`
    );
    setEditedDiseaseName(currentDisease);
    setEditedScientificName(detection?.scientificName || 'Phytophthora infestans');
    setEditedPathogenType(detection?.pathogenType || 'Fungal');
    setEditedSeverity(detection?.overallSeverity || selectedSample.severity);
    setEditedDamagePercent(detection?.affectedSurfacePercent ?? 28.4);
    setEditedSymptoms(
      detection?.symptoms && detection.symptoms.length > 0
        ? [...detection.symptoms]
        : [
            'Large water-soaked irregular brown lesions with chlorotic yellow borders',
            'Marginal necrosis and rapid leaf tissue collapse',
            'Fine whitish sporulation visible under high ambient humidity'
          ]
    );
    setIsStatementEditorOpen(true);
  };

  const applyPreset = (preset: typeof QUICK_DISEASE_PRESETS[0]) => {
    setEditedDiseaseName(preset.name);
    setEditedScientificName(preset.scientific);
    setEditedPathogenType(preset.type);
    setEditedSeverity(preset.severity);
    setEditedDamagePercent(preset.damage);
    setEditedHeadline(preset.statement);
    setEditedSymptoms([...preset.symptoms]);
    showFeedback(`Preset loaded: ${preset.name}`);
  };

  const handleApplyCustomStatement = () => {
    const activeDetection = detection || {
      detectionId: `det-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      crop: cropHint,
      pathogenType: editedPathogenType,
      diseaseName: editedDiseaseName,
      scientificName: editedScientificName,
      confidence: 0.95,
      overallSeverity: editedSeverity,
      affectedSurfacePercent: editedDamagePercent,
      leafStage: 'Flowering',
      boundingBoxes: [
        { id: 'box-1', x: 28, y: 30, width: 34, height: 30, label: editedDiseaseName, confidence: 0.95, severity: editedSeverity }
      ],
      symptoms: editedSymptoms.filter(s => s.trim().length > 0),
      inferenceLatencyMs: 24,
      modelEngine: 'Custom Pathologist Statement Override',
      isCustomImage: Boolean(customImage),
      customStatement: editedHeadline
    };

    const updated: DiseaseDetectionResult = {
      ...activeDetection,
      diseaseName: editedDiseaseName,
      scientificName: editedScientificName,
      pathogenType: editedPathogenType,
      overallSeverity: editedSeverity,
      affectedSurfacePercent: editedDamagePercent,
      symptoms: editedSymptoms.filter(s => s.trim().length > 0),
      customStatement: editedHeadline,
      boundingBoxes: (activeDetection.boundingBoxes || []).map(b => ({
        ...b,
        label: editedDiseaseName,
        severity: editedSeverity
      }))
    };

    onDetectionUpdate(updated);
    setIsStatementEditorOpen(false);
    showFeedback(`Saved! Diagnosis statement updated to "${editedDiseaseName}"`);
  };

  const handleSelectSample = (sample: SampleLeafImage) => {
    setSelectedSample(sample);
    setCustomImage(null);
    setSelectedBoxId(null);
    onCropHintChange(sample.crop);
    onRunInference(sample, undefined);
    showFeedback(`Loaded ${sample.crop} specimen: ${sample.diseaseName}`);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showFeedback('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCustomImage(base64);
      setSelectedBoxId(null);
      onRunInference(undefined, base64);
      showFeedback(`Custom image uploaded (${Math.round(file.size / 1024)} KB). Running analysis... You can also click "Change Statement" to customize the diagnosis.`);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const confidencePercent = detection ? Math.round(detection.confidence * 100) : 95;
  const canopyDamage = detection ? `${detection.affectedSurfacePercent}%` : '28.4%';
  const diseaseName = detection?.diseaseName || selectedSample.diseaseName;

  const activeBox = detection?.boundingBoxes.find((b) => b.id === selectedBoxId);

  return (
    <div className="space-y-6">
      {/* Variation 3 Threat Alert Banner with Change Statement Button */}
      <div className="threat-alert flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center space-x-2">
            <span className="label text-[#c53030] font-bold opacity-100">
              Critical Threat Level — {cropHint}
            </span>
            <button
              onClick={openStatementEditor}
              className="text-[10px] font-mono bg-[#c53030]/10 hover:bg-[#c53030]/20 text-[#c53030] px-2 py-0.5 rounded border border-[#c53030]/30 transition-colors cursor-pointer flex items-center space-x-1"
              title="Click to edit and customize this statement"
            >
              <Pencil className="w-2.5 h-2.5" />
              <span>Change Statement</span>
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]">
            {detection?.customStatement || `Active detection of ${diseaseName} in conjunction with microclimate saturation. Pathogen vulnerability score: ${confidencePercent}/100.`}
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="tag border-black/10 text-[#1a1a1a]">
            SEVERITY: {detection?.overallSeverity || selectedSample.severity}
          </span>
        </div>
      </div>

      {/* Grid: Visual Inference Card & Diagnostic Results Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Visual Inference */}
        <section className="card-lab flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(0,0,0,0.06)]">
              <div className="flex items-center space-x-2">
                <span className="label">Visual Inference</span>
                <span className="text-[10px] font-mono text-[#166534] bg-[#166534]/10 px-1.5 py-0.5 rounded">
                  CLICKABLE VIEWPORT
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition-colors cursor-pointer ${
                    showBoxes 
                      ? 'bg-[#166534] text-white' 
                      : 'bg-black/5 text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                  }`}
                  title="Toggle Detection Bounding Boxes"
                >
                  <Crosshair className="w-3 h-3 inline mr-1" />
                  BOXES
                </button>
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition-colors cursor-pointer ${
                    showHeatmap 
                      ? 'bg-[#c05621] text-white' 
                      : 'bg-black/5 text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                  }`}
                  title="Toggle Grad-CAM Saliency Map"
                >
                  <Layers className="w-3 h-3 inline mr-1" />
                  GRAD-CAM
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#166534] text-white hover:bg-[#14532d] shadow-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ring-1 ring-[#166534]"
                  title="Upload leaf photo from your device"
                >
                  <Upload className="w-3 h-3 inline mr-1" />
                  UPLOAD
                </button>
                <button
                  onClick={openStatementEditor}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-[#166534]/10 hover:bg-[#166534]/20 text-[#166534] font-medium transition-colors cursor-pointer flex items-center space-x-1 border border-[#166534]/25"
                  title="Change diagnosis statement, pathogen type, or symptoms"
                >
                  <Pencil className="w-3 h-3 inline mr-1" />
                  CHANGE STATEMENT
                </button>
              </div>
            </div>

            {/* Click Feedback Toast */}
            {clickMessage && (
              <div className="mt-3 p-2 bg-[#166534]/10 border border-[#166534]/30 rounded-xs flex items-center space-x-2 text-xs font-mono text-[#166534] transition-all">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{clickMessage}</span>
              </div>
            )}

            {/* Visualizer Viewport with Drag-and-Drop & Click Support */}
            <div 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative w-full aspect-4/3 bg-[#f0f0f0] rounded-xs border transition-all overflow-hidden flex items-center justify-center mt-4 ${
                isDraggingOver 
                  ? 'border-[#166534] border-2 bg-[#166534]/5 ring-4 ring-[#166534]/20' 
                  : 'border-[rgba(0,0,0,0.06)]'
              }`}
            >
              {customImage ? (
                <img
                  src={customImage}
                  alt="Leaf scan inspection"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center p-6"
                  dangerouslySetInnerHTML={{ __html: selectedSample.thumbnailSvg }}
                />
              )}

              {/* Drag-over indicator overlay */}
              {isDraggingOver && (
                <div className="absolute inset-0 bg-[#166534]/20 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 z-30 pointer-events-none">
                  <Upload className="w-8 h-8 text-[#166534] animate-bounce" />
                  <span className="text-xs font-mono font-bold text-[#166534] bg-white px-2 py-1 rounded">
                    Drop leaf photo here to analyze
                  </span>
                </div>
              )}

              {/* Grad-CAM Heatmap Simulation Overlay */}
              {showHeatmap && (
                <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-65 bg-[radial-gradient(ellipse_at_45%_45%,rgba(239,68,68,0.7)_0%,rgba(245,158,11,0.5)_35%,rgba(34,197,94,0.2)_65%,transparent_80%)]" />
              )}

              {/* Interactive Bounding Boxes Layer - CLICKABLE */}
              {showBoxes && detection && detection.boundingBoxes.map((box) => {
                const isSelected = selectedBoxId === box.id;
                return (
                  <div
                    key={box.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBoxId(isSelected ? null : box.id);
                      showFeedback(`Selected lesion: ${box.label} (${Math.round(box.confidence * 100)}% conf)`);
                    }}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`
                    }}
                    className={`absolute border-2 transition-all duration-200 cursor-pointer group z-10 ${
                      isSelected
                        ? 'ring-4 ring-white border-[#166534] bg-[#166534]/25 shadow-lg scale-102'
                        : box.severity === 'Critical'
                        ? 'border-[#c53030] bg-[#c53030]/10 hover:bg-[#c53030]/20'
                        : box.severity === 'High'
                        ? 'border-[#c05621] bg-[#c05621]/10 hover:bg-[#c05621]/20'
                        : 'border-[#166534] bg-[#166534]/10 hover:bg-[#166534]/20'
                    }`}
                    title="Click to inspect this lesion"
                  >
                    <div className="absolute -top-5 left-0 bg-[#1a1a1a] text-white font-mono text-[9px] px-1.5 py-0.5 whitespace-nowrap rounded-xs flex items-center space-x-1 group-hover:bg-[#166534] transition-colors">
                      <span>{box.label}</span>
                      <span className="opacity-80 font-bold">{Math.round(box.confidence * 100)}%</span>
                    </div>
                  </div>
                );
              })}

              {/* HUD Tag in Viewport */}
              <div className="absolute top-2.5 left-2.5 font-mono text-[10px] text-[#166534] bg-white/90 px-2 py-0.5 border border-[rgba(0,0,0,0.06)] rounded-xs pointer-events-none">
                RESOLVED: 4K_MACRO
              </div>

              <div className="absolute top-2.5 right-2.5 font-mono text-[10px] text-[#1a1a1a]/70 bg-white/90 px-2 py-0.5 border border-[rgba(0,0,0,0.06)] rounded-xs pointer-events-none">
                LATENCY: {detection ? `${detection.inferenceLatencyMs}ms` : '34ms'}
              </div>

              {/* Click-to-Upload Banner at bottom of viewport */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2.5 inset-x-4 bg-white/90 hover:bg-white text-[#1a1a1a] text-[10px] font-mono py-1 px-3 border border-[rgba(0,0,0,0.08)] rounded-xs shadow-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center space-x-1.5 text-[#166534]">
                  <MousePointerClick className="w-3 h-3" />
                  <span>Click to upload your own leaf or drop file</span>
                </span>
                <span className="text-[#1a1a1a]/50 text-[9px]">JPG, PNG, WEBP</span>
              </button>

              {/* Inference loading overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 z-20">
                  <RefreshCw className="w-8 h-8 text-[#166534] animate-spin" />
                  <span className="text-xs font-mono text-[#166534] tracking-wider uppercase">
                    Running Segmentation Pass...
                  </span>
                </div>
              )}
            </div>

            {/* Custom Photo State Bar */}
            {customImage && (
              <div className="mt-3 p-3 bg-white border border-[#166534]/30 rounded-xs flex flex-wrap items-center justify-between gap-2 text-xs font-mono shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
                  <span className="font-semibold text-[#166534]">Custom Photo Analyzed</span>
                  <span className="text-[11px] text-[#1a1a1a]/70 font-sans">
                    Statement: <strong>{diseaseName}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={openStatementEditor}
                    className="px-2.5 py-1 bg-[#166534] text-white hover:bg-[#14532d] rounded text-[10px] font-mono flex items-center space-x-1 cursor-pointer font-medium"
                    title="Change diagnosis statement for this picture"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Change Statement</span>
                  </button>
                  <button
                    onClick={() => {
                      setCustomImage(null);
                      handleSelectSample(selectedSample);
                    }}
                    className="px-2 py-1 bg-black/5 hover:bg-black/10 text-[#1a1a1a] rounded text-[10px] cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Selected Lesion Detail Popup (when box is clicked) */}
            {activeBox && (
              <div className="mt-3 p-3 bg-white border border-[#166534]/30 rounded-xs flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-[#166534] font-bold flex items-center space-x-1">
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>INSPECTING: {activeBox.label}</span>
                  </div>
                  <div className="text-[10px] text-[#1a1a1a]/60 mt-0.5">
                    Position: ({activeBox.x}%, {activeBox.y}%) | Size: {activeBox.width}% x {activeBox.height}% | Severity: {activeBox.severity}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBoxId(null)}
                  className="text-[10px] px-2 py-1 bg-black/5 hover:bg-black/10 rounded cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
            )}

            {/* Specimen Presets with Clear Click Affordance */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="label">Specimen Presets (Click any crop)</div>
                <span className="text-[9px] font-mono text-[#166534]">
                  6 PRESETS LOADED
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {SAMPLE_LEAVES.map((sample) => {
                  const isSelected = !customImage && selectedSample.id === sample.id;
                  return (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-1.5 border text-center transition-all cursor-pointer rounded-xs ${
                        isSelected
                          ? 'border-[#166534] bg-[#166534]/10 ring-2 ring-[#166534] shadow-xs'
                          : 'border-[rgba(0,0,0,0.08)] bg-white hover:border-[#166534]/50 hover:bg-[#166534]/5'
                      }`}
                      title={`Click to analyze ${sample.crop} - ${sample.diseaseName}`}
                    >
                      <div 
                        className="w-8 h-8 mx-auto mb-1"
                        dangerouslySetInnerHTML={{ __html: sample.thumbnailSvg }}
                      />
                      <div className="text-[10px] font-semibold text-[#1a1a1a] truncate">
                        {sample.crop}
                      </div>
                      <div className="text-[8px] font-mono text-[#166534]">
                        {sample.severity}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="control-row pt-2">
            <button
              onClick={() => {
                showFeedback('Triggering deep neural segmentation pass...');
                onRunInference(customImage ? undefined : selectedSample, customImage || undefined);
              }}
              disabled={isProcessing}
              className="btn-lab w-full flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5 text-white" />
              <span>{isProcessing ? 'Processing Model...' : 'Click to Re-Analyze Specimen'}</span>
            </button>
          </div>
        </section>

        {/* Card 2: Diagnostic Results */}
        <section className="card-lab flex flex-col justify-between space-y-5">
          <div className="space-y-6">
            <div className="pb-3 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
              <div className="label">Diagnostic Results</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={openStatementEditor}
                  className="text-[10px] font-mono bg-[#166534]/10 hover:bg-[#166534]/20 text-[#166534] font-medium px-2 py-0.5 rounded border border-[#166534]/25 flex items-center space-x-1 cursor-pointer transition-colors"
                  title="Click to edit and change diagnosis statement"
                >
                  <Pencil className="w-2.5 h-2.5" />
                  <span>Change Statement</span>
                </button>
                <span className="text-[10px] font-mono text-[#166534]">
                  CONFIRMED BY CV
                </span>
              </div>
            </div>

            {/* Detection Confidence Stat */}
            <div className="stat-group">
              <div className="label">Detection Confidence</div>
              <div className="stat-value">{confidencePercent}%</div>
              <p className="text-xs text-[#1a1a1a]/70 font-mono mt-1">
                {detection?.scientificName || 'Phytophthora infestans (Late Blight)'}
              </p>
            </div>

            {/* Canopy Damage Stat */}
            <div className="stat-group">
              <div className="label">Canopy Damage</div>
              <div className="stat-value" style={{ color: '#c05621' }}>
                {canopyDamage}
              </div>
              <p className="text-xs text-[#1a1a1a]/70 font-mono mt-1">
                Severity: {detection?.overallSeverity || selectedSample.severity}
              </p>
            </div>

            {/* Observed Symptomology */}
            <div className="p-4 bg-[#fafafa] border border-[rgba(0,0,0,0.06)] space-y-2">
              <div className="flex items-center justify-between">
                <div className="label">Observed Symptomology</div>
                <button
                  onClick={openStatementEditor}
                  className="text-[10px] text-[#166534] font-mono hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <Pencil className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              </div>
              <ul className="space-y-1.5 text-xs text-[#1a1a1a]/85 font-sans">
                {(detection?.symptoms || [
                  'Water-soaked irregular necrotic lesions expanding on foliar margins',
                  'Chlorotic yellow halos encircling primary infection sites',
                  'Active fungal mycelial growth under saturated ambient RH'
                ]).map((symptom, i) => (
                  <li 
                    key={i} 
                    onClick={() => showFeedback(`Inspected symptom: ${symptom}`)}
                    className="flex items-start space-x-2 p-1 rounded hover:bg-black/5 cursor-pointer transition-colors"
                    title="Click symptom to verify"
                  >
                    <span className="text-[#166534] font-bold">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Specs Strip */}
          <div className="pt-4 border-t border-[rgba(0,0,0,0.06)] grid grid-cols-3 gap-2 font-mono text-[10px] text-center text-[#1a1a1a]/60">
            <div>
              <span className="block opacity-60">MODEL</span>
              <span className="font-bold text-[#1a1a1a]">YOLOv11-OBB</span>
            </div>
            <div>
              <span className="block opacity-60">INFERENCE</span>
              <span className="font-bold text-[#166534]">EDGE GPU</span>
            </div>
            <div>
              <span className="block opacity-60">LATENCY</span>
              <span className="font-bold text-[#1a1a1a]">{detection?.inferenceLatencyMs || 34}ms</span>
            </div>
          </div>
        </section>

      </div>

      {/* Statement & Diagnosis Customization Modal */}
      {isStatementEditorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xs border border-[rgba(0,0,0,0.15)] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#f8f9fa] border-b border-[rgba(0,0,0,0.08)] flex items-start justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1a1a1a] flex items-center space-x-2">
                  <Pencil className="w-4 h-4 text-[#166534]" />
                  <span>Customize Diagnosis Statement & Pathology</span>
                </h3>
                <p className="text-xs text-[#1a1a1a]/70 font-sans mt-0.5">
                  Change the statement, disease profile, or symptoms for your uploaded picture to update all treatment recommendations.
                </p>
              </div>
              <button
                onClick={() => setIsStatementEditorOpen(false)}
                className="p-1 rounded text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-black/5 cursor-pointer transition-colors"
                title="Close editor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
              
              {/* Quick Preset Selector */}
              <div>
                <label className="label block mb-1.5 text-[11px]">
                  Quick Pathology Presets (1-Click Fill)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {QUICK_DISEASE_PRESETS.map((p) => {
                    const isActive = editedDiseaseName.includes(p.name.split(' ')[0]);
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className={`p-2 rounded-xs border text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#166534]/10 border-[#166534] text-[#166534] font-semibold ring-1 ring-[#166534]/30'
                            : 'bg-[#fafafa] border-[rgba(0,0,0,0.08)] text-[#1a1a1a]/80 hover:bg-[#f0f0f0]'
                        }`}
                      >
                        <div className="font-mono text-[10px] truncate">{p.name.split(' (')[0]}</div>
                        <div className="text-[9px] opacity-70 truncate">{p.type} • {p.severity}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Statement Text */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="label text-[11px]">
                    Threat Assessment Statement
                  </label>
                  <span className="text-[10px] font-mono text-[#1a1a1a]/50">
                    Displayed in Top Banner & Recommendations
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={editedHeadline}
                  onChange={(e) => setEditedHeadline(e.target.value)}
                  placeholder="Enter custom foliar statement..."
                  className="w-full text-xs font-mono p-2.5 bg-[#fafafa] border border-[rgba(0,0,0,0.15)] rounded-xs focus:ring-1 focus:ring-[#166534] focus:outline-none focus:bg-white leading-relaxed"
                />
              </div>

              {/* Disease & Scientific Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label block mb-1 text-[11px]">
                    Disease / Pathology Name
                  </label>
                  <input
                    type="text"
                    value={editedDiseaseName}
                    onChange={(e) => setEditedDiseaseName(e.target.value)}
                    placeholder="e.g., Tomato Late Blight"
                    className="w-full text-xs font-mono p-2 bg-[#fafafa] border border-[rgba(0,0,0,0.15)] rounded-xs focus:ring-1 focus:ring-[#166534] focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="label block mb-1 text-[11px]">
                    Scientific Pathogen Name
                  </label>
                  <input
                    type="text"
                    value={editedScientificName}
                    onChange={(e) => setEditedScientificName(e.target.value)}
                    placeholder="e.g., Phytophthora infestans"
                    className="w-full text-xs font-mono p-2 bg-[#fafafa] border border-[rgba(0,0,0,0.15)] rounded-xs focus:ring-1 focus:ring-[#166534] focus:outline-none focus:bg-white italic"
                  />
                </div>
              </div>

              {/* Pathogen Classification, Severity & Canopy Damage */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label block mb-1 text-[11px]">
                    Pathogen Type
                  </label>
                  <select
                    value={editedPathogenType}
                    onChange={(e) => setEditedPathogenType(e.target.value as any)}
                    className="w-full text-xs font-mono p-2 bg-[#fafafa] border border-[rgba(0,0,0,0.15)] rounded-xs focus:ring-1 focus:ring-[#166534] focus:outline-none"
                  >
                    <option value="Fungal">Fungal</option>
                    <option value="Bacterial">Bacterial</option>
                    <option value="Viral">Viral</option>
                    <option value="Pest">Pest</option>
                    <option value="Physiological">Physiological</option>
                    <option value="Healthy">Healthy</option>
                  </select>
                </div>
                <div>
                  <label className="label block mb-1 text-[11px]">
                    Overall Severity
                  </label>
                  <select
                    value={editedSeverity}
                    onChange={(e) => setEditedSeverity(e.target.value as SeverityLevel)}
                    className="w-full text-xs font-mono p-2 bg-[#fafafa] border border-[rgba(0,0,0,0.15)] rounded-xs focus:ring-1 focus:ring-[#166534] focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="label block mb-1 text-[11px]">
                    Canopy Damage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={editedDamagePercent}
                    onChange={(e) => setEditedDamagePercent(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-mono p-2 bg-[#fafafa] border border-[rgba(0,0,0,0.15)] rounded-xs focus:ring-1 focus:ring-[#166534] focus:outline-none"
                  />
                </div>
              </div>

              {/* Observed Symptoms */}
              <div>
                <label className="label block mb-1.5 text-[11px]">
                  Observed Symptomology (Foliar Characteristics)
                </label>
                <div className="space-y-1.5">
                  {editedSymptoms.map((symptom, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-[#166534] font-bold text-xs shrink-0">•</span>
                      <input
                        type="text"
                        value={symptom}
                        onChange={(e) => {
                          const updated = [...editedSymptoms];
                          updated[idx] = e.target.value;
                          setEditedSymptoms(updated);
                        }}
                        placeholder={`Symptom ${idx + 1}`}
                        className="w-full text-xs font-sans p-1.5 bg-[#fafafa] border border-[rgba(0,0,0,0.15)] rounded-xs focus:ring-1 focus:ring-[#166534] focus:outline-none focus:bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#f8f9fa] border-t border-[rgba(0,0,0,0.08)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsStatementEditorOpen(false)}
                className="px-4 py-2 rounded-xs border border-[rgba(0,0,0,0.15)] bg-white hover:bg-black/5 text-[#1a1a1a] text-xs font-mono transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCustomStatement}
                className="px-5 py-2 rounded-xs bg-[#166534] hover:bg-[#14532d] text-white text-xs font-mono font-semibold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Statement & Update Prescriptions</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
