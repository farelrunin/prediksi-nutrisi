const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
  model: "gemini-3-flash-preview",
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ]
});

// Cache in-memory untuk meminimalkan pemanggilan berulang ke Gemini
const recsCache = new Map();
const storyCache = new Map();

// Bersihkan cache secara berkala agar ram tidak bengkak
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of recsCache.entries()) {
    if (now - value.timestamp > 15 * 60 * 1000) recsCache.delete(key);
  }
  for (const [key, value] of storyCache.entries()) {
    if (now - value.timestamp > 30 * 60 * 1000) storyCache.delete(key);
  }
}, 5 * 60 * 1000);

const getAiAdvice = async (foodData, userProfile) => {
  const prompt = `
    Bertindaklah sebagai Pakar Nutrisi Profesional Indonesia yang kritis dan peduli kesehatan.
    User baru saja mencatat asupan makanan berikut:
    - Nama Makanan: ${foodData.food_name}
    - Kalori: ${foodData.calories} kkal
    - Protein: ${foodData.protein}g
    - Karbohidrat: ${foodData.carbs}g
    - Lemak: ${foodData.fat}g

    Profil User:
    - Jenis Kelamin: ${userProfile.gender || 'Tidak disebutkan'}
    - Tinggi: ${userProfile.height || '-'} cm
    - Berat: ${userProfile.weight || '-'} kg
    - Catatan Kesehatan: ${userProfile.healthNotes || 'Tidak ada'}
    - Tujuan: ${userProfile.nutritionGoal || 'Menjaga kesehatan'}

    TUGAS ANDA:
    1. SANITY CHECK: Apakah jumlah/porsi makanan ini masuk akal dan aman secara medis? 
    2. Jika porsi BERBAHAYA atau sangat EKSTREM (misal >20 telur), berikan PERINGATAN KERAS di awal jawaban.
    3. Jika porsi normal, berikan analisis singkat (maksimal 3 kalimat) tentang kecocokan dengan profil/tujuan mereka.
    
    Format jawaban: Bahasa Indonesia yang santun namun kritis jika ada bahaya kesehatan.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 200 } // Limit output tokens
    });
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Sedang tidak dapat menghubungi asisten AI saat ini.";
  }
};

const getAiRecommendations = async (historyData, profileData) => {
  const fallback = [{
    priority: "high", title: "Cek Porsi Makan", 
    message: "Pastikan asupan harian Anda seimbang dan tidak berlebihan.",
    foods: ["Air Putih", "Sayur"], type: "energy"
  }];

  const cacheKey = JSON.stringify({ history: historyData.slice(0, 5), profile: profileData });
  const cached = recsCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < 15 * 60 * 1000)) {
    console.log("⚡ [Cache Hit] Menggunakan rekomendasi ter-cache untuk menghemat token Gemini!");
    return cached.data;
  }

  const prompt = `
    Anda adalah ahli gizi AI profesional. Berikan 3 rekomendasi nutrisi JSON untuk profil ${JSON.stringify(profileData)} dan riwayat ${JSON.stringify(historyData.slice(0, 5))}.
    Jika ada asupan ekstrem (>5000 kkal), berikan peringatan medis sebagai rekomendasi pertama (priority high).
    
    Format JSON (Array of Objects): 
    [ {"priority": "high", "title": "...", "message": "...", "foods": ["..."], "type": "..."} ]
    Berikan HANYA JSON MURNI tanpa markdown.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 350 } // Limit JSON response size
    });
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(text);
    
    // Simpan ke cache
    recsCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
    return parsed;
  } catch (error) {
    console.error("Error Gemini Recommendations:", error);
    return fallback;
  }
};

