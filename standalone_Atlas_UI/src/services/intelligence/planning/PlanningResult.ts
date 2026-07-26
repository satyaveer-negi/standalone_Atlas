import { EngineeringIntent } from "../intent/EngineeringIntent";
import { WorkflowCandidate } from "./WorkflowCandidate";

export interface ScoreVector {
  overall: number;
  performance: number;
  cost: number;
  risk: number;
  verification: number;
}

export interface TradeoffStats {
  performance: number;
  cost: number;
  executionTimeMs: number;
  resourceUsagePercent: number;
  energyKWh: number;
  risk: number;
  reliability: number;
  maintainability: number;
  verificationReadiness: number;
  policyCompliance: number;
}

export interface PlanningResult {
  intent: EngineeringIntent;
  candidates: WorkflowCandidate[];
  rankings: { candidateId: string; scoreVector: ScoreVector }[];
  tradeoffs: { candidateId: string; stats: TradeoffStats }[];
  recommendationAdvice: string;
  confidence: number;
  explainabilityEvidenceId: string;
  createdAt: string;
}
