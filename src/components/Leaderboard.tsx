import React, { useCallback, useEffect, useState } from 'react';
import { Trophy, Medal, Crown, RefreshCw, Flame, CalendarDays, Users } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry } from '../lib/firebase';
import { getLevelInfo } from '../lib/gamification';

interface LeaderboardProps {
  currentUserId: string;
  refreshKey?: number;
}

type Scope = 'all' | 'week';

const RANK_STYLES = [
  'bg-amber-100 text-amber-900 border-amber-300',
  'bg-slate-100 text-slate-700 border-slate-300',
  'bg-orange-100 text-orange-900 border-orange-300',
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserId, refreshKey = 0 }) => {
  const [scope, setScope] = useState<Scope>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard(scope);
      setEntries(data);
    } catch (err: any) {
      setError(err.message || 'Could not load the leaderboard.');
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return (
    <section className="bg-white rounded-3xl border border-[#E6E0D5] p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#F0ECE1]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-indigo-600" />
            <span>ಶ್ರೇಣಿ ಪಟ್ಟಿ • Community Leaderboard</span>
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#183B28]">Top Kannada Learners</h3>
          <p className="text-xs sm:text-sm text-[#526056] mt-1">
            Learn together. Weekly points reset every Monday, all-time XP never expires.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-[#FAF8F4] p-1 rounded-xl border border-[#E6E0D5]">
            <button
              type="button"
              onClick={() => setScope('all')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scope === 'all' ? 'bg-[#183B28] text-white shadow-xs' : 'text-[#526056] hover:text-[#183B28]'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              All-time
            </button>
            <button
              type="button"
              onClick={() => setScope('week')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scope === 'week' ? 'bg-[#183B28] text-white shadow-xs' : 'text-[#526056] hover:text-[#183B28]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              This week
            </button>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="cursor-pointer p-2 rounded-xl border border-[#E6E0D5] bg-white text-[#526056] hover:text-[#183B28] hover:bg-[#FAF8F4] transition-colors disabled:opacity-50"
            aria-label="Refresh leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          {error} Leaderboard is optional; your learning progress is still saved.
        </div>
      )}

      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-2 text-sm text-[#707F74]">
          <span className="w-6 h-6 border-2 border-[#183B28] border-t-transparent rounded-full animate-spin" />
          <span>Loading learners...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <p className="font-bold text-sm text-[#183B28]">The leaderboard is waiting for its first learner.</p>
          <p className="text-xs text-[#526056]">Finish a lesson or quiz to claim the top spot.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {entries.map((entry, index) => {
            const level = getLevelInfo(entry.totalPoints);
            const isCurrent = entry.uid === currentUserId;
            const points = scope === 'week' ? entry.weeklyPoints : entry.totalPoints;

            return (
              <div
                key={entry.uid}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-300/30'
                    : index < 3
                    ? 'bg-[#FAF8F4] border-[#E8E2D5]'
                    : 'bg-white border-[#F0ECE1]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${
                    index < 3 ? RANK_STYLES[index] : 'bg-[#FAF8F4] text-[#707F74] border-[#E6E0D5]'
                  }`}
                >
                  {index === 0 ? <Crown className="w-4 h-4" /> : index === 1 || index === 2 ? <Medal className="w-4 h-4" /> : index + 1}
                </div>

                <div className="w-10 h-10 rounded-full bg-[#183B28]/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {entry.photoURL ? (
                    <img src={entry.photoURL} alt={entry.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">{entry.avatar || '🎓'}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-[#183B28] truncate">{entry.displayName || 'Kannada Learner'}</p>
                    {isCurrent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">YOU</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#707F74] truncate">
                    Level {level.level} • {level.title}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-[#183B28]">{points.toLocaleString()} XP</p>
                  <p className="text-[10px] text-[#707F74] inline-flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {scope === 'week' ? 'this week' : 'all time'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Leaderboard;
