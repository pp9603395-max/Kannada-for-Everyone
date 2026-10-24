import React from 'react';
import { Sparkles, Heart, Shield, Globe } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#122D1F] text-white/90 border-t border-[#183B28] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#183B28] flex items-center justify-center font-kannada font-bold text-2xl">
                ಕ
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  Kannada for Everyone
                </h3>
                <p className="font-kannada text-xs text-amber-300 font-semibold">
                  ಕನ್ನಡ ಡಿಜಿಟಲ್ ನಾವೀನ್ಯತಾ ವೇದಿಕೆ
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-md">
              Developed for the <span className="text-amber-300 font-semibold">Kannada Digital Innovation Challenge</span>. Bridging diverse linguistic communities in Karnataka with interactive technology, cultural pride, and linguistic joy.
            </p>

            <div className="pt-2">
              <span className="font-kannada text-sm text-amber-200/90 font-bold block">
                "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ"
              </span>
              <span className="text-[11px] text-white/60">
                May glorious Kannada triumph, may glorious Kannada flourish.
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
              Learning Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('studio')}
                  className="cursor-pointer text-white/80 hover:text-white hover:underline"
                >
                  Dual-Pane Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('situations')}
                  className="cursor-pointer text-white/80 hover:text-white hover:underline"
                >
                  Everyday Situations (10)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('vocabulary')}
                  className="cursor-pointer text-white/80 hover:text-white hover:underline"
                >
                  Vocabulary Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('pronunciation')}
                  className="cursor-pointer text-white/80 hover:text-white hover:underline"
                >
                  Pronunciation Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('roleplay')}
                  className="cursor-pointer text-white/80 hover:text-white hover:underline"
                >
                  AI Conversational Partner
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('culture')}
                  className="cursor-pointer text-white/80 hover:text-white hover:underline"
                >
                  Karnataka Culture Explorer
                </button>
              </li>
            </ul>
          </div>

          {/* Technical & Accessibility */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
              Standards & Access
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>WCAG 2.1 Accessible</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span>Web Speech API (kn-IN)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Gemini API Model Integration</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Multilingual (EN / MR / HI)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© 2026 Kannada for Everyone • Kannada Digital Innovation Challenge.</p>
          <p>Designed with warmth, cultural authenticity, and educational precision.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
