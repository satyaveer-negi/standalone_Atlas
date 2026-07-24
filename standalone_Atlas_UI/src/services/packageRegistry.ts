export interface PackageRelease {
  version: string;
  checksum: string;
  signature: string;
  compatibility: string;
  dependencies: string[];
}

export interface RegistryPackage {
  id: string;
  title: string;
  description: string;
  author: string;
  license: string;
  qualityLevel: "Bronze" | "Silver" | "Gold" | "Platinum";
  status: "Installed" | "Active" | "Available";
  releases: PackageRelease[];
}

// 📦 PROGRAM E3: PACKAGE REGISTRY MANAGER
export class PackageRegistry {
  private packages = new Map<string, RegistryPackage>();

  constructor() {
    this.seedRegistry();
  }

  private seedRegistry() {
    this.packages.set("software", {
      id: "software",
      title: "Software Engineering Pack",
      description: "Models repositories, code commits, pipeline states, and sprint issue tracking.",
      author: "UKOP Core Devs",
      license: "Apache-2.0",
      qualityLevel: "Gold",
      status: "Installed",
      releases: [{ version: "1.0.0", checksum: "sha256-a1b2", signature: "trusted-sig-1", compatibility: "1.x", dependencies: [] }]
    });

    this.packages.set("openfoam", {
      id: "openfoam",
      title: "OpenFOAM Fluid Simulation Pack",
      description: "Integrates finite volume fluid solvers, mesh boundaries, and residual metrics.",
      author: "OpenFOAM Foundation",
      license: "GPL-3.0",
      qualityLevel: "Platinum",
      status: "Active",
      releases: [{ version: "1.2.0", checksum: "sha256-c3d4", signature: "trusted-sig-2", compatibility: "1.x", dependencies: ["software"] }]
    });

    this.packages.set("literature", {
      id: "literature",
      title: "Narrative Arc Analysis Pack",
      description: "Models manuscript text structures, character archetypes, and narrative sentiment metrics.",
      author: "Humanities Lab",
      license: "MIT",
      qualityLevel: "Gold",
      status: "Installed",
      releases: [{ version: "2.1.0", checksum: "sha256-e5f6", signature: "trusted-sig-3", compatibility: "1.x", dependencies: [] }]
    });

    this.packages.set("research", {
      id: "research",
      title: "Scientific Citation Network Pack",
      description: "Maps citation networks, dataset backing links, and reviewer reviews.",
      author: "arXiv Labs",
      license: "MIT",
      qualityLevel: "Silver",
      status: "Available",
      releases: [{ version: "1.0.0", checksum: "sha256-g7h8", signature: "trusted-sig-4", compatibility: "1.x", dependencies: ["literature"] }]
    });

    this.packages.set("education", {
      id: "education",
      title: "Adaptive Learning Curriculum Pack",
      description: "Structures courses, competency models, and student learning paths.",
      author: "EdTech Alliance",
      license: "Apache-2.0",
      qualityLevel: "Platinum",
      status: "Available",
      releases: [{ version: "1.5.0", checksum: "sha256-i9j0", signature: "trusted-sig-5", compatibility: "1.x", dependencies: [] }]
    });
  }

  public getPackagesList(): RegistryPackage[] {
    return Array.from(this.packages.values());
  }

  public updatePackageStatus(id: string, status: "Installed" | "Active" | "Available"): void {
    const pkg = this.packages.get(id);
    if (pkg) {
      pkg.status = status;
      console.log(`[Registry] Updated package "${id}" status to: ${status}`);
    }
  }
}

export const activePackageRegistry = new PackageRegistry();
