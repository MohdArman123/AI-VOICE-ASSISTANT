import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrbButton } from './OrbButton';
import { Transcript } from './Transcript';
import { SuggestionChips } from './SuggestionChips';
import type { ConversationMessage } from '../types/index';

interface VoiceOverlayProps {
  isOpen: boolean;
  state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'no_voice';
  messages: ConversationMessage[];
  currentInput?: string;
  waveformData: Uint8Array;
  onOrbClick: () => void;
  onClose: () => void;
  onKeyboardToggle?: () => void;
  onSuggestionClick?: (text: string) => void;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const KeyboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
    <line x1="6" y1="9" x2="6" y2="9" />
    <line x1="10" y1="9" x2="10" y2="9" />
    <line x1="14" y1="9" x2="14" y2="9" />
    <line x1="18" y1="9" x2="18" y2="9" />
    <line x1="6" y1="13" x2="18" y2="13" />
  </svg>
);

const thinkingPhrases = [
  'Thinking this through..',
  'Scene almost set...',
  'Give me a sec...',
  'Fetching something for you...',
];

export const VoiceOverlay: React.FC<VoiceOverlayProps> = ({
  isOpen,
  state,
  messages,
  currentInput,
  waveformData: _waveformData,
  onOrbClick,
  onClose,
  onKeyboardToggle,
  onSuggestionClick,
}) => {
  const [thinkingTextIndex, setThinkingTextIndex] = React.useState(0);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (state === 'thinking') {
      interval = setInterval(() => {
        setThinkingTextIndex((prev) => (prev + 1) % thinkingPhrases.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [state]);

  const suggestedChips = [
    { id: '1', text: 'Jiohotstar new shows this week' },
    { id: '2', text: 'Tamil blockbuster in HD' },
    { id: '3', text: 'Kannada movie with subtitles' },
    { id: '4', text: 'Weekend mein kya dekhe' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-[#1a1921] z-50 flex flex-col overflow-hidden font-sans"
        >
          {/* Spotlight Effect for Thinking State */}
          <AnimatePresence>
            {state === 'thinking' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[70vh] pointer-events-none z-0"
                style={{
                  background: 'conic-gradient(from 180deg at 50% 100%, transparent 0deg, rgba(0,170,255,0.4) 30deg, rgba(0,85,255,0.6) 90deg, rgba(0,170,255,0.4) 150deg, transparent 180deg)',
                  maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Curved Bottom Glow Background */}
          <div className="absolute bottom-0 left-0 right-0 h-[45%] pointer-events-none overflow-hidden z-0">
            {/* The bright aurora glow spanning the width */}
            <div className="absolute bottom-16 left-0 right-0 h-48 bg-gradient-to-r from-[#00bfff] via-[#0055ff] to-[#a50b5e] blur-[70px] opacity-60" />
            
            {/* The dark curved base sitting at the bottom */}
            <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-[80%] rounded-[50%] bg-[#0c0a10] border-t border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]" />
          </div>

          {/* Top Link */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-12 left-0 right-0 text-center z-20"
          >
            <a
              href="#"
              className="text-[13px] font-medium text-white/90 hover:text-white transition-colors relative inline-block tracking-wide"
            >
              Click here to go to ChatGPT ↗
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[250%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </a>
          </motion.div>

          {/* Main Content Area - Idle State */}
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div
                key="idle-content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-[40%] -translate-y-1/2 left-0 w-full pl-6 z-20"
              >
                <h2 className="text-[26px] font-medium text-white mb-2 leading-tight tracking-tight">
                  What are you in the mood for?
                </h2>
                <p className="text-[15px] text-gray-400 mb-6">
                  Tap a suggestion, use your mic, or type to explore.
                </p>
                
                {/* Horizontal Suggestion Chips */}
                <div className="w-full">
                  <SuggestionChips
                    chips={suggestedChips}
                    isVisible={true}
                    onChipClick={(_, text) => onSuggestionClick?.(text)}
                  />
                </div>
              </motion.div>
            )}

            {/* no_voice State */}
            {state === 'no_voice' && (
              <motion.div
                key="no-voice-content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-[38%] -translate-y-1/2 left-0 w-full pl-6 pr-6 z-20"
              >
                <p className="text-[22px] font-medium text-white leading-snug mb-6">
                  Sorry, I couldn't detect your voice clearly.<br />
                  Please try again by tapping the mic icon or typing in your query.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onKeyboardToggle}
                  className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-[15px] font-medium backdrop-blur-sm"
                >
                  Continue to ChatGPT <span className="text-base">↗</span>
                </motion.button>
              </motion.div>
            )}

            {/* speaking/results State */}
            {state === 'speaking' && messages.length > 0 && (
              <motion.div
                key="speaking-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute top-24 left-0 right-0 bottom-36 overflow-y-auto px-5 z-20"
              >
                {/* AI Response Text */}
                <h2 className="text-[21px] font-semibold text-white leading-snug mb-5">
                  {messages[messages.length - 1]?.text}
                </h2>

                {/* Movie Cards Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { title: 'Sarabhai vs Sarabhai', bg: 'from-yellow-800 to-yellow-600' },
                    { title: 'Brooklyn Nine-Nine', bg: 'from-slate-700 to-slate-500' },
                  ].map((card) => (
                    <div key={card.title} className={`rounded-xl overflow-hidden bg-gradient-to-b ${card.bg} aspect-[3/4] flex items-end p-2`}>
                      <span className="text-white text-xs font-semibold leading-tight drop-shadow">{card.title}</span>
                    </div>
                  ))}
                </div>

                {/* Follow-up question */}
                <p className="text-[14px] text-gray-400 mb-3">
                  Do you prefer family comedy or friendship-based comedy?
                </p>

                {/* Follow-up chips */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {['Family comedy', 'Friendship comedy', 'Ask ChatGPT'].map((chip) => (
                    <motion.button
                      key={chip}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSuggestionClick?.(chip)}
                      className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${
                        chip === 'Ask ChatGPT'
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent text-white border-white/30 hover:border-white/60'
                      }`}
                    >
                      {chip}
                    </motion.button>
                  ))}
                </div>

                {/* Disclaimer */}
                <p className="text-[12px] text-gray-500 mb-4">
                  AI can be inaccurate. Please check critical information.
                </p>

                {/* Feedback */}
                <p className="text-[13px] text-gray-400 mb-2">Were the results helpful?</p>
                <div className="flex gap-4">
                  <motion.button whileTap={{ scale: 0.9 }} className="text-gray-400 hover:text-white transition-colors" aria-label="Helpful">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} className="text-gray-400 hover:text-white transition-colors" aria-label="Not helpful">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* listening / thinking states */}
            {(state === 'listening' || state === 'thinking') && (
              <motion.div
                key="active-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-20"
              >
                {(state === 'listening' || state === 'thinking') && messages.length === 0 && !currentInput ? (
                  <motion.h2
                    key={state === 'thinking' ? thinkingTextIndex : 'listening'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-2xl font-medium tracking-wide text-white/90 px-6 text-center"
                  >
                    {state === 'listening' ? 'Listening....' : thinkingPhrases[thinkingTextIndex]}
                  </motion.h2>
                ) : (
                  <Transcript
                    messages={messages}
                    isVisible={true}
                    currentInput={currentInput}
                    state={state}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Controls */}
          <div className="absolute bottom-10 left-0 right-0 z-30 flex flex-col items-center">
            {/* Dynamic Bottom Hint */}
            <div className="mb-4 text-[13px] text-gray-400 pointer-events-none">
              {state === 'idle' && <span>Tap to talk</span>}
              {state === 'no_voice' && <span>Tap to talk</span>}
              {state === 'listening' && <span>Tap anytime <span className="font-semibold text-gray-300">to stop</span></span>}
              {state === 'thinking' && <span>Working on it</span>}
              {state === 'speaking' && <span>Tap to talk</span>}
            </div>

            <div className="w-full flex items-center justify-between px-12">
              {/* Keyboard Icon */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onKeyboardToggle}
                className="p-2 text-white/60 hover:text-white focus:outline-none transition-colors"
                aria-label="Switch to keyboard input"
              >
                <KeyboardIcon />
              </motion.button>

              {/* Orb Button */}
              <OrbButton
                state={state === 'no_voice' ? 'idle' : state}
                onClick={onOrbClick}
                className="w-[72px] h-[72px]"
              />

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white focus:outline-none transition-colors"
                aria-label="Close voice assistant"
              >
                <CloseIcon />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
