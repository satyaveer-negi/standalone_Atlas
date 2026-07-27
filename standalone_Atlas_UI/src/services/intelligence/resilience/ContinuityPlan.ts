export interface ContinuityPlan {
  continuityPlanId: string;
  criticalServices: string[];
  dependencyPriorities: string[];
  minimumServiceLevels: number;
  escalationPaths: string[];
}
