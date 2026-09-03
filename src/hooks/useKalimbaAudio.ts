import { useCallback, useRef, useState } from 'react';
import { KALIMBA_NOTES } from '../data/notes';
import type { KalimbaNote } from '../types/kalimba';

type LoadingState = 'idle' | 'loading' | 'ready';

const getAudioContext = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
};

export function useKalimbaAudio() {
  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const buffersRef = useRef(new Map<string, AudioBuffer>());
  const loadingRef = useRef(false);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');

  const ensureContext = useCallback(async () => {
    if (!contextRef.current) {
      const context = getAudioContext();
      if (!context) return null;
      const masterGain = context.createGain();
      masterGain.gain.value = 0.8;
      masterGain.connect(context.destination);
      contextRef.current = context;
      masterGainRef.current = masterGain;
    }
    if (contextRef.current.state === 'suspended') await contextRef.current.resume();
    return contextRef.current;
  }, []);

  const preloadSamples = useCallback(async (context: AudioContext) => {
    if (loadingRef.current || buffersRef.current.size > 0) return;
    loadingRef.current = true;
    setLoadingState('loading');
    await Promise.all(KALIMBA_NOTES.map(async (note) => {
      try {
        const response = await fetch(note.file);
        if (!response.ok) return;
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        buffersRef.current.set(note.note, buffer);
      } catch {
        // Individual missing samples intentionally use oscillator fallback.
      }
    }));
    loadingRef.current = false;
    setLoadingState('ready');
  }, []);

  const setVolume = useCallback((value: number) => {
    const context = contextRef.current;
    const masterGain = masterGainRef.current;
    if (context && masterGain) masterGain.gain.setTargetAtTime(value / 100, context.currentTime, 0.015);
  }, []);

  const playNote = useCallback(async (note: KalimbaNote) => {
    const context = await ensureContext();
    const masterGain = masterGainRef.current;
    if (!context || !masterGain) return;
    void preloadSamples(context);
    const buffer = buffersRef.current.get(note.note);
    if (buffer) {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(masterGain);
      source.start();
      return;
    }
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const now = context.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note.frequency, now);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.24, now + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);
    oscillator.connect(envelope);
    envelope.connect(masterGain);
    oscillator.start(now);
    oscillator.stop(now + 1.3);
  }, [ensureContext, preloadSamples]);

  return { playNote, setVolume, loadingState };
}
