export type EvolutionApprovalStatus = 
  | "Draft" 
  | "UnderReview" 
  | "Approved" 
  | "Rejected" 
  | "Implemented";

export interface PortfolioEvolutionPlan {
  evolutionPlanId: string;
  portfolioId: string;
  currentVersion: number;
  proposedVersion: number;
  changes: string[];
  expectedBenefits: string[];
  approvalStatus: EvolutionApprovalStatus;
  rollbackPlan: string[];
}
