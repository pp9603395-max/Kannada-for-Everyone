import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  adminAuth,
  serverDb,
  firebaseConfig,
  doc,
  getDoc,
  setDoc,
  requireFirebaseAuth,
  optionalFirebaseAuth,
  migrateLegacyUserDataIfPresent,
  AuthenticatedRequest,
} from './server/firebaseAdmin.ts';
import { aiService } from './server/ai.ts';
import {
  LESSONS,
  VOCABULARY_LIST,
  ROLEPLAY_SCENARIOS,
  CULTURAL_ITEMS,
  DAILY_PHRASE,
} from './src/data/kannadaData.ts';
import { calculateNextStreak, getTodayKey } from './src/lib/gamification.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'microphone=(self), camera=()');
  next();
});
app.use(express.json({ limit: '1mb' }));

// Lightweight in-memory rate limiter for public/AI endpoints. For multi-instance
// production deployments, replace with Redis or an API gateway limiter.
const rateBuckets = new Map<string, { count: number; resetAt: number }>();
function allowRequest(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
}
// Clean stale buckets periodically so the map cannot grow without bound.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateBuckets.entries()) {
    if (bucket.resetAt <= now) rateBuckets.delete(key);
  }
}, 5 * 60_000).unref?.();

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'kannada-for-everyone',
    timestamp: new Date().toISOString(),
  });
});

// Standard cumulative badge tiers for server synchronization
const BADGE_TIERS = [
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

function calculateBadges(points: number) {
  return BADGE_TIERS.map((tier) => ({
    ...tier,
    isUnlocked: points >= tier.minPoints,
  }));
}

// --- DATABASE HEALTH & DIAGNOSTICS ---
app.get('/api/health/db', async (_req, res) => {
  try {
    const healthRef = doc(serverDb, '_health', 'connectivity-test');
    const snap = await getDoc(healthRef);
    res.json({
      status: 'ok',
      connected: snap.exists(),
      firestoreDatabaseId: firebaseConfig.firestoreDatabaseId,
      projectId: firebaseConfig.projectId,
      authProvider: 'Firebase Authentication (Admin SDK Token Verification)',
      collections: ['users', 'userProgress', 'savedVocabulary', 'pointTransactions', 'userBadges'],
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      connected: false,
      error: err.message,
    });
  }
});

// --- PUBLIC CURRICULUM ROUTES ---

// 1. Lessons (10 Scenarios)
app.get('/api/lessons', (_req, res) => {
  res.json({
    success: true,
    total: LESSONS.length,
    data: LESSONS,
  });
});

app.get('/api/lessons/:id', (req, res) => {
  const lesson = LESSONS.find((l) => l.id === req.params.id);
  if (!lesson) {
    return res.status(404).json({ success: false, error: 'Lesson not found' });
  }
  res.json({ success: true, data: lesson });
});

// 2. Vocabulary (165+ items, search, filters, pagination)
app.get('/api/vocabulary', (req, res) => {
  const { category, search, level, limit, offset } = req.query;
  let items = [...VOCABULARY_LIST];

  if (category && category !== 'All') {
    items = items.filter((v) => v.category.toLowerCase() === String(category).toLowerCase());
  }

  if (level) {
    items = items.filter((v) => v.level === level);
  }

  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(
      (v) =>
        v.kannada.includes(q) ||
        v.transliteration.toLowerCase().includes(q) ||
        v.meanings.en.toLowerCase().includes(q) ||
        v.meanings.mr.toLowerCase().includes(q) ||
        v.meanings.hi.toLowerCase().includes(q)
    );
  }

  const totalCount = items.length;

  if (offset || limit) {
    const off = parseInt(String(offset || '0'), 10);
    const lim = parseInt(String(limit || '50'), 10);
    items = items.slice(off, off + lim);
  }

  res.json({
    success: true,
    total: totalCount,
    returned: items.length,
    data: items,
  });
});

app.get('/api/vocabulary/:id', (req, res) => {
  const item = VOCABULARY_LIST.find((v) => v.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Vocabulary not found' });
  }
  res.json({ success: true, data: item });
});

