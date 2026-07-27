export interface SkillCompetency {
  skillName: string;
  rating: number; // 1 to 5
  criticality: "Low" | "Medium" | "High";
  certifiedHeadcount: number;
}

export interface CapabilityDimension {
  peopleScore: number;
  processScore: number;
  technologyScore: number;
  knowledgeScore: number;
}

export interface OrganizationalCapabilityModel {
  capabilityId: string;
  unitName: string;
  competencies: SkillCompetency[];
  capabilityDimension: CapabilityDimension;
  headcount: number;
  utilizationPercentage: number;
  maturityLevel: "AdHoc" | "Managed" | "Defined" | "Optimizing";
  gapIdentified: string[];
}
