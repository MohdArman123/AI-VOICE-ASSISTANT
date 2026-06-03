import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrbButtonProps {
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

// Premium microphone icon - thin outline style
const MicrophoneIcon = () => (
  <motion.svg
    initial={{ y: 5 }}
    animate={{ y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
  </motion.svg>
);

// AI/Swirl icon - User provided Icons8 ChatGPT style (Animated to slowly rotate)
const AISwirlIcon = () => (
  <motion.svg
    animate={{ rotate: 360 }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    width="40" height="40" viewBox="0 0 50 50" fill="white" xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M 23.828125 5.3066406 C 20.368125 5.3066406 17.308969 7.0101875 15.417969 9.6171875 L 15.417969 25.722656 L 19.431641 27.980469 L 19.298828 16.128906 C 19.294828 15.770906 19.484922 15.437859 19.794922 15.255859 L 30.957031 8.71875 C 29.211031 6.58075 26.616125 5.3066406 23.828125 5.3066406 z M 35.082031 8.6191406 L 21.306641 16.685547 L 21.357422 21.298828 L 31.554688 15.257812 C 31.862687 15.075812 32.242687 15.070141 32.554688 15.244141 L 43.828125 21.585938 C 44.776125 19.021937 44.567406 16.150578 43.191406 13.767578 C 41.800406 11.359578 39.555141 9.6360156 36.869141 8.9160156 C 36.277141 8.7570156 35.680031 8.6711406 35.082031 8.6191406 z M 13.416016 13.345703 C 10.629016 13.772703 8.2333594 15.394703 6.8183594 17.845703 C 5.4273594 20.253703 5.0573437 23.058141 5.7773438 25.744141 C 5.9493437 26.387141 6.200375 26.992125 6.484375 27.578125 L 20.285156 35.339844 L 24.255859 32.988281 L 13.925781 27.177734 C 13.611781 27.000734 13.416016 26.667641 13.416016 26.306641 L 13.416016 13.345703 z M 32.076172 17.273438 L 28.105469 19.625 L 38.435547 25.435547 C 38.749547 25.613547 38.945312 25.945641 38.945312 26.306641 L 38.945312 39.251953 C 41.703313 38.827953 44.133922 37.211531 45.544922 34.769531 C 46.935922 32.361531 47.305937 29.555141 46.585938 26.869141 C 46.412937 26.226141 46.161953 25.619203 45.876953 25.033203 L 32.076172 17.273438 z M 26.117188 20.802734 L 21.382812 23.607422 L 21.445312 29.111328 L 26.242188 31.810547 L 30.978516 29.005859 L 30.917969 23.501953 L 26.117188 20.802734 z M 32.931641 24.634766 L 33.064453 36.484375 C 33.068453 36.840375 32.880219 37.173469 32.574219 37.355469 L 21.460938 43.957031 C 23.204937 46.058031 25.762203 47.308594 28.533203 47.308594 C 31.993203 47.308594 35.054313 45.604047 36.945312 42.998047 L 36.945312 26.892578 L 32.931641 24.634766 z M 8.5371094 31.029297 C 7.5881094 33.593297 7.791875 36.454703 9.171875 38.845703 C 10.562875 41.253703 12.806188 42.975313 15.492188 43.695312 C 16.144188 43.870312 16.803891 43.958859 17.462891 44.005859 L 31.056641 35.929688 L 31.005859 31.314453 L 20.808594 37.355469 C 20.651594 37.448469 20.475828 37.496094 20.298828 37.496094 C 20.129828 37.496094 19.960594 37.452188 19.808594 37.367188 L 8.5371094 31.029297 z" />
  </motion.svg>
);

// Microphone with sparkle icon - Sparkle is animated to pulse
const MicrophoneSparkleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Microphone */}
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    {/* Sparkle */}
    <motion.path
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      d="M17 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="white" stroke="none"
      style={{ transformOrigin: "18px 5px" }}
    />
  </svg>
);

// Three vertical bars animation for listening state
const ListeningIcon = () => (
  <div className="flex items-center justify-center gap-1.5 h-10">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-1.5 bg-white rounded-full"
        initial={{ height: 8 }}
        animate={{ height: [8, 24, 8] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);

// Glowing spinning ring for thinking state
const ThinkingIcon = () => (
  <motion.div
    className="w-10 h-10 rounded-full border-4 border-transparent"
    style={{
      borderTopColor: '#00bfff',
      borderRightColor: '#a50b5e',
      borderBottomColor: '#0055ff',
    }}
    animate={{ rotate: 360 }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

export const OrbButton: React.FC<OrbButtonProps> = ({ state, onClick, disabled, className }) => {
  // State to handle the cycling animation in idle mode
  const [idleIconState, setIdleIconState] = useState<'mic' | 'ai' | 'sparkle'>('mic');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (state === 'idle') {
      interval = setInterval(() => {
        setIdleIconState((prev) => {
          if (prev === 'mic') return 'ai';
          if (prev === 'ai') return 'sparkle';
          return 'mic';
        });
      }, 3000); // Cycle every 3 seconds to let animations play
    }

    return () => clearInterval(interval);
  }, [state]);

  const getIcon = () => {
    // If we are actively interacting, show specific icons
    if (state === 'listening') return <ListeningIcon />;
    if (state === 'thinking') return <ThinkingIcon />;
    if (state === 'speaking') return <AISwirlIcon />;

    // In idle state, cycle through the icons automatically
    switch (idleIconState) {
      case 'ai':
        return <AISwirlIcon />;
      case 'sparkle':
        return <MicrophoneSparkleIcon />;
      case 'mic':
      default:
        return <MicrophoneIcon />;
    }
  };

  const getAnimation = () => {
    switch (state) {
      case 'idle':
        return {
          scale: [1, 1.03, 1],
          transition: { duration: 3, repeat: Infinity, repeatType: 'loop' as const },
        };
      case 'listening':
        return {
          scale: [1, 1.08, 1],
          transition: { duration: 1.2, repeat: Infinity, repeatType: 'loop' as const },
        };
      case 'thinking':
        return {
          scale: [1, 1.02, 1],
          transition: { duration: 2, repeat: Infinity, repeatType: 'loop' as const },
        };
      case 'speaking':
        return {
          scale: [1, 1.05, 1],
          transition: { duration: 1.5, repeat: Infinity, repeatType: 'loop' as const },
        };
      default:
        return {};
    }
  };

  const getGlowColor = () => {
    switch (state) {
      case 'idle':
        return 'rgba(0, 85, 255, 0.3)';
      case 'listening':
        return 'rgba(255, 0, 102, 0.6)';
      case 'thinking':
        return 'rgba(150, 100, 255, 0.5)';
      case 'speaking':
        return 'rgba(0, 85, 255, 0.6)';
      default:
        return 'rgba(0, 85, 255, 0.3)';
    }
  };

  const getBorderGlow = () => {
    switch (state) {
      case 'idle':
        return '0 0 25px rgba(0, 85, 255, 0.4), 0 0 50px rgba(255, 0, 102, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)';
      case 'listening':
        return '0 0 35px rgba(255, 0, 102, 0.7), 0 0 70px rgba(150, 100, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.15)';
      case 'thinking':
        return '0 0 35px rgba(150, 100, 255, 0.6), 0 0 70px rgba(0, 85, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.15)';
      case 'speaking':
        return '0 0 35px rgba(0, 85, 255, 0.7), 0 0 70px rgba(150, 100, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.15)';
      default:
        return '0 0 25px rgba(0, 85, 255, 0.4), 0 0 50px rgba(255, 0, 102, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)';
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      animate={getAnimation()}
      className={`group relative rounded-full text-white flex items-center justify-center focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed z-40 backdrop-blur-sm overflow-hidden ${className || 'w-28 h-28'}`}
      style={{
        boxShadow: getBorderGlow(),
        border: '2px solid rgba(100, 140, 255, 0.35)',
      }}
      aria-label="Voice assistant button"
      aria-pressed={state !== 'idle'}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Outer Gradient Background - Pulses on icon change */}
      <motion.div
        key={`bg-${state === 'idle' ? idleIconState : state}`}
        className="absolute inset-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] rounded-full"
        style={{
          background:
            state === 'listening'
              ? 'radial-gradient(circle at 40% 35%, #00e5ff 0%, #0055ff 45%, #6600ff 100%)'
              : state === 'thinking'
              ? 'radial-gradient(circle at 40% 35%, #c084fc 0%, #7c3aed 45%, #4f46e5 100%)'
              : state === 'speaking'
              ? 'radial-gradient(circle at 40% 35%, #38bdf8 0%, #4f46e5 45%, #7c3aed 100%)'
              : 'radial-gradient(circle at 40% 35%, #818cf8 0%, #6d28d9 40%, #4c1d95 75%, #2e1065 100%)',
        }}
        initial={{ scale: 1.08, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
      />

      {/* Premium background glow layer - only on hover/active, not idle */}
      <motion.div
        className="absolute inset-0 rounded-full z-0"
        style={{
          background: `radial-gradient(circle, ${getGlowColor()}, transparent)`,
        }}
        animate={{
          opacity: state === 'idle' ? 0 : 0.25,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Icon with smooth transition */}
      <AnimatePresence mode="wait">
        <motion.div
          className="relative z-10 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.3, rotate: 90 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          key={state === 'idle' ? idleIconState : state}
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>

      {/* Subtle pulsing outer ring on active states */}
      {state !== 'idle' && (
        <motion.div
          className="absolute inset-0 rounded-full border border-white/30"
          animate={{
            scale: [1, 1.15],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}
    </motion.button>
  );
};

