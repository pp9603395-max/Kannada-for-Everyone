import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Headphones,
  Compass,
  Award,
  ArrowRight,
  Flame,
  Volume2,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Zap,
  Trophy,
  Settings,
  Clock,
  Crown,
  Target,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { GyroscopeCursor } from '../components/reactbits/GyroscopeCursor';
import { TileReveal } from '../components/reactbits/TileReveal';
import { DailyPhrase } from '../components/DailyPhrase';
import { DualPaneStudio } from '../components/DualPaneStudio';
import { SituationLessons } from '../components/SituationLessons';
import { VocabularyBuilder } from '../components/VocabularyBuilder';
import { PronunciationPractice } from '../components/PronunciationPractice';
import { AIRoleplay } from '../components/AIRoleplay';
import { CultureExplorer } from '../components/CultureExplorer';
import { ProgressDashboard } from '../components/ProgressDashboard';
import { InteractiveQuiz } from '../components/InteractiveQuiz';
import { AuthModal } from '../components/AuthModal';
import { OnboardingModal } from '../components/OnboardingModal';
import { SettingsModal } from '../components/SettingsModal';
import { LearningPath } from '../components/LearningPath';
import { InteractiveReader } from '../components/InteractiveReader';
import { FAQSection } from '../components/FAQSection';
import { Footer } from '../components/Footer';
import { IntroductionPage } from '../components/IntroductionPage';
import { AchievementToast, ToastItem } from '../components/AchievementToast';
import { CertificateModal } from '../components/CertificateModal';
import {
  auth,
  completeLessonInFirestore,
  submitQuizScoreInFirestore,
  toggleSavedVocabularyInFirestore,
  saveUserPreferencesInFirestore,
  saveVocabStatusInFirestore,
  setLastStudiedLessonInFirestore,
  recordStudyMinutesInFirestore,
  resetUserProgressInFirestore,
  markCultureExploredInFirestore,
  markReadingCompleteInFirestore,
  recordPronunciationAttemptInFirestore,
  recordRoleplayMilestoneInFirestore,
  claimDailyQuestInFirestore,
  awardFirebasePoints,
} from '../lib/firebase';
import { getLevelInfo, playSuccessSound, getTodayKey } from '../lib/gamification';
import { READING_STORIES } from '../data/readingData';
import { STRUCTURED_LEARNING_PATH } from '../data/learningPathData';
import {
  Lesson,
  VocabularyItem,
  RoleplayScenario,
  CulturalItem,
  ExplanationLanguage,
  Quiz,
  UserLevel,
  LearningGoal,
  DailyStudyTarget,
  VocabMasteryStatus,
} from '../types';
import {
  LESSONS,
  VOCABULARY_LIST,
  ROLEPLAY_SCENARIOS,
  CULTURAL_ITEMS,
  DAILY_PHRASE,
} from '../data/kannadaData';

