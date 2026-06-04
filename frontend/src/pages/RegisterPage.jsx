import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Apple, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useNotification } from '../context/useNotification';
import SoftAurora from '../components/shared/SoftAurora';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';

const RegisterPage = () => {
  const { register } = useAuth();
  const { notify } = useNotification();
  const { language } = useLanguage();
  const t = translations[language];
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
    let mounted = true;
    if (registrationSuccess && mounted) {
      notify({
        type: 'success',
        title: language === 'id' ? 'Registrasi Berhasil' : 'Registration Successful',
        message: language === 'id' 
          ? 'Akun Anda berhasil dibuat. Silakan masuk untuk melanjutkan.' 
          : 'Your account has been successfully created. Please log in to continue.'
      });
      navigate('/login', { replace: true });
    }
    return () => { mounted = false; };
  }, [registrationSuccess, navigate, notify]);

  const validatePassword = (password, confirmPassword) => {
    const checks = {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password),
      isMatching: password === confirmPassword && confirmPassword !== ""
    };

    // Calculate password strength score (0 to 5)
    const score = Object.values(checks).filter(Boolean).length - (checks.isMatching ? 1 : 0);
    
    let strength = language === 'id' ? "LEMAH" : "WEAK";
    if (score >= 5) strength = language === 'id' ? "SANGAT KUAT" : "VERY STRONG";
    else if (score >= 3) strength = language === 'id' ? "SEDANG" : "MEDIUM";

    return {
      ...checks,
      strength,
      isValid: score >= 5 && checks.isMatching
    };
  };

  const checks = validatePassword(formData.password, formData.confirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom strict validation
    if (!checks.isValid) {
      notify({
        type: 'warning',
        title: language === 'id' ? 'Sandi Kurang Kuat' : 'Weak Password',
        message: language === 'id' 
          ? 'Pastikan semua kriteria kekuatan kata sandi telah terpenuhi dan cocok.' 
          : 'Please make sure all password strength criteria are met and matching.'
      });
      return;
    }

    setLoading(true);
    try {
      // Strict Email Validation Regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|id|net|org)$/;
      if (!emailRegex.test(formData.email)) {
        notify({
          type: 'warning',
          title: language === 'id' ? 'Domain Email Tidak Valid' : 'Invalid Email Domain',
          message: language === 'id' 
            ? 'Silakan gunakan domain email umum (.com, .id, .net, atau .org).' 
            : 'Please use a common email domain (.com, .id, .net, or .org).'
        });
        setLoading(false);
        return;
      }

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setRegistrationSuccess(true);
    } catch (error) {
      console.error('Register error:', error);
      notify({
        type: 'error',
        title: language === 'id' ? 'Registrasi Gagal' : 'Registration Failed',
        message: error.message || (language === 'id' ? 'Tidak dapat mendaftar, silakan coba lagi.' : 'Could not register, please try again.')
      });
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
            {language === 'id' ? <>Yuk <span className="text-[var(--primary-green)]">Mulai</span></> : <>Get <span className="text-[var(--primary-green)]">Started</span></>}
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">NutriAI Assistant</p>
        </div>

        {/* Form Card */}
        <div 
          className="bg-[var(--bg-card)]/80 backdrop-blur-2xl border border-[var(--border-card)] rounded-[2.5rem] p-6 md:p-10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-2">{t.fullName}</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <User size={18} />
                  </div>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange} required
                    minLength="2" maxLength="100"
                    placeholder="John Doe"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-2">{t.emailAddress}</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    maxLength="100"
                    placeholder="name@email.com"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-2">{t.password}</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                    maxLength="100"
                    placeholder={language === 'id' ? 'Min. 8 karakter' : 'Min. 8 characters'}
                    className="w-full pl-14 pr-14 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-[var(--text-muted)]"
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-2">{t.confirmPassword}</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-[var(--text-muted)]"
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

              {/* PASSWORD STRENGTH VISUAL INDICATOR */}
              {formData.password && (
                <div className="mt-3 p-4 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-card)] space-y-2 text-[11px] font-bold transition-all animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[var(--text-muted)] uppercase tracking-widest text-[9px]">{language === 'id' ? 'Kekuatan Sandi:' : 'Password Strength:'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider ${
                      checks.strength === 'SANGAT KUAT' ? 'bg-emerald-500/10 text-emerald-500' :
                      checks.strength === 'SEDANG' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {checks.strength}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <span>{checks.minLength ? "✅" : "❌"}</span>
                      <span className={checks.minLength ? "text-[var(--primary-green)]" : "text-[var(--text-muted)]"}>
                        {language === 'id' ? "Minimal 8 karakter" : "Minimum 8 characters"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{checks.hasUpper && checks.hasLower ? "✅" : "❌"}</span>
                      <span className={checks.hasUpper && checks.hasLower ? "text-[var(--primary-green)]" : "text-[var(--text-muted)]"}>
                        {language === 'id' ? "Harus ada huruf besar & kecil" : "Must contain uppercase & lowercase letters"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{checks.hasNumber && checks.hasSymbol ? "✅" : "❌"}</span>
                      <span className={checks.hasNumber && checks.hasSymbol ? "text-[var(--primary-green)]" : "text-[var(--text-muted)]"}>
                        {language === 'id' ? "Harus mengandung angka dan simbol (@,#,$,dll.)" : "Must contain numbers and symbols"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{checks.isMatching ? "✅" : "❌"}</span>
                      <span className={checks.isMatching ? "text-[var(--primary-green)]" : "text-[var(--text-muted)]"}>
                        {language === 'id' ? "Konfirmasi sandi cocok" : "Password confirmation matches"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full group relative flex items-center justify-center gap-3 bg-[var(--primary-green)] px-10 py-5 rounded-2xl font-bold text-white text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 mt-4"
            >
              <span>{loading ? (language === 'id' ? 'Membuat Akun...' : 'Creating Account...') : t.signUp}</span>
              <UserPlus size={20} />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-10">
          <p className="text-sm font-semibold text-[var(--text-muted)]">
            {t.alreadyHaveAccount}{' '}
            <Link to="/login" className="text-[var(--primary-green)] hover:underline font-bold underline-offset-4">
              {language === 'id' ? 'Masuk Sekarang' : 'Login Now'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;