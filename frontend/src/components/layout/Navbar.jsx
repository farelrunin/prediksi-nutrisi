import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Apple, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/', { replace: true });
  };

  const handleHomeClick = (event) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const publicMenuItems = [
    { label: 'Home', to: '/', scrollTop: true },
    { label: 'Fitur', href: '#fitur' },
    { label: 'Mulai', to: '/register' },
  ];

  const authenticatedMenuItems = [
    { label: 'Home', to: '/' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Nutri Check', to: '/nutri-check' },
    { label: 'History', to: '/history' },
    { label: 'Kategori', to: '/kategori' },
  ];

  const currentMenuItems = user ? authenticatedMenuItems : publicMenuItems;

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-7xl mx-auto transition-all duration-500">
      <div className="bg-white/40 backdrop-blur-[40px] border border-white/60 rounded-full px-8 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex justify-between items-center relative overflow-hidden group">
        
        {/* Subtle Gradient Accent */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--primary-green)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Logo */}
        <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[var(--primary-green)] to-[var(--accent-blue)] p-2 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Apple className="text-white" size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tighter text-[var(--text-main)]">
            Nutri<span className="text-[var(--primary-green)]">AI</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {currentMenuItems.map((item) => (
            item.href ? (
              <a
                key={item.label}
                href={item.href}
                className="px-6 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive 
                      ? 'bg-[var(--primary-green)] text-white shadow-xl shadow-emerald-500/40' 
                      : 'text-[var(--text-main)] hover:text-[var(--primary-green)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profil" className="hidden md:flex items-center gap-3 bg-white border border-[var(--border-card)] px-5 py-2.5 rounded-2xl hover:border-[var(--primary-green)]/30 transition-all shadow-sm">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--primary-green)]/10 flex items-center justify-center text-[var(--primary-green)] border border-slate-100">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <span className="text-xs font-bold text-[var(--text-main)] truncate max-w-[100px]">
                  {user.name?.split(' ')[0] || 'User'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-3.5 rounded-2xl bg-rose-50 text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white transition-all shadow-sm active:scale-95"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all">
                Masuk
              </Link>
              <Link to="/register" className="bg-[var(--text-main)] text-white px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-100 transition-all">
                Daftar
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3.5 rounded-2xl bg-white border border-[var(--border-card)] text-[var(--text-main)] shadow-sm"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-[calc(100%+1rem)] left-0 right-0 lg:hidden bg-white/95 backdrop-blur-2xl border border-[var(--border-card)] rounded-[2.5rem] p-6 shadow-3xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-2">
              {currentMenuItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive 
                        ? 'bg-[var(--primary-green)] text-white' 
                        : 'text-[var(--text-muted)] hover:bg-slate-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {user && (
                <NavLink
                  to="/profil"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] hover:bg-slate-50 border-t border-slate-100 mt-2"
                >
                  Profil Saya
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;