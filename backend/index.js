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

// ── Security Headers (improves Lighthouse Best Practices score) ─────────────
app.use((req, res, next) => {
  // Prevent clickjacking (XFO)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Block MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions policy — allow camera for photo scanning feature
  res.setHeader('Permissions-Policy', 'camera=*, microphone=(), geolocation=()');
  // Cross-Origin Opener Policy (COOP) — required for SharedArrayBuffer / isolation
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Cross-Origin Resource Policy
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  // HSTS — force HTTPS for 1 year (Railway always serves HTTPS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Content Security Policy — allow Railway frontend origins + Unsplash images
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://*.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.up.railway.app https://lh3.googleusercontent.com",
      "connect-src 'self' https://*.up.railway.app https://accounts.google.com https://oauth2.googleapis.com https://generativelanguage.googleapis.com",
      "frame-src https://accounts.google.com",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ')
  );
  next();
});
app.use("/static", express.static("static"));

// Use Routers
app.use("/auth", authRouter);
app.use("/food", foodRouter);
app.use("/predict", predictRouter);
app.use("/categories", categoryRouter);

// Import Models, Database & Seeder
const { sequelize, connectDB } = require("./database-express");
const { seedData } = require("./seeders");
require("./models-express");

// Connect to Database & Sync
(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized (Production)");
    
    // Jalankan ALTER TABLE jika kolom image_url belum ada di MySQL database
    try {
      await sequelize.query("ALTER TABLE food_entries ADD COLUMN image_url LONGTEXT NULL;");
      console.log("✅ Column 'image_url' added successfully to food_entries");
    } catch (alterErr) {
      console.log("ℹ️ Column 'image_url' might already exist, skipping: " + alterErr.message);
    }
    
    // ISI DATA OTOMATIS (SEEDING)
    await seedData();
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
