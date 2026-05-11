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
    const result = await model.generateContent(prompt);
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

  const prompt = `
    Anda adalah ahli gizi AI profesional. Berikan 3 rekomendasi nutrisi JSON untuk profil ${JSON.stringify(profileData)} dan riwayat ${JSON.stringify(historyData.slice(0, 5))}.
    Jika ada asupan ekstrem (>5000 kkal), berikan peringatan medis sebagai rekomendasi pertama (priority high).
    
    Format JSON (Array of Objects): 
    [ {"priority": "high", "title": "...", "message": "...", "foods": ["..."], "type": "..."} ]
    Berikan HANYA JSON MURNI tanpa markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error Gemini Recommendations:", error);
    return fallback;
  }
};

const parseNaturalLanguageFood = async (text) => {
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
    console.log("--- CALLING GEMINI AI ---");
    console.log("Input text:", text);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();
    
    console.log("--- RAW GEMINI RESPONSE ---");
    console.log(rawText);
    console.log("---------------------------");

    // Cari bagian yang berbentuk JSON (di antara kurung kurawal)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Gemini tidak mengembalikan format JSON!");
      return null;
    }
    
    const cleanedJson = jsonMatch[0];
    const parsed = JSON.parse(cleanedJson);
    
    // Pastikan struktur dasar ada
    if (!parsed.total_nutrition) {
      console.error("Struktur JSON tidak lengkap!");
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Error Detail Gemini Service:", error);
    // Log error spesifik dari API Google
    if (error.response) {
      console.error("Gemini API Response Error:", error.response);
    }
    return null;
  }
};

module.exports = { getAiAdvice, getAiRecommendations, parseNaturalLanguageFood };
