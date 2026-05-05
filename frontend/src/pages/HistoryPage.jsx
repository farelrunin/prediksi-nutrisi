import React from 'react';
import { List, CalendarDays, Clock3, UtensilsCrossed } from 'lucide-react';
import { useNutrition } from '../context/useNutrition';
import { colors } from '../styles/colors';

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
  const key = getDateKey(entry.timestamp);
  if (!groups[key]) {
    groups[key] = [];
  }

  groups[key].push(entry);
  return groups;
}, {});

const HistoryPage = () => {
  const { nutritionData, historyLoading, historyError } = useNutrition();
  const groupedEntries = groupEntriesByDay(nutritionData.history);
  const groupedDates = Object.keys(groupedEntries).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl" style={{ backgroundColor: colors.bgCard }}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
                <List className="text-emerald-400" size={30} />
                Riwayat Asupan
              </h1>
              <p className="mt-2 text-slate-300">
                Lihat semua makanan yang pernah Anda input, baik dari form biasa maupun cerita alami.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3 text-sm text-slate-300">
              Total entri: <span className="font-semibold text-white">{nutritionData.history.length}</span>
            </div>
          </div>
        </div>

        {historyLoading ? (
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-slate-300 shadow-lg backdrop-blur-xl">
            Memuat riwayat asupan...
          </div>
        ) : historyError ? (
          <div className="rounded-3xl border border-rose-400/30 bg-rose-500/10 p-8 text-rose-100 shadow-lg backdrop-blur-xl">
            {historyError}
          </div>
        ) : groupedDates.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/10 p-10 text-center shadow-lg backdrop-blur-xl">
            <UtensilsCrossed className="mx-auto mb-4 text-emerald-300" size={34} />
            <h2 className="text-xl font-semibold text-white">Belum ada riwayat makanan</h2>
            <p className="mt-2 text-slate-300">
              Setelah Anda menambahkan asupan di halaman input atau dashboard, semua entri akan muncul di sini.
            </p>
          </div>
        ) : (
          groupedDates.map((dateKey) => {
            const entries = groupedEntries[dateKey];
            const dayTotals = entries.reduce((totals, entry) => ({
              calories: totals.calories + Number(entry.calories || 0),
              protein: totals.protein + Number(entry.protein || 0),
              carbs: totals.carbs + Number(entry.carbs || 0),
              fat: totals.fat + Number(entry.fat || 0)
            }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

            return (
              <section
                key={dateKey}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-xl"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                      <CalendarDays className="text-emerald-300" size={20} />
                      {formatDayLabel(entries[0].timestamp)}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">{entries.length} entri pada hari ini</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
                    <div className="rounded-2xl bg-slate-950/20 px-3 py-2 text-slate-300">
                      Kalori <span className="block font-semibold text-white">{Math.round(dayTotals.calories)} kcal</span>
                    </div>
                    <div className="rounded-2xl bg-slate-950/20 px-3 py-2 text-slate-300">
                      Protein <span className="block font-semibold text-white">{Math.round(dayTotals.protein)} g</span>
                    </div>
                    <div className="rounded-2xl bg-slate-950/20 px-3 py-2 text-slate-300">
                      Karbo <span className="block font-semibold text-white">{Math.round(dayTotals.carbs)} g</span>
                    </div>
                    <div className="rounded-2xl bg-slate-950/20 px-3 py-2 text-slate-300">
                      Lemak <span className="block font-semibold text-white">{Math.round(dayTotals.fat)} g</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {entries.map((entry) => (
                    <div
                      key={`${entry.id ?? entry.timestamp}-${entry.foodName}`}
                      className="rounded-3xl border border-white/10 bg-slate-950/20 p-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="font-semibold text-white">{entry.foodName}</p>
                          <p className="mt-1 text-sm text-slate-400">
                            {entry.mealType} • {entry.quantity} {entry.unit}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm lg:flex lg:items-center lg:gap-6">
                          <div className="text-slate-300">
                            <span className="block text-xs uppercase tracking-wide text-slate-500">Kalori</span>
                            <span className="font-semibold text-white">{entry.calories} kcal</span>
                          </div>
                          <div className="text-slate-300">
                            <span className="block text-xs uppercase tracking-wide text-slate-500">Protein</span>
                            <span className="font-semibold text-white">{entry.protein} g</span>
                          </div>
                          <div className="text-slate-300">
                            <span className="block text-xs uppercase tracking-wide text-slate-500">Karbo</span>
                            <span className="font-semibold text-white">{entry.carbs} g</span>
                          </div>
                          <div className="text-slate-300">
                            <span className="block text-xs uppercase tracking-wide text-slate-500">Lemak</span>
                            <span className="font-semibold text-white">{entry.fat} g</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock3 size={16} />
                            <span>{new Date(entry.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
