import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { translateFoodToId } from '../../../utils/foodHelpers';

const PortionModal = ({
  isAddModalOpen,
  setIsAddModalOpen,
  selectedFoodToAdd,
  mealType,
  setMealType,
  portionQuantity,
  setPortionQuantity,
  portionUnit,
  setPortionUnit,
  isSubmitting,
  setIsSubmitting,
  addFoodEntry,
  language,
}) => {
  if (!isAddModalOpen || !selectedFoodToAdd) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={() => setIsAddModalOpen(false)} 
      />
      <div className="relative w-[95%] md:w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
        <div className="p-4 md:p-6 border-b border-[var(--border-card)] flex justify-between items-center bg-[var(--bg-secondary)]/50 shrink-0">
          <h3 className="text-sm md:text-lg font-black text-[var(--text-main)]">
            {language === 'id' ? 'Pilih Sesi & Porsi' : 'Choose Session & Portion'}
          </h3>
          <button 
            onClick={() => setIsAddModalOpen(false)} 
            className="p-1.5 rounded-lg md:p-2 bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-rose-500 transition-colors shadow-sm active:scale-95"
          >
            <XMarkIcon className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-[var(--bg-primary)]/30">
          <div>
            <p className="text-[8px] md:text-[10px] font-black text-[var(--primary-green)] uppercase tracking-wider mb-0.5 md:mb-1">
              {language === 'id' ? 'Makanan Dipilih' : 'Selected Food'}
            </p>
            <p className="font-extrabold text-[var(--text-main)] text-sm md:text-base">
              {language === 'id' ? translateFoodToId(selectedFoodToAdd.food_name_id || selectedFoodToAdd.food_name_en) : (selectedFoodToAdd.food_name_id || selectedFoodToAdd.food_name_en)}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">
              {selectedFoodToAdd.food_name_en}
            </p>
          </div>

          {/* Sesi Makan Selector */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-1.5 md:mb-2">
              {language === 'id' ? 'Sesi Makan' : 'Meal Session'}
            </label>
            <div className="grid grid-cols-2 gap-1.5 md:gap-2">
              {[
                { value: 'breakfast', label: language === 'id' ? 'Sarapan' : 'Breakfast' },
                { value: 'lunch', label: language === 'id' ? 'Makan Siang' : 'Lunch' },
                { value: 'dinner', label: language === 'id' ? 'Makan Malam' : 'Dinner' },
                { value: 'snack', label: language === 'id' ? 'Cemilan' : 'Snack' }
              ].map((session) => (
                <button
                  key={session.value}
                  type="button"
                  onClick={() => setMealType(session.value)}
                  className={`px-3 py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all border ${
                    mealType === session.value
                      ? 'bg-[var(--primary-green)] text-white border-transparent shadow-lg shadow-emerald-500/20'
                      : 'bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-card)] hover:border-[var(--primary-green)]/40'
                  }`}
                >
                  {session.label}
                </button>
              ))}
            </div>
          </div>

          {/* Porsi & Satuan */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-1.5 md:mb-2">
                {language === 'id' ? 'Jumlah Porsi' : 'Portion Quantity'}
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={portionQuantity}
                onChange={(e) => setPortionQuantity(Math.max(0.1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-lg md:px-4 md:py-3 md:rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] font-bold text-xs md:text-sm focus:outline-none focus:border-[var(--primary-green)] transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-1.5 md:mb-2">
                {language === 'id' ? 'Satuan' : 'Unit'}
              </label>
              <select
                value={portionUnit}
                onChange={(e) => setPortionUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg md:px-4 md:py-3 md:rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] font-bold text-xs md:text-sm focus:outline-none focus:border-[var(--primary-green)] transition-all"
              >
                <option value="porsi">{language === 'id' ? 'Porsi (Saji)' : 'Portion'}</option>
                <option value="gram">Gram (g)</option>
              </select>
            </div>
          </div>

          {/* Simpan Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={async () => {
              setIsSubmitting(true);
              try {
                const scale = portionUnit === 'gram' ? portionQuantity / 100 : portionQuantity;
                const finalData = {
                  foodName: language === 'id' ? translateFoodToId(selectedFoodToAdd.food_name_id || selectedFoodToAdd.food_name_en) : (selectedFoodToAdd.food_name_id || selectedFoodToAdd.food_name_en),
                  mealType: mealType,
                  quantity: Number(portionQuantity),
                  unit: portionUnit === 'gram' ? 'g' : 'porsi',
                  calories: Math.max(0, Math.round((selectedFoodToAdd.calories || 0) * scale)),
                  protein: Math.max(0, Number(((selectedFoodToAdd.protein || 0) * scale).toFixed(1))),
                  carbs: Math.max(0, Number(((selectedFoodToAdd.carbohydrates || 0) * scale).toFixed(1))),
                  fat: Math.max(0, Number(((selectedFoodToAdd.total_fat || 0) * scale).toFixed(1)))
                };
                await addFoodEntry(finalData);
                setIsAddModalOpen(false);
                setPortionQuantity(1);
              } catch (err) {
                console.error("Gagal menyimpan makanan:", err);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="w-full py-3 rounded-lg md:py-4 md:rounded-xl bg-gradient-to-r from-[var(--primary-green)] to-[var(--secondary-green)] text-white font-extrabold text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{language === 'id' ? 'Simpan ke Jurnal' : 'Save to Journal'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortionModal;
