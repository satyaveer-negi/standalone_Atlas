export type CognitiveComponentType = 
  | "Planning"
  | "Reasoning"
  | "Retrieval"
  | "Verification"
  | "Governance"
  | "Learning"
  | "KnowledgeSynthesis"
  | "Evolution";

export interface MetaCognitiveAssessment {
  assessmentId: string;
  component: CognitiveComponentType;
  performanceScore: number; // 0-100
  failureModes: string[];
  confidenceTrend: "Stable" | "Upward" | "Downward";
  reasoningQuality: "Nominal" | "Warning" | "Critical";
  improvementOpportunities: string[];
  evidenceSnapshot: string;
  timestamp: string;
}
