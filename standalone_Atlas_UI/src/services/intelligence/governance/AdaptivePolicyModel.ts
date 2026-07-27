export interface PolicyConstraints {
  immutableRules: string[];
  configurableRules: string[];
}

export type PolicyScope = "Global" | "Portfolio" | "Mission";

export type AdaptivePolicyStatus = "Draft" | "Active" | "Superseded" | "Deprecated";

export interface AdaptivePolicyModel {
  policyId: string;
  title: string;
  description: string;
  policyVersion: number;
  scope: PolicyScope;
  rules: string[];
  policyConstraints: PolicyConstraints;
  triggerConditions: string[];
  approvalAuth: string;
  status: AdaptivePolicyStatus;
  lastUpdated: string;
}
