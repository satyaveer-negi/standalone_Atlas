export type EnvironmentType =
  | "DEVELOPMENT"
  | "TESTING"
  | "STAGING"
  | "PRODUCTION"
  | "DISASTER_RECOVERY";

export interface EnvironmentEntity {
  id: string;
  name: string;
  type: EnvironmentType;
  healthState: "HEALTHY" | "DEGRADED" | "CRITICAL";
  activeDeploymentRevision: string;
  nodeCount: number;
}

export const PREDEFINED_ENVIRONMENTS: EnvironmentEntity[] = [
  {
    id: "env-dev",
    name: "Development Sandbox",
    type: "DEVELOPMENT",
    healthState: "HEALTHY",
    activeDeploymentRevision: "rev-dev-104",
    nodeCount: 3,
  },
  {
    id: "env-staging",
    name: "Staging Cluster (US-East)",
    type: "STAGING",
    healthState: "HEALTHY",
    activeDeploymentRevision: "rev-stag-88",
    nodeCount: 6,
  },
  {
    id: "env-prod",
    name: "Production Multi-Region",
    type: "PRODUCTION",
    healthState: "HEALTHY",
    activeDeploymentRevision: "rev-prod-42",
    nodeCount: 14,
  },
];
