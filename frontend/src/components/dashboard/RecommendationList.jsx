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
      bgClass: 'bg-blue-500/10',
      iconClass: 'text-blue-400',
      tagBgClass: 'bg-blue-500/10',
      tagTextClass: 'text-blue-400',
      tagHoverClass: 'hover:bg-blue-500/20'
    },
    {
      id: 2,
      type: 'iron',
      priority: 'medium',
      title: 'Perbanyak Makanan Berserat Besi',
      message: 'Konsumsi makanan tinggi zat besi untuk mencegah anemia dan menjaga energi tubuh.',
      foods: ['Bayam', 'Hati ayam', 'Kacang merah', 'Quinoa', 'Daging sapi tanpa lemak'],
      icon: AlertTriangle,
      bgClass: 'bg-orange-500/10',
      iconClass: 'text-orange-400',
      tagBgClass: 'bg-orange-500/10',
      tagTextClass: 'text-orange-400',
      tagHoverClass: 'hover:bg-orange-500/20'
    },
    {
      id: 3,
      type: 'calcium',
      priority: 'low',
      title: 'Jaga Kesehatan Tulang',
      message: 'Pastikan asupan kalsium cukup untuk menjaga kepadatan tulang dan kesehatan gigi.',
      foods: ['Susu rendah lemak', 'Yogurt plain', 'Keju', 'Sawi hijau', 'Almond'],
      icon: CheckCircle,
      bgClass: 'bg-emerald-500/10',
      iconClass: 'text-emerald-400',
      tagBgClass: 'bg-emerald-500/10',
      tagTextClass: 'text-emerald-400',
      tagHoverClass: 'hover:bg-emerald-500/20'
    }
  ];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium rounded-full">Prioritas Tinggi</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-medium rounded-full">Prioritas Sedang</span>;
      case 'low':
        return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium rounded-full">Prioritas Rendah</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="text-emerald-400" size={24} />
            Rekomendasi Personal
          </h3>
          <p className="text-slate-300 text-sm mt-1">Saran untuk nutrisi yang lebih baik</p>
        </div>
        <div className="text-sm text-slate-400">
          {mockRecommendations.length} rekomendasi
        </div>
      </div>

      <div className="space-y-4">
        {mockRecommendations.map((rec) => (
          <div key={rec.id} className={`border-2 rounded-xl p-5 transition-all duration-200 hover:shadow-md border-white/20 bg-white/5 hover:bg-white/10`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`${rec.bgClass} p-2 rounded-lg`}>
                  <rec.icon className={rec.iconClass} size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg">{rec.title}</h4>
                  {getPriorityBadge(rec.priority)}
                </div>
              </div>
            </div>

            <p className="text-slate-300 mb-4 leading-relaxed">{rec.message}</p>

            <div>
              <h5 className="font-medium text-white mb-2 text-sm">Makanan Rekomendasi:</h5>
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

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-lg p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="text-emerald-400" size={16} />
            <span className="font-semibold text-white text-sm">Tips Nutrisi</span>
          </div>
          <p className="text-slate-300 text-sm">
            Konsultasikan dengan ahli gizi untuk rekomendasi yang lebih personal berdasarkan kondisi kesehatan Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationList;