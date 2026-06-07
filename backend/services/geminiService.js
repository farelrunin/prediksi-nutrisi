const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Helper: Panggil Gemini dengan Rotasi API Key jika terkena limit kuota (429)
 * @param {Function} callback - Fungsi callback yang menerima instance GoogleGenerativeAI
 */
async function callGeminiWithRotation(callback) {
  const keysInput = process.env.GEMINI_API_KEY || "";
  const keys = keysInput.split(/[\r\n,]+/).map(k => k.trim()).filter(k => k.length > 0);

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

/**
 * Helper: Konversi file buffer ke format bagian generatif Gemini
 * @param {Buffer} buffer 
 * @param {string} mimeType 
 */
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}

module.exports = {
  callGeminiWithRotation,
  fileToGenerativePart
};
