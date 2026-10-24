import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  browserLocalPersistence,
  setPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDocFromServer,
  runTransaction,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  UserProfile,
  Badge,
  BadgeTier,
  ActivityLog,
  ActivityType,
  AuthProvider,
  ExplanationLanguage,
  LearningGoal,
  DailyStudyTarget,
  VocabMasteryStatus,
} from '../types';
import {
  DAILY_QUESTS,
  QuestMetric,
  calculateNextStreak,
  getLevelInfo,
  getTodayKey,
  getWeekStartKey,
} from './gamification';

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Must pass firestoreDatabaseId according to Firebase integration skill
export const firestoreDb = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

// Initialize Firebase Authentication with browser local persistence
export const auth = getAuth(app);
try {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Firebase persistence warning:', err);
  });
} catch (e) {
  console.warn('Set persistence failed:', e);
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Test Firestore Connection on boot (as required by Firebase skill)
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice. Verify connection and rules.');
    }
    return false;
  }
}
testFirestoreConnection();

// Standard cumulative badge definitions
export const BADGE_TIERS: Array<{
  id: string;
  name: string;
  nameKannada: string;
  description: string;
  tier: BadgeTier;
  minPoints: number;
  icon: string;
}> = [
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

// Helper to derive badges from points cumulatively
export function calculateCumulativeBadges(points: number, unlockedAtMap: Record<string, string> = {}): Badge[] {
  return BADGE_TIERS.map((tier) => {
    const isUnlocked = points >= tier.minPoints;
    return {
      id: tier.id,
      name: tier.name,
      nameKannada: tier.nameKannada,
      description: tier.description,
      tier: tier.tier,
      minPoints: tier.minPoints,
      icon: tier.icon,
      isUnlocked,
      unlockedAt: isUnlocked ? (unlockedAtMap[tier.id] || new Date().toISOString()) : undefined,
    };
  });
}

// ---------------------------------------------------------------------------
// AUTHENTICATION METHODS
// ---------------------------------------------------------------------------

function authProviderForUser(fbUser: FirebaseUser): AuthProvider {
  if (fbUser.isAnonymous) return 'guest';
  const providerIds = fbUser.providerData.map((p) => p.providerId);
  if (providerIds.includes('google.com')) return 'google';
  if (providerIds.includes('password')) return 'password';
  return 'local';
}

function friendlyDisplayName(fbUser: FirebaseUser): string {
  if (fbUser.isAnonymous) return 'Guest Explorer';
  return fbUser.displayName || fbUser.email?.split('@')[0] || 'Kannada Learner';
}

export function getFriendlyAuthError(error: any): string {
  const code = String(error?.code || '');
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try signing in instead, or use “Forgot password”.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Your password is too weak. Use at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a minute and try again.';
    case 'auth/operation-not-allowed':
    case 'auth/admin-restricted-operation':
      return 'This sign-in method is disabled. In Firebase Console → Authentication → Sign-in method, enable Anonymous (guest), Email/Password, and Google as needed.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection and try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Authentication → Settings → Authorized domains.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'The sign-in popup was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Please allow popups or use redirect sign-in.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
}

export async function signInWithFirebaseGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      console.info('Google Sign-In popup closed by user before completing authentication.');
      return null;
    }

    if (err.code === 'auth/popup-blocked') {
      try {
        console.warn('Popup blocked, attempting signInWithRedirect fallback...');
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectErr: any) {
        console.warn('Redirect fallback error:', redirectErr);
        const error = new Error(
          'Google Sign-In popup was blocked by your browser. Please allow popups or use Redirect Sign-In.'
        );
        (error as any).code = 'auth/popup-blocked';
        throw error;
      }
    }

    if (err.code === 'auth/unauthorized-domain') {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
      const error = new Error(
        `Domain "${hostname}" is not authorized in Firebase. Add it to Authorized Domains in Firebase Console > Authentication > Settings.`
      );
      (error as any).code = 'auth/unauthorized-domain';
      throw error;
    }

    if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
      const error = new Error(
        'Google Sign-In provider is not enabled in Firebase project. Enable Google in Firebase Console > Authentication > Sign-in method.'
      );
      (error as any).code = err.code;
      throw error;
    }

    if (err.code === 'auth/network-request-failed') {
      const error = new Error('Network error. Please check your internet connection and try again.');
      (error as any).code = 'auth/network-request-failed';
      throw error;
    }

    console.warn('Firebase signInWithPopup notice:', err.code, err.message);
    throw new Error(getFriendlyAuthError(err));
  }
}

export async function signInWithFirebaseGoogleRedirect(): Promise<void> {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (err: any) {
    throw new Error(getFriendlyAuthError(err));
  }
}

export async function checkFirebaseRedirectResult(): Promise<FirebaseUser | null> {
  try {
    const res = await getRedirectResult(auth);
    return res ? res.user : null;
  } catch (err: any) {
    console.warn('Firebase getRedirectResult error:', err);
    return null;
  }
}

