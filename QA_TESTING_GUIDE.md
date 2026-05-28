# QA & Demo Testing Guide

Complete testing checklist for the AI Voice Chat UI.

## Pre-Demo Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# Navigate to: http://localhost:5173
```

## Test Environment

| Device | Browser | Resolution | Network |
|--------|---------|-----------|---------|
| Desktop | Chrome | 1920x1080 | WiFi |
| Tablet | Safari | 1024x768 | 4G |
| Mobile | Chrome | 360x800 | 5G |

## UI/UX Tests

### Home Screen (Idle State)

- [ ] Title "What are you in the mood for?" is visible and centered
- [ ] Suggestion chips (4x) are displayed in 2x2 grid
- [ ] Each chip has proper styling (dark background, white text)
- [ ] Chips have hover effects (scale up, border highlight)
- [ ] Floating orb is at bottom center with "Tap to talk" label
- [ ] "Compare with ChatGPT →" link appears top-right
- [ ] Gradient background loads smoothly (no flicker)
- [ ] All text is readable (white on dark blue, WCAG AAA)

### Suggestion Interaction

- [ ] Click any suggestion chip
- [ ] Chip text appears in conversation
- [ ] Overlay opens smoothly with fade animation
- [ ] State transitions to "Thinking"
- [ ] "Working on it..." text appears

### Orb Button - Idle State

- [ ] Orb is circular (60px diameter)
- [ ] Orb has microphone icon
- [ ] Orb gently pulses (breathing animation)
- [ ] Pulse is smooth (2s cycle)
- [ ] Glow effect is visible (blue halo)
- [ ] Orb responds to hover (slight scale up)

### Orb Button - Listening State

- [ ] Click orb
- [ ] Overlay fades in
- [ ] Orb moves to center of screen
- [ ] Orb icon changes to pause (two bars)
- [ ] Orb pulses faster (breathing speeds up)
- [ ] Label changes to "Listening..."
- [ ] Waveform ring appears around orb
- [ ] Waveform animates smoothly

### Microphone Permission

- [ ] First tap shows microphone permission prompt
- [ ] Permission prompt is clear and understandable
- [ ] Allow/Deny buttons are functional
- [ ] If allowed: listening starts immediately
- [ ] If denied: graceful error message shows

### Waveform Visualization

- [ ] Waveform ring is circular and centered
- [ ] Ring thickness is consistent (~2px)
- [ ] Ring color matches theme (cyan/blue)
- [ ] Ring pulses with voice amplitude
- [ ] Louder speech = larger ring spikes
- [ ] Silence = minimal pulsing (breathing effect)
- [ ] No lag or stuttering at 60fps

### Transcript Display

- [ ] Interim transcript appears as user speaks
- [ ] Text updates in real-time (partial results)
- [ ] Text appears above orb
- [ ] Cursor/caret shows at end of text
- [ ] Completed messages appear in full
- [ ] Messages are positioned and spaced properly
- [ ] Text is readable (white on dark, high contrast)

### Silence Detection

- [ ] After ~800ms of silence, state transitions to Thinking
- [ ] "Working on it..." text appears with fade
- [ ] Orb animates with thinking state (rotate)
- [ ] Waveform maintains subtle pulse
- [ ] Background remains same

### AI Response (Speaking State)

- [ ] After ~2s thinking (simulated), state transitions to Speaking
- [ ] Orb icon returns to microphone
- [ ] "Assistant Response" text appears (title)
- [ ] Mock response text appears in transcript
- [ ] Waveform responds to simulated audio
- [ ] After 3s, state returns to Idle
- [ ] Conversation history is preserved

### Interruption

- [ ] While AI is speaking, click orb again
- [ ] Audio playback stops immediately (no delay)
- [ ] State returns to Listening
- [ ] New waveform animation starts
- [ ] Can speak to interrupt

### Close Button

- [ ] "X" button appears at bottom-right of overlay
- [ ] Button is white with hover effect
- [ ] Click closes overlay with fade
- [ ] Returns to home screen
- [ ] Conversation history cleared
- [ ] Orb returns to floating position

### Keyboard Button

- [ ] Keyboard icon appears at bottom-left
- [ ] Icon is white with hover effect
- [ ] Click toggles to text input mode (optional feature)

## Accessibility Tests

### Keyboard Navigation

- [ ] Tab focuses on orb button
- [ ] Tab cycles through interactive elements (orb, chips, buttons)
- [ ] Visible focus ring appears around focused elements
- [ ] Focus ring color is sufficient contrast (blue on dark)

### Keyboard Activation

- [ ] Focus on orb, press Space or Enter
- [ ] Starts listening
- [ ] Press Space/Enter again to stop
- [ ] Works consistently

### ARIA Labels

- [ ] Use screen reader to navigate
- [ ] Buttons have descriptive labels
- [ ] "Voice assistant, tap to speak"
- [ ] State changes are announced
- [ ] Transcripts are announced via live region

### Screen Reader Tests

- [ ] Activate screen reader (NVDA, JAWS, VoiceOver)
- [ ] Read entire page from top to bottom
- [ ] All text is readable and makes sense
- [ ] Buttons are identified as buttons
- [ ] No placeholder/unlabeled elements

### High Contrast Mode

- [ ] Test in Windows High Contrast mode
- [ ] UI remains readable
- [ ] All elements are visible
- [ ] No information lost

### Color Blindness

- [ ] Waveform is not only distinguishable by color
- [ ] Use different line width or pattern
- [ ] Test with color blindness simulator (Chrome DevTools)

## Responsive Design Tests

### Mobile Portrait (360x800)

- [ ] Layout stacks vertically
- [ ] Orb is centered horizontally
- [ ] Text wraps properly (no overflow)
- [ ] Touch targets are ≥44x44px
- [ ] Spacing is comfortable (16px gaps)
- [ ] Overlay is full-screen
- [ ] No horizontal scroll

### Mobile Landscape (800x360)

- [ ] Orb remains centered
- [ ] Waveform maintains proper size
- [ ] Text still readable
- [ ] Controls are accessible

### Tablet Portrait (768x1024)

- [ ] Orb is larger (~80px)
- [ ] Waveform ring is proportional
- [ ] Text is sized appropriately
- [ ] No extra-wide margins

### Tablet Landscape (1024x768)

- [ ] Layout adapts to wide screen
- [ ] Orb stays centered
- [ ] All elements proportional

### Desktop (1920x1080)

- [ ] Orb is centered in viewport
- [ ] Waveform ring is large but proportional
- [ ] Maximum width for content (not stretched)
- [ ] Spacing is generous

### Orientation Change

- [ ] Rotate device portrait → landscape
- [ ] Layout re-flows smoothly (no flicker)
- [ ] Orb position updates
- [ ] Waveform canvas resizes
- [ ] No elements are cut off
- [ ] Rotate back to portrait - same result

## Performance Tests

### Frame Rate

- [ ] Use Chrome DevTools Performance tab
- [ ] Record during orb animation
- [ ] Waveform should run at 60fps
- [ ] Ripple animation should be smooth
- [ ] No dropped frames (green throughout)

### Startup Performance

- [ ] Measure time from page load to interactive
- [ ] Should be < 2 seconds on 4G
- [ ] Lighthouse Performance score: ≥80
- [ ] First Contentful Paint (FCP): < 1s
- [ ] Largest Contentful Paint (LCP): < 2.5s

### Memory Usage

- [ ] Open DevTools → Memory tab
- [ ] Take heap snapshot at start
- [ ] Click through states multiple times
- [ ] Take another snapshot
- [ ] Memory should not grow more than 20MB
- [ ] No visible memory leaks

### Audio Buffer Size

- [ ] Send 200ms audio chunks
- [ ] Monitor for buffer overflow
- [ ] Audio should play smoothly without stutters
- [ ] Jitter < 50ms

### Canvas Performance

- [ ] WaveformRing canvas should be efficient
- [ ] Use `requestAnimationFrame`
- [ ] No blocking operations in draw loop
- [ ] Profile with DevTools Performance

## Error Handling Tests

### Microphone Permission Denied

- [ ] Click orb
- [ ] Deny microphone permission
- [ ] Show error message: "Microphone access denied. Please enable microphone permissions."
- [ ] Overlay closes
- [ ] Return to home screen

### Network Error (WebSocket)

- [ ] Turn off WiFi/network
- [ ] Try to use voice chat
- [ ] Should show error gracefully
- [ ] Retry logic attempts reconnection
- [ ] No console errors (logging only)

### Audio Format Error

- [ ] Simulate audio format mismatch (not 16kHz)
- [ ] Should handle gracefully
- [ ] Try to resample if possible
- [ ] Show error if not recoverable

### Browser Incompatibility

- [ ] Test on Safari (iOS/macOS)
- [ ] Test on Firefox
- [ ] Test on Edge
- [ ] Web Audio API should work on all
- [ ] getUserMedia should work on HTTPS

## Audio Tests

### Microphone Capture

- [ ] Audio is captured with 16-bit depth
- [ ] Sample rate is correct (16kHz or converted)
- [ ] Echo cancellation is working
- [ ] Noise suppression is working

### Waveform Accuracy

- [ ] Waveform represents actual audio amplitude
- [ ] Peaks match voice volume spikes
- [ ] Smooth transitions between frames
- [ ] No aliasing or artifacts

### Silence Detection

- [ ] System correctly detects silence after speech
- [ ] Threshold is adjustable (currently 30)
- [ ] Minimum duration is 800ms
- [ ] No false positives (doesn't trigger on background noise)
- [ ] No false negatives (catches actual silence)

### Audio Playback

- [ ] Mock audio plays without distortion
- [ ] Volume levels are appropriate
- [ ] No clipping or overdriven audio
- [ ] Smooth playback (no stutters)

## Browser Compatibility

| Browser | Version | Desktop | Mobile | Notes |
|---------|---------|---------|--------|-------|
| Chrome | Latest | ✅ | ✅ | Full support |
| Firefox | Latest | ✅ | ⚠️ | May need config |
| Safari | Latest | ✅ | ✅ | iOS 14.5+ |
| Edge | Latest | ✅ | - | Uses Chromium |
| Opera | Latest | ✅ | ✅ | Chromium-based |

## Visual Regression Tests

### Colors Match Spec

- [ ] Background gradient: #14161E → #253F66
- [ ] Orb: #1E4871
- [ ] Glow: #59AFFF
- [ ] Text: #FFFFFF
- [ ] Secondary text: #CCCCCC

### Typography

- [ ] Title font size: ~28-32px, bold
- [ ] Body text: ~16px, regular
- [ ] Line height: comfortable (1.5-1.6)
- [ ] Letter spacing: not too tight

### Spacing

- [ ] Title margin: ~24px from top
- [ ] Suggestion chips: 10-16px spacing
- [ ] Bottom controls: ~32px from bottom
- [ ] Consistent padding across elements

### Shadows & Glows

- [ ] Orb has proper glow/shadow
- [ ] Glow intensity changes with state
- [ ] Shadow is soft (not harsh)
- [ ] No double shadows or artifacts

## Accessibility Compliance

### WCAG 2.1 AA

- [ ] All images have alt text (or aria-hidden)
- [ ] Color is not only means of communication
- [ ] Links are underlined or clearly distinguished
- [ ] Form controls are labeled
- [ ] Content is structured with headings
- [ ] Video/audio has captions (if applicable)

### WCAG 2.1 AAA (Enhanced)

- [ ] Contrast ratio ≥7:1 (text on background)
- [ ] Large text ≥4.5:1
- [ ] No audio plays automatically
- [ ] Focus mechanism is visible
- [ ] Language is simple and clear

## Demo Script

### Introduction (30 seconds)

"Welcome to our AI Voice Chat UI. This is a premium voice assistant interface similar to JioHotstar's AI. Notice the beautiful dark gradient background and the floating microphone orb at the bottom."

### Home Screen Demo (30 seconds)

"On the home screen, you can see suggestion chips for different content categories. Let me click on one of these suggestions to start a conversation."

### Listening State Demo (20 seconds)

"When we click a suggestion, the orb moves to the center and shows the listening state. You can see the waveform ring animating around the orb, and the transcript appearing above it."

### Processing State Demo (10 seconds)

"After the user input is complete, the system transitions to a thinking state. Notice the orb animates with a rotating thinking indicator, showing that the system is processing the request."

### Response State Demo (20 seconds)

"Once processed, the AI provides a response. The orb returns to its normal state, and the assistant's response appears in the transcript. The waveform continues to animate as audio is played."

### Interruption Demo (15 seconds)

"At any time during the response, the user can interrupt by tapping the orb or starting to speak. The system immediately responds and returns to the listening state."

### Accessibility Demo (15 seconds)

"Let me show you the accessibility features. You can navigate using keyboard Tab, activate with Enter or Space, and all interactive elements have focus indicators and ARIA labels for screen readers."

**Total Demo Time: ~2 minutes 40 seconds**

## Post-Demo Checklist

- [ ] No console errors or warnings
- [ ] All animations smooth (60fps)
- [ ] No memory leaks
- [ ] Performance metrics recorded
- [ ] Screenshots captured
- [ ] Video recording saved (if applicable)
- [ ] Feedback collected from audience
- [ ] Issues documented for improvement

## Known Issues & Workarounds

| Issue | Severity | Workaround | Status |
|-------|----------|-----------|--------|
| Microphone lag on some devices | Low | Use lower sample rate or buffer size | Open |
| iOS Safari autoplay policies | Medium | User interaction required to play audio | Known limitation |
| Waveform CPU usage on low-end devices | Low | Reduce canvas resolution or FPS | Documented |

## Sign-Off

- [ ] QA Lead: _________________ Date: _______
- [ ] Product Manager: _________________ Date: _______
- [ ] Engineering Lead: _________________ Date: _______

---

**Last Updated:** [Date]
**Next Review:** [Date + 2 weeks]
