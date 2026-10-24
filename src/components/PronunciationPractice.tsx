import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Info,
  Clock,
  Layers,
  HelpCircle,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import { speechService } from '../lib/speech';

interface PracticeItem {
  id: string;
  kannada: string;
  transliteration: string;
  english: string;
  syllables: string[];
  focusLetter: string;
  phoneticTip: string;
}

interface MinimalPair {
  id: string;
  title: string;
  description: string;
  word1: {
    kannada: string;
    transliteration: string;
    english: string;
    soundType: string;
  };
  word2: {
    kannada: string;
    transliteration: string;
    english: string;
    soundType: string;
  };
  differenceKey: string;
}

const PRONUNCIATION_DRILLS: PracticeItem[] = [
  {
    id: 'p1',
    kannada: 'ನಮಸ್ಕಾರ',
    transliteration: 'Na-mas-kaa-ra',
    english: 'Hello / Greetings',
    syllables: ['ನ (na)', 'ಮಸ್ (mas)', 'ಕಾ (kaa)', 'ರ (ra)'],
    focusLetter: 'ಕಾ (kaa - elongated vowel)',
    phoneticTip: 'Keep the "ಕಾ" vowel elongated. Do not rush over the middle cluster.',
  },
  {
    id: 'p2',
    kannada: 'ಕಲಿಯಿರಿ',
    transliteration: 'Ka-li-yi-ri',
    english: 'Please learn (polite)',
    syllables: ['ಕ (ka)', 'ಲಿ (li)', 'ಯಿ (yi)', 'ರಿ (ri)'],
    focusLetter: 'ಲಿ (li) & ರಿ (ri)',
    phoneticTip: 'Lightly tap the roof of your mouth with the tip of the tongue on "ರಿ".',
  },
  {
    id: 'p3',
    kannada: 'ಹೇಗಿದ್ದೀರಿ?',
    transliteration: 'Hē-gid-dee-ri?',
    english: 'How are you? (formal)',
    syllables: ['ಹೇ (hē)', 'ಗಿಡ್ (gid)', 'ದೀ (dee)', 'ರಿ (ri)'],
    focusLetter: 'ದೀ (dee - dental d)',
    phoneticTip: 'Touch your upper teeth with tongue tip for "ದ" (soft dental sound).',
  },
  {
    id: 'p4',
    kannada: 'ಧನ್ಯವಾದಗಳು',
    transliteration: 'Dhan-ya-vaa-da-ga-lu',
    english: 'Thank you (polite)',
    syllables: ['ಧನ್ (dhan)', 'ಯ (ya)', 'ವಾ (vaa)', 'ದ (da)', 'ಗ (ga)', 'ಳು (lu)'],
    focusLetter: 'ಳು (retroflex lu)',
    phoneticTip: 'Curl your tongue backwards towards the soft palate for "ಳು" (retroflex ಳ).',
  },
  {
    id: 'p5',
    kannada: 'ಚೆನ್ನಾಗಿದ್ದೇನೆ',
    transliteration: 'Chen-naa-gid-dē-ne',
    english: 'I am doing well',
    syllables: ['ಚೆನ್ (chen)', 'ನಾ (naa)', 'ಗಿಡ್ (gid)', 'ದೇ (dē)', 'ನೆ (ne)'],
    focusLetter: 'ನಾ (geminate double n)',
    phoneticTip: 'Hold the "ನ್-ನಾ" double consonant slightly longer before shifting to "ಗಿಡ್".',
  },
  {
    id: 'p6',
    kannada: 'ಮಂಗಳೂರು',
    transliteration: 'Man-ga-loo-ru',
    english: 'Mangaluru (coastal city)',
    syllables: ['ಮಂ (mang)', 'ಗಳ (ga-la)', 'ಊ (oo)', 'ರು (ru)'],
    focusLetter: 'ಳ (retroflex La)',
    phoneticTip: 'Distinct coastal retroflex "ಳ" creates the signature melody of Karnataka speech.',
  },
];

