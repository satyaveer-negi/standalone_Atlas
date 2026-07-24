export type VotingPolicy = "SINGLE_REVIEWER" | "MAJORITY" | "CONSENSUS";

export interface ApprovalRequest {
  id: string;
  workflowInstanceId: string;
  stepId: string;
  title: string;
  policy: VotingPolicy;
  reviewers: string[];
  votes: { reviewer: string; approved: boolean }[];
  status: "OPEN" | "APPROVED" | "REJECTED";
}

export class ApprovalEngine {
  castVote(request: ApprovalRequest, reviewer: string, approved: boolean): ApprovalRequest {
    request.votes.push({ reviewer, approved });

    if (request.policy === "SINGLE_REVIEWER" && approved) {
      request.status = "APPROVED";
    } else if (request.votes.length >= request.reviewers.length) {
      const positiveVotes = request.votes.filter((v) => v.approved).length;
      request.status = positiveVotes >= request.reviewers.length / 2 ? "APPROVED" : "REJECTED";
    }

    return { ...request };
  }
}
