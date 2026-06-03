import React from 'react';

const MagicCard = ({ children, className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 border border-[var(--border-card)]/80 shadow-sm hover:border-[var(--primary-green)]/60 hover:shadow-md rounded-[inherit] ${className}`}
    >
      {/* Content Layer */}
      <div className="relative z-10 h-full w-full bg-[var(--bg-card)]/80 backdrop-blur-sm rounded-[inherit]">
        {children}
      </div>
    </div>
  );
};

export default MagicCard;
