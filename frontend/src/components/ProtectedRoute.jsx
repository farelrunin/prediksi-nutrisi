import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06140f]">
        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-6 shadow-lg text-white">
          Memuat data pengguna...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user profile is not completed and they are not on /onboarding, redirect them there
  if (!user.is_profile_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If user profile IS completed and they try to visit /onboarding, redirect them to dashboard
  if (user.is_profile_completed && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
