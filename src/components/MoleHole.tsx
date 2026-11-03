import React from 'react';
import { MoleData, KeyLayout } from '../types';
import { MoleGraphic } from './MoleGraphic';

interface MoleHoleProps {
  holeIndex: number;
  mole: MoleData | null;
  keyLabel: string;
  isPressed: boolean;
  onHit: (holeIndex: number) => void;
  layout: KeyLayout;
}

export const MoleHole: React.FC<MoleHoleProps> = ({
  holeIndex,
  mole,
  keyLabel,
  isPressed,
  onHit,
}) => {
  return (
    <div
      data-hole={holeIndex}
      onClick={() => onHit(holeIndex)}
      className={`
        relative w-full aspect-square cursor-pointer select-none overflow-hidden
        rounded-2xl sm:rounded-3xl transition-all duration-100 transform active:scale-95
        ${isPressed ? 'ring-4 ring-amber-400 scale-[0.96] shadow-[0_0_25px_rgba(251,191,36,0.6)]' : 'hover:scale-[1.01]'}
        border-2 sm:border-3 border-[#53301a] shadow-[inset_0_12px_24px_rgba(0,0,0,0.8),0_8px_16px_rgba(0,0,0,0.4)]
        bg-[radial-gradient(circle_at_50%_75%,#3a2215_0%,#190c06_100%)]
      `}
    >
      {/* Keypad Indicator Badge */}
      <div className="absolute top-2 left-2 z-30 pointer-events-none">
        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-yellow-300 font-extrabold text-xs sm:text-sm shadow-md">
          {keyLabel}
        </div>
      </div>

      {/* Mole Container */}
      <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden pointer-events-none">
        <div
          className={`
            w-[76%] h-[76%] transition-all duration-100 ease-out transform
            ${mole ? 'translate-y-[10%] opacity-100' : 'translate-y-[110%] opacity-0'}
            ${mole?.isHit ? 'scale-110' : 'scale-100'}
          `}
        >
          {mole && <MoleGraphic type={mole.type} isHit={mole.isHit} />}
        </div>
      </div>

      {/* Dirt Rim / Front Mound that obscures the bottom of the mole */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[34%] z-20 pointer-events-none rounded-b-2xl sm:rounded-b-3xl border-t-3 border-[#5c3a21]"
        style={{
          background: 'linear-gradient(180deg, #422513 0%, #261308 100%)',
          boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.5)',
        }}
      >
        {/* Grass / Dirt tufts decorative dots */}
        <div className="absolute -top-1.5 left-2 right-2 flex justify-around opacity-60">
          <span className="w-2.5 h-1.5 bg-emerald-600 rounded-full inline-block"></span>
          <span className="w-3 h-2 bg-amber-800 rounded-full inline-block"></span>
          <span className="w-2 h-1 bg-emerald-700 rounded-full inline-block"></span>
          <span className="w-3 h-1.5 bg-emerald-600 rounded-full inline-block"></span>
        </div>
      </div>

      {/* Active press ripple ring */}
      {isPressed && (
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl z-25 pointer-events-none bg-amber-400/20 animate-ping duration-150" />
      )}
    </div>
  );
};
