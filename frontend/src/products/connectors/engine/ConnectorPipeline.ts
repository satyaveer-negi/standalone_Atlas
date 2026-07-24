import type { BaseConnector, ExternalNormalizedEvent } from "./BaseConnector";

export class ConnectorPipeline {
  private connectors: BaseConnector[] = [];

  registerConnector(connector: BaseConnector) {
    this.connectors.push(connector);
  }

  runFullSync(): ExternalNormalizedEvent[] {
    const allEvents: ExternalNormalizedEvent[] = [];
    this.connectors.forEach((conn) => {
      if (conn.status === "CONNECTED") {
        allEvents.push(...conn.syncEvents());
      }
    });
    return allEvents;
  }

  getConnectors(): BaseConnector[] {
    return this.connectors;
  }
}
