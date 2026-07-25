export interface NetworkConnection {
  fromTwinId: string;
  toTwinId: string;
  latencyMs: number;
  bandwidthMbps: number;
}

export class TwinNetwork {
  private connectionsList: NetworkConnection[] = [];

  public addLink(fromTwinId: string, toTwinId: string, latencyMs = 5, bandwidthMbps = 100): void {
    this.connectionsList.push({ fromTwinId, toTwinId, latencyMs, bandwidthMbps });
  }

  public getConnections(): NetworkConnection[] {
    return [...this.connectionsList];
  }

  public getLatency(fromTwinId: string, toTwinId: string): number {
    const link = this.connectionsList.find(c =>
      (c.fromTwinId === fromTwinId && c.toTwinId === toTwinId) ||
      (c.fromTwinId === toTwinId && c.toTwinId === fromTwinId)
    );
    return link ? link.latencyMs : 0;
  }

  public clear(): void {
    this.connectionsList = [];
  }
}

export const activeTwinNetwork = new TwinNetwork();
