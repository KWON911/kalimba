export type LabelMode = 'number' | 'note' | 'both' | 'none';

export interface KalimbaNote {
  note: string;
  number: string;
  keyboard: string;
  frequency: number;
  file: string;
  order: number;
  lengthRatio: number;
}
