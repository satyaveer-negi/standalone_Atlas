import { WorkflowEvent, activeWorkflowEventBus } from "./workflowEvents";

// 🕸️ PROGRAM III.2: PERSISTENT APPEND-ONLY EVENT STORE (SYSTEM OF RECORD)
export class WorkflowEventStore {
  private eventsLog: WorkflowEvent[] = [];
  private currentSequence = 0;

  constructor() {
    // Automatically subscribe to the event bus to persist published events
    activeWorkflowEventBus.subscribe((event) => {
      this.append(event);
    });
  }

  public append(event: WorkflowEvent): void {
    // Check if event already has a sequence number, otherwise assign one
    if (event.sequenceNumber === 0 || !event.sequenceNumber) {
      this.currentSequence++;
      event.sequenceNumber = this.currentSequence;
    }
    
    // Ensure duplicate eventIds aren't stored
    if (this.eventsLog.some(e => e.eventId === event.eventId)) {
      console.warn(`[Event Store] Duplicate event skipped: ${event.eventId}`);
      return;
    }

    this.eventsLog.push({ ...event });
    console.log(`[Event Store] Appended event seq: ${event.sequenceNumber} (${event.eventType})`);
  }

  public getEventsList(): WorkflowEvent[] {
    return [...this.eventsLog];
  }

  public getByWorkflow(workflowId: string): WorkflowEvent[] {
    return this.eventsLog.filter(e => e.workflowId === workflowId);
  }

  public getByCorrelation(correlationId: string): WorkflowEvent[] {
    return this.eventsLog.filter(e => e.platformContext.identity.correlationId === correlationId);
  }

  public clearStore(): void {
    this.eventsLog = [];
    this.currentSequence = 0;
  }
}

export const activeWorkflowEventStore = new WorkflowEventStore();
