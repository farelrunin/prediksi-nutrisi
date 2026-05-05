import React, { useState } from 'react';
import { NutritionContext } from './NutritionContextProvider';
import { nutritionService } from '../services/nutritionService';

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
    dailyIntake: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    targets: {
      calories: 2000,
      protein: 100,
      carbs: 250,
      fat: 70
    },
    history: [],
    recommendations: []
  });

  const [profile, setProfile] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: '',
    conditions: []
  });

  const addFoodEntry = async (foodData) => {
    let nutrition;

    if (foodData.story) {
      // Handle story input - use AI prediction
      const prediction = await predictNutrition({ story: foodData.story });
      nutrition = {
        calories: prediction.calories ?? prediction.parsed_data?.total_nutrition?.calories ?? 0,
        protein: prediction.protein ?? prediction.parsed_data?.total_nutrition?.protein ?? 0,
        carbs: prediction.carbs ?? prediction.parsed_data?.total_nutrition?.carbs ?? 0,
        fat: prediction.fat ?? prediction.parsed_data?.total_nutrition?.fat ?? 0
      };
    } else {
      // Handle form input - use estimation
      nutrition = estimateNutrition(foodData);
    }

    const newEntry = {
      ...foodData,
      ...nutrition,
      timestamp: new Date().toISOString()
    };

    setNutritionData((prev) => ({
      ...prev,
      history: [...prev.history, newEntry],
      dailyIntake: {
        calories: prev.dailyIntake.calories + nutrition.calories,
        protein: prev.dailyIntake.protein + nutrition.protein,
        carbs: prev.dailyIntake.carbs + nutrition.carbs,
        fat: prev.dailyIntake.fat + nutrition.fat
      }
    }));
  };

  const getRiskScore = () => {
    if (nutritionData.history.length === 0) {
      return null;
    }

    const caloriesRatio = Math.min(nutritionData.dailyIntake.calories / nutritionData.targets.calories, 1);
    const proteinRatio = Math.min(nutritionData.dailyIntake.protein / nutritionData.targets.protein, 1);
    const carbsRatio = Math.min(nutritionData.dailyIntake.carbs / nutritionData.targets.carbs, 1);
    const fatRatio = Math.min(nutritionData.dailyIntake.fat / nutritionData.targets.fat, 1);

    const score = 1 - (caloriesRatio + proteinRatio + carbsRatio + fatRatio) / 4;
    return Math.max(0, Math.min(1, score));
  };

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const predictNutrition = async (data) => {
    try {
      const result = await nutritionService.predictNutrition(data);
      return result;
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  };

  const value = {
    nutritionData,
    profile,
    addFoodEntry,
    predictNutrition,
    getRiskScore,
    updateProfile
  };

  return <NutritionContext.Provider value={value}>{children}</NutritionContext.Provider>;
};
