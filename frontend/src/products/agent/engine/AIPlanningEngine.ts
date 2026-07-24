import type { StructuredEngineeringGoal } from "./GoalInterpreter";
import type { DAGStepNode } from "../../workflows/engine/DeclarativeWorkflow";

export interface CandidatePlan {
  id: string;
  title: string;
  selected: boolean;
  rejectionReason?: string;
  dagNodes: DAGStepNode[];
}

export class AIPlanningEngine {
  generateCandidatePlans(goal: StructuredEngineeringGoal): CandidatePlan[] {
    const chosenPlanNodes: DAGStepNode[] = [
      { id: "ai-step-1", name: "🔄 Living Arch: Extract Repo AST & Sync Redis Tier", category: "ACTION", productTarget: "LivingArch", dependencies: [], status: "PASSED" },
      { id: "ai-step-2", name: "🛡️ Govern: Validate Clean Architecture Compliance", category: "PARALLEL", productTarget: "Govern", dependencies: ["ai-step-1"], status: "PASSED" },
      { id: "ai-step-3", name: "🧪 Simulate: Run Capacity Impact Simulation", category: "PARALLEL", productTarget: "Simulate", dependencies: ["ai-step-1"], status: "PASSED" },
      { id: "ai-step-4", name: "👥 Human Lead Approval Verification Gate", category: "APPROVAL", dependencies: ["ai-step-2", "ai-step-3"], status: "WAITING_APPROVAL" },
      { id: "ai-step-5", name: "🚀 Deploy: Generate K8s Manifest & Deploy Staging", category: "ACTION", productTarget: "Deploy", dependencies: ["ai-step-4"], status: "PENDING" },
    ];

    return [
      {
        id: "plan-opt-1",
        title: "Optimal: Reconcile Living Arch ➔ Parallel Risk & Policy Check ➔ Staging Deploy",
        selected: true,
        dagNodes: chosenPlanNodes,
      },
      {
        id: "plan-opt-2",
        title: "Alternative B: Direct Staging Deploy (Bypass Policy & Risk Checks)",
        selected: false,
        rejectionReason: "Rejected due to high policy risk score (94% Clean Architecture violation potential).",
        dagNodes: [],
      },
    ];
  }
}
