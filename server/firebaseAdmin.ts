import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import {
  initializeApp as initAdminApp,
  getApps as getAdminApps,
  getApp as getAdminApp,
  cert,
} from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import {
  getFirestore as getAdminFirestore,
  Firestore,
  DocumentReference,
} from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Load Firebase configuration
const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
export const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Allow deployment platforms to override the bundled project/database without
// editing the committed client configuration file.
if (process.env.FIREBASE_PROJECT_ID) {
  firebaseConfig.projectId = process.env.FIREBASE_PROJECT_ID;
}
if (process.env.FIREBASE_FIRESTORE_DATABASE_ID) {
  firebaseConfig.firestoreDatabaseId = process.env.FIREBASE_FIRESTORE_DATABASE_ID;
}

// Service account JSON can be supplied through FIREBASE_SERVICE_ACCOUNT for
// local/CI environments. On Cloud Run / GCP the Application Default
// Credentials are used automatically.
function resolveAdminCredential() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return undefined;
  try {
    return cert(JSON.parse(raw));
  } catch (err) {
    console.warn('[Firebase Admin] FIREBASE_SERVICE_ACCOUNT could not be parsed:', err);
    return undefined;
  }
}

// Initialize Firebase Admin SDK for cryptographic ID token verification and
// privileged Firestore access (bypasses client security rules by design).
const adminApp = getAdminApps().length > 0
  ? getAdminApp()
  : initAdminApp({
      projectId: firebaseConfig.projectId,
      ...(resolveAdminCredential() ? { credential: resolveAdminCredential() } : {}),
    });

export const adminAuth = getAdminAuth(adminApp);

// Admin Firestore targeting the configured named database.
export const serverDb = getAdminFirestore(adminApp, firebaseConfig.firestoreDatabaseId);

// ---------------------------------------------------------------------------
// Small compatibility adapter so existing routes can keep using the familiar
// modular `doc/getDoc/setDoc/updateDoc` shape with the Admin SDK.
// ---------------------------------------------------------------------------
export function doc(db: Firestore, ...segments: string[]): DocumentReference {
  return db.doc(segments.join('/'));
}

export async function getDoc(ref: DocumentReference) {
  const snap = await ref.get();
  return {
    id: snap.id,
    exists: () => snap.exists,
    data: () => snap.data(),
  };
}

export async function setDoc(
  ref: DocumentReference,
  data: Record<string, any>,
  options?: { merge?: boolean }
) {
  return ref.set(data, options || {});
}

export async function updateDoc(ref: DocumentReference, data: Record<string, any>) {
  return ref.update(data);
}

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  authProvider?: 'google' | 'password' | 'guest';
  isGuest?: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Strict authentication middleware: requires a valid Firebase ID token in Authorization: Bearer <token>.
 * Rejects raw bearer tokens, query parameters, emails, or client-supplied UIDs as identity.
 */
export async function requireFirebaseAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or malformed Authorization header. Bearer Firebase ID token required.',
    });
    return;
  }

  const idToken = authHeader.substring(7).trim();
  if (!idToken || idToken === 'guest-user' || idToken.length < 20) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid Firebase ID token format. Raw bearer tokens or guest strings are not accepted.',
    });
    return;
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const provider = decoded.firebase?.sign_in_provider;
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      displayName: decoded.name,
      photoURL: decoded.picture,
      authProvider: provider === 'google.com' ? 'google' : provider === 'anonymous' ? 'guest' : 'password',
      isGuest: provider === 'anonymous',
    };
    next();
  } catch (err: any) {
    console.warn(`[Firebase Admin] Token verification failed: ${err.code || err.message}`);
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Firebase ID token is invalid or expired. Please re-authenticate.',
      code: err.code || 'auth/invalid-token',
    });
  }
}

/**
 * Optional authentication middleware: if an Authorization header is provided, verifies it.
 */
export async function optionalFirebaseAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const idToken = authHeader.substring(7).trim();
  if (!idToken || idToken === 'guest-user' || idToken.length < 20) {
    return next();
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const provider = decoded.firebase?.sign_in_provider;
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      displayName: decoded.name,
      photoURL: decoded.picture,
      authProvider: provider === 'google.com' ? 'google' : provider === 'anonymous' ? 'guest' : 'password',
      isGuest: provider === 'anonymous',
    };
  } catch {
    // Optional auth, proceed without user
  }
  next();
}

/**
 * Migration helper: Migrates legacy user data from .data/database.json to Firestore
 * if the user has records there and their Firestore points are currently 0.
 */
export async function migrateLegacyUserDataIfPresent(uid: string, email?: string): Promise<boolean> {
  if (!email) return false;

  try {
    const dbPath = path.resolve(process.cwd(), '.data/database.json');
    if (!fs.existsSync(dbPath)) return false;

    const raw = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const users = raw.users || {};

    // Find legacy entry matching user email
    const legacyKey = Object.keys(users).find(
      (k) => users[k].email && users[k].email.toLowerCase() === email.toLowerCase()
    );

    if (!legacyKey) return false;

    const legacyUser = users[legacyKey];
    if (!legacyUser || (legacyUser.points || 0) === 0) return false;

    // Check existing Firestore record
    const userDocRef = doc(serverDb, 'users', uid);
    const userSnap = await getDoc(userDocRef);
    const existingPoints = userSnap.exists() ? (userSnap.data()?.totalPoints || 0) : 0;

    if (existingPoints > 0) {
      // User already has points in Firestore, do not overwrite
      return false;
    }

    const now = new Date().toISOString();

    // Migrate profile
    await setDoc(
      userDocRef,
      {
        uid,
        displayName: legacyUser.name || 'Kannada Learner',
        email: legacyUser.email,
        totalPoints: legacyUser.points || 0,
        level: legacyUser.level || 'beginner',
        preferredLanguage: legacyUser.preferredLanguage || 'en',
        updatedAt: now,
        migratedFromLegacy: true,
      },
      { merge: true }
    );

    // Migrate progress
    const progressDocRef = doc(serverDb, 'userProgress', uid);
    await setDoc(
      progressDocRef,
      {
        userId: uid,
        completedLessonIds: legacyUser.completedLessonIds || [],
        quizScores: legacyUser.quizScores || [],
        streakDays: legacyUser.streakDays || 1,
        lastActiveDate: legacyUser.lastActiveDate || now,
        updatedAt: now,
      },
      { merge: true }
    );

    // Migrate saved vocabulary
    if (legacyUser.savedWordIds?.length) {
      const vocabDocRef = doc(serverDb, 'savedVocabulary', uid);
      await setDoc(
        vocabDocRef,
        {
          userId: uid,
          savedWordIds: legacyUser.savedWordIds,
          updatedAt: now,
        },
        { merge: true }
      );
    }

    console.log(`[Migration] Successfully migrated legacy data for ${email} (${legacyUser.points} pts) to Firestore UID ${uid}`);
    return true;
  } catch (err: any) {
    console.warn('[Migration] Note during legacy data migration:', err.message);
    return false;
  }
}
