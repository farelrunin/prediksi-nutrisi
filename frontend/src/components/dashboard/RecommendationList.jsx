import React from 'react';
import { Lightbulb, CheckCircle, AlertTriangle, Target, Zap, Waves } from 'lucide-react';
import { useNutrition } from '../../context/useNutrition';

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
  const recommendations = nutritionData.recommendations || [];

  if (recommendations.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 text-center">
        <Lightbulb className="mx-auto mb-4 text-emerald-500/30" size={48} />
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Belum Ada Rekomendasi</h3>
        <p className="text-[var(--text-muted)]">Catat beberapa makanan agar Gemini bisa memberikan saran personal untukmu.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="text-emerald-400" size={24} />
            Rekomendasi Personal Gemini
          </h3>
          <p className="text-[var(--text-muted)] text-sm mt-1 italic">Analisis cerdas berdasarkan riwayat makan Anda</p>
        </div>
        <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-tighter">
          {recommendations.length} Saran Aktif
        </div>
      </div>

      <div className="grid gap-6">
        {recommendations.map((rec, index) => {
          const style = getStyle(rec.priority);
          const IconComp = getIcon(rec.type);
          
          return (
            <div key={index} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/40 p-6 transition-all hover:bg-white/60 hover:border-emerald-500/30">
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
                        <span key={fIdx} className="rounded-lg bg-slate-950/60 px-3 py-1 text-xs font-semibold text-white border border-white/10 hover:border-emerald-500/30 transition-colors">
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
            <h5 className="font-bold text-[var(--text-main)] text-sm mb-1">Kenapa Rekomendasi Ini Penting?</h5>
            <p className="text-[var(--text-muted)] text-xs leading-relaxed">
              Gemini membandingkan profil kesehatanmu dengan tren nutrisi dari riwayat makan harianmu untuk memberikan saran yang membantu mencapai target kesehatan jangka panjang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationList;