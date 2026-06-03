const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, FoodEntry, Food } = require("../models-express");
const { Op } = require("sequelize");
const authenticateToken = require("../middleware/auth");

const SECRET_KEY = process.env.SECRET_KEY;

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ detail: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, hashed_password: hashedPassword, profile: {} });
    
    const token = jwt.sign({ sub: user.id, email: user.email }, SECRET_KEY);
    res.json({ token, token_type: "bearer", name: user.name, email: user.email, is_profile_completed: user.is_profile_completed });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
      return res.status(401).json({ detail: "Email atau password salah" });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, SECRET_KEY);
    res.json({ token, token_type: "bearer", name: user.name, email: user.email, is_profile_completed: user.is_profile_completed });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Google Login
router.post("/google", async (req, res) => {
  try {
    const { access_token } = req.body;
    const axios = require("axios");
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    
    const googleUser = response.data;
    const email = googleUser.email;
    const name = googleUser.name || "Google User";

    let user = await User.findOne({ where: { email } });
    if (!user) {
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await User.create({ name, email, hashed_password: dummyPassword, profile: {} });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, SECRET_KEY);
    res.json({ token, token_type: "bearer", name: user.name, email: user.email, is_profile_completed: user.is_profile_completed });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Profile
router.get("/profile", authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user.sub);
  res.json(user);
});

router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user) return res.status(404).json({ detail: "User not found" });
    
    const weight = req.body.weight || user.weight;
    const goal = req.body.nutrition_goal || user.nutrition_goal;
    
    let target_calories = req.body.target_calories;
    let target_protein = req.body.target_protein;
    let target_carbs = req.body.target_carbs;
    let target_fat = req.body.target_fat;
    
    if (weight && goal && (!target_calories || !target_protein)) {
      const w = parseFloat(weight);
      switch(goal) {
        case 'lose':
          target_calories = Math.round(w * 25);
          target_protein = Math.round(w * 1.6);
          target_carbs = Math.round(w * 2.0);
          target_fat = Math.round(w * 0.7);
          break;
        case 'gain':
          target_calories = Math.round(w * 35);
          target_protein = Math.round(w * 1.8);
          target_carbs = Math.round(w * 4.5);
          target_fat = Math.round(w * 1.0);
          break;
        case 'build_muscle':
          target_calories = Math.round(w * 32);
          target_protein = Math.round(w * 2.2);
          target_carbs = Math.round(w * 3.5);
          target_fat = Math.round(w * 0.8);
          break;
        case 'maintain':
        default:
          target_calories = Math.round(w * 30);
          target_protein = Math.round(w * 1.2);
          target_carbs = Math.round(w * 3.5);
          target_fat = Math.round(w * 0.9);
          break;
      }
    }
    
    const updateData = {
      ...req.body,
      is_profile_completed: req.body.is_profile_completed !== undefined ? req.body.is_profile_completed : true
    };
    
    if (target_calories !== undefined) updateData.target_calories = target_calories;
    if (target_protein !== undefined) updateData.target_protein = target_protein;
    if (target_carbs !== undefined) updateData.target_carbs = target_carbs;
    if (target_fat !== undefined) updateData.target_fat = target_fat;
    
    await user.update(updateData);
    res.json(user);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Upload Avatar (Base64 System)
router.post("/avatar", authenticateToken, async (req, res) => {
  try {
    const { avatar_data } = req.body;
    if (!avatar_data) return res.status(400).json({ detail: "No image data provided" });

    const user = await User.findByPk(req.user.sub);
    if (!user) return res.status(404).json({ detail: "User not found" });

    await user.update({ avatar_url: avatar_data });

    res.json({ avatar_url: avatar_data });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// AKG Indonesia (Resilient: includes null checks and fallback on db sync/clears)
router.get("/akg", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub);
    const isFemale = user ? user.gender === 'female' : false;
    
    res.json({
      calories: user?.target_calories || 2150,
      protein: user?.target_protein || 60,
      carbohydrates: user?.target_carbs || 320,
      total_fat: user?.target_fat || 70,
      iron: isFemale ? 18 : 9,
      calcium: 1000,
      vitamin_c: 90
    });
  } catch (error) {
    console.error("❌ Error in AKG calculation:", error.message);
    res.json({
      calories: 2150,
      protein: 60,
      carbohydrates: 320,
      total_fat: 70,
      iron: 9,
      calcium: 1000,
      vitamin_c: 90
    });
  }
});

// System Owner Stats (Total Users & Total Food Entries)
router.get("/system-stats", authenticateToken, async (req, res) => {
  try {
    // Kunci keamanan: Hanya pemilik (farelrunin@gmail.com) yang diizinkan mengakses data ini secara kriptografis!
    const allowedEmails = [
      'farelrunin@gmail.com',
      process.env.ADMIN_EMAIL
    ].filter(Boolean);

    if (!allowedEmails.includes(req.user.email)) {
      return res.status(403).json({ detail: "Akses ditolak. Anda bukan pemilik sistem." });
    }

    const totalUsers = await User.count();
    const totalEntries = await FoodEntry.count();
    const totalFoodLibrary = await Food.count();
    
    // Hitung real vs test users secara dinamis
    const totalRealUsers = await User.count({
      where: {
        [Op.and]: [
          { email: { [Op.notLike]: "%example.test" } },
          { email: { [Op.notLike]: "ratelimit_%" } }
        ]
      }
    });

    const totalTestUsers = totalUsers - totalRealUsers;

    // Ambil list semua user terdaftar
    const users = await User.findAll({
      attributes: ["id", "name", "email", "gender", "created_at"],
      include: [
        {
          model: FoodEntry,
          attributes: ["id"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    res.json({
      totalUsers,
      totalEntries,
      totalFoodLibrary,
      totalRealUsers,
      totalTestUsers,
      users
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// System Owner Action: Clean Up rate-limit test accounts
router.post("/system-cleanup", authenticateToken, async (req, res) => {
  try {
    const allowedEmails = [
      'farelrunin@gmail.com',
      process.env.ADMIN_EMAIL
    ].filter(Boolean);

    if (!allowedEmails.includes(req.user.email)) {
      return res.status(403).json({ detail: "Akses ditolak. Anda bukan pemilik sistem." });
    }

    // Hapus semua user tester rate-limit
    const deletedCount = await User.destroy({
      where: {
        [Op.or]: [
          { email: { [Op.like]: "%example.test" } },
          { email: { [Op.like]: "ratelimit_%" } }
        ]
      }
    });

    res.json({ detail: `Sukses! Berhasil membersihkan ${deletedCount} akun tester palsu dari database.` });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
