import React from 'react';
import { Link } from 'react-router-dom';
import MagicCard from '../../../components/shared/MagicCard';

const TodayActivityCard = ({
  todayEntries,
  historyLoading,
  language,
  t,
}) => {
  return (
    <MagicCard className="bg-[var(--bg-card)] rounded-xl md:rounded-[2.5rem] p-3 md:p-8 shadow-xl border border-[var(--border-card)]">
      <div className="mb-3 md:mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-[9px] md:text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            {language === 'id' ? 'Aktivitas Hari Ini' : 'Today\'s Activity'}
          </h2>
          <span className="text-[8px] md:text-[10px] font-bold text-[var(--primary-green)] block mt-0.5 md:mt-1">
            ({todayEntries.length} {language === 'id' ? 'Catatan' : 'Food Logs'})
          </span>
        </div>
        <Link to="/history" className="text-[9px] md:text-[11px] font-bold text-[var(--primary-green)] hover:underline uppercase tracking-widest">
          {language === 'id' ? 'Lihat Riwayat' : 'View History'} →
        </Link>
      </div>

      <div className="space-y-2 md:space-y-5">
        {historyLoading ? (
          <div className="text-center py-6 md:py-10 animate-pulse text-[var(--text-muted)] font-bold text-[9px] md:text-xs uppercase tracking-widest">{t.loading}</div>
        ) : todayEntries.length === 0 ? (
          <div className="text-center py-6 md:py-12 border-2 border-dashed border-[var(--border-card)]/50 rounded-xl md:rounded-3xl bg-[var(--bg-secondary)]/20">
            <p className="text-[9px] md:text-xs font-bold text-[var(--text-muted)]">{t.noDataToday}</p>
          </div>
        ) : (
          todayEntries.slice(0, 4).map((e, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 md:p-4 bg-[var(--bg-secondary)]/55 border border-[var(--border-card)]/20 rounded-lg md:rounded-[1.5rem] transition-all hover:border-[var(--primary-green)]/30 group">
              <div className="min-w-0">
                <p className="truncate text-xs md:text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--primary-green)] transition-colors">{e.foodName}</p>
                <p className="text-[8px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-0.5 md:mt-1">{e.mealType}</p>
              </div>
              <span className="text-[9px] md:text-xs font-bold text-[var(--primary-green)] bg-[var(--bg-card)] px-2 py-0.5 md:px-3 md:py-1.5 rounded-md md:rounded-xl border border-[var(--border-card)]">{e.calories} kcal</span>
            </div>
          ))
        )}
      </div>
    </MagicCard>
  );
};

export default TodayActivityCard;