// 3. Conversation Roleplay Scenarios
app.get('/api/conversations', (_req, res) => {
  res.json({ success: true, data: ROLEPLAY_SCENARIOS });
});

// 4. Cultural Catalogue (32+ entries)
app.get('/api/culture', (req, res) => {
  const { category, search, unescoOnly } = req.query;
  let items = [...CULTURAL_ITEMS];

  if (unescoOnly === 'true') {
    items = items.filter((item) => item.isUNESCO);
  } else if (category && category !== 'all') {
    items = items.filter((item) => item.category === category);
  }

  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(
      (item) =>
        item.titleEnglish.toLowerCase().includes(q) ||
        item.titleKannada.includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.historicalSignificance.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: items.length,
    data: items,
  });
});

// 5. Daily Phrase
app.get('/api/daily-phrase', (_req, res) => {
  res.json({ success: true, data: DAILY_PHRASE });
});

// --- AUTHENTICATED USER ROUTES (VERIFIED VIA FIREBASE ADMIN SDK) ---

// 6. User Progress, Badges, Points (Reads from Cloud Firestore)
app.get('/api/progress', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const uid = req.user!.uid;
    await migrateLegacyUserDataIfPresent(uid, req.user?.email);

    const [userSnap, progSnap, vocabSnap] = await Promise.all([
      getDoc(doc(serverDb, 'users', uid)),
      getDoc(doc(serverDb, 'userProgress', uid)),
      getDoc(doc(serverDb, 'savedVocabulary', uid)),
    ]);

    const userData = userSnap.data() || {};
    const progData = progSnap.data() || {};
    const vocabData = vocabSnap.data() || {};
    const points = userData.totalPoints || 0;

    res.json({
      success: true,
      data: {
        userId: uid,
        name: userData.displayName || req.user?.displayName || 'Kannada Learner',
        email: userData.email || req.user?.email || '',
        picture: userData.photoURL || req.user?.photoURL || '',
        isGuest: false,
        level: userData.level || 'beginner',
        preferredLanguage: userData.preferredLanguage || 'en',
        streakDays: progData.streakDays || 1,
        points,
        completedLessons: progData.completedLessonIds || [],
        savedWords: vocabData.savedWordIds || [],
        quizScores: progData.quizScores || [],
        badges: calculateBadges(points),
        lastActiveDate: progData.lastActiveDate || new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Error fetching user progress from Firestore:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch user progress from Firestore' });
  }
});

// 7. Complete Lesson in Cloud Firestore
app.post('/api/progress/complete', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { lessonId } = req.body;

    if (!lessonId || typeof lessonId !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid lessonId string is required' });
    }

    const validLesson = LESSONS.some((l) => l.id === lessonId);
    if (!validLesson) {
      return res.status(400).json({ success: false, error: 'Lesson not found in curriculum' });
    }

    const xpReward = Math.min(100, Math.max(0, Number(req.body.xpReward) || 10));
    const now = new Date().toISOString();
    const today = getTodayKey();

    const result = await serverDb.runTransaction(async (transaction) => {
      const progRef = doc(serverDb, 'userProgress', uid);
      const userRef = doc(serverDb, 'users', uid);
      const progSnap = await transaction.get(progRef);
      const userSnap = await transaction.get(userRef);

      const progData = progSnap.data() || { completedLessonIds: [] };
      const userData = userSnap.data() || {};
      const completedList: string[] = progData.completedLessonIds || [];
      const isNewCompletion = !completedList.includes(lessonId);
      const pointsAwarded = isNewCompletion ? xpReward : 0;
      const currentPoints = Number(userData.totalPoints) || 0;
      const newPoints = currentPoints + pointsAwarded;
      const epoch = Number(userData.pointsEpoch) || 0;
      const { streak } = calculateNextStreak(
        progData.lastStreakDate || progData.lastActiveDate,
        progData.streakDays || 1
      );

      if (isNewCompletion) completedList.push(lessonId);

      transaction.set(
        progRef,
        {
          userId: uid,
          completedLessonIds: completedList,
          streakDays: streak,
          lastStreakDate: today,
          lastActiveDate: now,
          updatedAt: now,
        },
        { merge: true }
      );

      if (isNewCompletion) {
        transaction.set(
          userRef,
          { totalPoints: newPoints, lastLoginAt: now, updatedAt: now },
          { merge: true }
        );
        transaction.set(
          doc(serverDb, 'pointTransactions', `tx_${uid}_e${epoch}_lesson_${lessonId}`),
          {
            userId: uid,
            activityId: lessonId,
            type: 'lesson',
            pointsEarned: pointsAwarded,
            title: `Completed lesson: ${lessonId}`,
            timestamp: now,
          }
        );
      }

      return {
        completedLessons: completedList,
        points: newPoints,
        pointsAwarded,
        streakDays: streak,
        badges: calculateBadges(newPoints),
      };
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Error completing lesson in Firestore:', err);
    res.status(500).json({ success: false, error: 'Failed to record completed lesson' });
  }
});

// 8. Quiz Submission in Cloud Firestore (XP calculated strictly server-side)
app.post('/api/quiz/submit', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { quizId, score, total } = req.body;

    if (!quizId || typeof score !== 'number' || typeof total !== 'number' || total <= 0 || score < 0 || score > total) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quiz submission parameters. score must be between 0 and total.',
      });
    }

    const now = new Date().toISOString();
    const today = getTodayKey();

    const result = await serverDb.runTransaction(async (transaction) => {
      const userRef = doc(serverDb, 'users', uid);
      const progRef = doc(serverDb, 'userProgress', uid);
      const userSnap = await transaction.get(userRef);
      const progSnap = await transaction.get(progRef);

      const userData = userSnap.data() || {};
      const progData = progSnap.data() || { quizScores: [] };
      const currentPoints = Number(userData.totalPoints) || 0;
      const epoch = Number(userData.pointsEpoch) || 0;
      const existingScores: any[] = progData.quizScores || [];
      const existingIdx = existingScores.findIndex((s) => s.quizId === quizId);
      const previousBest =
        existingIdx >= 0
          ? Number(existingScores[existingIdx].bestScore ?? existingScores[existingIdx].score) || 0
          : 0;
      const bestScore = Math.max(previousBest, score);
      const deltaCorrect = Math.max(0, bestScore - previousBest);
      // 5 XP per newly earned correct answer only — replaying the same score
      // cannot farm points, but improving a personal best still rewards effort.
      const pointsEarned = deltaCorrect * 5;
      const newPoints = currentPoints + pointsEarned;

      const scoreRecord = { quizId, score, bestScore, total, completedAt: now };
      if (existingIdx >= 0) existingScores[existingIdx] = scoreRecord;
      else existingScores.push(scoreRecord);

      const { streak } = calculateNextStreak(
        progData.lastStreakDate || progData.lastActiveDate,
        progData.streakDays || 1
      );

      transaction.set(
        progRef,
        {
          userId: uid,
          quizScores: existingScores,
          streakDays: streak,
          lastStreakDate: today,
          lastActiveDate: now,
          updatedAt: now,
        },
        { merge: true }
      );

      if (pointsEarned > 0) {
        transaction.set(
          userRef,
          { totalPoints: newPoints, lastLoginAt: now, updatedAt: now },
          { merge: true }
        );
        transaction.set(
          doc(serverDb, 'pointTransactions', `tx_${uid}_e${epoch}_quiz_${quizId}_best_${bestScore}`),
          {
            userId: uid,
            activityId: quizId,
            type: 'quiz',
            pointsEarned,
            title: `Quiz best score: ${bestScore}/${total}`,
            timestamp: now,
          }
        );
      }

      return {
        score,
        total,
        bestScore,
        pointsEarned,
        totalPoints: newPoints,
        streakDays: streak,
        badges: calculateBadges(newPoints),
      };
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Error recording quiz submission in Firestore:', err);
    res.status(500).json({ success: false, error: 'Failed to record quiz submission' });
  }
});

