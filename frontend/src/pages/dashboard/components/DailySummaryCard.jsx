import React from 'react';
import MagicCard from '../../../components/shared/MagicCard';

const DailySummaryCard = ({
  t,
  language,
  nutritionData,
  targetCalories,
  cappedPercentage,
}) => {
  // SVG Circular Progress Calculations
  const circularSize = 180;
  const strokeWidth = 14;
  const radius = (circularSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cappedPercentage / 100) * circumference;

  return (
    <MagicCard className="bg-[var(--bg-card)] rounded-xl md:rounded-[2.5rem] p-3 md:p-8 lg:p-10 shadow-xl border border-[var(--border-card)] mb-4 md:mb-12 relative overflow-hidden group">
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-10">
        {/* Left: Section Title & Subtitle */}
        <div className="text-center lg:text-left space-y-0.5 md:space-y-2 lg:max-w-xs shrink-0">
          <h2 className="text-base md:text-xl lg:text-2xl font-black text-[var(--text-main)] tracking-tight">{t.dailyNutrition}</h2>
          <p className="text-[9px] md:text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
            {language === 'id' 
              ? 'Pantau asupan gizi harian Anda secara live berdasarkan target personal tubuh Anda.' 
              : 'Track your daily nutritional intake in real-time based on your personalized targets.'}
          </p>
        </div>

        {/* Middle: Premium Circular Progress Bar for Calories */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative flex items-center justify-center w-[120px] h-[120px] md:w-[180px] md:h-[180px] aspect-square">
            <svg width="100%" height="100%" viewBox="0 0 180 180" className="transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx={90}
                cy={90}
                r={radius}
                fill="transparent"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                strokeWidth={strokeWidth}
              />
              {/* Active Circle with modern stroke-linecap */}
              <circle
                cx={90}
                cy={90}
                r={radius}
                fill="transparent"
                stroke="url(#caloriesGrad)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="caloriesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-green)" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            {/* Stats center details */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-lg md:text-3xl font-black text-[var(--text-main)]">{Math.round(nutritionData.dailyIntake.calories)}</span>
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-0.5 md:mt-1">{t.kcal}</span>
              <span className="text-[8px] md:text-[9px] font-bold text-[var(--primary-green)] bg-[var(--primary-green)]/10 px-1 py-0.2 md:px-2 rounded-full mt-1 md:mt-2">
                {Math.round(cappedPercentage)}%
              </span>
            </div>
          </div>
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1.5 md:mt-3">
            {language === 'id' ? 'Target' : 'Target'}: {targetCalories} {t.kcal}
          </span>
        </div>

        {/* Right: Macro Progress Bars Grid */}
        <div className="w-full lg:max-w-lg grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 bg-[var(--bg-secondary)]/30 border border-[var(--border-card)]/50 p-3 md:p-6 lg:p-8 rounded-lg md:rounded-[2rem]">
          {[
            { label: t.protein, cur: nutritionData.dailyIntake.protein, tar: nutritionData.targets.protein, unit: 'g', color: 'from-[var(--accent-blue)] to-blue-600', valColor: 'text-[var(--accent-blue)]' },
            { label: t.carbs, cur: nutritionData.dailyIntake.carbs, tar: nutritionData.targets.carbs, unit: 'g', color: 'from-[var(--warning)] to-orange-500', valColor: 'text-[var(--warning)]' },
            { label: t.fat, cur: nutritionData.dailyIntake.fat, tar: nutritionData.targets.fat, unit: 'g', color: 'from-[var(--danger)] to-rose-600', valColor: 'text-[var(--danger)]' }
          ].map((m) => {
            const percent = m.tar > 0 ? Math.min((m.cur / m.tar) * 100, 100) : 0;
            return (
              <div key={m.label} className="space-y-1 md:space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] md:text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{m.label}</span>
                  <span className={`text-[9px] md:text-[11px] font-black ${m.valColor}`}>
                    {Math.round(m.cur)}<span className="text-[7px] md:text-[9px] opacity-60 ml-0.5">/{m.tar}{m.unit}</span>
                  </span>
                </div>
                <div className="h-1.5 md:h-2.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden p-[1px] border border-[var(--border-card)]/30">
                  <div 
                    className={`h-full bg-gradient-to-r ${m.color} rounded-full transition-all duration-1000 shadow-sm`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MagicCard>
  );
};

export default DailySummaryCard;
