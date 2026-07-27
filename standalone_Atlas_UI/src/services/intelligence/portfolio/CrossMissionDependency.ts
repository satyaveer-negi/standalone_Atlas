export type DependencyType = 
  | "Data" 
  | "Resource" 
  | "Infrastructure" 
  | "Knowledge" 
  | "Operational" 
  | "Temporal"
  | "Policy";

export type DependencyCriticality = "High" | "Medium" | "Low";

export interface CrossMissionDependency {
  dependencyId: string;
  sourceMissionId: string;
  targetMissionId: string;
  dependencyType: DependencyType;
  criticality: DependencyCriticality;
  blocking: boolean;
  relationshipStrength: number;
  impactRule: string;
}
