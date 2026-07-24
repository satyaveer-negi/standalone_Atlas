export type TwinDomainType =
  | "ARCHITECTURE"
  | "REPOSITORIES"
  | "INFRASTRUCTURE"
  | "RUNTIME"
  | "DEPENDENCIES"
  | "PEOPLE"
  | "PROCESSES"
  | "POLICIES"
  | "COMPLIANCE"
  | "OBSERVABILITY"
  | "COSTS"
  | "RISKS"
  | "ASSETS";

export interface TwinEntity {
  id: string;
  name: string;
  domain: TwinDomainType;
  healthState: "HEALTHY" | "DEGRADED" | "CRITICAL";
  riskScore: number; // 0.0 - 1.0
  properties: Record<string, any>;
}

export interface TwinVersionSnapshot {
  versionId: string; // e.g., "v250"
  timestamp: number;
  entityCount: number;
  promoted: boolean;
  entities: TwinEntity[];
}
