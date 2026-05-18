import React, { useEffect, useRef, useState } from 'react';
import { 
  Plus, Search, MessageSquare, List, Brain, Sparkles, Camera, Upload, 
  Trash2, RotateCw, CheckCircle2, ChevronDown, Filter, HelpCircle, XCircle 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { useNutrition } from '../context/useNutrition';
import { useNotification } from '../context/useNotification';

const FOOD_DATABASE = [
  { id: 'dada-ayam', name: 'Dada Ayam (dimasak)', category: 'protein', categoryLabelId: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, baseServing: 100, unit: 'g' },
  { id: 'salmon', name: 'Salmon, Atlantik (dimasak)', category: 'protein', categoryLabelId: 'Protein', calories: 206, protein: 22.1, carbs: 0, fat: 12.4, baseServing: 100, unit: 'g' },
  { id: 'daging-sapi', name: 'Daging Sapi Giling (85% tanpa lemak, dimasak)', category: 'protein', categoryLabelId: 'Protein', calories: 218, protein: 24.2, carbs: 0, fat: 13, baseServing: 100, unit: 'g' },
  { id: 'tahu', name: 'Tahu, keras', category: 'protein', categoryLabelId: 'Protein', calories: 76, protein: 8, carbs: 2, fat: 4.2, baseServing: 100, unit: 'g' },
  { id: 'telur', name: 'Telur (utuh, besar)', category: 'protein', categoryLabelId: 'Protein', calories: 72, protein: 6.3, carbs: 0.4, fat: 5, baseServing: 50, unit: 'g' },
  { id: 'lentil', name: 'Lentil (dimasak)', category: 'protein', categoryLabelId: 'Protein', calories: 116, protein: 9, carbs: 20, fat: 0.4, baseServing: 100, unit: 'g' },
  { id: 'nasi-merah', name: 'Nasi Merah (dimasak)', category: 'biji-bijian', categoryLabelId: 'Biji-bijian', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, baseServing: 100, unit: 'g' },
  { id: 'nasi-putih', name: 'Nasi Putih (dimasak)', category: 'biji-bijian', categoryLabelId: 'Biji-bijian', calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, baseServing: 100, unit: 'g' },
  { id: 'quinoa', name: 'Quinoa (dimasak)', category: 'biji-bijian', categoryLabelId: 'Biji-bijian', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, baseServing: 100, unit: 'g' },
  { id: 'roti-gandum', name: 'Roti Gandum Utuh', category: 'biji-bijian', categoryLabelId: 'Biji-bijian', calories: 247, protein: 10.5, carbs: 46, fat: 3.4, baseServing: 100, unit: 'g' },
  { id: 'roti-putih', name: 'Roti Putih', category: 'biji-bijian', categoryLabelId: 'Biji-bijian', calories: 266, protein: 8.2, carbs: 49.2, fat: 3.2, baseServing: 100, unit: 'g' },
  { id: 'pasta', name: 'Pasta (dimasak)', category: 'biji-bijian', categoryLabelId: 'Biji-bijian', calories: 158, protein: 5.8, carbs: 31, fat: 0.9, baseServing: 100, unit: 'g' },
  { id: 'brokoli', name: 'Brokoli (dimasak)', category: 'sayuran', categoryLabelId: 'Sayuran', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, baseServing: 100, unit: 'g' },
  { id: 'bayam', name: 'Bayam (dimasak)', category: 'sayuran', categoryLabelId: 'Sayuran', calories: 23, protein: 2.9, carbs: 3.8, fat: 0.4, baseServing: 100, unit: 'g' },
  { id: 'wortel', name: 'Wortel (dimasak)', category: 'sayuran', categoryLabelId: 'Sayuran', calories: 35, protein: 0.8, carbs: 8.2, fat: 0.2, baseServing: 100, unit: 'g' },
  { id: 'ubi-jalar', name: 'Ubi Jalar (panggang)', category: 'sayuran', categoryLabelId: 'Sayuran', calories: 90, protein: 2, carbs: 20.7, fat: 0.2, baseServing: 100, unit: 'g' },
  { id: 'tomat', name: 'Tomat (mentah)', category: 'sayuran', categoryLabelId: 'Sayuran', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, baseServing: 100, unit: 'g' },
  { id: 'paprika', name: 'Paprika (mentah)', category: 'sayuran', categoryLabelId: 'Sayuran', calories: 31, protein: 1, carbs: 6, fat: 0.3, baseServing: 100, unit: 'g' },
  { id: 'apel', name: 'Apel (dengan kulit)', category: 'buah-buahan', categoryLabelId: 'Buah-buahan', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, baseServing: 100, unit: 'g' },
  { id: 'pisang', name: 'Pisang', category: 'buah-buahan', categoryLabelId: 'Buah-buahan', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, baseServing: 100, unit: 'g' },
  { id: 'jeruk', name: 'Jeruk', category: 'buah-buahan', categoryLabelId: 'Buah-buahan', calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, baseServing: 100, unit: 'g' },
  { id: 'berries', name: 'Campuran Berries', category: 'buah-buahan', categoryLabelId: 'Buah-buahan', calories: 57, protein: 0.7, carbs: 13.8, fat: 0.3, baseServing: 100, unit: 'g' },
  { id: 'alpukat', name: 'Alpukat', category: 'buah-buahan', categoryLabelId: 'Buah-buahan', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, baseServing: 100, unit: 'g' },
  { id: 'susu', name: 'Susu (utuh)', category: 'produk-susu', categoryLabelId: 'Produk Susu', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, baseServing: 100, unit: 'ml' },
  { id: 'keju', name: 'Keju Cheddar', category: 'produk-susu', categoryLabelId: 'Produk Susu', calories: 403, protein: 24.9, carbs: 1.3, fat: 33.1, baseServing: 100, unit: 'g' },
  { id: 'yogurt', name: 'Yogurt Yunani (plain)', category: 'produk-susu', categoryLabelId: 'Produk Susu', calories: 59, protein: 10.2, carbs: 3.6, fat: 0.4, baseServing: 100, unit: 'g' },
  { id: 'minyak-zaitun', name: 'Minyak Zaitun', category: 'lemak-minyak', categoryLabelId: 'Lemak & Minyak', calories: 884, protein: 0, carbs: 0, fat: 100, baseServing: 100, unit: 'ml' },
  { id: 'mentega', name: 'Mentega', category: 'lemak-minyak', categoryLabelId: 'Lemak & Minyak', calories: 717, protein: 0.9, carbs: 0.1, fat: 81.1, baseServing: 100, unit: 'g' },
  { id: 'almond', name: 'Almond', category: 'lemak-minyak', categoryLabelId: 'Lemak & Minyak', calories: 579, protein: 21.2, carbs: 21.7, fat: 49.9, baseServing: 100, unit: 'g' },
  { id: 'air', name: 'Air', category: 'minuman', categoryLabelId: 'Minuman', calories: 0, protein: 0, carbs: 0, fat: 0, baseServing: 100, unit: 'ml' },
  { id: 'jus-jeruk', name: 'Jus Jeruk', category: 'minuman', categoryLabelId: 'Minuman', calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2, baseServing: 100, unit: 'ml' },
  { id: 'kopi', name: 'Kopi (hitam)', category: 'minuman', categoryLabelId: 'Minuman', calories: 1, protein: 0.1, carbs: 0, fat: 0, baseServing: 100, unit: 'ml' }
];

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

  // Nutrition Calculator (Mockup Manual) States
  const [foodDatabaseState, setFoodDatabaseState] = useState(FOOD_DATABASE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [foodPortions, setFoodPortions] = useState({});
  const [loggedFoods, setLoggedFoods] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [customFood, setCustomFood] = useState({
    name: '',
    category: 'protein',
    calories: 100,
    protein: 10,
    carbs: 10,
    fat: 5,
    baseServing: 100,
    unit: 'g'
  });

  const { predictNutrition, predictNutritionImage } = useNutrition();

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

  // --- MANUAL CALCULATOR HANDLERS ---
  const handlePortionChange = (foodId, val) => {
    setFoodPortions({
      ...foodPortions,
      [foodId]: val
    });
  };

  const handleAddLoggedFood = (food, portion) => {
    const scale = portion / food.baseServing;
    const newEntry = {
      id: food.id,
      name: food.name,
      quantity: portion,
      unit: food.unit,
      calories: food.calories * scale,
      protein: food.protein * scale,
      carbs: food.carbs * scale,
      fat: food.fat * scale,
      mealType: selectedMealType,
      baseFood: food
    };
    setLoggedFoods([...loggedFoods, newEntry]);
    showToast(language === 'id' ? `${food.name} ditambahkan!` : `${food.name} added!`);
  };

  const handleUpdateLoggedQuantity = (idx, newQty) => {
    if (newQty < 1) return;
    const updated = [...loggedFoods];
    const item = updated[idx];
    const scale = newQty / item.baseFood.baseServing;

    item.quantity = newQty;
    item.calories = item.baseFood.calories * scale;
    item.protein = item.baseFood.protein * scale;
    item.carbs = item.baseFood.carbs * scale;
    item.fat = item.baseFood.fat * scale;

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

    const newFood = {
      id: `custom-${Date.now()}`,
      name: customFood.name,
      category: customFood.category,
      categoryLabelId: customFood.category.charAt(0).toUpperCase() + customFood.category.slice(1),
      calories: Number(customFood.calories),
      protein: Number(customFood.protein),
      carbs: Number(customFood.carbs),
      fat: Number(customFood.fat),
      baseServing: Number(customFood.baseServing),
      unit: customFood.unit
    };

    setFoodDatabaseState([newFood, ...foodDatabaseState]);
    setIsCustomOpen(false);
    setCustomFood({
      name: '',
      category: 'protein',
      calories: 100,
      protein: 10,
      carbs: 10,
      fat: 5,
      baseServing: 100,
      unit: 'g'
    });
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
          unit: item.unit,
          calories: Number(item.calories),
          protein: Number(item.protein),
          carbs: Number(item.carbs),
          fat: Number(item.fat)
        };
        await onAddFood(payload);
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

  // Filtering for pre-defined foods list
  const filteredFoods = foodDatabaseState.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const foods = predictionResult?.foods ?? [];
  const totalQuantity = predictionResult?.parsed_data?.total_nutrition?.quantity_grams ?? 0;
  const canSubmit = activeTab === 'camera'
    ? (selectedImage !== null && predictionResult !== null && !predicting)
    : (story.trim().length > 0 && !predicting);

  return (
    <div className="space-y-8 relative">
      
      {/* Toast notification inside FoodForm */}
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

        {/* TAB 3: RICH MANUAL NUTRITION CALCULATOR (MATCHING USER MOCKUP!) */}
        {activeTab === 'manual' && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500 text-left">
            
            {/* Header Text */}
            <div className="border-b border-[var(--border-card)]/40 pb-4">
              <h3 className="text-lg font-black text-[var(--text-main)] uppercase tracking-wider">{language === 'id' ? 'Tambahkan Makanan Anda' : 'Add Your Foods'}</h3>
              <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">{language === 'id' ? 'Pilih porsi makanan dari katalog kami atau tambahkan makanan khusus.' : 'Select food portion from our catalog or define custom foods.'}</p>
            </div>

            {/* Search and Category Filter Section */}
            <div className="space-y-4 bg-[var(--bg-secondary)]/50 p-6 rounded-3xl border border-[var(--border-card)]">
              {/* Search input with button */}
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'id' ? 'Cari makanan (nasi, ayam, apel...)' : 'Search food (rice, chicken, apple...)'}
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
                  {[
                    { id: 'semua', label: language === 'id' ? 'Semua' : 'All' },
                    { id: 'protein', label: 'Protein' },
                    { id: 'biji-bijian', label: language === 'id' ? 'Biji-bijian' : 'Grains' },
                    { id: 'sayuran', label: language === 'id' ? 'Sayuran' : 'Vegetables' },
                    { id: 'buah-buahan', label: language === 'id' ? 'Buah-buahan' : 'Fruits' },
                    { id: 'produk-susu', label: language === 'id' ? 'Produk Susu' : 'Dairy' },
                    { id: 'lemak-minyak', label: language === 'id' ? 'Lemak & Minyak' : 'Fats & Oils' },
                    { id: 'minuman', label: language === 'id' ? 'Minuman' : 'Drinks' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                        selectedCategory === cat.id 
                          ? 'bg-[var(--primary-green)] text-white border-transparent shadow-md' 
                          : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-card)] hover:text-[var(--text-main)] hover:border-[var(--primary-green)]/30'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Catalog Grid View with Portions input (Scrollbar style) */}
            <div className="max-h-[420px] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 border border-[var(--border-card)]/30 rounded-[2rem] p-4 bg-[var(--bg-primary)] shadow-inner">
              {filteredFoods.map(food => {
                const portion = foodPortions[food.id] || food.baseServing;
                return (
                  <div key={food.id} className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 shadow-sm space-y-4 hover:border-[var(--primary-green)]/35 transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-sm text-[var(--text-main)]">{food.name}</h4>
                        <span className="inline-block mt-1.5 text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-md border border-[var(--border-card)]">{food.categoryLabelId}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-center bg-[var(--bg-secondary)]/40 rounded-xl py-3 px-2">
                      <div>
                        <p className="text-[11px] font-black text-[var(--primary-green)]">{food.calories}</p>
                        <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">kalori</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-[var(--accent-blue)]">{food.protein}g</p>
                        <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">protein</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-[var(--warning)]">{food.carbs}g</p>
                        <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">karbo</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-[var(--danger)]">{food.fat}g</p>
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
                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">{food.unit}</span>
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
              })}
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
                        placeholder="Contoh: Sayur Sop"
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Porsi Takaran' : 'Serving Size'}</label>
                        <input 
                          type="number" 
                          value={customFood.baseServing}
                          onChange={(e) => setCustomFood({...customFood, baseServing: Number(e.target.value)})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
                        />
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
                          <option value="serving">serving</option>
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
                      onClick={handleAnalyzeLoggedAI}
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
    </div>
  );
};

export default FoodForm;