const MINIMAL_PAIRS: MinimalPair[] = [
  {
    id: 'mp-1',
    title: 'ಬೆಲೆ vs ಬೆಳೆ (Dental ಲ vs Retroflex ಳ)',
    description: 'A classic distinction: regular dental "ಲ" versus retroflex tongue-curled "ಳ".',
    word1: {
      kannada: 'ಬೆಲೆ',
      transliteration: 'Bele',
      english: 'Price / Cost',
      soundType: 'Dental "ಲ" (tip touches teeth)',
    },
    word2: {
      kannada: 'ಬೆಳೆ',
      transliteration: 'BeLe',
      english: 'Crop / Harvest',
      soundType: 'Retroflex "ಳ" (tongue curled back to palate)',
    },
    differenceKey: 'Confusing ಬೆಲೆ with ಬೆಳೆ changes "What is the price?" into "What is the crop?".',
  },
  {
    id: 'mp-2',
    title: 'ಕಡೆ vs ಕರೆ (Dental ಡ vs Flap ರ)',
    description: 'Directional "side" versus communication "call".',
    word1: {
      kannada: 'ಕಡೆ',
      transliteration: 'Kade',
      english: 'Side / Direction',
      soundType: 'Retroflex ಡ (ka-de)',
    },
    word2: {
      kannada: 'ಕರೆ',
      transliteration: 'Kare',
      english: 'Call / Phone call',
      soundType: 'Alveolar flap ರ (ka-re)',
    },
    differenceKey: 'ಈ ಕಡೆ ಬನ್ನಿ (Come this side) vs ಕರೆ ಮಾಡಿ (Make a call).',
  },
  {
    id: 'mp-3',
    title: 'ಊಟ vs ಓಟ (High back ಊ vs Mid back ಓ)',
    description: 'Vowel height distinction: eating lunch versus a running race.',
    word1: {
      kannada: 'ಊಟ',
      transliteration: 'Oota',
      english: 'Meal / Lunch',
      soundType: 'Long high vowel "ಊ" (oo-ta)',
    },
    word2: {
      kannada: 'ಓಟ',
      transliteration: 'Ota',
      english: 'Running / Race',
      soundType: 'Long mid vowel "ಓ" (o-ta)',
    },
    differenceKey: 'ಊಟ ಆಯ್ತಾ? (Did you eat your meal?) vs ಓಟದ ಸ್ಪರ್ಧೆ (Running race).',
  },
  {
    id: 'mp-4',
    title: 'ದಿನ vs ಧನ (Unaspirated ದ vs Aspirated ಧ)',
    description: 'Breathy aspiration distinction between day and wealth.',
    word1: {
      kannada: 'ದಿನ',
      transliteration: 'Dina',
      english: 'Day',
      soundType: 'Unaspirated dental ದ',
    },
    word2: {
      kannada: 'ಧನ',
      transliteration: 'Dhana',
      english: 'Wealth / Money',
      soundType: 'Aspirated breathy dental ಧ',
    },
    differenceKey: 'ಪ್ರತಿದಿನ (Every day) vs ಧನ ಧಾನ್ಯ (Wealth and grain).',
  },
];

