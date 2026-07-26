export interface LearningMetricsWeights {
  solverAccuracyWeight: number;
  computeCostWeight: number;
  safetyMarginWeight: number;
}

export class RecommendationLearner {
  private activeWeights: LearningMetricsWeights = {
    solverAccuracyWeight: 0.7,
    computeCostWeight: 0.3,
    safetyMarginWeight: 0.8
  };

  public learnFromOutcome(outcome: "Success" | "Failure", verificationScore: number): void {
    if (outcome === "Success" && verificationScore > 90) {
      // Increase accuracy priority
      this.activeWeights.solverAccuracyWeight = Math.min(1.0, this.activeWeights.solverAccuracyWeight + 0.05);
      console.log(`[Recommendation Learner] Improved solver accuracy weighting to ${this.activeWeights.solverAccuracyWeight}`);
    } else if (outcome === "Failure") {
      // Increase safety limits priority
      this.activeWeights.safetyMarginWeight = Math.min(1.0, this.activeWeights.safetyMarginWeight + 0.1);
      console.log(`[Recommendation Learner] Raised safety margin guidelines weight to ${this.activeWeights.safetyMarginWeight}`);
    }
  }

  public getWeights(): LearningMetricsWeights {
    return this.activeWeights;
  }
}

export const activeRecommendationLearner = new RecommendationLearner();
