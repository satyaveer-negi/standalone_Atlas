export type PolicyEvolutionRecommendationStatus = 
  | "Proposed" 
  | "Approved" 
  | "Rejected" 
  | "Applied";

export interface PolicyEvolutionRecommendation {
  recommendationId: string;
  policyId: string;
  currentVersion: number;
  recommendedVersion: number;
  rationale: string;
  confidenceScore: number;
  evidenceSources: string[];
  constitutionalPillarsChecked: string[];
  recommendationStatus: PolicyEvolutionRecommendationStatus;
}
