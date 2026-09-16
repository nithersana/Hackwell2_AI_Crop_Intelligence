import React, { useState } from 'react';
import { Sprout, Check, ArrowLeft, ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { FarmPlot } from '../../data/cropGuardData';
import { speakText } from '../../utils/audioSpeech';

interface AddCropScreenProps {
  language: Language;
  onNavigate: (screen: any) => void;
  onAddPlot: (plot: FarmPlot) => void;
}

const CROP_OPTIONS = [
  { id: 'paddy', name: 'Paddy (Rice)', nameTa: 'நெல்', icon: '🌾', defaultVariety: 'CR-1009 Sub-1' },
  { id: 'tomato', name: 'Tomato', nameTa: 'தக்காளி', icon: '🍅', defaultVariety: 'Hybrid PKM-1' },
  { id: 'cotton', name: 'Cotton', nameTa: 'பருத்தி', icon: '🌱', defaultVariety: 'MCU-5' },
  { id: 'maize', name: 'Maize (Corn)', nameTa: 'மக்காச்சோளம்', icon: '🌽', defaultVariety: 'CO-6 Hybrid' },
  { id: 'sugarcane', name: 'Sugarcane', nameTa: 'கரும்பு', icon: '🎋', defaultVariety: 'Co 86032' },
  { id: 'banana', name: 'Banana', nameTa: 'வாழை', icon: '🍌', defaultVariety: 'Grand Naine' },
];

export const AddCropScreen: React.FC<AddCropScreenProps> = ({
  language,
  onNavigate,
  onAddPlot,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCrop, setSelectedCrop] = useState(CROP_OPTIONS[0]);
  const [plotName, setPlotName] = useState('Plot 4 - West Canal');
  const [plotNameTa, setPlotNameTa] = useState('நிலம் 4 - மேற்கு வாய்க்கால்');
  const [variety, setVariety] = useState(CROP_OPTIONS[0].defaultVariety);
  const [acres, setAcres] = useState('1.5');
  const [sowingDate, setSowingDate] = useState('2026-09-01');
  const [irrigation, setIrrigation] = useState('Drip Line');

  const handleCropSelect = (crop: typeof CROP_OPTIONS[0]) => {
    setSelectedCrop(crop);
    setVariety(crop.defaultVariety);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlot: FarmPlot = {
      id: `plot-${Date.now()}`,
      name: plotName,
      nameTa: plotNameTa,
      crop: selectedCrop.name,
      cropTa: selectedCrop.nameTa,
      variety,
      acres: parseFloat(acres) || 1.0,
      sowingDate,
      stage: 'Seedling / Early Vegetative',
      stageTa: 'நாற்று / ஆரம்ப வளர்ச்சிப் பருவம்',
      healthScore: 94,
      status: 'Healthy',
      statusTa: 'ஆரோக்கியமானது',
      soilMoisture: 75,
      soilPh: 6.8,
      lastIrrigated: 'Today',
      sensorNodeId: `NODE-TN-${Math.floor(100 + Math.random() * 900)}`,
      imageThumbnail: selectedCrop.id
    };

    onAddPlot(newPlot);
    onNavigate('my_farm');
  };

  const handleVoiceHelp = () => {
    if (language === 'ta') {
      speakText('புதிய பயிர் சேர்க்க உங்கள் பயிரைத் தேர்ந்தெடுத்து, நிலத்தின் பரப்பளவை ஏக்கரில் குறிப்பிட்டு சேமிக்கவும்.', 'ta');
    } else {
      speakText('To register a new crop, select the crop icon, enter acreage and variety, and click Save Crop.', 'en');
    }
  };

  return (
    <div id="screen-add-crop" className="space-y-6 max-w-3xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('my_farm')}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              {t.screens.add_crop}
            </h2>
            <p className="text-xs text-stone-500">
              {language === 'ta' ? 'புதிய பயிர் நிலத்தை பதிவு செய்து AI கண்கானிப்பை துவக்குங்கள்' : 'Register a new field plot to initiate AI risk tracking'}
            </p>
          </div>
        </div>

        <button
          onClick={handleVoiceHelp}
          className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          title="Voice Help"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Crop Selection Grid */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
            {language === 'ta' ? '1. பயிரைத் தேர்ந்தெடுக்கவும்' : '1. Select Crop Type'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CROP_OPTIONS.map((crop) => {
              const isSelected = selectedCrop.id === crop.id;
              return (
                <button
                  type="button"
                  key={crop.id}
                  onClick={() => handleCropSelect(crop)}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-emerald-200 text-stone-800'
                  }`}
                >
                  <span className="text-3xl">{crop.icon}</span>
                  <div className="text-center">
                    <p className="font-bold text-sm leading-tight">
                      {language === 'ta' ? crop.nameTa : crop.name}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      {language === 'ta' ? crop.name : crop.nameTa}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Plot & Variety Details */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
            {language === 'ta' ? '2. நிலம் மற்றும் பயிர் விவரங்கள்' : '2. Field & Agronomic Details'}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                {language === 'ta' ? 'நிலத்தின் பெயர் (Field Label)' : 'Field / Plot Label'}
              </label>
              <input
                type="text"
                required
                value={language === 'ta' ? plotNameTa : plotName}
                onChange={(e) => {
                  if (language === 'ta') setPlotNameTa(e.target.value);
                  else setPlotName(e.target.value);
                }}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-stone-900 font-semibold text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                {language === 'ta' ? 'பயிர் ரகம் (Variety)' : 'Crop Variety'}
              </label>
              <input
                type="text"
                required
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-stone-900 font-semibold text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                {language === 'ta' ? 'பரப்பளவு (ஏக்கரில்)' : 'Acreage (Acres)'}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-stone-900 font-semibold text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                {language === 'ta' ? 'விதைத்த தேதி' : 'Sowing / Transplanting Date'}
              </label>
              <input
                type="date"
                required
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-stone-900 font-semibold text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                {language === 'ta' ? 'பாசன முறை' : 'Irrigation System'}
              </label>
              <select
                value={irrigation}
                onChange={(e) => setIrrigation(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-stone-900 font-semibold text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
              >
                <option value="Drip Line">சொட்டுநீர் பாசனம் (Drip Line)</option>
                <option value="Canal Basin">வாய்க்கால் / மடை பாசனம் (Canal Flood)</option>
                <option value="Sprinkler">தெளிப்பு நீர் பாசனம் (Sprinkler)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                {language === 'ta' ? 'மண் வகை' : 'Soil Classification'}
              </label>
              <select
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-stone-900 font-semibold text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
              >
                <option>வண்டல் மண் (Alluvial Loam)</option>
                <option>களிமண் (Clayey Soil)</option>
                <option>செம்மண் (Red Laterite)</option>
                <option>கரிசல் மண் (Black Cotton Soil)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onNavigate('my_farm')}
            className="flex-1 py-3.5 px-4 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {t.common.cancel}
          </button>

          <button
            type="submit"
            id="add-crop-submit-btn"
            className="flex-2 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <Sprout className="w-5 h-5" />
            <span>{language === 'ta' ? 'பயிரை சேமித்து கண்காணிக்க' : 'Save Field & Activate AI'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
