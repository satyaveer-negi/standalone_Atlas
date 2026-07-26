import { TelemetrySnapshot } from "./EngineeringSituation";

export interface NormalizedTelemetry {
  absolute: TelemetrySnapshot;
  trends: {
    voltageTrend: "Stable" | "Rising" | "Falling";
    temperatureTrend: "Stable" | "Rising" | "Falling";
  };
  ratesOfChange: {
    voltageDeltaPerSec: number;
    temperatureDeltaPerSec: number;
  };
}

export class TelemetryManager {
  private previousSnapshot: TelemetrySnapshot | null = null;

  public normalize(raw: TelemetrySnapshot): NormalizedTelemetry {
    const prev = this.previousSnapshot || raw;

    const voltageTrend = raw.voltage > prev.voltage ? "Rising" : raw.voltage < prev.voltage ? "Falling" : "Stable";
    const tempTrend = raw.temperature > prev.temperature ? "Rising" : raw.temperature < prev.temperature ? "Falling" : "Stable";

    this.previousSnapshot = raw;

    return {
      absolute: raw,
      trends: {
        voltageTrend,
        temperatureTrend: tempTrend
      },
      ratesOfChange: {
        voltageDeltaPerSec: Number((raw.voltage - prev.voltage).toFixed(2)),
        temperatureDeltaPerSec: Number((raw.temperature - prev.temperature).toFixed(2))
      }
    };
  }
}

export const activeTelemetryManager = new TelemetryManager();
