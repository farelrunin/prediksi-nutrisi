// authService.js
import axios from 'axios';

const API_BASE_URL = 'https://nutriai-backend-production-2987.up.railway.app';
console.log('🔗 NutriAI API Base URL:', API_BASE_URL);

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(this.parseError(error));
    }
  },

  async googleLogin(accessToken) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google`, {
        access_token: accessToken
      });
      return response.data;
    } catch (error) {
      throw new Error(this.parseError(error, 'Login Google gagal'));
    }
  },

  async getAkg() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/auth/akg`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(this.parseError(error, 'Gagal mengambil data AKG'));
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(this.parseError(error, 'Registrasi gagal'));
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
      throw new Error(this.parseError(error, 'Gagal update profil'));
    }
  },

  async uploadAvatar(file) {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/auth/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(this.parseError(error, 'Gagal upload foto profil'));
    }
  },

  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(this.parseError(error, 'Gagal memuat profil'));
    }
  },

  parseError(error, defaultMsg = 'Terjadi kesalahan') {
    const detail = error.response?.data?.detail;
    if (Array.isArray(detail)) {
      // Pydantic validation error array
      return detail.map(err => {
        const field = err.loc[err.loc.length - 1];
        return `${field}: ${err.msg}`;
      }).join(', ');
    }
    return detail || error.message || defaultMsg;
  }
};