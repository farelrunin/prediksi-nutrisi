const { Category, Food } = require("./models-express");

const seedData = async () => {
  try {
    // HAPUS DATA LAMA DULU BIAR BERSIH
    await Food.destroy({ where: {}, truncate: false });
    await Category.destroy({ where: {}, truncate: false });
    
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
      
      let foods = [];
      if (cat.name === "Buah-buahan") {
        foods = [
          { food_name_en: "Apple", food_name_id: "Apel", calories: 52, protein: 0.3, carbohydrates: 14, total_fat: 0.2 },
          { food_name_en: "Banana", food_name_id: "Pisang", calories: 89, protein: 1.1, carbohydrates: 23, total_fat: 0.3 },
          { food_name_en: "Orange", food_name_id: "Jeruk", calories: 47, protein: 0.9, carbohydrates: 12, total_fat: 0.1 }
        ];
      } else if (cat.name === "Protein Hewani") {
        foods = [
          { food_name_en: "Chicken Breast", food_name_id: "Dada Ayam", calories: 165, protein: 31, carbohydrates: 0, total_fat: 3.6 },
          { food_name_en: "Egg", food_name_id: "Telur", calories: 155, protein: 13, carbohydrates: 1.1, total_fat: 11 },
          { food_name_en: "Beef", food_name_id: "Daging Sapi", calories: 250, protein: 26, carbohydrates: 0, total_fat: 15 }
        ];
      } else if (cat.name === "Sayuran") {
        foods = [
          { food_name_en: "Spinach", food_name_id: "Bayam", calories: 23, protein: 2.9, carbohydrates: 3.6, total_fat: 0.4 },
          { food_name_en: "Carrot", food_name_id: "Wortel", calories: 41, protein: 0.9, carbohydrates: 10, total_fat: 0.2 }
        ];
      } else if (cat.name === "Karbohidrat") {
        foods = [
          { food_name_en: "Rice", food_name_id: "Nasi Putih", calories: 130, protein: 2.7, carbohydrates: 28, total_fat: 0.3 },
          { food_name_en: "Potato", food_name_id: "Kentang", calories: 77, protein: 2.0, carbohydrates: 17, total_fat: 0.1 }
        ];
      }

      // Create foods and update item_count
      for (const food of foods) {
        await Food.create({ ...food, category_id: createdCat.id });
      }
      await createdCat.update({ item_count: foods.length });
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

module.exports = { seedData };