export async function signUpWithFirebaseEmail(input: {
  name: string;
  email: string;
  password: string;
  preferredLanguage: ExplanationLanguage;
  level: 'beginner' | 'intermediate' | 'advanced';
}): Promise<{ profile: UserProfile; fbUser: FirebaseUser }> {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      input.email.trim().toLowerCase(),
      input.password
    );
    if (input.name.trim()) {
      await updateProfile(credential.user, { displayName: input.name.trim() });
    }
    const { profile } = await syncFirebaseUserProfile(credential.user);
    await saveUserPreferencesInFirestore(credential.user.uid, {
      preferredLanguage: input.preferredLanguage,
      level: input.level,
      onboardingCompleted: false,
    });
    return { profile: { ...profile, name: input.name.trim() || profile.name }, fbUser: credential.user };
  } catch (err: any) {
    throw new Error(getFriendlyAuthError(err));
  }
}

export async function signInWithFirebaseEmail(
  email: string,
  password: string
): Promise<{ profile: UserProfile; fbUser: FirebaseUser }> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    const { profile } = await syncFirebaseUserProfile(credential.user);
    return { profile, fbUser: credential.user };
  } catch (err: any) {
    throw new Error(getFriendlyAuthError(err));
  }
}

export async function sendFirebasePasswordReset(email: string): Promise<string> {
  try {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    return 'Password reset email sent. Check your inbox (and spam folder) for the secure Firebase link.';
  } catch (err: any) {
    throw new Error(getFriendlyAuthError(err));
  }
}

export async function signInAsFirebaseGuest(): Promise<{ profile: UserProfile; fbUser: FirebaseUser }> {
  try {
    const credential = await signInAnonymously(auth);
    const { profile } = await syncFirebaseUserProfile(credential.user);
    return { profile, fbUser: credential.user };
  } catch (err: any) {
    if (err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed') {
      throw new Error(
        'Guest sign-in is disabled. Enable the Anonymous provider in Firebase Console → Authentication → Sign-in method, then try again.'
      );
    }
    throw new Error(getFriendlyAuthError(err));
  }
}

export async function signOutFirebase(): Promise<void> {
  await signOut(auth);
}

// ---------------------------------------------------------------------------
// FIRESTORE USER PROFILE, PROGRESS, BADGES, AND TRANSACTIONS
// ---------------------------------------------------------------------------

export interface FirestoreUserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  avatar?: string;
  authProvider: AuthProvider;
  isGuest?: boolean;
  createdAt: string;
  lastLoginAt: string;
  totalPoints: number;
  pointsEpoch?: number;
  preferredLanguage?: ExplanationLanguage;
  level?: 'beginner' | 'intermediate' | 'advanced';
  learningGoal?: LearningGoal;
  dailyStudyTarget?: DailyStudyTarget;
  onboardingCompleted?: boolean;
  lastLessonId?: string;
  dailyMinutesToday?: number;
  dailyMinutesDate?: string;
  dailyQuestDate?: string;
  dailyQuestProgress?: Record<string, number>;
  claimedQuestIds?: string[];
}

export interface FirestoreProgressData {
  userId: string;
  completedLessonIds: string[];
  quizScores: Array<{
    quizId: string;
    score: number;
    total: number;
    bestScore?: number;
    completedAt: string;
  }>;
  streakDays: number;
  lastActiveDate: string;
  lastStreakDate?: string;
  exploredCultureIds?: string[];
  readingCompletedIds?: string[];
  pronunciationAttempts?: number;
  updatedAt: string;
}

export interface FirestoreSavedVocabData {
  userId: string;
  savedWordIds: string[];
  vocabStatus?: Record<string, VocabMasteryStatus>;
  updatedAt: string;
}

export interface FirestoreUserBadgesData {
  userId: string;
  unlockedBadgeIds: string[];
  badges: Array<{
    badgeId: string;
    unlockedAt: string;
  }>;
  updatedAt: string;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL?: string;
  avatar?: string;
  totalPoints: number;
  weeklyPoints: number;
  weekKey?: string;
  level: number;
  updatedAt: string;
}

