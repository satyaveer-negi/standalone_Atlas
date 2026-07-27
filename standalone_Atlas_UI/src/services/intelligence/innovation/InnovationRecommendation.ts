export type InnovationRecommendationType = 
  | "TechnologyTransfer" 
  | "JointR&D" 
  | "StandardsAlignment" 
  | "IPLicensing" 
  | "ExpertiseExchange"
  | "OpenInnovation"
  | "KnowledgeMarketplace";

export type InnovationRecommendationStatus = 
  | "Proposed" 
  | "Approved" 
  | "Rejected" 
  | "Applied";

export interface InnovationRecommendationBenefit {
  maturityGainTRL: number;
  reuseSavings: number;
  coordinationOverheadReduction: number;
}

export interface InnovationRecommendation {
  recommendationId: string;
  recommendationType: InnovationRecommendationType;
  domainId: string;
  rationale: string;
  confidenceScore: number;
  evidenceSources: string[];
  estimatedBenefit: InnovationRecommendationBenefit;
  recommendationStatus: InnovationRecommendationStatus;
}
