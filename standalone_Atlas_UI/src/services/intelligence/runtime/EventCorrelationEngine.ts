import { EngineeringSituation, SituationSeverity } from "./EngineeringSituation";
import { CorrelatedSituation } from "./CorrelatedSituation";
import { DetectionAlert } from "./StateChangeDetector";

export class EventCorrelationEngine {
  public correlate(situation: EngineeringSituation, alerts: DetectionAlert[]): CorrelatedSituation {
    const isThermalAlert = alerts.some(a => a.parameter === "temperature");
    const isLoadHigh = situation.twinSnapshot.loadKW > 70;
    const isVoltageAlert = alerts.some(a => a.parameter === "voltage");

    let severity: SituationSeverity = "Normal";
    let rootCauseHypothesis = "Normal nominal system operations stable.";
    const relatedEvents: string[] = alerts.map(a => a.alertText);
    const correlationRulesApplied: string[] = [];

    if (isThermalAlert && isLoadHigh && isVoltageAlert) {
      severity = "Emergency";
      rootCauseHypothesis = "Thermal overload caused by high operational demand combined with voltage limits violation.";
      correlationRulesApplied.push("RULE_THERMAL_OVERLOAD_COMPUTE_GRID");
    } else if (isThermalAlert) {
      severity = "Critical";
      rootCauseHypothesis = "Specialist thermal warning. Substation switcher cooling boundaries exceeded.";
      correlationRulesApplied.push("RULE_TEMPERATURE_CEILING");
    } else if (alerts.length > 0) {
      severity = "Warning";
      rootCauseHypothesis = "Advisory parameters limits warning anomaly detected.";
      correlationRulesApplied.push("RULE_LIMITS_VIOLATION");
    }

    return {
      id: `corr-${Date.now()}`,
      situation,
      relatedEvents,
      correlationRulesApplied,
      severity,
      confidenceScore: severity !== "Normal" ? 95 : 100,
      rootCauseHypothesis,
      recommendationTriggered: severity === "Emergency" || severity === "Critical",
      evidenceRefs: ["correlated-telemetry-run", "event-store-replay"]
    };
  }
}

export const activeEventCorrelationEngine = new EventCorrelationEngine();
