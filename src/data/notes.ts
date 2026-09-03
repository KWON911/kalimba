import type { KalimbaNote } from '../types/kalimba';

const notes: Omit<KalimbaNote, 'order' | 'file'>[] = [
  { note: 'D6', number: '2°°', keyboardCode: 'KeyW', keyboardLabel: 'W', frequency: 1174.66, lengthRatio: 0.6 },
  { note: 'B5', number: '7°', keyboardCode: 'KeyE', keyboardLabel: 'E', frequency: 987.77, lengthRatio: 0.64 },
  { note: 'G5', number: '5°', keyboardCode: 'KeyR', keyboardLabel: 'R', frequency: 783.99, lengthRatio: 0.68 },
  { note: 'E5', number: '3°', keyboardCode: 'KeyA', keyboardLabel: 'A', frequency: 659.25, lengthRatio: 0.72 },
  { note: 'C5', number: '1°', keyboardCode: 'KeyS', keyboardLabel: 'S', frequency: 523.25, lengthRatio: 0.76 },
  { note: 'A4', number: '6', keyboardCode: 'KeyD', keyboardLabel: 'D', frequency: 440, lengthRatio: 0.82 },
  { note: 'F4', number: '4', keyboardCode: 'KeyF', keyboardLabel: 'F', frequency: 349.23, lengthRatio: 0.88 },
  { note: 'D4', number: '2', keyboardCode: 'KeyG', keyboardLabel: 'G', frequency: 293.66, lengthRatio: 0.94 },
  { note: 'C4', number: '1', keyboardCode: 'KeyH', keyboardLabel: 'H', frequency: 261.63, lengthRatio: 1 },
  { note: 'E4', number: '3', keyboardCode: 'KeyJ', keyboardLabel: 'J', frequency: 329.63, lengthRatio: 0.94 },
  { note: 'G4', number: '5', keyboardCode: 'KeyK', keyboardLabel: 'K', frequency: 392, lengthRatio: 0.88 },
  { note: 'B4', number: '7', keyboardCode: 'KeyL', keyboardLabel: 'L', frequency: 493.88, lengthRatio: 0.82 },
  { note: 'D5', number: '2°', keyboardCode: 'Semicolon', keyboardLabel: ';', frequency: 587.33, lengthRatio: 0.76 },
  { note: 'F5', number: '4°', keyboardCode: 'KeyU', keyboardLabel: 'U', frequency: 698.46, lengthRatio: 0.72 },
  { note: 'A5', number: '6°', keyboardCode: 'KeyI', keyboardLabel: 'I', frequency: 880, lengthRatio: 0.68 },
  { note: 'C6', number: '1°°', keyboardCode: 'KeyO', keyboardLabel: 'O', frequency: 1046.5, lengthRatio: 0.64 },
  { note: 'E6', number: '3°°', keyboardCode: 'KeyP', keyboardLabel: 'P', frequency: 1318.51, lengthRatio: 0.6 },
];

export const KALIMBA_NOTES: KalimbaNote[] = notes.map((note, order) => ({
  ...note,
  order,
  file: `/sounds/${note.note}.wav`,
}));

export const NOTES_BY_KEYBOARD: Record<string, KalimbaNote> = Object.fromEntries(
  KALIMBA_NOTES.map((note) => [note.keyboardCode, note]),
);
