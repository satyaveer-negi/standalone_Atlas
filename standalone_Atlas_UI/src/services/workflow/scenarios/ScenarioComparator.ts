import { Scenario } from "./Scenario";

export interface ComparisonMetricRow {
  parameterName: string;
  scenario1Value: string;
  scenario2Value: string;
  deviation: string;
}

export class ScenarioComparator {
  public compareScenarios(scen1: Scenario, scen2: Scenario): ComparisonMetricRow[] {
    const keys = Array.from(new Set([...Object.keys(scen1.variables), ...Object.keys(scen2.variables)]));
    return keys.map(key => {
      const v1 = scen1.variables[key] ?? 0;
      const v2 = scen2.variables[key] ?? 0;
      const dev = typeof v1 === "number" && typeof v2 === "number"
        ? `${((v2 - v1) / (v1 || 1) * 100).toFixed(1)}%`
        : "N/A";
      return {
        parameterName: key,
        scenario1Value: String(v1),
        scenario2Value: String(v2),
        deviation: dev
      };
    });
  }
}

export const activeScenarioComparator = new ScenarioComparator();
