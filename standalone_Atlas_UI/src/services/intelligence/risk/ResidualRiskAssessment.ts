export interface ResidualRiskAssessment {
  residualAssessmentId: string;
  linkedRiskCaseId: string;
  mitigationPlanRef: string;
  initialRisk: number;
  residualRisk: number;
  acceptanceRationale: string;
  reviewerName: string;
  approvalDate: string;
}
