import React from 'react';
import { useNutrition } from '../context/useNutrition';
import FoodForm from '../components/FoodForm';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { colors } from '../styles/colors';

const InputGizi = () => {
  const { addFoodEntry } = useNutrition();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen pt-44 pb-16 bg-[var(--bg-primary)] px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-main)] mb-4">{t.nutriCheck}</h1>
          <p className="text-[var(--text-muted)] font-medium max-w-lg mx-auto">
            {language === 'id' ? 'Beri tahu kami apa yang Anda makan hari ini, dan biarkan AI kami menganalisis nutrisinya untuk Anda.' : 'Tell us what you ate today, and let our AI analyze the nutrition for you.'}
          </p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/40">
          <FoodForm onAddFood={addFoodEntry} submitLabel={language === 'id' ? 'Analisis Nutrisi' : 'Analyze Nutrition'} />
        </div>
      </div>
    </div>
  );
};

export default InputGizi;
