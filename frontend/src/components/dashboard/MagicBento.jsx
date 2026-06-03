import React from 'react';
import './MagicBento.css';

const MagicBento = ({ stats = [] }) => {
  return (
    <div className="bento-section" style={{ width: '100%' }}>
      <div className="card-grid">
        {stats.map((stat, index) => (
          <div key={index} className="magic-bento-card">
            <div className="magic-bento-card__header">
              <div className="magic-bento-card__icon-wrapper shadow-sm border border-[var(--border-card)]">
                <stat.icon size={22} />
              </div>
              <div className="magic-bento-card__label">{stat.label}</div>
            </div>
            <div className="magic-bento-card__content">
              <div className="magic-bento-card__value-container">
                <h2 className="magic-bento-card__value">{stat.value}</h2>
                <span className="magic-bento-card__unit">{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MagicBento;
