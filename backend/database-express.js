const { Sequelize } = require("sequelize");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set! Please set it in environment variables.");
}

// LOG UNTUK DEBUG (Sangat membantu lihat apa yang dibaca Railway)
console.log("🔍 Checking Environment Variables...");
console.log("- MYSQLHOST:", process.env.MYSQLHOST ? "FOUND" : "NOT FOUND");
console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "FOUND" : "NOT FOUND");

let sequelize;

if (process.env.MYSQLHOST) {
  console.log("🚀 Using individual Railway variables...");
  sequelize = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT || 3306,
    dialect: "mysql",
    dialectModule: require('mysql2'),
    logging: false,
  });
} else if (process.env.DATABASE_URL) {
  console.log("🚀 Using DATABASE_URL...");
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    dialectModule: require('mysql2'),
    logging: false,
    dialectOptions: {},
  });
} else {
  console.error("❌ NO DATABASE CONFIG FOUND! Defaulting to localhost (will likely fail)");
  sequelize = new Sequelize("mysql://root@localhost/nutriai_db", { dialect: "mysql", dialectModule: require('mysql2') });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database MySQL connected successfully (Express)");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
