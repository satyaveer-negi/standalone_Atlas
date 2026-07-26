export type HazardStateType = 
  | "Identified" 
  | "Analyzed" 
  | "Controlled" 
  | "Verified" 
  | "Closed";

export interface Hazard {
  hazardId: string;
  description: string;
  cause: string;
  trigger: string;
  consequence: string;
  severity: number; // 1-5
  likelihood: number; // 1-5
  detectability: number; // 1-5
  exposure: number; // 1-5
  controls: string[];
  state: HazardStateType;
}