const parseNaturalLanguageFood = async (text) => {
  const cacheKey = text.trim().toLowerCase();
  const cached = storyCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < 30 * 60 * 1000)) {
    console.log("⚡ [Cache Hit] Teks cerita sama persis terdeteksi, menggunakan analisis ter-cache!");
    return cached.data;
  }

  const prompt = `
    TUGAS: Ekstrak data nutrisi dari teks cerita user dalam bahasa Indonesia.
    INSTRUKSI KHUSUS: 
    - Anda adalah asisten ekstraksi data JSON.
    - Ekstrak makanan, jumlah, dan hitung estimasi nutrisi (kalori, protein, karbo, lemak).
    - Jika teks menyebutkan obat, abaikan obat tersebut.
    - JANGAN BERIKAN NARASI/PERINGATAN di luar format JSON.
    - Anda HARUS memberikan JSON murni.

    TEKS USER: "${text}"

    FORMAT JSON YANG WAJIB DIIKUTI:
    {
        "parsed_foods": [
            { "name": "...", "quantity": 1.0, "unit": "porsi", "nutrition": { "calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0 } }
        ],
        "total_nutrition": { "calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0 },
        "original_story": "..."
    }
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 400 } // Limit response size
    });
    const response = await result.response;
    const rawText = response.text().trim();
    
    console.log("--- RAW GEMINI RESPONSE ---");
    console.log(rawText);
    console.log("---------------------------");

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Gemini tidak mengembalikan format JSON!");
      return null;
    }
    
    const cleanedJson = jsonMatch[0];
    const parsed = JSON.parse(cleanedJson);
    
    if (!parsed.total_nutrition) {
      console.error("Struktur JSON tidak lengkap!");
      return null;
    }

    // Simpan ke cache
    storyCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
    return parsed;
  } catch (error) {
    console.error("Error Detail Gemini Service:", error);
    return null;
  }
};

const analyzeFoodImage = async (imageBuffer, mimeType, userProfile = {}) => {
  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType: mimeType
    }
  };

  const prompt = `
    TUGAS: Analisis gambar makanan ini dan berikan data nutrisi serta saran kesehatan dalam bahasa Indonesia.
    INSTRUKSI KHUSUS:
    - Identifikasi makanan yang ada di gambar.
    - Estimasi porsi dan hitung kandungan nutrisinya (kalori dalam kkal, protein, karbohidrat, dan lemak dalam gram).
    - Berikan asupan gizi secara total dari seluruh makanan yang terdeteksi di gambar.
    - Anda harus mengembalikan JSON murni dengan format persis di bawah ini. JANGAN berikan markdown, penjelas, atau teks pembuka/penutup.
    
    Profil User:
    - Jenis Kelamin: ${userProfile.gender || 'Tidak disebutkan'}
    - Tinggi: ${userProfile.height || '-'} cm
    - Berat: ${userProfile.weight || '-'} kg
    - Catatan Kesehatan: ${userProfile.healthNotes || 'Tidak ada'}
    - Tujuan: ${userProfile.nutritionGoal || 'Menjaga kesehatan'}

    FORMAT JSON YANG WAJIB DIIKUTI:
    {
        "parsed_foods": [
            { "name": "Nama Makanan", "quantity": 1.0, "unit": "porsi", "nutrition": { "calories": 150.0, "protein": 5.0, "carbs": 20.0, "fat": 4.0 } }
        ],
        "total_nutrition": { "calories": 150.0, "protein": 5.0, "carbs": 20.0, "fat": 4.0 },
        "ai_advice": "Analisis gizi makanan ini dan hubungannya dengan tujuan kesehatan user (maksimal 3 kalimat)."
    }
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
      generationConfig: { maxOutputTokens: 500 } // Limit response size
    });
    const response = await result.response;
    const rawText = response.text().trim();
    
    console.log("--- RAW GEMINI IMAGE RESPONSE ---");
    console.log(rawText);
    console.log("---------------------------------");

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Gemini tidak mengembalikan format JSON untuk analisis gambar!");
      return null;
    }
    
    const cleanedJson = jsonMatch[0];
    const parsed = JSON.parse(cleanedJson);
    
    if (!parsed.total_nutrition) {
      console.error("Struktur JSON tidak lengkap untuk analisis gambar!");
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Error Detail Gemini Image Service:", error);
    return null;
  }
};

module.exports = { getAiAdvice, getAiRecommendations, parseNaturalLanguageFood, analyzeFoodImage };

