d// aiService.js
import axios from 'axios';

const API_BASE_URL = 'https://nutriai-backend-production-2987.up.railway.app';
 // Adjust to your backend URL

export const aiService = {
  async getRiskPrediction(nutritionData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/ai/predict-risk`, nutritionData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch {
      throw new Error('Failed to get risk prediction');
    }
  },

  async getRecommendations(nutritionData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/ai/recommendations`, nutritionData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch {
      throw new Error('Failed to get recommendations');
    }
  },

  async analyzeNutritionTrends(historyData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/ai/analyze-trends`, { history: historyData }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch {
      throw new Error('Failed to analyze trends');
    }
  }
};
