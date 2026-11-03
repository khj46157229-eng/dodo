import React from 'react';
import { GameMode, GameStats } from '../types';
import { Heart, Volume2, VolumeX, Music, Settings, Flame, Trophy } from 'lucide-react';

interface ScoreBoardProps {
  stats: GameStats;
  mode: GameMode;
  highscore: number;
  sfxOn: boolean;
  bgmOn: boolean;
  onToggleSfx: () => void;
  onToggleBgm: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  stats,
  mode,
  highscore,
  sfxOn,
  bgmOn,
  onToggleSfx,
  onToggleBgm,
  onOpenSettings,
  onOpenStats,
}) => {
  // Multiplier calculation based on combo
  const multiplier = stats.isFever
    ? 10
    : stats.currentCombo >= 20
    ? 10
    : stats.currentCombo >= 15
    ? 5
    : stats.currentCombo >= 10
    ? 3
    : stats.currentCombo >= 5
    ? 2
    : 1;

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Top Bar: Highscore & Audio/Settings controls */}
      <div className="flex items-center justify-between px-2 text-xs text-gray-300">
        <button
          onClick={onOpenStats}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-amber-300 font-bold tracking-wide transition active:scale-95 cursor-pointer"
        >
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>최고 기록: {highscore.toLocaleString()}점</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleSfx}
            title={sfxOn ? '효과음 켜짐' : '효과음 꺼짐'}
            className={`p-2 rounded-xl border transition ${
              sfxOn
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-black/30 text-gray-400 border-white/10'
            }`}
          >
            {sfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleBgm}
            title={bgmOn ? '배경음악 켜짐' : '배경음악 꺼짐'}
            className={`p-2 rounded-xl border transition ${
              bgmOn
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-black/30 text-gray-400 border-white/10'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            title="게임 설정"
            className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-gray-300 border border-white/10 transition active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Scoreboard Glass Panel */}
      <div
        className={`w-full rounded-2xl p-3.5 sm:p-4 backdrop-blur-md border shadow-2xl transition-all duration-300 ${
          stats.isFever
            ? 'bg-gradient-to-r from-amber-950/60 via-red-950/60 to-purple-950/60 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
            : 'bg-white/[0.08] border-white/15'
        }`}
      >
        <div className="grid grid-cols-3 items-center text-center">
          {/* Score Display */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] sm:text-xs text-gray-400 font-extrabold tracking-wider">
              SCORE
            </span>
            <span className="text-2xl sm:text-4xl font-black text-yellow-400 tracking-tight drop-shadow">
              {stats.score.toLocaleString()}
            </span>
          </div>

          {/* Combo & Multiplier Display */}
          <div className="flex flex-col items-center border-x border-white/10 px-1">
            <span className="text-[11px] sm:text-xs text-gray-400 font-extrabold tracking-wider flex items-center gap-1">
              {stats.isFever ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span className="text-amber-300 font-black">FEVER 10X!</span>
                </>
              ) : multiplier >= 5 ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                  <span className="text-red-400 font-black">JACKPOT!</span>
                </>
              ) : (
                'COMBO'
              )}
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl sm:text-3xl font-black ${
                  stats.isFever || multiplier >= 5
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-yellow-400 animate-pulse'
                    : 'text-orange-400'
                }`}
              >
                {stats.currentCombo}
              </span>
              <span className={`text-xs font-black px-1.5 py-0.5 rounded ${
                multiplier >= 5 ? 'bg-amber-400 text-gray-950 animate-bounce' : 'text-amber-300/90'
              }`}>
                x{multiplier}배
              </span>
            </div>
          </div>

          {/* Life Hearts OR Timer */}
          <div className="flex flex-col items-center">
            {mode === 'timeAttack' ? (
              <>
                <span className="text-[11px] sm:text-xs text-cyan-300 font-extrabold tracking-wider">
                  TIME LEFT
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-black tracking-tight ${
                    stats.remainingTime <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-400'
                  }`}
                >
                  {stats.remainingTime}s
                </span>
              </>
            ) : (
              <>
                <span className="text-[11px] sm:text-xs text-gray-400 font-extrabold tracking-wider">
                  LIVES
                </span>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: stats.maxLives }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${
                        i < stats.lives
                          ? 'fill-red-500 text-red-500 scale-100 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                          : 'fill-gray-700/60 text-gray-600 scale-90'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Combo / Fever Gauge Bar */}
        <div className="mt-3 relative w-full h-2 rounded-full bg-gray-900/80 overflow-hidden border border-white/10">
          <div
            className={`h-full transition-all duration-150 ${
              stats.isFever
                ? 'bg-gradient-to-r from-amber-400 via-red-500 to-purple-500 animate-pulse w-full'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500'
            }`}
            style={{
              width: stats.isFever ? '100%' : `${Math.min(100, stats.feverGauge)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
