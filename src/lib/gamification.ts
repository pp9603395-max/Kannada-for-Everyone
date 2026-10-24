/**
 * Shared gamification engine.
 *
 * All functions in this module are pure so they can be unit tested and reused
 * by both the client and the server.
 */

export interface LevelInfo {
  level: number;
  title: string;
  titleKannada: string;
  minPoints: number;
  maxPoints: number;
  nextLevelPoints: number | null;
  pointsToNextLevel: number;
  progressPct: number;
  accent: string;
}

const LEVELS = [
  { level: 1, title: 'Novice Explorer', titleKannada: 'ಆರಂಭಿಕ ಅನ್ವೇಷಕ', minPoints: 0, maxPoints: 99, accent: 'emerald' },
  { level: 2, title: 'Bronze Speaker', titleKannada: 'ಕಂಚಿನ ಮಾತುಗಾರ', minPoints: 100, maxPoints: 249, accent: 'amber' },
  { level: 3, title: 'Everyday Conversationalist', titleKannada: 'ದಿನನಿತ್ಯದ ಸಂಭಾಷಣೆಗಾರ', minPoints: 250, maxPoints: 499, accent: 'orange' },
  { level: 4, title: 'Confident Communicator', titleKannada: 'ಆತ್ಮವಿಶ್ವಾಸದ ಸಂವಹನಕಾರ', minPoints: 500, maxPoints: 899, accent: 'blue' },
  { level: 5, title: 'Fluent Achiever', titleKannada: 'ನಿರರ್ಗಳ ಸಾಧಕ', minPoints: 900, maxPoints: 1499, accent: 'indigo' },
  { level: 6, title: 'Kannada Champion', titleKannada: 'ಕನ್ನಡ ಚಾಂಪಿಯನ್', minPoints: 1500, maxPoints: Infinity, accent: 'purple' },
] as const;

export function getLevelInfo(points: number): LevelInfo {
  const safePoints = Math.max(0, Math.floor(Number(points) || 0));
  const current = LEVELS.find((l) => safePoints >= l.minPoints && safePoints <= l.maxPoints) || LEVELS[LEVELS.length - 1];
  const next = LEVELS.find((l) => l.minPoints > current.minPoints) || null;
  const span = current.maxPoints === Infinity ? Math.max(1, safePoints - current.minPoints + 1) : current.maxPoints - current.minPoints + 1;
  const progressPct = current.maxPoints === Infinity
    ? 100
    : Math.min(100, Math.round(((safePoints - current.minPoints) / span) * 100));

  return {
    level: current.level,
    title: current.title,
    titleKannada: current.titleKannada,
    minPoints: current.minPoints,
    maxPoints: current.maxPoints,
    nextLevelPoints: next ? next.minPoints : null,
    pointsToNextLevel: next ? Math.max(0, next.minPoints - safePoints) : 0,
    progressPct,
    accent: current.accent,
  };
}

export function getDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayKey(): string {
  return getDateKey(new Date());
}

export function getWeekStartKey(date: Date = new Date()): string {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // Monday-based week (0 = Sunday, 1 = Monday, ...)
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return getDateKey(copy);
}

function parseDateKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/** Number of calendar days between two YYYY-MM-DD keys (b - a). */
export function daysBetweenKeys(a: string, b: string): number {
  const first = parseDateKey(a);
  const second = parseDateKey(b);
  if (!first || !second) return 0;
  return Math.round((second.getTime() - first.getTime()) / 86_400_000);
}

/**
 * Computes the next streak value from the last day the learner practiced.
 * Returns `changed: false` when the learner already practiced today.
 */
export function calculateNextStreak(
  lastStreakDate: string | undefined,
  currentStreak: number,
  now: Date = new Date()
): { streak: number; changed: boolean } {
  const safeCurrent = Math.max(1, Math.floor(Number(currentStreak) || 1));
  if (!lastStreakDate) return { streak: 1, changed: true };

  const lastKey = lastStreakDate.slice(0, 10);
  const todayKey = getDateKey(now);

  if (!parseDateKey(lastKey)) return { streak: 1, changed: true };

  const diff = daysBetweenKeys(lastKey, todayKey);
  if (diff <= 0) return { streak: safeCurrent, changed: false };
  if (diff === 1) return { streak: safeCurrent + 1, changed: true };
  return { streak: 1, changed: true };
}

// ---------------------------------------------------------------------------
// Daily quests
// ---------------------------------------------------------------------------

export type QuestMetric =
  | 'lessons'
  | 'quizCorrect'
  | 'words'
  | 'pronunciation'
  | 'roleplay';

export interface DailyQuestDefinition {
  id: string;
  title: string;
  titleKannada: string;
  description: string;
  metric: QuestMetric;
  target: number;
  reward: number;
  icon: 'BookOpen' | 'Zap' | 'Bookmark' | 'Mic' | 'MessageSquare';
}

