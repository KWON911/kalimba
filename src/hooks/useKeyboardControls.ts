import { useEffect, useRef } from 'react';
import { NOTES_BY_KEYBOARD } from '../data/notes';
import type { KalimbaNote } from '../types/kalimba';

interface KeyboardOptions {
  onPlay: (note: KalimbaNote) => void;
  onActiveChange: (noteName: string, active: boolean) => void;
}

const isTypingTarget = (target: EventTarget | null) => target instanceof HTMLElement &&
  (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);

export function useKeyboardControls({ onPlay, onActiveChange }: KeyboardOptions) {
  const heldKeys = useRef(new Set<string>());
  useEffect(() => {
    const handleDown = (event: KeyboardEvent) => {
      if (event.repeat || isTypingTarget(event.target)) return;
      const key = event.key.toLowerCase();
      const note = NOTES_BY_KEYBOARD[key];
      if (!note || heldKeys.current.has(key)) return;
      heldKeys.current.add(key);
      void onPlay(note);
      onActiveChange(note.note, true);
    };
    const handleUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const note = NOTES_BY_KEYBOARD[key];
      if (!note || !heldKeys.current.delete(key)) return;
      onActiveChange(note.note, false);
    };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [onActiveChange, onPlay]);
}
