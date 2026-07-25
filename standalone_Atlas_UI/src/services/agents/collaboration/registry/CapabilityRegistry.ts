import { AgentDescriptor, AgentHealthState } from "./AgentDescriptor";

export class CapabilityRegistry {
  private agents = new Map<string, AgentDescriptor>();

  public registerAgent(descriptor: AgentDescriptor): void {
    this.agents.set(descriptor.id, descriptor);
  }

  public getAgentsList(): AgentDescriptor[] {
    return Array.from(this.agents.values());
  }

  public updateHealth(agentId: string, health: AgentHealthState): void {
    const desc = this.agents.get(agentId);
    if (desc) {
      desc.health = health;
    }
  }

  public findExpertForCapability(capabilityName: string): AgentDescriptor | null {
    const matches = Array.from(this.agents.values()).filter(agent => 
      agent.capabilities.includes(capabilityName) && agent.health === "Available"
    );

    if (matches.length === 0) return null;
    
    // Select highest priority agent
    return matches.sort((a, b) => b.priority - a.priority)[0];
  }
}

export const activeCapabilityRegistry = new CapabilityRegistry();
