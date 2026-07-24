export type PermissionScope =
  | "ORGANIZATION"
  | "WORKSPACE"
  | "PROJECT"
  | "REPOSITORY"
  | "WORKFLOW"
  | "DEPLOYMENT"
  | "GRAPH_ENTITY"
  | "EXTENSION";

export interface PermissionPolicy {
  role: string;
  scope: PermissionScope;
  resourceId: string;
  allowedActions: string[];
}

export class RBACEngine {
  private policies: PermissionPolicy[] = [
    { role: "LEAD_ARCHITECT", scope: "WORKSPACE", resourceId: "ws-fintech", allowedActions: ["edit:architecture", "approve:workflow", "deploy:staging", "deploy:production"] },
    { role: "ENGINEER", scope: "PROJECT", resourceId: "proj-tasks", allowedActions: ["edit:code", "trigger:workflow", "deploy:staging"] },
  ];

  checkPermission(role: string, scope: PermissionScope, resourceId: string, action: string): boolean {
    const policy = this.policies.find((p) => p.role === role && p.scope === scope);
    if (!policy) return false;
    return policy.allowedActions.includes(action);
  }

  getPolicies(): PermissionPolicy[] {
    return this.policies;
  }
}
