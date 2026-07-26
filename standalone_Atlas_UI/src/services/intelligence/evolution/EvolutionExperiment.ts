export interface EvolutionExperiment {
  experimentId: string;
  proposalId: string;
  testScope: string;
  baselinePerformance: string;
  candidatePerformance: string;
  successMetrics: string[];
  experimentStatus: "Pending" | "Running" | "Success" | "Failure";
}
