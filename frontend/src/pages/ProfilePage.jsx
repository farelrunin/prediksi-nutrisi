import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Save,
  RotateCcw,
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle2,
  Camera,
  Zap,
  Target,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { authService } from '../services/authService';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    targetCalories: '',
    targetProtein: '',
    targetCarbs: '',
    targetFat: '',
    nutritionGoal: '',
    activityLevel: '',
    exerciseFrequency: '',
    sleepHours: '',
    allergies: '',
    restrictions: '',
    healthNotes: '',
    preferences: [],
  });

  // Sync with user context and fetch from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const backendProfile = await authService.getProfile();
        const p = backendProfile.profile || {};
        
        setFormData({
          fullName: backendProfile.name || user.name || '',
          email: backendProfile.email || user.email || '',
          phone: p.phone || '',
          dateOfBirth: p.dateOfBirth || '',
          gender: p.gender || '',
          age: p.age || '',
          height: p.height || '',
          weight: p.weight || '',
          targetCalories: p.targetCalories || '',
          targetProtein: p.targetProtein || '',
          targetCarbs: p.targetCarbs || '',
          targetFat: p.targetFat || '',
          nutritionGoal: p.nutritionGoal || '',
          activityLevel: p.activityLevel || '',
          exerciseFrequency: p.exerciseFrequency || '',
          sleepHours: p.sleepHours || '',
          allergies: p.allergies || '',
          restrictions: p.restrictions || '',
          healthNotes: p.healthNotes || '',
          preferences: p.preferences || [],
        });
        
        if (backendProfile.avatar_url) {
          setPreviewImage(backendProfile.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to basic user info if backend fetch fails
        setFormData(prev => ({
          ...prev,
          fullName: user.name || '',
          email: user.email || '',
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Calculate BMI
  const calculateBMI = () => {
    if (!formData.height || !formData.weight) return null;
    const heightInMeters = formData.height / 100;
    return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Get BMI Status
  const getBMIStatus = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { status: 'Kurus', color: 'text-blue-400' };
    if (bmi < 25) return { status: 'Normal', color: 'text-emerald-400' };
    if (bmi < 30) return { status: 'Berlebih', color: 'text-yellow-400' };
    return { status: 'Obesitas', color: 'text-red-400' };
  };

  const bmi = calculateBMI();
  const bmiStatus = bmi ? getBMIStatus(bmi) : null;

  // Check if profile is complete
  const isProfileComplete =
    formData.fullName &&
    formData.email &&
    formData.gender &&
    formData.height &&
    formData.weight &&
    formData.nutritionGoal;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        preferences: checked
          ? [...prev.preferences, value]
          : prev.preferences.filter((p) => p !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result;
        setPreviewImage(imageData);
        setProfileImage(file);
        localStorage.setItem('nutrisiAI_avatar', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Nama wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    if (!formData.gender) newErrors.gender = 'Jenis kelamin wajib dipilih';
    if (!formData.height || formData.height <= 0) {
      newErrors.height = 'Tinggi badan harus lebih dari 0';
    }
    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Berat badan harus lebih dari 0';
    }
    if (!formData.targetCalories || formData.targetCalories <= 0) {
      newErrors.targetCalories = 'Target kalori harus lebih dari 0';
    }
    if (!formData.nutritionGoal) newErrors.nutritionGoal = 'Tujuan nutrisi wajib dipilih';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('nutrisiAI_profile', JSON.stringify(formData));

      // Try to save to backend if available
      try {
        await authService.updateProfile(formData);
      } catch (err) {
        console.warn('Backend not available, saved to localStorage');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Gagal menyimpan profil. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset form?')) {
      setFormData({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        age: '',
        height: '',
        weight: '',
        targetCalories: '',
        targetProtein: '',
        targetCarbs: '',
        targetFat: '',
        nutritionGoal: '',
        activityLevel: '',
        exerciseFrequency: '',
        sleepHours: '',
        allergies: '',
        restrictions: '',
        healthNotes: '',
        preferences: [],
      });
      setErrors({});
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!formData.fullName) return 'U';
    return formData.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-24 pt-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
              Profil <span className="text-[var(--primary-green)]">Saya</span>
            </h1>
            <p className="mt-2 text-[var(--text-muted)] font-medium">Atur informasi fisik dan target nutrisi Anda.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-white border border-[var(--border-card)] px-6 py-3 rounded-2xl text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all shadow-sm"
          >
            <ArrowLeft size={16} /> Kembali
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 rounded-[2rem] border border-[var(--primary-green)]/20 bg-emerald-50 flex items-center gap-4 animate-in slide-in-from-top duration-500 shadow-sm">
            <div className="p-2 bg-[var(--primary-green)] rounded-xl text-white">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-sm font-bold text-[var(--primary-green)]">Profil Berhasil Diperbarui!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Avatar & BMI */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-10 shadow-xl text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--primary-green)] to-[var(--accent-blue)]" />
              
              <div className="relative mx-auto w-40 h-40 mb-8">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full rounded-[2.5rem] object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-[var(--primary-green)] to-[var(--accent-blue)] flex items-center justify-center border-4 border-white shadow-xl">
                    <span className="text-5xl font-bold text-white">{getInitials()}</span>
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 bg-[var(--text-main)] hover:bg-[var(--primary-green)] rounded-2xl p-4 cursor-pointer transition-all shadow-lg hover:scale-110 active:scale-95">
                  <Camera size={20} className="text-white" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-1">{formData.fullName || 'User'}</h3>
              <p className="text-xs font-semibold text-[var(--text-muted)] mb-8">{formData.email}</p>

              <div className="space-y-6 pt-8 border-t border-slate-100 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Kelengkapan</span>
                  <span className="text-xs font-bold text-[var(--primary-green)]">{isProfileComplete ? '100%' : '60%'}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-[1px]">
                  <div className={`h-full bg-[var(--primary-green)] rounded-full transition-all duration-1000 ${isProfileComplete ? 'w-full' : 'w-[60%]'}`} />
                </div>
              </div>

              {bmi && (
                <div className="grid grid-cols-2 gap-4 mt-10">
                  <div className="bg-[var(--bg-secondary)] rounded-3xl p-5 border border-transparent">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">BMI</div>
                    <div className={`text-xl font-extrabold ${bmiStatus?.color}`}>{bmi}</div>
                  </div>
                  <div className="bg-[var(--bg-secondary)] rounded-3xl p-5 border border-transparent">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Status</div>
                    <div className={`text-xs font-bold uppercase tracking-tight ${bmiStatus?.color}`}>{bmiStatus?.status}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="lg:col-span-8 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Seksi: Informasi Dasar */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-10 shadow-xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-2.5 bg-[var(--primary-green)]/10 rounded-xl text-[var(--primary-green)]">
                    <User size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-wide">Informasi Dasar</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Nama Lengkap</label>
                    <input
                      type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Email</label>
                    <input
                      type="email" name="email" value={formData.email} disabled
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 font-semibold opacity-60 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Jenis Kelamin</label>
                    <select
                      name="gender" value={formData.gender} onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] outline-none transition-all appearance-none"
                    >
                      <option value="">Pilih...</option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Tanggal Lahir</label>
                    <input
                      type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi: Data Fisik */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-10 shadow-xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-2.5 bg-[var(--accent-blue)]/10 rounded-xl text-[var(--accent-blue)]">
                    <Zap size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-wide">Data Fisik</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: 'Tinggi (cm)', name: 'height', val: formData.height },
                    { label: 'Berat (kg)', name: 'weight', val: formData.weight },
                    { label: 'Usia', name: 'age', val: formData.age },
                    { label: 'Tidur (jam)', name: 'sleepHours', val: formData.sleepHours }
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">{field.label}</label>
                      <input
                        type="number" name={field.name} value={field.val} onChange={handleChange}
                        className="w-full px-4 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-extrabold text-center focus:border-[var(--primary-green)] outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Seksi: Target Nutrisi */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-10 shadow-xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-2.5 bg-[var(--warning)]/10 rounded-xl text-[var(--warning)]">
                    <Target size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-wide">Target Nutrisi</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                  {[
                    { label: 'Kalori', name: 'targetCalories', val: formData.targetCalories, color: 'focus:border-[var(--primary-green)]' },
                    { label: 'Protein (g)', name: 'targetProtein', val: formData.targetProtein, color: 'focus:border-[var(--accent-blue)]' },
                    { label: 'Karbo (g)', name: 'targetCarbs', val: formData.targetCarbs, color: 'focus:border-[var(--warning)]' },
                    { label: 'Lemak (g)', name: 'targetFat', val: formData.targetFat, color: 'focus:border-[var(--danger)]' }
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">{field.label}</label>
                      <input
                        type="number" name={field.name} value={field.val} onChange={handleChange}
                        className={`w-full px-4 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-extrabold text-center outline-none transition-all ${field.color}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Tujuan Nutrisi</label>
                  <select
                    name="nutritionGoal" value={formData.nutritionGoal} onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] outline-none transition-all appearance-none"
                  >
                    <option value="">Pilih Tujuan...</option>
                    <option value="maintain">Menjaga Berat Badan</option>
                    <option value="lose">Menurunkan Berat Badan</option>
                    <option value="gain">Menaikkan Berat Badan</option>
                    <option value="build_muscle">Membentuk Massa Otot</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-5">
                <button
                  type="submit" disabled={loading}
                  className="flex-1 group relative flex items-center justify-center gap-3 bg-[var(--primary-green)] px-10 py-5 rounded-2xl font-bold text-white text-lg shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50"
                >
                  {loading ? <RotateCcw className="animate-spin" /> : <Save size={24} />}
                  <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
                <button
                  type="button" onClick={handleReset}
                  className="px-10 py-5 rounded-2xl border border-slate-200 bg-white text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs hover:text-[var(--danger)] hover:border-rose-200 transition-all shadow-sm"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;