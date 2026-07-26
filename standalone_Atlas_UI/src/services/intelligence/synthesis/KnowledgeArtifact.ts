export interface KnowledgeArtifact {
  artifactId: string;
  sourceOutcomeIds: string[];
  derivedPatterns: string[];
  confidenceScore: number; // 0-100
  supportingEvidenceCount: number;
  applicableDomains: string[];
  version: number;
  author: "AI Synthesizer" | "Human Architect";
  approvalStatus: "Draft" | "Approved" | "Deprecated";
  createdAt: string;
}
