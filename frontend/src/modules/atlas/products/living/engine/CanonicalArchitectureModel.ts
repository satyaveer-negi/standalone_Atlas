export interface CAMComponent {
  id: string;
  name: string;
  type: "REST_API" | "DOMAIN_ENTITY" | "UI_VIEW" | "CACHE_TIER";
  sourceLanguage: "TypeScript" | "Python" | "SQL";
}

export interface CAMRelation {
  sourceId: string;
  targetId: string;
  type: "CALLS" | "QUERIES" | "READS_CACHE";
}

export interface CanonicalArchitectureModel {
  version: string;
  components: CAMComponent[];
  relations: CAMRelation[];
}
