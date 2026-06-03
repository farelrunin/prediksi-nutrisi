import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, Apple, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import SoftAurora from '../components/shared/SoftAurora';
import { useNotification } from '../context/useNotification';
import { useLanguage } from '../context/LanguageContext';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { notify } = useNotification();
  const { language } = useLanguage();

  const isLengthValid = password.length >= 8;
  const isMatch = password === confirmPassword;
  const showWarning = confirmPassword.length > 0 && !isMatch;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) return;
    if (!isLengthValid) {
      notify({
        type: 'warning',
        title: language === 'id' ? 'Sandi Lemah' : 'Weak Password',
        message: language === 'id' ? 'Kata sandi minimal harus 8 karakter.' : 'Password must be at least 8 characters.'
      });
      return;
    }
    if (!isMatch) {
      notify({
        type: 'warning',
        title: language === 'id' ? 'Tidak Cocok' : 'Mismatch',
        message: language === 'id' ? 'Kata sandi baru dan konfirmasi harus cocok.' : 'New password and confirmation must match.'
      });
      return;
    }

    setLoading(true);
    // Mock API call to simulate password reset request to backend
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      notify({
        type: 'success',
        title: language === 'id' ? 'Sandi Diubah' : 'Password Changed',
        message: language === 'id' ? 'Kata sandi Anda berhasil diperbarui!' : 'Your password has been successfully updated!'
      });
    }, 1500);
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
            {language === 'id' ? 'Reset ' : 'Reset '}<span className="text-[var(--primary-green)]">{language === 'id' ? 'Sandi' : 'Password'}</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            {language === 'id' ? 'Atur Ulang Sandi Akun' : 'Reset your account password'}
          </p>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-2xl border border-[var(--border-card)] rounded-[32px] p-10 shadow-2xl bg-[var(--bg-card)]/80">
          
          {!token ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-main)]">
                {language === 'id' ? 'Tautan Tidak Valid' : 'Invalid Link'}
              </h3>
              <p className="text-sm text-[var(--text-muted)] font-semibold leading-relaxed">
                {language === 'id' 
                  ? 'Tautan tidak valid atau telah kedaluwarsa. Silakan ajukan reset kata sandi baru.' 
                  : 'The link is invalid or has expired. Please request a new password reset.'}
              </p>
              <div className="pt-4">
                <Link 
                  to="/forgot-password" 
                  className="w-full inline-flex items-center justify-center bg-[var(--primary-green)] px-6 py-3.5 rounded-xl font-bold text-white text-xs uppercase tracking-widest shadow-md hover:scale-[1.02] active:scale-100 transition-all"
                >
                  {language === 'id' ? 'Minta Tautan Baru' : 'Request New Link'}
                </Link>
              </div>
            </div>
          ) : !submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-[var(--text-main)] font-medium text-center">
                {language === 'id' 
                  ? 'Silakan masukkan kata sandi baru Anda di bawah ini.' 
                  : 'Please enter your new password below.'}
              </p>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-2">
                  {language === 'id' ? 'Kata Sandi Baru' : 'New Password'}
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-12 py-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 outline-none transition-all placeholder:text-[var(--text-muted)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password.length > 0 && !isLengthValid && (
                  <p className="text-[9px] font-bold text-rose-500 ml-2 animate-pulse">
                    {language === 'id' ? 'Kata sandi minimal 8 karakter' : 'Password must be at least 8 characters'}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-2">
                  {language === 'id' ? 'Konfirmasi Kata Sandi' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-12 py-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 outline-none transition-all placeholder:text-[var(--text-muted)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {showWarning && (
                  <p className="text-[9px] font-bold text-rose-500 ml-2 animate-pulse">
                    {language === 'id' ? 'Konfirmasi kata sandi tidak cocok' : 'Password confirmation does not match'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isLengthValid || showWarning}
                className="w-full group relative flex items-center justify-center gap-3 bg-[var(--primary-green)] px-10 py-5 rounded-2xl font-bold text-white text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : null}
                <span>{loading ? (language === 'id' ? 'Menyimpan...' : 'Saving...') : (language === 'id' ? 'Simpan Kata Sandi' : 'Save Password')}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-[var(--primary-green)]/10 text-[var(--primary-green)] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={40} className="text-[var(--primary-green)] animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-main)]">
                {language === 'id' ? 'Kata Sandi Diubah!' : 'Password Changed!'}
              </h3>
              <p className="text-sm text-[var(--text-muted)] font-semibold leading-relaxed">
                {language === 'id' 
                  ? 'Kata sandi baru Anda telah berhasil disimpan. Silakan masuk kembali.' 
                  : 'Your new password has been successfully saved. Please log in again.'}
              </p>
              <div className="pt-4">
                <Link 
                  to="/login" 
                  className="w-full inline-flex items-center justify-center bg-[var(--primary-green)] px-10 py-5 rounded-2xl font-bold text-white text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all"
                >
                  {language === 'id' ? 'Masuk Sekarang' : 'Login Now'}
                </Link>
              </div>
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

export default ResetPasswordPage;
