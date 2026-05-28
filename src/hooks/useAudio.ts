import { useState, useCallback, useRef, useEffect } from 'react';
import type { AudioContextType } from '../types/index';

export const useAudioContext = () => {
  const [audioCtx, setAudioCtx] = useState<AudioContextType>({
    isInitialized: false,
    analyser: null,
    mediaStream: null,
    audioContext: null,
    gainNode: null,
  });

  const requestMicrophoneAccess = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false, // Disable AGC to control gain manually
        },
      });

      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;

      const gainNode = context.createGain();
      gainNode.gain.value = 1;

      const source = context.createMediaStreamSource(stream);
      source.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(context.destination);

      setAudioCtx({
        isInitialized: true,
        analyser,
        mediaStream: stream,
        audioContext: context,
        gainNode,
      });

      return true;
    } catch (error) {
      console.error('Microphone access denied or unavailable:', error);
      return false;
    }
  }, []);

  const stopMicrophone = useCallback(() => {
    if (audioCtx.mediaStream) {
      audioCtx.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (audioCtx.audioContext) {
      audioCtx.audioContext.close();
    }
    setAudioCtx({
      isInitialized: false,
      analyser: null,
      mediaStream: null,
      audioContext: null,
      gainNode: null,
    });
  }, [audioCtx]);

  return {
    ...audioCtx,
    requestMicrophoneAccess,
    stopMicrophone,
  };
};

export const useWaveformData = (analyser: AnalyserNode | null) => {
  const [waveformData, setWaveformData] = useState<Uint8Array>(new Uint8Array(512) as Uint8Array<ArrayBuffer>);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const startAnalysis = useCallback(() => {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      setWaveformData(new Uint8Array(dataArray) as Uint8Array<ArrayBuffer>);
    };

    draw();
  }, [analyser]);

  const stopAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  return { waveformData, startAnalysis, stopAnalysis };
};

export const useSilenceDetection = (
  analyser: AnalyserNode | null,
  threshold = 30,
  silenceDuration = 800
) => {
  const [isSilent, setIsSilent] = useState(false);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;

    const checkSilence = () => {
      analyser.getByteTimeDomainData(dataArray);

      // Calculate RMS (root mean square) for amplitude
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const normalized = (dataArray[i] - 128) / 128;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const amplitude = rms * 255; // Scale to 0-255 range

      if (amplitude > threshold) {
        lastActivityRef.current = Date.now();
        setIsSilent(false);
        if (silenceTimeoutRef.current) {
          globalThis.clearTimeout(silenceTimeoutRef.current);
        }
      } else {
        if (Date.now() - lastActivityRef.current > silenceDuration) {
          setIsSilent(true);
        }
      }

      requestAnimationFrame(checkSilence);
    };

    const frameId = requestAnimationFrame(checkSilence);

    return () => {
      cancelAnimationFrame(frameId);
      if (silenceTimeoutRef.current) globalThis.clearTimeout(silenceTimeoutRef.current);
    };
  }, [analyser, threshold, silenceDuration]);

  return isSilent;
};
