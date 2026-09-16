import React from 'react';
import { Sprout, Droplets, Plus, Camera, ShieldCheck, Activity, ChevronRight, Volume2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { FarmPlot } from '../../data/cropGuardData';
import { speakText } from '../../utils/audioSpeech';

interface MyFarmScreenProps {
  language: Language;
  plots: FarmPlot[];
  onNavigate: (screen: any) => void;
  onSelectPlotForScan?: (plot: FarmPlot) => void;
}

export const MyFarmScreen: React.FC<MyFarmScreenProps> = ({
  language,
  plots,
  onNavigate,
  onSelectPlotForScan,
}) => {
  const t = TRANSLATIONS[language];
  const totalAcres = plots.reduce((acc, p) => acc + p.acres, 0).toFixed(1);

  const handleVoiceReadout = () => {
    if (language === 'ta') {
      speakText(`உங்கள் பண்ணையில் மொத்தம் 3 நிலப்பிரிவுகள் உள்ளன. மொத்த பரப்பளவு ${totalAcres} ஏக்கர். நிலம் 1 நெல் பயிர் 88 சதவீத ஆரோக்கியத்துடன் உள்ளது. நிலம் 2 தக்காளி பயிரில் இலைக்கருகல் அவதானிப்பு தேவைப்படுகிறது.`, 'ta');
    } else {
      speakText(`You have ${plots.length} farm plots totaling ${totalAcres} acres. Plot 1 Paddy is healthy at 88 percent. Plot 2 Tomato requires monitoring for early blight.`, 'en');
    }
  };

  return (
    <div id="screen-my-farm" className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* Top Farm Summary Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full w-fit mb-1 border border-emerald-200">
            <Sprout className="w-3.5 h-3.5" />
            <span>{t.farmer.village}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {t.screens.my_farm} ({totalAcres} {language === 'ta' ? 'ஏக்கர்' : 'Acres'})
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'ta' ? 'அனைத்து பயிர் நிலங்களின் நேரலை நிலை' : 'Live sensor telemetries and health diagnostics per field'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={handleVoiceReadout}
            className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            title="Listen Voice Summary"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            id="myfarm-add-crop-btn"
            onClick={() => onNavigate('add_crop')}
            className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-98"
          >
            <Plus className="w-5 h-5" />
            <span>{language === 'ta' ? 'புதிய பயிர் / நிலம் சேர்' : 'Add New Crop / Field'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Farm Plots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plots.map((plot) => (
          <div
            key={plot.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Plot Header Visual */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-stone-50 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">
                    {plot.imageThumbnail === 'rice' ? '🌾' : plot.imageThumbnail === 'tomato' ? '🍅' : '🌱'}
                  </span>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm leading-tight">
                      {language === 'ta' ? plot.nameTa : plot.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {language === 'ta' ? plot.cropTa : plot.crop} • {plot.variety}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    plot.status === 'Healthy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {language === 'ta' ? plot.statusTa : plot.status}
                </span>
              </div>

              {/* Body stats */}
              <div className="p-4 space-y-3">
                {/* Health score gauge */}
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-semibold text-stone-600">
                      {t.dashboard.healthScore}
                    </span>
                    <span className="text-sm font-bold text-emerald-900 font-mono">
                      {plot.healthScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        plot.healthScore > 80 ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${plot.healthScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      {language === 'ta' ? 'பரப்பளவு' : 'Area'}
                    </span>
                    <span className="font-bold text-stone-800">{plot.acres} Acres</span>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      {language === 'ta' ? 'மண் ஈரம்' : 'Moisture'}
                    </span>
                    <span className="font-bold text-stone-800">{plot.soilMoisture}%</span>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-stone-600 pt-1">
                  <div className="flex justify-between">
                    <span className="text-stone-400">{language === 'ta' ? 'பருவம்' : 'Stage'}</span>
                    <span className="font-semibold text-stone-800">
                      {language === 'ta' ? plot.stageTa : plot.stage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">{language === 'ta' ? 'கடைசி பாசனம்' : 'Last Irrigation'}</span>
                    <span className="font-medium text-stone-700">{plot.lastIrrigated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">{language === 'ta' ? 'சென்சார் முனையம்' : 'IoT Sensor Node'}</span>
                    <span className="font-mono text-emerald-800 text-[11px]">{plot.sensorNodeId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions for Plot */}
            <div className="p-3 bg-stone-50 border-t border-stone-100 flex gap-2">
              <button
                onClick={() => {
                  if (onSelectPlotForScan) onSelectPlotForScan(plot);
                  onNavigate('scan_crop');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{language === 'ta' ? 'இலை ஸ்கேன்' : 'Scan Leaf'}</span>
              </button>

              <button
                onClick={() => onNavigate('disease_risk')}
                className="py-2 px-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Forecast"
              >
                <Activity className="w-4 h-4 text-amber-600" />
                <span>{language === 'ta' ? 'ஆபத்து' : 'Risk'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
