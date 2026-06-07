const axios = require("axios");

/**
 * Mock/Adapter class to mimic GoogleGenerativeAI SDK but route calls to OpenAI API
 */
class MockGoogleGenerativeAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  getGenerativeModel({ model, generationConfig }) {
    return {
      generateContent: async (contents) => {
        let messages = [];
        let responseFormat = undefined;

        // Check if JSON response is requested
        if (generationConfig && generationConfig.responseMimeType === "application/json") {
          responseFormat = { type: "json_object" };
        }

        // Parse contents (can be a string or an array with image data)
        if (typeof contents === "string") {
          messages.push({
            role: "user",
            content: contents
          });
        } else if (Array.isArray(contents)) {
          let contentArray = [];
          for (const part of contents) {
            if (typeof part === "string") {
              contentArray.push({
                type: "text",
                text: part
              });
            } else if (part && part.inlineData) {
              contentArray.push({
                type: "image_url",
                image_url: {
                  url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
                }
              });
            }
          }
          messages.push({
            role: "user",
            content: contentArray
          });
        }

        // Translate request to OpenAI Chat Completion API (using gpt-4o-mini)
        const payload = {
          model: "gpt-4o-mini",
          messages: messages
        };

        if (responseFormat) {
          payload.response_format = responseFormat;
        }

        console.log("[GEMINI ADAPTER] Processing request via OpenAI translation layer (stealth mode)...");
        
        try {
          const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.apiKey}`
            }
          });

          const textContent = response.data.choices[0].message.content;

          return {
            response: {
              text: () => textContent
            }
          };
        } catch (error) {
          const errMsg = error.response && error.response.data && error.response.data.error 
            ? error.response.data.error.message 
            : error.message;
          console.error("[GEMINI ADAPTER] OpenAI API Call failed:", errMsg);
          throw new Error(errMsg);
        }
      }
    };
  }
}

/**
 * Helper: Panggil Gemini dengan Rotasi API Key (Menggunakan Mock Adapter OpenAI di bawah tenda)
 * @param {Function} callback - Fungsi callback yang menerima instance MockGoogleGenerativeAI
 */
async function callGeminiWithRotation(callback) {
  const keysInput = process.env.GEMINI_API_KEY || "";
  const keys = keysInput.split(/[\r\n,]+/).map(k => k.trim()).filter(k => k.length > 0);

  if (keys.length === 0) {
    throw new Error("No Gemini/OpenAI API Keys configured.");
  }

  let lastError = null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const currentGenAI = new MockGoogleGenerativeAI(key);
      return await callback(currentGenAI);
    } catch (error) {
      console.warn(`[GEMINI ADAPTER] Key Index ${i} failed. Trying next key if available...`);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All API keys failed.");
}

/**
 * Helper: Konversi file buffer ke format bagian generatif
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
