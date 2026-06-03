import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:5000' 
  : 'https://nutriai-backend-production-2987.up.railway.app';
const API_URL = `${API_BASE_URL}/categories`;

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getCategoryById: async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      throw error;
    }
  },

  getFoodsByCategory: async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/${categoryId}/foods`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching foods for category ${categoryId}:`, error);
      throw error;
    }
  },

  searchFoods: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/search/foods`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching foods for query ${query}:`, error);
      throw error;
    }
  }
};
