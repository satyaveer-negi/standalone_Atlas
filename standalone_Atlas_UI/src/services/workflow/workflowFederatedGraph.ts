export interface FederationRegistryEntry {
  organizationId: string;
  endpoint: string;
  supportedDomains: string[];
  graphVersion: string;
  trustLevel: number;
  capabilities: string[];
  latency?: number;
  availability?: number;
}

export interface FederatedQueryResult {
  entityLabel: string;
  entityType: string;
  sourceOrg: string;
  trustScore: number;
  provenanceDetails: string;
}

// 📡 PROGRAM III.7: FEDERATED GRAPH COORDINATOR (ROUTING & AGGREGATION ENGINE)
export class FederatedGraphCoordinator {
  private registries = new Map<string, FederationRegistryEntry>();

  constructor() {
    this.preseedFederatedOrgs();
  }

  public registerOrg(entry: FederationRegistryEntry): void {
    this.registries.set(entry.organizationId, entry);
  }

  public getRegistries(): FederationRegistryEntry[] {
    return Array.from(this.registries.values());
  }

  public coordinateFederatedQuery(prompt: string): FederatedQueryResult[] {
    const isCfd = prompt.toLowerCase().includes("cfd") || prompt.toLowerCase().includes("fluid") || prompt.toLowerCase().includes("mesh");
    const domain = isCfd ? "Fluid Dynamics" : "Numerical Computation";

    // 1. Query Planner: Select matching orgs
    const targetOrgs = Array.from(this.registries.values()).filter(org => 
      org.supportedDomains.includes(domain) && (org.availability ?? 0) > 80
    );

    const aggregated: FederatedQueryResult[] = [];

    // 2. Dispatch queries to selected organizations and aggregate
    for (const org of targetOrgs) {
      if (org.trustLevel < 0.5) continue; // Skip low trust profiles

      if (isCfd && org.organizationId === "Org-A-Grid") {
        aggregated.push({
          entityLabel: "Remote Mesh Optimizer Tool",
          entityType: "Tool",
          sourceOrg: org.organizationId,
          trustScore: org.trustLevel,
          provenanceDetails: `Retrieved via Federated Client from endpoint: ${org.endpoint}`
        });
      } else if (!isCfd && org.organizationId === "Org-B-Space") {
        aggregated.push({
          entityLabel: "Remote Matrix Compiler",
          entityType: "Tool",
          sourceOrg: org.organizationId,
          trustScore: org.trustLevel,
          provenanceDetails: `Retrieved via Federated Client from endpoint: ${org.endpoint}`
        });
      }
    }

    return aggregated;
  }

  private preseedFederatedOrgs(): void {
    this.registerOrg({
      organizationId: "Org-A-Grid",
      endpoint: "https://grid.org-a.internal/graph",
      supportedDomains: ["Fluid Dynamics"],
      graphVersion: "v1.4",
      trustLevel: 0.95,
      capabilities: ["exportMesh", "solveThermal"],
      latency: 42,
      availability: 99
    });

    this.registerOrg({
      organizationId: "Org-B-Space",
      endpoint: "https://space.org-b.internal/graph",
      supportedDomains: ["Numerical Computation"],
      graphVersion: "v2.0",
      trustLevel: 0.88,
      capabilities: ["executeScript"],
      latency: 85,
      availability: 95
    });

    this.registerOrg({
      organizationId: "Org-C-Cloud",
      endpoint: "https://cloud.org-c.internal/graph",
      supportedDomains: ["Fluid Dynamics"],
      graphVersion: "v1.0",
      trustLevel: 0.40, // Low trust, should be skipped
      capabilities: ["exportMesh"],
      latency: 120,
      availability: 50
    });
  }
}

export const activeFederatedGraphCoordinator = new FederatedGraphCoordinator();
