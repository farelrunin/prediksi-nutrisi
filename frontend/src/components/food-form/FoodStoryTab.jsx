import React from 'react';
import { Brain, Sparkles, ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { translations } from '../../constants/translations';

const formatMetric = (value, suffix = '') => {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) {
    return `0${suffix}`;
  }
  const displayValue = Number.isInteger(numericValue) ? numericValue : numericValue.toFixed(1);
  return `${displayValue}${suffix}`;
};

const FoodStoryTab = ({
  story,
  handleStoryChange,
  language,
  activeTab,
  predicting,
  handleAnalyzeAI,
  predictionError,
  predictionResult,
  setOverrideData,
  setIsOverrideOpen,
  selectedMealType,
  setSelectedMealType,
  mealTypes,
  reportedIncorrect,
  reportingIncorrect,
  handleReportIncorrect,
  t
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <label className="mb-4 block text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {language === 'id' ? 'Ceritakan makanan Anda hari ini' : 'Tell us about your food today'}
        </label>
        <textarea
          value={story}
          onChange={(e) => handleStoryChange(e.target.value)}
          placeholder={language === 'id' ? 'Contoh: Sarapan bubur ayam, dan makan siang nasi Padang dengan rendang...' : 'Example: Had chicken porridge for breakfast, and Padang rice with rendang for lunch...'}
          className="min-h-[180px] w-full resize-none rounded-[2rem] border border-[var(--border-card)] bg-[var(--bg-primary)] px-8 py-6 text-[var(--text-main)] placeholder-slate-600 outline-none transition-all focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 text-lg leading-relaxed shadow-inner"
          required={activeTab === 'story'}
          maxLength="1000"
        />
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <Brain size={14} className="text-[var(--primary-green)]" />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              {language === 'id' ? 'AI akan menganalisis makanan, porsi, dan estimasi nutrisi untuk Anda.' : 'AI will analyze food, portion, and nutrition estimates for you.'}
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleAnalyzeAI}
            disabled={predicting || story.trim().length < 10}
            className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--primary-green)]/30 text-[var(--primary-green)] px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary-green)] hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {predicting ? (
              <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
            )}
            {predicting ? (language === 'id' ? 'Menganalisis...' : 'Analyzing...') : (language === 'id' ? 'Analisis dengan AI' : 'Analyze with AI')}
          </button>
        </div>
      </div>

      {predicting && (
        <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in duration-500">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain size={16} className="text-[var(--primary-green)] animate-pulse" />
            </div>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-[var(--primary-green)]">{language === 'id' ? 'Menganalisis...' : 'Analyzing...'}</span>
        </div>
      )}

      {predictionError && !predicting && (
        <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-6 py-4 text-sm font-bold text-[var(--danger)] animate-in slide-in-from-top">
          <p>{predictionError}</p>
        </div>
      )}

      {predictionResult && !predicting && (
        <div className="rounded-[2.5rem] border border-[var(--primary-green)]/20 bg-[var(--bg-secondary)] p-4 md:p-8 animate-in zoom-in-95 duration-500 shadow-2xl">
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="rounded-2xl bg-[var(--primary-green)] p-3 text-[var(--bg-primary)] shadow-lg shadow-emerald-500/30">
                <Brain size={24} />
              </div>
              <div>
                <div className="text-lg font-black text-[var(--text-main)]">
                  {predictionResult.food_name || predictionResult.makanan || (language === 'id' ? 'Hasil Analisis AI' : 'AI Analysis Results')}
                </div>
                <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                  {predictionResult.is_overridden ? (
                    <span className="text-[var(--primary-green)] font-extrabold">✏️ {language === 'id' ? 'Koreksi Manual' : 'Manual Correction'}</span>
                  ) : (
                    `${language === 'id' ? 'Akurasi AI' : 'AI Accuracy'}: ${predictionResult.confidence_persen || (predictionResult.confidence ? (predictionResult.confidence * 100).toFixed(0) : 100)}%`
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOverrideData({
                      foodName: predictionResult.food_name || predictionResult.makanan || '',
                      calories: predictionResult.calories || '',
                      protein: predictionResult.protein || '',
                      carbs: predictionResult.carbs || '',
                      fat: predictionResult.fat || ''
                    });
                    setIsOverrideOpen(true);
                  }}
                  className="text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--primary-green)] underline block mt-1"
                >
                  {language === 'id' ? 'Bukan ini makanannya?' : 'Not this food?'}
                </button>
              </div>
            </div>
            <div className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest border border-current bg-current/10 ${
              predictionResult.risk_level === 'tinggi' || predictionResult.risk_level === 'High' ? 'text-[var(--danger)]' : 
              predictionResult.risk_level === 'sedang' || predictionResult.risk_level === 'Medium' ? 'text-[var(--warning)]' : 'text-[var(--primary-green)]'
            }`}>
              {predictionResult.risk_level === 'tinggi' || predictionResult.risk_level === 'High' ? (language === 'id' ? 'RISIKO TINGGI' : 'HIGH RISK') : 
               predictionResult.risk_level === 'sedang' || predictionResult.risk_level === 'Medium' ? (language === 'id' ? 'RISIKO SEDANG' : 'MEDIUM RISK') : (language === 'id' ? 'RISIKO RENDAH' : 'LOW RISK')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-10">
            {[
              { label: t.calories, val: formatMetric(predictionResult.calories), color: 'text-[var(--primary-green)]' },
              { label: t.protein, val: formatMetric(predictionResult.protein, 'g'), color: 'text-[var(--accent-blue)]' },
              { label: t.carbs, val: formatMetric(predictionResult.carbs, 'g'), color: 'text-[var(--warning)]' },
              { label: t.fat, val: formatMetric(predictionResult.fat, 'g'), color: 'text-[var(--danger)]' }
            ].map((m) => (
              <div key={m.label} className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl px-4 py-6 text-center shadow-lg transition-transform hover:scale-105">
                <div className={`text-xl font-black mb-1 ${m.color}`}>{m.val}</div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">{m.label}</div>
              </div>
            ))}
          </div>

          {predictionResult.ai_advice && (
            <div className="mb-6 rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 relative overflow-hidden group text-left">
              <div className="absolute -top-4 -right-4 p-4 text-[var(--primary-green)] opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <MessageSquare size={100} strokeWidth={1} />
              </div>
              <div className="flex items-center gap-2 mb-3 text-[var(--primary-green)] font-black text-[10px] uppercase tracking-[0.3em] relative z-10">
                <Sparkles size={12} className="animate-pulse" />
                <span>AI Insight</span>
              </div>
              <p className="text-[var(--text-main)] text-sm italic font-medium leading-relaxed relative z-10">
                "{predictionResult.ai_advice}"
              </p>
            </div>
          )}

          {/* Dropdown Pilihan Sesi Makan */}
          <div className="mb-6 space-y-2 text-left">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
              {language === 'id' ? 'Sesi Makan' : 'Meal Session'}
            </label>
            <div className="relative">
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl px-5 py-4 text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] appearance-none cursor-pointer pr-10 shadow-sm"
              >
                {mealTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-[var(--bg-card)] text-[var(--text-main)]">
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[var(--text-muted)]">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Lapor Salah Deteksi Button */}
          <div className="mt-6 flex justify-end">
            {reportedIncorrect ? (
              <span className="text-[10px] font-black text-[var(--primary-green)] uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                {language === 'id' ? 'Laporan Diterima! Terima Kasih.' : 'Report Received! Thank You.'}
              </span>
            ) : (
              <button
                type="button"
                disabled={reportingIncorrect}
                onClick={handleReportIncorrect}
                className="text-[10px] font-black text-rose-500 hover:text-white uppercase tracking-wider bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 px-4 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
              >
                {reportingIncorrect ? (
                  <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HelpCircle size={12} />
                )}
                <span>{language === 'id' ? 'Hasil AI kurang tepat?' : 'AI result incorrect?'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodStoryTab;
