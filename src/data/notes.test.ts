import { describe, expect, it } from 'vitest';
import { KALIMBA_NOTES, NOTES_BY_KEYBOARD } from './notes';

describe('kalimba note data', () => {
  it('defines all 17 C-major notes in the physical tine order', () => {
    expect(KALIMBA_NOTES).toHaveLength(17);
    expect(KALIMBA_NOTES.map((note) => note.note)).toEqual([
      'D6', 'B5', 'G5', 'E5', 'C5', 'A4', 'F4', 'D4', 'C4',
      'E4', 'G4', 'B4', 'D5', 'F5', 'A5', 'C6', 'E6',
    ]);
  });

  it('maps the center C4 tine to the physical H key and gives it the longest ratio', () => {
    const center = KALIMBA_NOTES.find((note) => note.note === 'C4');
    expect(center).toMatchObject({ keyboardCode: 'KeyH', keyboardLabel: 'H', number: '1', lengthRatio: 1 });
    expect(NOTES_BY_KEYBOARD.KeyH.note).toBe('C4');
  });

  it('uses only the requested physical-key map', () => {
    expect(Object.fromEntries(KALIMBA_NOTES.map((note) => [note.note, note.keyboardCode]))).toEqual({
      C4: 'KeyH', D4: 'KeyG', E4: 'KeyJ', F4: 'KeyF', G4: 'KeyK', A4: 'KeyD', B4: 'KeyL',
      C5: 'KeyS', D5: 'Semicolon', E5: 'KeyA', F5: 'KeyU', G5: 'KeyR', A5: 'KeyI', B5: 'KeyE',
      C6: 'KeyO', D6: 'KeyW', E6: 'KeyP',
    });
    expect(NOTES_BY_KEYBOARD.KeyQ).toBeUndefined();
    expect(NOTES_BY_KEYBOARD.KeyT).toBeUndefined();
  });
});
