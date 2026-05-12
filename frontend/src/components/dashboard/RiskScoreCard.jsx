import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const RiskScoreCard = ({ riskScore, aiAdvice }) => {
  if (riskScore === null) {
    return (
      <div className="bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-[var(--border-card)] p-6 md:p-10 text-[var(--text-muted)] group hover:shadow-emerald-500/5 transition-all">
        <h3 className="text-base md:text-lg font-bold text-[var(--text-main)] mb-3">Malnutrition Risk Score</h3>
        <p className="text-sm">No data yet — start inputting food to see risk analysis</p>
      </div>
    );
  }

  const getRiskLevel = (score) => {
    if (score < 0.3) return {
      level: 'Low',
      icon: CheckCircle,
      bgColor: 'from-green-500 to-green-700',
      textColor: 'text-green-400',
      iconBgClass: 'bg-green-500/10',
      iconTextClass: 'text-green-400',
      description: 'Your nutritional intake is in good condition. Keep up the healthy eating!'
    };
    if (score < 0.7) return {
      level: 'Medium',
      icon: AlertCircle,
      bgColor: 'from-yellow-500 to-yellow-700',
      textColor: 'text-yellow-400',
      iconBgClass: 'bg-yellow-500/10',
      iconTextClass: 'text-yellow-400',
      description: 'Pay attention to your nutritional intake. Some nutrients need to be increased.'
    };
    return {
      level: 'High',
      icon: AlertTriangle,
      bgColor: 'from-red-500 to-red-700',
      textColor: 'text-red-400',
      iconBgClass: 'bg-red-500/10',
      iconTextClass: 'text-red-400',
      description: 'High risk of malnutrition. Consult with a nutritionist immediately.'
    };
  };

  const { level, icon: Icon, bgColor, textColor, description, iconBgClass, iconTextClass } = getRiskLevel(riskScore);

  return (
    <div className="bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-[var(--border-card)] overflow-hidden group hover:shadow-emerald-500/5 transition-all">
      <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 p-6 md:p-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Malnutrition Risk Score</h3>
            <p className="text-[var(--text-muted)] text-sm">Based on AI Analysis</p>
          </div>
          <Icon size={32} className="text-[var(--text-main)] opacity-90" />
        </div>

        <div className="text-center">
          <div className="text-4xl md:text-5xl font-bold mb-1">
            {(riskScore * 100).toFixed(1)}%
          </div>
          <div className="text-base md:text-xl font-semibold">
            {level} Risk
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] p-6">
        {aiAdvice && (
          <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <TrendingUp size={14} />
              <span>Gemini AI Advice</span>
            </div>
            <p className="text-[var(--text-main)] text-sm italic leading-relaxed">
              "{aiAdvice}"
            </p>
          </div>
        )}
        <div className="flex items-start space-x-3">
          <div className={`${iconBgClass} p-2 rounded-lg mt-1`}>
            <TrendingUp className={iconTextClass} size={16} />
          </div>
          <div>
            <h4 className={`${textColor} font-semibold mb-2`}>Recommendation</h4>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Last Update</span>
            <span className="text-[var(--text-main)] font-medium">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskScoreCard;