import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Mic,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Type,
  BookOpen,
  ArrowRight,
  Info,
  Sparkles,
  Pause,
  Play,
  Languages,
} from 'lucide-react';
import { Lesson, DialogueLine, WordBreakdown, ExplanationLanguage } from '../types';
import { speechService } from '../lib/speech';

interface DualPaneStudioProps {
  lessons: Lesson[];
  initialLessonId?: string;
  preferredLanguage: ExplanationLanguage;
  setPreferredLanguage: (lang: ExplanationLanguage) => void;
  savedWordIds: string[];
  onToggleSavedWord: (wordId: string) => void;
  onLessonComplete: (lessonId: string) => void;
}

export const DualPaneStudio: React.FC<DualPaneStudioProps> = ({
  lessons,
  initialLessonId,
  preferredLanguage,
  setPreferredLanguage,
  savedWordIds,
  onToggleSavedWord,
  onLessonComplete,
}) => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  useEffect(() => {
    if (initialLessonId && lessons.length > 0) {
      const idx = lessons.findIndex((l) => l.id === initialLessonId);
      if (idx !== -1) {
        setSelectedLessonIndex(idx);
        setSelectedLineIndex(0);
        setSelectedWord(null);
      }
    }
  }, [initialLessonId, lessons]);

  const currentLesson = lessons[selectedLessonIndex] || lessons[0];

  const [selectedLineIndex, setSelectedLineIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<WordBreakdown | null>(null);

  // Ergonomics & Controls
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);

  const activeLine: DialogueLine =
    currentLesson?.dialogue[selectedLineIndex] || currentLesson?.dialogue[0];

  // Font size classes
  const fontClasses = {
    normal: { kannada: 'text-xl sm:text-2xl', text: 'text-sm sm:text-base' },
    large: { kannada: 'text-2xl sm:text-3xl', text: 'text-base sm:text-lg' },
    xl: { kannada: 'text-3xl sm:text-4xl', text: 'text-lg sm:text-xl' },
  }[fontSize];

  // Play line audio with speed
  const handlePlayLine = (kannadaText: string) => {
    setIsPlaying(true);
    setIsPaused(false);
    speechService.speak(kannadaText, {
      rate: audioSpeed,
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onError: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
    });
  };

  const handleStopAudio = () => {
    speechService.stopSpeaking();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handlePlayWord = (wordText: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    speechService.speak(wordText, { rate: audioSpeed });
  };

  const handleToggleMic = () => {
    if (isListening) {
      speechService.stopSpeaking();
      setIsListening(false);
      return;
    }

    setSpeechTranscript('');
    setSpeechFeedback(null);
    setIsListening(true);

    speechService.startListening(
      {
        onResult: (text, isFinal) => {
          setSpeechTranscript(text);
          if (isFinal) {
            setIsListening(false);
            const targetClean = activeLine.kannada.replace(/[^\u0C80-\u0CFF]/g, '');
            const spokenClean = text.replace(/[^\u0C80-\u0CFF]/g, '');
            if (spokenClean.includes(targetClean) || targetClean.includes(spokenClean)) {
              setSpeechFeedback('ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ! Excellent pronunciation match!');
            } else {
              setSpeechFeedback(`Recognized: "${text}". Keep practicing for closer phonetic articulation.`);
            }
          }
        },
        onError: () => {
          setIsListening(false);
          setSpeechFeedback('Microphone speech recognition is not available or permission was denied.');
        },
        onEnd: () => {
          setIsListening(false);
        },
      },
      'kn-IN'
    );
  };

  if (!currentLesson) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Context */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183B28]/10 text-[#183B28] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Kannada for Everyone • ಸಂವಾದ ವೇದಿಕೆ</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#183B28]">
            Dual-Pane Studio
          </h2>
          <p className="text-xs sm:text-sm text-[#526056] mt-1 max-w-xl">
            Interactive language-learning workspace. Click words or sentences in the left dialogue pane to unlock instant grammatical and multilingual insights in the right assistant pane.
          </p>
        </div>

        {/* Lesson dropdown selector */}
        <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-[#E6E0D5] shadow-xs self-start md:self-auto">
          <BookOpen className="w-4 h-4 text-[#183B28] ml-1" />
          <select
            value={selectedLessonIndex}
            onChange={(e) => {
              setSelectedLessonIndex(Number(e.target.value));
              setSelectedLineIndex(0);
              setSelectedWord(null);
            }}
            className="text-xs sm:text-sm font-serif font-bold text-[#183B28] bg-transparent border-none cursor-pointer focus:ring-0 pr-4"
          >
            {lessons.map((lesson, idx) => (
              <option key={lesson.id} value={idx}>
                {idx + 1}. {lesson.titleEnglish} ({lesson.titleKannada})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Studio Ergonomic Toolbar */}
      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D5] mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Explanation Language Selector */}
          <div className="flex items-center gap-1.5 bg-[#EFE9DD] px-3 py-1.5 rounded-xl border border-[#E0D7C7] text-xs font-semibold text-[#4A554D]">
            <Languages className="w-3.5 h-3.5 text-[#183B28]" />
            <span>Explain in:</span>
            {[
              { code: 'en', label: 'English' },
              { code: 'mr', label: 'मराठी' },
              { code: 'hi', label: 'हिंदी' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setPreferredLanguage(l.code as ExplanationLanguage)}
                className={`cursor-pointer px-2 py-0.5 rounded-md transition-colors ${
                  preferredLanguage === l.code
                    ? 'bg-[#183B28] text-white shadow-2xs'
                    : 'hover:text-[#183B28]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Audio Speed */}
          <div className="flex items-center gap-1.5 bg-[#EFE9DD] px-3 py-1.5 rounded-xl border border-[#E0D7C7] text-xs font-semibold text-[#4A554D]">
            <span>Speech Speed:</span>
            {[0.75, 0.9, 1.1].map((s) => (
              <button
                key={s}
                onClick={() => setAudioSpeed(s)}
                className={`cursor-pointer px-2 py-0.5 rounded-md transition-colors ${
                  audioSpeed === s ? 'bg-[#183B28] text-white shadow-2xs' : 'hover:text-[#183B28]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Font Size Scaling */}
          <div className="flex items-center gap-1 bg-[#EFE9DD] px-3 py-1.5 rounded-xl border border-[#E0D7C7] text-xs font-semibold text-[#4A554D]">
            <Type className="w-3.5 h-3.5 text-[#526056] mr-1" />
            {(['normal', 'large', 'xl'] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => setFontSize(sz)}
                className={`cursor-pointer px-2 py-0.5 rounded-md capitalize transition-colors ${
                  fontSize === sz ? 'bg-[#183B28] text-white shadow-2xs' : 'hover:text-[#183B28]'
                }`}
              >
                {sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>
        </div>

        {/* Mark Lesson Complete Action */}
        <button
          onClick={() => onLessonComplete(currentLesson.id)}
          className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#183B28] hover:bg-[#122D1F] text-white text-xs font-bold transition-all shadow-xs"
        >
          <CheckCircle className="w-4 h-4 text-amber-300" />
          <span>Mark Lesson Completed (+10 pts)</span>
        </button>
      </div>

      {/* DUAL-PANE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE — KANNADA CONVERSATION (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-[#E6E0D5] shadow-xs flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-4 mb-5">
            <div>
              <span className="text-[11px] font-bold text-[#E07A5F] uppercase tracking-wider block">
                Left Pane • Kannada Dialogue
              </span>
              <h3 className="font-kannada font-bold text-lg text-[#183B28]">
                {currentLesson.titleKannada} — {currentLesson.titleEnglish}
              </h3>
            </div>
            <span className="text-xs text-[#526056] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E6E0D5]">
              {currentLesson.dialogue.length} Dialogue Turns
            </span>
          </div>

          {/* Dialogue Turns */}
          <div className="space-y-4 flex-1">
            {currentLesson.dialogue.map((line, index) => {
              const isSelected = selectedLineIndex === index;
              const isSpeakerA = index % 2 === 0;

              return (
                <div
                  key={line.id}
                  onClick={() => {
                    setSelectedLineIndex(index);
                    setSelectedWord(null);
                  }}
                  className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-200 border ${
                    isSelected
                      ? 'bg-[#F4EFE6] border-[#183B28] shadow-sm ring-2 ring-[#183B28]/15'
                      : 'bg-[#FAF8F4] hover:bg-[#F6F2EA] border-[#E8E2D5]'
                  } ${isSpeakerA ? 'mr-3 sm:mr-6' : 'ml-3 sm:ml-6'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-xs text-[#183B28] uppercase tracking-wider flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isSpeakerA ? 'bg-[#183B28]' : 'bg-[#E07A5F]'}`} />
                      {line.speaker} {line.speakerRole ? `(${line.speakerRole})` : ''}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPlaying && isSelected) {
                            handleStopAudio();
                          } else {
                            handlePlayLine(line.kannada);
                          }
                        }}
                        className="cursor-pointer p-1.5 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#183B28] border border-[#DDD5C7] transition-colors"
                        title="Play dialogue audio"
                      >
                        {isPlaying && isSelected ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLineIndex(index);
                          handleToggleMic();
                        }}
                        className={`cursor-pointer p-1.5 rounded-lg border transition-colors ${
                          isListening && isSelected
                            ? 'bg-red-500 text-white border-red-600 animate-pulse'
                            : 'bg-white hover:bg-[#FAF7F2] text-[#526056] border-[#DDD5C7]'
                        }`}
                        title="Practice pronunciation with microphone"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Word Chips in Kannada Script */}
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {line.words.map((w, wIdx) => {
                        const isWordSelected = selectedWord?.kannada === w.kannada;
                        return (
                          <span
                            key={wIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLineIndex(index);
                              setSelectedWord(w);
                              handlePlayWord(w.kannada, e);
                            }}
                            className={`font-kannada font-bold ${fontClasses.kannada} px-1 rounded transition-colors ${
                              isWordSelected
                                ? 'bg-amber-300 text-[#183B28] underline underline-offset-4 ring-2 ring-amber-400/40'
                                : 'hover:bg-[#183B28]/10 text-[#183B28]'
                            }`}
                          >
                            {w.kannada}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Transliteration */}
                  <p className="font-mono text-xs sm:text-sm text-[#5D6B60] leading-snug mb-1.5">
                    {line.transliteration}
                  </p>

                  {/* Multilingual Translation */}
                  <p className="text-xs sm:text-sm text-[#2A312B] font-medium">
                    {line.translations[preferredLanguage] || line.translations.en}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Real-time Speech Recognition Feedback */}
          {isListening && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 animate-fadeIn">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                <Mic className="w-4 h-4 text-red-600 animate-pulse" />
                <span>Listening... Speak the Kannada sentence now:</span>
              </div>
              <p className="text-sm italic">
                {speechTranscript || 'Speak clearly into your microphone in Kannada...'}
              </p>
            </div>
          )}

          {speechFeedback && !isListening && (
            <div className="mt-4 p-3 rounded-2xl bg-[#183B28]/5 border border-[#183B28]/15 text-xs text-[#183B28] flex items-center justify-between">
              <span>{speechFeedback}</span>
              <button
                onClick={() => setSpeechFeedback(null)}
                className="cursor-pointer text-[#183B28] underline font-medium ml-2"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="mt-5 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs text-[#707F74]">
            <span>Click any individual word to inspect meaning, grammar, and pronunciation</span>
            <span className="hidden sm:inline">Kannada for Everyone</span>
          </div>
        </div>

        {/* RIGHT PANE — LEARNING ASSISTANT (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-[#E6E0D5] shadow-xs flex flex-col min-h-[580px] lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-4 mb-5">
            <div>
              <span className="text-[11px] font-bold text-[#183B28] uppercase tracking-wider block">
                Right Pane • Learning Assistant
              </span>
              <h3 className="font-serif font-bold text-lg text-[#2A2E2B]">
                {selectedWord ? 'Word Analysis & Pronunciation' : 'Sentence Breakdown'}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePlayLine(selectedWord ? selectedWord.kannada : activeLine.kannada)}
                className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#183B28] text-xs font-semibold border border-[#E6E0D5]"
                title="Play pronunciation"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>
            </div>
          </div>

          {/* Selected Item Card */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5] mb-5">
            <span className="text-[11px] font-bold text-[#E07A5F] uppercase tracking-wider block mb-1">
              {selectedWord ? 'Selected Word' : 'Selected Dialogue Sentence'}
            </span>
            <h4 className="font-kannada font-bold text-2xl text-[#183B28] mb-1">
              {selectedWord ? selectedWord.kannada : activeLine.kannada}
            </h4>
            <p className="font-mono text-sm text-[#5D6B60]">
              {selectedWord ? selectedWord.transliteration : activeLine.transliteration}
            </p>
          </div>

          {/* Multilingual Meanings */}
          <div className="space-y-2.5 mb-5">
            <div className="p-3 rounded-xl bg-white border border-[#E6E0D5] flex items-start gap-2.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                EN
              </span>
              <div>
                <p className="text-xs text-[#5D6B60] font-medium">English Translation</p>
                <p className="text-sm font-semibold text-[#183B28]">
                  {selectedWord ? selectedWord.meaning.en : activeLine.translations.en}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E6E0D5] flex items-start gap-2.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200 uppercase">
                MR
              </span>
              <div>
                <p className="text-xs text-[#5D6B60] font-medium">मराठी अनुवाद</p>
                <p className="text-sm font-semibold text-[#183B28]">
                  {selectedWord ? selectedWord.meaning.mr : activeLine.translations.mr}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E6E0D5] flex items-start gap-2.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                HI
              </span>
              <div>
                <p className="text-xs text-[#5D6B60] font-medium">हिंदी अनुवाद</p>
                <p className="text-sm font-semibold text-[#183B28]">
                  {selectedWord ? selectedWord.meaning.hi : activeLine.translations.hi}
                </p>
              </div>
            </div>
          </div>

          {/* Grammar & Register Notes */}
          <div className="space-y-3 mb-5 flex-1">
            {activeLine.grammarNotes && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950">
                <span className="font-bold flex items-center gap-1 mb-1 text-amber-900">
                  <Info className="w-3.5 h-3.5 text-amber-800" />
                  Grammar Explanation:
                </span>
                <p className="leading-relaxed">{activeLine.grammarNotes}</p>
              </div>
            )}

            {activeLine.formality && (
              <div className="flex items-center gap-2 text-xs text-[#526056]">
                <span className="font-semibold">Formal vs Informal:</span>
                <span className="capitalize px-2.5 py-0.5 rounded-full bg-[#183B28]/10 text-[#183B28] font-bold">
                  {activeLine.formality} register
                </span>
              </div>
            )}

            {/* Additional Example Sentence */}
            {activeLine.additionalExample && (
              <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5] text-xs">
                <span className="font-bold text-[#183B28] uppercase tracking-wider block mb-1">
                  Additional Example:
                </span>
                <p className="font-kannada font-bold text-sm text-[#183B28]">
                  {activeLine.additionalExample.kannada}
                </p>
                <p className="font-mono text-[11px] text-[#5D6B60]">
                  {activeLine.additionalExample.transliteration}
                </p>
                <p className="text-[11px] text-[#2A2E2B] mt-0.5 font-medium">
                  "{activeLine.additionalExample.meaning}"
                </p>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-between">
            <button
              onClick={() => {
                const targetId = selectedWord ? `voc-${selectedWord.kannada}` : `line-${activeLine.id}`;
                onToggleSavedWord(targetId);
              }}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#183B28] hover:bg-[#122D1F] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <Bookmark className="w-4 h-4 text-amber-300" />
              <span>Save to Vocabulary</span>
            </button>

            {selectedWord && (
              <button
                onClick={() => setSelectedWord(null)}
                className="cursor-pointer text-xs text-[#526056] hover:text-[#183B28] underline font-medium"
              >
                Reset to Sentence View
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default DualPaneStudio;
