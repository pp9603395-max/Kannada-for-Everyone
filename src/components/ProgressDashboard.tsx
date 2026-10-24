import React, { useState } from 'react';
import {
  Award,
  Flame,
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Volume2,
  Lock,
  Check,
  Crown,
  Compass,
  ShieldCheck,
  Info,
  Calendar,
  Zap,
  Footprints,
  HelpCircle,
  Target,
  CalendarCheck,
  Bookmark,
  Library,
  Globe,
  Landmark,
  Mic,
  Star,
  Trophy,
  GraduationCap,
} from 'lucide-react';
import { Lesson, VocabularyItem, ExplanationLanguage, Badge, AuthProvider } from '../types';
import { speechService } from '../lib/speech';
import { getLevelInfo, computeAchievements, AchievementStats } from '../lib/gamification';
import { DailyGoals } from './DailyGoals';
import { Leaderboard } from './Leaderboard';
import { ActivityFeed } from './ActivityFeed';

interface ProgressDashboardProps {
  progressData: {
    userId: string;
    name: string;
    email?: string;
    picture?: string;
    photoURL?: string;
    authProvider?: AuthProvider;
    isGuest: boolean;
    level: string;
    preferredLanguage: ExplanationLanguage;
    streakDays: number;
    points: number;
    completedLessons: string[];
    savedWords: string[];
    quizScores: {
      quizId: string;
      score: number;
      total: number;
      bestScore?: number;
      completedAt: string;
    }[];
    badges?: Badge[];
    activityLogs?: any[];
    lastActiveDate?: string;
    createdAt?: string;
    dailyMinutesToday?: number;
    dailyMinutesDate?: string;
    dailyStudyTarget?: 5 | 10 | 15 | 20;
    dailyQuestDate?: string;
    dailyQuestProgress?: Record<string, number>;
    claimedQuestIds?: string[];
    exploredCultureIds?: string[];
    readingCompletedIds?: string[];
    pronunciationAttempts?: number;
    avatar?: string;
  } | null;
  lessons: Lesson[];
  savedVocabularyItems: VocabularyItem[];
  onSelectLesson: (lesson: Lesson) => void;
  onOpenAuth: () => void;
  onClaimQuest?: (questId: string) => Promise<void>;
  onOpenCertificate?: () => void;
  refreshKey?: number;
}

