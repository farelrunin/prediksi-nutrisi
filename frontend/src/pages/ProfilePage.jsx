import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Save,
  RefreshCw,
  Upload,
  AlertCircle,
  CheckCircle2,
  Camera,
  Zap,
  Target,
  Heart,
  Sun,
  RotateCcw,
  Settings,
  Globe,
  Bell,
  Shield,
  ChevronRight,
  Moon,
  X,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { authService } from '../services/authService';
import { useNotification } from '../context/useNotification';
import ConfirmModal from '../components/shared/ConfirmModal';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { notify } = useNotification();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Admin Owner Control states
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);

  const openAdminModal = async () => {
    setIsAdminModalOpen(true);
    setAdminLoading(true);
    try {
      const stats = await authService.getSystemStats();
      setAdminStats(stats);
    } catch (err) {
      console.error(err);
      notify({ type: 'error', title: 'Akses Gagal', message: 'Tidak dapat memuat statistik sistem.' });
    } finally {
      setAdminLoading(false);
    }
  };

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

    // Close settings when clicking outside
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    if (bmi < 18.5) return { status: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { status: 'Normal', color: 'text-emerald-400' };
    if (bmi < 30) return { status: 'Overweight', color: 'text-yellow-400' };
    return { status: 'Obese', color: 'text-red-400' };
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
        
        // Auto-calculate Age if dateOfBirth changes
        if (name === 'dateOfBirth' && value) {
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          newData.age = age;
        }

        // Fix: Reset pregnancy/breastfeeding if gender is male
        if (name === 'gender' && value === 'male') {
          newData.is_pregnant = false;
          newData.is_breastfeeding = false;
        }
        
        // Auto-calculate targets when nutritionGoal changes
        if (name === 'nutritionGoal' && value) {
          const weight = parseFloat(prev.weight) || 70; 
          
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
            title: 'Targets Updated', 
            message: `Nutrition targets automatically adjusted for goal: ${value === 'lose' ? 'Weight Loss' : value === 'gain' ? 'Weight Gain' : value === 'build_muscle' ? 'Build Muscle' : 'Maintain'}.` 
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
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 for balance between quality and size
        setPreviewImage(dataUrl);
        setProfileImage(dataUrl);
        setIsCropping(false);
      };
      img.src = tempImage;
    } catch (e) {
      console.error(e);
      notify({ type: 'error', title: 'Processing Failed', message: 'Failed to process image. Please try again.' });
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

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (formData.height && formData.height <= 0) {
      newErrors.height = 'Height must be greater than 0';
    }
    if (formData.weight && formData.weight <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      notify({ 
        type: 'warning', 
        title: 'Incomplete Data', 
        message: 'Please complete required fields: ' + Object.values(newErrors).join(', ') 
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
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
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
      notify({ type: 'success', title: 'Success', message: 'Your profile has been updated.' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ global: error.message || 'Failed to save profile. Please try again.' });
      notify({ type: 'error', title: 'Save Failed', message: error.message || 'Server error occurred while saving profile.' });
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
    notify({ type: 'info', title: 'Form Reset', message: 'All form fields have been cleared.' });
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
    <div className="min-h-screen bg-[var(--bg-primary)] pb-24 pt-44 px-4 md:px-8">
      {/* Custom Cropper Modal */}
      {isCropping && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-[var(--border-card)] flex justify-between items-center bg-[var(--bg-secondary)]/50">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)]">Adjust Photo</h3>
                <p className="text-xs font-medium text-[var(--text-muted)] mt-1">Drag the photo to adjust position.</p>
              </div>
              <button onClick={() => setIsCropping(false)} className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-rose-500 transition-colors shadow-sm">
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
                <div className="flex justify-between text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                  <span>Zoom</span>
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
                  className="flex-1 px-8 py-4 rounded-2xl font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="flex-1 px-8 py-4 rounded-2xl font-bold text-white bg-[var(--primary-green)] shadow-lg shadow-emerald-500/40 hover:scale-[1.02] active:scale-100 transition-all"
                >
                  Use This Photo
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
              My <span className="text-[var(--primary-green)]">{t.profileTitle}</span>
            </h1>
            <p className="mt-2 text-[var(--text-muted)] font-medium">{t.profileSubtitle}</p>
          </div>
          
          {/* Settings Popover Button */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-card)] px-6 py-3 rounded-2xl text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-all shadow-sm active:scale-95"
            >
              <Settings size={18} className={isSettingsOpen ? 'animate-spin-slow' : ''} />
              {t.settings}
            </button>

            {isSettingsOpen && (
              <div className="absolute top-full right-0 mt-4 w-72 bg-[var(--bg-card)]/95 backdrop-blur-2xl border border-[var(--border-card)] rounded-[2rem] p-4 shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-2">
                  <h4 className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">{t.preferences}</h4>
                  
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                      </div>
                      <span className="text-xs font-bold text-[var(--text-main)]">{theme === 'light' ? t.darkMode : t.lightMode}</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-[var(--primary-green)]' : 'bg-slate-200'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </button>

                  {/* Language Toggle */}
                  <button
                    onClick={toggleLanguage}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                        <Globe size={18} />
                      </div>
                      <span className="text-xs font-bold text-[var(--text-main)]">{t.language}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-green)]">
                      {language === 'id' ? 'ID' : 'EN'}
                    </span>
                  </button>

                  <div className="my-2 border-t border-[var(--border-card)]/30 mx-2" />
                  <h4 className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">{t.account}</h4>

                  {/* Placeholder Settings */}
                  {[
                    { icon: <Bell size={18} />, label: t.notifications, color: 'bg-rose-100 text-rose-600' },
                    { icon: <Shield size={18} />, label: t.privacy, color: 'bg-emerald-100 text-emerald-600' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group opacity-60"
                      onClick={() => notify({ type: 'info', title: t.soon, message: `${item.label} feature coming soon!` })}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                          {item.icon}
                        </div>
                        <span className="text-xs font-bold text-[var(--text-main)]">{item.label}</span>
                      </div>
                      <ChevronRight size={14} className="text-[var(--text-muted)]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 rounded-[2rem] border border-[var(--primary-green)]/20 bg-emerald-50 flex items-center gap-4 animate-in slide-in-from-top duration-500 shadow-sm">
            <div className="p-2 bg-[var(--primary-green)] rounded-xl text-white">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-sm font-bold text-[var(--primary-green)]">{t.successUpdate}</span>
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
                    src={previewImage?.startsWith('http') || previewImage?.startsWith('blob') || previewImage?.startsWith('data:') ? previewImage : `https://nutriai-backend-production-2987.up.railway.app${previewImage}`}
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

              <div className="space-y-6 pt-8 border-t border-[var(--border-card)]/30 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Completeness</span>
                  <span className="text-xs font-bold text-[var(--primary-green)]">{isProfileComplete ? '100%' : '60%'}</span>
                </div>
                <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden p-[1px]">
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

            {/* System Owner / Admin Panel */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[4px] h-full bg-[var(--primary-green)]" />
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[var(--primary-green)]/10 rounded-2xl text-[var(--primary-green)]">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[var(--text-main)]">Owner Dashboard</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Control Panel</p>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-semibold mb-6 leading-relaxed">
                {language === 'id' 
                  ? 'Sebagai pemilik sistem, Anda dapat memantau total pengguna terdaftar, riwayat jurnal makanan, dan aktivitas database secara live.' 
                  : 'As the system owner, you can monitor total registered users, food journal entries, and view live database activity.'}
              </p>
              <button
                type="button"
                onClick={openAdminModal}
                className="w-full flex items-center justify-center gap-3 bg-[var(--primary-green)] hover:scale-[1.02] active:scale-100 text-white font-black py-4 px-6 rounded-2xl shadow-lg shadow-emerald-500/10 transition-all text-xs uppercase tracking-widest"
              >
                <Zap size={16} />
                <span>{language === 'id' ? 'Buka Panel Aktivitas' : 'Open Admin Center'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="lg:col-span-8 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Section: Basic Information */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-10 shadow-xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-2.5 bg-[var(--primary-green)]/10 rounded-xl text-[var(--primary-green)]">
                    <User size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-wide">{t.basicInformation || 'Basic Information'}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">{t.fullName}</label>
                    <input
                      type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                      maxLength="100"
                      className={`w-full px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border text-[var(--text-main)] font-semibold outline-none transition-all ${errors.fullName ? 'border-rose-500 bg-rose-50' : 'border-transparent focus:border-[var(--primary-green)]'}`}
                    />
                    {errors.fullName && <p className="text-[10px] font-bold text-rose-500 ml-2 animate-pulse">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">{t.email}</label>
                    <input
                      type="email" name="email" value={formData.email} disabled
                      className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)] text-[var(--text-muted)] font-semibold opacity-60 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">{t.gender}</label>
                    <select
                      name="gender" value={formData.gender} onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border text-[var(--text-main)] font-semibold outline-none transition-all appearance-none ${errors.gender ? 'border-rose-500 bg-rose-50' : 'border-transparent focus:border-[var(--primary-green)]'}`}
                    >
                      <option value="">{t.selectGender}</option>
                      <option value="male">{t.male}</option>
                      <option value="female">{t.female}</option>
                    </select>
                    {errors.gender && <p className="text-[10px] font-bold text-rose-500 ml-2 animate-pulse">{errors.gender}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">{t.birthDate}</label>
                    <input
                      type="date" 
                      name="dateOfBirth" 
                      value={formData.dateOfBirth} 
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] outline-none transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Physical Data */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-10 shadow-xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-2.5 bg-[var(--accent-blue)]/10 rounded-xl text-[var(--accent-blue)]">
                    <Zap size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-wide">{t.physicalData}</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: t.height, name: 'height', val: formData.height, min: 50, max: 300, readOnly: false },
                    { label: t.weight, name: 'weight', val: formData.weight, min: 10, max: 500, readOnly: false },
                    { label: t.age, name: 'age', val: formData.age, min: 1, max: 120, readOnly: true },
                    { label: t.sleep, name: 'sleepHours', val: formData.sleepHours, min: 0, max: 24, readOnly: false }
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">{field.label}</label>
                      <input
                        type="number" name={field.name} value={field.val} onChange={handleChange}
                        min={field.min} max={field.max}
                        readOnly={field.readOnly}
                        className={`w-full px-4 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-extrabold text-center focus:border-[var(--primary-green)] outline-none transition-all ${field.readOnly ? 'opacity-40 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Special Conditions (Pregnancy/Breastfeeding) */}
                {formData.gender === 'female' && (
                  <div className="mt-10 pt-8 border-t border-slate-100">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1 block mb-6">{t.specialConditions}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between ${formData.is_pregnant ? 'border-[var(--primary-green)] bg-emerald-50' : 'border-[var(--border-card)] bg-[var(--bg-secondary)]'}`}
                           onClick={() => setFormData(prev => ({ ...prev, is_pregnant: !prev.is_pregnant, is_breastfeeding: false }))}>
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${formData.is_pregnant ? 'bg-[var(--primary-green)] text-white' : 'bg-white text-slate-400'}`}>
                            <Heart className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text-main)]">{t.pregnant}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${formData.is_pregnant ? 'text-[var(--primary-green)]' : 'text-[var(--text-muted)] opacity-60'}`}>
                              {formData.is_pregnant ? t.pregnancyMode : t.clickToActivate}
                            </p>
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
                            <p className="font-bold text-[var(--text-main)]">{t.breastfeeding}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${formData.is_breastfeeding ? 'text-[var(--accent-blue)]' : 'text-[var(--text-muted)] opacity-60'}`}>
                              {formData.is_breastfeeding ? t.breastfeedingMode : t.clickToActivate}
                            </p>
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

              {/* Section: Nutrition Targets */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-10 shadow-xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-2.5 bg-[var(--warning)]/10 rounded-xl text-[var(--warning)]">
                    <Target size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-wide">{t.nutritionTargets}</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                  {[
                    { label: t.calories, name: 'targetCalories', val: formData.targetCalories, color: 'focus:border-[var(--primary-green)]', min: 0, max: 10000 },
                    { label: t.protein, name: 'targetProtein', val: formData.targetProtein, color: 'focus:border-[var(--accent-blue)]', min: 0, max: 1000 },
                    { label: t.carbs, name: 'targetCarbs', val: formData.targetCarbs, color: 'focus:border-[var(--warning)]', min: 0, max: 1000 },
                    { label: t.fat, name: 'targetFat', val: formData.targetFat, color: 'focus:border-[var(--danger)]', min: 0, max: 1000 }
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
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">{t.nutritionGoal}</label>
                  <select
                    name="nutritionGoal" value={formData.nutritionGoal} onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-main)] font-semibold focus:border-[var(--primary-green)] outline-none transition-all appearance-none"
                  >
                    <option value="">{t.selectGoal}</option>
                    <option value="maintain">{t.maintainWeight}</option>
                    <option value="lose">{t.loseWeight}</option>
                    <option value="gain">{t.gainWeight}</option>
                    <option value="build_muscle">{t.buildMuscle}</option>
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
                  <span>{loading ? t.saving : t.saveChanges}</span>
                </button>
                <button
                  type="button" onClick={handleReset}
                  className="px-10 py-5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs hover:text-[var(--danger)] hover:border-rose-200 transition-all shadow-sm"
                >
                  {t.reset}
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
        title={t.resetTitle}
        message={t.resetMessage}
        itemName={t.resetItem}
      />

      {/* Admin / Owner Dashboard Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="p-8 md:p-10 border-b border-[var(--border-card)] flex justify-between items-center bg-[var(--bg-secondary)]/50">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[var(--primary-green)] text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[var(--text-main)]">System Owner Control Center</h3>
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Live Database Overview & Activity</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsAdminModalOpen(false)} 
                className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-rose-500 transition-colors shadow-sm active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 md:p-10 max-h-[60vh] overflow-y-auto space-y-8 custom-scrollbar">
              {adminLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <RefreshCw size={40} className="animate-spin text-[var(--primary-green)]" />
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Fetching Live Stats...</p>
                </div>
              ) : adminStats ? (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--border-card)]/50 relative overflow-hidden group">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">Total Registered Users</div>
                      <div className="text-4xl font-black text-[var(--text-main)]">{adminStats.totalUsers}</div>
                      <div className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">🟢 Active Accounts</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--border-card)]/50 relative overflow-hidden group">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">Total Food Journals</div>
                      <div className="text-4xl font-black text-[var(--text-main)]">{adminStats.totalEntries}</div>
                      <div className="text-[10px] text-[var(--primary-green)] font-bold mt-2 flex items-center gap-1">⚡ AI & Manual Analyzed</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--border-card)]/50 relative overflow-hidden group">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">Database Status</div>
                      <div className="text-md font-extrabold text-emerald-500 mt-2">🟢 CONNECTED</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-bold mt-1">Sequelize ORM Sync: OK</div>
                    </div>
                  </div>

                  {/* Registered Users List */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <h4 className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)]">User Registry ({adminStats.users.length})</h4>
                      <span className="text-[10px] font-bold text-[var(--primary-green)] uppercase">Sorted by newest</span>
                    </div>

                    <div className="border border-[var(--border-card)] rounded-3xl overflow-hidden bg-[var(--bg-secondary)]/30">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[var(--bg-secondary)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-card)]">
                              <th className="py-4 px-6">Name</th>
                              <th className="py-4 px-6">Email</th>
                              <th className="py-4 px-6">Gender</th>
                              <th className="py-4 px-6">Joined Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-card)]/30 text-xs font-semibold text-[var(--text-main)] bg-[var(--bg-card)]">
                            {adminStats.users.map((u) => (
                              <tr key={u.id} className="hover:bg-[var(--primary-green)]/5 transition-colors">
                                <td className="py-4 px-6 font-bold">{u.name}</td>
                                <td className="py-4 px-6 text-[var(--text-muted)]">{u.email}</td>
                                <td className="py-4 px-6 capitalize">{u.gender || '-'}</td>
                                <td className="py-4 px-6 text-[var(--text-muted)]">
                                  {new Date(u.created_at || Date.now()).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-rose-500 font-bold">Failed to load statistics.</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-[var(--border-card)] bg-[var(--bg-secondary)]/20 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="px-8 py-3.5 rounded-2xl font-bold bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-rose-500 transition-all text-xs uppercase tracking-widest active:scale-95"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;