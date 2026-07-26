import { EngineeringExperience } from "../memory/EngineeringExperience";

export class ConfidenceEstimator {
  public estimateConfidence(similarExps: EngineeringExperience[]): number {
    if (similarExps.length === 0) {
      return 65; // Base confidence without similar project history context
    }

    const successfulCount = similarExps.filter(e => e.outcomeStatus === "Success").length;
    const successRatio = successfulCount / similarExps.length;

    return Math.min(100, Math.floor(75 + successRatio * 25));
  }
}

export const activeConfidenceEstimator = new ConfidenceEstimator();
