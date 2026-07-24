export type EntityType =
  | "repository"
  | "system"
  | "module"
  | "component"
  | "file"
  | "function"
  | "api"
  | "database"
  | "container"
  | "test";

export interface EntityRelationship {
  targetId: string;
  relation: "imports" | "calls" | "implements" | "tests" | "queries" | "dependsOn";
}

export interface EntityDiagnostics {
  complexity: number;
  testCoverage: number;
  securityScore: number;
  couplingRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface EntityRuntimeData {
  status: "idle" | "running" | "warning" | "error";
  cpuPercent?: number;
  memoryMb?: number;
  lastLatencyMs?: number;
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  position: [number, number, number];
  relationships: EntityRelationship[];
  diagnostics: EntityDiagnostics;
  runtime?: EntityRuntimeData;
  metadata?: Record<string, any>;
}
