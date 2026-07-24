export type EventPriority = "HIGH" | "NORMAL" | "LOW";

export interface BaseAtlasEvent {
  type: string;
  timestamp: number;
  priority?: EventPriority;
}

export interface FileSavedEvent extends BaseAtlasEvent {
  type: "file.saved";
  fileId: string;
  filePath: string;
  workspaceId: string;
}

export interface EntitySelectedEvent extends BaseAtlasEvent {
  type: "entity.selected";
  entityId: string;
  entityType: string;
}

export interface CameraFocusedEvent extends BaseAtlasEvent {
  type: "camera.focused";
  targetPosition: [number, number, number];
  zoomLevel: number;
}

export interface MissionStartedEvent extends BaseAtlasEvent {
  type: "mission.started";
  missionId: string;
  category: string;
}

export interface RuntimePacketEvent extends BaseAtlasEvent {
  type: "runtime.packet";
  protocol: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string;
}

export type AtlasEvent =
  | FileSavedEvent
  | EntitySelectedEvent
  | CameraFocusedEvent
  | MissionStartedEvent
  | RuntimePacketEvent;

type EventListener<T extends AtlasEvent = AtlasEvent> = (event: T) => void;

interface ListenerEntry {
  listener: EventListener<any>;
  priority: EventPriority;
}

export class AtlasEventBus {
  private listeners: Map<string, ListenerEntry[]> = new Map();
  private eventQueue: AtlasEvent[] = [];

  subscribe<T extends AtlasEvent["type"]>(
    eventType: T,
    listener: (event: Extract<AtlasEvent, { type: T }>) => void,
    priority: EventPriority = "NORMAL"
  ) {
    const entries = this.listeners.get(eventType) || [];
    entries.push({ listener, priority });

    // Sort by priority: HIGH -> NORMAL -> LOW
    const priorityWeight: Record<EventPriority, number> = { HIGH: 3, NORMAL: 2, LOW: 1 };
    entries.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

    this.listeners.set(eventType, entries);

    return () => {
      const current = this.listeners.get(eventType) || [];
      this.listeners.set(
        eventType,
        current.filter((e) => e.listener !== listener)
      );
    };
  }

  emit(event: AtlasEvent) {
    const fullEvent: AtlasEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      priority: event.priority || "NORMAL",
    };

    this.eventQueue.push(fullEvent);
    const entries = this.listeners.get(fullEvent.type) || [];

    // Dispatch synchronously to priority subscribers
    entries.forEach((entry) => {
      try {
        entry.listener(fullEvent);
      } catch (err) {
        console.error(`[AtlasEventBus] Error handling event ${fullEvent.type}:`, err);
      }
    });
  }

  getStats() {
    return {
      activeTopics: this.listeners.size,
      queuedEventsCount: this.eventQueue.length,
    };
  }
}
