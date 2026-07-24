export interface SimulationScenarioDefinition {
  id: string;
  name: string;
  description: string;
  targetEntityId: string;
}

export const PREDEFINED_SCENARIOS: SimulationScenarioDefinition[] = [
  {
    id: "scen-remove-redis",
    name: "Remove Redis Cache Service",
    description: "Simulates removing Redis caching tier and fallback to direct DB queries.",
    targetEntityId: "redis-cache",
  },
  {
    id: "scen-replace-db",
    name: "Replace PostgreSQL DB with DynamoDB",
    description: "Simulates database migration and dependency refactoring.",
    targetEntityId: "postgresql-db",
  },
  {
    id: "scen-split-monolith",
    name: "Split Django Task Monolith into Microservices",
    description: "Simulates decoupling TaskViewSet into a dedicated task-service container.",
    targetEntityId: "sys-backend",
  },
];
