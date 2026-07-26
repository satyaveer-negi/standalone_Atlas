export type CertificationScopeType = 
  | "Simulation"
  | "PilotDeployment"
  | "Production"
  | "SafetyCritical";

export interface AssuranceValidityPeriod {
  startDate: string;
  expiryDate: string;
}

export interface AssuranceCase {
  caseId: string;
  targetArtifactId: string;
  claimText: string;
  evidenceIds: string[];
  assuranceScore: number; // 0-100 rating based on evidence completeness
  reviewStatus: "Draft" | "Submitted" | "Certified" | "Revoked";
  scope: CertificationScopeType;
  validityPeriod: AssuranceValidityPeriod;
  timestamp: string;
}
