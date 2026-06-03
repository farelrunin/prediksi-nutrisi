import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Apple } from 'lucide-react';
import SoftAurora from '../components/shared/SoftAurora';
import { authService } from '../services/authService';
import { useNotification } from '../context/useNotification';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Memanggil context NutriAI
  const { notify } = useNotification();
  const { language } = useLanguage();
  const t = translations[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    
    try {
      // Menembak API Backend NutriAI sesungguhnya
      await authService.requestPasswordReset(email);
      
      setSubmitted(true);
      notify({ 
        type: 'success', 
        title: language === 'id' ? 'Email Terkirim' : 'Email Sent', 
        message: language === 'id' ? 'Instruksi reset sandi telah dikirim ke email Anda.' : 'Password reset instructions sent to your email.' 
      });
    } catch (error) {
      console.error('Reset Password Error:', error);
      notify({ 
        type: 'error', 
        title: language === 'id' ? 'Gagal' : 'Failed', 
        message: error.message || (language === 'id' ? 'Email tidak terdaftar atau terjadi kesalahan.' : 'Email not found or an error occurred.') 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-32 pb-12 bg-transparent px-6 relative overflow-hidden">
      
      {/* Background - Animated Soft Aurora */}
      <div className="absolute inset-0 z-0 bg-[var(--bg-primary)]">
        <SoftAurora
          speed={0.3}
          scale={1.5}
          brightness={1.0}
          color1="#10B981"
          color2="#3B82F6"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.1}
        />
        <div className="absolute inset-0 bg-[var(--bg-primary)]/20" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="bg-gradient-to-br from-[var(--primary-green)] to-[var(--accent-blue)] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Apple className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-[var(--text-main)] mb-1">
            {language === 'id' ? 'Lupa ' : 'Forgot '}<span className="text-[var(--primary-green)]">{language === 'id' ? 'Sandi?' : 'Password?'}</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            {language === 'id' ? 'Pulihkan Akun Anda' : 'Recover your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-2xl border border-[var(--border-card)] rounded-[32px] p-10 shadow-2xl bg-[var(--bg-card)]/80">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-main)] font-medium text-center">
                  {language === 'id' 
                    ? 'Masukkan email Anda dan kami akan mengirimkan instruksi untuk mengatur ulang kata sandi.' 
                    : 'Enter your email and we will send instructions to reset your password.'}
                </p>
                
                {/* Information Note for Google Users */}
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                  <p className="text-[10px] text-blue-500 font-bold leading-relaxed text-center uppercase tracking-wider">
                    {language === 'id' 
                      ? 'Catatan: Jika Anda mendaftar menggunakan Google, Anda tidak perlu mereset sandi di sini.' 
                      : 'Note: If you registered using Google, you do not need to reset your password here.'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-2">
                  {language === 'id' ? 'Alamat Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="name@email.com"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 outline-none transition-all placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full group relative flex items-center justify-center gap-3 bg-[var(--primary-green)] px-10 py-5 rounded-2xl font-bold text-white text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : null}
                <span>{loading ? (language === 'id' ? 'Mengirim...' : 'Sending...') : (language === 'id' ? 'Kirim Instruksi' : 'Send Instructions')}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-[var(--primary-green)]/10 text-[var(--primary-green)] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Mail size={40} />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-main)]">
                {language === 'id' ? 'Email Terkirim!' : 'Email Sent!'}
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
                  {language === 'id' ? 'Silakan periksa email ' : 'Please check your email '}
                  <strong className="text-[var(--text-main)]">{email}</strong> 
                  {language === 'id' ? ' untuk instruksi selanjutnya.' : ' for further instructions.'}
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest leading-normal">
                    {language === 'id' 
                      ? 'Penting: Tautan reset sandi ini hanya akan aktif selama 24 jam.' 
                      : 'Important: The reset link will only be active for 24 hours.'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-sm font-bold text-[var(--primary-green)] hover:underline"
              >
                {language === 'id' ? 'Coba email lain' : 'Try another email'}
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-[var(--border-card)]">
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-colors">
              <ArrowLeft size={16} />
              {language === 'id' ? 'Kembali ke Masuk' : 'Back to Login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
