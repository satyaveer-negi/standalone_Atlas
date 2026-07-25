export type SessionStatus = "Created" | "Running" | "Completed" | "Failed";

export interface SimulationSession {
  sessionId: string;
  twinId: string;
  providerId: string;
  status: SessionStatus;
  startedAt: string;
  completedAt?: string;
  outputs?: any;
}
