import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../constants/translations';
import { authService } from '../../services/authService';
import { useNotification } from '../../context/useNotification';
import ConfirmModal from '../../components/shared/ConfirmModal';

// Subcomponents import
import ProfileHeader from './components/ProfileHeader';
import AvatarCropperModal from './components/AvatarCropperModal';
import ProfileAvatarCard from './components/ProfileAvatarCard';
import BiometricFormCard from './components/BiometricFormCard';
import NutritionTargetCard from './components/NutritionTargetCard';
import AdminControlPanel from './components/AdminControlPanel';
import DangerZoneCard from './components/DangerZoneCard';

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/', { replace: true });
  };
  const { notify } = useNotification();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  const [isEditMode, setIsEditMode] = useState(false);
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
  
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);

  const handleDeleteUserClick = (u) => {
    setUserToDelete(u);
    setIsDeleteUserModalOpen(true);
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleteUserLoading(true);
    try {
      await authService.deleteUser(userToDelete.id);
      notify({
        type: 'success',
        title: language === 'id' ? 'Pengguna Dihapus' : 'User Deleted',
        message: language === 'id' 
          ? `Akun ${userToDelete.name} berhasil dihapus beserta riwayat nutrisinya.` 
          : `Account ${userToDelete.name} and their nutrition history have been successfully deleted.`
      });
      const stats = await authService.getSystemStats();
      setAdminStats(stats);
    } catch (err) {
      console.error(err);
      notify({
        type: 'error',
        title: language === 'id' ? 'Gagal Menghapus' : 'Delete Failed',
        message: err.message || 'Gagal menghapus pengguna.'
      });
    } finally {
      setDeleteUserLoading(false);
      setIsDeleteUserModalOpen(false);
      setUserToDelete(null);
    }
  };

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

  const [cleanupLoading, setCleanupLoading] = useState(false);

  const handleCleanup = async () => {
    if (!window.confirm(language === 'id' ? "Apakah Anda yakin ingin menghapus semua akun tester dummy dari database secara permanen?" : "Are you sure you want to permanently delete all dummy tester accounts from the database?")) return;
    setCleanupLoading(true);
    try {
      const res = await authService.cleanSystemStats();
      notify({ type: 'success', title: language === 'id' ? 'Database Dibersihkan' : 'Database Cleaned', message: res.detail });
      const stats = await authService.getSystemStats();
      setAdminStats(stats);
    } catch (err) {
      console.error(err);
      notify({ 
        type: 'error', 
        title: language === 'id' ? 'Pembersihan Gagal' : 'Cleanup Failed', 
        message: err.message || 'Gagal membersihkan database.' 
      });
    } finally {
      setCleanupLoading(false);
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
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user]);

  const calculateBMI = () => {
    if (!formData.height || !formData.weight) return null;
    const heightInMeters = formData.height / 100;
    return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMIStatus = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { status: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { status: 'Normal', color: 'text-emerald-400' };
    if (bmi < 30) return { status: 'Overweight', color: 'text-yellow-400' };
    return { status: 'Obese', color: 'text-red-400' };
  };

  const bmi = calculateBMI();
  const bmiStatus = bmi ? getBMIStatus(bmi) : null;

  const isProfileComplete =
    formData.fullName &&
    formData.email &&
    formData.gender &&
    formData.height &&
    formData.weight &&
    formData.nutritionGoal;

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
      if (name === 'age') {
        const cleanValue = value.replace(/[^0-9]/g, '');
        const numVal = parseInt(cleanValue);
        if (cleanValue && (numVal < 0 || numVal > 100)) {
          return;
        }
        setFormData((prev) => ({
          ...prev,
          age: cleanValue
        }));
        return;
      }

      setFormData((prev) => {
        const newData = { ...prev, [name]: value };

        if (name === 'gender' && value === 'male') {
          newData.is_pregnant = false;
          newData.is_breastfeeding = false;
        }
        
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

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
        const size = 400;
        canvas.width = size;
        canvas.height = size;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);

        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        
        const x = (size / 2) + position.x - (drawWidth / 2);
        const y = (size / 2) + position.y - (drawHeight / 2);

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const synthesizedBirthDate = formData.dateOfBirth || `${currentYear - (parseInt(formData.age) || 21)}-01-01`;

      const backendData = {
        name: formData.fullName,
        phone: formData.phone,
        birth_date: synthesizedBirthDate,
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

      if (profileImage) {
        await authService.uploadAvatar(profileImage);
      }
      
      const updatedUser = await authService.updateProfile(backendData);
      setUser(updatedUser);

      localStorage.setItem('nutrisiAI_profile', JSON.stringify(formData));

      setSuccess(true);
      setIsEditMode(false);
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
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28 md:pb-32 pt-32 px-3 md:px-6 lg:px-8">
      {/* Custom Cropper Modal */}
      {isCropping && (
        <AvatarCropperModal
          tempImage={tempImage}
          setIsCropping={setIsCropping}
          position={position}
          scale={scale}
          setScale={setScale}
          setPosition={setPosition}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handleCropSave={handleCropSave}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ProfileHeader
          t={t}
          theme={theme}
          toggleTheme={toggleTheme}
          language={language}
          toggleLanguage={toggleLanguage}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          fetchProfile={fetchProfile}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          settingsRef={settingsRef}
          notify={notify}
          setShowLogoutModal={setShowLogoutModal}
        />

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 rounded-[2rem] border border-[var(--primary-green)]/20 bg-emerald-50 flex items-center gap-4 animate-in slide-in-from-top duration-500 shadow-sm">
            <div className="p-2 bg-[var(--primary-green)] rounded-xl text-white">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-sm font-bold text-[var(--primary-green)]">{t.successUpdate}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            
            {/* Column Left Wrapper */}
            <div className="contents lg:col-span-1 lg:flex lg:flex-col lg:gap-6">
              <ProfileAvatarCard
                formData={formData}
                previewImage={previewImage}
                isEditMode={isEditMode}
                getInitials={getInitials}
                handleImageUpload={handleImageUpload}
                isProfileComplete={isProfileComplete}
                bmi={bmi}
                bmiStatus={bmiStatus}
                t={t}
              />

              <AdminControlPanel
                user={user}
                language={language}
                openAdminModal={openAdminModal}
                isAdminModalOpen={isAdminModalOpen}
                setIsAdminModalOpen={setIsAdminModalOpen}
                adminLoading={adminLoading}
                adminStats={adminStats}
                cleanupLoading={cleanupLoading}
                handleCleanup={handleCleanup}
                handleDeleteUserClick={handleDeleteUserClick}
                t={t}
              />
            </div>

            {/* Column Right Wrapper */}
            <div className="contents lg:col-span-2 lg:flex lg:flex-col lg:gap-6 lg:h-full">
              <BiometricFormCard
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                isEditMode={isEditMode}
                errors={errors}
                t={t}
                language={language}
              />

              <NutritionTargetCard
                formData={formData}
                handleChange={handleChange}
                isEditMode={isEditMode}
                errors={errors}
                t={t}
              />

              <DangerZoneCard
                language={language}
                setShowLogoutModal={setShowLogoutModal}
              />

              {isEditMode && (
                <div className="order-6 lg:order-none flex flex-col md:flex-row gap-3 md:gap-5 animate-in slide-in-from-bottom duration-300">
                  <button
                    type="submit" disabled={loading}
                    className="flex-1 group relative flex items-center justify-center gap-2 md:gap-3 bg-[var(--primary-green)] px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold text-white text-sm md:text-lg shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="animate-spin" /> : <Save size={20} className="md:w-6 md:h-6" />}
                    <span>{loading ? t.saving : t.saveChanges}</span>
                  </button>
                  <button
                    type="button" onClick={handleReset}
                    className="px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px] md:text-xs hover:text-[var(--danger)] hover:border-rose-200 transition-all shadow-sm"
                  >
                    {t.reset}
                  </button>
                </div>
              )}
            </div>

          </div>
        </form>
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

      {/* Delete User Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteUserModalOpen}
        onClose={() => setIsDeleteUserModalOpen(false)}
        onConfirm={handleConfirmDeleteUser}
        title={t.confirmDeleteUserTitle}
        message={t.confirmDeleteUserMsg}
        itemName={userToDelete ? userToDelete.name : ''}
        isLoading={deleteUserLoading}
        confirmLabel={t.delete || 'Hapus'}
        cancelLabel={t.cancel || 'Batal'}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title={t.logout || 'Keluar'}
        message={language === 'id' ? 'Apakah Anda yakin ingin mengakhiri sesi Anda?' : 'Are you sure you want to end your current session?'}
        itemName={t.logout || 'Keluar'}
      />
    </div>
  );
};

export default ProfilePage;
