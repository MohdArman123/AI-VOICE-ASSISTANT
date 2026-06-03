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
    exit: { opacity: 0, transition: { duration: 0.2 } }
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
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex flex-wrap gap-3 justify-center">
        {chips.map((chip) => (
          <motion.button
            key={chip.id}
            variants={chipVariants}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChipClick?.(chip.id, chip.text)}
            className="px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/95 text-[14px] font-medium transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          >
            {chip.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
