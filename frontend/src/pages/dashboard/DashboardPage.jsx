import React, { useState } from 'react';
import RiskScoreCard from '../../components/dashboard/RiskScoreCard';
import TodayActionCenter from '../../components/dashboard/TodayActionCenter';
import RecommendationList from '../../components/dashboard/RecommendationList';
import { useNutrition } from '../../context/useNutrition';
import { useAuth } from '../../context/useAuth';
import MagicCard from '../../components/shared/MagicCard';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../constants/translations';

// Subcomponents import
import DashboardHeader from './components/DashboardHeader';
import MacroWarningBanner from './components/MacroWarningBanner';
import QuickActionCard from './components/QuickActionCard';
import TodayActivityCard from './components/TodayActivityCard';
import StreakModal from './components/StreakModal';

const DashboardPage = () => {
  const { nutritionData, getRiskScore, historyLoading } = useNutrition();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const riskScore = getRiskScore();
  const targetCalories = nutritionData.targets.calories || 2000;
  const intakePercentage = targetCalories > 0 ? (nutritionData.dailyIntake.calories / targetCalories) * 100 : 0;
  const streakCount = nutritionData.streak || 0;

  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  const todayEntries = nutritionData.history.filter((item) =>
    new Date(item.timestamp).toDateString() === new Date().toDateString()
  );

  const cappedPercentage = targetCalories > 0 ? Math.min((nutritionData.dailyIntake.calories / targetCalories) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-3 pt-32 md:p-8 md:pt-44 lg:p-12 lg:pt-48 pb-28 md:pb-32">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <DashboardHeader
          t={t}
          user={user}
          streakCount={streakCount}
          language={language}
          setIsStreakModalOpen={setIsStreakModalOpen}
        />

        {/* Warning Banner */}
        <MacroWarningBanner
          todayEntries={todayEntries}
          nutritionData={nutritionData}
          language={language}
        />

        {/* Hero Section Summary */}

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-8 lg:gap-10 items-stretch">
          
          {/* Kolom Kiri: Tren Mingguan */}
          <div className="lg:col-span-8 flex">
            <MagicCard className="bg-[var(--bg-card)] rounded-xl md:rounded-[2.5rem] p-3 md:p-8 lg:p-10 shadow-xl border border-[var(--border-card)] w-full flex flex-col justify-between">
              <TodayActionCenter nutritionData={nutritionData} t={t} />
            </MagicCard>
          </div>
  
          {/* Kolom Kanan: Aktivitas Terbaru & Skor Risiko */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3 md:gap-8 lg:gap-10">
            
            {/* Shortcut Button */}
            <QuickActionCard
              language={language}
            />

            {/* Aktivitas Hari Ini */}
            <TodayActivityCard
              todayEntries={todayEntries}
              historyLoading={historyLoading}
              language={language}
              t={t}
            />
  
            {/* Skor Risiko Card */}
            <RiskScoreCard 
              riskScore={riskScore} 
              aiAdvice={nutritionData.lastAiAdvice} 
              insufficientData={intakePercentage < 60}
            />
  
          </div>
        </div>
 
        {/* AI Recommendations */}
        <div className="mt-8 md:mt-20">
          <RecommendationList />
        </div>
      </div>

      {/* Pop-up Modal Streak 🔥 */}
      {isStreakModalOpen && (
        <StreakModal
          streakCount={streakCount}
          language={language}
          setIsStreakModalOpen={setIsStreakModalOpen}
        />
      )}
    </div>
  );
};

export default DashboardPage;
