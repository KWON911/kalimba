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
      const code = event.code;
      const note = NOTES_BY_KEYBOARD[code];
      if (!note || heldKeys.current.has(code)) return;
      heldKeys.current.add(code);
      void onPlay(note);
      onActiveChange(note.note, true);
    };
    const handleUp = (event: KeyboardEvent) => {
      const code = event.code;
      const note = NOTES_BY_KEYBOARD[code];
      if (!note || !heldKeys.current.delete(code)) return;
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
