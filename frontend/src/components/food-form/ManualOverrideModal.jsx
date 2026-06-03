import React from 'react';
import { XCircle } from 'lucide-react';

const ManualOverrideModal = ({
  isOpen,
  onClose,
  overrideData,
  setOverrideData,
  handleSaveOverride,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] w-[95%] md:w-full md:max-w-md rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl p-5 md:p-8 space-y-4 md:space-y-6 max-h-[85vh] md:max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200 text-left">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-[var(--text-main)]">
              {language === 'id' ? 'Koreksi Data Makanan' : 'Correct Food Entry'}
            </h3>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">
              {language === 'id' ? 'Koreksi estimasi nama & nilai gizi AI' : 'Override AI estimation name & macro values'}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-rose-500 transition-colors"
          >
            <XCircle size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Food Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
              {language === 'id' ? 'Nama Makanan' : 'Food Name'}
            </label>
            <input
              type="text"
              value={overrideData.foodName}
              onChange={(e) => setOverrideData({ ...overrideData, foodName: e.target.value })}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-5 py-4 text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
              placeholder={language === 'id' ? 'Contoh: Nasi Goreng Telur' : 'Example: Egg Fried Rice'}
            />
          </div>

          {/* Nutrition Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
                {language === 'id' ? 'Kalori (kcal)' : 'Calories (kcal)'}
              </label>
              <input
                type="number"
                value={overrideData.calories}
                onChange={(e) => setOverrideData({ ...overrideData, calories: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-5 py-4 text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] text-center"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
                {language === 'id' ? 'Protein (g)' : 'Protein (g)'}
              </label>
              <input
                type="number"
                value={overrideData.protein}
                onChange={(e) => setOverrideData({ ...overrideData, protein: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-5 py-4 text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] text-center"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
                {language === 'id' ? 'Karbohidrat (g)' : 'Carbs (g)'}
              </label>
              <input
                type="number"
                value={overrideData.carbs}
                onChange={(e) => setOverrideData({ ...overrideData, carbs: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-5 py-4 text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] text-center"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
                {language === 'id' ? 'Lemak (g)' : 'Fat (g)'}
              </label>
              <input
                type="number"
                value={overrideData.fat}
                onChange={(e) => setOverrideData({ ...overrideData, fat: e.target.value })}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-5 py-4 text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] text-center"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-grow px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border border-[var(--border-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]/50 transition-all"
          >
            {language === 'id' ? 'Batal' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSaveOverride}
            className="flex-grow px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-[var(--primary-green)] text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all"
          >
            {language === 'id' ? 'Simpan' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualOverrideModal;
