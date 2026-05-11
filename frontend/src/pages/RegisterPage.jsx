import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Apple, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useNotification } from '../context/useNotification';
import SoftAurora from '../components/shared/SoftAurora';

const RegisterPage = () => {
  const { register, user } = useAuth();
  const { notify } = useNotification();
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
        title: 'Registration Successful',
        message: 'Your account has been successfully created. Please log in to continue.'
      });
      navigate('/login', { replace: true });
    }
    return () => { mounted = false; };
  }, [registrationSuccess, navigate, notify]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      notify({
        type: 'warning',
        title: 'Password Validation',
        message: 'Passwords do not match, please check again.'
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
          title: 'Invalid Email Domain',
          message: 'Please use a common email domain (.com, .id, .net, or .org).'
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
        title: 'Registration Failed',
        message: error.message || 'Could not register, please try again.'
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
          <h1 className="text-3xl font-extrabold tracking-tighter text-white mb-1">
            Get <span className="text-[var(--primary-green)]">Started</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">NutriAI Assistant</p>
        </div>

        {/* Form Card */}
        <div 
          className="bg-[var(--bg-card)]/80 border border-[var(--border-card)] rounded-[32px] p-10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600 ml-2">Full Name</label>
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600 ml-2">Email Address</label>
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600 ml-2">Password</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                    minLength="8" maxLength="100"
                    placeholder="Min. 8 characters"
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600 ml-2">Confirm Password</label>
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
              <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
              <UserPlus size={20} />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-10">
          <p className="text-sm font-semibold text-white/80">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--primary-green)] hover:underline font-bold underline-offset-4">
              Login Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;