export const KANNADA_VOWELS = [
  { char: 'ಅ', name: 'a', type: 'Short (ಹ್ರಸ್ವ)', dev: 'अ', tip: 'Short "a" like in cup' },
  { char: 'ಆ', name: 'aa', type: 'Long (ದೀರ್ಘ)', dev: 'आ', tip: 'Long "aa" like in father' },
  { char: 'ಇ', name: 'i', type: 'Short (ಹ್ರಸ್ವ)', dev: 'इ', tip: 'Short "i" like in pin' },
  { char: 'ಈ', name: 'ee', type: 'Long (ದೀರ್ಘ)', dev: 'ई', tip: 'Long "ee" like in deep' },
  { char: 'ಉ', name: 'u', type: 'Short (ಹ್ರಸ್ವ)', dev: 'उ', tip: 'Short "u" like in put' },
  { char: 'ಊ', name: 'oo', type: 'Long (ದೀರ್ಘ)', dev: 'ऊ', tip: 'Long "oo" like in moon' },
  { char: 'ಋ', name: 'ru', type: 'Vocalic (ಋಷಿ)', dev: 'ऋ', tip: 'Vocalic "ru" like in rishi' },
  { char: 'ಎ', name: 'e', type: 'Short (ಹ್ರಸ್ವ)', dev: 'ए', tip: 'Short "e" like in pet' },
  { char: 'ಏ', name: 'ē', type: 'Long (ದೀರ್ಘ)', dev: 'ऐ', tip: 'Long "ē" like in say' },
  { char: 'ಐ', name: 'ai', type: 'Diphthong (ಐಕ್ಯ)', dev: 'ऐ', tip: 'Diphthong "ai" like in aisle' },
  { char: 'ಒ', name: 'o', type: 'Short (ಹ್ರಸ್ವ)', dev: 'ओ', tip: 'Short "o" like in pot' },
  { char: 'ಓ', name: 'ō', type: 'Long (ದೀರ್ಘ)', dev: 'औ', tip: 'Long "ō" like in boat' },
  { char: 'ಔ', name: 'au', type: 'Diphthong (ಔಷಧ)', dev: 'औ', tip: 'Diphthong "au" like in out' },
  { char: 'ಅಂ', name: 'am', type: 'Anusvara (ಅನುಸ್ವಾರ)', dev: 'अं', tip: 'Nasal "am" like in um' },
  { char: 'ಅಃ', name: 'aha', type: 'Visarga (ವಿಸರ್ಗ)', dev: 'अः', tip: 'Aspirated "aha" breath' },
];

