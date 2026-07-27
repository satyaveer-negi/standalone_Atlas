export type ConstitutionalEvolutionRecommendationType = 
  | "ConstitutionalAmendment" 
  | "PolicyAlignment" 
  | "StructuralTransformation" 
  | "EcosystemReorganization" 
  | "EnterpriseRefining"
  | "CapabilitySunset"
  | "EnterpriseStandardization";

export type ConstitutionalEvolutionRecommendationStatus = 
  | "Proposed" 
  | "Approved" 
  | "Rejected" 
  | "Applied";

export interface ConstitutionalEvolutionBenefit {
  coherenceGain: number;
  complianceImprovement: number;
  riskReduction: number;
}

export interface ConstitutionalEvolutionRecommendation {
  recommendationId: string;
  recommendationType: ConstitutionalEvolutionRecommendationType;
  rationale: string;
  confidenceScore: number;
  evidenceSources: string[];
  estimatedBenefit: ConstitutionalEvolutionBenefit;
  recommendationStatus: ConstitutionalEvolutionRecommendationStatus;
}
