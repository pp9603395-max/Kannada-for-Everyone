import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  Headphones,
  RotateCcw,
  Languages,
  Eye,
  EyeOff,
  Sliders,
  ArrowRight,
  Info,
  Type,
  X,
  Play,
  Square,
} from 'lucide-react';
import { ExplanationLanguage } from '../types';
import { READING_STORIES, ReadingStory, ReadingSentence, InteractiveWord } from '../data/readingData';
import { speechService } from '../lib/speech';

interface InteractiveReaderProps {
  preferredLanguage: ExplanationLanguage;
  savedWordIds: string[];
  onToggleSavedWord: (wordId: string) => void;
  completedStoryIds?: string[];
  onReadingComplete?: (storyId: string) => void;
}

export const InteractiveReader: React.FC<InteractiveReaderProps> = ({
  preferredLanguage,
  savedWordIds,
  onToggleSavedWord,
  completedStoryIds = [],
  onReadingComplete,
}) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<InteractiveWord | null>(null);
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);

  // Ergonomic display controls
  const [transliterationMode, setTransliterationMode] = useState<'none' | 'roman' | 'devanagari'>('roman');
  const [showSentenceTranslation, setShowSentenceTranslation] = useState(true);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('large');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85);
  const [isPlayingSentence, setIsPlayingSentence] = useState(false);

  const currentStory = READING_STORIES[selectedStoryIndex] || READING_STORIES[0];

  const handleSpeakText = (text: string, rate = playbackSpeed, e?: React.MouseEvent) => {
    e?.stopPropagation();
    speechService.speak(text, { rate });
  };

  const handlePlaySentence = (sentence: ReadingSentence) => {
    setActiveSentenceId(sentence.id);
    setIsPlayingSentence(true);
    speechService.speak(sentence.kannada, {
      rate: playbackSpeed,
      onEnd: () => {
        setIsPlayingSentence(false);
      },
      onError: () => {
        setIsPlayingSentence(false);
      },
    });
  };

  const handleStopSentence = () => {
    speechService.stopSpeaking();
    setIsPlayingSentence(false);
  };

  const fontSizes = {
    normal: { kannada: 'text-xl sm:text-2xl', translit: 'text-xs sm:text-sm' },
    large: { kannada: 'text-2xl sm:text-3xl', translit: 'text-sm sm:text-base' },
    xl: { kannada: 'text-3xl sm:text-4xl', translit: 'text-base sm:text-lg' },
  }[fontSize];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-[#183B28] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ಲಿಂಕ್ ಮಾದರಿಯ ವಾಚನ • LingQ-Inspired Immersion Reader</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl tracking-tight">
              Interactive Kannada Reader
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
              Read authentic Karnataka stories. Click any word to hear natural audio, see Kannada/Roman/Devanagari script, and save unfamiliar words directly to your vocabulary.
            </p>
          </div>

          {/* Quick story tabs */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            {READING_STORIES.map((story, idx) => (
              <button
                key={story.id}
                onClick={() => {
                  setSelectedStoryIndex(idx);
                  setSelectedWord(null);
                  handleStopSentence();
                }}
                className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 border ${
                  selectedStoryIndex === idx
                    ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-md scale-102'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}
              >
                <span>{story.coverEmoji}</span>
                <span className="truncate max-w-[150px]">{story.titleEnglish}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reader Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Story Text & Sentence Interactive Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#E6E0D5] shadow-xs flex flex-wrap items-center justify-between gap-4">
            {/* Transliteration Script Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-[#526056] flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-[#183B28]" />
                <span>Script:</span>
              </span>
              <div className="bg-[#FAF7F2] p-1 rounded-xl border border-[#DDD5C7] flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTransliterationMode('none')}
                  className={`cursor-pointer px-2.5 py-1 rounded-lg font-bold transition-all ${
                    transliterationMode === 'none'
                      ? 'bg-[#183B28] text-white shadow-2xs'
                      : 'text-[#526056] hover:text-[#183B28]'
                  }`}
                >
                  Kannada Only
                </button>
                <button
                  type="button"
                  onClick={() => setTransliterationMode('roman')}
                  className={`cursor-pointer px-2.5 py-1 rounded-lg font-bold transition-all ${
                    transliterationMode === 'roman'
                      ? 'bg-[#183B28] text-white shadow-2xs'
                      : 'text-[#526056] hover:text-[#183B28]'
                  }`}
                >
                  English Roman
                </button>
                <button
                  type="button"
                  onClick={() => setTransliterationMode('devanagari')}
                  className={`cursor-pointer px-2.5 py-1 rounded-lg font-bold transition-all ${
                    transliterationMode === 'devanagari'
                      ? 'bg-[#183B28] text-white shadow-2xs'
                      : 'text-[#526056] hover:text-[#183B28]'
                  }`}
                >
                  देवनागरी (मराठी/हिंदी)
                </button>
              </div>
            </div>

            {/* Translation & Font Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSentenceTranslation(!showSentenceTranslation)}
                className={`cursor-pointer px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  showSentenceTranslation
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-[#FAF7F2] text-[#526056] border-[#DDD5C7]'
                }`}
                title="Toggle sentence translations"
              >
                {showSentenceTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Translations</span>
              </button>

              {/* Font Sizer */}
              <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#DDD5C7] text-xs font-bold">
                {(['normal', 'large', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontSize(sz)}
                    className={`cursor-pointer px-2 py-0.5 rounded-lg capitalize transition-all ${
                      fontSize === sz ? 'bg-[#183B28] text-white' : 'text-[#526056]'
                    }`}
                  >
                    {sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-1 bg-[#FAF7F2] px-2 py-1 rounded-xl border border-[#DDD5C7] text-xs">
                <span className="text-[#888] font-semibold text-[11px]">Speed:</span>
                {[0.75, 0.85, 1.0].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`cursor-pointer px-1.5 py-0.5 rounded font-mono font-bold text-[11px] ${
                      playbackSpeed === spd ? 'bg-[#183B28] text-white' : 'text-[#526056]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Story Container */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#E6E0D5] shadow-xs space-y-6">
            <div className="border-b border-[#E6E0D5] pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  {currentStory.category} • {currentStory.difficulty}
                </span>
                <h3 className="font-kannada font-bold text-2xl sm:text-3xl text-[#183B28] mt-2">
                  {currentStory.titleKannada}
                </h3>
                <h4 className="font-serif font-bold text-lg text-slate-800">
                  {currentStory.titleEnglish}
                </h4>
              </div>
              <span className="text-3xl">{currentStory.coverEmoji}</span>
            </div>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-[#526056] leading-relaxed italic bg-white/70 p-3.5 rounded-2xl border border-[#E8E2D5]">
              {currentStory.synopsis[preferredLanguage] || currentStory.synopsis.en}
            </p>

            {/* Sentences List */}
            <div className="space-y-6">
              {currentStory.sentences.map((sent, sIdx) => {
                const isActive = activeSentenceId === sent.id;

                return (
                  <div
                    key={sent.id}
                    className={`p-5 rounded-2xl border transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                        : 'bg-white border-[#E6E0D5] hover:border-emerald-300'
                    }`}
                  >
                    {/* Sentence Audio Play Button and Counter */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider">
                        Sentence {sIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          isPlayingSentence && activeSentenceId === sent.id
                            ? handleStopSentence()
                            : handlePlaySentence(sent)
                        }
                        className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          isPlayingSentence && activeSentenceId === sent.id
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                        }`}
                      >
                        {isPlayingSentence && activeSentenceId === sent.id ? (
                          <>
                            <Square className="w-3.5 h-3.5" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Clickable Words Stream (LingQ style) */}
                    <div className="flex flex-wrap gap-2 items-center leading-loose">
                      {sent.words.map((word) => {
                        const isSelected = selectedWord?.id === word.id;
                        const isSaved = savedWordIds.includes(word.id);

                        return (
                          <button
                            key={word.id}
                            type="button"
                            onClick={() => {
                              setSelectedWord(word);
                              handleSpeakText(word.kannada);
                            }}
                            className={`cursor-pointer text-left px-2.5 py-1.5 rounded-xl border transition-all group relative ${
                              isSelected
                                ? 'bg-[#183B28] text-white border-[#183B28] shadow-md ring-2 ring-emerald-500/30'
                                : isSaved
                                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                                : 'bg-slate-50 hover:bg-emerald-50 text-slate-900 border-slate-200 hover:border-emerald-400'
                            }`}
                          >
                            <span className={`font-kannada font-bold block ${fontSizes.kannada}`}>
                              {word.kannada}
                            </span>
                            {transliterationMode === 'roman' && (
                              <span
                                className={`block font-sans text-xs ${
                                  isSelected ? 'text-amber-200' : 'text-[#666]'
                                }`}
                              >
                                {word.transliteration}
                              </span>
                            )}
                            {transliterationMode === 'devanagari' && (
                              <span
                                className={`block font-devanagari text-xs ${
                                  isSelected ? 'text-amber-200' : 'text-[#666]'
                                }`}
                              >
                                {word.devanagari}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Sentence Transliteration & Translation */}
                    {showSentenceTranslation && (
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                        {transliterationMode !== 'none' && (
                          <p className="text-xs text-[#666] font-mono">
                            {transliterationMode === 'roman' ? sent.transliteration : sent.devanagari}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm font-semibold text-[#183B28]">
                          {sent.translations[preferredLanguage] || sent.translations.en}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Story completion */}
            <div className="pt-5 border-t border-[#E6E0D5]">
              {completedStoryIds.includes(currentStory.id) ? (
                <div className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-100/70 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>Story completed — +20 XP earned. Read it again anytime to reinforce vocabulary.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onReadingComplete?.(currentStory.id)}
                  disabled={!onReadingComplete}
                  className="cursor-pointer w-full py-3.5 px-4 rounded-2xl bg-[#183B28] hover:bg-[#122D1F] disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Mark “{currentStory.titleEnglish}” as complete</span>
                  <span className="ml-auto text-[10px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">+20 XP</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: LingQ Floating Word Assistant */}
        <div className="lg:col-span-4 sticky top-24">
          {selectedWord ? (
            <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xl space-y-5 animate-in fade-in duration-150">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {selectedWord.partOfSpeech}
                  </span>
                  <h3 className="font-kannada font-bold text-3xl sm:text-4xl text-[#183B28] mt-2 leading-tight">
                    {selectedWord.kannada}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-slate-600">
                      {selectedWord.transliteration}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-600 font-devanagari">
                      {selectedWord.devanagari}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSpeakText(selectedWord.kannada)}
                  className="cursor-pointer p-3 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-colors shadow-2xs"
                  title="Speak word audio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Meanings across all 3 languages */}
              <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D5]">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#777]">
                  Multilingual Meanings:
                </h5>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      EN
                    </span>
                    <span className="font-bold text-slate-900">{selectedWord.meanings.en}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      MR
                    </span>
                    <span className="font-semibold text-slate-800">{selectedWord.meanings.mr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                      HI
                    </span>
                    <span className="font-semibold text-slate-800">{selectedWord.meanings.hi}</span>
                  </div>
                </div>
              </div>

              {/* Root / Grammar Note */}
              {selectedWord.root && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-[#183B28]">Grammatical Root: </span>
                  <span className="font-mono font-medium">{selectedWord.root}</span>
                </div>
              )}

              {/* Bookmark to Vocabulary Action */}
              <button
                type="button"
                onClick={() => onToggleSavedWord(selectedWord.id)}
                className={`cursor-pointer w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                  savedWordIds.includes(selectedWord.id)
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    : 'bg-[#183B28] hover:bg-[#122D1F] text-white'
                }`}
              >
                {savedWordIds.includes(selectedWord.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-700" />
                    <span>Saved in My Vocabulary</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Add to My Vocabulary (+5 XP)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedWord(null)}
                className="cursor-pointer w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Close Word Inspector
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-[#DDD5C7] text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Click any word in the text</h4>
              <p className="text-xs text-[#526056] leading-relaxed max-w-xs mx-auto">
                Just like LingQ, clicking any Kannada word opens its full meaning in English, Marathi, and Hindi, along with clear audio and a one-click button to save it for revision.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
