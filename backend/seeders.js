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
          { name: "Protein", description: "Sumber protein hewani dan nabati." },
          { name: "Buah-buahan", description: "Buah tropis lokal dan impor segar." },
          { name: "Sayuran", description: "Sayur mayur hijau, umbi-umbian, dan lalapan." },
          { name: "Karbohidrat", description: "Sumber energi utama seperti nasi, mie, dan roti." }
        ]
      },
      {
        section: "Jenis Hidangan",
        categories: [
          { name: "Masakan Indonesia", description: "Hidangan tradisional nusantara dengan cita rasa autentik." },
          { name: "Jajanan Pasar", description: "Kue basah, gorengan, dan camilan tradisional." },
          { name: "Fast Food", description: "Makanan cepat saji populer dan lokal." }
        ]
      },
      {
        section: "Lainnya",
        categories: [
          { name: "Menu Sehat", description: "Pilihan makanan untuk gaya hidup sehat." },
          { name: "Makanan Instan", description: "Mie instan, sarden kaleng, dan makanan siap saji." },
          { name: "Menu Kafe", description: "Minuman dan makanan kafe modern." }
        ]
      }
    ];

    const categoryMap = {}; // Untuk simpan ID kategori buat mapping makanan

    for (const group of categoryGroups) {
      for (const cat of group.categories) {
        const createdCat = await Category.create({
          name: cat.name,
          section: group.section,
          description: cat.description,
          item_count: 0
        });
        categoryMap[cat.name.toLowerCase()] = createdCat;
      }
    }

    console.log("📂 Reading dataset: foods_cleaned.csv...");
    const csvPath = path.join(__dirname, 'data', 'processed', 'foods_cleaned.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.warn("⚠️ Dataset file not found. Seeding basic data only.");
      return;
    }

    const foodsToInsert = [];
    const counts = {};

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        // Logika mapping: Kita cari kategori yang cocok dari kolom 'category' di CSV (jika ada)
        // Jika tidak ada, kita coba mapping berdasarkan nama atau default ke 'Lainnya'
        let targetCatName = (row.category || 'Menu Kafe').toLowerCase();
        
        // Cari kategori yang paling mendekati di map kita
        let categoryId = null;
        for (const [name, catObj] of Object.entries(categoryMap)) {
          if (targetCatName.includes(name) || name.includes(targetCatName)) {
            categoryId = catObj.id;
            counts[catObj.id] = (counts[catObj.id] || 0) + 1;
            break;
          }
        }

        if (!categoryId) {
          // Default ke kategori pertama di 'Lainnya' jika tidak ketemu
          categoryId = categoryMap['menu kafe'].id;
          counts[categoryId] = (counts[categoryId] || 0) + 1;
        }

        foodsToInsert.push({
          food_name_en: row.food_name || row.food_name_en || 'Unknown Food',
          food_name_id: row.food_name_id || row.food_name || 'Makanan',
          calories: parseFloat(row.calories) || 0,
          protein: parseFloat(row.protein) || 0,
          carbohydrates: parseFloat(row.carbohydrates) || 0,
          total_fat: parseFloat(row.total_fat) || 0,
          category_id: categoryId
        });
      })
      .on('end', async () => {
        console.log(`📦 Inserting ${foodsToInsert.length} foods into database...`);
        
        // Insert secara chunk (biar tidak meledak memory-nya)
        const chunkSize = 100;
        for (let i = 0; i < foodsToInsert.length; i += chunkSize) {
          const chunk = foodsToInsert.slice(i, i + chunkSize);
          await Food.bulkCreate(chunk);
          if (i % 500 === 0) console.log(`... ${i} items inserted`);
        }

        // Update item_count di tabel categories
        for (const [id, count] of Object.entries(counts)) {
          await Category.update({ item_count: count }, { where: { id: id } });
        }

        console.log("✅ Dataset seeding completed successfully!");
      });

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

module.exports = { seedData };
