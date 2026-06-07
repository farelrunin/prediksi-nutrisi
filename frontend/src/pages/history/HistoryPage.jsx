import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNutrition } from '../../context/useNutrition';
import { useNotification } from '../../context/useNotification';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../constants/translations';
import ConfirmModal from '../../components/shared/ConfirmModal';
import { useAuth } from '../../context/useAuth';

// Subcomponents import
import HistoryHeader from './components/HistoryHeader';
import DailyFoodLogTab from './components/DailyFoodLogTab';
import AnalyticsTrendsTab from './components/AnalyticsTrendsTab';
import AIInsightsTab from './components/AIInsightsTab';
import FoodDetailModal from './components/FoodDetailModal';

const HistoryPage = () => {
  const { user } = useAuth();
  const { nutritionData, historyLoading, deleteFoodEntry } = useNutrition();
  const { notify } = useNotification();
  const { language } = useLanguage();
  const t = translations[language];

  // States
  const [activeTab, setActiveTab] = useState('log'); // 'log', 'analytics', 'insights'
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dailyAdvice, setDailyAdvice] = useState('');
  const [actionableAdvice, setActionableAdvice] = useState('');
  const [isAiAdvice, setIsAiAdvice] = useState(null); // null, true, false
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);

  // Helper: Get local date key YYYY-MM-DD
  const getDateKey = (dateValue) => {
    const date = new Date(dateValue);
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  };

  // Default selected date to today YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(getDateKey(new Date()));

  // Filter entries based on selected calendar date
  const selectedDateEntries = nutritionData.history.filter(
    (entry) => getDateKey(entry.timestamp) === selectedDate
  );

  const formatDayLabel = (dateValue) => new Date(dateValue).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const getMealTypeLabel = (mealType) => {
    const m = (mealType || '').toLowerCase();
    if (m === 'breakfast' || m === 'sarapan') return language === 'id' ? '🍳 Sarapan' : '🍳 Breakfast';
    if (m === 'lunch' || m === 'makan siang') return language === 'id' ? '🍛 Makan Siang' : '🍛 Lunch';
    if (m === 'dinner' || m === 'makan malam') return language === 'id' ? '🍜 Makan Malam' : '🍜 Dinner';
    if (m === 'snack' || m === 'camilan') return language === 'id' ? '🍎 Camilan' : '🍎 Snack';
    return language === 'id' ? '🍱 Sesi Makan' : '🍱 Meal Session';
  };

  const handleDeleteClick = (entry) => {
    setDeleteModal({ isOpen: true, item: entry });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.item) {
      setIsDeleting(true);
      try {
        await deleteFoodEntry(deleteModal.item.id);
        notify({ 
          type: 'success', 
          title: t.successDelete, 
          message: t.successDeleteMsg 
        });
      } catch (error) {
        notify({ 
          type: 'error', 
          title: t.deleteFailed, 
          message: error.message 
        });
      } finally {
        setIsDeleting(false);
      }
    }
    setDeleteModal({ isOpen: false, item: null });
  };

  // Group entries for the SELECTED DATE into meal sessions
  const groupEntriesBySession = (entries) => {
    const sessions = { breakfast: [], lunch: [], dinner: [], snack: [] };
    entries.forEach((entry) => {
      const mType = (entry.mealType || 'snack').toLowerCase();
      if (mType.includes('breakfast') || mType.includes('sarapan')) {
        sessions.breakfast.push(entry);
      } else if (mType.includes('lunch') || mType.includes('siang')) {
        sessions.lunch.push(entry);
      } else if (mType.includes('dinner') || mType.includes('malam')) {
        sessions.dinner.push(entry);
      } else {
        sessions.snack.push(entry);
      }
    });
    return sessions;
  };

  const currentDaySessions = groupEntriesBySession(selectedDateEntries);

  // Totals calculations for the SELECTED DATE
  const selectedDateTotals = selectedDateEntries.reduce((totals, entry) => ({
    calories: totals.calories + entry.calories,
    protein: totals.protein + (entry.protein || 0),
    carbs: totals.carbs + (entry.carbs || 0),
    fat: totals.fat + (entry.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleGenerateInsight = async () => {
    if (selectedDateEntries.length === 0) return;
    
    setIsAdviceLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const calRatio = selectedDateTotals.calories / (nutritionData.targets.calories || 2000);
      const protRatio = selectedDateTotals.protein / (nutritionData.targets.protein || 100);
      const carbRatio = selectedDateTotals.carbs / (nutritionData.targets.carbs || 250);
      const fatRatio = selectedDateTotals.fat / (nutritionData.targets.fat || 70);

      const underScore = (
        Math.max(0, 1 - calRatio) +
        Math.max(0, 1 - protRatio) +
        Math.max(0, 1 - carbRatio) +
        Math.max(0, 1 - fatRatio)
      ) / 4;

      const overScore = (
        (calRatio > 1.5 ? (calRatio - 1.5) / 2 : 0) +
        (protRatio > 2.0 ? (protRatio - 2.0) / 2 : 0) +
        (fatRatio > 2.0 ? (fatRatio - 2.0) / 2 : 0)
      );

      const totalRisk = Math.max(underScore, overScore);
      const calculatedRisk = (Math.max(0, Math.min(1, totalRisk)) * 100).toFixed(0) + '%';

      const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000' 
        : 'https://nutriai-backend-production-2987.up.railway.app';

      const height = user?.height ? Number(user.height) : 0;
      const weight = user?.weight ? Number(user.weight) : 0;
      let calculatedBmi = "Normal";
      if (height > 0 && weight > 0) {
        const bmiVal = weight / ((height / 100) ** 2);
        if (bmiVal < 18.5) calculatedBmi = `Kurang berat badan (BMI: ${bmiVal.toFixed(1)})`;
        else if (bmiVal >= 25) calculatedBmi = `Kelebihan berat badan (BMI: ${bmiVal.toFixed(1)})`;
        else calculatedBmi = `Ideal (BMI: ${bmiVal.toFixed(1)})`;
      }

      const response = await axios.post(`${API_BASE_URL}/predict/daily-insights`, {
        selectedDate,
        totalNutrition: {
          calories: Math.round(selectedDateTotals.calories),
          protein: Math.round(selectedDateTotals.protein),
          carbs: Math.round(selectedDateTotals.carbs),
          fat: Math.round(selectedDateTotals.fat)
        },
        riskScore: calculatedRisk,
        loggedMeals: selectedDateEntries.map(e => e.mealType || 'camilan'),
        language: language,
        userProfile: {
          bmi: calculatedBmi
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setDailyAdvice(response.data?.advice || '');
      setActionableAdvice(response.data?.actionableAdvice || '');
      setIsAiAdvice(response.data?.is_ai ?? false);
    } catch (err) {
      console.error('Error fetching daily insights:', err);
      setDailyAdvice(language === 'id' 
        ? 'Gizi Anda hari ini tergolong seimbang! Tambahkan porsi serat dan minum air secukupnya untuk mempertahankan kebugaran optimal.' 
        : 'Your nutrition today is balanced! Add more fiber and keep hydrated to sustain optimal energy levels.');
      setActionableAdvice(language === 'id'
        ? 'Konsumsi sumber protein hewani/nabati tambahan di cemilan sore dan kurangi asupan karbohidrat cepat serap menjelang istirahat tidur malam Anda.'
        : 'Include lean protein sources in your afternoon snacks and avoid simple carbohydrates prior to sleep.');
      setIsAiAdvice(false);
    } finally {
      setIsAdviceLoading(false);
    }
  };

  useEffect(() => {
    setDailyAdvice('');
    setActionableAdvice('');
    setIsAiAdvice(null);
  }, [selectedDate]);

  return (
    <div className="min-h-screen pb-28 md:pb-32 pt-32 px-3 md:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-6xl space-y-4 md:space-y-10">
        
        {/* Header */}
        <HistoryHeader
          language={language}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          getDateKey={getDateKey}
          user={user}
        />

        {/* Premium 3-Tab Switcher Navigation */}
        <div className="flex overflow-x-auto gap-1.5 p-1 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-lg md:rounded-[2rem] shadow-sm no-scrollbar">
          {[
            { id: 'log', label: language === 'id' ? '📝 Menu Hari Ini' : '📝 Today\'s Menu' },
            { id: 'analytics', label: language === 'id' ? '📊 Tren & Analisis' : '📊 Analytics' },
            { id: 'insights', label: language === 'id' ? '🌿 Insight AI' : '🌿 AI Insights' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] md:min-w-[150px] py-2 md:py-3.5 px-3 md:px-4 rounded-md md:rounded-[1.5rem] text-[9px] md:text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-[var(--primary-green)] text-white shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {historyLoading ? (
          <div className="flex h-96 flex-col items-center justify-center space-y-4">
            <div className="h-10 w-10 rounded-full border-4 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-green)]">{t.loadingJournal}</p>
          </div>
        ) : (
          <>
            {activeTab === 'log' && (
              <DailyFoodLogTab
                selectedDate={selectedDate}
                formatDayLabel={formatDayLabel}
                selectedDateTotals={selectedDateTotals}
                nutritionData={nutritionData}
                language={language}
                getMealTypeLabel={getMealTypeLabel}
                currentDaySessions={currentDaySessions}
                setSelectedEntry={setSelectedEntry}
                handleDeleteClick={handleDeleteClick}
                t={t}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsTrendsTab
                nutritionData={nutritionData}
                language={language}
              />
            )}

            {activeTab === 'insights' && (
              <AIInsightsTab
                language={language}
                selectedDate={selectedDate}
                formatDayLabel={formatDayLabel}
                selectedDateEntries={selectedDateEntries}
                selectedDateTotals={selectedDateTotals}
                isAdviceLoading={isAdviceLoading}
                dailyAdvice={dailyAdvice}
                actionableAdvice={actionableAdvice}
                isAiAdvice={isAiAdvice}
                handleGenerateInsight={handleGenerateInsight}
                t={t}
              />
            )}
          </>
        )}
      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleConfirmDelete}
        title={t.deleteData}
        message={t.deleteConfirmMsg}
        itemName={deleteModal.item?.foodName}
        isLoading={isDeleting}
      />

      <FoodDetailModal
        selectedEntry={selectedEntry}
        setSelectedEntry={setSelectedEntry}
        language={language}
        t={t}
      />
    </div>
  );
};

export default HistoryPage;
