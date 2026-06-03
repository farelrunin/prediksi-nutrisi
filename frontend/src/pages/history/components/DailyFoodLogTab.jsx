import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Trash2, Plus } from 'lucide-react';

const DailyFoodLogTab = ({
  selectedDate,
  formatDayLabel,
  selectedDateTotals,
  nutritionData,
  language,
  getMealTypeLabel,
  currentDaySessions,
  setSelectedEntry,
  handleDeleteClick,
  t,
}) => {
  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in duration-300">
      {/* Date Totals Banner */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[2rem] p-3 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
        <div>
          <span className="text-[8px] md:text-[10px] font-black text-[var(--primary-green)] uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
            {formatDayLabel(selectedDate + 'T00:00:00')}
          </span>
          <h2 className="text-xs md:text-lg font-bold text-[var(--text-main)] mt-1.5 md:mt-3">
            {language === 'id' ? 'Total Asupan Gizi' : 'Total Intake'}
          </h2>
          {selectedDateTotals.calories >= (nutritionData.targets?.calories || 2000) && (
            <div className="mt-2.5 p-2 px-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[var(--primary-green)] text-[9px] md:text-[10px] font-bold flex items-center gap-1.5 animate-in slide-in-from-left duration-300">
              <Sparkles size={11} className="animate-pulse" />
              <span>{language === 'id' ? 'Asupan gizi harian terpenuhi! 🎉' : 'Daily nutrition targets met! 🎉'}</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 lg:gap-10 shrink-0">
          {[
            { label: t.calories, val: Math.round(selectedDateTotals.calories), unit: 'kcal', color: 'text-[var(--primary-green)]' },
            { label: t.protein, val: Math.round(selectedDateTotals.protein), unit: 'g', color: 'text-[var(--accent-blue)]' },
            { label: t.carbs, val: Math.round(selectedDateTotals.carbs), unit: 'g', color: 'text-[var(--warning)]' },
            { label: t.fat, val: Math.round(selectedDateTotals.fat), unit: 'g', color: 'text-[var(--danger)]' }
          ].map((m) => (
            <div key={m.label} className="text-left">
              <div className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{m.label}</div>
              <div className={`text-xs md:text-base font-extrabold ${m.color} mt-0.5 md:mt-1`}>
                {m.val}<span className="text-[8px] md:text-[10px] opacity-70 ml-0.5">{m.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 lg:gap-8">
        {['breakfast', 'lunch', 'dinner', 'snack'].map((sessionKey) => {
          const sessionEntries = currentDaySessions[sessionKey] || [];
          return (
            <div 
              key={sessionKey} 
              className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[2.5rem] p-4 md:p-6 lg:p-8 flex flex-col justify-between shadow-sm transition-all hover:shadow-xl group"
            >
              <div>
                {/* Banner Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border-card)]/30">
                  <span className="text-xs md:text-sm font-black uppercase tracking-wider text-[var(--text-main)]">
                    {getMealTypeLabel(sessionKey)}
                  </span>
                  <span className="text-[9px] font-black text-[var(--primary-green)] bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {sessionEntries.length} {language === 'id' ? 'Makanan' : 'Items'}
                  </span>
                </div>

                {/* Session Items */}
                <div className="space-y-2 md:space-y-3 min-h-[80px] md:min-h-[120px]">
                  {sessionEntries.length === 0 ? (
                    <div className="py-5 md:py-10 text-center text-xs font-semibold text-[var(--text-muted)] italic">
                      {language === 'id' ? 'Sesi ini masih kosong.' : 'This session is empty.'}
                    </div>
                  ) : (
                    sessionEntries.map((entry) => {
                      const cleanUnit = entry.unit && entry.unit.includes('(Kalkulator)') 
                        ? entry.unit.replace(' (Kalkulator)', '') 
                        : entry.unit;
                      
                      return (
                        <div 
                          key={entry.id} 
                          className="flex items-center justify-between p-2.5 md:p-4 bg-[var(--bg-secondary)]/50 border border-[var(--border-card)]/25 rounded-lg md:rounded-2xl hover:border-[var(--primary-green)]/35 transition-all group/item cursor-pointer"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-xs md:text-sm text-[var(--text-main)] group-hover/item:text-[var(--primary-green)] truncate transition-colors">{entry.foodName}</p>
                            <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">{entry.quantity} {cleanUnit}</p>
                          </div>
                          <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2">
                            <span className="text-xs font-black text-[var(--primary-green)]">{entry.calories} kcal</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(entry);
                              }}
                              className="p-1.5 md:p-2 rounded-xl text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                            >
                              <Trash2 size={13} className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Add Food Button Shortcut */}
              <Link
                to="/categories"
                state={{ defaultMealType: sessionKey }}
                className="w-full flex items-center justify-center gap-2 mt-3 py-2.5 md:py-4 rounded-lg md:rounded-2xl bg-[var(--bg-secondary)] border border-dashed border-[var(--border-card)] text-[var(--primary-green)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary-green)] hover:text-white transition-all active:scale-98"
              >
                <Plus size={12} className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Tambah Makanan' : 'Add Food'}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyFoodLogTab;
