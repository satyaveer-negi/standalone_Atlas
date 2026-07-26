import { EngineeringSituation } from "./EngineeringSituation";
import { activeDecisionIntelligence } from "../decision/DecisionIntelligence";
import { EngineeringRecommendation } from "../decision/EngineeringRecommendation";
import { activeDecisionRepository } from "../repository/DecisionRepository";

export class DecisionReevaluation {
  public reevaluate(situation: EngineeringSituation): EngineeringRecommendation | null {
    const isAnomaly = situation.twinSnapshot.temperature > 350 || situation.twinSnapshot.voltage > 120;
    
    if (isAnomaly && situation.activeRecommendation) {
      console.log("[Decision Re-Evaluation] Operational parameters deviated. Re-running recommendation updates...");
      
      const newRec = activeDecisionIntelligence.formulateAdvice(
        situation.activeRecommendation.intent,
        situation.activeRecommendation.planningResult
      );

      newRec.recommendationSummary = `[Auto Re-evaluated Advice] Real-time anomaly detected (Temp: ${situation.twinSnapshot.temperature}°C). Adjusted Converter limits dynamically.`;
      
      activeDecisionRepository.saveRecommendation(newRec);
      return newRec;
    }

    return null;
  }
}

export const activeDecisionReevaluation = new DecisionReevaluation();
