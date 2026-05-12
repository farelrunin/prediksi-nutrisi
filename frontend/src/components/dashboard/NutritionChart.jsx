import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-white/20 rounded-xl p-4 shadow-xl backdrop-blur-xl">
        <p className="font-semibold text-white mb-2">{`Day: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${entry.dataKey === 'calories' ? ' kcal' : 'g'}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

const normalizeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const getDateKey = (dateValue) => {
  const date = new Date(dateValue);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const buildChartData = (entries = []) => {
  const grouped = new Map();
  const today = new Date();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = getDateKey(date);
    grouped.set(key, {
      key,
      day: dayFormatter.format(date),
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    });
  }

  entries.forEach((entry) => {
    const entryDate = new Date(entry.timestamp ?? entry.created_at);
    const key = getDateKey(entryDate);
    const current = grouped.get(key);
    if (!current) {
      return;
    }

    current.calories += normalizeNumber(entry.calories);
    current.protein += normalizeNumber(entry.protein);
    current.carbs += normalizeNumber(entry.carbs);
    current.fat += normalizeNumber(entry.fat);
  });

  return Array.from(grouped.values()).map((item) => ({
    ...item,
    calories: Math.round(item.calories),
    protein: Math.round(item.protein * 10) / 10,
    carbs: Math.round(item.carbs * 10) / 10,
    fat: Math.round(item.fat * 10) / 10
  }));
};

const NutritionChart = ({ data = [] }) => {
  const chartData = buildChartData(data);
  const hasHistory = data.length > 0;
  const averageCalories = chartData.reduce((sum, item) => sum + item.calories, 0) / chartData.length;
  const averageProtein = chartData.reduce((sum, item) => sum + item.protein, 0) / chartData.length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-emerald-400" size={24} />
            Weekly Trend
          </h3>
          <p className="text-slate-300 text-sm mt-1">Monitor your intake patterns</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar size={16} />
          <span>Last 7 days</span>
        </div>
      </div>

      <div className="h-64 md:h-80">
        {hasHistory ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => <span style={{ color: '#cbd5e1' }}>{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Calories"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="protein"
                stroke="#10b981"
                strokeWidth={3}
                name="Protein (g)"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/20 px-6 text-center text-slate-400">
            No intake history yet. Add food first so the 7-day trend can appear.
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="text-sm text-blue-400 font-medium mb-1">Avg. Calories</div>
          <div className="text-lg md:text-2xl font-bold text-blue-300">
            {Math.round(averageCalories || 0)} <span className="text-xs font-normal opacity-70">kcal</span>
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <div className="text-sm text-emerald-400 font-medium mb-1">Avg. Protein</div>
          <div className="text-lg md:text-2xl font-bold text-emerald-300">
            {Math.round(averageProtein || 0)}<span className="text-xs font-normal opacity-70">g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;
