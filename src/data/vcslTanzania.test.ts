import { describe, expect, it } from 'vitest';
import { calculateSfZPlaybackRate, VCSL_TANZANIA_REGIONS } from './vcslTanzania';

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
});
