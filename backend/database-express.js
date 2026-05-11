const { Sequelize } = require("sequelize");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set! Please set it in environment variables.");
}

// DEBUG LOG (Aman, tidak cetak password)
console.log("🛠️ Attempting DB connection with Host:", process.env.MYSQLHOST || "Using DATABASE_URL");

const sequelize = process.env.MYSQLHOST 
  ? new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT || 3306,
      dialect: "mysql",
      dialectModule: require('mysql2'),
      logging: false,
    })
  : new Sequelize(process.env.DATABASE_URL, {
      dialect: "mysql",
      dialectModule: require('mysql2'),
      logging: false,
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
