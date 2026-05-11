const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
require("dotenv").config({ path: '.env' });

async function listModels() {
  const key = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", key ? key.substring(0, 10) + "..." : "MISSING");
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const response = await axios.get(url);
    console.log("Available Flash Models:");
    response.data.models
      .filter(m => m.name.includes("flash"))
      .forEach(m => console.log("- " + m.name));
  } catch (error) {
    console.error("❌ Error listing models!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data));
    } else {
      console.error("Message:", error.message);
    }
  }
}

listModels();
