export type CollaborationRecommendationType = 
  | "Integration" 
  | "SharedGovernance" 
  | "ResourcePool" 
  | "CompliancePolicy"
  | "KnowledgeSharing"
  | "JointInnovation";

export type CollaborationRecommendationStatus = 
  | "Proposed" 
  | "Approved" 
  | "Rejected" 
  | "Applied";

export interface CollaborationRecommendationBenefit {
  coordinationOverheadReduction: number;
  throughputGain: number;
  riskReduction: number;
}

export interface CollaborationRecommendation {
  recommendationId: string;
  recommendationType: CollaborationRecommendationType;
  partnerId: string;
  rationale: string;
  confidenceScore: number;
  evidenceSources: string[];
  estimatedBenefit: CollaborationRecommendationBenefit;
  recommendationStatus: CollaborationRecommendationStatus;
}
