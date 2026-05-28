import React, { useEffect, useRef } from 'react';

interface WaveformRingProps {
  data: Uint8Array;
  isActive: boolean;
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
  size?: number;
}

export const WaveformRing: React.FC<WaveformRingProps> = ({
  data,
  isActive,
  state,
  size = 280,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const canvasCtx = ctx as CanvasRenderingContext2D;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = size / 2 - 40;

    const draw = () => {
      // Clear canvas
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Determine colors based on state
      let glowColor = 'rgba(89, 175, 255, 0.6)';

      if (state === 'listening') {
        glowColor = 'rgba(89, 175, 255, 0.8)';
      } else if (state === 'thinking') {
        glowColor = 'rgba(250, 158, 43, 0.7)';
      } else if (state === 'speaking') {
        glowColor = 'rgba(89, 175, 255, 0.8)';
      }

      // Draw waveform ring
      const samples = 120; // Number of points around the circle
      const sliceWidth = (data.length * 1.0) / samples;

      canvasCtx.strokeStyle = glowColor;
      canvasCtx.lineWidth = 2;
      canvasCtx.lineCap = 'round';
      canvasCtx.lineJoin = 'round';

      canvasCtx.beginPath();

      for (let i = 0; i < samples; i++) {
        const index = Math.floor((i * sliceWidth) % data.length);
        const normalized = (data[index] - 128) / 128;

        // Amplitude-based radius
        const amplitude = Math.abs(normalized);
        const radiusVariation = amplitude * 30;
        const radius = baseRadius + radiusVariation;

        // Convert to cartesian coordinates
        const angle = (i / samples) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
      }

      // Close the path
      const angle = -Math.PI / 2;
      const radius = baseRadius;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      canvasCtx.lineTo(x, y);
      canvasCtx.stroke();

      // Draw glow effect
      const gradient = canvasCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius + 40);
      gradient.addColorStop(0, 'rgba(89, 175, 255, 0)');
      gradient.addColorStop(1, glowColor);

      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    if (isActive) {
      draw();
    } else {
      // Draw minimal pulsing ring on idle
      const pulseFactor = Math.sin(new Date().getTime() / 1000) * 0.1 + 0.9;
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.strokeStyle = 'rgba(30, 72, 113, 0.3)';
      canvasCtx.lineWidth = 2;
      canvasCtx.beginPath();
      canvasCtx.arc(centerX, centerY, baseRadius * pulseFactor, 0, Math.PI * 2);
      canvasCtx.stroke();
      animationFrameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [data, isActive, state, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};
