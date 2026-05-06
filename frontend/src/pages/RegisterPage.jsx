import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Apple, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { colors } from '../styles/colors';

const RegisterPage = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (registrationSuccess && user) {
      navigate('/');
    }
  }, [user, registrationSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Password tidak cocok');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setRegistrationSuccess(true);
    } catch (error) {
      console.error('Register error:', error);
      alert(error.message || 'Registrasi gagal');
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
    <div className="min-h-screen flex items-center justify-center bg-transparent px-6 py-12 relative overflow-hidden">
      
      {/* Background with user image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/bg-food.jpg" 
          alt="Healthy Food" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="bg-gradient-to-br from-[var(--primary-green)] to-[var(--accent-blue)] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Apple className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2">
            Mulai <span className="text-[var(--primary-green)]">Sekarang</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">NutriAI Assistant</p>
        </div>

        {/* Form Card */}
        <div 
          className="backdrop-blur-2xl border border-white/40 rounded-[32px] p-10 shadow-[0_32px_100px_rgba(0,0,0,0.15)] bg-white/30"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600 ml-2">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <User size={18} />
                  </div>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange} required
                    minLength="2" maxLength="100"
                    placeholder="Nama Lengkap"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/40 border border-white/50 text-slate-900 font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600 ml-2">Email Address</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    maxLength="100"
                    placeholder="nama@email.com"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/40 border border-white/50 text-slate-900 font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600 ml-2">Password</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                    minLength="8" maxLength="100"
                    placeholder="Minimal 8 karakter"
                    className="w-full pl-14 pr-14 py-4 rounded-2xl bg-white/40 border border-white/50 text-slate-900 font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-slate-500"
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

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600 ml-2">Konfirmasi Password</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-4 rounded-2xl bg-white/40 border border-white/50 text-slate-900 font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[var(--primary-green)] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full group relative flex items-center justify-center gap-3 bg-[var(--primary-green)] px-10 py-5 rounded-2xl font-bold text-white text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 mt-4"
            >
              <span>{loading ? 'Mendaftar...' : 'Daftar'}</span>
              <UserPlus size={20} />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-10">
          <p className="text-sm font-semibold text-white/80">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[var(--primary-green)] hover:underline font-bold underline-offset-4">
              Masuk Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;