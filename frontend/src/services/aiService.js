// aiService.js
import axios from 'axios';

const API_BASE_URL = 'https://nutriai-backend-production-2987.up.railway.app';
 // Adjust to your backend URL

export const aiService = {
  async getRiskPrediction(nutritionData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/predict/`, nutritionData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch {
      throw new Error('Failed to get risk prediction');
    }
  },

  async getRecommendations(historyData, profileData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/predict/recommendations`, { 
        history: historyData, 
        profile: profileData 
      }, {
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
      // For now, mapping this to recommendations or similar if endpoint doesn't exist
      const response = await axios.post(`${API_BASE_URL}/predict/recommendations`, { history: historyData }, {
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
