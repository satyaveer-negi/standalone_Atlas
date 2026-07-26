export interface EvolutionImpactAssessment {
  assessmentId: string;
  proposalId: string;
  expectedAccuracyGain: number; // percentage
  expectedRuntimeImpactMs: number;
  safetyImpactText: string;
  compatibilityRisk: "Low" | "Medium" | "High";
  migrationComplexityText: string;
  rollbackComplexityText: string;
  confidenceScore: number;
}
