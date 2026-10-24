import React, { useState } from 'react';
import {
  Flame,
  Globe,
  User,
  Menu,
  X,
  BookOpen,
  Headphones,
  Compass,
  Award,
  Sparkles,
  MessageSquare,
  Layers,
  Home,
  LogOut,
  Settings,
  Target,
  BookMarked,
  Crown,
} from 'lucide-react';
import { ExplanationLanguage, UserProgress } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  preferredLanguage: ExplanationLanguage;
  setPreferredLanguage: (lang: ExplanationLanguage) => void;
  progressData: UserProgress | null;
  onOpenAuth: () => void;
  onReturnToIntroduction: () => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  preferredLanguage,
  setPreferredLanguage,
  progressData,
  onOpenAuth,
  onReturnToIntroduction,
  onLogout,
  onOpenSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasGoldBadge = progressData?.badges?.some((b) => b.tier === 'gold' && b.isUnlocked);
  const points = progressData?.points || 0;
  const streak = progressData?.streakDays || 1;

  const navItems = [
    { id: 'intro', label: 'Introduction', icon: Home, isIntro: true },
    { id: 'path', label: 'Learning Path', icon: Target },
    { id: 'reader', label: 'Immersion Reader', icon: BookMarked },
    { id: 'studio', label: 'Dual-Pane Studio', icon: Headphones },
    { id: 'situations', label: '10 Situations', icon: BookOpen },
    { id: 'vocabulary', label: 'Vocabulary', icon: Layers },
    { id: 'pronunciation', label: 'Pronunciation & Script', icon: Headphones },
    { id: 'roleplay', label: 'AI Roleplay', icon: MessageSquare },
    { id: 'culture', label: 'Culture Explorer', icon: Compass },
    { id: 'progress', label: 'My Progress & Badges', icon: Award },
  ];

  const languages: { code: ExplanationLanguage; label: string; script: string }[] = [
    { code: 'en', label: 'English', script: 'EN' },
    { code: 'mr', label: 'मराठी', script: 'MR' },
    { code: 'hi', label: 'हिंदी', script: 'HI' },
  ];

  return (
    <header
      className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-[#E6E0D5]/60 transition-all shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#183B28] via-[#C9A227] to-[#2563eb] opacity-70 rounded-full mx-auto md:mx-0 mb-3" />

        <div className="flex items-center justify-between h-20 sm:h-24 xl:h-28">
          {/* Logo & Brand: Kannada for Everyone */}
          <button
            onClick={onReturnToIntroduction}
            className="cursor-pointer flex items-center gap-4 text-left focus:outline-none group"
            title="Return to Introduction Page"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#183B28] to-[#0f291c] flex items-center justify-center text-amber-200 font-kannada font-bold text-2xl sm:text-3xl shadow-lg border border-[#183B28]/40 group-hover:scale-105 transition-transform duration-300">
              <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 blur opacity-25 group-hover:opacity-40 transition-colors" />
              ಕ
            </div>
            <div className="hidden sm:flex flex-col gap-0.5">
              <div className="flex items-center gap-2.5">
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#183B28] tracking-tight leading-none">
                  Kannada for Everyone
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-bold bg-[#E07A5F]/10 text-[#B45309] border border-[#E07A5F]/20 uppercase tracking-widest">
                  KDIC 2026
                </span>
              </div>
              <p className="font-kannada text-[10px] sm:text-xs text-[#526056] font-medium leading-none">
                ಕನ್ನಡ ಎಲ್ಲರಿಗೂ • ಡಿಜಿಟಲ್ ನಾವೀನ್ಯತಾ ವೇದಿಕೆ
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.isIntro ? activeTab === 'intro' : activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isIntro) {
                      onReturnToIntroduction();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`cursor-pointer px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-[#183B28] text-white shadow-[0_8px_24px_rgba(24,59,40,0.22)] border border-[#183B28]/40'
                      : 'text-[#526056] hover:text-[#183B28] hover:bg-[#F2ECE1] hover:border-transparent border border-transparent'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 opacity-90 ${isActive ? 'text-white' : ''}`} />
                  <span className="leading-none">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Points & Badges */}
            <button
              onClick={() => setActiveTab('progress')}
              className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-2xl border text-xs sm:text-sm font-bold transition-all duration-300 ${
                hasGoldBadge
                  ? 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-900 border-amber-300 shadow-[0_0_0_10px_rgba(245,158,11,0.18)] animate-pulse'
                  : 'bg-white text-[#183B28] border-[#DDD5C7] hover:bg-[#FAF7F2] hover:border-[#C9BEA8] shadow-sm'
              }`}
              title="Verified Learning Points & Badges"
            >
              <div className="relative">
                <Award className={`w-5 h-5 ${hasGoldBadge ? 'text-amber-600' : 'text-amber-500'}`} />
                {hasGoldBadge && (
                  <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white ring-2 ring-amber-100 animate-pulse" />
                )}
              </div>
              <span className="leading-none">{points} pts</span>
            </button>

            {/* Streak Counter */}
            <button
              onClick={() => setActiveTab('progress')}
              className={`cursor-pointer hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-orange-50 text-orange-900 border border-orange-100 text-sm font-bold hover:bg-orange-100 hover:shadow-md transition-all duration-300`}
              title="Daily Learning Streak"
            >
              <div className="relative">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                {streak >= 7 && (
                  <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-orange-50 animate-pulse" />
                )}
              </div>
              <span className="leading-none">{streak}d streak</span>
            </button>

            {/* Language Selector (EN, MR, HI) */}
            <div className="relative inline-flex items-center bg-white rounded-2xl p-0.5 border border-[#E0D7C7] shadow-sm">
              <Globe className="w-4 h-4 text-[#526056] ml-1.5 mr-1" />
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setPreferredLanguage(l.code)}
                  className={`cursor-pointer px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                    preferredLanguage === l.code
                      ? 'bg-[#183B28] text-white shadow-sm'
                      : 'text-[#526056] hover:text-[#183B28] hover:bg-[#F2ECE1]'
                  }`}
                  title={`Explanation language: ${l.label}`}
                >
                  {l.script}
                </button>
              ))}
            </div>

            {/* Auth / Profile Trigger */}
            <button
              onClick={onOpenAuth}
              className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-[#D8CEBC] text-xs sm:text-sm font-bold text-[#183B28] hover:bg-[#F2ECE1] hover:border-[#C9BEA8] shadow-sm transition-all duration-300"
              title={progressData?.email || 'Learner Profile'}
            >
              <div className="relative">
                {progressData?.picture ? (
                  <img
                    src={progressData.picture}
                    alt={progressData.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#183B28] flex items-center justify-center text-white text-xs sm:text-sm font-bold border-2 border-white">
                    {progressData?.name?.charAt(0) || 'K'}
                  </div>
                )}
                <span className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <span className="hidden md:inline leading-none">
                {progressData?.name ? progressData.name.split(' ')[0] : 'Profile'}
              </span>
            </button>

            {/* Settings Trigger */}
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="cursor-pointer p-2.5 rounded-2xl bg-white border border-[#D8CEBC] text-[#183B28] hover:bg-[#F2ECE1] hover:border-[#C9BEA8] shadow-sm transition-all duration-300"
                title="Account Settings & Preferences"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-[#183B28]" />
              </button>
            )}

            {/* Direct Sign Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="cursor-pointer hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl border border-red-100 text-red-600 font-bold text-xs sm:text-sm hover:bg-red-50 hover:border-red-200 transition-all duration-300"
                title="Sign out of account"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span className="leading-none">Sign Out</span>
              </button>
            )}

            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer xl:hidden p-2.5 rounded-2xl text-[#183B28] hover:bg-[#183B28]/10 transition-all duration-300"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#E6E0D5] px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isIntro ? activeTab === 'intro' : activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isIntro) {
                    onReturnToIntroduction();
                  } else {
                    setActiveTab(item.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`cursor-pointer w-full text-left px-4 py-3.5 rounded-2xl text-sm font-medium flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-[#183B28] text-white shadow-[0_0_12px_rgba(24,59,40,0.15)]'
                    : 'text-[#3E4940] hover:bg-[#183B28]/8 hover:text-[#183B28]'
                }`}
              >
                <Icon className="w-5 h-5 opacity-90" />
                <span className="leading-none">{item.label}</span>
              </button>
            );
          })}

          <div className="mt-4 pt-4 border-t border-[#F0ECE1] flex items-center justify-between gap-3">
            <button
              onClick={onOpenAuth}
              className="cursor-pointer flex-1 text-left px-4 py-3 rounded-2xl bg-white border border-[#D8CEBC] text-sm font-medium text-[#183B28] hover:bg-[#F2ECE1] transition-all"
            >
              <User className="w-5 h-5 mr-3" /> Profile
            </button>
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="cursor-pointer flex-1 text-left px-4 py-3 rounded-2xl bg-white border border-[#D8CEBC] text-sm font-medium text-[#183B28] hover:bg-[#F2ECE1] transition-all"
              >
                <Settings className="w-5 h-5 mr-3" /> Settings
              </button>
            )}
          </div>

          {onLogout && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="cursor-pointer w-full text-left px-4 py-3.5 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 border border-red-100 flex items-center gap-3 transition-all mt-2 pt-2 border-t border-[#E6E0D5]"
            >
              <LogOut className="w-5 h-5" /> Sign Out of Account
            </button>
          )}
        </div>
      )}
    </header>
  );
};
export default Navbar;
