export type InnovationType = 
  | "Research" 
  | "Prototype" 
  | "Pilot" 
  | "Productization" 
  | "Transformation";

export type InnovationOutcome = 
  | "Commercialized" 
  | "Internal Adoption" 
  | "Research Complete" 
  | "Cancelled";

export interface InnovationPortfolio {
  innovationId: string;
  title: string;
  organizationId: string;
  innovationType: InnovationType;
  researchArea: string;
  technologyReadinessLevel: number;
  expectedValue: number;
  riskLevel: "High" | "Medium" | "Low";
  innovationOutcome: InnovationOutcome;
  strategicObjectiveId: string;
  status: "Active" | "Completed" | "Suspended";
}
