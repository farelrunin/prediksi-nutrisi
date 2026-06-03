import React from 'react';
import { Camera } from 'lucide-react';

const ProfileAvatarCard = ({
  formData,
  previewImage,
  isEditMode,
  getInitials,
  handleImageUpload,
  isProfileComplete,
  bmi,
  bmiStatus,
  t,
}) => {
  return (
    <div className="order-1 lg:order-none bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[2.5rem] p-4 md:p-8 shadow-xl text-center relative overflow-hidden group">
      <div className="relative mx-auto w-24 h-24 md:w-40 md:h-40 mb-4 md:mb-8">
        {previewImage ? (
          <img
            src={previewImage?.startsWith('http') || previewImage?.startsWith('blob') || previewImage?.startsWith('data:') ? previewImage : `https://nutriai-backend-production-2987.up.railway.app${previewImage}`}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--primary-green)] to-[var(--accent-blue)] flex items-center justify-center border-4 border-white shadow-xl">
            <span className="text-3xl md:text-5xl font-bold text-white">{getInitials()}</span>
          </div>
        )}
        {isEditMode && (
          <label className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-[var(--text-main)] hover:bg-[var(--primary-green)] rounded-xl md:rounded-2xl p-2.5 md:p-4 cursor-pointer transition-all shadow-lg hover:scale-110 active:scale-95 animate-in zoom-in duration-200">
            <Camera size={14} className="text-white md:w-5 md:h-5" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}
      </div>

      <h2 className="text-lg md:text-2xl font-bold text-[var(--text-main)] mb-0.5 md:mb-1">{formData.fullName || 'User'}</h2>
      <p className="text-[10px] md:text-xs font-semibold text-[var(--text-muted)] mb-4 md:mb-8">{formData.email}</p>

      <div className="space-y-3 md:space-y-6 pt-4 md:pt-8 border-t border-[var(--border-card)]/30 text-left">
        <div className="flex justify-between items-center">
          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Completeness</span>
          <span className="text-[10px] md:text-xs font-bold text-[var(--primary-green)]">{isProfileComplete ? '100%' : '60%'}</span>
        </div>
        <div className="h-1.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden p-[1px]">
          <div className={`h-full bg-[var(--primary-green)] rounded-full transition-all duration-1000 ${isProfileComplete ? 'w-full' : 'w-[60%]'}`} />
        </div>
      </div>

      {bmi && (
        <div className="grid grid-cols-2 gap-3 mt-4 md:mt-10">
          <div className="bg-[var(--bg-secondary)] rounded-xl md:rounded-3xl p-3 md:p-5 border border-transparent">
            <div className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-0.5 md:mb-1">BMI</div>
            <div className={`text-base md:text-xl font-extrabold ${bmiStatus?.color}`}>{bmi}</div>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-xl md:rounded-3xl p-3 md:p-5 border border-transparent">
            <div className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-0.5 md:mb-1">Status</div>
            <div className={`text-[10px] md:text-xs font-bold uppercase tracking-tight ${bmiStatus?.color}`}>{bmiStatus?.status}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatarCard;
