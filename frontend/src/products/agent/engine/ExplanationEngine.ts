import type { CandidatePlan } from "./AIPlanningEngine";
import type { FirstClassEvidence } from "./EvidenceCollector";

export interface TransparentReasoningExplanation {
  goalSummary: string;
  chosenPlanTitle: string;
  supportingEvidence: FirstClassEvidence[];
  rejectedAlternatives: { title: string; reason: string }[];
  conclusion: string;
}

export class ExplanationEngine {
  explainPlan(plans: CandidatePlan[], evidence: FirstClassEvidence[]): TransparentReasoningExplanation {
    const chosen = plans.find((p) => p.selected) || plans[0];
    const rejected = plans.filter((p) => !p.selected).map((p) => ({ title: p.title, reason: p.rejectionReason || "Lower confidence" }));

    return {
      goalSummary: "Reconcile undocumented Redis cache tier and deploy verified architecture to Staging",
      chosenPlanTitle: chosen.title,
      supportingEvidence: evidence,
      rejectedAlternatives: rejected,
      conclusion: "Plan 1 selected because it enforces parallel risk & policy validation while maintaining zero downtime.",
    };
  }
}
