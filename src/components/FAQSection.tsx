import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Do I need to know how to read the Kannada script to begin learning?',
    answer:
      'Not at all! Every single dialogue, vocabulary item, and phrase on "Kannada for Everyone" includes clear Roman Latin transliteration (e.g., Namaskāra) alongside authentic Kannada script. You can begin speaking practical everyday Kannada from day one while gradually familiarizing yourself with the alphabet.',
  },
  {
    question: 'What dialect and register of Kannada is taught here?',
    answer:
      'The platform focuses on contemporary standard conversational Kannada as spoken throughout Bengaluru, Mysuru, and central Karnataka. We teach polite, respectful registers (such as using "ನೀವು" and "ನಿಮ್ಮ") so learners can comfortably communicate with colleagues, shopkeepers, auto drivers, neighbors, and friends.',
  },
  {
    question: 'How does the Dual-Pane Studio accelerate learning?',
    answer:
      'The Dual-Pane Studio pairs realistic situational conversations on the left with instant real-time linguistic breakdowns on the right. Clicking any sentence or individual word immediately unlocks multilingual translations (English, Marathi, and Hindi), grammar notes, polite usage tips, and audio playback.',
  },
  {
    question: 'How does the speech recognition feature work?',
    answer:
      'We leverage the browser\'s native Web Speech API configured for Kannada (kn-IN). When you speak into your microphone, the audio is processed locally and matched against target pronunciation drills without sending private voice data to third-party ad networks.',
  },
  {
    question: 'Can I learn Kannada if my native language is Marathi or Hindi?',
    answer:
      'Yes! "Kannada for Everyone" includes full native localization for English, Marathi (मराठी), and Hindi (हिंदी). You can toggle between explanation languages in the navigation bar at any point with one click.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183B28]/10 text-[#183B28] text-xs font-semibold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>ಪ್ರಶ್ನೋತ್ತರ • Frequently Asked Questions</span>
        </div>
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#183B28]">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-[#526056] mt-1">
          Everything you need to know about learning Kannada on this platform.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-[#E6E0D5] overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="cursor-pointer w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#183B28] hover:text-[#122D1F]"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#E07A5F] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#88988D] shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#4A554D] leading-relaxed border-t border-[#F0ECE1] pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default FAQSection;
