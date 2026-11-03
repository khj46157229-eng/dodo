/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  GameMode,
  KeyLayout,
  MoleData,
  MoleType,
  FloatingText,
  HitBurst,
  GameStats,
  HighScoreRecord,
} from './types';
import { soundEngine } from './utils/audio';
import { MoleHole } from './components/MoleHole';
import { ScoreBoard } from './components/ScoreBoard';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { Play, Sparkles, Snowflake, Flame } from 'lucide-react';

const HOLE_KEY_LABELS = {
  numpad: ['7', '8', '9', '4', '5', '6', '1', '2', '3'],
  qwerty: ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'],
};

const KEY_MAPPING: Record<string, number> = {
  // Numpad codes
  Numpad7: 0,
  Numpad8: 1,
  Numpad9: 2,
  Numpad4: 3,
  Numpad5: 4,
  Numpad6: 5,
  Numpad1: 6,
  Numpad2: 7,
  Numpad3: 8,
  // Regular top row number keys
  '7': 0,
  '8': 1,
  '9': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '1': 6,
  '2': 7,
  '3': 8,
  // QWERTY keyboard keys
  KeyQ: 0,
  KeyW: 1,
  KeyE: 2,
  KeyA: 3,
  KeyS: 4,
  KeyD: 5,
  KeyZ: 6,
  KeyX: 7,
  KeyC: 8,
  q: 0,
  w: 1,
  e: 2,
  a: 3,
  s: 4,
  d: 5,
  z: 6,
  x: 7,
  c: 8,
  Q: 0,
  W: 1,
  E: 2,
  A: 3,
  S: 4,
  D: 5,
  Z: 6,
  X: 7,
  C: 8,
};

