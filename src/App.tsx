import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import { HomeScreen } from './components/HomeScreen';
import { VoiceOverlay } from './components/VoiceOverlay';
import { useAudioContext, useWaveformData, useSilenceDetection } from './hooks/useAudio';
import type { ConversationMessage } from './types/index';
import { WebSocketService } from './services/websocket';

type ConversationState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'no_voice';

function App() {
  // State management
  const [conversationState, setConversationState] = useState<ConversationState>('idle');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [overlayOpen, setOverlayOpen] = useState(false);

  // Audio and waveform
  const audioCtx = useAudioContext();
  const { waveformData, startAnalysis, stopAnalysis } = useWaveformData(audioCtx.analyser);
  const isSilent = useSilenceDetection(audioCtx.analyser, 30, 800);

  // WebSocket and communication
  const wsRef = useRef<WebSocketService | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Uint8Array[]>([]);

  // Initialize WebSocket
  useEffect(() => {
    const initWebSocket = async () => {
      if (!wsRef.current) {
        wsRef.current = new WebSocketService();
        try {
          // For development, we'll skip connecting to the backend
          // In production, uncomment the line below:
          // await wsRef.current.connect();
          console.log('WebSocket service initialized (backend connection skipped for demo)');
        } catch (error) {
          console.error('Failed to connect WebSocket:', error);
          // Silently fail for demo mode
        }
      }
    };

    initWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, []);

  // Handle silence detection for auto-transition
  useEffect(() => {
    if (
      isSilent &&
      conversationState === 'listening' &&
      audioChunksRef.current.length > 0
    ) {
      handleStopListening();
    }
  }, [isSilent, conversationState]);

  // Orb click handler - main interaction
  const handleOrbClick = useCallback(async () => {
    switch (conversationState) {
      case 'idle':
        await handleStartListening();
        break;
      case 'listening':
        handleStopListening();
        break;
      case 'speaking':
        await handleInterrupt();
        break;
      case 'thinking':
        setConversationState('idle');
        break;
      case 'no_voice':
        // Retry listening
        await handleStartListening();
        break;
      default:
        break;
    }
  }, [conversationState]);

  // Start listening to user
  const handleStartListening = useCallback(async () => {
    try {
      // Request microphone permission if not already granted
      if (!audioCtx.isInitialized) {
        const success = await audioCtx.requestMicrophoneAccess();
        if (!success) {
          alert('Microphone access denied. Please enable microphone permissions.');
          return;
        }
      }

      setConversationState('listening');
      startAnalysis();
      audioChunksRef.current = [];

      // Setup media recorder
      if (audioCtx.mediaStream && !mediaRecorderRef.current) {
        const mediaRecorder = new MediaRecorder(audioCtx.mediaStream);

        mediaRecorder.ondataavailable = (event: BlobEvent) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            if (arrayBuffer) {
              audioChunksRef.current.push(new Uint8Array(arrayBuffer));
              // Send to WebSocket in real-time
              if (wsRef.current?.isConnected()) {
                wsRef.current.sendAudio(arrayBuffer);
              }
            }
          };
          reader.readAsArrayBuffer(event.data);
        };

        mediaRecorder.onstart = () => {
          console.log('Recording started');
        };

        mediaRecorder.onstop = () => {
          console.log('Recording stopped');
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start(100); // Capture audio in 100ms chunks
      }

      // Notify backend
      if (wsRef.current?.isConnected()) {
        wsRef.current.startSession();
      }
    } catch (error) {
      console.error('Error starting listening:', error);
    }
  }, [audioCtx, startAnalysis]);

  const handleStopListening = useCallback(() => {
    stopAnalysis();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // If no audio was captured, go to no_voice state
    if (audioChunksRef.current.length === 0 && !currentInput.trim()) {
      setConversationState('no_voice');
      return;
    }

    // Store user message
    if (currentInput.trim()) {
      const userMessage: ConversationMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: currentInput,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setCurrentInput('');
    }

    setConversationState('thinking');

    // Simulate thinking delay (in production, this happens when Nova Sonic starts processing)
    setTimeout(() => {
      setConversationState('speaking');
      // Simulate AI response
      simulateAIResponse();
    }, 2000);
  }, [currentInput, stopAnalysis]);

  // Interrupt handler - stop AI response and return to listening
  const handleInterrupt = useCallback(async () => {
    stopAnalysis();
    setConversationState('listening');
    audioChunksRef.current = [];

    if (wsRef.current?.isConnected()) {
      wsRef.current.send({ type: 'interrupt' });
    }

    // Restart recording
    if (audioCtx.mediaStream) {
      const mediaRecorder = new MediaRecorder(audioCtx.mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100);
    }

    startAnalysis();
  }, [audioCtx, startAnalysis, stopAnalysis]);

  // Simulate AI response for demo (replace with real API call)
  const simulateAIResponse = useCallback(() => {
    const responses = [
      'I found some great recommendations for you! How about trying "Dilwale Dulhania Le Jayenge" or "Kabhi Khushi Kabhi Gham"? Both are classic romantic movies.',
      'For comedy, I recommend "3 Idiots" or "PK". They are hilarious and heartwarming.',
      'The latest web series include "Mirzapur", "Sacred Games", and "Panchayat". Which genre interests you?',
      'For action lovers, "Pathaan", "Bade Miyan Chote Miyan", and "Khiladi" are excellent choices.',
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const assistantMessage: ConversationMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: randomResponse,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    
    // The response will stay on screen until the user taps again or interacts.
  }, []);

  // Handle home screen orb click
  const handleHomeOrbClick = useCallback(() => {
    setOverlayOpen(true);
    // Do NOT automatically start listening. Just open the overlay in the 'idle' state.
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = useCallback(async (text: string) => {
    setCurrentInput(text);
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: text,
        timestamp: Date.now(),
      },
    ]);
    setConversationState('thinking');
    setTimeout(() => {
      setConversationState('speaking');
      simulateAIResponse();
    }, 2000);
  }, [simulateAIResponse]);

  // Close overlay
  const handleCloseOverlay = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    stopAnalysis();
    setOverlayOpen(false);
    setConversationState('idle');
    setCurrentInput('');
  }, [stopAnalysis]);

  // Update current input for live transcript (in real app, this would come from speech recognition)
  useEffect(() => {
    if (conversationState === 'listening') {
      // This would be updated with real speech recognition results
      // For now, we'll just show placeholder
      setCurrentInput('');
    }
  }, [conversationState]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
      <AnimatePresence mode="wait">
        {!overlayOpen ? (
          <HomeScreen
            key="home"
            isVisible={true}
            onOrbClick={handleHomeOrbClick}
            onSuggestionClick={handleSuggestionClick}
            waveformData={waveformData}
          />
        ) : (
          <VoiceOverlay
            key="overlay"
            isOpen={overlayOpen}
            state={conversationState}
            messages={messages}
            currentInput={currentInput}
            waveformData={waveformData}
            onOrbClick={handleOrbClick}
            onClose={handleCloseOverlay}
            onKeyboardToggle={() => console.log('Keyboard toggle')}
            onSuggestionClick={handleSuggestionClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
