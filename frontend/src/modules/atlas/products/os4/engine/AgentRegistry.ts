import type { IAgent } from "./AtlasContracts";

export class AgentRegistry {
  private agents = new Map<string, IAgent>();

  registerAgent(agent: IAgent): void {
    this.agents.set(agent.id, agent);
  }

  getAgent(id: string): IAgent | undefined {
    return this.agents.get(id);
  }

  getRegisteredAgents(): IAgent[] {
    return Array.from(this.agents.values());
  }
}
