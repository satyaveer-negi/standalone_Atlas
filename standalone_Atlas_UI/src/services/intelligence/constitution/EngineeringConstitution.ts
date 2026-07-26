export type ConstitutionalPillar = 
  | "Evidence"
  | "Explainability"
  | "Safety"
  | "Governance"
  | "Security"
  | "Accountability"
  | "Reproducibility";

export interface EngineeringConstitution {
  principleId: string;
  name: string;
  pillar: ConstitutionalPillar;
  rationale: string;
  scope: string;
  enforcementRule: string;
  severity: "High" | "Critical";
  verificationRequirement: string;
  exceptionPolicy: string;
  version: number;
  status: "Draft" | "Approved";
}

export const initialConstitutionalPrinciples: EngineeringConstitution[] = [
  {
    principleId: "cp-evid-01",
    name: "Evidence Grounding Invariant",
    pillar: "Evidence",
    rationale: "Every planner recommendation must be trace-linked to observed outcome records.",
    scope: "Planner, Council",
    enforcementRule: "Reject plans lacking similar case reference histories.",
    severity: "Critical",
    verificationRequirement: "Audit history size >= 1",
    exceptionPolicy: "Requires Council consensus waiver",
    version: 1,
    status: "Approved"
  },
  {
    principleId: "cp-expl-01",
    name: "Audit Explainability Constraint",
    pillar: "Explainability",
    rationale: "Every planning alternative must maintain trade-off score rationale charts.",
    scope: "Recommendation Engine",
    enforcementRule: "Block recommendation outputs lacking score metrics.",
    severity: "High",
    verificationRequirement: "Verify markdown explanation contains details",
    exceptionPolicy: "No waivers allowed",
    version: 1,
    status: "Approved"
  },
  {
    principleId: "cp-safe-01",
    name: "Safety Boundary Limits Safeguard",
    pillar: "Safety",
    rationale: "Safety thresholds can only expand via evolution proposals, never contract.",
    scope: "Evolution Engine, Governance Engine",
    enforcementRule: "Reject modifications that reduce margins.",
    severity: "Critical",
    verificationRequirement: "Verify new limit limits >= old limits",
    exceptionPolicy: "Requires Human Admin override key",
    version: 1,
    status: "Approved"
  }
];
