const { Category, Food } = require("./models-express");

const seedData = async () => {
  try {
    const count = await Category.count();
    if (count > 0) {
      console.log("ℹ️ Database already has category data. Skipping seed.");
      return;
    }

    console.log("🌱 Seeding initial categories and foods...");

    const categories = [
      { name: "Buah-buahan", section: "fruit", description: "Sumber vitamin dan serat alami." },
      { name: "Sayuran", section: "vegetable", description: "Kaya akan mineral dan antioksidan." },
      { name: "Protein Hewani", section: "meat", description: "Sumber protein tinggi untuk otot." },
      { name: "Karbohidrat", section: "grain", description: "Sumber energi utama tubuh." },
      { name: "Produk Susu", section: "dairy", description: "Kaya akan kalsium untuk tulang." }
    ];

    for (const cat of categories) {
      const createdCat = await Category.create(cat);
      
      // Tambahkan beberapa contoh makanan untuk setiap kategori
      if (cat.name === "Buah-buahan") {
        await Food.create({ food_name_en: "Apple", food_name_id: "Apel", calories: 52, protein: 0.3, carbohydrates: 14, total_fat: 0.2, category_id: createdCat.id });
        await Food.create({ food_name_en: "Banana", food_name_id: "Pisang", calories: 89, protein: 1.1, carbohydrates: 23, total_fat: 0.3, category_id: createdCat.id });
      } else if (cat.name === "Protein Hewani") {
        await Food.create({ food_name_en: "Chicken Breast", food_name_id: "Dada Ayam", calories: 165, protein: 31, carbohydrates: 0, total_fat: 3.6, category_id: createdCat.id });
        await Food.create({ food_name_en: "Egg", food_name_id: "Telur", calories: 155, protein: 13, carbohydrates: 1.1, total_fat: 11, category_id: createdCat.id });
      }
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

module.exports = { seedData };
