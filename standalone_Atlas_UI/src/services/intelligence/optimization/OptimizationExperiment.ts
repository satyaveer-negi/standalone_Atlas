export type ExperimentType = 
  | "Simulation" 
  | "Digital Twin" 
  | "Shadow Execution" 
  | "Historical Replay" 
  | "Live Trial";

export type EvaluationStatus = 
  | "Pending" 
  | "Evaluating" 
  | "Succeeded" 
  | "Failed";

export interface OptimizationExperiment {
  experimentId: string;
  recommendationId: string;
  experimentType: ExperimentType;
  baselineMetrics: string[];
  candidateMetrics: string[];
  evaluationStatus: EvaluationStatus;
  winner: "Baseline" | "Candidate";
  confidence: number;
  evidenceSources: string[];
}