// 9. Saved Vocabulary (Reads from Cloud Firestore)
app.get('/api/vocabulary/saved', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const uid = req.user!.uid;
    const vocabSnap = await getDoc(doc(serverDb, 'savedVocabulary', uid));
    const savedIds: string[] = vocabSnap.data()?.savedWordIds || [];
    const savedItems = VOCABULARY_LIST.filter((v) => savedIds.includes(v.id));
    res.json({ success: true, data: savedItems });
  } catch (err: any) {
    console.error('Error fetching saved vocabulary from Firestore:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch saved vocabulary' });
  }
});

app.post('/api/vocabulary/saved', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { wordId } = req.body;

    if (!wordId || typeof wordId !== 'string') {
      return res.status(400).json({ success: false, error: 'wordId is required' });
    }

    const validWord = VOCABULARY_LIST.some((v) => v.id === wordId);
    if (!validWord) {
      return res.status(400).json({ success: false, error: 'Word not found in vocabulary catalogue' });
    }

    const vocabRef = doc(serverDb, 'savedVocabulary', uid);
    const vocabSnap = await getDoc(vocabRef);
    const vocabData = vocabSnap.data() || { savedWordIds: [] };
    let savedWords: string[] = vocabData.savedWordIds || [];

    const isSaved = savedWords.includes(wordId);
    const now = new Date().toISOString();

    if (isSaved) {
      savedWords = savedWords.filter((w) => w !== wordId);
    } else {
      savedWords.push(wordId);
      const userRef = doc(serverDb, 'users', uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() || {};
      const currentPoints = Number(userData.totalPoints) || 0;
      const epoch = Number(userData.pointsEpoch) || 0;
      const awardRef = doc(serverDb, 'pointTransactions', `tx_${uid}_e${epoch}_voc_${wordId}`);
      const awardSnap = await getDoc(awardRef);

      if (!awardSnap.exists()) {
        await Promise.all([
          setDoc(userRef, { totalPoints: currentPoints + 5, updatedAt: now }, { merge: true }),
          setDoc(awardRef, {
            userId: uid,
            activityId: `voc_${wordId}`,
            type: 'vocabulary',
            pointsEarned: 5,
            title: 'Saved Kannada vocabulary',
            timestamp: now,
          }),
        ]);
      }
    }

    await setDoc(vocabRef, { userId: uid, savedWordIds: savedWords, updatedAt: now }, { merge: true });

    res.json({
      success: true,
      data: {
        isSaved: !isSaved,
        savedWordIds: savedWords,
      },
    });
  } catch (err: any) {
    console.error('Error toggling saved vocabulary in Firestore:', err);
    res.status(500).json({ success: false, error: 'Failed to update saved vocabulary' });
  }
});

