import { EngineeringAgent } from "../core/engineeringAgent";

export interface DomainAgentDescriptor {
  id: string;
  name: string;
  domains: string[];
  capabilities: string[];
  version: string;
  successRate: number;
  activeTasks: number;
  agentInstance: EngineeringAgent;
}

export class DomainAgentRegistry {
  private registry = new Map<string, DomainAgentDescriptor>();

  public register(descriptor: DomainAgentDescriptor): void {
    this.registry.set(descriptor.id, descriptor);
  }

  public getAgentsList(): DomainAgentDescriptor[] {
    return Array.from(this.registry.values());
  }

  public routeObjective(objective: string): EngineeringAgent | null {
    const lower = objective.toLowerCase();
    
    // Capability descriptor matching
    for (const agent of this.registry.values()) {
      const match = agent.domains.some(d => lower.includes(d.toLowerCase())) ||
                    agent.capabilities.some(c => lower.includes(c.toLowerCase()));
      if (match) {
        return agent.agentInstance;
      }
    }
    
    return null;
  }
}

export const activeDomainAgentRegistry = new DomainAgentRegistry();
