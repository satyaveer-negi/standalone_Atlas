export interface ConceptNode {
  id: string;
  name: string;
  description: string;
  mappedEntityIds: string[];
  linkedAdrIds: string[];
}

export const PREDEFINED_CONCEPTS: ConceptNode[] = [
  {
    id: "concept-task-creation",
    name: "Task Creation Workflow",
    description: "Covers React Tasks UI, Axios API calls, Django TaskViewSet dispatch, and DB persistence.",
    mappedEntityIds: ["file-tasks-tsx", "sys-backend", "postgresql-db"],
    linkedAdrIds: ["adr-001-clean-arch"],
  },
  {
    id: "concept-caching-tier",
    name: "Redis Caching & Fallback",
    description: "Covers Redis cache hit/miss semantics and PostgreSQL fallback.",
    mappedEntityIds: ["redis-cache", "postgresql-db"],
    linkedAdrIds: ["rfc-012-redis-cache"],
  },
];
