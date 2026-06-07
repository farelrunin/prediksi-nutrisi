import React from 'react';
import { CalendarDays, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';
import MagicCard from '../../../components/shared/MagicCard';

const AIInsightsTab = ({
  language,
  selectedDate,
  formatDayLabel,
  selectedDateEntries,
  selectedDateTotals,
  isAdviceLoading,
  dailyAdvice,
  actionableAdvice,
  isAiAdvice,
  handleGenerateInsight,
  t,
}) => {
  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in duration-300">
      {/* Header Date Analysis */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[2rem] p-4 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-[var(--primary-green)]" />
        <div>
          <h2 className="text-lg md:text-2xl font-black text-[var(--text-main)]">
            {language === 'id' ? 'Insight & Rekomendasi AI' : 'AI Insights & Advice'}
          </h2>
          <p className="text-[10px] md:text-xs text-[var(--text-muted)] font-semibold mt-1 md:mt-2 uppercase tracking-wide flex items-center gap-1.5">
            <CalendarDays size={12} className="text-[var(--primary-green)]" />
            <span>{language === 'id' ? 'Analisis Pintar untuk' : 'Smart Report for'}: {formatDayLabel(selectedDate + 'T00:00:00')}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 bg-[var(--primary-green)]/10 text-[var(--primary-green)] px-3 py-1.5 md:px-4 md:py-2.5 border border-emerald-500/20 rounded-lg md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest shrink-0 self-start md:self-auto shadow-sm">
          <Sparkles size={12} className="animate-pulse" />
          <span>{language === 'id' ? 'Mesin AI' : 'AI Engine'}</span>
        </div>
      </div>

      {selectedDateEntries.length === 0 ? (
        <div className="rounded-xl md:rounded-[2.5rem] border-2 border-dashed border-[var(--border-card)] p-8 md:p-20 text-center bg-[var(--bg-card)]/30 space-y-4 md:space-y-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[var(--bg-card)] rounded-xl md:rounded-2xl flex items-center justify-center mx-auto border border-[var(--border-card)] text-[var(--primary-green)]">
            <AlertCircle size={22} className="md:w-7 md:h-7" />
          </div>
          <h3 className="text-sm md:text-lg font-bold text-[var(--text-main)]">
            {language === 'id' ? 'Tidak Ada Data Nutrisi' : 'No Nutrition Data'}
          </h3>
          <p className="text-[10px] md:text-xs text-[var(--text-muted)] max-w-sm mx-auto font-semibold leading-relaxed">
            {language === 'id' 
              ? 'Catat asupan makanan Anda hari ini agar sistem dapat menyusun laporan dan rekomendasi nutrisi personal untuk Anda.' 
              : 'Record your food intake today so the system can generate your personalized nutrition report and recommendations.'}
          </p>
        </div>
      ) : (
        <>
          {/* Insights Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              { label: t.calories, val: Math.round(selectedDateTotals.calories), unit: 'kcal', color: 'border-emerald-500/20 bg-emerald-500/5 text-[var(--primary-green)]' },
              { label: t.protein, val: Math.round(selectedDateTotals.protein), unit: 'g', color: 'border-blue-500/20 bg-blue-500/5 text-[var(--accent-blue)]' },
              { label: t.carbs, val: Math.round(selectedDateTotals.carbs), unit: 'g', color: 'border-amber-500/20 bg-amber-500/5 text-[var(--warning)]' },
              { label: t.fat, val: Math.round(selectedDateTotals.fat), unit: 'g', color: 'border-rose-500/20 bg-rose-500/5 text-[var(--danger)]' }
            ].map((m) => (
              <div key={m.label} className={`border rounded-lg md:rounded-[1.5rem] p-3 md:p-5 shadow-sm ${m.color}`}>
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-wider block opacity-75">{m.label}</span>
                <span className="text-base md:text-2xl font-black block mt-1 md:mt-2">
                  {m.val}<span className="text-[9px] md:text-xs font-bold opacity-75 ml-0.5">{m.unit}</span>
                </span>
              </div>
            ))}
          </div>

          {/* AI Evaluasi Card */}
          <MagicCard className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[2.5rem] p-4 md:p-10 shadow-xl relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-4 md:mb-6 text-[var(--primary-green)] font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em]">
              <Sparkles size={10} className="animate-pulse" />
              <span>{language === 'id' ? 'Laporan Analisis AI Harian' : 'Daily Insights report'}</span>
            </div>
            
            {isAdviceLoading ? (
              <div className="space-y-4 py-8 text-center animate-pulse">
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full border-4 border-[var(--primary-green)]/25 border-t-[var(--primary-green)] animate-spin" />
                </div>
                <p className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                  {language === 'id' ? 'Gemini AI sedang menyusun analisis gizi Anda...' : 'Gemini AI is crafting your nutrition analysis...'}
                </p>
                <div className="space-y-2.5 md:space-y-3 pt-4 md:pt-6 text-left">
                  <div className="h-2.5 bg-[var(--bg-secondary)] rounded w-full animate-pulse" />
                  <div className="h-2.5 bg-[var(--bg-secondary)] rounded w-5/6 animate-pulse" />
                  <div className="h-2.5 bg-[var(--bg-secondary)] rounded w-4/5 animate-pulse" />
                </div>
              </div>
            ) : !dailyAdvice ? (
              <div className="py-6 md:py-8 text-center space-y-4 md:space-y-6">
                <h3 className="text-base md:text-xl font-bold text-[var(--text-main)]">
                  {language === 'id' ? `Evaluasi Nutrisi Harian` : `Daily Nutrition Evaluation`}
                </h3>
                <p className="text-xs font-semibold text-[var(--text-muted)] leading-relaxed max-w-md mx-auto">
                  {language === 'id' 
                    ? 'Catatan asupan gizi harian Anda sudah siap untuk dianalisis dan dievaluasi secara cerdas oleh AI.' 
                    : 'Your daily nutritional logs are ready to be analyzed and evaluated intelligently by AI.'}
                </p>
                <button
                  type="button"
                  onClick={handleGenerateInsight}
                  className="inline-flex items-center gap-2 md:gap-3 bg-[var(--primary-green)] text-white hover:scale-[1.02] active:scale-100 font-black py-3 px-6 md:py-4 md:px-8 rounded-xl md:rounded-2xl shadow-lg shadow-emerald-500/20 transition-all text-[10px] md:text-xs uppercase tracking-widest"
                >
                  <Sparkles size={14} className="animate-pulse" />
                  <span>{language === 'id' ? '✨ Buat Laporan AI' : '✨ Generate Daily Insights'}</span>
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 md:mb-6">
                  <h3 className="text-base md:text-xl font-bold text-[var(--text-main)] flex flex-wrap items-center gap-2">
                    <span>{language === 'id' ? `Insight & Rekomendasi AI` : `AI Insights & Recommendations`}</span>
                    {isAiAdvice !== null && (
                      isAiAdvice ? (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-[var(--primary-green)] border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-green)] animate-pulse"></span>
                          ✨ NutriAI Engine
                        </span>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                          ⚡ Smart Local Mode
                        </span>
                      )
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={handleGenerateInsight}
                    className="flex items-center justify-center gap-1.5 border border-[var(--border-card)] hover:border-[var(--primary-green)]/40 hover:bg-[var(--bg-secondary)] px-3 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] transition-all active:scale-95 self-start sm:self-auto"
                  >
                    <span>🔄 {language === 'id' ? 'Perbarui Analisis' : 'Update Analysis'}</span>
                  </button>
                </div>
                
                <p className="text-[var(--text-muted)] text-xs md:text-sm font-semibold leading-relaxed bg-[var(--bg-secondary)]/50 p-4 md:p-6 border border-[var(--border-card)]/40 rounded-2xl md:rounded-3xl mb-4 md:mb-8 whitespace-pre-wrap">
                  {dailyAdvice}
                </p>

                <div className="flex items-start gap-3 md:gap-4 p-3 md:p-5 rounded-xl md:rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[var(--text-main)]">
                  <div className="p-2 bg-amber-500 text-white rounded-lg shadow-sm shrink-0">
                    <TrendingUp size={14} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-500 mb-0.5 md:mb-1">
                      {language === 'id' ? 'Saran Tindakan' : 'Actionable Advice'}
                    </h4>
                    <p className="text-[10px] md:text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
                      {actionableAdvice || (language === 'id' 
                        ? 'Konsumsi sumber protein hewani/nabati tambahan di cemilan sore dan kurangi asupan karbohidrat cepat serap menjelang istirahat tidur malam Anda.' 
                        : 'Include lean protein sources in your afternoon snacks and avoid simple carbohydrates prior to sleep.')}
                    </p>
                  </div>
                </div>
              </>
            )}
          </MagicCard>
        </>
      )}
    </div>
  );
};

export default AIInsightsTab;
