import { OutcomePrediction } from "./EngineeringRecommendation";
import { PlanningResult } from "../planning/PlanningResult";

export class OutcomePredictor {
  public predictOutcome(planningResult: PlanningResult | null): OutcomePrediction {
    if (!planningResult || planningResult.candidates.length === 0) {
      return { predictedDurationMs: 60000, predictedCostUSD: 100, predictedCpuUsagePercent: 50 };
    }

    const top = planningResult.candidates[0];
    
    return {
      predictedDurationMs: top.estimatedDurationMs,
      predictedCostUSD: top.estimatedCostUSD,
      predictedCpuUsagePercent: top.estimatedResources.includes("gpu-node-01") ? 85 : 45
    };
  }
}

export const activeOutcomePredictor = new OutcomePredictor();
