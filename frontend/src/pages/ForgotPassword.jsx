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
    <div className="min-h-screen flex flex-col items-center pt-32 pb-12 bg-transparent px-6 relative overflow-hidden">
      
      {/* Background with user image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80" 
          alt="Healthy Food" 
          className="w-full h-full object-cover opacity-20" 
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="bg-gradient-to-br from-[var(--primary-green)] to-[var(--accent-blue)] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Apple className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-white mb-1">
            Forgot <span className="text-[var(--primary-green)]">Password?</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Recover your account</p>
        </div>

        {/* Form Card */}
        <div 
          className="backdrop-blur-2xl border border-[var(--glass-border)] rounded-[32px] p-10 shadow-[0_32px_100px_rgba(0,0,0,0.15)] bg-[var(--glass-bg)]"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm text-[var(--glass-text)] font-medium text-center">
                  Enter your email and we will send instructions to reset your password.
                </p>
                
                {/* Information Note for Google Users */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                  <p className="text-[10px] text-blue-600 font-bold leading-relaxed text-center uppercase tracking-wider">
                    Note: If you registered using Google, you do not need to reset your password here.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--glass-text)] ml-2">Email Address</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="name@email.com"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/5 outline-none transition-all placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full group relative flex items-center justify-center gap-3 bg-[var(--primary-green)] px-10 py-5 rounded-2xl font-bold text-white text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Sending...' : 'Send Instructions'}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 bg-emerald-50 text-[var(--primary-green)] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Mail size={40} />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-main)]">Email Sent!</h3>
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
                  Please check your email <strong>{email}</strong> for further instructions.
                </p>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                  <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest leading-normal">
                    Development Mode:<br/>Email simulated. In a real system, the reset link will be active for 24 hours.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-sm font-bold text-[var(--primary-green)] hover:underline"
              >
                Try another email
              </button>
            </div>
          )}


          <div className="mt-8 pt-8 border-t border-[var(--glass-border)]">
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-[var(--glass-text)] hover:text-[var(--primary-green)] transition-colors">
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
