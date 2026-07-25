export interface TwinSnapshot {
  snapshotId: string;
  twinId: string;
  timestamp: string;
  stateData: Record<string, any>;
  version: number;
}
