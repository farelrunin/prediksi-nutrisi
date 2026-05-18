import { useState } from 'react';
import { List, CalendarDays, Clock3, UtensilsCrossed, Trash2, X } from 'lucide-react';
import { useNutrition } from '../context/useNutrition';
import { useNotification } from '../context/useNotification';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { colors } from '../styles/colors';
import ConfirmModal from '../components/shared/ConfirmModal';

const HistoryPage = () => {
  const { nutritionData, historyLoading, historyError, deleteFoodEntry } = useNutrition();
  const { notify } = useNotification();
  const { language } = useLanguage();
  const t = translations[language];
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getDateKey = (dateValue) => {
    const date = new Date(dateValue);
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  };

  const formatDayLabel = (dateValue) => new Date(dateValue).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const groupEntriesByDay = (entries) => entries.reduce((groups, entry) => {
    const dateKey = getDateKey(entry.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = {};
    }

    const time = new Date(entry.timestamp).toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    const sessionKey = `${entry.mealType}-${time}`;
    
    if (!groups[dateKey][sessionKey]) {
      groups[dateKey][sessionKey] = [];
    }

    groups[dateKey][sessionKey].push(entry);
    return groups;
  }, {});

  const groupedData = groupEntriesByDay(nutritionData.history);
  const sortedDays = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

  const handleDeleteClick = (entry) => {
    setDeleteModal({ isOpen: true, item: entry });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.item) {
      setIsDeleting(true);
      try {
        await deleteFoodEntry(deleteModal.item.id);
        notify({ 
          type: 'success', 
          title: t.successDelete, 
          message: t.successDeleteMsg 
        });
      } catch (error) {
        notify({ 
          type: 'error', 
          title: t.deleteFailed, 
          message: error.message 
        });
      } finally {
        setIsDeleting(false);
      }
    }
    setDeleteModal({ isOpen: false, item: null });
  };

  return (
    <div className="min-h-screen pb-24 pt-44 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-6xl space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[var(--text-main)]">
              {language === 'id' ? (
                <>Jurnal <span className="text-[var(--primary-green)]">Nutrisi</span></>
              ) : (
                <>Nutrition <span className="text-[var(--primary-green)]">Journal</span></>
              )}
            </h1>
            <p className="mt-2 text-[var(--text-muted)] font-medium">{t.historySubtitle}</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] px-8 py-4 rounded-3xl shadow-xl flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{t.totalEntries}</div>
              <div className="text-xl font-black text-[var(--text-main)]">{nutritionData.history.length}</div>
            </div>
          </div>
        </div>

        {historyLoading ? (
          <div className="flex h-96 flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-green)]">{t.loadingJournal}</p>
          </div>
        ) : sortedDays.length === 0 ? (
          <div className="rounded-[3rem] border-2 border-dashed border-[var(--border-card)] p-32 text-center bg-[var(--bg-card)]/30">
            <div className="w-20 h-20 bg-[var(--bg-card)] rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[var(--border-card)]">
              <UtensilsCrossed className="text-[var(--primary-green)]/30" size={40} />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-main)]">{t.journalEmpty}</h2>
            <p className="mt-4 text-[var(--text-muted)] max-w-md mx-auto font-medium">
              {t.journalEmptySubtitle}
            </p>
          </div>
        ) : (
          sortedDays.map((dateKey) => {
            const sessions = groupedData[dateKey];
            const sortedSessions = Object.keys(sessions).sort((a, b) => b.localeCompare(a));
            const dayEntries = Object.values(sessions).flat();
            const dayTotals = dayEntries.reduce((totals, entry) => ({
              calories: totals.calories + entry.calories,
              protein: totals.protein + (entry.protein || 0),
              carbs: totals.carbs + (entry.carbs || 0),
              fat: totals.fat + (entry.fat || 0)
            }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

            return (
              <section key={dateKey} className="space-y-6">
                {/* Date Divider */}
                <div className="flex items-center gap-6 sticky top-20 z-10 py-4 bg-[var(--bg-primary)]/80 backdrop-blur-md">
                  <div className="bg-[var(--primary-green)] text-white px-6 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                    {formatDayLabel(dayEntries[0].timestamp)}
                  </div>
                  <div className="h-[1px] flex-1 bg-[var(--border-card)]"></div>
                  <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    <span className="text-[var(--primary-green)]">{Math.round(dayTotals.calories)} {t.kcal}</span>
                    <span>{Math.round(dayTotals.protein)}g {t.proteinLabel.substring(0, 4)}</span>
                    <span>{Math.round(dayTotals.carbs)}g {t.carbsLabel.substring(0, 5)}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {sortedSessions.map((sessionKey) => {
                    const sessionEntries = sessions[sessionKey];
                    const [mealType, time] = sessionKey.split('-');
                    
                    return (
                      <div key={sessionKey} className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] overflow-hidden shadow-sm transition-all hover:shadow-xl group">
                        {/* Session Banner */}
                        <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-card)] px-8 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Clock3 size={16} className="text-[var(--primary-green)]" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                              {mealType === 'mixed' ? t.mealSession : mealType.toUpperCase()} • {time}
                            </span>
                          </div>
                        </div>

                        {/* Items in Session */}
                        <div className="p-8 space-y-6">
                          {sessionEntries.map((entry) => (
                            <div key={entry.id} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 last:pb-0 border-b border-[var(--border-card)]/30 last:border-0">
                              <div 
                                className="flex-1 min-w-0 cursor-pointer group/item"
                                onClick={() => setSelectedEntry(entry)}
                              >
                                <p className="text-lg font-bold text-[var(--text-main)] truncate group-hover/item:text-[var(--primary-green)] transition-colors">{entry.foodName}</p>
                                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">
                                  {entry.quantity} {entry.unit} • <span className="text-[var(--primary-green)]">{t.clickForDetails}</span>
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-4 lg:gap-8 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                                {[
                                  { label: 'KCAL', val: entry.calories, color: 'text-[var(--primary-green)]' },
                                  { label: 'PROT', val: (entry.protein || 0) + 'g', color: 'text-[var(--accent-blue)]' },
                                  { label: 'CARBS', val: (entry.carbs || 0) + 'g', color: 'text-[var(--warning)]' },
                                  { label: 'FAT', val: (entry.fat || 0) + 'g', color: 'text-[var(--danger)]' }
                                ].map((stat) => (
                                  <div key={stat.label} className="text-center min-w-[50px]">
                                    <div className={`text-base font-extrabold ${stat.color}`}>{stat.val}</div>
                                    <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</div>
                                  </div>
                                ))}
                                
                                <button 
                                  onClick={() => handleDeleteClick(entry)}
                                  className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-card)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white transition-all shadow-md active:scale-95 ml-4"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleConfirmDelete}
        title={t.deleteData}
        message={t.deleteConfirmMsg}
        itemName={deleteModal.item?.foodName}
        isLoading={isDeleting}
      />

      {/* Detail Popup Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedEntry(null)} />
          <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black text-[var(--text-main)]">{selectedEntry.foodName}</h3>
                  <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2">{selectedEntry.mealType} • {selectedEntry.quantity} {selectedEntry.unit}</p>
                </div>
                <button onClick={() => setSelectedEntry(null)} className="p-3 rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-rose-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {selectedEntry.image_url && (
                <div className="mb-8 overflow-hidden rounded-[2rem] max-h-[220px] border border-[var(--border-card)] flex justify-center items-center bg-black/5">
                  <img 
                    src={selectedEntry.image_url} 
                    alt={selectedEntry.foodName} 
                    className="max-h-[220px] w-full object-contain"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {[
                  { label: t.caloriesLabel, val: selectedEntry.calories, unit: 'kcal', color: 'bg-emerald-50 text-emerald-600', icon: '🔥' },
                  { label: t.proteinLabel, val: selectedEntry.protein, unit: 'g', color: 'bg-blue-50 text-blue-600', icon: '🍗' },
                  { label: t.carbsLabel, val: selectedEntry.carbs, unit: 'g', color: 'bg-amber-50 text-amber-600', icon: '🍞' },
                  { label: t.fatLabel, val: selectedEntry.fat, unit: 'g', color: 'bg-rose-50 text-rose-600', icon: '🥑' }
                ].map((n) => (
                  <div key={n.label} className={`p-6 rounded-[2rem] ${n.color} border border-transparent hover:border-current/10 transition-all`}>
                    <div className="text-2xl mb-2">{n.icon}</div>
                    <div className="text-2xl font-black">{n.val}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-70">{n.label} ({n.unit})</div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-[var(--border-card)]/30 pb-4">{t.micronutrientsOthers}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {[
                    { label: t.calcium, val: selectedEntry.calcium || '—', unit: 'mg' },
                    { label: t.iron, val: selectedEntry.iron || '—', unit: 'mg' },
                    { label: 'Vitamin A', val: selectedEntry.vitamin_a || '—', unit: 'IU' },
                    { label: 'Vitamin C', val: selectedEntry.vitamin_c || '—', unit: 'mg' },
                    { label: t.fiber, val: selectedEntry.fiber || '—', unit: 'g' },
                    { label: t.sugar, val: selectedEntry.sugar || '—', unit: 'g' }
                  ].map((m) => (
                    <div key={m.label} className="flex justify-between items-center py-1">
                      <span className="text-sm font-bold text-[var(--text-muted)]">{m.label}</span>
                      <span className="text-sm font-black text-[var(--text-main)]">{m.val} <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">{m.unit}</span></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="px-8 py-4 rounded-2xl bg-[var(--text-main)] text-[var(--bg-card)] font-bold text-sm hover:scale-105 active:scale-100 transition-all"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
