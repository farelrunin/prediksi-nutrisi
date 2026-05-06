import axios from 'axios';

const API_URL = 'http://localhost:8000/categories';

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
