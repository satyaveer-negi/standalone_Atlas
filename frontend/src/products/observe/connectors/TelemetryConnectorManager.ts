import type { TelemetryConnector } from "./TelemetryConnector";

export class TelemetryConnectorManager {
  private connectors: Map<string, TelemetryConnector> = new Map();
  private activeConnectors: Set<string> = new Set();

  register(connector: TelemetryConnector) {
    this.connectors.set(connector.id, connector);
  }

  startAll() {
    this.connectors.forEach((conn) => {
      try {
        conn.connect();
        this.activeConnectors.add(conn.id);
        console.log(`[TelemetryConnectorManager] 🔌 Started connector: ${conn.name}`);
      } catch (err) {
        console.error(`[TelemetryConnectorManager] Error starting ${conn.id}:`, err);
      }
    });
  }

  stopAll() {
    this.connectors.forEach((conn) => {
      try {
        conn.disconnect();
        this.activeConnectors.delete(conn.id);
      } catch (err) {
        console.error(`[TelemetryConnectorManager] Error stopping ${conn.id}:`, err);
      }
    });
  }

  getActiveCount(): number {
    return this.activeConnectors.size;
  }
}
