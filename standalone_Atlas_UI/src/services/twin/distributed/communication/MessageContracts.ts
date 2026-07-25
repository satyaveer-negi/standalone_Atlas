export type MessageType = "TwinStateChanged" | "Heartbeat" | "SimulationRequest" | "VerifyTwinRequest";

export interface TwinMessageEnvelope {
  messageId: string;
  timestamp: string;
  sourceTwinId: string;
  targetTwinId: string;
  type: MessageType;
  correlationId: string;
  payload: any;
  signature?: string;
}
