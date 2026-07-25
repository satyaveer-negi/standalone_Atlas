import { CollaborativeEvent, CollaborativeEventType } from "./EventTypes";

type CollaborativeEventHandler = (event: CollaborativeEvent) => void;

export class CollaborativeEventBus {
  private handlers: CollaborativeEventHandler[] = [];
  private eventLog: CollaborativeEvent[] = [];

  public subscribe(handler: CollaborativeEventHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  public publish(eventType: CollaborativeEventType, payload: any): void {
    const event: CollaborativeEvent = {
      eventId: `collab-evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType,
      timestamp: new Date().toLocaleTimeString(),
      payload
    };

    this.eventLog.push(event);
    
    // Trigger handlers asynchronously to prevent execution blocking
    setTimeout(() => {
      this.handlers.forEach(handler => {
        try {
          handler(event);
        } catch (err) {
          console.error(`[Collab Event Bus] Handler crash:`, err);
        }
      });
    }, 0);
  }

  public getEventHistory(): CollaborativeEvent[] {
    return [...this.eventLog];
  }

  public clearLog(): void {
    this.eventLog = [];
  }
}

export const activeCollabEventBus = new CollaborativeEventBus();
