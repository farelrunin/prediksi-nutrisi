import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage or token)
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and set user
      // For now, mock user
      setUser({ id: 1, name: 'User', email: 'user@example.com' });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Implement login logic
    // Call authService.login
    setUser({ id: 1, name: 'User', email });
    localStorage.setItem('token', 'mock-token');
  };

  const register = async (userData) => {
    // Implement register logic
    // Call authService.register
    setUser({ id: 1, ...userData });
    localStorage.setItem('token', 'mock-token');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};