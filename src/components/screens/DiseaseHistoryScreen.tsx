import React, { useState } from 'react';
import { History, FileDown, CheckCircle2, AlertCircle, Clock, Volume2, Search } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../data/translations';
import { HistoryRecord } from '../../data/cropGuardData';
import { speakText } from '../../utils/audioSpeech';

interface DiseaseHistoryScreenProps {
  language: Language;
  history: HistoryRecord[];
  onNavigate: (screen: any) => void;
}

export const DiseaseHistoryScreen: React.FC<DiseaseHistoryScreenProps> = ({
  language,
  history,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];
  const [downloadToast, setDownloadToast] = useState(false);

  const handleDownloadReport = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 2500);
  };

  const handleVoiceReadout = () => {
    if (language === 'ta') {
      speakText('நோய் வரலாறு: கடந்த 2 மாதங்களில் பதிவு செய்யப்பட்ட 3 நோய் சம்பவங்களில் 2 முழுமையாக குணமடைந்துள்ளது. 1 கட்டுக்குள் வைக்கப்பட்டுள்ளது. சராசரி மீட்பு காலம் 6 நாட்கள் ஆகும்.', 'ta');
    } else {
      speakText('Disease History Archive: 3 past pathogen outbreaks recorded over the last two months. 2 resolved successfully, 1 currently controlled. Average recovery duration is 6 days.', 'en');
    }
  };

  return (
    <div id="screen-history" className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-xs font-bold uppercase mb-1">
            <History className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'பதிவேடு' : 'Historical Audit Log'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            {t.screens.history} ({history.length} {language === 'ta' ? 'பதிவுகள்' : 'Events'})
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'ta'
              ? 'முந்தைய நோய்த்தாக்குதல்கள், பயன்படுத்திய மருந்துகள் மற்றும் குணமடைந்த விவரங்கள்'
              : 'Archived diagnostics, IPM treatments deployed, and biological recovery durations'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVoiceReadout}
            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            title="Listen Audio"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownloadReport}
            className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>{t.common.downloadReport}</span>
          </button>
        </div>
      </div>

      {downloadToast && (
        <div className="p-3 bg-emerald-700 text-white rounded-xl shadow-md text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{language === 'ta' ? 'பண்ணை நோய் அறிக்கை (PDF) பதிவிறக்கம் செய்யப்படுகிறது!' : 'CropGuard Farm Pathology Summary Report PDF generated!'}</span>
          </div>
        </div>
      )}

      {/* History Items List */}
      <div className="space-y-4">
        {history.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    {record.date}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800">
                    {language === 'ta' ? record.plotNameTa : record.plotName}
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 text-base mt-1">
                  {language === 'ta' ? record.pathogenTa : record.pathogen}
                </h3>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase self-start sm:self-auto ${
                  record.outcome === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {language === 'ta' ? record.outcomeTa : record.outcome}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-stone-400 block font-semibold mb-0.5">
                  {language === 'ta' ? 'துவக்க தீவிரத்தன்மை:' : 'Initial Severity:'}
                </span>
                <span className="font-bold text-stone-800">{record.initialSeverity}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-stone-400 block font-semibold mb-0.5">
                  {language === 'ta' ? 'குணமடைந்த காலம்:' : 'Time to Recovery:'}
                </span>
                <span className="font-bold text-emerald-800">
                  {record.recoveryDays} {language === 'ta' ? 'நாட்கள்' : 'Days'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-stone-700">
              <strong className="text-emerald-950 block mb-0.5">
                {language === 'ta' ? 'பயன்படுத்தப்பட்ட சிகிச்சை முறை:' : 'Treatment Intervention:'}
              </strong>
              <span>{language === 'ta' ? record.treatmentUsedTa : record.treatmentUsed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
