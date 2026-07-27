import type { EngineeringRecommendation } from "../decision/EngineeringRecommendation";

export class DecisionRepository {
  private recommendations = new Map<string, EngineeringRecommendation>();

  public saveRecommendation(rec: EngineeringRecommendation): void {
    this.recommendations.set(rec.id, rec);
    console.log(`[Decision Repository] Saved recommendation aggregate ID ${rec.id}`);
  }

  public getRecommendation(id: string): EngineeringRecommendation | undefined {
    return this.recommendations.get(id);
  }

  public clear(): void {
    this.recommendations.clear();
  }
}

export const activeDecisionRepository = new DecisionRepository();
