import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Award,
  Target,
  Clock,
  ArrowRight,
  Check,
  CheckCircle2,
  BookOpen,
  Briefcase,
  GraduationCap,
  Bus,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { ExplanationLanguage, UserLevel, LearningGoal, DailyStudyTarget } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  currentLanguage: ExplanationLanguage;
  currentLevel: UserLevel;
  currentGoal?: LearningGoal;
  currentTarget?: DailyStudyTarget;
  userName?: string;
  onSavePreferences: (prefs: {
    preferredLanguage: ExplanationLanguage;
    level: UserLevel;
    learningGoal: LearningGoal;
    dailyStudyTarget: DailyStudyTarget;
    onboardingCompleted: boolean;
  }) => Promise<void>;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  currentLanguage,
  currentLevel,
  currentGoal = 'conversation',
  currentTarget = 10,
  userName = 'Learner',
  onSavePreferences,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);
  const [language, setLanguage] = useState<ExplanationLanguage>(currentLanguage);
  const [level, setLevel] = useState<UserLevel>(currentLevel);
  const [goal, setGoal] = useState<LearningGoal>(currentGoal);
  const [studyTarget, setStudyTarget] = useState<DailyStudyTarget>(currentTarget);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await onSavePreferences({
        preferredLanguage: language,
        level,
        learningGoal: goal,
        dailyStudyTarget: studyTarget,
        onboardingCompleted: true,
      });
      if (onClose) onClose();
    } catch (e) {
      console.warn('Failed to save onboarding preferences:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-indigo-100 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-700 text-white font-kannada font-bold text-sm flex items-center justify-center shadow-xs">
              ಕ
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Personalize Your Path</h3>
              <p className="text-[11px] text-slate-500">Step {step} of 4</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step
                    ? 'w-6 bg-indigo-700'
                    : s < step
                    ? 'w-3 bg-emerald-500'
                    : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: EXPLANATION LANGUAGE */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                <Globe className="w-3.5 h-3.5" />
                <span>Explanation Language</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                How would you like Kannada explained?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                All grammar tips, vocabulary definitions, and dialogue meanings will adapt to this choice.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  code: 'en' as const,
                  title: 'English',
                  native: 'English (EN)',
                  desc: 'Latin script phonetics, English word breakdowns, and Bengaluru daily expressions.',
                },
                {
                  code: 'mr' as const,
                  title: 'मराठी',
                  native: 'मराठी (Marathi)',
                  desc: 'देवनागरी लिप्यंतरण, सोप्या मराठीत अर्थ आणि व्याकरण साम्य.',
                },
                {
                  code: 'hi' as const,
                  title: 'हिंदी',
                  native: 'हिंदी (Hindi)',
                  desc: 'देवनागरी लिप्यंतरण, स्पष्ट हिंदी अनुवाद और रोज़मर्रा के बोलचाल के उदाहरण.',
                },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  className={`cursor-pointer w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                    language === item.code
                      ? 'bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>{item.native}</span>
                      {language === item.code && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      language === item.code
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {language === item.code && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: PROFICIENCY LEVEL */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                <Award className="w-3.5 h-3.5" />
                <span>Starting Proficiency</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                How familiar are you with Kannada?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                We will recommend the most suitable starting unit and exercise difficulty.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'beginner' as const,
                  title: 'Complete Beginner',
                  kannada: 'ಹೊಸಬರು (New Learner)',
                  desc: 'I know little to no Kannada. I want to learn the alphabet, basic sounds, and essential greetings.',
                },
                {
                  id: 'intermediate' as const,
                  title: 'Basic / Conversational Explorer',
                  kannada: 'ಸ್ವಲ್ಪ ಗೊತ್ತು (Know Some Words)',
                  desc: 'I know some everyday words (Gottu, Bēku, Eshtu) but struggle to connect sentences and talk to locals.',
                },
                {
                  id: 'advanced' as const,
                  title: 'Intermediate Speaker',
                  kannada: 'ಮಾತನಾಡಬಲ್ಲೆ (Can Converse)',
                  desc: 'I can manage simple conversations but want to master complex tenses, office speech, and cultural nuances.',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLevel(item.id)}
                  className={`cursor-pointer w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                    level === item.id
                      ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>{item.title}</span>
                      <span className="text-xs font-kannada text-emerald-700 font-semibold">
                        • {item.kannada}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      level === item.id
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {level === item.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: LEARNING GOAL */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                <Target className="w-3.5 h-3.5" />
                <span>Primary Learning Objective</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                What is your main reason for learning?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                This helps us prioritize the most useful dialogues and vocabulary scenarios for you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'conversation' as const,
                  icon: MessageSquare,
                  title: 'Daily Conversation',
                  desc: 'Bargaining at markets, talking to neighbors, and making friends in Karnataka.',
                },
                {
                  id: 'travel' as const,
                  icon: Bus,
                  title: 'Bengaluru Commute & Travel',
                  desc: 'Navigating Namma Metro, BMTC buses, and auto rickshaws with confidence.',
                },
                {
                  id: 'work' as const,
                  icon: Briefcase,
                  title: 'Workplace & Tech Park',
                  desc: 'Polite office communication, facilities, team chats, and building rapport.',
                },
                {
                  id: 'college' as const,
                  icon: GraduationCap,
                  title: 'College & Academics',
                  desc: 'Interacting with campus professors, batchmates, and campus staff.',
                },
                {
                  id: 'fluency' as const,
                  icon: Sparkles,
                  title: 'Full Cultural Fluency',
                  desc: 'Mastering classical literature, Karnataka history, Yakshagana, and heritage.',
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = goal === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`cursor-pointer p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-50/90 border-purple-600 ring-2 ring-purple-600/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${
                          isSelected
                            ? 'bg-purple-700 text-white'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: DAILY STUDY TARGET */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800">
                <Clock className="w-3.5 h-3.5" />
                <span>Daily Practice Commitment</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Set your daily study target
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Consistency beats intensity. Even 10 minutes a day builds practical fluency fast!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { mins: 5 as const, title: 'Casual', badge: '5 mins/day', desc: '1 short dialogue or 10 vocabulary words daily.' },
                { mins: 10 as const, title: 'Regular', badge: '10 mins/day', desc: '1 lesson + quiz practice. Highly recommended.' },
                { mins: 15 as const, title: 'Serious', badge: '15 mins/day', desc: 'Dialogue studio + pronunciation lab drills.' },
                { mins: 20 as const, title: 'Intensive', badge: '20 mins/day', desc: 'Full immersion with AI roleplay & culture.' },
              ].map((item) => {
                const isSelected = studyTarget === item.mins;
                return (
                  <button
                    key={item.mins}
                    type="button"
                    onClick={() => setStudyTarget(item.mins)}
                    className={`cursor-pointer p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-600/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Welcome Bonus Notice */}
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-900 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Completing your setup awards <strong>+15 XP</strong> to your verified account!
              </span>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="cursor-pointer px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              &larr; Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-all shadow-md shadow-indigo-700/20"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinish}
              className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Preferences...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enter My Learning Portal</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default OnboardingModal;
