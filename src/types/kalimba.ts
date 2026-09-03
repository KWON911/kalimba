export interface KalimbaNote {
  note: string;
  number: string;
  keyboardCode: string;
  keyboardLabel: string;
  frequency: number;
  file: string;
  order: number;
  lengthRatio: number;
}

export interface VcslSampleRegion {
  sourceFile: string;
  pitchKeycenter: number;
  lokey: number;
  hikey: number;
  offset: number;
  tune: number;
  volume: number;
  seqLength?: number;
  seqPosition?: number;
}
