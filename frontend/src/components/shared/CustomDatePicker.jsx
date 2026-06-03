import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const CustomDatePicker = ({ selected, onChange, minDate, maxDate, className, disabled }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Normalize selected date
  const parseDate = (val) => {
    if (!val) {
      if (minDate) return new Date(minDate);
      return new Date();
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const selectedDate = parseDate(selected);
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  const containerRef = useRef(null);

  // Close calendar popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Days in month calculation
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month); // 0 = Sunday, 1 = Monday, etc.

  const monthsID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthsEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const months = language === 'id' ? monthsID : monthsEN;

  const daysOfWeekID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const daysOfWeekEN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeek = language === 'id' ? daysOfWeekID : daysOfWeekEN;

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day) => {
    const dateObj = new Date(year, month, day);
    
    // Check max date constraint
    if (maxDate) {
      const maxDateObj = new Date(maxDate);
      if (dateObj > maxDateObj) return;
    }

    // Check min date constraint
    if (minDate) {
      const minDateObj = new Date(minDate);
      if (dateObj < minDateObj) return;
    }

    const monthStr = `${dateObj.getMonth() + 1}`.padStart(2, '0');
    const dayStr = `${dateObj.getDate()}`.padStart(2, '0');
    const dateString = `${dateObj.getFullYear()}-${monthStr}-${dayStr}`;
    
    onChange(dateString);
    setIsOpen(false);
  };

  const formatDateDisplay = (date) => {
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Generate calendar days grid
  const days = [];
  // Empty spaces for previous month's alignment
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
    
    let isDisabled = false;
    if (maxDate) {
      const maxDateObj = new Date(maxDate);
      if (dateObj > maxDateObj) isDisabled = true;
    }
    if (minDate) {
      const minDateObj = new Date(minDate);
      if (dateObj < minDateObj) isDisabled = true;
    }

    days.push(
      <button
        key={`day-${d}`}
        type="button"
        disabled={isDisabled}
        onClick={() => handleDateClick(d)}
        className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-all relative ${
          isSelected 
            ? 'bg-[var(--primary-green)] text-white rounded-full shadow-lg shadow-emerald-500/20' 
            : isDisabled 
              ? 'text-slate-700 cursor-not-allowed opacity-30' 
              : 'text-[var(--text-main)] hover:bg-[var(--primary-green)]/20 hover:text-[var(--primary-green)] rounded-full'
        }`}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          if (disabled) return;
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] font-black text-xs shadow-sm transition-all ${
          disabled 
            ? 'opacity-65 cursor-not-allowed select-none bg-[var(--bg-secondary)]/50 border-transparent text-[var(--text-muted)]' 
            : 'hover:border-[var(--primary-green)]/40 hover:scale-[1.01] active:scale-99'
        } ${className}`}
      >
        <CalendarIcon size={16} className={disabled ? 'text-[var(--text-muted)]' : 'text-[var(--primary-green)]'} />
        <span>{formatDateDisplay(selectedDate)}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-5 shadow-2xl z-[1000] animate-in fade-in zoom-in-95 duration-200">
          {/* Header Month/Year Selector */}
          <div className="flex items-center justify-between mb-4">
            <button 
              type="button" 
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-card)] text-[var(--text-main)] transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
              {months[month]} {year}
            </span>
            <button 
              type="button" 
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-card)] text-[var(--text-main)] transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days of Week Headers */}
          <div className="grid grid-cols-7 gap-y-2 text-center mb-3">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-y-2 justify-items-center">
            {days}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
