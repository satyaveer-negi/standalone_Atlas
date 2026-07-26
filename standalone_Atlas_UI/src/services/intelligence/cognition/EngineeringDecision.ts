import { PlanningCandidate } from "../planning/PlanGenerator";

export interface EngineeringDecision {
  id: string;
  reviewId: string;
  selectedWorkflowCandidate: PlanningCandidate | null;
  approvalStatus: "Draft" | "Approved" | "PolicyViolation";
  confidenceIndex: number;
  approvedBy: string;
  timestamp: string;
}
