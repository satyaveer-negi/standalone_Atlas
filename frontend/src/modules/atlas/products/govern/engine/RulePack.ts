import type { DeclarativeRule } from "./RuleAST";

export interface RulePack {
  id: string;
  name: string;
  description: string;
  rules: DeclarativeRule[];
}

export const ENTERPRISE_RULE_PACKS: RulePack[] = [
  {
    id: "pack-clean-arch",
    name: "Clean Architecture Rule Pack",
    description: "Enforces strict layering boundaries between UI, API ViewSets, Services, and DB Models.",
    rules: [
      {
        id: "rule-no-ui-db",
        name: "No Direct DB Access from React UI",
        severity: "ERROR",
        sourceType: "file",
        forbiddenType: "database",
        message: "React components must fetch data through Django REST APIs rather than querying tables directly.",
      },
      {
        id: "rule-api-auth",
        name: "REST ViewSets Must Enforce Authentication",
        severity: "CRITICAL",
        sourceType: "api",
        forbiddenType: "unauthenticated",
        message: "Django ViewSets must declare IsAuthenticated permission classes.",
      },
    ],
  },
];
