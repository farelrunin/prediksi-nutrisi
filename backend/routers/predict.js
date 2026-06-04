const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Food, AiFalsePrediction } = require("../models-express");
const { Op } = require("sequelize");
const aiModelService = require("../services/aiModelService");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const SECRET_KEY = process.env.SECRET_KEY;

// Helper: Database Fallback Search (Mencari makanan langsung dari database lokal MySQL)
async function searchFoodDatabase(story) {
  try {
    const stopWords = ['saya', 'makan', 'dengan', 'lalu', 'minum', 'dan', 'di', 'yang', 'untuk', 'adalah', 'itu', 'ke'];
    const keywords = story.toLowerCase().split(' ')
      .filter(word => word.length > 2 && !stopWords.includes(word));
    
    if (keywords.length === 0) return null;

    let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, quantity_grams: 0 };
    let foundFoods = [];

    for (const word of keywords) {
      const match = await Food.findOne({
        where: {
          [Op.or]: [
            { food_name_id: { [Op.like]: `%${word}%` } },
            { food_name_en: { [Op.like]: `%${word}%` } }
          ]
        },
        order: [['food_name_id', 'ASC']]
      });

      if (match) {
        foundFoods.push({ name: match.food_name_id, quantity: 1, unit: 'porsi' });
        totalNutrition.calories += match.calories || 0;
        totalNutrition.protein += match.protein || 0;
        totalNutrition.carbs += match.carbohydrates || 0;
        totalNutrition.fat += match.total_fat || 0;
        totalNutrition.quantity_grams += 100;
      }
    }

    if (foundFoods.length > 0) {
      return {
        parsed_foods: foundFoods,
        total_nutrition: totalNutrition,
        is_fallback: true
      };
    }
    return null;
  } catch (e) {
    console.error("Search Error:", e);
    return null;
  }
}

// ==============================================================================
// ROUTE: POST /predict (NLP Cerita Makanan menggunakan MySQL Local Database)
// ==============================================================================
router.post("/", async (req, res) => {
  const { story } = req.body;
  const authHeader = req.headers["authorization"];
  let userProfile = {};

  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = await User.findByPk(decoded.sub);
      if (user) {
        userProfile = {
          name: user.name,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
          nutritionGoal: user.nutrition_goal
        };
      }
    } catch (e) {}
  }

  // 1. Cari Makanan di Database Lokal (Bebas Biaya / Kuota API)
  const parsedData = await searchFoodDatabase(story);
  
  if (!parsedData) {
    return res.status(500).json({ 
      detail: "Sistem gagal mengenali makanan dari cerita Anda. Coba masukkan kata kunci yang lebih spesifik atau gunakan input manual." 
    });
  }

  const foodInfo = {
    food_name: parsedData.parsed_foods.map(f => f.name).join(", "),
    calories: parsedData.total_nutrition.calories,
    protein: parsedData.total_nutrition.protein,
    carbs: parsedData.total_nutrition.carbs,
    fat: parsedData.total_nutrition.fat
  };

  // 2. Berikan saran nutrisi secara deterministik (Aman & Patuh Aturan Dicoding)
  const aiAdvice = `Berdasarkan database gizi lokal, menu '${foodInfo.food_name}' Anda mengandung total sekitar ${Math.round(foodInfo.calories)} kalori. Pastikan porsi asupan ini sejalan dengan target kebugaran harian Anda. (Analisis Database Lokal)`;
  
  let riskLevel = "Low";
  if (parsedData.total_nutrition.calories > 2500) {
    riskLevel = "High";
  }

  res.json({
    risk_level: riskLevel,
    score: riskLevel === "High" ? 0.9 : 0.2,
    suggestion: riskLevel === "High" ? "Segera kurangi porsi asupan kalori berlebih!" : "Pola makan cukup seimbang",
    ai_advice: aiAdvice,
    food_name: foodInfo.food_name,
    ...parsedData.total_nutrition,
    quantity_grams: parsedData.total_nutrition.quantity_grams || 100,
    foods: parsedData.parsed_foods,
    parsed_data: parsedData,
    is_fallback: true
  });
});

