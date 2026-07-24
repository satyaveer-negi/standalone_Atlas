// 🚦 FROZEN RUNTIME STATES SPECIFICATION
export type RuntimeState =
  | "UNLOADED"
  | "VALIDATING"
  | "INITIALIZING"
  | "LOADING"
  | "ACTIVE"
  | "PAUSED"
  | "STOPPING"
  | "DISPOSED"
  | "FAILED";

// 🔄 RUNTIME LIFECYCLE CALLBACK PROTOCOL
export interface RuntimeLifecycle {
  currentState: RuntimeState;
  dependencies: string[];
  initialize(): Promise<void>;
  load(): Promise<void>;
  activate(): Promise<void>;
  shutdown(): Promise<void>;
  dispose(): Promise<void>;
}
