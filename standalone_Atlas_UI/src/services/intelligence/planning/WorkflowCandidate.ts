import { WorkflowGraph } from "../../../workflow/model/WorkflowGraph";

export interface WorkflowCandidate {
  id: string;
  name: string;
  graph: WorkflowGraph;
  estimatedDurationMs: number;
  estimatedResources: string[];
  estimatedCostUSD: number;
  estimatedRiskScore: number; // 1-10
  verificationScore: number;  // 1-100
  confidence: number;         // 0-1
  explanation: string;
}
