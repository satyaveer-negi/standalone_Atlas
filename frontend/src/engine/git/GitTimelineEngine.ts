export interface GitCommitEvent {
  commitId: string;
  author: string;
  message: string;
  timestamp: number;
  changedEntityIds: string[];
}

export class GitTimelineEngine {
  private commitHistory: GitCommitEvent[] = [];

  addCommit(commit: GitCommitEvent) {
    this.commitHistory.push(commit);
  }

  getEntityHistory(entityId: string): GitCommitEvent[] {
    return this.commitHistory.filter((c) => c.changedEntityIds.includes(entityId));
  }

  getEntityChurn(entityId: string): number {
    return this.getEntityHistory(entityId).length;
  }
}