async function updateLeaderboardEntry(
  uid: string,
  displayName: string,
  photoURL: string | undefined,
  avatar: string | undefined,
  totalPoints: number,
  deltaPoints: number
): Promise<void> {
  try {
    const ref = doc(firestoreDb, 'leaderboard', uid);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? (snap.data() as LeaderboardEntry) : null;
    const weekKey = getWeekStartKey();
    const weeklyPoints =
      (existing?.weekKey === weekKey ? Number(existing.weeklyPoints) || 0 : 0) + deltaPoints;

    await setDoc(
      ref,
      {
        uid,
        displayName: displayName || 'Kannada Learner',
        photoURL: photoURL || '',
        avatar: avatar || '🎓',
        totalPoints,
        weeklyPoints,
        weekKey,
        level: getLevelInfo(totalPoints).level,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    // Leaderboard is a progressive enhancement: a rules/index issue must not
    // block lessons or quizzes.
    console.warn('Leaderboard update note:', err);
  }
}

// Create or retrieve Firestore user document on sign in
export async function syncFirebaseUserProfile(fbUser: FirebaseUser): Promise<{
  profile: UserProfile;
  isNew: boolean;
}> {
  const userRef = doc(firestoreDb, 'users', fbUser.uid);
  const progressRef = doc(firestoreDb, 'userProgress', fbUser.uid);
  const vocabRef = doc(firestoreDb, 'savedVocabulary', fbUser.uid);
  const badgesRef = doc(firestoreDb, 'userBadges', fbUser.uid);

  const userSnap = await getDoc(userRef);
  const now = new Date().toISOString();
  const isNew = !userSnap.exists();
  const existing = userSnap.exists() ? (userSnap.data() as FirestoreUserData) : null;
  const provider = authProviderForUser(fbUser);

  const displayName =
    fbUser.displayName ||
    (fbUser.isAnonymous ? existing?.displayName || 'Guest Explorer' : '') ||
    existing?.displayName ||
    friendlyDisplayName(fbUser);
  const email = fbUser.email || existing?.email || '';
  const photoURL = fbUser.photoURL || existing?.photoURL || '';

  const userData: FirestoreUserData = {
    uid: fbUser.uid,
    displayName,
    email,
    photoURL,
    avatar: existing?.avatar || '🎓',
    authProvider: provider,
    isGuest: fbUser.isAnonymous,
    createdAt: existing?.createdAt || now,
    lastLoginAt: now,
    totalPoints: existing?.totalPoints || 0,
    pointsEpoch: existing?.pointsEpoch || 0,
    preferredLanguage: existing?.preferredLanguage || 'en',
    level: existing?.level || 'beginner',
    learningGoal: existing?.learningGoal || 'conversation',
    dailyStudyTarget: existing?.dailyStudyTarget || 10,
    onboardingCompleted: existing?.onboardingCompleted ?? false,
    lastLessonId: existing?.lastLessonId || 'greetings-and-introductions',
    dailyMinutesToday: existing?.dailyMinutesToday || 0,
    dailyMinutesDate: existing?.dailyMinutesDate || getTodayKey(),
    dailyQuestDate: existing?.dailyQuestDate || getTodayKey(),
    dailyQuestProgress: existing?.dailyQuestProgress || {},
    claimedQuestIds: existing?.claimedQuestIds || [],
  };

  await setDoc(userRef, userData, { merge: true });

  // Fetch or initialize userProgress
  const progressSnap = await getDoc(progressRef);
  let progressData: FirestoreProgressData;
  if (progressSnap.exists()) {
    progressData = progressSnap.data() as FirestoreProgressData;
    await setDoc(
      progressRef,
      {
        userId: fbUser.uid,
        completedLessonIds: progressData.completedLessonIds || [],
        quizScores: progressData.quizScores || [],
        streakDays: progressData.streakDays || 1,
        lastActiveDate: progressData.lastActiveDate || now,
        lastStreakDate: progressData.lastStreakDate || progressData.lastActiveDate || now,
        exploredCultureIds: progressData.exploredCultureIds || [],
        readingCompletedIds: progressData.readingCompletedIds || [],
        pronunciationAttempts: progressData.pronunciationAttempts || 0,
        updatedAt: now,
      },
      { merge: true }
    );
  } else {
    progressData = {
      userId: fbUser.uid,
      completedLessonIds: [],
      quizScores: [],
      streakDays: 1,
      lastActiveDate: now,
      lastStreakDate: now,
      exploredCultureIds: [],
      readingCompletedIds: [],
      pronunciationAttempts: 0,
      updatedAt: now,
    };
    await setDoc(progressRef, progressData);
  }

  // Fetch or initialize savedVocabulary
  const vocabSnap = await getDoc(vocabRef);
  let vocabData: FirestoreSavedVocabData;
  if (vocabSnap.exists()) {
    vocabData = vocabSnap.data() as FirestoreSavedVocabData;
    await setDoc(
      vocabRef,
      {
        userId: fbUser.uid,
        savedWordIds: vocabData.savedWordIds || [],
        vocabStatus: vocabData.vocabStatus || {},
        updatedAt: now,
      },
      { merge: true }
    );
  } else {
    vocabData = {
      userId: fbUser.uid,
      savedWordIds: [],
      vocabStatus: {},
      updatedAt: now,
    };
    await setDoc(vocabRef, vocabData);
  }

  // Fetch or initialize userBadges, then reconcile unlocked tiers.
  const badgesSnap = await getDoc(badgesRef);
  let badgesData: FirestoreUserBadgesData;
  if (badgesSnap.exists()) {
    badgesData = badgesSnap.data() as FirestoreUserBadgesData;
  } else {
    badgesData = {
      userId: fbUser.uid,
      unlockedBadgeIds: [],
      badges: [],
      updatedAt: now,
    };
  }

  const existingIds = new Set(badgesData.unlockedBadgeIds || []);
  const badgeItems = [...(badgesData.badges || [])];
  let badgesChanged = false;
  for (const tier of BADGE_TIERS) {
    if (userData.totalPoints >= tier.minPoints && !existingIds.has(tier.id)) {
      existingIds.add(tier.id);
      badgeItems.push({ badgeId: tier.id, unlockedAt: now });
      badgesChanged = true;
    }
  }
  if (badgesChanged || !badgesSnap.exists()) {
    badgesData = {
      userId: fbUser.uid,
      unlockedBadgeIds: Array.from(existingIds),
      badges: badgeItems,
      updatedAt: now,
    };
    await setDoc(badgesRef, badgesData);
  }

  const unlockedAtMap: Record<string, string> = {};
  badgeItems.forEach((b) => {
    unlockedAtMap[b.badgeId] = b.unlockedAt;
  });

  const badges = calculateCumulativeBadges(userData.totalPoints, unlockedAtMap);

  const fullProfile: UserProfile = {
    id: fbUser.uid,
    name: userData.displayName,
    email: userData.email,
    picture: userData.photoURL,
    photoURL: userData.photoURL,
    googleUid: provider === 'google' ? fbUser.uid : undefined,
    googleSub: provider === 'google' ? fbUser.uid : undefined,
    authProvider: provider,
    isGuest: fbUser.isAnonymous,
    preferredLanguage: userData.preferredLanguage || 'en',
    level: userData.level || 'beginner',
    learningGoal: userData.learningGoal || 'conversation',
    dailyStudyTarget: userData.dailyStudyTarget || 10,
    onboardingCompleted: userData.onboardingCompleted ?? false,
    lastLessonId: userData.lastLessonId || 'greetings-and-introductions',
    dailyMinutesToday: userData.dailyMinutesToday || 0,
    dailyMinutesDate: userData.dailyMinutesDate || getTodayKey(),
    avatar: userData.avatar || '🎓',
    vocabStatus: vocabData.vocabStatus || {},
    streakDays: progressData.streakDays || 1,
    lastActiveDate: progressData.lastActiveDate || now,
    createdAt: userData.createdAt,
    lastLoginAt: userData.lastLoginAt,
    points: userData.totalPoints || 0,
    badges,
    completedLessonIds: progressData.completedLessonIds || [],
    savedWordIds: vocabData.savedWordIds || [],
    exploredCultureIds: progressData.exploredCultureIds || [],
    readingCompletedIds: progressData.readingCompletedIds || [],
    pronunciationAttempts: progressData.pronunciationAttempts || 0,
    dailyQuestDate: userData.dailyQuestDate,
    dailyQuestProgress: userData.dailyQuestProgress || {},
    claimedQuestIds: userData.claimedQuestIds || [],
    pointsEpoch: userData.pointsEpoch || 0,
  };

  await updateLeaderboardEntry(
    fbUser.uid,
    userData.displayName,
    userData.photoURL,
    userData.avatar,
    userData.totalPoints,
    0
  );

  return { profile: fullProfile, isNew };
}

// Award points with duplicate-prevention transaction (reset-aware via pointsEpoch)
export async function awardFirebasePoints(
  uid: string,
  activityId: string,
  type: ActivityType,
  pointsEarned: number,
  title: string
): Promise<{ updatedPoints: number; newlyUnlockedBadges: Badge[]; awarded: boolean }> {
  const userRef = doc(firestoreDb, 'users', uid);
  const userSnap = await getDoc(userRef);
  const epoch = userSnap.exists() ? Number((userSnap.data() as FirestoreUserData).pointsEpoch) || 0 : 0;
  const transactionId = `tx_${uid}_e${epoch}_${activityId}`;
  const txRef = doc(firestoreDb, 'pointTransactions', transactionId);

  const now = new Date().toISOString();
  let updatedPoints = userSnap.exists() ? Number((userSnap.data() as FirestoreUserData).totalPoints) || 0 : 0;
  let awarded = false;

  await runTransaction(firestoreDb, async (transaction) => {
    const existingTx = await transaction.get(txRef);
    const freshUser = await transaction.get(userRef);
    const currentPoints = freshUser.exists()
      ? Number((freshUser.data() as FirestoreUserData).totalPoints) || 0
      : 0;

    if (existingTx.exists()) {
      updatedPoints = currentPoints;
      return;
    }

    transaction.set(txRef, {
      id: transactionId,
      userId: uid,
      activityId,
      type,
      pointsEarned,
      title,
      timestamp: now,
    });
    transaction.set(
      userRef,
      { totalPoints: currentPoints + pointsEarned, lastLoginAt: now, updatedAt: now },
      { merge: true }
    );
    updatedPoints = currentPoints + pointsEarned;
    awarded = true;
  });

  if (!awarded) {
    return { updatedPoints, newlyUnlockedBadges: [], awarded: false };
  }

  // Check and update badges
  const badgesRef = doc(firestoreDb, 'userBadges', uid);
  const badgesSnap = await getDoc(badgesRef);
  const existingBadgesData = badgesSnap.exists()
    ? (badgesSnap.data() as FirestoreUserBadgesData)
    : { userId: uid, unlockedBadgeIds: [], badges: [], updatedAt: now };

  const existingIds = new Set(existingBadgesData.unlockedBadgeIds || []);
  const newlyUnlocked: Badge[] = [];
  const updatedBadgeItems = [...(existingBadgesData.badges || [])];

  for (const b of BADGE_TIERS) {
    if (updatedPoints >= b.minPoints && !existingIds.has(b.id)) {
      existingIds.add(b.id);
      const newBadge: Badge = {
        id: b.id,
        name: b.name,
        nameKannada: b.nameKannada,
        description: b.description,
        tier: b.tier,
        minPoints: b.minPoints,
        icon: b.icon,
        isUnlocked: true,
        unlockedAt: now,
      };
      newlyUnlocked.push(newBadge);
      updatedBadgeItems.push({
        badgeId: b.id,
        unlockedAt: now,
      });
    }
  }

  if (newlyUnlocked.length > 0 || !badgesSnap.exists()) {
    await setDoc(badgesRef, {
      userId: uid,
      unlockedBadgeIds: Array.from(existingIds),
      badges: updatedBadgeItems,
      updatedAt: now,
    });
  }

  const freshUserSnap = await getDoc(userRef);
  const profileData = freshUserSnap.exists() ? (freshUserSnap.data() as FirestoreUserData) : null;
  await updateLeaderboardEntry(
    uid,
    profileData?.displayName || 'Kannada Learner',
    profileData?.photoURL,
    profileData?.avatar,
    updatedPoints,
    pointsEarned
  );

  return { updatedPoints, newlyUnlockedBadges: newlyUnlocked, awarded: true };
}

/** Updates the streak once per calendar day. Safe to call after every activity. */
export async function recordDailyActivityInFirestore(
  uid: string
): Promise<{ streakDays: number; changed: boolean }> {
  const progressRef = doc(firestoreDb, 'userProgress', uid);
  const snap = await getDoc(progressRef);
  const data = snap.exists() ? (snap.data() as FirestoreProgressData) : null;
  const current = Math.max(1, Number(data?.streakDays) || 1);
  const { streak, changed } = calculateNextStreak(
    data?.lastStreakDate || data?.lastActiveDate,
    current
  );

  if (changed || !data?.lastStreakDate) {
    const now = new Date().toISOString();
    await setDoc(
      progressRef,
      {
        userId: uid,
        streakDays: streak,
        lastStreakDate: getTodayKey(),
        lastActiveDate: now,
        updatedAt: now,
      },
      { merge: true }
    );
  }

  return { streakDays: streak, changed };
}

/** Increment a daily quest metric, automatically resetting on a new day. */
export async function recordQuestProgressInFirestore(
  uid: string,
  metric: QuestMetric,
  amount = 1
): Promise<void> {
  if (amount <= 0) return;
  const userRef = doc(firestoreDb, 'users', uid);
  const today = getTodayKey();
  const now = new Date().toISOString();

  await runTransaction(firestoreDb, async (transaction) => {
    const snap = await transaction.get(userRef);
    const data = snap.exists() ? (snap.data() as FirestoreUserData) : null;
    const sameDay = data?.dailyQuestDate === today;
    const progress: Record<string, number> = sameDay
      ? { ...(data?.dailyQuestProgress || {}) }
      : {};
    progress[metric] = (Number(progress[metric]) || 0) + amount;
    transaction.set(
      userRef,
      {
        dailyQuestDate: today,
        dailyQuestProgress: progress,
        claimedQuestIds: sameDay ? data?.claimedQuestIds || [] : [],
        updatedAt: now,
      },
      { merge: true }
    );
  });
}

export async function claimDailyQuestInFirestore(
  uid: string,
  questId: string
): Promise<{ updatedPoints: number; newlyUnlockedBadges: Badge[]; reward: number }> {
  const quest = DAILY_QUESTS.find((q) => q.id === questId);
  if (!quest) throw new Error('Unknown daily quest.');

  const userRef = doc(firestoreDb, 'users', uid);
  const snap = await getDoc(userRef);
  const data = snap.exists() ? (snap.data() as FirestoreUserData) : null;
  const today = getTodayKey();
  const sameDay = data?.dailyQuestDate === today;
  const progress = sameDay ? data?.dailyQuestProgress || {} : {};
  const claimed = sameDay ? data?.claimedQuestIds || [] : [];

  if ((Number(progress[quest.metric]) || 0) < quest.target) {
    throw new Error('Quest is not complete yet.');
  }
  if (claimed.includes(quest.id)) {
    throw new Error('Quest already claimed today.');
  }

  await setDoc(
    userRef,
    { claimedQuestIds: [...claimed, quest.id], updatedAt: new Date().toISOString() },
    { merge: true }
  );

  const award = await awardFirebasePoints(
    uid,
    `quest_${today}_${quest.id}`,
    'quest',
    quest.reward,
    `Daily quest: ${quest.title}`
  );
  return { ...award, reward: quest.reward };
}

// Complete lesson in Firestore
export async function completeLessonInFirestore(
  uid: string,
  lessonId: string,
  points = 10,
  lessonTitle?: string
): Promise<{
  updatedPoints: number;
  newlyUnlockedBadges: Badge[];
  streakDays: number;
  isNewCompletion: boolean;
}> {
  const progressRef = doc(firestoreDb, 'userProgress', uid);
  const progressSnap = await getDoc(progressRef);
  const now = new Date().toISOString();

  let completedList: string[] = [];
  if (progressSnap.exists()) {
    completedList = (progressSnap.data() as FirestoreProgressData).completedLessonIds || [];
  }

  const isNewCompletion = !completedList.includes(lessonId);
  if (isNewCompletion) {
    completedList.push(lessonId);
    await setDoc(
      progressRef,
      {
        userId: uid,
        completedLessonIds: completedList,
        lastActiveDate: now,
        updatedAt: now,
      },
      { merge: true }
    );
  }

  const daily = await recordDailyActivityInFirestore(uid);
  if (isNewCompletion) {
    await recordQuestProgressInFirestore(uid, 'lessons', 1);
  }

  const award = await awardFirebasePoints(
    uid,
    `lesson_${lessonId}`,
    'lesson',
    points,
    lessonTitle ? `Completed Lesson: ${lessonTitle}` : `Completed Lesson: ${lessonId}`
  );

  return { ...award, streakDays: daily.streakDays, isNewCompletion };
}

// Submit quiz score in Firestore. XP is based on the best score, so retries
// cannot farm points but learners can still improve their reward.
export async function submitQuizScoreInFirestore(
  uid: string,
  quizId: string,
  score: number,
  total: number
): Promise<{
  updatedPoints: number;
  newlyUnlockedBadges: Badge[];
  streakDays: number;
  bestScore: number;
  pointsAwarded: number;
}> {
  const progressRef = doc(firestoreDb, 'userProgress', uid);
  const progressSnap = await getDoc(progressRef);
  const now = new Date().toISOString();

  let scoresList: FirestoreProgressData['quizScores'] = [];
  if (progressSnap.exists()) {
    scoresList = (progressSnap.data() as FirestoreProgressData).quizScores || [];
  }

  const existingIdx = scoresList.findIndex((s) => s.quizId === quizId);
  const previousBest =
    existingIdx >= 0
      ? Number(scoresList[existingIdx].bestScore ?? scoresList[existingIdx].score) || 0
      : 0;
  const bestScore = Math.max(previousBest, score);
  const deltaCorrect = Math.max(0, bestScore - previousBest);

  const scoreEntry = {
    quizId,
    score,
    bestScore,
    total,
    completedAt: now,
  };

  if (existingIdx >= 0) {
    scoresList[existingIdx] = scoreEntry;
  } else {
    scoresList.push(scoreEntry);
  }

  await setDoc(
    progressRef,
    {
      userId: uid,
      quizScores: scoresList,
      lastActiveDate: now,
      updatedAt: now,
    },
    { merge: true }
  );

  const daily = await recordDailyActivityInFirestore(uid);
  if (deltaCorrect > 0) {
    await recordQuestProgressInFirestore(uid, 'quizCorrect', deltaCorrect);
  }

  if (deltaCorrect <= 0) {
    const userSnap = await getDoc(doc(firestoreDb, 'users', uid));
    const currentPoints = userSnap.exists()
      ? Number((userSnap.data() as FirestoreUserData).totalPoints) || 0
      : 0;
    return {
      updatedPoints: currentPoints,
      newlyUnlockedBadges: [],
      streakDays: daily.streakDays,
      bestScore,
      pointsAwarded: 0,
    };
  }

  const pointsToAward = deltaCorrect * 5;
  const award = await awardFirebasePoints(
    uid,
    `quiz_${quizId}_best_${bestScore}`,
    'quiz',
    pointsToAward,
    `Quiz best score: ${bestScore}/${total}`
  );

  return {
    ...award,
    streakDays: daily.streakDays,
    bestScore,
    pointsAwarded: pointsToAward,
  };
}

// Toggle saved vocabulary in Firestore
export async function toggleSavedVocabularyInFirestore(uid: string, wordId: string): Promise<string[]> {
  const vocabRef = doc(firestoreDb, 'savedVocabulary', uid);
  const vocabSnap = await getDoc(vocabRef);
  const now = new Date().toISOString();

  let savedWords: string[] = [];
  let vocabStatus: Record<string, VocabMasteryStatus> = {};
  if (vocabSnap.exists()) {
    const data = vocabSnap.data() as FirestoreSavedVocabData;
    savedWords = data.savedWordIds || [];
    vocabStatus = data.vocabStatus || {};
  }

  if (savedWords.includes(wordId)) {
    savedWords = savedWords.filter((id) => id !== wordId);
  } else {
    savedWords.push(wordId);
    await recordDailyActivityInFirestore(uid);
    await recordQuestProgressInFirestore(uid, 'words', 1);
    await awardFirebasePoints(uid, `voc_${wordId}`, 'vocabulary', 5, 'Saved Kannada Vocabulary');
  }

  await setDoc(
    vocabRef,
    { userId: uid, savedWordIds: savedWords, vocabStatus, updatedAt: now },
    { merge: true }
  );

  return savedWords;
}

// Save user learning preferences and onboarding choices in Firestore
export async function saveUserPreferencesInFirestore(
  uid: string,
  prefs: {
    preferredLanguage?: ExplanationLanguage;
    level?: 'beginner' | 'intermediate' | 'advanced';
    learningGoal?: LearningGoal;
    dailyStudyTarget?: DailyStudyTarget;
    onboardingCompleted?: boolean;
    avatar?: string;
  }
): Promise<void> {
  const userRef = doc(firestoreDb, 'users', uid);
  await setDoc(userRef, { ...prefs, updatedAt: new Date().toISOString() }, { merge: true });
}

// Track vocabulary mastery status: 'new' | 'learning' | 'mastered' (LingQ inspired)
export async function saveVocabStatusInFirestore(
  uid: string,
  wordId: string,
  status: VocabMasteryStatus
): Promise<Record<string, VocabMasteryStatus>> {
  const vocabRef = doc(firestoreDb, 'savedVocabulary', uid);
  const vocabSnap = await getDoc(vocabRef);
  const now = new Date().toISOString();

  let vocabStatusMap: Record<string, VocabMasteryStatus> = {};
  let savedWordIds: string[] = [];
  let previousStatus: VocabMasteryStatus | undefined;

  if (vocabSnap.exists()) {
    const data = vocabSnap.data() as FirestoreSavedVocabData;
    vocabStatusMap = data.vocabStatus || {};
    savedWordIds = data.savedWordIds || [];
    previousStatus = vocabStatusMap[wordId];
  }

  vocabStatusMap[wordId] = status;
  if (!savedWordIds.includes(wordId)) {
    savedWordIds.push(wordId);
  }

  await setDoc(
    vocabRef,
    {
      userId: uid,
      savedWordIds,
      vocabStatus: vocabStatusMap,
      updatedAt: now,
    },
    { merge: true }
  );

  if (status === 'mastered' && previousStatus !== 'mastered') {
    await recordDailyActivityInFirestore(uid);
    await awardFirebasePoints(uid, `mastered_${wordId}`, 'vocabulary', 2, 'Mastered a Kannada word');
  }

  return vocabStatusMap;
}

// Track last studied lesson for the "Continue Learning" dashboard widget
export async function setLastStudiedLessonInFirestore(uid: string, lessonId: string): Promise<void> {
  const userRef = doc(firestoreDb, 'users', uid);
  await setDoc(userRef, { lastLessonId: lessonId, updatedAt: new Date().toISOString() }, { merge: true });
}

// Record daily study minutes towards the user's daily goal. Resets at midnight.
export async function recordStudyMinutesInFirestore(uid: string, additionalMinutes: number): Promise<number> {
  const userRef = doc(firestoreDb, 'users', uid);
  const userSnap = await getDoc(userRef);
  const today = getTodayKey();
  let currentMinutes = 0;
  if (userSnap.exists()) {
    const data = userSnap.data() as FirestoreUserData;
    currentMinutes = data.dailyMinutesDate === today ? Number(data.dailyMinutesToday) || 0 : 0;
  }
  const updatedMinutes = Math.min(600, currentMinutes + Math.max(0, additionalMinutes));
  await setDoc(
    userRef,
    { dailyMinutesToday: updatedMinutes, dailyMinutesDate: today, updatedAt: new Date().toISOString() },
    { merge: true }
  );
  return updatedMinutes;
}

// Culture exploration: +5 XP per entry, tracked for achievements.
export async function markCultureExploredInFirestore(
  uid: string,
  cultureId: string
): Promise<{ exploredCultureIds: string[]; isNew: boolean; updatedPoints: number; newlyUnlockedBadges: Badge[] }> {
  const progressRef = doc(firestoreDb, 'userProgress', uid);
  const snap = await getDoc(progressRef);
  const data = snap.exists() ? (snap.data() as FirestoreProgressData) : null;
  const explored = [...(data?.exploredCultureIds || [])];
  const isNew = !explored.includes(cultureId);

  if (!isNew) {
    const userSnap = await getDoc(doc(firestoreDb, 'users', uid));
    return {
      exploredCultureIds: explored,
      isNew: false,
      updatedPoints: userSnap.exists() ? Number((userSnap.data() as FirestoreUserData).totalPoints) || 0 : 0,
      newlyUnlockedBadges: [],
    };
  }

  explored.push(cultureId);
  const now = new Date().toISOString();
  await setDoc(
    progressRef,
    { userId: uid, exploredCultureIds: explored, lastActiveDate: now, updatedAt: now },
    { merge: true }
  );
  await recordDailyActivityInFirestore(uid);
  const award = await awardFirebasePoints(uid, `culture_${cultureId}`, 'culture', 5, 'Explored Kannada culture');
  return { exploredCultureIds: explored, isNew: true, ...award };
}

// Reading completion: +20 XP per story, tracked for achievements.
export async function markReadingCompleteInFirestore(
  uid: string,
  storyId: string
): Promise<{ readingCompletedIds: string[]; isNew: boolean; updatedPoints: number; newlyUnlockedBadges: Badge[] }> {
  const progressRef = doc(firestoreDb, 'userProgress', uid);
  const snap = await getDoc(progressRef);
  const data = snap.exists() ? (snap.data() as FirestoreProgressData) : null;
  const completed = [...(data?.readingCompletedIds || [])];
  const isNew = !completed.includes(storyId);

  if (!isNew) {
    const userSnap = await getDoc(doc(firestoreDb, 'users', uid));
    return {
      readingCompletedIds: completed,
      isNew: false,
      updatedPoints: userSnap.exists() ? Number((userSnap.data() as FirestoreUserData).totalPoints) || 0 : 0,
      newlyUnlockedBadges: [],
    };
  }

  completed.push(storyId);
  const now = new Date().toISOString();
  await setDoc(
    progressRef,
    { userId: uid, readingCompletedIds: completed, lastActiveDate: now, updatedAt: now },
    { merge: true }
  );
  await recordDailyActivityInFirestore(uid);
  const award = await awardFirebasePoints(uid, `reading_${storyId}`, 'reading', 20, 'Finished an immersion story');
  return { readingCompletedIds: completed, isNew: true, ...award };
}

// Pronunciation practice: one +5 XP award per drill per day.
export async function recordPronunciationAttemptInFirestore(
  uid: string,
  drillId: string
): Promise<{ attempts: number; updatedPoints: number; newlyUnlockedBadges: Badge[]; awarded: boolean }> {
  const progressRef = doc(firestoreDb, 'userProgress', uid);
  const snap = await getDoc(progressRef);
  const attempts = (Number(snap.exists() ? (snap.data() as FirestoreProgressData).pronunciationAttempts : 0) || 0) + 1;
  const now = new Date().toISOString();

  await setDoc(
    progressRef,
    { userId: uid, pronunciationAttempts: attempts, lastActiveDate: now, updatedAt: now },
    { merge: true }
  );
  await recordDailyActivityInFirestore(uid);
  await recordQuestProgressInFirestore(uid, 'pronunciation', 1);

  const award = await awardFirebasePoints(
    uid,
    `pron_${drillId}_${getTodayKey()}`,
    'pronunciation',
    5,
    'Completed a pronunciation drill'
  );
  return { attempts, updatedPoints: award.updatedPoints, newlyUnlockedBadges: award.newlyUnlockedBadges, awarded: award.awarded };
}

// AI roleplay: one +5 XP award per scenario per day (prevents message farming).
export async function recordRoleplayMilestoneInFirestore(
  uid: string,
  scenarioId: string
): Promise<{ updatedPoints: number; newlyUnlockedBadges: Badge[]; awarded: boolean }> {
  await recordDailyActivityInFirestore(uid);
  const userSnap = await getDoc(doc(firestoreDb, 'users', uid));
  const userData = userSnap.exists() ? (userSnap.data() as FirestoreUserData) : null;
  const sameDay = userData?.dailyQuestDate === getTodayKey();
  const roleplayProgress = sameDay ? Number(userData?.dailyQuestProgress?.roleplay) || 0 : 0;
  if (roleplayProgress < 1) {
    await recordQuestProgressInFirestore(uid, 'roleplay', 1);
  }
  return awardFirebasePoints(
    uid,
    `roleplay_${scenarioId}_${getTodayKey()}`,
    'roleplay',
    5,
    'Practiced an AI roleplay conversation'
  );
}

// Recent activity feed
export async function getRecentActivity(uid: string, maxItems = 12): Promise<ActivityLog[]> {
  try {
    const ref = collection(firestoreDb, 'pointTransactions');
    const snap = await getDocs(query(ref, where('userId', '==', uid)));
    return snap.docs
      .map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          type: (data.type || 'lesson') as ActivityType,
          title: data.title || 'Learning activity',
          pointsEarned: Number(data.pointsEarned) || 0,
          timestamp: data.timestamp || new Date().toISOString(),
        } satisfies ActivityLog;
      })
      .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)))
      .slice(0, maxItems);
  } catch (err) {
    console.warn('Activity feed note:', err);
    return [];
  }
}

