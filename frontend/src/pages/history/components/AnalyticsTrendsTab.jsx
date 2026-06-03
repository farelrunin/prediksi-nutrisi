import React from 'react';
import { Flame } from 'lucide-react';
import AdvancedAnalyticsChart from './AdvancedAnalyticsChart';
import MagicCard from '../../../components/shared/MagicCard';

const AnalyticsTrendsTab = ({
  nutritionData,
  language,
}) => {
  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in duration-300">
      {/* Gamifikasi Streak */}
      <div className="bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-amber-500/10 border border-orange-500/20 p-4 md:p-8 rounded-xl md:rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="p-3 md:p-4 bg-orange-500/10 text-orange-500 rounded-2xl md:rounded-3xl border border-orange-500/20 shadow-inner animate-pulse">
            <Flame size={24} className="fill-orange-500 animate-bounce md:w-8 md:h-8" />
          </div>
          <div>
            <div className="text-[8px] md:text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Konsistensi Pencatatan Nutrisi</div>
            <div className="text-lg md:text-2xl font-black text-orange-500 mt-0.5 md:mt-1">{nutritionData.streak || 0} Hari Berturut-turut! 🔥</div>
            <p className="text-[10px] md:text-[11px] text-[var(--text-muted)] font-semibold mt-0.5 md:mt-1 max-w-[280px] leading-relaxed">
              {(() => {
                const streak = nutritionData.streak || 0;
                if (language === 'id') {
                  if (streak <= 1) return 'Langkah pertama yang hebat! Mari bangun kebiasaan sehatmu.';
                  if (streak === 2) return 'Kerja bagus! Hari kedua berturut-turut. Teruskan langkah sehatmu!';
                  if (streak === 3) return 'Mulai memanas! 🔥 3 hari tanpa bolong. Pertahankan momentum ini!';
                  if (streak >= 7) return 'Luar biasa! Seminggu penuh nutrisi terjaga. Kamu tak terhentikan!';
                  return 'Mantap! Pertahankan asupan dan catat setiap hari.';
                } else {
                  if (streak <= 1) return 'Great first step! Let\'s build your healthy habit today.';
                  if (streak === 2) return 'Nice work! Day two in a row. Keep going!';
                  if (streak === 3) return 'Getting hot! 🔥 3 days without a miss. Keep this momentum!';
                  if (streak >= 7) return 'Amazing! A full week of perfect nutrition. You are unstoppable!';
                  return 'Great job! Track daily to maintain your streaks.';
                }
              })()}
            </p>
          </div>
        </div>

        {/* Bagian Kanan (Tracker Mingguan) */}
        <div className="shrink-0">
          <div className="flex flex-col gap-1.5 md:gap-2">
            <span className="text-[8px] md:text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest text-left md:text-right">Milestone Mingguan</span>
            <div className="flex items-center gap-1 bg-[var(--bg-secondary)]/50 p-2 rounded-xl md:rounded-2xl border border-[var(--border-card)]">
              {Array.from({ length: 7 }).map((_, index) => {
                const dayNum = index + 1;
                const isActive = (nutritionData.streak || 0) >= dayNum;
                return (
                  <div 
                    key={index} 
                    className={`relative flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl transition-all duration-500 ${
                      isActive 
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20 scale-105' 
                        : 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600'
                    }`}
                    title={isActive ? `Hari ${dayNum}: Streak Aktif! 🔥` : `Hari ${dayNum}`}
                  >
                    <Flame size={12} className={isActive ? 'fill-white animate-pulse' : 'opacity-40'} />
                    <span className={`absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[7px] md:text-[8px] font-black border ${
                      isActive 
                        ? 'bg-amber-600 text-white border-orange-400' 
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-500 border-slate-200'
                    }`}>
                      {dayNum}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Bento */}
      <MagicCard className="bg-[var(--bg-card)] rounded-xl md:rounded-[2.5rem] p-3 md:p-10 shadow-xl border border-[var(--border-card)]">
        <AdvancedAnalyticsChart nutritionData={nutritionData} />
      </MagicCard>
    </div>
  );
};

export default AnalyticsTrendsTab;
