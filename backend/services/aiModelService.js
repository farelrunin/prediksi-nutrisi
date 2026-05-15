const axios = require('axios');
const FormData = require('form-data');

/**
 * AI Model Service
 * Bridge antara Express (Node.js) dan FastAPI (Python)
 */

// Ganti URL ini dengan URL Deployment FastAPI tim AI nantinya
const AI_MODEL_URL = process.env.AI_MODEL_URL || 'http://localhost:8000';

const predictFoodFromImage = async (imageBuffer, originalName = 'food.jpg') => {
  try {
    const formData = new FormData();
    formData.append('file', imageBuffer, originalName);

    console.log(`Mengirim request ke AI Engine: ${AI_MODEL_URL}/predict`);
    
    const response = await axios.post(`${AI_MODEL_URL}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 10000 // 10 detik timeout
    });

    return response.data;
  } catch (error) {
    console.error("AI Model Service Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    return null;
  }
};

module.exports = { predictFoodFromImage };
