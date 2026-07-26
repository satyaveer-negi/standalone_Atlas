import { EngineeringAction } from "../governance/EngineeringAction";
import { GovernanceDecision } from "../governance/GovernanceDecision";
import { GovernanceEvent } from "../governance/GovernanceEvent";

export interface GovernanceMetrics {
  approvalLatencyMs: number;
  complianceRatePercent: number;
  safetyInterlockCount: number;
  rollbackRatePercent: number;
}

export class EngineeringActionRepository {
  private actions = new Map<string, EngineeringAction>();
  private decisions = new Map<string, GovernanceDecision>();
  private events: GovernanceEvent[] = [];

  private metrics: GovernanceMetrics = {
    approvalLatencyMs: 15000,
    complianceRatePercent: 98.4,
    safetyInterlockCount: 2,
    rollbackRatePercent: 1.2
  };

  public saveAction(action: EngineeringAction): void {
    this.actions.set(action.actionId, action);
  }

  public saveDecision(dec: GovernanceDecision): void {
    this.decisions.set(dec.decisionId, dec);
  }

  public addEvent(evt: GovernanceEvent): void {
    this.events.push(evt);
  }

  public getActionsList(): EngineeringAction[] {
    return Array.from(this.actions.values());
  }

  public getDecisionsList(): GovernanceDecision[] {
    return Array.from(this.decisions.values());
  }

  public getEventsList(): GovernanceEvent[] {
    return this.events;
  }

  public getMetrics(): GovernanceMetrics {
    return this.metrics;
  }

  public updateMetrics(newMetrics: Partial<GovernanceMetrics>): void {
    this.metrics = { ...this.metrics, ...newMetrics };
  }

  public clear(): void {
    this.actions.clear();
    this.decisions.clear();
    this.events = [];
  }
}

export const activeEngineeringActionRepository = new EngineeringActionRepository();
