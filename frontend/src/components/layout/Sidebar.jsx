import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, User, Zap } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/input-gizi', icon: Plus, label: 'Input Makanan' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-2">Menu Utama</h2>
          <p className="text-sm text-slate-400">Kelola nutrisi Anda</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border-l-4 border-emerald-500'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="text-emerald-400" size={18} />
              <span className="font-semibold text-white text-sm">Tips Kesehatan</span>
            </div>
            <p className="text-sm text-slate-300">
              Konsumsi sayuran hijau dan air putih setiap hari untuk hasil optimal!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
