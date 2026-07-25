import { activeCoordinatorAgent } from "../../coordinator/CoordinatorAgent";

export class ScenarioRunner {
  public async runScenario(prompt: string): Promise<string> {
    console.log(`[Scenario Runner] Running verification workflow scenario: "${prompt}"`);
    return await activeCoordinatorAgent.orchestrate(prompt);
  }
}
