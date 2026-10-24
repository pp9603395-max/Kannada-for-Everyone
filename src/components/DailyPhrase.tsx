import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import { speechService } from '../lib/speech';
import { ExplanationLanguage } from '../types';

interface DailyPhraseProps {
  phrase: {
    kannada: string;
    transliteration: string;
    meanings: {
      en: string;
      mr: string;
      hi: string;
    };
    words: {
      kannada: string;
      transliteration: string;
      meaning: { en: string; mr: string; hi: string };
    }[];
    culturalContext: string;
    pronunciationTip?: string;
  };
  preferredLanguage: ExplanationLanguage;
  onPracticeInStudio?: (text: string) => void;
  onSavePhrase?: () => void;
  isSaved?: boolean;
}

export const DailyPhrase: React.FC<DailyPhraseProps> = ({
  phrase,
  preferredLanguage,
  onPracticeInStudio,
  onSavePhrase,
  isSaved = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

  const handleSpeak = () => {
    setIsPlaying(true);
    speechService.speak(phrase.kannada, {
      rate: 0.85,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handleSpeakWord = (wordText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speechService.speak(wordText, { rate: 0.8 });
  };

  const activeMeaning = phrase.meanings[preferredLanguage] || phrase.meanings.en;

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#183B28] to-[#122D1F] text-white p-6 sm:p-8 md:p-10 shadow-lg border border-[#235037]">
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-amber-400/10 to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Header Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs sm:text-sm font-semibold tracking-wide border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ಇವತ್ತಿನ ಕನ್ನಡ ವಾಕ್ಯ • Phrase of the Day</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                disabled={isPlaying}
                className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition-colors border border-white/15"
                title="Listen to native pronunciation"
              >
                <Volume2 className={`w-4 h-4 text-amber-300 ${isPlaying ? 'animate-pulse text-amber-400' : ''}`} />
                <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
              </button>

              {onSavePhrase && (
                <button
                  onClick={onSavePhrase}
                  className="cursor-pointer p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Bookmark Phrase"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-amber-300 fill-amber-300" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Main Kannada Sentence */}
          <div className="mb-4">
            <h2 className="font-kannada font-bold text-2xl sm:text-3xl md:text-4xl text-amber-100 leading-snug tracking-wide">
              {phrase.kannada}
            </h2>
            <p className="font-mono text-sm sm:text-base text-amber-200/85 mt-2">
              {phrase.transliteration}
            </p>
          </div>

          {/* Meaning */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 backdrop-blur-xs">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-[#E07A5F] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-amber-300/80 font-bold mb-0.5">
                  Meaning ({preferredLanguage === 'mr' ? 'मराठी' : preferredLanguage === 'hi' ? 'हिंदी' : 'English'})
                </p>
                <p className="text-base sm:text-lg text-white font-medium">
                  {activeMeaning}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Word Breakdown */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-2">
              Word-by-word Breakdown (Click a word to hear & inspect):
            </p>
            <div className="flex flex-wrap gap-2">
              {phrase.words.map((w, index) => {
                const isSelected = selectedWordIndex === index;
                const wordMeaning = w.meaning[preferredLanguage] || w.meaning.en;
                return (
                  <button
                    key={index}
                    onClick={(e) => {
                      setSelectedWordIndex(isSelected ? null : index);
                      handleSpeakWord(w.kannada, e);
                    }}
                    className={`cursor-pointer group flex flex-col items-start px-3 py-2 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-[#183B28] shadow-md scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <span className="font-kannada font-bold text-sm sm:text-base leading-tight">
                      {w.kannada}
                    </span>
                    <span className={`text-[11px] font-mono leading-tight ${isSelected ? 'text-[#183B28]/80' : 'text-amber-200/80'}`}>
                      {w.transliteration}
                    </span>
                    <span className={`text-[11px] font-medium mt-0.5 ${isSelected ? 'text-[#183B28]' : 'text-white/80'}`}>
                      {wordMeaning}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cultural & Pronunciation Insight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-white/80 pt-4 border-t border-white/10">
            <div>
              <span className="font-semibold text-amber-200">Cultural Context: </span>
              <span>{phrase.culturalContext}</span>
            </div>
            {phrase.pronunciationTip && (
              <div>
                <span className="font-semibold text-[#E07A5F]">Pronunciation Tip: </span>
                <span>{phrase.pronunciationTip}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default DailyPhrase;
