import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';

const QuickActionCard = ({
  language,
}) => {
  return (
    <Link
      to="/categories"
      className="w-full flex items-center justify-between p-3.5 md:p-6 bg-gradient-to-r from-[var(--primary-green)] to-[#10b981] hover:scale-[1.02] active:scale-100 text-white rounded-xl md:rounded-[2rem] shadow-lg shadow-emerald-500/25 transition-all group"
    >
      <div className="flex items-center gap-2.5 md:gap-4">
        <div className="p-2 md:p-3 bg-white/20 rounded-lg md:rounded-2xl">
          <Plus size={14} className="text-white w-3.5 h-3.5 md:w-5 md:h-5" />
        </div>
        <div className="text-left">
          <span className="text-xs md:text-sm font-black uppercase tracking-wider block">
            {language === 'id' ? 'Catat Makanan Baru' : 'Log New Food'}
          </span>
          <span className="text-[9px] md:text-[10px] font-bold text-white/80 block mt-0.5">
            {language === 'id' ? 'Cari di database lokal & USDA' : 'Search in local & USDA library'}
          </span>
        </div>
      </div>
      <ChevronRight size={14} className="text-white opacity-85 group-hover:translate-x-1 transition-transform w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
    </Link>
  );
};

export default QuickActionCard;
