import React, { useEffect, useRef, useState } from 'react';
import { Plus, Search, MessageSquare, List, Brain, Sparkles } from 'lucide-react';
import { useNutrition } from '../context/useNutrition';

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' }
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

  return '1 portion';
};

import { useNotification } from '../context/useNotification';

const FoodForm = ({ onAddFood, submitLabel = 'Add Food' }) => {
  const { notify } = useNotification();
  const [isManualMode, setIsManualMode] = useState(false);
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState('');
  const requestIdRef = useRef(0);
  const [manualData, setManualData] = useState({
    foodName: '',
    quantity: 1,
    unit: 'portion',
    mealType: 'breakfast'
  });
  const { predictNutrition } = useNutrition();

  const handleAnalyzeAI = async () => {
    const trimmedStory = story.trim();
    if (trimmedStory.length < 10) {
      notify({ type: 'warning', title: 'Story Too Short', message: 'Write at least 10 characters for AI to analyze.' });
      return;
    }

    setPredicting(true);
    setPredictionError('');
    setPredictionResult(null);

    try {
      const result = await predictNutrition({ story: trimmedStory });
      setPredictionResult(result);
      notify({ type: 'success', title: 'Analysis Complete', message: 'AI successfully extracted nutrition from your story!' });
    } catch (error) {
      console.error('Prediction error:', error);
      setPredictionError(error.message || 'Failed to analyze food story.');
      notify({ type: 'error', title: 'Analysis Failed', message: 'AI is busy or quota exceeded. Please try again later.' });
    } finally {
      setPredicting(false);
    }
  };

  const handleStoryChange = (value) => {
    setStory(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isManualMode) {
        // Submit manual data
        const manualFinalData = {
          food_name: manualData.foodName,
          meal_type: manualData.mealType,
          quantity: Number(manualData.quantity),
          unit: manualData.unit,
          calories: 0, // Manual mode usually needs user to input these, but for now we set to 0 or handled by context
          protein: 0,
          carbs: 0,
          fat: 0
        };
        await onAddFood(manualFinalData);
        notify({ type: 'success', title: 'Data Saved', message: 'Food added manually successfully!' });
      } else {
        const trimmedStory = story.trim();
        let nutritionData = predictionResult;

        if (!nutritionData || nutritionData?.parsed_data?.original_story?.trim() !== trimmedStory) {
          nutritionData = await predictNutrition({ story: trimmedStory });
        }

        const finalData = {
          food_name: nutritionData.food_name || (nutritionData.foods && nutritionData.foods.length > 0 ? nutritionData.foods.map(f => f.name).join(', ') : trimmedStory),
          meal_type: 'lunch', // Default or can be customized
          calories: Number(nutritionData.calories || 0),
          protein: Number(nutritionData.protein || 0),
          carbs: Number(nutritionData.carbs || 0),
          fat: Number(nutritionData.fat || 0),
          quantity: 1,
          unit: 'portion'
        };

        await onAddFood(finalData);

        setStory('');
        setPredictionResult(null);
        setPredictionError('');
        notify({ type: 'success', title: 'Data Saved', message: 'Your nutrition has been recorded!' });
      }
    } catch (error) {
      console.error('Error adding food:', error);
      notify({ type: 'error', title: 'Save Failed', message: `Failed to add data: ${error.message || 'Try again.'}` });
    }

    setLoading(false);
  };

  const foods = predictionResult?.foods ?? [];
  const totalQuantity = predictionResult?.parsed_data?.total_nutrition?.quantity_grams ?? 0;
  const canSubmit = isManualMode 
    ? manualData.foodName.trim().length > 0 
    : (story.trim().length > 0 && !predicting);

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-card)] max-w-sm mx-auto">
        <button 
          onClick={() => setIsManualMode(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isManualMode ? 'bg-[var(--primary-green)] text-[var(--bg-primary)] shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
        >
          <Sparkles size={14} />
          AI Story
        </button>
        <button 
          onClick={() => setIsManualMode(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isManualMode ? 'bg-[var(--primary-green)] text-[var(--bg-primary)] shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
        >
          <List size={14} />
          Manual
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {!isManualMode ? (
          <div className="space-y-6">
            <div>
              <label className="mb-4 block text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Tell us about your food today
              </label>
              <textarea
                value={story}
                onChange={(e) => handleStoryChange(e.target.value)}
                placeholder="Example: Had chicken porridge for breakfast, and Padang rice with rendang for lunch..."
                className="min-h-[180px] w-full resize-none rounded-[2rem] border border-[var(--border-card)] bg-[var(--bg-primary)] px-8 py-6 text-[var(--text-main)] placeholder-slate-600 outline-none transition-all focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 text-lg leading-relaxed shadow-inner"
                required={!isManualMode}
                maxLength="1000"
              />
              <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Brain size={14} className="text-[var(--primary-green)]" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">
                    AI will analyze food, portion, and nutrition estimates for you.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleAnalyzeAI}
                  disabled={predicting || story.trim().length < 10}
                  className="flex items-center gap-2 bg-white border border-[var(--primary-green)]/30 text-[var(--primary-green)] px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary-green)] hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {predicting ? (
                    <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                  )}
                  {predicting ? 'Analyzing...' : 'Analyze with AI'}
                </button>
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
                <span className="text-xs font-black uppercase tracking-widest text-[var(--primary-green)]">Analyzing...</span>
              </div>
            )}

            {predictionError && !predicting && (
              <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-6 py-4 text-sm font-bold text-[var(--danger)] animate-in slide-in-from-top flex flex-col gap-3">
                <p>{predictionError}</p>
                <button 
                  type="button"
                  onClick={() => setIsManualMode(true)}
                  className="bg-[var(--danger)] text-white px-4 py-2 rounded-xl text-xs uppercase tracking-widest w-fit hover:brightness-110"
                >
                  Use Manual Input
                </button>
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
                      <div className="text-lg font-black text-[var(--text-main)]">AI Analysis Results</div>
                      <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                        {foods.length} Item • {formatMetric(totalQuantity, ' g')} Total
                      </div>
                    </div>
                  </div>
                  <div className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest border border-current bg-current/10 ${
                    predictionResult.risk_level === 'tinggi' ? 'text-[var(--danger)]' : 
                    predictionResult.risk_level === 'sedang' ? 'text-[var(--warning)]' : 'text-[var(--primary-green)]'
                  }`}>
                    {predictionResult.risk_level === 'tinggi' ? 'HIGH RISK' : 
                     predictionResult.risk_level === 'sedang' ? 'MEDIUM RISK' : 'LOW RISK'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-10">
                  {[
                    { label: 'Calories', val: formatMetric(predictionResult.calories), color: 'text-[var(--primary-green)]' },
                    { label: 'Protein', val: formatMetric(predictionResult.protein, 'g'), color: 'text-[var(--accent-blue)]' },
                    { label: 'Carbs', val: formatMetric(predictionResult.carbs, 'g'), color: 'text-[var(--warning)]' },
                    { label: 'Fat', val: formatMetric(predictionResult.fat, 'g'), color: 'text-[var(--danger)]' }
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
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 p-6 bg-[var(--bg-secondary)] rounded-[2.5rem] border border-[var(--border-card)] animate-in slide-in-from-bottom duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">Food Name</label>
                <input 
                  type="text"
                  value={manualData.foodName}
                  onChange={(e) => setManualData({...manualData, foodName: e.target.value})}
                  placeholder="Example: Fried Egg"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-6 py-4 text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
                  required={isManualMode}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">Meal Time</label>
                <select 
                  value={manualData.mealType}
                  onChange={(e) => setManualData({...manualData, mealType: e.target.value})}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-6 py-4 text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] appearance-none cursor-pointer"
                >
                  {mealTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">Quantity</label>
                <input 
                  type="number"
                  value={manualData.quantity}
                  onChange={(e) => setManualData({...manualData, quantity: e.target.value})}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-6 py-4 text-[var(--text-main)] outline-none focus:border-[var(--primary-green)]"
                  min="0.1"
                  step="0.1"
                  required={isManualMode}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">Unit</label>
                <select 
                  value={manualData.unit}
                  onChange={(e) => setManualData({...manualData, unit: e.target.value})}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl px-6 py-4 text-[var(--text-main)] outline-none focus:border-[var(--primary-green)] appearance-none cursor-pointer"
                >
                  <option value="portion">Portion</option>
                  <option value="item">Item/Piece</option>
                  <option value="gram">Grams</option>
                  <option value="ml">Ml</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[var(--primary-green)] to-[var(--secondary-green)] px-10 py-6 font-black text-[var(--bg-primary)] text-lg shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="h-6 w-6 rounded-full border-3 border-[var(--bg-primary)] border-t-transparent animate-spin"></div>
          ) : (
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          )}
          <span>{loading ? 'Saving...' : (isManualMode ? 'Add Food' : 'Save Nutrition Data')}</span>
        </button>
      </form>
    </div>
  );
};

export default FoodForm;
