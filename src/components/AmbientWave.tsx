import React, { useEffect, useRef } from 'react';

interface AmbientWaveProps {
  data: Uint8Array;
  isActive: boolean;
  state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'no_voice';
}

export const AmbientWave: React.FC<AmbientWaveProps> = ({ data, isActive, state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const smoothedAmplitudeRef = useRef(0);
  const timeRef = useRef(0);

  const particlesRef = useRef<Array<{
    x: number; y: number; speed: number;
    size: number; opacity: number; offset: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: Math.random(),
          y: Math.random(),
          speed: 0.0008 + Math.random() * 0.0025,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.6 + 0.15,
          offset: (Math.random() - 0.5) * 6,
        });
      }
    }

    const draw = () => {
      timeRef.current += 0.008;
      const t = timeRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;

      ctx.clearRect(0, 0, W, H);

      // ── Always-on animated aurora (idle + active) ──────────────────────
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = 'blur(70px)';

      const idleBlobs = [
        {
          // Purple – top-left, breathes slowly
          x: cx * 0.35 + Math.sin(t * 0.4) * 60,
          y: H * 0.28 + Math.cos(t * 0.3) * 40,
          r: 320 + Math.sin(t * 0.5) * 40,
          color: `rgba(139,92,246,${0.38 + Math.sin(t * 0.6) * 0.1})`,
        },
        {
          // Cyan – center top, oscillates horizontally
          x: cx + Math.sin(t * 0.7) * 80,
          y: H * 0.18 + Math.sin(t * 0.4) * 30,
          r: 360 + Math.cos(t * 0.5) * 50,
          color: `rgba(56,189,248,${0.25 + Math.sin(t * 0.8) * 0.08})`,
        },
        {
          // Indigo – bottom-right, drifts
          x: cx * 1.55 + Math.cos(t * 0.5) * 50,
          y: H * 0.72 + Math.sin(t * 0.6) * 35,
          r: 280 + Math.sin(t * 0.4) * 35,
          color: `rgba(99,102,241,${0.35 + Math.cos(t * 0.7) * 0.1})`,
        },
        {
          // Magenta – bottom-left, breathes
          x: cx * 0.5 + Math.sin(t * 0.3) * 70,
          y: H * 0.75 + Math.cos(t * 0.4) * 40,
          r: 260 + Math.cos(t * 0.6) * 30,
          color: `rgba(168,85,247,${0.28 + Math.sin(t * 0.5) * 0.09})`,
        },
      ];

      idleBlobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      // ── Stop here for idle / no_voice ──────────────────────────────────
      if (!isActive || state === 'idle' || state === 'no_voice') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'none';
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      // ── Amplitude from mic / simulated TTS ────────────────────────────
      let amp = 0;
      if (state === 'listening' || state === 'speaking') {
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += Math.abs(data[i] - 128);
        amp = (sum / data.length) / 128;
        if (state === 'speaking' && amp < 0.05) {
          amp = 0.35 + Math.sin(t * 9) * 0.25 + Math.random() * 0.08;
        }
      } else if (state === 'thinking') {
        amp = 0.18 + Math.sin(t * 2.2) * 0.12;
      }

      smoothedAmplitudeRef.current += (amp - smoothedAmplitudeRef.current) * 0.1;
      const smoothAmp = smoothedAmplitudeRef.current;

      // ── Active aurora blobs rising from orb ───────────────────────────
      const orbY = H - 100;
      const activeBlobs = [
        {
          color: state === 'thinking' ? 'rgba(192,132,252,' : 'rgba(0,210,255,',
          xOff: Math.sin(t * 0.9) * 280,
          speed: 1.1,
          rm: 1.6,
        },
        {
          color: state === 'thinking' ? 'rgba(139,92,246,' : 'rgba(99,102,241,',
          xOff: Math.cos(t * 1.2) * 220,
          speed: -0.8,
          rm: 1.3,
        },
        {
          color: state === 'thinking' ? 'rgba(168,85,247,' : 'rgba(0,85,255,',
          xOff: Math.sin(t * 0.6) * 360,
          speed: 1.6,
          rm: 1.9,
        },
      ];

      activeBlobs.forEach(b => {
        const baseR = 200 + W * 0.15;
        const dynR = baseR + baseR * b.rm * smoothAmp * 1.4;
        const bX = cx + b.xOff;
        const bY = orbY - (120 + smoothAmp * 320) + Math.sin(t * b.speed) * 55;
        const opacity = Math.min(0.85, 0.18 + smoothAmp * 0.85);
        const g = ctx.createRadialGradient(bX, bY, 0, bX, bY, dynR);
        g.addColorStop(0, `${b.color}${opacity})`);
        g.addColorStop(0.5, `${b.color}${opacity * 0.45})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(bX, bY, dynR, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Particles ─────────────────────────────────────────────────────
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'blur(0.5px)';

      particlesRef.current.forEach(p => {
        p.y -= p.speed * (1 + smoothAmp * 4);
        if (p.y < 0) { p.y = 1; p.x = Math.random(); }

        const spread = 180 + (1 - p.y) * W * 0.55;
        const pX = cx + (p.x - 0.5) * spread + Math.sin(t * 1.8 + p.offset) * 25;
        const pY = H * p.y;
        const pO = p.opacity * Math.sin(p.y * Math.PI) * (0.25 + smoothAmp * 0.75);

        ctx.beginPath();
        ctx.arc(pX, pY, p.size + smoothAmp, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${pO})`;
        ctx.fill();
      });

      ctx.filter = 'none';
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [data, isActive, state]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
