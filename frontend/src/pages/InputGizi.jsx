import React from 'react';
import { useNutrition } from '../context/NutritionContext';
import FoodForm from '../components/FoodForm';
import { colors } from '../styles/colors';

const InputGizi = () => {
  const { addFoodEntry } = useNutrition();

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl" style={{ backgroundColor: colors.bgCard }}>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Input Asupan Makanan</h1>
            <p className="mt-2 text-slate-300">
              Tambahkan makanan yang Anda konsumsi hari ini agar sistem dapat membangun pola asupan dan rekomendasi nutrisi.
            </p>
          </div>
          <FoodForm onAddFood={addFoodEntry} submitLabel="Tambah Asupan" />
        </div>
      </div>
    </div>
  );
};

export default InputGizi;