export const DAILY_QUESTS: DailyQuestDefinition[] = [
  {
    id: 'daily-lesson',
    title: 'Warm-up',
    titleKannada: 'ದಿನದ ಆರಂಭ',
    description: 'Complete 1 lesson in the Dual-Pane Studio',
    metric: 'lessons',
    target: 1,
    reward: 15,
    icon: 'BookOpen',
  },
  {
    id: 'daily-quiz',
    title: 'Sharp Mind',
    titleKannada: 'ಚುರುಕು ಮನಸ್ಸು',
    description: 'Answer 5 quiz questions correctly',
    metric: 'quizCorrect',
    target: 5,
    reward: 10,
    icon: 'Zap',
  },
  {
    id: 'daily-words',
    title: 'Word Collector',
    titleKannada: 'ಪದ ಸಂಗ್ರಾಹಕ',
    description: 'Save 2 new words for revision',
    metric: 'words',
    target: 2,
    reward: 10,
    icon: 'Bookmark',
  },
  {
    id: 'daily-speak',
    title: 'Speak Up',
    titleKannada: 'ಧೈರ್ಯದಿಂದ ಮಾತನಾಡಿ',
    description: 'Finish 1 pronunciation drill',
    metric: 'pronunciation',
    target: 1,
    reward: 10,
    icon: 'Mic',
  },
  {
    id: 'daily-chat',
    title: 'Roleplay Buddy',
    titleKannada: 'ಪಾತ್ರಾಭಿನಯ ಸ್ನೇಹಿತ',
    description: 'Practice one AI roleplay conversation',
    metric: 'roleplay',
    target: 1,
    reward: 10,
    icon: 'MessageSquare',
  },
];

export function getQuestProgress(
  quest: DailyQuestDefinition,
  progress: Record<string, number> | undefined
): { current: number; target: number; pct: number; isComplete: boolean } {
  const current = Math.max(0, Math.floor(Number(progress?.[quest.metric]) || 0));
  return {
    current,
    target: quest.target,
    pct: Math.min(100, Math.round((current / quest.target) * 100)),
    isComplete: current >= quest.target,
  };
}

// ---------------------------------------------------------------------------
// Achievements (beyond the four cumulative point badges)
// ---------------------------------------------------------------------------

