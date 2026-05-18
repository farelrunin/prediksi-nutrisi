import React, { useEffect, useRef, useState } from 'react';
import { 
  Plus, Search, MessageSquare, List, Brain, Sparkles, Camera, Upload, 
  Trash2, RotateCw, CheckCircle2, ChevronDown, Filter, HelpCircle, XCircle 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { useNutrition } from '../context/useNutrition';
import { useNotification } from '../context/useNotification';
import { categoryService } from '../services/categoryService';

const getMealTypes = (language) => [
  { value: 'breakfast', label: language === 'id' ? 'Sarapan' : 'Breakfast' },
  { value: 'lunch', label: language === 'id' ? 'Makan Siang' : 'Lunch' },
  { value: 'dinner', label: language === 'id' ? 'Makan Malam' : 'Dinner' },
  { value: 'snack', label: language === 'id' ? 'Cemilan' : 'Snack' }
];

const formatMetric = (value, suffix = '') => {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) {
    return `0${suffix}`;
  }
  const displayValue = Number.isInteger(numericValue) ? numericValue : numericValue.toFixed(1);
  return `${displayValue}${suffix}`;
};

const FoodForm = ({ onAddFood }) => {
  const { notify } = useNotification();
  const { language } = useLanguage();
  const t = translations[language];
  const mealTypes = getMealTypes(language);
  
  const [activeTab, setActiveTab] = useState('story'); // 'story', 'camera', 'manual'
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState('');
  
  // Camera States
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Nutrition Calculator (Database Integration!) States
  const [dbCategories, setDbCategories] = useState([]);
  const [dbFoods, setDbFoods] = useState([]);
  const [customFoodsList, setCustomFoodsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [foodPortions, setFoodPortions] = useState({});
  const [loggedFoods, setLoggedFoods] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAnalysisReport, setShowAnalysisReport] = useState(false);
  
  const [customFood, setCustomFood] = useState({
    name: '',
    category: '',
    calories: 100,
    protein: 10,
    carbs: 10,
    fat: 5,
    baseServing: 100,
    unit: 'g'
  });

  const calculateAnalysisReport = () => {
    const tValues = loggedFoods.reduce((acc, curr) => ({
      protein: acc.protein + (curr.protein || 0),
      carbs: acc.carbs + (curr.carbs || 0),
      fat: acc.fat + (curr.fat || 0)
    }), { protein: 0, carbs: 0, fat: 0 });

    const proteinG = tValues.protein;
    const carbsG = tValues.carbs;
    const fatG = tValues.fat;

    const calProtein = proteinG * 4;
    const calCarbs = carbsG * 4;
    const calFat = fatG * 9;

    const calculatedTotalCalories = calProtein + calCarbs + calFat;

    const proteinPct = calculatedTotalCalories > 0 ? (calProtein / calculatedTotalCalories) * 100 : 0;
    const carbsPct = calculatedTotalCalories > 0 ? (calCarbs / calculatedTotalCalories) * 100 : 0;
    const fatPct = calculatedTotalCalories > 0 ? (calFat / calculatedTotalCalories) * 100 : 0;

    let adviceTitle = language === 'id' ? 'Pola Makan Seimbang' : 'Balanced Diet Pattern';
    let adviceText = language === 'id' 
      ? 'Kombinasi makanan Anda sangat baik dan seimbang antara protein, karbohidrat, dan lemak sehat!' 
      : 'Your food combination is excellent and balanced between protein, carbs, and healthy fats!';
    let badgeColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';

    if (proteinPct < 15 && calculatedTotalCalories > 0) {
      adviceTitle = language === 'id' ? 'Kekurangan Asupan Protein' : 'Low Protein Intake';
      adviceText = language === 'id'
        ? 'Persentase energi dari protein Anda kurang dari 15%. Disarankan untuk menambahkan bahan kaya protein seperti Dada Ayam, Salmon, Tahu, atau Telur untuk mendukung regenerasi otot dan metabolisme tubuh.'
        : 'Your energy percentage from protein is less than 15%. It is recommended to add protein-rich ingredients like Chicken Breast, Salmon, Tofu, or Eggs to support muscle recovery and metabolism.';
      badgeColor = 'text-[var(--warning)] bg-amber-500/10 border-amber-500/30';
    } else if (fatPct > 35 && calculatedTotalCalories > 0) {
      adviceTitle = language === 'id' ? 'Kandungan Lemak Tinggi' : 'High Fat Content';
      adviceText = language === 'id'
        ? 'Persentase energi dari lemak Anda melebihi 35%. Cobalah untuk mengurangi minyak jenuh, mentega, atau gorengan, dan ganti dengan sumber lemak baik seperti Alpukat atau Minyak Zaitun dalam porsi sedang.'
        : 'Your energy percentage from fat exceeds 35%. Try reducing saturated oils, butter, or deep-fried foods, and replace them with good fat sources like Avocado or Olive Oil in moderate portions.';
      badgeColor = 'text-[var(--danger)] bg-rose-500/10 border-rose-500/30';
    } else if (carbsPct > 65 && calculatedTotalCalories > 0) {
      adviceTitle = language === 'id' ? 'Karbohidrat Mendominasi' : 'High Carbohydrates';
      adviceText = language === 'id'
        ? 'Persentase energi dari karbohidrat Anda melebihi 65%. Untuk mencegah lonjakan gula darah dan rasa cepat lapar, kurangi porsi karbohidrat sederhana dan seimbangkan dengan sayur berserat tinggi dan protein.'
        : 'Your energy percentage from carbohydrates exceeds 65%. To prevent blood sugar spikes and quick hunger, reduce simple carbs and balance with high-fiber veggies and protein.';
      badgeColor = 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    }

    return {
      calProtein,
      calCarbs,
      calFat,
      calculatedTotalCalories,
      proteinPct,
      carbsPct,
      fatPct,
      adviceTitle,
      adviceText,
      badgeColor
    };
  };

  const { predictNutrition, predictNutritionImage, refreshHistory } = useNutrition();

  // 1. Fetch Categories from Backend Dataset on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await categoryService.getAllCategories();
        setDbCategories(cats || []);
        // Set default category for custom foods form
        if (cats && cats.length > 0) {
          setCustomFood(prev => ({ ...prev, category: cats[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch database categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Foods from Backend Dataset Dynamically when Query/Filter changes (Debounced)
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        if (selectedCategory !== 'semua') {
          // Fetch foods inside selected category from DB
          const foods = await categoryService.getFoodsByCategory(selectedCategory);
          if (searchQuery.trim()) {
            const queryLower = searchQuery.toLowerCase();
            const filtered = foods.filter(f => 
              (f.food_name_id && f.food_name_id.toLowerCase().includes(queryLower)) ||
              (f.food_name_en && f.food_name_en.toLowerCase().includes(queryLower))
            );
            setDbFoods(filtered || []);
          } else {
            setDbFoods(foods || []);
          }
        } else {
          // If 'semua' (All) is selected, perform a search query directly
          const query = searchQuery.trim();
          const foods = await categoryService.searchFoods(query);
          setDbFoods(foods || []);
        }
      } catch (err) {
        console.error("Failed to query foods database:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      if (activeTab === 'manual') {
        fetchFoods();
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCategory, activeTab]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const startCamera = async (currentFacing = facingMode) => {
    stopCamera();
    setIsCameraActive(true);
    try {
      const constraints = { video: { facingMode: currentFacing } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.play().catch(e => console.error("Error playing video:", e));
        }
      }, 100);
    } catch (err) {
      console.error("Camera access failed:", err);
      setIsCameraActive(false);
      notify({
        type: 'error',
        title: language === 'id' ? 'Kamera Gagal' : 'Camera Failed',
        message: language === 'id' ? 'Gagal mengakses kamera. Pastikan Anda memberikan izin akses.' : 'Failed to access camera. Please make sure permissions are granted.'
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    if (isCameraActive) {
      setTimeout(() => {
        startCamera(nextFacing);
      }, 100);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured_food.jpg", { type: "image/jpeg" });
          handleImageSelect(file);
          stopCamera();
        }
      }, 'image/jpeg', 0.85);
    }
  };

  const handleImageSelect = (file) => {
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPredictionResult(null);
      setPredictionError('');

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 640;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          setImageBase64(compressedBase64);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setImageBase64('');
    setPredictionResult(null);
    setPredictionError('');
  };

  const handleAnalyzeAI = async () => {
    const trimmedStory = story.trim();
    if (trimmedStory.length < 10) {
      notify({ type: 'warning', title: language === 'id' ? 'Cerita Terlalu Pendek' : 'Story Too Short', message: language === 'id' ? 'Tulis setidaknya 10 karakter agar AI dapat menganalisis.' : 'Write at least 10 characters for AI to analyze.' });
      return;
    }

    setPredicting(true);
    setPredictionError('');
    setPredictionResult(null);

    try {
      const result = await predictNutrition({ story: trimmedStory });
      setPredictionResult(result);
      notify({ type: 'success', title: language === 'id' ? 'Analisis Selesai' : 'Analysis Complete', message: language === 'id' ? 'AI berhasil mengekstrak nutrisi dari cerita Anda!' : 'AI successfully extracted nutrition from your story!' });
    } catch (error) {
      console.error('Prediction error:', error);
      setPredictionError(error.message || (language === 'id' ? 'Gagal menganalisis cerita makanan.' : 'Failed to analyze food story.'));
      notify({ type: 'error', title: language === 'id' ? 'Analisis Gagal' : 'Analysis Failed', message: language === 'id' ? 'AI sedang sibuk atau kuota habis. Silakan coba lagi nanti.' : 'AI is busy or quota exceeded. Please try again later.' });
    } finally {
      setPredicting(false);
    }
  };

  const handleAnalyzeImageAI = async () => {
    if (!selectedImage) {
      notify({
        type: 'warning',
        title: language === 'id' ? 'Gambar Kosong' : 'No Image',
        message: language === 'id' ? 'Silakan ambil foto atau unggah gambar makanan terlebih dahulu.' : 'Please take a photo or upload a food image first.'
      });
      return;
    }

    setPredicting(true);
    setPredictionError('');
    setPredictionResult(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const result = await predictNutritionImage(formData);
      setPredictionResult(result);
      notify({
        type: 'success',
        title: language === 'id' ? 'Analisis Selesai' : 'Analysis Complete',
        message: language === 'id' ? 'AI berhasil menganalisis nutrisi dari foto makanan Anda!' : 'AI successfully analyzed nutrition from your food photo!'
      });
    } catch (error) {
      console.error('Image prediction error:', error);
      setPredictionError(error.message || (language === 'id' ? 'Gagal menganalisis gambar makanan.' : 'Failed to analyze food image.'));
      notify({
        type: 'error',
        title: language === 'id' ? 'Analisis Gagal' : 'Analysis Failed',
        message: language === 'id' ? 'Gagal mendeteksi makanan dari gambar. Silakan coba lagi.' : 'Failed to detect food from the image. Please try again.'
      });
    } finally {
      setPredicting(false);
    }
  };

  const handleStoryChange = (value) => {
    setStory(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'camera') {
        if (!predictionResult) {
          notify({ type: 'warning', title: language === 'id' ? 'Belum Dianalisis' : 'Not Analyzed', message: language === 'id' ? 'Silakan analisis gambar makanan terlebih dahulu.' : 'Please analyze the food image first.' });
          setLoading(false);
          return;
        }

        const finalData = {
          food_name: predictionResult.food_name || (predictionResult.foods && predictionResult.foods.length > 0 ? predictionResult.foods.map(f => f.name).join(', ') : (language === 'id' ? 'Makanan dari Foto' : 'Food from Photo')),
          meal_type: 'lunch',
          calories: Number(predictionResult.calories || 0),
          protein: Number(predictionResult.protein || 0),
          carbs: Number(predictionResult.carbs || 0),
          fat: Number(predictionResult.fat || 0),
          quantity: 1,
          unit: 'portion',
          image_url: imageBase64
        };

        await onAddFood(finalData);

        setSelectedImage(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setImageBase64('');
        setPredictionResult(null);
        setPredictionError('');
        notify({ type: 'success', title: language === 'id' ? 'Data Tersimpan' : 'Data Saved', message: language === 'id' ? 'Nutrisi Anda telah dicatat!' : 'Your nutrition has been recorded!' });
      } else {
        const trimmedStory = story.trim();
        let nutritionData = predictionResult;

        if (!nutritionData || nutritionData?.parsed_data?.original_story?.trim() !== trimmedStory) {
          nutritionData = await predictNutrition({ story: trimmedStory });
        }

        const finalData = {
          food_name: nutritionData.food_name || (nutritionData.foods && nutritionData.foods.length > 0 ? nutritionData.foods.map(f => f.name).join(', ') : trimmedStory),
          meal_type: 'lunch',
          calories: Number(nutritionData.calories || 0),
          protein: Number(nutritionData.protein || 0),
          carbs: Number(nutritionData.carbs || 0),
          fat: Number(nutritionData.fat || 0),
          quantity: 1,
          unit: 'portion'
        };

        await onAddFood(finalData);

        setStory('');
        setPredictionResult(null);
        setPredictionError('');
        notify({ type: 'success', title: language === 'id' ? 'Data Tersimpan' : 'Data Saved', message: language === 'id' ? 'Nutrisi Anda telah dicatat!' : 'Your nutrition has been recorded!' });
      }
    } catch (error) {
      console.error('Error adding food:', error);
      notify({ type: 'error', title: language === 'id' ? 'Gagal Menyimpan' : 'Save Failed', message: (language === 'id' ? 'Gagal menambahkan data: ' : 'Failed to add data: ') + (error.message || (language === 'id' ? 'Coba lagi.' : 'Try again.')) });
    }

    setLoading(false);
  };

  // --- DATABASE-DRIVEN NUTRITION CALCULATOR HELPERS ---
  const getFoodDisplayName = (food) => {
    return language === 'id' ? (food.food_name_id || food.food_name_en) : (food.food_name_en || food.food_name_id);
  };

  const getFoodCategoryName = (food) => {
    const cat = dbCategories.find(c => c.id === food.category_id);
    return cat ? cat.name : (language === 'id' ? 'Umum' : 'General');
  };

  const getFoodUnit = (food) => {
    const nameLower = (food.food_name_id || food.food_name_en || '').toLowerCase();
    const cat = dbCategories.find(c => c.id === food.category_id);
    const catName = cat ? cat.name.toLowerCase() : '';
    const isLiquid = nameLower.match(/(susu|jus|kopi|teh|air|minuman|sirup|kuah|soda)/) || catName.includes('kafe') || catName.includes('minuman');
    return isLiquid ? 'ml' : 'g';
  };

  const handlePortionChange = (foodId, val) => {
    setFoodPortions({
      ...foodPortions,
      [foodId]: val
    });
  };

  const handleAddLoggedFood = (food, portion) => {
    const scale = portion / 100; // Database dataset values are standardized per 100g/ml
    const displayName = getFoodDisplayName(food);
    const unit = getFoodUnit(food);
    const newEntry = {
      id: food.id,
      name: displayName,
      quantity: portion,
      unit: unit,
      calories: (food.calories || 0) * scale,
      protein: (food.protein || 0) * scale,
      carbs: (food.carbohydrates || 0) * scale,
      fat: (food.total_fat || 0) * scale,
      mealType: selectedMealType,
      baseFood: food
    };
    setLoggedFoods([...loggedFoods, newEntry]);
    showToast(language === 'id' ? `${displayName} ditambahkan!` : `${displayName} added!`);
  };

  const handleUpdateLoggedQuantity = (idx, newQty) => {
    if (newQty < 1) return;
    const updated = [...loggedFoods];
    const item = updated[idx];
    const scale = newQty / 100;

    item.quantity = newQty;
    item.calories = (item.baseFood.calories || 0) * scale;
    item.protein = (item.baseFood.protein || 0) * scale;
    item.carbs = (item.baseFood.carbohydrates || 0) * scale;
    item.fat = (item.baseFood.total_fat || 0) * scale;

    setLoggedFoods(updated);
  };

  const handleRemoveLoggedFood = (idx) => {
    const item = loggedFoods[idx];
    setLoggedFoods(loggedFoods.filter((_, i) => i !== idx));
    showToast(language === 'id' ? `${item.name} dihapus!` : `${item.name} removed!`);
  };

  const handleAddCustomFood = (e) => {
    e.preventDefault();
    if (!customFood.name.trim()) return;

    // Local custom item structure following DB dataset schema
    const newFood = {
      id: `custom-${Date.now()}`,
      food_name_id: customFood.name,
      food_name_en: customFood.name,
      category_id: customFood.category,
      calories: Number(customFood.calories),
      protein: Number(customFood.protein),
      carbohydrates: Number(customFood.carbs),
      total_fat: Number(customFood.fat)
    };

    setCustomFoodsList([newFood, ...customFoodsList]);
    setIsCustomOpen(false);
    setCustomFood(prev => ({
      name: '',
      category: dbCategories[0]?.id || '',
      calories: 100,
      protein: 10,
      carbs: 10,
      fat: 5,
      baseServing: 100,
      unit: 'g'
    }));
    showToast(language === 'id' ? 'Makanan khusus ditambahkan!' : 'Custom food added!');
  };

  const handleAnalyzeLoggedAI = async () => {
    if (loggedFoods.length === 0) return;
    const itemsStr = loggedFoods.map(f => `${f.name} (${f.quantity} ${f.unit})`).join(', ');
    const promptText = language === 'id' 
      ? `Saya makan ${itemsStr} untuk ${selectedMealType === 'breakfast' ? 'Sarapan' : selectedMealType === 'lunch' ? 'Makan Siang' : selectedMealType === 'dinner' ? 'Makan Malam' : 'Cemilan'}.`
      : `I ate ${itemsStr} for ${selectedMealType}.`;
    
    setStory(promptText);
    setActiveTab('story');
    notify({
      type: 'info',
      title: language === 'id' ? 'Analisis Siap' : 'Analysis Ready',
      message: language === 'id' ? 'Kami telah memindahkan daftar makanan Anda ke tab AI Story. Klik Analisis dengan AI!' : 'We moved your food list to AI Story tab. Click Analyze with AI!'
    });
  };

  const handleSaveAllLoggedFoods = async () => {
    if (loggedFoods.length === 0) return;
    setLoading(true);
    try {
      for (const item of loggedFoods) {
        const payload = {
          foodName: item.name,
          mealType: item.mealType,
          quantity: Number(item.quantity),
          unit: `${item.unit} (Kalkulator)`,
          calories: Number(item.calories),
          protein: Number(item.protein),
          carbs: Number(item.carbs),
          fat: Number(item.fat)
        };
        await onAddFood(payload);
      }
      
      // Trigger a full history refresh from backend to ensure all batched items are loaded
      if (refreshHistory) {
        await refreshHistory();
      }
      
      setLoggedFoods([]);
      notify({
        type: 'success',
        title: language === 'id' ? 'Berhasil Disimpan' : 'Saved Successfully',
        message: language === 'id' ? 'Semua makanan berhasil dicatat ke riwayat gizi Anda!' : 'All foods logged successfully to your history!'
      });
    } catch (err) {
      console.error("Save logged foods failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations for calculator totals
  const totals = loggedFoods.reduce((acc, curr) => ({
    calories: acc.calories + curr.calories,
    protein: acc.protein + curr.protein,
    carbs: acc.carbs + curr.carbs,
    fat: acc.fat + curr.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Merge runtime custom foods list with queried DB foods
  const displayedFoods = [...customFoodsList, ...dbFoods];

  const foods = predictionResult?.foods ?? [];
  const totalQuantity = predictionResult?.parsed_data?.total_nutrition?.quantity_grams ?? 0;
  const canSubmit = activeTab === 'camera'
    ? (selectedImage !== null && predictionResult !== null && !predicting)
    : (story.trim().length > 0 && !predicting);

  return (
    <div className="space-y-8 relative">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-6 md:right-10 z-[200] bg-[var(--text-main)] text-[var(--bg-primary)] px-6 py-4 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="text-[var(--primary-green)]" size={16} />
          <span className="uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex p-1 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-card)] max-w-md mx-auto">
        <button 
          type="button"
          onClick={() => { setActiveTab('story'); stopCamera(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'story' ? 'bg-[var(--primary-green)] text-[var(--bg-primary)] shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
        >
          <Sparkles size={14} />
          AI Story
        </button>
        <button 
          type="button"
          onClick={() => { setActiveTab('camera'); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'camera' ? 'bg-[var(--primary-green)] text-[var(--bg-primary)] shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
        >
          <Camera size={14} />
          AI Camera
        </button>
        <button 
          type="button"
          onClick={() => { setActiveTab('manual'); stopCamera(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-[var(--primary-green)] text-[var(--bg-primary)] shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
        >
          <List size={14} />
          {language === 'id' ? 'Manual' : 'Manual'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* TAB 1: AI STORY */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            <div>
              <label className="mb-4 block text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {language === 'id' ? 'Ceritakan makanan Anda hari ini' : 'Tell us about your food today'}
              </label>
              <textarea
                value={story}
                onChange={(e) => handleStoryChange(e.target.value)}
                placeholder={language === 'id' ? 'Contoh: Sarapan bubur ayam, dan makan siang nasi Padang dengan rendang...' : 'Example: Had chicken porridge for breakfast, and Padang rice with rendang for lunch...'}
                className="min-h-[180px] w-full resize-none rounded-[2rem] border border-[var(--border-card)] bg-[var(--bg-primary)] px-8 py-6 text-[var(--text-main)] placeholder-slate-600 outline-none transition-all focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 text-lg leading-relaxed shadow-inner"
                required={activeTab === 'story'}
                maxLength="1000"
              />
              <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Brain size={14} className="text-[var(--primary-green)]" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">
                    {language === 'id' ? 'AI akan menganalisis makanan, porsi, dan estimasi nutrisi untuk Anda.' : 'AI will analyze food, portion, and nutrition estimates for you.'}
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleAnalyzeAI}
                  disabled={predicting || story.trim().length < 10}
                  className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--primary-green)]/30 text-[var(--primary-green)] px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary-green)] hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {predicting ? (
                    <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                  )}
                  {predicting ? (language === 'id' ? 'Menganalisis...' : 'Analyzing...') : (language === 'id' ? 'Analisis dengan AI' : 'Analyze with AI')}
                </button>
              </div>
            </div>

            {predicting && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in duration-500">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain size={16} className="text-[var(--primary-green)] animate-pulse" />
                  </div>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--primary-green)]">{language === 'id' ? 'Menganalisis...' : 'Analyzing...'}</span>
              </div>
            )}

            {predictionError && !predicting && (
              <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-6 py-4 text-sm font-bold text-[var(--danger)] animate-in slide-in-from-top flex flex-col gap-3">
                <p>{predictionError}</p>
                <button 
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className="bg-[var(--danger)] text-white px-4 py-2 rounded-xl text-xs uppercase tracking-widest w-fit hover:brightness-110"
                >
                  {language === 'id' ? 'Gunakan Input Manual' : 'Use Manual Input'}
                </button>
              </div>
            )}

            {predictionResult && !predicting && (
              <div className="rounded-[2.5rem] border border-[var(--primary-green)]/20 bg-[var(--bg-secondary)] p-8 md:p-10 animate-in zoom-in-95 duration-500 shadow-2xl">
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-[var(--primary-green)] p-3 text-[var(--bg-primary)] shadow-lg shadow-emerald-500/30">
                      <Brain size={24} />
                    </div>
                    <div>
                      <div className="text-lg font-black text-[var(--text-main)]">{language === 'id' ? 'Hasil Analisis AI' : 'AI Analysis Results'}</div>
                      <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                        {foods.length} {language === 'id' ? 'Item' : 'Item'} • {formatMetric(totalQuantity, ' g')} Total
                      </div>
                    </div>
                  </div>
                  <div className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest border border-current bg-current/10 ${
                    predictionResult.risk_level === 'tinggi' || predictionResult.risk_level === 'High' ? 'text-[var(--danger)]' : 
                    predictionResult.risk_level === 'sedang' || predictionResult.risk_level === 'Medium' ? 'text-[var(--warning)]' : 'text-[var(--primary-green)]'
                  }`}>
                    {predictionResult.risk_level === 'tinggi' || predictionResult.risk_level === 'High' ? (language === 'id' ? 'RISIKO TINGGI' : 'HIGH RISK') : 
                     predictionResult.risk_level === 'sedang' || predictionResult.risk_level === 'Medium' ? (language === 'id' ? 'RISIKO SEDANG' : 'MEDIUM RISK') : (language === 'id' ? 'RISIKO RENDAH' : 'LOW RISK')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-10">
                  {[
                    { label: t.calories, val: formatMetric(predictionResult.calories), color: 'text-[var(--primary-green)]' },
                    { label: t.protein, val: formatMetric(predictionResult.protein, 'g'), color: 'text-[var(--accent-blue)]' },
                    { label: t.carbs, val: formatMetric(predictionResult.carbs, 'g'), color: 'text-[var(--warning)]' },
                    { label: t.fat, val: formatMetric(predictionResult.fat, 'g'), color: 'text-[var(--danger)]' }
                  ].map((m) => (
                    <div key={m.label} className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl px-4 py-6 text-center shadow-lg transition-transform hover:scale-105">
                      <div className={`text-xl font-black mb-1 ${m.color}`}>{m.val}</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">{m.label}</div>
                    </div>
                  ))}
                </div>

                {predictionResult.ai_advice && (
                  <div className="mb-10 rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 p-4 text-[var(--primary-green)] opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <MessageSquare size={100} strokeWidth={1} />
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-[var(--primary-green)] font-black text-[10px] uppercase tracking-[0.3em] relative z-10">
                      <Sparkles size={12} className="animate-pulse" />
                      <span>AI Insight</span>
                    </div>
                    <p className="text-[var(--text-main)] text-sm italic font-medium leading-relaxed relative z-10">
                      "{predictionResult.ai_advice}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI CAMERA */}
        {activeTab === 'camera' && (
          <div className="space-y-6">
            <div>
              <label className="mb-4 block text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {language === 'id' ? 'Ambil Foto Makanan atau Unggah Gambar' : 'Take Food Photo or Upload Image'}
              </label>
              
              <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border-card)] bg-[var(--bg-primary)] min-h-[320px] flex flex-col items-center justify-center p-6 text-center transition-all">
                {isCameraActive && (
                  <div className="absolute inset-0 w-full h-full bg-black flex flex-col items-center justify-center">
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover max-h-[400px]"
                      playsInline 
                      muted
                    />
                    <style>{`
                      video {
                        transform: ${facingMode === 'user' ? 'scaleX(-1)' : 'none'};
                      }
                    `}</style>
                    <div className="absolute bottom-6 inset-x-0 flex justify-center items-center gap-6 z-10 px-4">
                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        className="p-4 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 transition-all active:scale-95 shadow-md"
                        title={language === 'id' ? 'Ganti Kamera' : 'Switch Camera'}
                      >
                        <RotateCw size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="p-5 rounded-full bg-[var(--primary-green)] text-[var(--bg-primary)] hover:bg-emerald-400 hover:scale-105 transition-all shadow-lg active:scale-95 border-4 border-white/30"
                        title={language === 'id' ? 'Ambil Foto' : 'Capture Photo'}
                      >
                        <Camera size={24} />
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="p-4 rounded-full bg-rose-600/80 border border-rose-500/20 text-white hover:bg-rose-700 transition-all active:scale-95 shadow-md"
                        title={language === 'id' ? 'Tutup Kamera' : 'Close Camera'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {!isCameraActive && previewUrl && (
                  <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
                    <img 
                      src={previewUrl} 
                      alt="Food preview" 
                      className="rounded-2xl max-h-[300px] object-contain shadow-2xl border border-[var(--border-card)]"
                    />
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="absolute -top-3 -right-3 p-3 rounded-full bg-rose-600/90 text-white hover:bg-rose-700 transition-all shadow-lg active:scale-95"
                      title={language === 'id' ? 'Hapus Gambar' : 'Remove Image'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                {!isCameraActive && !previewUrl && (
                  <div className="space-y-6 w-full max-w-sm">
                    <div className="mx-auto w-16 h-16 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-card)] flex items-center justify-center text-[var(--primary-green)]">
                      <Camera size={28} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-main)] mb-1">
                        {language === 'id' ? 'Gunakan Kamera Anda' : 'Use Your Camera'}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        {language === 'id' 
                          ? 'Ambil foto makanan Anda secara langsung atau unggah gambar dari penyimpanan perangkat Anda.' 
                          : 'Snap a live photo of your food or select a file from your device storage.'}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--primary-green)] text-[var(--bg-primary)] px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 hover:scale-[1.02] active:scale-100 transition-all shadow-md"
                      >
                        <Camera size={16} />
                        {language === 'id' ? 'Buka Kamera' : 'Open Camera'}
                      </button>
                      <label className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-main)] px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[var(--bg-primary)] transition-all cursor-pointer shadow-sm">
                        <Upload size={16} className="text-[var(--primary-green)]" />
                        <span>{language === 'id' ? 'Pilih Galeri' : 'Browse Gallery'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {!isCameraActive && previewUrl && (
                <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Brain size={14} className="text-[var(--primary-green)]" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      {language === 'id' ? 'Gemini AI akan mendeteksi makanan dan menghitung nutrisinya.' : 'Gemini AI will identify the food and calculate its nutrition.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAnalyzeImageAI}
                    disabled={predicting || !selectedImage}
                    className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--primary-green)]/30 text-[var(--primary-green)] px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary-green)] hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {predicting ? (
                      <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                    )}
                    {predicting ? (language === 'id' ? 'Menganalisis...' : 'Analyzing...') : (language === 'id' ? 'Analisis Foto dengan AI' : 'Analyze Photo with AI')}
                  </button>
                </div>
              )}
            </div>

            {predicting && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in duration-500">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain size={16} className="text-[var(--primary-green)] animate-pulse" />
                  </div>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--primary-green)]">
                  {language === 'id' ? 'AI Sedang Membaca Makanan...' : 'AI is reading your food...'}
                </span>
              </div>
            )}

            {predictionError && !predicting && (
              <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-6 py-4 text-sm font-bold text-[var(--danger)] animate-in slide-in-from-top flex flex-col gap-3">
                <p>{predictionError}</p>
                <button 
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className="bg-[var(--danger)] text-white px-4 py-2 rounded-xl text-xs uppercase tracking-widest w-fit hover:brightness-110"
                >
                  {language === 'id' ? 'Gunakan Input Manual' : 'Use Manual Input'}
                </button>
              </div>
            )}

            {predictionResult && !predicting && (
              <div className="rounded-[2.5rem] border border-[var(--primary-green)]/20 bg-[var(--bg-secondary)] p-8 md:p-10 animate-in zoom-in-95 duration-500 shadow-2xl">
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-[var(--primary-green)] p-3 text-[var(--bg-primary)] shadow-lg shadow-emerald-500/30">
                      <Brain size={24} />
                    </div>
                    <div>
                      <div className="text-lg font-black text-[var(--text-main)]">{language === 'id' ? 'Hasil Analisis Gambar AI' : 'AI Image Analysis Results'}</div>
                      <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                        {foods.length} {language === 'id' ? 'Item' : 'Item'} • {formatMetric(predictionResult.quantity_grams || 100, ' g')} Total
                      </div>
                    </div>
                  </div>
                  <div className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest border border-current bg-current/10 ${
                    predictionResult.risk_level === 'tinggi' || predictionResult.risk_level === 'High' ? 'text-[var(--danger)]' : 
                    predictionResult.risk_level === 'sedang' || predictionResult.risk_level === 'Medium' ? 'text-[var(--warning)]' : 'text-[var(--primary-green)]'
                  }`}>
                    {predictionResult.risk_level === 'tinggi' || predictionResult.risk_level === 'High' ? (language === 'id' ? 'RISIKO TINGGI' : 'HIGH RISK') : 
                     predictionResult.risk_level === 'sedang' || predictionResult.risk_level === 'Medium' ? (language === 'id' ? 'RISIKO SEDANG' : 'MEDIUM RISK') : (language === 'id' ? 'RISIKO RENDAH' : 'LOW RISK')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-10">
                  {[
                    { label: t.calories, val: formatMetric(predictionResult.calories), color: 'text-[var(--primary-green)]' },
                    { label: t.protein, val: formatMetric(predictionResult.protein, 'g'), color: 'text-[var(--accent-blue)]' },
                    { label: t.carbs, val: formatMetric(predictionResult.carbs, 'g'), color: 'text-[var(--warning)]' },
                    { label: t.fat, val: formatMetric(predictionResult.fat, 'g'), color: 'text-[var(--danger)]' }
                  ].map((m) => (
                    <div key={m.label} className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl px-4 py-6 text-center shadow-lg transition-transform hover:scale-105">
                      <div className={`text-xl font-black mb-1 ${m.color}`}>{m.val}</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">{m.label}</div>
                    </div>
                  ))}
                </div>

                {predictionResult.ai_advice && (
                  <div className="mb-10 rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 p-4 text-[var(--primary-green)] opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <MessageSquare size={100} strokeWidth={1} />
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-[var(--primary-green)] font-black text-[10px] uppercase tracking-[0.3em] relative z-10">
                      <Sparkles size={12} className="animate-pulse" />
                      <span>AI Insight</span>
                    </div>
                    <p className="text-[var(--text-main)] text-sm italic font-medium leading-relaxed relative z-10">
                      "{predictionResult.ai_advice}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RICH MANUAL NUTRITION CALCULATOR (DATABASE DRIVEN SEEDED DATASET!) */}
        {activeTab === 'manual' && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500 text-left">
            
            {/* Header Text */}
            <div className="border-b border-[var(--border-card)]/40 pb-4">
              <h3 className="text-lg font-black text-[var(--text-main)] uppercase tracking-wider">{language === 'id' ? 'Tambahkan Makanan Anda' : 'Add Your Foods'}</h3>
              <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">{language === 'id' ? 'Cari dan saring makanan langsung dari database gizi terverifikasi Anda.' : 'Search and filter foods directly from your verified nutrition database.'}</p>
            </div>

            {/* Search and Category Filter Section */}
            <div className="space-y-4 bg-[var(--bg-secondary)]/50 p-6 rounded-3xl border border-[var(--border-card)]">
              {/* Search input with button */}
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'id' ? 'Cari makanan dalam dataset' : 'Search foods in dataset '}
                  className="flex-grow bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-6 py-4 text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] shadow-inner font-semibold text-sm"
                />
                <button 
                  type="button"
                  className="bg-[var(--primary-green)] text-white px-8 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-400 active:scale-95 transition-all shadow-md"
                >
                  {language === 'id' ? 'Cari' : 'Search'}
                </button>
              </div>

              {/* Horizontal scroll category filters */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Filter berdasarkan:' : 'Filter by:'}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('semua')}
                    className={`px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                      selectedCategory === 'semua' 
                        ? 'bg-[var(--primary-green)] text-white border-transparent shadow-md' 
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-card)] hover:text-[var(--text-main)] hover:border-[var(--primary-green)]/30'
                    }`}
                  >
                    {language === 'id' ? 'Semua' : 'All'}
                  </button>
                  {dbCategories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                        selectedCategory === cat.id 
                          ? 'bg-[var(--primary-green)] text-white border-transparent shadow-md' 
                          : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-card)] hover:text-[var(--text-main)] hover:border-[var(--primary-green)]/30'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Catalog Grid View with Portions input (Scrollbar style) */}
            <div className="max-h-[420px] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 border border-[var(--border-card)]/30 rounded-[2rem] p-4 bg-[var(--bg-primary)] shadow-inner">
              {displayedFoods.length === 0 ? (
                <div className="col-span-full py-16 text-center text-xs font-bold text-[var(--text-muted)]">
                  {language === 'id' ? 'Tidak ada makanan yang cocok ditemukan di dalam database.' : 'No matching foods found in the database.'}
                </div>
              ) : (
                displayedFoods.map(food => {
                  const portion = foodPortions[food.id] || 100;
                  const displayName = getFoodDisplayName(food);
                  const catName = getFoodCategoryName(food);
                  const unit = getFoodUnit(food);
                  return (
                    <div key={food.id} className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 shadow-sm space-y-4 hover:border-[var(--primary-green)]/35 transition-all flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-sm text-[var(--text-main)] line-clamp-1">{displayName}</h4>
                          <span className="inline-block mt-1.5 text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-md border border-[var(--border-card)]">{catName}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-center bg-[var(--bg-secondary)]/40 rounded-xl py-3 px-2">
                        <div>
                          <p className="text-xs font-black text-[var(--primary-green)]">{Math.round(food.calories)}</p>
                          <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">kalori</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-[var(--accent-blue)]">{food.protein.toFixed(1)}g</p>
                          <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">protein</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-[var(--warning)]">{(food.carbohydrates || food.carbs || 0).toFixed(1)}g</p>
                          <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">karbo</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-[var(--danger)]">{(food.total_fat || food.fat || 0).toFixed(1)}g</p>
                          <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">lemak</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-card)]/30">
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            value={portion}
                            onChange={(e) => handlePortionChange(food.id, Number(e.target.value))}
                            className="w-16 bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-xs text-center font-bold outline-none focus:border-[var(--primary-green)]"
                            min="1"
                          />
                          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">{unit}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddLoggedFood(food, portion)}
                          className="bg-[var(--primary-green)] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md shadow-emerald-500/10"
                        >
                          {language === 'id' ? 'Tambah' : 'Add'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Custom Food Addition Toggle Drawer */}
            <div className="border border-[var(--border-card)] rounded-3xl overflow-hidden bg-[var(--bg-card)] shadow-sm">
              <button
                type="button"
                onClick={() => setIsCustomOpen(!isCustomOpen)}
                className="w-full flex justify-between items-center px-8 py-5 text-left text-xs font-black uppercase tracking-widest text-[var(--primary-green)] hover:bg-[var(--bg-secondary)]/30 transition-all"
              >
                <span>+ {language === 'id' ? 'Tambahkan Makanan Khusus' : 'Add Custom Food'}</span>
                <ChevronDown className={`transition-transform duration-300 ${isCustomOpen ? 'rotate-180' : ''}`} size={16} />
              </button>
              
              {isCustomOpen && (
                <div className="p-8 border-t border-[var(--border-card)]/30 bg-[var(--bg-secondary)]/30 space-y-6 animate-in slide-in-from-top duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Nama Makanan' : 'Food Name'}</label>
                      <input 
                        type="text" 
                        value={customFood.name}
                        onChange={(e) => setCustomFood({...customFood, name: e.target.value})}
                        placeholder="Contoh: Sayur Sop Ceker"
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Pilih Kategori' : 'Select Category'}</label>
                        <select 
                          value={customFood.category}
                          onChange={(e) => setCustomFood({...customFood, category: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] cursor-pointer"
                        >
                          {dbCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Satuan' : 'Unit'}</label>
                        <select 
                          value={customFood.unit}
                          onChange={(e) => setCustomFood({...customFood, unit: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] cursor-pointer"
                        >
                          <option value="g">g</option>
                          <option value="ml">ml</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Kalori</label>
                      <input 
                        type="number" 
                        value={customFood.calories}
                        onChange={(e) => setCustomFood({...customFood, calories: Number(e.target.value)})}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Protein (g)</label>
                      <input 
                        type="number" 
                        value={customFood.protein}
                        onChange={(e) => setCustomFood({...customFood, protein: Number(e.target.value)})}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Karbo (g)</label>
                      <input 
                        type="number" 
                        value={customFood.carbs}
                        onChange={(e) => setCustomFood({...customFood, carbs: Number(e.target.value)})}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Lemak (g)</label>
                      <input 
                        type="number" 
                        value={customFood.fat}
                        onChange={(e) => setCustomFood({...customFood, fat: Number(e.target.value)})}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCustomFood}
                    className="w-full bg-[var(--primary-green)] text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md"
                  >
                    {language === 'id' ? 'Simpan Makanan Khusus' : 'Save Custom Food'}
                  </button>
                </div>
              )}
            </div>

            {/* Logged Foods List Table ("Makanan Anda") */}
            <div className="pt-8 border-t border-[var(--border-card)]/50 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-base font-black uppercase tracking-widest text-[var(--text-main)]">
                  {language === 'id' ? 'Makanan Anda' : 'Your Logged Foods'}
                </h3>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{language === 'id' ? 'Kategori Hidangan:' : 'Meal Category:'}</span>
                  <select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value)}
                    className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] cursor-pointer"
                  >
                    <option value="breakfast">{language === 'id' ? 'Sarapan' : 'Breakfast'}</option>
                    <option value="lunch">{language === 'id' ? 'Makan Siang' : 'Lunch'}</option>
                    <option value="dinner">{language === 'id' ? 'Makan Malam' : 'Dinner'}</option>
                    <option value="snack">{language === 'id' ? 'Cemilan' : 'Snacks'}</option>
                  </select>
                </div>
              </div>

              {loggedFoods.length === 0 ? (
                <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2rem] p-10 text-center text-xs font-bold text-[var(--text-muted)] border-dashed">
                  {language === 'id' ? 'Belum ada makanan yang ditambahkan. Silakan pilih dari menu di atas!' : 'No food added yet. Please choose from the list above!'}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Food Table */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2rem] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[var(--bg-secondary)]/50 border-b border-[var(--border-card)]/50 text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                            <th className="px-6 py-4">{language === 'id' ? 'Makanan' : 'Food'}</th>
                            <th className="px-6 py-4 text-center">{language === 'id' ? 'Jumlah' : 'Amount'}</th>
                            <th className="px-6 py-4 text-center">{language === 'id' ? 'Kalori' : 'Calories'}</th>
                            <th className="px-6 py-4 text-center">Protein</th>
                            <th className="px-6 py-4 text-center">Karbohidrat</th>
                            <th className="px-6 py-4 text-center">Lemak</th>
                            <th className="px-6 py-4 text-center">{language === 'id' ? 'Aksi' : 'Action'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-card)]/30 text-xs font-semibold text-[var(--text-main)]">
                          {loggedFoods.map((item, idx) => (
                            <tr key={idx} className="hover:bg-[var(--bg-secondary)]/30 transition-colors">
                              <td className="px-6 py-4 font-bold">{item.name}</td>
                              <td className="px-6 py-4 text-center">
                                <div className="inline-flex items-center gap-1.5 justify-center">
                                  <input 
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleUpdateLoggedQuantity(idx, Number(e.target.value))}
                                    className="w-16 bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-lg px-2 py-1 text-center font-black outline-none focus:border-[var(--primary-green)]"
                                    min="1"
                                  />
                                  <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider">{item.unit}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center text-emerald-500 font-black">{Math.round(item.calories)}</td>
                              <td className="px-6 py-4 text-center">{item.protein.toFixed(1)}g</td>
                              <td className="px-6 py-4 text-center">{item.carbs.toFixed(1)}g</td>
                              <td className="px-6 py-4 text-center">{item.fat.toFixed(1)}g</td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLoggedFood(idx)}
                                  className="text-rose-500 hover:text-rose-700 transition-colors text-xs font-black px-2"
                                  title="Remove item"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}
                          
                          {/* Totals Row */}
                          <tr className="bg-[var(--bg-secondary)]/50 font-black border-t border-[var(--border-card)]/50 text-[var(--text-main)] text-sm">
                            <td className="px-6 py-5 font-black uppercase tracking-wider text-xs">{language === 'id' ? 'Total' : 'Total'}</td>
                            <td className="px-6 py-5"></td>
                            <td className="px-6 py-5 text-center text-emerald-500 font-black">{Math.round(totals.calories)}</td>
                            <td className="px-6 py-5 text-center">{totals.protein.toFixed(1)}g</td>
                            <td className="px-6 py-5 text-center">{totals.carbs.toFixed(1)}g</td>
                            <td className="px-6 py-5 text-center">{totals.fat.toFixed(1)}g</td>
                            <td className="px-6 py-5"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Calculator Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAnalysisReport(true)}
                      className="bg-[var(--bg-card)] border border-[var(--primary-green)] text-[var(--primary-green)] py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[var(--primary-green)] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 group"
                    >
                      <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                      <span>{language === 'id' ? 'Analisis Gizi' : 'Nutrition Analysis'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAllLoggedFoods}
                      disabled={loading}
                      className="bg-[var(--primary-green)] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
                      <span>{language === 'id' ? 'Simpan Makanan' : 'Save Foods'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoggedFoods([])}
                      className="bg-transparent border border-rose-500/30 text-rose-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={14} />
                      <span>{language === 'id' ? 'Bersihkan Makanan' : 'Clear Foods'}</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

        {/* HIDE THE STANDARD SUBMIT BUTTON IF ACTIVE TAB IS MANUAL */}
        {activeTab !== 'manual' && (
          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[var(--primary-green)] to-[var(--secondary-green)] px-10 py-6 font-black text-[var(--bg-primary)] text-lg shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="h-6 w-6 rounded-full border-3 border-[var(--bg-primary)] border-t-transparent animate-spin"></div>
            ) : (
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            )}
            <span>
              {loading 
                ? (language === 'id' ? 'Menyimpan...' : 'Saving...') 
                : activeTab === 'camera'
                ? (language === 'id' ? 'Simpan Nutrisi Foto' : 'Save Photo Nutrition')
                : (language === 'id' ? 'Simpan Data Nutrisi' : 'Save Nutrition Data')}
            </span>
          </button>
        )}
      </form>

      {/* STUNNING VISUAL MATHEMATICAL ANALYSIS REPORT MODAL (USER FORMULAS!) */}
      {showAnalysisReport && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setShowAnalysisReport(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <XCircle size={24} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pr-8 text-left">
              <div className="p-3 bg-[var(--primary-green)] text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-[var(--text-main)]">
                  {language === 'id' ? 'Laporan Analisis Gizi Mandiri' : 'Self-Nutrition Analysis Report'}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">
                  {language === 'id' ? 'Kalkulator Energi & Makronutrisi Makanan' : 'Food Energy & Macronutrient Calculator'}
                </p>
              </div>
            </div>

            {/* Formula Explanation Banner */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-card)] rounded-2xl p-4 text-xs font-semibold text-[var(--text-muted)] space-y-1 text-left">
              <p className="font-extrabold text-[var(--text-main)] uppercase tracking-wider text-[10px] text-[var(--primary-green)] mb-1">
                ⚙️ {language === 'id' ? 'Metode Rumus Perhitungan Gizi' : 'Nutrition Formula Calculation Method'}
              </p>
              <p>• <strong>Protein (1g = 4 kcal)</strong> • <strong>Karbohidrat (1g = 4 kcal)</strong> • <strong>Lemak (1g = 9 kcal)</strong></p>
              <p>• <strong>Persentase Energi Makro</strong> = (Kalori Makronutrisi ÷ Total Kalori Hasil Hitung) × 100%</p>
            </div>

            {/* Calculated Values Dashboard */}
            {(() => {
              const r = calculateAnalysisReport();
              return (
                <div className="space-y-6 text-left">
                  {/* Energy Breakdown Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Protein */}
                    <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-card)] rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Protein ({totals.protein.toFixed(1)}g)</p>
                      <h4 className="text-xl font-black text-[var(--accent-blue)] mt-1">{Math.round(r.calProtein)} <span className="text-[10px] font-bold text-[var(--text-muted)]">kcal</span></h4>
                      <div className="mt-2 text-xs font-black text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 py-1 px-3 rounded-lg border border-[var(--accent-blue)]/20 w-fit mx-auto">
                        {r.proteinPct.toFixed(1)}% {language === 'id' ? 'Energi' : 'Energy'}
                      </div>
                    </div>
                    {/* Carbs */}
                    <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-card)] rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Karbohidrat ({totals.carbs.toFixed(1)}g)</p>
                      <h4 className="text-xl font-black text-[var(--warning)] mt-1">{Math.round(r.calCarbs)} <span className="text-[10px] font-bold text-[var(--text-muted)]">kcal</span></h4>
                      <div className="mt-2 text-xs font-black text-[var(--warning)] bg-[var(--warning)]/10 py-1 px-3 rounded-lg border border-[var(--warning)]/20 w-fit mx-auto">
                        {r.carbsPct.toFixed(1)}% {language === 'id' ? 'Energi' : 'Energy'}
                      </div>
                    </div>
                    {/* Fat */}
                    <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-card)] rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Lemak ({totals.fat.toFixed(1)}g)</p>
                      <h4 className="text-xl font-black text-[var(--danger)] mt-1">{Math.round(r.calFat)} <span className="text-[10px] font-bold text-[var(--text-muted)]">kcal</span></h4>
                      <div className="mt-2 text-xs font-black text-[var(--danger)] bg-[var(--danger)]/10 py-1 px-3 rounded-lg border border-[var(--danger)]/20 w-fit mx-auto">
                        {r.fatPct.toFixed(1)}% {language === 'id' ? 'Energi' : 'Energy'}
                      </div>
                    </div>
                  </div>

                  {/* Total Calories Box */}
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-card)] rounded-3xl p-6 text-center space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Total Kalori Hasil Rumus Makro' : 'Total Calories via Macro Formula'}</p>
                    <h2 className="text-3xl font-black text-[var(--primary-green)]">{Math.round(r.calculatedTotalCalories)} <span className="text-sm font-bold text-[var(--text-muted)]">kcal / Kalori</span></h2>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      {language === 'id' ? `(Jumlah dari: ${Math.round(r.calProtein)} Protein + ${Math.round(r.calCarbs)} Karbo + ${Math.round(r.calFat)} Lemak)` : `(Sum of: ${Math.round(r.calProtein)} Protein + ${Math.round(r.calCarbs)} Carbs + ${Math.round(r.calFat)} Fat)`}
                    </p>
                  </div>

                  {/* Visual Energy Stacked Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                      <span>{language === 'id' ? 'Distribusi Kontribusi Energi' : 'Energy Contribution Distribution'}</span>
                      <span>Total 100%</span>
                    </div>
                    <div className="h-6 w-full rounded-full overflow-hidden flex border border-[var(--border-card)] shadow-inner">
                      <div style={{ width: `${r.proteinPct}%` }} className="bg-[var(--accent-blue)] h-full transition-all duration-500" title={`Protein: ${r.proteinPct.toFixed(1)}%`} />
                      <div style={{ width: `${r.carbsPct}%` }} className="bg-[var(--warning)] h-full transition-all duration-500" title={`Karbohidrat: ${r.carbsPct.toFixed(1)}%`} />
                      <div style={{ width: `${r.fatPct}%` }} className="bg-[var(--danger)] h-full transition-all duration-500" title={`Lemak: ${r.fatPct.toFixed(1)}%`} />
                    </div>
                    <div className="flex justify-center gap-6 text-[10px] font-bold text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[var(--accent-blue)]" /> Protein ({r.proteinPct.toFixed(1)}%)</span>
                      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[var(--warning)]" /> Karbo ({r.carbsPct.toFixed(1)}%)</span>
                      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[var(--danger)]" /> Lemak ({r.fatPct.toFixed(1)}%)</span>
                    </div>
                  </div>

                  {/* AI Evaluation / Recommendation Card */}
                  <div className={`border rounded-3xl p-6 relative overflow-hidden group border-current bg-current/5 ${r.badgeColor}`}>
                    <div className="flex items-center gap-2 mb-2 font-black text-[10px] uppercase tracking-[0.2em]">
                      <Sparkles size={12} className="animate-pulse" />
                      <span>{language === 'id' ? 'Rekomendasi Diet Personal' : 'Personal Diet Recommendation'}</span>
                    </div>
                    <h4 className="font-extrabold text-sm uppercase tracking-wide">{r.adviceTitle}</h4>
                    <p className="text-xs leading-relaxed font-semibold mt-1.5 text-[var(--text-muted)]">
                      {r.adviceText}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await handleSaveAllLoggedFoods();
                        setShowAnalysisReport(false);
                      }}
                      className="flex-grow bg-[var(--primary-green)] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={14} />
                      <span>{language === 'id' ? 'Simpan & Tutup' : 'Save & Close'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAnalysisReport(false)}
                      className="flex-grow bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-main)] py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[var(--bg-primary)] transition-all flex items-center justify-center gap-2"
                    >
                      {language === 'id' ? 'Kembali Edit Makanan' : 'Back to Editing'}
                    </button>
                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      )}
    </div>
  );
};

export default FoodForm;
