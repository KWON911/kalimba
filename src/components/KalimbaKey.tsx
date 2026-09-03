import type { CSSProperties, PointerEvent } from 'react';
import type { KalimbaNote } from '../types/kalimba';

interface KalimbaKeyProps {
  note: KalimbaNote;
  active: boolean;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>, note: KalimbaNote) => void;
}

export function KalimbaKey({ note, active, onPointerDown }: KalimbaKeyProps) {
  return (
    <button
      type="button"
      className={`kalimba-key ${active ? 'is-active' : ''}`}
      style={{ '--length-ratio': note.lengthRatio } as CSSProperties}
      data-note={note.note}
      aria-label={`${note.note}, 숫자 ${note.number}, 키보드 ${note.keyboardLabel}`}
      onPointerDown={(event) => onPointerDown(event, note)}
    >
      <span className="tine-label" aria-hidden="true">
        <strong>{note.number}</strong>
        <small>{note.note}</small>
      </span>
      <kbd aria-hidden="true">{note.keyboardLabel}</kbd>
    </button>
  );
}
