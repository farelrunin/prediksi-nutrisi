import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Save,
  RefreshCw,
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle2,
  Camera,
  Zap,
  Target,
  Heart,
  Sun,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { authService } from '../services/authService';
import { useNotification } from '../context/useNotification';
import ConfirmModal from '../components/shared/ConfirmModal';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Custom Cropper states
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
    is_pregnant: false,
    is_breastfeeding: false,
  });

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

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
          phone: backendProfile.phone || p.phone || '',
          dateOfBirth: backendProfile.birth_date || p.dateOfBirth || '',
          gender: backendProfile.gender || p.gender || '',
          age: backendProfile.age || p.age || '',
          height: backendProfile.height || p.height || '',
          weight: backendProfile.weight || p.weight || '',
          activityLevel: backendProfile.activity_level || p.activityLevel || '',
          nutritionGoal: backendProfile.nutrition_goal || p.nutritionGoal || '',
          targetCalories: backendProfile.target_calories || '',
          targetProtein: backendProfile.target_protein || '',
          targetCarbs: backendProfile.target_carbs || '',
          targetFat: backendProfile.target_fat || '',
          sleepHours: backendProfile.sleep_hours || '',
          allergies: p.allergies || '',
          restrictions: p.restrictions || '',
          healthNotes: p.healthNotes || '',
          preferences: p.preferences || [],
          is_pregnant: backendProfile.is_pregnant || false,
          is_breastfeeding: backendProfile.is_breastfeeding || false,
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
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        
        // Fix: Reset pregnancy/breastfeeding if gender is male
        if (name === 'gender' && value === 'male') {
          newData.is_pregnant = false;
          newData.is_breastfeeding = false;
        }
        
        // Auto-calculate targets when nutritionGoal changes
        if (name === 'nutritionGoal' && value) {
          const weight = parseFloat(prev.weight) || 70; // Fallback to 70kg if not set
          
          let targets = {};
          switch(value) {
            case 'lose':
              targets = {
                targetCalories: Math.round(weight * 25),
                targetProtein: Math.round(weight * 1.6),
                targetCarbs: Math.round(weight * 2.0),
                targetFat: Math.round(weight * 0.7)
              };
              break;
            case 'gain':
              targets = {
                targetCalories: Math.round(weight * 35),
                targetProtein: Math.round(weight * 1.8),
                targetCarbs: Math.round(weight * 4.5),
                targetFat: Math.round(weight * 1.0)
              };
              break;
            case 'build_muscle':
              targets = {
                targetCalories: Math.round(weight * 32),
                targetProtein: Math.round(weight * 2.2),
                targetCarbs: Math.round(weight * 3.5),
                targetFat: Math.round(weight * 0.8)
              };
              break;
            case 'maintain':
            default:
              targets = {
                targetCalories: Math.round(weight * 30),
                targetProtein: Math.round(weight * 1.2),
                targetCarbs: Math.round(weight * 3.5),
                targetFat: Math.round(weight * 0.9)
              };
              break;
          }
          Object.assign(newData, targets);
          notify({ 
            type: 'info', 
            title: 'Target Diperbarui', 
            message: `Target nutrisi disesuaikan otomatis untuk tujuan: ${value === 'lose' ? 'Menurunkan BB' : value === 'gain' ? 'Menaikkan BB' : value === 'build_muscle' ? 'Membentuk Otot' : 'Menjaga BB'}.` 
          });
        }
        
        return newData;
      });
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
      reader.onload = () => {
        setTempImage(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const size = 400; // Match the UI container size
        canvas.width = size;
        canvas.height = size;
        
        // Clear background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);

        // We want to capture exactly what's inside the 400x400 box
        // The image is scaled and then translated
        // Position x/y in state is relative to the center
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        
        const x = (size / 2) + position.x - (drawWidth / 2);
        const y = (size / 2) + position.y - (drawHeight / 2);

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        canvas.toBlob((blob) => {
          const croppedFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          const previewUrl = URL.createObjectURL(blob);
          setPreviewImage(previewUrl);
          setProfileImage(croppedFile);
          setIsCropping(false);
        }, 'image/jpeg', 0.9);
      };
      img.src = tempImage;
    } catch (e) {
      console.error(e);
      notify({ type: 'error', title: 'Pemrosesan Gagal', message: 'Gagal memproses gambar. Silakan coba lagi.' });
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Nama wajib diisi';
    if (!formData.gender) newErrors.gender = 'Jenis kelamin wajib dipilih';
    if (formData.height && formData.height <= 0) {
      newErrors.height = 'Tinggi badan harus lebih dari 0';
    }
    if (formData.weight && formData.weight <= 0) {
      newErrors.weight = 'Berat badan harus lebih dari 0';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      notify({ 
        type: 'warning', 
        title: 'Data Belum Lengkap', 
        message: 'Mohon lengkapi data yang wajib diisi: ' + Object.values(newErrors).join(', ') 
      });
      return false;
    }
    return true;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare data for backend (map camelCase to snake_case)
      const backendData = {
        name: formData.fullName,
        phone: formData.phone,
        birth_date: formData.dateOfBirth,
        gender: formData.gender,
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        activity_level: formData.activityLevel,
        nutrition_goal: formData.nutritionGoal,
        target_calories: formData.targetCalories ? parseFloat(formData.targetCalories) : null,
        target_protein: formData.targetProtein ? parseFloat(formData.targetProtein) : null,
        target_carbs: formData.targetCarbs ? parseFloat(formData.targetCarbs) : null,
        target_fat: formData.targetFat ? parseFloat(formData.targetFat) : null,
        sleep_hours: formData.sleepHours ? parseFloat(formData.sleepHours) : null,
        is_pregnant: formData.is_pregnant,
        is_breastfeeding: formData.is_breastfeeding,
      };

      // Try to save to backend if available
      if (profileImage) {
        await authService.uploadAvatar(profileImage);
      }
      
      const updatedUser = await authService.updateProfile(backendData);
      setUser(updatedUser);

      // Save to localStorage as backup
      localStorage.setItem('nutrisiAI_profile', JSON.stringify(formData));

      setSuccess(true);
      notify({ type: 'success', title: 'Berhasil', message: 'Profil Anda telah diperbarui.' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ global: error.message || 'Gagal menyimpan profil. Silakan coba lagi.' });
      notify({ type: 'error', title: 'Gagal Simpan', message: error.message || 'Terjadi kesalahan server saat menyimpan profil.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
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
    setIsResetModalOpen(false);
    notify({ type: 'info', title: 'Form Reset', message: 'Seluruh isian formulir telah dibersihkan.' });
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
      {/* Custom Cropper Modal */}
      {isCropping && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Atur Posisi Foto</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Geser foto untuk menyesuaikan posisi.</p>
              </div>
              <button onClick={() => setIsCropping(false)} className="p-3 rounded-2xl bg-white text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
                <RotateCcw size={20} />
              </button>
            </div>
            
            <div className="bg-slate-200 flex justify-center">
              <div 
                className="relative w-[400px] h-[400px] overflow-hidden cursor-move touch-none bg-slate-100"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Circular Overlay Guide - NOW PERFECT CIRCLE */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="w-full h-full shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-full border-2 border-white/50" />
                </div>
                
                {/* Crosshair Guide */}
                <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center opacity-30">
                  <div className="w-full h-[1px] bg-white absolute" />
                  <div className="h-full w-[1px] bg-white absolute" />
                </div>
                <img
                  src={tempImage}
                  alt="Crop preview"
                  className="absolute transition-transform duration-75 select-none pointer-events-none"
                  style={{
                    transform: `translate(calc(200px + ${position.x}px - 50%), calc(200px + ${position.y}px - 50%)) scale(${scale})`,
                    maxWidth: 'none',
                  }}
                  onLoad={(e) => {
                    // Initial scale to fit
                    const img = e.target;
                    const minScale = 400 / Math.min(img.naturalWidth, img.naturalHeight);
                    setScale(minScale);
                    setPosition({ x: 0, y: 0 });
                  }}
                />
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Ukuran</span>
                  <span>{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  value={scale}
                  min={0.1}
                  max={3}
                  step={0.01}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--primary-green)]"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsCropping(false)}
                  className="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleCropSave}
                  className="flex-1 px-8 py-4 rounded-2xl font-bold text-white bg-[var(--primary-green)] shadow-lg shadow-emerald-500/40 hover:scale-[1.02] active:scale-100 transition-all"
                >
                  Gunakan Foto Ini
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--primary-green)] to-[var(--accent-blue)] flex items-center justify-center border-4 border-white shadow-xl">
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
                      maxLength="100"
                      className={`w-full px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border text-[var(--text-main)] font-semibold outline-none transition-all ${errors.fullName ? 'border-rose-500 bg-rose-50' : 'border-transparent focus:border-[var(--primary-green)]'}`}
                    />
                    {errors.fullName && <p className="text-[10px] font-bold text-rose-500 ml-2 animate-pulse">{errors.fullName}</p>}
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
                      className={`w-full px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border text-[var(--text-main)] font-semibold outline-none transition-all appearance-none ${errors.gender ? 'border-rose-500 bg-rose-50' : 'border-transparent focus:border-[var(--primary-green)]'}`}
                    >
                      <option value="">Pilih...</option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                    {errors.gender && <p className="text-[10px] font-bold text-rose-500 ml-2 animate-pulse">{errors.gender}</p>}
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
                    { label: 'Tinggi (cm)', name: 'height', val: formData.height, min: 50, max: 300 },
                    { label: 'Berat (kg)', name: 'weight', val: formData.weight, min: 10, max: 500 },
                    { label: 'Usia', name: 'age', val: formData.age, min: 1, max: 120 },
                    { label: 'Tidur (jam)', name: 'sleepHours', val: formData.sleepHours, min: 0, max: 24 }
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">{field.label}</label>
                      <input
                        type="number" name={field.name} value={field.val} onChange={handleChange}
                        min={field.min} max={field.max}
                        className="w-full px-4 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-extrabold text-center focus:border-[var(--primary-green)] outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>

                {/* Special Conditions (Pregnancy/Breastfeeding) */}
                {formData.gender === 'female' && (
                  <div className="mt-10 pt-8 border-t border-slate-100">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1 block mb-6">Kondisi Khusus (Opsional)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between ${formData.is_pregnant ? 'border-[var(--primary-green)] bg-emerald-50' : 'border-[var(--border-card)] bg-[var(--bg-secondary)]'}`}
                           onClick={() => setFormData(prev => ({ ...prev, is_pregnant: !prev.is_pregnant, is_breastfeeding: false }))}>
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${formData.is_pregnant ? 'bg-[var(--primary-green)] text-white' : 'bg-white text-slate-400'}`}>
                            <Heart className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text-main)]">Sedang Hamil</p>
                            <p className="text-[10px] font-medium text-[var(--text-muted)]">Target nutrisi akan disesuaikan</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.is_pregnant ? 'border-[var(--primary-green)] bg-[var(--primary-green)]' : 'border-slate-300'}`}>
                          {formData.is_pregnant && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>

                      <div className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between ${formData.is_breastfeeding ? 'border-[var(--accent-blue)] bg-blue-50' : 'border-[var(--border-card)] bg-[var(--bg-secondary)]'}`}
                           onClick={() => setFormData(prev => ({ ...prev, is_breastfeeding: !prev.is_breastfeeding, is_pregnant: false }))}>
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${formData.is_breastfeeding ? 'bg-[var(--accent-blue)] text-white' : 'bg-white text-slate-400'}`}>
                            <Sun className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text-main)]">Sedang Menyusui</p>
                            <p className="text-[10px] font-medium text-[var(--text-muted)]">Target nutrisi akan disesuaikan</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.is_breastfeeding ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]' : 'border-slate-300'}`}>
                          {formData.is_breastfeeding && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                    { label: 'Kalori', name: 'targetCalories', val: formData.targetCalories, color: 'focus:border-[var(--primary-green)]', min: 0, max: 10000 },
                    { label: 'Protein (g)', name: 'targetProtein', val: formData.targetProtein, color: 'focus:border-[var(--accent-blue)]', min: 0, max: 1000 },
                    { label: 'Karbo (g)', name: 'targetCarbs', val: formData.targetCarbs, color: 'focus:border-[var(--warning)]', min: 0, max: 1000 },
                    { label: 'Lemak (g)', name: 'targetFat', val: formData.targetFat, color: 'focus:border-[var(--danger)]', min: 0, max: 1000 }
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">{field.label}</label>
                      <input
                        type="number" name={field.name} value={field.val} onChange={handleChange}
                        min={field.min} max={field.max}
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
                  {errors.nutritionGoal && <p className="text-[10px] font-bold text-rose-500 ml-2 animate-pulse">{errors.nutritionGoal}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-5">
                <button
                  type="submit" disabled={loading}
                  className="flex-1 group relative flex items-center justify-center gap-3 bg-[var(--primary-green)] px-10 py-5 rounded-2xl font-bold text-white text-lg shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="animate-spin" /> : <Save size={24} />}
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
      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={confirmReset}
        title="Reset Formulir?"
        message="Semua perubahan yang belum disimpan akan hilang."
        itemName="Formulir Profil"
      />
    </div>
  );
};

export default ProfilePage;