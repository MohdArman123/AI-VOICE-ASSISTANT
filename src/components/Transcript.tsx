import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { ConversationMessage } from '../types/index';

interface TranscriptProps {
  messages: ConversationMessage[];
  isVisible: boolean;
  currentInput?: string;
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export const Transcript: React.FC<TranscriptProps> = ({
  messages,
  isVisible,
  currentInput,
  state,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, currentInput]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute top-24 left-0 right-0 mx-auto w-full max-w-xs px-6 max-h-64 overflow-y-auto"
      ref={scrollContainerRef}
      aria-live="polite"
      role="region"
      aria-label="Conversation transcript"
    >
      <div className="space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`${
              msg.role === 'user'
                ? 'text-right text-gray-300 text-sm'
                : 'text-left text-white text-sm font-medium'
            }`}
          >
            {msg.text}
          </motion.div>
        ))}

        {/* Current input (interim transcript) */}
        {currentInput && state === 'listening' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right text-gray-400 text-sm italic"
          >
            {currentInput}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ▋
            </motion.span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
