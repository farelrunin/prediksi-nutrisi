import React from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { translateFoodToId } from '../../../utils/foodHelpers';

const GlobalSearchResults = ({
  searchQuery,
  searchResults,
  isSearching,
  language,
  t,
  setSelectedFoodToAdd,
  setIsAddModalOpen,
}) => {
  if (searchQuery.trim().length < 2) return null;

  return (
    <div className="bg-[var(--bg-card)] rounded-xl md:rounded-[2.5rem] p-3 md:p-8 border border-[var(--border-card)] shadow-xl animate-in fade-in slide-in-from-bottom-10 duration-500 mb-10 md:mb-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 md:mb-8 pb-3 md:pb-6 border-b border-[var(--border-card)]">
        <h2 className="text-xs md:text-xl font-bold text-[var(--text-main)] uppercase tracking-widest flex items-center gap-2 md:gap-3">
          <div className="p-1.5 bg-[var(--primary-green)]/10 rounded-md text-[var(--primary-green)]">
            <MagnifyingGlassIcon className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          {language === 'id' ? 'Hasil Pencarian Global' : 'Global Search Results'}
        </h2>
        <div className="text-[9px] md:text-xs font-black text-[var(--primary-green)] uppercase tracking-widest bg-[var(--primary-green)]/10 px-3 py-1.5 rounded-full">
          {searchResults.length} {t.itemsFound}
        </div>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="space-y-3 fading-scroll pr-1 md:pr-2">
          {searchResults.map((food) => (
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
        !isSearching && (
          <div className="text-center py-12 md:py-24 text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-xl md:rounded-3xl border border-[var(--border-card)] border-dashed">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-[var(--primary-green)]/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <MagnifyingGlassIcon className="h-6 w-6 md:h-10 md:w-10 text-[var(--primary-green)]" />
            </div>
            <p className="text-sm md:text-xl font-extrabold text-[var(--text-main)]">{t.noFoodFound}</p>
            <p className="text-[10px] md:text-sm mt-1 md:mt-2 font-medium">{t.tryOtherKeywords} "{searchQuery}"</p>
          </div>
        )
      )}
    </div>
  );
};

export default GlobalSearchResults;
