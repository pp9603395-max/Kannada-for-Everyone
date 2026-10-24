# Kannada for Everyone (ಕನ್ನಡ ಎಲ್ಲರಿಗೂ)

A full-stack, gamified Kannada learning platform built for the **Kannada Digital Innovation Challenge 2026**. It helps non-Kannada speakers learn practical, everyday Kannada through real-life dialogues, immersive reading, culture, pronunciation drills, quizzes, AI roleplay, streaks, quests, achievements, and a printable certificate.

---

## ✨ What is included

### Learning experience
- **10 sequential learning-path modules** mapped one-to-one to 10 real-life lessons: greetings, shopping, food, neighbours, transport, directions, college, workplace, healthcare, and festivals.
- **Dual-pane studio** with Kannada script, transliteration, English/Marathi/Hindi explanations, word-by-word breakdowns, grammar notes, audio, and speech recognition.
- **Immersive LingQ-style reader** with clickable words, saved-word integration, and completion rewards.
- **165+ vocabulary items** with mastery states (`new`, `learning`, `mastered`) and saved-word revision.
- **100+ quiz questions** across multiple-choice, match, fill-in-the-blank, reordering, translation, and contextual formats.
- **Pronunciation lab** with syllable audio, retroflex/dental minimal pairs, script vowels, and live speech matching.
- **Karnataka culture explorer** with 32 heritage entries and first-exploration XP.
- **Gemini AI roleplay** with graceful pedagogical fallbacks when no API key is configured.

### Gamification
- 6 levels from **Novice Explorer** to **Kannada Champion**.
- 5 daily quests with claimable bonus XP.
- 18 achievements across bronze, silver, gold, and platinum tiers.
- Daily streak calculation, daily study-minute target, weekly/all-time leaderboard, and activity feed.
- XP and level-up toasts, achievement toasts, and a printable certificate.

### Authentication
- Firebase **email/password** sign-up and sign-in.
- Firebase **Google** popup/redirect sign-in.
- Firebase **anonymous guest** mode.
- Real password-reset email flow.
- Profile onboarding and preference settings.

### Production readiness
- Firestore security rules for users, progress, vocabulary, badges, point transactions, leaderboard, and diagnostics.
- Idempotent XP transactions with `pointsEpoch` support for progress resets.
- Rate-limited AI endpoint and server-side XP caps.
- Health endpoint (`/api/health`), security headers, Docker image, and single-command production start.

---

## 🏗️ Architecture

```
React 19 + Vite + Tailwind CSS v4
        │
        ├── Firebase Auth (email, Google, anonymous guest)
        ├── Cloud Firestore (client SDK, primary persistence)
        └── Express API (optional AI roleplay + REST curriculum)
                └── Firebase Admin SDK (ID-token verification, server-side writes)
```

- **Firestore is the primary source of truth** for profiles, lessons, quizzes, vocabulary, quests, streaks, and achievements. Lessons and quizzes keep working even if the Express API is unavailable.
- **Express** verifies Firebase ID tokens with the Admin SDK and provides the Gemini roleplay endpoint plus REST access to the bundled curriculum.
- The **leaderboard is a progressive enhancement**: if it fails, lessons and quizzes are not blocked.

---

## 🚀 Quick start

### Prerequisites
- Node.js **20+**
- A Firebase project with **Firestore** and **Authentication** enabled

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

The web client reads `firebase-applet-config.json` (safe to commit; it contains public web config only). Make sure it points to your project and named Firestore database:

```json
{
  "projectId": "your-project-id",
  "apiKey": "your-public-web-api-key",
  "authDomain": "your-project.firebaseapp.com",
  "firestoreDatabaseId": "(default)",
  "storageBucket": "your-project.firebasestorage.app",
  "messagingSenderId": "1234567890",
  "appId": "1:1234567890:web:abcdef"
}
```

In the Firebase Console:
1. **Authentication → Sign-in method**: enable **Email/Password**, **Google**, and **Anonymous**.
2. **Authentication → Settings → Authorized domains**: add `localhost` and your production domain.
3. **Firestore Database**: create the database. If you use a named database, put its ID in `firestoreDatabaseId`.
4. Deploy the rules:

```bash
npm install -g firebase-tools
firebase login
npm run deploy:rules
```

### 3. Configure server credentials

Copy `.env.example` to `.env`:

```env
PORT=3000
GEMINI_API_KEY=your-gemini-api-key
FIREBASE_SERVICE_ACCOUNT=
```

For the server-side Admin SDK, choose one:
- **Google Cloud / Cloud Run**: attach a service account with *Cloud Datastore User* and *Firebase Authentication Admin*, and use Application Default Credentials.
- **Local / Render / Railway / Docker**: paste the full service-account JSON as a single-line `FIREBASE_SERVICE_ACCOUNT` value.

> Never commit a real service-account JSON. `.env` and `.data/` are ignored.

### 4. Run in development

```bash
npm run dev
```

Open `http://localhost:3000`. Express mounts the Vite dev middleware and the API on the same origin.

### 5. Build and run in production

```bash
npm run build
npm start
```

`npm start` runs `scripts/start.ts`, sets `NODE_ENV=production`, and serves `dist/` plus the API.

---

## 🐳 Deploy with Docker

```bash
docker build -t kannada-for-everyone .
docker run --rm -p 3000:3000 \
  -e GEMINI_API_KEY="..." \
  -e FIREBASE_SERVICE_ACCOUNT="$(cat service-account.json)" \
  kannada-for-everyone
```

The image:
- builds the Vite client in a build stage,
- installs production dependencies,
- runs as the non-root `node` user,
- exposes `/api/health` as a Docker health check.

