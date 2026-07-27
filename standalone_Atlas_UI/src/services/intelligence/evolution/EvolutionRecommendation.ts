export type EvolutionRecommendationType = 
  | "CapabilityAcquisition" 
  | "ProcessAutomation" 
  | "EcosystemRestructuring" 
  | "StrategicRealignment" 
  | "PolicyOverhaul"
  | "KnowledgeInvestment"
  | "TechnologyRetirement";

export type EvolutionRecommendationStatus = 
  | "Proposed" 
  | "Approved" 
  | "Rejected" 
  | "Applied";

export type EvidenceSourceType = "Optimization" | "Governance" | "Economics" | "Ecosystem" | "Innovation";

export interface EvolutionEvidenceSource {
  sourceId: string;
  sourceType: EvidenceSourceType;
  timestamp: string;
}

export interface EvolutionRecommendationBenefit {
  adaptabilityGain: number;
  transitionRiskReduction: number;
  costSavings: number;
}

export interface EvolutionRecommendation {
  recommendationId: string;
  recommendationType: EvolutionRecommendationType;
  strategyId: string;
  rationale: string;
  confidenceScore: number;
  evidenceSources: EvolutionEvidenceSource[];
  estimatedBenefit: EvolutionRecommendationBenefit;
  recommendationStatus: EvolutionRecommendationStatus;
}
