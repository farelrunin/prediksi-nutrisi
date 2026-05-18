import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  User
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../constants/translations';

const BottomNavbar = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const location = useLocation();
  
  // Hide if not logged in or on auth pages
  if (!user || ['/login', '/register', '/forgot-password'].includes(location.pathname)) {
    return null;
  }

  const navItems = [
    { label: t.home,       to: '/',            icon: Home,            ariaLabel: language === 'id' ? 'Beranda' : 'Home' },
    { label: t.dashboard,  to: '/dashboard',   icon: LayoutDashboard, ariaLabel: language === 'id' ? 'Dashboard' : 'Dashboard' },
    { label: t.nutriCheck, to: '/nutri-check',  icon: PlusCircle,      ariaLabel: language === 'id' ? 'Cek Nutrisi' : 'Nutri Check', isPrimary: true },
    { label: t.history,    to: '/history',     icon: History,         ariaLabel: language === 'id' ? 'Riwayat' : 'History' },
    { label: t.profileTitle, to: '/profile',   icon: User,            ariaLabel: language === 'id' ? 'Profil' : 'Profile' },
  ];

  return (
    <nav aria-label={language === 'id' ? 'Navigasi bawah' : 'Bottom navigation'} className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8 pt-4">
      <div className="bg-[var(--bg-card)]/80 backdrop-blur-2xl border border-[var(--border-card)] rounded-[2.5rem] shadow-2xl flex items-center justify-around p-2 relative overflow-hidden group">
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-green)]/5 to-transparent opacity-50 pointer-events-none" aria-hidden="true" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          if (item.isPrimary) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.ariaLabel}
                className={({ isActive }) => `
                  relative -top-2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive 
                    ? 'bg-[var(--text-main)] text-[var(--bg-primary)] shadow-lg' 
                    : 'bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-card)] shadow-sm'}
                `}
              >
                <Icon size={24} strokeWidth={isActive ? 3 : 2} aria-hidden="true" />
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.ariaLabel}
              className={({ isActive }) => `
                flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300
                ${isActive 
                  ? 'text-[var(--primary-green)]' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}
              `}
            >
              <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[var(--primary-green)] rounded-full animate-pulse" aria-hidden="true" />
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-0.5'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;
