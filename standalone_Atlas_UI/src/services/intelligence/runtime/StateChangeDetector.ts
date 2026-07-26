import { NormalizedTelemetry } from "./TelemetryManager";
import { activeRuntimePolicyEngine } from "./RuntimePolicyEngine";

export interface DetectionAlert {
  parameter: string;
  type: "ThresholdCrossing" | "TrendChange" | "RateOfChange";
  alertText: string;
}

export class StateChangeDetector {
  public detectChanges(normalized: NormalizedTelemetry): DetectionAlert[] {
    const alerts: DetectionAlert[] = [];
    const policy = activeRuntimePolicyEngine.getPolicy();

    // 1. Threshold Crossing check
    if (normalized.absolute.temperature > policy.temperatureLimitMax) {
      alerts.push({
        parameter: "temperature",
        type: "ThresholdCrossing",
        alertText: `Temperature value ${normalized.absolute.temperature} exceeds safety limits (${policy.temperatureLimitMax}).`
      });
    }

    if (normalized.absolute.voltage > policy.voltageLimitMax) {
      alerts.push({
        parameter: "voltage",
        type: "ThresholdCrossing",
        alertText: `Voltage value ${normalized.absolute.voltage} exceeds policy limits (${policy.voltageLimitMax}).`
      });
    }

    // 2. Trend checks
    if (normalized.trends.temperatureTrend === "Rising" && normalized.ratesOfChange.temperatureDeltaPerSec > 1.5) {
      alerts.push({
        parameter: "temperature",
        type: "RateOfChange",
        alertText: `Temperature is rising too rapidly at delta +${normalized.ratesOfChange.temperatureDeltaPerSec}°C/s.`
      });
    }

    return alerts;
  }
}

export const activeStateChangeDetector = new StateChangeDetector();
