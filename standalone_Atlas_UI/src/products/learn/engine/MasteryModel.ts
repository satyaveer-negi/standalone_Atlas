export interface MasteryProfile {
  overallMastery: number; // 0-100%
  architecture: number;
  navigation: number;
  runtime: number;
  policies: number;
  documentation: number;
}

export class MasteryModel {
  computeMastery(completedCount: number): MasteryProfile {
    const base = Math.min(100, 40 + completedCount * 30);

    return {
      overallMastery: base,
      architecture: Math.min(100, base + 5),
      navigation: Math.min(100, base + 10),
      runtime: Math.min(100, base - 5),
      policies: Math.min(100, base),
      documentation: Math.min(100, base + 8),
    };
  }
}
