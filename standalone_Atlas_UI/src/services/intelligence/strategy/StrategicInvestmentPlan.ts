export type StrategicInvestmentArea = 
  | "Infrastructure" 
  | "AI" 
  | "Simulation" 
  | "Digital Twins" 
  | "Training" 
  | "Research" 
  | "Cybersecurity" 
  | "Automation";

export type InvestmentHorizon = "ShortTerm" | "MidTerm" | "LongTerm";

export type InvestmentPlanApprovalStatus = 
  | "Draft" 
  | "UnderReview" 
  | "Approved" 
  | "Rejected" 
  | "Implemented";

export interface StrategicInvestmentPlan {
  investmentPlanId: string;
  title: string;
  organizationId: string;
  investmentArea: StrategicInvestmentArea;
  estimatedCost: number;
  expectedROI: number;
  expectedImpact: string;
  priority: "High" | "Medium" | "Low";
  investmentHorizon: InvestmentHorizon;
  dependencies: string[];
  strategicObjectiveId: string;
  approvalStatus: InvestmentPlanApprovalStatus;
}
