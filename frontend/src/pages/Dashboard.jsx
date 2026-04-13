import React from 'react';
import RiskScoreCard from '../components/dashboard/RiskScoreCard';
import NutritionChart from '../components/dashboard/NutritionChart';
import RecommendationList from '../components/dashboard/RecommendationList';
import { useNutrition } from '../context/NutritionContext';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';

const Dashboard = () => {
  const { nutritionData, getRiskScore } = useNutrition();
  const riskScore = getRiskScore();

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
      value: nutritionData.history.filter(item =>
        new Date(item.timestamp).toDateString() === new Date().toDateString()
      ).length,
      bgClass: 'bg-purple-100',
      iconClass: 'text-purple-600',
      barClass: 'bg-purple-500',
      progress: 75 // Mock progress
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Nutrisi</h1>
              <p className="text-gray-600">Pantau kesehatan nutrisi Anda hari ini</p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="text-sm text-gray-500">
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgClass} p-3 rounded-xl`}>
                  <stat.icon className={stat.iconClass} size={24} />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="text-gray-900 font-medium">{Math.round(stat.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${stat.barClass} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Risk Score - Takes 1 column */}
          <div className="lg:col-span-1">
            <RiskScoreCard riskScore={riskScore} />
          </div>

          {/* Nutrition Overview - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Asupan Harian</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Kalori', current: nutritionData.dailyIntake.calories, target: nutritionData.targets.calories, unit: 'kcal' },
                { label: 'Protein', current: nutritionData.dailyIntake.protein, target: nutritionData.targets.protein, unit: 'g' },
                { label: 'Karbohidrat', current: nutritionData.dailyIntake.carbs, target: nutritionData.targets.carbs, unit: 'g' },
                { label: 'Lemak', current: nutritionData.dailyIntake.fat, target: nutritionData.targets.fat, unit: 'g' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {item.current}/{item.target} {item.unit}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{item.label}</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((item.current / item.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NutritionChart data={nutritionData.history} />
          <RecommendationList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;