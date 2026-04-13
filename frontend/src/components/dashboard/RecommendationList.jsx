import React from 'react';
import { Lightbulb, CheckCircle, AlertTriangle, Target } from 'lucide-react';

const RecommendationList = () => {
  // Mock recommendations
  const mockRecommendations = [
    {
      id: 1,
      type: 'protein',
      priority: 'high',
      title: 'Tingkatkan Asupan Protein',
      message: 'Asupan protein Anda masih di bawah target harian. Tambahkan sumber protein sehat untuk mendukung pertumbuhan dan pemulihan.',
      foods: ['Telur', 'Ayam tanpa kulit', 'Ikan salmon', 'Tahu', 'Tempe', 'Kacang-kacangan'],
      icon: Target,
      bgClass: 'bg-blue-100',
      iconClass: 'text-blue-600',
      tagBgClass: 'bg-blue-100',
      tagTextClass: 'text-blue-800',
      tagHoverClass: 'hover:bg-blue-200'
    },
    {
      id: 2,
      type: 'iron',
      priority: 'medium',
      title: 'Perbanyak Makanan Berserat Besi',
      message: 'Konsumsi makanan tinggi zat besi untuk mencegah anemia dan menjaga energi tubuh.',
      foods: ['Bayam', 'Hati ayam', 'Kacang merah', 'Quinoa', 'Daging sapi tanpa lemak'],
      icon: AlertTriangle,
      bgClass: 'bg-orange-100',
      iconClass: 'text-orange-600',
      tagBgClass: 'bg-orange-100',
      tagTextClass: 'text-orange-800',
      tagHoverClass: 'hover:bg-orange-200'
    },
    {
      id: 3,
      type: 'calcium',
      priority: 'low',
      title: 'Jaga Kesehatan Tulang',
      message: 'Pastikan asupan kalsium cukup untuk menjaga kepadatan tulang dan kesehatan gigi.',
      foods: ['Susu rendah lemak', 'Yogurt plain', 'Keju', 'Sawi hijau', 'Almond'],
      icon: CheckCircle,
      bgClass: 'bg-green-100',
      iconClass: 'text-green-600',
      tagBgClass: 'bg-green-100',
      tagTextClass: 'text-green-800',
      tagHoverClass: 'hover:bg-green-200'
    }
  ];

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Prioritas Tinggi</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Prioritas Sedang</span>;
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Prioritas Rendah</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="text-yellow-500" size={24} />
            Rekomendasi Personal
          </h3>
          <p className="text-gray-600 text-sm mt-1">Saran untuk nutrisi yang lebih baik</p>
        </div>
        <div className="text-sm text-gray-500">
          {mockRecommendations.length} rekomendasi
        </div>
      </div>

      <div className="space-y-4">
        {mockRecommendations.map((rec) => (
          <div key={rec.id} className={`border-2 rounded-xl p-5 transition-all duration-200 hover:shadow-md ${getPriorityStyles(rec.priority)}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`${rec.bgClass} p-2 rounded-lg`}>
                  <rec.icon className={rec.iconClass} size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{rec.title}</h4>
                  {getPriorityBadge(rec.priority)}
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{rec.message}</p>

            <div>
              <h5 className="font-medium text-gray-900 mb-2 text-sm">Makanan Rekomendasi:</h5>
              <div className="flex flex-wrap gap-2">
                {rec.foods.map((food, index) => (
                  <span
                    key={index}
                    className={`${rec.tagBgClass} ${rec.tagTextClass} rounded-full px-3 py-1 text-sm font-medium ${rec.tagHoverClass} transition-colors cursor-pointer`}
                  >
                    {food}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="text-blue-600" size={16} />
            <span className="font-semibold text-gray-900 text-sm">Tips Nutrisi</span>
          </div>
          <p className="text-gray-600 text-sm">
            Konsultasikan dengan ahli gizi untuk rekomendasi yang lebih personal berdasarkan kondisi kesehatan Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationList;