import { EngineeringRecommendation } from "../decision/EngineeringRecommendation";

export class AdaptiveRecommendationUpdater {
  public update(rec: EngineeringRecommendation): void {
    rec.overallConfidenceScore = Math.max(50, rec.overallConfidenceScore - 5);
    console.log(`[Adaptive Recommendation Updater] Refined recommendation parameters metrics for recommendation ${rec.id}`);
  }
}

export const activeAdaptiveRecommendationUpdater = new AdaptiveRecommendationUpdater();
