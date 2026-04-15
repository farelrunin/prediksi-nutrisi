import React from 'react';
import RiskScoreCard from '../components/dashboard/RiskScoreCard';
import NutritionChart from '../components/dashboard/NutritionChart';
import RecommendationList from '../components/dashboard/RecommendationList';
import FoodForm from '../components/FoodForm';
import { useNutrition } from '../context/useNutrition';
import { useAuth } from '../context/useAuth';
import { TrendingUp, Target, Calendar, Award, List } from 'lucide-react';
import { colors } from '../styles/colors';

const Dashboard = () => {
  const { nutritionData, getRiskScore, addFoodEntry } = useNutrition();
  const { user } = useAuth();
  const riskScore = getRiskScore();

  const todayEntries = nutritionData.history.filter((item) =>
    new Date(item.timestamp).toDateString() === new Date().toDateString()
  );

  const quickStats = [
    {
      icon: Target,
      label: 'Target Kalori',
      value: `${nutritionData.dailyIntake.calories}/${nutritionData.targets.calories}`,
      bgClass: 'bg-blue-100',
      iconClass: 'text-blue-600',
      barClass: 'bg-blue-500',
      progress: (nutritionData.dailyIntake.calories / nutritionData.targets.calories) * 100
    },
    {
      icon: TrendingUp,
      label: 'Protein Hari Ini',
      value: `${nutritionData.dailyIntake.protein}g`,
      bgClass: 'bg-green-100',
      iconClass: 'text-green-600',
      barClass: 'bg-green-500',
      progress: (nutritionData.dailyIntake.protein / nutritionData.targets.protein) * 100
    },
    {
      icon: Calendar,
      label: 'Entri Hari Ini',
      value: todayEntries.length,
      bgClass: 'bg-purple-100',
      iconClass: 'text-purple-600',
      barClass: 'bg-purple-500',
      progress: todayEntries.length > 0 ? 100 : 10
    },
    {
      icon: Award,
      label: 'Streak Sehat',
      value: '7 hari',
      bgClass: 'bg-orange-100',
      iconClass: 'text-orange-600',
      barClass: 'bg-orange-500',
      progress: 100
    }
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.bgSecondary }}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard Nutrisi</h1>
              <p className="text-slate-300">Pantau pola makan dan asupan gizi harian Anda{user ? `, ${user.name}` : ''}.</p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="text-sm text-slate-400">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgClass} p-3 rounded-xl`}>
                  <stat.icon className={stat.iconClass} size={24} />
                </div>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{stat.label}</span>
                  <span className="text-white font-medium">{Math.round(stat.progress)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`${stat.barClass} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.18fr_0.82fr] gap-8">
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Ringkasan Asupan Harian</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Kalori', current: nutritionData.dailyIntake.calories, target: nutritionData.targets.calories, unit: 'kcal' },
                  { label: 'Protein', current: nutritionData.dailyIntake.protein, target: nutritionData.targets.protein, unit: 'g' },
                  { label: 'Karbohidrat', current: nutritionData.dailyIntake.carbs, target: nutritionData.targets.carbs, unit: 'g' },
                  { label: 'Lemak', current: nutritionData.dailyIntake.fat, target: nutritionData.targets.fat, unit: 'g' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {item.current}/{item.target} {item.unit}
                    </div>
                    <div className="text-sm text-slate-300 mb-3">{item.label}</div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((item.current / item.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <NutritionChart data={nutritionData.history} />
          </div>

          <div className="space-y-8">
            <RiskScoreCard riskScore={riskScore} />

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <List size={22} className="text-emerald-400" />
                    Tambah Pola Asupan
                  </h3>
                  <p className="text-slate-300 text-sm">Tambah entri makanan untuk membangun data pola makan.</p>
                </div>
              </div>
              <FoodForm onAddFood={addFoodEntry} submitLabel="Tambah Asupan" />

              <div className="mt-6 rounded-3xl border border-dashed border-white/20 bg-white/5 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Entri Hari Ini</h4>
                  <span className="text-sm text-slate-400">{todayEntries.length} item</span>
                </div>
                {todayEntries.length === 0 ? (
                  <p className="text-slate-300">Belum ada input hari ini. Tambahkan makanan untuk mulai merekam pola asupan.</p>
                ) : (
                  <div className="space-y-3">
                    {todayEntries.map((entry, index) => (
                      <div key={index} className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">{entry.foodName}</p>
                            <p className="text-sm text-slate-400">{entry.mealType} • {entry.quantity} {entry.unit}</p>
                          </div>
                          <div className="text-right text-sm text-slate-400">
                            <p>{new Date(entry.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-white font-semibold">{entry.calories} kcal</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <RecommendationList />
      </div>
    </div>
  );
};

export default Dashboard;
