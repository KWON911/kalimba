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

  it('maps the center C4 tine to S and gives it the longest ratio', () => {
    const center = KALIMBA_NOTES.find((note) => note.note === 'C4');
    expect(center).toMatchObject({ keyboard: 'S', number: '1', lengthRatio: 1 });
    expect(NOTES_BY_KEYBOARD.s.note).toBe('C4');
  });
});
