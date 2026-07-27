export type ObjectiveStatus = 
  | "Pending" 
  | "Met" 
  | "Missed" 
  | "Deactivated";

export interface MissionObjective {
  objectiveId: string;
  description: string;
  metricTarget: number;
  metricUnit: string;
  weight: number;
  currentFulfillment: number;
  status: ObjectiveStatus;
  prerequisiteObjectiveIds: string[];
}
