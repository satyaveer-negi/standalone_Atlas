import { StateProvenance } from "../state/StateVersion";

export interface SyncPayload {
  entityId: string;
  propertyName: string;
  value: any;
  unit: string;
  provenance: StateProvenance;
  confidence: number;
}

export interface SyncAdapter {
  id: string;
  name: string;
  fetchUpdates(): Promise<SyncPayload[]>;
}
