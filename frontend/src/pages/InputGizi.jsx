import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';

const InputGizi = () => {
  const { addFoodEntry } = useNutrition();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addFoodEntry(formData);
      // Reset form
      setFormData({
        mealType: 'breakfast',
        foodName: '',
        quantity: '',
        unit: 'gram'
      });
      alert('Data makanan berhasil ditambahkan!');
    } catch (error) {
      alert('Gagal menambahkan data makanan');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Input Asupan Makanan</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Makanan
          </label>
          <select
            name="mealType"
            value={formData.mealType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Makanan
          </label>
          <div className="relative">
            <input
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              placeholder="Cari makanan..."
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Satuan
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="gram">Gram</option>
              <option value="ml">ml</option>
              <option value="buah">Buah</option>
              <option value="porsi">Porsi</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {loading ? 'Menambahkan...' : 'Tambah Makanan'}
        </button>
      </form>
    </div>
  );
};

export default InputGizi;