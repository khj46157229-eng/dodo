import React from 'react';
import { GameMode, KeyLayout } from '../types';
import { X, Keyboard, Gamepad2, Volume2, Music, Info } from 'lucide-react';

interface SettingsModalProps {
  mode: GameMode;
  layout: KeyLayout;
  sfxOn: boolean;
  bgmOn: boolean;
  onSelectMode: (mode: GameMode) => void;
  onSelectLayout: (layout: KeyLayout) => void;
  onToggleSfx: () => void;
  onToggleBgm: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  mode,
  layout,
  sfxOn,
  bgmOn,
  onSelectMode,
  onSelectLayout,
  onToggleSfx,
  onToggleBgm,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl p-5 sm:p-6 bg-[#161224] border border-white/15 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black">게임 설정 & 가이드</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Mode Selection */}
        <div className="mt-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            게임 모드 선택
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSelectMode('survival')}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                mode === 'survival'
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span className="text-sm font-black text-amber-400">⚡ 서바이벌</span>
              <span className="text-[11px] mt-1 text-gray-300">
                목숨 3개, 무한 가속 스피드
              </span>
            </button>

            <button
              onClick={() => onSelectMode('timeAttack')}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                mode === 'timeAttack'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span className="text-sm font-black text-cyan-400">⏱️ 타임어택</span>
              <span className="text-[11px] mt-1 text-gray-300">
                20초간 최대 점수 격돌
              </span>
            </button>

            <button
              onClick={() => onSelectMode('easy')}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                mode === 'easy'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span className="text-sm font-black text-emerald-400">🎯 연습 모드</span>
              <span className="text-[11px] mt-1 text-gray-300">
                여유로운 속도와 적응 훈련
              </span>
            </button>
          </div>
        </div>

        {/* Keyboard Layout */}
        <div className="mt-5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5 text-yellow-400" />
            <span>키보드 조작 방식 (노트북/데스크탑)</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onSelectLayout('numpad')}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                layout === 'numpad'
                  ? 'bg-amber-500/20 border-amber-400 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="font-bold text-sm text-yellow-300">🔢 숫자 키패드</div>
              <div className="text-[11px] text-gray-300 mt-1">
                7 8 9 / 4 5 6 / 1 2 3
              </div>
            </button>

            <button
              onClick={() => onSelectLayout('qwerty')}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                layout === 'qwerty'
                  ? 'bg-purple-500/20 border-purple-400 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="font-bold text-sm text-purple-300">💻 노트북 QWERTY</div>
              <div className="text-[11px] text-gray-300 mt-1">
                Q W E / A S D / Z X C
              </div>
            </button>
          </div>
        </div>

        {/* Sound Settings */}
        <div className="mt-5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            사운드 설정
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onToggleSfx}
              className={`p-3 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                sfxOn ? 'bg-amber-500/20 border-amber-400 text-white' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>효과음</span>
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-black/40">
                {sfxOn ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={onToggleBgm}
              className={`p-3 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                bgmOn ? 'bg-purple-500/20 border-purple-400 text-white' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <Music className="w-4 h-4 text-purple-400" />
                <span>BGM</span>
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-black/40">
                {bgmOn ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        {/* Mole Character Guide */}
        <div className="mt-5 bg-black/40 rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-2">
            <Info className="w-3.5 h-3.5" />
            <span>두더지 종류 안내</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
              <span className="text-lg">🐹</span>
              <div>
                <div className="font-bold text-white">일반 두더지 (+100)</div>
                <div className="text-gray-400">기본적인 귀여운 두더지</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
              <span className="text-lg">🥷</span>
              <div>
                <div className="font-bold text-red-400">닌자 두더지 (+200)</div>
                <div className="text-gray-400">빛의 속도로 사라짐!</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
              <span className="text-lg">👑</span>
              <div>
                <div className="font-bold text-yellow-300">황금 두더지 (+350)</div>
                <div className="text-gray-400">대량 점수 & 피버 충전</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
              <span className="text-lg">❄️</span>
              <div>
                <div className="font-bold text-cyan-300">얼음 두더지 (+150)</div>
                <div className="text-gray-400">3초간 두더지 슬로우!</div>
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2 bg-red-950/40 border border-red-500/20 p-2 rounded-xl">
              <span className="text-lg">💣</span>
              <div>
                <div className="font-bold text-red-400">폭탄 (-200 & 목숨 -1)</div>
                <div className="text-red-300/80">절대 치지 마세요! 연속 콤보가 리셋됩니다!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold transition cursor-pointer"
        >
          확인 및 닫기
        </button>
      </div>
    </div>
  );
};
