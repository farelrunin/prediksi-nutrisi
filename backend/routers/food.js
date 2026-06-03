const express = require("express");
const router = express.Router();
const { FoodEntry } = require("../models-express");
const authenticateToken = require("../middleware/auth");

// Emergency DB Repair Endpoint (runs ALTER TABLE to ensure required columns exist)
router.get("/repair-db", async (req, res) => {
  try {
    const { sequelize } = require("../database-express");
    console.log("⚙️ Running emergency DB repair...");
    
    const actions = [];
    
    // 1. Periksa tabel food_entries
    const [foodColumns] = await sequelize.query("DESCRIBE food_entries;");
    const hasImageUrl = foodColumns.some(col => col.Field === 'image_url' || col.field === 'image_url');
    
    if (!hasImageUrl) {
      await sequelize.query("ALTER TABLE food_entries ADD COLUMN image_url LONGTEXT NULL;");
      actions.push("Added image_url to food_entries");
    }
    
    // 2. Periksa tabel users
    const [userColumns] = await sequelize.query("DESCRIBE users;");
    const hasField = (name) => userColumns.some(col => col.Field.toLowerCase() === name.toLowerCase());
    
    if (!hasField('is_pregnant')) {
      await sequelize.query("ALTER TABLE users ADD COLUMN is_pregnant TINYINT(1) DEFAULT 0;");
      actions.push("Added is_pregnant to users");
    }
    if (!hasField('is_breastfeeding')) {
      await sequelize.query("ALTER TABLE users ADD COLUMN is_breastfeeding TINYINT(1) DEFAULT 0;");
      actions.push("Added is_breastfeeding to users");
    }
    if (!hasField('age')) {
      await sequelize.query("ALTER TABLE users ADD COLUMN age INT NULL;");
      actions.push("Added age to users");
    }
    if (!hasField('sleep_hours')) {
      await sequelize.query("ALTER TABLE users ADD COLUMN sleep_hours FLOAT NULL;");
      actions.push("Added sleep_hours to users");
    }
    if (!hasField('profile')) {
      await sequelize.query("ALTER TABLE users ADD COLUMN profile JSON NULL;");
      actions.push("Added profile to users");
    }
    if (!hasField('avatar_url')) {
      await sequelize.query("ALTER TABLE users ADD COLUMN avatar_url LONGTEXT NULL;");
      actions.push("Added avatar_url to users");
    }
    
    res.json({
      success: true,
      message: actions.length > 0 
        ? `Database repaired successfully: ${actions.join(", ")}` 
        : "Database is already fully up to date! No changes needed.",
      actions
    });
  } catch (error) {
    console.error("❌ Repair DB failed:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to repair database", 
      error: error.message 
    });
  }
});

// List History (Resilient: returns [] on error instead of 500 to prevent frontend crashes)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const entries = await FoodEntry.findAll({ 
      where: { user_id: req.user.sub },
      order: [['created_at', 'DESC']]
    });
    res.json(entries || []);
  } catch (error) {
    console.error("❌ Error fetching food entries:", error.message);
    res.json([]); // Return empty list instead of crashing with 500
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
      unit,
      image_url
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
      unit: unit || "porsi",
      image_url: image_url || null
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
