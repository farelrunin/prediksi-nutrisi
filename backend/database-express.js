const { Sequelize } = require("sequelize");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set! Please set it in environment variables.");
}

// Convert MySQL URL to Node format and remove incompatible ssl-mode param
let dbUrl = (process.env.DATABASE_URL || "mysql://localhost/nutriai_db")
  .replace("mysql+pymysql://", "mysql://")
  .replace("?ssl-mode=REQUIRED", "")
  .replace("&ssl-mode=REQUIRED", "");

const sequelize = new Sequelize(dbUrl, {
  dialect: "mysql",
  dialectModule: require('mysql2'),
  logging: false,
  dialectOptions: {}, // Hilangkan semua gembok SSL biar lancar
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database MySQL connected successfully (Express)");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
