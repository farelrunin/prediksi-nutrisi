import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const TodayActionCenter = ({ nutritionData, t }) => {
  const { language } = useLanguage();
  const isId = language === 'id';

  const dailyIntake = nutritionData.dailyIntake || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const targets = nutritionData.targets || { calories: 2000, protein: 100, carbs: 250, fat: 70 };

  const targetCal = targets.calories || 2000;
  const filledCal = Math.round(dailyIntake.calories || 0);
  const remainingCal = Math.max(0, targetCal - filledCal);
  const isOverLimit = filledCal > targetCal;

  // Recharts Pie Chart Data
  const pieData = isOverLimit
    ? [
        { name: isId ? 'Terpenuhi' : 'Intake', value: targetCal, color: 'var(--primary-green)' },
        { name: isId ? 'Lebih' : 'Exceeded', value: filledCal - targetCal, color: '#f43f5e' }
      ]
    : [
        { name: isId ? 'Terpenuhi' : 'Intake', value: filledCal, color: 'var(--primary-green)' },
        { name: isId ? 'Sisa' : 'Remaining', value: remainingCal, color: 'rgba(148, 163, 184, 0.12)' }
      ];

  // Dynamic Insight Generation
  const getDynamicInsight = () => {
    const proteinDiff = Math.max(0, targets.protein - dailyIntake.protein);
    const carbsDiff = Math.max(0, targets.carbs - dailyIntake.carbs);
    const fatDiff = Math.max(0, targets.fat - dailyIntake.fat);

    if (filledCal === 0) {
      return isId
        ? "Kamu belum mencatat makanan hari ini. Yuk, mulai catat asupan sarapan atau camilanmu sekarang!"
        : "You haven't logged any food today. Let's start logging your breakfast or snack now!";
    }

    if (isOverLimit) {
      return isId
        ? "Asupan kalorimu sudah melebihi target hari ini. Batasi camilan manis dan minumlah lebih banyak air putih untuk menekan rasa lapar."
        : "Your calorie intake has exceeded today's target. Limit sweet snacks and drink more water to curb your appetite.";
    }

    if (proteinDiff > 15) {
      return isId
        ? `Asupan proteinmu hari ini masih kurang ${Math.round(proteinDiff)}g. Coba tambahkan dada ayam, telur rebus, tahu, atau tempe di menu makan malam.`
        : `Your protein intake is still short by ${Math.round(proteinDiff)}g. Try adding chicken breast, boiled eggs, tofu, or tempeh to your next meal.`;
    }

    if (carbsDiff > 50) {
      return isId
        ? `Kamu masih membutuhkan sekitar ${Math.round(carbsDiff)}g karbohidrat. Nasi merah, kentang panggang, atau oatmeal sangat bagus untuk energi optimal.`
        : `You still need about ${Math.round(carbsDiff)}g of carbohydrates. Brown rice, baked potatoes, or oatmeal are great for sustained energy.`;
    }

    if (fatDiff > 15) {
      return isId
        ? `Lemak sehatmu masih kurang ${Math.round(fatDiff)}g. Tambahkan segenggam kacang almond atau buah alpukat untuk melengkapi asupan lemak sehat.`
        : `Your healthy fat intake is short by ${Math.round(fatDiff)}g. Add a handful of almonds or avocado to complete your healthy fat intake.`;
    }

    return isId
      ? "Luar biasa! Proporsi gizi harianmu hari ini sudah cukup seimbang. Pertahankan pola makan sehat ini!"
      : "Awesome! Your daily nutrition proportions are well-balanced today. Keep up this healthy eating pattern!";
  };

  const percentageFilled = Math.min(100, Math.round((filledCal / targetCal) * 100));

  return (
    <div className="w-full flex flex-col items-center h-auto">
      {/* Title */}
      <div className="w-full mb-6 pb-4 border-b border-[var(--border-card)]/40 flex items-center justify-between">
        <div>
          <h3 className="text-base md:text-lg font-black text-[var(--text-main)] tracking-tight">
            {isId ? 'Target & Progres Hari Ini' : 'Today\'s Target & Progress'}
          </h3>
          <p className="text-[var(--text-muted)] text-[10px] font-semibold">
            {isId ? 'Ringkasan asupan live berdasarkan target personal tubuh Anda.' : 'Live intake summary based on your personalized targets.'}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[var(--primary-green)]/10 px-2.5 py-1 rounded-full text-[9px] font-black text-[var(--primary-green)] uppercase tracking-wider">
          <Sparkles size={11} className="animate-pulse" />
          <span>NutriAI Live</span>
        </div>
      </div>

      {/* Main Content Area in Vertical Layout */}
      <div className="w-full flex flex-col items-center gap-6 h-auto">
        
        {/* 1. Center of Attention: Donut Chart (Atas Tengah) */}
        <div className="w-full flex justify-center items-center mb-2 shrink-0">
          <div className="relative w-44 h-44 md:w-52 md:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius="72%"
                  outerRadius="90%"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Absolute Center Stats */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="text-[14px] md:text-[16px] font-black text-[var(--text-main)]">
                {filledCal} <span className="text-[10px] text-[var(--text-muted)]">/ {targetCal}</span>
              </span>
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mt-0.5">
                {isId ? 'kkal Terisi' : 'kcal Filled'}
              </span>
              
              <span className={`text-[10px] font-black mt-2 ${isOverLimit ? 'text-rose-500' : 'text-[var(--primary-green)]'}`}>
                {isOverLimit ? `+${filledCal - targetCal} ${isId ? 'kkal' : 'kcal'}` : `${isId ? 'Sisa' : 'Remaining'}: ${remainingCal} ${isId ? 'kkal' : 'kcal'}`}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Full-Width Macro Progress Bars Grid (Tengah) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-secondary)]/30 border border-[var(--border-card)]/40 p-5 rounded-2xl shrink-0">
          {[
            { label: t.protein || 'Protein', cur: dailyIntake.protein, tar: targets.protein, unit: 'g', color: 'from-sky-400 to-blue-500', valColor: 'text-blue-500' },
            { label: t.carbs || 'Carbs', cur: dailyIntake.carbs, tar: targets.carbs, unit: 'g', color: 'from-amber-400 to-orange-500', valColor: 'text-orange-500' },
            { label: t.fat || 'Fat', cur: dailyIntake.fat, tar: targets.fat, unit: 'g', color: 'from-rose-400 to-rose-600', valColor: 'text-rose-500' }
          ].map((m) => {
            const percent = m.tar > 0 ? Math.min((m.cur / m.tar) * 100, 100) : 0;
            return (
              <div key={m.label} className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{m.label}</span>
                  <span className={`text-[9px] font-black ${m.valColor}`}>
                    {Math.round(m.cur)}<span className="text-[8px] opacity-60 ml-0.5">/{m.tar}{m.unit}</span>
                  </span>
                </div>
                <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden p-[1px] border border-[var(--border-card)]/20">
                  <div 
                    className={`h-full bg-gradient-to-r ${m.color} rounded-full transition-all duration-1000 shadow-sm`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Full-Width AI Insight Box (Paling Bawah) */}
        <div className="w-full bg-gradient-to-r from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden group shadow-sm pb-5 shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-500/10" />
          
          <div className="flex items-center gap-2 text-[var(--primary-green)] mb-2">
            <Sparkles size={13} className="fill-emerald-500/20 animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest">
              {isId ? 'Insight Cepat NutriAI' : 'NutriAI Quick Insight'}
            </span>
          </div>

          <p className="text-[10px] md:text-[11px] text-[var(--text-main)] font-semibold leading-relaxed relative z-10">
            {getDynamicInsight()}
          </p>
        </div>

      </div>
    </div>
  );
};

export default TodayActionCenter;
