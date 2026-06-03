const express = require("express");
const router = express.Router();
const { FoodEntry } = require("../models-express");
const authenticateToken = require("../middleware/auth");
const { Op } = require("sequelize");

// ROUTE: GET /api/history/progress?range=week|month
router.get("/progress", authenticateToken, async (req, res) => {
  const { range } = req.query; // 'week' or 'month'
  const daysLimit = range === 'month' ? 30 : 7;
  
  try {
    const userId = req.user.sub;
    
    // Get start date threshold
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysLimit);
    startDate.setHours(0, 0, 0, 0); // Start of day
    
    // Fetch all entries for this user in the date range
    const entries = await FoodEntry.findAll({
      where: {
        user_id: userId,
        created_at: {
          [Op.gte]: startDate
        }
      },
      order: [['created_at', 'ASC']]
    });
    
    // Group entries by local date key (YYYY-MM-DD)
    const progressMap = new Map();
    const today = new Date();
    
    // Pre-populate empty data points for all days in the range to ensure continuous line chart
    for (let i = daysLimit - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      progressMap.set(dateStr, {
        date: dateStr,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      });
    }
    
    // Accumulate actual nutrition data points
    entries.forEach(entry => {
      const rawDate = entry.created_at || entry.timestamp || new Date();
      const dateStr = new Date(rawDate).toISOString().split('T')[0];
      
      if (progressMap.has(dateStr)) {
        const dayData = progressMap.get(dateStr);
        dayData.calories += parseFloat(entry.calories) || 0;
        dayData.protein += parseFloat(entry.protein) || 0;
        dayData.carbs += parseFloat(entry.carbs) || 0;
        dayData.fat += parseFloat(entry.fat) || 0;
      }
    });
    
    const progressList = Array.from(progressMap.values());
    res.json({ success: true, data: progressList });
  } catch (error) {
    console.error("❌ Error calculating progress history:", error);
    res.status(500).json({ success: false, detail: "Internal Server Error" });
  }
});

module.exports = router;
