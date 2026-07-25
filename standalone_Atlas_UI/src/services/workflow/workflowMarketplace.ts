import { WorkflowPackage } from "./workflowRepository";

export interface RemoteMarketplacePackage {
  package: WorkflowPackage;
  signature: string;
  publisherKey: string;
  downloadsCount: number;
}

// 🛒 PROGRAM III.4: WORKFLOW MARKETPLACE (REMOTE DISCOVERY SERVICES)
export class WorkflowMarketplace {
  private remoteCatalog: RemoteMarketplacePackage[] = [];

  constructor() {
    this.seedRemoteCatalog();
  }

  private seedRemoteCatalog() {
    this.remoteCatalog.push({
      package: {
        packageId: "pkg-thermal",
        metadata: {
          packageName: "Thermal Finite Volume Solver",
          author: "aerospace-group",
          domain: "Thermal Dynamics",
          version: "2.1.0",
          status: "Published",
          requiredCapabilities: ["triggerSolver", "editManuscript"],
          created: "2026-07-25"
        },
        definition: {
          workflowId: "wf-thermal",
          name: "Thermal Finite Volume Solver",
          description: "Models heat dissipation coefficients and builds markdown documentation",
          version: "2.1.0",
          tags: ["Thermal", "OpenFOAM"],
          steps: [
            { stepId: "solve", name: "Run Conjugate Heat Transfer Solver", capability: "triggerSolver", state: "Ready", retries: 0 },
            { stepId: "doc", name: "Generate PDF manuscript", capability: "editManuscript", state: "Pending", retries: 0 }
          ],
          dependencies: [
            { from: "solve", to: "doc" }
          ]
        },
        validationPassed: true
      },
      signature: "sig-ok-hash-thermal-9442",
      publisherKey: "key-gold-partner",
      downloadsCount: 1488
    });

    this.remoteCatalog.push({
      package: {
        packageId: "pkg-invalid-hack",
        metadata: {
          packageName: "Malicious Script Runner Pack",
          author: "malicious-user",
          domain: "System Utilities",
          version: "9.9.9",
          status: "Published",
          requiredCapabilities: ["executeScript"],
          created: "2026-07-25"
        },
        definition: {
          workflowId: "wf-hack",
          name: "Malicious Script Runner Pack",
          description: "Runs unverified terminal calls on execution nodes",
          version: "9.9.9",
          tags: ["Hacking", "Shell"],
          steps: [
            { stepId: "hack", name: "Run Script Command Block", capability: "executeScript", state: "Ready", retries: 0 }
          ],
          dependencies: []
        },
        validationPassed: true
      },
      signature: "sig-bad-tampered-hash-883",
      publisherKey: "malicious-user",
      downloadsCount: 2
    });
  }

  public getRemoteCatalog(): RemoteMarketplacePackage[] {
    return [...this.remoteCatalog];
  }
}

export const activeWorkflowMarketplace = new WorkflowMarketplace();
