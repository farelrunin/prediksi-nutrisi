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
    
    // Show logout notification
    const notification = document.createElement('div');
    notification.innerHTML = 'Berhasil logout';
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129));
      color: white;
      padding: 12px 24px;
      border-radius: 9999px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      font-size: 14px;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(400px)';
      notification.style.transition = 'all 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 2500);
    
    navigate('/', { replace: true });
  };

  const handleHomeClick = (event) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);

    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    navigate('/');
  };

  // Menu for unauthenticated users
  const publicMenuItems = [
    { label: 'Home', to: '/', scrollTop: true },
    { label: 'Fitur', href: '#fitur' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Tentang', href: '#tentang' },
  ];

  // Menu for authenticated users
  const authenticatedMenuItems = [
    { label: 'Home', to: '/' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Nutri Check', to: '/nutri-check' },
    { label: 'History', to: '/history' },
    { label: 'Kategori', to: '/kategori' },
    { label: 'Profil', to: '/profil' },
  ];

  const currentMenuItems = user ? authenticatedMenuItems : publicMenuItems;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05110d]/95 backdrop-blur-xl border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-2 rounded-lg">
              <Apple className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                NutrisiAI
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Prediksi Gizi Cerdas</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {currentMenuItems.map((item) => (
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ) : item.scrollTop ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={handleHomeClick}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-emerald-400' 
                        : 'text-slate-300 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            ))}
          </div>

          {/* Desktop User Section */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                    <User size={18} className="text-emerald-400" />
                    <span>{user.name || user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-300 hover:text-white px-4 py-2 rounded-full border border-white/10 text-sm font-medium transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white px-4 py-2 rounded-full border border-white/10 text-sm font-medium transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-full text-sm font-semibold transition-shadow shadow-lg shadow-emerald-500/20"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
              type="button"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#06140f]/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-2">
              {/* Mobile Menu Items */}
              {currentMenuItems.map((item) => (
                item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                ) : item.scrollTop ? (
                  <button
                    key={item.label}
                    type="button"
                    onClick={(event) => {
                      handleHomeClick(event);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-left w-full"
                  >
                    {item.label}
                  </button>
                ) : (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              ))}

              {/* Mobile User Section */}
              {user ? (
                <>
                  <div className="border-t border-white/10 mt-3 pt-3">
                    <div className="flex items-center space-x-2 px-3 py-2 text-slate-200">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-sm">{user.name || user.email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-left text-sm font-medium mt-2"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-t border-white/10 mt-3 pt-3 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium text-sm"
                    >
                      Daftar
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;