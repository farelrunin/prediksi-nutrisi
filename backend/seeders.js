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
          { name: "Protein", description: "Sumber protein hewani dan nabati.", keywords: ['chicken', 'beef', 'egg', 'fish', 'meat', 'tofu', 'tempeh', 'shrimp', 'crab', 'pork', 'lamb', 'ayam', 'sapi', 'telur', 'ikan', 'daging', 'tahu', 'tempe', 'udang', 'kepiting', 'duck', 'bebek', 'seafood'] },
          { name: "Buah-buahan", description: "Buah tropis lokal dan impor segar.", keywords: ['apple', 'banana', 'orange', 'grape', 'mango', 'pineapple', 'watermelon', 'berry', 'fruit', 'apel', 'pisang', 'jeruk', 'anggur', 'mangga', 'nanas', 'semangka', 'beri', 'buah', 'papaya', 'pepaya', 'melon'] },
          { name: "Sayuran", description: "Sayur mayur hijau, umbi-umbian, dan lalapan.", keywords: ['spinach', 'carrot', 'broccoli', 'cabbage', 'tomato', 'potato', 'vegetable', 'corn', 'bayam', 'wortel', 'brokoli', 'kubis', 'tomat', 'kentang', 'sayur', 'jagung', 'kangkung', 'sawi', 'terong', 'eggplant'] },
          { name: "Karbohidrat", description: "Sumber energi utama seperti nasi, mie, dan roti.", keywords: ['rice', 'noodle', 'bread', 'pasta', 'flour', 'grain', 'wheat', 'cereal', 'nasi', 'mie', 'roti', 'gandum', 'sereal', 'oat', 'bubur', 'porridge'] }
        ]
      },
      {
        section: "Jenis Hidangan",
        categories: [
          { name: "Masakan Indonesia", description: "Hidangan tradisional nusantara dengan cita rasa autentik.", keywords: ['nasi goreng', 'sate', 'soto', 'rendang', 'gado-gado', 'bakso', 'pecel', 'gulai', 'sambal', 'lontong', 'rawon', 'tumpeng'] },
          { name: "Jajanan Pasar", description: "Kue basah, gorengan, dan camilan tradisional.", keywords: ['kue', 'cake', 'snack', 'fried', 'gorengan', 'chips', 'keripik', 'biscuit', 'biskuit', 'pastry', 'donut', 'donat'] },
          { name: "Fast Food", description: "Makanan cepat saji populer dan lokal.", keywords: ['burger', 'pizza', 'kfc', 'mcdonald', 'french fries', 'hot dog', 'kentang goreng', 'nugget'] }
        ]
      },
      {
        section: "Lainnya",
        categories: [
          { name: "Menu Sehat", description: "Pilihan makanan untuk gaya hidup sehat.", keywords: ['salad', 'smoothie', 'low fat', 'sugar free', 'organic', 'sehat', 'diet', 'yogurt', 'muesli'] },
          { name: "Makanan Instan", description: "Mie instan, sarden kaleng, dan makanan siap saji.", keywords: ['instant', 'canned', 'sarden', 'indomie', 'pop mie', 'instan', 'kornet', 'spam'] },
          { name: "Menu Kafe", description: "Minuman dan makanan kafe modern.", keywords: ['coffee', 'tea', 'latte', 'juice', 'soda', 'milk', 'kopi', 'teh', 'jus', 'susu', 'water', 'air', 'coke', 'beer'] }
        ]
      }
    ];

    const categoryMap = [];

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
    
    if (!fs.existsSync(csvPath)) return;

    const foodsToInsert = [];
    const counts = {};

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Bersihkan data dari spasi aneh
          const rawNameEn = row.food_name_en || row['food_name_en'] || '';
          const rawNameId = row.food_name_id || row['food_name_id'] || '';
          
          const foodName = rawNameEn.toLowerCase().trim();
          const foodNameId = rawNameId.toLowerCase().trim();
          
          let categoryId = null;
          
          // Cek Kategori dengan prioritas
          for (const cat of categoryMap) {
            if (cat.keywords.some(kw => foodName.includes(kw) || foodNameId.includes(kw))) {
              categoryId = cat.id;
              break;
            }
          }

          // Kalau tetap tidak ketemu, masukkan ke 'Masakan Indonesia' (biar nggak numpuk di Kafe terus)
          if (!categoryId) categoryId = categoryMap[4].id; // Index 4 itu Masakan Indonesia

          counts[categoryId] = (counts[categoryId] || 0) + 1;

          foodsToInsert.push({
            food_name_en: rawNameEn || 'Unknown Food',
            food_name_id: rawNameId || rawNameEn || 'Makanan',
            calories: parseFloat(row.calories) || 0,
            protein: parseFloat(row.protein) || 0,
            carbohydrates: parseFloat(row.carbohydrates) || 0,
            total_fat: parseFloat(row.total_fat) || 0,
            category_id: categoryId
          });
        })
        .on('end', async () => {
          try {
            console.log(`📦 Inserting ${foodsToInsert.length} foods...`);
            const chunkSize = 500; 
            for (let i = 0; i < foodsToInsert.length; i += chunkSize) {
              await Food.bulkCreate(foodsToInsert.slice(i, i + chunkSize));
              if (i % 2000 === 0) console.log(`... ${i} items`);
            }

            for (const cat of categoryMap) {
              await Category.update({ item_count: counts[cat.id] || 0 }, { where: { id: cat.id } });
            }
            resolve();
          } catch (err) { reject(err); }
        })
        .on('error', (err) => reject(err));
    });

    console.log("✅ Dataset seeding completed successfully!");
  } catch (error) { console.error("❌ Seeding failed:", error); }
};

module.exports = { seedData };
