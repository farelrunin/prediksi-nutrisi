import React from 'react';
import { Target } from 'lucide-react';

const NutritionTargetCard = ({
  formData,
  handleChange,
  isEditMode,
  errors,
  t,
}) => {
  return (
    <div className="order-3 lg:order-none bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[2.5rem] p-4 md:p-8 shadow-xl lg:flex-grow">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="p-2 bg-[var(--warning)]/10 rounded-lg md:rounded-xl text-[var(--warning)]">
          <Target size={16} className="md:w-5 md:h-5" />
        </div>
        <h2 className="text-sm md:text-lg font-bold text-[var(--text-main)] uppercase tracking-wide">{t.nutritionTargets}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
        {[
          { label: t.calories, name: 'targetCalories', val: formData.targetCalories, color: 'focus:border-[var(--primary-green)]', min: 0, max: 10000 },
          { label: t.protein, name: 'targetProtein', val: formData.targetProtein, color: 'focus:border-[var(--accent-blue)]', min: 0, max: 1000 },
          { label: t.carbs, name: 'targetCarbs', val: formData.targetCarbs, color: 'focus:border-[var(--warning)]', min: 0, max: 1000 },
          { label: t.fat, name: 'targetFat', val: formData.targetFat, color: 'focus:border-[var(--danger)]', min: 0, max: 1000 }
        ].map((field) => (
          <div key={field.name} className="space-y-1.5">
            <label htmlFor={field.name} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">{field.label}</label>
            <input
              id={field.name}
              type="number" name={field.name} value={field.val} onChange={handleChange}
              min={field.min} max={field.max}
              disabled={!isEditMode}
              className={`w-full px-3 py-2 md:px-4 md:py-4 rounded-lg md:rounded-2xl text-xs md:text-sm bg-[var(--bg-secondary)]/80 dark:bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-extrabold text-center outline-none transition-all ${
                !isEditMode 
                  ? 'opacity-85 cursor-not-allowed bg-[var(--bg-secondary)]/50' 
                  : field.color
              }`}
            />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="nutritionGoal" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">{t.nutritionGoal}</label>
        <select
          id="nutritionGoal"
          name="nutritionGoal" value={formData.nutritionGoal} onChange={handleChange}
          disabled={!isEditMode}
          className={`w-full px-3.5 py-2 md:px-6 md:py-4 rounded-lg md:rounded-2xl text-xs md:text-sm bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-semibold outline-none transition-all appearance-none ${
            !isEditMode 
              ? 'opacity-85 cursor-not-allowed bg-[var(--bg-secondary)]/50' 
              : 'focus:border-[var(--primary-green)]'
          }`}
        >
          <option value="">{t.selectGoal}</option>
          <option value="maintain">{t.maintainWeight}</option>
          <option value="lose">{t.loseWeight}</option>
          <option value="gain">{t.gainWeight}</option>
        </select>
        {errors.nutritionGoal && <p className="text-[9px] font-bold text-rose-500 ml-2 animate-pulse">{errors.nutritionGoal}</p>}
      </div>
    </div>
  );
};

export default NutritionTargetCard;
