export type ExplanationLanguage = 'en' | 'mr' | 'hi';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type AuthProvider = 'google' | 'password' | 'guest' | 'local';

export type ActivityType =
  | 'lesson'
  | 'quiz'
  | 'roleplay'
  | 'vocabulary'
  | 'pronunciation'
  | 'culture'
  | 'reading'
  | 'onboarding'
  | 'quest'
  | 'streak';

export interface Badge {
  id: string;
  name: string;
  nameKannada: string;
  description: string;
  tier: BadgeTier;
  minPoints: number;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface ActivityLog {
  id: string;
  type: ActivityType;
  title: string;
  pointsEarned: number;
  timestamp: string;
}

export type LearningGoal = 'travel' | 'college' | 'work' | 'conversation' | 'fluency';

export type DailyStudyTarget = 5 | 10 | 15 | 20; // in minutes

export type VocabMasteryStatus = 'new' | 'learning' | 'mastered';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  photoURL?: string;
  googleUid?: string;
  googleSub?: string;
  authProvider?: AuthProvider;
  isGuest: boolean;
  preferredLanguage: ExplanationLanguage;
  level: UserLevel;
  learningGoal?: LearningGoal;
  dailyStudyTarget?: DailyStudyTarget;
  onboardingCompleted?: boolean;
  lastLessonId?: string;
  dailyMinutesToday?: number;
  dailyMinutesDate?: string;
  avatar?: string;
  vocabStatus?: Record<string, VocabMasteryStatus>;
  streakDays: number;
  lastActiveDate: string;
  createdAt?: string;
  lastLoginAt?: string;
  points: number;
  badges: Badge[];
  completedLessonIds?: string[];
  savedWordIds?: string[];
  exploredCultureIds?: string[];
  readingCompletedIds?: string[];
  pronunciationAttempts?: number;
  dailyQuestDate?: string;
  dailyQuestProgress?: Record<string, number>;
  claimedQuestIds?: string[];
  pointsEpoch?: number;
}

export interface WordBreakdown {
  kannada: string;
  transliteration: string;
  meaning: {
    en: string;
    mr: string;
    hi: string;
  };
  partOfSpeech?: string;
  rootWord?: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  speakerRole?: string;
  kannada: string;
  transliteration: string;
  translations: {
    en: string;
    mr: string;
    hi: string;
  };
  words: WordBreakdown[];
  grammarNotes?: string;
  formality?: 'formal' | 'informal' | 'neutral' | 'polite' | 'friendly';
  additionalExample?: {
    kannada: string;
    transliteration: string;
    meaning: string;
  };
}

export interface Lesson {
  id: string;
  titleKannada: string;
  titleEnglish: string;
  category: string;
  level: UserLevel;
  icon: string;
  description: string;
  context: string;
  culturalNote?: string;
  dialogue: DialogueLine[];
  keyVocabulary: VocabularyItem[];
  quiz: Quiz;
}

