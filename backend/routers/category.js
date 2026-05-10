const express = require("express");
const router = express.Router();
const { Category, Food } = require("../models-express");
const { Op } = require("sequelize");

// List Categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Search Foods
router.get("/search/foods", async (req, res) => {
  try {
    const { q } = req.query;
    const foods = await Food.findAll({
      where: {
        [Op.or]: [
          { food_name_id: { [Op.like]: `%${q}%` } },
          { food_name_en: { [Op.like]: `%${q}%` } }
        ]
      },
      limit: 20
    });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Foods by Category
router.get("/:id/foods", async (req, res) => {
  try {
    const foods = await Food.findAll({ where: { category_id: req.params.id } });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
