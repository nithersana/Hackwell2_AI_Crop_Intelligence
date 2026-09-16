import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { CropScanRecord, CropType, SeverityLevel } from '../../types';
import { Language } from '../../data/translations';

interface AddScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveScan: (newScan: CropScanRecord) => void;
  language: Language;
  nextSuggestedDay: number;
}

const AVAILABLE_CROPS: { id: CropType; nameEn: string; nameTa: string }[] = [
  { id: 'Tomato', nameEn: 'Tomato', nameTa: 'தக்காளி' },
  { id: 'Rice', nameEn: 'Paddy (Rice)', nameTa: 'நெல்' },
  { id: 'Cotton', nameEn: 'Cotton', nameTa: 'பருத்தி' },
  { id: 'Potato', nameEn: 'Potato', nameTa: 'உருளைக்கிழங்கு' },
  { id: 'Corn (Maize)', nameEn: 'Corn (Maize)', nameTa: 'மக்காச்சோளம்' }
];

const COMMON_DISEASES: { name: string; nameTa: string; defaultSeverity: SeverityLevel; defaultHealth: number; defaultRisk: number }[] = [
  { name: 'Healthy (No Pathogen)', nameTa: 'ஆரோக்கியமான நிலை', defaultSeverity: 'Low', defaultHealth: 95, defaultRisk: 12 },
  { name: 'Early Blight (Alternaria solani)', nameTa: 'ஆரம்ப இலைக்கருகல்', defaultSeverity: 'Moderate', defaultHealth: 68, defaultRisk: 58 },
  { name: 'Late Blight (Phytophthora infestans)', nameTa: 'பிற்பட்ட இலைக்கருகல்', defaultSeverity: 'High', defaultHealth: 48, defaultRisk: 82 },
  { name: 'Rice Blast (Pyricularia oryzae)', nameTa: 'நெல் குலைநோய்', defaultSeverity: 'Moderate', defaultHealth: 65, defaultRisk: 64 },
  { name: 'Cotton Leaf Curl Virus', nameTa: 'பருத்தி இலைச்சுருள் வைரஸ்', defaultSeverity: 'Moderate', defaultHealth: 60, defaultRisk: 68 },
  { name: 'Powdery Mildew', nameTa: 'சாம்பல் நோய்', defaultSeverity: 'Low', defaultHealth: 75, defaultRisk: 42 },
  { name: 'Healing / In Remission', nameTa: 'குணமாகி வரும் நிலை', defaultSeverity: 'Low', defaultHealth: 88, defaultRisk: 22 }
];

