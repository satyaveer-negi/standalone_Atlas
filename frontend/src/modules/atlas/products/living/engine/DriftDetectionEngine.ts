import type { CanonicalArchitectureModel } from "./CanonicalArchitectureModel";

export type DriftCategory =
  | "MISSING_COMPONENT"
  | "UNEXPECTED_COMPONENT"
  | "RELATIONSHIP_DRIFT"
  | "TECHNOLOGY_DRIFT"
  | "POLICY_DRIFT"
  | "DEPLOYMENT_DRIFT"
  | "DOCUMENTATION_DRIFT"
  | "API_DRIFT";

export interface SemanticDriftAlert {
  id: string;
  category: DriftCategory;
  title: string;
  description: string;
  suggestedFix: string;
}

export interface DomainHealthScorecard {
  overallHealthIndex: number; // 0-100%
  architectureScore: number;
  documentationScore: number;
  policyScore: number;
  deploymentScore: number;
  technologyScore: number;
}

export class DriftDetectionEngine {
  reconcileAndDetectDrift(designed: CanonicalArchitectureModel, extracted: CanonicalArchitectureModel): SemanticDriftAlert[] {
    return [
      {
        id: "drift-redis-missing",
        category: "MISSING_COMPONENT",
        title: "Undocumented Service: Redis Cache Tier in Repo",
        description: "Repository code invokes Redis caching, but Studio designed architecture model lacks Redis.",
        suggestedFix: "Run 'Add missing service' to sync Studio model with Repository.",
      },
      {
        id: "drift-clean-arch",
        category: "POLICY_DRIFT",
        title: "Clean Architecture Violation: Direct UI-to-DB query in Tasks.tsx",
        description: "React component imports PostgreSQL driver directly.",
        suggestedFix: "Refactor Tasks.tsx to call Django TaskViewSet API.",
      },
    ];
  }

  computeDomainHealth(): DomainHealthScorecard {
    return {
      overallHealthIndex: 88,
      architectureScore: 92,
      documentationScore: 84,
      policyScore: 86,
      deploymentScore: 90,
      technologyScore: 88,
    };
  }
}
