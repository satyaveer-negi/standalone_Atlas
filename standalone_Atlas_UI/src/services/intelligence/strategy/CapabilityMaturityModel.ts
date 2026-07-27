export type CapabilityMaturityLevel = 
  | "Initial" 
  | "Managed" 
  | "Defined" 
  | "Quantitatively Managed" 
  | "Optimizing";

export interface CapabilityMaturityModel {
  capabilityId: string;
  organizationId: string;
  capabilityName: string;
  currentLevel: CapabilityMaturityLevel;
  targetLevel: CapabilityMaturityLevel;
  assessmentDate: string;
  improvementActions: string[];
  assessmentEvidence: string[];
  confidence: number;
}
