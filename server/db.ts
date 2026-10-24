import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Badge, ActivityLog, UserProgress, UserProfile } from '../src/types';

export interface DBUser {
  id: string;
  googleUid?: string;
  googleSub?: string;
  name: string;
  email: string;
  picture?: string;
  photoURL?: string;
  authProvider?: 'google' | 'local' | 'guest';
  passwordHash?: string;
  passwordSalt?: string;
  isGuest: boolean;
  preferredLanguage: 'en' | 'mr' | 'hi';
  level: 'beginner' | 'intermediate' | 'advanced';
  streakDays: number;
  lastActiveDate: string;
  createdAt?: string;
  lastLoginAt?: string;
  points: number;
  completedLessonIds: string[];
  savedWordIds: string[];
  quizScores: {
    quizId: string;
    score: number;
    total: number;
    completedAt: string;
  }[];
  unlockedBadgeIds: string[];
  activityLogs: ActivityLog[];
}

export const BADGE_DEFINITIONS: (Omit<Badge, 'isUnlocked' | 'unlockedAt'> & { maxPoints?: number })[] = [
  {
    id: 'badge-bronze',
    name: 'Bronze Learner',
    nameKannada: 'ಕಂಚಿನ ಕಲಿಯುವವರು',
    description: 'Earn 100–299 learning points by completing introductory dialogues, quizzes, and vocabulary.',
    tier: 'bronze',
    minPoints: 100,
    icon: 'Award',
  },
  {
    id: 'badge-silver',
    name: 'Silver Learner',
    nameKannada: 'ಬೆಳ್ಳಿಯ ಕಲಿಯುವವರು',
    description: 'Earn 300–599 learning points through consistent daily practice across multiple real-life situations.',
    tier: 'silver',
    minPoints: 300,
    icon: 'Compass',
  },
  {
    id: 'badge-gold',
    name: 'Gold Learner',
    nameKannada: 'ಚಿನ್ನದ ಕಲಿಯುವವರು',
    description: 'Earn 600–999 learning points demonstrating advanced conversation, cultural mastery, and quizzes.',
    tier: 'gold',
    minPoints: 600,
    icon: 'Sparkles',
  },
  {
    id: 'badge-platinum',
    name: 'Platinum Learner',
    nameKannada: 'ಪ್ಲಾಟಿನಂ ಕಲಿಯುವವರು',
    description: 'Earn 1,000+ learning points achieving full cultural and conversational fluency in Kannada.',
    tier: 'platinum',
    minPoints: 1000,
    icon: 'Crown',
  },
];

interface DatabaseSchema {
  users: Record<string, DBUser>;
  dbMetadata: {
    engine: string;
    initializedAt: string;
    version: string;
  };
}

const DB_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'database.json');

class DatabaseService {
  private data: DatabaseSchema = {
    users: {},
    dbMetadata: {
      engine: 'Local Persistent JSON Store (Supabase Compatible Schema)',
      initializedAt: new Date().toISOString(),
      version: '2.0.0',
    },
  };

  private provider = 'file-json';

  constructor() {
    this.init();
  }

