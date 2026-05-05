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

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('nutrisiAI_profile');
    const savedProfile = saved ? JSON.parse(saved) : {};

    return {
      // Informasi Akun
      fullName: savedProfile.fullName || user?.name || '',
      email: savedProfile.email || user?.email || '',
      phone: savedProfile.phone || '',
      dateOfBirth: savedProfile.dateOfBirth || '',
      gender: savedProfile.gender || '',

      // Data Fisik
      age: savedProfile.age || '',
      height: savedProfile.height || '',
      weight: savedProfile.weight || '',

      // Preferensi Nutrisi
      targetCalories: savedProfile.targetCalories || '',
      targetProtein: savedProfile.targetProtein || '',
      targetCarbs: savedProfile.targetCarbs || '',
      targetFat: savedProfile.targetFat || '',
      nutritionGoal: savedProfile.nutritionGoal || '',

      // Aktivitas Harian
      activityLevel: savedProfile.activityLevel || '',
      exerciseFrequency: savedProfile.exerciseFrequency || '',
      sleepHours: savedProfile.sleepHours || '',

      // Kondisi Tambahan
      allergies: savedProfile.allergies || '',
      restrictions: savedProfile.restrictions || '',
      healthNotes: savedProfile.healthNotes || '',
      preferences: savedProfile.preferences || [],
    };
  });

  // Load avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('nutrisiAI_avatar');
    if (savedAvatar) {
      setPreviewImage(savedAvatar);
    }
  }, []);

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
    <div className="min-h-screen bg-[#06140f] pb-12">
      {/* Header */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg border border-white/10 hover:border-white/20"
            >
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </button>
            <h1 className="text-3xl font-bold text-white">Profil Pengguna</h1>
            <div className="w-[120px]" />
          </div>
          <p className="text-slate-300 text-center">
            Lengkapi data diri agar analisis nutrisi lebih akurat
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400" />
            <span className="text-emerald-300">Profil berhasil disimpan!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1">
            {/* Avatar Section */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="relative mx-auto w-32 h-32 mb-4">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 border-emerald-500/30"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 flex items-center justify-center border-4 border-emerald-500/30">
                      <span className="text-4xl font-bold text-white">{getInitials()}</span>
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 rounded-full p-3 cursor-pointer transition-colors shadow-lg">
                    <Camera size={20} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{formData.fullName || 'Nama Pengguna'}</h3>
                <p className="text-sm text-slate-400 mb-4">{formData.email || 'Email'}</p>

                {/* Profile Completeness */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Kelengkapan</span>
                    <span className="text-sm font-semibold text-emerald-400">
                      {isProfileComplete ? '100%' : '0%'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isProfileComplete
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 w-full'
                          : 'bg-slate-500 w-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                {bmi && (
                  <div className="space-y-3 text-left border-t border-white/10 pt-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">BMI</p>
                      <p className={`text-lg font-bold ${bmiStatus?.color}`}>{bmi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Status</p>
                      <p className={`font-semibold ${bmiStatus?.color}`}>{bmiStatus?.status}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Target Kalori</p>
                      <p className="text-lg font-bold text-emerald-400">{formData.targetCalories || '-'} kkal</p>
                    </div>
                  </div>
                )}

                {!isProfileComplete && (
                  <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-gap-2">
                    <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-300 text-left">
                      Lengkapi profil untuk rekomendasi yang lebih akurat
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informasi Akun */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User size={24} className="text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">Informasi Akun</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                        errors.fullName ? 'border-red-500' : 'border-white/20'
                      } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan email"
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                        errors.email ? 'border-red-500' : 'border-white/20'
                      } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Nomor HP
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Masukkan nomor HP"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Jenis Kelamin *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                        errors.gender ? 'border-red-500' : 'border-white/20'
                      } text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-400 text-xs mt-1">{errors.gender}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Fisik */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Data Fisik</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Usia (tahun)
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Tinggi Badan (cm) *
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="170"
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                        errors.height ? 'border-red-500' : 'border-white/20'
                      } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    />
                    {errors.height && (
                      <p className="text-red-400 text-xs mt-1">{errors.height}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Berat Badan (kg) *
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="65"
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                        errors.weight ? 'border-red-500' : 'border-white/20'
                      } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    />
                    {errors.weight && (
                      <p className="text-red-400 text-xs mt-1">{errors.weight}</p>
                    )}
                  </div>

                  {bmi && (
                    <div className="col-span-2 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">BMI Anda</p>
                          <p className={`text-2xl font-bold ${bmiStatus?.color}`}>{bmi}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Status</p>
                          <p className={`text-lg font-semibold ${bmiStatus?.color}`}>{bmiStatus?.status}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preferensi Nutrisi */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Preferensi Nutrisi</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Target Kalori Harian (kkal) *
                    </label>
                    <input
                      type="number"
                      name="targetCalories"
                      value={formData.targetCalories}
                      onChange={handleChange}
                      placeholder="2000"
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                        errors.targetCalories ? 'border-red-500' : 'border-white/20'
                      } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    />
                    {errors.targetCalories && (
                      <p className="text-red-400 text-xs mt-1">{errors.targetCalories}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Target Protein (g)
                    </label>
                    <input
                      type="number"
                      name="targetProtein"
                      value={formData.targetProtein}
                      onChange={handleChange}
                      placeholder="75"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Target Karbohidrat (g)
                    </label>
                    <input
                      type="number"
                      name="targetCarbs"
                      value={formData.targetCarbs}
                      onChange={handleChange}
                      placeholder="300"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Target Lemak (g)
                    </label>
                    <input
                      type="number"
                      name="targetFat"
                      value={formData.targetFat}
                      onChange={handleChange}
                      placeholder="65"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Tujuan Nutrisi *
                    </label>
                    <select
                      name="nutritionGoal"
                      value={formData.nutritionGoal}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                        errors.nutritionGoal ? 'border-red-500' : 'border-white/20'
                      } text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    >
                      <option value="">Pilih Tujuan Nutrisi</option>
                      <option value="maintain">Menjaga Berat Badan</option>
                      <option value="lose">Menurunkan Berat Badan</option>
                      <option value="gain">Menaikkan Berat Badan</option>
                      <option value="build_muscle">Membentuk Massa Otot</option>
                      <option value="improve_diet">Memperbaiki Pola Makan</option>
                    </select>
                    {errors.nutritionGoal && (
                      <p className="text-red-400 text-xs mt-1">{errors.nutritionGoal}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Aktivitas Harian */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Aktivitas Harian</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Tingkat Aktivitas
                    </label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    >
                      <option value="">Pilih Tingkat Aktivitas</option>
                      <option value="very_low">Sangat Rendah</option>
                      <option value="light">Ringan</option>
                      <option value="moderate">Sedang</option>
                      <option value="active">Aktif</option>
                      <option value="very_active">Sangat Aktif</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Frekuensi Olahraga (x/minggu)
                    </label>
                    <input
                      type="number"
                      name="exerciseFrequency"
                      value={formData.exerciseFrequency}
                      onChange={handleChange}
                      placeholder="3"
                      min="0"
                      max="7"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Jam Tidur Rata-rata (jam/hari)
                    </label>
                    <input
                      type="number"
                      name="sleepHours"
                      value={formData.sleepHours}
                      onChange={handleChange}
                      placeholder="8"
                      min="0"
                      max="24"
                      step="0.5"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              {/* Kondisi Tambahan */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Kondisi Tambahan</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Alergi Makanan
                    </label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="Misalnya: Kacang, Seafood, Susu"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Pantangan Makanan
                    </label>
                    <input
                      type="text"
                      name="restrictions"
                      value={formData.restrictions}
                      onChange={handleChange}
                      placeholder="Misalnya: Daging Merah, MSG, Pedas"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Catatan Kesehatan
                    </label>
                    <textarea
                      name="healthNotes"
                      value={formData.healthNotes}
                      onChange={handleChange}
                      placeholder="Misalnya: Maag, Kolesterol Tinggi, Tekanan Darah Tinggi"
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-3">
                      Preferensi Makanan
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'halal', label: 'Halal' },
                        { value: 'vegetarian', label: 'Vegetarian' },
                        { value: 'low_sugar', label: 'Rendah Gula' },
                        { value: 'low_salt', label: 'Rendah Garam' },
                        { value: 'organic', label: 'Organik' },
                      ].map((pref) => (
                        <label
                          key={pref.value}
                          className="flex items-center gap-3 text-slate-300 cursor-pointer hover:text-white transition-colors"
                        >
                          <input
                            type="checkbox"
                            value={pref.value}
                            checked={formData.preferences.includes(pref.value)}
                            onChange={handleChange}
                            className="w-4 h-4 rounded bg-white/10 border border-white/20 accent-emerald-500 cursor-pointer"
                          />
                          <span className="text-sm">{pref.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Save size={20} />
                  {loading ? 'Menyimpan...' : 'Simpan Profil'}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 disabled:opacity-50 border border-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  <RotateCcw size={20} />
                  Reset Form
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  <ArrowLeft size={20} />
                  Kembali
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