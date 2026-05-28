# AI Voice Chat UI - Complete Implementation Guide

## Overview

This is a premium AI voice chat UI similar to JioHotstar's AI assistant, featuring:
- ✨ Beautiful dark-blue gradient cinematic background
- 🎙️ Floating animated orb button for voice input
- 📊 Real-time waveform visualization
- 🎤 Microphone capture with speech detection
- 🔊 Audio playback with streaming support
- ⚡ Bidirectional audio streaming with Nova Sonic
- ♿ Full accessibility support (ARIA, keyboard navigation)
- 📱 Fully responsive design (mobile-first)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

This starts the Vite dev server on `http://localhost:5173`.

### 3. Build for Production

```bash
npm run build
```

## Project Structure

```
ai-voice-demo/
├── src/
│   ├── components/
│   │   ├── HomeScreen.tsx        # Idle home screen with suggestions
│   │   ├── VoiceOverlay.tsx       # Main voice chat overlay
│   │   ├── OrbButton.tsx          # Animated floating orb button
│   │   ├── WaveformRing.tsx       # Canvas-based waveform visualizer
│   │   ├── Transcript.tsx         # Live conversation transcript
│   │   └── SuggestionChips.tsx    # Interactive suggestion chips
│   ├── hooks/
│   │   └── useAudio.ts           # Audio context and waveform hooks
│   ├── services/
│   │   └── websocket.ts          # WebSocket communication service
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx                   # Main app component with state machine
│   ├── App.css                   # Custom CSS and animations
│   ├── index.css                 # Global styles with Tailwind
│   └── main.tsx                  # Entry point
├── backend.js                    # Node.js WebSocket proxy (optional)
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## Key Components & Architecture

### State Machine

The app uses a finite state machine for conversation flow:

```
IDLE ──→ LISTENING ──→ THINKING ──→ SPEAKING ──→ IDLE
  ↑         ↓           ↓            ↓
  └─────────┴───────────┴────────────┘
          (cancel/interrupt)
```

**States:**
- **Idle**: Ready for input, suggestions visible
- **Listening**: Recording user voice, showing waveform
- **Thinking**: Processing user input, waiting for AI response
- **Speaking**: Playing AI audio response
- **Error**: Network or permission error

### Component Hierarchy

```
App
├── HomeScreen (when not in conversation)
│   ├── OrbButton
│   └── SuggestionChips
└── VoiceOverlay (when in conversation)
    ├── OrbButton (centered)
    ├── WaveformRing (visualization)
    ├── Transcript (messages)
    └── Control buttons (close, keyboard)
```

## Styling & Colors

All colors are defined in [App.css](src/App.css):

| Element | Color | Hex | Notes |
|---------|-------|-----|-------|
| Background top | #14161E | Very dark (near black) | Gradient start |
| Background bottom | #253F66 | Deep blue | Gradient end |
| Orb fill | #1E4871 | Bright blue | Primary button |
| Orb glow | #59AFFF | Neon blue | Active state |
| Text primary | #FFFFFF | White | Main text |
| Text secondary | #CCCCCC | Light gray | Secondary text |
| Chip background | #121B2C | Dark blue-gray | Button bg |
| Accent gold | #FA9E2B | Warm gold | Thinking state |

## Web Audio API Integration

### Microphone Capture

```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: false,
  },
});
```

### Waveform Analysis

The `useWaveformData` hook connects to an AnalyserNode:

```typescript
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048; // 1024 frequency bins
analyser.smoothingTimeConstant = 0.85;
analyser.getByteTimeDomainData(dataArray); // Get waveform data
```

### Silence Detection

The `useSilenceDetection` hook detects when user stops speaking:

```typescript
// Auto-transitions from Listening → Thinking after ~800ms silence
const isSilent = useSilenceDetection(analyser, 30, 800);
```

## WebSocket Communication

The frontend communicates with a backend proxy via WebSocket for Nova Sonic integration.

### Message Types

**Client → Server:**
```json
{
  "type": "start",
  "timestamp": 1234567890
}
```

```json
{
  "type": "audio",
  "data": "<binary audio chunks>"
}
```

```json
{
  "type": "end",
  "timestamp": 1234567890
}
```

**Server → Client:**
```json
{
  "type": "response_audio",
  "audioData": "<base64 encoded>",
  "transcript": "AI response text"
}
```

## Backend Setup (Optional)

For production, you'll need a backend proxy to handle Nova Sonic API calls securely.

### Installation

```bash
cd backend
npm install express ws dotenv @aws-sdk/client-bedrock-runtime
```

### Configuration

Create a `.env` file:

```env
PORT=3000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
NODE_ENV=production
```

### Running the Backend

```bash
node backend.js
```

The backend will:
- Listen for WebSocket connections on `ws://localhost:3000`
- Relay audio to AWS Nova Sonic API
- Stream responses back to clients
- Handle errors and reconnections

