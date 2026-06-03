import React from 'react';
import CustomDatePicker from '../../../components/shared/CustomDatePicker';

const HistoryHeader = ({
  language,
  selectedDate,
  setSelectedDate,
  getDateKey,
  user,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 pb-3 md:pb-6 border-b border-[var(--border-card)]/50">
      <div>
        <h1 className="text-lg md:text-2xl lg:text-3xl font-black tracking-tight text-[var(--text-main)]">
          {language === 'id' ? (
            <>Jurnal <span className="text-[var(--primary-green)]">Nutrisi</span></>
          ) : (
            <>Nutrition <span className="text-[var(--primary-green)]">Journal</span></>
          )}
        </h1>
        <p className="mt-0.5 md:mt-2 text-[9px] md:text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">
          {language === 'id' 
            ? 'Pantau asupan harian, lihat tren nutrisi, dan dapatkan saran personal dari AI.' 
            : 'Monitor daily intake, view nutrition trends, and get personalized advice from AI.'}
        </p>
      </div>
      
      {/* Kalender (Date Picker) Component */}
      <div className="flex items-center gap-2 md:gap-3 bg-[var(--bg-card)] border border-[var(--border-card)] p-2 md:p-3 rounded-lg md:rounded-2xl shadow-sm self-start md:self-auto shrink-0">
        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1 md:ml-2">Tanggal:</span>
        <CustomDatePicker 
          selected={selectedDate}
          onChange={(dateStr) => setSelectedDate(dateStr)}
          maxDate={getDateKey(new Date())}
          minDate={user?.createdAt ? getDateKey(user.createdAt) : undefined}
        />
      </div>
    </div>
  );
};

export default HistoryHeader;
