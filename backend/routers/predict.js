const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models-express");
const geminiService = require("../services/geminiService");

const SECRET_KEY = process.env.SECRET_KEY;

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

  const parsedData = await geminiService.parseNaturalLanguageFood(story);
  if (!parsedData) return res.status(500).json({ detail: "AI Gagal menganalisis" });

  const foodInfo = {
    food_name: parsedData.parsed_foods.map(f => f.name).join(", "),
    calories: parsedData.total_nutrition.calories,
    protein: parsedData.total_nutrition.protein,
    carbs: parsedData.total_nutrition.carbs,
    fat: parsedData.total_nutrition.fat
  };

  const aiAdvice = await geminiService.getAiAdvice(foodInfo, userProfile);
  
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
    parsed_data: parsedData
  });
});

// Rekomendasi Menu (Dashboard)
router.post("/recommendations", async (req, res) => {
  const { history, profile } = req.body;
  const recommendations = await geminiService.getAiRecommendations(history, profile);
  res.json(recommendations);
});

module.exports = router;
