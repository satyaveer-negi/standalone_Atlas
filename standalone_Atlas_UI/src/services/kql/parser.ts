import { activeKQLPlanner } from "./planner";
import { activeKQLExecutor } from "./executor";
import { queryProviderRegistry } from "./providerRegistry";

export interface KQLExplainPlan {
  stage: string;
  durationMs: number;
  description: string;
}

export interface KQLQueryResult {
  headers: string[];
  rows: Record<string, any>[];
  diagnostics?: string;
}

export class KQLQueryEngine {
  public async executeQueryAsync(query: string): Promise<KQLQueryResult> {
    const cleanQuery = query.trim().replace(/\s+/g, " ");
    const match = cleanQuery.match(/MATCH\s+(\w+)(?:\s+WHERE\s+(.+))?/i);

    if (!match) {
      return {
        headers: ["error"],
        rows: [],
        diagnostics: `KQL Syntax Error: Malformed match query syntax in "${query}".`
      };
    }

    const entityName = match[1];
    const conditions = match[2] || "";

    try {
      const plan = activeKQLPlanner.buildPlan(entityName, conditions);
      const rows = await activeKQLExecutor.executePlan(plan);
      const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

      return {
        headers,
        rows
      };
    } catch (err: any) {
      return {
        headers: ["error"],
        rows: [],
        diagnostics: err.message || `No Query Provider registered for target entity: "${entityName}"`
      };
    }
  }

  public explainQuery(query: string): KQLExplainPlan[] {
    const cleanQuery = query.trim().replace(/\s+/g, " ");
    const match = cleanQuery.match(/MATCH\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
    const entityName = match ? match[1] : "Unknown";

    let providerSteps: string[] = ["Default Table Scan"];
    try {
      if (match) {
        const provider = queryProviderRegistry.resolveProvider(entityName);
        const plan = provider.explain({});
        providerSteps = plan.steps;
      }
    } catch (e) {}

    return [
      { stage: "Tokenize Query", durationMs: 2, description: "Splitting query terms into syntax tokens." },
      { stage: "Parse AST", durationMs: 4, description: `Building Abstract Syntax Tree for entity target: "${entityName}".` },
      { stage: "Validate Schema", durationMs: 3, description: "Verifying target exists in platform configuration." },
      { stage: "Query Provider Scan", durationMs: 6, description: `Dispatched to Provider: [${providerSteps.join(" -> ")}]` },
    ];
  }
}

export const activeKQLQueryEngine = new KQLQueryEngine();
