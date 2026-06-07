import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, AlertTriangle, Target, Zap, Waves, Sparkles, Loader2 } from 'lucide-react';
import { useNutrition } from '../../context/useNutrition';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/useAuth';
import { useNotification } from '../../context/useNotification';
import { translations } from '../../constants/translations';
import { nutritionService } from '../../services/nutritionService';

const getIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'protein': return Target;
    case 'fiber': return Waves;
    case 'iron': return AlertTriangle;
    case 'energy': return Zap;
    case 'calcium': return CheckCircle;
    default: return Lightbulb;
  }
};

const getStyle = (priority) => {
  switch (priority) {
    case 'high': return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' };
    case 'medium': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
    case 'low': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    default: return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
  }
};

const getLocalRecommendations = (bmi, language) => {
  const isIndo = language === 'id';
  if (bmi <= 0) {
    return [
      {
        priority: 'medium',
        type: 'energy',
        title: isIndo ? 'Nutrisi Seimbang Harian' : 'Balanced Daily Nutrition',
        message: isIndo 
          ? 'Pertahankan pola makan kaya nutrisi dengan porsi makro seimbang. Pastikan kebutuhan air harian Anda terpenuhi sebanyak 2-3 liter.' 
          : 'Maintain a nutrient-rich diet with balanced macro portions. Ensure your daily water intake of 2-3 liters is met.',
        foods: isIndo ? ['Nasi Merah', 'Dada Ayam', 'Brokoli', 'Apel'] : ['Brown Rice', 'Chicken Breast', 'Broccoli', 'Apple']
      },
      {
        priority: 'low',
        type: 'protein',
        title: isIndo ? 'Optimalkan Protein' : 'Optimize Protein',
        message: isIndo 
          ? 'Konsumsi sumber protein berkualitas tinggi di setiap sesi makan untuk membantu regenerasi jaringan sel dan menjaga massa otot.' 
          : 'Consume high-quality protein sources in every meal session to aid cell tissue regeneration and maintain muscle mass.',
        foods: isIndo ? ['Telur Rebus', 'Tahu', 'Tempe', 'Ikan Kembung'] : ['Boiled Eggs', 'Tofu', 'Tempeh', 'Mackerel']
      }
    ];
  }

  if (bmi < 18.5) {
    return [
      {
        priority: 'high',
        type: 'protein',
        title: isIndo ? 'Surplus Kalori Sehat (Massa Otot)' : 'Healthy Caloric Surplus (Muscle Mass)',
        message: isIndo 
          ? 'Tubuh Anda terdeteksi underweight. Fokuslah pada makanan padat nutrisi tinggi kalori dan protein berkualitas tinggi untuk membantu meningkatkan berat badan secara aman dan membangun massa otot.' 
          : 'Your body is detected as underweight. Focus on high-calorie, nutrient-dense foods and high-quality protein to help gain weight safely and build muscle mass.',
        foods: isIndo ? ['Susu Full Cream', 'Daging Sapi', 'Alpukat', 'Kacang Almond', 'Telur'] : ['Full Cream Milk', 'Beef', 'Avocado', 'Almonds', 'Eggs']
      },
      {
        priority: 'medium',
        type: 'energy',
        title: isIndo ? 'Karbohidrat Kompleks Tambahan' : 'Additional Complex Carbs',
        message: isIndo 
          ? 'Tambahkan porsi karbohidrat kompleks di sela waktu makan utama untuk menjaga suplai energi harian agar tetap optimal.' 
          : 'Add complex carbohydrate portions between main meals to keep daily energy supply optimal.',
        foods: isIndo ? ['Kentang Panggang', 'Pisang', 'Oatmeal', 'Madu'] : ['Baked Potatoes', 'Bananas', 'Oatmeal', 'Honey']
      }
    ];
  } else if (bmi >= 18.5 && bmi < 25) {
    return [
      {
        priority: 'low',
        type: 'calcium',
        title: isIndo ? 'Pertahankan Berat Badan Ideal' : 'Maintain Ideal Weight',
        message: isIndo 
          ? 'Nilai BMI Anda berada dalam batas normal. Lanjutkan pola makan seimbang 3 kali sehari dengan porsi sayuran hijau dan serat larut yang cukup.' 
          : 'Your BMI value is within normal limits. Continue a balanced diet 3 times a day with sufficient green vegetables and soluble fiber.',
        foods: isIndo ? ['Salad Sayur', 'Ikan Salmon', 'Yoghurt Plain', 'Minyak Zaitun'] : ['Vegetable Salad', 'Salmon', 'Plain Yogurt', 'Olive Oil']
      },
      {
        priority: 'low',
        type: 'fiber',
        title: isIndo ? 'Hidrasi & Detoksifikasi Alami' : 'Hydration & Natural Detox',
        message: isIndo 
          ? 'Pastikan konsumsi cairan stabil sepanjang hari untuk mendukung kelancaran sistem pencernaan dan metabolisme tubuh.' 
          : 'Ensure stable fluid consumption throughout the day to support the smooth function of digestive and metabolic systems.',
        foods: isIndo ? ['Air Kelapa', 'Semangka', 'Teh Hijau', 'Lemon'] : ['Coconut Water', 'Watermelon', 'Green Tea', 'Lemon']
      }
    ];
  } else {
    return [
      {
        priority: 'high',
        type: 'fiber',
        title: isIndo ? 'Defisit Kalori & Tinggi Serat' : 'Calorie Deficit & High Fiber',
        message: isIndo 
          ? 'Tubuh Anda berada di kategori overweight/obesitas. Batasi asupan lemak jenuh dan karbohidrat olahan. Perbanyak sayuran tinggi serat untuk memberikan rasa kenyang lebih lama.' 
          : 'Your body is in the overweight/obesity category. Limit saturated fats and refined carbs. Increase high-fiber vegetables to keep you full longer.',
        foods: isIndo ? ['Kembang Kol', 'Bayam', 'Apel Hijau', 'Dada Ayam Fillet'] : ['Cauliflower', 'Spinach', 'Green Apple', 'Chicken Breast Fillet']
      },
      {
        priority: 'medium',
        type: 'iron',
        title: isIndo ? 'Kontrol Porsi & Hidrasi Sebelum Makan' : 'Portion Control & Hydration Before Meals',
        message: isIndo 
          ? 'Minumlah satu gelas air putih 15 menit sebelum makan untuk membantu mengontrol porsi makan berlebih secara alami.' 
          : 'Drink a glass of water 15 minutes before meals to help control overeating naturally.',
        foods: isIndo ? ['Air Putih', 'Mentimun', 'Buah Pir'] : ['Water', 'Cucumber', 'Pear']
      }
    ];
  }
};

