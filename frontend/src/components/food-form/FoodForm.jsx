import React, { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../constants/translations';
import { useNutrition } from '../../context/useNutrition';
import { useNotification } from '../../context/useNotification';
import { categoryService } from '../../services/categoryService';

// Child components
import FoodCameraTab from './FoodCameraTab';
import NutritionReportModal from './NutritionReportModal';
import ManualOverrideModal from './ManualOverrideModal';

const getMealTypes = (language) => [
  { value: 'breakfast', label: language === 'id' ? 'Sarapan' : 'Breakfast' },
  { value: 'lunch', label: language === 'id' ? 'Makan Siang' : 'Lunch' },
  { value: 'dinner', label: language === 'id' ? 'Makan Malam' : 'Dinner' },
  { value: 'snack', label: language === 'id' ? 'Cemilan' : 'Snack' }
];

const getDefaultMealType = () => {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 11) return 'breakfast';
  if (hours >= 11 && hours < 15) return 'lunch';
  if (hours >= 15 && hours < 18) return 'snack';
  if (hours >= 18 && hours < 24) return 'dinner';
  return 'snack';
};

const FoodForm = ({ onAddFood }) => {
  const { notify } = useNotification();
  const { language } = useLanguage();
  const t = translations[language];
  const mealTypes = getMealTypes(language);
  
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState('');
  
  // Manual Override States
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [overrideData, setOverrideData] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  
  // Camera States
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Nutrition Calculator States
  const [dbCategories, setDbCategories] = useState([]);
  const [dbFoods, setDbFoods] = useState([]);
  const [customFoodsList, setCustomFoodsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [foodPortions, setFoodPortions] = useState({});
  const [loggedFoods, setLoggedFoods] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState(getDefaultMealType());
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAnalysisReport, setShowAnalysisReport] = useState(false);
  const [reportedIncorrect, setReportedIncorrect] = useState(false);
  const [reportingIncorrect, setReportingIncorrect] = useState(false);
  
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

  const { predictNutritionImage, refreshHistory, reportIncorrectPrediction } = useNutrition();

  // Fetch Categories from Backend Dataset on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await categoryService.getAllCategories();
        setDbCategories(cats || []);
        if (cats && cats.length > 0) {
          setCustomFood(prev => ({ ...prev, category: cats[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch database categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Foods from Backend Dataset Dynamically when Query/Filter changes (Debounced)
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        if (selectedCategory !== 'semua') {
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
          const query = searchQuery.trim();
          const foods = await categoryService.searchFoods(query);
          setDbFoods(foods || []);
        }
      } catch (err) {
        console.error("Failed to query foods database:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchFoods();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
    setReportedIncorrect(false);
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
    setReportedIncorrect(false);

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

  const handleReportIncorrect = async () => {
    setReportingIncorrect(true);
    try {
      const imageUrl = previewUrl || imageBase64 || "";
      const predictedClass = predictionResult.food_name || "Unknown";
      await reportIncorrectPrediction(imageUrl, predictedClass);
      setReportedIncorrect(true);
      notify({
        type: 'success',
        title: language === 'id' ? 'Laporan Dikirim' : 'Report Sent',
        message: language === 'id' 
          ? 'Terima kasih! Umpan balik Anda membantu kami melatih ulang model AI.' 
          : 'Thank you! Your feedback helps us retrain the AI model.'
      });
    } catch (err) {
      console.error("Gagal melapor salah prediksi:", err);
    } finally {
      setReportingIncorrect(false);
    }
  };

  const handleSaveOverride = () => {
    setPredictionResult({
      ...predictionResult,
      food_name: overrideData.foodName,
      calories: parseFloat(overrideData.calories) || 0,
      protein: parseFloat(overrideData.protein) || 0,
      carbs: parseFloat(overrideData.carbs) || 0,
      fat: parseFloat(overrideData.fat) || 0,
      is_overridden: true
    });
    setIsOverrideOpen(false);
    notify({
      type: 'success',
      title: language === 'id' ? 'Koreksi Berhasil' : 'Corrected Successfully',
      message: language === 'id' ? 'Data makanan berhasil diperbarui secara manual!' : 'Food entry updated manually successfully!'
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
      notify({
        type: 'error',
        title: language === 'id' ? 'Gagal Menyimpan' : 'Failed to Save',
        message: err.message || (language === 'id' ? 'Terjadi kesalahan saat menyimpan makanan Anda.' : 'An error occurred while saving your foods.')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!predictionResult) {
        notify({ type: 'warning', title: language === 'id' ? 'Belum Dianalisis' : 'Not Analyzed', message: language === 'id' ? 'Silakan analisis gambar makanan terlebih dahulu.' : 'Please analyze the food image first.' });
        setLoading(false);
        return;
      }

      const finalData = {
        food_name: predictionResult.food_name || (predictionResult.foods && predictionResult.foods.length > 0 ? predictionResult.foods.map(f => f.name).join(', ') : (language === 'id' ? 'Makanan dari Foto' : 'Food from Photo')),
        meal_type: selectedMealType,
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
    } catch (error) {
      console.error('Error adding food:', error);
      notify({ type: 'error', title: language === 'id' ? 'Gagal Menyimpan' : 'Save Failed', message: (language === 'id' ? 'Gagal menambahkan data: ' : 'Failed to add data: ') + (error.message || (language === 'id' ? 'Coba lagi.' : 'Try again.')) });
    }

    setLoading(false);
  };

  // Calculations for calculator totals
  const totals = loggedFoods.reduce((acc, curr) => ({
    calories: acc.calories + curr.calories,
    protein: acc.protein + curr.protein,
    carbs: acc.carbs + curr.carbs,
    fat: acc.fat + curr.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const canSubmit = selectedImage !== null && predictionResult !== null && !predicting;

  return (
    <div className="space-y-8 relative">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-6 md:right-10 z-[200] bg-[var(--text-main)] text-[var(--bg-primary)] px-6 py-4 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <span className="uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* AI CAMERA (Exclusively used) */}
        <FoodCameraTab
          isCameraActive={isCameraActive}
          facingMode={facingMode}
          videoRef={videoRef}
          toggleCameraFacing={toggleCameraFacing}
          capturePhoto={capturePhoto}
          stopCamera={stopCamera}
          previewUrl={previewUrl}
          removeSelectedImage={removeSelectedImage}
          startCamera={startCamera}
          handleFileChange={handleFileChange}
          predicting={predicting}
          handleAnalyzeImageAI={handleAnalyzeImageAI}
          predictionError={predictionError}
          predictionResult={predictionResult}
          setOverrideData={setOverrideData}
          setIsOverrideOpen={setIsOverrideOpen}
          selectedMealType={selectedMealType}
          setSelectedMealType={setSelectedMealType}
          mealTypes={mealTypes}
          reportedIncorrect={reportedIncorrect}
          reportingIncorrect={reportingIncorrect}
          handleReportIncorrect={handleReportIncorrect}
          language={language}
          t={t}
        />

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
              : (language === 'id' ? 'Simpan Gizi Makanan' : 'Save Food Nutrition')}
          </span>
        </button>
      </form>

      {/* Modal 1: Nutrition Calculator Analytical Report */}
      <NutritionReportModal
        isOpen={showAnalysisReport}
        onClose={() => setShowAnalysisReport(false)}
        totals={totals}
        loggedFoods={loggedFoods}
        language={language}
        handleSaveAllLoggedFoods={handleSaveAllLoggedFoods}
        calculateAnalysisReport={calculateAnalysisReport}
      />

      {/* Modal 2: Manual Override Correction */}
      <ManualOverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        overrideData={overrideData}
        setOverrideData={setOverrideData}
        handleSaveOverride={handleSaveOverride}
        language={language}
      />
    </div>
  );
};

export default FoodForm;

