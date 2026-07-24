export interface EnrichedSearchResult {
  id: string;
  title: string;
  category: "CODE_AST" | "ARCHITECTURE" | "WORKFLOW_LOG" | "DEPLOYMENT_PLAN" | "ANALYTICS";
  score: number; // 0-100
  evidence: string;
  relatedEntities: string[];
  recommendation?: string;
}

export class EnterpriseSearchEngine {
  searchEnterpriseKnowledge(query: string): EnrichedSearchResult[] {
    return [
      {
        id: "res-1",
        title: "TaskViewSet REST API (Django ViewSet)",
        category: "CODE_AST",
        score: 98,
        evidence: "Source AST match in backend/task_manager/views.py",
        relatedEntities: ["Tasks.tsx", "PostgreSQL Database", "Redis Cache Tier"],
        recommendation: "Run Living Architecture reconciliation to update Studio design.",
      },
      {
        id: "res-2",
        title: "Pull Request Architectural Review DAG Workflow",
        category: "WORKFLOW_LOG",
        score: 91,
        evidence: "Matched execution instance inst-99 with approval gate",
        relatedEntities: ["Alex Dev (Lead)", "Staging Environment"],
      },
    ];
  }
}
