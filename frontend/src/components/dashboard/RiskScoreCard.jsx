import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const RiskScoreCard = ({ riskScore, aiAdvice }) => {
  if (riskScore === null) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 text-slate-300">
        <h3 className="text-lg font-bold text-white mb-3">Risk Score Malnutrisi</h3>
        <p>Belum ada data — mulai input makanan untuk melihat analisis risiko</p>
      </div>
    );
  }

  const getRiskLevel = (score) => {
    if (score < 0.3) return {
      level: 'Rendah',
      icon: CheckCircle,
      bgColor: 'from-green-500 to-green-700',
      textColor: 'text-green-400',
      iconBgClass: 'bg-green-500/10',
      iconTextClass: 'text-green-400',
      description: 'Asupan nutrisi Anda dalam kondisi baik. Pertahankan pola makan sehat!'
    };
    if (score < 0.7) return {
      level: 'Sedang',
      icon: AlertCircle,
      bgColor: 'from-yellow-500 to-yellow-700',
      textColor: 'text-yellow-400',
      iconBgClass: 'bg-yellow-500/10',
      iconTextClass: 'text-yellow-400',
      description: 'Perhatikan asupan nutrisi Anda. Ada beberapa nutrisi yang perlu ditingkatkan.'
    };
    return {
      level: 'Tinggi',
      icon: AlertTriangle,
      bgColor: 'from-red-500 to-red-700',
      textColor: 'text-red-400',
      iconBgClass: 'bg-red-500/10',
      iconTextClass: 'text-red-400',
      description: 'Risiko malnutrisi tinggi. Segera konsultasikan dengan ahli gizi.'
    };
  };

  const { level, icon: Icon, bgColor, textColor, description, iconBgClass, iconTextClass } = getRiskLevel(riskScore);

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      <div className={`bg-gradient-to-r ${bgColor} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Risk Score Malnutrisi</h3>
            <p className="text-white/80 text-sm">Berdasarkan AI Analysis</p>
          </div>
          <Icon size={32} className="opacity-90" />
        </div>

        <div className="text-center">
          <div className="text-5xl font-bold mb-2">
            {(riskScore * 100).toFixed(1)}%
          </div>
          <div className="text-xl font-semibold">
            Risiko {level}
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-6">
        {aiAdvice && (
          <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <TrendingUp size={14} />
              <span>Gemini AI Advice</span>
            </div>
            <p className="text-white text-sm italic leading-relaxed">
              "{aiAdvice}"
            </p>
          </div>
        )}
        <div className="flex items-start space-x-3">
          <div className={`${iconBgClass} p-2 rounded-lg mt-1`}>
            <TrendingUp className={iconTextClass} size={16} />
          </div>
          <div>
            <h4 className={`${textColor} font-semibold mb-2`}>Rekomendasi</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Terakhir Update</span>
            <span className="text-white font-medium">
              {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskScoreCard;