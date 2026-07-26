import { TradeoffParetoFrontier } from "./EngineeringRecommendation";
import { PlanningResult } from "../planning/PlanningResult";

export class TradeoffExplorer {
  public exploreFrontier(planningResult: PlanningResult | null): TradeoffParetoFrontier {
    if (!planningResult || planningResult.candidates.length === 0) {
      return { efficiencyIndex: 80, costAccuracyRatio: 1.2 };
    }

    const hasCFD = planningResult.candidates.some(c => c.id === "cand-high-fidelity");
    
    return {
      efficiencyIndex: hasCFD ? 95 : 82,
      costAccuracyRatio: hasCFD ? 2.1 : 0.8
    };
  }
}

export const activeTradeoffExplorer = new TradeoffExplorer();