// Standard badge definitions matching exact thresholds
const STANDARD_BADGES = [
  {
    id: 'badge-bronze',
    name: 'Bronze Learner',
    nameKannada: 'ಕಂಚಿನ ಕಲಿಯುವವರು',
    description: 'Earn 100–299 learning points by completing introductory dialogues, quizzes, and vocabulary.',
    tier: 'bronze' as const,
    minPoints: 100,
    maxPoints: 299,
    icon: Award,
    colorTheme: {
      earnedBg: 'bg-amber-50/90 border-amber-400 shadow-md',
      earnedIcon: 'text-amber-800 bg-amber-200 border-amber-400',
      earnedPill: 'bg-amber-100 text-amber-900 border-amber-300',
      barColor: 'bg-amber-600',
    },
  },
  {
    id: 'badge-silver',
    name: 'Silver Learner',
    nameKannada: 'ಬೆಳ್ಳಿಯ ಕಲಿಯುವವರು',
    description: 'Earn 300–599 learning points through consistent daily practice across multiple real-life situations.',
    tier: 'silver' as const,
    minPoints: 300,
    maxPoints: 599,
    icon: Compass,
    colorTheme: {
      earnedBg: 'bg-slate-50/90 border-slate-400 shadow-md',
      earnedIcon: 'text-slate-800 bg-slate-200 border-slate-400',
      earnedPill: 'bg-slate-100 text-slate-900 border-slate-300',
      barColor: 'bg-slate-600',
    },
  },
  {
    id: 'badge-gold',
    name: 'Gold Learner',
    nameKannada: 'ಚಿನ್ನದ ಕಲಿಯುವವರು',
    description: 'Earn 600–999 learning points demonstrating advanced conversation, cultural mastery, and quizzes.',
    tier: 'gold' as const,
    minPoints: 600,
    maxPoints: 999,
    icon: Sparkles,
    colorTheme: {
      earnedBg: 'bg-yellow-50/90 border-yellow-400 shadow-lg ring-1 ring-yellow-400/40',
      earnedIcon: 'text-yellow-800 bg-yellow-200 border-yellow-400',
      earnedPill: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      barColor: 'bg-yellow-500',
    },
  },
  {
    id: 'badge-platinum',
    name: 'Platinum Learner',
    nameKannada: 'ಪ್ಲಾಟಿನಂ ಕಲಿಯುವವರು',
    description: 'Earn 1,000+ learning points achieving full cultural and conversational fluency in Kannada.',
    tier: 'platinum' as const,
    minPoints: 1000,
    maxPoints: Infinity,
    icon: Crown,
    colorTheme: {
      earnedBg: 'bg-emerald-50/90 border-emerald-400 shadow-xl ring-2 ring-emerald-400/40',
      earnedIcon: 'text-emerald-900 bg-emerald-200 border-emerald-400',
      earnedPill: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      barColor: 'bg-emerald-600',
    },
  },
];

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progressData,
  lessons,
  savedVocabularyItems,
  onSelectLesson,
  onOpenAuth,
  onClaimQuest,
  onOpenCertificate,
  refreshKey = 0,
}) => {
  const completedCount = progressData?.completedLessons?.length || 0;
  const totalLessons = lessons.length;
  const streak = progressData?.streakDays || 1;
  const points = typeof progressData?.points === 'number' ? progressData.points : 0;
  const level = getLevelInfo(points);
  const savedWordsCount = progressData?.savedWords?.length || 0;
  const quizScores = progressData?.quizScores || [];
  const perfectQuizzes = quizScores.filter(
    (q) => (q.bestScore ?? q.score) >= q.total && q.total > 0
  ).length;

  const achievementStats: AchievementStats = {
    points,
    lessonsCompleted: completedCount,
    quizzesTaken: quizScores.length,
    perfectQuizzes,
    streakDays: streak,
    savedWords: savedWordsCount,
    cultureExplored: progressData?.exploredCultureIds?.length || 0,
    storiesRead: progressData?.readingCompletedIds?.length || 0,
    pronunciationAttempts: progressData?.pronunciationAttempts || 0,
  };
  const achievements = computeAchievements(achievementStats);
  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const achievementIcons: Record<string, React.ElementType> = {
    Footprints,
    Compass,
    Crown,
    HelpCircle,
    Zap,
    Target,
    Flame,
    CalendarCheck,
    Bookmark,
    Library,
    Globe,
    Landmark,
    BookOpen,
    Mic,
    Award,
    Star,
    Sparkles,
  };

  // Calculate earned and locked badges strictly from points
  const badgeStates = STANDARD_BADGES.map((b) => {
    const isUnlocked = points >= b.minPoints;
    // Look for unlockedAt date from server progressData badges if available
    const serverBadge = progressData?.badges?.find((sb) => sb.id === b.id);
    const earnedDate = isUnlocked
      ? serverBadge?.unlockedAt
        ? new Date(serverBadge.unlockedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Earned'
      : null;

    // Progress percentage towards this badge
    const progressPct = Math.min(100, Math.round((points / b.minPoints) * 100));

    return {
      ...b,
      isUnlocked,
      earnedDate,
      progressPct,
    };
  });

  const earnedBadgesCount = badgeStates.filter((b) => b.isUnlocked).length;

  // Find the next badge to earn
  const nextBadge = badgeStates.find((b) => !b.isUnlocked);
  const pointsToNextBadge = nextBadge ? Math.max(0, nextBadge.minPoints - points) : 0;
  const nextBadgePct = nextBadge
    ? Math.min(100, Math.round((points / nextBadge.minPoints) * 100))
    : 100;

  // Find next uncompleted lesson
  const nextLesson =
    lessons.find((l) => !progressData?.completedLessons?.includes(l.id)) ||
    lessons[0];

  const handleSpeak = (text: string) => {
    speechService.speak(text, { rate: 0.85 });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner with User Profile & Provider */}
      <div className="bg-[#183B28] rounded-3xl p-6 sm:p-8 text-white border border-[#235037] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          {progressData?.picture ? (
            <img
              src={progressData.picture}
              alt={progressData.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-md shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-[#183B28] font-bold text-2xl flex items-center justify-center border-2 border-white/20 shrink-0 shadow-md">
              {progressData?.name ? progressData.name.charAt(0).toUpperCase() : 'ಕ'}
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full bg-white/10 text-amber-200 text-xs font-semibold uppercase tracking-wider">
                ನಿಮ್ಮ ಪ್ರಗತಿ • Learning Portfolio
              </span>
              {progressData?.authProvider === 'google' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[11px] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Google Account</span>
                </span>
              )}
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Welcome back, {progressData?.name || 'Kannada Explorer'}!
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1">
              {progressData?.email && <span className="font-medium mr-2">{progressData.email}</span>}
              {progressData?.isGuest
                ? 'You are in guest mode. Sign in to save your streaks, badges, and progress permanently.'
                : 'Your learning achievements and badges are securely synced to your account.'}
            </p>

            <div className="mt-3 w-full max-w-sm">
              <div className="flex items-center justify-between text-[11px] font-semibold text-amber-100 mb-1">
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Level {level.level} • {level.title}
                </span>
                <span>{level.progressPct}%</span>
              </div>
              <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full transition-all duration-500"
                  style={{ width: `${level.progressPct}%` }}
                />
              </div>
              <p className="text-[10px] text-white/60 mt-1">
                {level.nextLevelPoints
                  ? `${level.pointsToNextLevel} XP to Level ${level.level + 1}`
                  : 'Maximum level reached — keep inspiring others!'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          {onOpenCertificate && completedCount > 0 && (
            <button
              onClick={onOpenCertificate}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#183B28] font-bold text-xs transition-colors shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>Certificate</span>
            </button>
          )}
          {progressData?.isGuest ? (
            <button
              onClick={onOpenAuth}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20"
            >
              <span>Save My Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors border border-white/20"
            >
              <span>Manage Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Daily goals and quests */}
      {onClaimQuest && (
        <DailyGoals
          progressData={{
            ...(progressData || {}),
            streakDays: streak,
            points,
          }}
          onClaimQuest={onClaimQuest}
        />
      )}

      {/* FIX 1: MY BADGES & ACHIEVEMENTS SECTION */}
      <div id="my-badges" className="bg-white rounded-3xl border border-[#E6E0D5] p-6 sm:p-8 shadow-xs">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#F0ECE1]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>ಸಾಧನಾ ಬ್ಯಾಡ್ಜ್‌ಗಳು • Mastery Milestones</span>
            </div>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#183B28]">
              My Badges & Achievements
            </h3>
            <p className="text-xs sm:text-sm text-[#526056] mt-1 max-w-xl">
              Earn cumulative recognition across Karnataka conversations and quizzes. Earned badges remain yours permanently.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="px-4 py-2.5 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5] text-right">
              <span className="text-[11px] font-bold text-[#707F74] uppercase tracking-wider block">
                Total Points
              </span>
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#183B28]">
                {points} XP
              </span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-right">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Badges Earned
              </span>
              <span className="font-serif font-bold text-xl sm:text-2xl text-amber-900">
                {earnedBadgesCount} / 4
              </span>
            </div>
          </div>
        </div>

        {/* Next Badge Progress Card */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#FAF8F4] via-[#F7F2E7] to-[#FAF8F4] border border-[#E0D7C7]">
          {nextBadge ? (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span className="text-xs font-bold text-[#183B28]">
                    Next Achievement Goal: <span className="underline">{nextBadge.name}</span> ({nextBadge.nameKannada})
                  </span>
                </div>
                <span className="text-xs font-bold text-[#707F74]">
                  {pointsToNextBadge} points needed ({points} / {nextBadge.minPoints} pts)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-[#E6E0D5] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[#183B28] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${nextBadgePct}%` }}
                />
              </div>

              <p className="text-[11px] text-[#526056] mt-2">
                Complete dialogues (+10 pts each) and situational quizzes (+5 pts per correct answer) to unlock {nextBadge.name}.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-emerald-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-sm">Congratulations! All 4 Badges Unlocked!</p>
                <p className="text-xs text-emerald-700">
                  You have surpassed 1,000 points and achieved the highest Platinum Learner rank in Kannada for Everyone.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Zero Points Empty State Banner */}
        {points === 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <p className="font-bold mb-0.5">Start your Kannada learning journey!</p>
              <p>
                You currently have 0 points. All four badges are currently locked. Start practicing situational conversations (such as Greetings or Restaurant ordering) or take a quiz to reach 100 points and unlock your first badge: <strong>Bronze Learner</strong>.
              </p>
            </div>
          </div>
        )}

        {/* 4 Standard Badges Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badgeStates.map((b) => {
            const Icon = b.icon;
            const isUnlocked = b.isUnlocked;

            return (
              <div
                key={b.id}
                className={`relative rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  isUnlocked
                    ? `${b.colorTheme.earnedBg}`
                    : 'bg-[#FAF8F4]/60 border-[#E8E2D5] opacity-85 hover:opacity-100'
                }`}
              >
                <div>
                  {/* Top Status Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                        isUnlocked
                          ? `${b.colorTheme.earnedIcon} shadow-xs scale-105`
                          : 'bg-[#EAE4D7] text-[#8C9B90] border-[#DDD5C7]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {isUnlocked ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${b.colorTheme.earnedPill}`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Earned</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EAE4D7] text-[#6E7D72] border border-[#DDD5C7]">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  {/* Badge Titles */}
                  <div className="mb-2">
                    <p className="font-kannada font-bold text-base text-[#183B28]">
                      {b.nameKannada}
                    </p>
                    <h4 className="font-serif font-bold text-lg text-[#2A2E2B] leading-snug">
                      {b.name}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#526056] leading-relaxed mb-4">
                    {b.description}
                  </p>
                </div>

                {/* Bottom Details & Progress */}
                <div className="pt-3 border-t border-black/5">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#707F74]">Threshold:</span>
                    <span className="text-[#183B28] font-bold">
                      {b.minPoints === 1000 ? '1,000+ pts' : `${b.minPoints}–${b.maxPoints} pts`}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <div className="flex items-center justify-between text-[11px] text-emerald-800 font-medium bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Unlocked</span>
                      </span>
                      <span>{b.earnedDate || 'Active'}</span>
                    </div>
                  ) : (
                    <div>
                      <div className="w-full h-2 bg-[#E2DBD0] rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-[#183B28] rounded-full transition-all duration-300"
                          style={{ width: `${b.progressPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#707F74]">
                        <span>Progress: {points} / {b.minPoints}</span>
                        <span>{b.progressPct}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="bg-white rounded-3xl border border-[#E6E0D5] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#F0ECE1]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5 text-indigo-600" />
              <span>ಸಾಧನೆಗಳು • Achievement Gallery</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#183B28]">Milestones Beyond Badges</h3>
            <p className="text-xs sm:text-sm text-[#526056] mt-1">
              Lessons, quizzes, streaks, words, culture, reading, and pronunciation all unlock achievements.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
              {unlockedAchievements.length} / {achievements.length} unlocked
            </span>
            {onOpenCertificate && completedCount > 0 && (
              <button
                type="button"
                onClick={onOpenCertificate}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#183B28] hover:bg-[#122D1F] text-white text-xs font-bold transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                Certificate
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((achievement) => {
            const Icon = achievementIcons[achievement.icon] || Award;
            const tierStyles: Record<string, string> = {
              bronze: 'bg-amber-50 border-amber-200 text-amber-800',
              silver: 'bg-slate-50 border-slate-300 text-slate-700',
              gold: 'bg-yellow-50 border-yellow-300 text-yellow-800',
              platinum: 'bg-emerald-50 border-emerald-300 text-emerald-800',
            };
            return (
              <div
                key={achievement.id}
                className={`rounded-2xl border p-4 transition-all ${
                  achievement.isUnlocked
                    ? `${tierStyles[achievement.tier]} shadow-xs`
                    : 'bg-[#FAF8F4]/70 border-[#E8E2D5] opacity-85'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      achievement.isUnlocked
                        ? 'bg-white/80 border-current/20'
                        : 'bg-[#EAE4D7] border-[#DDD5C7] text-[#8C9B90]'
                    }`}
                  >
                    {achievement.isUnlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm text-[#183B28] truncate">{achievement.name}</p>
                      {achievement.isUnlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="font-kannada text-[11px] text-[#707F74] truncate">{achievement.nameKannada}</p>
                    <p className="text-[11px] text-[#526056] mt-1 leading-relaxed">{achievement.description}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#707F74] mb-1">
                    <span>{Math.min(achievement.value, achievement.target)} / {achievement.target}</span>
                    <span>{achievement.progressPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E2DBD0] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${achievement.isUnlocked ? 'bg-emerald-600' : 'bg-[#183B28]'}`}
                      style={{ width: `${achievement.progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E6E0D5] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#707F74] uppercase">Streak</span>
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          </div>
          <p className="font-serif font-bold text-3xl text-[#183B28]">{streak} Days</p>
          <p className="text-[11px] text-[#526056] mt-0.5">Consecutive daily practice</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E0D5] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#707F74] uppercase">Completed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-serif font-bold text-3xl text-[#183B28]">
            {completedCount} / {totalLessons}
          </p>
          <p className="text-[11px] text-[#526056] mt-0.5">Situational conversation modules</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E0D5] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#707F74] uppercase">Saved Words</span>
            <BookmarkCheck className="w-5 h-5 text-[#E07A5F]" />
          </div>
          <p className="font-serif font-bold text-3xl text-[#183B28]">
            {progressData?.savedWords?.length || 0}
          </p>
          <p className="text-[11px] text-[#526056] mt-0.5">In personal vocabulary revision</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E0D5] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#707F74] uppercase">Verified XP</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="font-serif font-bold text-3xl text-[#183B28]">{points}</p>
          <p className="text-[11px] text-[#526056] mt-0.5">Total learning points earned</p>
        </div>
      </div>

      {/* Recommended Next Lesson Card */}
      {nextLesson && (
        <div className="bg-gradient-to-r from-[#FAF8F4] to-[#F5EFE4] rounded-3xl p-6 border border-[#E0D7C7] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#E07A5F] uppercase tracking-wider block mb-1">
              Recommended Next Lesson
            </span>
            <p className="font-kannada font-bold text-xl text-[#183B28]">
              {nextLesson.titleKannada} ({nextLesson.titleEnglish})
            </p>
            <p className="text-xs sm:text-sm text-[#526056] mt-1 max-w-xl">
              {nextLesson.description}
            </p>
          </div>

          <button
            onClick={() => onSelectLesson(nextLesson)}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#183B28] hover:bg-[#122D1F] text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <span>Continue Lesson</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      )}

      {/* Saved Words Flash Revision Section */}
      <div className="bg-white rounded-3xl border border-[#E6E0D5] p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-4 mb-5">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#183B28]">
              Saved Words for Quick Revision
            </h3>
            <p className="text-xs text-[#526056]">
              Words bookmarked during your dual-pane studio lessons.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#526056] border border-[#E6E0D5]">
            {savedVocabularyItems.length} Words
          </span>
        </div>

        {savedVocabularyItems.length === 0 ? (
          <div className="text-center py-8 text-[#88988D]">
            <p className="text-sm">No saved vocabulary yet.</p>
            <p className="text-xs mt-1">
              Tap the bookmark icon in Dual-Pane Studio or Vocabulary Builder to save words for daily review.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedVocabularyItems.map((word) => (
              <div
                key={word.id}
                className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5] flex items-start justify-between gap-2"
              >
                <div>
                  <p className="font-kannada font-bold text-lg text-[#183B28]">
                    {word.kannada}
                  </p>
                  <p className="font-mono text-xs text-[#5D6B60]">{word.transliteration}</p>
                  <p className="text-xs text-[#2A2E2B] font-medium mt-1">
                    {word.meanings.en}
                  </p>
                </div>
                <button
                  onClick={() => handleSpeak(word.kannada)}
                  className="cursor-pointer p-1.5 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#183B28] border border-[#DDD5C7]"
                  aria-label={`Pronounce ${word.kannada}`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {progressData?.userId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Leaderboard currentUserId={progressData.userId} refreshKey={refreshKey} />
          <ActivityFeed userId={progressData.userId} refreshKey={refreshKey} />
        </div>
      )}
    </section>
  );
};
export default ProgressDashboard;
