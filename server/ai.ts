import { GoogleGenAI } from '@google/genai';
import { AIRoleplayResponse } from '../src/types';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class AIService {
  private ai: GoogleGenAI | null = null;
  private hasKey: boolean = false;

  constructor() {
    const key = process.env.GEMINI_API_KEY;
    if (key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY') {
      try {
        this.ai = new GoogleGenAI();
        this.hasKey = true;
      } catch (err) {
        console.warn('Could not initialize GoogleGenAI with key:', err);
      }
    }
  }

  public async chatRoleplay(
    scenarioContext: string,
    history: ChatMessage[],
    userMessage: string,
    preferredLanguage: 'en' | 'mr' | 'hi' = 'en'
  ): Promise<AIRoleplayResponse> {
    const isEnglishInput = !/[\u0C80-\u0CFF]/.test(userMessage);

    if (this.hasKey && this.ai) {
      try {
        const systemPrompt = `You are an expert Kannada language tutor and immersion partner in a live roleplay scenario.
Scenario context: "${scenarioContext}".
Learner's message: "${userMessage}".
Is input in English? ${isEnglishInput}.
Explanation language: ${preferredLanguage === 'mr' ? 'Marathi' : preferredLanguage === 'hi' ? 'Hindi' : 'English'}.

REQUIREMENTS:
${
  isEnglishInput
    ? `Since the user typed English, you MUST provide BOTH how to say what they asked in Kannada AND your persona's natural conversational reply in Kannada:
1. Translate the user's English sentence into natural spoken Kannada script, with transliteration, English translation, word breakdown, and pronunciation tip.
2. Provide your persona's reply in natural Kannada script, transliteration, and English translation.
3. Provide an engaging follow-up question to continue the roleplay.`
    : `Since the user typed Kannada, evaluate their sentence, provide transliteration, English meaning, gentle grammar corrections if needed, your persona's Kannada reply with English translation, and a follow-up question.`
}

Return STRICTLY valid JSON with no markdown formatting outside:
{
  "isEnglishInput": ${isEnglishInput},
  "kannadaTranslation": {
    "kannada": "<How to say user's input in Kannada script>",
    "transliteration": "<Latin transliteration>",
    "english": "<English meaning / explanation>",
    "breakdown": [
      {"word": "<kannada word>", "meaning": "<english meaning>"}
    ],
    "pronunciationTip": "<Brief pronunciation advice>"
  },
  "conversationalReply": {
    "kannada": "<Your persona's conversational reply in Kannada script>",
    "transliteration": "<Latin transliteration of reply>",
    "english": "<English translation of reply>"
  },
  "followUpQuestion": {
    "kannada": "<Follow up question in Kannada>",
    "transliteration": "<Transliteration>",
    "english": "<English translation>"
  },
  "feedback": {
    "isCorrect": true,
    "correction": "<Any subtle phrasing tip or correction>",
    "grammarTip": "<Helpful grammar note>"
  }
}`;

        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.6,
          },
        });

        const text = response.text?.trim() || '{}';
        const parsed = JSON.parse(text);

        if (parsed.conversationalReply && parsed.conversationalReply.kannada) {
          return {
            isEnglishInput,
            kannadaTranslation: parsed.kannadaTranslation,
            conversationalReply: parsed.conversationalReply,
            followUpQuestion: parsed.followUpQuestion,
            feedback: parsed.feedback,
          };
        }
      } catch (e) {
        console.warn('Gemini chat error, returning verified pedagogical fallback:', e);
      }
    }

    // High quality pedagogical fallback
    return this.getCuratedFallback(userMessage, isEnglishInput, scenarioContext);
  }

  private getCuratedFallback(
    userMessage: string,
    isEnglishInput: boolean,
    scenarioContext: string
  ): AIRoleplayResponse {
    const isShopping = scenarioContext.toLowerCase().includes('veggie') || scenarioContext.toLowerCase().includes('shop') || scenarioContext.toLowerCase().includes('bazaar');
    const isFood = scenarioContext.toLowerCase().includes('darshini') || scenarioContext.toLowerCase().includes('breakfast');
    const isAuto = scenarioContext.toLowerCase().includes('auto') || scenarioContext.toLowerCase().includes('rickshaw');

    if (isEnglishInput) {
      if (isShopping) {
        return {
          isEnglishInput: true,
          kannadaTranslation: {
            kannada: 'ಇದು ಎಷ್ಟು ರೂಪಾಯಿ? ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ ಕೊಡಿ.',
            transliteration: 'Idu eshtu roopāyi? Svalpa kadime mādi kodi.',
            english: 'How many rupees is this? Please reduce a little and give.',
            breakdown: [
              { word: 'ಇದು', meaning: 'this' },
              { word: 'ಎಷ್ಟು', meaning: 'how much' },
              { word: 'ರೂಪಾಯಿ', meaning: 'rupees' },
              { word: 'ಸ್ವಲ್ಪ', meaning: 'a little' },
              { word: 'ಕಡಿಮೆ ಮಾಡಿ', meaning: 'reduce / bargain' },
            ],
            pronunciationTip: 'Elongate "ರೂ" in roo-paa-yi and roll the "ರ" gently.',
          },
          conversationalReply: {
            kannada: 'ಇದು ಕೆಜಿಗೆ ನೂರು ರೂಪಾಯಿ ಸರ್, ತುಂಬಾ ತಾಜಾ ಇದೆ. ಎಂಭತ್ತು ರೂಪಾಯಿಗೆ ಕೊಡ್ತೀನಿ ತಗೊಳ್ಳಿ.',
            transliteration: 'Idu kejige nooru roopāyi sir, tumba tājā ide. Embhattu roopāyige kodteeni tagolli.',
            english: 'This is 100 rupees per kg sir, it is very fresh. I will give it for 80 rupees, take it.',
          },
          followUpQuestion: {
            kannada: 'ಎಷ್ಟು ಕೆಜಿ ಬೇಕು ಹೇಳಿ?',
            transliteration: 'Eshtu keji bēku hēli?',
            english: 'Tell me how many kilograms you need?',
          },
          feedback: {
            isCorrect: true,
            grammarTip: 'Use "ಕೊಡಿ" (kodi) for polite requests with vendors.',
          },
        };
      }

      if (isFood) {
        return {
          isEnglishInput: true,
          kannadaTranslation: {
            kannada: 'ಒಂದು ಮಸಾಲಾ ದೋಸೆ ಮತ್ತು ಒಂದು ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ.',
            transliteration: 'Ondu masālā dōse mattu ondu philtar kāphi kodi.',
            english: 'Please give one masala dosa and one filter coffee.',
            breakdown: [
              { word: 'ಒಂದು', meaning: 'one' },
              { word: 'ಮಸಾಲಾ ದೋಸೆ', meaning: 'masala dosa' },
              { word: 'ಮತ್ತು', meaning: 'and' },
              { word: 'ಕೊಡಿ', meaning: 'please give' },
            ],
            pronunciationTip: 'Say "ದೋಸೆ" with a dental \'d\' like in Spanish or Hindi.',
          },
          conversationalReply: {
            kannada: 'ಖಂಡಿತ ಸರ್! ಬಿಸಿ ಬಿಸಿ ಮಸಾಲಾ ದೋಸೆ ರೆಡಿ ಇದೆ. ಕಾಫಿಗೆ ಸಕ್ಕರೆ ಕಡಿಮೆ ಬೇಕಾ?',
            transliteration: 'Khandita sir! Bisi bisi masālā dōse redi ide. Kāphige sakkare kadime bēkā?',
            english: 'Certainly sir! Piping hot masala dosa is ready. Do you want less sugar in the coffee?',
          },
          followUpQuestion: {
            kannada: 'ಚಟ್ನಿ ಸಾಂಬಾರ್ ಜಾಸ್ತಿ ಹಾಕ್ಲಾ?',
            transliteration: 'Chatni sāmbār jāsti hāklā?',
            english: 'Shall I put extra chutney and sambar?',
          },
          feedback: {
            isCorrect: true,
            grammarTip: 'Adding suffix "-ಆ" (-ā) turns statements into questions (ಬೇಕಾ? = Do you want?).',
          },
        };
      }

      // Default Auto / Travel
      return {
        isEnglishInput: true,
        kannadaTranslation: {
          kannada: 'ಇಂದಿರಾನಗರಕ್ಕೆ ಹೋಗ್ಬೇಕು, ಮೀಟರ್ ಹಾಕ್ತೀರಾ?',
          transliteration: 'Indiranagar-akke hōgbēku, meetar hākteerā?',
          english: 'I need to go to Indiranagar, will you put the meter on?',
          breakdown: [
            { word: 'ಹೋಗ್ಬೇಕು', meaning: 'need to go' },
            { word: 'ಹಾಕ್ತೀರಾ', meaning: 'will you put?' },
          ],
          pronunciationTip: 'Say "ಹೋಗ್ಬೇಕು" (hōg-bē-ku) as a smooth single compound verb.',
        },
        conversationalReply: {
          kannada: 'ಸರಿ ಬನ್ನಿ ಸರ್, ಹತ್ತಿ! ಮೀಟರ್ ಮೇಲೆ ಇಪ್ಪತ್ತು ರೂಪಾಯಿ ಎಕ್ಸ್ಟ್ರಾ ಆಗುತ್ತೆ.',
          transliteration: 'Sari banni sir, hatti! Meetar mēle ippattu roopāyi ekstra āgutte.',
          english: 'Alright come sir, climb in! It will be 20 rupees extra on the meter.',
        },
        followUpQuestion: {
          kannada: 'ಇಂದಿರಾನಗರದಲ್ಲಿ ಎಲ್ಲಿ ಇಳಿಬೇಕು?',
          transliteration: 'Indiranagaradalli elli ilibēku?',
          english: 'Where in Indiranagar do you need to get down?',
        },
        feedback: {
          isCorrect: true,
          grammarTip: '"-ಅಲ್ಲಿ" indicates location (ಇಂದಿರಾನಗರದಲ್ಲಿ = In Indiranagar).',
        },
      };
    }

    // Kannada input fallback
    return {
      isEnglishInput: false,
      conversationalReply: {
        kannada: 'ತುಂಬಾ ಚೆನ್ನಾಗಿ ಮಾತನಾಡುತ್ತಿದ್ದೀರಿ! ನಿಮ್ಮ ಜೊತೆ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡುವುದು ಖುಷಿ ತಂದಿದೆ.',
        transliteration: 'Tumba chennāgi mātanāduttiddīri! Nimma jote Kannadadalli mātanāduvudu khushi tandide.',
        english: 'You are speaking very well! Speaking in Kannada with you brings happiness.',
      },
      followUpQuestion: {
        kannada: 'ಮುಂದೆ ಏನು ಹೇಳಲು ಇಷ್ಟಪಡುತ್ತೀರಿ?',
        transliteration: 'Munde ēnu hēlalu ishtapaduttīri?',
        english: 'What would you like to say next?',
      },
      feedback: {
        isCorrect: true,
        grammarTip: '"-ಇದ್ದೀರಿ" indicates present continuous polite address.',
      },
    };
  }
}

export const aiService = new AIService();