## Accessibility Features

✅ **ARIA Labels**: All buttons have descriptive labels
✅ **Live Regions**: Transcripts use `aria-live="polite"` for screen readers
✅ **Keyboard Navigation**: Tab through UI, Enter/Space to activate orb
✅ **Focus Management**: Visible focus rings on all interactive elements
✅ **Color Contrast**: WCAG AAA compliant (≥7:1 on dark backgrounds)
✅ **Reduced Motion**: Respects `prefers-reduced-motion` media query

## Performance Targets

- **Latency**: < 500ms from end of speech to audio playback
- **Frame Rate**: 60fps on animations
- **Memory**: < 50MB for audio buffers
- **Network**: Optimized for 4G/5G and Wi-Fi

### Optimization Tips

1. **Audio Chunking**: Send 200ms chunks for low latency
2. **Waveform Canvas**: Use `requestAnimationFrame` for 60fps
3. **Jitter Buffering**: Buffer ~2 chunks (~100ms) for smooth playback
4. **Memory**: Clear audio buffers after processing

## Animations & Timings

### Orb State Animations

| State | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Idle | Pulse | 2s | easeInOut |
| Listening | Faster pulse + ripple ring | 0.6s | easeInOut |
| Thinking | Rotate icon | 2s | linear |
| Speaking | Subtle breathing | 0.8s | easeInOut |

### UI Transitions

- Overlay fade: 300ms
- Suggestion chips: 400ms staggered
- Transcript fade: 100ms per message
- State transitions: 200ms

## Testing Checklist

- [ ] Microphone permission prompt appears (HTTPS only)
- [ ] Orb responds to clicks immediately
- [ ] Waveform animates smoothly while speaking
- [ ] Suggestions disappear when overlay opens
- [ ] Transcript updates in real-time
- [ ] Audio plays without glitches
- [ ] Can interrupt AI response
- [ ] Tab navigation works (keyboard accessible)
- [ ] Works on mobile portrait/landscape
- [ ] Animations smooth at 60fps

## Demo Features

### Home Screen
- Animated title: "What are you in the mood for?"
- 4 suggestion chips (movies, shows, etc.)
- Floating orb at bottom with "Tap to talk"
- Compare with ChatGPT link

### Voice Chat
- Live waveform ring around orb
- Real-time transcript display
- State-based UI updates
- Auto-transitions between states
- Cancel button (X) at bottom-right
- Keyboard toggle at bottom-left

### Interruption
- User can tap orb again while AI is speaking
- Immediately stops playback
- Returns to listening state
- Context preserved for next response

## Known Limitations

1. **Demo Mode**: Uses simulated responses instead of real Nova Sonic API
2. **Backend**: Not included in production build (must deploy separately)
3. **Speech Recognition**: Currently uses placeholder for interim transcripts
   - To add: Integrate Web Speech API or external service
4. **Audio Format**: Assumes 16kHz 16-bit PCM from Nova Sonic
   - May need resampling for different formats

## Future Enhancements

- [ ] Web Speech API integration for live transcription
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] User history/favorites
- [ ] Custom avatar/branding
- [ ] Advanced audio effects (EQ, effects)
- [ ] Analytics/usage tracking
- [ ] Offline support (Service Worker)

## Troubleshooting

### Microphone not working
- Check HTTPS (required by Chrome/Edge)
- Check browser permissions
- Try `navigator.permissions.query()` for debug

### Waveform not updating
- Check AnalyserNode connection
- Verify `fftSize` and `smoothingTimeConstant`
- Check canvas is properly sized

### WebSocket connection failed
- Start backend server: `node backend.js`
- Check AWS credentials in `.env`
- Check firewall/network settings

### Audio playback issues
- Check audio context state (resumed?)
- Verify audio format (16kHz, 16-bit)
- Check output device volume

## Resources

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [AWS Nova Sonic](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [WCAG 2.1 Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)

## License

MIT - Feel free to use for personal or commercial projects.

---

**Built with ❤️ for premium voice experiences**
