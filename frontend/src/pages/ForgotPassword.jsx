import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Apple } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock logic
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
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
            Lupa <span className="text-[var(--primary-green)]">Password?</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Pulihkan akun Anda</p>
        </div>

        {/* Form Card */}
        <div 
          className="backdrop-blur-2xl border border-white/40 rounded-[32px] p-10 shadow-[0_32px_100px_rgba(0,0,0,0.15)] bg-white/30"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <p className="text-sm text-slate-600 font-medium text-center">
                Masukkan email Anda dan kami akan mengirimkan instruksi untuk mengatur ulang password.
              </p>
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600 ml-2">Email Address</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="nama@email.com"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/40 border border-white/50 text-slate-900 font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full group relative flex items-center justify-center gap-3 bg-[var(--primary-green)] px-10 py-5 rounded-2xl font-bold text-white text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Mengirim...' : 'Kirim Instruksi'}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 bg-emerald-50 text-[var(--primary-green)] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Mail size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Email Terkirim!</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Silakan periksa email <strong>{email}</strong> untuk instruksi selanjutnya.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-sm font-bold text-[var(--primary-green)] hover:underline"
              >
                Coba email lain
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/50">
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
