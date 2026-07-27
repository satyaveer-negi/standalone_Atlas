export interface TransformationMilestone {
  id: string;
  description: string;
  status: "Planned" | "InFlight" | "Completed";
  targetDate: string;
  dependencies: string[];
}

export interface TransformationGateway {
  gate: string;
  requiredEvidence: string[];
  approvalAuthority: string;
}

export type TransformationProgramStatus = "Initiated" | "Active" | "Slipped" | "Completed";

export interface TransformationProgram {
  programId: string;
  title: string;
  milestones: TransformationMilestone[];
  transformationGateways: TransformationGateway[];
  targetBenefits: string[];
  risks: string[];
  budget: number;
  status: TransformationProgramStatus;
}
