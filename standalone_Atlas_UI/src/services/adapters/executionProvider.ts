export interface ExecutionResult {
  runId: string;
  provider: string;
  status: "SUCCESS" | "ERROR" | "PENDING";
  startedAt: string;
  completedAt: string;
  logs: string[];
  artifacts: string[];
}

export type AdapterState = "Available" | "Connecting" | "Connected" | "Degraded" | "Error" | "Disabled";

// 🔌 STRUCTURED EXECUTION PROVIDER INTERFACE
export interface ExecutionProvider {
  readonly name: string;
  readonly version: string;
  state: AdapterState;
  lastSync: string;
  capabilities: string[];
  diagnostics: string;

  initialize(): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  execute(cmd: string): Promise<ExecutionResult>;
  health(): Promise<string>;
}
