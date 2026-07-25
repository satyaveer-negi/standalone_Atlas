import { AnomalyRecord } from "./AnomalyDetector";

export class RecommendationEngine {
  public compileRecommendations(anomalies: AnomalyRecord[]): string[] {
    const list: string[] = [];
    anomalies.forEach(a => {
      if (a.propertyName === "temperature" && a.severity === "Critical") {
        list.push(`Trigger fluid-loop cooling adapter because temperature ${a.value}K exceeds ${a.thresholdLimit}K limit.`);
      }
      if (a.propertyName === "meshOrthogonality" && a.severity === "Minor") {
        list.push(`Re-run CFD grid optimizer to improve mesh orthogonality score above 40%.`);
      }
    });

    if (list.length === 0) {
      list.push("Engineering parameters aligned inside safety bounds. No actions required.");
    }
    return list;
  }
}
