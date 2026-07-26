export type RiskClassificationType = 
  | "Operational" 
  | "Functional" 
  | "Cyber" 
  | "Electrical" 
  | "Mechanical" 
  | "Software" 
  | "Environmental";

export type RiskDomainType = 
  | "PowerSystems" 
  | "CFD" 
  | "DigitalTwin" 
  | "Manufacturing" 
  | "Robotics";

export interface RiskCase {
  caseId: string;
  targetAssetId: string;
  riskDescription: string;
  hazardsLinked: string[]; // Linked Hazard IDs
  mitigationPlanId: string;
  initialRiskScore: number;
  residualRiskScore: number;
  riskStatus: "Open" | "Mitigated" | "Accepted" | "Critical";
  riskOwner: string;
  reviewDate: string;
  classification: RiskClassificationType;
  domain: RiskDomainType;
}
