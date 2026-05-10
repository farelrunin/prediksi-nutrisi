const { sequelize } = require("./database-express");
const { User, Food, History } = require("./models-express");

const migrate = async () => {
  try {
    console.log("🚀 Memulai migrasi ke Database Online...");
    
    // Sinkronisasi model ke database
    await sequelize.sync({ force: true });
    
    console.log("✅ Migrasi SELESAI! Semua tabel (User, Food, History) telah dibuat di Aiven.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migrasi GAGAL:", error);
    process.exit(1);
  }
};

migrate();
