import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Apple, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/useAuth';
import { useNotification } from '../context/useNotification';
import SoftAurora from '../components/shared/SoftAurora';

const LoginPage = () => {
  const { login, googleLogin, user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (loginSuccess && user && mounted) {
      notify({ 
        type: 'success', 
        title: 'Login Successful', 
        message: `Welcome back, ${user.name}!` 
      });
      navigate('/', { replace: true });
    }
    return () => { mounted = false; };
  }, [user, loginSuccess, navigate, notify]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      setLoginSuccess(true);
    } catch (error) {
      console.error('Login error:', error);
      notify({ 
        type: 'error', 
        title: 'Login Failed', 
        message: error.message || 'Incorrect email or password' 
      });
    }
    setLoading(false);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await googleLogin(tokenResponse.access_token);
        setLoginSuccess(true);
      } catch (error) {
        console.error('Google Login error:', error);
        notify({ type: 'error', title: 'Google Login Failed', message: error.message || 'An error occurred while logging in with Google.' });
      }
      setLoading(false);
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-32 pb-12 bg-transparent px-6 relative overflow-hidden">
      
      {/* Background - Animated Soft Aurora */}
      <div className="absolute inset-0 z-0 bg-[#060a09]">
        <SoftAurora
          speed={0.3}
          scale={1.5}
          brightness={0.7}
          color1="#22c55e"
          color2="#3b82f6"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.2}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="bg-gradient-to-br from-[var(--primary-green)] to-[var(--accent-blue)] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Apple className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-white mb-1">
            Welcome <span className="text-[var(--primary-green)]">Back</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">NutriAI Assistant</p>
        </div>

        {/* Form Card */}
        <div 
          className="backdrop-blur-2xl border border-white/40 rounded-[32px] p-10 shadow-[0_32px_100px_rgba(0,0,0,0.15)] bg-white/30"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600 ml-2">Email Address</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    maxLength="100"
                    placeholder="name@email.com"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/40 border border-white/50 text-slate-900 font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600">Password</label>
                  <Link to="/forgot-password" size={24} className="text-[11px] font-bold uppercase tracking-widest text-[var(--primary-green)] hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                    minLength="8" maxLength="100"
                    placeholder="Min. 8 characters"
                    className="w-full pl-14 pr-14 py-5 rounded-2xl bg-white/40 border border-white/50 text-slate-900 font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[var(--primary-green)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full group relative flex items-center justify-center gap-3 bg-[var(--primary-green)] px-10 py-5 rounded-2xl font-bold text-white text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
              <LogIn size={20} />
            </button>
          </form>

          {/* Divider */}
          <div className="my-10 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/50" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Or Continue With</span>
            <div className="h-[1px] flex-1 bg-white/50" />
          </div>

          {/* Social Login */}
          <button 
            type="button" onClick={() => loginWithGoogle()} disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white/60 backdrop-blur-md border border-white/50 py-5 rounded-2xl text-sm font-bold text-slate-700 hover:bg-white/80 transition-all shadow-sm"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-10">
          <p className="text-sm font-semibold text-white/80">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--primary-green)] hover:underline font-bold underline-offset-4">
              Sign Up Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;