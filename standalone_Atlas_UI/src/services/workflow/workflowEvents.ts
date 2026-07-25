import { PlatformContext } from "../common/platformContext";

export type WorkflowEventType =
  | "WorkflowCreated"
  | "WorkflowQueued"
  | "WorkflowStarted"
  | "WorkflowCompleted"
  | "WorkflowCancelled"
  | "StepReady"
  | "StepStarted"
  | "StepCompleted"
  | "StepRetried"
  | "StepFailed"
  | "SchedulingDecisionMade"
  | "TimeoutOccurred";

// 🕸️ PROGRAM III.1: EVENT ENVELOPE CONTRACT
export interface WorkflowEvent<T = any> {
  schemaVersion: number;
  sequenceNumber: number;
  eventId: string;
  workflowId: string;
  stepId?: string;
  timestamp: string;
  eventType: WorkflowEventType;
  platformContext: PlatformContext;
  payload: T;
}

export type WorkflowEventListener = (event: WorkflowEvent) => void;

// 🕸️ PROGRAM III.1: WORKFLOW EVENT BUS (PUB/SUB CHANNELS)
export class WorkflowEventBus {
  private listeners = new Set<WorkflowEventListener>();

  public subscribe(listener: WorkflowEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public publish(event: WorkflowEvent): void {
    console.log(`[Event Bus] Publishing event "${event.eventType}" for workflow "${event.workflowId}"`);
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (err) {
        console.error("[Event Bus] Error invoking listener:", err);
      }
    });
  }
}

export const activeWorkflowEventBus = new WorkflowEventBus();
