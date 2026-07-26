export type GovernanceEventType = 
  | "SituationDetected"
  | "PolicyEvaluated"
  | "ComplianceAudited"
  | "SafetyInterlockEngaged"
  | "AuthorizationGranted"
  | "ActionExecuted"
  | "RollbackTriggered";

export interface GovernanceEvent {
  eventId: string;
  eventType: GovernanceEventType;
  relatedActionId: string;
  policyVersion: number;
  actor: string;
  beforeState: string;
  afterState: string;
  evidenceLink: string;
  correlationId: string;
  timestamp: string;
}
