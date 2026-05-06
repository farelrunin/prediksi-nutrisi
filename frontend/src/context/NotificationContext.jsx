import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now();
    const newNotification = { id, type, title, message };
    
    setNotifications((prev) => [...prev, newNotification]);

    if (duration !== Infinity) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`
              pointer-events-auto
              animate-in slide-in-from-right-full fade-in duration-500
              backdrop-blur-xl border p-4 rounded-2xl shadow-2xl flex gap-4 items-start
              ${n.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900' : ''}
              ${n.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-900' : ''}
              ${n.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-900' : ''}
              ${n.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-900' : ''}
            `}
          >
            <div className={`
              mt-1 p-1.5 rounded-lg
              ${n.type === 'success' ? 'bg-emerald-500 text-white' : ''}
              ${n.type === 'error' ? 'bg-red-500 text-white' : ''}
              ${n.type === 'info' ? 'bg-blue-500 text-white' : ''}
              ${n.type === 'warning' ? 'bg-amber-500 text-white' : ''}
            `}>
              {n.type === 'success' && <CheckCircle2 size={16} />}
              {n.type === 'error' && <AlertCircle size={16} />}
              {n.type === 'info' && <Info size={16} />}
              {n.type === 'warning' && <Bell size={16} />}
            </div>

            <div className="flex-1 space-y-1">
              {n.title && <h4 className="font-bold text-sm">{n.title}</h4>}
              <p className="text-xs font-medium opacity-90 leading-relaxed">{n.message}</p>
            </div>

            <button
              onClick={() => removeNotification(n.id)}
              className="mt-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
