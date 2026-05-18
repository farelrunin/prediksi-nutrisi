import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BottomNavbar from './components/layout/BottomNavbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { NutritionProvider } from './context/NutritionStore';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { useLocation } from 'react-router-dom';

// ── Eagerly load only the landing page (critical, above-the-fold) ──────────
import LandingPage from './pages/LandingPage';

// ── Lazy-load everything else: loaded on demand, never blocks landing page ──
const LoginPage         = lazy(() => import('./pages/LoginPage'));
const RegisterPage      = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const DashboardPage     = lazy(() => import('./pages/DashboardPage'));
const HistoryPage       = lazy(() => import('./pages/HistoryPage'));
const InputGizi         = lazy(() => import('./pages/InputGizi'));
const ProfilePage       = lazy(() => import('./pages/ProfilePage'));
const KategoriPage      = lazy(() => import('./pages/KategoriPage'));
const PanduanPage       = lazy(() => import('./pages/PanduanPage'));
const PrivacyPolicy     = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService    = lazy(() => import('./pages/TermsOfService'));
const NutritionInfoPage = lazy(() => import('./pages/NutritionInfoPage'));

// Minimal spinner shown while lazy chunks are loading
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--primary-green)]">
          NutriAI
        </p>
      </div>
    </div>
  );
}

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)]">
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen">
        {/* Suspense wraps ALL routes — lazy chunks show PageLoader while loading */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/"                element={<LandingPage />} />
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/register"        element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/categories"      element={<KategoriPage />} />
            <Route path="/guide"           element={<PanduanPage />} />
            <Route path="/privacy"         element={<PrivacyPolicy />} />
            <Route path="/terms"           element={<TermsOfService />} />
            <Route path="/nutrition-info"  element={<NutritionInfoPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard"   element={<DashboardPage />} />
              <Route path="/nutri-check" element={<InputGizi />} />
              <Route path="/history"     element={<HistoryPage />} />
              <Route path="/profile"     element={<ProfilePage />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BottomNavbar />
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <NutritionProvider>
              <Router>
                <AppContent />
              </Router>
            </NutritionProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </NotificationProvider>
  );
}

export default App;
