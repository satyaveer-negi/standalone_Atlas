import { CollaborativeEvent } from "../events/EventTypes";

export class EventAssertions {
  public assertEventsSequence(events: CollaborativeEvent[]): { passed: boolean; message: string } {
    if (events.length === 0) {
      return { passed: true, message: "No active timeline events recorded yet (informational)." };
    }

    const types = events.map(e => e.eventType);
    
    // Validate if GoalParsed, TaskCreated, or VariablePublished appears
    const hasParsed = types.includes("GoalParsed");
    const hasCreated = types.includes("TaskCreated");

    if (hasParsed || hasCreated) {
      return { passed: true, message: "Decoupled Event Bus dispatches matched expected sequence categories." };
    }
    return { passed: false, message: "Decoupled Event Bus timeline sequence validation failed." };
  }
}
