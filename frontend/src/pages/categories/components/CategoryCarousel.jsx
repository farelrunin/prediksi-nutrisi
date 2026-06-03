import React from 'react';
import { getCategoryIcon } from '../../../utils/foodHelpers';

const CategoryCarousel = ({
  categories,
  activeCategory,
  setActiveCategory,
  setVisibleCount,
  scrollContainerRef,
  language,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 md:mb-4 px-2">
        <h2 className="text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {language === 'id' ? 'Pilih Kategori' : 'Select Category'}
        </h2>
        <span className="text-[8px] md:text-[10px] font-black text-[var(--primary-green)] uppercase bg-[var(--primary-green)]/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
          {categories.length} {language === 'id' ? 'Kategori' : 'Categories'}
        </span>
      </div>
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar whitespace-nowrap gap-3 md:gap-4 py-2 md:py-4 px-2 cursor-grab active:cursor-grabbing"
      >
        {(categories.length > 0 ? [...categories, ...categories, ...categories] : []).map((category, idx) => {
          const Icon = getCategoryIcon(category.name);
          const isActive = activeCategory?.id === category.id;
          return (
            <button
              key={`${category.id}-${idx}`}
              onClick={() => {
                setActiveCategory(category);
                setVisibleCount(20); // reset visible count
              }}
              className={`inline-flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-6 md:py-4 rounded-lg md:rounded-2xl transition-all duration-300 font-bold text-xs md:text-sm ${
                isActive
                  ? 'bg-[var(--primary-green)] text-white shadow-xl shadow-emerald-500/20 scale-105 border border-transparent'
                  : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-card)] hover:border-[var(--primary-green)]/40 hover:scale-[1.02]'
              }`}
            >
              <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-white animate-pulse' : 'text-[var(--primary-green)]'}`} />
              <span>{category.name}</span>
              <span className={`text-[8px] md:text-[10px] px-1.5 py-0.5 rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
                {category.item_count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCarousel;
