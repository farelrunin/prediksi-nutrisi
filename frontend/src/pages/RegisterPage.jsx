import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Apple } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/colors';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

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
      navigate('/dashboard');
    } catch (error) {
      alert('Registrasi gagal');
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
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(26,163,100,0.12),transparent_50%)]" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl" style={{ backgroundColor: colors.bgCard }}>
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-3 rounded-2xl">
                <Apple className="text-white" size={32} />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Daftar</h1>
              <p className="text-slate-300">Buat akun untuk memulai perjalanan nutrisi sehat</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Nama Lengkap</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama lengkap Anda"
                    className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                  <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                  <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                  <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                  <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <UserPlus size={20} />
                {loading ? 'Mendaftarkan...' : 'Daftar'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-slate-300">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                  Masuk sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;