// Leaderboard (all-time or current week)
export async function getLeaderboard(scope: 'all' | 'week' = 'all'): Promise<LeaderboardEntry[]> {
  try {
    const field = scope === 'week' ? 'weeklyPoints' : 'totalPoints';
    const snap = await getDocs(
      query(collection(firestoreDb, 'leaderboard'), orderBy(field, 'desc'), limit(25))
    );
    return snap.docs
      .map((d) => d.data() as LeaderboardEntry)
      .filter((entry) => (scope === 'week' ? Number(entry.weeklyPoints) > 0 : true))
      .slice(0, 20);
  } catch (err) {
    console.warn('Leaderboard note:', err);
    return [];
  }
}

export async function saveAvatarInFirestore(uid: string, avatar: string): Promise<void> {
  const userRef = doc(firestoreDb, 'users', uid);
  await setDoc(userRef, { avatar, updatedAt: new Date().toISOString() }, { merge: true });
  const snap = await getDoc(userRef);
  const data = snap.exists() ? (snap.data() as FirestoreUserData) : null;
  if (data) {
    await updateLeaderboardEntry(uid, data.displayName, data.photoURL, avatar, data.totalPoints, 0);
  }
}

// Safely reset user learning progress with explicit confirmation
export async function resetUserProgressInFirestore(uid: string): Promise<void> {
  const now = new Date().toISOString();
  const today = getTodayKey();
  const progressRef = doc(firestoreDb, 'userProgress', uid);
  const vocabRef = doc(firestoreDb, 'savedVocabulary', uid);
  const badgesRef = doc(firestoreDb, 'userBadges', uid);
  const userRef = doc(firestoreDb, 'users', uid);
  const userSnap = await getDoc(userRef);
  const currentEpoch = userSnap.exists() ? Number((userSnap.data() as FirestoreUserData).pointsEpoch) || 0 : 0;

  await setDoc(progressRef, {
    userId: uid,
    completedLessonIds: [],
    quizScores: [],
    streakDays: 1,
    lastActiveDate: now,
    lastStreakDate: today,
    exploredCultureIds: [],
    readingCompletedIds: [],
    pronunciationAttempts: 0,
    updatedAt: now,
  });

  await setDoc(vocabRef, {
    userId: uid,
    savedWordIds: [],
    vocabStatus: {},
    updatedAt: now,
  });

  await setDoc(badgesRef, {
    userId: uid,
    unlockedBadgeIds: [],
    badges: [],
    updatedAt: now,
  });

  await updateDoc(userRef, {
    totalPoints: 0,
    pointsEpoch: currentEpoch + 1,
    dailyMinutesToday: 0,
    dailyMinutesDate: today,
    dailyQuestDate: today,
    dailyQuestProgress: {},
    claimedQuestIds: [],
    lastLessonId: 'greetings-and-introductions',
    lastLoginAt: now,
  });

  await setDoc(
    doc(firestoreDb, 'leaderboard', uid),
    {
      uid,
      displayName: userSnap.exists() ? (userSnap.data() as FirestoreUserData).displayName : 'Kannada Learner',
      photoURL: userSnap.exists() ? (userSnap.data() as FirestoreUserData).photoURL || '' : '',
      avatar: userSnap.exists() ? (userSnap.data() as FirestoreUserData).avatar || '🎓' : '🎓',
      totalPoints: 0,
      weeklyPoints: 0,
      weekKey: getWeekStartKey(),
      level: 1,
      updatedAt: now,
    },
    { merge: true }
  );
}

// Re-export auth state helpers for callers that need the raw Firebase user.
export { onAuthStateChanged };
export type { FirebaseUser };
