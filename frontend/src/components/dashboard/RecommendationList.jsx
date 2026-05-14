import React from 'react';
import { Lightbulb, CheckCircle, AlertTriangle, Target, Zap, Waves } from 'lucide-react';
import { useNutrition } from '../../context/useNutrition';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../constants/translations';

const getIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'protein': return Target;
    case 'fiber': return Waves;
    case 'iron': return AlertTriangle;
    case 'energy': return Zap;
    case 'calcium': return CheckCircle;
    default: return Lightbulb;
  }
};

const getStyle = (priority) => {
  switch (priority) {
    case 'high': return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' };
    case 'medium': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
    case 'low': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    default: return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
  }
};

const RecommendationList = () => {
  const { nutritionData } = useNutrition();
  const { language } = useLanguage();
  const t = translations[language];
  const recommendations = nutritionData.recommendations || [];

  if (recommendations.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-[var(--border-card)] p-12 text-center">
        <Lightbulb className="mx-auto mb-4 text-emerald-500/30" size={48} />
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">{language === 'id' ? 'Belum Ada Rekomendasi' : 'No Recommendations Yet'}</h3>
        <p className="text-[var(--text-muted)]">{language === 'id' ? 'Catat beberapa makanan agar Gemini dapat memberikan saran pribadi untuk Anda.' : 'Log some food so Gemini can provide personalized advice for you.'}</p>
      </div>
    );
  }
  return (
    <div className="bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-[var(--border-card)] p-5 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <Lightbulb className="text-emerald-400" size={24} />
            {language === 'id' ? 'Rekomendasi Gemini' : "Gemini's Recommendations"}
          </h3>
          <p className="text-[var(--text-muted)] text-sm mt-1 italic">{language === 'id' ? 'Analisis cerdas berdasarkan riwayat Anda' : 'Intelligent analysis based on history'}</p>
        </div>
        <div className="w-fit rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-tighter">
          {recommendations.length} {language === 'id' ? 'Saran' : 'Suggestions'}
        </div>
      </div>

      <div className="grid gap-6">
        {recommendations.map((rec, index) => {
          const style = getStyle(rec.priority);
          const IconComp = getIcon(rec.type);
          
          return (
            <div key={index} className="group relative overflow-hidden rounded-[2rem] border border-[var(--border-card)] bg-[var(--bg-secondary)] p-8 transition-all hover:border-[var(--primary-green)]/30">
              <div className={`absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 opacity-5 ${style.text}`}>
                <IconComp size={100} />
              </div>
              
              <div className="flex items-start gap-4">
                <div className={`rounded-xl ${style.bg} p-3 ${style.text}`}>
                  <IconComp size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-[var(--text-main)] text-lg">{rec.title}</h4>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${style.bg} ${style.text} ${style.border}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[var(--text-main)]/90 text-sm leading-relaxed mb-4">
                    {rec.message}
                  </p>
                  
                  {rec.foods && (
                    <div className="flex flex-wrap gap-2">
                      {rec.foods.map((food, fIdx) => (
                        <span key={fIdx} className="rounded-lg bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--text-main)] border border-[var(--border-card)] hover:border-[var(--primary-green)]/30 transition-colors">
                          {food}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-emerald-500/10 p-5 border border-emerald-500/20">
        <div className="flex items-start gap-4">
          <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
            <CheckCircle size={20} />
          </div>
          <div>
            <h5 className="font-bold text-[var(--text-main)] text-sm mb-1">{language === 'id' ? 'Mengapa rekomendasi ini penting?' : 'Why is this recommendation important?'}</h5>
            <p className="text-[var(--text-muted)] text-xs leading-relaxed">
              {language === 'id' 
                ? 'Gemini membandingkan profil kesehatan Anda dengan tren nutrisi dari riwayat makanan harian Anda untuk memberikan saran yang membantu mencapai tujuan kesehatan jangka panjang.' 
                : 'Gemini compares your health profile with nutrition trends from your daily food history to provide advice that helps achieve long-term health goals.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationList;