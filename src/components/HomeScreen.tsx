import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrbButton } from './OrbButton';
import { SuggestionChips } from './SuggestionChips';

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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 z-40 flex flex-col items-center justify-between py-12"
          style={{
            background:
              'linear-gradient(135deg, #0f0f1e 0%, #1a2840 50%, #253f66 100%)',
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pt-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">What are you in the mood for?</h1>
            <p className="text-sm text-gray-400">Ask me anything or choose a suggestion</p>
          </motion.div>

          {/* Suggestions */}
          <SuggestionChips
            chips={suggestedChips}
            isVisible={isVisible}
            onChipClick={(_, text) => onSuggestionClick?.(text)}
          />

          {/* Floating Orb at Bottom */}
          <div className="flex flex-col items-center gap-4">
            <OrbButton
              state="idle"
              onClick={onOrbClick}
            />
          </div>

          {/* Top-right ChatGPT link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-6 right-6"
          >
            <a
              href="#"
              className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
              aria-label="Go to ChatGPT"
            >
              Click here to go to ChatGPT →
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
