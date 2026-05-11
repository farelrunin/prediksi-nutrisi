const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: '.env' });

async function test() {
  const key = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", key ? key.substring(0, 10) + "..." : "MISSING");
  
  if (!key) {
    console.error("No GEMINI_API_KEY found in backend/.env");
    return;
  }

  const genAI = new GoogleGenerativeAI(key);

  try {
    // There isn't a direct listModels in the genAI client usually without extra steps, 
    // but we can try a simple request to a very basic model.
    console.log("Testing with gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello in Indonesian");
    console.log("AI Response:", (await result.response).text());
    console.log("✅ API Key is WORKING!");
  } catch (error) {
    console.error("❌ API Key is NOT WORKING!");
    console.error("Error Message:", error.message);
    if (error.message.includes("API key not valid")) {
       console.log("👉 The API Key is INVALID. Please check Google AI Studio.");
    }
  }
}

test();
