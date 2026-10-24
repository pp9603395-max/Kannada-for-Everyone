import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Headphones,
  Compass,
  Award,
  Users,
  HeartHandshake,
  Bot,
  Volume2,
  CheckCircle2,
  Layers,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { TileReveal } from './reactbits/TileReveal';

interface IntroductionPageProps {
  onEnterDashboard: (targetTab?: string) => void;
}

export const IntroductionPage: React.FC<IntroductionPageProps> = ({ onEnterDashboard }) => {
  return (
    <div className="bg-[#FAF7F2] text-[#242924]">
      {/* 1. Karnataka-Inspired Tile Reveal Hero Header */}
      <TileReveal
        onStartLearning={() => onEnterDashboard('studio')}
        onExploreCulture={() => onEnterDashboard('culture')}
      />

      {/* 2. Main Call To Action Banner: Enter the Interactive Dashboard */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#183B28] via-[#122D1F] to-[#183B28] rounded-3xl p-6 sm:p-10 text-white shadow-lg border border-[#235037] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ಕನ್ನಡ ಡಿಜಿಟಲ್ ನಾವೀನ್ಯತಾ ವೇದಿಕೆ ೨೦೨೬</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl text-amber-100 mb-3">
              Ready to Practice Real Kannada?
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Step into the full interactive learning suite featuring the Dual-Pane Studio, 10 situational modules with 100 scenario quizzes, 160+ vocabulary words, and native Web Speech pronunciation lab.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onEnterDashboard('studio')}
              className="cursor-pointer inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#183B28] font-bold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore the Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. What is Kannada for Everyone & Who is it for? */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-b border-[#E6E0D5]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183B28]/10 text-[#183B28] text-xs font-semibold uppercase tracking-wider mb-3">
              <span>About The Platform • ವೇದಿಕೆಯ ಪರಿಚಯ</span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#183B28] mb-4">
              What is "Kannada for Everyone"?
            </h2>
            <p className="text-sm sm:text-base text-[#4A554D] leading-relaxed mb-4">
              <strong className="text-[#183B28]">Kannada for Everyone (ಕನ್ನಡ ಎಲ್ಲರಿಗೂ)</strong> is an interactive digital bridge built for the <em>Kannada Digital Innovation Challenge</em>. Its purpose is twofold: to empower non-Kannada speakers to gain immediate, practical conversational fluency, and to allow native Kannada speakers to connect warmly with newcomers across Karnataka.
            </p>
            <p className="text-sm sm:text-base text-[#4A554D] leading-relaxed">
              Instead of rote memorization or dry grammatical charts, the platform grounds learning in everyday urban and rural life—from boarding BMTC buses at Majestic and ordering filter kaapi at a Darshini to celebrating Mysuru Dasara.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E0D5] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#183B28] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E07A5F]" />
              <span>Who Can Use This Platform?</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-[#4A554D]">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5]">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#183B28] block">Relocated Professionals & Students:</strong>
                  Software engineers, healthcare workers, and college students moving to Bengaluru, Mysuru, or Mangaluru who need conversational Kannada for daily life.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5]">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#183B28] block">Marathi & Hindi Speakers:</strong>
                  Full native localization into Marathi (मराठी) and Hindi (हिंदी) ensures seamless comparative learning with Roman transliterations.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5]">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#183B28] block">Karnataka Residents & Language Enthusiasts:</strong>
                  Kannada speakers eager to share linguistic idioms and celebrate Karnataka's UNESCO heritage.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How the Learning Process Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 border-b border-[#E6E0D5]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#E07A5F] uppercase tracking-wider block mb-1">
            Learning Methodology
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#183B28]">
            How the Learning Process Works
          </h2>
          <p className="text-sm text-[#526056] mt-2">
            A three-step experiential pedagogy designed to bridge the gap between comprehension and spontaneous speech.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E6E0D5] shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#183B28] text-amber-300 font-bold flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-serif font-bold text-lg text-[#183B28] mb-2">
              Dual-Pane Dialogue Immersion
            </h3>
            <p className="text-xs sm:text-sm text-[#526056] leading-relaxed">
              Listen to native audio dialogue turns on the left. Tap any Kannada word to instantly inspect its root word, transliteration, English/Marathi/Hindi translation, and grammar nuance on the right.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E6E0D5] shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-serif font-bold text-lg text-[#183B28] mb-2">
              Phonetic & Speech Practice
            </h3>
            <p className="text-xs sm:text-sm text-[#526056] leading-relaxed">
              Break words into syllables. Practice aloud with the browser Web Speech recognition in Kannada (`kn-IN`) and playback your recorded voice to gain pronunciation confidence.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E6E0D5] shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#E07A5F] text-white font-bold flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-serif font-bold text-lg text-[#183B28] mb-2">
              Quizzes, Badges & AI Roleplay
            </h3>
            <p className="text-xs sm:text-sm text-[#526056] leading-relaxed">
              Test your recall with 10 questions per scenario. Chat with AI personas (Auto driver, Darshini server) in English or Kannada, earn points, and unlock verified Gold Badges.
            </p>
          </div>
        </div>
      </section>

      {/* 5. The Available Learning Modules Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 border-b border-[#E6E0D5]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#183B28] uppercase tracking-wider block mb-1">
            Core Modules
          </span>
          <h2 className="font-serif font-bold text-3xl text-[#183B28]">
            Explore the Nine Interactive Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              id: 'studio',
              title: 'Dual-Pane Studio',
              icon: Headphones,
              desc: 'Split-screen workspace pairing dialogues with real-time word breakdowns, speed tuning, and audio loops.',
            },
            {
              id: 'situations',
              title: '10 Practical Situations',
              icon: BookOpen,
              desc: '10 real-life scenarios with dialogues, 15+ vocabulary words each, and 10 distinct quiz questions per scenario.',
            },
            {
              id: 'vocabulary',
              title: '160+ Vocabulary Builder',
              icon: Layers,
              desc: 'Searchable database across 15 categories with flip flashcards, audio, and spaced-repetition mastery.',
            },
            {
              id: 'pronunciation',
              title: 'Pronunciation Lab',
              icon: Volume2,
              desc: 'Phonetic syllable drills, voice recording, audio playback, and browser speech recognition comparison.',
            },
            {
              id: 'roleplay',
              title: 'Bilingual AI Roleplay',
              icon: Bot,
              desc: 'Type English to receive Kannada translations, word breakdowns, and conversational replies powered by Gemini.',
            },
            {
              id: 'culture',
              title: '30+ Culture Explorer',
              icon: Compass,
              desc: 'Searchable catalogue of UNESCO sites, palaces, cuisines, Yakshagana, festivals, and related phrases.',
            },
            {
              id: 'progress',
              title: 'Rewards & Gold Badges',
              icon: Award,
              desc: 'Verified points system, activity timeline, and automatic Bronze, Silver, Gold, and Platinum badge tiers.',
            },
            {
              id: 'saved',
              title: 'Saved Vocabulary',
              icon: CheckCircle2,
              desc: 'Bookmarked terms saved across your studio sessions for rapid spaced repetition revision.',
            },
            {
              id: 'community',
              title: 'Community Contribution',
              icon: HeartHandshake,
              desc: 'Guidelines for native speakers to contribute verified local idioms, cultural stories, and feedback.',
            },
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onEnterDashboard(mod.id === 'community' ? 'culture' : mod.id)}
                className="cursor-pointer group p-5 rounded-2xl bg-white border border-[#E6E0D5] hover:border-[#183B28]/40 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#183B28]/10 group-hover:bg-[#183B28] text-[#183B28] group-hover:text-amber-300 flex items-center justify-center mb-3 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#183B28] mb-1">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-[#526056] leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#E07A5F] group-hover:underline mt-3 inline-flex items-center gap-1">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Benefits & Community Contribution */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-7 rounded-3xl border border-[#E6E0D5] shadow-xs">
            <h3 className="font-serif font-bold text-xl text-[#183B28] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Benefits of Learning Practical Kannada</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#4A554D] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#183B28] mt-2 shrink-0" />
                <span><strong>Instant Social Connection:</strong> Warm greetings like "ನಮಸ್ಕಾರ" and "ಊಟ ಆಯ್ತಾ?" immediately create rapport with colleagues, neighbors, and locals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#183B28] mt-2 shrink-0" />
                <span><strong>Everyday Navigation & Savings:</strong> Bargain with confidence at KR Market, ask for BMTC bus routes, and ensure auto drivers use the meter.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#183B28] mt-2 shrink-0" />
                <span><strong>Cultural Appreciation:</strong> Connect with 2,000 years of classical heritage, Yakshagana folk dance-dramas, and Karnataka Rajyotsava.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-[#E6E0D5] shadow-xs">
            <h3 className="font-serif font-bold text-xl text-[#183B28] mb-3 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#E07A5F]" />
              <span>How Kannada Speakers Can Contribute</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#4A554D] leading-relaxed mb-4">
              Language preservation thrives through active sharing. Native speakers can participate by:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#4A554D] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] mt-2 shrink-0" />
                <span><strong>Encouraging Beginners:</strong> Respond patiently when learners practice spoken phrases in apartments, offices, and neighborhood shops.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] mt-2 shrink-0" />
                <span><strong>Submitting Regional Idioms:</strong> Share colloquial phrases from Uttara Karnataka, Karavali, Malenadu, and Mysuru.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] mt-2 shrink-0" />
                <span><strong>Cultural Mentorship:</strong> Introduce colleagues to local delicacies like Davanagere Benne Dosa, Dharwad Peda, and festivals.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA to Dashboard */}
        <div className="text-center mt-12">
          <button
            onClick={() => onEnterDashboard('studio')}
            className="cursor-pointer inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-[#183B28] hover:bg-[#122D1F] text-white font-bold text-base shadow-md hover:shadow-lg transition-all"
          >
            <span>Launch Kannada for Everyone Dashboard</span>
            <ArrowRight className="w-5 h-5 text-amber-300" />
          </button>
        </div>
      </section>
    </div>
  );
};
export default IntroductionPage;
