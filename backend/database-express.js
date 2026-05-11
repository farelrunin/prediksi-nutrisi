const { Sequelize } = require("sequelize");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set! Please set it in environment variables.");
}

// GUNAKAN VARIABEL SATU-SATU (INI CARA PALING AMPUH DI RAILWAY)
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || 'railway',
  process.env.MYSQLUSER || 'root',
  process.env.MYSQLPASSWORD || '',
  {
    host: process.env.MYSQLHOST || 'localhost',
    port: process.env.MYSQLPORT || 3306,
    dialect: "mysql",
    dialectModule: require('mysql2'),
    logging: false,
    dialectOptions: {}, 
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database MySQL connected successfully (Express)");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
