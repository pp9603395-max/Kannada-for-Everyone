import React from 'react';
import { X, Printer, Award, Flame, BookOpen } from 'lucide-react';
import { UserProfile } from '../types';
import { getLevelInfo } from '../lib/gamification';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  completedLessons: number;
  totalLessons: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  user,
  completedLessons,
  totalLessons,
}) => {
  if (!isOpen) return null;

  const level = getLevelInfo(user.points || 0);
  const badgeCount = user.badges?.filter((b) => b.isUnlocked).length || 0;
  const date = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-[80] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl my-6">
        <div className="flex items-center justify-between mb-3 no-print">
          <h2 className="text-white font-bold text-sm sm:text-base">Your Kannada Learning Certificate</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close certificate"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          id="kannada-certificate"
          className="relative bg-[#FFFDF7] rounded-3xl border-[10px] border-double border-[#183B28]/70 p-6 sm:p-12 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-3 border border-[#C9A227]/50 rounded-2xl pointer-events-none" />
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-emerald-200/30 blur-2xl pointer-events-none" />

          <div className="relative text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#183B28] text-amber-200 flex items-center justify-center font-kannada font-bold text-3xl shadow-lg">
              ಕ
            </div>

            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#8A6D1F]">
                Kannada for Everyone • KDIC 2026
              </p>
              <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#183B28] mt-2">
                Certificate of Achievement
              </h1>
              <p className="font-kannada text-sm sm:text-base text-[#526056] mt-1">
                ಸಾಧನೆಯ ಪ್ರಮಾಣಪತ್ರ
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#526056]">This certifies that</p>
            <p className="font-serif font-bold text-2xl sm:text-4xl text-[#183B28] border-b-2 border-[#C9A227]/50 inline-block px-6 pb-1">
              {user.name || 'Kannada Learner'}
            </p>

            <p className="text-xs sm:text-sm text-[#526056] max-w-2xl mx-auto leading-relaxed">
              has actively learned Kannada through real-life conversations, immersion reading, pronunciation practice,
              cultural exploration, and mastery quizzes — earning{' '}
              <strong className="text-[#183B28]">{user.points || 0} XP</strong> and reaching the level of{' '}
              <strong className="text-[#183B28]">
                Level {level.level} • {level.title}
              </strong>
              .
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
              <div className="p-3 rounded-2xl bg-white/80 border border-[#E6E0D5]">
                <Award className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="font-bold text-lg text-[#183B28]">{badgeCount}</p>
                <p className="text-[10px] text-[#707F74] uppercase font-semibold">Badges</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-[#E6E0D5]">
                <BookOpen className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="font-bold text-lg text-[#183B28]">
                  {completedLessons}/{totalLessons}
                </p>
                <p className="text-[10px] text-[#707F74] uppercase font-semibold">Lessons</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-[#E6E0D5]">
                <Flame className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="font-bold text-lg text-[#183B28]">{user.streakDays || 1}</p>
                <p className="text-[10px] text-[#707F74] uppercase font-semibold">Day Streak</p>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4 pt-6 max-w-2xl mx-auto text-left">
              <div>
                <p className="text-xs font-bold text-[#183B28]">{date}</p>
                <p className="text-[10px] text-[#707F74] uppercase tracking-wider">Date issued</p>
              </div>
              <div className="text-right">
                <p className="font-kannada text-lg font-bold text-[#183B28]">ಕನ್ನಡ ಎಲ್ಲರಿಗೂ</p>
                <p className="text-[10px] text-[#707F74] uppercase tracking-wider">Learn • Speak • Belong</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-4 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#183B28] font-bold text-xs sm:text-sm shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
