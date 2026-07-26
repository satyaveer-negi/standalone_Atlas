import { CorrelatedSituation } from "./CorrelatedSituation";

export interface GovernanceAlert {
  id: string;
  message: string;
  severity: string;
  timestamp: string;
}

export class NotificationCoordinator {
  private alerts: GovernanceAlert[] = [];

  public notifyOperator(correlated: CorrelatedSituation): void {
    if (correlated.severity !== "Normal") {
      const alert: GovernanceAlert = {
        id: `alert-${Date.now()}`,
        message: `Correlated Operational Threat: "${correlated.rootCauseHypothesis}". Triggered recommendation update: ${correlated.recommendationTriggered}`,
        severity: correlated.severity,
        timestamp: new Date().toISOString()
      };
      
      this.alerts.push(alert);
      console.log(`[Notification Coordinator] Governance alert dispatched to Operator HUD: ${alert.message}`);
    }
  }

  public getAlerts(): GovernanceAlert[] {
    return this.alerts;
  }
}

export const activeNotificationCoordinator = new NotificationCoordinator();
