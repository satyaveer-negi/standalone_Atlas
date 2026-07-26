import { EngineeringIntent } from "../intent/EngineeringIntent";
import { PlanningResult } from "../planning/PlanningResult";
import { EngineeringExperience } from "../memory/EngineeringExperience";

export interface OutcomePrediction {
  predictedDurationMs: number;
  predictedCostUSD: number;
  predictedCpuUsagePercent: number;
}

export interface RiskFactor {
  category: "Resource" | "Safety" | "Performance";
  probabilityPercent: number; // 0-100
  severityScore: number; // 1-10
  mitigationAdvice: string;
}

export interface TradeoffParetoFrontier {
  efficiencyIndex: number;
  costAccuracyRatio: number;
}

export interface EngineeringRecommendation {
  id: string;
  intent: EngineeringIntent;
  planningResult: PlanningResult | null;
  similarExperiences: EngineeringExperience[];
  predictedOutcome: OutcomePrediction;
  riskForecasts: RiskFactor[];
  tradeoffs: TradeoffParetoFrontier;
  overallConfidenceScore: number; // 0-100
  recommendationSummary: string;
  explanationTraceId: string;
  createdAt: string;
}
