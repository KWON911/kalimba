import { useCallback, useRef } from 'react';
import type { PointerEvent } from 'react';
import { KALIMBA_NOTES } from '../data/notes';
import type { KalimbaNote, LabelMode } from '../types/kalimba';
import { KalimbaKey } from './KalimbaKey';

interface KalimbaProps {
  activeNotes: Set<string>;
  labelMode: LabelMode;
  haptics: boolean;
  onPlay: (note: KalimbaNote) => void;
  onPointerActiveChange: (noteName: string, pointerId: number, active: boolean) => void;
}

export function Kalimba({ activeNotes, labelMode, haptics, onPlay, onPointerActiveChange }: KalimbaProps) {
  const pointerNotes = useRef(new Map<number, string>());
  const changePointerNote = useCallback((pointerId: number, nextNote: KalimbaNote | undefined) => {
    const previous = pointerNotes.current.get(pointerId);
    if (previous === nextNote?.note) return;
    if (previous) onPointerActiveChange(previous, pointerId, false);
    if (!nextNote) {
      pointerNotes.current.delete(pointerId);
      return;
    }
    pointerNotes.current.set(pointerId, nextNote.note);
    void onPlay(nextNote);
    onPointerActiveChange(nextNote.note, pointerId, true);
  }, [onPlay, onPointerActiveChange]);

  const startPointer = (event: PointerEvent<HTMLButtonElement>, note: KalimbaNote) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    changePointerNote(event.pointerId, note);
    if (haptics && 'vibrate' in navigator) navigator.vibrate(8);
  };

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerNotes.current.has(event.pointerId)) return;
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-note]');
    const note = KALIMBA_NOTES.find((candidate) => candidate.note === target?.dataset.note);
    changePointerNote(event.pointerId, note);
  };

  const clearPointer = (event: PointerEvent<HTMLDivElement>) => changePointerNote(event.pointerId, undefined);

  return (
    <section
      className="kalimba-stage"
      aria-label="17키 칼림바 연주 영역"
      onPointerMove={handleMove}
      onPointerUp={clearPointer}
      onPointerCancel={clearPointer}
    >
      <div className="kalimba-body">
        <div className="brand-mark">KALIMBA <span>17 KEYS</span></div>
        <div className="bridge" aria-hidden="true" />
        <div className="tines">
          {KALIMBA_NOTES.map((note) => (
            <KalimbaKey
              key={note.note}
              note={note}
              labelMode={labelMode}
              active={activeNotes.has(note.note)}
              onPointerDown={startPointer}
            />
          ))}
        </div>
        <div className="sound-hole" aria-hidden="true" />
      </div>
    </section>
  );
}
