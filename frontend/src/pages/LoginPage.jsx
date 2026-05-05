import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Apple } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { colors } from '../styles/colors';

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Redirect ke landing page setelah user state terupdate
  useEffect(() => {
    if (loginSuccess && user) {
      navigate('/');
    }
  }, [user, loginSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      setLoginSuccess(true);
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login gagal');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/bg-food.jpg')" }}>
      {/* Dark overlay to make text readable, but keep it light enough to show the beautiful background */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Welcome Back!</h1>
          <p className="text-orange-200 text-sm font-medium drop-shadow">Login to track your nutrition risk.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="farelrunin@gmail.com"
                className="w-full px-5 py-4 bg-[#13301f]/60 backdrop-blur-md text-white placeholder-green-200/70 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full px-5 py-4 bg-[#13301f]/60 backdrop-blur-md text-white placeholder-green-200/70 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
            </div>
            <div className="mt-2 text-left pl-2">
              <Link to="#" className="text-green-100 hover:text-white text-sm">Lupa password?</Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c2e0c6] hover:bg-[#b0d2b4] text-[#13301f] py-4 rounded-full font-bold shadow-lg transition-all duration-200 disabled:opacity-70 mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center">
          <div className="h-px bg-white/30 flex-1"></div>
          <span className="px-4 text-white/80 text-sm">or continue with</span>
          <div className="h-px bg-white/30 flex-1"></div>
        </div>

        <button className="mt-6 w-full bg-white text-gray-700 py-3.5 rounded-full font-semibold shadow flex items-center justify-center gap-3 hover:bg-gray-50 transition">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <div className="text-center mt-8">
          <p className="text-slate-200 text-sm">
            <input type="checkbox" className="mr-2 accent-green-500 rounded" />
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:text-green-200 font-semibold underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;