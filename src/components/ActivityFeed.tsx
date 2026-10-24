import React, { useCallback, useEffect, useState } from 'react';
import { Activity, BookOpen, HelpCircle, MessageSquare, Mic, Bookmark, Compass, BookMarked, Gift, Flame, Sparkles } from 'lucide-react';
import { getRecentActivity } from '../lib/firebase';
import { ActivityLog, ActivityType } from '../types';
import { formatRelativeTime } from '../lib/gamification';

interface ActivityFeedProps {
  userId: string;
  refreshKey?: number;
}

const TYPE_META: Record<ActivityType, { icon: React.ElementType; color: string; label: string }> = {
  lesson: { icon: BookOpen, color: 'bg-emerald-100 text-emerald-700', label: 'Lesson' },
  quiz: { icon: HelpCircle, color: 'bg-indigo-100 text-indigo-700', label: 'Quiz' },
  roleplay: { icon: MessageSquare, color: 'bg-purple-100 text-purple-700', label: 'Roleplay' },
  vocabulary: { icon: Bookmark, color: 'bg-amber-100 text-amber-700', label: 'Vocabulary' },
  pronunciation: { icon: Mic, color: 'bg-sky-100 text-sky-700', label: 'Pronunciation' },
  culture: { icon: Compass, color: 'bg-orange-100 text-orange-700', label: 'Culture' },
  reading: { icon: BookMarked, color: 'bg-teal-100 text-teal-700', label: 'Reading' },
  onboarding: { icon: Sparkles, color: 'bg-emerald-100 text-emerald-700', label: 'Onboarding' },
  quest: { icon: Gift, color: 'bg-purple-100 text-purple-700', label: 'Quest' },
  streak: { icon: Flame, color: 'bg-orange-100 text-orange-700', label: 'Streak' },
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ userId, refreshKey = 0 }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getRecentActivity(userId, 12);
    setLogs(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return (
    <section className="bg-white rounded-3xl border border-[#E6E0D5] p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1] mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>ಚಟುವಟಿಕೆ • XP Activity</span>
          </div>
          <h3 className="font-serif font-bold text-xl text-[#183B28]">Recent Activity</h3>
        </div>
        <button
          type="button"
          onClick={load}
          className="cursor-pointer text-xs font-semibold text-[#526056] hover:text-[#183B28] underline"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-8 flex items-center justify-center gap-2 text-xs text-[#707F74]">
          <span className="w-4 h-4 border-2 border-[#183B28] border-t-transparent rounded-full animate-spin" />
          <span>Loading your learning trail...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm font-semibold text-[#183B28]">No activity yet.</p>
          <p className="text-xs text-[#526056] mt-1">Complete a lesson, save a word, or finish a quiz to start your XP trail.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {logs.map((log) => {
            const meta = TYPE_META[log.type] || TYPE_META.lesson;
            const Icon = meta.icon;
            return (
              <div key={log.id} className="flex items-center gap-3 py-2.5 border-b border-[#F5F1E8] last:border-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-[#183B28] truncate">{log.title}</p>
                  <p className="text-[10px] text-[#707F74]">
                    {meta.label} • {formatRelativeTime(log.timestamp)}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  +{log.pointsEarned}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ActivityFeed;
