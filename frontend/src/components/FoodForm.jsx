import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

const FoodForm = ({ onAddFood, submitLabel = 'Tambah Makanan' }) => {
  const [formData, setFormData] = useState({
    mealType: 'breakfast',
    foodName: '',
    quantity: '',
    unit: 'gram'
  });
  const [loading, setLoading] = useState(false);

  const mealTypes = [
    { value: 'breakfast', label: 'Sarapan' },
    { value: 'lunch', label: 'Makan Siang' },
    { value: 'dinner', label: 'Makan Malam' },
    { value: 'snack', label: 'Camilan' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddFood(formData);
      setFormData({
        mealType: 'breakfast',
        foodName: '',
        quantity: '',
        unit: 'gram'
      });
    } catch (error) {
      alert('Gagal menambahkan data makanan. Coba lagi.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Jenis Makanan</label>
          <select
            name="mealType"
            value={formData.mealType}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            required
          >
            {mealTypes.map((meal) => (
              <option key={meal.value} value={meal.value}>
                {meal.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Satuan</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="gram">Gram</option>
            <option value="ml">ml</option>
            <option value="buah">Buah</option>
            <option value="porsi">Porsi</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Nama Makanan</label>
        <div className="relative">
          <input
            type="text"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
            placeholder="Contoh: Nasi, Telur, Sayur Bayam"
            className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 pl-12 text-white placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            required
          />
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Jumlah</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="100"
            className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            required
            min="1"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-white font-semibold shadow-lg shadow-emerald-500/20 transition hover:from-emerald-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Plus size={18} />
            {loading ? 'Memproses...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FoodForm;
