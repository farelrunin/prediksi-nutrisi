import React, { useEffect, useState } from 'react';
import { NutritionContext } from './NutritionContextProvider';
import { nutritionService } from '../services/nutritionService';
import { useAuth } from './useAuth';

const DEFAULT_TARGETS = {
  calories: 2000,
  protein: 100,
  carbs: 250,
  fat: 70
};

const EMPTY_DAILY_INTAKE = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0
};

const normalizeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const isSameDay = (dateValue, referenceDate = new Date()) => {
  if (!dateValue) {
    return false;
  }

  return new Date(dateValue).toDateString() === referenceDate.toDateString();
};

const estimateNutrition = ({ foodName, quantity, unit }) => {
  const normalizedName = String(foodName || '').toLowerCase();
  const amount = normalizeNumber(quantity);
  const factor = unit === 'gram' || unit === 'ml' ? amount / 100 : amount || 1;

  const nutrients = [
    {
      keywords: ['nasi'],
      values: { calories: 130, protein: 2.5, carbs: 28, fat: 0.3 }
    },
    {
      keywords: ['telur'],
      values: { calories: 155, protein: 13, carbs: 1.1, fat: 11 }
    },
    {
      keywords: ['ayam'],
      values: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }
    },
    {
      keywords: ['ikan', 'salmon'],
      values: { calories: 206, protein: 22, carbs: 0, fat: 12 }
    },
    {
      keywords: ['sayur', 'bayam', 'brokoli'],
      values: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 }
    },
    {
      keywords: ['tempe'],
      values: { calories: 192, protein: 20, carbs: 9.4, fat: 10.8 }
    },
    {
      keywords: ['tahu'],
      values: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8 }
    }
  ];

  const match = nutrients.find((item) => item.keywords.some((keyword) => normalizedName.includes(keyword)));
  const base = match ? match.values : { calories: 150, protein: 7, carbs: 20, fat: 5 };

  return {
    calories: Math.max(0, Math.round(base.calories * factor)),
    protein: Math.max(0, Math.round(base.protein * factor)),
    carbs: Math.max(0, Math.round(base.carbs * factor)),
    fat: Math.max(0, Math.round(base.fat * factor))
  };
};

const normalizeStoredEntry = (entry) => {
  let rawTimestamp = entry.created_at ?? entry.timestamp ?? new Date().toISOString();
  // Tambahkan 'Z' jika belum ada agar browser menganggapnya UTC dan konversi ke WIB
  const timestamp = rawTimestamp.endsWith('Z') ? rawTimestamp : rawTimestamp + 'Z';

  return {
    id: entry.id,
    userId: entry.user_id ?? entry.userId,
    mealType: entry.meal_type ?? entry.mealType ?? 'mixed',
    foodName: entry.food_name ?? entry.foodName ?? 'Makanan',
    quantity: normalizeNumber(entry.quantity),
    unit: entry.unit ?? 'gram',
    calories: normalizeNumber(entry.calories),
    protein: normalizeNumber(entry.protein),
    carbs: normalizeNumber(entry.carbs),
    fat: normalizeNumber(entry.fat),
    timestamp
  };
};

