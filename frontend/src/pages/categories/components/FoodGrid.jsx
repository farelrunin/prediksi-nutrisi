import React from 'react';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { translateFoodToId } from '../../../utils/foodHelpers';

const FoodGrid = ({
  activeCategory,
  loadingFoods,
  currentFoods,
  displayFoods,
  visibleCount,
  setVisibleCount,
  setSelectedFoodToAdd,
  setIsAddModalOpen,
  language,
  t,
}) => {
  return (
    <div className="bg-[var(--bg-card)] rounded-xl md:rounded-[2.5rem] p-3 md:p-8 border border-[var(--border-card)] shadow-xl min-h-[300px] md:min-h-[400px] flex flex-col justify-between">
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 md:mb-8 pb-3 md:pb-6 border-b border-[var(--border-card)]">
          <div>
            <h2 className="text-base md:text-2xl font-black text-[var(--text-main)] flex items-center gap-2 md:gap-3">
              {activeCategory?.name}
            </h2>
            {activeCategory?.description && (
              <p className="text-[10px] md:text-sm text-[var(--text-muted)] font-medium italic mt-0.5 md:mt-1">
                {activeCategory.description}
              </p>
            )}
          </div>
          <div className="shrink-0 text-[8px] md:text-xs font-black text-[var(--primary-green)] uppercase tracking-widest bg-[var(--primary-green)]/10 px-3 py-1.5 rounded-full self-start md:self-center">
            {currentFoods.length} {t.itemsAvailable}
          </div>
        </div>

        {loadingFoods ? (
          <div className="py-12 md:py-24 text-center flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full border-4 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin"></div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[var(--primary-green)]">{t.loading} Makanan...</span>
          </div>
        ) : currentFoods.length > 0 ? (
          <div className="space-y-3 fading-scroll pr-1 md:pr-2">
            {displayFoods.map((food) => (
              <div 
                key={food.id} 
                className="p-3 md:p-5 rounded-xl md:rounded-3xl border border-[var(--border-card)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 hover:border-[var(--primary-green)]/40 hover:shadow-md transition-all group"
              >
                <div className="min-w-0">
                  <p className="font-extrabold text-[var(--text-main)] text-xs md:text-base group-hover:text-[var(--primary-green)] transition-colors truncate">
                    {language === 'id' ? translateFoodToId(food.food_name_id || food.food_name_en) : (food.food_name_id || food.food_name_en)}
                  </p>
                  <p className="text-[8px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5 md:mt-1 opacity-60 truncate">
                    {food.food_name_en}
                  </p>
                </div>
                <div className="flex items-center gap-3 md:gap-4 shrink-0 justify-between sm:justify-end w-full sm:w-auto">
                  <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar py-1">
                    {[
                      { label: 'Kcal', val: Math.round(food.calories) || 0, color: 'bg-emerald-500/10 text-[var(--primary-green)] border-emerald-500/10' },
                      { label: 'Prot', val: (food.protein || 0) + 'g', color: 'bg-blue-500/10 text-[var(--accent-blue)] border-blue-500/10' },
                      { label: 'Carbs', val: (food.carbohydrates || 0) + 'g', color: 'bg-amber-500/10 text-[var(--warning)] border-amber-500/10' },
                      { label: 'Fat', val: (food.total_fat || 0) + 'g', color: 'bg-rose-500/10 text-[var(--danger)] border-rose-500/10' }
                    ].map((stat) => (
                      <div 
                        key={stat.label} 
                        className={`px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-xl border text-[8px] md:text-[10px] font-black uppercase tracking-wider ${stat.color} flex items-center gap-0.5 md:gap-1 shrink-0`}
                      >
                        <span className="opacity-70">{stat.label}:</span>
                        <span>{stat.val}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFoodToAdd(food);
                      setIsAddModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg md:p-2.5 md:rounded-xl bg-[var(--primary-green)] hover:bg-emerald-400 text-white hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 flex items-center justify-center"
                    title={language === 'id' ? 'Tambah Makanan' : 'Add Food'}
                  >
                    <PlusIcon className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 md:py-24 text-center text-[10px] md:text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            {t.dataNotAvailable}
          </div>
        )}
      </div>

      {/* Pagination / Load More Trigger */}
      {!loadingFoods && currentFoods.length > visibleCount && (
        <div className="mt-6 md:mt-12 flex justify-center">
          <button
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="inline-flex items-center gap-2 md:gap-3 bg-[var(--bg-secondary)] hover:bg-[var(--primary-green)] hover:text-white text-[var(--primary-green)] font-extrabold px-6 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-full border border-[var(--primary-green)]/20 transition-all shadow-md group text-xs md:text-base"
          >
            <span>{language === 'id' ? 'Muat Lebih Banyak' : 'Load More Foods'}</span>
            <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodGrid;
