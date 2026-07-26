export interface CategorizedConstraint {
  id: string;
  name: string;
  category: "Safety" | "Operational" | "Physical" | "Economic" | "Regulatory" | "Organizational" | "Environmental";
  expression: string;
  limitValue: number;
}

export interface OptimizationObjective {
  id: string;
  propertyName: string;
  mode: "Maximize" | "Minimize" | "Target" | "Maintain";
  targetValue?: number;
  weight: number;
}

export interface EngineeringIntent {
  id: string;
  goal: string;
  context: string;
  entities: string[];
  constraints: CategorizedConstraint[];
  objectives: OptimizationObjective[];
  assumptions: string[];
  priority: "High" | "Medium" | "Low";
  confidence: number;
  validationStatus: "Draft" | "Validated" | "Conflicting" | "Approved";
  provenance: string;
  createdAt: string;
}
