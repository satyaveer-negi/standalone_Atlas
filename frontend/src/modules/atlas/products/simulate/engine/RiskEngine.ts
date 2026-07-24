export interface WeightedRiskProfile {
  overallRisk: number; // 0-100
  riskCategory: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  architecture: number;
  runtime: number;
  security: number;
  reliability: number;
  performance: number;
}

export class RiskEngine {
  calculateRisk(affectedCount: number): WeightedRiskProfile {
    const riskScore = Math.min(95, 20 + affectedCount * 15);
    const category = riskScore > 70 ? "HIGH" : riskScore > 40 ? "MEDIUM" : "LOW";

    return {
      overallRisk: riskScore,
      riskCategory: category,
      architecture: 18,
      runtime: 24,
      security: 12,
      reliability: 31,
      performance: 15,
    };
  }
}
