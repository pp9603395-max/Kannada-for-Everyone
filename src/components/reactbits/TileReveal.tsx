import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, ArrowRight, Compass, Volume2, ShieldCheck } from 'lucide-react';

interface TileItem {
  id: string;
  title: string;
  kannadaTitle: string;
  category: string;
  imageUrl: string;
  tagline: string;
}

const KARNATAKA_TILES: TileItem[] = [
  {
    id: 'mysuru-palace',
    title: 'Mysuru Palace',
    kannadaTitle: 'ಮೈಸೂರು ಅರಮನೆ',
    category: 'Heritage & Royalty',
    imageUrl: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=800&q=80',
    tagline: 'Grandeur of the Wodeyars & Dasara festivities',
  },
  {
    id: 'hampi-chariot',
    title: 'Hampi Monuments',
    kannadaTitle: 'ಹಂಪಿ ಶಿಲ್ಪಕಲೆ',
    category: 'UNESCO World Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    tagline: 'Timeless stone chariot of the Vijayanagara Empire',
  },
  {
    id: 'bengaluru-vidhana',
    title: 'Bengaluru & Vidhana Soudha',
    kannadaTitle: 'ಬೆಂಗಳೂರು & ವಿಧಾನ ಸೌಧ',
    category: 'State Capital & Tech Hub',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    tagline: 'Neo-Dravidian architecture meets India\'s Silicon Valley',
  },
  {
    id: 'western-ghats',
    title: 'Western Ghats & Coorg',
    kannadaTitle: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು & ಕೊಡಗು',
    category: 'Nature & Misty Hills',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    tagline: 'Lush biodiversity, coffee estates & cascading Jog Falls',
  },
  {
    id: 'yakshagana',
    title: 'Yakshagana Art',
    kannadaTitle: 'ಯಕ್ಷಗಾನ ಕಲೆ',
    category: 'Folk Theatre',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    tagline: 'Dramatic dance-drama of coastal Karnataka',
  },
  {
    id: 'karnataka-cuisine',
    title: 'Karavali & Mysuru Cuisine',
    kannadaTitle: 'ಕರ್ನಾಟಕದ ರುಚಿಗಳು',
    category: 'Culinary Traditions',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    tagline: 'Crisp Masala Dosa, steaming Filter Kaapi & Mysore Pak',
  },
];

interface TileRevealProps {
  onStartLearning: () => void;
  onExploreCulture: () => void;
}

export const TileReveal: React.FC<TileRevealProps> = ({
  onStartLearning,
  onExploreCulture,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
  }, []);

  // Use scroll position relative to container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const tileOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.15]);
  const tileScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.88]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[90vh] lg:min-h-[95vh] flex flex-col justify-center items-center overflow-hidden bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#E6E0D5]"
    >
      {/* Background ambient Kannada patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#183B28_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Hero Badge */}
      <div className="relative z-20 mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183B28]/10 text-[#183B28] text-xs sm:text-sm font-semibold tracking-wide border border-[#183B28]/20 shadow-xs">
        <Sparkles className="w-4 h-4 text-[#E07A5F]" />
        <span>Kannada Digital Innovation Challenge 2026</span>
        <span className="hidden sm:inline text-[#183B28]/60">•</span>
        <span className="hidden sm:inline font-normal">ಕರ್ನಾಟಕ ಡಿಜಿಟಲ್ ವೇದಿಕೆ</span>
      </div>

      {/* Main Headlines */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
        <h1 className="font-kannada font-bold text-3xl sm:text-5xl lg:text-6xl text-[#183B28] leading-tight tracking-tight mb-2 drop-shadow-xs">
          ಹೊಸ ಭಾಷೆ, ಹೊಸ ಸಂಪರ್ಕ
        </h1>
        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#2A2E2B] tracking-tight mb-4">
          One Language. A Thousand Connections.
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-[#4A554D] max-w-2xl mx-auto leading-relaxed mb-8">
          Learn practical Kannada through everyday Bangalore & Karnataka conversations, rich cultural immersion, and real-time AI assistance.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <button
            onClick={onStartLearning}
            className="cursor-pointer inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-[#183B28] hover:bg-[#122D1F] text-[#FAF7F2] font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-5 h-5 text-[#E07A5F]" />
          </button>

          <button
            onClick={onExploreCulture}
            className="cursor-pointer inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#183B28] font-semibold text-base border-2 border-[#183B28]/25 hover:border-[#183B28]/60 transition-all duration-200 shadow-xs"
          >
            <Compass className="w-5 h-5 text-[#E07A5F]" />
            <span>Explore Kannada Culture</span>
          </button>

          <button
            onClick={() => setIsRevealed(!isRevealed)}
            className="cursor-pointer text-xs sm:text-sm text-[#4A554D] hover:text-[#183B28] underline underline-offset-4 font-medium transition-colors ml-1"
          >
            {isRevealed ? 'Show Cultural Grid' : 'Reveal Story View'}
          </button>
        </div>
      </div>

      {/* Interactive Tile Reveal Grid */}
      <motion.div
        style={prefersReducedMotion ? {} : { opacity: tileOpacity, scale: tileScale }}
        className={`relative z-10 w-full max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 transition-all duration-500 ${
          isRevealed ? 'opacity-35 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {KARNATAKA_TILES.map((tile, index) => (
          <div
            key={tile.id}
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-[#E6E0D5] bg-white aspect-[3/4] flex flex-col justify-end p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image */}
            <img
              src={tile.imageUrl}
              alt={tile.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.88] group-hover:scale-105 group-hover:brightness-[0.95] transition-all duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

            {/* Tile Info */}
            <div className="relative z-10 text-white">
              <span className="inline-block px-1.5 py-0.5 mb-1 text-[10px] font-medium uppercase tracking-wider bg-[#E07A5F]/90 rounded text-white">
                {tile.category}
              </span>
              <p className="font-kannada font-bold text-sm sm:text-base text-amber-200 leading-tight">
                {tile.kannadaTitle}
              </p>
              <h3 className="font-semibold text-xs sm:text-sm text-white truncate">
                {tile.title}
              </h3>
              <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5 hidden sm:block">
                {tile.tagline}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Floating Trust Pills */}
      <div className="relative z-20 mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-[#4A554D]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#183B28]" />
          <span>Verified Conversational Grammar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-[#E07A5F]" />
          <span>Native Pronunciation & Transliteration</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#183B28]" />
          <span>English • मराठी • हिंदी Support</span>
        </div>
      </div>
    </div>
  );
};
export default TileReveal;
