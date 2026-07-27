export interface CollaborationMilestone {
  id: string;
  description: string;
  status: "Planned" | "Active" | "Completed";
  targetDate: string;
  dependencies: string[];
}

export interface SharedResource {
  resourceType: string;
  allocatedQuantity: number;
  capacityLimit: number;
}

export interface EcosystemGovernanceModel {
  leadOrganization: string;
  participatingOrganizations: string[];
  steeringCommittee: string[];
}

export type CollaborationProgramStatus = "Initiated" | "Active" | "Completed" | "Suspended";

export interface CollaborationProgram {
  programId: string;
  title: string;
  objectives: string[];
  milestones: CollaborationMilestone[];
  sharedResources: SharedResource[];
  governanceModel: EcosystemGovernanceModel;
  status: CollaborationProgramStatus;
}
