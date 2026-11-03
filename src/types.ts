export type GameMode = 'survival' | 'timeAttack' | 'easy';

export type KeyLayout = 'numpad' | 'qwerty';

export type MoleType = 'NORMAL' | 'SPEED' | 'GOLD' | 'ICE' | 'BOMB';

export interface MoleData {
  id: number;
  type: MoleType;
  holeIndex: number; // 0 to 8 (corresponding to 7,8,9, 4,5,6, 1,2,3)
  points: number;
  spawnTime: number;
  duration: number;
  isHit: boolean;
}

export interface FloatingText {
  id: string;
  holeIndex: number;
  text: string;
  color: string;
  subText?: string;
  isJackpot?: boolean;
}

export interface HitBurst {
  id: string;
  holeIndex: number;
  color: string;
  ringColor: string;
}

export interface GameStats {
  score: number;
  maxCombo: number;
  currentCombo: number;
  lives: number;
  maxLives: number;
  totalHits: number;
  totalClicks: number;
  bombsHit: number;
  goldHit: number;
  speedHit: number;
  normalHit: number;
  iceHit: number;
  timeElapsed: number;
  remainingTime: number; // For time attack (20s)
  isFever: boolean;
  feverGauge: number; // 0 to 100
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface HighScoreRecord {
  score: number;
  mode: GameMode;
  date: string;
  accuracy: number;
  maxCombo: number;
}
