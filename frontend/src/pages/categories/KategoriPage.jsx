import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../constants/translations';
import { useNutrition } from '../../context/useNutrition';

// Child components import
import CategoryHeader from './components/CategoryHeader';
import GlobalSearchResults from './components/GlobalSearchResults';
import CategoryCarousel from './components/CategoryCarousel';
import FoodGrid from './components/FoodGrid';
import PortionModal from './components/PortionModal';
import ManualCalculatorModal from './components/ManualCalculatorModal';

const KategoriPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [foodsByCategory, setFoodsByCategory] = useState({});
  const [loadingFoods, setLoadingFoods] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  
  const { addFoodEntry } = useNutrition();
  
  const location = useLocation();
  const defaultMealType = location.state?.defaultMealType;

  // Custom Sesi Makan & Porsi states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFoodToAdd, setSelectedFoodToAdd] = useState(null);
  const [mealType, setMealType] = useState(defaultMealType || 'breakfast');
  const [portionQuantity, setPortionQuantity] = useState(1);
  const [portionUnit, setPortionUnit] = useState('porsi'); // 'porsi' or 'gram'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Pagination / Load More state
  const [visibleCount, setVisibleCount] = useState(20);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await categoryService.searchFoods(searchQuery);
          setSearchResults(results);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Load foods when activeCategory changes
  useEffect(() => {
    if (activeCategory) {
      fetchFoods(activeCategory.id);
    }
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      if (data && data.length > 0) {
        let matchedCategory = data[0];
        if (defaultMealType) {
          const m = defaultMealType.toLowerCase();
          if (m.includes('snack') || m.includes('camilan')) {
            matchedCategory = data.find(c => 
              c.name.includes('Camilan') || 
              c.name.includes('Jajanan') || 
              c.name.includes('Buah')
            ) || data[0];
          } else if (m.includes('breakfast') || m.includes('sarapan')) {
            matchedCategory = data.find(c => 
              c.name.includes('Sarapan') || 
              c.name.includes('Protein') || 
              c.name.includes('Karbohidrat') || 
              c.name.includes('Instan')
            ) || data[0];
          } else if (m.includes('lunch') || m.includes('siang') || m.includes('dinner') || m.includes('malam')) {
            matchedCategory = data.find(c => 
              c.name.includes('Masakan') || 
              c.name.includes('Karbohidrat') || 
              c.name.includes('Protein')
            ) || data[0];
          }
        }
        setActiveCategory(matchedCategory);
      }
    } catch (err) {
      setError(language === 'id' ? 'Gagal memuat kategori. Silakan coba lagi.' : 'Failed to load categories. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async (categoryId) => {
    if (foodsByCategory[categoryId]) return; // already loaded
    try {
      setLoadingFoods(true);
      const foods = await categoryService.getFoodsByCategory(categoryId);
      setFoodsByCategory(prev => ({ ...prev, [categoryId]: foods }));
    } catch (err) {
      console.error("Error fetching foods:", err);
    } finally {
      setLoadingFoods(false);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || categories.length === 0) return;

    // Center scroll horizontally on start
    const oneSetWidth = container.scrollWidth / 3;
    container.scrollLeft = oneSetWidth;

    const handleNativeWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.5;
      }
    };

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const setWidth = scrollWidth / 3;
      if (scrollLeft < 50) {
        container.scrollLeft = setWidth + scrollLeft;
      } else if (scrollLeft >= setWidth * 2 - clientWidth - 50) {
        container.scrollLeft = setWidth + (scrollLeft - setWidth * 2);
      }
    };

    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('wheel', handleNativeWheel);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [categories]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full border-4 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin"></div>
          <p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-[10px] md:text-xs">{t.loading}...</p>
        </div>
      </div>
    );
  }

  const currentFoods = activeCategory ? (foodsByCategory[activeCategory.id] || []) : [];
  const displayFoods = currentFoods.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] overflow-x-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .fading-scroll {
          max-height: 500px;
          overflow-y: auto;
          mask-image: linear-gradient(to bottom, black 82%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 82%, transparent 100%);
        }
      `}</style>

      <div className="relative z-10 pt-32 pb-28 md:pb-32 px-3 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <CategoryHeader
            language={language}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearching={isSearching}
            t={t}
          />

          {error && (
            <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] px-4 py-3 rounded-xl mb-6 md:mb-12 font-bold animate-in slide-in-from-top text-center text-xs md:text-sm">
              {error}
            </div>
          )}

          {/* Search Query Active Mode */}
          <GlobalSearchResults
            searchQuery={searchQuery}
            searchResults={searchResults}
            isSearching={isSearching}
            language={language}
            t={t}
            setSelectedFoodToAdd={setSelectedFoodToAdd}
            setIsAddModalOpen={setIsAddModalOpen}
          />

          {searchQuery.trim().length < 2 && (
            /* Category Navigation View */
            <div className="space-y-6 md:space-y-12">
              <CategoryCarousel
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                setVisibleCount={setVisibleCount}
                scrollContainerRef={scrollContainerRef}
                language={language}
              />

              <FoodGrid
                activeCategory={activeCategory}
                loadingFoods={loadingFoods}
                currentFoods={currentFoods}
                displayFoods={displayFoods}
                visibleCount={visibleCount}
                setVisibleCount={setVisibleCount}
                setSelectedFoodToAdd={setSelectedFoodToAdd}
                setIsAddModalOpen={setIsAddModalOpen}
                language={language}
                t={t}
              />
            </div>
          )}
        </div>
      </div>

      <ManualCalculatorModal
        isManualInputOpen={isManualInputOpen}
        setIsManualInputOpen={setIsManualInputOpen}
        addFoodEntry={addFoodEntry}
        language={language}
      />

      <PortionModal
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        selectedFoodToAdd={selectedFoodToAdd}
        mealType={mealType}
        setMealType={setMealType}
        portionQuantity={portionQuantity}
        setPortionQuantity={setPortionQuantity}
        portionUnit={portionUnit}
        setPortionUnit={setPortionUnit}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        addFoodEntry={addFoodEntry}
        language={language}
      />
    </div>
  );
};

export default KategoriPage;
