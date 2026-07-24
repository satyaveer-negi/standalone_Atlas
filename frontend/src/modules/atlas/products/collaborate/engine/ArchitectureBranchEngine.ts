export interface ArchitectureBranch {
  id: string;
  name: string;
  baseBranch: string;
  commandCount: number;
}

export interface SemanticGraphDiff {
  addedServicesCount: number;
  modifiedApisCount: number;
  policyChangesCount: number;
}

export const DEMO_BRANCHES: ArchitectureBranch[] = [
  { id: "br-main", name: "main", baseBranch: "main", commandCount: 14 },
  { id: "br-auth", name: "feature/auth-microservice", baseBranch: "main", commandCount: 3 },
];

export class ArchitectureBranchEngine {
  computeSemanticDiff(branchName: string): SemanticGraphDiff {
    if (branchName === "main") {
      return { addedServicesCount: 0, modifiedApisCount: 0, policyChangesCount: 0 };
    }
    return {
      addedServicesCount: 1,
      modifiedApisCount: 2,
      policyChangesCount: 1,
    };
  }
}