export const KANNADA_CONSONANTS = [
  { char: 'ಕ', translit: 'ka', dev: 'क', group: 'ಕ-ವರ್ಗ (Velar)' },
  { char: 'ಖ', translit: 'kha', dev: 'ख', group: 'ಕ-ವರ್ಗ (Velar)' },
  { char: 'ಗ', translit: 'ga', dev: 'ग', group: 'ಕ-ವರ್ಗ (Velar)' },
  { char: 'ಘ', translit: 'gha', dev: 'घ', group: 'ಕ-ವರ್ಗ (Velar)' },
  { char: 'ಙ', translit: 'nga', dev: 'ङ', group: 'ಕ-ವರ್ಗ (Velar)' },

  { char: 'ಚ', translit: 'cha', dev: 'च', group: 'ಚ-ವರ್ಗ (Palatal)' },
  { char: 'ಛ', translit: 'chha', dev: 'छ', group: 'ಚ-ವರ್ಗ (Palatal)' },
  { char: 'ಜ', translit: 'ja', dev: 'ज', group: 'ಚ-ವರ್ಗ (Palatal)' },
  { char: 'ಝ', translit: 'jha', dev: 'झ', group: 'ಚ-ವರ್ಗ (Palatal)' },
  { char: 'ಞ', translit: 'nya', dev: 'ञ', group: 'ಚ-ವರ್ಗ (Palatal)' },

  { char: 'ಟ', translit: 'ta', dev: 'ट', group: 'ಟ-ವರ್ಗ (Retroflex)' },
  { char: 'ಠ', translit: 'tha', dev: 'ठ', group: 'ಟ-ವರ್ಗ (Retroflex)' },
  { char: 'ಡ', translit: 'da', dev: 'ड', group: 'ಟ-ವರ್ಗ (Retroflex)' },
  { char: 'ಢ', translit: 'dha', dev: 'ढ', group: 'ಟ-ವರ್ಗ (Retroflex)' },
  { char: 'ಣ', translit: 'na', dev: 'ण', group: 'ಟ-ವರ್ಗ (Retroflex)' },

  { char: 'ತ', translit: 'tha (soft)', dev: 'त', group: 'ತ-ವರ್ಗ (Dental)' },
  { char: 'ಥ', translit: 'thha', dev: 'थ', group: 'ತ-ವರ್ಗ (Dental)' },
  { char: 'ದ', translit: 'da (soft)', dev: 'द', group: 'ತ-ವರ್ಗ (Dental)' },
  { char: 'ಧ', translit: 'dha', dev: 'ध', group: 'ತ-ವರ್ಗ (Dental)' },
  { char: 'ನ', translit: 'na', dev: 'न', group: 'ತ-ವರ್ಗ (Dental)' },

  { char: 'ಪ', translit: 'pa', dev: 'प', group: 'ಪ-ವರ್ಗ (Labial)' },
  { char: 'ಫ', translit: 'pha', dev: 'फ', group: 'ಪ-ವರ್ಗ (Labial)' },
  { char: 'ಬ', translit: 'ba', dev: 'ब', group: 'ಪ-ವರ್ಗ (Labial)' },
  { char: 'ಭ', translit: 'bha', dev: 'भ', group: 'ಪ-ವರ್ಗ (Labial)' },
  { char: 'ಮ', translit: 'ma', dev: 'म', group: 'ಪ-ವರ್ಗ (Labial)' },

  { char: 'ಯ', translit: 'ya', dev: 'य', group: 'ಅವರ್ಗೀಯ (Semivowel)' },
  { char: 'ರ', translit: 'ra', dev: 'र', group: 'ಅವರ್ಗೀಯ (Flap)' },
  { char: 'ಲ', translit: 'la (dental)', dev: 'ल', group: 'ಅವರ್ಗೀಯ (Dental Lateral)' },
  { char: 'ವ', translit: 'va', dev: 'व', group: 'ಅವರ್ಗೀಯ (Semivowel)' },
  { char: 'ಶ', translit: 'sha (palatal)', dev: 'श', group: 'ಅವರ್ಗೀಯ (Sibilant)' },
  { char: 'ಷ', translit: 'sha (retroflex)', dev: 'ष', group: 'ಅವರ್ಗೀಯ (Retroflex Sibilant)' },
  { char: 'ಸ', translit: 'sa (dental)', dev: 'स', group: 'ಅವರ್ಗೀಯ (Dental Sibilant)' },
  { char: 'ಹ', translit: 'ha', dev: 'ह', group: 'ಅವರ್ಗೀಯ (Glottal)' },
  { char: 'ಳ', translit: 'La (retroflex)', dev: 'ळ', group: 'ಅವರ್ಗೀಯ (Retroflex Lateral)' },
];

export const KAGUNITA_MATRAS = [
  { vowel: 'ಅ', matra: '', label: 'a' },
  { vowel: 'ಆ', matra: 'ಾ', label: 'aa' },
  { vowel: 'ಇ', matra: 'ಿ', label: 'i' },
  { vowel: 'ಈ', matra: 'ೀ', label: 'ee' },
  { vowel: 'ಉ', matra: 'ು', label: 'u' },
  { vowel: 'ಊ', matra: 'ೂ', label: 'oo' },
  { vowel: 'ಋ', matra: 'ೃ', label: 'ru' },
  { vowel: 'ಎ', matra: 'ೆ', label: 'e' },
  { vowel: 'ಏ', matra: 'ೇ', label: 'ē' },
  { vowel: 'ಐ', matra: 'ೈ', label: 'ai' },
  { vowel: 'ಒ', matra: 'ೊ', label: 'o' },
  { vowel: 'ಓ', matra: 'ೋ', label: 'ō' },
  { vowel: 'ಔ', matra: 'ೌ', label: 'au' },
  { vowel: 'ಅಂ', matra: 'ಂ', label: 'am' },
  { vowel: 'ಅಃ', matra: 'ಃ', label: 'aha' },
];

