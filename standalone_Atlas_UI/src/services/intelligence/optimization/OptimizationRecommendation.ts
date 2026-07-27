export type OptimizationRecommendationType = 
  | "ResourceReallocation" 
  | "PolicyChange" 
  | "MissionReschedule" 
  | "InfrastructureScaling" 
  | "WorkflowOptimization" 
  | "KnowledgeRecommendation";

export type ImplementationPriority = "Critical" | "High" | "Medium" | "Low";

export type OptimizationRecommendationStatus = 
  | "New" 
  | "Investigating" 
  | "Approved" 
  | "Discarded";

export interface OptimizationRecommendation {
  recommendationId: string;
  programId: string;
  recommendationType: OptimizationRecommendationType;
  description: string;
  expectedBenefit: string;
  estimatedCost: number;
  confidence: number;
  affectedPortfolioIds: string[];
  affectedMissionIds: string[];
  implementationPriority: ImplementationPriority;
  status: OptimizationRecommendationStatus;
}
