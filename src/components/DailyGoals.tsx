import React, { useState } from 'react';
import {
  BookOpen,
  Zap,
  Bookmark,
  Mic,
  MessageSquare,
  Flame,
  Clock,
  CheckCircle2,
  Gift,
  Sparkles,
} from 'lucide-react';
import { DAILY_QUESTS, getQuestProgress, getTodayKey } from '../lib/gamification';

interface DailyGoalsProps {
  progressData: any;
  onClaimQuest: (questId: string) => Promise<void>;
}

const QUEST_ICONS = {
  BookOpen,
  Zap,
  Bookmark,
  Mic,
  MessageSquare,
} as const;

export const DailyGoals: React.FC<DailyGoalsProps> = ({ progressData, onClaimQuest }) => {
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const today = getTodayKey();
  const sameDay = progressData?.dailyQuestDate === today;
  const questProgress: Record<string, number> = sameDay ? progressData?.dailyQuestProgress || {} : {};
  const claimed: string[] = sameDay ? progressData?.claimedQuestIds || [] : [];

  const minutesToday = progressData?.dailyMinutesDate === today ? Number(progressData?.dailyMinutesToday) || 0 : 0;
  const minutesTarget = Number(progressData?.dailyStudyTarget) || 10;
  const minutesPct = Math.min(100, Math.round((minutesToday / minutesTarget) * 100));
  const completedQuests = DAILY_QUESTS.filter((q) => getQuestProgress(q, questProgress).isComplete).length;
  const claimedCount = DAILY_QUESTS.filter((q) => claimed.includes(q.id)).length;

  const handleClaim = async (questId: string) => {
    setClaimingId(questId);
    setError(null);
    try {
      await onClaimQuest(questId);
    } catch (err: any) {
      setError(err.message || 'Could not claim this quest yet.');
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-[#E6E0D5] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#F0ECE1]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>ಇಂದಿನ ಗುರಿಗಳು • Today&apos;s Goals</span>
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#183B28]">Daily Study Goals & Quests</h3>
          <p className="text-xs sm:text-sm text-[#526056] mt-1">
            Finish quests to earn bonus XP. Progress resets at midnight, while your streak keeps growing.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs font-bold">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            {progressData?.streakDays || 1}-day streak
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold">
            <Gift className="w-4 h-4 text-indigo-600" />
            {claimedCount}/{DAILY_QUESTS.length} claimed
          </span>
        </div>
      </div>

      {/* Daily minutes target */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FAF8F4] via-[#F7F2E7] to-[#FAF8F4] border border-[#E0D7C7] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-[#183B28]">Daily study target</span>
          </div>
          <span className="text-xs font-bold text-[#526056]">
            {minutesToday} / {minutesTarget} min
          </span>
        </div>
        <div className="w-full h-3 bg-[#E6E0D5] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-[#183B28] rounded-full transition-all duration-500"
            style={{ width: `${minutesPct}%` }}
          />
        </div>
        <p className="text-[11px] text-[#526056] mt-2">
          {minutesPct >= 100
            ? 'Target reached! Every extra minute strengthens your Kannada.'
            : `${Math.max(0, minutesTarget - minutesToday)} more minute${minutesTarget - minutesToday === 1 ? '' : 's'} to hit today's goal.`}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Quest cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DAILY_QUESTS.map((quest) => {
          const Icon = QUEST_ICONS[quest.icon];
          const state = getQuestProgress(quest, questProgress);
          const isClaimed = claimed.includes(quest.id);
          const isClaiming = claimingId === quest.id;

          return (
            <div
              key={quest.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition-all ${
                isClaimed
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : state.isComplete
                  ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                  : 'bg-[#FAF8F4] border-[#E8E2D5]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isClaimed
                        ? 'bg-emerald-100 text-emerald-700'
                        : state.isComplete
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-white text-[#183B28] border border-[#E6E0D5]'
                    }`}
                  >
                    {isClaimed ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    +{quest.reward} XP
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#183B28] leading-snug">{quest.title}</h4>
                <p className="font-kannada text-[11px] text-[#707F74]">{quest.titleKannada}</p>
                <p className="text-[11px] text-[#526056] mt-1 leading-relaxed">{quest.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#707F74] mb-1">
                  <span>
                    {Math.min(state.current, state.target)} / {state.target}
                  </span>
                  <span>{state.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#E2DBD0] rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isClaimed ? 'bg-emerald-600' : state.isComplete ? 'bg-amber-500' : 'bg-[#183B28]'
                    }`}
                    style={{ width: `${state.pct}%` }}
                  />
                </div>

                {isClaimed ? (
                  <span className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Claimed
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!state.isComplete || isClaiming}
                    onClick={() => handleClaim(quest.id)}
                    className="cursor-pointer w-full py-1.5 rounded-lg bg-[#183B28] hover:bg-[#122D1F] disabled:bg-[#E2DBD0] disabled:text-[#8C9B90] text-white text-[11px] font-bold transition-colors"
                  >
                    {isClaiming ? 'Claiming...' : state.isComplete ? 'Claim Reward' : 'In progress'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-[#707F74] text-center">
        {completedQuests} of {DAILY_QUESTS.length} quests complete today. New quests arrive at midnight.
      </p>
    </section>
  );
};

export default DailyGoals;
