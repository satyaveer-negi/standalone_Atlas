export type ArtifactBehaviorState =
  | "Idle"
  | "Hovered"
  | "Selected"
  | "Executing"
  | "Analyzing"
  | "Error"
  | "Success";

export type ProtocolType = "HTTP" | "SQL" | "Redis" | "WebSocket" | "AI";

export interface ProtocolPulseEvent {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  protocol: ProtocolType;
  label: string;
  timestamp: number;
}

type EventCallback = (event: ProtocolPulseEvent) => void;

class AnimationDirectorEngine {
  private listeners: EventCallback[] = [];
  private nodeStates: Map<string, ArtifactBehaviorState> = new Map();

  getNodeState(nodeId: string): ArtifactBehaviorState {
    return this.nodeStates.get(nodeId) || "Idle";
  }

  setNodeState(nodeId: string, state: ArtifactBehaviorState) {
    this.nodeStates.set(nodeId, state);
  }

  emitPulse(pulse: Omit<ProtocolPulseEvent, "timestamp">) {
    const fullEvent: ProtocolPulseEvent = {
      ...pulse,
      timestamp: Date.now(),
    };
    this.setNodeState(pulse.sourceNodeId, "Executing");
    this.setNodeState(pulse.targetNodeId, "Executing");

    this.listeners.forEach((cb) => cb(fullEvent));

    // Reset back to Idle after execution completes
    setTimeout(() => {
      if (this.getNodeState(pulse.sourceNodeId) === "Executing") {
        this.setNodeState(pulse.sourceNodeId, "Idle");
      }
      if (this.getNodeState(pulse.targetNodeId) === "Executing") {
        this.setNodeState(pulse.targetNodeId, "Idle");
      }
    }, 2500);
  }

  subscribe(callback: EventCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }
}

export const AnimationDirector = new AnimationDirectorEngine();
