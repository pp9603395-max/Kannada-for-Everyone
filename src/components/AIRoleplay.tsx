import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Volume2,
  Mic,
  Sparkles,
  RotateCcw,
  Bot,
  User,
  Info,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { RoleplayScenario, ConversationTurn, ExplanationLanguage } from '../types';
import { api } from '../lib/api';
import { speechService } from '../lib/speech';

interface AIRoleplayProps {
  scenarios: RoleplayScenario[];
  preferredLanguage: ExplanationLanguage;
  onMilestone?: (scenarioId: string, userMessageCount: number) => void;
}

export const AIRoleplay: React.FC<AIRoleplayProps> = ({
  scenarios,
  preferredLanguage,
  onMilestone,
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const scenario = scenarios[selectedScenarioIndex] || scenarios[0];

  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with scenario starter
  useEffect(() => {
    if (scenario) {
      setConversation([
        {
          role: 'assistant',
          kannada: scenario.starterKannada,
          transliteration: scenario.starterTransliteration,
          translation: scenario.starterTranslation,
        },
      ]);
    }
  }, [scenario]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userTurn: ConversationTurn = {
      role: 'user',
      kannada: text,
    };

    setConversation((prev) => [...prev, userTurn]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = conversation.map((c) => ({
        role: c.role,
        content: c.kannada,
      }));

      const response = await api.chatAI({
        scenarioContext: scenario.context + ' Role: ' + scenario.role,
        history,
        message: text,
        preferredLanguage,
      });

      const assistantTurn: ConversationTurn = {
        role: 'assistant',
        kannada: response.conversationalReply?.kannada || '',
        transliteration: response.conversationalReply?.transliteration || '',
        translation: response.conversationalReply?.english || '',
        learningData: response,
        feedback: response.feedback,
      };

      setConversation((prev) => [...prev, assistantTurn]);
      const userMessageCount = conversation.filter((c) => c.role === 'user').length + 1;
      onMilestone?.(scenario.id, userMessageCount);
    } catch (err) {
      console.error('Chat error:', err);
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          kannada: 'ತುಂಬಾ ಒಳ್ಳೆಯ ಮಾತುಕತೆ! ಧನ್ಯವಾದಗಳು.',
          transliteration: 'Tumba olleya mātukate! Dhanyavādagalu.',
          translation: 'Very nice conversation! Thank you.',
          feedback: {
            isCorrect: true,
            grammarTip: 'Keep practicing daily Kannada sentences.',
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    speechService.speak(text, { rate: 0.85 });
  };

  const handleMicToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    speechService.startListening(
      {
        onResult: (text, isFinal) => {
          setInputText(text);
          if (isFinal) {
            setIsListening(false);
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      },
      'kn-IN'
    );
  };

  const handleResetConversation = () => {
    if (scenario) {
      setConversation([
        {
          role: 'assistant',
          kannada: scenario.starterKannada,
          transliteration: scenario.starterTransliteration,
          translation: scenario.starterTranslation,
        },
      ]);
    }
  };

  if (!scenario) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183B28]/10 text-[#183B28] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಸಂಭಾಷಣೆ • Gemini AI Roleplay</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#183B28]">
            Real-Life Kannada Practice Partner
          </h2>
          <p className="text-sm text-[#526056] mt-1">
            Immerse yourself in authentic Bengaluru conversations with instant grammar feedback and transliterations.
          </p>
        </div>

        {/* Reset button */}
        <button
          onClick={handleResetConversation}
          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DDD5C7] text-xs font-semibold text-[#526056] hover:bg-[#FAF7F2] transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Scenario</span>
        </button>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {scenarios.map((sc, idx) => (
          <button
            key={sc.id}
            onClick={() => {
              setSelectedScenarioIndex(idx);
            }}
            className={`cursor-pointer text-left p-3.5 rounded-2xl border transition-all ${
              selectedScenarioIndex === idx
                ? 'bg-[#183B28] text-white border-[#183B28] shadow-sm'
                : 'bg-white text-[#2A2E2B] border-[#E6E0D5] hover:bg-[#FAF7F2]'
            }`}
          >
            <span className="font-kannada font-bold text-sm block leading-tight mb-0.5">
              {sc.titleKannada}
            </span>
            <span className="font-semibold text-xs opacity-90 block">
              {sc.title}
            </span>
            <span className="text-[11px] opacity-75 mt-1 block truncate">
              Role: {sc.role}
            </span>
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="rounded-3xl bg-white border border-[#E6E0D5] shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Scenario Header Bar */}
        <div className="bg-[#FAF8F4] px-5 py-3 border-b border-[#E8E2D5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#183B28] text-amber-200 flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <div>
              <p className="text-xs font-bold text-[#183B28] leading-tight">
                {scenario.role}
              </p>
              <p className="text-[11px] text-[#526056]">
                You are playing: {scenario.userRole}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#183B28]/10 text-[#183B28]">
            Level: {scenario.difficulty}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {conversation.map((turn, i) => {
            const isUser = turn.role === 'user';
            return (
              <div
                key={i}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 transition-all ${
                    isUser
                      ? 'bg-[#183B28] text-white rounded-br-xs'
                      : 'bg-[#FAF8F4] border border-[#E8E2D5] text-[#2A2E2B] rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="font-kannada font-bold text-base sm:text-lg leading-relaxed">
                      {turn.kannada}
                    </p>
                    <button
                      onClick={() => handleSpeak(turn.kannada)}
                      className={`cursor-pointer p-1 rounded-md shrink-0 transition-colors ${
                        isUser
                          ? 'text-white/80 hover:text-white'
                          : 'text-[#526056] hover:text-[#183B28]'
                      }`}
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {turn.transliteration && (
                    <p className={`font-mono text-xs ${isUser ? 'text-white/80' : 'text-[#5D6B60]'} mb-1`}>
                      {turn.transliteration}
                    </p>
                  )}

                  {turn.translation && (
                    <p className={`text-xs ${isUser ? 'text-white/90' : 'text-[#2A2E2B] font-medium'}`}>
                      "{turn.translation}"
                    </p>
                  )}
                </div>

                {/* AI Pedagogical Feedback Box */}
                {!isUser && turn.feedback && (
                  <div className="max-w-[85%] sm:max-w-[75%] mt-2 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
                    {turn.feedback.grammarTip && (
                      <p className="flex items-start gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>{turn.feedback.grammarTip}</span>
                      </p>
                    )}
                    {turn.feedback.correction && (
                      <p className="text-amber-800 font-semibold pl-5">
                        Tip: {turn.feedback.correction}
                      </p>
                    )}
                    {turn.feedback.newWords && turn.feedback.newWords.length > 0 && (
                      <div className="pt-1 border-t border-amber-200/60 pl-5 flex flex-wrap gap-2 text-[11px]">
                        <span className="font-bold text-amber-900">New Words:</span>
                        {turn.feedback.newWords.map((nw, idx) => (
                          <span key={idx} className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-semibold">
                            {nw.word} = {nw.meaning}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#88988D] italic">
              <Bot className="w-4 h-4 animate-spin text-[#183B28]" />
              <span>{scenario.role} is replying in Kannada...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Quick Replies */}
        {scenario.suggestedResponses && (
          <div className="px-4 py-2 bg-[#FAF8F4] border-t border-[#E8E2D5] flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[#707F74] shrink-0 font-semibold">Suggested:</span>
            {scenario.suggestedResponses.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug.split('(')[0].trim())}
                className="cursor-pointer whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-amber-50 border border-[#DDD5C7] text-[#183B28] font-medium transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E6E0D5] flex items-center gap-2">
          <button
            onClick={handleMicToggle}
            className={`cursor-pointer p-2.5 rounded-xl border transition-colors ${
              isListening
                ? 'bg-red-500 text-white border-red-600 animate-pulse'
                : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#183B28] border-[#DDD5C7]'
            }`}
            title="Speech input"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Type your response in Kannada or English transliteration..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8F4] border border-[#DDD5C7] text-sm text-[#2A2E2B] focus:outline-none focus:ring-2 focus:ring-[#183B28]/20 focus:border-[#183B28]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="cursor-pointer p-2.5 rounded-xl bg-[#183B28] hover:bg-[#122D1F] disabled:opacity-40 text-white transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default AIRoleplay;
