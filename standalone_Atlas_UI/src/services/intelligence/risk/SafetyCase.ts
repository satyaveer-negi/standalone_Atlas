export interface SafetyCase {
  safetyCaseId: string;
  safetyClaim: string;
  supportingEvidence: string[];
  assuranceReferences: string[]; // Links to AssuranceCase
  riskAssessments: string[]; // Links to RiskAssessment
  mitigationEvidence: string[];
  residualRisk: number;
  acceptanceCriteria: string;
  approvalStatus: "Draft" | "Submitted" | "Approved" | "Rejected";
}
