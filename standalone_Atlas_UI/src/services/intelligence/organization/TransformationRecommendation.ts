export type TransformationRecommendationType = 
  | "People" 
  | "Process" 
  | "Technology" 
  | "Structure" 
  | "Governance";

export type TransformationRecommendationStatus = 
  | "Proposed" 
  | "Approved" 
  | "Rejected" 
  | "Applied";

export interface ExpectedOrganizationalBenefit {
  executionVelocity: number;
  costReduction: number;
  governanceImprovement: number;
}

export interface TransformationRecommendation {
  recommendationId: string;
  recommendationType: TransformationRecommendationType;
  recommendedStructure: string;
  rationale: string;
  confidenceScore: number;
  evidenceSources: string[];
  targetMaturityTarget: string;
  estimatedBenefit: ExpectedOrganizationalBenefit;
  recommendationStatus: TransformationRecommendationStatus;
}
