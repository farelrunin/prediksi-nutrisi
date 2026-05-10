const { Sequelize } = require("sequelize");
require("dotenv").config();

// Convert MySQL URL from Python format (mysql+pymysql) to Node format (mysql)
const dbUrl = process.env.DATABASE_URL.replace("mysql+pymysql://", "mysql://");

const sequelize = new Sequelize(dbUrl, {
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
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
