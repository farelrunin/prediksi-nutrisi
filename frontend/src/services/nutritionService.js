// nutritionService.js
import axios from 'axios';

const API_BASE_URL = 'https://nutriai-backend-production-2987.up.railway.app';

export const nutritionService = {
  async addFoodEntry(foodData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/food/`, foodData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Failed to add food entry';
      throw new Error(msg);
    }
  },

  async predictNutrition(data) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/predict/`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Failed to predict nutrition';
      throw new Error(msg);
    }
  },

  async predictNutritionImage(formData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/predict/predict-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Failed to analyze food image';
      throw new Error(msg);
    }
  },

  async getNutritionHistory() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/food/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch {
      throw new Error('Failed to get nutrition history');
    }
  },

  async getDailyIntake() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/nutrition/daily-intake`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch {
      throw new Error('Failed to get daily intake');
    }
  },

  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/nutrition/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch {
      throw new Error('Failed to update profile');
    }
  },

  async deleteFoodEntry(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/food/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Failed to delete entry';
      throw new Error(msg);
    }
  },

  async updateFoodEntry(id, foodData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/food/${id}`, foodData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch {
      throw new Error('Failed to update entry');
    }
  },
  
  async getAiRecommendations(history, profile) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/predict/recommendations`, { history, profile }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch {
      throw new Error('Failed to get AI recommendations');
    }
  }
};
