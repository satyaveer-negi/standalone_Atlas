export interface SourcedEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  author: string;
}

export class EventStore {
  private events: SourcedEvent[] = [];

  recordEvent(type: string, payload: any, author = "SYSTEM"): SourcedEvent {
    const event: SourcedEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      payload,
      timestamp: Date.now(),
      author,
    };
    this.events.push(event);
    return event;
  }

  getEventHistory(): SourcedEvent[] {
    return [...this.events];
  }

  replayHistory(onEvent: (event: SourcedEvent) => void): void {
    for (const evt of this.events) {
      onEvent(evt);
    }
  }
}
