import React from 'react';
import { X } from 'lucide-react';

const FoodDetailModal = ({
  selectedEntry,
  setSelectedEntry,
  language,
  t,
}) => {
  if (!selectedEntry) return null;

  const isKalkulator = selectedEntry.unit && selectedEntry.unit.includes('(Kalkulator)');
  const cleanUnit = isKalkulator ? selectedEntry.unit.replace(' (Kalkulator)', '') : selectedEntry.unit;
  
  let sourceLabel = language === 'id' ? 'Kategori Makanan' : 'Food Library';
  let sourceBadgeColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  let sourceIcon = '📂';
  
  if (isKalkulator) {
    sourceLabel = language === 'id' ? 'Kalkulator Mandiri' : 'Manual Calculator';
    sourceBadgeColor = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    sourceIcon = '🧮';
  } else if (selectedEntry.image_url) {
    sourceLabel = language === 'id' ? 'AI Kamera' : 'AI Camera';
    sourceBadgeColor = 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    sourceIcon = '📷';
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedEntry(null)} />
      <div className="relative w-[95%] md:w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="p-4 md:p-10 text-left">
          <div className="flex justify-between items-start mb-4 md:mb-8">
            <div>
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <h3 className="text-lg md:text-3xl font-black text-[var(--text-main)]">{selectedEntry.foodName}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider border ${sourceBadgeColor}`}>
                  <span>{sourceIcon}</span>
                  <span>{sourceLabel}</span>
                </span>
              </div>
              <p className="text-[10px] md:text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 md:mt-2">{selectedEntry.mealType} • {selectedEntry.quantity} {cleanUnit}</p>
            </div>
            <button onClick={() => setSelectedEntry(null)} aria-label={t.close} className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-rose-500 transition-colors">
              <X size={16} className="md:w-5 md:h-5" />
            </button>
          </div>

          {selectedEntry.image_url && (
            <div className="mb-4 md:mb-8 overflow-hidden rounded-xl md:rounded-[2rem] max-h-[160px] md:max-h-[220px] border border-[var(--border-card)] flex justify-center items-center bg-black/5">
              <img 
                src={selectedEntry.image_url} 
                alt={selectedEntry.foodName} 
                className="max-h-[160px] md:max-h-[220px] w-full object-contain"
              />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-10">
            {[
              { label: t.caloriesLabel, val: Math.round(selectedEntry.calories), unit: 'kcal', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400', icon: '🔥' },
              { label: t.proteinLabel, val: (selectedEntry.protein || 0).toFixed(1), unit: 'g', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400', icon: '🍗' },
              { label: t.carbsLabel, val: (selectedEntry.carbs || 0).toFixed(1), unit: 'g', color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400', icon: '🍞' },
              { label: t.fatLabel, val: (selectedEntry.fat || 0).toFixed(1), unit: 'g', color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400', icon: '🥑' }
            ].map((n) => (
              <div key={n.label} className={`p-3 md:p-6 rounded-lg md:rounded-[2rem] ${n.color} border border-transparent hover:border-current/10 transition-all`}>
                <div className="text-lg md:text-2xl mb-1 md:mb-2">{n.icon}</div>
                <div className="text-base md:text-2xl font-black">{n.val}</div>
                <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-70">{n.label} ({n.unit})</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 md:space-y-6">
            <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-[var(--border-card)]/30 pb-2 md:pb-4">{t.micronutrientsOthers}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-2 md:gap-y-4">
              {[
                { label: t.calcium, val: selectedEntry.calcium || '—', unit: 'mg' },
                { label: t.iron, val: selectedEntry.iron || '—', unit: 'mg' },
                { label: 'Vitamin A', val: selectedEntry.vitamin_a || '—', unit: 'IU' },
                { label: 'Vitamin C', val: selectedEntry.vitamin_c || '—', unit: 'mg' },
                { label: t.fiber, val: selectedEntry.fiber || '—', unit: 'g' },
                { label: t.sugar, val: selectedEntry.sugar || '—', unit: 'g' }
              ].map((m) => (
                <div key={m.label} className="flex justify-between items-center py-0.5 md:py-1">
                  <span className="text-xs md:text-sm font-bold text-[var(--text-muted)]">{m.label}</span>
                  <span className="text-xs md:text-sm font-black text-[var(--text-main)]">{m.val} <span className="text-[8px] md:text-[10px] text-[var(--text-muted)] font-bold uppercase">{m.unit}</span></span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 md:mt-12 pt-4 md:pt-8 border-t border-[var(--border-card)]/20 flex justify-end">
            <button 
              onClick={() => setSelectedEntry(null)}
              className="px-6 py-2.5 md:px-8 md:py-4 rounded-lg md:rounded-2xl bg-[var(--text-main)] text-[var(--bg-card)] font-bold text-xs md:text-sm hover:scale-105 active:scale-100 transition-all text-white"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailModal;