// 10. Record Learning Activity (XP capped server-side at 5 XP, prevents tampering)
app.post('/api/activity/record', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { type, title } = req.body;

    const allowedTypes = ['roleplay', 'vocabulary', 'pronunciation'];
    if (!type || !allowedTypes.includes(type) || !title) {
      return res.status(400).json({
        success: false,
        error: `Valid type (${allowedTypes.join(', ')}) and title are required`,
      });
    }

    // Points are capped at 5 XP per activity type per day. A deterministic
    // transaction ID makes repeated calls idempotent instead of farmable.
    const pointsToAward = 5;
    const now = new Date().toISOString();
    const today = getTodayKey();

    const userRef = doc(serverDb, 'users', uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() || {};
    const currentPoints = Number(userData.totalPoints) || 0;
    const epoch = Number(userData.pointsEpoch) || 0;
    const awardRef = doc(serverDb, 'pointTransactions', `tx_${uid}_e${epoch}_act_${type}_${today}`);
    const awardSnap = await getDoc(awardRef);
    const awarded = !awardSnap.exists();
    const newPoints = awarded ? currentPoints + pointsToAward : currentPoints;

    if (awarded) {
      await Promise.all([
        setDoc(userRef, { totalPoints: newPoints, lastLoginAt: now, updatedAt: now }, { merge: true }),
        setDoc(awardRef, {
          userId: uid,
          activityId: `act_${type}_${today}`,
          type,
          title: String(title).substring(0, 100),
          pointsEarned: pointsToAward,
          timestamp: now,
        }),
      ]);
    }

    res.json({
      success: true,
      data: {
        points: newPoints,
        pointsEarned: awarded ? pointsToAward : 0,
        badges: calculateBadges(newPoints),
      },
    });
  } catch (err: any) {
    console.error('Error recording learning activity:', err);
    res.status(500).json({ success: false, error: 'Failed to record activity' });
  }
});

// 11. AI Roleplay & Bilingual Assistant
app.post('/api/ai/chat', optionalFirebaseAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const rateKey = req.user?.uid || req.ip || 'anonymous';
    if (!allowRequest(`ai:${rateKey}`, 20, 60_000)) {
      return res.status(429).json({
        success: false,
        error: 'Too many AI messages. Please wait a minute before continuing the roleplay.',
      });
    }

    const { scenarioContext, history, message, preferredLanguage } = req.body;
    if (!message || typeof message !== 'string' || message.length > 1000) {
      return res.status(400).json({ success: false, error: 'message is required (max 1000 characters)' });
    }

    const reply = await aiService.chatRoleplay(
      scenarioContext || 'Kannada everyday conversation',
      Array.isArray(history) ? history.slice(-12) : [],
      message,
      preferredLanguage || 'en'
    );

    // XP is awarded once per scenario per day by the client's dedicated
    // recordRoleplayMilestoneInFirestore call. Chat turns themselves never
    // award points, which prevents unlimited message farming.
    res.json({ success: true, data: reply });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal AI error' });
  }
});

// 12. Authenticated Profile Endpoint
app.get('/api/auth/me', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const uid = req.user!.uid;
    await migrateLegacyUserDataIfPresent(uid, req.user?.email);

    const userDoc = await getDoc(doc(serverDb, 'users', uid));
    const progDoc = await getDoc(doc(serverDb, 'userProgress', uid));
    const vocabDoc = await getDoc(doc(serverDb, 'savedVocabulary', uid));

    const userData = userDoc.data() || {};
    const progData = progDoc.data() || {};
    const vocabData = vocabDoc.data() || {};
    const points = userData.totalPoints || 0;

    const profile = {
      id: uid,
      name: userData.displayName || req.user?.displayName || 'Kannada Learner',
      email: userData.email || req.user?.email || '',
      picture: userData.photoURL || req.user?.photoURL || '',
      authProvider: userData.authProvider || req.user?.authProvider || 'password',
      isGuest: Boolean(userData.isGuest) || Boolean(req.user?.isGuest),
      preferredLanguage: userData.preferredLanguage || 'en',
      level: userData.level || 'beginner',
      learningGoal: userData.learningGoal || 'conversation',
      dailyStudyTarget: userData.dailyStudyTarget || 10,
      onboardingCompleted: userData.onboardingCompleted !== false,
      streakDays: progData.streakDays || 1,
      lastStreakDate: progData.lastStreakDate || null,
      points,
      totalPoints: points,
      pointsEpoch: userData.pointsEpoch || 0,
      completedLessonIds: progData.completedLessonIds || [],
      savedWordIds: vocabData.savedWordIds || [],
      quizScores: progData.quizScores || [],
      badges: calculateBadges(points),
    };

    res.json({ success: true, data: { user: profile, badges: profile.badges } });
  } catch (err: any) {
    console.error('Error fetching auth user profile:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve authenticated user profile' });
  }
});

// 13. Legacy Migration Trigger
app.post('/api/auth/migrate', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const uid = req.user!.uid;
    const migrated = await migrateLegacyUserDataIfPresent(uid, req.user?.email);
    res.json({ success: true, migrated, uid });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.json({ success: true, message: 'Signed out successfully' });
});

// --- VITE MIDDLEWARE / STATIC FILES ---
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(
      express.static(distDir, {
        setHeaders(res, filePath) {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      })
    );
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kannada for Everyone server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