// ==============================================================================
// ROUTE: POST /predict/recommendations (Rekomendasi Menu berbasis AKG Harian)
// ==============================================================================
router.post("/recommendations", async (req, res) => {
  const { history, profile } = req.body;
  
  // Hitung total kalori hari ini dari riwayat makan
  let totalCalories = 0;
  if (history && history.length > 0) {
    totalCalories = history.reduce((sum, item) => sum + (item.calories || 0), 0);
  }
  
  // Hasilkan rekomendasi secara dinamis & logis berdasarkan data riwayat nyata
  const recommendations = [
    {
      priority: totalCalories > 2000 ? "high" : "normal",
      title: totalCalories > 2000 ? "Batasi Asupan Kalori Tinggi" : "Kebutuhan Nutrisi Terjaga",
      message: totalCalories > 2000 
        ? "Kalori Anda hari ini mendekati ambang batas harian. Disarankan untuk membatasi camilan manis/lemak jenuh dan perbanyak air putih."
        : "Asupan kalori Anda berada di batas aman harian. Pertahankan konsumsi makanan tinggi serat dan protein rendah lemak.",
      foods: totalCalories > 2000 ? ["Air Putih", "Apel Hijau", "Sayur Bayam Bening"] : ["Dada Ayam Panggang", "Tempe Bacem", "Pisang"],
      type: "energy"
    },
    {
      priority: "normal",
      title: "Optimalkan Hidrasi Tubuh",
      message: "Konsumsi minimal 2-3 liter air putih setiap hari untuk mengoptimalkan metabolisme pencernaan dan sirkulasi darah Anda.",
      foods: ["Air Putih", "Air Kelapa Muda"],
      type: "health"
    }
  ];
  
  res.json(recommendations);
});

