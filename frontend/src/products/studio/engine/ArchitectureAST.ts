export interface ServiceAST {
  id: string;
  name: string;
  type: "microservice" | "api" | "database" | "cache";
}

export interface RelationshipAST {
  sourceId: string;
  targetId: string;
  type: "calls" | "queries" | "reads_cache";
}

export interface ArchitectureASTModel {
  id: string;
  title: string;
  services: ServiceAST[];
  relationships: RelationshipAST[];
}
