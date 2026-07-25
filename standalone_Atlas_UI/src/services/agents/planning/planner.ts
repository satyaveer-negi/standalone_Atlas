import { activeDomainAgentRegistry } from "../registry/domainAgentRegistry";

export class AgentPlanner {
  public generatePlan(objective: string): string[] {
    // 1. Delegate plan construction to specialists registry
    const expertAgent = activeDomainAgentRegistry.routeObjective(objective);
    if (expertAgent) {
      return expertAgent.plan(objective);
    }

    // 2. Generic fallback logic if no specialized agent is found
    return [
      "Retrieve math templates from local graph schemas",
      "Execute numerical matrix dot product computations",
      "Log semantic feedback results"
    ];
  }
}
