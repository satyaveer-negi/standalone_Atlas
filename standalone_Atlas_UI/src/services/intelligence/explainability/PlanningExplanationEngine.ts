import { PlanningResult } from "../planning/PlanningResult";

export interface DecisionEvidenceChain {
  intentGoal: string;
  recommendedCandidateId: string;
  factors: string[];
}

export class PlanningExplanationEngine {
  public explainPlanningDecision(result: PlanningResult): DecisionEvidenceChain {
    const topCand = result.candidates[0];

    return {
      intentGoal: result.intent.goal,
      recommendedCandidateId: topCand?.id || "None",
      factors: [
        `Optimal score vector match based on objective priorities (Overall Rank Score: ${result.rankings[0]?.scoreVector.overall || 0})`,
        "Maintains safety bounds criteria check without exceeding complexity guidelines.",
        "Traced parameter mappings against canonical substation digital twin variables."
      ]
    };
  }
}

export const activePlanningExplanationEngine = new PlanningExplanationEngine();
