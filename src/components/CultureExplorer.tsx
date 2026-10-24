import React, { useState, useMemo } from 'react';
import {
  Compass,
  Volume2,
  Sparkles,
  MapPin,
  BookOpen,
  ArrowRight,
  Search,
  X,
  Award,
  Globe,
  Calendar,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  Bookmark,
  Share2,
} from 'lucide-react';
import { CulturalItem, CulturalCategory } from '../types';
import { speechService } from '../lib/speech';

interface CultureExplorerProps {
  items: CulturalItem[];
  exploredCultureIds?: string[];
  onExploreCulture?: (cultureId: string) => void;
  onPracticePhrase?: (text: string) => void;
  onNavigateToStudio?: () => void;
}

interface CategoryFilter {
  id: string;
  label: string;
  kannadaLabel: string;
  icon?: string;
}

export const CultureExplorer: React.FC<CultureExplorerProps> = ({
  items,
  exploredCultureIds = [],
  onExploreCulture,
  onPracticePhrase,
  onNavigateToStudio,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [unescoOnly, setUnescoOnly] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [activeItem, setActiveItem] = useState<CulturalItem | null>(null);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const categories: CategoryFilter[] = [
    { id: 'all', label: 'All Heritage', kannadaLabel: 'ಎಲ್ಲಾ ಸಂಸ್ಕೃತಿ' },
    { id: 'unesco', label: 'UNESCO Heritage', kannadaLabel: 'ಯುನೆಸ್ಕೋ ತಾಣಗಳು' },
    { id: 'monument', label: 'Monuments & Sites', kannadaLabel: 'ಸ್ಮಾರಕಗಳು' },
    { id: 'palace', label: 'Palaces & Forts', kannadaLabel: 'ಅರಮನೆ ಮತ್ತು ಕೋಟೆಗಳು' },
    { id: 'architecture', label: 'Architecture', kannadaLabel: 'ಶಿಲ್ಪಕಲೆ' },
    { id: 'geography', label: 'Ghats & Rivers', kannadaLabel: 'ಪ್ರಕೃತಿ ಮತ್ತು ನದಿಗಳು' },
    { id: 'cuisine', label: 'Regional Cuisines', kannadaLabel: 'ಆಹಾರ ಪರಂಪರೆ' },
    { id: 'festival', label: 'Festivals', kannadaLabel: 'ಹಬ್ಬ ಹರಿದಿನಗಳು' },
    { id: 'art', label: 'Folk Arts & Drama', kannadaLabel: 'ಜಾನಪದ ಕಲೆಗಳು' },
    { id: 'city', label: 'Major Cities', kannadaLabel: 'ನಗರಗಳು' },
    { id: 'etiquette', label: 'Etiquette & Traditions', kannadaLabel: 'ಆಚಾರ ವಿಚಾರ' },
  ];

  // Filtered and searched items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // UNESCO filter
      if (unescoOnly && !item.isUNESCO) return false;

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'unesco') {
          if (!item.isUNESCO) return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitleEn = item.titleEnglish.toLowerCase().includes(q);
        const matchesTitleKn = item.titleKannada.includes(q);
        const matchesRegion = item.region.toLowerCase().includes(q);
        const matchesDesc = item.shortDescription.toLowerCase().includes(q);
        const matchesSignificance = item.historicalSignificance.toLowerCase().includes(q);
        const matchesDeepDive = item.deepDive.toLowerCase().includes(q);
        const matchesFacts = item.interestingFacts.some((f) => f.toLowerCase().includes(q));
        const matchesVocab = item.relatedVocabulary.some(
          (v) =>
            v.kannada.includes(q) ||
            v.transliteration.toLowerCase().includes(q) ||
            v.english.toLowerCase().includes(q)
        );
        const matchesKeyPhrase =
          item.keyPhrase?.kannada.includes(q) ||
          item.keyPhrase?.transliteration.toLowerCase().includes(q) ||
          item.keyPhrase?.english.toLowerCase().includes(q);

        return (
          matchesTitleEn ||
          matchesTitleKn ||
          matchesRegion ||
          matchesDesc ||
          matchesSignificance ||
          matchesDeepDive ||
          matchesFacts ||
          matchesVocab ||
          matchesKeyPhrase
        );
      }

      return true;
    });
  }, [items, selectedCategory, searchQuery, unescoOnly]);

  // Compute category counts for badge counters
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: items.length,
      unesco: items.filter((i) => i.isUNESCO).length,
    };
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleSpeak = (text: string, speed = 0.85) => {
    setSpeakingWord(text);
    speechService.speak(text, {
      rate: speed,
      onEnd: () => setSpeakingWord(null),
      onError: () => setSpeakingWord(null),
    });
  };

  const relatedItems = useMemo(() => {
    if (!activeItem) return [];
    return items
      .filter(
        (i) =>
          i.id !== activeItem.id &&
          (i.category === activeItem.category ||
            i.region.split(',')[0].trim() === activeItem.region.split(',')[0].trim())
      )
      .slice(0, 3);
  }, [items, activeItem]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#E6E0D5] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183B28]/10 text-[#183B28] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#183B28]/20">
            <Compass className="w-4 h-4 text-[#183B28]" />
            <span>ಸಂಸ್ಕೃತಿ ದರ್ಶನ • Karnataka Culture Explorer</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#183B28]">
            Explore the Heritage of Karnataka
          </h2>
          <p className="text-sm sm:text-base text-[#526056] max-w-2xl mt-2 leading-relaxed">
            Language thrives through history, art, and geography. Explore over 30 verified UNESCO
            monuments, Chalukyan temples, Western Ghats rainforests, Yakshagana folk arts, and
            culinary traditions with native Kannada vocabulary and useful phrases.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#E6E0D5] shadow-xs shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold font-serif text-lg">
            {items.length}
          </div>
          <div>
            <div className="text-xs font-bold text-[#183B28]">Documented Entries</div>
            <div className="text-[11px] text-[#526056]">
              {categoryCounts.unesco || 4} UNESCO Properties
            </div>
          </div>
        </div>
      </div>

      {/* Search and UNESCO Quick Filter Bar */}
      <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-3xl border border-[#E6E0D5] mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7A887E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(6);
            }}
            placeholder="Search monuments, UNESCO sites, cuisines, Yakshagana, Kannada words..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-[#DDD5C7] text-sm text-[#2A2E2B] placeholder:text-[#88988D] focus:outline-none focus:ring-2 focus:ring-[#183B28]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* UNESCO Exclusive Filter Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setUnescoOnly(!unescoOnly);
              setVisibleCount(6);
            }}
            className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              unescoOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-white text-[#4A554D] border-[#DDD5C7] hover:bg-[#F2ECE1]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>UNESCO Sites Only ({categoryCounts.unesco || 4})</span>
          </button>
        </div>
      </div>

      {/* Category Pills Navigation (Horizontal scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id && !unescoOnly;
          const count = categoryCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setUnescoOnly(false);
                setVisibleCount(6);
              }}
              className={`cursor-pointer whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border shrink-0 ${
                isSelected
                  ? 'bg-[#183B28] text-white border-[#183B28] shadow-xs'
                  : 'bg-white text-[#526056] border-[#E0D7C7] hover:border-[#183B28]/40 hover:text-[#183B28]'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#EFE9DD] text-[#526056]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#526056] mb-6">
        <div>
          Showing <span className="font-bold text-[#183B28]">{displayedItems.length}</span> of{' '}
          <span className="font-bold text-[#183B28]">{filteredItems.length}</span> destinations
          {searchQuery && <span> matching "{searchQuery}"</span>}
        </div>
        {filteredItems.length !== items.length && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setUnescoOnly(false);
            }}
            className="cursor-pointer text-xs font-bold text-[#E07A5F] hover:underline"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E6E0D5] p-8">
          <Compass className="w-12 h-12 text-[#A4B1A7] mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-[#183B28] mb-1">
            No Cultural Treasures Found
          </h3>
          <p className="text-xs sm:text-sm text-[#526056] max-w-md mx-auto mb-4">
            We couldn't find matches for your search. Try adjusting keywords or explore all heritage
            categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setUnescoOnly(false);
            }}
            className="cursor-pointer px-4 py-2 rounded-xl bg-[#183B28] text-white text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item) => (
          <article
            key={item.id}
            className="group rounded-3xl bg-white border border-[#E6E0D5] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image banner with source attribution */}
              <div className="relative h-52 overflow-hidden bg-stone-200">
                <img
                  src={item.image}
                  alt={item.titleEnglish}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback image if unsplash link fails
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  {/* UNESCO Badge */}
                  {item.isUNESCO ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-[#183B28] shadow-sm border border-amber-300">
                      <Award className="w-3.5 h-3.5" />
                      <span>UNESCO Heritage ({item.unescoYear})</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/50 text-white/90 backdrop-blur-xs uppercase tracking-wider">
                      {item.categoryLabel}
                    </span>
                  )}

                  {/* Period Badge */}
                  {item.periodOrDates && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/80 text-[#183B28] backdrop-blur-xs">
                      {item.periodOrDates.split('(')[0]}
                    </span>
                  )}
                </div>

                {/* Bottom Region */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1 text-xs font-medium drop-shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="truncate max-w-[220px]">{item.region}</span>
                  </div>
                  {item.imageAttribution && (
                    <span className="text-[9px] text-white/70 italic truncate max-w-[120px]">
                      {item.imageAttribution.split('/')[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5">
                <p className="font-kannada font-bold text-lg text-[#183B28] leading-tight mb-1">
                  {item.titleKannada}
                </p>
                <h3 className="font-serif font-bold text-base text-[#2A2E2B] mb-2">
                  {item.titleEnglish}
                </h3>
                <p className="text-xs sm:text-sm text-[#526056] leading-relaxed line-clamp-3 mb-4">
                  {item.shortDescription}
                </p>

                {/* Verified Useful Kannada Phrase Box */}
                {item.keyPhrase && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5] space-y-1 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#E07A5F] uppercase tracking-wider">
                        Key Kannada Phrase:
                      </span>
                      <button
                        onClick={() => handleSpeak(item.keyPhrase.kannada)}
                        className={`cursor-pointer p-1 rounded hover:bg-white text-[#183B28] transition-colors ${
                          speakingWord === item.keyPhrase.kannada ? 'text-[#E07A5F]' : ''
                        }`}
                        title="Pronounce Phrase"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-kannada font-bold text-sm text-[#183B28]">
                      {item.keyPhrase.kannada}
                    </p>
                    <p className="font-mono text-[11px] text-[#5D6B60]">
                      {item.keyPhrase.transliteration}
                    </p>
                    <p className="text-[11px] text-[#2A2E2B] italic">
                      "{item.keyPhrase.english}"
                    </p>
                  </div>
                )}

                {/* Related Vocabulary Pills */}
                {item.relatedVocabulary && item.relatedVocabulary.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#7A887E] tracking-wider block mb-1.5">
                      Related Vocabulary:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.relatedVocabulary.map((vocab, vIdx) => (
                        <button
                          key={vIdx}
                          onClick={() => handleSpeak(vocab.kannada)}
                          className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFE9DD] hover:bg-[#E5DDCB] text-[#183B28] text-xs font-medium border border-[#E0D7C7] transition-colors"
                          title={`${vocab.english} (${vocab.transliteration}) - Click to pronounce`}
                        >
                          <span className="font-kannada font-bold">{vocab.kannada}</span>
                          <span className="text-[10px] text-[#526056] font-mono">
                            • {vocab.transliteration}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Read Deep Dive Action */}
            <div className="p-5 pt-0">
              <button
                onClick={() => {
                  setActiveItem(item);
                  onExploreCulture?.(item.id);
                }}
                className="cursor-pointer w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#183B28] hover:text-white text-[#183B28] text-xs font-semibold border border-[#DDD5C7] transition-colors flex items-center justify-center gap-2 group/btn"
              >
                <span>
                  {exploredCultureIds.includes(item.id)
                    ? 'Review Story & Sources ✓'
                    : 'Read Full Story & Sources (+5 XP)'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E07A5F] group-hover/btn:text-amber-200 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Progressive Loading Controls */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="cursor-pointer inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#183B28] hover:bg-[#122D1F] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all"
          >
            <span>Load More Cultural Wonders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-[#526056] mt-2">
            Displaying {displayedItems.length} of {filteredItems.length} entries
          </p>
        </div>
      )}

      {/* Complete Cultural Story Modal (Deep Dive) */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-[#E6E0D5] p-5 sm:p-8 shadow-2xl relative my-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="cursor-pointer absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Hero Banner */}
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden mb-6">
              <img
                src={activeItem.image}
                alt={activeItem.titleEnglish}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Inscription & Period Badge */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {activeItem.isUNESCO && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-[#183B28] shadow-md border border-amber-300">
                    <Award className="w-4 h-4" />
                    <span>UNESCO World Heritage Property ({activeItem.unescoYear})</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-[#183B28] backdrop-blur-xs">
                  {activeItem.categoryLabel}
                </span>
              </div>

              {/* Titles */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-1 text-xs text-amber-300 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeItem.region}</span>
                </div>
                <p className="font-kannada font-bold text-2xl sm:text-3xl text-amber-200">
                  {activeItem.titleKannada}
                </p>
                <h3 className="font-serif font-bold text-xl sm:text-2xl">
                  {activeItem.titleEnglish}
                </h3>
                {activeItem.periodOrDates && (
                  <div className="flex items-center gap-1.5 text-xs text-white/80 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-200" />
                    <span>Historical Period: {activeItem.periodOrDates}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Image Attribution */}
            {activeItem.imageAttribution && (
              <p className="text-[11px] text-[#7A887E] italic mb-4">
                Photo Citation: {activeItem.imageAttribution}
              </p>
            )}

            {/* Section 1: Historical Significance */}
            <div className="mb-6 bg-[#FAF8F4] p-5 rounded-2xl border border-[#E8E2D5]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#183B28] mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E07A5F]" />
                <span>Historical Significance & Cultural Importance</span>
              </h4>
              <p className="text-sm text-[#3E4A40] leading-relaxed">
                {activeItem.historicalSignificance}
              </p>
            </div>

            {/* Section 2: Deep Dive Narrative */}
            <div className="mb-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#183B28] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#183B28]" />
                <span>Architectural & Cultural Deep Dive</span>
              </h4>
              <p className="text-sm text-[#3E4A40] leading-relaxed whitespace-pre-line">
                {activeItem.deepDive}
              </p>
            </div>

            {/* Section 3: Interesting Facts */}
            {activeItem.interestingFacts && activeItem.interestingFacts.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#183B28] mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>Interesting Facts & Curiosities</span>
                </h4>
                <div className="space-y-2">
                  {activeItem.interestingFacts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-[#3E4A40] leading-relaxed">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Key Kannada Phrase & Vocabulary Practice */}
            <div className="mb-6 p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C7]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#183B28] mb-3">
                Useful Kannada Phrase & Vocabulary
              </h4>

              {/* Key Phrase */}
              {activeItem.keyPhrase && (
                <div className="p-4 rounded-xl bg-white border border-[#DDD5C7] mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#E07A5F] uppercase">
                      Recommended Phrase:
                    </span>
                    <button
                      onClick={() => handleSpeak(activeItem.keyPhrase.kannada)}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#183B28] text-white text-xs font-semibold hover:bg-[#122D1F]"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  </div>
                  <p className="font-kannada font-bold text-lg text-[#183B28] mb-1">
                    {activeItem.keyPhrase.kannada}
                  </p>
                  <p className="font-mono text-xs text-[#5D6B60] mb-1">
                    {activeItem.keyPhrase.transliteration}
                  </p>
                  <p className="text-xs text-[#2A2E2B] italic mb-1">
                    "{activeItem.keyPhrase.english}"
                  </p>
                  <span className="text-[10px] text-[#88988D] block">
                    Context: {activeItem.keyPhrase.context}
                  </span>
                </div>
              )}

              {/* Related Vocabulary Words */}
              {activeItem.relatedVocabulary && activeItem.relatedVocabulary.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-[#526056] block mb-2">
                    Related Vocabulary Terms:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeItem.relatedVocabulary.map((vocab, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white border border-[#E6E0D5] flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-kannada font-bold text-sm text-[#183B28]">
                            {vocab.kannada}
                          </p>
                          <p className="font-mono text-[11px] text-[#5D6B60]">
                            {vocab.transliteration}
                          </p>
                          <p className="text-xs text-[#2A2E2B]">{vocab.english}</p>
                        </div>
                        <button
                          onClick={() => handleSpeak(vocab.kannada)}
                          className="cursor-pointer p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EFE9DD] text-[#183B28]"
                          title="Listen"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Sources & References */}
            {activeItem.sourcesAndReferences && activeItem.sourcesAndReferences.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#526056] mb-2 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Credible Historical Sources & References</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#526056]">
                  {activeItem.sourcesAndReferences.map((ref, idx) => (
                    <li key={idx}>{ref}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Section 6: Related Heritage Suggestions */}
            {relatedItems.length > 0 && (
              <div className="mb-6 border-t border-[#E6E0D5] pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#183B28] mb-3">
                  Related Karnataka Heritage to Explore:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedItems.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => setActiveItem(rel)}
                      className="cursor-pointer p-3 rounded-xl bg-[#FAF8F4] border border-[#E8E2D5] hover:border-[#183B28] transition-all flex items-center gap-2.5"
                    >
                      <img
                        src={rel.image}
                        alt={rel.titleEnglish}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-kannada font-bold text-xs text-[#183B28] truncate">
                          {rel.titleKannada}
                        </p>
                        <p className="font-serif text-xs text-[#2A2E2B] truncate">
                          {rel.titleEnglish}
                        </p>
                        <span className="text-[10px] text-[#88988D] truncate block">
                          {rel.region.split(',')[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E6E0D5]">
              {onNavigateToStudio && (
                <button
                  onClick={() => {
                    setActiveItem(null);
                    onNavigateToStudio();
                  }}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#183B28] text-xs font-bold transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Practice in Dual-Pane Studio</span>
                </button>
              )}
              <button
                onClick={() => setActiveItem(null)}
                className="cursor-pointer ml-auto px-6 py-2.5 rounded-xl bg-[#183B28] text-white text-xs font-semibold hover:bg-[#122D1F] transition-colors"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CultureExplorer;
