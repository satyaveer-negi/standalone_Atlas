import { EngineeringSituation } from "../runtime/EngineeringSituation";
import { EngineeringRecommendation } from "../decision/EngineeringRecommendation";
import { GovernancePolicy } from "./GovernancePolicy";
import { ComplianceReport } from "./ComplianceReport";
import { ApprovalChain } from "./ApprovalChain";
import { ExecutionIntent } from "./ExecutionIntent";

export type ActionStatus = 
  | "Draft"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Executed"
  | "RolledBack";

export interface EngineeringAction {
  actionId: string;
  triggerSituation: EngineeringSituation;
  recommendation: EngineeringRecommendation | null;
  governingPolicies: GovernancePolicy[];
  complianceReport: ComplianceReport | null;
  approvalChain: ApprovalChain | null;
  executionIntent: ExecutionIntent | null;
  rollbackPlanText: string;
  verificationPlanText: string;
  status: ActionStatus;
  version: number;
}
