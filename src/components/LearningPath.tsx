import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  Sparkles,
  BookOpen,
  Headphones,
  Award,
  Zap,
  HelpCircle,
  Clock,
  Compass,
  Users,
  Utensils,
  ShoppingBag,
  Bus,
  GraduationCap,
  Briefcase,
  Stethoscope,
  MapPin,
  HandHeart,
  ChevronRight,
  Info,
} from 'lucide-react';
import { StructuredLevel, StructuredModule, Lesson, ExplanationLanguage } from '../types';
import { STRUCTURED_LEARNING_PATH } from '../data/learningPathData';

interface LearningPathProps {
  completedLessonIds: string[];
  preferredLanguage: ExplanationLanguage;
  onSelectLessonById: (lessonId: string) => void;
  onOpenQuizById?: (lessonId: string) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  completedLessonIds,
  preferredLanguage,
  onSelectLessonById,
  onOpenQuizById,
}) => {
  const [activeLevelNum, setActiveLevelNum] = useState<1 | 2 | 3 | 4>(1);
  const [selectedModule, setSelectedModule] = useState<StructuredModule | null>(null);

  const iconMap: Record<string, React.ElementType> = {
    BookOpen,
    HandHeart,
    Clock,
    Sparkles,
    Users,
    Utensils,
    ShoppingBag,
    Bus,
    GraduationCap,
    Briefcase,
    Stethoscope,
    MapPin,
    Compass,
    Award,
    Headphones,
  };

  const currentLevel = STRUCTURED_LEARNING_PATH.find((l) => l.levelNumber === activeLevelNum) || STRUCTURED_LEARNING_PATH[0];

  // Sequential progression: learners may always revisit completed modules, and
  // may open the first incomplete module. Everything after that stays locked.
  const allModules = STRUCTURED_LEARNING_PATH.flatMap((lvl) => lvl.modules);
  const firstIncompleteIndex = allModules.findIndex(
    (m) => !completedLessonIds.includes(m.lessonId)
  );
  const unlockedThroughIndex =
    firstIncompleteIndex === -1 ? allModules.length - 1 : firstIncompleteIndex;

  const selectedModuleLocked = selectedModule
    ? !completedLessonIds.includes(selectedModule.lessonId) &&
      allModules.findIndex((m) => m.id === selectedModule.id) > unlockedThroughIndex
    : false;

  const totalModulesCount = STRUCTURED_LEARNING_PATH.reduce((acc, lvl) => acc + lvl.modules.length, 0);
  const totalCompletedCount = STRUCTURED_LEARNING_PATH.reduce(
    (acc, lvl) => acc + lvl.modules.filter((m) => completedLessonIds.includes(m.lessonId)).length,
    0
  );
  const overallPercentage = Math.round((totalCompletedCount / totalModulesCount) * 100);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-10 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-amber-300 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ಹಂತ ಹಂತದ ಕಲಿವಿನ ಹಾದಿ • Structured Progression</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight">
              Kannada Mastery Learning Path
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              Inspired by modern mastery curricula: journey from Kannada script phonetics to confident real-life street conversations in Bengaluru, Mysuru, and Mangaluru.
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${overallPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-bold text-sm text-white">{overallPercentage}%</span>
            </div>
            <div>
              <div className="text-xs font-medium text-indigo-200">Overall Path Completion</div>
              <div className="text-lg font-bold text-white">
                {totalCompletedCount} of {totalModulesCount} Modules
              </div>
              <div className="text-[11px] text-amber-300 font-semibold mt-0.5">
                Keep up your active streak!
              </div>
            </div>
          </div>
        </div>

        {/* Level Tabs Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-8 pt-6 border-t border-white/10">
          {STRUCTURED_LEARNING_PATH.map((lvl) => {
            const isActive = activeLevelNum === lvl.levelNumber;
            const completedInLevel = lvl.modules.filter((m) => completedLessonIds.includes(m.lessonId)).length;
            const levelPct = Math.round((completedInLevel / lvl.modules.length) * 100);

            return (
              <button
                key={lvl.levelNumber}
                onClick={() => {
                  setActiveLevelNum(lvl.levelNumber);
                  setSelectedModule(null);
                }}
                className={`cursor-pointer text-left p-3 rounded-2xl transition-all border ${
                  isActive
                    ? 'bg-white text-slate-900 border-white shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className={isActive ? 'text-indigo-900' : 'text-indigo-200'}>
                    Level {lvl.levelNumber}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-indigo-100 text-indigo-900' : 'bg-white/10 text-white'}`}>
                    {levelPct}%
                  </span>
                </div>
                <div className={`text-xs font-semibold truncate ${isActive ? 'text-slate-900' : 'text-white'}`}>
                  {lvl.titleEnglish.split(': ')[1] || lvl.titleEnglish}
                </div>
                <div className="text-[10px] font-kannada text-slate-400 mt-0.5 truncate">
                  {lvl.titleKannada}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Level Overview & Modules Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Step-by-Step Path Tree */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1 mb-2">
            <div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                {currentLevel.titleEnglish}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-kannada mt-0.5">
                {currentLevel.titleKannada}
              </p>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
              {currentLevel.modules.length} Checkpoints
            </span>
          </div>

          <div className="space-y-4 relative">
            {/* Visual connector line behind cards */}
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-200 pointer-events-none rounded-full" />

            {currentLevel.modules.map((module, idx) => {
              const Icon = iconMap[module.icon] || BookOpen;
              const isCompleted = completedLessonIds.includes(module.lessonId);
              const globalIndex = allModules.findIndex((m) => m.id === module.id);
              const isLocked = !isCompleted && globalIndex > unlockedThroughIndex;
              const isSelected = selectedModule?.id === module.id;

              return (
                <div
                  key={module.id}
                  onClick={() => {
                    if (!isLocked) setSelectedModule(module);
                  }}
                  className={`relative z-10 rounded-2xl p-5 border transition-all duration-200 flex items-start gap-4 ${
                    isLocked
                      ? 'cursor-not-allowed bg-slate-50/80 border-slate-200 opacity-75'
                      : isSelected
                      ? 'cursor-pointer bg-indigo-50/90 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : isCompleted
                      ? 'cursor-pointer bg-emerald-50/50 border-emerald-200 hover:border-emerald-400 hover:shadow-xs'
                      : 'cursor-pointer bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  {/* Step Status Badge */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isLocked
                        ? 'bg-slate-200 text-slate-500'
                        : isSelected
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-100'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>

                  {/* Module Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Unit {globalIndex + 1}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Completed
                          </span>
                        )}
                        {isLocked && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                            Locked
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                        <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                        <span>+{module.xpReward} XP</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 leading-snug">
                      {module.titleEnglish}
                    </h4>
                    <p className="font-kannada text-xs text-indigo-800 font-medium mt-0.5">
                      {module.titleKannada}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {module.subtitle}
                    </p>
                  </div>

                  {isLocked ? (
                    <Lock className="w-5 h-5 shrink-0 self-center text-slate-400" />
                  ) : (
                    <ChevronRight className={`w-5 h-5 shrink-0 self-center transition-transform ${isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Module Inspector & Action Launchpad */}
        <div className="lg:col-span-5 sticky top-24">
          {selectedModule ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-xl space-y-6 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    Unit Detail
                  </span>
                  <h3 className="font-bold text-xl text-slate-900 mt-2">
                    {selectedModule.titleEnglish}
                  </h3>
                  <p className="font-kannada text-xs text-indigo-800 font-semibold mt-0.5">
                    {selectedModule.titleKannada}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>

              {/* Subtitle / summary */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {selectedModule.subtitle}
              </p>

              {/* Learning Objectives */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Learning Objectives:
                </h5>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedModule.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Grammar Concept */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Grammar Core Principle:</span>
                </div>
                <p className="leading-relaxed pl-5 text-[11px] text-amber-800">
                  {selectedModule.keyGrammarConcept}
                </p>
              </div>

              {/* Actions */}
              {selectedModuleLocked ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                  <Lock className="w-5 h-5 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Complete the previous unit to unlock this module</p>
                  <p className="text-[11px] text-slate-500">
                    The learning path unlocks in order so every grammar pattern builds on the last.
                  </p>
                </div>
              ) : (
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectLessonById(selectedModule.lessonId)}
                  className="cursor-pointer w-full py-3.5 px-4 rounded-2xl bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-700/20"
                >
                  <Headphones className="w-4 h-4" />
                  <span>
                    {completedLessonIds.includes(selectedModule.lessonId)
                      ? 'Review Dialogue in Dual-Pane Studio'
                      : 'Start Lesson in Dual-Pane Studio'}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </button>

                {onOpenQuizById && (
                  <button
                    type="button"
                    onClick={() => onOpenQuizById(selectedModule.lessonId)}
                    className="cursor-pointer w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-2 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Practice Quiz for this Unit</span>
                  </button>
                )}
              </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-300 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-base text-slate-800">Select any module to inspect</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Click on any checkpoint in the path on the left to view learning objectives, grammar insights, and launch into interactive practice.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default LearningPath;
