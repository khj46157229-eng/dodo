import React from 'react';
import { HighScoreRecord } from '../types';
import { Trophy, Medal, X, Trash2, Calendar, Target, Zap } from 'lucide-react';

interface LeaderboardModalProps {
  highscore: number;
  records: HighScoreRecord[];
  onClearRecords: () => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  highscore,
  records,
  onClearRecords,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl p-5 sm:p-6 bg-[#161224] border border-white/15 shadow-2xl text-white max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-black">명예의 전당 & 최근 기록</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highscore Showcase Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 border border-amber-400/40 text-center shrink-0">
          <span className="text-xs uppercase font-extrabold text-amber-300 tracking-widest">
            ALL-TIME BEST
          </span>
          <div className="text-3xl sm:text-4xl font-black text-yellow-400 mt-0.5 tracking-tight drop-shadow">
            {highscore.toLocaleString()}점
          </div>
        </div>

        {/* Recent Game History List */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>최근 플레이 기록 (상위 10개)</span>
            {records.length > 0 && (
              <button
                onClick={onClearRecords}
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>기록 초기화</span>
              </button>
            )}
          </div>

          {records.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              아직 저장된 게임 기록이 없습니다.<br />지금 첫 판을 플레이해보세요!
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {records.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs text-amber-300">
                      {idx === 0 ? <Medal className="w-4 h-4 text-yellow-400" /> : idx + 1}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-yellow-400">
                        {rec.score.toLocaleString()}점
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <Calendar className="w-2.5 h-2.5" /> {rec.date}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-white/10 text-gray-300 text-[10px]">
                          {rec.mode === 'survival' ? '서바이벌' : rec.mode === 'timeAttack' ? '타임어택' : '연습'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end text-xs text-gray-300">
                    <span className="flex items-center gap-1 font-bold text-orange-400">
                      <Zap className="w-3 h-3" /> {rec.maxCombo}x
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <Target className="w-3 h-3" /> {rec.accuracy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold transition cursor-pointer shrink-0"
        >
          닫기
        </button>
      </div>
    </div>
  );
};
