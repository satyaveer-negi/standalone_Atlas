export interface RequiredContextSources {
  needGraph: boolean;
  needRuntime: boolean;
  needPolicies: boolean;
  needGit: boolean;
}

export class ContextPlanner {
  planSources(intent: string): RequiredContextSources {
    const lower = intent.toLowerCase();
    return {
      needGraph: true,
      needRuntime: lower.includes("slow") || lower.includes("latency") || lower.includes("incident") || lower.includes("status"),
      needPolicies: lower.includes("review") || lower.includes("violation") || lower.includes("rule") || lower.includes("refactor"),
      needGit: lower.includes("commit") || lower.includes("author") || lower.includes("history") || lower.includes("change"),
    };
  }
}
