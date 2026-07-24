import type { ArchitectureASTModel } from "../../studio/engine/ArchitectureAST";
import type { EnvironmentType } from "./EnvironmentModel";

export interface CanonicalDeploymentPlan {
  id: string;
  sourceAstId: string;
  targetEnvironment: EnvironmentType;
  services: { serviceId: string; name: string; replicas: number; port: number }[];
  networks: { name: string; driver: string }[];
  scaling: { minReplicas: number; maxReplicas: number; cpuThresholdPercent: number };
  provenance: { generatedBy: string; timestamp: number; graphRevision: string };
}

export class DeploymentPlanner {
  createCanonicalPlan(ast: ArchitectureASTModel, env: EnvironmentType): CanonicalDeploymentPlan {
    return {
      id: `plan-${env.toLowerCase()}-${Date.now()}`,
      sourceAstId: ast.id,
      targetEnvironment: env,
      services: ast.services.map((s, idx) => ({
        serviceId: s.id,
        name: s.name,
        replicas: env === "PRODUCTION" ? 3 : 1,
        port: 8000 + idx,
      })),
      networks: [{ name: "atlas-mesh", driver: "overlay" }],
      scaling: {
        minReplicas: env === "PRODUCTION" ? 2 : 1,
        maxReplicas: env === "PRODUCTION" ? 10 : 2,
        cpuThresholdPercent: 80,
      },
      provenance: {
        generatedBy: "Atlas Deployment Planner v5.5",
        timestamp: Date.now(),
        graphRevision: "rev-c4f801a",
      },
    };
  }
}
