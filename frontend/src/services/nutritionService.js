// nutritionService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Adjust to your backend URL

export const nutritionService = {
  async addFoodEntry(foodData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/nutrition/food-entry`, foodData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add food entry');
    }
  },

  async getNutritionHistory() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/nutrition/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }
};