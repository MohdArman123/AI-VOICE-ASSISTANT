import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrbButton } from './OrbButton';

interface HomeScreenProps {
  isVisible: boolean;
  onOrbClick: () => void;
  onSuggestionClick?: (text: string) => void;
  waveformData: Uint8Array;
}

const suggestedChips = [
  { id: '1', text: 'Hindi romantic movies' },
  { id: '2', text: 'Comedy shows' },
  { id: '3', text: 'Latest web series' },
  { id: '4', text: 'Action thrillers' },
  { id: '5', text: 'Award winning films' },
  { id: '6', text: 'South Indian blockbusters' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  isVisible,
  onOrbClick,
  onSuggestionClick,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-40 flex flex-col overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0d0620 0%, #120b2e 25%, #0a0e2a 55%, #050a1a 100%)',
          }}
        >
          {/* Always-visible background aurora glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute" style={{ top: '-10%', left: '-15%', width: '70%', height: '70%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.4) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div className="absolute" style={{ top: '-5%', left: '30%', width: '50%', height: '55%', background: 'radial-gradient(ellipse, rgba(56,189,248,0.22) 0%, transparent 70%)', filter: 'blur(50px)' }} />
            <div className="absolute" style={{ bottom: '10%', right: '-10%', width: '60%', height: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, transparent 70%)', filter: 'blur(45px)' }} />
            <div className="absolute" style={{ bottom: '0%', left: '15%', width: '70%', height: '40%', background: 'radial-gradient(ellipse, rgba(168,85,247,0.28) 0%, transparent 70%)', filter: 'blur(55px)' }} />
          </div>

          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 flex items-center justify-between px-5 pt-6 pb-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              </div>
              <span className="text-[13px] font-semibold text-white/70 tracking-widest uppercase">AI Assistant</span>
            </div>
            <a
              href="#"
              className="text-[12px] font-medium text-white/40 hover:text-white/70 transition-colors tracking-wide"
            >
              ChatGPT ↗
            </a>
          </motion.div>

          {/* Center content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-36">
            {/* Ambient glow behind headline */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: '400px', height: '220px',
                background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.12) 0%, rgba(139,92,246,0.1) 50%, transparent 80%)',
                filter: 'blur(30px)',
                transform: 'translateY(-10px)',
              }}
            />

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, type: 'spring' }}
              className="mb-5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span className="text-[11px] font-semibold text-white/55 tracking-widest uppercase">Tap to begin</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.55 }}
              className="text-[36px] font-bold text-center leading-tight tracking-tight mb-3"
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
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-[15px] text-white/35 font-medium tracking-wide text-center mb-10"
            >
              Ask me anything or choose a suggestion
            </motion.p>

            {/* Suggestion chips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-wrap gap-3 justify-center max-w-sm"
            >
              {suggestedChips.map((chip, i) => (
                <motion.button
                  key={chip.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.06, duration: 0.4 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.12)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSuggestionClick?.(chip.text)}
                  className="px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 text-[13px] font-medium transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                >
                  {chip.text}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Bottom orb section */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-10">
            {/* Frosted platform arc */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: '150%',
                height: '220px',
                background: 'radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.08) 40%, transparent 75%)',
                filter: 'blur(20px)',
              }}
            />
            <p className="text-[13px] text-white/35 font-medium tracking-wide mb-4 relative z-10">
              Tap to talk
            </p>
            <OrbButton
              state="idle"
              onClick={onOrbClick}
              className="w-[80px] h-[80px] relative z-10"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
