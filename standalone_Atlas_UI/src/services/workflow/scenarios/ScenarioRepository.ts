import { Scenario } from "./Scenario";

export class ScenarioRepository {
  private scenarios = new Map<string, Scenario>();

  public saveScenario(scen: Scenario): void {
    this.scenarios.set(scen.id, scen);
  }

  public getScenariosList(): Scenario[] {
    return Array.from(this.scenarios.values());
  }

  public clear(): void {
    this.scenarios.clear();
  }
}

export const activeScenarioRepository = new ScenarioRepository();
