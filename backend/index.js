const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./database-express");

// Import Routers
const authRouter = require("./routers/auth");
const foodRouter = require("./routers/food");
const predictRouter = require("./routers/predict");
const categoryRouter = require("./routers/category");

const app = express();
const PORT = process.env.PORT || 8000;

// Handle OPTIONS preflight manually for Vercel
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/static", express.static("static"));

// Use Routers
app.use("/auth", authRouter);
app.use("/food", foodRouter);
app.use("/predict", predictRouter);
app.use("/categories", categoryRouter);

// Health Check
app.get("/", (req, res) => res.json({ message: "NutriAI Express API is running (Modular Mode)" }));

// Connect to Database
(async () => {
  try {
    const { sequelize } = require("./database-express");
    // IMPORT MODELS DISINI supaya Sequelize tahu tabel apa yang mau dibuat
    require("./models-express"); 
    
    await connectDB();
    // Sync models to database
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized");
  } catch (err) {
    console.error("❌ DB Initialization failed:", err.message);
  }
})();

// Hanya jalankan app.listen di lokal (bukan di Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
