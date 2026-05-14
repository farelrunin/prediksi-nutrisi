import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { colors } from '../../styles/colors';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../constants/translations';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, itemName, isLoading, confirmLabel, cancelLabel }) => {
  const { language } = useLanguage();
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ backgroundColor: colors.bgCard }}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-500">
              <AlertTriangle size={24} />
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">{title}</h3>
          <p className="text-[var(--text-muted)] leading-relaxed">
            {message} {itemName && <span className="font-semibold text-[var(--text-main)]">"{itemName}"</span>}
          </p>

          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-secondary)] py-3 text-sm font-semibold text-[var(--text-main)] transition-all hover:bg-[var(--bg-secondary)]/80"
            >
              {cancelLabel || t.cancel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-2xl bg-rose-500 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-600 hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{t.loading}</span>
                </div>
              ) : (
                confirmLabel || t.confirm
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
