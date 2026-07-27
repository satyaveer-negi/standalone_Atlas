export type MissionPriority = "High" | "Medium" | "Low";

export type MissionStatus = 
  | "Planned" 
  | "Executing" 
  | "Suspended" 
  | "Completed" 
  | "Aborted";

export type MissionType = 
  | "Simulation" 
  | "Operational" 
  | "Maintenance" 
  | "Emergency";

export interface MissionDefinition {
  missionId: string;
  name: string;
  targetSystemId: string;
  priority: MissionPriority;
  status: MissionStatus;
  owner: string;
  launchTimestamp: string;
  estimatedDurationMs: number;
  missionType: MissionType;
  successCriteria: string[];
  constraints: string[];
  terminationConditions: string[];
}
