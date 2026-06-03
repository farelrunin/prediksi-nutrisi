import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../constants/translations';

// Custom API Base URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:5000' 
  : 'https://nutriai-backend-production-2987.up.railway.app';

const CustomTooltip = ({ active, payload, label, language }) => {
  if (active && payload && payload.length) {
    const isId = language === 'id';
    return (
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
        <p className="font-extrabold text-slate-100 mb-2">
          {isId ? `Tanggal/Hari: ${label}` : `Date/Day: ${label}`}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs font-black" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${entry.dataKey === 'calories' ? ' kcal' : 'g'}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const NutritionChart = () => {
  const { language } = useLanguage();
  const t = translations[language];

  // State Management
  const [timeRange, setTimeRange] = useState('mingguan'); // 'mingguan' or 'bulanan'
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // API Fetching Triggered on timeRange change
  useEffect(() => {
    const fetchProgressData = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const token = localStorage.getItem('token');
        // Map frontend timeRange value to backend parameter
        const rangeParam = timeRange === 'mingguan' ? 'week' : 'month';
        
        const response = await axios.get(`${API_BASE_URL}/api/history/progress?range=${rangeParam}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Ensure we extract data array safely
        const rawData = response.data?.data || response.data || [];
        
        // Map and format the backend data
        const formattedData = rawData.map(item => {
          // X-Axis dynamic labeling
          let label = item.label || item.day || item.date || '';
          
          if (timeRange === 'mingguan' && item.date) {
            const dateObj = new Date(item.date);
            label = dateObj.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'short' });
          } else if (timeRange === 'bulanan' && item.date) {
            const dateObj = new Date(item.date);
            label = dateObj.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' });
          }

          return {
            label: label,
            calories: Math.round(item.calories || 0),
            protein: Math.round((item.protein || 0) * 10) / 10,
            carbs: Math.round((item.carbs || 0) * 10) / 10,
            fat: Math.round((item.fat || 0) * 10) / 10
          };
        });

        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, [timeRange, language]);

  // Compute Averages safely
  const hasData = chartData.length > 0;
  const averageCalories = hasData 
    ? Math.round(chartData.reduce((sum, item) => sum + item.calories, 0) / chartData.length) 
    : 0;
  const averageProtein = hasData 
    ? Math.round(chartData.reduce((sum, item) => sum + item.protein, 0) / chartData.length * 10) / 10 
    : 0;

  return (
    <div className="w-full">
      {/* Header & Dynamic Toggle Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-lg md:text-xl font-black text-[var(--text-main)] flex items-center gap-2">
            <TrendingUp className="text-[var(--primary-green)]" size={24} />
            {language === 'id' ? 'Grafik Progres Gizi' : 'Nutrition Progress Chart'}
          </h3>
          <p className="text-[var(--text-muted)] text-xs font-semibold mt-1">
            {language === 'id' 
              ? 'Pantau tren konsumsi kalori mingguan dan bulanan Anda.' 
              : 'Monitor your weekly and monthly calorie trends.'}
          </p>
        </div>

        {/* Action Toggle Filters & Label */}
        <div className="flex items-center gap-4 self-start sm:self-center shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-black uppercase tracking-wider">
            <Calendar size={14} className="text-[var(--primary-green)]" />
            <span>{timeRange === 'mingguan' ? (language === 'id' ? '7 Hari Terakhir' : 'Last 7 Days') : (language === 'id' ? '30 Hari Terakhir' : 'Last 30 Days')}</span>
          </div>

          <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-card)] p-1 rounded-2xl shadow-inner">
            {[
              { id: 'mingguan', label: language === 'id' ? 'MINGGUAN' : 'WEEKLY' },
              { id: 'bulanan', label: language === 'id' ? 'BULANAN' : 'MONTHLY' }
            ].map((range) => {
              const isActive = timeRange === range.id;
              return (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setTimeRange(range.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-[var(--primary-green)] text-white shadow-md'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chart Area with Loading / Error States */}
      <div className="h-72 md:h-96 relative flex items-center justify-center">
        {isLoading ? (
          /* Premium Shimmer Skeleton Loader */
          <div className="absolute inset-0 flex flex-col justify-between p-4 bg-[var(--bg-secondary)]/30 border border-dashed border-[var(--border-card)] rounded-[2rem] animate-pulse">
            <div className="flex justify-between items-center w-full">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
            </div>
            <div className="h-44 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-full flex items-center justify-center">
              <RefreshCw size={24} className="animate-spin text-[var(--primary-green)] opacity-70" />
            </div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
          </div>
        ) : hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 rounded-[2rem] border border-dashed border-rose-300 bg-rose-50/10 text-center text-rose-500">
            <span className="text-sm font-bold block mb-2">{language === 'id' ? 'Gagal Memuat Data' : 'Failed to Load Data'}</span>
            <span className="text-xs">{language === 'id' ? 'Periksa jaringan Anda atau coba beberapa saat lagi.' : 'Check your connection or try again later.'}</span>
          </div>
        ) : hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 700 }}
                minTickGap={timeRange === 'bulanan' ? 35 : 10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 700 }}
              />
              <Tooltip content={<CustomTooltip language={language} />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => <span className="text-xs font-black uppercase tracking-wider text-[var(--text-main)] ml-1">{value === 'calories' ? t.calories : value === 'protein' ? t.protein : value}</span>}
              />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#0284c7" // Premium contrast blue
                strokeWidth={3.5}
                name="calories"
                dot={timeRange === 'mingguan' ? { fill: '#0284c7', strokeWidth: 2, r: 4 } : false}
                activeDot={{ r: 6, stroke: '#0284c7', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="protein"
                stroke="var(--primary-green)" // Premium Emerald green
                strokeWidth={3.5}
                name="protein"
                dot={timeRange === 'mingguan' ? { fill: 'var(--primary-green)', strokeWidth: 2, r: 4 } : false}
                activeDot={{ r: 6, stroke: 'var(--primary-green)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center rounded-[2rem] border border-dashed border-[var(--border-card)] bg-[var(--bg-secondary)]/30 px-6 text-center text-[var(--text-muted)] italic font-semibold text-xs leading-relaxed">
            {language === 'id' 
              ? 'Belum ada riwayat asupan untuk periode ini. Catat makanan Anda untuk melihat perkembangan gizi.' 
              : 'No intake history for this period yet. Log your food to see your nutrition progress.'}
          </div>
        )}
      </div>

      {/* Interactive Averages Cards */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-2">{language === 'id' ? 'Rata-rata Kalori' : 'Avg. Calories'}</div>
          <div className="text-xl md:text-2xl font-black text-sky-800 dark:text-sky-400">
            {averageCalories} <span className="text-xs font-bold opacity-80">{t.kcal}</span>
          </div>
        </div>
        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-green)] mb-2">{language === 'id' ? 'Rata-rata Protein' : 'Avg. Protein'}</div>
          <div className="text-xl md:text-2xl font-black text-emerald-800 dark:text-[var(--primary-green)]">
            {averageProtein} <span className="text-xs font-bold opacity-80">g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;
