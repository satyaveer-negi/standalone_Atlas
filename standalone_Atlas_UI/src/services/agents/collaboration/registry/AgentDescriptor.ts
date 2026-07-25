import { EngineeringAgent } from "../../core/engineeringAgent";

export type AgentHealthState = "Available" | "Busy" | "Offline" | "Degraded";

export interface AgentDescriptor {
  id: string;
  name: string;
  version: string;
  capabilities: string[];
  health: AgentHealthState;
  priority: number;
  agentInstance: EngineeringAgent;
}
