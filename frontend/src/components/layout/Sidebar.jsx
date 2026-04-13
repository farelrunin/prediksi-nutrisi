import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, BarChart3, User, Settings, Activity } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', color: 'blue' },
    { path: '/input-gizi', icon: Plus, label: 'Input Gizi', color: 'green' },
    { path: '/profile', icon: User, label: 'Profil', color: 'purple' },
  ];

  const getColorClasses = (color, isActive) => {
    const baseClasses = 'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium';
    if (isActive) {
      switch (color) {
        case 'blue':
          return `${baseClasses} bg-blue-100 text-blue-700 border-r-4 border-blue-500`;
        case 'green':
          return `${baseClasses} bg-green-100 text-green-700 border-r-4 border-green-500`;
        case 'purple':
          return `${baseClasses} bg-purple-100 text-purple-700 border-r-4 border-purple-500`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-700 border-r-4 border-gray-500`;
      }
    }
    return `${baseClasses} text-gray-600 hover:bg-gray-50 hover:text-gray-900`;
  };

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Menu Utama</h2>
          <p className="text-sm text-gray-500">Kelola nutrisi Anda</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={getColorClasses(item.color, isActive)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="text-green-600" size={18} />
              <span className="font-semibold text-gray-900">Tips Kesehatan</span>
            </div>
            <p className="text-sm text-gray-600">
              Konsumsi sayuran hijau setiap hari untuk kesehatan optimal!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;