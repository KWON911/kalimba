import { useCallback, useEffect, useRef, useState } from 'react';
import { calculateSfZPlaybackRate, noteToMidi, VCSL_TANZANIA_FILES, VCSL_TANZANIA_REGIONS } from '../data/vcslTanzania';
import type { KalimbaNote, VcslSampleRegion } from '../types/kalimba';

type LoadingState = 'idle' | 'loading' | 'ready';

const getAudioContext = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
};

const sampleUrl = (sourceFile: string) => `/sounds/vcsl-tanzania/${encodeURIComponent(sourceFile)}`;

export function useKalimbaAudio() {
  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const buffersRef = useRef(new Map<string, AudioBuffer>());
  const roundRobinCountersRef = useRef(new Map<string, number>());
  const loadingRef = useRef(false);
  const volumeRef = useRef(80);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');

  const getOrCreateContext = useCallback(() => {
    if (contextRef.current) return contextRef.current;
    const context = getAudioContext();
    if (!context) return null;
    const masterGain = context.createGain();
    masterGain.gain.value = volumeRef.current / 100;
    masterGain.connect(context.destination);
    contextRef.current = context;
    masterGainRef.current = masterGain;
    return context;
  }, []);

  const preloadSamples = useCallback(async (context: AudioContext) => {
    if (loadingRef.current || buffersRef.current.size > 0) return;
    loadingRef.current = true;
    setLoadingState('loading');
    await Promise.all(VCSL_TANZANIA_FILES.map(async (sourceFile) => {
      try {
        const response = await fetch(sampleUrl(sourceFile));
        if (!response.ok) return;
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        buffersRef.current.set(sourceFile, buffer);
      } catch {
        // A failed VCSL sample falls back to the oscillator for only that note.
      }
    }));
    loadingRef.current = false;
    setLoadingState('ready');
  }, []);

  useEffect(() => {
    const context = getOrCreateContext();
    if (context) void preloadSamples(context);
  }, [getOrCreateContext, preloadSamples]);

  const setVolume = useCallback((value: number) => {
    volumeRef.current = value;
    const context = contextRef.current;
    const masterGain = masterGainRef.current;
    if (context && masterGain) masterGain.gain.setTargetAtTime(value / 100, context.currentTime, 0.015);
  }, []);

  const selectRegion = (note: KalimbaNote): VcslSampleRegion | undefined => {
    const regions = VCSL_TANZANIA_REGIONS[note.note];
    if (!regions?.length) return undefined;
    const counter = roundRobinCountersRef.current.get(note.note) ?? 0;
    roundRobinCountersRef.current.set(note.note, counter + 1);
    return regions[counter % regions.length];
  };

  const playFallback = (context: AudioContext, masterGain: GainNode, note: KalimbaNote) => {
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
  };

  const playNote = useCallback(async (note: KalimbaNote) => {
    const context = getOrCreateContext();
    const masterGain = masterGainRef.current;
    if (!context || !masterGain) return;
    if (context.state === 'suspended') await context.resume();
    const region = selectRegion(note);
    const buffer = region && buffersRef.current.get(region.sourceFile);
    if (!region || !buffer) {
      playFallback(context, masterGain, note);
      return;
    }
    const source = context.createBufferSource();
    const sampleGain = context.createGain();
    source.buffer = buffer;
    source.playbackRate.value = calculateSfZPlaybackRate(noteToMidi(note.note), region);
    sampleGain.gain.value = 10 ** (region.volume / 20);
    source.connect(sampleGain);
    sampleGain.connect(masterGain);
    source.start(context.currentTime, region.offset / buffer.sampleRate);
  }, [getOrCreateContext]);

  return { playNote, setVolume, loadingState };
}
