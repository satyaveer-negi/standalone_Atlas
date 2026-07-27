export type OptimizationObjective = 
  | "Cost" 
  | "Performance" 
  | "Resilience" 
  | "Energy" 
  | "Balanced";

export type OptimizationScope = 
  | "Portfolio" 
  | "Mission" 
  | "Organization" 
  | "Enterprise";

export type OptimizationProgramStatus = 
  | "Planning" 
  | "Running" 
  | "Paused" 
  | "Completed";

export interface OptimizationProgram {
  optimizationProgramId: string;
  name: string;
  description: string;
  organizationId: string;
  portfolioIds: string[];
  optimizationObjective: OptimizationObjective;
  optimizationScope: OptimizationScope;
  status: OptimizationProgramStatus;
  createdDate: string;
  lastUpdated: string;
}
