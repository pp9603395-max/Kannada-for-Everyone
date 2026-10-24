export interface InteractiveWord {
  id: string;
  kannada: string;
  transliteration: string;
  devanagari: string;
  meanings: {
    en: string;
    mr: string;
    hi: string;
  };
  partOfSpeech: string;
  root?: string;
  grammarNote?: string;
}

export interface ReadingSentence {
  id: string;
  kannada: string;
  transliteration: string;
  devanagari: string;
  translations: {
    en: string;
    mr: string;
    hi: string;
  };
  words: InteractiveWord[];
}

export interface ReadingStory {
  id: string;
  titleKannada: string;
  titleEnglish: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'City Life' | 'Food & Culture' | 'Travel' | 'Traditions';
  coverEmoji: string;
  estimatedMinutes: number;
  synopsis: {
    en: string;
    mr: string;
    hi: string;
  };
  sentences: ReadingSentence[];
}

export const READING_STORIES: ReadingStory[] = [
  {
    id: 'bengaluru-metro',
    titleKannada: 'ನಮ್ಮ ಮೆಟ್ರೋ ಪ್ರಯಾಣ',
    titleEnglish: 'Traveling on Namma Metro',
    difficulty: 'Beginner',
    category: 'City Life',
    coverEmoji: '🚇',
    estimatedMinutes: 3,
    synopsis: {
      en: 'Experience a smooth commute through Bengaluru using the Green and Purple Metro lines, navigating smart cards and announcements.',
      mr: 'नम्मा मेट्रोने बंगळुरूची सफर करा. स्मार्ट कार्ड, स्टेशन घोषणा आणि दोन मार्गांचे सोपे स्पष्टीकरण.',
      hi: 'नम्मा मेट्रो के साथ बेंगलुरु में यात्रा का अनुभव। स्मार्ट कार्ड, स्टेशन घोषणाएँ और यात्रा के आसान नियम।'
    },
    sentences: [
      {
        id: 'bm-s1',
        kannada: 'ಬೆಂಗಳೂರು ನಗರದಲ್ಲಿ ಪ್ರಯಾಣ ಮಾಡಲು ನಮ್ಮ ಮೆಟ್ರೋ ಅತ್ಯಂತ ವೇಗವಾದ ಮತ್ತು ಆರಾಮದಾಯಕ ವಾಹನ.',
        transliteration: 'Bengaluru nagaradalli prayaana maadolu namma metro atyanta vēgavaada mattu aaraamadaayaka vaahana.',
        devanagari: 'बेंगलूरु नगरदल्लि प्रयाण माडलु नम्म मेट्रो अत्यंत वेगवाद मत्तु आरामदायक वाहन.',
        translations: {
          en: 'Namma Metro is the fastest and most comfortable vehicle for traveling in Bengaluru city.',
          mr: 'बंगळुरू शहरात प्रवास करण्यासाठी नम्मा मेट्रो हे सर्वात जलद आणि आरामदायक साधन आहे.',
          hi: 'बेंगलुरु शहर में यात्रा करने के लिए नम्मा मेट्रो सबसे तेज़ और आरामदायक साधन है।'
        },
        words: [
          {
            id: 'bm-w1',
            kannada: 'ಬೆಂಗಳೂರು',
            transliteration: 'Bengaluru',
            devanagari: 'बेंगलूरु',
            meanings: { en: 'Bengaluru', mr: 'बंगळुरू', hi: 'बेंगलुरु' },
            partOfSpeech: 'Proper Noun'
          },
          {
            id: 'bm-w2',
            kannada: 'ನಗರದಲ್ಲಿ',
            transliteration: 'nagaradalli',
            devanagari: 'नगरदल्लि',
            meanings: { en: 'in the city', mr: 'शहरात', hi: 'शहर में' },
            partOfSpeech: 'Noun + Locative Suffix (-ಅಲ್ಲಿ)',
            root: 'ನಗರ (city)'
          },
          {
            id: 'bm-w3',
            kannada: 'ಪ್ರಯಾಣ',
            transliteration: 'prayaana',
            devanagari: 'प्रयाण',
            meanings: { en: 'journey / travel', mr: 'प्रवास', hi: 'यात्रा' },
            partOfSpeech: 'Noun'
          },
          {
            id: 'bm-w4',
            kannada: 'ಮಾಡಲು',
            transliteration: 'maadalu',
            devanagari: 'माडलु',
            meanings: { en: 'to do / to make', mr: 'करण्यासाठी', hi: 'करने के लिए' },
            partOfSpeech: 'Infinitive Verb',
            root: 'ಮಾಡು (to do)'
          },
          {
            id: 'bm-w5',
            kannada: 'ನಮ್ಮ',
            transliteration: 'namma',
            devanagari: 'नम्म',
            meanings: { en: 'our', mr: 'आमचे', hi: 'हमारा / हमारी' },
            partOfSpeech: 'Possessive Pronoun'
          },
          {
            id: 'bm-w6',
            kannada: 'ಮೆಟ್ರೋ',
            transliteration: 'metro',
            devanagari: 'मेट्रो',
            meanings: { en: 'metro', mr: 'मेट्रो', hi: 'मेट्रो' },
            partOfSpeech: 'Noun'
          },
          {
            id: 'bm-w7',
            kannada: 'ಅತ್ಯಂತ',
            transliteration: 'atyanta',
            devanagari: 'अत्यंत',
            meanings: { en: 'most / extremely', mr: 'सर्वात / अत्यंत', hi: 'सबसे / अत्यंत' },
            partOfSpeech: 'Adverb'
          },
          {
            id: 'bm-w8',
            kannada: 'ವೇಗವಾದ',
            transliteration: 'vēgavaada',
            devanagari: 'वेगवाद',
            meanings: { en: 'fast / speedy', mr: 'जलद / वेगवान', hi: 'तेज़' },
            partOfSpeech: 'Adjective'
          },
          {
            id: 'bm-w9',
            kannada: 'ಮತ್ತು',
            transliteration: 'mattu',
            devanagari: 'मत्तु',
            meanings: { en: 'and', mr: 'आणि', hi: 'और' },
            partOfSpeech: 'Conjunction'
          },
          {
            id: 'bm-w10',
            kannada: 'ಆರಾಮದಾಯಕ',
            transliteration: 'aaraamadaayaka',
            devanagari: 'आरामदायक',
            meanings: { en: 'comfortable', mr: 'आरामदायक', hi: 'आरामदायक' },
            partOfSpeech: 'Adjective'
          },
          {
            id: 'bm-w11',
            kannada: 'ವಾಹನ',
            transliteration: 'vaahana',
            devanagari: 'वाहन',
            meanings: { en: 'vehicle / transport', mr: 'वाहन', hi: 'वाहन' },
            partOfSpeech: 'Noun'
          }
        ]
      },
      {
        id: 'bm-s2',
        kannada: 'ಮೆಜೆಸ್ಟಿಕ್ ನಿಲ್ದಾಣದಲ್ಲಿ ಹಸಿರು ಮತ್ತು ನೇರಳೆ ಮಾರ್ಗಗಳು ಒಂದಾಗುತ್ತವೆ.',
        transliteration: 'Majestic nildaana-dalli hasiru mattu nērale maargagalu ondaaguttave.',
        devanagari: 'मेजेस्टिक निल्दाणदल्लि हसिरु मत्तु नेरळे मार्गगळु ओन्दागुत्तवे.',
        translations: {
          en: 'At Majestic station, the Green and Purple lines intersect.',
          mr: 'मॅजेस्टिक स्टेशनवर हिरवा आणि जांभळा मेट्रो मार्ग एकमेकांना मिळतात.',
          hi: 'मजेस्टिक स्टेशन पर ग्रीन और पर्पल मेट्रो लाइनें आपस में मिलती हैं।'
        },
        words: [
          {
            id: 'bm-w12',
            kannada: 'ಮೆಜೆಸ್ಟಿಕ್',
            transliteration: 'Majestic',
            devanagari: 'मेजेस्टिक',
            meanings: { en: 'Majestic (Kempegowda Station)', mr: 'मॅजेस्टिक', hi: 'मजेस्टिक' },
            partOfSpeech: 'Proper Noun'
          },
          {
            id: 'bm-w13',
            kannada: 'ನಿಲ್ದಾಣದಲ್ಲಿ',
            transliteration: 'nildaana-dalli',
            devanagari: 'निल्दाणदल्लि',
            meanings: { en: 'at the station', mr: 'स्थानकावर', hi: 'स्टेशन पर' },
            partOfSpeech: 'Noun + Locative',
            root: 'ನಿಲ್ದಾಣ (stop/station)'
          },
          {
            id: 'bm-w14',
            kannada: 'ಹಸಿರು',
            transliteration: 'hasiru',
            devanagari: 'हसिरु',
            meanings: { en: 'green', mr: 'हिरवा', hi: 'हरा' },
            partOfSpeech: 'Color / Adjective'
          },
          {
            id: 'bm-w15',
            kannada: 'ನೇರಳೆ',
            transliteration: 'nērale',
            devanagari: 'नेरळे',
            meanings: { en: 'purple', mr: 'जांभळा', hi: 'बैंगनी' },
            partOfSpeech: 'Color / Adjective'
          },
          {
            id: 'bm-w16',
            kannada: 'ಮಾರ್ಗಗಳು',
            transliteration: 'maargagalu',
            devanagari: 'मार्गगळु',
            meanings: { en: 'routes / lines', mr: 'मार्ग / लाईन्स', hi: 'मार्ग / लाइनें' },
            partOfSpeech: 'Plural Noun (-ಗಳು)'
          },
          {
            id: 'bm-w17',
            kannada: 'ಒಂದಾಗುತ್ತವೆ',
            transliteration: 'ondaaguttave',
            devanagari: 'ओन्दागुत्तवे',
            meanings: { en: 'unite / intersect', mr: 'एकत्र येतात', hi: 'एक साथ मिलती हैं' },
            partOfSpeech: 'Verb (Present Neuter Plural)'
          }
        ]
      },
      {
        id: 'bm-s3',
        kannada: 'ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಬಳಸಿದರೆ ಶೇಕಡಾ ಐದರಷ್ಟು ರಿಯಾಯಿತಿ ಸಿಗುತ್ತದೆ.',
        transliteration: 'Smart card balisidare shēkadaa aidarashtu riyaayiti siguttade.',
        devanagari: 'स्मार्ट कार्ड बळिसिदरे शेकडा ऐदरष्टु रियायिति सिगुत्तदे.',
        translations: {
          en: 'If you use a smart card, you get a 5% discount.',
          mr: 'स्मार्ट कार्ड वापरल्यास पाच टक्के सवलत मिळते.',
          hi: 'अगर आप स्मार्ट कार्ड इस्तेमाल करते हैं, तो पांच प्रतिशत छूट मिलती है।'
        },
        words: [
          {
            id: 'bm-w18',
            kannada: 'ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್',
            transliteration: 'smart card',
            devanagari: 'स्मार्ट कार्ड',
            meanings: { en: 'smart card', mr: 'स्मार्ट कार्ड', hi: 'स्मार्ट कार्ड' },
            partOfSpeech: 'Noun'
          },
          {
            id: 'bm-w19',
            kannada: 'ಬಳಸಿದರೆ',
            transliteration: 'balisidare',
            devanagari: 'बळिसिदरे',
            meanings: { en: 'if used', mr: 'वापरल्यास', hi: 'यदि उपयोग करें' },
            partOfSpeech: 'Conditional Verb (-ರೆ)',
            root: 'ಬಳಸು (to use)'
          },
          {
            id: 'bm-w20',
            kannada: 'ಶೇಕಡಾ',
            transliteration: 'shēkadaa',
            devanagari: 'शेकडा',
            meanings: { en: 'percent', mr: 'टक्के / शेकडा', hi: 'प्रतिशत' },
            partOfSpeech: 'Noun'
          },
          {
            id: 'bm-w21',
            kannada: 'ಐದರಷ್ಟು',
            transliteration: 'aidarashtu',
            devanagari: 'ऐदरष्टु',
            meanings: { en: 'amounting to five', mr: 'पाचाएवढे', hi: 'पांच के बराबर' },
            partOfSpeech: 'Numeral Adverb',
            root: 'ಐದು (5)'
          },
          {
            id: 'bm-w22',
            kannada: 'ರಿಯಾಯಿತಿ',
            transliteration: 'riyaayiti',
            devanagari: 'रियायिति',
            meanings: { en: 'discount / concession', mr: 'सवलत', hi: 'छूट / रियायत' },
            partOfSpeech: 'Noun'
          },
          {
            id: 'bm-w23',
            kannada: 'ಸಿಗುತ್ತದೆ',
            transliteration: 'siguttade',
            devanagari: 'सिगुत्तदे',
            meanings: { en: 'is available / is received', mr: 'मिळते', hi: 'मिलता है' },
            partOfSpeech: 'Verb',
            root: 'ಸಿಗು (to be found / to get)'
          }
        ]
      }
    ]
  },
  {
    id: 'vidyarthi-bhavan',
    titleKannada: 'ವಿದ್ಯಾರ್ಥಿ ಭವನದಲ್ಲಿ ಬೆಣ್ಣೆ ದೋಸೆ',
    titleEnglish: 'Benne Dosa at Vidyarthi Bhavan',
    difficulty: 'Beginner',
    category: 'Food & Culture',
    coverEmoji: '☕',
    estimatedMinutes: 3,
    synopsis: {
      en: 'Step into Gandhi Bazaar, order crispy buttery dosas and aromatic degree filter coffee in a legendary 1943 heritage café.',
      mr: 'गांधी बाजारमधील सुप्रसिद्ध विद्यार्थी भवनमध्ये कुरकुरीत लोणी डोसा आणि अस्सल फिल्टर कॉफीचा आस्वाद घ्या.',
      hi: 'गांधी बाजार के ऐतिहासिक विद्यार्थी भवन में कुरकुरे बटर डोसा और खुशबूदार फिल्टर कॉफी का आनंद लें।'
    },
    sentences: [
      {
        id: 'vb-s1',
        kannada: 'ಗಾಂಧಿ ಬಜಾರಿನಲ್ಲಿರುವ ವಿದ್ಯಾರ್ಥಿ ಭವನವು ಹಳೆಯ ಬೆಂಗಳೂರಿನ ಪ್ರಸಿದ್ಧ ಉಪಹಾರ ಗೃಹ.',
        transliteration: 'Gandhi bazaar-inalliruva Vidyarthi Bhavan-avu haleya Bengalurina prasiddha upahaara gruha.',
        devanagari: 'गांधी बझारिनल्लिरुव विद्यार्थी भवनवु हळॆय बेंगलूरिन प्रसिद्ध उपाहार गृह.',
        translations: {
          en: 'Vidyarthi Bhavan in Gandhi Bazaar is a famous breakfast eatery of old Bengaluru.',
          mr: 'गांधी बाजारमधील विद्यार्थी भवन हे जुन्या बंगळुरूचे एक प्रसिद्ध उपाहारगृह आहे.',
          hi: 'गांधी बाजार में स्थित विद्यार्थी भवन पुराने बेंगलुरु का एक मशहूर नाश्ता केंद्र है।'
        },
        words: [
          {
            id: 'vb-w1',
            kannada: 'ಗಾಂಧಿ ಬಜಾರಿನಲ್ಲಿರುವ',
            transliteration: 'Gandhi bazaar-inalliruva',
            devanagari: 'गांधी बझारिनल्लिरुव',
            meanings: { en: 'located in Gandhi Bazaar', mr: 'गांधी बाजारमध्ये असलेले', hi: 'गांधी बाजार में स्थित' },
            partOfSpeech: 'Relative Participle'
          },
          {
            id: 'vb-w2',
            kannada: 'ವಿದ್ಯಾರ್ಥಿ ಭವನವು',
            transliteration: 'Vidyarthi Bhavan-avu',
            devanagari: 'विद्यार्थी भवनवु',
            meanings: { en: 'Vidyarthi Bhavan (as subject)', mr: 'विद्यार्थी भवन', hi: 'विद्यार्थी भवन' },
            partOfSpeech: 'Proper Noun'
          },
          {
            id: 'vb-w3',
            kannada: 'ಹಳೆಯ',
            transliteration: 'haleya',
            devanagari: 'हळॆय',
            meanings: { en: 'old / heritage', mr: 'जुने', hi: 'पुराना' },
            partOfSpeech: 'Adjective'
          },
          {
            id: 'vb-w4',
            kannada: 'ಪ್ರಸಿದ್ಧ',
            transliteration: 'prasiddha',
            devanagari: 'प्रसिद्ध',
            meanings: { en: 'famous / renowned', mr: 'प्रसिद्ध', hi: 'प्रसिद्ध' },
            partOfSpeech: 'Adjective'
          },
          {
            id: 'vb-w5',
            kannada: 'ಉಪಹಾರ ಗೃಹ',
            transliteration: 'upahaara gruha',
            devanagari: 'उपाहार गृह',
            meanings: { en: 'restaurant / eatery', mr: 'उपाहारगृह', hi: 'जलपान गृह / रेस्तरां' },
            partOfSpeech: 'Compound Noun'
          }
        ]
      },
      {
        id: 'vb-s2',
        kannada: 'ಇಲ್ಲಿನ ಗರಿಗರಿಯಾದ ಬೆಣ್ಣೆ ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಗಟ್ಟಿ ಚಟ್ನಿ ಎಲ್ಲರಿಗೂ ತುಂಬಾ ಇಷ್ಟ.',
        transliteration: 'Illina garigariyaada benne masaale dose mattu gatti chatni ellarigoo tumbaa ishta.',
        devanagari: 'इल्लिन गरिगरियाद बॆण्णॆ मसाले दोसे मत्तु गट्टि चट्नि ऎल्लरिगू तुंबा इष्ट.',
        translations: {
          en: 'Everyone loves the crispy butter masala dosa and thick coconut chutney served here.',
          mr: 'येथील कुरकुरीत बटर मसाला डोसा आणि घट्ट खोबऱ्याची चटणी सर्वांना खूप आवडते.',
          hi: 'यहाँ का कुरकुरा बटर मसाला डोसा और गाढ़ी नारियल की चटनी सबको बहुत पसंद है।'
        },
        words: [
          {
            id: 'vb-w6',
            kannada: 'ಇಲ್ಲಿನ',
            transliteration: 'illina',
            devanagari: 'इल्लिन',
            meanings: { en: 'of this place', mr: 'येथील', hi: 'यहाँ का' },
            partOfSpeech: 'Genitive Pronoun'
          },
          {
            id: 'vb-w7',
            kannada: 'ಗರಿಗರಿಯಾದ',
            transliteration: 'garigariyaada',
            devanagari: 'गरिगरियाद',
            meanings: { en: 'crispy / crunchy', mr: 'कुरकुरीत', hi: 'कुरकुरा' },
            partOfSpeech: 'Adjective'
          },
          {
            id: 'vb-w8',
            kannada: 'ಬೆಣ್ಣೆ',
            transliteration: 'benne',
            devanagari: 'बॆण्णॆ',
            meanings: { en: 'butter', mr: 'लोणी', hi: 'मक्खन' },
            partOfSpeech: 'Noun'
          },
          {
            id: 'vb-w9',
            kannada: 'ದೋಸೆ',
            transliteration: 'dose',
            devanagari: 'दोसे',
            meanings: { en: 'dosa', mr: 'डोसा', hi: 'डोसा' },
            partOfSpeech: 'Noun'
          },
          {
            id: 'vb-w10',
            kannada: 'ಗಟ್ಟಿ',
            transliteration: 'gatti',
            devanagari: 'गट्टि',
            meanings: { en: 'thick / firm', mr: 'घट्ट', hi: 'गाढ़ा' },
            partOfSpeech: 'Adjective'
          },
          {
            id: 'vb-w11',
            kannada: 'ಚಟ್ನಿ',
            transliteration: 'chatni',
            devanagari: 'चट्नि',
            meanings: { en: 'chutney', mr: 'चटणी', hi: 'चटनी' },
            partOfSpeech: 'Noun'
          },
          {
            id: 'vb-w12',
            kannada: 'ಎಲ್ಲರಿಗೂ',
            transliteration: 'ellarigoo',
            devanagari: 'ऎल्लरिगू',
            meanings: { en: 'to everyone', mr: 'सर्वांना', hi: 'सबको' },
            partOfSpeech: 'Pronoun + Dative (-ಇಗೆ/-ಇರಿಗೆ)'
          },
          {
            id: 'vb-w13',
            kannada: 'ತುಂಬಾ ಇಷ್ಟ',
            transliteration: 'tumbaa ishta',
            devanagari: 'तुंबा इष्ट',
            meanings: { en: 'greatly liked / favorite', mr: 'खूप आवडते', hi: 'बहुत पसंद है' },
            partOfSpeech: 'Adverb + Predicate'
          }
        ]
      },
      {
        id: 'vb-s3',
        kannada: 'ದೋಸೆ ತಿಂದ ನಂತರ ಬಿಸಿ ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕುಡಿಯುವುದು ಕರ್ನಾಟಕದ ಸಂಪ್ರದಾಯ.',
        transliteration: 'Dose tinda nantara bisi bisi filter coffee kudiyuvudu Karnatakada sampradaaya.',
        devanagari: 'दोसे तिंद नंतर बिसि बिसि फिल्टर कॉफी कुडियुवुदु कर्नाटकद संप्रदाय.',
        translations: {
          en: 'Drinking piping hot filter coffee after eating dosa is a Karnataka tradition.',
          mr: 'डोसा खाल्ल्यानंतर गरमागरम फिल्टर कॉफी पिणे ही कर्नाटकाची खास परंपरा आहे.',
          hi: 'डोसा खाने के बाद गरमा-गरम फिल्टर कॉफी पीना कर्नाटक की परंपरा है।'
        },
        words: [
          {
            id: 'vb-w14',
            kannada: 'ತಿಂದ ನಂತರ',
            transliteration: 'tinda nantara',
            devanagari: 'तिंद नंतर',
            meanings: { en: 'after eating', mr: 'खाल्ल्यानंतर', hi: 'खाने के बाद' },
            partOfSpeech: 'Participle + Postposition'
          },
          {
            id: 'vb-w15',
            kannada: 'ಬಿಸಿ ಬಿಸಿ',
            transliteration: 'bisi bisi',
            devanagari: 'बिसि बिसि',
            meanings: { en: 'piping hot', mr: 'गरमागरम', hi: 'गरमा-गरम' },
            partOfSpeech: 'Reduplicated Adjective'
          },
          {
            id: 'vb-w16',
            kannada: 'ಕುಡಿಯುವುದು',
            transliteration: 'kudiyuvudu',
            devanagari: 'कुडियुवुदु',
            meanings: { en: 'drinking / to drink', mr: 'पिणे', hi: 'पीना' },
            partOfSpeech: 'Gerund / Verbal Noun'
          },
          {
            id: 'vb-w17',
            kannada: 'ಕರ್ನಾಟಕದ',
            transliteration: 'Karnatakada',
            devanagari: 'कर्नाटकद',
            meanings: { en: 'of Karnataka', mr: 'कर्नाटकाची', hi: 'कर्नाटक की' },
            partOfSpeech: 'Noun + Genitive (-ಅದ)'
          },
          {
            id: 'vb-w18',
            kannada: 'ಸಂಪ್ರದಾಯ',
            transliteration: 'sampradaaya',
            devanagari: 'संप्रदाय',
            meanings: { en: 'tradition / custom', mr: 'परंपरा', hi: 'परंपरा' },
            partOfSpeech: 'Noun'
          }
        ]
      }
    ]
  },
  {
    id: 'russell-market',
    titleKannada: 'ರಸೆಲ್ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಹಣ್ಣು ಖರೀದಿ',
    titleEnglish: 'Buying Fruits at Russell Market',
    difficulty: 'Intermediate',
    category: 'City Life',
    coverEmoji: '🥭',
    estimatedMinutes: 4,
    synopsis: {
      en: 'Practice conversational bargaining and polite inquiry while selecting fresh seasonal mangoes and vegetables in Shivajinagar.',
      mr: 'शिवाजीनगरमधील रसेल मार्केटमध्ये गोड आंबे खरेदी करताना कन्नडमधील संवाद व सौदेबाजीचा सराव.',
      hi: 'शिवाजीनगर के रसेल मार्केट में मीठे आम खरीदते हुए कन्नड़ में बातचीत और मोलभाव का व्यावहारिक अभ्यास।'
    },
    sentences: [
      {
        id: 'rm-s1',
        kannada: 'ಶಿವಾಜಿನಗರದ ರಸೆಲ್ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ತಾಜಾ ಹಣ್ಣುಗಳು ಮತ್ತು ತರಕಾರಿಗಳು ದೊರೆಯುತ್ತವೆ.',
        transliteration: 'Shivajinagarada Russell maarukatteyalli taajaa hannugalu mattu tarakaarigalu doreyuttave.',
        devanagari: 'शिवाजीनगरद रसेल मारुकट्टेयल्लि ताजा हण्णुगळु मत्तु तरकारिगळु दॊरॆयुत्तवे.',
        translations: {
          en: 'Fresh fruits and vegetables are available in Russell Market, Shivajinagar.',
          mr: 'शिवाजीनगरच्या रसेल मार्केटमध्ये ताजी फळे आणि भाज्या मिळतात.',
          hi: 'शिवाजीनगर के रसेल मार्केट में ताज़े फल और सब्ज़ियाँ मिलती हैं।'
        },
        words: [
          {
            id: 'rm-w1',
            kannada: 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ',
            transliteration: 'maarukatteyalli',
            devanagari: 'मारुकट्टेयल्लि',
            meanings: { en: 'in the market', mr: 'बाजारामध्ये', hi: 'बाजार में' },
            partOfSpeech: 'Noun + Locative',
            root: 'ಮಾರುಕಟ್ಟೆ (market)'
          },
          {
            id: 'rm-w2',
            kannada: 'ತಾಜಾ',
            transliteration: 'taajaa',
            devanagari: 'ताजा',
            meanings: { en: 'fresh', mr: 'ताजे', hi: 'ताज़ा' },
            partOfSpeech: 'Adjective'
          },
          {
            id: 'rm-w3',
            kannada: 'ಹಣ್ಣುಗಳು',
            transliteration: 'hannugalu',
            devanagari: 'हण्णुगळु',
            meanings: { en: 'fruits', mr: 'फळे', hi: 'फल' },
            partOfSpeech: 'Plural Noun',
            root: 'ಹಣ್ಣು (fruit)'
          },
          {
            id: 'rm-w4',
            kannada: 'ತರಕಾರಿಗಳು',
            transliteration: 'tarakaarigalu',
            devanagari: 'तरकारिगळु',
            meanings: { en: 'vegetables', mr: 'भाज्या', hi: 'सब्ज़ियाँ' },
            partOfSpeech: 'Plural Noun',
            root: 'ತರಕಾರಿ (vegetable)'
          },
          {
            id: 'rm-w5',
            kannada: 'ದೊರೆಯುತ್ತವೆ',
            transliteration: 'doreyuttave',
            devanagari: 'दॊरॆयुत्तवे',
            meanings: { en: 'are obtainable / available', mr: 'मिळतात', hi: 'उपलब्ध होती हैं' },
            partOfSpeech: 'Verb'
          }
        ]
      },
      {
        id: 'rm-s2',
        kannada: 'ಗ್ರಾಹಕರು: "ಅಣ್ಣಾ, ಈ ಮಾವಿನ ಹಣ್ಣು ಒಂದು ಕೆಜಿಗೆ ಎಷ್ಟು ಬೆಲೆ?" ಎಂದು ಕೇಳುತ್ತಾರೆ.',
        transliteration: 'Graahakaru: "Annaa, ee maavina hannu ondu kejige eshtu bele?" endu kēluttaare.',
        devanagari: 'ग्राहकरु: "अण्णा, ई माविन हण्णु ओंदु केजिगे ऎष्टु बॆलॆ?" ऎंदु केळुत्तारे.',
        translations: {
          en: 'Customer asks: "Brother, how much is one kilogram of these mangoes?"',
          mr: 'ग्राहक विचारतात: "भाऊ, या आंब्यांचा एका किलोचा भाव किती आहे?"',
          hi: 'ग्राहक पूछते हैं: "भैया, इस आम का एक किलो का दाम कितना है?"'
        },
        words: [
          {
            id: 'rm-w6',
            kannada: 'ಗ್ರಾಹಕರು',
            transliteration: 'graahakaru',
            devanagari: 'ग्राहकरु',
            meanings: { en: 'customer (respectful)', mr: 'ग्राहक', hi: 'ग्राहक' },
            partOfSpeech: 'Noun + Honorific (-ಅರು)'
          },
          {
            id: 'rm-w7',
            kannada: 'ಅಣ್ಣಾ',
            transliteration: 'annaa',
            devanagari: 'अण्णा',
            meanings: { en: 'elder brother / respectful address', mr: 'भाऊ / दादा', hi: 'भैया' },
            partOfSpeech: 'Vocative Noun'
          },
          {
            id: 'rm-w8',
            kannada: 'ಮಾವಿನ ಹಣ್ಣು',
            transliteration: 'maavina hannu',
            devanagari: 'माविन हण्णु',
            meanings: { en: 'mango fruit', mr: 'आंबा', hi: 'आम का फल' },
            partOfSpeech: 'Noun Phrase'
          },
          {
            id: 'rm-w9',
            kannada: 'ಎಷ್ಟು ಬೆಲೆ?',
            transliteration: 'eshtu bele?',
            devanagari: 'ऎष्टु बॆलॆ?',
            meanings: { en: 'how much price?', mr: 'किती किंमत?', hi: 'कितना दाम?' },
            partOfSpeech: 'Question Phrase'
          }
        ]
      }
    ]
  }
];
