import React, { createContext, useContext, useState, useEffect } from 'react';

const NutritionContext = createContext();

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};

export const NutritionProvider = ({ children }) => {
  const [nutritionData, setNutritionData] = useState({
    dailyIntake: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
    targets: {
      calories: 2000,
      protein: 100,
      carbs: 250,
      fat: 70,
    },
    history: [],
    recommendations: [],
  });

  const [profile, setProfile] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: '',
    conditions: [],
  });

  const addFoodEntry = async (foodData) => {
    // Call nutritionService to add food entry
    // Update nutritionData
    const newEntry = {
      ...foodData,
      timestamp: new Date(),
    };
    setNutritionData(prev => ({
      ...prev,
      history: [...prev.history, newEntry],
      dailyIntake: {
        ...prev.dailyIntake,
        // Update calculations based on foodData
      },
    }));
  };

  const getRiskScore = () => {
    // Calculate risk score based on current data
    // Call aiService for prediction
    return 0.5; // Mock
  };

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    // Save to backend
  };

  const value = {
    nutritionData,
    profile,
    addFoodEntry,
    getRiskScore,
    updateProfile,
  };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
};