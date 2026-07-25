export type StateProvenance = "Observed" | "Simulated" | "Predicted" | "Estimated";

export interface StateVersion {
  version: number;
  timestamp: string;
  provenance: StateProvenance;
  confidence: number; // 0.0 to 1.0 score
}
