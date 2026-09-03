import type { VcslSampleRegion } from '../types/kalimba';

const region = (sourceFile: string, pitchKeycenter: number, lokey: number, hikey: number, offset: number, tune: number, volume: number): VcslSampleRegion => ({ sourceFile, pitchKeycenter, lokey, hikey, offset, tune, volume });
const roundRobin = (sourceFile: string, pitchKeycenter: number, lokey: number, hikey: number, offset: number, tune: number, volume: number, seqPosition: number): VcslSampleRegion => ({ sourceFile, pitchKeycenter, lokey, hikey, offset, tune, volume, seqLength: 2, seqPosition });

// Transcribed exactly from https://github.com/sgossner/VCSL/blob/sfz/Idiophones/Plucked%20Idiophones/Kalimba,%20Tanzania.sfz
export const VCSL_TANZANIA_REGIONS: Record<string, VcslSampleRegion[]> = {
  C4: [region('MBira3_pluck_Main_C#3_k16_50_100_rr2.wav', 61, 60, 62, 3641, 43, -2.701336)],
  D4: [region('MBira3_pluck_Main_C#3_k16_50_100_rr2.wav', 61, 60, 62, 3641, 43, -2.701336)],
  E4: [region('MBira3_pluck_Main_D#3_k7_50_100_rr2.wav', 63, 63, 64, 4680, -49, -1.423243)],
  F4: [region('MBira3_pluck_Main_F3_k17_50_100_rr2.wav', 65, 65, 66, 4667, -39, 3.670689)],
  G4: [region('MBira3_pluck_Main_G3_k6_50_100_rr2.wav', 67, 67, 68, 4686, -16, -4.930473)],
  A4: [region('MBira3_pluck_Main_A#3_k18_50_100_rr2.wav', 70, 69, 71, 4650, -38, 9.913765)],
  B4: [region('MBira3_pluck_Main_A#3_k18_50_100_rr2.wav', 70, 69, 71, 4650, -38, 9.913765)],
  C5: [region('MBira3_pluck_Main_C#4_k5_50_100_rr2.wav', 73, 72, 73, 4393, 0, 5.783757)],
  D5: [region('MBira3_pluck_Main_D4_k19_50_100_rr2.wav', 74, 74, 74, 4513, -18, 0.706556)],
  E5: [
    roundRobin('MBira3_pluck_Main_D#4_k4_50_100_rr2.wav', 75, 75, 76, 4567, -30, -5.160262, 1),
    roundRobin('MBira3_pluck_Main_D#4_k20_50_100_rr2.wav', 75, 75, 76, 4650, -19, -2.752871, 2),
  ],
  F5: [
    roundRobin('MBira3_pluck_Main_F4_k21_50_100_rr2.wav', 77, 77, 78, 4655, -34, -0.477684, 1),
    roundRobin('MBira3_pluck_Main_F4_k3_50_100_rr2.wav', 77, 77, 78, 4457, -20, -1.484838, 2),
  ],
  G5: [region('MBira3_pluck_Main_G4_k22_50_100_rr2.wav', 79, 79, 80, 4647, 0, 2.743160)],
  A5: [region('MBira3_pluck_Main_A#4_k2_50_100_rr2.wav', 82, 81, 82, 4654, -40, 4.505621)],
  B5: [region('MBira3_pluck_Main_B4_k23_50_100_rr2.wav', 83, 83, 84, 4637, 47, -2.931288)],
  C6: [region('MBira3_pluck_Main_B4_k23_50_100_rr2.wav', 83, 83, 84, 4637, 47, -2.931288)],
  D6: [region('MBira3_pluck_Main_C#5_k24_50_100_rr2.wav', 85, 85, 86, 4636, -57, -0.002467)],
  E6: [region('MBira3_pluck_Main_E5_k25_50_100_rr2.wav', 88, 87, 89, 4640, 0, 3.248826)],
};

export const VCSL_TANZANIA_FILES = [...new Set(Object.values(VCSL_TANZANIA_REGIONS).flat().map((sample) => sample.sourceFile))];

export const noteToMidi = (note: string) => {
  const match = /^([A-G])([#b]?)(-?\d+)$/.exec(note);
  if (!match) throw new Error(`Unsupported note: ${note}`);
  const [, letter, accidental, octaveText] = match;
  const semitones: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  return (Number(octaveText) + 1) * 12 + semitones[letter] + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0);
};

export const calculateSfZPlaybackRate = (targetMidi: number, region: VcslSampleRegion) =>
  2 ** ((targetMidi - region.pitchKeycenter + region.tune / 100) / 12);
