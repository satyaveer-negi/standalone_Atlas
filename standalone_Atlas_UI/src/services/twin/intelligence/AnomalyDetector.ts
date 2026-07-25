import { TwinState } from "../state/TwinState";

export interface AnomalyRecord {
  propertyName: string;
  value: any;
  thresholdLimit: number;
  timestamp: string;
  severity: "Minor" | "Critical";
}

export class AnomalyDetector {
  public scanForAnomalies(states: TwinState[]): AnomalyRecord[] {
    const anomalies: AnomalyRecord[] = [];

    states.forEach(state => {
      // Heuristic bounds checks: if temperature exceeds 350K or mesh orthogonality score drops below 40%
      if (state.propertyName === "temperature" && typeof state.value === "number" && state.value > 350) {
        anomalies.push({
          propertyName: state.propertyName,
          value: state.value,
          thresholdLimit: 350,
          timestamp: new Date().toISOString(),
          severity: "Critical"
        });
      }

      if (state.propertyName === "meshOrthogonality" && typeof state.value === "number" && state.value < 40) {
        anomalies.push({
          propertyName: state.propertyName,
          value: state.value,
          thresholdLimit: 40,
          timestamp: new Date().toISOString(),
          severity: "Minor"
        });
      }
    });

    return anomalies;
  }
}
