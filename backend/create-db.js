const mysql = require('mysql2/promise');
require('dotenv').config();

async function init() {
  try {
    console.log("🔍 Checking MySQL server and creating database if not exists...");
    // Connect to mysql server without specifying the database
    const connection = await mysql.createConnection("mysql://root:@localhost:3306");
    await connection.query("CREATE DATABASE IF NOT EXISTS nutriai_db;");
    console.log("✅ Database 'nutriai_db' checked/created successfully!");
    await connection.end();
  } catch (err) {
    console.error("❌ Failed to auto-create database:", err.message);
    console.log("Attempting to continue anyway...");
  }
}
init();
