export interface GovernancePolicy {
  policyId: string;
  scope: string;
  voltageLimitMax: number;
  temperatureLimitMax: number;
  reassessmentFrequencySeconds: number;
  autoReevaluateDecision: boolean;
  approvalRules: {
    requiredApproverLevel: "Operator" | "Lead" | "Chief" | "System";
    approvalType: "Human" | "Automated" | "Hybrid";
  };
  effectiveFrom: string;
  effectiveUntil: string | null;
  supersededByPolicyId: string | null;
  changeReason: string;
  version: number;
}

export const nominalGovernancePolicy: GovernancePolicy = {
  policyId: "gov-policy-v4.5-nominal",
  scope: "Substation operational limits governance",
  voltageLimitMax: 120,
  temperatureLimitMax: 350,
  reassessmentFrequencySeconds: 5,
  autoReevaluateDecision: true,
  approvalRules: {
    requiredApproverLevel: "Lead",
    approvalType: "Hybrid"
  },
  effectiveFrom: "2026-07-26T00:00:00Z",
  effectiveUntil: null,
  supersededByPolicyId: null,
  changeReason: "Initial release baseline",
  version: 1
};
