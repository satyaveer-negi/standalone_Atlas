import { EngineeringDeliberation } from "./EngineeringDeliberation";
import { EngineeringReview } from "./EngineeringReview";
import { EngineeringDecision } from "./EngineeringDecision";
import { PlanningCandidate } from "../planning/PlanGenerator";

export class DecisionCoordinator {
  public compileDecision(
    review: EngineeringReview,
    selectedCandidate: PlanningCandidate | null,
    approvedBy: string
  ): EngineeringDecision {
    const isApproved = review.consensusStats.agreementScore >= 75;

    return {
      id: `dec-${Date.now()}`,
      reviewId: review.id,
      selectedWorkflowCandidate: selectedCandidate,
      approvalStatus: isApproved ? "Approved" : "PolicyViolation",
      confidenceIndex: review.consensusStats.confidenceScore / 100,
      approvedBy,
      timestamp: new Date().toISOString()
    };
  }
}

export const activeDecisionCoordinator = new DecisionCoordinator();
