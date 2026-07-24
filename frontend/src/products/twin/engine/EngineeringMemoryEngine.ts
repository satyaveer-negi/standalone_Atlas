export interface EngineeringMemoryRecord {
  id: string;
  category: "PAST_INCIDENT" | "PAST_SIMULATION" | "PAST_DECISION" | "PAST_DEPLOYMENT" | "PAST_OPTIMIZATION";
  title: string;
  historicalOutcome: string;
  lessonsLearned: string;
  timestamp: number;
}

export class EngineeringMemoryEngine {
  private records: EngineeringMemoryRecord[] = [
    {
      id: "mem-inc-101",
      category: "PAST_INCIDENT",
      title: "PostgreSQL Connection Exhaustion during Flash Sale",
      historicalOutcome: "P99 latency spiked to 2.4s due to connection pool starvation.",
      lessonsLearned: "Always provision Read Replica & cap MAX_CONNECTIONS at 200.",
      timestamp: Date.now() - 2592000000,
    },
    {
      id: "mem-opt-202",
      category: "PAST_OPTIMIZATION",
      title: "Redis Cache Key TTL Tuning",
      historicalOutcome: "Increased cache hit ratio from 64% to 91%.",
      lessonsLearned: "Use 3600s TTL for static TaskViewSet query results.",
      timestamp: Date.now() - 1296000000,
    },
  ];

  getMemoryRecords(): EngineeringMemoryRecord[] {
    return this.records;
  }

  findSimilarSituations(query: string): EngineeringMemoryRecord[] {
    const lower = query.toLowerCase();
    return this.records.filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        r.historicalOutcome.toLowerCase().includes(lower) ||
        r.lessonsLearned.toLowerCase().includes(lower)
    );
  }
}
