import { describe, expect, it } from 'vitest';
import { calculateOffsetSeconds, calculateSfZCents, calculateSfZPlaybackRate, noteToMidi, selectRoundRobinRegion, VCSL_TANZANIA_FILES, VCSL_TANZANIA_REGIONS } from './vcslTanzania';

describe('VCSL Tanzania SFZ mapping', () => {
  it('maps C4 to the official C#3 region with its SFZ values', () => {
    expect(VCSL_TANZANIA_REGIONS.C4).toEqual([{
      sourceFile: 'MBira3_pluck_Main_C#3_k16_50_100_rr2.wav',
      pitchKeycenter: 61, lokey: 60, hikey: 62, offset: 3641, tune: 43, volume: -2.701336,
    }]);
  });

  it('retains E5 and F5 two-position round robins from the SFZ', () => {
    expect(VCSL_TANZANIA_REGIONS.E5.map((region) => region.seqPosition)).toEqual([1, 2]);
    expect(VCSL_TANZANIA_REGIONS.F5.map((region) => region.sourceFile)).toEqual([
      'MBira3_pluck_Main_F4_k21_50_100_rr2.wav',
      'MBira3_pluck_Main_F4_k3_50_100_rr2.wav',
    ]);
  });

  it('applies keycenter and tune in cents when calculating playback rate', () => {
    expect(calculateSfZPlaybackRate(60, VCSL_TANZANIA_REGIONS.C4[0])).toBeCloseTo(2 ** (-57 / 1200));
    expect(calculateSfZPlaybackRate(76, VCSL_TANZANIA_REGIONS.E5[0])).toBeCloseTo(2 ** (70 / 1200));
  });

  it('validates target MIDI, final cents, and playbackRate for every requested note', () => {
    const expected = {
      C4: [60, [-57]], D4: [62, [143]], E4: [64, [51]], F4: [65, [-39]], G4: [67, [-16]],
      A4: [69, [-138]], B4: [71, [62]], C5: [72, [-100]], D5: [74, [-18]], E5: [76, [70, 81]],
      F5: [77, [-34, -20]], G5: [79, [0]], A5: [81, [-140]], B5: [83, [47]], C6: [84, [147]],
      D6: [86, [43]], E6: [88, [0]],
    } as const;
    for (const [note, [targetMidi, cents]] of Object.entries(expected)) {
      expect(noteToMidi(note)).toBe(targetMidi);
      expect(VCSL_TANZANIA_REGIONS[note].map((region) => calculateSfZCents(targetMidi, region))).toEqual(cents);
      expect(VCSL_TANZANIA_REGIONS[note].map((region) => calculateSfZPlaybackRate(targetMidi, region))).toEqual(cents.map((value) => 2 ** (value / 1200)));
    }
  });

  it('converts SFZ offset with the decoded buffer sample rate', () => {
    expect(calculateOffsetSeconds(VCSL_TANZANIA_REGIONS.C4[0], 48_000)).toBe(3641 / 48_000);
    expect(calculateOffsetSeconds(VCSL_TANZANIA_REGIONS.F5[1], 44_100)).toBe(4457 / 44_100);
  });

  it('cycles E5 and F5 independently in deterministic SFZ sequence order', () => {
    expect([0, 1, 2, 3].map((playCount) => selectRoundRobinRegion(VCSL_TANZANIA_REGIONS.E5, playCount).seqPosition)).toEqual([1, 2, 1, 2]);
    expect([0, 1, 2, 3].map((playCount) => selectRoundRobinRegion(VCSL_TANZANIA_REGIONS.F5, playCount).seqPosition)).toEqual([1, 2, 1, 2]);
  });

  it('preloads each of the 16 unique VCSL WAV files once', () => {
    expect(VCSL_TANZANIA_FILES).toHaveLength(16);
    expect(new Set(VCSL_TANZANIA_FILES).size).toBe(16);
  });
});
