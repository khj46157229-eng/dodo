import React from 'react';
import { MoleType } from '../types';

interface MoleGraphicProps {
  type: MoleType;
  isHit: boolean;
}

export const MoleGraphic: React.FC<MoleGraphicProps> = ({ type, isHit }) => {
  // Hit (bonked) expression overlay
  if (isHit) {
    if (type === 'BOMB') {
      return (
        <div className="w-full h-full flex items-center justify-center animate-ping duration-150">
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]">
            <polygon points="50,5 63,35 95,38 70,60 78,92 50,75 22,92 30,60 5,38 37,35" fill="#EF4444" />
            <polygon points="50,18 59,40 82,42 64,57 70,80 50,67 30,80 36,57 18,42 41,40" fill="#FBBF24" />
            <text x="50" y="58" textAnchor="middle" fill="#000" fontSize="18" fontWeight="900" fontFamily="sans-serif">
              BOOM!
            </text>
          </svg>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Base body in hit state */}
          <ellipse
            cx="50"
            cy="58"
            rx="38"
            ry="38"
            fill={type === 'GOLD' ? '#F59E0B' : type === 'SPEED' ? '#374151' : type === 'ICE' ? '#0284C7' : '#8B4513'}
          />
          <ellipse cx="50" cy="68" rx="24" ry="20" fill={type === 'GOLD' ? '#FEF08A' : type === 'ICE' ? '#BAE6FD' : '#D2B48C'} />

          {/* Bump / Bandage on head */}
          <path d="M 40 22 Q 50 12 60 22 Q 50 28 40 22" fill="#F87171" stroke="#DC2626" strokeWidth="2" />
          <ellipse cx="50" cy="22" rx="4" ry="3" fill="#FCA5A5" />

          {/* Swirly Dizzy Eyes */}
          <path d="M 32 44 Q 37 40 40 44 Q 42 48 37 50 Q 33 48 35 44" fill="none" stroke="#111827" strokeWidth="2.5" />
          <path d="M 60 44 Q 65 40 68 44 Q 70 48 65 50 Q 61 48 63 44" fill="none" stroke="#111827" strokeWidth="2.5" />

          {/* Dazed Mouth */}
          <ellipse cx="50" cy="62" rx="6" ry="7" fill="#7F1D1D" />
          <ellipse cx="50" cy="53" rx="7" ry="5" fill="#FDA4AF" />

          {/* Stars circling head */}
          <text x="26" y="24" fontSize="14" fill="#FBBF24">⭐</text>
          <text x="66" y="24" fontSize="14" fill="#FBBF24">✨</text>
        </svg>
      </div>
    );
  }

  // Normal active states
  switch (type) {
    case 'GOLD':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]">
          {/* Golden Body */}
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <linearGradient id="crownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Body */}
          <ellipse cx="50" cy="55" rx="38" ry="39" fill="url(#goldGrad)" stroke="#A16207" strokeWidth="2" />
          <ellipse cx="50" cy="67" rx="24" ry="20" fill="#FEF08A" />

          {/* King Crown */}
          <polygon points="34,22 41,34 50,20 59,34 66,22 68,36 32,36" fill="url(#crownGrad)" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="50" cy="20" r="3" fill="#EF4444" />
          <circle cx="34" cy="22" r="2.5" fill="#3B82F6" />
          <circle cx="66" cy="22" r="2.5" fill="#10B981" />

          {/* Eyes with sparkle */}
          <circle cx="36" cy="46" r="6" fill="#111827" />
          <circle cx="38" cy="44" r="2.2" fill="#FFFFFF" />
          <circle cx="64" cy="46" r="6" fill="#111827" />
          <circle cx="66" cy="44" r="2.2" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <circle cx="28" cy="54" r="5" fill="#F472B6" opacity="0.8" />
          <circle cx="72" cy="54" r="5" fill="#F472B6" opacity="0.8" />

          {/* Snout and Happy Mouth */}
          <ellipse cx="50" cy="53" rx="8" ry="6" fill="#FB7185" />
          <path d="M 44 60 Q 50 67 56 60" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Paws */}
          <ellipse cx="26" cy="74" rx="8" ry="6" fill="#EAB308" stroke="#A16207" strokeWidth="1.5" />
          <ellipse cx="74" cy="74" rx="8" ry="6" fill="#EAB308" stroke="#A16207" strokeWidth="1.5" />
        </svg>
      );

    case 'SPEED':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_10px_rgba(239,68,68,0.5)]">
          {/* Ninja Mole Dark Body */}
          <ellipse cx="50" cy="55" rx="38" ry="39" fill="#374151" stroke="#1F2937" strokeWidth="2" />
          <ellipse cx="50" cy="67" rx="23" ry="19" fill="#4B5563" />

          {/* Red Ninja Headband */}
          <rect x="14" y="32" width="72" height="15" rx="5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          {/* Headband tail waving */}
          <path d="M 82 38 Q 96 32 94 44 Q 88 42 82 43" fill="#DC2626" />

          {/* Determined sharp eyes */}
          <path d="M 30 38 L 42 42" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
          <path d="M 70 38 L 58 42" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
          <circle cx="36" cy="44" r="5" fill="#FFFFFF" />
          <circle cx="36" cy="44" r="3" fill="#111827" />
          <circle cx="64" cy="44" r="5" fill="#FFFFFF" />
          <circle cx="64" cy="44" r="3" fill="#111827" />

          {/* Snout */}
          <ellipse cx="50" cy="54" rx="7" ry="5" fill="#FCA5A5" />
          <path d="M 45 61 L 55 61" stroke="#F3F4F6" strokeWidth="2.5" strokeLinecap="round" />

          {/* Ninja Shuriken badge */}
          <polygon points="50,34 52,39 57,39 53,42 55,47 50,44 45,47 47,42 43,39 48,39" fill="#FEF08A" />
        </svg>
      );

    case 'ICE':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(56,189,248,0.7)]">
          <defs>
            <linearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="55" rx="38" ry="39" fill="url(#iceGrad)" stroke="#0369A1" strokeWidth="2" />
          <ellipse cx="50" cy="67" rx="24" ry="20" fill="#BAE6FD" />

          {/* Frosty Earmuffs */}
          <circle cx="16" cy="46" r="8" fill="#F43F5E" />
          <circle cx="84" cy="46" r="8" fill="#F43F5E" />
          <path d="M 18 44 Q 50 16 82 44" fill="none" stroke="#F43F5E" strokeWidth="4" />

          {/* Cold Eyes */}
          <circle cx="36" cy="45" r="5.5" fill="#0C4A6E" />
          <circle cx="38" cy="43" r="2" fill="#FFFFFF" />
          <circle cx="64" cy="45" r="5.5" fill="#0C4A6E" />
          <circle cx="66" cy="43" r="2" fill="#FFFFFF" />

          {/* Blue nose */}
          <ellipse cx="50" cy="53" rx="7" ry="5.5" fill="#7DD3FC" stroke="#0284C7" strokeWidth="1" />
          {/* Shivering mouth */}
          <path d="M 43 62 Q 46 60 50 62 Q 54 60 57 62" stroke="#0C4A6E" strokeWidth="2.5" fill="none" />
          {/* Snow crystal icon */}
          <text x="50" y="32" textAnchor="middle" fontSize="12" fill="#FFFFFF" opacity="0.9">❄️</text>
        </svg>
      );

    case 'BOMB':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_14px_rgba(239,68,68,0.7)]">
          {/* Menacing Bomb Round Body */}
          <defs>
            <radialGradient id="bombGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#4B5563" />
              <stop offset="45%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#0B0F19" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="58" r="37" fill="url(#bombGrad)" stroke="#DC2626" strokeWidth="2.5" />

          {/* Bomb Fuse & Spark */}
          <rect x="44" y="20" width="12" height="7" rx="2" fill="#9CA3AF" />
          <path d="M 50 20 Q 64 8 74 15" stroke="#D97706" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Spark Star */}
          <polygon points="74,15 78,8 82,14 88,11 84,18 89,23 81,22 80,28 75,23 69,26 73,19" fill="#F59E0B" />
          <circle cx="78" cy="18" r="3" fill="#EF4444" />

          {/* Angry Eyes */}
          <polygon points="30,42 43,47 38,51 28,47" fill="#EF4444" />
          <polygon points="70,42 57,47 62,51 72,47" fill="#EF4444" />
          <circle cx="37" cy="48" r="2.5" fill="#FFFFFF" />
          <circle cx="63" cy="48" r="2.5" fill="#FFFFFF" />

          {/* Skull / Warning Icon */}
          <ellipse cx="50" cy="66" rx="9" ry="8" fill="#EF4444" opacity="0.9" />
          <circle cx="47" cy="65" r="2" fill="#1F2937" />
          <circle cx="53" cy="65" r="2" fill="#1F2937" />
          <path d="M 46 71 L 54 71" stroke="#1F2937" strokeWidth="2" />
        </svg>
      );

    case 'NORMAL':
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Body */}
          <ellipse cx="50" cy="55" rx="38" ry="40" fill="#8B4513" stroke="#5C2E0B" strokeWidth="2" />
          {/* Snout Belly Oval */}
          <ellipse cx="50" cy="67" rx="24" ry="22" fill="#D2B48C" />

          {/* Ears */}
          <ellipse cx="20" cy="36" rx="6" ry="8" fill="#8B4513" stroke="#5C2E0B" strokeWidth="1.5" />
          <ellipse cx="20" cy="36" rx="3.5" ry="5" fill="#FDA4AF" />
          <ellipse cx="80" cy="36" rx="6" ry="8" fill="#8B4513" stroke="#5C2E0B" strokeWidth="1.5" />
          <ellipse cx="80" cy="36" rx="3.5" ry="5" fill="#FDA4AF" />

          {/* Big Shiny Eyes */}
          <circle cx="36" cy="44" r="6.5" fill="#111827" />
          <circle cx="38" cy="42" r="2.5" fill="#FFFFFF" />
          <circle cx="64" cy="44" r="6.5" fill="#111827" />
          <circle cx="66" cy="42" r="2.5" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <ellipse cx="26" cy="52" rx="5" ry="4" fill="#FDA4AF" opacity="0.8" />
          <ellipse cx="74" cy="52" rx="5" ry="4" fill="#FDA4AF" opacity="0.8" />

          {/* Cute Nose */}
          <ellipse cx="50" cy="52" rx="8" ry="6" fill="#FB7185" />
          {/* Buck Teeth */}
          <rect x="47" y="60" width="3" height="4.5" rx="1" fill="#FFFFFF" stroke="#5C2E0B" strokeWidth="0.8" />
          <rect x="50.5" y="60" width="3" height="4.5" rx="1" fill="#FFFFFF" stroke="#5C2E0B" strokeWidth="0.8" />
          {/* Smile Mouth */}
          <path d="M 43 59 Q 50 66 57 59" stroke="#3D1E07" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Cute Whiskers */}
          <path d="M 22 49 L 10 47" stroke="#3D1E07" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 22 53 L 9 55" stroke="#3D1E07" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 78 49 L 90 47" stroke="#3D1E07" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 78 53 L 91 55" stroke="#3D1E07" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
};
