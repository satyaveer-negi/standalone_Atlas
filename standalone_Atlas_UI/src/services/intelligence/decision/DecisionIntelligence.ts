import { EngineeringIntent } from "../intent/EngineeringIntent";
import { PlanningResult } from "../planning/PlanningResult";
import { activeEngineeringMemory } from "../memory/EngineeringMemory";
import { activeOutcomePredictor } from "./OutcomePredictor";
import { activeRiskPredictor } from "./RiskPredictor";
import { activeTradeoffExplorer } from "./TradeoffExplorer";
import { activeConfidenceEstimator } from "./ConfidenceEstimator";
import { activeRecommendationEngine } from "./RecommendationEngine";
import { EngineeringRecommendation } from "./EngineeringRecommendation";

export class DecisionIntelligence {
  public formulateAdvice(intent: EngineeringIntent, planningResult: PlanningResult | null): EngineeringRecommendation {
    // Look up similar experience history references
    const similarExperiences = activeEngineeringMemory.getExperiences().filter(exp => 
      exp.intent.goal.toLowerCase().includes("solar") && intent.goal.toLowerCase().includes("solar") ||
      exp.intent.goal.toLowerCase().includes("wind") && intent.goal.toLowerCase().includes("wind")
    );

    const predictedOutcome = activeOutcomePredictor.predictOutcome(planningResult);
    const riskForecasts = activeRiskPredictor.predictRisks(similarExperiences);
    const tradeoffs = activeTradeoffExplorer.exploreFrontier(planningResult);
    const overallConfidenceScore = activeConfidenceEstimator.estimateConfidence(similarExperiences);
    const recommendationSummary = activeRecommendationEngine.formulateRecommendation(planningResult);

    return {
      id: `rec-${Date.now()}`,
      intent,
      planningResult,
      similarExperiences,
      predictedOutcome,
      riskForecasts,
      tradeoffs,
      overallConfidenceScore,
      recommendationSummary,
      explanationTraceId: `trace-dec-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  }
}

export const activeDecisionIntelligence = new DecisionIntelligence();
