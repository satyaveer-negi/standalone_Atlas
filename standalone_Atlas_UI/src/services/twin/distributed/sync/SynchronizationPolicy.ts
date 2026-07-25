import { ConflictResolutionPolicy } from "./ConflictResolver";

export interface SynchronizationPolicy {
  pollIntervalMs: number;
  maxRetries: number;
  conflictPolicy: ConflictResolutionPolicy;
}
