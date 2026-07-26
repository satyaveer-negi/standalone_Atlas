import { RiskFactor } from "./EngineeringRecommendation";
import { EngineeringExperience } from "../memory/EngineeringExperience";

export class RiskPredictor {
  public predictRisks(similarExps: EngineeringExperience[]): RiskFactor[] {
    const risks: RiskFactor[] = [];
    const failuresCount = similarExps.filter(e => e.outcomeStatus === "Failure").length;

    if (failuresCount > 0) {
      risks.push({
        category: "Safety",
        probabilityPercent: 75,
        severityScore: 8,
        mitigationAdvice: "Enforce safety voltage limit check gates (recommend mid-point 115V boundaries)."
      });
    } else {
      risks.push({
        category: "Performance",
        probabilityPercent: 15,
        severityScore: 3,
        mitigationAdvice: "Negligible risk. Recommended workflow follows verified execution patterns."
      });
    }

    return risks;
  }
}

export const activeRiskPredictor = new RiskPredictor();
