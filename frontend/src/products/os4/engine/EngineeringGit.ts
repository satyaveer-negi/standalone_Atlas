export interface AssetBranch {
  name: string;
  headCommitId: string;
}

export interface AssetCommit {
  id: string;
  parentCommitId?: string;
  message: string;
  timestamp: number;
  author: string;
}

export class EngineeringGit {
  private branches = new Map<string, AssetBranch>();
  private commits = new Map<string, AssetCommit>();

  constructor() {
    const initCommit: AssetCommit = {
      id: "commit-init-v4.0.0",
      message: "Initialize Atlas OS 4.0 Reference Baseline",
      timestamp: Date.now(),
      author: "Platform Guild",
    };
    this.commits.set(initCommit.id, initCommit);
    this.branches.set("main", { name: "main", headCommitId: initCommit.id });
  }

  createBranch(branchName: string, fromBranch = "main"): void {
    const source = this.branches.get(fromBranch);
    if (source) {
      this.branches.set(branchName, { name: branchName, headCommitId: source.headCommitId });
    }
  }

  getBranches(): AssetBranch[] {
    return Array.from(this.branches.values());
  }
}
