import React, { useEffect, useState } from 'react';
import { categoryService } from '../services/categoryService';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  Squares2X2Icon,
  FireIcon,
  HeartIcon,
  CakeIcon,
  BoltIcon,
  BeakerIcon,
  SunIcon,
  SparklesIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const getCategoryIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('protein')) return BeakerIcon;
  if (n.includes('buah') || n.includes('sayur')) return SunIcon;
  if (n.includes('sehat')) return HeartIcon;
  if (n.includes('jajanan') || n.includes('kafe')) return CakeIcon;
  if (n.includes('fast')) return BoltIcon;
  if (n.includes('instan')) return ShoppingBagIcon;
  if (n.includes('karbohidrat')) return SparklesIcon;
  if (n.includes('masakan')) return FireIcon;
  return Squares2X2Icon;
};

export default function KategoriPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [foodsByCategory, setFoodsByCategory] = useState({});
  const [loadingFoods, setLoadingFoods] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Gagal memuat kategori. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryExpand = async (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      if (!foodsByCategory[categoryId]) {
        try {
          setLoadingFoods(categoryId);
          const foods = await categoryService.getFoodsByCategory(categoryId);
          setFoodsByCategory({ ...foodsByCategory, [categoryId]: foods });
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingFoods(null);
        }
      }
      setExpandedCategory(categoryId);
    }
  };

  const groupedBySection = categories.reduce((acc, cat) => {
    if (!acc[cat.section]) {
      acc[cat.section] = [];
    }
    acc[cat.section].push(cat);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin"></div>
          <p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-xs">Memuat Kategori...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[var(--text-main)] mb-6">Kategori <span className="text-[var(--primary-green)]">Makanan</span></h1>
          <p className="text-[var(--text-muted)] font-medium max-w-xl mx-auto">
            Jelajahi berbagai jenis makanan berdasarkan grup nutrisi dan preferensi Anda.
          </p>
        </div>

        {error && (
          <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] px-6 py-4 rounded-2xl mb-12 font-bold animate-in slide-in-from-top text-center">
            {error}
          </div>
        )}

        {Object.entries(groupedBySection).map(([section, sectionCategories]) => (
          <div key={section} className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-xl font-bold text-[var(--text-main)] uppercase tracking-widest bg-white border border-[var(--border-card)] px-6 py-2 rounded-xl shadow-sm">
                {section}
              </h2>
              <div className="h-[1px] flex-1 bg-[var(--border-card)]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {sectionCategories.map((category) => {
                const Icon = getCategoryIcon(category.name);
                const isExpanded = expandedCategory === category.id;
                return (
                <div
                  key={category.id}
                  className={`bg-white border transition-all duration-300 rounded-[2rem] overflow-hidden ${
                    isExpanded ? 'border-[var(--primary-green)] shadow-xl shadow-emerald-500/5' : 'border-[var(--border-card)] hover:border-[var(--primary-green)]/30'
                  }`}
                >
                  <button
                    onClick={() => toggleCategoryExpand(category.id)}
                    className="w-full p-8 flex justify-between items-center transition-colors group"
                  >
                    <div className="flex items-center text-left">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 transition-transform duration-300 ${isExpanded ? 'bg-[var(--primary-green)] text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-[var(--primary-green)] group-hover:scale-110'}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text-main)] leading-tight">{category.name}</h3>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{category.item_count} Item Tersedia</p>
                      </div>
                    </div>
                    <div className={`p-2 rounded-xl border border-[var(--border-card)] ${isExpanded ? 'bg-[var(--primary-green)]/10' : ''}`}>
                      {isExpanded ? (
                        <ChevronUpIcon className="w-5 h-5 text-[var(--primary-green)]" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-[var(--text-muted)]" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="bg-[var(--bg-primary)]/50 border-t border-[var(--border-card)]">
                      {category.description && (
                        <div className="px-8 py-6 text-sm text-[var(--text-muted)] font-medium leading-relaxed italic border-b border-[var(--border-card)]">
                          {category.description}
                        </div>
                      )}
                      
                      {loadingFoods === category.id ? (
                        <div className="p-10 text-center flex flex-col items-center gap-3">
                          <div className="h-6 w-6 rounded-full border-2 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-green)]">Memuat...</span>
                        </div>
                      ) : foodsByCategory[category.id]?.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                          {foodsByCategory[category.id].map((food) => (
                            <div key={food.id} className="p-5 border-b border-[var(--border-card)] hover:bg-[var(--primary-green)]/5 group transition-colors flex justify-between items-center">
                              <div className="min-w-0">
                                <p className="font-bold text-[var(--text-main)] text-sm group-hover:text-[var(--primary-green)] transition-colors">{food.food_name_id}</p>
                                <p className="text-[9px] font-bold text-slate-700 uppercase tracking-tight">{food.food_name_en}</p>
                              </div>
                              {food.calories && (
                                <div className="shrink-0 text-[10px] font-black text-[var(--primary-green)] bg-[var(--primary-green)]/10 px-3 py-1 rounded-lg border border-[var(--primary-green)]/10">
                                  {Math.round(food.calories)} kcal
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-700">
                          Data belum tersedia
                        </div>
                      )}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
