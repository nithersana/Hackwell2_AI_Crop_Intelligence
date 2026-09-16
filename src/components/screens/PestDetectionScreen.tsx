import React, { useState } from 'react';
import { Bug, AlertTriangle, ShieldCheck, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { PestRecord } from '../../data/cropGuardData';
import { speakText } from '../../utils/audioSpeech';

interface PestDetectionScreenProps {
  language: Language;
  pests: PestRecord[];
  onNavigate: (screen: any) => void;
}

export const PestDetectionScreen: React.FC<PestDetectionScreenProps> = ({
  language,
  pests,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedPest, setSelectedPest] = useState(pests[0]);

  const handleVoiceReadout = () => {
    if (language === 'ta') {
      speakText(`பூச்சி தாக்குதல் அறிக்கை: மக்காச்சோளத்தில் படைப்புழு தாக்குதல் தீவிர எச்சரிக்கையாக உள்ளது. சதுர மீட்டருக்கு 14 புழுக்கள் உள்ளன, இது பொருளாதார சேத எல்லையை விட அதிகம். இயற்கை தீர்வாக வேப்பங்கொட்டை சாறு 5% அல்லது பேசில்லஸ் துரிஞ்சியென்சிஸ் தெளிக்கவும்.`, 'ta');
    } else {
      speakText(`Pest scouting report: Fall Armyworm on Maize exceeds Economic Threshold Level with 14 larvae per square meter. Urgent bio-control with NSKE 5% or Bacillus thuringiensis is recommended.`, 'en');
    }
  };

  return (
    <div id="screen-pest-detection" className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase mb-1">
            <Bug className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'ta' ? 'பூச்சி கண்காணிப்பு' : 'Entomology Scout AI'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {t.screens.pest_detection}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'ta'
              ? 'பொருளாதார சேத நிலை (ETL) மற்றும் இயற்கை ஒட்டுண்ணிகள் வழிகாட்டல்'
              : 'Pheromone trap counts, density vs. ETL threshold, and predator-based biocontrol'}
          </p>
        </div>

        <button
          onClick={handleVoiceReadout}
          className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          title="Listen Audio"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Grid of Pests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pests.map((pest) => {
          const isSelected = selectedPest.id === pest.id;
          const isCritical = pest.severity === 'Critical';

          return (
            <div
              key={pest.id}
              onClick={() => setSelectedPest(pest)}
              className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-emerald-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isCritical
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {language === 'ta' ? pest.severityTa : pest.severity}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    {language === 'ta' ? pest.targetCropTa : pest.targetCrop}
                  </span>
                </div>

                <h3 className="font-bold text-stone-900 text-base">
                  {language === 'ta' ? pest.pestNameTa : pest.pestName}
                </h3>
                <p className="text-xs text-stone-500 font-mono italic mb-3">
                  {pest.scientificName}
                </p>

                {/* Density vs ETL */}
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">{language === 'ta' ? 'கண்டறியப்பட்ட அடர்த்தி:' : 'Observed Density:'}</span>
                    <span className="font-bold text-stone-900 font-mono">{pest.density} / m²</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">{language === 'ta' ? 'பொருளாதார சேத எல்லை (ETL):' : 'Threshold (ETL):'}</span>
                    <span className="font-bold text-amber-700 font-mono">{pest.threshold} / m²</span>
                  </div>

                  {/* Visual gauge */}
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pest.density > pest.threshold ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (pest.density / (pest.threshold * 1.5)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>{language === 'ta' ? 'விரிவான தீர்வு காண்க' : 'Inspect Biocontrol'}</span>
                <span>&rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Pest Detail & Integrated Pest Management Plan */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {language === 'ta' ? 'ஒருங்கிணைந்த பூச்சி மேலாண்மை (IPM)' : 'Selected IPM Protocol'}
            </span>
            <h3 className="text-xl font-bold text-stone-900 font-serif">
              {language === 'ta' ? selectedPest.pestNameTa : selectedPest.pestName} ({selectedPest.scientificName})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-stone-100 px-3 py-1 rounded-full font-mono text-stone-700">
              Trap Count: {selectedPest.trapCount} / trap / week
            </span>
          </div>
        </div>

        {/* Biological Predators & Parasitoids */}
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
          <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{language === 'ta' ? 'இயற்கை எதிரி பூச்சிகள் & ஒட்டுண்ணிகள்:' : 'Natural Biological Predators & Parasitoids:'}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {(language === 'ta' ? selectedPest.biologicalPredatorsTa : selectedPest.biologicalPredators).map((predator, i) => (
              <span
                key={i}
                className="text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 px-3 py-1 rounded-xl shadow-xs"
              >
                🪲 {predator}
              </span>
            ))}
          </div>
        </div>

        {/* Dual Treatment Cards (Organic vs Chemical) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Organic / Bio Solution */}
          <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {t.common.organic}
              </span>
              <span className="text-xs text-emerald-700 font-bold">1st Choice</span>
            </div>
            <p className="text-sm font-semibold text-stone-900">
              {language === 'ta' ? selectedPest.organicRemedyTa : selectedPest.organicRemedy}
            </p>
            <p className="text-xs text-stone-500">
              {language === 'ta'
                ? 'நன்மை செய்யும் பூச்சிகளுக்கு தீங்கு விளைவிக்காது. அறுவடைக்கு முன் காத்திருப்பு காலம் இல்லை.'
                : 'Zero withholding period. Safe for honeybees, predatory lacewings, and soil biota.'}
            </p>
          </div>

          {/* Targeted Chemical Solution */}
          <div className="p-5 rounded-2xl border border-amber-300 bg-amber-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                {t.common.chemical}
              </span>
              <span className="text-xs text-amber-700 font-bold">ETL Exceeded</span>
            </div>
            <p className="text-sm font-semibold text-stone-900">
              {language === 'ta' ? selectedPest.chemicalRemedyTa : selectedPest.chemicalRemedy}
            </p>
            <p className="text-xs text-stone-500">
              {language === 'ta'
                ? 'மாலை வேளையில் பாதுகாப்பு உடை அணிந்து தெளிக்கவும். காத்திருப்பு காலம்: 7 நாட்கள்.'
                : 'Wear PPE gloves. Spray strictly during calm twilight hours. Observe 7-day harvest interval.'}
            </p>
          </div>
        </div>

        {/* Quick Navigator to Dosage Calculator */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => onNavigate('recommendations')}
            className="py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>{language === 'ta' ? 'தெளிப்பான் தொட்டி கணக்கீடு' : 'Knapsack Tank Dosage Calculator'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
