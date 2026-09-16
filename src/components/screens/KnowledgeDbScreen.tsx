import React, { useState } from 'react';
import { BookOpen, Search, Filter, ShieldCheck, AlertCircle, Volume2, ChevronRight } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { DISEASE_DATABASE, DiseaseDbEntry } from '../../data/cropGuardData';
import { speakText } from '../../utils/audioSpeech';

interface KnowledgeDbScreenProps {
  language: Language;
  onNavigate: (screen: any) => void;
}

export const KnowledgeDbScreen: React.FC<KnowledgeDbScreenProps> = ({
  language,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(DISEASE_DATABASE[0].id);

  const filteredDiseases = DISEASE_DATABASE.filter((d) => {
    const matchesCrop = selectedCrop === 'all' || d.crop.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesSearch = 
      d.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.diseaseNameTa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  const handleVoiceReadout = (d: DiseaseDbEntry) => {
    if (language === 'ta') {
      speakText(`${d.diseaseNameTa}. அறிவியல் பெயர்: ${d.scientificName}. இயற்கை மேலாண்மை: ${d.organicManagementTa}`, 'ta');
    } else {
      speakText(`${d.diseaseName}. Pathogen: ${d.scientificName}. Organic remedy: ${d.organicManagement}`, 'en');
    }
  };

  return (
    <div id="screen-knowledge-base" className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'அறிவு களஞ்சியம்' : 'Agronomic Encyclopedia'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {t.screens.knowledge_base}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'ta'
              ? 'பயிர் நோய்கள், அறிகுறிகள் மற்றும் இயற்கை/ரசாயன கட்டுப்பாட்டு முறைகள்'
              : 'Pathology compendium, visual symptoms, microclimate triggers, and bio-inputs'}
          </p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ta' ? 'நோய் அல்லது பயிர் பெயரைத் தேடுங்கள்...' : 'Search disease, crop, or pathogen...'}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
          />
        </div>

        {/* Crop Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['all', 'Tomato', 'Paddy', 'Cotton', 'Maize'].map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCrop === crop
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {crop === 'all' ? (language === 'ta' ? 'அனைத்து பயிர்கள்' : 'All Crops') : crop}
            </button>
          ))}
        </div>
      </div>

      {/* Diseases List */}
      <div className="space-y-4">
        {filteredDiseases.map((d) => {
          const isExpanded = expandedId === d.id;

          return (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all"
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : d.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-stone-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
                    {d.crop === 'Tomato' ? '🍅' : d.crop === 'Paddy (Rice)' ? '🌾' : d.crop === 'Cotton' ? '🌱' : '🌽'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {language === 'ta' ? d.cropTa : d.crop}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-800 font-mono">
                        {language === 'ta' ? d.pathogenTypeTa : d.pathogenType}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-base mt-0.5">
                      {language === 'ta' ? d.diseaseNameTa : d.diseaseName}
                    </h3>
                    <p className="text-xs text-stone-400 font-mono italic">
                      {d.scientificName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-semibold text-stone-500">
                    {language === 'ta' ? d.riskMonthTa : d.riskMonth}
                  </span>
                  <ChevronRight
                    className={`w-5 h-5 text-stone-400 transition-transform ${
                      isExpanded ? 'rotate-90 text-emerald-700' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-stone-100 space-y-4 bg-stone-50/40">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleVoiceReadout(d)}
                      className="py-1.5 px-3 rounded-lg bg-emerald-100/80 text-emerald-900 hover:bg-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.common.listenAudio}</span>
                    </button>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 mb-2">
                      {language === 'ta' ? 'அடையாள அறிகுறிகள் (Symptoms):' : 'Key Visual Symptoms:'}
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700">
                      {(language === 'ta' ? d.symptomsTa : d.symptoms).map((symptom, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weather Trigger */}
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <strong className="block font-semibold mb-0.5">
                      {language === 'ta' ? 'சாதகமான வானிலை சூழல் (Triggers):' : 'Favorable Weather Triggers:'}
                    </strong>
                    <span>{language === 'ta' ? d.triggersTa : d.triggers}</span>
                  </div>

                  {/* Dual Management (Organic vs Chemical) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                      <strong className="text-emerald-950 block font-bold uppercase tracking-wider">
                        {t.common.organic}:
                      </strong>
                      <p className="text-stone-700">
                        {language === 'ta' ? d.organicManagementTa : d.organicManagement}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                      <strong className="text-amber-950 block font-bold uppercase tracking-wider">
                        {t.common.chemical}:
                      </strong>
                      <p className="text-stone-700">
                        {language === 'ta' ? d.chemicalManagementTa : d.chemicalManagement}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
