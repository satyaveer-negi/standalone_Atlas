import { PlanningCandidate } from "./PlanGenerator";
import { EngineeringIntent } from "../intent/EngineeringIntent";

export interface RankedCandidate {
  candidate: PlanningCandidate;
  score: number; // 0-100
}

export class PlanRanker {
  public rank(candidates: PlanningCandidate[], intent: EngineeringIntent): RankedCandidate[] {
    return candidates.map(cand => {
      // Basic heuristic score calculation
      let score = 50;

      // Higher accuracy adds to score
      score += (cand.expectedAccuracy - 80) * 2;

      // Higher cost reduces score
      score -= (cand.costEstimateUSD / 10);

      // Objective weights adjustment
      intent.objectives.forEach(obj => {
        if (obj.mode === "Maximize" && cand.expectedAccuracy > 90) {
          score += obj.weight * 10;
        }
      });

      return {
        candidate: cand,
        score: Math.min(100, Math.max(0, score))
      };
    }).sort((a, b) => b.score - a.score);
  }
}

export const activePlanRanker = new PlanRanker();
