import React, { useEffect, useRef, useState } from 'react';
import { Plus, Search, MessageSquare, List, Brain, Sparkles } from 'lucide-react';
import { useNutrition } from '../context/useNutrition';

const mealTypes = [
  { value: 'breakfast', label: 'Sarapan' },
  { value: 'lunch', label: 'Makan Siang' },
  { value: 'dinner', label: 'Makan Malam' },
  { value: 'snack', label: 'Camilan' }
];

const formatMetric = (value, suffix = '') => {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) {
    return `0${suffix}`;
  }

  const displayValue = Number.isInteger(numericValue) ? numericValue : numericValue.toFixed(1);
  return `${displayValue}${suffix}`;
};

const formatFoodPortion = (food) => {
  if (food?.portion) {
    return food.portion;
  }

  if (food?.quantity && food?.unit) {
    return `${food.quantity} ${food.unit}`;
  }

  return '1 porsi';
};

import { useNotification } from '../context/useNotification';

const FoodForm = ({ onAddFood, submitLabel = 'Tambah Makanan' }) => {
  const { notify } = useNotification();
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState('');
  const requestIdRef = useRef(0);
  const { predictNutrition } = useNutrition();

  useEffect(() => {
    const trimmedStory = story.trim();
    if (trimmedStory.length <= 10) {
      setPredictionResult(null);
      setPredictionError('');
      setPredicting(false);
      return undefined;
    }

    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;
    setPredicting(true);
    setPredictionError('');

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await predictNutrition({ story: trimmedStory });
        if (requestIdRef.current === currentRequestId) {
          setPredictionResult(result);
          setPredictionError('');
        }
      } catch (error) {
        console.error('Prediction error:', error);
        if (requestIdRef.current === currentRequestId) {
          setPredictionResult(null);
          setPredictionError(error.message || 'Gagal menganalisis cerita makanan.');
        }
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setPredicting(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [predictNutrition, story]);

  const handleStoryChange = (value) => {
    setStory(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedStory = story.trim();
      let nutritionData = predictionResult;

      if (!nutritionData || nutritionData?.parsed_data?.original_story?.trim() !== trimmedStory) {
        nutritionData = await predictNutrition({ story: trimmedStory });
      }

      await onAddFood({
        story: trimmedStory,
        mealType: 'mixed',
        ...nutritionData
      });

      setStory('');
      setPredictionResult(null);
      setPredictionError('');
      notify({ type: 'success', title: 'Data Tersimpan', message: 'Nutrisi Anda berhasil dicatat!' });
    } catch (error) {
      console.error('Error adding food:', error);
      notify({ type: 'error', title: 'Gagal Simpan', message: `Gagal menambahkan data: ${error.message || 'Coba lagi.'}` });
    }

    setLoading(false);
  };

  const foods = predictionResult?.foods ?? [];
  const totalQuantity = predictionResult?.parsed_data?.total_nutrition?.quantity_grams ?? 0;
  const canSubmitStory = story.trim().length > 0 && !predicting;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-6">
        <div>
          <label className="mb-4 block text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Ceritakan makanan Anda hari ini
          </label>
          <textarea
            value={story}
            onChange={(e) => handleStoryChange(e.target.value)}
            placeholder="Contoh: Tadi pagi sarapan bubur ayam, siang makan nasi padang lauk rendang, lalu sore minum jus jeruk..."
            className="min-h-[180px] w-full resize-none rounded-[2rem] border border-[var(--border-card)] bg-[var(--bg-primary)] px-8 py-6 text-[var(--text-main)] placeholder-slate-600 outline-none transition-all focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 text-lg leading-relaxed shadow-inner"
            required
            maxLength="1000"
          />
          <div className="mt-4 flex items-center gap-2 text-[var(--text-muted)]">
            <Brain size={14} className="text-[var(--primary-green)]" />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              AI akan menganalisis makanan, porsi, dan estimasi nutrisi Anda.
            </p>
          </div>
        </div>

        {predicting && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in duration-500">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-[var(--primary-green)]/20 border-t-[var(--primary-green)] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain size={16} className="text-[var(--primary-green)] animate-pulse" />
              </div>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-[var(--primary-green)]">Menganalisis...</span>
          </div>
        )}

        {predictionError && !predicting && (
          <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-6 py-4 text-sm font-bold text-[var(--danger)] animate-in slide-in-from-top">
            {predictionError}
          </div>
        )}

        {predictionResult && !predicting && (
          <div className="rounded-[2.5rem] border border-[var(--primary-green)]/20 bg-[var(--bg-secondary)] p-8 md:p-10 animate-in zoom-in-95 duration-500 shadow-2xl">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-[var(--primary-green)] p-3 text-[var(--bg-primary)] shadow-lg shadow-emerald-500/30">
                  <Brain size={24} />
                </div>
                <div>
                  <div className="text-lg font-black text-[var(--text-main)]">Hasil Analisis AI</div>
                  <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                    {foods.length} Item • {formatMetric(totalQuantity, ' g')} Total
                  </div>
                </div>
              </div>
              <div className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest border border-current bg-current/10 ${
                predictionResult.risk_level === 'tinggi' ? 'text-[var(--danger)]' : 
                predictionResult.risk_level === 'sedang' ? 'text-[var(--warning)]' : 'text-[var(--primary-green)]'
              }`}>
                RISIKO {predictionResult.risk_level?.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-10">
              {[
                { label: 'Kalori', val: formatMetric(predictionResult.calories), color: 'text-[var(--primary-green)]' },
                { label: 'Protein', val: formatMetric(predictionResult.protein, 'g'), color: 'text-[var(--accent-blue)]' },
                { label: 'Karbo', val: formatMetric(predictionResult.carbs, 'g'), color: 'text-[var(--warning)]' },
                { label: 'Lemak', val: formatMetric(predictionResult.fat, 'g'), color: 'text-[var(--danger)]' }
              ].map((m) => (
                <div key={m.label} className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl px-4 py-6 text-center shadow-lg transition-transform hover:scale-105">
                  <div className={`text-xl font-black mb-1 ${m.color}`}>{m.val}</div>
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">{m.label}</div>
                </div>
              ))}
            </div>

            {predictionResult.ai_advice && (
              <div className="mb-10 rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 p-4 text-[var(--primary-green)] opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                  <MessageSquare size={100} strokeWidth={1} />
                </div>
                <div className="flex items-center gap-2 mb-3 text-[var(--primary-green)] font-black text-[10px] uppercase tracking-[0.3em] relative z-10">
                  <Sparkles size={12} className="animate-pulse" />
                  <span>AI Insight</span>
                </div>
                <p className="text-[var(--text-main)] text-sm italic font-medium leading-relaxed relative z-10">
                  "{predictionResult.ai_advice}"
                </p>
              </div>
            )}

            {foods.length > 0 && (
              <div className="space-y-4">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] flex items-center gap-4">
                  <span>Daftar Makanan</span>
                  <div className="h-[1px] flex-1 bg-[var(--border-card)]"></div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {foods.map((food, index) => (
                    <div
                      key={`${food.name}-${index}`}
                      className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-primary)] px-5 py-4 transition-all hover:border-[var(--primary-green)]/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-bold text-[var(--text-main)] text-sm truncate">{food.name}</div>
                          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tight mt-1">
                            {formatFoodPortion(food)} {food.estimated_grams ? `• ${formatMetric(food.estimated_grams, ' g')}` : ''}
                          </div>
                        </div>
                        <div className="shrink-0 rounded-lg bg-[var(--bg-card)] px-2 py-1 text-[8px] font-black text-[var(--primary-green)] border border-[var(--border-card)] uppercase tracking-widest">
                          {food.normalized_name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !canSubmitStory}
        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[var(--primary-green)] to-[var(--secondary-green)] px-10 py-6 font-black text-[var(--bg-primary)] text-lg shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="h-6 w-6 rounded-full border-3 border-[var(--bg-primary)] border-t-transparent animate-spin"></div>
        ) : (
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        )}
        <span>{loading ? 'Menyimpan...' : 'Simpan Data Nutrisi'}</span>
      </button>
    </form>
  );
};

export default FoodForm;
