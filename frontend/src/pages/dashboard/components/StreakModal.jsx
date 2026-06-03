import React from 'react';
import { Flame } from 'lucide-react';

const StreakModal = ({
  streakCount,
  language,
  setIsStreakModalOpen,
}) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => setIsStreakModalOpen(false)}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/20 bg-[var(--bg-card)] shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
          <Flame size={40} className="fill-orange-500 animate-bounce" />
        </div>
        
        <h3 className="text-2xl font-black text-[var(--text-main)] mb-3">
          {streakCount > 0 
            ? (language === 'id' ? `Streak ${streakCount} Hari! 🔥` : `${streakCount} Day Streak! 🔥`)
            : (language === 'id' ? 'Mulai Streak Pertamamu! 🚀' : 'Start Your First Streak! 🚀')}
        </h3>
        
        <p className="text-[var(--text-muted)] text-sm font-semibold leading-relaxed mb-8 px-2">
          {streakCount > 0 ? (
            language === 'id' 
              ? `Luar biasa! Kamu sudah mencatat gizi selama ${streakCount} hari berturut-turut. Pertahankan besok untuk mencapai target kesehatan mingguanmu!` 
              : `Amazing! You've successfully logged your nutrition for ${streakCount} days in a row. Keep it up tomorrow to hit your weekly fitness goals!`
          ) : (
            language === 'id'
              ? 'Catat makanan pertamamu hari ini untuk mulai membangun streak beruntun dan menangkan badge pencapaian gaya hidup sehat!'
              : 'Log your first food today to start building your streak and earn premium healthy lifestyle achievement badges!'
          )}
        </p>
        
        <button
          onClick={() => setIsStreakModalOpen(false)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
        >
          {language === 'id' ? 'Mengerti & Lanjutkan' : 'Understand & Continue'}
        </button>
      </div>
    </div>
  );
};

export default StreakModal;
