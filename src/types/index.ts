// State machine types
export type ConversationState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

// Audio context
export interface AudioContextType {
  isInitialized: boolean;
  analyser: AnalyserNode | null;
  mediaStream: MediaStream | null;
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
}

// Conversation data
export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

// WebSocket events
export interface WebSocketMessage {
  type: 'start' | 'audio' | 'end' | 'transcript' | 'error' | 'response_audio';
  data?: unknown;
}
