export interface KnowledgeRelationship {
  targetDomainId: string;
  relationshipType: "DependsOn" | "Extends" | "Reuses" | "Supersedes";
}

export type IntellectualPropertyType = "Patented" | "OpenSource" | "Proprietary" | "SharedResearch";

export type KnowledgeDomainStatus = "Draft" | "Validated" | "Archived";

export interface KnowledgeNetworkModel {
  domainId: string;
  domainName: string;
  intellectualPropertyType: IntellectualPropertyType;
  expertiseTags: string[];
  maturityLevel: number; // 1 to 5
  knowledgeAssetsCount: number;
  licenseType: string;
  knowledgeRelationships: KnowledgeRelationship[];
  status: KnowledgeDomainStatus;
}
