import { StructuredLevel } from '../types';

/**
 * Ten modules mapped one-to-one to the ten Situation Lessons.
 * This removes the duplicate lesson mappings that previously let learners
 * unlock the same lesson from several different module cards.
 */
export const STRUCTURED_LEARNING_PATH: StructuredLevel[] = [
  {
    levelNumber: 1,
    titleEnglish: 'Level 1: Kannada Foundations',
    titleKannada: 'ಹಂತ ೧: ಕನ್ನಡ ಅಡಿಪಾಯ',
    description:
      'Master the building blocks of Kannada: script sounds, polite greetings, numbers, prices, and your first real-life dialogues.',
    accentColor: 'indigo',
    modules: [
      {
        id: 'mod-1-1',
        lessonId: 'greetings-and-introductions',
        titleEnglish: 'Greetings, Script Sounds & Respectful Address',
        titleKannada: 'ನಮಸ್ಕಾರ, ವರ್ಣಮಾಲೆ ಮತ್ತು ಮರ್ಯಾದೆಯ ಮಾತುಗಳು',
        subtitle: 'Namaskāra, vowels & consonants, nimma hesaru, and polite pronouns',
        icon: 'HandHeart',
        level: 1,
        order: 1,
        xpReward: 35,
        objectives: [
          'Recognize key short and long vowels: ಅ (a), ಆ (aa), ಇ (i), ಈ (ee), ಉ (u), ಊ (oo)',
          'Distinguish dental versus retroflex consonants: ದ (dental d) vs ಡ (retroflex D)',
          'Master greeting neighbours and colleagues with "ನಮಸ್ಕಾರ" (Namaskāra)',
          'Differentiate polite "ನಿಮ್ಮ" (nimma - your) from casual "ನಿನ್ನ" (ninna)',
          'Ask and state names naturally without hesitation',
        ],
        keyGrammarConcept:
          'Kannada is phonetic, and respect is grammatical: ನೀವು (neevu) for elders and strangers; ನೀನು (neenu) only for peers or intimates.',
      },
      {
        id: 'mod-1-2',
        lessonId: 'shopping-and-bargaining',
        titleEnglish: 'Shopping, Numbers & Kirana Prices',
        titleKannada: 'ಮಾರುಕಟ್ಟೆ, ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಬೆಲೆ ಚೌಕಾಶಿ',
        subtitle: 'KR Market bargaining, counting 1–100, weights, and polite price requests',
        icon: 'ShoppingBag',
        level: 1,
        order: 2,
        xpReward: 40,
        objectives: [
          'Count fluently from ಒಂದು (1) to ನೂರು (100) for daily transactions',
          'Ask prices of goods: "ಇದು ಕೆಜಿಗೆ ಎಷ್ಟು ರೂಪಾಯಿ?" (How much per kg?)',
          'Politely request price reductions: "ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ ಕೊಡಿ"',
          'Select fresh produce and specify weights in ಅರ್ಧ (half) and ಕಾಲು (quarter)',
        ],
        keyGrammarConcept:
          'Dative case marking on commodities: "ಕೆಜಿಗೆ" (per kg), "ಅದಕ್ಕೆ" (for that).',
      },
      {
        id: 'mod-1-3',
        lessonId: 'ordering-food-restaurants',
        titleEnglish: 'Food, Restaurants & Polite Requests',
        titleKannada: 'ದರ್ಶಿನಿಯಲ್ಲಿ ಊಟ, ತಿಂಡಿ ಮತ್ತು ವಿನಯದ ವಿನಂತಿ',
        subtitle: 'Masala dosa, filter coffee, spice levels, and asking for the bill',
        icon: 'Utensils',
        level: 1,
        order: 3,
        xpReward: 45,
        objectives: [
          'Order breakfast at Darshinis: "ಒಂದು ಮಸಾಲಾ ದೋಸೆ ಮತ್ತು ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ"',
          'Specify spice and sugar preferences: "ಖಾರ ಕಡಿಮೆ", "ಸಕ್ಕರೆ ಬೇಡ"',
          'Express desire politely: ಬೇಕು (want) and ಬೇಡ (do not want)',
          'Ask for the bill and payment modes: "ಬಿಲ್ ಎಷ್ಟು?", "UPI ಇದೆಯಾ?"',
        ],
        keyGrammarConcept:
          'Imperative verb forms: "ಕೊಡಿ" (polite please give) vs "ಕೊಡು" (informal give).',
      },
    ],
  },
  {
    levelNumber: 2,
    titleEnglish: 'Level 2: Everyday Kannada',
    titleKannada: 'ಹಂತ ೨: ದಿನನಿತ್ಯದ ಕನ್ನಡ',
    description:
      'Navigate apartment life, Namma Metro commutes, auto rides, and ask for directions across Bengaluru with confidence.',
    accentColor: 'emerald',
    modules: [
      {
        id: 'mod-2-1',
        lessonId: 'talking-to-neighbours',
        titleEnglish: 'Family, Neighbours & Social Bonds',
        titleKannada: 'ಕುಟುಂಬ, ಸ್ನೇಹಿತರು ಮತ್ತು ನೆರೆಹೊರೆ',
        subtitle: 'Talking with apartment residents, security, and housekeepers',
        icon: 'Users',
        level: 2,
        order: 1,
        xpReward: 45,
        objectives: [
          'Introduce family members: ಅಪ್ಪ (father), ಅಮ್ಮ (mother), ಅಣ್ಣ (elder brother)',
          'Inquire about wellbeing: "ಮನೆಯಲ್ಲಿ ಎಲ್ಲರೂ ಹೇಗಿದ್ದಾರೆ?" (How is everyone at home?)',
          'Coordinate domestic help and delivery arrivals politely',
          'Use day markers naturally: ಇಂದು (today), ನಾಳೆ (tomorrow), ನಿನ್ನೆ (yesterday)',
        ],
        keyGrammarConcept:
          'Plural and honorific suffixes: "-ರು" (e.g., ಸ್ನೇಹಿತರು, ನೆರೆಹೊರೆಯವರು).',
      },
      {
        id: 'mod-2-2',
        lessonId: 'public-transportation',
        titleEnglish: 'Namma Metro, Buses & Auto Rickshaws',
        titleKannada: 'ಮೆಟ್ರೋ, ಬಸ್ ಮತ್ತು ಆಟೋ ಪ್ರಯಾಣ',
        subtitle: 'Buying tickets, requesting stops, and negotiating auto fares',
        icon: 'Bus',
        level: 2,
        order: 2,
        xpReward: 50,
        objectives: [
          'Ask auto drivers to use the meter: "ಮೀಟರ್ ಹಾಕ್ತೀರಾ?"',
          'Request ticket and route information from BMTC conductors',
          'Ask stop locations: "ಮುಂದಿನ ಸ್ಟಾಪ್‌ನಲ್ಲಿ ಇಳಿಸಿ" (Please drop me at the next stop)',
          'Ask "ಎಷ್ಟು ಗಂಟೆ?" (What time is it?) and understand timing responses',
        ],
        keyGrammarConcept:
          'Locative and directional suffixes: "-ಕ್ಕೆ" (to / towards) and "-ಅಲ್ಲಿ" (in / at); time suffix "-ಕ್ಕೆ" means "at".',
      },
      {
        id: 'mod-2-3',
        lessonId: 'asking-for-directions',
        titleEnglish: 'Directions & Everyday Problem Solving',
        titleKannada: 'ದಾರಿ ಕೇಳುವುದು ಮತ್ತು ಸಮಸ್ಯೆ ಪರಿಹಾರ',
        subtitle: 'Left, right, straight, landmarks, banks, and post offices',
        icon: 'MapPin',
        level: 2,
        order: 3,
        xpReward: 50,
        objectives: [
          'Ask precise directions: "ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಜಂಕ್ಷನ್‌ಗೆ ಹೇಗೆ ಹೋಗಬೇಕು?"',
          'Understand navigational cues: ಎಡಕ್ಕೆ (to left), ಬಲಕ್ಕೆ (to right), ನೇರವಾಗಿ (straight)',
          'Inquire about nearby ATMs, pharmacies, and civic offices',
          'Apologise and ask for help: ಕ್ಷಮಿಸಿ (excuse me / sorry)',
        ],
        keyGrammarConcept:
          'Obligation verb form "-ಬೇಕು" (must / need to go: ಹೋಗಬೇಕು).',
      },
    ],
  },
  {
    levelNumber: 3,
    titleEnglish: 'Level 3: Practical Conversations',
    titleKannada: 'ಹಂತ ೩: ಪ್ರಾಯೋಗಿಕ ಸಂಭಾಷಣೆ',
    description:
      'Speak confidently at college, communicate in tech workplaces, manage health situations, and solve everyday problems.',
    accentColor: 'amber',
    modules: [
      {
        id: 'mod-3-1',
        lessonId: 'college-and-classroom',
        titleEnglish: 'College, Classrooms & Campus Life',
        titleKannada: 'ಕಾಲೇಜು ಮತ್ತು ತರಗತಿ ಸಂಭಾಷಣೆ',
        subtitle: 'Interacting with professors, asking doubts, library chats',
        icon: 'GraduationCap',
        level: 3,
        order: 1,
        xpReward: 55,
        objectives: [
          'Address professors respectfully: "ನಮಸ್ಕಾರ ಪ್ರೊಫೆಸರ್, ನನಗೊಂದು ಅನುಮಾನವಿದೆ"',
          'Discuss assignments and project submissions with classmates',
          'Borrow books and query library resources in Kannada',
        ],
        keyGrammarConcept:
          'Expressing possession and doubt: "ನನಗೆ ... ಇದೆ" (I have ...).',
      },
      {
        id: 'mod-3-2',
        lessonId: 'workplace-communication',
        titleEnglish: 'Workplace & Tech Park Communication',
        titleKannada: 'ಕಚೇರಿ ಮತ್ತು ಉದ್ಯೋಗ ಸ್ಥಳ ಸಂವಹನ',
        subtitle: 'Formal meetings, office support staff, coffee breaks, and tenses',
        icon: 'Briefcase',
        level: 3,
        order: 2,
        xpReward: 60,
        objectives: [
          'Greet managers and team members politely at Whitefield/Electronic City tech parks',
          'Liaise with facilities, cafeteria, and security staff with warmth and dignity',
          'Formulate requests: "ದಯವಿಟ್ಟು ಈ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ" (Please check this email)',
          'Use the three core tenses: ಮಾಡಿದೆ (did), ಮಾಡುತ್ತಿದ್ದೇನೆ (am doing), ಮಾಡುತ್ತೇನೆ (will do)',
        ],
        keyGrammarConcept:
          'Polite honorific suffix "-ಅವರು", respectful request structures, and verbal participles (ಮಾಡಿ, ಹೋಗಿ, ಬಂದು).',
      },
      {
        id: 'mod-3-3',
        lessonId: 'hospitals-and-pharmacies',
        titleEnglish: 'Healthcare, Clinics & Pharmacies',
        titleKannada: 'ಆಸ್ಪತ್ರೆ, ವೈದ್ಯರು ಮತ್ತು ಔಷಧ ಅಂಗಡಿ',
        subtitle: 'Describing symptoms, buying medicines, asking dosages',
        icon: 'Stethoscope',
        level: 3,
        order: 3,
        xpReward: 60,
        objectives: [
          'Describe common ailments: ಜ್ವರ (fever), ತಲೆನೋವು (headache), ಕೆಮ್ಮು (cough)',
          'Inquire about dosages at medical stores: "ದಿನಕ್ಕೆ ಎಷ್ಟು ಬಾರಿ ತಗೋಬೇಕು?"',
          'Schedule clinic appointments and explain urgency calmly',
        ],
        keyGrammarConcept:
          'Describing physical sensations with dative subjects: "ನನಗೆ ತಲೆನೋವು ಇದೆ" (Headache is to me).',
      },
    ],
  },
  {
    levelNumber: 4,
    titleEnglish: 'Level 4: Culture & Mastery',
    titleKannada: 'ಹಂತ ೪: ಸಂಸ್ಕೃತಿ ಮತ್ತು ಪರಿಣತಿ',
    description:
      'Bring everything together through Karnataka’s festivals, classical arts, storytelling, and longer natural conversations.',
    accentColor: 'purple',
    modules: [
      {
        id: 'mod-4-1',
        lessonId: 'festivals-and-cultural-events',
        titleEnglish: 'Karnataka Heritage, Festivals & Storytelling',
        titleKannada: 'ಹಬ್ಬಗಳು, ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆ ಮತ್ತು ಕಥನ',
        subtitle: 'Mysuru Dasara, Rajyotsava, Ugadi, Yakshagana, and fluent storytelling',
        icon: 'Compass',
        level: 4,
        order: 1,
        xpReward: 80,
        objectives: [
          'Discuss festival traditions and convey heartfelt wishes: "ರಾಜ್ಯೋತ್ಸವದ ಶುಭಾಶಯಗಳು!"',
          'Appreciate classical arts: ಯಕ್ಷಗಾನ (Yakshagana), ಭರತನಾಟ್ಯ, and Dasa Sahitya',
          'Converse with native speakers about Karnataka history and literary giants',
          'Understand authentic spoken Kannada at natural speed and retell a short story',
          'Connect ideas with conditionals "-ದರೆ" (if) and "-ಆದರೂ" (even then)',
        ],
        keyGrammarConcept:
          'Subordinate clauses, compound verbs, and reported speech with "-ಎಂದು" (that).',
      },
    ],
  },
];
