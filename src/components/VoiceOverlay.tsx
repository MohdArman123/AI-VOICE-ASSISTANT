import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrbButton } from './OrbButton';
import { Transcript } from './Transcript';
import { SuggestionChips } from './SuggestionChips';
import { AmbientWave } from './AmbientWave';
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
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0d0620 0%, #120b2e 25%, #0a0e2a 55%, #050a1a 100%)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {/* Dynamic Ambient Wave — always on so idle aurora animates too */}
          <AmbientWave
            data={_waveformData}
            isActive={true}
            state={state}
          />

          {/* Subtle bottom fade-out so content doesn't clash with orb */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
            style={{ height: '200px', background: 'linear-gradient(to top, rgba(13,6,32,0.95) 0%, transparent 100%)' }}
          />

          {/* Premium Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 right-0 z-20 px-5 pt-safe"
            style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)' }}
          >
            <div className="flex items-center justify-between pt-4">
              {/* Logo / brand mark */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                </div>
                <span className="text-[13px] font-semibold text-white/80 tracking-widest uppercase">AI Assistant</span>
              </div>
              {/* ChatGPT link */}
              <a
                href="#"
                className="flex items-center gap-1.5 text-[12px] font-medium text-white/50 hover:text-white/80 transition-colors tracking-wide"
              >
                ChatGPT <span className="text-[10px]">↗</span>
              </a>
            </div>
          </motion.div>

          {/* Main Content Area - Idle State */}
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div
                key="idle-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 pb-40"
              >
                {/* Ambient glow behind text */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    width: '360px',
                    height: '200px',
                    background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.12) 0%, rgba(99,102,241,0.08) 50%, transparent 80%)',
                    filter: 'blur(24px)',
                    transform: 'translateY(-20px)',
                  }}
                />

                {/* AI icon badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, type: 'spring' }}
                  className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  <span className="text-[12px] font-semibold text-white/60 tracking-widest uppercase">Ready to listen</span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="text-[32px] font-bold text-center leading-tight tracking-tight mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.85) 50%, rgba(148,163,220,0.7) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  What are you in the{' '}
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >mood for?</span>
                </motion.h2>

                {/* Sub-headline */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="text-[15px] text-white/40 font-medium tracking-wide text-center mb-10"
                >
                  Tap the mic or choose a suggestion below
                </motion.p>

                {/* Suggestion Chips — centered wrap */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="w-full flex justify-center"
                >
                  <SuggestionChips
                    chips={suggestedChips}
                    isVisible={true}
                    onChipClick={(_, text) => onSuggestionClick?.(text)}
                  />
                </motion.div>
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
                <p className="text-[22px] font-semibold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/60 leading-snug tracking-tight mb-6">
                  Sorry, I couldn't detect your voice clearly.<br />
                  <span className="text-[16px] text-gray-400 font-medium tracking-normal mt-2 block">Please try again by tapping the mic icon or typing in your query.</span>
                </p>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onKeyboardToggle}
                  className="flex items-center gap-2 px-6 py-3.5 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.2)] rounded-2xl text-white/95 text-[15px] font-semibold transition-colors"
                >
                  Continue to ChatGPT <span className="text-base ml-1">↗</span>
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

                {/* Movie Cards Horizontal Carousel */}
                <div className="flex gap-4 mb-6 overflow-x-auto pb-4 pt-2 -mx-5 px-5 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {[
                    { title: 'Sarabhai vs Sarabhai', bg: 'from-yellow-800 to-yellow-600' },
                    { title: 'Brooklyn Nine-Nine', bg: 'from-slate-700 to-slate-500' },
                    { title: 'Panchayat', bg: 'from-green-800 to-emerald-600' },
                  ].map((card) => (
                    <div 
                      key={card.title} 
                      className={`min-w-[140px] w-[140px] rounded-xl overflow-hidden bg-gradient-to-b ${card.bg} aspect-[3/4] flex items-end p-2 snap-start shadow-lg shadow-black/20 shrink-0`}
                    >
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
                state={(state === 'no_voice' || state === 'speaking') ? 'idle' : state}
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
