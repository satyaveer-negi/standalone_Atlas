import { WorkflowDefinition } from "./workflowDefinition";

export type PackageStatus = "Draft" | "Published" | "Deprecated";

export interface WorkflowPackageMetadata {
  packageName: string;
  author: string;
  domain: string;
  version: string;
  status: PackageStatus;
  requiredCapabilities: string[];
  created: string;
}

// 📦 PROGRAM III.3: DESIGN-TIME WORKFLOW PACKAGE SCHEMA
export interface WorkflowPackage {
  packageId: string;
  metadata: WorkflowPackageMetadata;
  definition: WorkflowDefinition;
  validationPassed: boolean;
}

export class WorkflowRepository {
  private packages = new Map<string, WorkflowPackage>();

  constructor() {
    this.seedPackages();
  }

  private seedPackages() {
    this.packages.set("pkg-cfd", {
      packageId: "pkg-cfd",
      metadata: {
        packageName: "CFD Simulation DAG Pipeline",
        author: "satyaveer-negi",
        domain: "Fluid Dynamics",
        version: "1.2.0",
        status: "Published",
        requiredCapabilities: ["exportMesh", "triggerSolver", "editManuscript"],
        created: "2026-07-25"
      },
      definition: {
        workflowId: "wf-cfd",
        name: "CFD Simulation DAG Pipeline",
        description: "Generates mesh coordinates, runs finite volumes solver, and compiles results",
        version: "1.2.0",
        tags: ["CFD", "OpenFOAM"],
        steps: [
          { stepId: "mesh", name: "Generate Mesh Geometry", capability: "exportMesh", state: "Ready", retries: 0 },
          { stepId: "solve", name: "Numerical Navier-Stokes Solving", capability: "triggerSolver", state: "Pending", retries: 0 },
          { stepId: "report", name: "Compile PDF Documentation Report", capability: "editManuscript", state: "Pending", retries: 0 }
        ],
        dependencies: [
          { from: "mesh", to: "solve" },
          { from: "solve", to: "report" }
        ]
      },
      validationPassed: true
    });

    this.packages.set("pkg-data", {
      packageId: "pkg-data",
      metadata: {
        packageName: "Scientific Script Analysis Pipeline",
        author: "HP",
        domain: "Data Analytics",
        version: "1.0.4",
        status: "Published",
        requiredCapabilities: ["executeScript", "editManuscript"],
        created: "2026-07-24"
      },
      definition: {
        workflowId: "wf-data",
        name: "Scientific Script Analysis Pipeline",
        description: "Runs script arrays computing matrices and exports doc layout file",
        version: "1.0.4",
        tags: ["Python", "ONLYOFFICE"],
        steps: [
          { stepId: "script", name: "Python Array Evaluation", capability: "executeScript", state: "Ready", retries: 0 },
          { stepId: "doc", name: "Document Page Layout Compilation", capability: "editManuscript", state: "Pending", retries: 0 }
        ],
        dependencies: [
          { from: "script", to: "doc" }
        ]
      },
      validationPassed: true
    });
  }

  public getPackagesList(): WorkflowPackage[] {
    return Array.from(this.packages.values());
  }

  public publishPackage(pkg: WorkflowPackage): void {
    pkg.metadata.status = "Published";
    this.packages.set(pkg.packageId, pkg);
    console.log(`[Repository] Published package: "${pkg.packageId}"`);
  }

  public deprecatePackage(packageId: string): void {
    const pkg = this.packages.get(packageId);
    if (pkg) {
      pkg.metadata.status = "Deprecated";
      console.log(`[Repository] Deprecated package: "${packageId}"`);
    }
  }

  public getByFilters(text: string, domain: string): WorkflowPackage[] {
    return Array.from(this.packages.values()).filter(p => {
      const matchText = !text || p.metadata.packageName.toLowerCase().includes(text.toLowerCase()) || p.definition.description.toLowerCase().includes(text.toLowerCase());
      const matchDomain = !domain || p.metadata.domain === domain;
      return matchText && matchDomain;
    });
  }
}

export const activeWorkflowRepository = new WorkflowRepository();
