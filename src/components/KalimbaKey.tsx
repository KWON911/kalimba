import type { CSSProperties, PointerEvent } from 'react';
import type { KalimbaNote, LabelMode } from '../types/kalimba';

interface KalimbaKeyProps {
  note: KalimbaNote;
  labelMode: LabelMode;
  active: boolean;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>, note: KalimbaNote) => void;
}

export function KalimbaKey({ note, labelMode, active, onPointerDown }: KalimbaKeyProps) {
  const showNumber = labelMode === 'number' || labelMode === 'both';
  const showNote = labelMode === 'note' || labelMode === 'both';
  return (
    <button
      type="button"
      className={`kalimba-key ${active ? 'is-active' : ''}`}
      style={{ '--length-ratio': note.lengthRatio } as CSSProperties}
      data-note={note.note}
      aria-label={`${note.note}, 숫자 ${note.number}, 키보드 ${note.keyboard}`}
      onPointerDown={(event) => onPointerDown(event, note)}
    >
      <span className="tine-label" aria-hidden="true">
        {showNumber && <strong>{note.number}</strong>}
        {showNote && <small>{note.note}</small>}
      </span>
      <kbd aria-hidden="true">{note.keyboard}</kbd>
    </button>
  );
}
