export type MitigationImplementationStatus = 
  | "Planned" 
  | "InEffect" 
  | "Decommissioned";

export interface MitigationPlan {
  mitigationPlanId: string;
  preventiveControls: string[];
  detectiveControls: string[];
  correctiveControls: string[];
  verificationActivities: string[];
  monitoringRules: string[];
  residualRiskTarget: number;
  implementationStatus: MitigationImplementationStatus;
  responsibleOwner: string;
  verificationCompletionDate: string;
}
