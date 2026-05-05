import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Target, Calendar, Award, List, Trash2 } from 'lucide-react';
import RiskScoreCard from '../components/dashboard/RiskScoreCard';
import NutritionChart from '../components/dashboard/NutritionChart';
import RecommendationList from '../components/dashboard/RecommendationList';
import FoodForm from '../components/FoodForm';
import { useNutrition } from '../context/useNutrition';
import { useAuth } from '../context/useAuth';
import { colors } from '../styles/colors';

const DashboardPage = () => {
  const { nutritionData, getRiskScore, addFoodEntry, historyLoading, deleteFoodEntry } = useNutrition();
  const { user } = useAuth();
  const riskScore = getRiskScore();

  const todayEntries = nutritionData.history.filter((item) =>
    new Date(item.timestamp).toDateString() === new Date().toDateString()
  );
  const recentEntries = nutritionData.history.slice(0, 5);

  const quickStats = [
    {
      icon: Target,
      label: 'Target Kalori',
      value: Number(nutritionData.dailyIntake.calories).toFixed(1) + '/' + nutritionData.targets.calories,
      bgClass: 'bg-[#4ade80]/10',
      iconClass: 'text-[#4ade80]',
      barClass: 'bg-[#4ade80]',
      progress: Math.min((nutritionData.dailyIntake.calories / nutritionData.targets.calories) * 100, 100)
    },
    {
      icon: TrendingUp,
      label: 'Protein Hari Ini',
      value: Number(nutritionData.dailyIntake.protein).toFixed(1) + 'g',
      bgClass: 'bg-[#4ade80]/10',
      iconClass: 'text-[#4ade80]',
      barClass: 'bg-[#4ade80]',
      progress: Math.min((nutritionData.dailyIntake.protein / nutritionData.targets.protein) * 100, 100)
    },
    {
      icon: Calendar,
      label: 'Entri Hari Ini',
      value: todayEntries.length,
      bgClass: 'bg-[#4ade80]/10',
      iconClass: 'text-[#4ade80]',
      barClass: 'bg-[#4ade80]',
      progress: todayEntries.length > 0 ? 100 : 10
    },
    {
      icon: Award,
      label: 'Streak Sehat',
      value: `${Math.min(nutritionData.history.length, 7)} hari`,
      bgClass: 'bg-[#4ade80]/10',
      iconClass: 'text-[#4ade80]',
      barClass: 'bg-[#4ade80]',
      progress: nutritionData.history.length > 0 ? Math.min((nutritionData.history.length / 7) * 100, 100) : 0
    }
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.bgSecondary }}>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-white">Dashboard Nutrisi</h1>
              <p className="text-slate-300">
                Pantau pola makan dan asupan gizi harian Anda{user ? `, ${user.name}` : ''}.
              </p>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className={`${stat.bgClass} rounded-xl p-3`}>
                  <stat.icon className={stat.iconClass} size={24} />
                </div>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{stat.label}</span>
                  <span className="font-medium text-white">{Math.round(stat.progress)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10">
                  <div
                    className={`${stat.barClass} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.18fr_0.82fr]">
          <div className="space-y-8">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-xl">
              <h3 className="mb-6 text-xl font-bold text-white">Ringkasan Asupan Harian</h3>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {[
                  { label: 'Kalori', current: nutritionData.dailyIntake.calories, target: nutritionData.targets.calories, unit: 'kcal' },
                  { label: 'Protein', current: nutritionData.dailyIntake.protein, target: nutritionData.targets.protein, unit: 'g' },
                  { label: 'Karbohidrat', current: nutritionData.dailyIntake.carbs, target: nutritionData.targets.carbs, unit: 'g' },
                  { label: 'Lemak', current: nutritionData.dailyIntake.fat, target: nutritionData.targets.fat, unit: 'g' }
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="mb-1 text-2xl font-bold text-white">
{Number(item.current.toFixed(1))}/{Number(item.target.toFixed(0))} {item.unit}
                    </div>
                    <div className="mb-3 text-sm text-slate-300">{item.label}</div>
                    <div className="h-3 w-full rounded-full bg-white/10">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
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

            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                    <List size={22} className="text-emerald-400" />
                    Tambah Pola Asupan
                  </h3>
                  <p className="text-sm text-slate-300">Tambah entri makanan untuk membangun data pola makan.</p>
                </div>
              </div>

              <FoodForm onAddFood={addFoodEntry} submitLabel="Tambah Asupan" />

              <div className="mt-6 rounded-3xl border border-dashed border-white/20 bg-white/5 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Entri Hari Ini</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">{todayEntries.length} item</span>
                    <Link to="/riwayat-asupan" className="text-sm font-medium text-emerald-300 hover:text-emerald-200">
                      Lihat semua
                    </Link>
                  </div>
                </div>
                {historyLoading ? (
                  <p className="text-slate-300">Memuat riwayat asupan...</p>
                ) : todayEntries.length === 0 ? (
                  <p className="text-slate-300">Belum ada input hari ini. Tambahkan makanan untuk mulai merekam pola asupan.</p>
                ) : (
                  <div className="space-y-3">
                    {todayEntries.map((entry) => (
                      <div
                        key={`${entry.id ?? entry.timestamp}-${entry.foodName}`}
                        className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur-xl"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">{entry.foodName}</p>
                            <p className="text-sm text-slate-400">{entry.mealType} • {entry.quantity} {entry.unit}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-sm text-slate-400">
                              <p>{new Date(entry.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                              <p className="font-semibold text-white">{entry.calories} kcal</p>
                            </div>
                            {deleteFoodEntry && (
                              <button
                                onClick={() => deleteFoodEntry(entry.id)}
                                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                                title="Hapus entri"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-3xl border border-white/20 bg-white/5 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Riwayat Terbaru</h4>
                  <span className="text-sm text-slate-400">{nutritionData.history.length} total entri</span>
                </div>
                {historyLoading ? (
                  <p className="text-slate-300">Memuat riwayat asupan...</p>
                ) : recentEntries.length === 0 ? (
                  <p className="text-slate-300">Riwayat akan muncul di sini setelah Anda menambahkan makanan.</p>
                ) : (
                  <div className="space-y-3">
                    {recentEntries.map((entry) => (
                      <div
                        key={`${entry.id ?? entry.timestamp}-${entry.foodName}-recent`}
                        className="rounded-3xl border border-white/10 bg-slate-950/20 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">{entry.foodName}</p>
                            <p className="text-sm text-slate-400">{entry.mealType} • {entry.quantity} {entry.unit}</p>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="text-right text-sm text-slate-400">
                              <p>{new Date(entry.timestamp).toLocaleDateString('id-ID')}</p>
                              <p>{new Date(entry.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                              <p className="font-semibold text-white">{entry.calories} kcal</p>
                            </div>
                            {deleteFoodEntry && (
                              <button
                                onClick={() => deleteFoodEntry(entry.id)}
                                className="mt-1 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                                title="Hapus entri"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
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

export default DashboardPage;
