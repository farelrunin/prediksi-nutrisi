const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Food, AiFalsePrediction } = require("../models-express");
const { Op } = require("sequelize");
const aiModelService = require("../services/aiModelService");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper: Panggil Gemini dengan Rotasi API Key jika terkena limit kuota (429)
async function callGeminiWithRotation(callback) {
  const keysInput = process.env.GEMINI_API_KEY || "";
  const keys = keysInput.split(",").map(k => k.trim()).filter(k => k.length > 0);

  if (keys.length === 0) {
    throw new Error("No Gemini API Keys configured.");
  }

  let lastError = null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const currentGenAI = new GoogleGenerativeAI(key);
      return await callback(currentGenAI);
    } catch (error) {
      const errMsg = error.message || "";
      console.warn(`[GEMINI ROTATION] Gagal menggunakan Key Index ${i} (${key.substring(0, 10)}...):`, errMsg);
      
      // Jika eror rate limit atau quota, atau masih ada key cadangan lainnya
      if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("limit") || i < keys.length - 1) {
        lastError = error;
        console.log(`[GEMINI ROTATION] Mencoba beralih ke Key berikutnya...`);
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error("All Gemini API keys failed.");
}

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
  const { history, profile, language } = req.body;
  const isEn = language === "en";
  const userProfile = profile || {};
  
  // Hitung total kalori hari ini dari riwayat makan untuk fallback atau data prompt
  let totalCalories = 0;
  if (history && history.length > 0) {
    totalCalories = history.reduce((sum, item) => sum + (item.calories || 0), 0);
  }

  // --- COBA MEMANGGIL GEMINI AI UNTUK REKOMENDASI DINAMIS ---
  try {
    const prompt = isEn
      ? `You are a professional nutrition expert assistant for the NutriAI application. Your task is to generate 2 highly personalized nutritional and lifestyle recommendations for the user based on their physical profile and daily food history:
Physical Profile:
- Height: ${userProfile.height || "unknown"} cm
- Weight: ${userProfile.weight || "unknown"} kg
- Age: ${userProfile.age || "unknown"} years old
- Gender: ${userProfile.gender || "unknown"}
- Activity Level: ${userProfile.activityLevel || "unknown"}
- Medical/Special Conditions: ${userProfile.conditions?.join(", ") || "None"}

Food History Today (Max 5 recent meals):
${JSON.stringify(history || [])}

Respond ONLY with a valid JSON format of an array of 2 recommendation objects matching this schema:
[
  {
    "priority": "high" | "medium" | "low",
    "title": "Short and engaging recommendation title",
    "message": "Detailed and actionable advice tailored to their physical condition and intake",
    "foods": ["List of 3-4 supportive healthy foods/beverages"],
    "type": "protein" | "fiber" | "iron" | "energy" | "calcium" | "health"
  }
]
DO NOT include any explanation or markdown formatting outside the JSON.`
      : `Kamu adalah pakar gizi profesional untuk aplikasi NutriAI. Tugasmu adalah memberikan 2 rekomendasi nutrisi dan gaya hidup yang sangat personal untuk pengguna berdasarkan data profil fisik dan riwayat makanan harian mereka:
Profil Fisik:
- Tinggi Badan: ${userProfile.height || "tidak diketahui"} cm
- Berat Badan: ${userProfile.weight || "tidak diketahui"} kg
- Umur: ${userProfile.age || "tidak diketahui"} tahun
- Gender: ${userProfile.gender || "tidak diketahui"}
- Tingkat Aktivitas: ${userProfile.activityLevel || "tidak diketahui"}
- Kondisi Medis/Khusus: ${userProfile.conditions?.join(", ") || "Tidak ada"}

Riwayat Makanan Hari Ini (Maksimal 5 terakhir):
${JSON.stringify(history || [])}

Tanggapi HANYA dengan format JSON berupa array dari 2 objek rekomendasi dengan skema berikut:
[
  {
    "priority": "high" | "medium" | "low",
    "title": "Judul rekomendasi singkat dan menarik",
    "message": "Saran detail dan praktis berdasarkan kondisi fisik dan asupan mereka",
    "foods": ["Daftar 3-4 makanan/minuman sehat pendukung (dalam bahasa Indonesia)"],
    "type": "protein" | "fiber" | "iron" | "energy" | "calcium" | "health"
  }
]
JANGAN ada penjelasan tambahan di luar JSON.`;

    console.log("[GEMINI] Menghasilkan rekomendasi gizi kustom...");
    const answer = await callGeminiWithRotation(async (rotatedGenAI) => {
      const modelInstance = rotatedGenAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const geminiResult = await modelInstance.generateContent(prompt);
      const response = await geminiResult.response;
      return response.text().trim();
    });
    
    const parsedRecommendations = JSON.parse(answer);
    if (Array.isArray(parsedRecommendations) && parsedRecommendations.length > 0) {
      return res.json(parsedRecommendations);
    }
  } catch (error) {
    console.error("[GEMINI] Gagal memuat rekomendasi kustom, menggunakan fallback lokal:", error.message);
  }

  // --- FALLBACK LOKAL / DETERMINISTIK JIKA GEMINI GAGAL / TIDAK AKTIF ---
  const fallbackRecommendations = [
    {
      priority: totalCalories > 2000 ? "high" : "normal",
      title: totalCalories > 2000 
        ? (isEn ? "Limit High Calorie Intake" : "Batasi Asupan Kalori Tinggi") 
        : (isEn ? "Nutritional Needs Met" : "Kebutuhan Nutrisi Terjaga"),
      message: totalCalories > 2000 
        ? (isEn 
            ? "Your calories today are close to the daily limit. It is recommended to limit sweet snacks/saturated fat and drink plenty of water."
            : "Kalori Anda hari ini mendekati ambang batas harian. Disarankan untuk membatasi camilan manis/lemak jenuh dan perbanyak air putih.")
        : (isEn 
            ? "Your calorie intake is within the safe daily limit. Maintain consumption of high-fiber foods and low-fat protein."
            : "Asupan kalori Anda berada di batas aman harian. Pertahankan konsumsi makanan tinggi serat dan protein rendah lemak."),
      foods: totalCalories > 2000 
        ? (isEn ? ["Water", "Green Apple", "Clear Spinach Soup"] : ["Air Putih", "Apel Hijau", "Sayur Bayam Bening"]) 
        : (isEn ? ["Grilled Chicken Breast", "Tempeh", "Banana"] : ["Dada Ayam Panggang", "Tempe Bacem", "Pisang"]),
      type: "energy"
    },
    {
      priority: "normal",
      title: isEn ? "Optimize Body Hydration" : "Optimalkan Hidrasi Tubuh",
      message: isEn 
        ? "Consume at least 2-3 liters of water daily to optimize digestion, metabolism, and blood circulation."
        : "Konsumsi minimal 2-3 liter air putih setiap hari untuk mengoptimalkan metabolisme pencernaan dan sirkulasi darah Anda.",
      foods: isEn ? ["Water", "Fresh Coconut Water"] : ["Air Putih", "Air Kelapa Muda"],
      type: "health"
    }
  ];
  
  res.json(fallbackRecommendations);
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
      const prompt = "Apakah gambar ini merupakan gambar makanan atau minuman? Jawab HANYA dengan kata YA atau TIDAK tanpa tanda baca tambahan.";
      
      console.log("[GUARDRAIL] Memverifikasi apakah gambar adalah makanan/minuman dengan Gemini...");
      const geminiResponseText = await callGeminiWithRotation(async (rotatedGenAI) => {
        const modelInstance = rotatedGenAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const geminiResult = await modelInstance.generateContent([prompt, imagePart]);
        const response = await geminiResult.response;
        return response.text();
      });

      const answer = geminiResponseText.trim().toUpperCase();
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
  const { selectedDate, totalNutrition, riskScore, loggedMeals, language } = req.body;
  const mealsArray = loggedMeals || [];
  const lang = language === "en" ? "en" : "id";
  const isEn = lang === "en";
  
  try {
    const prompt = isEn
      ? `You are a professional nutrition expert assistant for the NutriAI application. Our system has analyzed the user's intake today (${selectedDate}) with the following data:
- Calories: ${totalNutrition.calories} kcal
- Protein: ${totalNutrition.protein}g
- Carbohydrates: ${totalNutrition.carbs}g
- Fat: ${totalNutrition.fat}g
- Risk Score: ${riskScore}
- Meals logged so far today: ${mealsArray.join(", ") || "none specified"}

IMPORTANT TASK:
Pay attention to the 'Meals logged so far today' variable. If the user has only logged a few meals (e.g., only Breakfast or only Lunch), DO NOT describe this analysis as a 'total daily intake' or claim they are 'deficient' for the whole day. Refer to it as intake 'so far' or 'for that specific meal'. Suggest healthy local Indonesian/common food variations.

Respond ONLY with a valid JSON in this exact format:
{
  "advice": "1 paragraph of brief, polite, and smart nutrition evaluation so far and its impact on the body",
  "actionableAdvice": "1-2 sentences of tactical/concrete advice for balancing their nutrition in their next meal"
}
DO NOT include any explanation or backticks outside the JSON.`
      : `Kamu adalah asisten pakar kesehatan gizi untuk aplikasi NutriAI. Sistem kami menganalisis asupan user hari ini (${selectedDate}) dengan data berikut:
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
    const answer = await callGeminiWithRotation(async (rotatedGenAI) => {
      const modelInstance = rotatedGenAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const geminiResult = await modelInstance.generateContent(prompt);
      const response = await geminiResult.response;
      return response.text().trim();
    });
    
    const parsed = JSON.parse(answer);
    res.json({
      advice: parsed.advice,
      actionableAdvice: parsed.actionableAdvice
    });
  } catch (error) {
    console.error("[GEMINI] Gagal memproses evaluasi harian (atau quota terlampaui), menggunakan fallback cerdas:", error.message);
    const fallback = generateDynamicFallbackAdvice(totalNutrition, riskScore, mealsArray, lang);
    res.json(fallback);
  }
});

module.exports = router;
