import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Apple, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/useNotification';
import { translations } from '../../constants/translations';

const Footer = () => {
  const auth = useAuth() || {};
  const { user } = auth;
  const location = useLocation();
  const { language } = useLanguage();
  const { notify } = useNotification();
  const t = translations[language];
  
  const [isJoining, setIsJoining] = useState(false);

  const hideOnPaths = ['/login', '/register', '/profile', '/forgot-password', '/onboarding'];
  if (hideOnPaths.includes(location.pathname)) {
    return null;
  }

  const isIndo = language === 'id';

  const handleJoinDiscord = () => {
    setIsJoining(true);
    notify({
      type: 'success',
      title: isIndo ? "🚀 Membuka Portal Komunitas..." : "🚀 Opening Community Portal...",
      message: isIndo 
        ? "Siap-siap! Mengalihkanmu ke markas besar NutriAI di Discord." 
        : "Get ready! Redirecting you to the NutriAI headquarters on Discord."
    });

    setTimeout(() => {
      setIsJoining(false);
      window.open('https://discord.gg/DrkSFhBX38', '_blank');
    }, 1500);
  };

  return (
    <footer className="relative z-10 bg-transparent pt-20 pb-10 px-6 mt-20 hidden lg:block">
      <div className="max-w-7xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-16" />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & Description */}
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
              {t.footerDesc}
            </p>
            
            {/* Social Icons (Using high-quality inline SVGs to avoid missing Lucide brand icons) */}
            <div className="flex items-center gap-4">
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--text-main)]/50 hover:bg-[var(--text-main)]/5 transition-all shadow-sm active:scale-95"
                title="X (Twitter)"
              >
                <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/farelrunin/prediksi-nutrisi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--text-main)]/50 hover:bg-[var(--text-main)]/5 transition-all shadow-sm active:scale-95"
                title="GitHub"
              >
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all shadow-sm active:scale-95"
                title="YouTube"
              >
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-main)]">{t.navigationTitle}</h2>
            <ul className="space-y-4">
              {user ? (
                <>
                  <li><Link to="/dashboard" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">{t.dashboard}</Link></li>
                  <li><Link to="/categories" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">{t.categories}</Link></li>
                  <li><Link to="/history" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">{isIndo ? 'Riwayat Nutrisi' : 'Nutrition History'}</Link></li>
                  <li><Link to="/profile" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">{isIndo ? 'Profil Saya' : 'My Profile'}</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">{t.home}</Link></li>
                  <li><Link to="/login" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">{t.login}</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-main)]">{t.supportTitle}</h2>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">{t.privacyPolicy}</Link></li>
              <li><Link to="/terms" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">{t.termsOfService}</Link></li>
              <li><Link to="/nutrition-info" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">{t.nutritionBasics}</Link></li>
            </ul>
            <div className="pt-2">
              <a href="mailto:farelrunin@gmail.com" className="flex items-center gap-2 text-sm font-black text-[var(--primary-green)] hover:underline">
                <Mail size={14} />
                farelrunin@gmail.com
              </a>
            </div>
          </div>

          {/* Revamped Right Column: Discord Community Card */}
          <div className="space-y-6">
            <div className="bg-[var(--bg-card)]/50 backdrop-blur-xl border border-[var(--border-card)] p-6 rounded-[2rem] shadow-sm space-y-4 transition-all hover:border-[var(--primary-green)]/20">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.1em] text-[var(--text-main)]">
                  {isIndo ? '💬 Gabung Komunitas' : '💬 NutriAI Community'}
                </h3>
                <p className="text-[11px] font-medium leading-relaxed text-[var(--text-muted)] mt-1">
                  {isIndo 
                    ? 'Ngobrol langsung dengan tim developer, diskusikan tren gizi, dan level-up gaya hidup sehatmu bersama pengguna lain.' 
                    : 'Chat directly with the dev team, discuss nutrition trends, and level-up your healthy lifestyle with other users.'}
                </p>
              </div>
              
              <button 
                onClick={handleJoinDiscord}
                disabled={isJoining}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-[10px] uppercase tracking-widest transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:scale-100 shadow-md shadow-[#5865F2]/20"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>{isIndo ? 'Membuka Portal...' : 'Opening Portal...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 127.14 96.36">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5A51.31,51.31,0,0,0,29,79.85a75.7,75.7,0,0,0,69.13,0,51.31,51.31,0,0,0,.87.72,68.43,68.43,0,0,1-10.5,5A77.7,77.7,0,0,0,75.13,96.36a105.73,105.73,0,0,0,31.06-18.83C110,53.72,103.88,30.82,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                    </svg>
                    <span>Join Discord Server</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Lower Row Copyright */}
        <div className="pt-10 border-t border-[var(--border-card)] flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
          <p>© 2026 NutriAI</p>
          <p className="font-semibold transition-all">
            Crafted with ❤️ by Tim NutriAI | CC26-PSU260
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
