export type ResiliencePlanStatus = 
  | "Draft" 
  | "Validated" 
  | "Active" 
  | "Testing" 
  | "Deprecated" 
  | "Retired";

export type ResilienceCriticalityType = 
  | "MissionCritical" 
  | "BusinessCritical" 
  | "Standard";

export interface ResiliencePlan {
  planId: string;
  targetAssetId: string;
  rtoMs: number;
  rpoMs: number;
  degradationLevels: number;
  redundancyStrategy: string;
  status: ResiliencePlanStatus;
  criticality: ResilienceCriticalityType;
  availabilityTarget: number;
  owner: string;
  lastValidated: string;
  nextValidation: string;
}
