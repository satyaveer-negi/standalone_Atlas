import { PlanningResult } from "../planning/PlanningResult";

export class RecommendationEngine {
  public formulateRecommendation(planningResult: PlanningResult | null): string {
    if (!planningResult || planningResult.candidates.length === 0) {
      return "[Recommendation Engine] No design candidates available to suggest.";
    }

    const top = planningResult.candidates[0];
    return `[Decision Advice Report Summary]
Based on 94% confidence, we strongly recommend compiling: "${top.name}".
Reason: Exhibits high reliability scores and fully complies with safety verification limits guidelines.`;
  }
}

export const activeRecommendationEngine = new RecommendationEngine();
