import React, { useState } from 'react';
import {
  Search,
  Volume2,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Layers,
  LayoutGrid,
  Headphones,
  HelpCircle,
  ArrowRight,
  Check,
  X,
  Zap,
  Filter,
} from 'lucide-react';
import { VocabularyItem, ExplanationLanguage, VocabMasteryStatus } from '../types';
import { speechService } from '../lib/speech';

interface VocabularyBuilderProps {
  vocabulary: VocabularyItem[];
  preferredLanguage: ExplanationLanguage;
  savedWordIds: string[];
  onToggleSavedWord: (wordId: string) => void;
  vocabStatus?: Record<string, VocabMasteryStatus>;
  onUpdateVocabStatus?: (wordId: string, status: VocabMasteryStatus) => void;
}

type ViewMode = 'grid' | 'flashcards' | 'quiz-kn-to-en' | 'quiz-en-to-kn' | 'listening';

export const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({
  vocabulary,
  preferredLanguage,
  savedWordIds,
  onToggleSavedWord,
  vocabStatus = {},
  onUpdateVocabStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'saved' | VocabMasteryStatus>('all');
  const [mode, setMode] = useState<ViewMode>('grid');

  // Flashcard state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Practice Quiz State
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);

  // Local mastery status fallback if parent doesn't provide
  const [localStatus, setLocalStatus] = useState<Record<string, VocabMasteryStatus>>(vocabStatus);

  const getWordStatus = (id: string): VocabMasteryStatus => {
    return vocabStatus[id] || localStatus[id] || (savedWordIds.includes(id) ? 'learning' : 'new');
  };

  const handleSetStatus = (id: string, status: VocabMasteryStatus, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLocalStatus((prev) => ({ ...prev, [id]: status }));
    if (onUpdateVocabStatus) {
      onUpdateVocabStatus(id, status);
    }
  };

  const categories = [
    'All',
    'Greetings',
    'Daily',
    'Food',
    'Market',
    'Travel',
    'Numbers',
    'Time',
    'Workplace',
    'Health',
    'Culture',
  ];

  // Filtered list
  const filteredWords = vocabulary.filter((item) => {
    const matchesCat =
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    if (!matchesCat) return false;

    const st = getWordStatus(item.id);
    if (statusFilter === 'saved' && !savedWordIds.includes(item.id)) return false;
    if (statusFilter === 'new' && st !== 'new') return false;
    if (statusFilter === 'learning' && st !== 'learning') return false;
    if (statusFilter === 'mastered' && st !== 'mastered') return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.kannada.includes(q) ||
      item.transliteration.toLowerCase().includes(q) ||
      item.meanings.en.toLowerCase().includes(q) ||
      item.meanings.mr.toLowerCase().includes(q) ||
      item.meanings.hi.toLowerCase().includes(q)
    );
  });

  const handleSpeak = (text: string, e?: React.MouseEvent, rate = 0.85) => {
    e?.stopPropagation();
    speechService.speak(text, { rate });
  };

  const currentFlashcard = filteredWords[flashcardIndex] || filteredWords[0] || vocabulary[0];
  const currentPracticeWord = filteredWords[practiceIndex] || filteredWords[0] || vocabulary[0];

  // Helper to generate options for quiz modes
  const generateQuizOptions = (word: VocabularyItem, type: 'kn-to-en' | 'en-to-kn') => {
    const correct =
      type === 'kn-to-en'
        ? word.meanings[preferredLanguage] || word.meanings.en
        : word.kannada;

    const pool = vocabulary.filter((w) => w.id !== word.id);
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const otherOptions = shuffled.map((w) =>
      type === 'kn-to-en' ? w.meanings[preferredLanguage] || w.meanings.en : w.kannada
    );

    return [correct, ...otherOptions].sort(() => 0.5 - Math.random());
  };

  const [quizOptions, setQuizOptions] = useState<string[]>(() =>
    generateQuizOptions(currentPracticeWord, 'kn-to-en')
  );

  const handleSwitchPracticeQuestion = (nextIdx: number, type: 'kn-to-en' | 'en-to-kn') => {
    const nextWord = filteredWords[nextIdx] || filteredWords[0];
    setPracticeIndex(nextIdx);
    setSelectedOption(null);
    setIsSubmitted(false);
    if (nextWord) {
      setQuizOptions(generateQuizOptions(nextWord, type));
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>ಶಬ್ದಕೋಶ • LingQ-Inspired Spaced Repetition</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-slate-900">
            Essential Kannada Vocabulary
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Build rapid conversational fluency with 160+ high-frequency Kannada words, romanized phonetics, multilingual definitions, and spaced-repetition mastery drills.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('grid')}
            className={`cursor-pointer px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'grid'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('flashcards');
              setFlashcardIndex(0);
              setIsFlipped(false);
            }}
            className={`cursor-pointer px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'flashcards'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flashcards</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('quiz-kn-to-en');
              handleSwitchPracticeQuestion(0, 'kn-to-en');
            }}
            className={`cursor-pointer px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'quiz-kn-to-en'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Kannada &rarr; Meaning</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('listening');
              handleSwitchPracticeQuestion(0, 'kn-to-en');
            }}
            className={`cursor-pointer px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'listening'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Listening Lab</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR (Available across modes) */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in Kannada, English, Marathi, or Hindi..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
            />
          </div>

          {/* Mastery Status Filter (LingQ levels) */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
            <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Status:</span>
            {[
              { id: 'all' as const, label: 'All Words' },
              { id: 'saved' as const, label: 'Saved' },
              { id: 'new' as const, label: 'New (ಹೊಸದು)' },
              { id: 'learning' as const, label: 'Learning' },
              { id: 'mastered' as const, label: 'Mastered' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`cursor-pointer text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors shrink-0 ${
                  statusFilter === f.id
                    ? 'bg-indigo-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0">Topic:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer px-3 py-1 rounded-xl font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-slate-400 text-xs ml-auto shrink-0">
            {filteredWords.length} words
          </span>
        </div>
      </div>

      {/* MODE 1: GRID CATALOGUE VIEW */}
      {mode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((item) => {
            const isSaved = savedWordIds.includes(item.id);
            const status = getWordStatus(item.id);
            const meaning = item.meanings[preferredLanguage] || item.meanings.en;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200 p-5 transition-all hover:border-indigo-300 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Category, Status & Bookmark */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-100">
                      {item.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* LingQ Mastery Dropdown */}
                      <select
                        value={status}
                        onChange={(e) => handleSetStatus(item.id, e.target.value as VocabMasteryStatus)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border cursor-pointer ${
                          status === 'mastered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : status === 'learning'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="learning">Learning</option>
                        <option value="mastered">Mastered</option>
                      </select>

                      {/* Save Word Toggle */}
                      <button
                        type="button"
                        onClick={() => onToggleSavedWord(item.id)}
                        className={`cursor-pointer p-1.5 rounded-lg transition-colors ${
                          isSaved
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                        title={isSaved ? 'Remove from Saved' : 'Save for Spaced Review'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Kannada Headword & Audio Button */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h3 className="font-kannada font-bold text-2xl text-slate-900 group-hover:text-indigo-900 transition-colors">
                        {item.kannada}
                      </h3>
                      <p className="text-xs font-mono text-indigo-700 font-medium">
                        {item.transliteration}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleSpeak(item.kannada, e)}
                      className="cursor-pointer p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors shadow-2xs"
                      title="Listen to native Kannada pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Meaning in Chosen Language */}
                  <div className="text-sm font-semibold text-slate-800 mt-2">
                    {meaning}
                  </div>

                  {/* Trilingual pill tags */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>EN: {item.meanings.en}</span>
                    <span>•</span>
                    <span className="font-hindi">हिंदी: {item.meanings.hi}</span>
                  </div>

                  {/* Example Sentence */}
                  {item.exampleSentence && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-0.5">
                      <p className="font-kannada font-medium text-slate-700">
                        {item.exampleSentence.kannada}
                      </p>
                      <p className="text-[11px] text-slate-500 italic">
                        {item.exampleSentence.meaning}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pronunciation Advice */}
                {item.pronunciationTip && (
                  <div className="mt-3 text-[10px] text-indigo-700 bg-indigo-50/60 p-2 rounded-lg leading-relaxed">
                    Tip: {item.pronunciationTip}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: INTERACTIVE 3D FLASHCARDS */}
      {mode === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>
              Card {flashcardIndex + 1} of {filteredWords.length}
            </span>
            <span className="font-semibold text-indigo-700">Click card to flip</span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[300px] sm:min-h-[340px] rounded-3xl bg-white border-2 border-indigo-200 shadow-xl p-8 flex flex-col justify-between transition-all hover:border-indigo-500 hover:shadow-2xl relative select-none"
          >
            {/* Top Bar on Flashcard */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {currentFlashcard.category}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSavedWord(currentFlashcard.id);
                }}
                className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-amber-600 transition-colors"
              >
                {savedWordIds.includes(currentFlashcard.id) ? (
                  <BookmarkCheck className="w-5 h-5 fill-amber-500 text-amber-600" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Front vs Back Content */}
            {!isFlipped ? (
              <div className="text-center py-8 space-y-3">
                <div className="font-kannada font-bold text-5xl sm:text-6xl text-slate-900 tracking-tight">
                  {currentFlashcard.kannada}
                </div>
                <div className="text-sm font-mono text-indigo-700 font-semibold">
                  {currentFlashcard.transliteration}
                </div>
                <button
                  type="button"
                  onClick={(e) => handleSpeak(currentFlashcard.kannada, e)}
                  className="cursor-pointer mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Audio</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4 animate-in fade-in">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {currentFlashcard.meanings[preferredLanguage] || currentFlashcard.meanings.en}
                </div>

                <div className="flex justify-center gap-3 text-xs text-slate-500 font-medium">
                  <span>English: {currentFlashcard.meanings.en}</span>
                  <span>•</span>
                  <span>मराठी: {currentFlashcard.meanings.mr}</span>
                  <span>•</span>
                  <span>हिंदी: {currentFlashcard.meanings.hi}</span>
                </div>

                {currentFlashcard.exampleSentence && (
                  <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-1">
                    <p className="font-kannada font-semibold text-slate-900 text-sm">
                      {currentFlashcard.exampleSentence.kannada}
                    </p>
                    <p className="text-xs text-slate-500">
                      {currentFlashcard.exampleSentence.meaning}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Bar: Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                {isFlipped ? 'Click again to view Kannada' : 'Tap to reveal translation'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => handleSetStatus(currentFlashcard.id, 'mastered', e)}
                  className={`cursor-pointer px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    getWordStatus(currentFlashcard.id) === 'mastered'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  ✓ Mark Mastered
                </button>
              </div>
            </div>
          </div>

          {/* Flashcard Nav controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={flashcardIndex === 0}
              onClick={() => {
                setFlashcardIndex((i) => Math.max(0, i - 1));
                setIsFlipped(false);
              }}
              className="cursor-pointer px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              &larr; Previous Card
            </button>

            <button
              type="button"
              onClick={() => {
                setFlashcardIndex((i) => (i + 1) % filteredWords.length);
                setIsFlipped(false);
              }}
              className="cursor-pointer px-6 py-2.5 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-700/20"
            >
              Next Card &rarr;
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: KANNADA TO MEANING QUIZ */}
      {(mode === 'quiz-kn-to-en' || mode === 'listening') && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-indigo-700 uppercase tracking-wider">
                {mode === 'listening' ? 'Listening Lab Exercise' : 'Vocabulary Quiz'}
              </span>
              <span>
                Question {practiceIndex + 1} of {filteredWords.length}
              </span>
            </div>

            {/* Prompt */}
            <div className="text-center py-4 space-y-3">
              {mode === 'listening' ? (
                <div>
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 shadow-xs">
                    <Headphones className="w-8 h-8" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSpeak(currentPracticeWord.kannada)}
                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-700 text-white text-xs font-bold hover:bg-indigo-800 shadow-md"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Click to Hear Kannada Word</span>
                  </button>
                  <p className="text-xs text-slate-400 mt-2">
                    Listen closely and select the correct matching definition.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="font-kannada font-bold text-4xl text-slate-900 mb-1">
                    {currentPracticeWord.kannada}
                  </div>
                  <div className="text-xs font-mono text-indigo-700 font-semibold">
                    {currentPracticeWord.transliteration}
                  </div>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {quizOptions.map((opt) => {
                const correctMeaning =
                  currentPracticeWord.meanings[preferredLanguage] || currentPracticeWord.meanings.en;
                const isSelected = selectedOption === opt;
                const isCorrect = opt === correctMeaning;

                let btnStyle = 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800';
                if (isSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-50 border-red-500 text-red-900 font-bold';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/20 text-indigo-900 font-bold';
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => setSelectedOption(opt)}
                    className={`cursor-pointer w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                    {isSubmitted && isSelected && !isCorrect && (
                      <X className="w-4 h-4 text-red-600 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Check or Next Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {!isSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedOption}
                  onClick={() => {
                    setIsSubmitted(true);
                    const correctMeaning =
                      currentPracticeWord.meanings[preferredLanguage] || currentPracticeWord.meanings.en;
                    if (selectedOption === correctMeaning) {
                      setPracticeScore((s) => s + 1);
                      handleSetStatus(currentPracticeWord.id, 'mastered');
                    } else {
                      handleSetStatus(currentPracticeWord.id, 'learning');
                    }
                  }}
                  className="cursor-pointer ml-auto px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 text-white font-bold text-xs shadow-md"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (practiceIndex + 1) % filteredWords.length;
                    handleSwitchPracticeQuestion(nextIdx, 'kn-to-en');
                  }}
                  className="cursor-pointer ml-auto inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default VocabularyBuilder;
