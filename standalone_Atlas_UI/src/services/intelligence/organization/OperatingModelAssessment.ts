export type OperatingStructureType = "Product" | "Platform" | "Network" | "Hybrid";

export type OrganizationalValueTrend = "Improving" | "Stable" | "Declining";

export interface OperatingModelAssessment {
  assessmentId: string;
  structureType: OperatingStructureType;
  efficiencyRatio: number;
  decisionLatencyMultiplier: number;
  coordinationOverheadIndex: number;
  organizationalResilienceScore: number;
  organizationalValueTrend: OrganizationalValueTrend;
  assessmentDate: string;
}
