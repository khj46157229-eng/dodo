import React from 'react';
import { GameMode, GameStats } from '../types';
import { RotateCcw, Award, Zap, Crosshair, Clock, ShieldAlert } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  mode: GameMode;
  highscore: number;
  isNewRecord: boolean;
  onRestart: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  mode,
  isNewRecord,
  onRestart,
}) => {
  const accuracy =
    stats.totalClicks > 0
      ? Math.round((stats.totalHits / stats.totalClicks) * 100)
      : 0;

  const modeName =
    mode === 'survival'
      ? '무한 서바이벌'
      : mode === 'timeAttack'
      ? '20초 타임어택'
      : '연습 모드';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl p-6 bg-gradient-to-b from-gray-900 via-gray-900 to-[#181124] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-center text-white">
        {/* Trophy / Icon */}
        <div className="w-16 h-16 mx-auto -mt-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30 text-3xl">
          {isNewRecord ? '👑' : '🏆'}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black mt-3 text-white">
          게임 종료!
        </h2>
        <p className="text-xs text-amber-300/80 font-semibold mb-2">
          [{modeName}]
        </p>

        {isNewRecord && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black animate-pulse">
            <Award className="w-4 h-4" />
            <span>최고 기록 경신 달성! 🎉</span>
          </div>
        )}

        {/* Stats Card */}
        <div className="bg-black/40 rounded-2xl p-4 my-3 border border-white/10 flex flex-col gap-2.5 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span className="text-gray-400">최종 점수</span>
            <span className="text-2xl font-black text-yellow-400 tracking-tight">
              {stats.score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>플레이 시간</span>
            </span>
            <span className="font-bold text-cyan-400">
              {stats.timeElapsed}초
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span>최대 콤보</span>
            </span>
            <span className="font-bold text-orange-400">
              {stats.maxCombo} Combo
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span>명중률</span>
            </span>
            <span className="font-bold text-emerald-400">
              {accuracy}% ({stats.totalHits}/{stats.totalClicks})
            </span>
          </div>

          {stats.bombsHit > 0 && (
            <div className="flex justify-between items-center text-xs text-red-400 pt-1 border-t border-white/5">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                <span>폭탄 피격</span>
              </span>
              <span className="font-bold">{stats.bombsHit}회</span>
            </div>
          )}
        </div>

        {/* Mole types caught breakdown */}
        <div className="grid grid-cols-4 gap-1.5 mb-4 text-[11px] text-gray-300 bg-white/5 p-2 rounded-xl border border-white/5">
          <div className="flex flex-col items-center">
            <span className="text-amber-200">일반</span>
            <span className="font-black text-sm text-amber-100">{stats.normalHit}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-red-400">닌자</span>
            <span className="font-black text-sm text-red-300">{stats.speedHit}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-yellow-400">황금</span>
            <span className="font-black text-sm text-yellow-300">{stats.goldHit}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-cyan-300">얼음</span>
            <span className="font-black text-sm text-cyan-200">{stats.iceHit}</span>
          </div>
        </div>

        {/* Restart Action */}
        <button
          onClick={onRestart}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:brightness-110 active:scale-95 text-gray-950 font-black text-lg shadow-lg shadow-orange-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 text-gray-950" />
          <span>다시 도전하기</span>
        </button>
      </div>
    </div>
  );
};
