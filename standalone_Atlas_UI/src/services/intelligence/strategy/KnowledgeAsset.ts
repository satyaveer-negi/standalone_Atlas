export type KnowledgeType = 
  | "Design Pattern" 
  | "Simulation" 
  | "Workflow" 
  | "Best Practice" 
  | "Policy" 
  | "Playbook" 
  | "Template" 
  | "Algorithm" 
  | "Model";

export type KnowledgeAssetLifecycleState = 
  | "Draft" 
  | "Validated" 
  | "Published" 
  | "Deprecated" 
  | "Archived";

export interface KnowledgeValue {
  engineeringImpact: number;
  reuseSavings: number;
  strategicImportance: number;
}

export interface KnowledgeAsset {
  knowledgeAssetId: string;
  title: string;
  description: string;
  domain: string;
  knowledgeType: KnowledgeType;
  owner: string;
  organizationId: string;
  sourceArtifacts: string[];
  trustScore: number;
  reuseScore: number;
  maturityLevel: number;
  lifecycleState: KnowledgeAssetLifecycleState;
  knowledgeValue: KnowledgeValue;
  strategicObjectiveId: string;
  createdDate: string;
  lastUpdated: string;
}
