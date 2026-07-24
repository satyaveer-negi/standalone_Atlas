export interface ADREntity {
  id: string;
  title: string;
  type: "adr" | "rfc" | "runbook";
  status: "ACCEPTED" | "PROPOSED" | "DEPRECATED";
  summary: string;
  linkedEntityIds: string[];
}

export const SAMPLE_ADRS: ADREntity[] = [
  {
    id: "adr-001-clean-arch",
    title: "ADR-001: Clean Architecture Layering",
    type: "adr",
    status: "ACCEPTED",
    summary: "Mandates that React SPAs fetch data via Django REST ViewSets rather than direct DB queries.",
    linkedEntityIds: ["file-tasks-tsx", "sys-backend"],
  },
  {
    id: "rfc-012-redis-cache",
    title: "RFC-012: Redis Cache Tier Fallback",
    type: "rfc",
    status: "ACCEPTED",
    summary: "Defines cache eviction and fallback strategy for task manager APIs.",
    linkedEntityIds: ["redis-cache", "postgresql-db"],
  },
];
