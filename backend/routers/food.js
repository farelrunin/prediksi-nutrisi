const express = require("express");
const router = express.Router();
const { FoodEntry } = require("../models-express");
const authenticateToken = require("../middleware/auth");

// List History
router.get("/", authenticateToken, async (req, res) => {
  try {
    const entries = await FoodEntry.findAll({ 
      where: { user_id: req.user.sub },
      order: [['created_at', 'DESC']]
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Add Entry
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { 
      food_name, 
      meal_type, 
      calories, 
      protein, 
      carbs, 
      fat, 
      quantity, 
      unit 
    } = req.body;

    // Pastikan semua data wajib ada nilainya (fallback ke 0 atau default)
    const newEntry = await FoodEntry.create({
      user_id: req.user.sub,
      food_name: food_name || "Makanan Tanpa Nama",
      meal_type: meal_type || "snack",
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      quantity: parseFloat(quantity) || 1,
      unit: unit || "porsi"
    });

    res.json(newEntry);
  } catch (error) {
    console.error("DB Save Error:", error);
    res.status(500).json({ detail: "Gagal menyimpan ke database: " + error.message });
  }
});

// Delete Entry
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await FoodEntry.destroy({ where: { id: req.params.id, user_id: req.user.sub } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
