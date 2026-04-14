import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import InputGizi from './pages/InputGizi';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import { NutritionProvider } from './context/NutritionContext';

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#06140f] text-white">
      {!isLandingPage && <Navbar />}
      <div className={`${isAuthPage || isLandingPage ? '' : 'flex pt-16'}`}>
        {!isAuthPage && !isLandingPage && <Sidebar />}
        <main className={`${isAuthPage || isLandingPage ? '' : 'flex-1 ml-64'} min-h-screen`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/input-gizi" element={<InputGizi />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </main>
      </div>
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
