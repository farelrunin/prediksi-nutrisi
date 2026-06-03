import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const CategoryHeader = ({
  language,
  searchQuery,
  setSearchQuery,
  isSearching,
  t,
}) => {
  return (
    <div className="mb-6 md:mb-16 text-center">
      <h1 className="text-xl md:text-4xl lg:text-5xl font-extrabold text-[var(--text-main)] mb-3 md:mb-6">
        {language === 'id' ? 'Kategori' : 'Food'} <span className="text-[var(--primary-green)]">{language === 'id' ? 'Makanan' : 'Categories'}</span>
      </h1>
      <p className="text-[10px] md:text-sm text-[var(--text-muted)] font-medium max-w-xl mx-auto mb-6 md:mb-10">
        {t.categoriesSubtitle}
      </p>
      
      <div className="max-w-2xl mx-auto relative animate-in zoom-in-95 duration-500">
        <div className="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none text-[var(--primary-green)]">
          <MagnifyingGlassIcon className="h-4 w-4 md:h-6 md:w-6" />
        </div>
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 md:pl-16 md:pr-6 md:py-5 rounded-xl md:rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] font-bold shadow-2xl shadow-emerald-500/10 focus:outline-none focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 transition-all text-xs md:text-lg placeholder-slate-400"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-4 md:right-6 flex items-center">
            <div className="h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-[var(--primary-green)]/30 border-t-[var(--primary-green)] animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryHeader;
