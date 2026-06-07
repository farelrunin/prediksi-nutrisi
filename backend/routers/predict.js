const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Food, AiFalsePrediction } = require("../models-express");
const { Op } = require("sequelize");
const aiModelService = require("../services/aiModelService");
const multer = require("multer");
const geminiService = require("../services/geminiService");

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

function calculateTDEE(profile) {
  const height = Number(profile.height) || 0;
  const weight = Number(profile.weight) || 0;
  const age = Number(profile.age) || 25;
  const gender = String(profile.gender || 'male').toLowerCase();
  const activity = String(profile.activityLevel || profile.activity_level || 'moderate').toLowerCase();

  if (height === 0 || weight === 0) {
    return 2000;
  }

  // BMR Mifflin-St Jeor
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male' || gender === 'laki-laki' || gender === 'pria') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Activity Multiplier
  let multiplier = 1.2;
  if (activity.includes('light') || activity.includes('ringan')) {
    multiplier = 1.375;
  } else if (activity.includes('moderate') || activity.includes('sedang') || (activity.includes('aktif') && !activity.includes('sangat'))) {
    multiplier = 1.55;
  } else if (activity.includes('very') || activity.includes('sangat')) {
    multiplier = 1.9;
  }

  return Math.round(bmr * multiplier);
}