// ==============================================================================
// ROUTE: POST /predict-image (Inference Model TensorFlow via FastAPI)
// ==============================================================================
router.post("/predict-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ detail: "File gambar makanan tidak ditemukan." });
  }

  try {
    // === Gemini AI Guardrail (Pre-processing Filter) ===
    let isFood = true;
    try {
      const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype || "image/jpeg");
      const modelInstance = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = "Apakah gambar ini merupakan gambar makanan atau minuman? Jawab HANYA dengan kata YA atau TIDAK tanpa tanda baca tambahan.";
      
      console.log("[GUARDRAIL] Memverifikasi apakah gambar adalah makanan/minuman dengan Gemini...");
      const geminiResult = await modelInstance.generateContent([prompt, imagePart]);
      const geminiResponse = await geminiResult.response;
      const answer = geminiResponse.text().trim().toUpperCase();
      console.log(`[GUARDRAIL] Respons dari Gemini: "${answer}"`);

      // Validasi super ketat: pastikan hanya jika mengandung kata "YA" dan bukan "TIDAK"
      if (!answer.includes("YA") || answer.includes("TIDAK")) {
        isFood = false;
      }
    } catch (geminiError) {
      console.error("[GUARDRAIL] Gagal menghubungi Gemini API (kemungkinan limit kuota 429 atau masalah jaringan):", geminiError.message);
      console.log("[GUARDRAIL] Fallback aktif: Meloloskan gambar langsung ke TensorFlow agar sistem tidak crash saat presentasi.");
    }

    if (!isFood) {
      console.log("[GUARDRAIL] Pemblokiran berhasil! Gambar terdeteksi BUKAN makanan/minuman.");
      return res.status(400).json({ 
        detail: "Hei, ini bukan makanan! Tolong foto makanan yang benar ya." 
      });
    }
    
    console.log("[GUARDRAIL] Lolos! Meneruskan gambar ke model TensorFlow...");

    // 1. Kirim file gambar ke FastAPI Python engine
    const result = await aiModelService.predictFoodFromImage(req.file.buffer, req.file.originalname);

    if (!result) {
      return res.status(500).json({ 
        detail: "Gagal mendeteksi gambar dari model AI TensorFlow lokal. Pastikan server FastAPI (port 8000) sudah diaktifkan." 
      });
    }

    if (result.error) {
      console.log(`[AI ENGINE] Proteksi OOD Terpicu: ${result.message}`);
      return res.status(400).json({ 
        detail: result.message 
      });
    }

    // Map FastAPI response keys to Express expected properties
    if (result.makanan && !result.food_name) {
      result.food_name = result.makanan;
    }
    if (result.confidence_persen !== undefined && result.confidence === undefined) {
      result.confidence = result.confidence_persen / 100.0;
    }
    if (result.estimasi_nutrisi && result.calories === undefined) {
      result.calories = result.estimasi_nutrisi.calories_kcal;
      result.protein = result.estimasi_nutrisi.protein_g;
      result.carbs = result.estimasi_nutrisi.carbs_g;
      result.fat = result.estimasi_nutrisi.fat_g;
    }

    const foodInfo = {
      food_name: result.food_name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat
    };

    const parsedData = {
      parsed_foods: [
        { 
          name: result.food_name, 
          quantity: 1.0, 
          unit: "porsi", 
          nutrition: { 
            calories: result.calories, 
            protein: result.protein, 
            carbs: result.carbs, 
            fat: result.fat 
          } 
        }
      ],
      total_nutrition: {
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        quantity_grams: 100
      }
    };

    let riskLevel = "Low";
    if (result.calories > 2500) {
      riskLevel = "High";
    }

    const accuracyText = result.is_mock 
      ? "Mode simulasi model AI." 
      : `Akurasi deteksi model TensorFlow: ${(result.confidence * 100).toFixed(1)}%.`;
    
    const aiAdvice = `Makanan terdeteksi: ${result.food_name}. ${accuracyText} Mengandung sekitar ${Math.round(result.calories)} kalori. Pola makan ini cukup ideal untuk menunjang aktivitas fisik Anda.`;

    res.json({
      risk_level: riskLevel,
      score: riskLevel === "High" ? 0.9 : 0.2,
      suggestion: riskLevel === "High" ? "Segera perbaiki asupan gizi harian Anda!" : "Pola makan cukup seimbang",
      ai_advice: aiAdvice,
      food_name: foodInfo.food_name,
      confidence: result.confidence,
      confidence_persen: result.confidence_persen,
      ...parsedData.total_nutrition,
      quantity_grams: 100,
      foods: parsedData.parsed_foods,
      parsed_data: parsedData,
      is_fallback: false
    });

  } catch (error) {
    console.error("Error in /predict-image route:", error);
    res.status(500).json({ detail: "Terjadi kesalahan internal saat memproses prediksi gambar." });
  }
});

// ==============================================================================
// ROUTE: POST /predict/report-incorrect (Lapor Salah Deteksi AI)
// ==============================================================================
router.post("/report-incorrect", async (req, res) => {
  const { imageUrl, predictedClass } = req.body;
  const authHeader = req.headers["authorization"];
  let userId = null;

  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      userId = decoded.sub;
    } catch (e) {}
  }

  try {
    const report = await AiFalsePrediction.create({
      image_url: imageUrl || "",
      predicted_class: predictedClass || "Unknown",
      user_id: userId
    });
    
    res.json({
      success: true,
      message: "Laporan prediksi salah berhasil disimpan untuk melatih ulang model TensorFlow.",
      report
    });
  } catch (error) {
    console.error("Error creating false prediction report:", error);
    res.status(500).json({ detail: "Gagal menyimpan laporan kesalahan prediksi." });
  }
});

