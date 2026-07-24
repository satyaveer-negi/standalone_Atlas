export interface RollbackPlan {
  currentRevision: string;
  targetRollbackRevision: string;
  actions: string[];
  estimatedDowntimeSeconds: number;
}

export class RollbackPlanner {
  generateRollbackPlan(currentRev: string, targetRev: string): RollbackPlan {
    return {
      currentRevision: currentRev,
      targetRollbackRevision: targetRev,
      actions: [
        `Scale down ${currentRev} deployments to 0`,
        `Reactivate ${targetRev} Kubernetes deployment manifest`,
        "Run post-rollback runtime verification check",
      ],
      estimatedDowntimeSeconds: 0,
    };
  }
}