export default function App() {
  // Game Configuration & State
  const [mode, setMode] = useState<GameMode>('timeAttack');
  const [layout, setLayout] = useState<KeyLayout>('numpad');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [isFreezeActive, setIsFreezeActive] = useState<boolean>(false);

  // Sound States
  const [sfxOn, setSfxOn] = useState<boolean>(true);
  const [bgmOn, setBgmOn] = useState<boolean>(false);

  // High Scores & Records
  const [highscore, setHighscore] = useState<number>(() => {
    return parseInt(localStorage.getItem('whack_mole_highscore') || '0', 10);
  });
  const [records, setRecords] = useState<HighScoreRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('whack_mole_records') || '[]');
    } catch {
      return [];
    }
  });

  // Modal Dialogs
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  // 9 Mole Holes State
  const [holes, setHoles] = useState<(MoleData | null)[]>(Array(9).fill(null));
  const [pressedHoles, setPressedHoles] = useState<Record<number, boolean>>({});
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [hitBursts, setHitBursts] = useState<HitBurst[]>([]);
  const [hammerPos, setHammerPos] = useState<{ holeIndex: number; active: boolean } | null>(null);

  // Detailed Game Stats
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    maxCombo: 0,
    currentCombo: 0,
    lives: 3,
    maxLives: 3,
    totalHits: 0,
    totalClicks: 0,
    bombsHit: 0,
    goldHit: 0,
    speedHit: 0,
    normalHit: 0,
    iceHit: 0,
    timeElapsed: 0,
    remainingTime: 20,
    isFever: false,
    feverGauge: 0,
  });

  // Mutable Game References for Realtime Timers
  const speedLevelRef = useRef<number>(1);
  const moleTimeoutsRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const spawnerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameClockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const freezeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const statsRef = useRef<GameStats>(stats);
  const holesRef = useRef<(MoleData | null)[]>(holes);

  // Synchronize refs
  isPlayingRef.current = isPlaying;
  statsRef.current = stats;
  holesRef.current = holes;

  // Add floating text helper with high-impact scaling
  const addFloatingText = useCallback(
    (holeIndex: number, text: string, color: string, subText?: string, isJackpot?: boolean) => {
      const id = `${Date.now()}-${Math.random()}`;
      setFloatingTexts((prev) => [...prev, { id, holeIndex, text, color, subText, isJackpot }]);
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
      }, 750);
    },
    []
  );

  // Screen shake on bomb / life loss
  const triggerShake = useCallback(() => {
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 240);
  }, []);

  // End Game Handler
  const endGame = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    // Clear all timeouts and intervals
    if (spawnerTimeoutRef.current) clearTimeout(spawnerTimeoutRef.current);
    if (gameClockIntervalRef.current) clearInterval(gameClockIntervalRef.current);
    if (feverTimerRef.current) clearTimeout(feverTimerRef.current);
    if (freezeTimerRef.current) clearTimeout(freezeTimerRef.current);

    Object.values(moleTimeoutsRef.current).forEach((t) => clearTimeout(t));
    moleTimeoutsRef.current = {};

    // Retract all moles
    setHoles(Array(9).fill(null));

    soundEngine.playGameOver();

    const currentScore = statsRef.current.score;
    let newRecord = false;

    if (currentScore > highscore && currentScore > 0) {
      newRecord = true;
      setIsNewRecord(true);
      setHighscore(currentScore);
      localStorage.setItem('whack_mole_highscore', currentScore.toString());
      try {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      setIsNewRecord(false);
    }

    // Save record to history
    if (currentScore > 0) {
      const accuracy =
        statsRef.current.totalClicks > 0
          ? Math.round((statsRef.current.totalHits / statsRef.current.totalClicks) * 100)
          : 0;

      const newRecordItem: HighScoreRecord = {
        score: currentScore,
        mode,
        date: new Date().toLocaleDateString('ko-KR', {
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        accuracy,
        maxCombo: statsRef.current.maxCombo,
      };

      setRecords((prev) => {
        const updated = [newRecordItem, ...prev].slice(0, 15);
        localStorage.setItem('whack_mole_records', JSON.stringify(updated));
        return updated;
      });
    }

    setShowGameOver(true);
  }, [highscore, mode]);

  // Lose life in survival mode
  const loseLife = useCallback(() => {
    if (!isPlayingRef.current) return;
    triggerShake();
    soundEngine.playMiss();

    setStats((prev) => {
      const nextLives = prev.lives - 1;
      if (nextLives <= 0) {
        setTimeout(endGame, 100);
      }
      return {
        ...prev,
        lives: Math.max(0, nextLives),
        currentCombo: 0,
        feverGauge: Math.max(0, prev.feverGauge - 15),
      };
    });
  }, [endGame, triggerShake]);

  // Retract mole helper
  const retractMole = useCallback((holeIndex: number) => {
    if (moleTimeoutsRef.current[holeIndex]) {
      clearTimeout(moleTimeoutsRef.current[holeIndex]);
      delete moleTimeoutsRef.current[holeIndex];
    }
    setHoles((prev) => {
      const next = [...prev];
      next[holeIndex] = null;
      return next;
    });
  }, []);

  // Pop mole logic
  const popMole = useCallback(() => {
    if (!isPlayingRef.current) return;

    // Pick random empty hole
    const emptyIndices: number[] = [];
    holesRef.current.forEach((mole, idx) => {
      if (!mole) emptyIndices.push(idx);
    });

    if (emptyIndices.length === 0) return;

    const chosenHole = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    // Mole variety determination
    const rand = Math.random();
    let type: MoleType = 'NORMAL';
    let points = 200;

    const isFever = statsRef.current.isFever;

    if (isFever) {
      // In Fever mode, Gold and Speed moles appear far more often!
      if (rand < 0.55) {
        type = 'GOLD';
        points = 1000;
      } else if (rand < 0.85) {
        type = 'SPEED';
        points = 500;
      } else {
        type = 'NORMAL';
        points = 200;
      }
    } else {
      if (rand < 0.16) {
        type = 'BOMB';
        points = -500;
      } else if (rand < 0.38) {
        type = 'SPEED';
        points = 500;
      } else if (rand < 0.52) {
        type = 'GOLD';
        points = 1000;
      } else if (rand < 0.62) {
        type = 'ICE';
        points = 400;
      } else {
        type = 'NORMAL';
        points = 200;
      }
    }

    const currentSpeed = speedLevelRef.current;
    const isFrozen = isFreezeActive;

    // Calculate stay duration
    let stayDuration = Math.max(240, 750 / Math.pow(currentSpeed, 0.68));
    if (type === 'SPEED') stayDuration *= 0.5; // ninja mole
    if (type === 'GOLD') stayDuration *= 0.7;
    if (mode === 'easy') stayDuration *= 1.35;
    if (isFrozen) stayDuration *= 1.7; // Slowed down by Ice mole

    const moleData: MoleData = {
      id: Date.now() + Math.random(),
      type,
      holeIndex: chosenHole,
      points,
      spawnTime: Date.now(),
      duration: stayDuration,
      isHit: false,
    };

    setHoles((prev) => {
      const next = [...prev];
      next[chosenHole] = moleData;
      return next;
    });

    // Auto-retract timeout
    moleTimeoutsRef.current[chosenHole] = setTimeout(() => {
      // If player missed a valid mole in survival mode
      if (
        holesRef.current[chosenHole] &&
        !holesRef.current[chosenHole]?.isHit &&
        type !== 'BOMB' &&
        mode === 'survival'
      ) {
        loseLife();
      }
      retractMole(chosenHole);
    }, stayDuration);
  }, [isFreezeActive, loseLife, mode, retractMole]);

  // Spawner loop with multi-mole rush
  const scheduleNextSpawn = useCallback(() => {
    if (!isPlayingRef.current) return;

    speedLevelRef.current += mode === 'easy' ? 0.015 : 0.032;

    const currentSpeed = speedLevelRef.current;
    let spawnInterval = Math.max(120, 480 / Math.pow(currentSpeed, 0.6));
    if (isFreezeActive) spawnInterval *= 1.5;
    if (mode === 'easy') spawnInterval *= 1.35;

    // Multi-mole spawning thrill (Rush Hour in final 6 seconds or high combo)
    const remainingTime = statsRef.current.remainingTime;
    let countToSpawn = 1;
    if (mode === 'timeAttack' && remainingTime <= 6) {
      countToSpawn = Math.random() < 0.7 ? 3 : 2;
      spawnInterval = Math.max(100, spawnInterval * 0.75); // Extreme speed rush!
    } else if (remainingTime <= 12 || statsRef.current.currentCombo >= 8) {
      countToSpawn = Math.random() < 0.55 ? 2 : 1;
    }

    for (let i = 0; i < countToSpawn; i++) {
      popMole();
    }

    spawnerTimeoutRef.current = setTimeout(scheduleNextSpawn, spawnInterval);
  }, [isFreezeActive, mode, popMole]);

  // Start / Reset Game
  const startGame = useCallback(() => {
    soundEngine.ensureContext();

    // Clear any pending timers
    if (spawnerTimeoutRef.current) clearTimeout(spawnerTimeoutRef.current);
    if (gameClockIntervalRef.current) clearInterval(gameClockIntervalRef.current);
    if (feverTimerRef.current) clearTimeout(feverTimerRef.current);
    if (freezeTimerRef.current) clearTimeout(freezeTimerRef.current);
    Object.values(moleTimeoutsRef.current).forEach((t) => clearTimeout(t));
    moleTimeoutsRef.current = {};

    setShowGameOver(false);
    setIsFreezeActive(false);
    speedLevelRef.current = mode === 'easy' ? 0.8 : 1.0;

    const initialStats: GameStats = {
      score: 0,
      maxCombo: 0,
      currentCombo: 0,
      lives: 3,
      maxLives: 3,
      totalHits: 0,
      totalClicks: 0,
      bombsHit: 0,
      goldHit: 0,
      speedHit: 0,
      normalHit: 0,
      iceHit: 0,
      timeElapsed: 0,
      remainingTime: 20,
      isFever: false,
      feverGauge: 0,
    };

    setStats(initialStats);
    statsRef.current = initialStats;
    setHoles(Array(9).fill(null));
    setIsPlaying(true);
    isPlayingRef.current = true;

    // Start Clock Interval
    gameClockIntervalRef.current = setInterval(() => {
      if (!isPlayingRef.current) return;

      setStats((prev) => {
        const nextElapsed = prev.timeElapsed + 1;
        const nextRemaining = prev.remainingTime - 1;

        if (mode === 'timeAttack' && nextRemaining <= 0) {
          setTimeout(endGame, 50);
          return { ...prev, timeElapsed: nextElapsed, remainingTime: 0 };
        }

        return { ...prev, timeElapsed: nextElapsed, remainingTime: nextRemaining };
      });
    }, 1000);

    // Initial Spawns
    popMole();
    spawnerTimeoutRef.current = setTimeout(scheduleNextSpawn, 400);
  }, [endGame, mode, popMole, scheduleNextSpawn]);

  // Activate Fever Mode
  const activateFever = useCallback(() => {
    soundEngine.playFever();
    setStats((prev) => ({ ...prev, isFever: true, feverGauge: 100 }));

    if (feverTimerRef.current) clearTimeout(feverTimerRef.current);
    feverTimerRef.current = setTimeout(() => {
      setStats((prev) => ({ ...prev, isFever: false, feverGauge: 0 }));
    }, 5500);
  }, []);

  // Activate Freeze Mode
  const activateFreeze = useCallback(() => {
    soundEngine.playFreeze();
    setIsFreezeActive(true);

    if (freezeTimerRef.current) clearTimeout(freezeTimerRef.current);
    freezeTimerRef.current = setTimeout(() => {
      setIsFreezeActive(false);
    }, 3500);
  }, []);

  // Handle Hole Hit (Mouse, Touch, or Keyboard)
  const hitHole = useCallback(
    (holeIndex: number) => {
      if (!isPlayingRef.current) return;

      // Mallet Hammer visual feedback
      setHammerPos({ holeIndex, active: true });
      setTimeout(() => setHammerPos(null), 120);

      // Key pressed visual feedback
      setPressedHoles((prev) => ({ ...prev, [holeIndex]: true }));
      setTimeout(() => {
        setPressedHoles((prev) => ({ ...prev, [holeIndex]: false }));
      }, 100);

      const targetMole = holesRef.current[holeIndex];

      setStats((prev) => {
        const nextClicks = prev.totalClicks + 1;

        if (!targetMole || targetMole.isHit) {
          // Missed click on empty hole
          soundEngine.playMiss();
          addFloatingText(holeIndex, 'MISS', 'text-gray-400');
          return {
            ...prev,
            totalClicks: nextClicks,
            currentCombo: 0,
            feverGauge: Math.max(0, prev.feverGauge - 10),
          };
        }

        // We struck a mole!
        const nextHits = prev.totalHits + 1;

        if (targetMole.type === 'BOMB') {
          // Bomb struck!
          triggerShake();
          soundEngine.playBomb();
          addFloatingText(holeIndex, '💣 BOOM!', 'text-red-500', '-500점 & 콤보 리셋');

          const nextLives = mode === 'survival' ? prev.lives - 1 : prev.lives;
          const nextScore = Math.max(0, prev.score - 500);

          if (mode === 'survival' && nextLives <= 0) {
            setTimeout(endGame, 150);
          }

          // Trigger dark smoke shockwave
          const burstId = `${Date.now()}-${Math.random()}`;
          setHitBursts((prevB) => [
            ...prevB,
            { id: burstId, holeIndex, color: '#EF4444', ringColor: 'border-red-600 bg-red-600/30' },
          ]);
          setTimeout(() => {
            setHitBursts((prevB) => prevB.filter((b) => b.id !== burstId));
          }, 450);

          return {
            ...prev,
            score: nextScore,
            lives: Math.max(0, nextLives),
            currentCombo: 0,
            feverGauge: 0,
            totalClicks: nextClicks,
            totalHits: nextHits,
            bombsHit: prev.bombsHit + 1,
          };
        }

        // Struck a valid mole!
        const nextCombo = prev.currentCombo + 1;
        const nextMaxCombo = Math.max(prev.maxCombo, nextCombo);

        // Exponential Multiplier Scaling
        let multiplier = 1;
        let multiplierBadge = '';
        let isJackpot = false;

        if (prev.isFever) {
          multiplier = 10;
          multiplierBadge = '🔥 FEVER 10X JACKPOT!!';
          isJackpot = true;
        } else if (nextCombo >= 20) {
          multiplier = 10;
          multiplierBadge = '👑 10X JACKPOT BURST!!';
          isJackpot = true;
        } else if (nextCombo >= 15) {
          multiplier = 5;
          multiplierBadge = '💥 5X MEGA COMBO!';
          isJackpot = true;
        } else if (nextCombo >= 10) {
          multiplier = 3;
          multiplierBadge = '⚡ 3X TRIPLE!';
        } else if (nextCombo >= 5) {
          multiplier = 2;
          multiplierBadge = '🔥 2X DOUBLE!';
        }

        const gainedPoints = Math.round(targetMole.points * multiplier);
        const nextScore = prev.score + gainedPoints;

        // Fever Gauge increment
        let addedGauge = 12;
        if (targetMole.type === 'GOLD') addedGauge = 30;
        if (targetMole.type === 'SPEED') addedGauge = 18;

        const nextGauge = Math.min(100, prev.feverGauge + addedGauge);
        if (nextGauge >= 100 && !prev.isFever) {
          setTimeout(activateFever, 10);
        }

        // Trigger Shockwave & Particle Explosion
        const burstId = `${Date.now()}-${Math.random()}`;
        const burstStyle =
          targetMole.type === 'GOLD'
            ? { color: '#FBBF24', ringColor: 'border-yellow-400 bg-yellow-400/30' }
            : targetMole.type === 'SPEED'
            ? { color: '#EF4444', ringColor: 'border-red-500 bg-red-500/30' }
            : targetMole.type === 'ICE'
            ? { color: '#38BDF8', ringColor: 'border-cyan-400 bg-cyan-400/30' }
            : { color: '#10B981', ringColor: 'border-emerald-400 bg-emerald-400/30' };

        setHitBursts((prevB) => [
          ...prevB,
          { id: burstId, holeIndex, color: burstStyle.color, ringColor: burstStyle.ringColor },
        ]);
        setTimeout(() => {
          setHitBursts((prevB) => prevB.filter((b) => b.id !== burstId));
        }, 450);

        // Sound & Confetti Celebrations
        if (isJackpot || gainedPoints >= 2000) {
          soundEngine.playJackpot();
          if (gainedPoints >= 4000) {
            try {
              confetti({
                particleCount: 25,
                spread: 45,
                origin: { y: 0.5 },
              });
            } catch {
              // fallback
            }
          }
        } else if (targetMole.type === 'GOLD') {
          soundEngine.playGold();
        } else if (targetMole.type === 'ICE') {
          activateFreeze();
        } else if (targetMole.type === 'SPEED') {
          soundEngine.playHit(true);
        } else {
          soundEngine.playHit(false);
        }

        // Floating explosive text
        const colorClass =
          isJackpot || targetMole.type === 'GOLD'
            ? 'text-yellow-300'
            : targetMole.type === 'ICE'
            ? 'text-cyan-300'
            : targetMole.type === 'SPEED'
            ? 'text-red-400'
            : 'text-emerald-300';

        addFloatingText(
          holeIndex,
          `+${gainedPoints.toLocaleString()}`,
          colorClass,
          multiplierBadge || (targetMole.type === 'ICE' ? '❄️ 3초 슬로우' : undefined),
          isJackpot
        );

        // Accelerate game slightly
        speedLevelRef.current += 0.016;

        return {
          ...prev,
          score: nextScore,
          currentCombo: nextCombo,
          maxCombo: nextMaxCombo,
          feverGauge: nextGauge,
          totalClicks: nextClicks,
          totalHits: nextHits,
          normalHit: prev.normalHit + (targetMole.type === 'NORMAL' ? 1 : 0),
          speedHit: prev.speedHit + (targetMole.type === 'SPEED' ? 1 : 0),
          goldHit: prev.goldHit + (targetMole.type === 'GOLD' ? 1 : 0),
          iceHit: prev.iceHit + (targetMole.type === 'ICE' ? 1 : 0),
        };
      });

      // Mark mole as hit for dazed bonk animation
      if (targetMole) {
        setHoles((prev) => {
          const next = [...prev];
          if (next[holeIndex]) {
            next[holeIndex] = { ...next[holeIndex]!, isHit: true };
          }
          return next;
        });

        setTimeout(() => {
          retractMole(holeIndex);
        }, 120);
      }
    },
    [activateFever, activateFreeze, addFloatingText, endGame, mode, retractMole, triggerShake]
  );

  // Global Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept inputs if user is typing in form / modal
      if (showGameOver || showSettings || showLeaderboard) return;

      const codeOrKey = e.code in KEY_MAPPING ? e.code : e.key;

      if (codeOrKey in KEY_MAPPING) {
        e.preventDefault();
        const holeIdx = KEY_MAPPING[codeOrKey];

        if (!isPlayingRef.current) {
          startGame();
          return;
        }

        hitHole(holeIdx);
      } else if (e.code === 'Space' && !isPlayingRef.current) {
        e.preventDefault();
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hitHole, showGameOver, showLeaderboard, showSettings, startGame]);

  // Audio Toggles
  const handleToggleSfx = () => {
    const next = soundEngine.toggleSFX();
    setSfxOn(next);
  };

  const handleToggleBgm = () => {
    const next = soundEngine.toggleBGM();
    setBgmOn(next);
  };

  // Clear Records
  const handleClearRecords = () => {
    setRecords([]);
    setHighscore(0);
    localStorage.removeItem('whack_mole_records');
    localStorage.removeItem('whack_mole_highscore');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopBGM();
      if (spawnerTimeoutRef.current) clearTimeout(spawnerTimeoutRef.current);
      if (gameClockIntervalRef.current) clearInterval(gameClockIntervalRef.current);
      if (feverTimerRef.current) clearTimeout(feverTimerRef.current);
      if (freezeTimerRef.current) clearTimeout(freezeTimerRef.current);
      Object.values(moleTimeoutsRef.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-between p-3 sm:p-5 relative ${
        isScreenShaking ? 'shake-effect' : ''
      }`}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Freeze Frost Aura */}
      {isFreezeActive && (
        <div className="fixed inset-0 pointer-events-none z-30 border-[12px] border-cyan-400/40 animate-pulse flex items-start justify-center pt-3">
          <div className="px-4 py-1 rounded-full bg-cyan-900/90 text-cyan-200 text-xs sm:text-sm font-black border border-cyan-400 flex items-center gap-1.5 shadow-lg">
            <Snowflake className="w-4 h-4 text-cyan-300 animate-spin" />
            <span>얼음 슬로우 발동 중! (3초)</span>
          </div>
        </div>
      )}

      {/* Fever Flame Aura */}
      {stats.isFever && (
        <div className="fixed inset-0 pointer-events-none z-30 border-[12px] border-amber-500/40 animate-pulse flex items-start justify-center pt-3">
          <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 text-gray-950 text-xs sm:text-sm font-black border border-amber-300 flex items-center gap-1.5 shadow-xl animate-bounce">
            <Flame className="w-4 h-4 text-gray-950" />
            <span>🔥 FEVER MODE! 황금 두더지 대방출 & 점수 2.5배!</span>
          </div>
        </div>
      )}

      {/* App Header */}
      <header className="w-full max-w-lg text-center pt-1 mb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-300 font-bold mb-1 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>초스피드 두더지 잡기</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span className="text-gray-300">
            {mode === 'survival' ? '무한 서바이벌' : mode === 'timeAttack' ? '20초 타임어택' : '연습 모드'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 drop-shadow-md">
          ⚡ WHACK-A-MOLE
        </h1>
        <p className="text-xs text-gray-300 mt-0.5">
          {layout === 'numpad' ? (
            <>
              키패드 <span className="bg-amber-400 text-gray-950 px-1.5 py-0.5 rounded font-black text-[11px]">789 / 456 / 123</span> 또는 화면 터치!
            </>
          ) : (
            <>
              키보드 <span className="bg-purple-400 text-gray-950 px-1.5 py-0.5 rounded font-black text-[11px]">QWE / ASD / ZXC</span> 또는 화면 터치!
            </>
          )}
        </p>
      </header>

      {/* Main Game Arena */}
      <main className="w-full max-w-lg flex flex-col items-center gap-3.5 my-auto">
        {/* Score & Combo HUD */}
        <ScoreBoard
          stats={stats}
          mode={mode}
          highscore={highscore}
          sfxOn={sfxOn}
          bgmOn={bgmOn}
          onToggleSfx={handleToggleSfx}
          onToggleBgm={handleToggleBgm}
          onOpenSettings={() => setShowSettings(true)}
          onOpenStats={() => setShowLeaderboard(true)}
        />

        {/* Final 6s Rush Hour Urgency Alert */}
        {mode === 'timeAttack' && isPlaying && stats.remainingTime <= 6 && (
          <div className="w-full py-2 px-3 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 border-2 border-yellow-300 text-gray-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 animate-bounce shadow-[0_0_25px_rgba(239,68,68,0.9)]">
            <Flame className="w-4 h-4 text-gray-950" />
            <span>⚠️ FINAL RUSH! 남은 {stats.remainingTime}초! 두더지 떼 대폭발!!</span>
          </div>
        )}

        {/* 3x3 Mole Grid */}
        <div className={`relative w-full aspect-square p-3 sm:p-4 rounded-3xl bg-white/[0.06] backdrop-blur-md border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.5)] ${
          mode === 'timeAttack' && isPlaying && stats.remainingTime <= 6 ? 'rush-pulse' : ''
        }`}>
          <div className="w-full h-full grid grid-cols-3 gap-2.5 sm:gap-3.5 relative">
            {holes.map((mole, idx) => (
              <div key={idx} className="relative w-full h-full">
                <MoleHole
                  holeIndex={idx}
                  mole={mole}
                  keyLabel={HOLE_KEY_LABELS[layout][idx]}
                  isPressed={!!pressedHoles[idx]}
                  onHit={hitHole}
                  layout={layout}
                />

                {/* Shockwave Burst & Particle Explosions on Hit */}
                {hitBursts
                  .filter((b) => b.holeIndex === idx)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="absolute inset-0 pointer-events-none z-35 flex items-center justify-center"
                    >
                      <div className={`shockwave ${b.ringColor}`} />
                      <span className="absolute animate-ping text-2xl font-black drop-shadow">
                        💥
                      </span>
                    </div>
                  ))}

                {/* High-Impact Floating Score Texts for this Hole */}
                {floatingTexts
                  .filter((item) => item.holeIndex === idx)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`float-score left-1/2 flex flex-col items-center ${
                        item.isJackpot
                          ? 'top-[18%] font-black text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-red-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.9)]'
                          : `top-[26%] font-black text-xl sm:text-2xl ${item.color}`
                      }`}
                    >
                      <span>{item.text}</span>
                      {item.subText && (
                        <div
                          className={`mt-0.5 font-black whitespace-nowrap ${
                            item.isJackpot
                              ? 'text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-amber-400 text-gray-950 border border-yellow-200 shadow-md animate-bounce'
                              : 'text-xs text-amber-200'
                          }`}
                        >
                          {item.subText}
                        </div>
                      )}
                    </div>
                  ))}

                {/* Toy Mallet Hit Bonk Animation with Comic POW! Badge */}
                {hammerPos?.active && hammerPos.holeIndex === idx && (
                  <div className="absolute -top-3 -right-2 z-40 pointer-events-none transform -rotate-45 scale-125 transition-transform duration-75">
                    <span className="text-3xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">🔨</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Start Game & Control Buttons */}
        <div className="w-full flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={startGame}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:brightness-110 active:scale-95 text-white font-black text-lg sm:text-xl shadow-lg shadow-emerald-900/40 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>게임 시작 (Space)</span>
            </button>
          ) : (
            <button
              onClick={endGame}
              className="flex-1 py-3 px-6 rounded-2xl bg-red-600/80 hover:bg-red-500 active:scale-95 text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              게임 포기 / 그만하기
            </button>
          )}

          <button
            onClick={() => setLayout((prev) => (prev === 'numpad' ? 'qwerty' : 'numpad'))}
            title="키보드 레이아웃 전환"
            className="py-3 px-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-yellow-300 font-bold text-xs border border-white/10 transition active:scale-95 cursor-pointer whitespace-nowrap"
          >
            {layout === 'numpad' ? '🔢 키패드' : '💻 QWERTY'}
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-lg text-center mt-2 text-[11px] text-gray-400">
        <p>
          💡 <b>두더지 팁:</b> 👑 황금은 +350점, ❄️ 얼음은 3초 슬로우! 💣 폭탄은 치면 목숨이 깎여요!
        </p>
      </footer>

      {/* Game Over Modal */}
      {showGameOver && (
        <GameOverModal
          stats={stats}
          mode={mode}
          highscore={highscore}
          isNewRecord={isNewRecord}
          onRestart={startGame}
          onClose={() => setShowGameOver(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          mode={mode}
          layout={layout}
          sfxOn={sfxOn}
          bgmOn={bgmOn}
          onSelectMode={(newMode) => {
            setMode(newMode);
            if (isPlaying) endGame();
          }}
          onSelectLayout={setLayout}
          onToggleSfx={handleToggleSfx}
          onToggleBgm={handleToggleBgm}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Records & Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          highscore={highscore}
          records={records}
          onClearRecords={handleClearRecords}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}
