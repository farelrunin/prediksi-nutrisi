import React from 'react';
import { Brain, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

const NutritionReportModal = ({
  isOpen,
  onClose,
  totals,
  loggedFoods,
  language,
  handleSaveAllLoggedFoods,
  calculateAnalysisReport
}) => {
  if (!isOpen) return null;

  const r = calculateAnalysisReport();

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] w-[95%] md:w-full md:max-w-2xl rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl p-4 md:p-8 space-y-4 md:space-y-6 relative max-h-[85vh] md:max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <XCircle size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-8 text-left">
          <div className="p-3 bg-[var(--primary-green)] text-white rounded-2xl shadow-lg shadow-emerald-500/20">
            <Brain size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-[var(--text-main)]">
              {language === 'id' ? 'Laporan Analisis Gizi Mandiri' : 'Self-Nutrition Analysis Report'}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">
              {language === 'id' ? 'Kalkulator Energi & Makronutrisi Makanan' : 'Food Energy & Macronutrient Calculator'}
            </p>
          </div>
        </div>

        {/* Formula Explanation Banner */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-card)] rounded-2xl p-4 text-xs font-semibold text-[var(--text-muted)] space-y-1 text-left">
          <p className="font-extrabold text-[var(--text-main)] uppercase tracking-wider text-[10px] text-[var(--primary-green)] mb-1">
            ⚙️ {language === 'id' ? 'Metode Rumus Perhitungan Gizi' : 'Nutrition Formula Calculation Method'}
          </p>
          <p>• <strong>Protein (1g = 4 kcal)</strong> • <strong>Karbohidrat (1g = 4 kcal)</strong> • <strong>Lemak (1g = 9 kcal)</strong></p>
          <p>• <strong>Persentase Energi Makro</strong> = (Kalori Makronutrisi ÷ Total Kalori Hasil Hitung) × 100%</p>
        </div>

        {/* Calculated Values Dashboard */}
        <div className="space-y-6 text-left">
          {/* Energy Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Protein */}
            <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-card)] rounded-2xl p-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Protein ({totals.protein.toFixed(1)}g)</p>
              <h4 className="text-xl font-black text-[var(--accent-blue)] mt-1">{Math.round(r.calProtein)} <span className="text-[10px] font-bold text-[var(--text-muted)]">kcal</span></h4>
              <div className="mt-2 text-xs font-black text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 py-1 px-3 rounded-lg border border-[var(--accent-blue)]/20 w-fit mx-auto">
                {r.proteinPct.toFixed(1)}% {language === 'id' ? 'Energi' : 'Energy'}
              </div>
            </div>
            {/* Carbs */}
            <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-card)] rounded-2xl p-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Karbohidrat ({totals.carbs.toFixed(1)}g)</p>
              <h4 className="text-xl font-black text-[var(--warning)] mt-1">{Math.round(r.calCarbs)} <span className="text-[10px] font-bold text-[var(--text-muted)]">kcal</span></h4>
              <div className="mt-2 text-xs font-black text-[var(--warning)] bg-[var(--warning)]/10 py-1 px-3 rounded-lg border border-[var(--warning)]/20 w-fit mx-auto">
                {r.carbsPct.toFixed(1)}% {language === 'id' ? 'Energi' : 'Energy'}
              </div>
            </div>
            {/* Fat */}
            <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-card)] rounded-2xl p-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Lemak ({totals.fat.toFixed(1)}g)</p>
              <h4 className="text-xl font-black text-[var(--danger)] mt-1">{Math.round(r.calFat)} <span className="text-[10px] font-bold text-[var(--text-muted)]">kcal</span></h4>
              <div className="mt-2 text-xs font-black text-[var(--danger)] bg-[var(--danger)]/10 py-1 px-3 rounded-lg border border-[var(--danger)]/20 w-fit mx-auto">
                {r.fatPct.toFixed(1)}% {language === 'id' ? 'Energi' : 'Energy'}
              </div>
            </div>
          </div>

          {/* Total Calories Box */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-card)] rounded-3xl p-6 text-center space-y-1">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Total Kalori Hasil Rumus Makro' : 'Total Calories via Macro Formula'}</p>
            <h2 className="text-3xl font-black text-[var(--primary-green)]">{Math.round(r.calculatedTotalCalories)} <span className="text-sm font-bold text-[var(--text-muted)]">kcal / Kalori</span></h2>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {language === 'id' ? `(Jumlah dari: ${Math.round(r.calProtein)} Protein + ${Math.round(r.calCarbs)} Karbo + ${Math.round(r.calFat)} Lemak)` : `(Sum of: ${Math.round(r.calProtein)} Protein + ${Math.round(r.calCarbs)} Carbs + ${Math.round(r.calFat)} Fat)`}
            </p>
          </div>

          {/* Visual Energy Stacked Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
              <span>{language === 'id' ? 'Distribusi Kontribusi Energi' : 'Energy Contribution Distribution'}</span>
              <span>Total 100%</span>
            </div>
            <div className="h-6 w-full rounded-full overflow-hidden flex border border-[var(--border-card)] shadow-inner">
              <div style={{ width: `${r.proteinPct}%` }} className="bg-[var(--accent-blue)] h-full transition-all duration-500" title={`Protein: ${r.proteinPct.toFixed(1)}%`} />
              <div style={{ width: `${r.carbsPct}%` }} className="bg-[var(--warning)] h-full transition-all duration-500" title={`Karbohidrat: ${r.carbsPct.toFixed(1)}%`} />
              <div style={{ width: `${r.fatPct}%` }} className="bg-[var(--danger)] h-full transition-all duration-500" title={`Lemak: ${r.fatPct.toFixed(1)}%`} />
            </div>
            <div className="flex justify-center gap-6 text-[10px] font-bold text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[var(--accent-blue)]" /> Protein ({r.proteinPct.toFixed(1)}%)</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[var(--warning)]" /> Karbo ({r.carbsPct.toFixed(1)}%)</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[var(--danger)]" /> Lemak ({r.fatPct.toFixed(1)}%)</span>
            </div>
          </div>

          {/* AI Evaluation / Recommendation Card */}
          <div className={`border rounded-3xl p-6 relative overflow-hidden group border-current bg-current/5 ${r.badgeColor}`}>
            <div className="flex items-center gap-2 mb-2 font-black text-[10px] uppercase tracking-[0.2em]">
              <Sparkles size={12} className="animate-pulse" />
              <span>{language === 'id' ? 'Rekomendasi Diet Personal' : 'Personal Diet Recommendation'}</span>
            </div>
            <h4 className="font-extrabold text-sm uppercase tracking-wide">{r.adviceTitle}</h4>
            <p className="text-xs leading-relaxed font-semibold mt-1.5 text-[var(--text-muted)]">
              {r.adviceText}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveAllLoggedFoods}
              className="flex-grow bg-[var(--primary-green)] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={14} />
              <span>{language === 'id' ? 'Simpan & Tutup' : 'Save & Close'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-grow bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-main)] py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[var(--bg-primary)] transition-all flex items-center justify-center gap-2"
            >
              {language === 'id' ? 'Kembali Edit Makanan' : 'Back to Editing'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionReportModal;
