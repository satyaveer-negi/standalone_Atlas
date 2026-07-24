export interface FirstClassEvidence {
  id: string;
  source: string;
  confidence: number;
  entities: string[];
  summary: string;
}

export class EvidenceCollector {
  collectEvidenceForGoal(goalId: string): FirstClassEvidence[] {
    return [
      {
        id: "ev-1",
        source: "Living Architecture Reconciler",
        confidence: 0.96,
        entities: ["TaskViewSet REST", "Redis Cache Tier"],
        summary: "Repository AST extractor detected undocumented Redis caching calls in TaskViewSet.py.",
      },
      {
        id: "ev-2",
        source: "Correlation Engine v5.6",
        confidence: 0.88,
        entities: ["Staging Environment Cluster"],
        summary: "Cross-domain correlation graph identified 0.88 causation between unmodeled Redis calls and Staging pod crashes.",
      },
    ];
  }
}
