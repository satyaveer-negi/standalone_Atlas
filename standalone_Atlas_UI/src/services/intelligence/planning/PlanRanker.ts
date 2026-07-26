import { WorkflowCandidate } from "./WorkflowCandidate";
import { EngineeringIntent } from "../intent/EngineeringIntent";
import { ScoreVector } from "./PlanningResult";

export interface RankedCandidate {
  candidate: WorkflowCandidate;
  scoreVector: ScoreVector;
}

export class PlanRanker {
  public rank(candidates: WorkflowCandidate[], intent: EngineeringIntent): RankedCandidate[] {
    return candidates.map(cand => {
      const isHigh = cand.id === "cand-high-fidelity";
      
      const perf = isHigh ? 98 : 80;
      const cost = isHigh ? 75 : 95;
      const risk = isHigh ? 80 : 92;
      const verification = cand.verificationScore;

      // Overall dynamic weighting score calculation
      let overall = 50;
      intent.objectives.forEach(obj => {
        if (obj.propertyName === "solarOutput" || obj.propertyName === "meshOrthogonality") {
          overall += obj.weight * (isHigh ? 45 : 20);
        }
      });

      const scoreVector: ScoreVector = {
        overall: Math.min(100, Math.max(0, overall)),
        performance: perf,
        cost,
        risk,
        verification
      };

      return {
        candidate: cand,
        scoreVector
      };
    }).sort((a, b) => b.scoreVector.overall - a.scoreVector.overall);
  }
}

export const activePlanRanker = new PlanRanker();
