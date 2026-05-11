import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Target, Calendar, Award, List, ChevronRight } from 'lucide-react';
import RiskScoreCard from '../components/dashboard/RiskScoreCard';
import NutritionChart from '../components/dashboard/NutritionChart';
import RecommendationList from '../components/dashboard/RecommendationList';
import MagicBento from '../components/dashboard/MagicBento';
import { useNutrition } from '../context/useNutrition';
import { useAuth } from '../context/useAuth';
import MagicCard from '../components/shared/MagicCard';

const DashboardPage = () => {
  const { nutritionData, getRiskScore, historyLoading } = useNutrition();
  const { user } = useAuth();
  const riskScore = getRiskScore();

  const todayEntries = nutritionData.history.filter((item) =>
    new Date(item.timestamp).toDateString() === new Date().toDateString()
  );

  const quickStats = [
    { icon: Target, label: 'Calories', value: Math.round(nutritionData.dailyIntake.calories), target: nutritionData.targets.calories, unit: 'kcal', color: 'text-[var(--primary-green)]', glow: 'rgba(34, 197, 94, 0.12)' },
    { icon: TrendingUp, label: 'Protein', value: Math.round(nutritionData.dailyIntake.protein), target: nutritionData.targets.protein, unit: 'g', color: 'text-[var(--primary-green)]', glow: 'rgba(34, 197, 94, 0.12)' },
    { icon: Calendar, label: 'Entries', value: todayEntries.length, target: 10, unit: 'item', color: 'text-[var(--primary-green)]', glow: 'rgba(34, 197, 94, 0.12)' },
    { icon: Award, label: 'Streak', value: nutritionData.streak || 0, target: 7, unit: 'days', color: 'text-[var(--primary-green)]', glow: 'rgba(34, 197, 94, 0.12)' }
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
              Dashboard
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-[var(--text-muted)] font-medium">Welcome back, {user?.name || 'User'}.</p>
              
              {user?.gender === 'female' && user?.is_pregnant && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full animate-in zoom-in duration-500">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Pregnancy Mode Active</span>
                </div>
              )}

              {user?.gender === 'female' && user?.is_breastfeeding && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-100 rounded-full animate-in zoom-in duration-500">
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">Breastfeeding Mode Active</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white border border-[var(--border-card)] px-6 py-3 rounded-2xl text-xs font-bold text-[var(--text-muted)] shadow-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Magic Bento Quick Stats */}
        <div className="mb-12">
          <MagicBento stats={quickStats} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Daily Nutrition Summary */}
            <MagicCard className="bg-white/10 rounded-[2.5rem] p-10 shadow-xl">
              <div className="mb-10 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--text-main)]">Daily Nutrition</h2>
                <Link to="/nutri-check" className="flex items-center gap-2 rounded-xl bg-[var(--primary-green)] px-5 py-3 text-sm font-bold text-white hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20">
                  Add Meal <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                {[
                  { label: 'Calories', cur: nutritionData.dailyIntake.calories, tar: nutritionData.targets.calories, unit: 'kcal', color: 'from-[var(--primary-green)] to-[var(--secondary-green)]' },
                  { label: 'Protein', cur: nutritionData.dailyIntake.protein, tar: nutritionData.targets.protein, unit: 'g', color: 'from-[var(--accent-blue)] to-blue-600' },
                  { label: 'Carbs', cur: nutritionData.dailyIntake.carbs, tar: nutritionData.targets.carbs, unit: 'g', color: 'from-[var(--warning)] to-orange-500' },
                  { label: 'Fat', cur: nutritionData.dailyIntake.fat, tar: nutritionData.targets.fat, unit: 'g', color: 'from-[var(--danger)] to-rose-600' }
                ].map((m) => (
                  <div key={m.label} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{m.label}</span>
                      <span className="text-[11px] font-bold text-[var(--text-main)]">{Math.round(m.cur)}/{m.tar}</span>
                    </div>
                    <div className="h-2.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden p-[1px]">
                      <div 
                        className={`h-full bg-gradient-to-r ${m.color} rounded-full transition-all duration-1000 shadow-sm`}
                        style={{ width: `${Math.min((m.cur / m.tar) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </MagicCard>

            {/* Weekly Trend Chart */}
            <MagicCard className="bg-white/10 rounded-[2.5rem] p-10 shadow-xl overflow-visible">
              <NutritionChart data={nutritionData.history} />
            </MagicCard>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-12">
            
            <RiskScoreCard 
              riskScore={riskScore} 
              aiAdvice={nutritionData.lastAiAdvice} 
            />

            <MagicCard className="bg-white/10 rounded-[2.5rem] p-10 shadow-xl">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Recent Activity</h2>
                <Link to="/history" className="text-[11px] font-bold text-[var(--primary-green)] hover:underline uppercase tracking-widest">History →</Link>
              </div>

              <div className="space-y-5">
                {historyLoading ? (
                  <div className="text-center py-10 animate-pulse text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest">Loading...</div>
                ) : todayEntries.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-400">No Data Today</p>
                  </div>
                ) : (
                  todayEntries.slice(0, 4).map((e, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-[var(--bg-secondary)] border border-transparent rounded-[1.5rem] transition-all hover:border-[var(--primary-green)]/30 group">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--primary-green)] transition-colors">{e.foodName}</p>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">{e.mealType}</p>
                      </div>
                      <span className="text-xs font-bold text-[var(--primary-green)] bg-white px-3 py-1.5 rounded-lg shadow-sm border border-[var(--border-card)]">{e.calories} kcal</span>
                    </div>
                  ))
                )}
              </div>
            </MagicCard>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-24">
          <RecommendationList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
