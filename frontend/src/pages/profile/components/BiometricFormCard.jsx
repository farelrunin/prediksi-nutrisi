import React from 'react';
import { User as UserIcon, Heart, Sun } from 'lucide-react';

const BiometricFormCard = ({
  formData,
  setFormData,
  handleChange,
  isEditMode,
  errors,
  t,
  language,
}) => {
  return (
    <div className="order-2 lg:order-none bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[2.5rem] p-4 md:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="p-2 bg-[var(--primary-green)]/10 rounded-lg md:rounded-xl text-[var(--primary-green)]">
          <UserIcon size={16} className="md:w-5 md:h-5" />
        </div>
        <h2 className="text-sm md:text-lg font-bold text-[var(--text-main)] uppercase tracking-wide">
          {language === 'id' ? 'Informasi Personal & Biometrik' : 'Personal & Biometric Information'}
        </h2>
      </div>

      {/* Row 1: Nama Lengkap dan Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">{t.fullName}</label>
          <input
            id="fullName"
            type="text" name="fullName" value={formData.fullName} onChange={handleChange}
            maxLength="100"
            disabled={!isEditMode}
            className={`w-full px-3.5 py-2 md:px-6 md:py-4 rounded-lg md:rounded-2xl text-xs md:text-sm bg-[var(--bg-secondary)] border text-[var(--text-main)] font-semibold outline-none transition-all ${
              !isEditMode 
                ? 'border-transparent opacity-80 cursor-not-allowed select-none bg-[var(--bg-secondary)]/50' 
                : errors.fullName 
                  ? 'border-rose-500 bg-rose-50' 
                  : 'border-transparent focus:border-[var(--primary-green)]'
            }`}
          />
          {errors.fullName && <p className="text-[9px] font-bold text-rose-500 ml-2 animate-pulse">{errors.fullName}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">{t.email}</label>
          <input
            id="email"
            type="email" name="email" value={formData.email} disabled
            className="w-full px-3.5 py-2 md:px-6 md:py-4 rounded-lg md:rounded-2xl text-xs md:text-sm bg-[var(--bg-secondary)]/80 dark:bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-muted)] font-semibold opacity-60 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Row 2: Jenis Kelamin dan Usia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="space-y-1.5">
          <label htmlFor="gender" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">{t.gender}</label>
          <select
            id="gender"
            name="gender" value={formData.gender} onChange={handleChange}
            disabled={!isEditMode}
            className={`w-full px-3.5 py-2 md:px-6 md:py-4 rounded-lg md:rounded-2xl text-xs md:text-sm bg-[var(--bg-secondary)] border text-[var(--text-main)] font-semibold outline-none transition-all appearance-none ${
              !isEditMode 
                ? 'border-transparent opacity-80 cursor-not-allowed bg-[var(--bg-secondary)]/50' 
                : errors.gender 
                  ? 'border-rose-500 bg-rose-50' 
                  : 'border-transparent focus:border-[var(--primary-green)]'
            }`}
          >
            <option value="">{t.selectGender}</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
          </select>
          {errors.gender && <p className="text-[9px] font-bold text-rose-500 ml-2 animate-pulse">{errors.gender}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="age" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">{t.age}</label>
          <input
            id="age"
            type="number" name="age" value={formData.age} onChange={handleChange}
            min={10} max={100}
            disabled={!isEditMode}
            className={`w-full px-3.5 py-2 md:px-6 md:py-4 rounded-lg md:rounded-2xl text-xs md:text-sm bg-[var(--bg-secondary)] border text-[var(--text-main)] font-semibold outline-none transition-all ${
              !isEditMode 
                ? 'border-transparent opacity-80 cursor-not-allowed bg-[var(--bg-secondary)]/50' 
                : 'border-transparent focus:border-[var(--primary-green)]'
            }`}
          />
        </div>
      </div>

      {/* Row 3: Tinggi dan Berat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="space-y-1.5">
          <label htmlFor="height" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">{t.height}</label>
          <input
            id="height"
            type="number" name="height" value={formData.height} onChange={handleChange}
            min={50} max={300}
            disabled={!isEditMode}
            className={`w-full px-3.5 py-2 md:px-6 md:py-4 rounded-lg md:rounded-2xl text-xs md:text-sm bg-[var(--bg-secondary)]/80 dark:bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-semibold outline-none transition-all ${
              !isEditMode 
                ? 'border-transparent opacity-80 cursor-not-allowed bg-[var(--bg-secondary)]/50' 
                : 'border-transparent focus:border-[var(--primary-green)]'
            }`}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="weight" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">{t.weight}</label>
          <input
            id="weight"
            type="number" name="weight" value={formData.weight} onChange={handleChange}
            min={10} max={500}
            disabled={!isEditMode}
            className={`w-full px-3.5 py-2 md:px-6 md:py-4 rounded-lg md:rounded-2xl text-xs md:text-sm bg-[var(--bg-secondary)]/80 dark:bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-semibold outline-none transition-all ${
              !isEditMode 
                ? 'border-transparent opacity-80 cursor-not-allowed bg-[var(--bg-secondary)]/50' 
                : 'border-transparent focus:border-[var(--primary-green)]'
            }`}
          />
        </div>
      </div>

      {/* Special Conditions (Pregnancy/Breastfeeding) inside Combined Card */}
      {formData.gender === 'female' && (
        <div className="mt-6 pt-6 border-t border-[var(--border-card)]/30">
          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1 block mb-4">{t.specialConditions}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-[1.5rem] border transition-all flex items-center justify-between ${
              formData.is_pregnant 
                ? 'border-[var(--primary-green)] bg-emerald-50 dark:bg-emerald-950/20' 
                : 'border-[var(--border-card)] bg-[var(--bg-secondary)]'
            } ${!isEditMode ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                 onClick={() => {
                   if (!isEditMode) return;
                   setFormData(prev => ({ ...prev, is_pregnant: !prev.is_pregnant, is_breastfeeding: false }));
                 }}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${formData.is_pregnant ? 'bg-[var(--primary-green)] text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                  <Heart className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs md:text-sm text-[var(--text-main)]">{t.pregnant}</p>
                  <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${formData.is_pregnant ? 'text-[var(--primary-green)]' : 'text-[var(--text-muted)] opacity-60'}`}>
                    {formData.is_pregnant ? t.pregnancyMode : t.clickToActivate}
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.is_pregnant ? 'border-[var(--primary-green)] bg-[var(--primary-green)]' : 'border-slate-300'}`}>
                {formData.is_pregnant && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </div>

            <div className={`p-4 rounded-[1.5rem] border transition-all flex items-center justify-between ${
              formData.is_breastfeeding 
                ? 'border-[var(--accent-blue)] bg-blue-50 dark:bg-blue-950/20' 
                : 'border-[var(--border-card)] bg-[var(--bg-secondary)]'
            } ${!isEditMode ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                 onClick={() => {
                   if (!isEditMode) return;
                   setFormData(prev => ({ ...prev, is_breastfeeding: !prev.is_breastfeeding, is_pregnant: false }));
                 }}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${formData.is_breastfeeding ? 'bg-[var(--accent-blue)] text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                  <Sun className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs md:text-sm text-[var(--text-main)]">{t.breastfeeding}</p>
                  <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${formData.is_breastfeeding ? 'text-[var(--accent-blue)]' : 'text-[var(--text-muted)] opacity-60'}`}>
                    {formData.is_breastfeeding ? t.breastfeedingMode : t.clickToActivate}
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.is_breastfeeding ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]' : 'border-slate-300'}`}>
                {formData.is_breastfeeding && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiometricFormCard;