// Helper: Generasi teks evaluasi harian berbasis data secara dinamis (Fallback Cerdas)
function generateDynamicFallbackAdvice(totalNutrition, riskScore, loggedMeals = []) {
  const cal = totalNutrition.calories || 0;
  const prot = totalNutrition.protein || 0;
  const carb = totalNutrition.carbs || 0;
  const fat = totalNutrition.fat || 0;

  // Jika belum ada data sama sekali
  if (cal === 0) {
    return {
      advice: "Sistem belum mendeteksi adanya catatan asupan makanan Anda untuk hari ini. Silakan masukkan makanan/minuman yang Anda konsumsi pada menu Input Gizi untuk memulai analisis gizi harian otomatis.",
      actionableAdvice: "Catat asupan makan pagi, siang, atau camilan Anda agar asisten gizi kami dapat memberikan rekomendasi yang personal."
    };
  }

  // Identifikasi sesi makan unik yang dicatat
  const uniqueMeals = Array.from(new Set(loggedMeals.map(m => m.toLowerCase())));
  const mealCount = uniqueMeals.length;
  
  // Penamaan sesi makan bahasa Indonesia
  const mealNamesMap = {
    breakfast: "Sarapan",
    sarapan: "Sarapan",
    lunch: "Makan Siang",
    siang: "Makan Siang",
    "makan siang": "Makan Siang",
    dinner: "Makan Malam",
    malam: "Makan Malam",
    "makan malam": "Makan Malam",
    snack: "Camilan",
    camilan: "Camilan"
  };

  const formattedMeals = uniqueMeals.map(m => {
    for (const key in mealNamesMap) {
      if (m.includes(key)) return mealNamesMap[key];
    }
    return "Sesi Makan";
  });
  
  const uniqueFormattedMeals = Array.from(new Set(formattedMeals));
  const mealsText = uniqueFormattedMeals.join(", ");

  let contextText = "";
  if (mealCount <= 1) {
    contextText = `berdasarkan catatan ${mealsText || 'makanan'} Anda sejauh ini`;
  } else {
    contextText = `dari akumulasi ${mealCount} sesi makan yang Anda catat hari ini (${mealsText})`;
  }

  let calStatus = "optimal dan seimbang";
  let calDetail = "Asupan energi ini sudah cukup ideal untuk mendukung metabolisme tubuh.";
  
  // Jika baru mencatat sedikit sesi makan, batas "rendah" disesuaikan agar tidak bias
  if (mealCount <= 1) {
    if (cal < 400) {
      calStatus = "cukup ringan";
      calDetail = "Porsi ini tergolong cukup ringan untuk satu sesi makan. Lengkapi porsi makan di sesi makan berikutnya agar stamina harian Anda tetap terjaga.";
    } else if (cal > 1000) {
      calStatus = "cukup padat";
      calDetail = "Satu sesi makan ini mengandung energi yang cukup tinggi. Perhatikan porsi di sesi makan berikutnya agar asupan kalori tidak surplus berlebihan.";
    }
  } else {
    if (cal < 1200) {
      calStatus = "cukup rendah untuk ukuran harian";
      calDetail = "Untuk total harian sejauh ini, asupan energi Anda masih kurang. Pastikan untuk mencukupi kebutuhan gizi harian pada menu makan malam atau camilan sehat.";
    } else if (cal > 2200) {
      calStatus = "cukup tinggi";
      calDetail = "Akumulasi kalori Anda mendekati batas harian. Disarankan untuk membatasi camilan manis atau makanan tinggi lemak jenuh selanjutnya.";
    }
  }

  let protStatus = "tercukupi";
  if (prot < 15 && mealCount <= 1) {
    protStatus = "sedikit kurang untuk satu sesi makan";
  } else if (prot < 45 && mealCount > 1) {
    protStatus = "kurang optimal untuk kebutuhan harian";
  }

  let carbStatus = "seimbang";
  if (carb > 250) {
    carbStatus = "cukup tinggi";
  } else if (carb < 100 && mealCount > 1) {
    carbStatus = "cukup rendah untuk ukuran harian";
  }

  let fatStatus = "dalam batas normal";
  if (fat > 70) {
    fatStatus = "cukup tinggi";
  }

  const advice = `Sistem mendeteksi asupan energi Anda ${contextText} sebesar ${cal} kcal, yang tergolong ${calStatus}. ${calDetail} Kandungan protein Anda tercatat ${prot}g (${protStatus}), karbohidrat ${carb}g (${carbStatus}), dan lemak ${fat}g (${fatStatus}).`;

  // Rekomendasi Menu & Saran Taktis
  const suggestions = [];
  if (prot < 45) {
    suggestions.push("Cobalah tambahkan sumber protein seperti telur rebus, dada ayam panggang, tempe, atau tahu pada sesi makan Anda berikutnya.");
  }
  if (fat > 70) {
    suggestions.push("Batasi konsumsi gorengan atau makanan bersantan tebal untuk menjaga asupan lemak harian tetap seimbang.");
  }
  if (carb > 250) {
    suggestions.push("Kurangi porsi nasi putih atau camilan manis berlebih, ganti dengan sayuran hijau berkalori rendah atau buah-buahan tinggi serat.");
  } else if (carb < 100 && cal < 1200) {
    suggestions.push("Tambahkan karbohidrat kompleks seperti nasi merah, ubi jalar, atau oatmeal untuk membantu mencukupi kebutuhan glukosa tubuh.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Pertahankan pola makan seimbang ini dengan memperbanyak serat dari sayur dan buah segar.");
    suggestions.push("Pastikan hidrasi tubuh optimal dengan minum minimal 8 gelas air putih hari ini.");
  }

  const actionableAdvice = suggestions.slice(0, 2).join(" ");

  return { advice, actionableAdvice };
}

