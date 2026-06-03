import React from 'react';
import { LogOut } from 'lucide-react';

const DangerZoneCard = ({
  language,
  setShowLogoutModal,
}) => {
  return (
    <div className="order-5 lg:order-none bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[2.5rem] p-4 md:p-8 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-[3px] md:w-[4px] h-full bg-rose-500" />
      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="p-2 md:p-3 bg-rose-500/10 rounded-xl text-rose-500">
          <LogOut size={20} className="md:w-6 md:h-6" />
        </div>
        <div>
          <h4 className="text-sm md:text-lg font-black text-[var(--text-main)]">
            {language === 'id' ? 'Sesi Pengguna' : 'User Session'}
          </h4>
          <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            {language === 'id' ? 'Zona Bahaya' : 'Danger Zone'}
          </p>
        </div>
      </div>
      <p className="text-[10px] md:text-xs text-[var(--text-muted)] font-semibold mb-4 md:mb-6 leading-relaxed">
        {language === 'id' 
          ? 'Apakah Anda ingin keluar dari akun Anda sekarang? Sesi Anda akan diakhiri secara aman.' 
          : 'Do you want to log out of your account now? Your session will be safely ended.'}
      </p>
      <button
        type="button"
        onClick={() => setShowLogoutModal(true)}
        className="w-full flex items-center justify-center gap-2 md:gap-3 bg-rose-50 border border-rose-200 hover:bg-rose-500 hover:text-white hover:border-transparent text-rose-500 font-black py-2.5 px-4 md:py-4 md:px-6 rounded-xl md:rounded-2xl transition-all text-[10px] md:text-xs uppercase tracking-widest active:scale-95"
      >
        <LogOut size={14} className="md:w-4 md:h-4" />
        <span>{language === 'id' ? 'Keluar / Logout' : 'Log Out'}</span>
      </button>
    </div>
  );
};

export default DangerZoneCard;
