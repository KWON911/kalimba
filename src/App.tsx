import { useCallback, useState } from 'react';
import { Controls } from './components/Controls';
import { Kalimba } from './components/Kalimba';
import { PortraitNotice } from './components/PortraitNotice';
import { useKalimbaAudio } from './hooks/useKalimbaAudio';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useOrientation } from './hooks/useOrientation';
import type { KalimbaNote, LabelMode } from './types/kalimba';

export default function App() {
  const [volume, setVolume] = useState(80);
  const [labelMode, setLabelMode] = useState<LabelMode>('both');
  const [haptics, setHaptics] = useState(false);
  const [activePointers, setActivePointers] = useState<Map<string, Set<number>>>(new Map());
  const [keyboardNotes, setKeyboardNotes] = useState(new Set<string>());
  const { playNote, setVolume: setAudioVolume, loadingState } = useKalimbaAudio();
  const isNarrowPortrait = useOrientation();
  const handlePlay = useCallback((note: KalimbaNote) => { void playNote(note); }, [playNote]);
  const handlePointerActiveChange = useCallback((noteName: string, pointerId: number, active: boolean) => {
    setActivePointers((current) => {
      const next = new Map(current);
      const pointerSet = new Set(next.get(noteName));
      if (active) pointerSet.add(pointerId); else pointerSet.delete(pointerId);
      if (pointerSet.size) next.set(noteName, pointerSet); else next.delete(noteName);
      return next;
    });
  }, []);
  const handleKeyboardActiveChange = useCallback((noteName: string, active: boolean) => {
    setKeyboardNotes((current) => {
      const next = new Set(current);
      if (active) next.add(noteName); else next.delete(noteName);
      return next;
    });
  }, []);
  useKeyboardControls({ onPlay: handlePlay, onActiveChange: handleKeyboardActiveChange });
  const activeNotes = new Set([...activePointers.keys(), ...keyboardNotes]);
  const handleVolumeChange = (value: number) => { setVolume(value); setAudioVolume(value); };
  return <main className="app-shell">
    <Controls volume={volume} labelMode={labelMode} haptics={haptics} loading={loadingState === 'loading'} onVolumeChange={handleVolumeChange} onLabelModeChange={setLabelMode} onHapticsChange={setHaptics} />
    <Kalimba activeNotes={activeNotes} labelMode={labelMode} haptics={haptics} onPlay={handlePlay} onPointerActiveChange={handlePointerActiveChange} />
    <p className="hint">화면을 터치하거나 <kbd>Q</kbd>–<kbd>;</kbd> 키로 연주하세요.</p>
    <PortraitNotice visible={isNarrowPortrait} />
  </main>;
}
