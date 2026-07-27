export interface PolicyImpactAssessment {
  impactAssessmentId: string;
  policyId: string;
  targetVersion: number;
  estimatedRiskChange: number;
  projectedCostChange: number;
  projectedNPVDelta: number;
  affectedPortfolioIds: string[];
  affectedPolicyIds: string[];
  safetyBoundaryCheck: "Passed" | "Failed";
  assessedDate: string;
}
