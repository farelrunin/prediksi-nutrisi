const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models-express");
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
    res.json({ token, token_type: "bearer", name: user.name, email: user.email });
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
    res.json({ token, token_type: "bearer", name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Google Login
router.post("/google", async (req, res) => {
  try {
    const { access_token } = req.body;
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    
    if (!response.ok) return res.status(400).json({ detail: "Token Google tidak valid" });
    
    const googleUser = await response.json();
    const email = googleUser.email;
    const name = googleUser.name || "Google User";

    let user = await User.findOne({ where: { email } });
    if (!user) {
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await User.create({ name, email, hashed_password: dummyPassword, profile: {} });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, SECRET_KEY);
    res.json({ token, token_type: "bearer", name: user.name, email: user.email });
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
    
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// AKG Indonesia
router.get("/akg", authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user.sub);
  const isFemale = user.gender === 'female';
  
  res.json({
    calories: user.target_calories || 2150,
    protein: user.target_protein || 60,
    carbohydrates: user.target_carbs || 320,
    total_fat: user.target_fat || 70,
    iron: isFemale ? 18 : 9,
    calcium: 1000,
    vitamin_c: 90
  });
});

module.exports = router;