// ==============================================================================
// ROUTE: POST /predict/daily-insights (Generasi teks evaluasi harian berbasis data sistem)
// ==============================================================================
router.post("/daily-insights", async (req, res) => {
  const { selectedDate, totalNutrition, riskScore, loggedMeals } = req.body;
  const mealsArray = loggedMeals || [];
  
  try {
    const modelInstance = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const prompt = `Kamu adalah asisten pakar kesehatan gizi untuk aplikasi NutriAI. Sistem kami menganalisis asupan user hari ini (${selectedDate}) dengan data berikut:
- Kalori: ${totalNutrition.calories} kcal
- Protein: ${totalNutrition.protein}g
- Karbohidrat: ${totalNutrition.carbs}g
- Lemak: ${totalNutrition.fat}g
- Skor Risiko: ${riskScore}
- Sesi makan yang dicatat sejauh ini: ${mealsArray.join(", ") || "tidak ada keterangan"}

TUGAS PENTING:
Perhatikan variabel 'Sesi makan yang dicatat sejauh ini'. Jika user baru mencatat sedikit sesi makan (misal baru Sarapan saja atau Makan Siang saja), JANGAN menyebut analisis ini sebagai 'konsumsi harian total' atau menjatuhkan vonis bahwa mereka 'kekurangan gizi harian'. Sebut saja sebagai asupan 'sejauh ini' atau 'untuk sesi makan tersebut'. Berikan rekomendasi variasi makanan lokal Indonesia yang sehat.

Tanggapi HANYA dengan format JSON persis seperti berikut:
{
  "advice": "1 paragraf evaluasi ringkas, santun, dan cerdas mengenai gizi yang tercatat sejauh ini dan dampaknya bagi tubuh",
  "actionableAdvice": "1-2 kalimat saran taktis/tindakan konkret langsung untuk menyeimbangkan gizi mereka pada sesi makan berikutnya"
}
JANGAN ada penjelasan tambahan di luar JSON.`;
    
    console.log("[GEMINI] Menghasilkan evaluasi harian...");
    const geminiResult = await modelInstance.generateContent(prompt);
    const geminiResponse = await geminiResult.response;
    const answer = geminiResponse.text().trim();
    
    const parsed = JSON.parse(answer);
    res.json({
      advice: parsed.advice,
      actionableAdvice: parsed.actionableAdvice
    });
  } catch (error) {
    console.error("[GEMINI] Gagal memproses evaluasi harian (atau quota terlampaui), menggunakan fallback cerdas:", error.message);
    const fallback = generateDynamicFallbackAdvice(totalNutrition, riskScore, mealsArray);
    res.json(fallback);
  }
});

module.exports = router;
