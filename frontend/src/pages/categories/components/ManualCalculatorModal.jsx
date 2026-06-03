import React from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import FoodForm from '../../../components/FoodForm';

const ManualCalculatorModal = ({
  isManualInputOpen,
  setIsManualInputOpen,
  addFoodEntry,
  language,
}) => {
  if (!isManualInputOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 md:p-4">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={() => setIsManualInputOpen(false)} 
      />
      <div className="relative w-full max-w-4xl bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        <div className="p-4 md:p-8 border-b border-[var(--border-card)] flex justify-between items-center bg-[var(--bg-secondary)]/50 shrink-0">
          <div className="flex items-center gap-2.5 md:gap-3">
            <div className="p-2 md:p-3 bg-[var(--primary-green)] text-white rounded-xl md:rounded-2xl shadow-lg shadow-emerald-500/20">
              <PlusIcon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-black text-[var(--text-main)]">
                {language === 'id' ? 'Kalkulator Mandiri' : 'Self Calculator'}
              </h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5 md:mt-1">
                {language === 'id' ? 'Input asupan makanan manual' : 'Manual food intake calculator'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsManualInputOpen(false)} 
            className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-rose-500 transition-colors shadow-sm active:scale-95"
          >
            <XMarkIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-[var(--bg-primary)]/30">
          <FoodForm 
            onAddFood={(entry) => {
              addFoodEntry(entry);
              setIsManualInputOpen(false); // auto close on add!
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default ManualCalculatorModal;
