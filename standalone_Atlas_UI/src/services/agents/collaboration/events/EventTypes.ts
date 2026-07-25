export type CollaborativeEventType =
  | "GoalReceived"
  | "GoalParsed"
  | "WorkflowCreated"
  | "WorkflowCompleted"
  | "TaskCreated"
  | "TaskQueued"
  | "TaskAssigned"
  | "TaskStarted"
  | "TaskCompleted"
  | "TaskFailed"
  | "VariablePublished"
  | "VariableUpdated"
  | "AgentRegistered"
  | "AgentHeartbeat";

export interface CollaborativeEvent {
  eventId: string;
  eventType: CollaborativeEventType;
  timestamp: string;
  payload: any;
}
