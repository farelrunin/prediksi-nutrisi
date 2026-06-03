import React from 'react';
import { Flame } from 'lucide-react';

const DashboardHeader = ({
  t,
  user,
  streakCount,
  language,
  setIsStreakModalOpen,
}) => {
  return (
    <div className="mb-4 md:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-1.5 md:gap-4">
          <h1 className="text-lg md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
            {t.dashboard}
          </h1>
          
          {/* Streak Badge 🔥 - Interactive & Gamified */}
          <button
            type="button"
            onClick={() => setIsStreakModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-0.5 md:px-4 md:py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-orange-500/20 text-orange-500 font-black text-[9px] md:text-[11px] uppercase tracking-widest shadow-sm hover:scale-105 active:scale-95 transition-all"
            title={language === 'id' ? 'Klik untuk motivasi!' : 'Click for motivation!'}
          >
            <Flame size={10} className="animate-pulse fill-orange-500 w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
            <span>{streakCount} {language === 'id' ? 'Hari' : 'Days'}</span>
          </button>
        </div>
        
        <div className="mt-0.5 md:mt-2 flex flex-wrap items-center gap-1.5 md:gap-3">
          <p className="text-[11px] md:text-sm lg:text-base text-[var(--text-muted)] font-semibold">{t.welcomeBack}, {user?.name || 'User'}.</p>
          
          {user?.gender === 'female' && user?.is_pregnant && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 border border-rose-100 rounded-full">
              <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-rose-600">{t.pregnancyMode}</span>
            </div>
          )}

          {user?.gender === 'female' && user?.is_breastfeeding && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-sky-50 border border-sky-100 rounded-full">
              <div className="w-1 h-1 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-sky-600">{t.breastfeedingMode}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] px-3 py-2 md:px-6 md:py-3.5 rounded-lg md:rounded-2xl text-[9px] md:text-xs font-bold text-[var(--text-muted)] shadow-sm self-start sm:self-center">
        {new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  );
};

export default DashboardHeader;
