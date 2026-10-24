import { Lesson, VocabularyItem, CulturalItem, RoleplayScenario } from '../types';
import { SITUATION_LESSONS_DATA } from './situationData';
import { VOCABULARY_DATA } from './vocabularyData';
import { CULTURAL_ITEMS_DATA } from './culturalData';

export const DAILY_PHRASE = {
  kannada: 'ಕನ್ನಡ ಕಲಿಯುವುದು ಸುಲಭ ಮತ್ತು ಖುಷಿ ನೀಡುತ್ತದೆ.',
  transliteration: 'Kannada kaliyuvudu sulabha mattu khushi needuttade.',
  meanings: {
    en: 'Learning Kannada is easy and brings joy.',
    mr: 'कन्नड शिकणे सोपे आहे आणि आनंद देते.',
    hi: 'कन्नड़ सीखना आसान है और खुशी देता है.',
  },
  words: [
    { kannada: 'ಕನ್ನಡ', transliteration: 'Kannada', meaning: { en: 'Kannada language', mr: 'कन्नड भाषा', hi: 'कन्नड़ भाषा' } },
    { kannada: 'ಕಲಿಯುವುದು', transliteration: 'kaliyuvudu', meaning: { en: 'learning (gerund)', mr: 'शिकणे', hi: 'सीखना' } },
    { kannada: 'ಸುಲಭ', transliteration: 'sulabha', meaning: { en: 'easy / simple', mr: 'सोपे', hi: 'सरल / आसान' } },
    { kannada: 'ಮತ್ತು', transliteration: 'mattu', meaning: { en: 'and', mr: 'आणि', hi: 'और' } },
    { kannada: 'ಖುಷಿ', transliteration: 'khushi', meaning: { en: 'joy / happiness', mr: 'आनंद', hi: 'खुशी' } },
    { kannada: 'ನೀಡುತ್ತದೆ', transliteration: 'needuttade', meaning: { en: 'gives / brings', mr: 'देते', hi: 'देता है' } },
  ],
  culturalContext: 'Kannada is one of the classical Dravidian languages with over 2000 years of recorded literary heritage, known for its sweet melodic cadence (ಕಸ್ತೂರಿ ಕನ್ನಡ - Kasthuri Kannada).',
  pronunciationTip: 'Roll the tongue gently on "ಳಿ" (li) in ಕಲಿಯುವುದು for an authentic sound.',
};

export const LESSONS: Lesson[] = SITUATION_LESSONS_DATA;

export const VOCABULARY_LIST: VocabularyItem[] = VOCABULARY_DATA;

