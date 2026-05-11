import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './AuthContextProvider';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Error loading profile:', error);
        // Jangan hapus token jika hanya error jaringan/server restart
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserFromToken();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      setUser({ name: data.name, email });
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      // Hapus auto-login supaya user login manual lewat halaman Login
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };
  const googleLogin = async (accessToken) => {
    try {
      const data = await authService.googleLogin(accessToken);
      localStorage.setItem('token', data.token);
      setUser({ name: data.name, email: data.email });
      return data;
    } catch (error) {
      console.error('Google Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    googleLogin,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};