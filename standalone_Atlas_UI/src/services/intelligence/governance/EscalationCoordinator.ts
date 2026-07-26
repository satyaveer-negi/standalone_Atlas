import { EngineeringAction } from "./EngineeringAction";

export class EscalationCoordinator {
  public escalate(action: EngineeringAction): void {
    console.log(`[Escalation Coordinator] WARNING: Escalated Action ID ${action.actionId} to standby chief engineer notification channels.`);
  }
}

export const activeEscalationCoordinator = new EscalationCoordinator();
