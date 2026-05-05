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
      <div className="min-h-screen pt-20 pb-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-300">Loading kategori...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-white">Kategori Makanan</h1>
        <p className="text-center text-gray-400 mb-12">
          Pilih kategori untuk melihat daftar makanan yang tersedia
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {Object.entries(groupedBySection).map(([section, sectionCategories]) => (
          <div key={section} className="mb-12">
            <h2 className="text-2xl font-bold text-[#4ade80] mb-6 border-l-4 border-[#4ade80] pl-4">
              {section}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectionCategories.map((category) => {
                const Icon = getCategoryIcon(category.name);
                return (
                <div
                  key={category.id}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#222222] border border-[#333333] rounded-lg overflow-hidden hover:border-[#4ade80]/50 transition-all"
                >
                  <button
                    onClick={() => toggleCategoryExpand(category.id)}
                    className="w-full p-4 flex justify-between items-center hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="flex items-center text-left">
                      <div className="w-12 h-12 rounded-full bg-[#4ade80]/10 flex items-center justify-center mr-4 shrink-0">
                        <Icon className="w-6 h-6 text-[#4ade80]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <p className="text-sm text-gray-400">{category.item_count} item</p>
                      </div>
                    </div>
                    {expandedCategory === category.id ? (
                      <ChevronUpIcon className="w-5 h-5 text-[#4ade80] shrink-0 ml-2" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-400 shrink-0 ml-2" />
                    )}
                  </button>

                  {category.description && (
                    <div className="px-4 pb-3 border-t border-[#333333]">
                      <p className="text-sm text-gray-400">{category.description}</p>
                    </div>
                  )}

                  {expandedCategory === category.id && (
                    <div className="border-t border-[#333333] bg-[#0f0f0f]">
                      {loadingFoods === category.id ? (
                        <div className="p-4 text-center text-gray-400">Loading makanan...</div>
                      ) : foodsByCategory[category.id]?.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto">
                          {foodsByCategory[category.id].map((food) => (
                            <div key={food.id} className="p-3 border-t border-[#2a2a2a] hover:bg-[#1a1a1a]">
                              <p className="font-medium text-white text-sm">{food.food_name_id}</p>
                              <p className="text-xs text-gray-500">{food.food_name_en}</p>
                              {food.calories && (
                                <p className="text-xs text-[#4ade80] mt-1">
                                  {Math.round(food.calories)} kcal
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-400 text-sm">
                          Belum ada makanan di kategori ini
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

        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Belum ada kategori tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}