export interface AchievementStats {
  points: number;
  lessonsCompleted: number;
  quizzesTaken: number;
  perfectQuizzes: number;
  streakDays: number;
  savedWords: number;
  cultureExplored: number;
  storiesRead: number;
  pronunciationAttempts: number;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  nameKannada: string;
  description: string;
  icon:
    | 'Footprints'
    | 'Compass'
    | 'Crown'
    | 'HelpCircle'
    | 'Zap'
    | 'Target'
    | 'Flame'
    | 'CalendarCheck'
    | 'Bookmark'
    | 'Library'
    | 'Globe'
    | 'Landmark'
    | 'BookOpen'
    | 'Mic'
    | 'Award'
    | 'Star'
    | 'Sparkles';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  target: number;
  getValue: (stats: AchievementStats) => number;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'first-step', name: 'First Step', nameKannada: 'ಮೊದಲ ಹೆಜ್ಜೆ', description: 'Complete your first lesson', icon: 'Footprints', tier: 'bronze', target: 1, getValue: (s) => s.lessonsCompleted },
  { id: 'explorer', name: 'Explorer', nameKannada: 'ಅನ್ವೇಷಕ', description: 'Complete 5 lessons', icon: 'Compass', tier: 'silver', target: 5, getValue: (s) => s.lessonsCompleted },
  { id: 'path-master', name: 'Path Master', nameKannada: 'ಹಾದಿ ದಾರ್ಶನಿಕ', description: 'Complete all 10 lessons', icon: 'Crown', tier: 'platinum', target: 10, getValue: (s) => s.lessonsCompleted },
  { id: 'quiz-rookie', name: 'Quiz Rookie', nameKannada: 'ರಸಪ್ರಶ್ನೆ ಆರಂಭಿಕ', description: 'Take your first quiz', icon: 'HelpCircle', tier: 'bronze', target: 1, getValue: (s) => s.quizzesTaken },
  { id: 'quiz-whiz', name: 'Quiz Whiz', nameKannada: 'ರಸಪ್ರಶ್ನೆ ಪರಿಣಿತ', description: 'Take 5 different quizzes', icon: 'Zap', tier: 'silver', target: 5, getValue: (s) => s.quizzesTaken },
  { id: 'perfect-quiz', name: 'Perfect Score', nameKannada: 'ಪರಿಪೂರ್ಣ ಅಂಕ', description: 'Score 100% on any quiz', icon: 'Target', tier: 'gold', target: 1, getValue: (s) => s.perfectQuizzes },
  { id: 'streak-3', name: 'On a Roll', nameKannada: 'ಮೂರು ದಿನದ ಹುಮ್ಮಸ್ಸು', description: 'Maintain a 3-day streak', icon: 'Flame', tier: 'bronze', target: 3, getValue: (s) => s.streakDays },
  { id: 'streak-7', name: 'Week Warrior', nameKannada: 'ವಾರದ ಯೋಧ', description: 'Maintain a 7-day streak', icon: 'CalendarCheck', tier: 'silver', target: 7, getValue: (s) => s.streakDays },
  { id: 'streak-30', name: 'Unstoppable', nameKannada: 'ನಿಲ್ಲದ ಸಾಧಕ', description: 'Maintain a 30-day streak', icon: 'Star', tier: 'platinum', target: 30, getValue: (s) => s.streakDays },
  { id: 'word-collector', name: 'Word Collector', nameKannada: 'ಪದ ಸಂಗ್ರಾಹಕ', description: 'Save 25 words for revision', icon: 'Bookmark', tier: 'silver', target: 25, getValue: (s) => s.savedWords },
  { id: 'word-library', name: 'Living Dictionary', nameKannada: 'ಜೀವಂತ ನಿಘಂಟು', description: 'Save 75 words for revision', icon: 'Library', tier: 'gold', target: 75, getValue: (s) => s.savedWords },
  { id: 'culture-voyager', name: 'Culture Voyager', nameKannada: 'ಸಂಸ್ಕೃತಿ ಪ್ರಯಾಣಿಕ', description: 'Explore 5 cultural entries', icon: 'Globe', tier: 'bronze', target: 5, getValue: (s) => s.cultureExplored },
  { id: 'culture-ambassador', name: 'Culture Ambassador', nameKannada: 'ಸಂಸ್ಕೃತಿ ರಾಯಭಾರಿ', description: 'Explore 15 cultural entries', icon: 'Landmark', tier: 'silver', target: 15, getValue: (s) => s.cultureExplored },
  { id: 'bookworm', name: 'Bookworm', nameKannada: 'ಪುಸ್ತಕ ಪ್ರೇಮಿ', description: 'Finish all 3 immersion stories', icon: 'BookOpen', tier: 'silver', target: 3, getValue: (s) => s.storiesRead },
  { id: 'pronunciation-pro', name: 'Sound Sleuth', nameKannada: 'ಉಚ್ಚಾರಣಾ ತಜ್ಞ', description: 'Complete 10 pronunciation drills', icon: 'Mic', tier: 'silver', target: 10, getValue: (s) => s.pronunciationAttempts },
  { id: 'centurion', name: 'Centurion', nameKannada: 'ಶತಕ ಸಾಧಕ', description: 'Earn 100 XP', icon: 'Award', tier: 'bronze', target: 100, getValue: (s) => s.points },
  { id: 'rising-star', name: 'Rising Star', nameKannada: 'ಉದಯೋನ್ಮುಖ ತಾರೆ', description: 'Earn 500 XP', icon: 'Star', tier: 'silver', target: 500, getValue: (s) => s.points },
  { id: 'kannada-legend', name: 'Kannada Legend', nameKannada: 'ಕನ್ನಡ ಪುರಾಣ', description: 'Earn 1,500 XP', icon: 'Sparkles', tier: 'platinum', target: 1500, getValue: (s) => s.points },
];

export interface AchievementStatus extends AchievementDefinition {
  value: number;
  progressPct: number;
  isUnlocked: boolean;
}

export function computeAchievements(stats: AchievementStats): AchievementStatus[] {
  return ACHIEVEMENTS.map((achievement) => {
    const value = Math.max(0, achievement.getValue(stats));
    return {
      ...achievement,
      value,
      progressPct: Math.min(100, Math.round((value / achievement.target) * 100)),
      isUnlocked: value >= achievement.target,
    };
  });
}

export function formatRelativeTime(iso: string | undefined): string {
  if (!iso) return 'Just now';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Recently';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 45) return 'Just now';
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Small, dependency-free success chime used for XP and achievement feedback. */
export function playSuccessSound(kind: 'xp' | 'achievement' = 'xp'): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextCtor =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextCtor) return;
    const context = new AudioContextCtor();
    const notes = kind === 'achievement' ? [523.25, 659.25, 783.99, 1046.5] : [660, 880];
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      const start = context.currentTime + index * 0.09;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.08, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.24);
    });
    window.setTimeout(() => {
      context.close().catch(() => undefined);
    }, 900);
  } catch {
    // Audio is a progressive enhancement; never break the lesson for it.
  }
}
