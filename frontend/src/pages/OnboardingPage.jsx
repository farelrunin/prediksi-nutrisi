import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Check, Sparkles, User, Flame, Activity
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/useNotification';
import { authService } from '../services/authService';
import SoftAurora from '../components/shared/SoftAurora';

const OnboardingPage = () => {
  const { user, setUser } = useAuth();
  const { language } = useLanguage();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // States
  const [biometrics, setBiometrics] = useState({
    gender: '',
    age: '',
    height: '',
    weight: '',
    is_pregnant: false,
    is_breastfeeding: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!biometrics.gender || !biometrics.age || !biometrics.height || !biometrics.weight) {
      notify({ 
        type: 'warning', 
        title: language === 'id' ? 'Data Belum Lengkap' : 'Incomplete Data', 
        message: language === 'id' ? 'Pastikan semua kolom biometrik telah terisi.' : 'Please make sure all biometric fields are completed.' 
      });
      return;
    }

    const ageNum = parseInt(biometrics.age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      notify({
        type: 'warning',
        title: language === 'id' ? 'Usia Tidak Valid' : 'Invalid Age',
        message: language === 'id' ? 'Pastikan usia berada di antara 1 hingga 120 tahun.' : 'Please ensure the age is between 1 and 120 years.'
      });
      return;
    }

    const heightNum = parseFloat(biometrics.height);
    if (isNaN(heightNum) || heightNum < 50 || heightNum > 280) {
      notify({
        type: 'warning',
        title: language === 'id' ? 'Tinggi Tidak Valid' : 'Invalid Height',
        message: language === 'id' ? 'Pastikan tinggi badan berada di antara 50 hingga 280 cm.' : 'Please ensure the height is between 50 and 280 cm.'
      });
      return;
    }

    const weightNum = parseFloat(biometrics.weight);
    if (isNaN(weightNum) || weightNum < 10 || weightNum > 500) {
      notify({
        type: 'warning',
        title: language === 'id' ? 'Berat Tidak Valid' : 'Invalid Weight',
        message: language === 'id' ? 'Pastikan berat badan berada di antara 10 hingga 500 kg.' : 'Please ensure the weight is between 10 and 500 kg.'
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        gender: biometrics.gender,
        age: ageNum,
        height: heightNum,
        weight: weightNum,
        activity_level: "",
        nutrition_goal: "maintain",
        is_pregnant: biometrics.gender === 'female' ? biometrics.is_pregnant : false,
        is_breastfeeding: biometrics.gender === 'female' ? biometrics.is_breastfeeding : false,
        profile: {
          habits: [],
          onboardedAt: new Date().toISOString()
        },
        is_profile_completed: true
      };

      const updatedUser = await authService.updateProfile(payload);
      
      // Update global context
      setUser(updatedUser);

      notify({
        type: 'success',
        title: language === 'id' ? 'Profil Selesai!' : 'Profile Completed!',
        message: language === 'id' ? 'Selamat datang! Sistem telah menyetel target nutrisi harian Anda sesuai standar AKG.' : 'Welcome! The system has configured your daily nutritional targets based on AKG standards.'
      });

      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error(error);
      notify({
        type: 'error',
        title: language === 'id' ? 'Gagal Menyimpan' : 'Failed to Save',
        message: error.message || (language === 'id' ? 'Terjadi kesalahan saat menyimpan profil.' : 'An error occurred while saving your profile.')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center py-12 px-6 relative overflow-hidden">
      
      {/* Background - Animated Soft Aurora */}
      <div className="absolute inset-0 z-0 bg-[var(--bg-primary)]">
        <SoftAurora
          speed={0.3}
          scale={1.5}
          brightness={1.0}
          color1="#10B981"
          color2="#3B82F6"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.1}
        />
        <div className="absolute inset-0 bg-[var(--bg-primary)]/20" />
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-[var(--bg-card)]/80 backdrop-blur-2xl border border-[var(--border-card)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        
        {/* Step Indicator Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-green)]">Onboarding</span>
            <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full border border-[var(--border-card)]">AKG Profile Setup</span>
          </div>
        </div>

        {/* BIOMETRICS & PHYSICAL STATS */}
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="text-left">
            <h2 className="text-2xl font-black text-[var(--text-main)] mb-2">
              {language === 'id' ? 'Beri tahu kami tentang fisik Anda' : 'Tell us about your physical biometrics'}
            </h2>
            <p className="text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
              {language === 'id' 
                ? 'Data ini digunakan untuk menghitung Angka Kecukupan Gizi (AKG) Anda secara ilmiah.' 
                : 'This data is utilized to calculate your customized nutritional requirements based on AKG standards.'}
            </p>
          </div>

          <div className="space-y-6 text-left">
            {/* Gender selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Jenis Kelamin' : 'Gender'}</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'male', label: language === 'id' ? 'Laki-laki' : 'Male' },
                  { id: 'female', label: language === 'id' ? 'Perempuan' : 'Female' }
                ].map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setBiometrics({
                        ...biometrics,
                        gender: g.id,
                        is_pregnant: false,
                        is_breastfeeding: false
                      });
                    }}
                    className={`py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border ${
                      biometrics.gender === g.id 
                        ? 'bg-[var(--primary-green)] text-white border-transparent shadow-md' 
                        : 'bg-[var(--bg-secondary)]/30 border-[var(--border-card)] text-[var(--text-main)] hover:border-[var(--primary-green)]/30'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Conditions (Pregnancy/Breastfeeding) for Female */}
            {biometrics.gender === 'female' && (
              <div className="pt-2 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                  {language === 'id' ? 'Kondisi Khusus (Opsional)' : 'Special Conditions (Optional)'}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pregnant Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setBiometrics({
                        ...biometrics,
                        is_pregnant: !biometrics.is_pregnant,
                        is_breastfeeding: false // Ensures mutual exclusivity
                      });
                    }}
                    className={`p-5 rounded-[2rem] border text-left flex items-center justify-between transition-all ${
                      biometrics.is_pregnant
                        ? 'border-[var(--primary-green)] bg-[var(--primary-green)]/[0.03] shadow-md'
                        : 'bg-[var(--bg-secondary)]/30 border-[var(--border-card)] hover:border-[var(--primary-green)]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${biometrics.is_pregnant ? 'bg-[var(--primary-green)] text-white' : 'bg-[var(--bg-primary)] text-slate-400'}`}>
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-extrabold text-xs text-[var(--text-main)]">{language === 'id' ? 'Sedang Hamil' : 'Pregnant'}</p>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] mt-0.5">{language === 'id' ? 'Mode Bumil Aktif' : 'Pregnancy Mode'}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${biometrics.is_pregnant ? 'border-[var(--primary-green)] bg-[var(--primary-green)]' : 'border-slate-300'}`}>
                      {biometrics.is_pregnant && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>

                  {/* Breastfeeding Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setBiometrics({
                        ...biometrics,
                        is_breastfeeding: !biometrics.is_breastfeeding,
                        is_pregnant: false // Ensures mutual exclusivity
                      });
                    }}
                    className={`p-5 rounded-[2rem] border text-left flex items-center justify-between transition-all ${
                      biometrics.is_breastfeeding
                        ? 'border-[var(--accent-blue)] bg-blue-50/[0.03] shadow-md'
                        : 'bg-[var(--bg-secondary)]/30 border-[var(--border-card)] hover:border-[var(--primary-green)]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${biometrics.is_breastfeeding ? 'bg-[var(--accent-blue)] text-white' : 'bg-[var(--bg-primary)] text-slate-400'}`}>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-extrabold text-xs text-[var(--text-main)]">{language === 'id' ? 'Menyusui' : 'Breastfeeding'}</p>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] mt-0.5">{language === 'id' ? 'Mode Ibu Menyusui' : 'Lactation Mode'}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${biometrics.is_breastfeeding ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]' : 'border-slate-300'}`}>
                      {biometrics.is_breastfeeding && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Physical details row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Usia (Tahun)' : 'Age (Years)'}</label>
                <input 
                  type="number" 
                  value={biometrics.age}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || parseInt(val) >= 0) {
                      setBiometrics({ ...biometrics, age: val });
                    }
                  }}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-5 py-4 text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] text-center shadow-inner"
                  placeholder="0"
                  min="1"
                  max="120"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Tinggi (cm)' : 'Height (cm)'}</label>
                <input 
                  type="number" 
                  value={biometrics.height}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || parseFloat(val) >= 0) {
                      setBiometrics({ ...biometrics, height: val });
                    }
                  }}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-5 py-4 text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] text-center shadow-inner"
                  placeholder="0"
                  min="50"
                  max="280"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{language === 'id' ? 'Berat (kg)' : 'Weight (kg)'}</label>
                <input 
                  type="number" 
                  value={biometrics.weight}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || parseFloat(val) >= 0) {
                      setBiometrics({ ...biometrics, weight: val });
                    }
                  }}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-5 py-4 text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] text-center shadow-inner"
                  placeholder="0"
                  min="10"
                  max="500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--primary-green)] to-[var(--secondary-green)] text-[var(--bg-primary)] px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg w-full md:w-auto"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles size={14} className="animate-pulse" />
              )}
              <span>{loading ? (language === 'id' ? 'Menyimpan...' : 'Saving...') : (language === 'id' ? 'Selesaikan Profil' : 'Complete Profile')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default OnboardingPage;
