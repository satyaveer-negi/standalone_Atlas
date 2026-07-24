import type { TwinVersionSnapshot } from "./CanonicalTwinSchema";

export class TwinKernel {
  private versions: TwinVersionSnapshot[] = [
    {
      versionId: "v250",
      timestamp: Date.now() - 86400000,
      entityCount: 142,
      promoted: true,
      entities: [
        { id: "e-rest", name: "TaskViewSet REST API", domain: "ARCHITECTURE", healthState: "HEALTHY", riskScore: 0.12, properties: {} },
        { id: "e-redis", name: "Redis Caching Cluster", domain: "INFRASTRUCTURE", healthState: "DEGRADED", riskScore: 0.88, properties: {} },
      ],
    },
    {
      versionId: "v251-candidate",
      timestamp: Date.now(),
      entityCount: 143,
      promoted: false,
      entities: [
        { id: "e-rest", name: "TaskViewSet REST API", domain: "ARCHITECTURE", healthState: "HEALTHY", riskScore: 0.12, properties: {} },
        { id: "e-redis", name: "Redis Caching Cluster", domain: "INFRASTRUCTURE", healthState: "HEALTHY", riskScore: 0.15, properties: {} },
      ],
    },
  ];

  getActiveVersion(): TwinVersionSnapshot {
    return this.versions.find((v) => v.promoted) || this.versions[0];
  }

  getVersions(): TwinVersionSnapshot[] {
    return this.versions;
  }

  promoteVersion(versionId: string): TwinVersionSnapshot[] {
    this.versions = this.versions.map((v) => ({
      ...v,
      promoted: v.versionId === versionId,
    }));
    return [...this.versions];
  }
}
