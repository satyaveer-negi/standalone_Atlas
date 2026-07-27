export type FitnessTrendDirection = "Improving" | "Stable" | "Declining";

export interface EvolutionAssessment {
  assessmentId: string;
  evaluationPeriod: string;
  adaptabilityIndex: number; // out of 100
  disruptionResilienceScore: number; // out of 100
  evolutionaryVelocity: number; // percentage increase
  organizationalLearningRate: number; // out of 100
  sustainabilityIndex: number; // out of 100
  fitnessTrend: FitnessTrendDirection;
  assessmentDate: string;
}
