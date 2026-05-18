import React, { useEffect, useRef, useState } from 'react';
import { Plus, Search, MessageSquare, List, Brain, Sparkles, Camera, Upload, Trash2, RotateCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { useNutrition } from '../context/useNutrition';
import { useNotification } from '../context/useNotification';

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

const formatFoodPortion = (food) => {
  if (food?.portion) {
    return food.portion;
  }

  if (food?.quantity && food?.unit) {
    return `${food.quantity} ${food.unit}`;
  }

  return '1 portion';
};

const FoodForm = ({ onAddFood, submitLabel = 'Add Food' }) => {
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
  const [manualData, setManualData] = useState({
    foodName: '',
    quantity: 1,
    unit: 'portion',
    mealType: 'breakfast'
  });
  
  // Camera & Upload States
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // default to back camera
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const { predictNutrition, predictNutritionImage } = useNutrition();

  // Stop camera stream when leaving tab or unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    stopCamera();
    try {
      const constraints = {
        video: { facingMode: facingMode }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access failed:", err);
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
        startCamera();
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
      setPredictionResult(null); // Reset previous results
      setPredictionError('');
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
      if (activeTab === 'manual') {
        const manualFinalData = {
          food_name: manualData.foodName,
          meal_type: manualData.mealType,
          quantity: Number(manualData.quantity),
          unit: manualData.unit,
          calories: 0, 
          protein: 0,
          carbs: 0,
          fat: 0
        };
        await onAddFood(manualFinalData);
        notify({ type: 'success', title: language === 'id' ? 'Data Tersimpan' : 'Data Saved', message: language === 'id' ? 'Makanan berhasil ditambahkan secara manual!' : 'Food added manually successfully!' });
      } else if (activeTab === 'camera') {
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
          unit: 'portion'
        };

        await onAddFood(finalData);

        setSelectedImage(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
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

  const foods = predictionResult?.foods ?? [];
  const totalQuantity = predictionResult?.parsed_data?.total_nutrition?.quantity_grams ?? 0;
  const canSubmit = activeTab === 'manual' 
    ? manualData.foodName.trim().length > 0 
    : activeTab === 'camera'
    ? (selectedImage !== null && predictionResult !== null && !predicting)
    : (story.trim().length > 0 && !predicting);

  return (
    <div className="space-y-8">
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

        {activeTab === 'camera' && (
          <div className="space-y-6">
            <div>
              <label className="mb-4 block text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {language === 'id' ? 'Ambil Foto Makanan atau Unggah Gambar' : 'Take Food Photo or Upload Image'}
              </label>
              
              <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border-card)] bg-[var(--bg-primary)] min-h-[320px] flex flex-col items-center justify-center p-6 text-center transition-all">
                
                {/* 1. Camera Active Streaming View */}
                {isCameraActive && (
                  <div className="absolute inset-0 w-full h-full bg-black flex flex-col items-center justify-center">
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover max-h-[400px]"
                      playsInline 
                      muted
                    />
                    
                    {/* Mirroring style for user camera */}
                    <style>{`
                      video {
                        transform: ${facingMode === 'user' ? 'scaleX(-1)' : 'none'};
                      }
                    `}</style>
                    
                    {/* Overlay Camera Controls */}
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

                {/* 2. Photo Preview Selected View */}
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

                {/* 3. Empty Camera Options View */}
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

              {/* Analyze trigger button */}
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

        {activeTab === 'manual' && (
          <div className="space-y-8 p-6 bg-[var(--bg-secondary)] rounded-[2.5rem] border border-[var(--border-card)] animate-in slide-in-from-bottom duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">{language === 'id' ? 'Nama Makanan' : 'Food Name'}</label>
                <input 
                  type="text"
                  value={manualData.foodName}
                  onChange={(e) => setManualData({...manualData, foodName: e.target.value})}
                  placeholder={language === 'id' ? 'Contoh: Telur Goreng' : 'Example: Fried Egg'}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-6 py-4 text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
                  required={activeTab === 'manual'}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">{language === 'id' ? 'Waktu Makan' : 'Meal Time'}</label>
                <select 
                  value={manualData.mealType}
                  onChange={(e) => setManualData({...manualData, mealType: e.target.value})}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-6 py-4 text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] appearance-none cursor-pointer"
                >
                  {mealTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">{language === 'id' ? 'Jumlah' : 'Quantity'}</label>
                <input 
                  type="number"
                  value={manualData.quantity}
                  onChange={(e) => setManualData({...manualData, quantity: e.target.value})}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-6 py-4 text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
                  min="0.1"
                  step="0.1"
                  required={activeTab === 'manual'}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">{language === 'id' ? 'Satuan' : 'Unit'}</label>
                <select 
                  value={manualData.unit}
                  onChange={(e) => setManualData({...manualData, unit: e.target.value})}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-6 py-4 text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] appearance-none cursor-pointer"
                >
                  <option value="portion">{language === 'id' ? 'Porsi' : 'Portion'}</option>
                  <option value="item">{language === 'id' ? 'Potong/Biji' : 'Item/Piece'}</option>
                  <option value="gram">{language === 'id' ? 'Gram' : 'Grams'}</option>
                  <option value="ml">Ml</option>
                </select>
              </div>
            </div>
          </div>
        )}

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
              : activeTab === 'manual'
              ? (language === 'id' ? 'Tambah Makanan' : 'Add Food') 
              : activeTab === 'camera'
              ? (language === 'id' ? 'Simpan Nutrisi Foto' : 'Save Photo Nutrition')
              : (language === 'id' ? 'Simpan Data Nutrisi' : 'Save Nutrition Data')}
          </span>
        </button>
      </form>
    </div>
  );
};

export default FoodForm;

