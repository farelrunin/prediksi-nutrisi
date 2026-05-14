import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Apple, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/ThemeContext';
import ConfirmModal from '../shared/ConfirmModal';

const publicMenuItems = [
  { label: 'Home', to: '/', scrollTop: true },
  { label: 'Features', to: '/#features', hash: '#features' },
  { label: 'How it Works', to: '/#how-it-works', hash: '#how-it-works' },
  { label: 'Categories', to: '/categories' },
  { label: 'Guide', to: '/guide' },
];

const authenticatedMenuItems = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Nutri Check', to: '/nutri-check' },
  { label: 'History', to: '/history' },
  { label: 'Guide', to: '/guide' },
  { label: 'Categories', to: '/categories' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);
  
  // Magic Indicator State
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const menuRefs = useRef([]);
  const parentRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setShowLogoutModal(false);
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

  const currentMenuItems = user ? authenticatedMenuItems : publicMenuItems;

  // Update indicator position with precision
  const updateIndicator = (index) => {
    if (index === null || index === -1) {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      return;
    }
    
    const child = menuRefs.current[index];
    if (child) {
      setIndicatorStyle({
        left: child.offsetLeft,
        width: child.offsetWidth,
        opacity: 1
      });
    }
  };

  // Set initial position based on active route
  useEffect(() => {
    const activeIndex = currentMenuItems.findIndex(item => 
      location.pathname === item.to || (item.href && location.hash === item.href)
    );
    
    // Beri waktu sedikit untuk browser menghitung layout
    const timer = setTimeout(() => {
      if (activeIndex !== -1) {
        updateIndicator(activeIndex);
      } else if (location.pathname === '/' || location.pathname === '') {
        updateIndicator(0);
      }
    }, 300); // Sedikit lebih lama agar transisi halaman selesai

    return () => {
      clearTimeout(timer);
      setIsMobileMenuOpen(false);
      setIsGuestMenuOpen(false);
    };
  }, [location.pathname, location.hash, user, currentMenuItems]);

  return (
    <nav className="absolute lg:fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-7xl mx-auto transition-all duration-500">
      <div className="bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-card)] rounded-full px-8 py-3 shadow-2xl flex justify-between items-center relative group">
        
        {/* Subtle Gradient Accent */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--primary-green)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Logo */}
        <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--primary-green)] to-[var(--accent-blue)] p-2 shadow-lg shadow-emerald-500/20 flex items-center justify-center overflow-hidden">
            <img src="/icon.png" alt="NutriAI Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-extrabold tracking-tighter text-[var(--text-main)]">
            Nutri<span className="text-[var(--primary-green)]">AI</span>
          </span>
        </Link>

        {/* Desktop Menu with Magic Sliding Indicator */}
        <div 
          ref={parentRef}
          className="hidden lg:flex items-center gap-1 relative bg-[var(--bg-secondary)] px-2 py-1.5 rounded-full border border-[var(--border-card)] shadow-inner"
          onMouseLeave={() => {
            const activeIndex = currentMenuItems.findIndex(item => 
              location.pathname === item.to || (item.href && location.hash === item.href)
            );
            if (activeIndex !== -1) {
              updateIndicator(activeIndex);
            } else if (location.pathname === '/' || location.pathname === '') {
              updateIndicator(0);
            } else {
              setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
            }
            setHoveredIndex(null);
          }}
        >
          {/* THE MAGIC SLIDING PILL (MzCode Style) */}
          <div 
            className="absolute h-[75%] bg-gradient-to-r from-[var(--primary-green)] to-[var(--accent-blue)] rounded-full transition-all duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] z-0 pointer-events-none"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />

          {currentMenuItems.map((item, index) => {
            const isInternal = item.to && !item.hash;
            const isActive = item.hash 
              ? location.hash === item.hash
              : location.pathname === item.to;

            return (
              <div
                key={item.label}
                ref={el => menuRefs.current[index] = el}
                onMouseEnter={() => {
                  updateIndicator(index);
                  setHoveredIndex(index);
                }}
                className="relative"
              >
                <NavLink
                  to={item.to || '/'}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    if (item.hash) {
                      if (location.pathname !== '/') {
                        // Let navigation happen to /#hash
                      } else {
                        // Smooth scroll on home page
                        e.preventDefault();
                        const target = document.querySelector(item.hash);
                        if (target) {
                          const navbarHeight = 100;
                          const elementPosition = target.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        }
                      }
                    } else if (item.to) {
                      // Force scroll to top for internal pages
                      window.scrollTo(0, 0);
                    }
                  }}
                  className={() => {
                    return `relative z-10 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-500 block ${isActive || hoveredIndex === index ? 'text-black' : 'text-[var(--text-main)]'}`;
                  }}
                >
                  {item.label}
                </NavLink>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4">

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="hidden md:flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-card)] px-5 py-2.5 rounded-2xl hover:border-[var(--primary-green)]/30 transition-all shadow-sm">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--primary-green)]/10 flex items-center justify-center text-[var(--primary-green)] border border-slate-100">
                  {user?.avatar_url || user?.avatar ? (
                    <img
                      src={user.avatar_url?.startsWith('http') || user.avatar_url?.startsWith('data:') ? user.avatar_url : `https://nutriai-backend-production-2987.up.railway.app${user.avatar_url}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <span className="text-xs font-bold text-[var(--text-main)] truncate max-w-[100px]">
                  {user.name?.split(' ')[0] || 'User'}
                </span>
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="p-3.5 rounded-2xl bg-rose-50 text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white transition-all shadow-sm active:scale-95"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsGuestMenuOpen(!isGuestMenuOpen)}
                className="bg-[var(--text-main)] text-[var(--bg-primary)] px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2"
              >
                <span>Get Started</span>
              </button>

              {/* Guest Dropdown for Mobile/Desktop */}
              {isGuestMenuOpen && (
                <div className="absolute top-[calc(100%+1.5rem)] right-0 w-40 bg-[var(--bg-card)]/95 backdrop-blur-2xl border border-[var(--border-card)] rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-[110]">
                  <Link 
                    to="/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-[var(--text-main)] hover:bg-[var(--primary-green)]/10 hover:text-[var(--primary-green)] transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-[var(--text-main)] hover:bg-[var(--primary-green)]/10 hover:text-[var(--primary-green)] transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle - Hiden because we use BottomNavbar */}
          {/* <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] shadow-sm"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button> */}
        </div>

        {/* Mobile Dropdown - Disabled in favor of BottomNavbar */}
        {/* {isMobileMenuOpen && ( ... )} */}
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to end your current session?"
        itemName="Logout"
      />
    </nav>
  );
};

export default Navbar;