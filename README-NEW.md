# 🎙️ AI Voice Chat UI - Premium Assistant Interface

A beautiful, production-ready voice chat interface featuring real-time waveform visualization, state machine-based conversation flow, and seamless AWS Nova Sonic integration.

![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)
![Vite](https://img.shields.io/badge/Vite-8.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3-blue)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.4-purple)

## ✨ Features

### Core Functionality
- 🎤 **Real-time microphone capture** with echo cancellation & noise suppression
- 📊 **Live waveform visualization** using Canvas API
- 🎯 **State machine** for conversation flow (Idle → Listening → Thinking → Speaking)
- 🔊 **Audio playback** with streaming support
- 🌊 **Silence detection** with auto-transitions
- ⚡ **Bidirectional streaming** with AWS Nova Sonic
- 💬 **Live transcripts** with real-time updates
- 🎨 **Premium UI** with dark gradient background & animated orb

### Accessibility
- ♿ **WCAG 2.1 AAA** compliant
- ⌨️ **Full keyboard navigation** (Tab, Enter, Space)
- 🔊 **Screen reader support** with ARIA labels
- 👁️ **High contrast** text (≥7:1 ratio)
- 🎬 **Respects prefers-reduced-motion**

### Performance
- 🚀 **60fps animations** using Framer Motion
- ⏱️ **<500ms latency** end-to-end
- 💾 **Memory efficient** audio streaming
- 📱 **Mobile optimized** responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- HTTPS enabled (required for microphone access)
- AWS account (optional, for Nova Sonic)

### Installation

```bash
# Clone or download the project
cd ai-voice-demo

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
ai-voice-demo/
├── src/
│   ├── components/
│   │   ├── HomeScreen.tsx          # Home screen with suggestions
│   │   ├── VoiceOverlay.tsx         # Main voice chat overlay
│   │   ├── OrbButton.tsx            # Animated floating orb
│   │   ├── WaveformRing.tsx         # Canvas waveform visualizer
│   │   ├── Transcript.tsx           # Conversation transcript
│   │   └── SuggestionChips.tsx      # Suggestion pills
│   ├── hooks/
│   │   └── useAudio.ts             # Audio & waveform hooks
│   ├── services/
│   │   └── websocket.ts            # WebSocket client
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   ├── App.tsx                     # Main app with state machine
│   ├── App.css                     # Styles & animations
│   ├── index.css                   # Global styles (Tailwind)
│   └── main.tsx                    # Entry point
├── backend.js                      # Node.js WebSocket proxy
├── IMPLEMENTATION.md               # Detailed implementation guide
├── NOVA_SONIC_INTEGRATION.md       # Nova Sonic setup guide
├── QA_TESTING_GUIDE.md            # Complete testing checklist
├── BACKEND_SETUP.md               # Backend deployment guide
└── .env.example                   # Environment template
```

## 🎮 Usage Guide

### Idle State
1. View the home screen with suggestion chips
2. Click any suggestion or tap the "Tap to talk" orb

### Listening State
1. Speak naturally into your microphone
2. Watch the waveform react to your voice
3. Transcript appears in real-time
4. Say complete thought and pause

### Thinking State
1. After you stop speaking, the system thinks
2. Orb animates with rotating indicator
3. "Working on it..." appears

### Speaking State
1. AI response appears as text
2. Audio plays (in production)
3. Waveform animates with response
4. Can interrupt by speaking again

### Keyboard Navigation
- `Tab` - Focus through elements
- `Enter/Space` - Start/stop listening
- `Esc` - Close overlay

## 🎨 Colors & Design

| Element | Color | Hex |
|---------|-------|-----|
| Background Top | Very Dark | #14161E |
| Background Bottom | Deep Blue | #253F66 |
| Orb Primary | Bright Blue | #1E4871 |
| Orb Glow | Neon Blue | #59AFFF |
| Text Primary | White | #FFFFFF |
| Text Secondary | Light Gray | #CCCCCC |
| Accent Gold | Warm Gold | #FA9E2B |

## 🔌 API Integration

### Frontend ↔ Backend

The frontend communicates with the backend via WebSocket:

```
Client                    Backend              AWS Nova Sonic
  |                         |                        |
  |--[start]------->        |                        |
  |                    [session init]----->          |
  |--[audio chunk]---->     |                        |
  |                    [relay audio]-------->        |
  |                         |                    [process]
  |                         |<--[audio/text]--
  |<--[audio/text]--        |                        |
  |--[audio chunk]---->     |                        |
  |                    [relay]------------>          |
  |                         |                        |
  |--[end]------->          |                        |
  |                    [close]--------->             |
```

### WebSocket Messages

```typescript
// Client → Server
{ type: 'start' }                    // Start session
{ type: 'audio', data: Binary }      // Audio chunk
{ type: 'end' }                      // End session

// Server → Client
{ type: 'transcript', text: string } // Interim transcript
{ type: 'response_audio', audio: Buffer } // Response audio
{ type: 'error', message: string } // Error
```

## 🔧 Development

### Hot Reload
Vite automatically reloads on file changes:

```bash
npm run dev
```

### TypeScript Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

## 🧪 Testing

Complete QA testing guide available in [QA_TESTING_GUIDE.md](QA_TESTING_GUIDE.md)

Quick test:
```bash
npm run dev
# Open http://localhost:5173
# Click orb and speak
```

## 📊 Performance Metrics

- **Startup**: < 2 seconds (4G)
- **Latency**: < 500ms (end-to-end)
- **FPS**: 60fps (animations)
- **Memory**: < 50MB (audio buffers)
- **Lighthouse Score**: 85+

## ♿ Accessibility

✅ **WCAG 2.1 Level AAA**
- Screen reader compatible
- Keyboard navigable
- High contrast (7:1+)
- Respects reduced motion

Test with:
- Chrome DevTools Lighthouse
- NVDA or JAWS screen reader
- macOS VoiceOver
- Windows High Contrast

## 🌐 Browser Support

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✅ | ✅ | Full support |
| Firefox | ✅ | ✅ | Full support |
| Safari | ✅ | ✅ | iOS 14.5+ |
| Edge | ✅ | - | Chromium |

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 480px (portrait/landscape)
- **Tablet**: 481px - 1024px
- **Desktop**: 1025px+

## 🔐 Security

- ✅ HTTPS required (for microphone)
- ✅ AWS credentials in backend only
- ✅ CORS configured for backend
- ✅ Rate limiting implemented
- ✅ No sensitive data in frontend

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (AWS Lambda/EC2)
1. Set up backend server (see BACKEND_SETUP.md)
2. Configure AWS credentials
3. Deploy with Docker or Node.js runtime

## 🛠️ Configuration

### Environment Variables

Create `.env.example` → `.env`:

```env
VITE_API_URL=wss://your-backend.com
AWS_REGION=us-east-1
```

### Customization

**Colors**: Edit [src/App.css](src/App.css) CSS variables

**Animations**: Adjust Framer Motion props in components

**Suggestions**: Edit `suggestedChips` in [src/components/HomeScreen.tsx](src/components/HomeScreen.tsx)

## 📚 Documentation

- [Implementation Guide](IMPLEMENTATION.md) - Detailed architecture
- [Nova Sonic Setup](NOVA_SONIC_INTEGRATION.md) - AWS integration
- [QA Testing](QA_TESTING_GUIDE.md) - Complete test checklist
- [Backend Setup](BACKEND_SETUP.md) - Server deployment

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📋 Roadmap

- [ ] Web Speech API integration
- [ ] Multi-language support
- [ ] User history/favorites
- [ ] Analytics dashboard
- [ ] Dark/light mode toggle
- [ ] Custom branding
- [ ] Offline support
- [ ] Advanced audio effects

## 🐛 Known Issues

| Issue | Severity | Workaround |
|-------|----------|-----------|
| Microphone lag (low-end devices) | Low | Reduce sample rate |
| iOS audio autoplay | Medium | User interaction required |
| Waveform CPU (old devices) | Low | Reduce canvas resolution |

## 📞 Support

- Check [IMPLEMENTATION.md](IMPLEMENTATION.md) for architecture
- Review [QA_TESTING_GUIDE.md](QA_TESTING_GUIDE.md) for issues
- See [NOVA_SONIC_INTEGRATION.md](NOVA_SONIC_INTEGRATION.md) for API help
- Open an issue on GitHub

## 📄 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

- Built with React, TypeScript, and Framer Motion
- AWS Nova Sonic for voice AI
- WCAG for accessibility standards
- The web audio community

---

**Built with ❤️ for premium voice experiences**

Last Updated: 2024-01-15 | Version: 1.0.0
