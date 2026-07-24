export interface Provenance {
  creator: string;
  eventSource: string;
  timestamp: number;
  packageOrigin: string;
}

// 📦 FROZEN UNIVERSAL DATA MODEL BASE INTERFACE
export interface AtlasObject {
  id: string;
  type: string;
  version: number;
  provenance: Provenance;
  relationships: { targetId: string; type: string }[];
}

export interface KnowledgeObject extends AtlasObject {
  title: string;
  content: string;
  evidenceList: string[];
}
