const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Food } = require("../models-express");
const { Op } = require("sequelize");
const geminiService = require("../services/geminiService");

const SECRET_KEY = process.env.SECRET_KEY;

// Helper: Database Fallback Search (Lebih Cerdas)
async function searchFoodDatabase(story) {
  try {
    const stopWords = ['saya', 'makan', 'dengan', 'lalu', 'minum', 'dan', 'di', 'yang', 'untuk', 'adalah', 'itu', 'adalah', 'ke'];
    const keywords = story.toLowerCase().split(' ')
      .filter(word => word.length > 2 && !stopWords.includes(word));
    
    if (keywords.length === 0) return null;

    let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, quantity_grams: 0 };
    let foundFoods = [];

    for (const word of keywords) {
      const match = await Food.findOne({
        where: {
          [Op.or]: [
            { food_name_id: { [Op.like]: `%${word}%` } },
            { food_name_en: { [Op.like]: `%${word}%` } }
          ]
        },
        order: [['food_name_id', 'ASC']] // Biar konsisten
      });

      if (match) {
        foundFoods.push({ name: match.food_name_id, quantity: 1, unit: 'porsi' });
        totalNutrition.calories += match.calories || 0;
        totalNutrition.protein += match.protein || 0;
        totalNutrition.carbs += match.carbohydrates || 0;
        totalNutrition.fat += match.total_fat || 0;
        totalNutrition.quantity_grams += 100;
      }
    }

    if (foundFoods.length > 0) {
      return {
        parsed_foods: foundFoods,
        total_nutrition: totalNutrition,
        is_fallback: true
      };
    }
    return null;
  } catch (e) {
    console.error("Search Error:", e);
    return null;
  }
}

// Analisis Cerita Makanan
router.post("/", async (req, res) => {
  const { story } = req.body;
  const authHeader = req.headers["authorization"];
  let userProfile = {};

  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = await User.findByPk(decoded.sub);
      if (user) {
        userProfile = {
          name: user.name,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
          nutritionGoal: user.nutrition_goal
        };
      }
    } catch (e) {}
  }

  // 1. Coba AI Dulu
  let parsedData = await geminiService.parseNaturalLanguageFood(story);
  
  // 2. Jika AI Gagal, Coba Cari di Database Lokal (Ban Serep)
  if (!parsedData) {
    console.log("⚠️ AI Gagal, Menggunakan Database Fallback...");
    parsedData = await searchFoodDatabase(story);
  }

  if (!parsedData) return res.status(500).json({ detail: "Sistem gagal mengenali makanan. Silakan coba input manual." });

  const foodInfo = {
    food_name: parsedData.parsed_foods.map(f => f.name).join(", "),
    calories: parsedData.total_nutrition.calories,
    protein: parsedData.total_nutrition.protein,
    carbs: parsedData.total_nutrition.carbs,
    fat: parsedData.total_nutrition.fat
  };

  // Coba dapatkan advice AI, kalau gagal pakai default advice
  let aiAdvice = await geminiService.getAiAdvice(foodInfo, userProfile);
  if (!aiAdvice) {
    aiAdvice = `Berdasarkan database kami, ${foodInfo.food_name} mengandung sekitar ${foodInfo.calories} kalori. Pastikan porsi Anda sesuai dengan kebutuhan harian. (Analisis Database Lokal)`;
  }
  
  let riskLevel = "Low";
  const dangerKeywords = ["PERINGATAN", "BAHAYA", "FATAL", "EKSTREM", "DARURAT"];
  if (dangerKeywords.some(keyword => aiAdvice.toUpperCase().includes(keyword)) || parsedData.total_nutrition.calories > 2500) {
    riskLevel = "High";
  }

  res.json({
    risk_level: riskLevel,
    score: riskLevel === "High" ? 0.9 : 0.2,
    suggestion: riskLevel === "High" ? "Segera perbaiki pola makan Anda!" : "Pola makan cukup seimbang",
    ai_advice: aiAdvice,
    ...parsedData.total_nutrition,
    quantity_grams: parsedData.total_nutrition.quantity_grams || 0,
    foods: parsedData.parsed_foods,
    parsed_data: parsedData,
    is_fallback: parsedData.is_fallback || false
  });
});

// Rekomendasi Menu (Dashboard)
router.post("/recommendations", async (req, res) => {
  const { history, profile } = req.body;
  const recommendations = await geminiService.getAiRecommendations(history, profile);
  res.json(recommendations);
});

module.exports = router;
