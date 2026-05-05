import React, { useEffect, useRef, useState } from 'react';
import { Plus, Search, MessageSquare, List, Brain } from 'lucide-react';
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

const FoodForm = ({ onAddFood, submitLabel = 'Tambah Makanan' }) => {
  const [inputMode, setInputMode] = useState('form');
  const [formData, setFormData] = useState({
    mealType: 'breakfast',
    foodName: '',
    quantity: '',
    unit: 'gram'
  });
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState('');
  const requestIdRef = useRef(0);
  const { predictNutrition } = useNutrition();

  useEffect(() => {
    if (inputMode !== 'story') {
      return undefined;
    }

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
  }, [inputMode, predictNutrition, story]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStoryChange = (value) => {
    setStory(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (inputMode === 'story') {
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
      } else {
        await onAddFood(formData);
      }

      setFormData({
        mealType: 'breakfast',
        foodName: '',
        quantity: '',
        unit: 'gram'
      });
      setStory('');
      setPredictionResult(null);
      setPredictionError('');
    } catch (error) {
      console.error('Error adding food:', error);
      alert(`Gagal menambahkan data makanan: ${error.message || 'Coba lagi.'}`);
    }

    setLoading(false);
  };

  const foods = predictionResult?.foods ?? [];
  const totalQuantity = predictionResult?.parsed_data?.total_nutrition?.quantity_grams ?? 0;
  const canSubmitStory = story.trim().length > 0 && !predicting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-center space-x-4 rounded-2xl bg-white/5 p-4">
        <button
          type="button"
          onClick={() => setInputMode('form')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 transition ${
            inputMode === 'form'
              ? 'bg-emerald-500 text-white'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          <List size={18} />
          <span>Form Input</span>
        </button>
        <button
          type="button"
          onClick={() => setInputMode('story')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 transition ${
            inputMode === 'story'
              ? 'bg-emerald-500 text-white'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          <MessageSquare size={18} />
          <span>Cerita Alami</span>
        </button>
      </div>

      {inputMode === 'story' ? (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Ceritakan makanan Anda hari ini
            </label>
            <textarea
              value={story}
              onChange={(e) => handleStoryChange(e.target.value)}
              placeholder="Contoh: Pagi cuma kopi sedikit sama roti setengah, siang nasi padang 1 porsi besar, sore 2 gorengan dan es teh."
              className="min-h-[120px] w-full resize-none rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              required
            />
            <p className="mt-2 text-xs text-slate-400">
              Tulis seperti bahasa sehari-hari. AI akan memecah makanan, porsi, dan estimasi nutrisinya.
            </p>
          </div>

          {predicting && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-2 text-slate-300">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-emerald-400"></div>
                <span>Menganalisis cerita makanan...</span>
              </div>
            </div>
          )}

          {predictionError && !predicting && (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {predictionError}
            </div>
          )}

          {predictionResult && !predicting && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 backdrop-blur-xl">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Brain className="text-emerald-400" size={18} />
                  <div>
                    <div className="text-sm font-medium text-emerald-200">Pratinjau Analisis AI</div>
                    <div className="text-xs text-slate-400">
                      {foods.length} makanan terdeteksi, total estimasi {formatMetric(totalQuantity, ' g')}
                    </div>
                  </div>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-100">
                  Risiko {predictionResult.risk_level}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center lg:grid-cols-4">
                <div className="rounded-2xl bg-slate-950/20 px-3 py-4">
                  <div className="text-lg font-bold text-white">{formatMetric(predictionResult.calories)}</div>
                  <div className="text-xs text-slate-400">Kalori</div>
                </div>
                <div className="rounded-2xl bg-slate-950/20 px-3 py-4">
                  <div className="text-lg font-bold text-white">{formatMetric(predictionResult.protein, 'g')}</div>
                  <div className="text-xs text-slate-400">Protein</div>
                </div>
                <div className="rounded-2xl bg-slate-950/20 px-3 py-4">
                  <div className="text-lg font-bold text-white">{formatMetric(predictionResult.carbs, 'g')}</div>
                  <div className="text-xs text-slate-400">Karbohidrat</div>
                </div>
                <div className="rounded-2xl bg-slate-950/20 px-3 py-4">
                  <div className="text-lg font-bold text-white">{formatMetric(predictionResult.fat, 'g')}</div>
                  <div className="text-xs text-slate-400">Lemak</div>
                </div>
              </div>

              {predictionResult.suggestion && (
                <p className="mt-4 rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3 text-sm text-slate-200">
                  {predictionResult.suggestion}
                </p>
              )}

              {foods.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Item yang terdeteksi
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {foods.map((food, index) => (
                      <div
                        key={`${food.name}-${index}`}
                        className="rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-white">{food.name}</div>
                            <div className="text-xs text-slate-400">
                              {formatFoodPortion(food)}
                              {food.estimated_grams ? ` - ${formatMetric(food.estimated_grams, ' g')}` : ''}
                            </div>
                          </div>
                          <div className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-100">
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
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Jenis Makanan</label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                required
              >
                {mealTypes.map((meal) => (
                  <option key={meal.value} value={meal.value}>
                    {meal.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Satuan</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="gram">Gram</option>
                <option value="ml">ml</option>
                <option value="buah">Buah</option>
                <option value="porsi">Porsi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Nama Makanan</label>
            <div className="relative">
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                placeholder="Contoh: Nasi, Telur, Sayur Bayam"
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 pl-12 text-white placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                required
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Jumlah</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="100"
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                required
                min="1"
              />
            </div>
          </div>
        </>
      )}

      <div className="flex items-end">
        <button
          type="submit"
          disabled={loading || (inputMode === 'story' && !canSubmitStory)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Plus size={18} />
          {loading ? 'Memproses...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default FoodForm;
