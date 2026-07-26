export type ApproverLevel = "Operator" | "Lead" | "Chief" | "System";
export type ApprovalType = "Human" | "Automated" | "Hybrid";

export interface ApprovalChain {
  chainId: string;
  currentLevel: ApproverLevel;
  requiredApprovals: ApproverLevel[];
  approvedBy: string[];
  approvalType: ApprovalType;
  chainStatus: "Draft" | "Pending" | "Approved" | "Rejected";
}
