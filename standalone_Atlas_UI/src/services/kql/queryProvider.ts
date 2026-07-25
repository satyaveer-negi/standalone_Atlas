export interface QueryCriteria {
  filters?: Record<string, any>;
  fields?: string[];
}

export interface QueryPlan {
  steps: string[];
  costMs: number;
}

// 🕸️ FROZEN QUERY PROVIDER CONTRACT
export interface QueryProvider<T> {
  readonly entityName: string;
  canHandle(entity: string): boolean;
  execute(criteria: QueryCriteria): Promise<T[]>;
  explain(criteria: QueryCriteria): QueryPlan;
}

// 📦 Registry Query Provider
export class RegistryQueryProvider implements QueryProvider<any> {
  public readonly entityName = "Package";

  public canHandle(entity: string): boolean {
    return entity.toUpperCase() === "PACKAGE";
  }

  public async execute(criteria: QueryCriteria): Promise<any[]> {
    const rows = [
      { id: "software", version: "1.0.0", quality: "Gold", status: "Installed" },
      { id: "openfoam", version: "1.2.0", quality: "Platinum", status: "Active" },
      { id: "literature", version: "2.1.0", quality: "Gold", status: "Installed" },
      { id: "research", version: "1.0.0", quality: "Silver", status: "Available" },
      { id: "education", version: "1.5.0", quality: "Platinum", status: "Available" },
    ];

    if (criteria.filters && criteria.filters.quality) {
      return rows.filter(r => r.quality.toUpperCase() === criteria.filters?.quality.toUpperCase());
    }

    return rows;
  }

  public explain(criteria: QueryCriteria): QueryPlan {
    return {
      steps: ["Registry scan", "Filter by quality condition", "Project fields"],
      costMs: 4,
    };
  }
}

// 🔄 Runtime Query Provider
export class RuntimeQueryProvider implements QueryProvider<any> {
  public readonly entityName = "Runtime";

  public canHandle(entity: string): boolean {
    return entity.toUpperCase() === "RUNTIME";
  }

  public async execute(): Promise<any[]> {
    return [
      { component: "knowledgeRuntime", status: "ACTIVE", memory: "1.2 MB" },
      { component: "learningRuntime", status: "UNLOADED", memory: "0 KB" }
    ];
  }

  public explain(): QueryPlan {
    return {
      steps: ["Runtime Manager scan", "Inspect active lifecycles status"],
      costMs: 2,
    };
  }
}

// ⏳ Trace Query Provider
export class TraceQueryProvider implements QueryProvider<any> {
  public readonly entityName = "Trace";

  public canHandle(entity: string): boolean {
    return entity.toUpperCase() === "TRACE";
  }

  public async execute(): Promise<any[]> {
    return [
      { id: "tr-101", packageName: "openfoam", durationMs: 1440, eventsCount: 4 },
      { id: "tr-102", packageName: "literature", durationMs: 820, eventsCount: 2 }
    ];
  }

  public explain(): QueryPlan {
    return {
      steps: ["Trace Store indexed scan", "Retrieve session metadata logs"],
      costMs: 3,
    };
  }
}