const sortEntries = (entries) => (
  [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
);

const calculateDailyIntake = (entries) => {
  const todayEntries = entries.filter((entry) => isSameDay(entry.timestamp));

  const rawTotals = todayEntries.reduce((totals, entry) => ({
    calories: totals.calories + normalizeNumber(entry.calories),
    protein: totals.protein + normalizeNumber(entry.protein),
    carbs: totals.carbs + normalizeNumber(entry.carbs),
    fat: totals.fat + normalizeNumber(entry.fat)
  }), { ...EMPTY_DAILY_INTAKE });

  return {
    calories: Number(rawTotals.calories.toFixed(1)),
    protein: Number(rawTotals.protein.toFixed(1)),
    carbs: Number(rawTotals.carbs.toFixed(1)),
    fat: Number(rawTotals.fat.toFixed(1))
  };
};

const buildNutritionState = (entries, previousState) => {
  const sortedEntries = sortEntries(entries);

  return {
    ...previousState,
    history: sortedEntries,
    dailyIntake: calculateDailyIntake(sortedEntries)
  };
};

const buildStoryEntryPayload = (food, mealType = 'mixed') => {
  const quantity = normalizeNumber(food.quantity) || 1;
  const unit = food.unit || 'porsi';
  const estimatedGrams = normalizeNumber(food.estimated_grams);
  const portionMultiplier = estimatedGrams > 0 ? estimatedGrams / 100 : quantity;
  const nutrition = food.nutrition ?? {};

  return {
    meal_type: mealType,
    food_name: food.name || food.normalized_name || 'Makanan dari cerita',
    quantity,
    unit,
    calories: Number((normalizeNumber(nutrition.calories) * portionMultiplier).toFixed(1)),
    protein: Number((normalizeNumber(nutrition.protein) * portionMultiplier).toFixed(1)),
    carbs: Number((normalizeNumber(nutrition.carbs) * portionMultiplier).toFixed(1)),
    fat: Number((normalizeNumber(nutrition.fat) * portionMultiplier).toFixed(1))
  };
};

export const NutritionProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [nutritionData, setNutritionData] = useState({
    dailyIntake: { ...EMPTY_DAILY_INTAKE },
    targets: DEFAULT_TARGETS,
    history: [],
    recommendations: []
  });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [profile, setProfile] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: '',
    conditions: []
  });

  const predictNutrition = async (data) => {
    try {
      return await nutritionService.predictNutrition(data);
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  };

  const refreshHistory = async () => {
    if (!localStorage.getItem('token')) {
      return;
    }

    setHistoryLoading(true);
    setHistoryError('');

    try {
      const history = await nutritionService.getNutritionHistory();
      const normalizedHistory = history.map(normalizeStoredEntry);

      setNutritionData((prev) => buildNutritionState(normalizedHistory, prev));
      return normalizedHistory; // Kembalikan data agar bisa dipakai langsung
    } catch (error) {
      console.error('Load history error:', error);
      setHistoryError(error.message || 'Gagal memuat riwayat asupan.');
      return [];
    } finally {
      setHistoryLoading(false);
    }
  };

  const refreshRecommendations = async (currentHistory = null) => {
    const historyToUse = currentHistory || nutritionData.history;
    
    // Jika riwayat kosong, bersihkan rekomendasi
    if (!historyToUse || historyToUse.length === 0) {
      setNutritionData(prev => ({ ...prev, recommendations: [] }));
      return;
    }
    
    try {
      const recentHistory = historyToUse.slice(0, 5);
      const recommendations = await nutritionService.getAiRecommendations(
        recentHistory,
        profile
      );
      
      const finalRecommendations = recommendations.length > 0 ? recommendations : [
        {
          priority: "high",
          title: "Analisis Nutrisi Sedang Berjalan",
          message: "Data Anda sedang dianalisis secara mendalam. Tetap pantau asupan air putih dan nutrisi harian Anda.",
          foods: ["Air Putih", "Sayuran Hijau"],
          type: "energy"
        }
      ];
      
      setNutritionData(prev => ({ ...prev, recommendations: finalRecommendations }));
    } catch (error) {
      console.error("Gagal memuat rekomendasi AI:", error);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setNutritionData((prev) => ({
        ...prev,
        history: [],
        recommendations: [],
        dailyIntake: { ...EMPTY_DAILY_INTAKE }
      }));
      setHistoryError('');
      setHistoryLoading(false);
      return;
    }

    if (user) {
      setProfile({
        height: user.height || '',
        weight: user.weight || '',
        age: user.age || '',
        gender: user.gender || '',
        activityLevel: user.activity_level || '',
        conditions: user.is_pregnant ? ['Ibu Hamil'] : (user.is_breastfeeding ? ['Ibu Menyusui'] : [])
      });
    }

    refreshHistory().then((history) => {
      if (history && history.length > 0) {
        refreshRecommendations(history);
      }
    });
  }, [authLoading, user]);

  const addFoodEntry = async (foodData) => {
    if (foodData.story) {
      const prediction = foodData.parsed_data
        ? foodData
        : await predictNutrition({ story: foodData.story });

      const parsedFoods = prediction.foods ?? prediction.parsed_data?.parsed_foods ?? [];
      if (parsedFoods.length === 0) {
        throw new Error('Cerita makanan belum bisa dikenali. Coba tulis makanan dan porsinya lebih jelas.');
      }

      const savedEntries = await Promise.all(
        parsedFoods.map((food) => nutritionService.addFoodEntry(buildStoryEntryPayload(food, foodData.mealType || 'mixed')))
      );

      const normalizedEntries = savedEntries.map(normalizeStoredEntry);
      const updatedHistory = [...nutritionData.history, ...normalizedEntries];
      setNutritionData((prev) => buildNutritionState(updatedHistory, prev));
      
      // Update rekomendasi AI segera setelah input gizi ekstrem terdeteksi
      setTimeout(() => {
        refreshRecommendations(updatedHistory);
      }, 500);

      return normalizedEntries;
    }

    const nutrition = estimateNutrition(foodData);
    const payload = {
      meal_type: foodData.mealType,
      food_name: foodData.foodName,
      quantity: normalizeNumber(foodData.quantity),
      unit: foodData.unit,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat
    };

      const savedEntry = await nutritionService.addFoodEntry(payload);
      const normalized = normalizeStoredEntry(savedEntry);
      setNutritionData((prev) => buildNutritionState([...prev.history, normalized], prev));
      
      // Update rekomendasi AI segera
      setTimeout(() => {
        refreshRecommendations();
      }, 500);

      return normalized;
  };

  const deleteFoodEntry = async (id) => {
    try {
      await nutritionService.deleteFoodEntry(id);
      const newHistory = await refreshHistory();
      refreshRecommendations(newHistory);
    } catch (error) {
      console.error("Gagal menghapus di Store:", error);
      throw error;
    }
  };

  const getRiskScore = () => {
    if (nutritionData.history.length === 0) {
      return null;
    }

    // Ratio asupan terhadap target (1.0 berarti pas)
    const calRatio = nutritionData.dailyIntake.calories / nutritionData.targets.calories;
    const protRatio = nutritionData.dailyIntake.protein / nutritionData.targets.protein;
    const carbRatio = nutritionData.dailyIntake.carbs / nutritionData.targets.carbs;
    const fatRatio = nutritionData.dailyIntake.fat / nutritionData.targets.fat;

    // Logika Kurang Gizi (Malnutrisi)
    const underScore = (
      Math.max(0, 1 - calRatio) +
      Math.max(0, 1 - protRatio) +
      Math.max(0, 1 - carbRatio) +
      Math.max(0, 1 - fatRatio)
    ) / 4;

    // Logika Kelebihan Ekstrem (Over-intake/Toxicity)
    // Jika kalori > 1.5x target atau protein/lemak > 2x target, ini bahaya
    const overScore = (
      (calRatio > 1.5 ? (calRatio - 1.5) / 2 : 0) +
      (protRatio > 2.0 ? (protRatio - 2.0) / 2 : 0) +
      (fatRatio > 2.0 ? (fatRatio - 2.0) / 2 : 0)
    );

    const totalRisk = Math.max(underScore, overScore);
    return Math.max(0, Math.min(1, totalRisk));
  };

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  return (
    <NutritionContext.Provider
      value={{
        nutritionData,
        profile,
        historyLoading,
        historyError,
        addFoodEntry,
        deleteFoodEntry,
        predictNutrition,
        getRiskScore,
        refreshHistory,
        updateProfile
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};
