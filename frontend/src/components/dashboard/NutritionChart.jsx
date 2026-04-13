import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const NutritionChart = ({ data }) => {
  // Mock data for demonstration - in real app, this would come from props
  const chartData = [
    { day: 'Sen', calories: 1800, protein: 80, carbs: 220, fat: 60 },
    { day: 'Sel', calories: 1950, protein: 85, carbs: 240, fat: 65 },
    { day: 'Rab', calories: 1700, protein: 75, carbs: 200, fat: 55 },
    { day: 'Kam', calories: 2100, protein: 90, carbs: 260, fat: 70 },
    { day: 'Jum', calories: 1850, protein: 82, carbs: 230, fat: 62 },
    { day: 'Sab', calories: 2000, protein: 88, carbs: 250, fat: 68 },
    { day: 'Min', calories: 1900, protein: 83, carbs: 235, fat: 63 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{`Hari: ${label}`}</p>
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

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            Tren Nutrisi Mingguan
          </h3>
          <p className="text-gray-600 text-sm mt-1">Pantau pola asupan Anda</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>7 hari terakhir</span>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Kalori"
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
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium mb-1">Rata-rata Kalori</div>
          <div className="text-2xl font-bold text-blue-700">
            {Math.round(chartData.reduce((sum, item) => sum + item.calories, 0) / chartData.length)} kcal
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium mb-1">Rata-rata Protein</div>
          <div className="text-2xl font-bold text-green-700">
            {Math.round(chartData.reduce((sum, item) => sum + item.protein, 0) / chartData.length)}g
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;