export const CULTURAL_ITEMS: CulturalItem[] = CULTURAL_ITEMS_DATA;

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: 'auto-ride',
    title: 'Hailing an Auto Rickshaw',
    titleKannada: 'ಆಟೋ ಚಾಲಕರ ಜೊತೆ ಮಾತುಕತೆ',
    role: 'Bengaluru Auto Driver (ಮಂಜುನಾಥ್)',
    userRole: 'Commuter / Passenger',
    context: 'You are on Church Street trying to reach Koramangala or Indiranagar. The driver asks where you want to go.',
    difficulty: 'beginner',
    starterPrompt: 'You are a warm, courteous Bengaluru auto driver named Manjunath. When learner writes English or Kannada, provide bilingual pedagogical breakdown and natural replies.',
    starterKannada: 'ನಮಸ್ಕಾರ ಸರ್! ಎಲ್ಲಿಗೆ ಹೋಗ್ಬೇಕು?',
    starterTransliteration: 'Namaskāra sir! Ellige hōgbēku?',
    starterTranslation: 'Hello sir! Where do you need to go?',
    suggestedResponses: [
      'ಇಂದಿರಾನಗರಕ್ಕೆ ಹೋಗ್ಬೇಕು, ಮೀಟರ್ ಹಾಕ್ತಿರಾ? (Indiranagar-akke hōgbēku, meetar hāktirā?)',
      'ಕೋರಮಂಗಲಕ್ಕೆ ಎಷ್ಟು ರೂಪಾಯಿ ಆಗ್ತದೆ? (Koramangala-kke eshtu roopāyi āgtade?)',
      'ಮೆಜೆಸ್ಟಿಕ್ ಮೆಟ್ರೋ ಸ್ಟೇಷನ್‌ಗೆ ಹೋಗಿ. (Majestic metrō stēshan-ge hōgi.)',
    ],
  },
  {
    id: 'darshini-order',
    title: 'Breakfast at a Darshini',
    titleKannada: 'ದರ್ಶಿನಿಯಲ್ಲಿ ತಿಂಡಿ ಆರ್ಡರ್',
    role: 'Darshini Counter Staff (ರಾಘವೇಂದ್ರ)',
    userRole: 'Hungry Customer',
    context: 'Morning rush at a famous local canteen. Hot idlis, vadas, and filter coffee are ready.',
    difficulty: 'beginner',
    starterPrompt: 'You are a lively Darshini server in Bengaluru. Converse in quick, authentic Kannada with bilingual assistance.',
    starterKannada: 'ಬನ್ನಿ ಸರ್, ತಿಂಡಿ ಏನು ಬೇಕು? ಬಿಸಿ ಬಿಸಿ ಇಡ್ಲಿ-ವಡೆ, ಮಸಾಲಾ ದೋಸೆ ರೆಡಿ ಇದೆ.',
    starterTransliteration: 'Banni sir, tindi ēnu bēku? Bisi bisi idli-vade, masālā dōse redi ide.',
    starterTranslation: 'Welcome sir, what breakfast would you like? Piping hot idli-vada and masala dosa are ready.',
    suggestedResponses: [
      'ಒಂದು ಮಸಾಲಾ ದೋಸೆ ಮತ್ತು ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ. (Ondu masālā dōse mattu philtar kāphi kodi.)',
      'ಕಾಫಿಯಲ್ಲಿ ಸಕ್ಕರೆ ಕಡಿಮೆ ಹಾಕಿ. (Kāphiyalli sakkare kadime hāki.)',
      'ಎರಡು ಇಡ್ಲಿ ವಡೆ, ಸಾಂಬಾರ್ ಜಾಸ್ತಿ ಕೊಡಿ. (Eradu idli vade, sāmbār jāsti kodi.)',
    ],
  },
  {
    id: 'buying-veggies',
    title: 'Buying Fresh Vegetables at Gandhi Bazaar',
    titleKannada: 'ತರಕಾರಿ ಅಂಗಡಿಯಲ್ಲಿ ಚೌಕಾಸಿ',
    role: 'Vegetable Vendor (ವೆಂಕಟೇಶ್)',
    userRole: 'Shopper',
    context: 'At an open market in Basavanagudi choosing fresh tomatoes, greens, and onions.',
    difficulty: 'beginner',
    starterPrompt: 'You are Venkatesh, a friendly vegetable vendor in Gandhi Bazaar. Help the learner ask prices, weigh items, and bargain politely.',
    starterKannada: 'ತಾಜಾ ತರಕಾರಿ ಇದೆ ಅಮ್ಮ/ಸರ್! ಏನು ಬೇಕು ಹೇಳಿ?',
    starterTransliteration: 'Tājā tarakāri ide amma/sir! Ēnu bēku hēli?',
    starterTranslation: 'Fresh vegetables are here madam/sir! Tell me what you need?',
    suggestedResponses: [
      'ಟೊಮೇಟೊ ಒಂದು ಕೆಜಿಗೆ ಎಷ್ಟು? (Tomētō ondu kejige eshtu?)',
      'ಸ್ವಲ್ಪ ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪು ಹಾಕಿ. (Svalpa kottambari soppu hāki.)',
      'ಸ್ವಲ್ಪ ರೇಟ್ ಕಡಿಮೆ ಮಾಡಿ. (Svalpa rēt kadime mādi.)',
    ],
  },
];
