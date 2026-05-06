import React, { useState, useRef } from 'react';

const MagicCard = ({ children, className = '', glowColor = 'rgba(34, 197, 94, 0.15)' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 border border-white/40 shadow-sm ${className}`}
    >
      {/* Border Glow Layer (The "Magic" border) */}
      <div
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${glowColor.replace('0.15', '0.4')}, transparent 60%)`,
        }}
      />
      
      {/* Background Spotlight Layer (Inner Glow) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          opacity: opacity * 0.5,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, ${glowColor.replace('0.15', '0.3')}, transparent 50%)`,
        }}
      />
      
      {/* Content Layer (Ensure it's above the spotlight) */}
      <div className="relative z-10 h-full w-full bg-[var(--bg-card)]/80 backdrop-blur-sm rounded-[inherit]">
        {children}
      </div>
    </div>
  );
};

export default MagicCard;
