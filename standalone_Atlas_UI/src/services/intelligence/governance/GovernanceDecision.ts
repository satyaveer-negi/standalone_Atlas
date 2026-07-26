import { GovernancePolicy } from "./GovernancePolicy";
import { ComplianceReport } from "./ComplianceReport";

export type AuthorizationStatus = "Approved" | "ApprovalRequired" | "Rejected" | "Deferred" | "Escalated";

export interface GovernanceDecision {
  decisionId: string;
  actionId: string;
  policyEvaluated: GovernancePolicy;
  complianceReport: ComplianceReport;
  authorization: AuthorizationStatus;
  safetyConstraintsChecked: string[];
  explanation: string;
  timestamp: string;
}
