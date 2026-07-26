import { PlanningCandidate } from "./PlanGenerator";

export interface TradeoffMetrics {
  accuracyVsCostRatio: number;
  riskRating: "Low" | "Medium" | "High";
}

export class TradeoffAnalyzer {
  public analyze(candidate: PlanningCandidate): TradeoffMetrics {
    const ratio = candidate.expectedAccuracy / (candidate.costEstimateUSD || 1);
    const risk = candidate.complexityScore > 6 ? "Medium" : "Low";

    return {
      accuracyVsCostRatio: ratio,
      riskRating: risk
    };
  }
}

export const activeTradeoffAnalyzer = new TradeoffAnalyzer();
