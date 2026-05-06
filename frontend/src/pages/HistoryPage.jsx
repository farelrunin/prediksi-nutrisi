import { useState } from 'react';
import { List, CalendarDays, Clock3, UtensilsCrossed, Trash2 } from 'lucide-react';
import { useNutrition } from '../context/useNutrition';
import { useNotification } from '../context/useNotification';
import { colors } from '../styles/colors';
import ConfirmModal from '../components/shared/ConfirmModal';

const formatDayLabel = (dateValue) => new Date(dateValue).toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const getDateKey = (dateValue) => {
  const date = new Date(dateValue);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const groupEntriesByDay = (entries) => entries.reduce((groups, entry) => {
  const dateKey = getDateKey(entry.timestamp);
  if (!groups[dateKey]) {
    groups[dateKey] = {};
  }

  // Group by session (exact same timestamp or within the same minute)
  const time = new Date(entry.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const sessionKey = `${entry.mealType}-${time}`;
  
  if (!groups[dateKey][sessionKey]) {
    groups[dateKey][sessionKey] = [];
  }

  groups[dateKey][sessionKey].push(entry);
  return groups;
}, {});

const HistoryPage = () => {
  const { nutritionData, historyLoading, historyError, deleteFoodEntry } = useNutrition();
  const { notify } = useNotification();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);

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
        notify({ type: 'success', title: 'Berhasil', message: 'Data nutrisi berhasil dihapus.' });
      } catch (error) {
        notify({ type: 'error', title: 'Gagal Menghapus', message: error.message });
      } finally {
        setIsDeleting(false);
      }
    }
    setDeleteModal({ isOpen: false, item: null });
  };

  return (
    <div className="min-h-screen pb-24 pt-32 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-6xl space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[var(--text-main)]">
              Jurnal <span className="text-[var(--primary-green)]">Nutrisi</span>
            </h1>
            <p className="mt-2 text-[var(--text-muted)] font-medium">Histori lengkap perjalanan nutrisi harian Anda.</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] px-8 py-4 rounded-3xl shadow-xl flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Entri</div>
              <div className="text-xl font-black text-[var(--text-main)]">{nutritionData.history.length}</div>
            </div>
          </div>
        </div>

        {historyLoading ? (
          <div className="flex h-96 flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-green)]">Memuat Jurnal...</p>
          </div>
        ) : sortedDays.length === 0 ? (
          <div className="rounded-[3rem] border-2 border-dashed border-[var(--border-card)] p-32 text-center bg-[var(--bg-card)]/30">
            <div className="w-20 h-20 bg-[var(--bg-card)] rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[var(--border-card)]">
              <UtensilsCrossed className="text-[var(--primary-green)]/30" size={40} />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-main)]">Jurnal Anda Kosong</h2>
            <p className="mt-4 text-[var(--text-muted)] max-w-md mx-auto font-medium">
              Ayo catat makanan Anda hari ini untuk mulai memantau nutrisi!
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
                    <span className="text-[var(--primary-green)]">{Math.round(dayTotals.calories)} kcal</span>
                    <span>{Math.round(dayTotals.protein)}g Prot</span>
                    <span>{Math.round(dayTotals.carbs)}g Karb</span>
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
                              {mealType === 'mixed' ? 'SESI MAKAN' : mealType.toUpperCase()} • {time} WIB
                            </span>
                          </div>
                        </div>

                        {/* Items in Session */}
                        <div className="p-8 space-y-6">
                          {sessionEntries.map((entry) => (
                            <div key={entry.id} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 last:pb-0 border-b border-slate-100 last:border-0">
                              <div className="flex-1 min-w-0">
                                <p className="text-lg font-bold text-[var(--text-main)] truncate group-hover:text-[var(--primary-green)] transition-colors">{entry.foodName}</p>
                                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">
                                  {entry.quantity} {entry.unit}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-4 lg:gap-8 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                                {[
                                  { label: 'KCAL', val: entry.calories, color: 'text-[var(--primary-green)]' },
                                  { label: 'PROT', val: (entry.protein || 0) + 'g', color: 'text-[var(--accent-blue)]' },
                                  { label: 'KARB', val: (entry.carbs || 0) + 'g', color: 'text-[var(--warning)]' },
                                  { label: 'LEMAK', val: (entry.fat || 0) + 'g', color: 'text-[var(--danger)]' }
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
        title="Hapus Data?"
        message="Data nutrisi untuk item ini akan dihapus permanen."
        itemName={deleteModal.item?.foodName}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default HistoryPage;
