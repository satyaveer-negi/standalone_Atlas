export type MetricDomain =
  | "ARCHITECTURE"
  | "WORKFLOW"
  | "DEPLOYMENT"
  | "REPOSITORY"
  | "RUNTIME"
  | "POLICY"
  | "TEAM"
  | "PRODUCTIVITY";

export interface StructuredMetric {
  id: string;
  domain: MetricDomain;
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  scope: string;
  source: string;
}

export class MetricsEngine {
  collectDomainMetrics(): StructuredMetric[] {
    return [
      { id: "m-1", domain: "ARCHITECTURE", name: "Canonical Service Count", value: 7, unit: "services", timestamp: Date.now(), scope: "global", source: "CAM" },
      { id: "m-2", domain: "WORKFLOW", name: "Mean Approval Latency", value: 14, unit: "minutes", timestamp: Date.now(), scope: "pr-workflows", source: "WorkflowOrchestrator" },
      { id: "m-3", domain: "DEPLOYMENT", name: "Deployment Frequency", value: 4.2, unit: "deploys/day", timestamp: Date.now(), scope: "staging", source: "DeployService" },
      { id: "m-4", domain: "REPOSITORY", name: "Repository Code AST Churn", value: 18, unit: "files/commit", timestamp: Date.now(), source: "ASTExtractor" },
      { id: "m-5", domain: "RUNTIME", name: "Observed Runtime Health", value: 99.8, unit: "%", timestamp: Date.now(), source: "Prometheus" },
      { id: "m-6", domain: "POLICY", name: "Clean Architecture Compliance", value: 94, unit: "%", timestamp: Date.now(), source: "GovernEngine" },
      { id: "m-7", domain: "TEAM", name: "Collaborative Active Session Count", value: 12, unit: "engineers", timestamp: Date.now(), source: "CollaborationEngine" },
      { id: "m-8", domain: "PRODUCTIVITY", name: "Lead Time to Deployment", value: 1.4, unit: "hours", timestamp: Date.now(), source: "AtlasAnalytics" },
    ];
  }
}
