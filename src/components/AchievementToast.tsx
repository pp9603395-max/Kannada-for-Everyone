import React from 'react';
import { X, Sparkles, Trophy } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  description: string;
  kind: 'badge' | 'achievement' | 'level' | 'xp' | 'quest';
  icon?: React.ReactNode;
  points?: number;
}

interface AchievementToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const KIND_STYLES: Record<ToastItem['kind'], { ring: string; badge: string; label: string }> = {
  badge: { ring: 'border-amber-300', badge: 'bg-amber-100 text-amber-800', label: 'Badge unlocked' },
  achievement: { ring: 'border-indigo-300', badge: 'bg-indigo-100 text-indigo-800', label: 'Achievement' },
  level: { ring: 'border-emerald-300', badge: 'bg-emerald-100 text-emerald-800', label: 'Level up' },
  xp: { ring: 'border-sky-300', badge: 'bg-sky-100 text-sky-800', label: 'XP earned' },
  quest: { ring: 'border-purple-300', badge: 'bg-purple-100 text-purple-800', label: 'Quest complete' },
};

export const AchievementToast: React.FC<AchievementToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-3 sm:right-5 z-[70] w-[min(92vw,22rem)] space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const style = KIND_STYLES[toast.kind];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative flex items-start gap-3 rounded-2xl border ${style.ring} bg-white/95 backdrop-blur-md p-4 shadow-xl animate-in slide-in-from-right-4 fade-in duration-300`}
          >
            <div className={`w-11 h-11 rounded-2xl ${style.badge} flex items-center justify-center shrink-0`}>
              {toast.icon || <Sparkles className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <Trophy className="w-3 h-3" />
                <span>{style.label}</span>
              </div>
              <p className="font-bold text-sm text-slate-900 leading-snug mt-0.5">{toast.title}</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.description}</p>
              {typeof toast.points === 'number' && toast.points > 0 && (
                <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold">
                  +{toast.points} XP
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="cursor-pointer p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AchievementToast;
