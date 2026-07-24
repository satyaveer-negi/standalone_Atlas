export interface ParsedIntentGoal {
  rawIntent: string;
  goal: string;
  latencyBoundaryMs: number;
  maxCostImpactUsd: number;
}

export class IntentParser {
  parse(rawIntent: string): ParsedIntentGoal {
    return {
      rawIntent: rawIntent || "Reduce API latency under 200ms",
      goal: "Optimize TaskViewSet REST API p99 Latency & Cost Boundary",
      latencyBoundaryMs: 200,
      maxCostImpactUsd: 200,
    };
  }
}
