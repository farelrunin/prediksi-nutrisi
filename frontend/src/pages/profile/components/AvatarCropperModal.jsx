import React from 'react';
import { RotateCcw } from 'lucide-react';

const AvatarCropperModal = ({
  tempImage,
  setIsCropping,
  position,
  scale,
  setScale,
  setPosition,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleCropSave,
}) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-[var(--border-card)] flex justify-between items-center bg-[var(--bg-secondary)]/50">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">Adjust Photo</h3>
            <p className="text-xs font-medium text-[var(--text-muted)] mt-1">Drag the photo to adjust position.</p>
          </div>
          <button onClick={() => setIsCropping(false)} className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-rose-500 transition-colors shadow-sm">
            <RotateCcw size={20} />
          </button>
        </div>
        
        <div className="bg-slate-200 flex justify-center">
          <div 
            className="relative w-[400px] h-[400px] overflow-hidden cursor-move touch-none bg-slate-100"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Circular Overlay Guide */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="w-full h-full shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-full border-2 border-white/50" />
            </div>
            
            {/* Crosshair Guide */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center opacity-30">
              <div className="w-full h-[1px] bg-white absolute" />
              <div className="h-full w-[1px] bg-white absolute" />
            </div>
            <img
              src={tempImage}
              alt="Crop preview"
              className="absolute transition-transform duration-75 select-none pointer-events-none"
              style={{
                transform: `translate(calc(200px + ${position.x}px - 50%), calc(200px + ${position.y}px - 50%)) scale(${scale})`,
                maxWidth: 'none',
              }}
              onLoad={(e) => {
                const img = e.target;
                const minScale = 400 / Math.min(img.naturalWidth, img.naturalHeight);
                setScale(minScale);
                setPosition({ x: 0, y: 0 });
              }}
            />
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
              <span>Zoom</span>
              <span>{Math.round(scale * 100)}%</span>
            </div>
            <input
              type="range"
              value={scale}
              min={0.1}
              max={3}
              step={0.01}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--primary-green)]"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsCropping(false)}
              className="flex-1 px-8 py-4 rounded-2xl font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCropSave}
              className="flex-1 px-8 py-4 rounded-2xl font-bold text-white bg-[var(--primary-green)] shadow-lg shadow-emerald-500/40 hover:scale-[1.02] active:scale-100 transition-all"
            >
              Use This Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropperModal;
