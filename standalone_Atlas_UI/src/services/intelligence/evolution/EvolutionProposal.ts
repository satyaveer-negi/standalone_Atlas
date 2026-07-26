import { KnowledgeArtifact } from "../synthesis/KnowledgeArtifact";

export type EvolutionProposalStatus = "Proposed" | "Analyzing" | "Experimenting" | "Approved" | "Implemented" | "Rejected";

export interface EvolutionProposal {
  proposalId: string;
  sourceArtifact: KnowledgeArtifact;
  rationale: string;
  suggestedChange: string;
  expectedBenefits: string[];
  quantifiedRisksScore: number; // 0-100
  confidenceScore: number; // 0-100
  status: EvolutionProposalStatus;
  implementationTarget: "CapabilityRegistry" | "GovernancePolicy" | "WorkflowTemplate";
  version: number;
  lineageParentId: string | null;
  createdAt: string;
}
