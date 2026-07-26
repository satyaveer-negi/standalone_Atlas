import { TelemetrySnapshot } from "./EngineeringSituation";

export class TwinStateMonitor {
  private currentVoltage = 115;
  private currentTemp = 320;
  private currentLoad = 45;

  public pollLiveSnapshot(anomalyTriggered: boolean): TelemetrySnapshot {
    if (anomalyTriggered) {
      // Simulate overheating and high load anomaly
      this.currentVoltage = 122;
      this.currentTemp = 360;
      this.currentLoad = 85;
    } else {
      // Normal nominal states fluctuating slightly
      this.currentVoltage = Number((115 + Math.random() - 0.5).toFixed(1));
      this.currentTemp = Number((320 + Math.random() - 0.5).toFixed(1));
      this.currentLoad = Number((45 + Math.random() - 0.5).toFixed(1));
    }

    return {
      voltage: this.currentVoltage,
      temperature: this.currentTemp,
      loadKW: this.currentLoad
    };
  }
}

export const activeTwinStateMonitor = new TwinStateMonitor();