interface PronunciationPracticeProps {
  attemptsCount?: number;
  onAttempt?: (drillId: string, score: number) => void;
}

export const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({
  attemptsCount = 0,
  onAttempt,
}) => {
  const [activeTab, setActiveTab] = useState<'syllables' | 'minimal-pairs' | 'script' | 'history'>('syllables');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [selectedConsonant, setSelectedConsonant] = useState('ಕ');

  // Playback Ergonomics
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);

  // Practice History log
  const [history, setHistory] = useState<Array<{ id: string; word: string; timestamp: string; score?: number }>>([]);

  const activeDrill = PRONUNCIATION_DRILLS[selectedIndex];
  const activePair = MINIMAL_PAIRS[selectedPairIndex];

  const handleListenNative = (text: string) => {
    setIsSpeaking(true);
    speechService.speak(text, {
      rate: playbackSpeed,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });

    // Add to history
    setHistory((prev) => [
      {
        id: `hist-${Date.now()}`,
        word: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev.slice(0, 9),
    ]);
  };

  const handleSpeakSyllable = (syl: string) => {
    const kn = syl.split(' ')[0];
    speechService.speak(kn, { rate: playbackSpeed * 0.9 });
  };

  const handleToggleMic = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setTranscript('');
    setMatchScore(null);
    setIsListening(true);

    speechService.startListening(
      {
        onResult: (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            setIsListening(false);
            evaluatePronunciation(text);
          }
        },
        onError: () => {
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
      },
      'kn-IN'
    );
  };

  const evaluatePronunciation = (userSpoken: string) => {
    const cleanTarget = activeDrill.kannada.trim();
    const cleanSpoken = userSpoken.trim();

    let computedScore = 50;
    if (cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken)) {
      computedScore = 100;
    } else {
      let matchingChars = 0;
      for (const char of cleanTarget) {
        if (cleanSpoken.includes(char)) matchingChars++;
      }
      computedScore = Math.min(95, Math.max(40, Math.round((matchingChars / cleanTarget.length) * 100)));
    }

    setMatchScore(computedScore);
    onAttempt?.(activeDrill.id, computedScore);

    // Save in history with score
    setHistory((prev) => [
      {
        id: `hist-eval-${Date.now()}`,
        word: `${activeDrill.kannada} (Spoken: "${userSpoken}")`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        score: computedScore,
      },
      ...prev.slice(0, 9),
    ]);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>ಧ್ವನಿ ಮತ್ತು ಉಚ್ಚಾರಣೆ • Phonetic Speech Lab</span>
        </div>
        <h2 className="font-serif font-bold text-2xl sm:text-4xl text-slate-900 mb-2">
          Kannada Pronunciation & Listening Lab
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Train your tongue for Kannada's melodic rhythm, dental versus retroflex contrasts (ದ vs ಡ, ಲ vs ಳ), and aspirated consonants with normal and slower playback.
        </p>
        {attemptsCount > 0 && (
          <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            {attemptsCount} pronunciation attempt{attemptsCount === 1 ? '' : 's'} recorded
          </span>
        )}

        {/* Ergonomic Speed Controls & Subtabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {/* Subtab selection */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('syllables')}
              className={`cursor-pointer px-4 py-1.5 rounded-xl transition-all ${
                activeTab === 'syllables'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Syllables & Drills
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('minimal-pairs')}
              className={`cursor-pointer px-4 py-1.5 rounded-xl transition-all ${
                activeTab === 'minimal-pairs'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minimal Pairs (ಲ vs ಳ)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('script')}
              className={`cursor-pointer px-4 py-1.5 rounded-xl transition-all ${
                activeTab === 'script'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aksharamale & Kagunita (ವರ್ಣಮಾಲೆ)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`cursor-pointer px-4 py-1.5 rounded-xl transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Practice History ({history.length})
            </button>
          </div>

          {/* Speed Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-400 font-medium">Speed:</span>
            {[
              { rate: 0.75, label: '0.75x Slow' },
              { rate: 0.9, label: '0.9x Normal' },
              { rate: 1.0, label: '1.0x Full' },
            ].map((s) => (
              <button
                key={s.rate}
                type="button"
                onClick={() => setPlaybackSpeed(s.rate)}
                className={`cursor-pointer px-2 py-0.5 rounded-lg font-bold transition-all ${
                  playbackSpeed === s.rate
                    ? 'bg-indigo-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-indigo-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: SYLLABLE DRILLS */}
      {activeTab === 'syllables' && (
        <>
          {/* Drill Carousel Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-6">
            {PRONUNCIATION_DRILLS.map((drill, idx) => (
              <button
                key={drill.id}
                onClick={() => {
                  setSelectedIndex(idx);
                  setTranscript('');
                  setMatchScore(null);
                }}
                className={`cursor-pointer px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all border ${
                  selectedIndex === idx
                    ? 'bg-indigo-700 text-white border-indigo-700 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-kannada mr-1.5">{drill.kannada}</span>
                <span className="hidden sm:inline font-mono text-[11px] opacity-80">
                  ({drill.transliteration.split('-')[0]}...)
                </span>
              </button>
            ))}
          </div>

          {/* Interactive Main Practice Card */}
          <div className="rounded-3xl bg-white border border-indigo-100 shadow-xl p-6 sm:p-10 mb-6">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Target Word • {activeDrill.english}
              </span>
              <h3 className="font-kannada font-bold text-5xl sm:text-6xl text-slate-900 my-3 leading-snug">
                {activeDrill.kannada}
              </h3>
              <p className="font-mono text-base sm:text-lg text-indigo-800 tracking-wider font-medium">
                {activeDrill.transliteration}
              </p>
            </div>

            {/* Syllable Breakdown */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wider text-center text-slate-400 font-semibold mb-3">
                Tap syllables to isolate individual sounds:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {activeDrill.syllables.map((syl, i) => (
                  <button
                    key={i}
                    onClick={() => handleSpeakSyllable(syl)}
                    className="cursor-pointer group px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all active:scale-95"
                  >
                    <span className="font-kannada font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-900 block">
                      {syl.split(' ')[0]}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {syl.split(' ')[1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Phonetic Tip Box */}
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs sm:text-sm text-slate-800 mb-8 space-y-1">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-indigo-950 mb-0.5">
                    Focus Sound: {activeDrill.focusLetter}
                  </p>
                  <p className="leading-relaxed text-slate-700">{activeDrill.phoneticTip}</p>
                </div>
              </div>
            </div>

            {/* Action Controls: Listen & Record */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleListenNative(activeDrill.kannada)}
                disabled={isSpeaking}
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-indigo-900 font-bold text-xs sm:text-sm border-2 border-indigo-200 transition-all shadow-xs"
              >
                <Volume2 className={`w-5 h-5 text-indigo-700 ${isSpeaking ? 'animate-pulse' : ''}`} />
                <span>{isSpeaking ? 'Playing...' : `Hear Audio (${playbackSpeed}x)`}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleMic}
                className={`cursor-pointer inline-flex items-center gap-2 px-7 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-indigo-700 hover:bg-indigo-800 text-white shadow-indigo-700/20'
                }`}
              >
                <Mic className="w-5 h-5" />
                <span>{isListening ? 'Listening... Speak in Kannada!' : 'Repeat & Test Pronunciation'}</span>
              </button>
            </div>

            {/* Recognition Feedback */}
            {transcript && (
              <div className="max-w-md mx-auto mt-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center animate-in fade-in">
                <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">
                  Transcribed Speech (Web Speech API):
                </span>
                <p className="font-kannada font-bold text-2xl text-slate-900 mb-1">
                  "{transcript}"
                </p>
                {matchScore !== null && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <CheckCircle className={`w-5 h-5 ${matchScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`} />
                    <span className="text-xs font-bold text-slate-800">
                      {matchScore >= 80 ? 'Accurate phonetic match! ' : 'Good attempt! '}
                      Similarity: {matchScore}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: MINIMAL PAIR LISTENING DRILLS */}
      {activeTab === 'minimal-pairs' && (
        <div className="space-y-6">
          {/* Pair selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MINIMAL_PAIRS.map((pair, idx) => (
              <button
                key={pair.id}
                type="button"
                onClick={() => setSelectedPairIndex(idx)}
                className={`cursor-pointer p-4 rounded-2xl border text-left transition-all ${
                  selectedPairIndex === idx
                    ? 'bg-indigo-50 border-indigo-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <h4 className="font-bold text-sm text-slate-900">{pair.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{pair.description}</p>
              </button>
            ))}
          </div>

          {/* Active Minimal Pair Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-xl space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Acoustic Discrimination Exercise
              </span>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">
                {activePair.title}
              </h3>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                {activePair.description}
              </p>
            </div>

            {/* Word 1 vs Word 2 Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Word 1 */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Option A
                </span>
                <div className="font-kannada font-bold text-4xl text-slate-900">
                  {activePair.word1.kannada}
                </div>
                <div className="text-sm font-mono text-indigo-800 font-semibold">
                  {activePair.word1.transliteration}
                </div>
                <div className="text-xs font-bold text-slate-700">
                  Meaning: {activePair.word1.english}
                </div>
                <div className="text-[11px] text-slate-500">
                  {activePair.word1.soundType}
                </div>
                <button
                  type="button"
                  onClick={() => handleListenNative(activePair.word1.kannada)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-700 text-white font-bold text-xs shadow-xs hover:bg-indigo-800"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Hear Option A</span>
                </button>
              </div>

              {/* Word 2 */}
              <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-200 text-center space-y-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                  Option B
                </span>
                <div className="font-kannada font-bold text-4xl text-indigo-950">
                  {activePair.word2.kannada}
                </div>
                <div className="text-sm font-mono text-indigo-800 font-semibold">
                  {activePair.word2.transliteration}
                </div>
                <div className="text-xs font-bold text-slate-700">
                  Meaning: {activePair.word2.english}
                </div>
                <div className="text-[11px] text-indigo-800">
                  {activePair.word2.soundType}
                </div>
                <button
                  type="button"
                  onClick={() => handleListenNative(activePair.word2.kannada)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs shadow-xs hover:bg-purple-800"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Hear Option B</span>
                </button>
              </div>
            </div>

            {/* Why it matters insight */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Why this distinction matters:</span>
              </span>
              <p className="leading-relaxed pl-5 text-amber-800">
                {activePair.differenceKey}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AKSHARAMALE & KAGUNITA SCRIPT LAB */}
      {activeTab === 'script' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Section A: 14 Vowels (ಸ್ವರಗಳು) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  ಸ್ವರಗಳು • Vowels (14 + Yogavahas)
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 mt-1">
                  Kannada Svaragalu & Yogavahagalu
                </h3>
              </div>
              <p className="text-xs text-slate-400">Click any letter to hear native pronunciation</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
              {KANNADA_VOWELS.map((v) => (
                <button
                  key={v.char}
                  type="button"
                  onClick={() => handleListenNative(v.char)}
                  className="cursor-pointer group bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 rounded-2xl p-3 text-center transition-all hover:scale-105 active:scale-95 shadow-2xs"
                >
                  <span className="font-kannada font-bold text-2xl sm:text-3xl text-indigo-900 block group-hover:text-indigo-600">
                    {v.char}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700 block mt-1">
                    {v.name}
                  </span>
                  <span className="font-devanagari text-[11px] text-slate-400 block">
                    {v.dev}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight truncate">
                    {v.type.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section B: Consonants (ವ್ಯಂಜನಗಳು) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  ವ್ಯಂಜನಗಳು • Consonants (34)
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 mt-1">
                  Classified Varga & Avargeeya Consonants
                </h3>
              </div>
              <span className="text-xs text-slate-400">Select any consonant to generate its Kagunita</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2.5">
              {KANNADA_CONSONANTS.map((c) => {
                const isSelected = selectedConsonant === c.char;
                return (
                  <button
                    key={c.char}
                    type="button"
                    onClick={() => {
                      setSelectedConsonant(c.char);
                      handleListenNative(c.char);
                    }}
                    className={`cursor-pointer rounded-2xl p-2.5 text-center transition-all border ${
                      isSelected
                        ? 'bg-indigo-700 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                    }`}
                  >
                    <span className="font-kannada font-bold text-xl sm:text-2xl block">
                      {c.char}
                    </span>
                    <span className={`font-mono text-[11px] block mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {c.translit.split(' ')[0]}
                    </span>
                    <span className={`text-[10px] font-devanagari block ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {c.dev}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section C: Interactive Kagunita / Gunithakshara Builder (ಗುಣಿತಾಕ್ಷರಗಳು) */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  ಗುಣಿತಾಕ್ಷರ ಕಲಿವಿ • Kagunita Vowel-Sign Matrix
                </span>
                <h3 className="text-2xl font-bold font-serif text-white mt-2">
                  All 15 Kagunita Forms for "{selectedConsonant}"
                </h3>
                <p className="text-xs text-indigo-200 mt-1">
                  Click any combination to hear the phonetic fusion of consonant + vowel sign
                </p>
              </div>

              {/* Quick Consonant Switcher */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                {['ಕ', 'ಗ', 'ಚ', 'ಜ', 'ಟ', 'ತ', 'ದ', 'ನ', 'ಪ', 'ಬ', 'ಮ', 'ರ', 'ಲ', 'ವ', 'ಸ', 'ಳ'].map((cn) => (
                  <button
                    key={cn}
                    type="button"
                    onClick={() => {
                      setSelectedConsonant(cn);
                      handleListenNative(cn);
                    }}
                    className={`cursor-pointer px-2.5 py-1 rounded-xl font-kannada font-bold text-sm transition-all shrink-0 ${
                      selectedConsonant === cn
                        ? 'bg-amber-400 text-slate-900 shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {cn}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix of combinations */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
              {KAGUNITA_MATRAS.map((km) => {
                const combined = km.matra ? `${selectedConsonant}${km.matra}` : selectedConsonant;
                return (
                  <button
                    key={km.vowel}
                    type="button"
                    onClick={() => handleListenNative(combined)}
                    className="cursor-pointer group bg-white/10 hover:bg-white/20 border border-white/15 hover:border-amber-300 rounded-2xl p-3 text-center transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    <span className="font-kannada font-bold text-2xl sm:text-3xl text-amber-300 group-hover:text-amber-200 block">
                      {combined}
                    </span>
                    <span className="text-[10px] text-indigo-200 font-mono block mt-1">
                      +{km.vowel} ({km.label})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRACTICE HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-base text-slate-900">Recent Pronunciation Practice</h4>
            <span className="text-xs text-slate-400">Past 10 Drills</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs">No practice drills recorded yet in this session.</p>
              <p className="text-[11px] text-slate-400">
                Practice any word audio or speech test to record your session history.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {history.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleListenNative(item.word.split(' ')[0])}
                      className="cursor-pointer p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <span className="font-kannada font-bold text-sm text-slate-900 block">
                        {item.word}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                    </div>
                  </div>

                  {item.score !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.score >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.score}% Match
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Honest Technical Note regarding Speech API */}
      <div className="flex items-center gap-2 justify-center text-xs text-slate-400 mt-8">
        <Info className="w-3.5 h-3.5" />
        <span>
          Pronunciation uses the browser's Web Speech API (kn-IN). Quality may vary based on available speech synthesis voices on your operating system.
        </span>
      </div>
    </section>
  );
};
export default PronunciationPractice;
