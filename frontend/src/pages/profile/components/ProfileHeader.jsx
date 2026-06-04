import React from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Moon,
  Sun,
  Globe,
  User,
  ChevronRight,
  Bell,
  Shield,
  LogOut,
  Target,
} from 'lucide-react';

const ProfileHeader = ({
  t,
  theme,
  toggleTheme,
  language,
  toggleLanguage,
  isEditMode,
  setIsEditMode,
  fetchProfile,
  isSettingsOpen,
  setIsSettingsOpen,
  settingsRef,
  notify,
  setShowLogoutModal,
}) => {
  return (
    <div className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
      <div>
        <h1 className="text-xl md:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
          My <span className="text-[var(--primary-green)]">{t.profileTitle}</span>
        </h1>
        <p className="mt-1 md:mt-2 text-xs md:text-sm text-[var(--text-muted)] font-medium">{t.profileSubtitle}</p>
      </div>
      
      {/* Header Action Buttons */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Settings Popover Button */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-card)] px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-2xl text-[10px] md:text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all shadow-sm active:scale-95"
          >
            <Settings size={14} className={`md:w-[18px] md:h-[18px] ${isSettingsOpen ? 'animate-spin-slow' : ''}`} />
            {t.settings}
          </button>

          {isSettingsOpen && (
            <>
              {/* Overlay backdrop for mobile */}
              <div 
                className="fixed inset-0 z-[99] md:hidden" 
                onClick={() => setIsSettingsOpen(false)} 
              />
              <div className="fixed top-20 left-3 right-3 md:absolute md:top-full md:left-auto md:right-0 md:w-72 mt-0 md:mt-4 w-auto bg-[var(--bg-card)]/98 backdrop-blur-2xl border border-[var(--border-card)] rounded-2xl md:rounded-[2rem] p-2 md:p-4 shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-0.5 md:space-y-2">
                <h4 className="px-3 py-1.5 md:px-4 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">{t.preferences}</h4>
              
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                      {theme === 'light' ? <Moon size={14} className="md:w-[18px] md:h-[18px]" /> : <Sun size={14} className="md:w-[18px] md:h-[18px]" />}
                    </div>
                    <span className="text-[11px] md:text-xs font-bold text-[var(--text-main)]">{theme === 'light' ? t.darkMode : t.lightMode}</span>
                  </div>
                  <div className={`w-8 h-4 md:w-10 md:h-5 rounded-full p-0.5 md:p-1 transition-colors ${theme === 'dark' ? 'bg-[var(--primary-green)]' : 'bg-slate-200'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-4 md:translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </button>

                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                      <Globe size={14} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <span className="text-[11px] md:text-xs font-bold text-[var(--text-main)]">{t.language}</span>
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--primary-green)]">
                    {language === 'id' ? 'ID' : 'EN'}
                  </span>
                </button>

                <div className="my-1 md:my-2 border-t border-[var(--border-card)]/30 mx-2" />
                <h4 className="px-3 py-1.5 md:px-4 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">{t.account}</h4>

                {/* Edit Profile Toggle in Settings */}
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    if (isEditMode) {
                      setIsEditMode(false);
                      fetchProfile();
                    } else {
                      setIsEditMode(true);
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl group-hover:scale-110 transition-transform bg-emerald-100 text-[var(--primary-green)]`}>
                      <User size={14} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <span className="text-[11px] md:text-xs font-bold text-[var(--text-main)]">{isEditMode ? t.cancelEdit : t.editProfile}</span>
                  </div>
                  <ChevronRight size={12} className="md:w-[14px] md:h-[14px] text-[var(--text-muted)]" />
                </button>



                {/* Privacy & Security - Link to /privacy page */}
                <Link
                  to="/privacy"
                  className="w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                      <Shield size={14} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <span className="text-[11px] md:text-xs font-bold text-[var(--text-main)]">{t.privacy}</span>
                  </div>
                  <ChevronRight size={12} className="md:w-[14px] md:h-[14px] text-[var(--text-muted)]" />
                </Link>
                
                <div className="my-1 md:my-2 border-t border-[var(--border-card)]/30 mx-2 lg:hidden" />
                <h4 className="px-3 py-1.5 md:px-4 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] lg:hidden">{t.supportTitle}</h4>
                
                <a 
                  href="mailto:farelrunin@gmail.com" 
                  className="w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group lg:hidden"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-blue-100 text-blue-600">
                      <Globe size={14} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <span className="text-[11px] md:text-xs font-bold text-[var(--text-main)]">Bantuan & Kontak</span>
                  </div>
                  <ChevronRight size={12} className="md:w-[14px] md:h-[14px] text-[var(--text-muted)]" />
                </a>

                <Link 
                  to="/terms" 
                  className="w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group lg:hidden"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-rose-100 text-rose-600">
                      <Settings size={14} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <span className="text-[11px] md:text-xs font-bold text-[var(--text-main)]">{t.termsOfService}</span>
                  </div>
                  <ChevronRight size={12} className="md:w-[14px] md:h-[14px] text-[var(--text-muted)]" />
                </Link>

                <Link 
                  to="/nutrition-info" 
                  className="w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group lg:hidden"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-amber-100 text-amber-600">
                      <Target size={14} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <span className="text-[11px] md:text-xs font-bold text-[var(--text-main)]">{t.nutritionBasics}</span>
                  </div>
                  <ChevronRight size={12} className="md:w-[14px] md:h-[14px] text-[var(--text-muted)]" />
                </Link>

                <div className="my-1 md:my-2 border-t border-[var(--border-card)]/30 mx-2" />
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-rose-50 text-rose-500 transition-all group"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-rose-100 text-rose-600 group-hover:scale-110 transition-transform">
                      <LogOut size={14} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <span className="text-[11px] md:text-xs font-bold">{t.logout || 'Keluar'}</span>
                  </div>
                  <ChevronRight size={12} className="md:w-[14px] md:h-[14px] text-rose-400" />
                </button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
