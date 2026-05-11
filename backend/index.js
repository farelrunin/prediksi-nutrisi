const express = require("express");
const cors = require("cors");
require("dotenv").config();

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

// Import Models & Database
const { sequelize, connectDB } = require("./database-express");
require("./models-express");

// Connect to Database & Sync
(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized (Production)");
  } catch (err) {
    console.error("❌ DB Initialization failed:", err.message);
  }
})();

// Health Check with DB Status
app.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      message: "NutriAI Express API is running",
      database: "Connected",
      sync: "Ready"
    });
  } catch (err) {
    res.status(500).json({ 
      message: "API Running but DB Error",
      error: err.message 
    });
  }
});

// Jalankan server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
