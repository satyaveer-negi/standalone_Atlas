export type EcosystemValueTrend = "Improving" | "Stable" | "Declining";

export type ComplianceAuditStatus = "Compliant" | "NonCompliant" | "Pending";

export interface EcosystemAssessment {
  assessmentId: string;
  evaluationPeriod: string;
  collaborationEffectiveness: number; // out of 100
  networkResilienceScore: number; // out of 100
  sharedValuePercentage: number; // out of 100
  knowledgeExchangeScore: number; // out of 100
  complianceAuditStatus: ComplianceAuditStatus;
  ecosystemValueTrend: EcosystemValueTrend;
  assessmentDate: string;
}