export const AddScanModal: React.FC<AddScanModalProps> = ({
  isOpen,
  onClose,
  onSaveScan,
  language,
  nextSuggestedDay,
}) => {
  if (!isOpen) return null;

  const [dayNumber, setDayNumber] = useState<number>(nextSuggestedDay || 14);
  const [dateStr, setDateStr] = useState<string>('18 Sep 2026');
  const [selectedCrop, setSelectedCrop] = useState<CropType>('Tomato');
  const [diseaseName, setDiseaseName] = useState<string>('Early Blight (Healing / In Remission)');
  const [confidence, setConfidence] = useState<number>(96);
  const [severity, setSeverity] = useState<'Healthy' | 'Mild' | 'Moderate' | 'Severe' | 'Critical'>('Mild');
  const [healthScore, setHealthScore] = useState<number>(88);
  const [riskScore, setRiskScore] = useState<number>(24);
  const [recommendation, setRecommendation] = useState<string>(
    'Lesions desiccated; healthy terminal growth emerging. Continue weekly biological foliar spray.'
  );
  const [actionTaken, setActionTaken] = useState<string>('Applied bi-weekly Trichoderma foliar shield');

  const handleDiseasePreset = (preset: typeof COMMON_DISEASES[0]) => {
    setDiseaseName(preset.name);
    setHealthScore(preset.defaultHealth);
    setRiskScore(preset.defaultRisk);
    if (preset.defaultHealth >= 85) {
      setSeverity('Healthy');
      setRecommendation('Crop is vigorous. Maintain standard preventative biological spray and monitor soil moisture.');
    } else if (preset.defaultHealth >= 70) {
      setSeverity('Mild');
      setRecommendation('Prune lowest affected leaves showing spots. Apply neem oil 5ml/L to deter upward splash.');
    } else {
      setSeverity('Moderate');
      setRecommendation('Spray approved bio-fungicide or copper protective mix. Improve furrow drainage immediately.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let healthStatus: CropScanRecord['healthStatus'] = 'Healthy';
    if (healthScore >= 90) {
      healthStatus = 'Healthy';
    } else if (healthScore >= 80) {
      healthStatus = 'Improving';
    } else if (healthScore >= 65) {
      healthStatus = 'Mild infection';
    } else if (healthScore >= 45) {
      healthStatus = 'Moderate';
    } else {
      healthStatus = 'Severe';
    }

    const newScan: CropScanRecord = {
      id: `scan-manual-${Date.now()}`,
      date: dateStr,
      dayLabel: `Day ${dayNumber}`,
      dayNumber: Number(dayNumber),
      crop: selectedCrop,
      disease: diseaseName,
      confidence: Number(confidence),
      severity,
      healthScore: Number(healthScore),
      riskScore: Number(riskScore),
      healthStatus,
      recommendation,
      previousActionTaken: actionTaken,
      actionStatus: 'Done',
      growthStage: 'Flowering & Fruiting',
      notes: `Continuous monitoring scan logged on ${dateStr}. Health: ${healthScore}%, Risk: ${riskScore}%.`
    };

    onSaveScan(newScan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {language === 'ta' ? 'புதிய பயிர் ஸ்கேன் பதிவு செய்க' : 'Log New Crop Scan to Timeline'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'ta' ? 'தொடர் கண்காணிப்புக்காக புதிய ஸ்கேன் தரவை சேர்க்கவும்' : 'Store sequential health data for continuous tracking'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quick presets */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              {language === 'ta' ? 'விரைவு மாதிரிகள் (Presets):' : 'Quick Disease Presets:'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_DISEASES.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDiseasePreset(d)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 border border-stone-200"
                >
                  {language === 'ta' ? d.nameTa : d.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Day Label */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {language === 'ta' ? 'நாள் எண் (Day Number):' : 'Day Number:'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">Day</span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={dayNumber}
                  onChange={(e) => setDayNumber(Number(e.target.value))}
                  className="w-full pl-12 pr-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-stone-800"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {language === 'ta' ? 'தேதி (Date):' : 'Scan Date:'}
              </label>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                placeholder="18 Sep 2026"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Crop */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {language === 'ta' ? 'பயிர் (Crop):' : 'Crop:'}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-800 bg-white"
              >
                {AVAILABLE_CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'ta' ? c.nameTa : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Confidence */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {language === 'ta' ? 'AI நம்பகத்தன்மை %:' : 'AI Confidence %:'}
              </label>
              <input
                type="number"
                min="50"
                max="99"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-stone-800"
                required
              />
            </div>
          </div>

          {/* Disease */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              {language === 'ta' ? 'கண்டறியப்பட்ட நோய் (Disease):' : 'Identified Condition / Disease:'}
            </label>
            <input
              type="text"
              value={diseaseName}
              onChange={(e) => setDiseaseName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-800 font-medium"
              required
            />
          </div>

          {/* Severity & Scores */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {language === 'ta' ? 'தீவிரம்:' : 'Severity:'}
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 bg-white"
              >
                <option value="Healthy">Healthy</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-800 block mb-1">
                {language === 'ta' ? 'ஆரோக்கியம் %:' : 'Health Score %:'}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={healthScore}
                onChange={(e) => setHealthScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-sm font-bold text-emerald-900 bg-emerald-50/50"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-rose-800 block mb-1">
                {language === 'ta' ? 'அபாய புள்ளி %:' : 'Risk Score %:'}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={riskScore}
                onChange={(e) => setRiskScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-rose-300 text-sm font-bold text-rose-900 bg-rose-50/50"
                required
              />
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட நடவடிக்கை:' : 'AI Agronomic Recommendation:'}
            </label>
            <textarea
              rows={2}
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
              required
            />
          </div>

          {/* Action Taken */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              {language === 'ta' ? 'முந்தைய நடவடிக்கை (Action Done):' : 'Action Performed by Farmer:'}
            </label>
            <input
              type="text"
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
            >
              {language === 'ta' ? 'ரத்து செய்க' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ta' ? 'காலக்கோட்டில் சேர்க்க' : 'Add Scan to Timeline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
