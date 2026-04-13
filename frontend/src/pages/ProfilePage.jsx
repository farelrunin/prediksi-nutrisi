import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';

const ProfilePage = () => {
  const { profile, updateProfile } = useNutrition();
  const [formData, setFormData] = useState(profile);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      updateProfile(formData);
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
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Profil Kesehatan</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold">Data Pribadi</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tinggi Badan (cm)
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="170"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Berat Badan (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="65"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usia (tahun)
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="25"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Kelamin
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tingkat Aktivitas Fisik
          </label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Pilih tingkat aktivitas</option>
            <option value="sedentary">Jarang berolahraga</option>
            <option value="light">Olahraga ringan (1-3x/minggu)</option>
            <option value="moderate">Olahraga sedang (3-5x/minggu)</option>
            <option value="active">Olahraga berat (6-7x/minggu)</option>
            <option value="very_active">Atlet/profesional</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kondisi Khusus
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="conditions"
                value="pregnant"
                checked={formData.conditions.includes('pregnant')}
                onChange={handleChange}
                className="mr-2"
              />
              Ibu Hamil
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="conditions"
                value="breastfeeding"
                checked={formData.conditions.includes('breastfeeding')}
                onChange={handleChange}
                className="mr-2"
              />
              Menyusui
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="conditions"
                value="diabetic"
                checked={formData.conditions.includes('diabetic')}
                onChange={handleChange}
                className="mr-2"
              />
              Diabetes
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {loading ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;