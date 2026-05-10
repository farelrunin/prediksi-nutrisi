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

app.use(cors());
app.use(express.json());
app.use("/static", express.static("static"));

// Use Routers
app.use("/auth", authRouter);
app.use("/food", foodRouter);
app.use("/predict", predictRouter);
app.use("/categories", categoryRouter);

// Health Check
app.get("/", (req, res) => res.json({ message: "NutriAI Express API is running (Modular Mode)" }));

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server Express (Modular) running on http://localhost:${PORT}`);
});
