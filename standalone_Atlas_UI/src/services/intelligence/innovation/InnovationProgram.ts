export interface InnovationMilestone {
  id: string;
  description: string;
  status: "Planned" | "Active" | "Completed";
  targetDate: string;
  dependencies: string[];
}

export interface InnovationGateway {
  gateName: string;
  requiredArtifacts: string[];
  approvalAuthority: string;
  artifactsPresent: string[];
}

export type InnovationLifecycleState = 
  | "Idea" 
  | "Research" 
  | "Prototype" 
  | "Pilot" 
  | "Industrialization" 
  | "Commercialized";

export type InnovationProgramStatus = "Active" | "Completed" | "Suspended";

export interface InnovationProgram {
  programId: string;
  title: string;
  technologyReadinessLevel: number; // 1 to 9
  innovationLifecycle: InnovationLifecycleState;
  objectives: string[];
  milestones: InnovationMilestone[];
  innovationGateways: InnovationGateway[];
  budget: number;
  status: InnovationProgramStatus;
}
