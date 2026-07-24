import type { Entity } from "../../../engine/entity/Entity";

export interface AIContext {
  intent: string;
  graphContext: {
    targetEntities: Entity[];
    traversalPaths: string[];
  };
  runtimeContext?: {
    activeConnectors: number;
    anomaliesCount: number;
  };
  policyContext?: {
    openViolationsCount: number;
    overallScore: number;
  };
  gitContext?: {
    latestCommit: string;
  };
}