const RecommendationList = () => {
  const { nutritionData, profile } = useNutrition();
  const { user } = useAuth();
  const { notify } = useNotification();
  const { language } = useLanguage();
  const t = translations[language];

  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Sync dengan rekomendasi AI awal jika sudah tersimpan di context
  useEffect(() => {
    if (nutritionData.recommendations && nutritionData.recommendations.length > 0) {
      // Abaikan jika isinya hanya pesan placeholder "Analisis Nutrisi Sedang Berjalan"
      const isPlaceholder = nutritionData.recommendations.length === 1 && 
        nutritionData.recommendations[0].title === "Analisis Nutrisi Sedang Berjalan";
      if (!isPlaceholder) {
        setAiRecommendations(nutritionData.recommendations);
      }
    }
  }, [nutritionData.recommendations]);

  // Kalkulasi BMI Lokal
  const height = user?.height ? Number(user.height) : 0;
  const weight = user?.weight ? Number(user.weight) : 0;
  let bmi = 0;
  if (height > 0 && weight > 0) {
    bmi = weight / ((height / 100) ** 2);
  }

  const todayEntries = (nutritionData.history || []).filter((item) =>
    new Date(item.timestamp).toDateString() === new Date().toDateString()
  );

  const localRecs = getLocalRecommendations(bmi, language);
  const activeRecommendations = aiRecommendations || localRecs;
  const isUsingAiData = aiRecommendations !== null;

  const handleGenerateAi = async () => {
    setIsLoadingAi(true);
    notify({
      type: 'info',
      title: language === 'id' ? 'Menghubungkan ke Model AI' : 'Connecting to AI Model',
      message: language === 'id' ? 'Menganalisis profil fisik dan riwayat gizi Anda...' : 'Analyzing your physical profile and nutritional history...'
    });

    try {
      const recentHistory = nutritionData.history.slice(0, 5);
      const data = await nutritionService.getAiRecommendations(recentHistory, profile, language);
      
      if (data && data.length > 0) {
        setAiRecommendations(data);
        notify({
          type: 'success',
          title: language === 'id' ? 'Rekomendasi AI Diperbarui!' : 'AI Recommendations Updated!',
          message: language === 'id' ? 'Berhasil memuat saran diet cerdas dari model NutriAI.' : 'Successfully loaded smart diet advice from NutriAI model.'
        });
      } else {
        throw new Error('No data received');
      }
    } catch (err) {
      console.error(err);
      notify({
        type: 'error',
        title: language === 'id' ? 'Gagal Memuat AI' : 'AI Load Failed',
        message: language === 'id' ? 'Tidak dapat terhubung ke model AI. Menampilkan rekomendasi lokal pintar.' : 'Unable to connect to AI model. Displaying smart local recommendations.'
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-[var(--border-card)] p-5 md:p-10 transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <Lightbulb className="text-emerald-400" size={24} />
            {language === 'id' ? 'Rekomendasi Nutrisi' : 'Nutrition Recommendations'}
            {isUsingAiData && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                NutriAI System
              </span>
            )}
          </h3>
          <p className="text-[var(--text-muted)] text-sm mt-1 italic">
            {isUsingAiData 
              ? (language === 'id' ? 'Analisis cerdas real-time dari model NutriAI' : 'Intelligent real-time analysis from NutriAI model')
              : (language === 'id' ? `Penyesuaian lokal instan berdasarkan BMI Anda (${bmi > 0 ? bmi.toFixed(1) : '-'})` : `Instant local adjustment based on your BMI (${bmi > 0 ? bmi.toFixed(1) : '-'})`)
            }
          </p>
        </div>

        {/* Tombol Pamer AI (Sparkles Trigger) */}
        <button
          onClick={handleGenerateAi}
          disabled={isLoadingAi || todayEntries.length === 0}
          className="relative overflow-hidden flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 disabled:scale-95 disabled:opacity-40 transition-all group duration-200"
        >
          {isLoadingAi ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>{language === 'id' ? 'Menganalisis...' : 'Analyzing...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="text-amber-300 animate-pulse group-hover:rotate-12 transition-transform" size={16} />
              <span>{language === 'id' ? 'Dapatkan Rekomendasi AI' : 'Generate AI Recommendations'}</span>
            </>
          )}
        </button>
      </div>

      {/* Shimmer / Skeleton Loading */}
      {isLoadingAi ? (
        <div className="grid gap-6 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-[2rem] border border-[var(--border-card)]/50 bg-[var(--bg-secondary)]/50 p-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-700/20" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-1/3 bg-slate-700/20 rounded-lg" />
                  <div className="h-3 w-1/4 bg-slate-700/20 rounded-lg" />
                </div>
              </div>
              <div className="h-4 w-5/6 bg-slate-700/20 rounded-lg" />
              <div className="h-4 w-4/5 bg-slate-700/20 rounded-lg" />
              <div className="flex gap-2 pt-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-8 w-20 bg-slate-700/20 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : todayEntries.length === 0 ? (
        <div className="text-center py-12 px-6 rounded-[2rem] border border-[var(--border-card)] bg-[var(--bg-secondary)]/50">
          <div className="w-16 h-16 bg-[var(--primary-green)]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--primary-green)]">
            <Zap size={28} />
          </div>
          <h4 className="font-bold text-[var(--text-main)] text-base md:text-lg mb-2">
            {language === 'id' ? 'Belum Ada Makanan yang Dicatat' : 'No Food Logged Yet'}
          </h4>
          <p className="text-[var(--text-muted)] text-xs md:text-sm max-w-sm mx-auto leading-relaxed font-medium">
            {language === 'id'
              ? 'Silakan tambahkan makanan atau minuman Anda hari ini terlebih dahulu agar asisten AI dapat menganalisis gizi dan memberikan rekomendasi menu yang personal.'
              : 'Please add your food or drink intake today first so that the AI assistant can analyze your nutrition and provide personalized menu recommendations.'}
          </p>
        </div>
      ) : (
        /* Recommendations List with Smooth Transition */
        <div className="grid gap-6 transition-all duration-300">
          {activeRecommendations.map((rec, index) => {
            const style = getStyle(rec.priority);
            const IconComp = getIcon(rec.type);
            
            return (
              <div key={index} className="group relative overflow-hidden rounded-[2rem] border border-[var(--border-card)] bg-[var(--bg-secondary)] p-6 md:p-8 transition-all duration-300 hover:border-[var(--primary-green)]/30 hover:shadow-md">
                <div className={`absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 opacity-5 ${style.text}`}>
                  <IconComp size={100} />
                </div>
                
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl ${style.bg} p-3 ${style.text} shrink-0`}>
                    <IconComp size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="font-bold text-[var(--text-main)] text-base md:text-lg truncate">{rec.title}</h4>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest border ${style.bg} ${style.text} ${style.border}`}>
                        {rec.priority === 'high' ? (language === 'id' ? 'Sangat Cocok' : 'High Match') : rec.priority}
                      </span>
                    </div>
                    <p className="text-[var(--text-main)]/90 text-xs md:text-sm leading-relaxed mb-4">
                      {rec.message}
                    </p>
                    
                    {rec.foods && (
                      <div className="flex flex-wrap gap-2">
                        {rec.foods.map((food, fIdx) => (
                          <span key={fIdx} className="rounded-lg bg-[var(--bg-primary)] px-3 py-1.5 text-[10px] md:text-xs font-semibold text-[var(--text-main)] border border-[var(--border-card)] hover:border-[var(--primary-green)]/30 transition-colors">
                            {food}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Why is this important section */}
      <div className="mt-8 rounded-2xl bg-emerald-500/10 p-5 border border-emerald-500/20">
        <div className="flex items-start gap-4">
          <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400 shrink-0">
            <CheckCircle size={20} />
          </div>
          <div>
            <h5 className="font-bold text-[var(--text-main)] text-sm mb-1">
              {language === 'id' ? 'Mengapa rekomendasi ini penting?' : 'Why is this recommendation important?'}
            </h5>
            <p className="text-[var(--text-muted)] text-xs leading-relaxed">
              {language === 'id' 
                ? 'Sistem AI membandingkan profil kesehatan Anda dengan tren nutrisi dari riwayat makanan harian Anda untuk memberikan saran yang membantu mencapai tujuan kesehatan jangka panjang.' 
                : 'The AI system compares your health profile with nutrition trends from your daily food history to provide advice that helps achieve long-term health goals.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationList;