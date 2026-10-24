import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

interface DBUser {
  id: string;
  googleUid?: string;
  googleSub?: string;
  name: string;
  email: string;
  picture?: string;
  photoURL?: string;
  authProvider?: string;
  isGuest: boolean;
  preferredLanguage?: 'en' | 'mr' | 'hi';
  level?: 'beginner' | 'intermediate' | 'advanced';
  streakDays?: number;
  lastActiveDate?: string;
  createdAt?: string;
  lastLoginAt?: string;
  points?: number;
  completedLessonIds?: string[];
  savedWordIds?: string[];
  quizScores?: Array<{
    quizId: string;
    score: number;
    total: number;
    completedAt: string;
  }>;
  unlockedBadgeIds?: string[];
  activityLogs?: Array<{
    id: string;
    type: string;
    title: string;
    pointsEarned: number;
    timestamp: string;
  }>;
}

export async function runMigration() {
  console.log('--- STARTING FIRESTORE MIGRATION ---');
  const dbFile = path.resolve(process.cwd(), '.data/database.json');
  if (!fs.existsSync(dbFile)) {
    console.log('No .data/database.json found, skipping migration.');
    return { migratedCount: 0, skippedCount: 0 };
  }

  const raw = fs.readFileSync(dbFile, 'utf-8');
  const data = JSON.parse(raw);
  const users: Record<string, DBUser> = data.users || {};

  let migratedCount = 0;
  let skippedCount = 0;
  const userEntries = Object.entries(users);
  console.log(`Found ${userEntries.length} total user entries in database.json`);

  for (const [id, u] of userEntries) {
    // Only migrate registered accounts or identifiable accounts with persistent data
    // Skip anonymous guest temporary placeholders if they have no points
    if (u.isGuest && (!u.points || u.points === 0) && (!u.completedLessonIds || u.completedLessonIds.length === 0)) {
      skippedCount++;
      continue;
    }

    const targetUid = u.googleSub || u.googleUid || u.id;
    console.log(`Migrating user [${id}] -> Firestore UID: [${targetUid}]`);

    const now = new Date().toISOString();

    // 1. users/{uid}
    const userRef = doc(db, 'users', targetUid);
    const existingUser = await getDoc(userRef);
    if (!existingUser.exists()) {
      await setDoc(userRef, {
        uid: targetUid,
        displayName: u.name || 'Kannada Learner',
        email: u.email || '',
        photoURL: u.picture || u.photoURL || '',
        authProvider: u.authProvider || (u.isGuest ? 'guest' : 'password'),
        createdAt: u.createdAt || now,
        lastLoginAt: u.lastLoginAt || now,
        totalPoints: typeof u.points === 'number' ? u.points : 0,
        preferredLanguage: u.preferredLanguage || 'en',
        level: u.level || 'beginner',
      });
    }

    // 2. userProgress/{uid}
    const progressRef = doc(db, 'userProgress', targetUid);
    const existingProgress = await getDoc(progressRef);
    if (!existingProgress.exists()) {
      await setDoc(progressRef, {
        userId: targetUid,
        completedLessonIds: u.completedLessonIds || [],
        quizScores: u.quizScores || [],
        streakDays: u.streakDays || 1,
        lastActiveDate: u.lastActiveDate || now,
        updatedAt: now,
      });
    }

    // 3. savedVocabulary/{uid}
    const vocabRef = doc(db, 'savedVocabulary', targetUid);
    const existingVocab = await getDoc(vocabRef);
    if (!existingVocab.exists()) {
      await setDoc(vocabRef, {
        userId: targetUid,
        savedWordIds: u.savedWordIds || [],
        updatedAt: now,
      });
    }

    // 4. userBadges/{uid}
    const badgesRef = doc(db, 'userBadges', targetUid);
    const existingBadges = await getDoc(badgesRef);
    if (!existingBadges.exists()) {
      const badgeIds = u.unlockedBadgeIds || [];
      await setDoc(badgesRef, {
        userId: targetUid,
        unlockedBadgeIds: badgeIds,
        badges: badgeIds.map((bid) => ({
          badgeId: bid,
          unlockedAt: u.lastActiveDate || now,
        })),
        updatedAt: now,
      });
    }

    // 5. pointTransactions
    if (u.activityLogs && u.activityLogs.length > 0) {
      for (const log of u.activityLogs) {
        if (log.pointsEarned > 0) {
          const txRef = doc(db, 'pointTransactions', `tx_${targetUid}_${log.id}`);
          const existingTx = await getDoc(txRef);
          if (!existingTx.exists()) {
            await setDoc(txRef, {
              id: `tx_${targetUid}_${log.id}`,
              userId: targetUid,
              activityId: log.id,
              type: log.type || 'lesson',
              pointsEarned: log.pointsEarned,
              title: log.title || 'Learning Activity',
              timestamp: log.timestamp || now,
            });
          }
        }
      }
    }

    migratedCount++;
  }

  console.log(`--- MIGRATION COMPLETE: Migrated ${migratedCount} users, Skipped ${skippedCount} empty guests ---`);
  return { migratedCount, skippedCount };
}

// Run if executed directly
if (process.argv[1]?.endsWith('migrate-to-firestore.ts')) {
  runMigration()
    .then((res) => {
      console.log('Result:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration error:', err);
      process.exit(1);
    });
}
