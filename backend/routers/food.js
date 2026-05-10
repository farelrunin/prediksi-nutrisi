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
    const entry = await FoodEntry.create({ ...req.body, user_id: req.user.sub });
    res.json(entry);
  } catch (error) {
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
