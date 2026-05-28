import React from 'react';
import { motion } from 'framer-motion';

interface SuggestionChip {
  id: string;
  text: string;
}

interface SuggestionChipsProps {
  chips: SuggestionChip[];
  onChipClick?: (chipId: string, text: string) => void;
  isVisible: boolean;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  chips,
  onChipClick,
  isVisible,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const chipVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="w-full px-6 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <p className="text-gray-400 text-sm mb-4 text-center">Tap a suggestion or speak:</p>
      <div className="grid grid-cols-2 gap-3 justify-items-center">
        {chips.map((chip) => (
          <motion.button
            key={chip.id}
            variants={chipVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChipClick?.(chip.id, chip.text)}
            className="px-4 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          >
            {chip.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
