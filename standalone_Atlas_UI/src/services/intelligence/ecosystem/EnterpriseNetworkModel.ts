export interface PartnerRelation {
  partnerId: string;
  relationshipType: "Supplier" | "Customer" | "Research" | "Regulatory" | "JointDevelopment";
}

export type PartnerType = "Supplier" | "Customer" | "Regulator" | "ResearchCollaborator";

export type PartnerStatus = "Active" | "Inactive" | "Onboarding";

export interface EnterpriseNetworkModel {
  networkId: string;
  partnerName: string;
  partnerType: PartnerType;
  trustScore: number; // out of 100
  interoperabilityIndex: number; // out of 100
  sharedAssetsCount: number;
  criticality: "Low" | "Medium" | "High";
  connectedPartners: PartnerRelation[];
  status: PartnerStatus;
}
