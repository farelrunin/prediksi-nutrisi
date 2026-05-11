const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Category, Food } = require("./models-express");

const seedData = async () => {
  try {
    // HAPUS DATA LAMA DULU BIAR BERSIH
    await Food.destroy({ where: {}, truncate: false });
    await Category.destroy({ where: {}, truncate: false });
    
    console.log("🌱 Seeding Categories matching User Screenshot...");

    const categoryGroups = [
      {
        section: "Bahan & Nutrisi",
        categories: [
          { name: "Protein", description: "Sumber protein hewani dan nabati.", keywords: ['chicken', 'beef', 'egg', 'fish', 'meat', 'tofu', 'tempeh', 'shrimp', 'crab', 'pork', 'lamb', 'ayam', 'sapi', 'telur', 'ikan', 'daging', 'tahu', 'tempe', 'udang', 'kepiting'] },
          { name: "Buah-buahan", description: "Buah tropis lokal dan impor segar.", keywords: ['apple', 'banana', 'orange', 'grape', 'mango', 'pineapple', 'watermelon', 'berry', 'fruit', 'apel', 'pisang', 'jeruk', 'anggur', 'mangga', 'nanas', 'semangka', 'beri', 'buah'] },
          { name: "Sayuran", description: "Sayur mayur hijau, umbi-umbian, dan lalapan.", keywords: ['spinach', 'carrot', 'broccoli', 'cabbage', 'tomato', 'potato', 'vegetable', 'corn', 'bayam', 'wortel', 'brokoli', 'kubis', 'tomat', 'kentang', 'sayur', 'jagung'] },
          { name: "Karbohidrat", description: "Sumber energi utama seperti nasi, mie, dan roti.", keywords: ['rice', 'noodle', 'bread', 'pasta', 'flour', 'grain', 'wheat', 'cereal', 'nasi', 'mie', 'roti', 'gandum', 'sereal'] }
        ]
      },
      {
        section: "Jenis Hidangan",
        categories: [
          { name: "Masakan Indonesia", description: "Hidangan tradisional nusantara dengan cita rasa autentik.", keywords: ['nasi goreng', 'sate', 'soto', 'rendang', 'gado-gado', 'bakso', 'pecel', 'gulai', 'sambal'] },
          { name: "Jajanan Pasar", description: "Kue basah, gorengan, dan camilan tradisional.", keywords: ['kue', 'cake', 'snack', 'fried', 'gorengan', 'chips', 'keripik', 'biscuit', 'biskuit'] },
          { name: "Fast Food", description: "Makanan cepat saji populer dan lokal.", keywords: ['burger', 'pizza', 'kfc', 'mcdonald', 'french fries', 'hot dog', 'kentang goreng'] }
        ]
      },
      {
        section: "Lainnya",
        categories: [
          { name: "Menu Sehat", description: "Pilihan makanan untuk gaya hidup sehat.", keywords: ['salad', 'smoothie', 'low fat', 'sugar free', 'organic', 'sehat', 'diet'] },
          { name: "Makanan Instan", description: "Mie instan, sarden kaleng, dan makanan siap saji.", keywords: ['instant', 'canned', 'sarden', 'indomie', 'pop mie', 'instan'] },
          { name: "Menu Kafe", description: "Minuman dan makanan kafe modern.", keywords: ['coffee', 'tea', 'latte', 'juice', 'soda', 'milk', 'kopi', 'teh', 'jus', 'susu'] }
        ]
      }
    ];

    const categoryMap = []; // Pakai array biar gampang di-loop buat keyword matching

    for (const group of categoryGroups) {
      for (const cat of group.categories) {
        const createdCat = await Category.create({
          name: cat.name,
          section: group.section,
          description: cat.description,
          item_count: 0
        });
        categoryMap.push({
          id: createdCat.id,
          name: cat.name,
          keywords: cat.keywords
        });
      }
    }

    console.log("📂 Reading dataset: foods_cleaned.csv...");
    const csvPath = path.join(__dirname, 'data', 'processed', 'foods_cleaned.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.warn("⚠️ Dataset file not found.");
      return;
    }

    const foodsToInsert = [];
    const counts = {};

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          const foodName = (row.food_name_en || '').toLowerCase();
          const foodNameId = (row.food_name_id || '').toLowerCase();
          
          let categoryId = null;
          
          // Cari kategori berdasarkan keyword di nama makanan
          for (const cat of categoryMap) {
            if (cat.keywords.some(kw => foodName.includes(kw) || foodNameId.includes(kw))) {
              categoryId = cat.id;
              break;
            }
          }

          // Default ke 'Lainnya -> Menu Kafe' (ID terakhir biasanya) kalau tidak ketemu
          if (!categoryId) categoryId = categoryMap[categoryMap.length - 1].id;

          counts[categoryId] = (counts[categoryId] || 0) + 1;

          foodsToInsert.push({
            food_name_en: row.food_name_en || 'Unknown Food',
            food_name_id: row.food_name_id || row.food_name_en || 'Makanan',
            calories: parseFloat(row.calories) || 0,
            protein: parseFloat(row.protein) || 0,
            carbohydrates: parseFloat(row.carbohydrates) || 0,
            total_fat: parseFloat(row.total_fat) || 0,
            category_id: categoryId
          });
        })
        .on('end', async () => {
          try {
            console.log(`📦 Inserting ${foodsToInsert.length} foods into database...`);
            const chunkSize = 200; // Ukuran chunk lebih besar biar cepat
            for (let i = 0; i < foodsToInsert.length; i += chunkSize) {
              const chunk = foodsToInsert.slice(i, i + chunkSize);
              await Food.bulkCreate(chunk);
              if (i % 1000 === 0) console.log(`... ${i} items inserted`);
            }

            for (const cat of categoryMap) {
              const count = counts[cat.id] || 0;
              await Category.update({ item_count: count }, { where: { id: cat.id } });
            }
            resolve();
          } catch (err) {
            reject(err);
          }
        })
        .on('error', (err) => reject(err));
    });

    console.log("✅ Dataset seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

module.exports = { seedData };
