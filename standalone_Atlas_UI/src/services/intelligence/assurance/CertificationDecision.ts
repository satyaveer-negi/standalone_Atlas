export type CertificationApprovalStatus = 
  | "Approved" 
  | "ConditionallyApproved" 
  | "Suspended" 
  | "Revoked";

export interface CertificationDecision {
  decisionId: string;
  packageId: string;
  status: CertificationApprovalStatus;
  rationale: string;
  approverSignature: string;
  decisionVersion: number;
  supersedesDecisionId: string | null;
  timestamp: string;
}
