import { TwinEntity } from "./TwinEntity";
import { TwinRelationship } from "./TwinRelationship";
import { TwinSnapshot } from "./TwinSnapshot";

export interface TwinMetadata {
  id: string;
  name: string;
  domain: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  owner?: string;
}

export type SyncState = "Disconnected" | "Connecting" | "Synchronizing" | "Synchronized" | "OutOfDate" | "Paused" | "Error";

export class DigitalTwin {
  public metadata: TwinMetadata;
  public entities: TwinEntity[] = [];
  public relationships: TwinRelationship[] = [];
  public snapshots: TwinSnapshot[] = [];
  public syncState: SyncState = "Disconnected";

  constructor(id: string, name: string, domain: string) {
    this.metadata = {
      id,
      name,
      domain,
      version: "1.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  public addEntity(entity: TwinEntity): void {
    this.entities.push(entity);
    this.metadata.updatedAt = new Date().toISOString();
  }

  public addRelationship(rel: TwinRelationship): void {
    this.relationships.push(rel);
    this.metadata.updatedAt = new Date().toISOString();
  }

  public captureSnapshot(version: number): TwinSnapshot {
    const stateData: Record<string, any> = {};
    this.entities.forEach(ent => {
      stateData[ent.id] = { ...ent.properties };
    });

    const snapshot: TwinSnapshot = {
      snapshotId: `snap-${Date.now()}-${this.metadata.id}`,
      twinId: this.metadata.id,
      timestamp: new Date().toISOString(),
      stateData,
      version
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }
}
