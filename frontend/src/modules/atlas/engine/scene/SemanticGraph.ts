export interface SemanticRelation {
  sourceId: string;
  targetId: string;
  type:
    | "imports"
    | "importedBy"
    | "calls"
    | "calledBy"
    | "implements"
    | "tests"
    | "apiEndpoint"
    | "databaseTable";
}

export interface SemanticNodeData {
  id: string;
  name: string;
  category: "file" | "api" | "model" | "test" | "component" | "service";
  relatedNodeIds: string[];
  complexity: number;
  testCoverage: number;
  securityScore: number;
  apiEndpoint?: string;
  databaseTable?: string;
}

export const DEMO_SEMANTIC_NODES: Record<string, SemanticNodeData> = {
  "file-tasks-tsx": {
    id: "file-tasks-tsx",
    name: "Tasks.tsx",
    category: "component",
    relatedNodeIds: ["file-backend-views-py", "sys-backend", "mod-tasks-ui"],
    complexity: 72,
    testCoverage: 88.4,
    securityScore: 95,
    apiEndpoint: "/api/tasks/",
    databaseTable: "task_manager_task",
  },
  "file-backend-views-py": {
    id: "file-backend-views-py",
    name: "views.py (TaskViewSet)",
    category: "api",
    relatedNodeIds: ["file-tasks-tsx", "cnt-postgres", "sys-backend"],
    complexity: 64,
    testCoverage: 92.0,
    securityScore: 88,
    apiEndpoint: "GET/POST /api/tasks/",
    databaseTable: "task_manager_task",
  },
  "mod-tasks-ui": {
    id: "mod-tasks-ui",
    name: "Task Registry Module",
    category: "service",
    relatedNodeIds: ["file-tasks-tsx", "sys-frontend"],
    complexity: 45,
    testCoverage: 90.0,
    securityScore: 100,
  },
  "cnt-postgres": {
    id: "cnt-postgres",
    name: "postgresql-db",
    category: "model",
    relatedNodeIds: ["file-backend-views-py", "cnt-web"],
    complexity: 30,
    testCoverage: 100,
    securityScore: 98,
    databaseTable: "task_manager_task",
  },
};

export class SemanticGraph {
  static getRelatedNodeIds(nodeId: string): string[] {
    const data = DEMO_SEMANTIC_NODES[nodeId];
    if (data) return data.relatedNodeIds;
    return [];
  }

  static getSemanticNode(nodeId: string): SemanticNodeData | null {
    return DEMO_SEMANTIC_NODES[nodeId] || null;
  }
}
