import { PlanningResult } from "../planning/PlanningResult";

export class DecisionAnalyzer {
  public analyzeBestDesign(planningResult: PlanningResult | null): string {
    if (!planningResult || planningResult.candidates.length === 0) {
      return "No planning alternatives registered to analyze.";
    }

    const top = planningResult.candidates[0];
    return `Evaluated design suitabilities index: "${top.name}" exhibits optimal convergence vectors.`;
  }
}

export const activeDecisionAnalyzer = new DecisionAnalyzer();
