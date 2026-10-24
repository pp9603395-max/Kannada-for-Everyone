import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Sparkles,
  ArrowRight,
  Flame,
  Volume2,
  X,
  ListOrdered,
  Eye,
} from 'lucide-react';
import { Quiz, QuizQuestion, ExplanationLanguage } from '../types';
import { speechService } from '../lib/speech';

interface InteractiveQuizProps {
  quiz: Quiz;
  preferredLanguage: ExplanationLanguage;
  onCompleteQuiz: (score: number, total: number) => void;
  onClose?: () => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  quiz,
  preferredLanguage,
  onCompleteQuiz,
  onClose,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedPairLeft, setSelectedPairLeft] = useState<string | null>(null);

  // Sentence reorder state
  const [arrangedWords, setArrangedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakesList, setMistakesList] = useState<Array<{ question: QuizQuestion; userAnswer: string }>>([]);
  const [showMistakesReview, setShowMistakesReview] = useState(false);

  const question: QuizQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  // Initialize word bank when question is reorder type
  React.useEffect(() => {
    if (question?.type === 'reorder') {
      const words = question.wordsToArrange || (typeof question.correctAnswer === 'string' ? question.correctAnswer.split(' ') : []);
      const shuffled = [...words].sort(() => 0.5 - Math.random());
      setAvailableWords(shuffled);
      setArrangedWords([]);
    } else {
      setAvailableWords([]);
      setArrangedWords([]);
    }
  }, [currentQuestionIndex, question]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#6366F1'],
      });
    } catch {
      // ignore
    }
  };

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(opt);
    setTextAnswer('');
  };

  const handleMatchSelect = (leftWord: string, rightWord: string) => {
    if (isSubmitted) return;
    setMatchedPairs((prev) => {
      const next: Record<string, string> = { ...prev };
      // A meaning can only be assigned to one Kannada word.
      Object.keys(next).forEach((key) => {
        if (next[key] === rightWord && key !== leftWord) delete next[key];
      });
      next[leftWord] = rightWord;
      return next;
    });
    setSelectedPairLeft(null);
  };

  // Click word chip from bank to add to sentence
  const handleAddWordToSentence = (word: string, indexInBank: number) => {
    if (isSubmitted) return;
    setArrangedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== indexInBank));
  };

  // Click word chip in sentence to return to bank
  const handleRemoveWordFromSentence = (word: string, indexInSentence: number) => {
    if (isSubmitted) return;
    setArrangedWords((prev) => prev.filter((_, i) => i !== indexInSentence));
    setAvailableWords((prev) => [...prev, word]);
  };

  const handleCheckAnswer = () => {
    setIsSubmitted(true);

    const choiceTypes = ['multiple-choice', 'fill-blank', 'translation', 'contextual'];
    let isCorrect = false;
    let answerGiven = selectedAnswer || textAnswer || '';

    if (!question.type || choiceTypes.includes(question.type)) {
      const given = (selectedAnswer || textAnswer || '').trim();
      const expected = Array.isArray(question.correctAnswer)
        ? question.correctAnswer[0]
        : String(question.correctAnswer);
      isCorrect = given.toLowerCase() === expected.trim().toLowerCase();
      answerGiven = given;
    } else if (question.type === 'reorder') {
      const formedSentence = arrangedWords.join(' ').trim();
      const targetSentence = Array.isArray(question.correctAnswer)
        ? question.correctAnswer.join(' ').trim()
        : String(question.correctAnswer).trim();
      isCorrect = formedSentence === targetSentence;
      answerGiven = formedSentence;
    } else if (question.type === 'match') {
      const pairs = question.pairs || [];
      isCorrect =
        pairs.length > 0 &&
        pairs.every((pair) => matchedPairs[pair.kannada] === pair.english);
      answerGiven = pairs.map((pair) => `${pair.kannada} → ${matchedPairs[pair.kannada] || '—'}`).join(', ');
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setMistakesList((prev) => [
        ...prev,
        { question, userAnswer: answerGiven || 'No answer selected' },
      ]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setTextAnswer('');
      setIsSubmitted(false);
      setMatchedPairs({});
      setSelectedPairLeft(null);
    } else {
      setIsFinished(true);
      triggerConfetti();
      onCompleteQuiz(score, totalQuestions);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTextAnswer('');
    setMatchedPairs({});
    setIsSubmitted(false);
    setScore(0);
    setIsFinished(false);
    setMistakesList([]);
    setShowMistakesReview(false);
  };

  const explanationText =
    question?.explanation?.[preferredLanguage] || question?.explanation?.en || '';

  const isChoiceQuestion =
    !question?.type ||
    ['multiple-choice', 'fill-blank', 'translation', 'contextual'].includes(question.type);
  const matchPairs = question?.pairs || [];
  const allPairsMatched =
    matchPairs.length > 0 && Object.keys(matchedPairs).length >= matchPairs.length;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-2xl animate-in fade-in duration-200">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            {quiz.title}
          </span>
          <h3 className="font-serif font-bold text-lg text-slate-900 mt-1">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Score: {score}</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="cursor-pointer text-xs text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close Quiz"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* FINISHED SCREEN */}
      {isFinished ? (
        <div className="text-center py-6 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center text-amber-600 mx-auto shadow-md shadow-amber-500/20">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-2xl text-slate-900 mb-1">
              Quiz Completed!
            </h3>
            <p className="font-kannada font-bold text-lg text-emerald-700 mb-2">
              ಅಭಿನಂದನೆಗಳು! (Congratulations!)
            </p>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              You scored <strong>{score}</strong> out of <strong>{totalQuestions}</strong> ({Math.round((score / totalQuestions) * 100)}%). Verified learning points have been recorded in Cloud Firestore!
            </p>
          </div>

          {/* Mistakes review trigger if any */}
          {mistakesList.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-700" />
                  <span>Review {mistakesList.length} Missed Question{mistakesList.length > 1 ? 's' : ''}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowMistakesReview(!showMistakesReview)}
                  className="cursor-pointer text-xs font-bold text-indigo-700 hover:underline"
                >
                  {showMistakesReview ? 'Hide Review' : 'View Breakdown'}
                </button>
              </div>

              {showMistakesReview && (
                <div className="space-y-3 pt-2 border-t border-amber-200 text-xs">
                  {mistakesList.map((m, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-amber-100 space-y-1">
                      <p className="font-bold text-slate-800">{m.question.prompt}</p>
                      <p className="text-red-700">Your answer: {m.userAnswer}</p>
                      <p className="text-emerald-700 font-semibold font-kannada">
                        Correct: {Array.isArray(m.question.correctAnswer) ? m.question.correctAnswer.join(' ') : m.question.correctAnswer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="cursor-pointer inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-700/20 transition-all"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* QUESTION WORKSPACE */
        <div>
          {/* Question Prompt */}
          <div className="mb-6 space-y-2">
            <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900 leading-snug">
              {question.prompt}
            </h4>

            {question.promptKannada && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <span className="font-kannada font-bold text-xl text-indigo-950">
                  {question.promptKannada}
                </span>
                <button
                  onClick={() => speechService.speak(question.promptKannada!)}
                  className="cursor-pointer p-1.5 rounded-lg text-indigo-700 hover:bg-indigo-100 transition-colors ml-auto"
                  title="Listen to Kannada audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* TYPE 1: Multiple Choice, Fill-Blank, Translation & Contextual */}
          {isChoiceQuestion && question.options && (
            <div className="space-y-2.5 mb-6">
              {question.options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                const expected = Array.isArray(question.correctAnswer)
                  ? question.correctAnswer[0]
                  : question.correctAnswer;
                const isCorrect = isSubmitted && opt === expected;
                const isWrong = isSubmitted && isSelected && opt !== expected;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isSubmitted}
                    className={`cursor-pointer w-full text-left p-4 rounded-2xl border text-sm sm:text-base font-semibold transition-all flex items-center justify-between ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 font-bold'
                        : isWrong
                        ? 'bg-red-50 border-red-500 text-red-950'
                        : isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-950 ring-2 ring-indigo-600/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="font-kannada text-base sm:text-lg">{opt}</span>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {isWrong && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Free-text answer for translation questions without options */}
          {isChoiceQuestion &&
            !question.options &&
            (() => {
              const expected = Array.isArray(question.correctAnswer)
                ? question.correctAnswer[0]
                : question.correctAnswer;
              const isCorrect = isSubmitted && textAnswer.trim().toLowerCase() === expected.trim().toLowerCase();
              return (
                <div className="mb-6 space-y-2">
                  <input
                    type="text"
                    value={textAnswer}
                    onChange={(e) => {
                      setTextAnswer(e.target.value);
                      setSelectedAnswer(null);
                    }}
                    disabled={isSubmitted}
                    placeholder="Type your Kannada or English answer..."
                    className={`w-full p-4 rounded-2xl border font-kannada text-base outline-none transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                          : 'bg-red-50 border-red-400 text-red-950'
                        : 'bg-white border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
                    }`}
                  />
                  {isSubmitted && (
                    <p className={`text-xs font-semibold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                      {isCorrect ? 'Correct!' : `Expected answer: ${expected}`}
                    </p>
                  )}
                </div>
              );
            })()}

          {/* TYPE 2: Sentence Reordering (Arranging Word Chips) */}
          {question.type === 'reorder' && (
            <div className="space-y-4 mb-6">
              {/* Target Sentence Workspace */}
              <div className="min-h-[64px] p-4 rounded-2xl bg-indigo-50/50 border-2 border-dashed border-indigo-300 flex flex-wrap items-center gap-2">
                {arrangedWords.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    Tap word chips below in the correct sentence order...
                  </span>
                ) : (
                  arrangedWords.map((word, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleRemoveWordFromSentence(word, i)}
                      className="cursor-pointer px-3.5 py-2 rounded-xl bg-indigo-700 text-white font-kannada font-bold text-sm shadow-xs hover:bg-indigo-800 transition-transform active:scale-95"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              {/* Available Word Bank */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Word Bank:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {availableWords.map((word, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleAddWordToSentence(word, i)}
                      className="cursor-pointer px-3.5 py-2 rounded-xl bg-white border-2 border-slate-200 hover:border-indigo-500 font-kannada font-bold text-sm text-slate-800 shadow-2xs transition-transform active:scale-95"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TYPE 3: Word Matching */}
          {question.type === 'match' && question.pairs && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-slate-500">
                  Select a Kannada word, then tap its matching meaning.
                </p>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  {Object.keys(matchedPairs).length} / {question.pairs.length} matched
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase">Kannada Word</p>
                  {question.pairs.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => setSelectedPairLeft(p.kannada)}
                      className={`cursor-pointer w-full text-left p-3 rounded-xl border text-sm font-kannada font-bold transition-all ${
                        selectedPairLeft === p.kannada
                          ? 'bg-indigo-100 border-indigo-600 text-indigo-950 ring-2 ring-indigo-500/20'
                          : matchedPairs[p.kannada]
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span>{p.kannada}</span>
                        {matchedPairs[p.kannada] && (
                          <span className="text-[9px] font-sans font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded max-w-[55%] truncate">
                            {matchedPairs[p.kannada]}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase">Meaning</p>
                  {question.pairs.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => {
                        if (selectedPairLeft) {
                          handleMatchSelect(selectedPairLeft, p.english);
                        }
                      }}
                      className={`cursor-pointer w-full text-left p-3 rounded-xl border text-sm font-semibold transition-all ${
                        Object.values(matchedPairs).includes(p.english)
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                          : selectedPairLeft
                          ? 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span>{p.english}</span>
                        {Object.values(matchedPairs).includes(p.english) && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Explanation Box when submitted */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs sm:text-sm text-slate-800 mb-6 space-y-1">
              <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Pedagogical Explanation:</span>
              </span>
              <p className="leading-relaxed pl-5 text-slate-700">{explanationText}</p>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (question.promptKannada) speechService.speak(question.promptKannada);
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-700 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Hear Audio</span>
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleCheckAnswer}
                disabled={
                  (isChoiceQuestion && !selectedAnswer && !textAnswer.trim()) ||
                  (question.type === 'reorder' && arrangedWords.length === 0) ||
                  (question.type === 'match' && !allPairsMatched)
                }
                className="cursor-pointer px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-700/20"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="cursor-pointer inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
              >
                <span>{currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default InteractiveQuiz;
