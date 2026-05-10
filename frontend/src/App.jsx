import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPassword';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import InputGizi from './pages/InputGizi';
import ProfilePage from './pages/ProfilePage';
import KategoriPage from './pages/KategoriPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { AuthProvider } from './context/AuthContext';
import { NutritionProvider } from './context/NutritionStore';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)]">
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/kategori" element={<KategoriPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/nutri-check" element={<InputGizi />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profil" element={<ProfilePage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AuthProvider>
          <NutritionProvider>
            <Router>
              <AppContent />
            </Router>
          </NutritionProvider>
        </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App;
