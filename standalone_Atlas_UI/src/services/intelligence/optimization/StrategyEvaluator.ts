import { OrchestrationStrategy } from "../portfolio/SystemOrchestrator";

export interface StrategyEvaluator {
  evaluationId: string;
  portfolioId: string;
  strategy: OrchestrationStrategy;
  performanceScore: number;
  costScore: number;
  resilienceScore: number;
  riskScore: number;
  energyScore: number;
  sustainabilityScore: number;
  overallScore: number;
}
