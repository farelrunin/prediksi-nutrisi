// authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Adjust to your backend URL

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Login gagal';
      throw new Error(msg);
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Registrasi gagal';
      throw new Error(msg);
    }
  },

  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Failed to update profile';
      throw new Error(msg);
    }
  }
};