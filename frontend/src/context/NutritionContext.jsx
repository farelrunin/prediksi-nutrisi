import React, { useState } from 'react';
import { NutritionContext } from './NutritionContextProvider';
import { nutritionService } from '../services/nutritionService';
import { authService } from '../services/authService';

const normalizeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
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

export const NutritionProvider = ({ children }) => {
  const [nutritionData, setNutritionData] = useState({
    dailyIntake: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    targets: { calories: 2000, protein: 100, carbs: 250, fat: 70 },
    history: [],
    recommendations: []
  });

  const [profile, setProfile] = useState({
    height: '', weight: '', age: '', gender: '', activityLevel: '', conditions: []
  });

  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Load history from backend on mount
  React.useEffect(() => {
    fetchHistory();
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const akg = await authService.getAkg();
      if (akg) {
        setNutritionData(prev => ({
          ...prev,
          targets: {
            calories: akg.calories || 2000,
            protein: akg.protein || 100,
            carbs: akg.carbohydrates || 250,
            fat: akg.total_fat || 70
          }
        }));
      }
    } catch (error) {
      console.error("Gagal mengambil target AKG:", error);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await nutritionService.getNutritionHistory();
      // Ensure each entry has a local-time compatible timestamp
      const historyWithLocalTime = data.map(entry => ({
        ...entry,
        timestamp: entry.created_at.endsWith('Z') ? entry.created_at : entry.created_at + 'Z'
      }));
      
      setNutritionData(prev => ({
        ...prev,
        history: historyWithLocalTime,
        dailyIntake: calculateDailyIntake(historyWithLocalTime)
      }));
    } catch (error) {
      setHistoryError("Gagal mengambil riwayat asupan");
    } finally {
      setHistoryLoading(false);
    }
  };

  const calculateDailyIntake = (history) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysEntries = history.filter(e => e.timestamp.startsWith(today));
    
    return todaysEntries.reduce((acc, curr) => ({
      calories: acc.calories + curr.calories,
      protein: acc.protein + curr.protein,
      carbs: acc.carbs + curr.carbs,
      fat: acc.fat + curr.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const addFoodEntry = async (foodData) => {
    try {
      let nutrition;
      let aiAdvice = null;

      if (foodData.story) {
        const prediction = await predictNutrition({ story: foodData.story });
        nutrition = {
          food_name: prediction.foods ? prediction.foods[0]?.name : "Makanan dari cerita",
          calories: prediction.calories ?? 0,
          protein: prediction.protein ?? 0,
          carbs: prediction.carbs ?? 0,
          fat: prediction.fat ?? 0,
          meal_type: foodData.mealType || 'breakfast',
          quantity: foodData.quantity || 1,
          unit: foodData.unit || 'porsi'
        };
        aiAdvice = prediction.ai_advice;
      } else {
        nutrition = {
          ...foodData,
          ...estimateNutrition(foodData),
          food_name: foodData.foodName
        };
      }

      const response = await nutritionService.addFoodEntry(nutrition);
      await fetchHistory(); // Refresh from server
      return response;
    } catch (error) {
      console.error("Gagal menambah makanan:", error);
      throw error;
    }
  };

  const deleteFoodEntry = async (id) => {
    console.log("Mencoba menghapus entri dengan ID:", id);
    if (!id) {
      console.error("ID tidak ditemukan!");
      throw new Error("ID tidak valid");
    }
    
    try {
      await nutritionService.deleteFoodEntry(id);
      console.log("Berhasil menghapus dari server, menyegarkan riwayat...");
      await fetchHistory();
    } catch (error) {
      console.error("Gagal menghapus di Context:", error);
      throw error;
    }
  };

  const updateFoodEntry = async (id, updatedData) => {
    try {
      await nutritionService.updateFoodEntry(id, updatedData);
      await fetchHistory();
    } catch (error) {
      console.error("Gagal memperbarui:", error);
    }
  };

  const getRiskScore = () => {
    if (nutritionData.history.length === 0) return 0;
    const caloriesRatio = Math.min(nutritionData.dailyIntake.calories / nutritionData.targets.calories, 1);
    const score = 1 - caloriesRatio;
    return Math.max(0, Math.min(1, score));
  };

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const predictNutrition = async (data) => {
    const result = await nutritionService.predictNutrition(data);
    return result;
  };

  const value = {
    nutritionData,
    historyLoading,
    historyError,
    profile,
    addFoodEntry,
    deleteFoodEntry,
    updateFoodEntry,
    predictNutrition,
    getRiskScore,
    updateProfile
  };

  return <NutritionContext.Provider value={value}>{children}</NutritionContext.Provider>;
};
