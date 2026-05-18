import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Apple, Mail, ArrowRight, Sparkles, Globe, MessageSquare, Share2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const Footer = () => {
  const auth = useAuth() || {};
  const { user } = auth;
  const location = useLocation();
  
  const hideOnPaths = ['/login', '/register', '/profile', '/forgot-password'];
  if (hideOnPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="relative z-10 bg-transparent pt-20 pb-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-16" />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[var(--primary-green)] to-[var(--accent-blue)] p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
                <Apple className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-[var(--text-main)]">
                Nutri<span className="text-[var(--primary-green)]">AI</span>
              </span>
            </Link>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium">
              Building a healthier future through artificial intelligence technology.
            </p>
            <div className="flex items-center gap-4">
              {/* Gunakan ikon yang pasti ada di semua versi Lucide */}
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">
                <Share2 size={18} />
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">
                <Globe size={18} />
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">
                <MessageSquare size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-main)]">Navigation</h2>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">Home</Link></li>
              <li><Link to="/categories" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">Categories</Link></li>
              <li><Link to="/guide" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">Nutrition Guide</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-main)]">Support</h2>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">Terms of Service</Link></li>
              <li><Link to="/nutrition-info" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">Nutrition Basics</Link></li>
            </ul>
            <div className="pt-4">
              <a href="mailto:farelrunin@gmail.com" className="flex items-center gap-2 text-sm font-black text-[var(--primary-green)]">
                <Mail size={14} />
                farelrunin@gmail.com
              </a>
            </div>
          </div>

          <div className="space-y-6">
            {!user ? (
              <div className="bg-gradient-to-br from-[var(--primary-green)]/10 to-[var(--accent-blue)]/10 border border-[var(--primary-green)]/20 p-8 rounded-[2.5rem]">
                <h2 className="text-lg font-black text-[var(--text-main)] mb-2">Join Us</h2>
                <Link to="/register" className="block w-full bg-[var(--primary-green)] text-[var(--bg-primary)] text-center py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">Sign Up</Link>
              </div>
            ) : (
              <div className="bg-[var(--bg-primary)] border border-[var(--border-card)] p-8 rounded-[2.5rem] flex flex-col items-center text-center justify-center space-y-4">
                <Sparkles className="text-[var(--primary-green)]" size={24} />
                <p className="text-[10px] font-black italic text-[var(--text-muted)] uppercase tracking-widest">Keep Healthy with NutriAI</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-10 border-t border-[var(--border-card)] flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
          <p>© 2026 NutriAI</p>
          <div className="flex gap-6">
            <Link to="/nutrition-info">Basics</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
