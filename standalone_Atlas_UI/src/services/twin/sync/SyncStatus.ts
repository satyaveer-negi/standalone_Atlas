import { SyncState } from "../core/DigitalTwin";

export interface SyncStatus {
  twinId: string;
  status: SyncState;
  lastSyncTime: string;
  message?: string;
}
