import React from 'react';
import { AlertCircle } from 'lucide-react';

const MacroWarningBanner = ({
  todayEntries,
  nutritionData,
  language,
}) => {
  const getLowMacroAdvice = () => {
    if (todayEntries.length === 0) return null;

    const { protein, carbs, fat } = nutritionData.dailyIntake;
    const targets = nutritionData.targets;

    const proteinRatio = targets.protein > 0 ? protein / targets.protein : 1;
    const carbsRatio = targets.carbs > 0 ? carbs / targets.carbs : 1;
    const fatRatio = targets.fat > 0 ? fat / targets.fat : 1;

    const macros = [
      { name: 'protein', ratio: proteinRatio, label: language === 'id' ? 'Protein' : 'Protein', foods: language === 'id' ? 'Dada Ayam Panggang, Telur Rebus, Tempe, Tahu, Salmon, atau Kacang-kacangan' : 'Grilled Chicken Breast, Boiled Eggs, Tempeh, Tofu, Salmon, or Nuts' },
      { name: 'karbohidrat', ratio: carbsRatio, label: language === 'id' ? 'Karbohidrat' : 'Carbs', foods: language === 'id' ? 'Nasi Merah, Kentang Rebus, Oatmeal, Ubi Cilembu, atau Roti Gandum' : 'Brown Rice, Boiled Potatoes, Oatmeal, Sweet Potatoes, or Whole Wheat Bread' },
      { name: 'lemak', ratio: fatRatio, label: language === 'id' ? 'Lemak Sehat' : 'Healthy Fats', foods: language === 'id' ? 'Alpukat segar, Kacang Almond, Minyak Zaitun (Olive Oil), atau Keju rendah lemak' : 'Fresh Avocados, Almonds, Olive Oil, or Low-fat Cheese' }
    ];

    const lowMacros = macros.filter(m => m.ratio < 0.7).sort((a, b) => a.ratio - b.ratio);
    if (lowMacros.length > 0) {
      return lowMacros[0];
    }
    return null;
  };

  const lowMacroAdvice = getLowMacroAdvice();

  if (!lowMacroAdvice) return null;

  return (
    <div className="mb-6 p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-rose-500/10 border border-rose-500/20 backdrop-blur-md flex items-start gap-3 md:gap-4 text-left animate-in slide-in-from-top duration-500 shadow-sm">
      <div className="p-2 md:p-3 bg-rose-500 text-white rounded-xl md:rounded-2xl shrink-0 shadow-md">
        <AlertCircle size={18} className="md:w-5 md:h-5 animate-pulse" />
      </div>
      <div>
        <h4 className="text-xs md:text-sm font-black text-rose-500 uppercase tracking-wider">
          {language === 'id' ? `Asupan ${lowMacroAdvice.label} Masih Rendah` : `${lowMacroAdvice.label} Intake is Low`}
        </h4>
        <p className="text-[10px] md:text-xs text-[var(--text-muted)] font-semibold mt-1 leading-relaxed">
          {language === 'id' 
            ? `Asupan ${lowMacroAdvice.name} harian Anda masih di bawah 70% dari target. Untuk mengoptimalkan energi dan metabolisme tubuh, cobalah mengonsumsi: ` 
            : `Your daily ${lowMacroAdvice.name} intake is currently below 70% of your target. To optimize energy and recovery, try eating: `}
          <span className="text-[var(--primary-green)] font-extrabold">{lowMacroAdvice.foods}</span>.
        </p>
      </div>
    </div>
  );
};

export default MacroWarningBanner;