export interface VocabularyItem {
  id: string;
  kannada: string;
  transliteration: string;
  meanings: {
    en: string;
    mr: string;
    hi: string;
  };
  category: string;
  level: UserLevel;
  exampleSentence?: {
    kannada: string;
    transliteration: string;
    meaning: string;
  };
  pronunciationTip?: string;
  audioKey?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'match' | 'fill-blank' | 'reorder' | 'translation' | 'contextual';
  prompt: string;
  promptKannada?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: {
    en: string;
    mr: string;
    hi: string;
  };
  pairs?: { kannada: string; english: string }[];
  wordsToArrange?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  lessonId?: string;
  questions: QuizQuestion[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  completedAt: string;
  passed: boolean;
  pointsEarned: number;
}

export type CulturalCategory =
  | 'monument'
  | 'unesco'
  | 'palace'
  | 'architecture'
  | 'city'
  | 'geography'
  | 'cuisine'
  | 'festival'
  | 'art'
  | 'etiquette';

export interface CulturalItem {
  id: string;
  titleEnglish: string;
  titleKannada: string;
  category: CulturalCategory;
  categoryLabel: string;
  region: string;
  isUNESCO: boolean;
  unescoYear?: number;
  periodOrDates?: string;
  image: string;
  imageAttribution?: string;
  shortDescription: string;
  historicalSignificance: string;
  deepDive: string;
  interestingFacts: string[];
  sourcesAndReferences: string[];
  relatedVocabulary: {
    kannada: string;
    transliteration: string;
    english: string;
  }[];
  keyPhrase: {
    kannada: string;
    transliteration: string;
    english: string;
    context: string;
  };
}

export interface AIRoleplayResponse {
  isEnglishInput: boolean;
  // If English input:
  kannadaTranslation?: {
    kannada: string;
    transliteration: string;
    english: string;
    breakdown?: { word: string; meaning: string }[];
    pronunciationTip?: string;
  };
  // Conversational response from scenario persona:
  conversationalReply: {
    kannada: string;
    transliteration: string;
    english: string;
  };
  // Follow-up question to keep the roleplay going:
  followUpQuestion?: {
    kannada: string;
    transliteration: string;
    english: string;
  };
  feedback?: {
    isCorrect: boolean;
    correction?: string;
    grammarTip?: string;
    newWords?: { word: string; meaning: string }[];
  };
}

export interface ConversationTurn {
  role: 'assistant' | 'user' | 'system';
  rawInput?: string;
  kannada: string;
  transliteration?: string;
  translation?: string;
  learningData?: AIRoleplayResponse;
  feedback?: {
    isCorrect: boolean;
    correction?: string;
    grammarTip?: string;
    newWords?: { word: string; meaning: string }[];
  };
}

export interface RoleplayScenario {
  id: string;
  title: string;
  titleKannada: string;
  role: string;
  userRole: string;
  context: string;
  difficulty: UserLevel;
  starterPrompt: string;
  starterKannada: string;
  starterTransliteration: string;
  starterTranslation: string;
  suggestedResponses: string[];
}

export interface UserProgress {
  userId: string;
  name: string;
  email?: string;
  picture?: string;
  photoURL?: string;
  authProvider?: AuthProvider;
  isGuest: boolean;
  level: UserLevel;
  preferredLanguage: ExplanationLanguage;
  learningGoal?: LearningGoal;
  dailyStudyTarget?: DailyStudyTarget;
  onboardingCompleted?: boolean;
  lastLessonId?: string;
  dailyMinutesToday?: number;
  dailyMinutesDate?: string;
  avatar?: string;
  vocabStatus?: Record<string, VocabMasteryStatus>;
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
  badges: Badge[];
  activityLogs: ActivityLog[];
  lastActiveDate: string;
  createdAt?: string;
  exploredCultureIds?: string[];
  readingCompletedIds?: string[];
  pronunciationAttempts?: number;
  dailyQuestDate?: string;
  dailyQuestProgress?: Record<string, number>;
  claimedQuestIds?: string[];
  pointsEpoch?: number;
}

export interface PronunciationHistoryItem {
  id: string;
  textKannada: string;
  textTransliteration: string;
  english: string;
  transcript: string;
  accuracyScore?: number;
  audioUrl?: string;
  timestamp: string;
}

export interface StructuredModule {
  id: string;
  lessonId: string; // references Lesson.id in SITUATION_LESSONS_DATA
  titleEnglish: string;
  titleKannada: string;
  subtitle: string;
  icon: string;
  level: 1 | 2 | 3 | 4;
  order: number;
  xpReward: number;
  objectives: string[];
  keyGrammarConcept: string;
}

export interface StructuredLevel {
  levelNumber: 1 | 2 | 3 | 4;
  titleEnglish: string;
  titleKannada: string;
  description: string;
  accentColor: string;
  modules: StructuredModule[];
}
