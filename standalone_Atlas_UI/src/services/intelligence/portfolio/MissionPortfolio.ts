export type PortfolioPriority = "High" | "Medium" | "Low";

export type PortfolioStatus = 
  | "Planning" 
  | "Active" 
  | "Optimizing" 
  | "Completed" 
  | "Archived";

export interface MissionPortfolio {
  portfolioId: string;
  name: string;
  description: string;
  owner: string;
  organizationId: string;
  priority: PortfolioPriority;
  status: PortfolioStatus;
  missionIds: string[];
  portfolioObjectives: string[];
  strategicGoals: string[];
  portfolioConstraints: string[];
  portfolioKPIs: string[];
  createdDate: string;
  lastUpdated: string;
}
