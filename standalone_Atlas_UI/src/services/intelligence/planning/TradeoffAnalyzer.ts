import { WorkflowCandidate } from "./WorkflowCandidate";
import { TradeoffStats } from "./PlanningResult";

export class TradeoffAnalyzer {
  public analyze(candidate: WorkflowCandidate): TradeoffStats {
    const isHigh = candidate.id === "cand-high-fidelity";

    return {
      performance: isHigh ? 98 : 80,
      cost: isHigh ? 80 : 95,
      executionTimeMs: candidate.estimatedDurationMs,
      resourceUsagePercent: isHigh ? 85 : 30,
      energyKWh: isHigh ? 12.5 : 1.2,
      risk: candidate.estimatedRiskScore,
      reliability: isHigh ? 97 : 82,
      maintainability: isHigh ? 75 : 90,
      verificationReadiness: isHigh ? 99 : 88,
      policyCompliance: 100
    };
  }
}

export const activeTradeoffAnalyzer = new TradeoffAnalyzer();
