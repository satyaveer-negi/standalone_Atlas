export type GovernancePerformanceTrend = "Improving" | "Stable" | "Declining";

export interface GovernancePerformanceAssessment {
  assessmentId: string;
  evaluationPeriod: string;
  complianceRate: number;
  missionSuccessCorrelation: number;
  realizedValueAlignment: number;
  averageDecisionLatencyMs: number;
  effectivenessScore: number;
  trend: GovernancePerformanceTrend;
  bottlenecks: string[];
}
