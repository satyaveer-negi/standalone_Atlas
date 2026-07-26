import { KnowledgeTrustRecord } from "../trust/KnowledgeTrustRecord";
import { ProvenanceCustodyNode } from "../trust/ProvenanceTracker";

export interface TrustMetrics {
  averageTrustScore: number;
  tamperedAssetsDetected: number;
  expiringTrustRecords: number;
}

export class TrustRepository {
  private records = new Map<string, KnowledgeTrustRecord>();
  private hops: ProvenanceCustodyNode[] = [];

  private metrics: TrustMetrics = {
    averageTrustScore: 94.2,
    tamperedAssetsDetected: 0,
    expiringTrustRecords: 0
  };

  public saveRecord(ktr: KnowledgeTrustRecord): void {
    this.records.set(ktr.recordId, ktr);
  }

  public saveHop(hop: ProvenanceCustodyNode): void {
    this.hops.push(hop);
  }

  public getRecordsList(): KnowledgeTrustRecord[] {
    return Array.from(this.records.values());
  }

  public getHopsList(): ProvenanceCustodyNode[] {
    return this.hops;
  }

  public getMetrics(): TrustMetrics {
    return this.metrics;
  }

  public updateMetrics(newMetrics: Partial<TrustMetrics>): void {
    this.metrics = { ...this.metrics, ...newMetrics };
  }

  public clear(): void {
    this.records.clear();
    this.hops = [];
  }
}

export const activeTrustRepository = new TrustRepository();