export const DashboardPage: React.FC = () => {
  const { user, loading: authLoading, logout, setUser, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>(() => {
    const requested = new URLSearchParams(window.location.search).get('tab');
    const allowed = [
      'home',
      'studio',
      'lessons',
      'vocabulary',
      'pronunciation',
      'roleplay',
      'culture',
      'reader',
      'path',
      'progress',
      'faq',
      'intro',
    ];
    return requested && allowed.includes(requested) ? requested : 'home';
  });
  const [preferredLanguage, setPreferredLanguage] = useState<ExplanationLanguage>('en');
  const [progressData, setProgressData] = useState<any>(null);

  // Curriculum State
  const [lessons, setLessons] = useState<Lesson[]>(LESSONS);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(VOCABULARY_LIST);
  const [scenarios, setScenarios] = useState<RoleplayScenario[]>(ROLEPLAY_SCENARIOS);
  const [cultureItems, setCultureItems] = useState<CulturalItem[]>(CULTURAL_ITEMS);
  const [dailyPhraseData, setDailyPhraseData] = useState<any>(DAILY_PHRASE);

  // Active Quiz Modal state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Selected Lesson for Dual-Pane Studio
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(undefined);

  // Auth & Settings Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);

  // Gamification feedback
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [gamificationRefreshKey, setGamificationRefreshKey] = useState(0);

  const pushToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    playSuccessSound(
      toast.kind === 'badge' || toast.kind === 'achievement' || toast.kind === 'level'
        ? 'achievement'
        : 'xp'
    );
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 6500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const bumpGamification = useCallback(() => {
    setGamificationRefreshKey((key) => key + 1);
  }, []);

  // Synchronize progressData whenever user updates from AuthContext
  useEffect(() => {
    if (user) {
      setProgressData((prev: any) => ({
        ...prev,
        ...user,
        userId: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        photoURL: user.photoURL,
        points: user.points,
        badges: user.badges,
        savedWords: user.savedWordIds || prev?.savedWords || [],
        completedLessons: user.completedLessonIds || prev?.completedLessons || [],
        streakDays: user.streakDays || 1,
      }));
      if (user.preferredLanguage) {
        setPreferredLanguage(user.preferredLanguage);
      }
    }
  }, [user]);

  // Show onboarding for new learners who have not completed the preference flow.
  useEffect(() => {
    if (user && user.onboardingCompleted === false) {
      setOnboardingModalOpen(true);
    }
  }, [user?.id, user?.onboardingCompleted]);

  // Study-minute tracking: one Firestore increment per visible minute. The
  // helper resets automatically at midnight and caps abuse at 600 minutes/day.
  useEffect(() => {
    if (!user) return;
    const interval = window.setInterval(async () => {
      if (!auth.currentUser || document.visibilityState !== 'visible') return;
      try {
        const updatedMinutes = await recordStudyMinutesInFirestore(auth.currentUser.uid, 1);
        setProgressData((prev: any) => ({
          ...prev,
          dailyMinutesToday: updatedMinutes,
          dailyMinutesDate: getTodayKey(),
        }));
      } catch {
        // Non-critical: study time is a soft metric.
      }
    }, 60_000);
    return () => window.clearInterval(interval);
  }, [user?.id]);

  // Sign out handler
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (e) {
      console.warn('Logout error:', e);
      navigate('/login', { replace: true });
    }
  };

  const celebrateResult = useCallback(
    (
      result: { updatedPoints?: number; newlyUnlockedBadges?: any[] },
      previousPoints: number,
      description: string
    ) => {
      const updatedPoints = Number(result.updatedPoints ?? previousPoints);
      const delta = Math.max(0, updatedPoints - previousPoints);
      if (delta > 0) {
        pushToast({
          kind: 'xp',
          title: `+${delta} XP earned`,
          description,
          points: delta,
          icon: <Zap className="w-5 h-5" />,
        });
      }
      (result.newlyUnlockedBadges || []).forEach((badge: any) => {
        pushToast({
          kind: 'badge',
          title: `${badge.name} unlocked!`,
          description: badge.description || 'A new cumulative badge is now yours.',
          icon: <Award className="w-5 h-5" />,
        });
      });
      const before = getLevelInfo(previousPoints);
      const after = getLevelInfo(updatedPoints);
      if (after.level > before.level) {
        pushToast({
          kind: 'level',
          title: `Level ${after.level}: ${after.title}`,
          description: `You reached ${updatedPoints} XP. ${after.titleKannada}.`,
          icon: <Crown className="w-5 h-5" />,
        });
      }
      bumpGamification();
      void refreshProfile();
    },
    [bumpGamification, pushToast, refreshProfile]
  );

  // Requirement 3: Loading screen while Firebase checks authentication state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FBF8F2] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-3xl bg-[#183B28] text-amber-200 flex items-center justify-center font-kannada font-bold text-3xl shadow-lg shadow-[#183B28]/20 animate-pulse mb-4">
          ಕ
        </div>
        <h2 className="font-serif font-bold text-xl text-[#183B28]">Kannada for Everyone</h2>
        <p className="font-kannada text-xs text-[#526056] mt-1">ಕನ್ನಡ ಎಲ್ಲರಿಗೂ • ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...</p>
        <div className="mt-6 flex items-center gap-2.5 text-xs text-[#526056] bg-white px-4 py-2.5 rounded-full border border-[#E6E0D5] shadow-xs">
          <span className="w-4 h-4 border-2 border-[#183B28] border-t-transparent rounded-full animate-spin" />
          <span>Verifying authentication status...</span>
        </div>
      </div>
    );
  }

  // Requirement 3: Protect routes - If signed-out, redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Toggle saved word with Firestore sync
  const handleToggleSavedWord = async (wordId: string) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;

    const previous = progressData?.savedWords || [];
    try {
      const updatedWordIds = await toggleSavedVocabularyInFirestore(currentUid, wordId);
      const wasAdded = updatedWordIds.length > previous.length;
      setProgressData((prev: any) => ({
        ...prev,
        savedWords: updatedWordIds,
        savedWordIds: updatedWordIds,
      }));
      if (wasAdded) {
        pushToast({
          kind: 'xp',
          title: '+5 XP • New word saved',
          description: 'Find it in Vocabulary Builder and your saved-words revision list.',
          points: 5,
          icon: <BookOpen className="w-5 h-5" />,
        });
      }
      bumpGamification();
      void refreshProfile();
    } catch (err) {
      console.warn('Saved word toggle note:', err);
    }
  };

  // Persist LingQ-style vocabulary mastery status
  const handleUpdateVocabStatus = async (wordId: string, status: VocabMasteryStatus) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;
    const previousStatus = progressData?.vocabStatus?.[wordId];
    try {
      const updatedMap = await saveVocabStatusInFirestore(currentUid, wordId, status);
      setProgressData((prev: any) => ({ ...prev, vocabStatus: updatedMap }));
      if (status === 'mastered' && previousStatus !== 'mastered') {
        pushToast({
          kind: 'xp',
          title: 'Word mastered!',
          description: 'A mastered word earns +2 XP and stays in your personal dictionary.',
          points: 2,
          icon: <Target className="w-5 h-5" />,
        });
      }
      bumpGamification();
      void refreshProfile();
    } catch (err) {
      console.warn('Vocabulary mastery note:', err);
    }
  };

  // Complete lesson with Firestore point award (XP comes from the learning-path module)
  const handleLessonComplete = async (lessonId: string) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;

    const module = STRUCTURED_LEARNING_PATH.flatMap((level) => level.modules).find(
      (m) => m.lessonId === lessonId
    );
    const lesson = lessons.find((l) => l.id === lessonId);
    const xpReward = module?.xpReward || 10;
    const title = lesson?.titleEnglish || module?.titleEnglish || lessonId;
    const previousPoints = Number(progressData?.points) || 0;

    try {
      const result = await completeLessonInFirestore(currentUid, lessonId, xpReward, title);
      setProgressData((prev: any) => {
        const comp = prev?.completedLessons || prev?.completedLessonIds || [];
        const nextComp = comp.includes(lessonId) ? comp : [...comp, lessonId];
        return {
          ...prev,
          completedLessons: nextComp,
          completedLessonIds: nextComp,
          points: result.updatedPoints,
          streakDays: result.streakDays,
          lastLessonId: lessonId,
        };
      });
      if (user) setUser({ ...user, points: result.updatedPoints });
      celebrateResult(result, previousPoints, `Completed “${title}”`);
      if (result.isNewCompletion) {
        pushToast({
          kind: 'quest',
          title: 'Daily lesson quest updated',
          description: 'Your first completion counts toward the Warm-up quest and unlocks the next module.',
          icon: <CheckCircle2 className="w-5 h-5" />,
        });
      }
    } catch (err) {
      console.warn('Lesson completion note:', err);
      pushToast({
        kind: 'xp',
        title: 'Could not sync lesson XP',
        description: 'Your lesson is still open. Check your connection and try again.',
        icon: <ShieldCheck className="w-5 h-5" />,
      });
    }
  };

  // Submit Quiz — XP is based on the learner's best score, so retries cannot farm points.
  const handleQuizComplete = async (score: number, total: number) => {
    if (!activeQuiz) return;
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;
    const previousPoints = Number(progressData?.points) || 0;

    try {
      const result = await submitQuizScoreInFirestore(currentUid, activeQuiz.id, score, total);
      setProgressData((prev: any) => {
        const scores = [...(prev?.quizScores || [])];
        const idx = scores.findIndex((s: any) => s.quizId === activeQuiz.id);
        const entry = {
          quizId: activeQuiz.id,
          score,
          bestScore: result.bestScore,
          total,
          completedAt: new Date().toISOString(),
        };
        if (idx >= 0) scores[idx] = entry;
        else scores.push(entry);
        return {
          ...prev,
          points: result.updatedPoints,
          streakDays: result.streakDays,
          quizScores: scores,
        };
      });
      if (user) setUser({ ...user, points: result.updatedPoints });
      celebrateResult(result, previousPoints, `Quiz result: ${score}/${total}`);
      if (result.pointsAwarded > 0) {
        pushToast({
          kind: 'quest',
          title: 'New personal best saved',
          description: `${score}/${total} correct. Only new best-score progress earns XP — replays cannot farm points.`,
          icon: <Trophy className="w-5 h-5" />,
        });
      }
    } catch (err) {
      console.warn('Quiz submit note:', err);
    }
  };

  // Reading, culture, pronunciation, and roleplay persistence handlers
  const handleReadingComplete = async (storyId: string) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;
    const previousPoints = Number(progressData?.points) || 0;
    try {
      const result = await markReadingCompleteInFirestore(currentUid, storyId);
      setProgressData((prev: any) => ({
        ...prev,
        readingCompletedIds: result.readingCompletedIds,
      }));
      celebrateResult(result, previousPoints, 'Finished an immersion story');
      if (result.isNew) {
        pushToast({
          kind: 'quest',
          title: 'Story finished!',
          description: 'Reading immersion strengthens vocabulary in context, and this story now counts toward your achievements.',
          icon: <BookOpen className="w-5 h-5" />,
        });
      }
    } catch (err) {
      console.warn('Reading completion note:', err);
    }
  };

  const handleCultureExplore = async (cultureId: string) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;
    const previousPoints = Number(progressData?.points) || 0;
    try {
      const result = await markCultureExploredInFirestore(currentUid, cultureId);
      setProgressData((prev: any) => ({
        ...prev,
        exploredCultureIds: result.exploredCultureIds,
      }));
      celebrateResult(result, previousPoints, 'Explored Karnataka culture');
    } catch (err) {
      console.warn('Culture exploration note:', err);
    }
  };

  const handlePronunciationAttempt = async (drillId: string, score: number) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;
    const previousPoints = Number(progressData?.points) || 0;
    try {
      const result = await recordPronunciationAttemptInFirestore(currentUid, drillId);
      setProgressData((prev: any) => ({
        ...prev,
        pronunciationAttempts: result.attempts,
      }));
      celebrateResult(result, previousPoints, `Pronunciation drill scored ${score}%`);
    } catch (err) {
      console.warn('Pronunciation tracking note:', err);
    }
  };

  const handleRoleplayMilestone = async (scenarioId: string) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;
    const previousPoints = Number(progressData?.points) || 0;
    try {
      const result = await recordRoleplayMilestoneInFirestore(currentUid, scenarioId);
      celebrateResult(result, previousPoints, 'Practiced an AI roleplay conversation');
    } catch (err) {
      console.warn('Roleplay milestone note:', err);
    }
  };

  const handleClaimQuest = async (questId: string) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;
    const previousPoints = Number(progressData?.points) || 0;
    try {
      const result = await claimDailyQuestInFirestore(currentUid, questId);
      setProgressData((prev: any) => ({
        ...prev,
        points: result.updatedPoints,
        claimedQuestIds: [...(prev?.claimedQuestIds || []), questId],
      }));
      celebrateResult(result, previousPoints, 'Daily quest reward');
      pushToast({
        kind: 'quest',
        title: 'Daily quest claimed!',
        description: `+${result.reward} bonus XP added. New quests reset at midnight.`,
        icon: <Trophy className="w-5 h-5" />,
      });
    } catch (err: any) {
      pushToast({
        kind: 'xp',
        title: 'Quest not claimed',
        description: err?.message || 'Finish the quest first, then try again.',
        icon: <Target className="w-5 h-5" />,
      });
      throw err;
    }
  };

  const handleSaveOnboarding = async (prefs: {
    preferredLanguage: ExplanationLanguage;
    level: UserLevel;
    learningGoal: LearningGoal;
    dailyStudyTarget: DailyStudyTarget;
    onboardingCompleted: boolean;
  }) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;
    const previousPoints = Number(progressData?.points) || 0;
    try {
      await saveUserPreferencesInFirestore(currentUid, prefs);
      const result = await awardFirebasePoints(
        currentUid,
        'onboarding_complete',
        'onboarding',
        10,
        'Completed onboarding and set a learning plan'
      );
      setProgressData((prev: any) => ({
        ...prev,
        ...prefs,
        points: result.updatedPoints,
      }));
      setPreferredLanguage(prefs.preferredLanguage);
      setOnboardingModalOpen(false);
      celebrateResult(result, previousPoints, 'Personal learning plan created');
    } catch (err) {
      console.warn('Onboarding save note:', err);
    }
  };

  const handleSaveSettings = async (prefs: {
    preferredLanguage: ExplanationLanguage;
    level: UserLevel;
    learningGoal: LearningGoal;
    dailyStudyTarget: DailyStudyTarget;
  }) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;
    await saveUserPreferencesInFirestore(currentUid, prefs);
    setProgressData((prev: any) => ({ ...prev, ...prefs }));
    setPreferredLanguage(prefs.preferredLanguage);
    setSettingsModalOpen(false);
    void refreshProfile();
  };

  const handleResetProgress = async () => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;
    await resetUserProgressInFirestore(currentUid);
    const refreshed = await refreshProfile();
    if (refreshed) {
      setProgressData({
        ...(refreshed as any),
        userId: refreshed.id,
        savedWords: refreshed.savedWordIds || [],
        completedLessons: refreshed.completedLessonIds || [],
      });
      setPreferredLanguage(refreshed.preferredLanguage);
    }
    setSettingsModalOpen(false);
    setActiveTab('home');
    bumpGamification();
    pushToast({
      kind: 'xp',
      title: 'Progress reset',
      description: 'XP, badges, streaks, quests, and saved vocabulary were cleared. Your account remains secure.',
      icon: <ShieldCheck className="w-5 h-5" />,
    });
  };

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab('studio');
    if (auth.currentUser) {
      void setLastStudiedLessonInFirestore(auth.currentUser.uid, lessonId);
    }
  };

  // Reading stories use their own vocabulary IDs (bm-w1 etc.). Merge those
  // items into the saved-word display so bookmarks never disappear.
  const readingVocabularyItems: VocabularyItem[] = [];
  const seenReadingWordIds = new Set<string>();
  READING_STORIES.forEach((story) => {
    story.sentences.forEach((sentence) => {
      sentence.words.forEach((word) => {
        if (seenReadingWordIds.has(word.id)) return;
        seenReadingWordIds.add(word.id);
        readingVocabularyItems.push({
          id: word.id,
          kannada: word.kannada,
          transliteration: word.transliteration,
          meanings: word.meanings,
          category: 'Reading',
          level: 'beginner',
          exampleSentence: {
            kannada: sentence.kannada,
            transliteration: sentence.transliteration,
            meaning: sentence.translations.en,
          },
          pronunciationTip: word.grammarNote,
        });
      });
    });
  });

  const savedVocabularyItems = [...vocabulary, ...readingVocabularyItems].filter((v) =>
    progressData?.savedWords?.includes(v.id)
  );

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#242924] flex flex-col font-sans selection:bg-[#E07A5F]/20 selection:text-[#183B28]">
      {/* 1. React Bits Pro: Gyroscope Cursor */}
      <GyroscopeCursor color="#183B28" size={26} />

      {/* 2. Responsive Navigation Bar with Verified Real User info */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        preferredLanguage={preferredLanguage}
        setPreferredLanguage={(lang) => {
          setPreferredLanguage(lang);
          if (progressData) {
            setProgressData({ ...progressData, preferredLanguage: lang });
          }
        }}
        progressData={progressData}
        onOpenAuth={() => setAuthModalOpen(true)}
        onReturnToIntroduction={() => setActiveTab('intro')}
        onLogout={handleLogout}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1">
        {/* HOMEPAGE VIEW (Full 13-section progressive flow) */}
        {activeTab === 'home' && (
          <div>
            {/* Section 2: React Bits Pro Tile Reveal Hero */}
            <TileReveal
              onStartLearning={() => setActiveTab('studio')}
              onExploreCulture={() => setActiveTab('culture')}
            />

            {/* Section 3: Quick Language Selector banner */}
            <section className="max-w-5xl mx-auto px-4 py-6">
              <div className="bg-[#FAF7F2] border border-[#E6E0D5] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#183B28]">Explanation Language:</span>
                  <span className="text-[#526056]">
                    Explanations are displayed in your chosen language:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'mr', label: 'मराठी' },
                    { code: 'hi', label: 'हिंदी' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setPreferredLanguage(l.code as ExplanationLanguage)}
                      className={`cursor-pointer px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        preferredLanguage === l.code
                          ? 'bg-[#183B28] text-white shadow-xs'
                          : 'bg-white text-[#526056] border border-[#DDD5C7] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 4: Daily Conversational Phrase */}
            <DailyPhrase
              phrase={dailyPhraseData}
              preferredLanguage={preferredLanguage}
            />

            {/* Section 5: Learning Mode Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#183B28] mb-2">
                  Choose Your Learning Path
                </h2>
                <p className="text-sm text-[#526056]">
                  From beginner essentials to real-world street conversations in Bengaluru
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Path 1: Dual-Pane Studio */}
                <div
                  onClick={() => setActiveTab('studio')}
                  className="cursor-pointer group bg-[#FAF7F2] border border-[#E6E0D5] hover:border-[#183B28] rounded-2xl p-6 transition-all hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#183B28]/10 text-[#183B28] flex items-center justify-center mb-4 group-hover:bg-[#183B28] group-hover:text-amber-200 transition-colors">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-[#183B28] mb-1">
                    Dual-Pane Studio
                  </h3>
                  <p className="text-xs text-[#526056] mb-4">
                    Listen to natural dialogues while breaking down words with grammatical root analysis.
                  </p>
                  <span className="text-xs font-semibold text-[#183B28] inline-flex items-center gap-1 group-hover:underline">
                    <span>Enter Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Path 2: Learn by Situation */}
                <div
                  onClick={() => setActiveTab('situations')}
                  className="cursor-pointer group bg-[#FAF7F2] border border-[#E6E0D5] hover:border-[#183B28] rounded-2xl p-6 transition-all hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-[#183B28] mb-1">
                    10 Life Situations
                  </h3>
                  <p className="text-xs text-[#526056] mb-4">
                    Metro commutes, auto bargaining, kirana store groceries, and polite office chats.
                  </p>
                  <span className="text-xs font-semibold text-orange-800 inline-flex items-center gap-1 group-hover:underline">
                    <span>Browse Scenarios</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Path 3: Pronunciation Lab */}
                <div
                  onClick={() => setActiveTab('pronunciation')}
                  className="cursor-pointer group bg-[#FAF7F2] border border-[#E6E0D5] hover:border-[#183B28] rounded-2xl p-6 transition-all hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-[#183B28] mb-1">
                    Pronunciation Lab
                  </h3>
                  <p className="text-xs text-[#526056] mb-4">
                    Master retroflex consonants like ಳ, ಣ, ಷ with phonetic guides and audio.
                  </p>
                  <span className="text-xs font-semibold text-blue-800 inline-flex items-center gap-1 group-hover:underline">
                    <span>Practice Sounds</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Path 4: Culture & Progress */}
                <div
                  onClick={() => setActiveTab('culture')}
                  className="cursor-pointer group bg-[#FAF7F2] border border-[#E6E0D5] hover:border-[#183B28] rounded-2xl p-6 transition-all hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-[#183B28] mb-1">
                    Culture & Traditions
                  </h3>
                  <p className="text-xs text-[#526056] mb-4">
                    Explore Rajyotsava, Yakshagana, filter coffee etiquette, and Kannada literature.
                  </p>
                  <span className="text-xs font-semibold text-amber-800 inline-flex items-center gap-1 group-hover:underline">
                    <span>Explore Culture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </section>

            {/* Section 6: Verified User Progress Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-gradient-to-r from-[#183B28] to-[#122D1F] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cloud Firestore Verified Account</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif">
                    Welcome, {user.name}!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF7F2]/80 max-w-xl">
                    You have earned <strong>{progressData?.points || 0} points</strong> and unlocked{' '}
                    <strong>{progressData?.badges?.filter((b: any) => b.isUnlocked).length || 0} badges</strong>. Keep up your active streak!
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('progress')}
                    className="cursor-pointer px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#183B28] font-bold text-xs sm:text-sm shadow-md transition-colors"
                  >
                    View My Badges
                  </button>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors border border-white/20"
                  >
                    Profile Settings
                  </button>
                </div>
              </div>
            </section>

            {/* Section 11: Progress Dashboard preview */}
            <ProgressDashboard
              progressData={progressData}
              lessons={lessons}
              savedVocabularyItems={savedVocabularyItems}
              onSelectLesson={(lesson) => handleSelectLesson(lesson.id)}
              onOpenAuth={() => setAuthModalOpen(true)}
              onClaimQuest={handleClaimQuest}
              onOpenCertificate={() => setCertificateOpen(true)}
              refreshKey={gamificationRefreshKey}
            />

            {/* Section 12: Frequently Asked Questions */}
            <FAQSection />
          </div>
        )}

        {/* DEDICATED TAB: LEARNING PATH (Duolingo-inspired) */}
        {activeTab === 'path' && (
          <LearningPath
            completedLessonIds={progressData?.completedLessons || []}
            preferredLanguage={preferredLanguage}
            onSelectLessonById={handleSelectLesson}
            onOpenQuizById={(lessonId) => {
              const targetLesson = lessons.find((l) => l.id === lessonId);
              if (targetLesson?.quiz) {
                setActiveQuiz(targetLesson.quiz);
              }
            }}
          />
        )}

        {/* DEDICATED TAB: IMMERSION READER (LingQ-inspired) */}
        {activeTab === 'reader' && (
          <InteractiveReader
            preferredLanguage={preferredLanguage}
            savedWordIds={progressData?.savedWords || []}
            onToggleSavedWord={handleToggleSavedWord}
            completedStoryIds={progressData?.readingCompletedIds || []}
            onReadingComplete={handleReadingComplete}
          />
        )}

        {/* DEDICATED TAB: DUAL-PANE STUDIO */}
        {activeTab === 'studio' && (
          <div className="py-6">
            <DualPaneStudio
              lessons={lessons}
              initialLessonId={selectedLessonId}
              preferredLanguage={preferredLanguage}
              setPreferredLanguage={setPreferredLanguage}
              savedWordIds={progressData?.savedWords || []}
              onToggleSavedWord={handleToggleSavedWord}
              onLessonComplete={handleLessonComplete}
            />
          </div>
        )}

        {/* DEDICATED TAB: LEARN BY SITUATION */}
        {activeTab === 'situations' && (
          <SituationLessons
            lessons={lessons}
            completedLessonIds={progressData?.completedLessons || []}
            preferredLanguage={preferredLanguage}
            onSelectLesson={(lesson) => handleSelectLesson(lesson.id)}
            onOpenQuiz={(lesson) => setActiveQuiz(lesson.quiz)}
          />
        )}

        {/* DEDICATED TAB: VOCABULARY */}
        {activeTab === 'vocabulary' && (
          <VocabularyBuilder
            vocabulary={vocabulary}
            preferredLanguage={preferredLanguage}
            savedWordIds={progressData?.savedWords || []}
            onToggleSavedWord={handleToggleSavedWord}
            vocabStatus={progressData?.vocabStatus || {}}
            onUpdateVocabStatus={handleUpdateVocabStatus}
          />
        )}

        {/* DEDICATED TAB: PRONUNCIATION */}
        {activeTab === 'pronunciation' && (
          <PronunciationPractice
            attemptsCount={progressData?.pronunciationAttempts || 0}
            onAttempt={handlePronunciationAttempt}
          />
        )}

        {/* DEDICATED TAB: AI ROLEPLAY */}
        {activeTab === 'roleplay' && (
          <AIRoleplay
            scenarios={scenarios}
            preferredLanguage={preferredLanguage}
            onMilestone={(scenarioId) => handleRoleplayMilestone(scenarioId)}
          />
        )}

        {/* DEDICATED TAB: INTRODUCTION */}
        {activeTab === 'intro' && (
          <IntroductionPage
            onEnterDashboard={(tab) => setActiveTab(tab || 'studio')}
          />
        )}

        {/* DEDICATED TAB: CULTURE */}
        {activeTab === 'culture' && (
          <CultureExplorer
            items={cultureItems}
            exploredCultureIds={progressData?.exploredCultureIds || []}
            onExploreCulture={handleCultureExplore}
            onNavigateToStudio={() => setActiveTab('studio')}
          />
        )}

        {/* DEDICATED TAB: PROGRESS */}
        {activeTab === 'progress' && (
          <ProgressDashboard
            progressData={progressData}
            lessons={lessons}
            savedVocabularyItems={savedVocabularyItems}
            onSelectLesson={(lesson) => handleSelectLesson(lesson.id)}
            onOpenAuth={() => setAuthModalOpen(true)}
            onClaimQuest={handleClaimQuest}
            onOpenCertificate={() => setCertificateOpen(true)}
            refreshKey={gamificationRefreshKey}
          />
        )}
      </main>

      {/* QUIZ MODAL */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <InteractiveQuiz
              quiz={activeQuiz}
              preferredLanguage={preferredLanguage}
              onCompleteQuiz={handleQuizComplete}
              onClose={() => setActiveQuiz(null)}
            />
          </div>
        </div>
      )}

      {/* AUTH & PROFILE MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={user}
        onLogout={handleLogout}
        onUserChange={async (updatedUser) => {
          setUser(updatedUser);
          setProgressData((prev: any) => ({
            ...prev,
            ...updatedUser,
            userId: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            picture: updatedUser.picture,
            photoURL: updatedUser.photoURL,
            points: updatedUser.points,
            badges: updatedUser.badges,
          }));
          setPreferredLanguage(updatedUser.preferredLanguage);
        }}
      />

      {/* SETTINGS MODAL */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        user={user}
        onUpdatePreferences={handleSaveSettings}
        onResetProgress={handleResetProgress}
        onLogout={handleLogout}
      />

      {/* ONBOARDING MODAL */}
      <OnboardingModal
        isOpen={onboardingModalOpen}
        currentLanguage={preferredLanguage}
        currentLevel={(user.level || 'beginner') as UserLevel}
        currentGoal={user.learningGoal || 'conversation'}
        currentTarget={user.dailyStudyTarget || 10}
        userName={user.name}
        onSavePreferences={handleSaveOnboarding}
        onClose={() => setOnboardingModalOpen(false)}
      />

      {/* CERTIFICATE MODAL */}
      <CertificateModal
        isOpen={certificateOpen}
        onClose={() => setCertificateOpen(false)}
        user={user}
        completedLessons={progressData?.completedLessons?.length || 0}
        totalLessons={lessons.length}
      />

      {/* ACHIEVEMENT / XP TOASTS */}
      <AchievementToast toasts={toasts} onDismiss={dismissToast} />

      {/* Section 13: Accessible Culturally Inspired Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default DashboardPage;