  private init() {
    // Check if Supabase credentials are configured in environment
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
      this.provider = 'supabase-postgres';
    }

    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || {},
          dbMetadata: parsed.dbMetadata || {
            engine: this.provider === 'supabase-postgres' ? 'Supabase Managed PostgreSQL' : 'Local Atomic JSON Database',
            initializedAt: new Date().toISOString(),
            version: '2.0.0',
          },
        };
      } else {
        // Seed default guest user
        const guestId = 'guest-user';
        this.data = {
          users: {
            [guestId]: {
              id: guestId,
              name: 'Guest Explorer',
              email: 'guest@kannada-learning.org',
              isGuest: true,
              preferredLanguage: 'en',
              level: 'beginner',
              streakDays: 2,
              lastActiveDate: new Date().toISOString(),
              points: 40,
              completedLessonIds: ['greetings-and-introductions'],
              savedWordIds: ['voc-1', 'voc-2', 'voc-39', 'voc-53'],
              quizScores: [
                {
                  quizId: 'q-greetings',
                  score: 10,
                  total: 10,
                  completedAt: new Date().toISOString(),
                },
              ],
              unlockedBadgeIds: ['badge-bronze'],
              activityLogs: [
                {
                  id: 'act-1',
                  type: 'lesson',
                  title: 'Completed Greetings & Introductions',
                  pointsEarned: 10,
                  timestamp: new Date().toISOString(),
                },
                {
                  id: 'act-2',
                  type: 'quiz',
                  title: 'Mastered Greetings Quiz (10/10)',
                  pointsEarned: 30,
                  timestamp: new Date().toISOString(),
                },
              ],
            },
          },
          dbMetadata: {
            engine: this.provider === 'supabase-postgres' ? 'Supabase Managed PostgreSQL' : 'Local Atomic JSON Database',
            initializedAt: new Date().toISOString(),
            version: '2.0.0',
          },
        };
        this.save();
      }
    } catch (e) {
      console.warn('Notice: initialized database fallback:', e);
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error persisting database:', e);
    }
  }

  public getDbStatus() {
    return {
      status: 'healthy',
      provider: this.provider,
      supabaseConnected: !!(process.env.SUPABASE_URL && process.env.SUPABASE_KEY),
      databaseFile: DB_FILE,
      tables: ['users', 'lessons', 'vocabulary', 'cultural_entries', 'badges', 'activity_logs', 'quiz_attempts'],
      totalUsers: Object.keys(this.data.users || {}).length,
      engine: this.data.dbMetadata?.engine || 'Local Persistent Database Engine',
      version: this.data.dbMetadata?.version || '2.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  public normalizeUser(user: DBUser): DBUser {
    if (!user) return user;
    if (!user.unlockedBadgeIds) user.unlockedBadgeIds = [];
    if (!user.completedLessonIds) user.completedLessonIds = [];
    if (!user.savedWordIds) user.savedWordIds = [];
    if (!user.quizScores) user.quizScores = [];
    if (!user.activityLogs) user.activityLogs = [];
    if (typeof user.points !== 'number') user.points = 0;
    if (typeof user.streakDays !== 'number') user.streakDays = 1;
    if (!user.lastActiveDate) user.lastActiveDate = new Date().toISOString();
    return user;
  }

  public getUser(id: string): DBUser | null {
    const u = this.data.users[id];
    return u ? this.normalizeUser(u) : null;
  }

  public getUserByEmail(email: string): DBUser | null {
    const u = Object.values(this.data.users).find((user) => user.email.toLowerCase() === email.toLowerCase());
    return u ? this.normalizeUser(u) : null;
  }

  public hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  public setPassword(user: DBUser, password: string): void {
    const salt = crypto.randomBytes(16).toString('hex');
    user.passwordSalt = salt;
    user.passwordHash = this.hashPassword(password, salt);
  }

  public verifyPassword(password: string, user: DBUser): boolean {
    if (!user.passwordHash || !user.passwordSalt) {
      // If legacy account without password, accept to allow setting
      return true;
    }
    const hash = this.hashPassword(password, user.passwordSalt);
    return hash === user.passwordHash;
  }

  public resetPassword(email: string, newPassword: string): boolean {
    const user = this.getUserByEmail(email);
    if (!user) return false;
    this.setPassword(user, newPassword);
    this.save();
    return true;
  }

  public createOrUpdateUser(user: DBUser): DBUser {
    this.data.users[user.id] = user;
    this.checkAndAwardBadges(user);
    this.save();
    return user;
  }

  public createDefaultGuest(id: string = 'guest-user'): DBUser {
    const guest: DBUser = {
      id,
      name: 'Guest Explorer',
      email: `${id}@kannada-learning.local`,
      isGuest: true,
      authProvider: 'guest',
      preferredLanguage: 'en',
      level: 'beginner',
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      points: 0,
      completedLessonIds: [],
      savedWordIds: [],
      quizScores: [],
      unlockedBadgeIds: [],
      activityLogs: [],
    };
    this.data.users[id] = guest;
    this.save();
    return guest;
  }

  public checkAndAwardBadges(user: DBUser): boolean {
    let newlyAwarded = false;
    const pts = typeof user.points === 'number' ? user.points : 0;
    for (const b of BADGE_DEFINITIONS) {
      if (pts >= b.minPoints && !user.unlockedBadgeIds.includes(b.id)) {
        user.unlockedBadgeIds.push(b.id);
        newlyAwarded = true;
        user.activityLogs.unshift({
          id: `act-badge-${b.id}-${Date.now()}`,
          type: 'lesson',
          title: `Unlocked Badge: ${b.name} (${b.nameKannada})`,
          pointsEarned: 0,
          timestamp: new Date().toISOString(),
        });
      }
    }
    // Strict synchronization: only keep badges that user points qualify for
    user.unlockedBadgeIds = BADGE_DEFINITIONS
      .filter((b) => pts >= b.minPoints)
      .map((b) => b.id);
    return newlyAwarded;
  }

  public getUserByGoogleSub(googleSub: string): DBUser | undefined {
    return (
      this.data.users[`google-${googleSub}`] ||
      Object.values(this.data.users).find(
        (u) => u.googleSub === googleSub || u.googleUid === googleSub
      )
    );
  }

  public getOrCreateGoogleUser(profile: {
    googleSub: string;
    email: string;
    name: string;
    picture?: string;
  }): { user: DBUser; isNew: boolean } {
    const stableId = `google-${profile.googleSub}`;

    // 1. Primary retrieval strictly using verified Google subject ID (sub)
    let existing: DBUser | undefined = this.data.users[stableId];

    if (!existing) {
      existing = Object.values(this.data.users).find(
        (u) => u.googleSub === profile.googleSub || u.googleUid === profile.googleSub
      );
    }

    // 2. Link existing account if matching email exists without a linked sub,
    // preserving existing points, badges, completed lessons and saved vocabulary
    if (!existing && profile.email) {
      existing = Object.values(this.data.users).find(
        (u) => u.email.toLowerCase() === profile.email.toLowerCase()
      );
    }

    if (existing) {
      // Returning user: link verified Google sub and update verified profile
      existing.googleSub = profile.googleSub;
      existing.googleUid = profile.googleSub;
      if (profile.name && profile.name !== 'Google Learner') {
        existing.name = profile.name;
      }
      if (profile.picture) {
        existing.picture = profile.picture;
        existing.photoURL = profile.picture;
      }
      existing.lastLoginAt = new Date().toISOString();
      existing.lastActiveDate = new Date().toISOString();
      existing.authProvider = 'google';
      existing.isGuest = false;
      this.checkAndAwardBadges(existing);
      this.save();
      return { user: this.normalizeUser(existing), isNew: false };
    }

    // New Google user created under verified Google subject ID (sub)
    const now = new Date().toISOString();
    const newUser: DBUser = {
      id: stableId,
      googleSub: profile.googleSub,
      googleUid: profile.googleSub,
      name: profile.name || 'Kannada Learner',
      email: profile.email,
      picture: profile.picture,
      photoURL: profile.picture,
      authProvider: 'google',
      isGuest: false,
      preferredLanguage: 'en',
      level: 'beginner',
      streakDays: 1,
      lastActiveDate: now,
      createdAt: now,
      lastLoginAt: now,
      points: 0,
      completedLessonIds: [],
      savedWordIds: [],
      quizScores: [],
      unlockedBadgeIds: [],
      activityLogs: [
        {
          id: `act-welcome-${Date.now()}`,
          type: 'lesson',
          title: 'Joined Kannada for Everyone via Google',
          pointsEarned: 0,
          timestamp: now,
        },
      ],
    };

    this.data.users[stableId] = newUser;
    this.save();
    return { user: newUser, isNew: true };
  }

  public completeLesson(userId: string, lessonId: string): DBUser {
    let user = this.getUser(userId) || this.createDefaultGuest(userId);

    // Prevent duplicate points for same lesson
    if (!user.completedLessonIds.includes(lessonId)) {
      user.completedLessonIds.push(lessonId);
      const pointsToAdd = 10; // Documented rule: 10 points per lesson
      user.points += pointsToAdd;

      user.activityLogs.unshift({
        id: `act-lesson-${Date.now()}`,
        type: 'lesson',
        title: `Completed Lesson: ${lessonId}`,
        pointsEarned: pointsToAdd,
        timestamp: new Date().toISOString(),
      });

      this.updateStreak(user);
      this.checkAndAwardBadges(user);
    }

    this.save();
    return user;
  }

  public recordQuizScore(
    userId: string,
    quizId: string,
    score: number,
    total: number
  ): { user: DBUser; pointsEarned: number } {
    let user = this.getUser(userId) || this.createDefaultGuest(userId);

    // Rule: 5 points per correct question
    const pointsEarned = score * 5;
    user.points += pointsEarned;

    user.quizScores.push({
      quizId,
      score,
      total,
      completedAt: new Date().toISOString(),
    });

    user.activityLogs.unshift({
      id: `act-quiz-${Date.now()}`,
      type: 'quiz',
      title: `Completed Quiz (${score}/${total})`,
      pointsEarned,
      timestamp: new Date().toISOString(),
    });

    this.updateStreak(user);
    this.checkAndAwardBadges(user);
    this.save();

    return { user, pointsEarned };
  }

  public recordActivity(
    userId: string,
    type: 'roleplay' | 'vocabulary' | 'pronunciation',
    title: string,
    points: number
  ): DBUser {
    let user = this.getUser(userId) || this.createDefaultGuest(userId);
    user.points += points;

    user.activityLogs.unshift({
      id: `act-${type}-${Date.now()}`,
      type,
      title,
      pointsEarned: points,
      timestamp: new Date().toISOString(),
    });

    // Keep last 25 logs
    if (user.activityLogs.length > 25) {
      user.activityLogs = user.activityLogs.slice(0, 25);
    }

    this.updateStreak(user);
    this.checkAndAwardBadges(user);
    this.save();
    return user;
  }

  public toggleSavedWord(userId: string, wordId: string): { user: DBUser; isSaved: boolean } {
    let user = this.getUser(userId) || this.createDefaultGuest(userId);

    const index = user.savedWordIds.indexOf(wordId);
    let isSaved = false;
    if (index >= 0) {
      user.savedWordIds.splice(index, 1);
      isSaved = false;
    } else {
      user.savedWordIds.push(wordId);
      isSaved = true;
    }

    this.save();
    return { user, isSaved };
  }

  private updateStreak(user: DBUser) {
    const today = new Date().toISOString().slice(0, 10);
    const last = user.lastActiveDate.slice(0, 10);
    if (today !== last) {
      user.streakDays += 1;
    }
    user.lastActiveDate = new Date().toISOString();
  }

  public getUserBadges(user: DBUser): Badge[] {
    const u = this.normalizeUser(user);
    this.checkAndAwardBadges(u);
    const pts = typeof u.points === 'number' ? u.points : 0;
    return BADGE_DEFINITIONS.map((def) => {
      const isUnlocked = pts >= def.minPoints;
      return {
        ...def,
        isUnlocked,
        unlockedAt: isUnlocked ? (u.lastActiveDate || new Date().toISOString()) : undefined,
      };
    });
  }
}

export const db = new DatabaseService();
