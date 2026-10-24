import React, { useState } from 'react';
import {
  HandHeart,
  ShoppingBag,
  Utensils,
  MapPin,
  Bus,
  GraduationCap,
  Briefcase,
  Stethoscope,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';
import { Lesson, ExplanationLanguage, UserLevel } from '../types';

interface SituationLessonsProps {
  lessons: Lesson[];
  completedLessonIds: string[];
  preferredLanguage: ExplanationLanguage;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenQuiz: (lesson: Lesson) => void;
}

export const SituationLessons: React.FC<SituationLessonsProps> = ({
  lessons,
  completedLessonIds,
  preferredLanguage,
  onSelectLesson,
  onOpenQuiz,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | UserLevel>('all');

  const iconMap: Record<string, React.ElementType> = {
    HandHeart,
    ShoppingBag,
    Utensils,
    MapPin,
    Bus,
    GraduationCap,
    Briefcase,
    Stethoscope,
    Users,
    Sparkles,
  };

  const filteredLessons = lessons.filter((l) => {
    if (selectedFilter === 'all') return true;
    return l.level === selectedFilter;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183B28]/10 text-[#183B28] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>ಪ್ರಾಯೋಗಿಕ ಪಾಠಗಳು • Situational Learning</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#183B28]">
            Everyday Conversations for Karnataka
          </h2>
          <p className="text-sm sm:text-base text-[#526056] max-w-2xl mt-1">
            Master 10 practical real-life situations from Bengaluru tech parks and BMTC buses to Mysuru Dasara festivals and Darshinis.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-[#EFE9DD] p-1 rounded-xl border border-[#E0D7C7] self-start md:self-auto">
          {(['all', 'beginner', 'intermediate'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedFilter(lvl)}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                selectedFilter === lvl
                  ? 'bg-[#183B28] text-white shadow-xs'
                  : 'text-[#526056] hover:text-[#183B28]'
              }`}
            >
              {lvl === 'all' ? 'All Situations (10)' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const Icon = iconMap[lesson.icon] || Sparkles;
          const isCompleted = completedLessonIds.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              className={`group rounded-3xl bg-white border p-6 transition-all duration-300 hover:shadow-md flex flex-col justify-between ${
                isCompleted
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-[#E6E0D5] hover:border-[#183B28]/40'
              }`}
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#183B28]/10 group-hover:bg-[#183B28] flex items-center justify-center text-[#183B28] group-hover:text-amber-200 transition-colors shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF7F2] text-[#526056] border border-[#E6E0D5] capitalize">
                      {lesson.level}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Done
                      </span>
                    )}
                  </div>
                </div>

                {/* Titles */}
                <p className="font-kannada font-bold text-xl text-[#183B28] leading-tight mb-1">
                  {lesson.titleKannada}
                </p>
                <h3 className="font-serif font-bold text-base text-[#2A2E2B] mb-2">
                  {lesson.titleEnglish}
                </h3>

                <p className="text-xs sm:text-sm text-[#526056] line-clamp-2 leading-relaxed mb-4">
                  {lesson.description}
                </p>

                {/* Context Pill */}
                <div className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5] text-xs text-[#4A554D] mb-5">
                  <span className="font-semibold text-[#183B28]">Context: </span>
                  <span>{lesson.context}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectLesson(lesson)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#183B28] hover:bg-[#122D1F] text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  <PlayCircle className="w-4 h-4 text-amber-300" />
                  <span>Start Practice</span>
                </button>

                <button
                  onClick={() => onOpenQuiz(lesson)}
                  className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#183B28] text-xs font-semibold border border-[#E6E0D5] transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Take Quiz</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default SituationLessons;