This is the recommended option for **Render, Railway, Fly.io, Google Cloud Run, Azure Container Apps, or any Docker host**.

### Render / Railway settings
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check path: `/api/health`
- Set `GEMINI_API_KEY` and `FIREBASE_SERVICE_ACCOUNT` in the platform dashboard.

### Google Cloud Run
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/kannada-for-everyone
gcloud run deploy kannada-for-everyone \
  --image gcr.io/PROJECT_ID/kannada-for-everyone \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=... \
  --port 3000
```
Attach a service account with Firestore and Firebase Auth admin permissions to the Cloud Run service.

### Firebase Hosting (static client only)
`firebase.json` includes a static SPA rewrite for `dist/`. Firebase Hosting can serve the learning experience, but the **AI roleplay API needs a live Express host**. For full functionality use the Docker/Render/Cloud Run deployment and point your domain there.

---

## 🔐 Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Express port (default `3000`). |
| `NODE_ENV` | No | Set to `production` by `npm start`; serves `dist/`. |
| `GEMINI_API_KEY` | No | Enables live Gemini roleplay. Fallbacks work without it. |
| `FIREBASE_SERVICE_ACCOUNT` | No* | Full service-account JSON for Admin SDK. |
| `FIREBASE_PROJECT_ID` | No | Server-only override for the project ID. |
| `FIREBASE_FIRESTORE_DATABASE_ID` | No | Server-only override for a named database. |

\* Required unless Application Default Credentials are available (e.g., on Cloud Run with an attached service account).

---

## 🎯 XP and anti-farming rules

| Activity | XP |
| --- | --- |
| Learning-path lesson (first completion) | 35–80 module XP |
| Quiz improvement | 5 XP per newly earned correct answer |
| First save of a vocabulary word | +5 |
| Marking a word as mastered | +2 |
| First culture exploration | +5 |
| First reading-story completion | +20 |
| Pronunciation drill | +5 per drill per day |
| AI roleplay scenario | +5 per scenario per day |
| Onboarding | +10 |
| Daily quests | 10–15 bonus XP |

Every award uses a deterministic transaction ID under `pointTransactions`, so replaying the same activity is a no-op. Quiz retries only earn XP when the learner beats their previous best score. Resetting progress increments `pointsEpoch` instead of deleting the append-only transaction ledger.

---

## 📡 API endpoints

Public:
- `GET /api/health` — service health.
- `GET /api/health/db` — Firestore connectivity check.
- `GET /api/lessons`, `GET /api/lessons/:id`
- `GET /api/vocabulary`, `GET /api/vocabulary/:id`
- `GET /api/culture`, `GET /api/conversations`, `GET /api/daily-phrase`
- `POST /api/ai/chat` — rate-limited roleplay (20 messages/minute per user/IP)
- `POST /api/ai/explain` — phrase deep dive

Authenticated (Bearer Firebase ID token):
- `GET /api/progress`
- `POST /api/progress/complete`
- `POST /api/quiz/submit`
- `GET /api/vocabulary/saved`
- `POST /api/vocabulary/saved`
- `POST /api/activity/record`
- `GET /api/auth/me`
- `POST /api/auth/migrate`

The browser primarily writes progress directly through the Firestore client SDK. The authenticated API routes exist for integrations and server-side validation.

---

## 🧪 Scripts

```bash
npm run dev          # Express + Vite dev middleware
npm run dev:client   # Vite only (proxies /api to localhost:3000)
npm run typecheck    # TypeScript check
npm run build        # Typecheck + Vite production build
npm start            # Production server on dist/
npm run preview      # Preview the built client
npm run deploy:rules # Deploy Firestore rules/indexes
npm run clean        # Remove dist/
```

---

## 🛠️ Troubleshooting

**“auth/operation-not-allowed” or “Guest sign-in is disabled”**  
Enable Email/Password, Google, and Anonymous providers in Firebase Authentication.

**“Domain 127.0.0.1 is not authorized”**  
Open `http://localhost:3000` (Firebase authorizes `localhost` by default), or add `127.0.0.1` and your production domain under Authentication → Settings → Authorized domains.

**“Missing or insufficient permissions”**  
Deploy `firestore.rules` and confirm the named database ID in `firebase-applet-config.json` matches Firestore.

**Google popup blocked**  
The app falls back to redirect sign-in. Add your domain under Firebase Authentication → Settings → Authorized domains.

**Server starts but Firestore Admin calls fail**  
Set `FIREBASE_SERVICE_ACCOUNT`, or run on a platform with Application Default Credentials. The client-side learning experience still works without Admin credentials.

**AI replies are generic**  
Set `GEMINI_API_KEY`. Without it the roleplay uses built-in pedagogical fallbacks.

**Progress appears out of date after signing in on another device**  
Firestore syncs automatically. Use the profile/settings menu to refresh, and ensure the same Firebase project/database is configured everywhere.

---

## 📁 Project structure

```
src/
  components/       UI: studio, quizzes, reader, culture, pronunciation, gamification
  context/          AuthContext
  data/             Lessons, quizzes, vocabulary, culture, reading, learning path
  lib/              Firebase, gamification, speech, AI API client
  pages/            Login, Dashboard, 404
server/
  firebaseAdmin.ts  Admin SDK adapter + auth middleware
  ai.ts             Gemini roleplay and explanation service
server.ts           Express REST API, security headers, static serving
firestore.rules     Firestore security rules
Dockerfile          Production image
```

---

## 🏛️ Kannada Digital Innovation Challenge 2026

*“ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ”* — May glorious Kannada triumph, may glorious Kannada flourish.
