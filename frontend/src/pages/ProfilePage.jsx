import React, { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { authService } from '../services/authService';
import { colors } from '../styles/colors';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: '',
    conditions: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.profile) {
      setFormData(user.profile);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      alert('Gagal memperbarui profil');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        conditions: checked
          ? [...prev.conditions, value]
          : prev.conditions.filter(c => c !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-8" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-2xl mx-auto space-y-6 px-4">
        <h1 className="text-3xl font-bold text-white">Profil Kesehatan</h1>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 space-y-6" style={{ backgroundColor: colors.bgCard }}>
          <div className="flex items-center gap-3 mb-6">
            <User className="text-emerald-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Data Pribadi</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Tinggi Badan (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="170"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Berat Badan (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="65"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Usia (tahun)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Jenis Kelamin</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Pilih</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Tingkat Aktivitas Fisik</label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="">Pilih tingkat aktivitas</option>
              <option value="sedentary">Jarang berolahraga</option>
              <option value="light">Olahraga ringan 1-3x/minggu</option>
              <option value="moderate">Olahraga sedang 3-5x/minggu</option>
              <option value="active">Olahraga berat 6-7x/minggu</option>
              <option value="very_active">Atlet profesional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Kondisi Khusus</label>
            <div className="space-y-2">
              <label className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="conditions"
                  value="pregnant"
                  checked={formData.conditions.includes('pregnant')}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4 rounded bg-white/10 border border-white/20 text-emerald-500 cursor-pointer"
                />
                Ibu Hamil
              </label>
              <label className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="conditions"
                  value="breastfeeding"
                  checked={formData.conditions.includes('breastfeeding')}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4 rounded bg-white/10 border border-white/20 text-emerald-500 cursor-pointer"
                />
                Menyusui
              </label>
              <label className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="conditions"
                  value="diabetic"
                  checked={formData.conditions.includes('diabetic')}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4 rounded bg-white/10 border border-white/20 text-emerald-500 cursor-pointer"
                />
                Diabetes
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold transition-all"
          >
            <Save size={20} />
            {loading ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;