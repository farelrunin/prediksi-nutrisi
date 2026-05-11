const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Food } = require("../models-express");
const { Op } = require("sequelize");
const geminiService = require("../services/geminiService");

const SECRET_KEY = process.env.SECRET_KEY;

// Helper: Database Fallback Search
async function searchFoodDatabase(story) {
  try {
    // Cari kata kunci utama dari input (pisahkan spasi)
    const keywords = story.split(' ').filter(word => word.length > 2);
    
    const matches = await Food.findAll({
      where: {
        [Op.or]: [
          { food_name_id: { [Op.like]: `%${story}%` } },
          { food_name_en: { [Op.like]: `%${story}%` } },
          ...keywords.map(k => ({ food_name_id: { [Op.like]: `%${k}%` } }))
        ]
      },
      limit: 3
    });

    if (matches.length > 0) {
      const bestMatch = matches[0];
      return {
        parsed_foods: [{ name: bestMatch.food_name_id, quantity: 1, unit: 'porsi' }],
        total_nutrition: {
          calories: bestMatch.calories || 0,
          protein: bestMatch.protein || 0,
          carbs: bestMatch.carbohydrates || 0,
          fat: bestMatch.total_fat || 0,
          quantity_grams: 100
        },
        is_fallback: true
      };
    }
    return null;
  } catch (e) {
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
