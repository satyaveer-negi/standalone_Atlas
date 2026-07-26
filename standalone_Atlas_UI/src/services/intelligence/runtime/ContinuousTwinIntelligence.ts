import { activeTwinStateMonitor } from "./TwinStateMonitor";
import { activeTelemetryManager } from "./TelemetryManager";
import { activeStateChangeDetector } from "./StateChangeDetector";
import { activeEventCorrelationEngine } from "./EventCorrelationEngine";
import { activeContinuousAssessment } from "./ContinuousAssessment";
import { activeDecisionReevaluation } from "./DecisionReevaluation";
import { activeNotificationCoordinator } from "./NotificationCoordinator";
import { EngineeringSituation, TelemetrySnapshot } from "./EngineeringSituation";
import { CorrelatedSituation } from "./CorrelatedSituation";
import { EngineeringRecommendation } from "../decision/EngineeringRecommendation";

export class ContinuousTwinIntelligence {
  public reassess(
    anomalyTriggered: boolean,
    activeRec: EngineeringRecommendation | null
  ): { situation: EngineeringSituation; correlated: CorrelatedSituation; reevaluatedRec: EngineeringRecommendation | null } {
    const rawSnapshot = activeTwinStateMonitor.pollLiveSnapshot(anomalyTriggered);
    const normalized = activeTelemetryManager.normalize(rawSnapshot);

    const sitId = `sit-${Date.now()}`;
    const situation: EngineeringSituation = {
      id: sitId,
      twinSnapshot: rawSnapshot,
      activeRecommendation: activeRec,
      activeWorkflowId: activeRec?.planningResult?.candidates[0]?.id || "wf-none",
      liveConstraintsChecked: [],
      safetyStatus: "Passed",
      severity: "Normal",
      lifecycle: "Detected",
      alerts: [],
      runtimeMetrics: {
        cpuPercent: anomalyTriggered ? 78 : 42,
        memoryMb: 128
      },
      timestamp: new Date().toISOString(),
      situationVersion: 1
    };

    // 1. Continuous Assessment
    activeContinuousAssessment.assess(situation);
    situation.lifecycle = "Assessed";

    // 2. Change detection & Event Correlation
    const alerts = activeStateChangeDetector.detectChanges(normalized);
    const correlated = activeEventCorrelationEngine.correlate(situation, alerts);
    situation.lifecycle = "Correlated";
    situation.severity = correlated.severity;

    // 3. Notification & Decision Re-Evaluation
    activeNotificationCoordinator.notifyOperator(correlated);
    
    let reevaluatedRec: EngineeringRecommendation | null = null;
    if (correlated.recommendationTriggered) {
      reevaluatedRec = activeDecisionReevaluation.reevaluate(situation);
      situation.lifecycle = "RecommendationUpdated";
    }

    return { situation, correlated, reevaluatedRec };
  }
}

export const activeContinuousTwinIntelligence = new ContinuousTwinIntelligence();