// ==============================================================================
// ROUTE: POST /predict/recommendations (Rekomendasi Menu berbasis AKG Harian)
// ==============================================================================
router.post("/recommendations", async (req, res) => {
  const { history, profile, language } = req.body;
  const isEn = language === "en";
  const userProfile = profile || {};
  const calorieTarget = calculateTDEE(userProfile);
  
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
    const answer = await geminiService.callGeminiWithRotation(async (rotatedGenAI) => {
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
      const mapped = parsedRecommendations.map(rec => ({ ...rec, is_ai: true }));
      return res.json(mapped);
    }
  } catch (error) {
    console.error("[GEMINI] Gagal memuat rekomendasi kustom, menggunakan fallback lokal:", error.message);
  }

  // --- FALLBACK LOKAL / DETERMINISTIK JIKA GEMINI GAGAL / TIDAK AKTIF ---
  let userBmi = 22; // Default normal
  if (userProfile.weight && userProfile.height) {
    const heightM = userProfile.height / 100;
    userBmi = userProfile.weight / (heightM * heightM);
  }

  let fallbackRecommendations = [];

  if (userBmi < 18.5) {
    // Mode Underweight / Bulking
    fallbackRecommendations = [
      {
        priority: "high",
        title: isEn ? "Healthy Calorie Surplus" : "Surplus Kalori Sehat (Massa Otot)",
        message: isEn
          ? "Based on your BMI, focus on nutrient-dense foods high in calories and quality protein to gain weight safely."
          : "Berdasarkan BMI kamu, fokuslah pada makanan padat nutrisi tinggi kalori dan protein berkualitas tinggi untuk menaikkan berat badan secara aman.",
        foods: isEn ? ["Full Cream Milk", "Beef", "Almonds"] : ["Susu Full Cream", "Daging Sapi", "Kacang Almond"],
        type: "protein"
      },
      {
        priority: "medium",
        title: isEn ? "Additional Complex Carbs" : "Karbohidrat Kompleks Tambahan",
        message: isEn
          ? "Add portions of complex carbohydrates between main meals to maintain a calorie surplus."
          : "Tambahkan porsi karbohidrat kompleks di sela waktu makan utama untuk menjaga suplai energi harian agar tetap surplus.",
        foods: isEn ? ["Baked Potato", "Oatmeal", "Banana"] : ["Kentang Panggang", "Oatmeal", "Pisang"],
        type: "energy"
      }
    ];
  } else if (userBmi >= 25) {
    // Mode Overweight / Cutting
    fallbackRecommendations = [
      {
        priority: "high",
        title: isEn ? "Control Calorie Deficit" : "Kontrol Defisit Kalori",
        message: isEn
          ? "To achieve your ideal weight, prioritize foods high in fiber and protein that keep you full longer, and avoid fried foods."
          : "Untuk mencapai berat badan ideal, prioritaskan makanan tinggi serat dan protein yang mengenyangkan lebih lama, serta hindari gorengan.",
        foods: isEn ? ["Boiled Chicken Breast", "Spinach", "Green Apple"] : ["Dada Ayam Rebus", "Sayur Bayam", "Apel Hijau"],
        type: "health"
      },
      {
        priority: "medium",
        title: isEn ? "Healthy Snack Substitution" : "Substitusi Camilan",
        message: isEn
          ? "Replace sweet snacks with fresh fruits to control blood sugar spikes."
          : "Ganti camilan manismu dengan buah-buahan segar untuk mengontrol lonjakan gula darah.",
        foods: isEn ? ["Pear", "Plain Yogurt", "Edamame"] : ["Pir", "Yoghurt Plain", "Edamame"],
        type: "fiber"
      }
    ];
  } else {
    // Mode Normal / Maintenance
    fallbackRecommendations = [
      {
        priority: "normal",
        title: isEn ? "Nutritional Needs Met" : "Kebutuhan Nutrisi Terjaga",
        message: isEn
          ? "Your BMI is very ideal. Maintain consumption of high-fiber foods and low-fat protein to keep your current body composition."
          : "BMI kamu sangat ideal. Pertahankan konsumsi makanan tinggi serat dan protein rendah lemak untuk menjaga komposisi tubuh saat ini.",
        foods: isEn ? ["Grilled Chicken Breast", "Tempeh", "Fresh Vegetables"] : ["Dada Ayam Panggang", "Tempe", "Sayuran Segar"],
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
  }

  const mappedFallback = fallbackRecommendations.map(rec => ({ ...rec, is_ai: false }));
  res.json(mappedFallback);
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
      const imagePart = geminiService.fileToGenerativePart(req.file.buffer, req.file.mimetype || "image/jpeg");
      const prompt = "Apakah gambar ini merupakan gambar makanan atau minuman? Jawab HANYA dengan kata YA atau TIDAK tanpa tanda baca tambahan.";
      
      console.log("[GUARDRAIL] Memverifikasi apakah gambar adalah makanan/minuman dengan Gemini...");
      const geminiResponseText = await geminiService.callGeminiWithRotation(async (rotatedGenAI) => {
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

// Helper untuk memilih elemen acak dari array
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper: Generasi teks evaluasi harian berbasis data secara dinamis (Fallback Cerdas)
function generateDynamicFallbackAdvice(totalNutrition, riskScore, loggedMeals = []) {
  const cal = totalNutrition.calories || 0;
  const prot = totalNutrition.protein || 0;
  const carb = totalNutrition.carbs || 0;
  const fat = totalNutrition.fat || 0;

  if (cal === 0) {
    return {
      advice: "Buku harian makananmu masih kosong hari ini. Yuk, mulai catat apa yang kamu makan agar sistem bisa melacak nutrisimu!",
      actionableAdvice: "Catat sarapan atau camilan pertamamu hari ini."
    };
  }

  const uniqueMeals = Array.from(new Set(loggedMeals.map(m => m.toLowerCase())));
  const mealCount = uniqueMeals.length;
  
  const mealNamesMap = {
    breakfast: "Sarapan", sarapan: "Sarapan",
    lunch: "Makan Siang", siang: "Makan Siang", "makan siang": "Makan Siang",
    dinner: "Makan Malam", malam: "Makan Malam", "makan malam": "Makan Malam",
    snack: "Camilan", camilan: "Camilan"
  };

  const formattedMeals = uniqueMeals.map(m => {
    for (const key in mealNamesMap) {
      if (m.includes(key)) return mealNamesMap[key];
    }
    return "sesi makanmu";
  });
  
  const mealsText = Array.from(new Set(formattedMeals)).join(" dan ");

  // Variasi Pembuka
  const intros = [
    `Berdasarkan catatan ${mealsText} sejauh ini, sistem mencatat asupan energimu di angka ${cal} kkal.`,
    `Dari ${mealsText} yang kamu masukkan, total energimu baru mencapai ${cal} kkal.`,
    `Pantauan gizi dari ${mealsText} menunjukkan asupan sebesar ${cal} kkal.`
  ];
  let adviceText = pickRandom(intros) + " ";

  // Evaluasi Kalori Dinamis
  if (cal < 400) {
    adviceText += pickRandom([
      "Porsi ini terbilang cukup ringan. Pastikan kamu makan lebih padat di sesi berikutnya agar staminamu tidak drop.",
      "Angka ini masih tergolong minim untuk mendukung aktivitas penuhmu.",
      "Sepertinya kamu butuh asupan tambahan nanti untuk menjaga energi harianmu."
    ]);
  } else if (cal > 1000) {
    adviceText += pickRandom([
      "Sesi makan ini cukup padat kalori. Coba seimbangkan dengan porsi yang lebih ringan nanti ya.",
      "Asupan ini tergolong tinggi energi. Kurangi camilan berat setelah ini untuk menjaga keseimbangan."
    ]);
  } else {
    adviceText += "Porsi ini sangat pas dan ideal untuk menjaga metabolisme tubuhmu tetap optimal.";
  }

  // Evaluasi Makro (Bisa ditambah variasinya)
  adviceText += ` Sebagai catatan, proteinmu berada di ${prot}g, karbohidrat ${carb}g, dan lemak ${fat}g.`;

  // Variasi Saran Taktis
  let actionableAdvice = "";
  if (prot < 15) {
    actionableAdvice = pickRandom([
      "Saran: Tambahkan sumber protein murah meriah seperti telur rebus atau tempe bacem di menu selanjutnya.",
      "Untuk sesi berikutnya, coba selipkan dada ayam atau tahu agar ototmu punya cukup nutrisi."
    ]);
  } else if (carb > 100) {
    actionableAdvice = pickRandom([
      "Saran: Kurangi sedikit porsi nasimu nanti, ganti dengan sayuran hijau agar seratmu bertambah.",
      "Porsi karbohidratmu lumayan tinggi. Coba hindari minuman manis dulu untuk hari ini."
    ]);
  } else {
    actionableAdvice = "Pertahankan pola makan seimbang ini, dan jangan lupa penuhi cairan tubuhmu dengan air putih!";
  }

  return { advice: adviceText.trim(), actionableAdvice };
}

// ==============================================================================
// ROUTE: POST /predict/daily-insights (Generasi teks evaluasi harian berbasis data sistem)
// ==============================================================================
router.post("/daily-insights", async (req, res) => {
  const { selectedDate, totalNutrition, riskScore, loggedMeals, language, userProfile } = req.body;
  const mealsArray = loggedMeals || [];
  const lang = language === "en" ? "en" : "id";
  const isEn = lang === "en";
  
  try {
    const prompt = isEn
      ? `You are an empathetic, professional clinical nutritionist for the NutriAI app.
Analyze the user's intake today (${selectedDate}):
- Calories: ${totalNutrition.calories} kcal
- Protein: ${totalNutrition.protein}g
- Carbs: ${totalNutrition.carbs}g
- Fat: ${totalNutrition.fat}g
- Logged Meals: ${mealsArray.join(", ") || "None"}

CRITICAL RULES:
1. Context Aware: If "Logged Meals" is only 1 or 2 items (e.g., only Breakfast), DO NOT judge their overall daily intake as deficient. Use phrases like "so far today" or "for this meal".
2. Actionable: Suggest 1-2 specific local Indonesian foods to balance their next meal.
3. Output: MUST be a strict JSON object with NO markdown wrapping, NO backticks, and NO extra text.

Example Output:
{
  "advice": "Your energy intake from breakfast so far is 450 kcal, which is a great start to fuel your morning metabolism. Your protein is well-balanced, but your carbs are slightly low.",
  "actionableAdvice": "For lunch, try adding complex carbohydrates like brown rice or boiled potatoes to sustain your energy."
}`
      : `Kamu adalah "NutriAI", seorang Ahli Gizi Klinis dan Personal Trainer bersertifikat yang empatik, cerdas, dan suportif. 
Tugasmu adalah menganalisis asupan gizi pengguna secara real-time dan memberikan insight harian yang terasa seperti obrolan dengan manusia asli (luwes, tidak monoton, dan bervariasi setiap kali ditanya).

DATA ASUPAN HARI INI (${selectedDate}):
- Sesi makan yang dicatat sejauh ini: ${mealsArray.length > 0 ? mealsArray.join(", ") : "Belum ada catatan"}
- Kalori: ${totalNutrition.calories} kcal
- Protein: ${totalNutrition.protein} g
- Karbohidrat: ${totalNutrition.carbs} g
- Lemak: ${totalNutrition.fat} g
- Skor Risiko: ${riskScore}
- BMI/Kondisi Pengguna: ${userProfile?.bmi || "Normal"}

ATURAN WAJIB (STRICT RULES):
1. GAYA BAHASA: Santai tapi profesional, empatik, dan suportif. JANGAN PERNAH menggunakan bahasa robotik atau repetitif seperti "Sistem mendeteksi asupan energi Anda...". Gunakan variasi frasa pembuka yang natural (contoh: "Wah, dari catatan makanmu...", "Asupanmu sejauh ini...", "Melihat menu yang kamu catat...").
2. PEKA KONTEKS WAKTU: Jika sesi makan yang dicatat baru sedikit (misal hanya Sarapan/Camilan), JANGAN menghakimi bahwa gizi mereka kurang untuk satu hari penuh. Evaluasi hanya berdasarkan porsi sesi tersebut.
3. AKURASI MEDIS & GIZI: Analisis makronutrisi (Protein, Karbo, Lemak) harus berdasar sains. Jika kalori defisit ekstrim, beri peringatan suportif. Jika surplus, sarankan aktivitas fisik ringan atau defisit di sesi berikutnya.
4. REKOMENDASI LOKAL (ACTIONABLE): WAJIB menyebutkan 2-3 contoh makanan/minuman LOKAL INDONESIA yang spesifik, murah, dan mudah dicari (contoh: tempe bacem, sayur bening bayam, pepaya, dada ayam, air kelapa) untuk menyeimbangkan makro yang kurang atau berlebih.
5. TANPA BASA-BASI: Dilarang keras memberikan salam pembuka/penutup, markdown, atau teks apapun di luar JSON.

FORMAT OUTPUT WAJIB (JSON MURNI):
{
  "advice": "1 paragraf (3-4 kalimat) evaluasi gizi yang sangat luwes, membedah komposisi kalori dan makronutrisi saat ini dengan gaya bahasa yang selalu bervariasi dan suportif.",
  "actionableAdvice": "1-2 kalimat saran taktis langsung eksekusi untuk sesi makan selanjutnya, sebutkan nama makanan lokal Indonesia yang sesuai dengan kebutuhan makro saat ini."
}`;
    
    console.log("[GEMINI] Menghasilkan evaluasi harian...");
    const answer = await geminiService.callGeminiWithRotation(async (rotatedGenAI) => {
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
      actionableAdvice: parsed.actionableAdvice,
      is_ai: true
    });
  } catch (error) {
    console.error("[GEMINI] Gagal memproses evaluasi harian (atau quota terlampaui), menggunakan fallback cerdas:", error.message);
    const fallback = generateDynamicFallbackAdvice(totalNutrition, riskScore, mealsArray, lang);
    res.json({
      ...fallback,
      is_ai: false
    });
  }
});

module.exports = router;
