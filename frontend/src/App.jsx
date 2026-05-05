import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import InputGizi from './pages/InputGizi';
import ProfilePage from './pages/ProfilePage';
import KategoriPage from './pages/KategoriPage';
import { AuthProvider } from './context/AuthContext';
import { NutritionProvider } from './context/NutritionStore';

function AppContent() {
  return (
    <div className="min-h-screen bg-[#06140f] text-white">
      <Navbar />
      <main className="min-h-screen pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/kategori" element={<KategoriPage />} />
          
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
    <AuthProvider>
      <NutritionProvider>
        <Router>
          <AppContent />
        </Router>
      </NutritionProvider>
    </AuthProvider>
  );
}

export default App;
